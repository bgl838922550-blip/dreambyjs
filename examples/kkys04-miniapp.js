// @name 可可影视
// @version 0.1.0
// @description kkys04.com 小程序源适配器。用于分类海报墙、聚合搜索、详情线路解析。

const BASE_URL = "https://www.kkys04.com";
const SEARCH_TOKEN = "/8qLaxrdD/v7MRLMqVMDBQ==";
const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function getConfig() {
  return {
    name: "可可影视",
    version: "0.1.0",
    searchable: true,
    tabs: [
      { id: "movie", name: "电影", ext: { url: "/channel/1.html" } },
      { id: "series", name: "连续剧", ext: { url: "/channel/2.html" } },
      { id: "anime", name: "动漫", ext: { url: "/channel/3.html" } },
      { id: "show", name: "综艺纪录", ext: { url: "/channel/4.html" } },
      { id: "short", name: "短剧", ext: { url: "/channel/6.html" } },
      { id: "new", name: "今日更新", ext: { url: "/label/new.html" } }
    ]
  };
}

function getCards(ext) {
  ext = argsify(ext);
  const url = absolute(ext.url || "/");
  const html = requestPage(url);
  return { cards: parsePosterCards(html) };
}

function search(ext) {
  ext = argsify(ext);
  const keyword = String(ext.text || ext.query || ext.keyword || "").trim();
  if (!keyword) return { cards: [] };
  const url = BASE_URL + "/search?k=" + encodeURIComponent(keyword) + "&t=" + encodeURIComponent(SEARCH_TOKEN);
  return { cards: parseSearchCards(requestPage(url)) };
}

function getTracks(ext) {
  ext = argsify(ext);
  const pageURL = absolute(ext.url || ext.href || ext.id);
  const html = requestPage(pageURL);
  const groups = parseTrackGroups(html);
  return { groups: groups };
}

function getPlayinfo(ext) {
  ext = argsify(ext);
  const pageURL = absolute(ext.url || ext.href);
  const html = requestPage(pageURL);

  const direct = firstMatch(html, /(https?:\/\/[^"'<>\s]+?\.(?:m3u8|mp4)(?:\?[^"'<>\s]*)?)/i);
  if (direct) return { url: direct, headers: playbackHeaders(pageURL) };

  const source = firstMatch(html, /playSource\s*=\s*\{[\s\S]*?src\s*:\s*["']([^"']+)["']/i);
  if (source) return { url: absolute(source), headers: playbackHeaders(pageURL) };

  // 站点当前网页播放器里 playSource.src 为空，真实播放源可能由私有签名 API 或 App 端返回。
  // 这里返回页面地址作为可诊断 URL，便于上层展示错误来源；直放仍依赖后续解析到 m3u8/mp4。
  throw new Error("可可影视播放页未暴露直链，当前线路可能仅供 App 端观看");
}

function requestPage(url) {
  let cookie = String($cache.get("kkys04.cookie") || "");
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = Widget.http.get(url, { headers: defaultHeaders(url, cookie) });
    const html = String(res.data || "");
    if (!isCdndefend(html)) return html;
    cookie = solveCdndefendCookie(html);
    if (!cookie) throw new Error("cdndefend challenge parse failed");
    $cache.set("kkys04.cookie", cookie);
  }
  throw new Error("cdndefend challenge retry exceeded");
}

function isCdndefend(html) {
  return html.indexOf("cdndefend_js_cookie") >= 0 || html.indexOf("Protected by cdndefend") >= 0;
}

function solveCdndefendCookie(html) {
  const prefix = firstMatch(html, /const\s+a0_0x2a54\s*=\s*\[\s*['"]([A-Fa-f0-9]+)['"]/);
  if (!prefix) return "";
  const index = parseInt(prefix.charAt(0), 16);
  for (let i = 0; i < 10000000; i++) {
    const value = prefix + i;
    const digest = sha1Bytes(value);
    if (digest[index] === 0xb0 && digest[index + 1] === 0x0b) {
      return "cdndefend_js_cookie=" + value;
    }
  }
  return "";
}

function sha1Bytes(value) {
  const hex = CryptoJS.SHA1(String(value)).toString();
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

function parsePosterCards(html) {
  const cards = [];
  const blocks = matchAll(html, /<div[^>]*class=["'][^"']*module-item(?!-)[^"']*["'][\s\S]*?<\/a>\s*<\/div>/gi);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const href = firstMatch(block, /href=["']([^"']*\/detail\/\d+\.html)["']/i);
    const title = cleanText(firstMatch(block, /<div[^>]*class=["'][^"']*v-item-title[^"']*["'][^>]*>([\s\S]*?)<\/div>/i));
    if (!href || !title || title.indexOf("可可影视") >= 0) continue;
    cards.push({
      id: href,
      title: title,
      url: absolute(href),
      coverUrl: imageURL(firstMatch(block, /(?:data-original|src)=["']([^"']+)["']/i)),
      subTitle: cleanText(firstMatch(block, /<div[^>]*class=["'][^"']*v-item-bottom[^"']*["'][\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i)),
      ext: { url: absolute(href) }
    });
  }
  return uniqCards(cards);
}

function parseSearchCards(html) {
  const cards = [];
  const blocks = matchAll(html, /<a[^>]*class=["'][^"']*search-result-item[^"']*["'][\s\S]*?<\/a>/gi);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const href = firstMatch(block, /href=["']([^"']*\/detail\/\d+\.html)["']/i);
    const title = cleanText(firstMatch(block, /<div[^>]*class=["'][^"']*title[^"']*["'][^>]*>([\s\S]*?)<\/div>/i));
    if (!href || !title) continue;
    cards.push({
      id: href,
      title: title,
      url: absolute(href),
      coverUrl: imageURL(firstMatch(block, /(?:data-original|src)=["']([^"']+)["']/i)),
      subTitle: cleanText(firstMatch(block, /<div[^>]*class=["'][^"']*desc[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)),
      ext: { url: absolute(href) }
    });
  }
  return uniqCards(cards);
}

function parseTrackGroups(html) {
  const labels = matchAll(html, /<span[^>]*class=["'][^"']*source-item-label[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi).map(cleanText);
  const lists = matchAll(html, /<div[^>]*class=["'][^"']*episode-list(?!-)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi);
  const groups = [];
  for (let i = 0; i < lists.length; i++) {
    const links = matchAll(lists[i], /<a[^>]*class=["'][^"']*episode-item[^"']*["'][\s\S]*?<\/a>/gi);
    const tracks = [];
    for (let j = 0; j < links.length; j++) {
      const link = links[j];
      const href = firstMatch(link, /href=["']([^"']+)["']/i);
      if (!href) continue;
      tracks.push({
        name: cleanText(link) || ("第 " + (j + 1) + " 集"),
        url: absolute(href),
        ext: { url: absolute(href) }
      });
    }
    if (tracks.length) groups.push({ title: labels[i] || ("线路 " + (i + 1)), tracks: tracks });
  }
  return groups;
}

function defaultHeaders(url, cookie) {
  const headers = {
    "User-Agent": USER_AGENT,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": BASE_URL + "/"
  };
  if (cookie) headers.Cookie = cookie;
  return headers;
}

function playbackHeaders(pageURL) {
  return {
    "User-Agent": USER_AGENT,
    "Referer": pageURL,
    "Origin": ""
  };
}

function absolute(value) {
  value = String(value || "").trim();
  if (!value) return BASE_URL + "/";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf("//") === 0) return "https:" + value;
  if (value.charAt(0) !== "/") return BASE_URL + "/" + value;
  return BASE_URL + value;
}

function imageURL(value) {
  const url = absolute(value || "");
  return url === BASE_URL + "/" ? "" : url;
}

function firstMatch(text, regex) {
  const match = String(text || "").match(regex);
  return match && match[1] ? match[1] : "";
}

function matchAll(text, regex) {
  const values = [];
  let match;
  while ((match = regex.exec(String(text || ""))) !== null) {
    values.push(match[1] || match[0]);
  }
  return values;
}

function cleanText(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, function (_, code) { return String.fromCharCode(parseInt(code, 10)); })
    .replace(/\s+/g, " ")
    .trim();
}

function uniqCards(cards) {
  const seen = {};
  const result = [];
  for (let i = 0; i < cards.length; i++) {
    const id = cards[i].id;
    if (seen[id]) continue;
    seen[id] = true;
    result.push(cards[i]);
  }
  return result;
}
