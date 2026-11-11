// @name 欧乐影视

const OLE_DEFAULT_SITE = 'https://www.olevod.com';
const OLE_DEFAULT_API = 'https://api.olelive.com';
const OLE_REFERER = 'https://www.olelive.com';
const OLE_STATIC = 'https://static.olelive.com/';
const OLE_ICON = 'https://www.olevod.com/favicon.ico';
const OLE_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const WidgetMetadata = {
  id: 'olevod-mini-library',
  name: '欧乐影视',
  title: '欧乐影视',
  version: '1.0.0',
  author: 'baiPlay',
  site: OLE_DEFAULT_SITE,
  logo: OLE_ICON,
  icon: OLE_ICON,
  description: '欧乐影视自定义媒体库，支持电影、剧集、综艺、动漫、短剧、搜索、详情、选集和播放解析。'
};

const OLE_CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '热门电影与高分新片', cateId: 1, mediaType: 'movie', style: 'discover.posterCompact' },
  { id: 'tv', title: '剧集', subtitle: '连续剧与热门剧集', cateId: 2, mediaType: 'series', style: 'discover.spotlight' },
  { id: 'variety', title: '综艺', subtitle: '热门综艺', cateId: 3, mediaType: 'series', style: 'discover.rankedPosterCompact' },
  { id: 'anime', title: '动漫', subtitle: '动画番剧', cateId: 4, mediaType: 'series', style: 'discover.editorial' },
  { id: 'short', title: '短剧', subtitle: '短剧片库', cateId: 14, mediaType: 'series', style: 'discover.posterCompact' }
];

const OLE_HOME_SECTIONS = [
  { id: 'ole-hot-tv', title: '热门剧集', cateId: 2, sort: 'hot', style: 'discover.spotlight', mediaType: 'series' },
  { id: 'ole-hot-movie', title: '热门电影', cateId: 1, sort: 'hot', style: 'discover.ranked', mediaType: 'movie' },
  { id: 'ole-new-movie', title: '最新电影', cateId: 1, sort: 'update', style: 'discover.posterCompact', mediaType: 'movie' },
  { id: 'ole-new-tv', title: '最新剧集', cateId: 2, sort: 'update', style: 'discover.rankedPosterCompact', mediaType: 'series' },
  { id: 'ole-anime', title: '动漫热播', cateId: 4, sort: 'hot', style: 'discover.editorial', mediaType: 'series' },
  { id: 'ole-variety', title: '综艺精选', cateId: 3, sort: 'hot', style: 'discover.posterCompact', mediaType: 'series' },
  { id: 'ole-short', title: '短剧上新', cateId: 14, sort: 'update', style: 'discover.spotlight', mediaType: 'series' }
];

const OLE_SORT_OPTIONS = [
  { id: 'hot', title: '热门', value: 'hot' },
  { id: 'score', title: '高分', value: 'score' },
  { id: 'update', title: '最新', value: 'update' },
  { id: 'desc', title: '最近添加', value: 'desc' }
];

const OLE_AREAS = [
  '0',
  '大陆',
  '香港',
  '台湾',
  '美国',
  '日本',
  '韩国',
  '英国',
  '法国',
  '德国',
  '西班牙',
  '泰国',
  '印度'
];

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
      aggregation: true,
      playbackHistory: true,
      resourceMatching: true,
      resourceMatch: {
        enabled: true,
        parameters: [
          'tmdbId',
          'imdbId',
          'tvdbId',
          'title',
          'originalTitle',
          'alternativeTitles',
          'year',
          'mediaType',
          'seasonNumber',
          'episodeNumber',
          'episodeTitle'
        ]
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true
    },
    parameters: [
      {
        name: 'ApiHost',
        title: '欧乐 API 地址',
        type: 'input',
        value: OLE_DEFAULT_API,
        required: true,
        description: '默认使用官方 API，可填写镜像 API。'
      },
      {
        name: 'Cookie',
        title: '欧乐 Cookie',
        type: 'password',
        value: '',
        required: false,
        description: '登录后复制 Cookie 可显示 VIP 资源；留空只显示免费资源。'
      }
    ]
  };
}

function getHome(ctx) {
  const args = argsify(ctx);
  const api = apiFromArgs(args);
  const hotTV = safeList(api, 2, '0', 'hot', 1, args).items;
  const hero = hotTV.slice(0, 8).map(function (item, index) {
    const heroItem = clone(item);
    heroItem.rank = index + 1;
    heroItem.aspectRatio = heroItem.backdrop && heroItem.backdrop !== heroItem.poster ? '16:9' : '2:3';
    heroItem.itemAspectRatio = heroItem.aspectRatio;
    heroItem.imageOrientation = heroItem.aspectRatio === '16:9' ? 'landscape' : 'portrait';
    return heroItem;
  });

  return {
    pageType: 'home',
    id: 'ole-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: hero.some(function (item) { return item.aspectRatio === '16:9'; }) ? '16:9' : '2:3',
    hero,
    carousel: hero,
    sections: [
      {
        id: 'ole-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'ole-channels', sectionId: 'ole-channels', title: '频道入口' },
        items: OLE_CHANNELS.map(function (channel, index) {
          return channelEntry(channel, [], index + 1);
        })
      }
    ].concat(
      OLE_HOME_SECTIONS.map(function (section) {
        const eagerItems = section.id === 'ole-hot-tv' ? hotTV.slice(0, 18) : [];
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.mediaType,
          lazy: true,
          loadAction: { type: 'custom', id: section.id, sectionId: section.id, title: section.title },
          moreAction: categoryAction(section.cateId, section.title, section.mediaType, section.sort),
          items: eagerItems
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const args = argsify(ctx);
  const api = apiFromArgs(args);
  const sectionId = stringValue(args.sectionId || args.id || args.pageId);
  if (sectionId === 'ole-channels') {
    return {
      id: 'ole-channels',
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: OLE_CHANNELS.map(function (channel, index) {
        const preview = safeList(api, channel.cateId, '0', 'hot', 1, args).items.slice(0, 6);
        return channelEntry(channel, preview, index + 1);
      })
    };
  }

  const section = findById(OLE_HOME_SECTIONS, sectionId);
  if (!section) {
    return {
      id: sectionId || 'ole-unknown-section',
      title: stringValue(args.title) || WidgetMetadata.title,
      style: stringValue(args.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }
  const list = safeList(api, section.cateId, '0', section.sort, 1, args);
  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.mediaType,
    lazy: false,
    moreAction: categoryAction(section.cateId, section.title, section.mediaType, section.sort),
    items: list.items.slice(0, 24)
  };
}

function getCategory(ctx) {
  const args = argsify(ctx);
  const api = apiFromArgs(args);
  const parsed = parsePageId(args.pageId || args.id || args.categoryId || 'type:2');
  const page = numberValue(args.page || parsed.page, 1);
  const sort = normalizeSort(args.sort || args.sortBy || args.sort_by || args.selectedSortValue || parsed.sort || 'hot');
  const area = normalizeArea(args.area || args.region || parsed.area || '0');
  const list = safeList(api, parsed.cateId, area, sort, page, args);
  return {
    pageType: 'category',
    id: makeTypePageId(parsed.cateId, sort, area),
    title: parsed.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: parsed.mediaType,
    items: list.items,
    page,
    hasMore: list.hasMore,
    sortOptions: OLE_SORT_OPTIONS,
    sort: OLE_SORT_OPTIONS,
    selectedSortValue: sort,
    filters: [
      {
        id: 'area',
        title: '地区',
        value: area,
        options: OLE_AREAS.map(function (value) {
          return { title: value === '0' ? '全部' : value, value };
        })
      }
    ]
  };
}

function getDetail(ctx) {
  const args = argsify(ctx);
  const api = apiFromArgs(args);
  const itemId = normalizeItemId(args.itemId || args.id || args.vodId);
  if (!itemId) throw new Error('欧乐影视详情参数为空');
  const raw = detailData(api, itemId, args);
  const detail = buildDetail(raw, args);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const api = apiFromArgs(args);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const itemId = normalizeItemId(args.itemId || args.id || args.vodId || decoded.itemId);
  if (!itemId) return { groups: [] };
  const detail = getCachedDetail(itemId) || buildDetail(detailData(api, itemId, args), args);
  const episode = findEpisode(detail, args.episodeId || args.episode || decoded.episodeId) || firstEpisode(detail);
  if (!episode) return { itemId: detail.id, groups: [] };
  const version = versionFromEpisode(detail, episode, true);
  return {
    itemId: detail.id,
    seasonId: 's1',
    episodeId: episode.id,
    groups: version ? [{ id: 'ole-line', title: '播放线路', versions: [version] }] : []
  };
}

function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const direct = stringValue(args.url || args.playUrl || args.videoUrl || (args.ext && args.ext.url) || decoded.url);
  if (isDirectMediaURL(direct)) return playback(direct, args);

  const api = apiFromArgs(args);
  const itemId = normalizeItemId(args.itemId || args.id || args.vodId || decoded.itemId);
  const episodeIndex = numberValue(args.episodeIndex || decoded.episodeIndex, 1);
  if (!itemId) throw new Error('欧乐影视播放失败：缺少影片参数');
  const detail = getCachedDetail(itemId) || buildDetail(detailData(api, itemId, args), args);
  const episode =
    findEpisode(detail, args.episodeId || decoded.episodeId) ||
    detailEpisodeByIndex(detail, episodeIndex) ||
    firstEpisode(detail);
  if (!episode || !episode.url) throw new Error('欧乐影视播放失败：没有可用播放地址');
  return playback(episode.url, args, episode);
}

function search(ctx) {
  const args = argsify(ctx);
  const api = apiFromArgs(args);
  const query = stringValue(args.query || args.keyword || args.text || args.wd).trim();
  const page = numberValue(args.page || args.pg, 1);
  if (!query) {
    return {
      pageType: 'search',
      id: 'ole-search',
      title: '搜索 欧乐影视',
      keyword: query,
      style: 'media.posterGrid',
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait',
      imageFit: 'fill',
      items: [],
      page,
      hasMore: false
    };
  }
  const result = searchData(api, query, page, args);
  const fallback = result.items.length ? result.items : safeList(api, 2, '0', 'hot', 1, args).items.slice(0, 12);
  return {
    pageType: 'search',
    id: 'ole-search:' + query,
    title: '搜索：' + query,
    keyword: query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items: fallback,
    page,
    hasMore: result.hasMore
  };
}

function getCategories() {
  return OLE_CHANNELS.map(function (channel) {
    return {
      id: makeTypePageId(channel.cateId, 'hot', '0'),
      title: channel.title,
      name: channel.title,
      group: '频道',
      type: 'folder',
      kind: channel.mediaType,
      mediaType: channel.mediaType,
      sourceId: WidgetMetadata.id
    };
  });
}

function getItems(ctx) {
  return getCategory(ctx || {}).items || [];
}

function home(ctx) { return getHome(ctx || {}); }
function homeSection(ctx) { return getHomeSection(ctx || {}); }
function getSection(ctx) { return getHomeSection(ctx || {}); }
function section(ctx) { return getHomeSection(ctx || {}); }
function loadSection(ctx) { return getHomeSection(ctx || {}); }
function category(ctx) { return getCategory(ctx || {}); }
function catalog(ctx) { return getCategory(ctx || {}); }
function list(ctx) { return getCategory(ctx || {}); }
function detail(ctx) { return getDetail(ctx || {}); }
function resources(ctx) { return getResourceVersions(ctx || {}); }
function getVersions(ctx) { return getResourceVersions(ctx || {}); }
function versions(ctx) { return getResourceVersions(ctx || {}); }
function getPlaySources(ctx) { return getResourceVersions(ctx || {}); }
function resolve(ctx) { return resolvePlayback(ctx || {}); }
function resolvePlay(ctx) { return resolvePlayback(ctx || {}); }
function play(ctx) { return resolvePlayback(ctx || {}); }
function getPlayinfo(ctx) { return resolvePlayback(ctx || {}); }
function getSearch(ctx) { return search(ctx || {}); }
function onSearch(ctx) { return search(ctx || {}); }
function matchResources(ctx) {
  const args = argsify(ctx);
  const titles = matchCandidateTitles(args).slice(0, 5);
  const expectedType = expectedMatchType(args);
  const targetYear = numberValue(args.year || args.releaseYear, 0);
  const targetSeasonYear = numberValue(args.seasonYear || args.targetSeasonYear, 0);
  const results = [];
  const seen = {};

  for (let index = 0; index < titles.length && results.length < 8; index += 1) {
    const page = search(Object.assign({}, args, { query: titles[index], page: 1 }));
    (page.items || []).forEach(function (item) {
      if (!item || seen[item.id]) return;
      if (expectedType && item.type !== expectedType) return;
      if ((targetYear || targetSeasonYear) && item.year &&
          (!targetYear || Math.abs(Number(item.year) - targetYear) > 1) &&
          (!targetSeasonYear || Math.abs(Number(item.year) - targetSeasonYear) > 2)) return;
      seen[item.id] = true;
      results.push(item);
    });
    if (results.length > 0) break;
  }

  return { results };
}
function matchMovie(ctx) { return matchResources(Object.assign({}, ctx || {}, { mediaType: 'movie' })); }
function matchEpisode(ctx) { return matchResources(Object.assign({}, ctx || {}, { mediaType: 'tv' })); }

function safeList(api, cateId, area, sort, page, args) {
  try {
    return listData(api, cateId, area, sort, page, args);
  } catch (error) {
    return { items: [], hasMore: false, page: page || 1, total: 0 };
  }
}

function listData(api, cateId, area, sort, page, args) {
  const pageSize = 48;
  const path = '/v1/pub/vod/list/true/3/0/' + encodeURIComponent(area || '0') + '/' + cateId + '/0/0/' + normalizeSort(sort) + '/' + numberValue(page, 1) + '/' + pageSize;
  const res = apiGet(api, path, {}, args);
  const data = res && res.data ? res.data : {};
  const list = Array.isArray(data.list) ? data.list : [];
  return {
    items: list.filter(function (raw) { return shouldShowRaw(raw, args); }).map(function (raw, index) {
      return mediaItem(raw, index + 1);
    }),
    page: numberValue(data.page || page, page || 1),
    total: numberValue(data.total, list.length),
    hasMore: numberValue(data.page || page, page || 1) * pageSize < numberValue(data.total, list.length)
  };
}

function searchData(api, query, page, args) {
  const pageSize = 48;
  const path = '/v1/pub/index/search/' + encodeURIComponent(query) + '/vod/0/' + numberValue(page, 1) + '/' + pageSize;
  const res = apiGet(api, path, {}, args);
  const data = res && res.data ? res.data : {};
  const groups = Array.isArray(data.data) ? data.data : [];
  const vod = groups.filter(function (entry) { return entry && entry.type === 'vod'; })[0];
  const list = vod && Array.isArray(vod.list) ? vod.list : [];
  const total = numberValue(vod && vod.total, list.length);
  return {
    items: list.filter(function (raw) { return shouldShowRaw(raw, args); }).map(function (raw, index) {
      return mediaItem(raw, index + 1);
    }),
    page: numberValue(vod && vod.page || page, page || 1),
    total,
    hasMore: numberValue(vod && vod.page || page, page || 1) * pageSize < total
  };
}

function detailData(api, vodId, args) {
  const res = apiGet(api, '/v1/pub/vod/detail/' + encodeURIComponent(vodId) + '/true', {}, args);
  const data = res && res.data;
  if (!data || !data.id) throw new Error('欧乐影视详情接口没有返回影片数据');
  return data;
}

function apiGet(api, path, params, args) {
  const url = buildApiURL(api, path, params);
  const response = httpGet(url, apiHeaders(args), 15);
  const data = parseJSON(responseText(response));
  if (!data || Number(data.code) !== 0) {
    throw new Error((data && (data.msg || data.message)) || '欧乐 API 返回错误');
  }
  return data;
}

function buildApiURL(api, path, params) {
  const base = normalizeAPI(api);
  const pairs = [];
  Object.keys(params || {}).forEach(function (key) {
    if (params[key] !== undefined && params[key] !== '') pairs.push([key, params[key]]);
  });
  pairs.push(['_vv', signature()]);
  const query = pairs.map(function (pair) {
    return encodeURIComponent(pair[0]) + '=' + encodeURIComponent(String(pair[1]));
  }).join('&');
  return base + path + (query ? '?' + query : '');
}

function apiHeaders(args) {
  const headers = {
    'User-Agent': OLE_UA,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Referer: OLE_REFERER,
    Origin: OLE_REFERER,
    'Content-Type': 'application/json'
  };
  const cookie = cookieFromArgs(args);
  if (cookie) headers.Cookie = cookie;
  return headers;
}

function httpGet(url, headers, timeoutSeconds) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
        return Widget.http.get(url, { headers: headers || {}, timeout: timeoutSeconds || 15 });
      }
      if (typeof $http !== 'undefined' && typeof $http.get === 'function') {
        return $http.get(url, { headers: headers || {}, timeout: timeoutSeconds || 15 });
      }
      if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
        return $fetch.get(url, { headers: headers || {}, timeout: timeoutSeconds || 15 });
      }
      if (typeof require === 'function') {
        const childProcess = require('child_process');
        const args = ['-L', '--compressed', '-sS', '--max-time', String(timeoutSeconds || 15)];
        Object.keys(headers || {}).forEach(function (key) {
          args.push('-H', key + ': ' + headers[key]);
        });
        args.push(url);
        return childProcess.execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 16 });
      }
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  throw new Error('当前环境没有可用的 HTTP GET 能力');
}

function responseText(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result.data === 'string') return result.data;
  if (result && result.data != null) return typeof result.data === 'object' ? JSON.stringify(result.data) : String(result.data);
  return String(result || '');
}

function channelEntry(channel, previewItems, rank) {
  const first = previewItems && previewItems[0];
  return {
    id: 'ole-channel-' + channel.id,
    title: channel.title,
    name: channel.title,
    subtitle: channel.subtitle,
    description: '浏览欧乐影视' + channel.title + '频道。',
    overview: '浏览欧乐影视' + channel.title + '频道。',
    type: 'collection',
    mediaType: channel.mediaType,
    poster: first && first.poster,
    cover: first && first.poster,
    backdrop: first && (first.backdrop || first.poster),
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    previewItems: previewItems || [],
    badges: [channel.title],
    rank,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: categoryAction(channel.cateId, channel.title, channel.mediaType, 'hot')
  };
}

function categoryAction(cateId, title, mediaType, sort) {
  return {
    type: 'category',
    id: makeTypePageId(cateId, sort || 'hot', '0'),
    pageId: makeTypePageId(cateId, sort || 'hot', '0'),
    title: title || titleForCate(cateId),
    contentType: mediaType || mediaTypeFromCate(cateId),
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill'
  };
}

function mediaItem(raw, rank) {
  const id = stringValue(raw && raw.id);
  const title = cleanText(raw && (raw.name || raw.title));
  const poster = imageURL(raw && (raw.picThumb || raw.pic));
  const backdrop = imageURL(raw && (raw.picSlide || raw.pic || raw.picThumb));
  const type = mediaTypeFromRaw(raw);
  const year = yearFrom(raw && raw.year);
  const rating = scoreValue(raw && (raw.douBanScore || raw.score));
  const remarks = cleanText(raw && (raw.remarks || raw.remark || raw.version));
  const subtitle = [year, raw && (raw.typeIdName || raw.typeId1Name), raw && raw.area, remarks].filter(Boolean).join(' / ');
  const overview = cleanOverview(raw && (raw.blurb || raw.content || raw.intro || raw.description));
  return {
    id,
    itemId: id,
    title,
    name: title,
    type,
    mediaType: type,
    poster,
    cover: poster,
    backdrop,
    thumb: backdrop,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    subtitle,
    description: overview || subtitle,
    overview: overview || subtitle,
    year,
    rating,
    rank,
    badges: unique([remarks, raw && raw.typeIdName, raw && raw.version, raw && raw.vip ? 'VIP' : ''].filter(Boolean)).slice(0, 3),
    remarks,
    status: remarks,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: { type: 'detail', itemId: id, id, title, itemAspectRatio: '2:3', imageOrientation: 'portrait' },
    providerIds: { olevod: id },
    ext: {
      vip: !!(raw && raw.vip)
    }
  };
}

function buildDetail(raw, args) {
  const item = mediaItem(raw, 1);
  const episodes = playableURLs(raw, args).map(function (entry, index) {
    const epIndex = numberValue(entry.index, index + 1);
    const epTitle = cleanText(entry.title) || (isMovieRaw(raw) ? '正片' : '第' + epIndex + '集');
    const episodeId = 'ep:' + raw.id + ':' + epIndex;
    return {
      id: episodeId,
      episodeId,
      title: epTitle,
      name: epTitle,
      index: epIndex,
      episodeNumber: epIndex,
      seasonNumber: 1,
      overview: epTitle,
      url: entry.url,
      vip: !!entry.vip,
      seekStart: numberValue(entry.seek_start, 0),
      seekEnd: numberValue(entry.seek_end, 0),
      action: {
        type: 'play',
        itemId: String(raw.id),
        seasonId: 's1',
        episodeId,
        versionId: encodeVersionId(raw.id, episodeId, epIndex, entry.url),
        url: entry.url,
        title: item.title + (isMovieRaw(raw) ? '' : ' ' + epTitle)
      }
    };
  });
  const type = isMovieRaw(raw) ? 'movie' : 'series';
  const cast = splitPeople(raw.actor).map(function (name) {
    return { id: 'actor:' + name, name, role: '主演', action: { type: 'search', query: name, title: name } };
  });
  const crew = splitPeople(raw.director).map(function (name) {
    return { id: 'director:' + name, name, role: '导演', job: '导演', action: { type: 'search', query: name, title: name } };
  });
  const genres = splitList(raw.class || raw.tag || raw.typeIdName);
  const detail = {
    pageType: 'detail',
    id: String(raw.id),
    itemId: String(raw.id),
    type,
    mediaType: type,
    title: item.title,
    name: item.title,
    originalTitle: cleanText(raw.en || raw.sub || ''),
    poster: item.poster,
    cover: item.poster,
    backdrop: item.backdrop || item.poster,
    thumb: item.backdrop || item.poster,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    detailImageAspectRatio: raw.picSlide ? '16:9' : '2:3',
    overview: cleanOverview(raw.content || raw.blurb || ''),
    description: cleanOverview(raw.content || raw.blurb || ''),
    year: yearFrom(raw.year),
    rating: scoreValue(raw.douBanScore || raw.score),
    score: scoreValue(raw.douBanScore || raw.score),
    runtimeMinutes: runtimeMinutes(raw.duration),
    area: cleanText(raw.area),
    country: cleanText(raw.area),
    language: cleanText(raw.lang),
    genres,
    tags: genres,
    status: cleanText(raw.remarks || raw.status || ''),
    remarks: cleanText(raw.remarks || raw.version || ''),
    cast,
    crew,
    seasons: [
      {
        id: 's1',
        title: type === 'movie' ? '正片' : '第 1 季',
        seasonNumber: 1,
        episodes
      }
    ],
    recommendations: [],
    related: [],
    resourceGroups: episodes.length ? [{ id: 'ole-line', title: '播放线路', versions: [versionFromEpisode({ id: String(raw.id), title: item.title }, episodes[0], true)] }] : [],
    providerIds: { olevod: String(raw.id) },
    ext: { rawType: raw.typeIdName, vip: !!raw.vip }
  };
  return detail;
}

function playableURLs(raw, args) {
  const hasCookie = !!cookieFromArgs(args);
  const out = [];
  (raw.urls || []).forEach(function (entry) {
    if (!entry) return;
    if (entry.vip && !hasCookie) return;
    if (entry.url) out.push(entry);
    if (hasCookie && Array.isArray(entry.vip_urls)) {
      entry.vip_urls.forEach(function (vipEntry) {
        if (vipEntry && vipEntry.url) {
          const copy = clone(vipEntry);
          copy.index = entry.index;
          copy.title = vipEntry.title || entry.title;
          out.push(copy);
        }
      });
    }
  });
  return out;
}

function versionFromEpisode(detail, episode, isDefault) {
  if (!episode || !episode.url) return null;
  const versionId = encodeVersionId(detail.id, episode.id, episode.index || episode.episodeNumber || 1, episode.url);
  return {
    id: versionId,
    title: episode.vip ? 'VIP' : '欧乐线路',
    name: episode.vip ? 'VIP' : '欧乐线路',
    subtitle: episode.title || episode.name || detail.title,
    quality: inferQuality(episode.url),
    sourceName: WidgetMetadata.title,
    availability: 'playable',
    default: !!isDefault,
    url: episode.url,
    container: inferContainer(episode.url),
    headers: playbackHeaders(episode.url),
    action: {
      type: 'play',
      itemId: detail.id,
      episodeId: episode.id,
      versionId,
      url: episode.url,
      title: detail.title + (episode.title ? ' ' + episode.title : '')
    }
  };
}

function playback(url, args, episode) {
  return {
    url,
    container: inferContainer(url) || 'm3u8',
    format: inferContainer(url) || 'm3u8',
    headers: playbackHeaders(url, args),
    isLive: false,
    streamKind: 'vod',
    startPositionSeconds: numberValue(episode && episode.seekStart, 0)
  };
}

function imageHeaders() {
  return {
    'User-Agent': OLE_UA,
    Referer: OLE_REFERER
  };
}

function playbackHeaders(url, args) {
  const headers = {
    'User-Agent': OLE_UA,
    Referer: OLE_REFERER,
    Origin: OLE_REFERER,
    Accept: '*/*'
  };
  const cookie = cookieFromArgs(args);
  if (cookie) headers.Cookie = cookie;
  return headers;
}

function signature() {
  return signatureForTime(Math.floor(Date.now() / 1000));
}

function signatureForTime(value) {
  const str = String(value);
  const rows = ['', '', '', ''];
  const mutable = rows.slice();
  for (let i = 0; i < str.length; i += 1) {
    const bits = binaryChar(str[i]);
    mutable[0] += bits.slice(2, 3);
    mutable[1] += bits.slice(3, 4);
    mutable[2] += bits.slice(4, 5);
    mutable[3] += bits.slice(5);
  }
  const hex = mutable.map(function (entry) {
    let value = parseInt(entry, 2).toString(16);
    if (value.length === 2) value = '0' + value;
    if (value.length === 1) value = '00' + value;
    if (value.length === 0) value = '000';
    return value;
  });
  const hash = md5Hex(str);
  return hash.slice(0, 3) + hex[0] + hash.slice(6, 11) + hex[1] + hash.slice(14, 19) + hex[2] + hash.slice(22, 27) + hex[3] + hash.slice(30);
}

function binaryChar(value) {
  return String(value).charCodeAt(0).toString(2);
}

function md5Hex(value) {
  const text = String(value);
  if (typeof $crypto !== 'undefined' && $crypto.md5) return String($crypto.md5(text));
  if (typeof Widget !== 'undefined' && Widget.crypto && Widget.crypto.md5) return String(Widget.crypto.md5(text));
  if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) return CryptoJS.MD5(text).toString();
  if (typeof require === 'function') return require('crypto').createHash('md5').update(text).digest('hex');
  return md5Fallback(text);
}

function md5Fallback(string) {
  function rotateLeft(lValue, iShiftBits) { return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits)); }
  function addUnsigned(lX, lY) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const result = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return result ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) return result & 0x40000000 ? result ^ 0xc0000000 ^ lX8 ^ lY8 : result ^ 0x40000000 ^ lX8 ^ lY8;
    return result ^ lX8 ^ lY8;
  }
  function f(x, y, z) { return (x & y) | (~x & z); }
  function g(x, y, z) { return (x & z) | (y & ~z); }
  function h(x, y, z) { return x ^ y ^ z; }
  function ii(x, y, z) { return y ^ (x | ~z); }
  function round(fn, a, b, c, d, x, s, ac) { a = addUnsigned(a, addUnsigned(addUnsigned(fn(b, c, d), x), ac)); return addUnsigned(rotateLeft(a, s), b); }
  function words(input) {
    const length = input.length;
    const wordCount = (((length + 8) - ((length + 8) % 64)) / 64 + 1) * 16;
    const arr = new Array(wordCount - 1);
    let byteCount = 0;
    while (byteCount < length) {
      const index = (byteCount - (byteCount % 4)) / 4;
      arr[index] = (arr[index] || 0) | (input.charCodeAt(byteCount) << ((byteCount % 4) * 8));
      byteCount += 1;
    }
    const index = (byteCount - (byteCount % 4)) / 4;
    arr[index] = (arr[index] || 0) | (0x80 << ((byteCount % 4) * 8));
    arr[wordCount - 2] = length << 3;
    arr[wordCount - 1] = length >>> 29;
    return arr;
  }
  function hex(value) {
    let out = '';
    for (let i = 0; i <= 3; i += 1) {
      const byte = (value >>> (i * 8)) & 255;
      out += ('0' + byte.toString(16)).slice(-2);
    }
    return out;
  }
  const x = words(unescape(encodeURIComponent(string)));
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;
  const s1 = [7, 12, 17, 22];
  const s2 = [5, 9, 14, 20];
  const s3 = [4, 11, 16, 23];
  const s4 = [6, 10, 15, 21];
  const k = [];
  for (let i = 0; i < 64; i += 1) k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
  for (let i = 0; i < x.length; i += 16) {
    const aa = a, bb = b, cc = c, dd = d;
    for (let j = 0; j < 64; j += 1) {
      let fn, gIndex, shift;
      if (j < 16) { fn = f; gIndex = j; shift = s1[j % 4]; }
      else if (j < 32) { fn = g; gIndex = (5 * j + 1) % 16; shift = s2[j % 4]; }
      else if (j < 48) { fn = h; gIndex = (3 * j + 5) % 16; shift = s3[j % 4]; }
      else { fn = ii; gIndex = (7 * j) % 16; shift = s4[j % 4]; }
      const temp = d;
      d = c;
      c = b;
      b = round(fn, a, b, c, temp, x[i + gIndex] || 0, shift, k[j]);
      a = temp;
    }
    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }
  return (hex(a) + hex(b) + hex(c) + hex(d)).toLowerCase();
}

function argsify(ctx) {
  if (!ctx) return {};
  if (typeof ctx === 'object') return ctx;
  if (typeof ctx === 'string') {
    try { return JSON.parse(ctx); } catch (error) { return {}; }
  }
  return {};
}

function apiFromArgs(args) {
  const value =
    (args && args.params && (args.params.ApiHost || args.params.apiHost || args.params.api)) ||
    (args && args.config && (args.config.ApiHost || args.config.apiHost || args.config.api)) ||
    (args && args.settings && (args.settings.ApiHost || args.settings.apiHost || args.settings.api)) ||
    (args && args.parameters && (args.parameters.ApiHost || args.parameters.apiHost || args.parameters.api)) ||
    args.ApiHost ||
    args.apiHost ||
    OLE_DEFAULT_API;
  return normalizeAPI(value);
}

function cookieFromArgs(args) {
  args = args || {};
  return stringValue(
    (args && args.params && (args.params.Cookie || args.params.cookie)) ||
      (args && args.config && (args.config.Cookie || args.config.cookie)) ||
      (args && args.settings && (args.settings.Cookie || args.settings.cookie)) ||
      (args && args.parameters && (args.parameters.Cookie || args.parameters.cookie)) ||
      args.Cookie ||
      args.cookie ||
      ''
  );
}

function normalizeAPI(value) {
  let api = stringValue(value || OLE_DEFAULT_API).trim();
  if (!api) api = OLE_DEFAULT_API;
  if (!/^https?:\/\//i.test(api)) api = 'https://' + api;
  return api.replace(/\/+$/, '');
}

function shouldShowRaw(raw, args) {
  if (!raw) return false;
  if (raw.vip && !cookieFromArgs(args)) return false;
  return true;
}

function parsePageId(value) {
  const raw = stringValue(value || '').replace(/^category:/, '');
  const match = /^type:(\d+)(?::sort:([^:]+))?(?::area:(.+))?$/.exec(raw) || /^(\d+)$/.exec(raw);
  const cateId = match ? Number(match[1]) : 2;
  const sort = match && match[2] ? normalizeSort(match[2]) : 'hot';
  const area = match && match[3] ? normalizeArea(decodeURIComponent(match[3])) : '0';
  return { cateId, sort, area, title: titleForCate(cateId), mediaType: mediaTypeFromCate(cateId), page: 1 };
}

function makeTypePageId(cateId, sort, area) {
  return 'type:' + String(cateId || 2) + ':sort:' + normalizeSort(sort || 'hot') + ':area:' + encodeURIComponent(normalizeArea(area || '0'));
}

function titleForCate(cateId) {
  const found = OLE_CHANNELS.filter(function (channel) { return Number(channel.cateId) === Number(cateId); })[0];
  return found ? found.title : WidgetMetadata.title;
}

function mediaTypeFromCate(cateId) {
  return Number(cateId) === 1 ? 'movie' : 'series';
}

function mediaTypeFromRaw(raw) {
  if (!raw) return 'mixed';
  if (Number(raw.typeId1) === 1 || raw.typeId1Name === '电影') return 'movie';
  return 'series';
}

function isMovieRaw(raw) {
  if (mediaTypeFromRaw(raw) === 'movie') return true;
  const urls = raw && raw.urls ? raw.urls : [];
  return urls.length === 1 && !/第\s*\d+\s*[集期话]/.test(stringValue(urls[0] && urls[0].title));
}

function normalizeSort(value) {
  const text = stringValue(value || 'hot');
  return /^(hot|score|update|desc)$/.test(text) ? text : 'hot';
}

function normalizeArea(value) {
  const text = stringValue(value || '0');
  return text || '0';
}

function normalizeItemId(value) {
  const text = stringValue(value);
  const match = /(\d+)/.exec(text);
  return match ? match[1] : text;
}

function encodeVersionId(itemId, episodeId, episodeIndex, url) {
  return ['ole', itemId || '', episodeId || '', episodeIndex || 1, encodeURIComponent(url || '')].join('|');
}

function decodeVersionId(value) {
  const parts = stringValue(value).split('|');
  if (parts[0] !== 'ole') return {};
  return { itemId: parts[1] || '', episodeId: parts[2] || '', episodeIndex: parts[3] || '', url: parts[4] ? decodeURIComponent(parts[4]) : '' };
}

function cacheGet(key) {
  try {
    if (typeof Widget !== 'undefined' && Widget.storage && Widget.storage.get) {
      const value = Widget.storage.get(key);
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  } catch (error) {}
  if (typeof globalThis !== 'undefined') {
    globalThis.__oleCache = globalThis.__oleCache || {};
    return globalThis.__oleCache[key] || null;
  }
  return null;
}

function cacheSet(key, value) {
  try {
    if (typeof Widget !== 'undefined' && Widget.storage && Widget.storage.set) {
      Widget.storage.set(key, JSON.stringify(value));
      return;
    }
  } catch (error) {}
  if (typeof globalThis !== 'undefined') {
    globalThis.__oleCache = globalThis.__oleCache || {};
    globalThis.__oleCache[key] = value;
  }
}

function cacheDetail(detail) {
  if (detail && detail.id) cacheSet('ole.detail.' + detail.id, detail);
}

function getCachedDetail(itemId) {
  return cacheGet('ole.detail.' + normalizeItemId(itemId));
}

function findEpisode(detail, episodeId) {
  const target = stringValue(episodeId);
  const episodes = detail && detail.seasons && detail.seasons[0] ? detail.seasons[0].episodes || [] : [];
  return episodes.filter(function (episode) {
    return String(episode.id) === target || String(episode.episodeId) === target || String(episode.index) === target || String(episode.episodeNumber) === target;
  })[0];
}

function detailEpisodeByIndex(detail, index) {
  const epIndex = numberValue(index, 1);
  const episodes = detail && detail.seasons && detail.seasons[0] ? detail.seasons[0].episodes || [] : [];
  return episodes.filter(function (episode) { return Number(episode.index || episode.episodeNumber) === epIndex; })[0];
}

function firstEpisode(detail) {
  return detail && detail.seasons && detail.seasons[0] && detail.seasons[0].episodes && detail.seasons[0].episodes[0];
}

function imageURL(value) {
  const url = stringValue(value).trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf('//') === 0) return 'https:' + url;
  return OLE_STATIC + url.replace(/^\/+/, '');
}

function inferContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(stringValue(url));
  if (!match) return undefined;
  const ext = match[1].toLowerCase();
  if (ext === 'm3u8') return 'm3u8';
  return ext;
}

function inferQuality(url) {
  const text = stringValue(url).toLowerCase();
  if (/2160|4k/.test(text)) return '4K';
  if (/1080/.test(text)) return '1080P';
  if (/720/.test(text)) return '720P';
  if (/m3u8/.test(text)) return 'HLS';
  return '';
}

function isDirectMediaURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts)(\?|#|$)/i.test(stringValue(url));
}

function runtimeMinutes(value) {
  const text = stringValue(value);
  const minute = /(\d+)\s*(?:分钟|分|min)/i.exec(text);
  if (minute) return Number(minute[1]);
  const num = Number(text);
  return isFinite(num) && num > 0 ? num : undefined;
}

function yearFrom(value) {
  const match = /(\d{4})/.exec(stringValue(value));
  if (!match) return undefined;
  const year = Number(match[1]);
  return year > 1900 && year < 2100 ? year : undefined;
}

function scoreValue(value) {
  const num = Number(value);
  if (!isFinite(num) || num <= 0) return undefined;
  return num;
}

function splitPeople(value) {
  const text = cleanText(value);
  if (!text) return [];
  return unique(text.split(/[\/,，、]+/).map(cleanText).filter(Boolean)).slice(0, 30);
}

function splitList(value) {
  const text = cleanText(value);
  if (!text) return [];
  return unique(text.split(/[\/,，、\s]+/).map(cleanText).filter(Boolean)).slice(0, 12);
}

function cleanOverview(value) {
  return cleanText(value).replace(/\s+/g, ' ').trim();
}

function cleanText(value) {
  return htmlDecode(stripTags(stringValue(value))).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripTags(value) {
  return stringValue(value).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, '');
}

function htmlDecode(value) {
  return stringValue(value)
    .replace(/&nbsp;/g, ' ')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseJSON(value) {
  if (value && typeof value === 'object') return value;
  try { return JSON.parse(String(value || '')); } catch (error) { throw new Error('欧乐接口响应无法解析：' + String(value || '').slice(0, 120)); }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function findById(list, id) {
  return (list || []).filter(function (entry) { return entry.id === id; })[0];
}

function unique(values) {
  const seen = {};
  const out = [];
  (values || []).forEach(function (value) {
    const text = cleanText(value);
    if (!text || seen[text]) return;
    seen[text] = true;
    out.push(text);
  });
  return out;
}

function matchCandidateTitles(ext) {
  return unique(
    []
      .concat(ext.query || ext.keyword || ext.title || ext.name || [])
      .concat(ext.originalTitle || ext.originalName || [])
      .concat(ext.alternativeTitles || [])
      .concat(ext.searchTitles || [])
      .concat(ext.titles || [])
  );
}

function expectedMatchType(ext) {
  const mediaType = stringValue(ext.mediaType || ext.type || '').toLowerCase();
  if (mediaType === 'movie') return 'movie';
  if (mediaType === 'tv' || mediaType === 'series') return 'series';
  return '';
}

function stringValue(value) {
  if (value == null) return '';
  return String(value);
}

function numberValue(value, fallback) {
  const num = Number(value);
  return isFinite(num) ? num : fallback;
}

const __oleExports = {
  WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  home,
  homeSection,
  getSection,
  section,
  loadSection,
  getCategory,
  category,
  catalog,
  list,
  getDetail,
  detail,
  getResourceVersions,
  resources,
  getVersions,
  versions,
  getPlaySources,
  resolvePlayback,
  resolve,
  resolvePlay,
  play,
  getPlayinfo,
  search,
  getSearch,
  onSearch,
  matchResources,
  matchMovie,
  matchEpisode,
  getCategories,
  getItems
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = __oleExports;
}

if (typeof globalThis !== 'undefined') {
  Object.keys(__oleExports).forEach(function (key) {
    globalThis[key] = __oleExports[key];
  });
}
