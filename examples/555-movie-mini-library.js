// @name 555电影
// Site adaptation only: baiPlay owns playback, history and native navigation.
const FIVE_BASE = 'https://www.1737k.com';
const FIVE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const FIVE_ICON = '/upload/mxprocms/20260320-1/d9073f4e5f732f0a865504e86a210b27.png';
const FIVE_CHANNELS = [{ id: '1', title: '电影' }, { id: '2', title: '剧集' }, { id: '3', title: '动漫' }, { id: '4', title: '综艺' }, { id: '45', title: '短剧' }];
const FIVE_SHOW_FIELDS = ['id', 'area', 'by', 'class', 'lang', 'letter', 'page', 'version', 'state', 'actor', 'director', 'year'];
const FIVE_CACHE = Object.create(null);
const WidgetMetadata = {
  id: '555-movie-mini-library', name: '555电影', title: '555电影', version: '1.1.3',
  author: 'baiPlay', site: FIVE_BASE, logo: FIVE_BASE + FIVE_ICON, icon: FIVE_BASE + FIVE_ICON,
  description: '555电影首页、频道、搜索、TMDB资源匹配、多线路选集与直连播放；完整分类和搜索可能需要站点验证。'
};

function getManifest() {
  return Object.assign({}, WidgetMetadata, {
    capabilities: { home: true, category: true, detail: true, search: true, resourceVersions: true, playback: true, playbackHistory: true, resourceMatching: true, resourceMatch: { enabled: true, parameters: ['title', 'originalTitle', 'alternativeTitles', 'year', 'mediaType', 'seasonNumber', 'episodeNumber', 'seasonYear'] } },
    aggregation: { search: true, playbackHistory: true, resourceMatching: true },
    parameters: [{ name: 'baseURL', title: '站点地址', type: 'input', value: FIVE_BASE, defaultValue: FIVE_BASE, description: '填写 HTTP/HTTPS 首页地址；域名变更后在此修改，留空使用默认站点。' }]
  });
}

async function getHome(ctx) {
  const cfg = config(ctx);
  return cached(cfg, 'home', 60, async function () {
    const root = parseHTML(await request(cfg, '/'));
    const sections = parseSections(root, cfg);
    if (!sections.length) throw new Error('555电影首页结构已变化，请稍后重试或更新脚本');
    sections.unshift({
      id: '555-channels', title: '频道', style: 'discover.annualPosterStack',
      items: FIVE_CHANNELS.map(function (c) {
        const section = sections.find(function (s) { return s.channelId === c.id; });
        return { id: '555-channel:' + c.id, title: c.title, type: 'category', previewItems: section ? section.items.slice(0, 3) : [], action: { type: 'category', pageId: '555-channel:' + c.id, title: c.title } };
      })
    });
    return { pageType: 'home', id: '555-home', title: '555电影', heroAspectRatio: '16:9', hero: parseHero(root, cfg), sections: sections };
  });
}

async function getHomeSection(ctx) {
  const args = object(ctx);
  const id = str(args.sectionId || args.id || '555-section:0');
  try {
    const home = await getHome(ctx);
    const section = home.sections.find(function (s) { return s.id === id; });
    if (section) return Object.assign({}, section, { lazy: false });
  } catch (_) {
    return { id: id, title: args.title || '555电影', subtitle: '栏目加载失败，请重试', style: 'discover.posterCompact', items: [], lazy: false };
  }
  return { id: id, title: args.title || '555电影', style: 'discover.posterCompact', items: [], lazy: false };
}

async function getCategory(ctx) {
  const args = object(ctx), cfg = config(args), page = positive(args.page, 1);
  const pageId = str(args.pageId || args.id || '555-channel:1');
  const channelMatch = /^555-channel:(\d+)$/.exec(pageId);
  if (channelMatch) {
    const channel = FIVE_CHANNELS.find(function (c) { return c.id === channelMatch[1]; });
    if (!channel) throw new Error('无效的555电影频道');
    if (page > 1) return listPage(pageId, channel.title, [], page, false);
    const root = parseHTML(await request(cfg, '/vod/type/id/' + channel.id + '.html'));
    const sections = parseSections(root, cfg);
    const entries = [{ id: '555-all:' + channel.id, title: '全部' + channel.title, type: 'category', action: listAction('/vod/show/id/' + channel.id + '.html', '全部' + channel.title) }];
    const seenPaths = Object.create(null);
    // Only publish real, simple subcategory links found on this channel page.
    all(root, function (n) { return n.tag === 'a' && /^\/vod\/show\/id\/\d+\.html$/.test(localPath(n.attrs.href, cfg)); }).forEach(function (a) {
      const path = localPath(a.attrs.href, cfg), title = nodeText(a);
      if (path === '/vod/show/id/' + channel.id + '.html' || seenPaths[path] || !title || title.length > 12) return;
      seenPaths[path] = true;
      entries.push({ id: path, title: title, type: 'category', action: listAction(path, title) });
    });
    const items = unique(sections.reduce(function (out, s) { return out.concat(s.items); }, []));
    if (!items.length) throw new Error('555电影频道暂时没有可读取的内容');
    return listPage(pageId, channel.title + '推荐', entries.concat(items), 1, false);
  }
  if (!pageId.startsWith('555-list:')) throw new Error('无效的555电影分类');
  let path;
  try { path = decodeURIComponent(pageId.slice(9)); } catch (_) { throw new Error('无效的分类路径'); }
  path = listPath(path);
  return loadList(cfg, cacheRead(cfg, 'next:' + pageId + ':' + page) || pagedPath(path, page), pageId, args.title || '555电影片库', page);
}

async function search(ctx) {
  const args = object(ctx), cfg = config(args), page = positive(args.page, 1);
  const query = str(args.query || args.keyword || args.text).trim().slice(0, 100);
  const id = '555-search:' + encodeURIComponent(query);
  if (!query) return Object.assign(listPage(id, '搜索555电影', [], page, false), { pageType: 'search', keyword: query });
  const path = '/vod/search/wd/' + encodeURIComponent(query).replace(/\./g, '%2E') + '.html';
  const result = await loadList(cfg, cacheRead(cfg, 'next:' + id + ':' + page) || pagedPath(path, page), id, '搜索 ' + query, page);
  return Object.assign(result, { pageType: 'search', keyword: query });
}

// TMDB matching uses the public suggestion API, never the captcha-protected HTML search.
async function matchResources(ctx) {
  const args = object(ctx), cfg = config(args), titles = matchTitles(args);
  const kind = str(args.mediaType || args.type).toLowerCase();
  const seasonValue = args.seasonNumber != null ? args.seasonNumber : args.season;
  const episodeValue = args.episodeNumber != null ? args.episodeNumber : args.episode;
  const isSeries = /^(tv|series|season|episode)$/.test(kind) || seasonValue != null || episodeValue != null;
  const season = positive(seasonValue, 1), episode = positive(episodeValue, 0);
  if (!titles.length || (kind && !/^(movie|tv|series|season|episode)$/.test(kind))) return { results: [] };
  if (isSeries && ((seasonValue != null && !positive(seasonValue, 0)) || (episodeValue != null && !positive(episodeValue, 0)))) return { results: [] };
  const year = positive(isSeries ? args.seasonYear || args.targetSeasonYear || (season === 1 ? args.seriesYear || args.year || args.releaseYear : 0) : args.year || args.releaseYear, 0);
  const seen = Object.create(null), results = [];
  let detailCount = 0;
  for (let q = 0; q < Math.min(titles.length, 3); q++) {
    const list = await cached(cfg, 'suggest:' + titles[q], 90, async function () {
      const text = await request(cfg, '/index.php/ajax/suggest?mid=1&wd=' + encodeURIComponent(titles[q]) + '&limit=20', { allowVerification: false });
      let data;
      try { data = JSON.parse(text); } catch (_) { throw new Error('555电影资源查询未返回有效数据，请稍后重试'); }
      if (!data || Number(data.code) !== 1 || !Array.isArray(data.list)) throw new Error('555电影资源查询暂时不可用，请稍后重试');
      return data.list.slice(0, 20);
    });
    for (let i = 0; i < list.length && detailCount < 6 && results.length < 3; i++) {
      const candidate = object(list[i]);
      if (!matchesTitle(candidate.name, titles, isSeries, season)) continue;
      const id = publicResourceID(candidate.id);
      if (!id || seen[id]) continue;
      seen[id] = true;
      detailCount++;
      let data;
      try { data = await loadDetail(cfg, id, { allowVerification: false }); } catch (_) { continue; }
      const detail = data.detail;
      if (detail.type !== (isSeries ? 'series' : 'movie') || !matchesTitle(detail.title, titles, isSeries, season)) continue;
      if (year && detail.year && year !== detail.year) continue;
      let episodeId = 'movie';
      if (isSeries) {
        const sourceSeason = detail.seasons[0];
        if (!sourceSeason || sourceSeason.seasonNumber !== season) continue;
        // A series-level request needs real numbered episodes; never guess by a line's nid.
        const target = sourceSeason.episodes.find(function (e) { return episode ? e.episodeNumber === episode : !!e.episodeNumber; });
        if (!target) continue;
        episodeId = target.id;
      }
      const groups = resourceGroups(data, episodeId);
      if (!groups.length) continue;
      results.push({ id: id, title: detail.title, type: detail.type, year: detail.year, poster: detail.poster, action: { type: 'detail', itemId: id }, detail: detail, resourceGroups: groups });
    }
    if (results.length || detailCount >= 6) break;
  }
  return { results: results };
}

function matchTitles(args) {
  const values = [args.title, args.name].concat(args.searchTitles || [], args.titles || [], args.originalTitle || [], args.originalName || [], args.alternativeTitles || []);
  const seen = Object.create(null), result = [];
  values.forEach(function (value) {
    if (typeof value !== 'string') return;
    const title = value.trim().slice(0, 100), key = normalizedMatchTitle(title);
    if (!key || seen[key]) return;
    seen[key] = true;
    result.push(title);
  });
  return result.slice(0, 12);
}
function seasonIdentity(title) {
  const text = str(title).normalize('NFKC');
  const match = /第\s*([一二三四五六七八九十百零〇两\d]+)\s*季|\b(?:season\s*|s)(\d{1,2})\b/i.exec(text);
  if (!match) return { number: 0, title: text };
  let number = Number(match[1] || match[2]);
  if (!Number.isFinite(number)) {
    const digits = '零一二三四五六七八九', chinese = match[1].replace(/两/g, '二').replace(/〇/g, '零');
    let total = 0, digit = 0;
    for (let i = 0; i < chinese.length; i++) {
      if (chinese[i] === '十' || chinese[i] === '百') { total += (digit || 1) * (chinese[i] === '十' ? 10 : 100); digit = 0; }
      else digit = digits.indexOf(chinese[i]);
    }
    number = total + digit;
  }
  return { number: number > 0 && number < 10000 ? number : -1, title: text.slice(0, match.index) + text.slice(match.index + match[0].length) };
}
function normalizedMatchTitle(value) {
  return entities(str(value)).normalize('NFKC').toLowerCase()
    .replace(/[（(\[]\s*(?:19|20)\d{2}\s*[）)\]]/g, '')
    .replace(/(?:[（(\[]\s*)?(?:普通话|国语|粤语|英语|日语|韩语)(?:版|配音版)(?:\s*[）)\]])?\s*$/g, '')
    .replace(/[\s\u3000\u200B-\u200D!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~，。！？：；、“”‘’（）《》【】·…—]/g, '');
}
function matchesTitle(value, titles, isSeries, season) {
  if (typeof value !== 'string' || /解说|预告|花絮|幕后特辑/.test(value)) return false;
  const identity = seasonIdentity(value);
  if (isSeries && (identity.number ? identity.number !== season : season !== 1)) return false;
  const title = normalizedMatchTitle(isSeries ? identity.title : value);
  return !!title && titles.some(function (target) { return title === normalizedMatchTitle(isSeries ? seasonIdentity(target).title : target); });
}
function publicResourceID(value) {
  // Current site's public alphaID: verified against 200 vod_id/detail_link pairs.
  // Numeric IDs themselves are not detail URLs; padding adds 62**5 before encoding.
  if (!/^[1-9]\d{0,9}$/.test(str(value))) return '';
  const alphabet = '4QTbdjy58CJNt3EYaXwx27SKVOekzILZ6GMRlsuADWfo09HgmBUipv1PqrFchn';
  let number = Number(value) + 916132832, result = '';
  while (number > 0) { result = alphabet[number % 62] + result; number = Math.floor(number / 62); }
  return result;
}

async function loadList(cfg, path, id, title, page) {
  const root = parseHTML(await request(cfg, path));
  const items = parseCards(root, cfg);
  const next = all(root, function (n) { return n.tag === 'a'; }).map(function (a) {
    const href = localPath(a.attrs.href, cfg);
    return href && sameListPage(path, href, page + 1) ? href : '';
  }).find(Boolean);
  if (next) cacheWrite(cfg, 'next:' + id + ':' + (page + 1), next, 300);
  if (!items.length && !/没有|暂无|未找到|抱歉|无相关|搜索结果|共\s*0\s*条/.test(nodeText(root))) {
    throw new Error('555电影列表结构已变化，请稍后重试或更新脚本');
  }
  return listPage(id, title, items, page, !!next);
}

async function getDetail(ctx) {
  const args = object(ctx), cfg = config(args), id = itemID(args.itemId || args.id);
  return (await loadDetail(cfg, id)).detail;
}

async function loadDetail(cfg, id, options) {
  return cached(cfg, 'detail:' + id, 90, async function () {
    const root = parseHTML(await request(cfg, '/vod/detail/id/' + id + '.html', options));
    const heading = first(root, function (n) { return n.tag === 'h1'; });
    const title = nodeText(heading);
    if (!title) throw new Error('555电影详情暂时不可用，请返回重试');
    const tabRoot = first(root, function (n) { return n.attrs.id === 'y-playList'; });
    const tabs = all(tabRoot || root, function (n) { return hasClass(n, 'module-tab-item'); });
    const panels = all(root, function (n) { return hasClass(n, 'module-play-list'); });
    const lines = [];
    panels.forEach(function (panel, index) {
      const entries = all(panel, function (n) { return n.tag === 'a' && hasClass(n, 'module-play-list-link'); }).map(function (a) {
        const path = localPath(a.attrs.href, cfg), match = playPath(path);
        if (!match) return null;
        return { path: path, sourceId: match[1], sid: match[2], nid: match[3], title: nodeText(a) || '正片' };
      }).filter(Boolean);
      if (!entries.length) return;
      const tab = tabs[index];
      const name = tab && (tab.attrs['data-dropdown-value'] || nodeText(first(tab, function (n) { return n.tag === 'span'; }))) || '线路 ' + entries[0].sid;
      lines.push({ id: entries[0].sid, name: name, entries: entries });
    });
    const tags = all(root, function (n) { return hasClass(n, 'module-info-tag-link'); });
    const tagLinks = tags.reduce(function (out, n) { return out.concat(all(n, function (a) { return a.tag === 'a'; })); }, []);
    const tagText = tagLinks.map(nodeText);
    const typeIDs = tagLinks.map(function (a) { return (localPath(a.attrs.href, cfg).match(/\/id\/(\d+)/) || [])[1]; });
    let isSeries = typeIDs.some(function (id) { return categoryType(id) === 'series'; });
    if (!isSeries && !typeIDs.some(function (id) { return categoryType(id) === 'movie'; })) {
      isSeries = lines.some(function (l) { return l.entries.some(function (e) { return /第.+[集期话話]|^EP?\s*\d+|^\d{1,4}$/i.test(e.title); }); });
    }
    const episodes = [], episodesById = Object.create(null);
    lines.forEach(function (line) {
      line.entries.forEach(function (e) {
        const identity = episodeIdentity(e.title);
        e.episodeId = isSeries ? identity.id : 'movie';
        if (!isSeries || episodesById[e.episodeId]) return;
        const episode = { id: e.episodeId, title: e.title, action: { type: 'play', itemId: id, seasonId: 's1', episodeId: e.episodeId } };
        if (identity.number) episode.episodeNumber = identity.number;
        episodesById[e.episodeId] = episode;
        episodes.push(episode);
      });
    });
    episodes.sort(function (a, b) { return (a.episodeNumber || 100000000) - (b.episodeNumber || 100000000); });
    const posterRoot = first(root, function (n) { return hasClass(n, 'module-info-poster'); });
    const poster = imageURL(first(posterRoot, function (n) { return n.tag === 'img'; }), cfg);
    const info = all(root, function (n) { return hasClass(n, 'module-info-item'); });
    const cast = [], directors = [];
    info.forEach(function (n) {
      const label = nodeText(first(n, function (a) { return hasClass(a, 'module-info-item-title'); }));
      const names = all(n, function (a) { return a.tag === 'a'; }).map(nodeText).filter(Boolean);
      if (/主演|演员/.test(label)) names.forEach(function (name) { cast.push({ name: name }); });
      if (/导演/.test(label)) directors.push.apply(directors, names);
    });
    const detail = {
      pageType: 'detail', id: id, title: title, type: isSeries ? 'series' : 'movie', poster: poster,
      detailImageAspectRatio: '2:3', prefersPosterAsDetailBackdropOnPhone: true,
      overview: nodeText(first(root, function (n) { return hasClass(n, 'module-info-introduction-content'); })),
      genres: tagText.filter(function (t, i) { return /\/class\//.test(localPath(tagLinks[i].attrs.href, cfg)); }),
      cast: cast,
      facts: directors.length ? [{ title: '导演', value: directors.join(' / ') }] : [],
      seasons: isSeries ? [{ id: 's1', title: '选集', seasonNumber: seasonIdentity(title).number || 1, episodes: episodes }] : [],
      recommendations: [{ id: '555-related', title: '相关推荐', style: 'discover.posterCompact', items: parseCards(root, cfg).filter(function (c) { return c.id !== id; }).slice(0, 18) }]
    };
    const year = tagText.find(function (t) { return /^(19|20)\d{2}$/.test(t); });
    if (year) detail.year = Number(year);
    if (!isSeries) detail.resourceGroups = resourceGroups({ detail: detail, lines: lines }, 'movie');
    return { detail: detail, lines: lines };
  });
}

async function getResourceVersions(ctx) {
  const args = object(ctx), cfg = config(args), id = itemID(args.itemId || args.id);
  const data = await loadDetail(cfg, id);
  const episodeId = str(args.episodeId) || (data.detail.seasons[0] && data.detail.seasons[0].episodes[0] && data.detail.seasons[0].episodes[0].id) || 'movie';
  return { itemId: id, seasonId: data.detail.type === 'series' ? 's1' : undefined, episodeId: episodeId, groups: resourceGroups(data, episodeId) };
}

function resourceGroups(data, episodeId) {
  const versions = [];
  data.lines.forEach(function (line) {
    line.entries.filter(function (e) { return e.episodeId === episodeId; }).forEach(function (e) {
      const versionId = '555-play:' + e.path;
      versions.push({ id: versionId, name: line.name, subtitle: e.title, action: { type: 'play', itemId: data.detail.id, seasonId: data.detail.type === 'series' ? 's1' : undefined, episodeId: episodeId, versionId: versionId } });
    });
  });
  return versions.length ? [{ id: '555-lines', title: '播放线路', versions: versions }] : [];
}

async function resolvePlayback(ctx) {
  const args = object(ctx), cfg = config(args);
  let versionId = str(args.versionId);
  if (!versionId) {
    const result = await getResourceVersions(args);
    const version = result.groups[0] && result.groups[0].versions[0];
    if (!version) throw new Error('当前剧集没有可用线路，请重新选集');
    versionId = version.id;
  }
  const path = versionId.replace(/^555-play:/, '');
  if (!versionId.startsWith('555-play:') || !playPath(path)) throw new Error('无效的555电影播放线路，请重新选集');
  // Never cache signed media URLs: refresh the source page on every playback attempt.
  const html = await request(cfg, path);
  const player = playerJSON(html);
  let value = str(player.url), encryption = Number(player.encrypt || 0);
  if (encryption === 2) value = decodeBase64(value);
  if (encryption === 1 || encryption === 2) value = unescapeURL(value);
  if (encryption !== 0 && encryption !== 1 && encryption !== 2) throw new Error('此线路编码暂不支持，请切换线路');
  value = entities(value).trim();
  if (value.startsWith('//')) value = 'https:' + value;
  if (!/^https?:\/\/[^\s<>"\\]+$/i.test(value)) throw new Error('此线路未提供有效的直连资源，请切换线路');
  const mediaPath = value.split(/[?#]/)[0];
  const extension = (mediaPath.match(/\.(m3u8|mp4|m4v|mov|mkv|webm)$/i) || [])[1];
  if (!extension) throw new Error('此线路未提供直连资源，请切换线路');
  return { url: value, container: extension.toLowerCase(), headers: { 'User-Agent': FIVE_UA }, isLive: false, streamKind: 'vod' };
}

function parseSections(root, cfg) {
  const sections = [];
  all(root, function (n) { return hasClass(n, 'module'); }).forEach(function (module) {
    const heading = first(module, function (n) { return hasClass(n, 'module-title'); });
    if (!heading) return;
    const panels = all(module, function (n) { return hasClass(n, 'module-main'); });
    const panel = panels.find(function (n) { return hasClass(n, 'active'); }) || panels[0] || module;
    const items = parseCards(panel, cfg);
    if (!items.length) return;
    const link = first(heading, function (n) { return n.tag === 'a'; });
    const categoryId = (localPath(link && link.attrs.href, cfg).match(/\/(?:type|show)\/id\/(\d+)(?:\/|\.html)/) || [])[1];
    const channelType = categoryType(categoryId);
    if (channelType) items.forEach(function (item) { item.type = channelType; });
    const title = nodeText(heading);
    const section = { id: '555-section:' + sections.length, title: title, style: /排行|热播/.test(title) ? 'discover.rankedPosterCompact' : 'discover.posterCompact', itemAspectRatio: '2:3', items: items.slice(0, 24), channelId: categoryId, lazy: false };
    if (categoryId) section.moreAction = listAction('/vod/show/id/' + categoryId + '.html', title);
    sections.push(section);
  });
  return sections;
}

function parseHero(root, cfg) {
  const banner = first(root, function (n) { return hasClass(n, 'swiper-big'); });
  return unique(all(banner, function (n) { return hasClass(n, 'swiper-slide'); }).map(function (n) {
    const a = first(n, function (a) { return a.tag === 'a' && hasClass(a, 'banner'); });
    const id = detailID(a && a.attrs.href);
    if (!id) return null;
    const style = a.attrs.style || '', image = (style.match(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/i) || [])[1];
    const title = nodeText(first(n, function (a) { return hasClass(a, 'v-title'); })) || a.attrs.title;
    if (!title || !image) return null;
    const note = nodeText(first(n, function (a) { return hasClass(a, 'v-ins'); }));
    return { id: id, title: title, type: guessType(title + ' ' + note), poster: absoluteURL(image, cfg.baseURL), backdrop: absoluteURL(image, cfg.baseURL), aspectRatio: '16:9', action: { type: 'detail', itemId: id } };
  }).filter(Boolean)).slice(0, 8);
}

function parseCards(root, cfg) {
  const blocks = all(root, function (n) { return hasClass(n, 'module-poster-item') || hasClass(n, 'module-search-item'); });
  return unique(blocks.map(function (n) {
    const a = n.tag === 'a' ? n : first(n, function (a) { return a.tag === 'a' && detailID(a.attrs.href); });
    const id = detailID(a && a.attrs.href);
    if (!id) return null;
    const img = first(n, function (a) { return a.tag === 'img'; });
    const titleNode = first(n, function (a) { return hasClass(a, 'module-poster-item-title') || hasClass(a, 'module-card-item-title') || a.tag === 'h3'; });
    const title = nodeText(titleNode) || str(a.attrs.title) || str(img && img.attrs.alt);
    if (!title) return null;
    const note = nodeText(first(n, function (a) { return hasClass(a, 'module-item-note'); }));
    const categoryLink = first(n, function (a) { return a.tag === 'a' && /\/vod\/(?:type|show)\/id\/\d+/.test(localPath(a.attrs.href, cfg)); });
    const categoryId = (localPath(categoryLink && categoryLink.attrs.href, cfg).match(/\/id\/(\d+)/) || [])[1];
    return { id: id, title: title, type: categoryType(categoryId) || guessType(title + ' ' + note), poster: imageURL(img, cfg), remarks: note, subtitle: note, action: { type: 'detail', itemId: id } };
  }).filter(Boolean));
}

function guessType(value) { return /第.+[集季期]|更新.*集|全\d+集|完结|连载/.test(value) ? 'series' : 'movie'; }
function categoryType(id) {
  if (['1', '6', '7', '8', '9', '10', '11', '12', '20', '35', '40'].indexOf(id) >= 0) return 'movie';
  if (['2', '3', '4', '13', '14', '15', '16', '21', '22', '23', '24', '25', '26', '27', '28', '45'].indexOf(id) >= 0) return 'series';
  return '';
}
function listAction(path, title) { return { type: 'category', pageId: '555-list:' + encodeURIComponent(path), title: title, itemAspectRatio: '2:3' }; }
function listPage(id, title, items, page, more) { return { pageType: 'category', id: id, title: title, style: 'media.posterGrid', itemAspectRatio: '2:3', items: items, page: page, hasMore: more }; }
function listPath(path) {
  if (!/^\/vod\/(show|search)\/(?:[A-Za-z0-9_%\-\u0080-\uFFFF]+\/)*[A-Za-z0-9_%\-\u0080-\uFFFF]+\.html$/.test(path)) throw new Error('无效的555电影列表路径');
  return path;
}
function pagedPath(path, page) { return path.replace(/\/page\/\d+(?=\/|\.html)/, '').replace(/\.html$/, (page > 1 ? '/page/' + page : '') + '.html'); }
function sameListPage(current, candidate, page) {
  function fields(path) {
    try { listPath(path); } catch (_) { return null; }
    const parts = path.replace(/\.html$/, '').split('/').slice(1), result = { route: parts[1] };
    if ((parts.length - 2) % 2) return null;
    for (let i = 2; i < parts.length; i += 2) {
      if (Object.prototype.hasOwnProperty.call(result, parts[i])) return null;
      try { result[parts[i]] = decodeURIComponent(parts[i + 1]); } catch (_) { return null; }
    }
    return result;
  }
  const a = fields(current), b = fields(candidate);
  if (!a || !b || Number(b.page || 1) !== page) return false;
  delete a.page; delete b.page;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(function (key) { return a[key] === b[key]; });
}
function playPath(path) { return /^\/vod\/play\/id\/([A-Za-z0-9]+)\/sid\/([1-9]\d*)\/nid\/([1-9]\d*)\.html$/.exec(path || ''); }
function detailID(value) { return (str(value).match(/(?:^|\/)(?:vod\/detail\/id|play)\/([A-Za-z0-9]+)\.html(?:$|[?#])/) || [])[1] || ''; }
function itemID(value) {
  const id = str(value);
  if (!/^[A-Za-z0-9]{1,64}$/.test(id)) throw new Error('无效的555电影内容 ID');
  return id;
}
function episodeIdentity(title) {
  const normalized = title.replace(/[\s　]/g, '').replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 65248); });
  const m = /^(?:第)?(\d+)(?:集|期|话|話)?$/i.exec(normalized) || /^EP?(\d+)$/i.exec(normalized);
  if (m && Number(m[1]) > 0) return { id: 'e' + Number(m[1]), number: Number(m[1]) };
  // Keep trailers, dates, parts and named specials distinct; never align by nid.
  return { id: 'named:' + encodeURIComponent(normalized.toLowerCase()) };
}

function config(ctx) {
  const args = object(ctx);
  let current = {};
  try { if (typeof Widget !== 'undefined' && Widget.parameters && Widget.parameters.current) current = object(Widget.parameters.current()); } catch (_) {}
  const params = Object.assign({}, current, object(args.config), object(args.settings), object(args.parameters), object(args.params));
  const base = (str(params.baseURL).trim() || FIVE_BASE).replace(/\/+$/, '');
  if (!/^https?:\/\/(?:[a-z0-9-]+\.)*[a-z0-9-]+(?::\d{1,5})?$/i.test(base)) throw new Error('站点地址须为有效的 HTTP/HTTPS 首页地址');
  return { baseURL: base, refresh: !!(args.reload || args.forceRefresh) };
}

async function request(cfg, path, options) {
  const url = cfg.baseURL + requestPath(path);
  let cookies = cacheRead(cfg, 'cookies') || '';
  for (let attempt = 0; attempt < 2; attempt++) {
    const headers = { 'User-Agent': FIVE_UA, Referer: cfg.baseURL + '/' };
    if (cookies) headers.Cookie = cookies;
    let response;
    try {
      const http = typeof Widget !== 'undefined' && Widget.http || (typeof $http !== 'undefined' && $http);
      if (!http || !http.get) throw new Error('HTTP unavailable');
      response = await http.get(url, { headers: headers, timeout: 20, useBrowserCookie: true });
    } catch (_) { throw new Error('555电影网络请求失败，请稍后重试'); }
    let html = responseText(response);
    const challenge = powChallenge(html);
    if (challenge) {
      if (attempt) throw new Error('555电影站点校验未通过，请稍后重试');
      cookies = mergeCookies(cookies, solvePoW(challenge));
      cacheWrite(cfg, 'cookies', cookies, 480);
      continue;
    }
    if (manualVerification(html)) {
      if (options && options.allowVerification === false) throw new Error('555电影资源查询需要站点验证，请稍后重试');
      if (typeof Widget === 'undefined' || !Widget.browser || !Widget.browser.fetch) throw new Error('555电影需要完成站点验证码，请使用支持站点验证的新版 App');
      // MAC.Verify.Focus removes .mac_verify on focus, before the user enters anything.
      // Wait for the challenge input itself to disappear after successful verification.
      let verified;
      try {
        verified = await Widget.browser.fetch(url, { headers: headers, timeout: 120, visible: false, verificationSelector: '.mx-mac_msg_jump input[name="verify"]', waitAfterLoad: 1 });
      } catch (_) { throw new Error('555电影站点验证未完成，请重试并在验证页面输入验证码'); }
      if (verified && verified.error) throw new Error('555电影站点验证未完成或已取消，请重试');
      html = responseText(verified);
      if (manualVerification(html)) throw new Error('555电影站点验证未完成；请更新 App 后重试');
      const finalURL = str(verified && (verified.currentURL || (verified.headers || {})['X-MiniLibrary-Final-URL']));
      if (finalURL && !localPath(finalURL, cfg)) throw new Error('站点验证跳转到了其他地址，请检查站点配置');
      const received = verified && (verified.headers || {}).Cookie;
      if (received) {
        cookies = mergeCookies(cookies, str(received));
        cacheWrite(cfg, 'cookies', cookies, 480);
      }
      response = verified;
    }
    if (!html || (response && (response.error || Number(response.status || response.statusCode) >= 400))) throw new Error('555电影页面暂时不可用，请稍后重试');
    if (powChallenge(html)) throw new Error('555电影站点校验未完成，请重试');
    return html;
  }
  throw new Error('555电影站点校验失败');
}

function manualVerification(html) { return /(?:系统安全验证|访问此数据需要输入验证码)/.test(html) && /name\s*=\s*["']verify["']/i.test(html); }
function powChallenge(html) {
  if (!/__vgp/.test(html) || !/location\.reload/.test(html)) return null;
  const m = /\bC\s*=\s*["'](\d+\.[a-f0-9]{32})["']\s*,\s*D\s*=\s*(\d+)\s*,\s*P\s*=\s*["'](0+)["']/i.exec(html);
  if (!m) throw new Error('555电影站点校验格式已变化，请更新脚本');
  const difficulty = Number(m[2]);
  if (difficulty < 1 || difficulty > 4 || m[3].length !== difficulty) throw new Error('555电影站点校验难度暂不支持，请稍后重试');
  return { value: m[1], difficulty: difficulty, prefix: m[3] };
}
function solvePoW(challenge) {
  const crypto = typeof Widget !== 'undefined' && Widget.crypto || (typeof $crypto !== 'undefined' && $crypto);
  if (!crypto || !crypto.md5) throw new Error('当前 App 不支持站点校验，请更新 App');
  const started = Date.now();
  for (let n = 0; n < 400000; n++) {
    if (n % 128 === 0 && Date.now() - started > 4000) break;
    if (str(crypto.md5(challenge.value + ':' + n)).slice(0, challenge.difficulty) === challenge.prefix) return '__vgp=' + challenge.value.split('.')[0] + '.' + n;
  }
  throw new Error('555电影站点校验超时，请重试');
}
function mergeCookies(oldValue, newValue) {
  const values = Object.create(null);
  (oldValue + ';' + newValue).split(';').forEach(function (s) {
    const m = /^\s*([A-Za-z0-9_\-]+)=([^;\r\n]*)$/.exec(s);
    if (m) values[m[1]] = m[2];
  });
  return Object.keys(values).map(function (k) { return k + '=' + values[k]; }).join('; ');
}
function cacheAPI() { return typeof $cache !== 'undefined' ? $cache : typeof Widget !== 'undefined' && Widget.cache; }
function cacheKey(cfg, key) { return '555:1:' + cfg.baseURL + ':' + key; }
function cacheRead(cfg, key) {
  const name = cacheKey(cfg, key), api = cacheAPI();
  let entry = FIVE_CACHE[name];
  if (!entry && api && api.get) { try { entry = object(api.get(name)); } catch (_) {} }
  if (!entry || !(entry.expires > Date.now())) return null;
  return entry.value;
}
function cacheWrite(cfg, key, value, seconds) {
  const name = cacheKey(cfg, key), entry = { expires: Date.now() + seconds * 1000, value: value }, api = cacheAPI();
  FIVE_CACHE[name] = entry;
  try { if (api && api.set) api.set(name, entry); } catch (_) {}
}
async function cached(cfg, key, seconds, loader) {
  const hit = !cfg.refresh && cacheRead(cfg, key);
  if (hit) return hit;
  const value = await loader();
  cacheWrite(cfg, key, value, seconds);
  return value;
}
function responseText(value) {
  if (typeof value === 'string') return value;
  if (!value) return '';
  const data = value.data != null ? value.data : value.body != null ? value.body : value.html;
  // Widget.http parses JSON responses; preserve that body when returning request text.
  return data != null && typeof data === 'object' ? JSON.stringify(data) : str(data);
}

// A small inert HTML tree. It never loads scripts, evaluates source code or needs a DOM.
function parseHTML(html) {
  const root = { tag: '', attrs: {}, children: [] }, stack = [root];
  const tokens = str(html).replace(/<!--[^]*?-->/g, '').replace(/<(script|style)\b[^>]*>[^]*?<\/\1\s*>/gi, '').match(/<[^>]+>|[^<]+/g) || [];
  tokens.forEach(function (token) {
    if (token[0] !== '<') { stack[stack.length - 1].children.push(entities(token)); return; }
    const close = /^<\/([\w-]+)/.exec(token);
    if (close) {
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].tag === close[1].toLowerCase()) { stack.length = i; break; }
      return;
    }
    const open = /^<([\w-]+)/.exec(token);
    if (!open) return;
    const node = { tag: open[1].toLowerCase(), attrs: {}, children: [] };
    token.slice(open[0].length).replace(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g, function (_, k, a, b, c) { node.attrs[k.toLowerCase()] = entities(a != null ? a : b != null ? b : c || ''); return ''; });
    stack[stack.length - 1].children.push(node);
    if (!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(node.tag) && !/\/>$/.test(token)) stack.push(node);
  });
  return root;
}
function all(root, predicate) {
  const result = [];
  function walk(n) { if (!n || typeof n === 'string') return; if (predicate(n)) result.push(n); n.children.forEach(walk); }
  walk(root); return result;
}
function first(root, predicate) { return all(root, predicate)[0]; }
function hasClass(node, value) { return (' ' + (node.attrs.class || '').replace(/\s+/g, ' ') + ' ').indexOf(' ' + value + ' ') >= 0; }
function nodeText(node) {
  function text(n) { if (!n) return ''; if (typeof n === 'string') return n; if (hasClass(n, 'module-title-en')) return ''; return n.children.map(text).join(n.tag === 'p' || n.tag === 'br' ? ' ' : ''); }
  return text(node).replace(/\s+/g, ' ').trim();
}
function imageURL(img, cfg) {
  if (!img) return '';
  return absoluteURL(img.attrs['data-original'] || img.attrs['data-src'] || img.attrs.src || '', cfg.baseURL);
}
function absoluteURL(value, base) {
  value = entities(str(value)).trim();
  if (!value || /[\s<>"\\]/.test(value)) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('//')) return base.split(':')[0] + ':' + value;
  if (value.startsWith('/')) return base + value;
  return /^[\w.-]+\//.test(value) ? base + '/' + value : '';
}
function localPath(value, cfg) {
  value = entities(str(value));
  if (value.startsWith(cfg.baseURL + '/')) value = value.slice(cfg.baseURL.length);
  return /^\/(?!\/)/.test(value) && !/[\\\r\n]/.test(value) ? canonicalSitePath(value) : '';
}

// Keep action identities and pagination in one format while accepting both site routes.
function canonicalSitePath(path) {
  let match = /^\/play\/([A-Za-z0-9]+)\.html$/.exec(path);
  if (match) return '/vod/detail/id/' + match[1] + '.html';
  match = /^\/see\/([A-Za-z0-9]+)-([1-9]\d*)-([1-9]\d*)\.html$/.exec(path);
  if (match) return '/vod/play/id/' + match[1] + '/sid/' + match[2] + '/nid/' + match[3] + '.html';
  match = /^\/vodtype\/(\d+)\.html$/.exec(path);
  if (match) return '/vod/type/id/' + match[1] + '.html';
  match = /^\/vodshow\/([A-Za-z0-9_%+\-\u0080-\uFFFF]+)\.html$/.exec(path);
  if (match) {
    const values = match[1].split('-');
    const keys = FIVE_SHOW_FIELDS;
    if (values.length !== keys.length || !/^\d+$/.test(values[0])) return path;
    return '/vod/show' + values.map(function (value, index) { return value ? '/' + keys[index] + '/' + value : ''; }).join('') + '.html';
  }
  return path;
}

function requestPath(path) {
  let match = /^\/vod\/type\/id\/(\d+)\.html$/.exec(path);
  if (match) return '/vodtype/' + match[1] + '.html';
  match = /^\/vod\/detail\/id\/([A-Za-z0-9]+)\.html$/.exec(path);
  if (match) return '/play/' + match[1] + '.html';
  match = playPath(path);
  if (match) return '/see/' + match[1] + '-' + match[2] + '-' + match[3] + '.html';
  if (/^\/vod\/show\//.test(path)) {
    const keys = FIVE_SHOW_FIELDS;
    const parts = path.replace(/\.html$/, '').split('/').slice(3), values = Object.create(null);
    for (let i = 0; i < parts.length; i += 2) {
      if (keys.indexOf(parts[i]) < 0 || !parts[i + 1]) return path;
      values[parts[i]] = parts[i + 1];
    }
    if (/^\d+$/.test(values.id || '')) return '/vodshow/' + keys.map(function (key) { return values[key] || ''; }).join('-') + '.html';
  }
  return path;
}
function entities(value) {
  return str(value).replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, function (full, key) {
    const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
    if (key[0] !== '#') return named[key.toLowerCase()] || full;
    const code = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
    return code > 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : full;
  });
}
function playerJSON(html) {
  const start = /\bvar\s+player_[a-z0-9_]+\s*=\s*/ig;
  let match;
  while ((match = start.exec(html))) {
    let index = start.lastIndex;
    if (html[index] !== '{') continue;
    let depth = 0, quoted = false, escaped = false;
    for (let i = index; i < html.length; i++) {
      const c = html[i];
      if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
      if (c === '"') quoted = true;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) {
        try { const parsed = JSON.parse(html.slice(index, i + 1)); if (typeof parsed.url === 'string') return parsed; } catch (_) {}
        break;
      }
    }
  }
  throw new Error('此线路未提供可读取的播放信息，请切换线路');
}
function decodeBase64(value) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', clean = value.replace(/\s/g, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(clean) || clean.length % 4 === 1) throw new Error('播放地址编码无效，请切换线路');
  let bits = 0, buffer = 0, out = '';
  for (let i = 0; i < clean.length && clean[i] !== '='; i++) { buffer = (buffer << 6) | chars.indexOf(clean[i]); bits += 6; if (bits >= 8) { bits -= 8; out += String.fromCharCode((buffer >> bits) & 255); } }
  return out;
}
function unescapeURL(value) { return value.replace(/%u([a-f0-9]{4})|%([a-f0-9]{2})/gi, function (_, wide, byte) { return String.fromCharCode(parseInt(wide || byte, 16)); }); }
function unique(items) { const seen = Object.create(null); return items.filter(function (item) { if (seen[item.id]) return false; seen[item.id] = true; return true; }); }
function str(value) { return value == null ? '' : String(value); }
function object(value) { if (typeof value === 'string') { try { return JSON.parse(value) || {}; } catch (_) { return {}; } } return value && typeof value === 'object' ? value : {}; }
function positive(value, fallback) { const number = Number(value); return Number.isInteger(number) && number > 0 && number < 10000 ? number : fallback; }

if (typeof module !== 'undefined' && module.exports) module.exports = { WidgetMetadata, getManifest, getHome, getHomeSection, getCategory, getDetail, getResourceVersions, resolvePlayback, search, matchResources };
