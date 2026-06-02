// @name KKYS04 Mini Library

const BASE = 'https://www.kkys04.com';
const IMAGE_BASE = 'https://vres.rohshz.com';
const COOKIE_KEY = 'kkys04.cdndefend.cookie';
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function absolute(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.indexOf('//') === 0) return 'https:' + path;
  if (path.indexOf('/vod1/') === 0) return IMAGE_BASE + path;
  if (path[0] !== '/') return BASE + '/' + path;
  return BASE + path;
}

function requestURL(url, cookie) {
  const headers = {
    'User-Agent': UA,
    Referer: BASE + '/'
  };
  if (cookie) headers.Cookie = cookie;
  const result = Widget.http.get(url, {
    headers
  });
  return typeof result.data === 'string' ? result.data : JSON.stringify(result.data || {});
}

function fetchText(path) {
  const url = absolute(path);
  const cached = Widget.storage.get(COOKIE_KEY);
  const cachedCookie = typeof cached === 'string' ? cached : '';
  let html = requestURL(url, cachedCookie);
  let attempts = 0;
  while (isDefendPage(html) && attempts < 3) {
    const cookie = solveCdndefendCookie(html);
    if (!cookie) break;
    Widget.storage.set(COOKIE_KEY, cookie);
    html = requestURL(url, cookie);
    attempts += 1;
  }
  return html;
}

function fetchRaw(path) {
  const result = Widget.http.get(absolute(path), {
    headers: {
      'User-Agent': UA,
      Referer: BASE + '/'
    }
  });
  return typeof result.data === 'string' ? result.data : JSON.stringify(result.data || {});
}

function isDefendPage(html) {
  return /cdndefend_js_cookie|Protected by cdndefend/i.test(html || '');
}

function parseIntLiteral(value) {
  const text = String(value || '').trim();
  return /^0x/i.test(text) ? parseInt(text, 16) : parseInt(text, 10);
}

function hexToBytes(hex) {
  const bytes = [];
  for (let i = 0; i + 1 < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return bytes;
}

function sha1Hex(message) {
  function rotateLeft(value, bits) {
    return (value << bits) | (value >>> (32 - bits));
  }
  function toHex(value) {
    let text = '';
    for (let i = 7; i >= 0; i -= 1) {
      text += ((value >>> (i * 4)) & 0x0f).toString(16);
    }
    return text;
  }

  const bytes = [];
  for (let i = 0; i < message.length; i += 1) {
    const code = message.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }

  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const highLength = Math.floor(bitLength / 0x100000000);
  const lowLength = bitLength >>> 0;
  for (let i = 3; i >= 0; i -= 1) {
    bytes.push((highLength >>> (i * 8)) & 0xff);
  }
  for (let i = 3; i >= 0; i -= 1) {
    bytes.push((lowLength >>> (i * 8)) & 0xff);
  }

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = new Array(80);
    for (let i = 0; i < 16; i += 1) {
      const j = offset + i * 4;
      words[i] = ((bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]) >>> 0;
    }
    for (let i = 16; i < 80; i += 1) {
      words[i] = rotateLeft(words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16], 1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let i = 0; i < 80; i += 1) {
      let f;
      let k;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (rotateLeft(a, 5) + f + e + k + words[i]) >>> 0;
      e = d;
      d = c;
      c = rotateLeft(b, 30) >>> 0;
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }

  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4);
}

function solveCdndefendCookie(html) {
  const arrayMatch = /const\s+([A-Za-z_$][\w$]*)\s*=\s*\[([\s\S]*?)\];[\s\S]*?\}\(\1\s*,\s*(0x[0-9a-fA-F]+|\d+)\s*\)/.exec(html);
  if (!arrayMatch) return '';
  const hash =
    typeof $crypto !== 'undefined' && typeof $crypto.sha1 === 'function'
      ? value => $crypto.sha1(value)
      : sha1Hex;

  const values = [];
  const valuePattern = /['"]([^'"]*)['"]/g;
  let valueMatch;
  while ((valueMatch = valuePattern.exec(arrayMatch[2]))) {
    values.push(valueMatch[1]);
  }
  if (values.length < 3) return '';

  let rotate = parseIntLiteral(arrayMatch[3]) + 1;
  while (--rotate) {
    values.push(values.shift());
  }

  const cookiePrefix = values[0];
  const seed = values[2];
  const byteIndex = parseInt('0x' + seed[0]);
  for (let i = 0; i < 5000000; i += 1) {
    const digest = hexToBytes(hash(seed + i));
    if (digest[byteIndex] === 0xb0 && digest[byteIndex + 1] === 0x0b) {
      return cookiePrefix + seed + i;
    }
  }
  return '';
}

function stripTags(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

function firstMatch(html, pattern) {
  const match = pattern.exec(html);
  return match ? match[1] : '';
}

function attr(block, name) {
  const pattern = new RegExp(name + "\\s*=\\s*[\"']([^\"']*)[\"']", 'i');
  return firstMatch(block, pattern);
}

function pickImage(block) {
  const images = [];
  const pattern = /(?:data-original|data-src|src)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi;
  let match;
  while ((match = pattern.exec(block))) {
    images.push(match[1]);
  }
  return absolute(
    images.find(url => !/placeholder|logo|avatar|empty-box|icon/i.test(url)) || images[0] || ''
  );
}

function pickTitle(block) {
  const attrTitle = firstMatch(block, /(?:title|alt)=["']([^"']+)["']/i);
  if (attrTitle && !/可可影视|kekys/i.test(attrTitle)) return stripTags(attrTitle);

  const titlePattern = /<[^>]+class=["'][^"']*(?:v-item-title|carousel-item-title|search-result-title|\btitle\b)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/gi;
  let match;
  while ((match = titlePattern.exec(block))) {
    const tag = match[0].slice(0, match[0].indexOf('>') + 1);
    const text = stripTags(match[1]);
    if (!text || /display\s*:\s*none/i.test(tag) || /可可影视|kekys/i.test(text)) continue;
    return text;
  }

  return stripTags(firstMatch(block, /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)) || stripTags(block);
}

function parseRating(block) {
  const text = stripTags(
    firstMatch(block, /<[^>]+class=["'][^"']*(?:v-item-top-left|score|rating)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)
  );
  const match = /(\d+(?:\.\d+)?)/.exec(text);
  return match ? Number(match[1]) : undefined;
}

function parseRemarks(block) {
  return stripTags(
    firstMatch(block, /<[^>]+class=["'][^"']*(?:v-item-bottom|pic-text|remarks|score)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i) ||
      firstMatch(block, /<[^>]+class=["'][^"']*(?:carousel-item-tags|h-item-top-right)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)
  );
}

function parseCardTypeLabel(block, fallbackTitle) {
  const explicit = stripTags(
    firstMatch(block, /<[^>]+class=["'][^"']*search-result-item-header[^"']*["'][^>]*>\s*<[^>]+>([\s\S]*?)<\/[^>]+>/i)
  );
  if (explicit) return explicit;

  const text = [fallbackTitle || '', parseRemarks(block)].join(' ');
  if (/动漫|动画|番剧/.test(text)) return '动漫';
  if (/综艺|纪录/.test(text)) return '综艺纪录';
  if (/短剧/.test(text)) return '短剧';
  if (/连续剧|电视剧|剧集|国产剧|日韩剧|欧美剧|港台剧/.test(text)) return '剧集';
  if (/电影|影片|正片/.test(text)) return '电影';
  return '';
}

function mediaTypeFromLabel(label, block) {
  const text = [label || '', parseRemarks(block)].join(' ');
  if (/电影|影片|正片/i.test(label || '')) return 'movie';
  if (/动漫|动画|番剧|综艺|纪录|短剧|连续剧|电视剧|剧集|国产剧|日韩剧|欧美剧|港台剧/.test(text)) {
    return 'series';
  }
  if (/全\s*\d+\s*集|更新至|第\s*\d+\s*(?:集|期|话)|完结|连载/i.test(text)) return 'series';
  return 'movie';
}

function parseEpisodeNumber(text, fallback) {
  const value = String(text || '');
  const explicit = /(?:第\s*)?0*(\d+)\s*(?:集|话|期|回)|(?:^|[^a-z])e(?:p(?:isode)?)?\s*0*(\d+)/i.exec(value);
  if (explicit) return Number(explicit[1] || explicit[2]);
  return fallback;
}

function episodeIdFor(text, index) {
  const number = parseEpisodeNumber(text, index + 1);
  if (number && Number.isFinite(number)) return 'ep-' + number;
  const normalized = stripTags(text)
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
    .slice(0, 24);
  return normalized ? 'ep-' + normalized : 'ep-' + (index + 1);
}

function parseOverview(block) {
  return stripTags(
    firstMatch(block, /<[^>]+class=["'][^"']*(?:carousel-item-desc|desc|summary|intro)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)
  );
}

function parseCards(html, fallbackTitle) {
  const cards = [];
  const seen = {};
  const pattern = /<a\b[^>]+href=["']([^"']*\/detail\/\d+\.html[^"']*)["'][^>]*>[\s\S]*?<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const block = match[0];
    const id = absolute(match[1]).replace(BASE, '');
    if (seen[id]) continue;
    const title = pickTitle(block);
    if (!title) continue;
    const typeLabel = parseCardTypeLabel(block, fallbackTitle);
    seen[id] = true;
    cards.push({
      id,
      title,
      type: mediaTypeFromLabel(typeLabel, block),
      poster: pickImage(block),
      rating: parseRating(block),
      remarks: parseRemarks(block),
      badges: typeLabel ? [typeLabel] : [],
      action: { type: 'detail', itemId: id }
    });
  }
  return cards;
}

function parseCarousel(html) {
  const items = [];
  const seen = {};
  const pattern = /<a\b[^>]+href=["']([^"']*\/detail\/\d+\.html[^"']*)["'][^>]*class=["'][^"']*carousel-item[^"']*["'][^>]*>[\s\S]*?<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const block = match[0];
    const id = absolute(match[1]).replace(BASE, '');
    if (seen[id]) continue;
    const title = pickTitle(block);
    const image = pickImage(block);
    if (!title || !image) continue;
    seen[id] = true;
    items.push({
      id,
      title,
      type: 'movie',
      poster: image,
      backdrop: image,
      subtitle: parseRemarks(block),
      remarks: parseRemarks(block),
      overview: parseOverview(block),
      action: { type: 'detail', itemId: id }
    });
  }
  return items;
}

function parseTopicCards(html) {
  const cards = [];
  const seen = {};
  const pattern = /<a\b[^>]+href=["']([^"']*\/topic\/(?:detail|timeline)\/[^"']+\.html[^"']*)["'][^>]*>[\s\S]*?<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const block = match[0];
    const attrs = block.slice(0, block.indexOf('>') + 1);
    if (!/class=["'][^"']*h-item/i.test(attrs)) continue;
    const id = absolute(match[1]).replace(BASE, '');
    if (seen[id]) continue;
    const title = pickTitle(block);
    if (!title || /可可影视|kekys/i.test(title)) continue;
    const image = pickImage(block);
    seen[id] = true;
    cards.push({
      id,
      title,
      type: 'collection',
      poster: image,
      backdrop: image,
      remarks: parseRemarks(block),
      action: { type: 'category', pageId: id, title }
    });
  }
  return cards;
}

function parseHeaderTitle(block) {
  return stripTags(firstMatch(block, /<[^>]+class=["'][^"']*section-header-title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i));
}

function parseMoreAction(block, fallbackTitle) {
  const linkPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkPattern.exec(block))) {
    const attrs = match[1];
    const text = stripTags(match[2]);
    const href = attr(attrs, 'href');
    if (!href || href === '#' || /^javascript:/i.test(href)) continue;
    if (/section-header-more/.test(attrs) || /查看更多/.test(text)) {
      const pageId = absolute(href).replace(BASE, '');
      if (/\/topic\/detail\/\d+-\d+\.html/i.test(pageId)) {
        return fallbackMoreAction(fallbackTitle);
      }
      return { type: 'category', pageId, title: fallbackTitle };
    }
  }
  return fallbackMoreAction(fallbackTitle);
}

function fallbackMoreAction(title) {
  if (/专题/.test(title)) return { type: 'category', pageId: '/topic/home.html', title };
  if (/更新/.test(title)) return { type: 'category', pageId: '/label/new.html', title };
  if (/动漫/.test(title)) return { type: 'category', pageId: '/channel/3.html', title };
  if (/综艺|纪录/.test(title)) return { type: 'category', pageId: '/channel/4.html', title };
  if (/短剧/.test(title)) return { type: 'category', pageId: '/channel/6.html', title };
  if (/剧集|剧|日韩|欧美|港台|国产/.test(title)) return { type: 'category', pageId: '/channel/2.html', title };
  if (/电影|片/.test(title)) return { type: 'category', pageId: '/channel/1.html', title };
  return undefined;
}

function sectionStyle(title, items) {
  if (/专题|榜单|排行|Top/i.test(title) && items.some(item => item.type === 'collection')) {
    return 'discover.spotlight';
  }
  if (/排行|榜单|TOP|Top/i.test(title)) return 'discover.ranked';
  return 'discover.posterCompact';
}

function sectionId(title, index) {
  const text = title || 'section-' + index;
  return (
    'kk-' +
    index +
    '-' +
    text
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
      .slice(0, 24)
  );
}

function parseHomeSections(html) {
  const headers = [];
  const headerPattern = /<[^>]+class=["'][^"']*section-header-title[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi;
  let match;
  while ((match = headerPattern.exec(html))) {
    const blockStart = html.lastIndexOf('<div class="section-box', match.index);
    headers.push({
      index: blockStart >= 0 ? blockStart : match.index,
      title: parseHeaderTitle(match[0])
    });
  }

  const sections = [];
  headers.forEach((header, index) => {
    const nextIndex = index + 1 < headers.length ? headers[index + 1].index : html.length;
    const block = html.slice(header.index, nextIndex);
    const title = header.title || '推荐';
    const topicItems = parseTopicCards(block);
    const mediaItems = parseCards(block, title);
    const items = topicItems.length ? topicItems : mediaItems;
    if (!items.length) return;
    sections.push({
      id: sectionId(title, index + 1),
      title,
      style: sectionStyle(title, items),
      moreAction: parseMoreAction(block, title),
      items
    });
  });
  return sections;
}

function shortcutItem(pageId, title, subtitle) {
  return {
    id: pageId,
    title,
    subtitle,
    type: 'collection',
    action: { type: 'category', pageId, title }
  };
}

function homeShortcuts() {
  return [
    shortcutItem('/channel/1.html', '电影', '院线与网络电影'),
    shortcutItem('/channel/2.html', '连续剧', '国产剧 / 日韩剧 / 欧美剧 / 港台剧'),
    shortcutItem('/channel/3.html', '动漫', '动画与番剧'),
    shortcutItem('/channel/4.html', '综艺纪录', '综艺 / 纪录片'),
    shortcutItem('/channel/6.html', '短剧', '短剧片库'),
    shortcutItem('/label/new.html', '今日更新', '最新入库'),
    shortcutItem('/topic/home.html', '推荐专题', '站点专题合集'),
    shortcutItem('/ranking/index.html', '排行榜', '热门排行')
  ];
}

function getManifest() {
  return {
    id: 'kkys04',
    name: '可可影视',
    version: '1.0.0',
    capabilities: {
      search: true,
      aggregation: true,
      playbackHistory: true
    }
  };
}

function getHome() {
  const html = fetchText('/');
  const hero = parseCarousel(html);
  const sections = parseHomeSections(html);
  const items = parseCards(html, '最新片库');
  const finalSections = sections.slice();
  if (!sections.length && items.length) {
    finalSections.push({
      id: 'poster',
      title: '最新片库',
      style: 'media.posterGrid',
      items: items.slice(0, 36)
    });
  }
  return {
    pageType: 'home',
    title: '可可影视',
    hero,
    sections: finalSections
  };
}

function getCategory(ext) {
  const pageId = ext.pageId || ext.id || '/';
  const page = Number(ext.page || 1);
  const url = pageId === '/' ? '/' : pageId.replace(/\.html$/, '') + (page > 1 ? '-' + page : '') + '.html';
  const html = fetchText(url);
  const sections = parseHomeSections(html);
  const topicItems = parseTopicCards(html);
  const mediaItems = parseCards(html, ext.title || '分类');
  const items = mediaItems.length ? mediaItems : topicItems;
  return {
    pageType: 'category',
    id: pageId,
    title: ext.title || '分类',
    style: topicItems.length && !mediaItems.length ? 'discover.spotlight' : 'media.posterGrid',
    sections,
    items,
    page,
    hasMore: /下一页|next/i.test(html)
  };
}

function getDetail(ext) {
  const itemId = ext.itemId || ext.id || '';
  const html = fetchText(itemId);
  const seasons = parseSeasons(html, itemId);
  const detailTitleBlock = firstMatch(html, /<div[^>]+class=["'][^"']*detail-title[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const strongTexts = [];
  const strongPattern = /<strong[^>]*>([\s\S]*?)<\/strong>/gi;
  let strongMatch;
  while ((strongMatch = strongPattern.exec(detailTitleBlock))) {
    const text = stripTags(strongMatch[1]);
    if (text) strongTexts.push(text);
  }
  const visibleTitle =
    strongTexts.length >= 3
      ? strongTexts[Math.floor(strongTexts.length / 2)]
      : strongTexts.find(text => !/[.。]|kkys|kekys|com|可可影视/i.test(text));
  const title =
    visibleTitle ||
    firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    firstMatch(html, /<title>([^<]+)<\/title>/i) ||
    itemId;
  const posterBlock = firstMatch(html, /<div[^>]+class=["'][^"']*detail-pic[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const poster = pickImage(posterBlock || html);
  const overview = stripTags(
    firstMatch(html, /<div[^>]*class=["'][^"']*detail-desc[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
    firstMatch(html, /<span[^>]*class=["'][^"']*detail-content[^"']*["'][^>]*>([\s\S]*?)<\/span>/i) ||
    firstMatch(html, /简介<\/[^>]+>\s*<[^>]+>([\s\S]*?)<\/[^>]+>/i)
  );
  return {
    id: itemId,
    title: stripTags(title).replace(/在线观看.*$/, ''),
    type: seasons.length || /电视剧|连续剧|剧集|国产剧|日韩剧|欧美剧|港台剧|短剧|动漫/.test(html) ? 'series' : 'movie',
    poster,
    backdrop: poster,
    overview,
    year: Number(firstMatch(html, /年份[^0-9]*(\d{4})/i)) || undefined,
    genres: (firstMatch(html, /类型[^<]*<\/[^>]+>\s*<[^>]+>([\s\S]*?)<\/[^>]+>/i) || '')
      .split(/[\/,\s]+/)
      .filter(Boolean),
    seasons,
    resourceGroups: parsePlayGroups(html, itemId),
    recommendations: [
      {
        id: 'related',
        title: '相关推荐',
        style: 'discover.posterCompact',
        items: parseCards(html, '相关推荐').filter(item => item.id !== itemId).slice(0, 12)
      }
    ]
  };
}

function parsePlaySources(html) {
  const sources = [];
  const sourcePattern = /<a[^>]+class=["'][^"']*source-item[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
  let sourceMatch;
  while ((sourceMatch = sourcePattern.exec(html))) {
    sources.push({
      title: stripTags(firstMatch(sourceMatch[1], /<span[^>]+class=["'][^"']*source-item-label[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)) || '线路',
      subtitle: stripTags(firstMatch(sourceMatch[1], /<span[^>]+class=["'][^"']*source-item-sublabel[^"']*["'][^>]*>([\s\S]*?)<\/span>/i))
    });
  }
  return sources;
}

function parseEpisodeLists(html) {
  const lists = [];
  const listPattern = /<div[^>]+class=["'][^"']*episode-list[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
  let listMatch;
  while ((listMatch = listPattern.exec(html))) {
    const block = listMatch[1];
    const links = [];
    const linkPattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let linkMatch;
    while ((linkMatch = linkPattern.exec(block))) {
      const index = links.length;
      const name = stripTags(linkMatch[2]) || '线路';
      const href = absolute(linkMatch[1]);
      links.push({
        id: episodeIdFor(name, index),
        number: parseEpisodeNumber(name, index + 1),
        title: name,
        href
      });
    }
    if (links.length) lists.push(links);
  }
  return lists;
}

function parseSeasons(html, itemId) {
  const primaryList = parseEpisodeLists(html).find(list => list.length > 1);
  if (!primaryList) return [];
  const seen = {};
  const episodes = [];
  primaryList.forEach((episode, index) => {
    if (seen[episode.id]) return;
    seen[episode.id] = true;
    episodes.push({
      id: episode.id,
      title: episode.title || '第 ' + (index + 1) + ' 集',
      index: episode.number || index + 1,
      episodeNumber: episode.number || index + 1,
      seasonNumber: 1,
      action: { type: 'play', itemId, episodeId: episode.id }
    });
  });
  return episodes.length
    ? [{ id: 'season-1', title: '第 1 季', index: 1, seasonNumber: 1, episodes }]
    : [];
}

function parsePlayGroups(html, itemId, episodeId) {
  const groups = [];
  const sources = parsePlaySources(html);
  const lists = parseEpisodeLists(html);
  for (let groupIndex = 0; groupIndex < lists.length; groupIndex += 1) {
    const source = sources[groupIndex] || {};
    const versions = [];
    const links = lists[groupIndex];
    for (let index = 0; index < links.length; index += 1) {
      const link = links[index];
      if (episodeId && link.id !== episodeId && link.href !== episodeId) continue;
      versions.push({
        id: link.href,
        name: episodeId ? (source.title || '播放') : link.title,
        subtitle: episodeId ? link.title : source.subtitle || '',
        action: { type: 'play', itemId, episodeId: link.id, versionId: link.href, url: link.href }
      });
    }
    if (versions.length) {
      groups.push({ id: 'line-' + (groupIndex + 1), title: source.title || '线路 ' + (groupIndex + 1), versions });
    }
  }
  return groups;
}

function getResourceVersions(ext) {
  const itemId = ext.itemId || ext.id || '';
  const html = fetchText(itemId);
  return parsePlayGroups(html, itemId, ext.episodeId || '');
}

function resolvePlayback(ext) {
  const pageUrl = ext.url || ext.versionId || '';
  const html = fetchText(pageUrl);
  const playSource = /const\s+playSource\s*=\s*\{\s*src:\s*["']([^"']*)["']\s*,\s*type:\s*["']([^"']*)["']/i.exec(html);
  if (playSource) {
    const url = playSource[1];
    if (!url) {
      throw new Error('该线路仅 App 端观看或网页端未公开播放地址，请切换其他线路');
    }
    return {
      url: absolute(url),
      container: /mpegURL|m3u8/i.test(playSource[2] + ' ' + url) ? 'm3u8' : '',
      headers: { Referer: pageUrl, 'User-Agent': UA }
    };
  }

  const playerJSON = firstMatch(html, /player_aaaa\s*=\s*(\{[\s\S]*?\})\s*</i);
  if (playerJSON) {
    try {
      const player = JSON.parse(playerJSON);
      const url = player.url || player.playUrl || '';
      if (url) {
        return {
          url: absolute(url),
          container: /\.m3u8(?:$|\?)/i.test(url) ? 'm3u8' : '',
          headers: { Referer: pageUrl }
        };
      }
    } catch (error) {
      print('player json parse failed: ' + error.message);
    }
  }

  const direct = firstMatch(html, /(https?:\/\/[^"']+\.(?:m3u8|mp4)[^"']*)/i);
  if (direct) {
    return { url: direct, headers: { Referer: pageUrl } };
  }

  if (/安装APP|仅\s*App|仅\s*APP|更多高清影片专线/i.test(html)) {
    throw new Error('该线路仅 App 端观看或网页端未公开播放地址，请切换其他线路');
  }

  throw new Error('没有解析到播放地址');
}

function search(ext) {
  const query = encodeURIComponent(ext.query || ext.text || ext.keyword || '');
  const home = fetchText('/');
  const token = firstMatch(home, /name=["']t["']\s+value=["']([^"']+)["']/i);
  const html = fetchText('/search?k=' + query + (token ? '&t=' + encodeURIComponent(token) : ''));
  return {
    pageType: 'search',
    title: '搜索结果',
    items: parseCards(html, '搜索结果')
  };
}

function onSearch(ext) {
  return search(ext);
}
