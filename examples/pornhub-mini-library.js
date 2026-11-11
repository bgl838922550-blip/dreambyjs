// @name Pornhub Mini Library

const PH_ID = 'pornhub-mini-library';
const PH_NAME = 'Pornhub';
const PH_BASE = 'https://cn.pornhub.com';
const PH_LOGO = 'https://ci.phncdn.com/www-static/favicon.ico';
const PH_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

const PH_CATEGORIES = [
  { id: 'recommended', title: '推荐视频', kind: 'recommended', style: 'discover.spotlight' },
  { id: 'hot', title: '热播视频', kind: 'video', order: 'ht', style: 'discover.ranked' },
  { id: 'viewed', title: '最多观看', kind: 'video', order: 'mv', style: 'discover.rankedPosterCompact' },
  { id: 'rated', title: '最高评分', kind: 'video', order: 'tr', style: 'discover.posterCompact' },
  { id: 'latest', title: '最新视频', kind: 'video', order: 'cm', style: 'discover.editorial' },
  { id: 'chinese', title: '中文视频', kind: 'language', language: 'chinese', style: 'discover.posterCompact' },
  { id: 'japanese', title: '日语视频', kind: 'language', language: 'japanese', style: 'discover.posterCompact' }
];

const PH_SORTS = [
  { id: 'relevance', title: '推荐', value: '' },
  { id: 'new', title: '最新', value: 'mr' },
  { id: 'views', title: '最多观看', value: 'mv' },
  { id: 'rating', title: '最高评分', value: 'tr' }
];

const PH_CREATORS = [
  { id: 'hongkongdoll', title: 'HongKongDoll', kind: 'model', slug: 'hongkongdoll' },
  { id: 'asiam', title: '麻豆传媒', kind: 'channels', slug: 'asiam' },
  { id: 'cabbage-sweety', title: 'Cabbage Sweety', kind: 'model', slug: 'cabbage-sweety' },
  { id: 'lindainlove', title: 'Lindainlove', kind: 'model', slug: 'lindainlove' },
  { id: 'sweetieyico', title: 'SweetieYico', kind: 'model', slug: 'sweetieyico' },
  { id: 'nana-taipei', title: 'Nana Taipei', kind: 'model', slug: 'nana-taipei' },
  { id: 'yuzukitty', title: 'YuzuKitty', kind: 'model', slug: 'yuzukitty' }
];

const PH_DETAIL_CACHE = {};

const WidgetMetadata = {
  id: PH_ID,
  name: PH_NAME,
  title: PH_NAME,
  version: '1.0.0',
  author: 'baiPlay',
  site: PH_BASE + '/',
  logo: PH_LOGO,
  icon: PH_LOGO,
  description: 'Pornhub 自定义媒体库，支持站内搜索、推荐、榜单、公开收藏、创作者和多清晰度播放。'
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
        value: PH_BASE,
        defaultValue: PH_BASE,
        required: false,
        description: '站点域名变更时可在这里替换。'
      },
      {
        name: 'Cookie',
        title: '登录 Cookie',
        type: 'password',
        value: '',
        required: false,
        description: '可选。填写后推荐页会使用登录账号的个性化内容。'
      },
      {
        name: 'favoritesUsername',
        title: '公开收藏用户名',
        type: 'input',
        value: '',
        required: false,
        description: '可选。填写公开用户名后，首页显示该账号的公开收藏。'
      }
    ]
  };
}

async function getHome(ctx) {
  const cfg = readConfig(ctx);
  let hot = [];
  try {
    hot = await loadCategoryItems(cfg, categoryById('hot'), 1, '');
  } catch (_) {}

  const sections = PH_CATEGORIES.map(function (category) {
    const items = category.id === 'hot' ? hot.slice(0, 14) : [];
    return sectionForCategory(category, items);
  });
  if (cfg.favoritesUsername) {
    sections.splice(1, 0, sectionForCategory({
      id: 'favorites', title: '公开收藏', kind: 'favorites', style: 'discover.posterCompact'
    }, []));
  }
  sections.push({
    id: 'ph-section:creators',
    title: '优选创作者',
    style: 'discover.annualListPreview',
    itemAspectRatio: '16:9',
    moreAction: { type: 'category', pageId: 'ph-cat:creators', title: '优选创作者' },
    items: PH_CREATORS.map(creatorCard)
  });

  return {
    pageType: 'home',
    id: 'ph-home',
    title: PH_NAME,
    heroAspectRatio: '16:9',
    hero: hot.slice(0, 6),
    sections
  };
}

async function getHomeSection(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const sectionId = stringValue(args.sectionId || args.id).replace(/^ph-section:/, '');
  if (sectionId === 'creators') {
    return {
      id: 'ph-section:creators', title: '优选创作者', style: 'discover.annualListPreview',
      itemAspectRatio: '16:9', lazy: false, isLazy: false, items: PH_CREATORS.map(creatorCard)
    };
  }
  const category = sectionId === 'favorites'
    ? { id: 'favorites', title: '公开收藏', kind: 'favorites', style: 'discover.posterCompact' }
    : categoryById(sectionId) || PH_CATEGORIES[0];
  let items = [];
  try { items = await loadCategoryItems(cfg, category, 1, ''); } catch (_) {}
  const section = sectionForCategory(category, items.slice(0, 14));
  section.lazy = false;
  section.isLazy = false;
  return section;
}

async function getCategory(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const rawId = stringValue(args.pageId || args.id || 'ph-cat:hot').replace(/^ph-cat:/, '');
  const page = positiveInt(args.page, 1);
  if (rawId === 'creators') {
    return {
      pageType: 'category', id: 'ph-cat:creators', title: '优选创作者',
      style: 'media.landscapeGrid', itemAspectRatio: '16:9', items: PH_CREATORS.map(creatorCard), page: 1, hasMore: false
    };
  }
  if (rawId.startsWith('creator:')) {
    const creator = creatorFromId(rawId);
    if (!creator) return emptyPage('创作者', 'ph-cat:' + rawId);
    const items = await loadCreatorItems(cfg, creator, page, stringValue(args.sort || args.sortBy || args.sort_by || 'mr'));
    return categoryPage('ph-cat:' + rawId, creator.title, items, page, PH_SORTS, stringValue(args.sort || args.sortBy || args.sort_by || 'mr'));
  }
  const category = rawId === 'favorites'
    ? { id: 'favorites', title: '公开收藏', kind: 'favorites' }
    : categoryById(rawId) || PH_CATEGORIES[1];
  const sort = stringValue(args.sort || args.sortBy || args.sort_by || '');
  const items = await loadCategoryItems(cfg, category, page, sort);
  return categoryPage('ph-cat:' + category.id, category.title, items, page, PH_SORTS, sort);
}

async function search(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const query = cleanText(args.query || args.keyword || args.text);
  const page = positiveInt(args.page, 1);
  if (!query) return emptyPage('搜索 Pornhub', 'ph-search-empty');
  const sort = stringValue(args.sort || args.sortBy || args.sort_by || '');
  let url = cfg.baseURL + '/video/search?search=' + encodeURIComponent(query.replace(/\s+/g, '+'));
  if (sort) url += '&o=' + encodeURIComponent(sort);
  if (page > 1) url += '&page=' + page;
  const html = await requestText(url, cfg, cfg.baseURL + '/');
  const items = parseVideoList(html, cfg);
  return categoryPage('ph-search:' + encodeURIComponent(query), '搜索 ' + query, items, page, PH_SORTS, sort);
}

async function getDetail(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const itemId = normalizeItemId(args.itemId || args.id || args.link || args.url || args.versionId);
  if (!itemId) throw new Error('缺少 Pornhub 视频 ID');
  const cacheKey = cfg.baseURL + ':' + itemId;
  if (PH_DETAIL_CACHE[cacheKey] && !args.reload && !args.forceRefresh) return PH_DETAIL_CACHE[cacheKey];
  const detailURL = videoURL(cfg, itemId);
  const html = await requestText(detailURL, cfg, cfg.baseURL + '/');
  assertAccessiblePage(html);
  const parsed = parseDetailHTML(html, itemId, cfg, detailURL);
  const groups = buildResourceGroups(parsed, cfg, detailURL);
  const detail = {
    pageType: 'detail',
    id: itemId,
    itemId,
    title: parsed.title || PH_NAME,
    name: parsed.title || PH_NAME,
    type: 'movie',
    mediaType: 'movie',
    poster: parsed.poster || PH_LOGO,
    backdrop: parsed.poster || PH_LOGO,
    imageHeaders: imageHeaders(cfg, detailURL),
    posterHeaders: imageHeaders(cfg, detailURL),
    backdropHeaders: imageHeaders(cfg, detailURL),
    detailImageAspectRatio: '16:9',
    overview: parsed.overview,
    runtimeSeconds: parsed.durationSeconds,
    runtimeMinutes: parsed.durationSeconds ? Math.ceil(parsed.durationSeconds / 60) : 0,
    cast: parsed.uploader ? [{ id: 'uploader:' + parsed.uploader, name: parsed.uploader, role: '上传者' }] : [],
    metadata: [
      parsed.uploader ? { title: '上传者', value: parsed.uploader } : null,
      parsed.views ? { title: '观看', value: parsed.views } : null,
      parsed.rating ? { title: '评分', value: parsed.rating } : null,
      parsed.uploadDate ? { title: '发布', value: parsed.uploadDate } : null
    ].filter(Boolean),
    resourceGroups: groups,
    resourceSummary: { versionCount: parsed.variants.length, defaultVersionId: groups[0] && groups[0].versions[0] ? groups[0].versions[0].id : '' },
    sourceUrl: detailURL,
    providerIds: { pornhub: itemId }
  };
  PH_DETAIL_CACHE[cacheKey] = detail;
  return detail;
}

async function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const itemId = normalizeItemId(args.itemId || args.id || args.link || args.versionId);
  if (!itemId) return [];
  const detail = await getDetail(Object.assign({}, args, { itemId }));
  return detail.resourceGroups || [];
}

async function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const payload = decodePayload(args.versionId || '');
  let mediaURL = cleanURL(args.url || args.playUrl || args.src || payload.url);
  const itemId = normalizeItemId(args.itemId || args.id || payload.itemId || args.versionId);
  const detailURL = videoURL(cfg, itemId);
  if (!mediaURL && itemId) {
    const groups = await getResourceVersions(Object.assign({}, args, { itemId }));
    const versions = groups.length ? groups[0].versions || [] : [];
    const selected = versions.filter(function (version) { return !args.versionId || version.id === args.versionId; })[0] || versions[0];
    mediaURL = selected && selected.url;
  }
  if (!mediaURL) throw new Error('没有可播放的 Pornhub 地址');
  const headers = playbackHeaders(cfg, detailURL);
  return {
    url: mediaURL,
    videoUrl: mediaURL,
    container: inferContainer(mediaURL),
    headers,
    header: headers,
    isLive: false,
    streamKind: 'vod'
  };
}

async function loadCategoryItems(cfg, category, page, sort) {
  let url = '';
  if (category.kind === 'recommended') {
    url = cfg.baseURL + '/recommended' + (page > 1 ? '?page=' + page : '');
  } else if (category.kind === 'language') {
    url = cfg.baseURL + '/language/' + encodeURIComponent(category.language) + '?page=' + page;
    if (sort) url += '&o=' + encodeURIComponent(sort);
  } else if (category.kind === 'favorites') {
    if (!cfg.favoritesUsername) return [];
    url = cfg.baseURL + '/users/' + encodeURIComponent(cfg.favoritesUsername) + '/videos/favorites';
    const query = [];
    if (sort) query.push('o=' + encodeURIComponent(sort));
    if (page > 1) query.push('page=' + page);
    if (query.length) url += '?' + query.join('&');
  } else {
    url = cfg.baseURL + '/video?o=' + encodeURIComponent(category.order || sort || 'ht') + '&page=' + page;
  }
  const html = await requestText(url, cfg, cfg.baseURL + '/');
  assertAccessiblePage(html);
  return parseVideoList(html, cfg);
}

async function loadCreatorItems(cfg, creator, page, sort) {
  const route = creator.kind === 'channels' ? '/channels/' : creator.kind === 'pornstar' ? '/pornstar/' : '/model/';
  let url = cfg.baseURL + route + encodeURIComponent(creator.slug) + '/videos';
  const query = [];
  if (sort) query.push('o=' + encodeURIComponent(sort));
  if (page > 1) query.push('page=' + page);
  if (query.length) url += '?' + query.join('&');
  let html = await requestText(url, cfg, cfg.baseURL + '/');
  if (!parseVideoList(html, cfg).length && creator.kind === 'channels') {
    html = await requestText(cfg.baseURL + route + encodeURIComponent(creator.slug), cfg, cfg.baseURL + '/');
  }
  assertAccessiblePage(html);
  return parseVideoList(html, cfg);
}

function parseVideoList(html, cfg) {
  const text = stringValue(html);
  const seen = {};
  return matchAll(text, /<a\b([^>]*href=["']([^"']*viewkey=([^&"']+)[^"']*)["'][^>]*)>/gi).map(function (match) {
    const id = decodeURIComponentSafe(match[3]);
    if (!id || seen[id]) return null;
    const segment = text.slice(Math.max(0, match.index - 1500), Math.min(text.length, match.index + 2300));
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const titledAnchor = firstNonEmpty(
      firstMatch(segment, new RegExp('<a\\b[^>]*href=["\'][^"\']*viewkey=' + escapedId + '[^"\']*["\'][^>]*title=["\']([^"\']+)["\']', 'i')),
      firstMatch(segment, new RegExp('<a\\b[^>]*title=["\']([^"\']+)["\'][^>]*href=["\'][^"\']*viewkey=' + escapedId, 'i')),
      firstMatch(segment, /<img\b[^>]*alt=["']([^"']+)["']/i)
    );
    const href = absoluteURL(match[2], cfg.baseURL);
    const localAnchor = text.slice(match.index, Math.min(text.length, text.indexOf('>', match.index) + 1));
    const title = decodeHTML(firstNonEmpty(
      firstMatch(match[1], /title=["']([^"']+)["']/i),
      firstMatch(localAnchor, /title=["']([^"']+)["']/i),
      titledAnchor,
      firstMatch(segment, /class=["'][^"']*title[^"']*["'][\s\S]{0,300}?<a\b[^>]*(?:title=["']([^"']+)["'])/i),
      stripTags(firstMatch(segment, /class=["'][^"']*title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)),
      'Video ' + id
    ));
    const poster = cleanURL(firstNonEmpty(
      firstMatch(segment, /<img\b[^>]*data-thumb_url=["']([^"']+)["']/i),
      firstMatch(segment, /<img\b[^>]*data-src=["']([^"']+)["']/i),
      firstMatch(segment, /<img\b[^>]*data-thumb=["']([^"']+)["']/i),
      firstMatch(segment, /<img\b[^>]*data-mediumthumb=["']([^"']+)["']/i),
      firstMatch(segment, /<img\b[^>]*src=["'](https?:\/\/[^"']+)["']/i)
    ));
    const preview = cleanURL(firstNonEmpty(
      firstMatch(segment, /data-mediabook=["']([^"']+)["']/i),
      firstMatch(segment, /data-preview=["']([^"']+)["']/i),
      firstMatch(segment, /data-webm=["']([^"']+)["']/i)
    ));
    const durationText = cleanText(stripTags(firstMatch(segment, /class=["'][^"']*(?:duration|videoDuration)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)));
    const uploader = decodeHTML(firstNonEmpty(
      firstMatch(segment, /class=["'][^"']*(?:usernameWrap|usernameBadgesWrapper)[^"']*["'][\s\S]{0,350}?<a\b[^>]*title=["']([^"']+)["']/i),
      stripTags(firstMatch(segment, /class=["'][^"']*(?:usernameWrap|usernameBadgesWrapper)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i))
    ));
    seen[id] = true;
    return mediaCard({ id, title, poster, preview, durationText, uploader, href }, cfg);
  }).filter(Boolean);
}

function parseDetailHTML(html, itemId, cfg, detailURL) {
  const text = stringValue(html);
  const title = decodeHTML(firstNonEmpty(
    firstMatch(text, /<meta\b[^>]*(?:property|name)=["']og:title["'][^>]*content=["']([^"']+)["']/i),
    firstMatch(text, /<title>([\s\S]*?)<\/title>/i)
  )).replace(/\s*[-|–].*Pornhub.*$/i, '');
  const poster = cleanURL(firstNonEmpty(
    firstMatch(text, /<meta\b[^>]*(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["']/i),
    firstMatch(text, /"image_url"\s*:\s*"([^"]+)"/i)
  ));
  const overview = decodeHTML(firstNonEmpty(
    firstMatch(text, /<meta\b[^>]*(?:property|name)=["']og:description["'][^>]*content=["']([^"']+)["']/i),
    firstMatch(text, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
  ));
  const durationSeconds = positiveInt(firstNonEmpty(
    firstMatch(text, /<meta\b[^>]*property=["']video:duration["'][^>]*content=["'](\d+)["']/i),
    firstMatch(text, /"video_duration"\s*:\s*"?(\d+)"?/i)
  ), 0);
  const uploader = decodeHTML(firstNonEmpty(
    firstMatch(text, /"author"\s*:\s*"([^"]+)"/i),
    firstMatch(text, /class=["'][^"']*(?:usernameWrap|userInfo)[^"']*["'][\s\S]{0,500}?<a\b[^>]*(?:title=["']([^"']+)["'])/i)
  ));
  const views = decodeHTML(stripTags(firstMatch(text, /class=["'][^"']*(?:views|videoViews)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i)));
  const rating = cleanText(firstNonEmpty(
    firstMatch(text, /class=["'][^"']*(?:rating|percent)[^"']*["'][^>]*>([\d.]+%?)/i),
    firstMatch(text, /"rating"\s*:\s*"?([\d.]+)"?/i)
  ));
  const uploadDate = decodeHTML(firstNonEmpty(
    firstMatch(text, /<meta\b[^>]*(?:property|name)=["']video:release_date["'][^>]*content=["']([^"']+)["']/i),
    stripTags(firstMatch(text, /class=["'][^"']*(?:added|uploadDate)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i))
  ));
  const variants = parseVariants(text);
  return { itemId, title, poster, overview, durationSeconds, uploader, views, rating, uploadDate, variants, detailURL };
}

function parseVariants(html) {
  const text = stringValue(html);
  const variants = [];
  const seen = {};
  matchAll(text, /\{[^{}]{0,1800}\}/g).forEach(function (match) {
    const block = match[0];
    const url = firstNonEmpty(
      firstMatch(block, /"videoUrl"\s*:\s*"([^"]+)"/i),
      firstMatch(block, /"videoUrl"\s*:\s*'([^']+)'/i)
    );
    if (!url) return;
    const height = positiveInt(firstNonEmpty(
      firstMatch(block, /"quality"\s*:\s*"?(\d{3,4})/i),
      firstMatch(block, /"quality_(\d{3,4})p"/i)
    ), 0);
    addVariant(url, block, variants, seen, height);
  });
  matchAll(text, /"videoUrl"\s*:\s*"([^"]+)"/gi).forEach(function (match) {
    addVariant(match[1], text.slice(Math.max(0, match.index - 350), match.index + match[0].length + 120), variants, seen);
  });
  matchAll(text, /"quality_(\d{3,4})p"\s*:\s*"([^"]+)"/gi).forEach(function (match) {
    addVariant(match[2], 'quality:' + match[1], variants, seen, positiveInt(match[1], 0));
  });
  matchAll(text, /"videoUrl"\s*:\s*'(https?:[^']+)'/gi).forEach(function (match) {
    addVariant(match[1], text.slice(Math.max(0, match.index - 350), match.index + match[0].length + 120), variants, seen);
  });
  variants.sort(function (a, b) {
    if (a.height !== b.height) return b.height - a.height;
    return (b.bandwidth || 0) - (a.bandwidth || 0);
  });
  return variants;
}

function addVariant(rawURL, context, variants, seen, knownHeight) {
  const url = cleanURL(rawURL);
  if (!/^https?:\/\//i.test(url) || seen[url]) return;
  if (!/\.(?:m3u8|mp4)(?:[?#]|$)/i.test(url) && !/master|playlist|hls/i.test(url)) return;
  seen[url] = true;
  const height = positiveInt(firstNonEmpty(
    firstMatch(url, /(?:^|[/_\-])(\d{3,4})[pP](?:[_/\-.]|$)/i),
    firstMatch(url, /(?:^|[/_\-])(\d{3,4})(?:[_/\-.])\d+[kK]/i),
    knownHeight,
    firstMatch(context, /"quality"\s*:\s*"?(\d{3,4})/i)
  ), 0);
  const bandwidth = positiveInt(firstMatch(context, /"(?:videoBitrate|bitrate|bandwidth)"\s*:\s*"?(\d+)/i), 0);
  variants.push({ url, height, bandwidth, quality: height ? height + 'P' : '自动' });
}

function buildResourceGroups(parsed, cfg, detailURL) {
  if (!parsed.variants.length) return [];
  const headers = playbackHeaders(cfg, detailURL);
  return [{
    id: 'ph-quality',
    title: '清晰度',
    versions: parsed.variants.map(function (variant, index) {
      const versionId = encodePayload({ itemId: parsed.itemId, url: variant.url, quality: variant.quality });
      return {
        id: versionId,
        versionId,
        title: variant.quality,
        name: variant.quality,
        quality: variant.quality,
        url: variant.url,
        container: inferContainer(variant.url),
        headers,
        default: index === 0,
        action: { type: 'play', itemId: parsed.itemId, versionId, url: variant.url, title: variant.quality }
      };
    })
  }];
}

function mediaCard(input, cfg) {
  const id = normalizeItemId(input.id);
  const title = cleanText(input.title) || id;
  const poster = cleanURL(input.poster) || PH_LOGO;
  const subtitle = [cleanText(input.uploader), cleanText(input.durationText)].filter(Boolean).join(' · ');
  return {
    id,
    itemId: id,
    title,
    name: title,
    type: 'movie',
    mediaType: 'movie',
    poster,
    backdrop: poster,
    previewUrl: cleanURL(input.preview),
    imageHeaders: imageHeaders(cfg, input.href || cfg.baseURL + '/'),
    posterHeaders: imageHeaders(cfg, input.href || cfg.baseURL + '/'),
    backdropHeaders: imageHeaders(cfg, input.href || cfg.baseURL + '/'),
    subtitle,
    overview: subtitle,
    runtimeSeconds: durationSeconds(input.durationText),
    aspectRatio: '16:9',
    action: { type: 'detail', itemId: id, id, title }
  };
}

function creatorCard(creator) {
  return {
    id: 'creator:' + creator.kind + ':' + creator.slug,
    title: creator.title,
    name: creator.title,
    type: 'collection',
    mediaType: 'collection',
    poster: PH_LOGO,
    backdrop: PH_LOGO,
    subtitle: creator.kind === 'channels' ? '频道' : creator.kind === 'pornstar' ? '明星' : '模特',
    aspectRatio: '16:9',
    action: { type: 'category', pageId: 'ph-cat:creator:' + creator.kind + ':' + creator.slug, title: creator.title }
  };
}

function sectionForCategory(category, items) {
  return {
    id: 'ph-section:' + category.id,
    title: category.title,
    style: category.style || 'discover.posterCompact',
    itemAspectRatio: '16:9',
    moreAction: { type: 'category', pageId: 'ph-cat:' + category.id, title: category.title },
    loadAction: { type: 'custom', id: 'ph-section:' + category.id, title: category.title },
    lazy: !items.length,
    isLazy: !items.length,
    items
  };
}

function categoryPage(id, title, items, page, sortOptions, selectedSortValue) {
  return {
    pageType: 'category', id, title, style: 'media.landscapeGrid', itemAspectRatio: '16:9',
    items, page, hasMore: items.length >= 20, sortOptions, sort: sortOptions, selectedSortValue
  };
}

function categoryById(id) {
  return PH_CATEGORIES.filter(function (category) { return category.id === id; })[0];
}

function creatorFromId(id) {
  const match = stringValue(id).match(/^creator:([^:]+):(.+)$/);
  if (!match) return null;
  return PH_CREATORS.filter(function (creator) { return creator.kind === match[1] && creator.slug === match[2]; })[0] ||
    { id: match[2], title: match[2].replace(/-/g, ' '), kind: match[1], slug: match[2] };
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
  return {
    baseURL: normalizeBaseURL(params.baseURL || params.base_url || args.baseURL || args.base_url || PH_BASE),
    cookie: cleanCookie(params.Cookie || params.cookie || args.Cookie || args.cookie || ''),
    favoritesUsername: cleanText(params.favoritesUsername || params.username || args.favoritesUsername || '')
  };
}

async function requestText(url, cfg, referer) {
  const headers = {
    'User-Agent': PH_UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
    Referer: referer || cfg.baseURL + '/'
  };
  if (cfg.cookie) headers.Cookie = cfg.cookie;
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const response = await Widget.http.get(url, { headers, timeout: 30 });
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
  const headers = { 'User-Agent': PH_UA, Referer: referer || cfg.baseURL + '/' };
  if (cfg.cookie) headers.Cookie = cfg.cookie;
  return headers;
}

function playbackHeaders(cfg, referer) {
  const headers = { 'User-Agent': PH_UA, Referer: referer || cfg.baseURL + '/', Origin: originFrom(cfg.baseURL), Accept: '*/*' };
  if (cfg.cookie) headers.Cookie = cfg.cookie;
  return headers;
}

function assertAccessiblePage(html) {
  const text = stringValue(html);
  if (/elected officials|Trust and Safety measures|not available in your (?:country|region)/i.test(text)) {
    throw new Error('当前地区无法访问该站点，请更换可用站点地址或网络出口');
  }
}

function cleanCookie(value) {
  return stringValue(value).split(';').map(function (part) { return part.trim(); }).filter(function (part) {
    return /^[^=]+=.+/.test(part) && !/undefined/i.test(part);
  }).join('; ');
}

function videoURL(cfg, itemId) {
  return cfg.baseURL + '/view_video.php?viewkey=' + encodeURIComponent(itemId || '');
}

function normalizeItemId(value) {
  const text = stringValue(value);
  const payload = decodePayload(text);
  if (payload.itemId) return normalizeItemId(payload.itemId);
  const match = text.match(/[?&]viewkey=([^&]+)/i);
  if (match) return decodeURIComponentSafe(match[1]);
  if (/^[a-zA-Z0-9_-]{4,}$/.test(text) && !text.startsWith('ph-play:')) return text;
  return '';
}

function normalizeBaseURL(value) {
  const text = stringValue(value).trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(text) ? text : PH_BASE;
}

function absoluteURL(value, base) {
  const text = cleanURL(value);
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) return text;
  if (/^\/\//.test(text)) return 'https:' + text;
  try { return new URL(text, base + '/').toString(); } catch (_) { return base.replace(/\/+$/, '') + '/' + text.replace(/^\/+/, ''); }
}

function cleanURL(value) {
  let text = decodeHTMLAttribute(stringValue(value)).replace(/\\\//g, '/').replace(/\\u0026/gi, '&').trim();
  try { text = JSON.parse('"' + text.replace(/"/g, '\\"') + '"'); } catch (_) {}
  return text.replace(/^\/\//, 'https://');
}

function inferContainer(url) {
  const path = stringValue(url).split(/[?#]/)[0].toLowerCase();
  if (path.endsWith('.m3u8')) return 'm3u8';
  if (path.endsWith('.mp4')) return 'mp4';
  if (path.endsWith('.webm')) return 'webm';
  return 'auto';
}

function durationSeconds(value) {
  const parts = stringValue(value).split(':').map(function (part) { return positiveInt(part, 0); });
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

function originFrom(value) {
  const match = stringValue(value).match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : '';
}

function emptyPage(title, id) {
  return { pageType: 'category', id, title, style: 'media.landscapeGrid', itemAspectRatio: '16:9', items: [], page: 1, hasMore: false };
}

function encodePayload(payload) {
  return 'ph-play:' + encodeURIComponent(JSON.stringify(payload));
}

function decodePayload(value) {
  const text = stringValue(value);
  if (!text.startsWith('ph-play:')) return {};
  try { return JSON.parse(decodeURIComponent(text.slice(8))) || {}; } catch (_) { return {}; }
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
  return cleanText(decodeHTMLAttribute(stripTags(value)));
}

function decodeHTMLAttribute(value) {
  return stringValue(value)
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#0?39;/gi, "'").replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, function (_, code) { return String.fromCharCode(parseInt(code, 10)); })
    .replace(/&#x([0-9a-f]+);/gi, function (_, code) { return String.fromCharCode(parseInt(code, 16)); });
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
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

function decodeURIComponentSafe(value) {
  try { return decodeURIComponent(value); } catch (_) { return value; }
}

const PornhubMiniLibrary = {
  metadata: WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  getCategory,
  getDetail,
  getResourceVersions,
  resolvePlayback,
  search,
  _test: { parseVideoList, parseDetailHTML, parseVariants }
};

const __jsEvalReturn = PornhubMiniLibrary;

if (typeof globalThis !== 'undefined') {
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.PornhubMiniLibrary = PornhubMiniLibrary;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getHomeSection = getHomeSection;
  globalThis.getCategory = getCategory;
  globalThis.getDetail = getDetail;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.search = search;
}

if (typeof module !== 'undefined' && module.exports) module.exports = PornhubMiniLibrary;
