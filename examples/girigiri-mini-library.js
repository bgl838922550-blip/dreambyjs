// @name GiriGiri Mini Library

const GIRI_ID = 'girigiri-mini-library';
const GIRI_NAME = 'GiriGiri 爱动漫';
const GIRI_BASE = 'https://ani.girigirilove.com';
const GIRI_LOGO = GIRI_BASE + '/upload/anime.girigirilove.com_.png';
const GIRI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

const GIRI_CATEGORIES = [
  { id: 'latest', title: '最新日番', category: '2', sort: 'time', style: 'discover.spotlight' },
  { id: 'hot', title: '热门日番', category: '2', sort: 'hits', style: 'discover.rankedPosterCompact' },
  { id: 'top', title: '高分日番', category: '2', sort: 'score', style: 'discover.posterCompact' },
  { id: 'movie', title: '剧场版', category: '21', sort: 'time', style: 'discover.editorial' },
  { id: 'american', title: '美番', category: '3', sort: 'time', style: 'discover.posterCompact' },
  { id: 'live', title: '真人番剧', category: '20', sort: 'time', style: 'discover.posterCompact' },
  { id: 'commentary', title: 'BD 副音轨', category: '24', sort: 'time', style: 'discover.posterCompact' },
  { id: 'concert', title: '演唱会及其他', category: '26', sort: 'time', style: 'discover.posterCompact' }
];

const GIRI_SORTS = [
  { id: 'time', title: '最新', value: 'time' },
  { id: 'hits', title: '最热', value: 'hits' },
  { id: 'score', title: '评分', value: 'score' }
];

const GIRI_DETAIL_CACHE = {};

const WidgetMetadata = {
  id: GIRI_ID,
  name: GIRI_NAME,
  title: GIRI_NAME,
  version: '1.0.0',
  author: 'baiPlay',
  site: GIRI_BASE + '/',
  logo: GIRI_LOGO,
  icon: GIRI_LOGO,
  description: 'GiriGiri 动漫自定义媒体库，支持分类、搜索、多线路选集与按需播放解析。'
};

function getManifest() {
  return {
    id: WidgetMetadata.id,
    name: WidgetMetadata.name,
    title: WidgetMetadata.title,
    version: WidgetMetadata.version,
    author: WidgetMetadata.author,
    site: WidgetMetadata.site,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    description: WidgetMetadata.description,
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      resourceVersions: true,
      playback: true,
      playbackHistory: true,
      resourceMatching: false
    },
    aggregation: {
      enabled: false,
      search: false,
      playbackHistory: false,
      resourceMatching: false
    },
    parameters: [
      {
        name: 'baseURL',
        title: '站点地址',
        type: 'input',
        value: GIRI_BASE,
        defaultValue: GIRI_BASE,
        required: false,
        description: '站点域名变更时可在这里替换。'
      }
    ]
  };
}

async function getHome(ctx) {
  const cfg = readConfig(ctx);
  let latest = [];
  try {
    latest = await loadCategoryItems(cfg, GIRI_CATEGORIES[0], 1, GIRI_CATEGORIES[0].sort, '');
  } catch (_) {}

  return {
    pageType: 'home',
    id: 'giri-home',
    title: GIRI_NAME,
    heroAspectRatio: '2:3',
    hero: latest.slice(0, 6),
    sections: GIRI_CATEGORIES.map(function (category, index) {
      const items = index === 0 ? latest.slice(0, 14) : [];
      return {
        id: 'giri-section:' + category.id,
        title: category.title,
        style: category.style,
        itemAspectRatio: '2:3',
        moreAction: categoryAction(category),
        loadAction: { type: 'custom', id: 'giri-section:' + category.id, title: category.title },
        lazy: items.length === 0,
        isLazy: items.length === 0,
        items
      };
    })
  };
}

async function getHomeSection(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const sectionId = stringValue(args.sectionId || args.id).replace(/^giri-section:/, '');
  const category = categoryById(sectionId) || GIRI_CATEGORIES[0];
  let items = [];
  try {
    items = await loadCategoryItems(cfg, category, 1, category.sort, '');
  } catch (_) {}
  return {
    id: 'giri-section:' + category.id,
    title: category.title,
    style: category.style,
    itemAspectRatio: '2:3',
    moreAction: categoryAction(category),
    lazy: false,
    isLazy: false,
    items: items.slice(0, 14)
  };
}

async function getCategory(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const pageId = stringValue(args.pageId || args.id || 'giri-cat:latest').replace(/^giri-cat:/, '');
  const category = categoryById(pageId) || GIRI_CATEGORIES[0];
  const page = positiveInt(args.page, 1);
  const sort = stringValue(args.sort || args.sortBy || args.sort_by || category.sort || 'time');
  const genre = stringValue(args.genre || args.class || args.cls || '');
  const items = await loadCategoryItems(cfg, category, page, sort, genre);
  return {
    pageType: 'category',
    id: 'giri-cat:' + category.id,
    title: category.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items,
    page,
    hasMore: items.length >= 12,
    sortOptions: GIRI_SORTS,
    sort: GIRI_SORTS,
    selectedSortValue: sort
  };
}

async function search(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const query = cleanText(args.query || args.keyword || args.text);
  const page = positiveInt(args.page, 1);
  if (!query) return emptyPage('搜索 GiriGiri', 'giri-search-empty');
  const url = cfg.baseURL + '/index.php/ajax/suggest?mid=1&wd=' + encodeURIComponent(query) +
    (page > 1 ? '&page=' + page : '');
  const response = await requestJSON(url, cfg, cfg.baseURL + '/');
  const list = Array.isArray(response.list) ? response.list : [];
  const seen = {};
  const items = list.map(function (item, index) {
    const rawId = stringValue(item.id || item.vod_id || index);
    const id = normalizeItemId(rawId);
    if (!rawId || seen[id]) return null;
    seen[id] = true;
    return mediaCard({
      id,
      title: item.name || item.vod_name || rawId,
      poster: absoluteURL(item.pic || item.vod_pic, cfg.baseURL),
      status: item.note || item.vod_remarks,
      description: item.en || item.vod_en
    }, cfg);
  }).filter(Boolean);
  return {
    pageType: 'category',
    id: 'giri-search:' + encodeURIComponent(query),
    title: '搜索 ' + query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items,
    page,
    hasMore: items.length >= 10
  };
}

async function getDetail(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const itemId = normalizeItemId(args.itemId || args.id || args.link || args.url);
  if (!itemId) throw new Error('缺少 GiriGiri 内容 ID');
  const cacheKey = cfg.baseURL + ':' + itemId;
  if (GIRI_DETAIL_CACHE[cacheKey] && !args.reload && !args.forceRefresh) return GIRI_DETAIL_CACHE[cacheKey];

  const detailURL = cfg.baseURL + '/GV' + itemId + '/';
  const html = await requestText(detailURL, cfg, cfg.baseURL + '/');
  const parsed = parseDetailHTML(html, itemId, cfg, detailURL);
  const detail = buildDetail(parsed, cfg, detailURL);
  GIRI_DETAIL_CACHE[cacheKey] = detail;
  return detail;
}

async function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const itemId = normalizeItemId(args.itemId || args.id || args.link || args.versionId);
  if (!itemId) return [];
  const detail = args._detail || await getDetail(Object.assign({}, args, { itemId }));
  const targetEpisode = stringValue(args.episodeId || args.episodeNumber || '1');
  return buildResourceGroups(detail, targetEpisode, cfg);
}

async function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const payload = decodePayload(args.versionId || '');
  let playPage = stringValue(args.playPage || payload.playPage || args.url || args.playUrl);
  if (playPage && !/\/playGV\d+-\d+-\d+\//i.test(playPage)) playPage = '';

  if (!playPage) {
    const itemId = normalizeItemId(args.itemId || args.id || payload.itemId);
    const groups = await getResourceVersions(Object.assign({}, args, { itemId }));
    const versions = groups.length ? groups[0].versions || [] : [];
    const selected = versions.filter(function (version) {
      return !args.versionId || version.id === args.versionId;
    })[0] || versions[0];
    playPage = selected && (selected.playPage || selected.url);
  }
  if (!playPage) throw new Error('未找到 GiriGiri 播放页');

  playPage = absoluteURL(playPage, cfg.baseURL);
  const html = await requestText(playPage, cfg, cfg.baseURL + '/');
  const player = parsePlayerConfig(html);
  const mediaURL = decodePlayerURL(player.url, player.encrypt);
  if (!mediaURL) throw new Error('GiriGiri 播放地址解析失败');
  const headers = playbackHeaders(cfg, playPage);
  return {
    url: absoluteURL(mediaURL, playPage),
    videoUrl: absoluteURL(mediaURL, playPage),
    container: inferContainer(mediaURL),
    headers,
    header: headers,
    isLive: false,
    streamKind: 'vod',
    title: cleanText(player.vod_data && player.vod_data.vod_name)
  };
}

async function loadCategoryItems(cfg, category, page, sort, genre) {
  const html = await requestText(showURL(cfg, category.category, sort, genre, page), cfg, cfg.baseURL + '/');
  return parseListHTML(html, cfg);
}

function parseListHTML(html, cfg) {
  const text = stringValue(html);
  const matches = matchAll(text, /<a\b([^>]*class=["'][^"']*public-list-exp[^"']*["'][^>]*)href=["'](\/GV\d+\/)["']([^>]*)>([\s\S]*?)<\/a>/gi);
  const seen = {};
  return matches.map(function (match) {
    const attrs = match[1] + ' ' + match[3];
    const href = match[2];
    const id = normalizeItemId(href);
    if (!id || seen[id]) return null;
    seen[id] = true;
    const block = text.slice(match.index, Math.min(text.length, match.index + 1900));
    const title = decodeHTML(firstNonEmpty(
      firstMatch(attrs, /title=["']([^"']+)["']/i),
      firstMatch(block, /class=["'][^"']*time-title[^"']*["'][^>]*title=["']([^"']+)["']/i),
      stripTags(match[4])
    ));
    const poster = absoluteURL(firstNonEmpty(
      firstMatch(match[4], /data-src=["']([^"']+)["']/i),
      firstMatch(block, /<img\b[^>]*data-src=["']([^"']+)["']/i),
      firstMatch(block, /<img\b[^>]*src=["']([^"']+)["']/i)
    ), cfg.baseURL);
    const status = cleanText(stripTags(firstMatch(block, /class=["'][^"']*public-list-prb[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)));
    const description = cleanText(stripTags(firstMatch(block, /class=["'][^"']*public-list-subtitle[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)));
    return mediaCard({ id, title, poster, status, description }, cfg);
  }).filter(Boolean);
}

function parseDetailHTML(html, itemId, cfg, detailURL) {
  const text = stringValue(html);
  const title = decodeHTML(firstNonEmpty(
    firstMatch(text, /class=["'][^"']*slide-info-title[^"']*["'][^>]*>([\s\S]*?)<\/h\d>/i),
    firstMatch(text, /<meta\b[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i),
    firstMatch(text, /<title>([\s\S]*?)<\/title>/i)
  )).replace(/\s*[-|–].*girigiri.*$/i, '');
  const poster = absoluteURL(firstNonEmpty(
    firstMatch(text, /class=["'][^"']*detail-pic[^"']*["'][\s\S]{0,500}?data-src=["']([^"']+)["']/i),
    firstMatch(text, /<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
  ), cfg.baseURL);
  const overview = decodeHTML(firstNonEmpty(
    stripTags(firstMatch(text, /id=["']height_limit["'][^>]*>([\s\S]*?)<\/div>/i)),
    firstMatch(text, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
  ));
  const rating = numberValue(firstMatch(text, /class=["']fraction["'][^>]*>([\d.]+)<\/div>/i), 0);
  const year = firstMatch(text, /href=["'][^"']*search[^"']*?(20\d{2})[^"']*["']/i);
  const genres = extractLabeledLinks(text, '类型');
  const actors = extractLabeledLinks(text, '演员');
  const directors = extractLabeledLinks(text, '导演');
  const sources = parsePlaySources(text, itemId, 'playGV');
  const recommendations = parseListHTML(text.slice(Math.max(0, text.indexOf('相关作品'))), cfg)
    .filter(function (item) { return item.id !== itemId; })
    .slice(0, 18);
  return { itemId, title, poster, overview, rating, year, genres, actors, directors, sources, recommendations, detailURL };
}

function buildDetail(parsed, cfg, detailURL) {
  const primary = primaryEpisodes(parsed.sources, parsed.itemId);
  const type = primary.length > 1 ? 'series' : 'movie';
  const detail = {
    pageType: 'detail',
    id: parsed.itemId,
    itemId: parsed.itemId,
    title: parsed.title || GIRI_NAME,
    name: parsed.title || GIRI_NAME,
    type,
    mediaType: type,
    poster: parsed.poster || GIRI_LOGO,
    backdrop: parsed.poster || GIRI_LOGO,
    imageHeaders: imageHeaders(cfg, detailURL),
    posterHeaders: imageHeaders(cfg, detailURL),
    backdropHeaders: imageHeaders(cfg, detailURL),
    detailImageAspectRatio: '2:3',
    overview: parsed.overview,
    year: parsed.year,
    rating: parsed.rating,
    genres: parsed.genres,
    cast: parsed.actors.map(function (name) { return { id: 'actor:' + name, name, role: '演员' }; }),
    crew: parsed.directors.map(function (name) { return { id: 'director:' + name, name, role: '导演', job: '导演' }; }),
    seasons: primary.length ? [{ id: 's1', title: type === 'movie' ? '播放' : '全集', index: 1, episodes: primary }] : [],
    recommendations: parsed.recommendations,
    playSources: parsed.sources,
    sourceUrl: detailURL,
    providerIds: { girigiri: parsed.itemId }
  };
  if (type === 'movie' && primary[0]) detail.resourceGroups = buildResourceGroups(detail, primary[0].id, cfg);
  return detail;
}

function parsePlaySources(html, itemId, pathKind) {
  const text = stringValue(html);
  const lineNames = parseLineNames(text);
  const expression = pathKind === 'playGV'
    ? /<a\b[^>]*href=["'](\/playGV(\d+)-(\d+)-(\d+)\/)["'][^>]*>([\s\S]*?)<\/a>/gi
    : /<a\b[^>]*href=["'](\/vodplay\/(\d+)-(\d+)-(\d+)\.html)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const grouped = {};
  matchAll(text, expression).forEach(function (match) {
    if (normalizeItemId(match[2]) !== normalizeItemId(itemId)) return;
    const sid = stringValue(match[3]);
    const nid = stringValue(match[4]);
    grouped[sid] = grouped[sid] || [];
    if (grouped[sid].some(function (episode) { return episode.id === nid; })) return;
    const label = cleanText(stripTags(match[5])) || (nid === '1' ? '正片' : '第 ' + nid + ' 集');
    grouped[sid].push({
      id: nid,
      episodeId: nid,
      index: positiveInt(nid, grouped[sid].length + 1),
      episodeNumber: positiveInt(nid, grouped[sid].length + 1),
      seasonNumber: 1,
      title: label,
      name: label,
      playPage: match[1],
      lineId: 'line-' + sid
    });
  });
  return Object.keys(grouped).sort(numericSort).map(function (sid, index) {
    const title = lineNames[index] || '线路 ' + (index + 1);
    return { id: 'line-' + sid, sid, title, name: title, episodes: grouped[sid].sort(episodeSort) };
  });
}

function parseLineNames(html) {
  const tabBlock = firstNonEmpty(
    firstMatch(html, /class=["'][^"']*anthology-tab[^"']*["'][^>]*>[\s\S]*?class=["']swiper-wrapper["'][^>]*>([\s\S]*?)<\/div>/i),
    firstMatch(html, /class=["'][^"']*module-tab-items[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
  );
  return matchAll(tabBlock, /<a\b[^>]*>([\s\S]*?)<\/a>/gi).map(function (match) {
    return decodeHTML(stripTags(match[1]).replace(/\d+\s*$/, ''));
  }).filter(Boolean);
}

function primaryEpisodes(sources, itemId) {
  const source = (sources || []).filter(function (entry) { return entry.episodes && entry.episodes.length; })[0];
  if (!source) return [];
  return source.episodes.map(function (episode) {
    const versionId = encodePayload({ itemId, lineId: source.id, episodeId: episode.id, playPage: episode.playPage });
    return Object.assign({}, episode, {
      action: {
        type: 'play',
        itemId,
        seasonId: 's1',
        episodeId: episode.id,
        versionId,
        playPage: episode.playPage,
        title: episode.title
      }
    });
  });
}

function buildResourceGroups(detail, episodeId, cfg) {
  const sources = detail.playSources || [];
  const versions = [];
  sources.forEach(function (source, index) {
    const episode = findEpisode(source, episodeId);
    if (!episode) return;
    const versionId = encodePayload({ itemId: detail.itemId, lineId: source.id, episodeId: episode.id, playPage: episode.playPage });
    const playPage = absoluteURL(episode.playPage, cfg.baseURL);
    versions.push({
      id: versionId,
      versionId,
      title: source.title || '线路 ' + (index + 1),
      name: source.title || '线路 ' + (index + 1),
      subtitle: episode.title,
      quality: source.title || 'HD',
      url: playPage,
      playPage,
      availability: 'requiresResolve',
      default: index === 0,
      action: {
        type: 'play',
        itemId: detail.itemId,
        seasonId: 's1',
        episodeId: episode.id,
        versionId,
        playPage,
        url: playPage,
        title: episode.title
      }
    });
  });
  return versions.length ? [{ id: 'giri-lines', title: '播放线路', versions }] : [];
}

function findEpisode(source, episodeId) {
  const target = stringValue(episodeId || '1');
  const episodes = source.episodes || [];
  return episodes.filter(function (episode) {
    return episode.id === target || stringValue(episode.index) === target || stringValue(episode.episodeNumber) === target;
  })[0] || episodes[0];
}

function parsePlayerConfig(html) {
  const startMatch = /(?:var\s+)?player_aaaa\s*=\s*/i.exec(stringValue(html));
  if (!startMatch) return {};
  const start = stringValue(html).indexOf('{', startMatch.index + startMatch[0].length);
  if (start < 0) return {};
  const objectText = balancedObject(stringValue(html), start);
  try { return JSON.parse(objectText); } catch (_) { return parseLooseObject(objectText); }
}

function decodePlayerURL(url, encrypt) {
  const value = stringValue(url).replace(/\\\//g, '/');
  if (stringValue(encrypt) !== '2') return decodeURIComponentSafe(value);
  const decoded = base64Decode(value.replace(/-/g, '+').replace(/_/g, '/'));
  return decodeURIComponentSafe(decoded);
}

function mediaCard(input, cfg) {
  const id = normalizeItemId(input.id);
  const title = cleanText(input.title) || id;
  const poster = absoluteURL(input.poster, cfg.baseURL) || GIRI_LOGO;
  return {
    id,
    itemId: id,
    title,
    name: title,
    type: 'series',
    mediaType: 'series',
    poster,
    backdrop: poster,
    imageHeaders: imageHeaders(cfg, cfg.baseURL + '/'),
    posterHeaders: imageHeaders(cfg, cfg.baseURL + '/'),
    backdropHeaders: imageHeaders(cfg, cfg.baseURL + '/'),
    subtitle: cleanText(input.description),
    overview: cleanText(input.description),
    remarks: cleanText(input.status),
    status: cleanText(input.status),
    badges: cleanText(input.status) ? [cleanText(input.status)] : [],
    aspectRatio: '2:3',
    action: { type: 'detail', itemId: id, id, title }
  };
}

function categoryAction(category) {
  return { type: 'category', pageId: 'giri-cat:' + category.id, id: 'giri-cat:' + category.id, title: category.title };
}

function categoryById(id) {
  return GIRI_CATEGORIES.filter(function (category) { return category.id === id; })[0];
}

function showURL(cfg, category, sort, genre, page) {
  const fields = [category, '', sort || '', genre || '', '', '', '', '', page > 1 ? String(page) : '', '', '', ''];
  return cfg.baseURL + '/show/' + fields.join('-') + '/';
}

function readConfig(ctx) {
  const args = argsify(ctx);
  let persisted = {};
  try {
    if (typeof Widget !== 'undefined' && Widget.parameters && typeof Widget.parameters.current === 'function') {
      persisted = Widget.parameters.current() || {};
    }
  } catch (_) {}
  const params = Object.assign({}, persisted, args.parameters || {}, args.params || {}, args.settings || {}, args.config || {});
  return { baseURL: normalizeBaseURL(params.baseURL || params.base_url || args.baseURL || args.base_url || GIRI_BASE) };
}

async function requestJSON(url, cfg, referer) {
  const text = await requestText(url, cfg, referer);
  try { return JSON.parse(text); } catch (_) { throw new Error('GiriGiri 搜索接口返回格式错误'); }
}

async function requestText(url, cfg, referer) {
  const headers = {
    'User-Agent': GIRI_UA,
    Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
    Referer: referer || cfg.baseURL + '/'
  };
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const response = await Widget.http.get(url, { headers, timeout: 25 });
    const status = numberValue(response && (response.statusCode || response.status), 200);
    if (status >= 400 || (response && response.ok === false)) throw new Error('HTTP ' + status);
    return responseText(response);
  }
  if (typeof fetch === 'function') {
    const response = await fetch(url, { headers, redirect: 'follow' });
    const text = await response.text();
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return text;
  }
  throw new Error('当前小程序环境缺少 HTTP 客户端');
}

function imageHeaders(cfg, referer) {
  return { 'User-Agent': GIRI_UA, Referer: referer || cfg.baseURL + '/' };
}

function playbackHeaders(cfg, referer) {
  return { 'User-Agent': GIRI_UA, Referer: referer || cfg.baseURL + '/', Origin: originFrom(cfg.baseURL), Accept: '*/*' };
}

function extractLabeledLinks(html, label) {
  const block = firstMatch(html, new RegExp('<div\\b[^>]*class=["\'][^"\']*partition[^"\']*["\'][^>]*>[\\s\\S]*?' + label + '\\s*[:：][\\s\\S]*?<\\/div>', 'i'));
  return unique(matchAll(block, /<a\b[^>]*>([\s\S]*?)<\/a>/gi).map(function (match) {
    return cleanText(stripTags(match[1]));
  }).filter(Boolean));
}

function normalizeItemId(value) {
  const text = stringValue(value);
  const payload = decodePayload(text);
  if (payload.itemId) return normalizeItemId(payload.itemId);
  const match = text.match(/(?:^|\/)(?:GV)?(\d+)(?:\/|$)/i);
  return match ? match[1] : (/^\d+$/.test(text) ? text : '');
}

function normalizeBaseURL(value) {
  const text = stringValue(value).trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(text) ? text : GIRI_BASE;
}

function absoluteURL(value, base) {
  const text = decodeHTML(stringValue(value).trim());
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) return text;
  if (/^\/\//.test(text)) return 'https:' + text;
  try { return new URL(text, base + '/').toString(); } catch (_) { return base.replace(/\/+$/, '') + '/' + text.replace(/^\/+/, ''); }
}

function inferContainer(url) {
  const path = stringValue(url).split(/[?#]/)[0].toLowerCase();
  if (path.endsWith('.m3u8')) return 'm3u8';
  if (path.endsWith('.mp4')) return 'mp4';
  if (path.endsWith('.flv')) return 'flv';
  if (path.endsWith('.ts')) return 'ts';
  return 'auto';
}

function originFrom(value) {
  const match = stringValue(value).match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : '';
}

function emptyPage(title, id) {
  return { pageType: 'category', id, title, style: 'media.posterGrid', itemAspectRatio: '2:3', items: [], page: 1, hasMore: false };
}

function balancedObject(text, start) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) return text.slice(start, index + 1);
  }
  return '';
}

function parseLooseObject(value) {
  const out = {};
  matchAll(value, /["']?([a-zA-Z0-9_]+)["']?\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,}]+))/g).forEach(function (match) {
    out[match[1]] = firstNonEmpty(match[2], match[3], cleanText(match[4]));
  });
  return out;
}

function base64Decode(value) {
  try {
    if (typeof atob === 'function') return atob(value);
  } catch (_) {}
  try {
    if (typeof Buffer !== 'undefined') return Buffer.from(value, 'base64').toString('binary');
  } catch (_) {}
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let buffer = 0;
  let bits = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === '=') break;
    const code = chars.indexOf(value[index]);
    if (code < 0) continue;
    buffer = (buffer << 6) | code;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 255);
    }
  }
  return output;
}

function encodePayload(payload) {
  return 'giri-play:' + encodeURIComponent(JSON.stringify(payload));
}

function decodePayload(value) {
  const text = stringValue(value);
  if (!text.startsWith('giri-play:')) return {};
  try { return JSON.parse(decodeURIComponent(text.slice(10))) || {}; } catch (_) { return {}; }
}

function responseText(response) {
  if (typeof response === 'string') return response;
  if (response && typeof response.data === 'string') return response.data;
  if (response && response.data !== undefined) return JSON.stringify(response.data);
  if (response && typeof response.body === 'string') return response.body;
  return stringValue(response);
}

function argsify(ctx) {
  if (!ctx) return {};
  if (typeof ctx === 'string') {
    try { return JSON.parse(ctx); } catch (_) { return {}; }
  }
  return ctx;
}

function matchAll(value, regex) {
  const output = [];
  let match;
  regex.lastIndex = 0;
  while ((match = regex.exec(stringValue(value)))) {
    output.push(match);
    if (match[0] === '') regex.lastIndex += 1;
  }
  return output;
}

function firstMatch(value, regex) {
  const match = stringValue(value).match(regex);
  return match && match[1] !== undefined ? match[1] : '';
}

function firstNonEmpty() {
  for (let index = 0; index < arguments.length; index += 1) {
    if (arguments[index] !== undefined && arguments[index] !== null && stringValue(arguments[index]).trim()) return arguments[index];
  }
  return '';
}

function stripTags(value) {
  return stringValue(value).replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
}

function decodeHTML(value) {
  return cleanText(stringValue(value)
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#0?39;/gi, "'").replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, function (_, code) { return String.fromCharCode(parseInt(code, 10)); })
    .replace(/&#x([0-9a-f]+);/gi, function (_, code) { return String.fromCharCode(parseInt(code, 16)); }));
}

function cleanText(value) {
  return stringValue(value).replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function stringValue(value) {
  return value === undefined || value === null ? '' : String(value);
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function positiveInt(value, fallback) {
  const number = parseInt(value, 10);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function unique(values) {
  const seen = {};
  return (values || []).filter(function (value) {
    const key = stringValue(value);
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function numericSort(a, b) {
  return numberValue(a, 0) - numberValue(b, 0);
}

function episodeSort(a, b) {
  return numberValue(a.index, 0) - numberValue(b.index, 0);
}

function decodeURIComponentSafe(value) {
  try { return decodeURIComponent(value); } catch (_) { return value; }
}

const GiriGiriMiniLibrary = {
  metadata: WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  getCategory,
  getDetail,
  getResourceVersions,
  resolvePlayback,
  search,
  _test: { parseListHTML, parseDetailHTML, parsePlaySources, parsePlayerConfig, decodePlayerURL }
};

const __jsEvalReturn = GiriGiriMiniLibrary;

if (typeof globalThis !== 'undefined') {
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.GiriGiriMiniLibrary = GiriGiriMiniLibrary;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getHomeSection = getHomeSection;
  globalThis.getCategory = getCategory;
  globalThis.getDetail = getDetail;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.search = search;
}

if (typeof module !== 'undefined' && module.exports) module.exports = GiriGiriMiniLibrary;
