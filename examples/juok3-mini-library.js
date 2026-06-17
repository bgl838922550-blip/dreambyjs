// @name 剧OK Mini Library

const JUOK_BASE = 'https://juok3.top';
const JUOK_LOGO = JUOK_BASE + '/red.png';
const JUOK_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const WidgetMetadata = {
  id: 'baiplay_juok3_media_library',
  title: '剧OK',
  name: '剧OK',
  logo: JUOK_LOGO,
  icon: JUOK_LOGO,
  site: JUOK_BASE,
  version: '1.0.0',
  author: 'baiPlay',
  description: '剧OK自定义媒体库示例，使用站点公开 Next.js API 接入首页、分类、详情、搜索和播放解析。'
};

const JUOK_CATEGORIES = [
  { alias: 'movie', catId: 1, title: '电影', type: 'movie' },
  { alias: 'tv', catId: 2, title: '电视剧', type: 'series' },
  { alias: 'variety', catId: 3, title: '综艺', type: 'series' },
  { alias: 'anime', catId: 4, title: '动漫', type: 'series' }
];

const JUOK_SORT_OPTIONS = [
  { id: 'latest', title: '按最新', value: 'ranklatest' },
  { id: 'hot', title: '按热度', value: 'rankhot' },
  { id: 'score', title: '按评分', value: 'rankpoint' }
];

const JUOK_SITE_NAMES = {
  '1905': '1905电影网',
  qiyi: '爱奇艺',
  youku: '优酷',
  qq: '腾讯视频',
  mgtv: '芒果TV',
  imgo: '芒果TV',
  bilibili: 'B站',
  bilibili1: 'B站',
  douyin: '抖音',
  leshi: '乐视',
  le: '乐视',
  sohu: '搜狐',
  pptv: 'PPTV',
  cntv: 'CCTV',
  wasu: '华数'
};

const JUOK_SITE_PRIORITY = [
  'qiyi',
  'youku',
  'qq',
  'imgo',
  'mgtv',
  'bilibili1',
  'bilibili',
  'leshi',
  'le',
  'sohu',
  'pptv',
  '1905',
  'cntv',
  'wasu',
  'douyin'
];

const JUOK_HOME_SECTIONS = [
  {
    id: 'juok-tv-hot',
    title: '电视剧热播',
    catId: 2,
    sort: 'rankhot',
    style: 'discover.ranked'
  },
  {
    id: 'juok-movie-latest',
    title: '最新电影',
    catId: 1,
    sort: 'ranklatest',
    style: 'discover.spotlight'
  },
  {
    id: 'juok-movie-hot',
    title: '电影热榜',
    catId: 1,
    sort: 'rankhot',
    style: 'discover.ranked'
  },
  {
    id: 'juok-variety-latest',
    title: '综艺更新',
    catId: 3,
    sort: 'ranklatest',
    style: 'discover.posterCompact'
  },
  {
    id: 'juok-anime-latest',
    title: '动漫更新',
    catId: 4,
    sort: 'ranklatest',
    style: 'discover.editorial'
  }
];

function getManifest() {
  return {
    id: WidgetMetadata.id,
    name: WidgetMetadata.name,
    title: WidgetMetadata.title,
    version: WidgetMetadata.version,
    author: WidgetMetadata.author,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    site: WidgetMetadata.site,
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
      resourceMatching: false,
      resourceMatch: {
        enabled: false,
        parameters: [
          'tmdbId',
          'imdbId',
          'tvdbId',
          'title',
          'originalTitle',
          'alternativeTitles',
          'year',
          'runtimeMinutes',
          'mediaType',
          'seasonNumber',
          'episodeNumber',
          'episodeTitle',
          'episodeRuntimeMinutes'
        ]
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    }
  };
}

function getHome() {
  const hero = safeFetchHomeSlides();
  return {
    pageType: 'home',
    id: 'juok-home',
    title: '剧OK',
    heroAspectRatio: '16:9',
    hero,
    sections: [
      {
        id: 'juok-category-entry',
        title: '分类入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'juok-category-entry', title: '分类入口' },
        items: JUOK_CATEGORIES.map(function (category) {
          return categoryEntry(category, []);
        })
      }
    ].concat(
      JUOK_HOME_SECTIONS.map(function (section) {
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          lazy: true,
          promotesToHero: !!section.promotesToHero,
          loadAction: { type: 'custom', id: section.id, title: section.title },
          moreAction: categoryAction(section.catId, section.title, section.sort),
          items: []
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const sectionId = (ctx && (ctx.sectionId || ctx.id)) || '';
  if (sectionId === 'juok-category-entry') {
    return {
      id: 'juok-category-entry',
      title: '分类入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: JUOK_CATEGORIES.map(function (category) {
        const preview = fetchFilterItems(category.catId, 'rankhot', 1, 8);
        return categoryEntry(category, preview.slice(0, 6));
      })
    };
  }

  const section = findHomeSection(sectionId);
  if (!section) {
    return {
      id: sectionId || 'unknown',
      title: (ctx && ctx.title) || '媒体',
      style: (ctx && ctx.style) || 'discover.standard',
      lazy: false,
      items: []
    };
  }

  return {
    id: section.id,
    title: section.title,
    style: section.style,
    lazy: false,
    promotesToHero: !!section.promotesToHero,
    moreAction: categoryAction(section.catId, section.title, section.sort),
    items: fetchFilterItems(section.catId, section.sort, 1, 18)
  };
}

function getCategory(ext) {
  const pageId = (ext && (ext.pageId || ext.id)) || 'category:1';
  const parsed = parsePageId(pageId);
  const category = categoryByCatId(parsed.catId) || JUOK_CATEGORIES[0];
  const page = numberValue(ext && ext.page, 1);
  const sort = (ext && (ext.sort || ext.sortBy || ext.sort_by || ext.selectedSort)) || parsed.sort || 'ranklatest';
  const response = fetchFilter(category.catId, sort, page, 30);
  const items = (response.movies || []).map(function (video, index) {
    return mapVideoItem(video, category.catId, index + 1 + (page - 1) * 30);
  });
  return {
    pageType: 'category',
    id: makePageId(category.catId, sort),
    title: parsed.title || category.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items,
    sortOptions: JUOK_SORT_OPTIONS,
    selectedSortValue: sort,
    page,
    hasMore: page * 30 < numberValue(response.total, 0)
  };
}

function getDetail(ext) {
  const itemId = (ext && (ext.itemId || ext.id)) || '';
  if (isExternalId(itemId)) {
    return externalDetail(itemId);
  }

  const params = parseDetailId(itemId);
  if (!params.id || !params.cat) {
    throw new Error('剧OK详情参数无效：' + itemId);
  }

  const detail = fetchDetail(params.cat, params.id);
  return mapDetail(detail, params);
}

function getResourceVersions(ext) {
  const itemId = (ext && (ext.itemId || ext.id)) || '';
  if (isExternalId(itemId)) {
    return externalResourceGroups(itemId);
  }

  const params = parseDetailId(itemId);
  if (!params.id || !params.cat) return [];
  const detail = fetchDetail(params.cat, params.id);
  if (params.cat === 1) {
    return buildMovieResourceGroups(detail, params);
  }
  return buildEpisodeResourceGroups(detail, params, (ext && ext.episodeId) || '1');
}

function resolvePlayback(ext) {
  const direct = firstNonEmpty(ext && ext.url, ext && ext.playUrl, ext && ext.play_url);
  if (isDirectMediaURL(direct)) {
    return playback(direct);
  }

  const version = parseVersionId(ext && (ext.versionId || ext.sourceId || ext.id));
  const params = parseDetailId((ext && ext.itemId) || version.itemId || '');
  const playUrl = firstNonEmpty(direct, version.playUrl);
  if (!playUrl) {
    throw new Error('剧OK播放失败：缺少播放地址');
  }
  if (isDirectMediaURL(playUrl)) {
    return playback(playUrl);
  }

  const cat = numberValue(version.cat || params.cat, 1);
  const vodId = firstNonEmpty(version.itemId, params.id, ext && ext.itemId);
  const ep = firstNonEmpty(version.ep, ext && ext.episodeId, '1');
  const site = firstNonEmpty(version.site, '');
  const title = firstNonEmpty(version.title, '');
  const playPage = JUOK_BASE + '/play/' + cat + '/' + encodeURIComponent(vodId) + '/' + encodeURIComponent(ep) + (site ? '?s=' + encodeURIComponent(site) : '');

  try {
    requestText(playPage, { referer: JUOK_BASE + '/detail/' + cat + '/' + encodeURIComponent(vodId) });
  } catch (error) {
    // The player API usually works with the referer alone; the page visit is best effort.
  }

  const token = requestJSON(JUOK_BASE + '/api/player/token', {
    referer: playPage,
    headers: { 'Cache-Control': 'no-store' }
  });
  const tokenDisabled = token && token.disabled === true;
  const stat = {
    statVodId: vodId,
    statSource: String(cat),
    statVodName: title
  };
  const body = tokenDisabled
    ? mergeObjects({ playUrl }, stat)
    : mergeObjects(
        {
          playUrl,
          nonce: token && token.nonce,
          timestamp: token && token.timestamp,
          sig: token && token.sig
        },
        stat
      );
  const resolved = postJSON(JUOK_BASE + '/api/player/resolve', body, {
    referer: playPage,
    headers: { Origin: JUOK_BASE, 'X-Player-Request': '1' }
  });

  if (resolved && resolved.success && resolved.mode === 'direct' && resolved.encrypted) {
    const decrypted = postJSON(
      JUOK_BASE + '/api/player/decrypt',
      { encrypted: resolved.encrypted, nonce: token && token.nonce },
      { referer: playPage, headers: { Origin: JUOK_BASE, 'X-Player-Request': '1' } }
    );
    if (decrypted && decrypted.url) {
      if (isPlayerErrorURL(decrypted.url)) {
        throw new Error('剧OK播放地址解析到了站点占位视频，请切换其他线路。');
      }
      return playback(resolvePlayerURL(decrypted.url, resolved.useProxy));
    }
  }

  if (resolved && resolved.success && resolved.url) {
    if (isPlayerErrorURL(resolved.url)) {
      throw new Error('剧OK播放地址解析到了站点占位视频，请切换其他线路。');
    }
    return playback(resolvePlayerURL(resolved.url, resolved.useProxy));
  }

  throw new Error((resolved && resolved.message) || '剧OK播放地址解析失败');
}

function search(ext) {
  const query = String((ext && (ext.query || ext.text || ext.keyword)) || '').trim();
  const page = numberValue(ext && ext.page, 1);
  if (!query) {
    return { pageType: 'search', title: '搜索结果', items: [] };
  }

  const primary = fetchSearch(query, '360kan', page);
  let items = (primary.results || [])
    .map(function (item) {
      return item && (item.isExternal || item.vod_id) ? mapExternalSearchItem(item) : mapSearch360Item(item);
    })
    .filter(Boolean);
  const seen = {};
  items = items.filter(function (item) {
    const key = searchDedupeKey(item);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });

  const external = fetchSearch(query, 'dytt', page);
  const externalItems = (external.results || []).map(function (item) {
    const mapped = mapExternalSearchItem(item);
    if (mapped) {
      const key = searchDedupeKey(mapped);
      if (seen[key]) return null;
      seen[key] = true;
    }
    return mapped;
  }).filter(Boolean);

  return {
    pageType: 'search',
    title: '搜索：' + query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: items.concat(externalItems).slice(0, 30),
    page,
    hasMore: false
  };
}

function onSearch(ext) {
  return search(ext || {});
}

function getSearch(ext) {
  return search(ext || {});
}

function matchResources() {
  return { results: [] };
}

function matchMovie(ext) {
  return matchResources(ext || {});
}

function matchEpisode(ext) {
  return matchResources(ext || {});
}

function fetchFilter(catId, sort, page, size) {
  const params = [
    'catId=' + encodeURIComponent(catId),
    'sort=' + encodeURIComponent(sort || 'ranklatest'),
    'page=' + encodeURIComponent(page || 1),
    'size=' + encodeURIComponent(size || 24)
  ];
  return requestJSON(JUOK_BASE + '/api/filter?' + params.join('&'), {
    referer: JUOK_BASE + '/category/' + (categoryByCatId(catId) || JUOK_CATEGORIES[0]).alias
  });
}

function fetchFilterItems(catId, sort, page, size) {
  const response = fetchFilter(catId, sort, page, size);
  return (response.movies || []).map(function (video, index) {
    return mapVideoItem(video, catId, index + 1 + ((page || 1) - 1) * (size || 24));
  });
}

function safeFetchHero() {
  try {
    return fetchFilterItems(2, 'rankhot', 1, 6).map(function (item) {
      item.aspectRatio = '16:9';
      item.poster = item.backdrop || item.poster;
      return item;
    });
  } catch (error) {
    return [];
  }
}

function safeFetchHomeSlides() {
  try {
    const slides = fetchHomeSlides();
    if (slides.length) return slides;
  } catch (error) {
    // 首页 slides 是 SSR 数据，取不到时再退回热播，避免整个媒体库空白。
  }
  return safeFetchHero();
}

function fetchHomeSlides() {
  const html = requestText(JUOK_BASE + '/', { referer: JUOK_BASE + '/' });
  return parseHomeSlides(html).slice(0, 8);
}

function parseHomeSlides(html) {
  const text = String(html || '');
  const patterns = [
    /\\"slides\\":(\[[\s\S]*?\]),\\"autoPlay\\"/,
    /"slides":(\[[\s\S]*?\]),"autoPlay"/
  ];

  for (let index = 0; index < patterns.length; index += 1) {
    const match = patterns[index].exec(text);
    if (!match) continue;
    try {
      const jsonText = index === 0 ? decodeNextFlightJSON(match[1]) : match[1];
      const slides = JSON.parse(jsonText);
      return normalizeHomeSlides(slides);
    } catch (error) {
      // 继续尝试下一种格式。
    }
  }

  return [];
}

function decodeNextFlightJSON(value) {
  return String(value || '')
    .replace(/\\\\u([0-9a-fA-F]{4})/g, '\\u$1')
    .replace(/\\\\\//g, '/')
    .replace(/\\"/g, '"');
}

function normalizeHomeSlides(slides) {
  if (!Array.isArray(slides)) return [];
  return slides.map(function (slide, index) {
    return mapHomeSlideItem(slide, index + 1);
  }).filter(Boolean);
}

function mapHomeSlideItem(slide, rank) {
  if (!slide || typeof slide !== 'object') return null;
  const parsed = parseDetailId(slide.url || '');
  const catId = numberValue(firstNonEmpty(slide.cat, parsed.cat), 2);
  const category = categoryByCatId(catId) || JUOK_CATEGORIES[1];
  const id = firstNonEmpty(slide.id, parsed.id);
  if (!id) return null;
  const itemId = '/detail/' + catId + '/' + id;
  const title = stripTags(firstNonEmpty(slide.title, id));
  const image = imageURL(firstNonEmpty(slide.cover, slide.poster, slide.backdrop));
  return {
    id: itemId,
    title,
    subtitle: category.title,
    type: category.type,
    poster: image,
    backdrop: image,
    imageHeaders: imageHeaders(),
    overview: stripTags(slide.description || ''),
    rank,
    remarks: '首页轮播',
    metadataText: category.title,
    badges: ['首页轮播', category.title],
    aspectRatio: '16:9',
    action: {
      type: 'detail',
      itemId,
      title,
      itemAspectRatio: '16:9'
    },
    providerIds: { juok3: id }
  };
}

function fetchDetail(cat, id, site) {
  const params = ['cat=' + encodeURIComponent(cat), 'id=' + encodeURIComponent(id)];
  if (site) params.push('site=' + encodeURIComponent(site));
  const response = requestJSON(JUOK_BASE + '/api/detail?' + params.join('&'), {
    referer: JUOK_BASE + '/detail/' + encodeURIComponent(cat) + '/' + encodeURIComponent(id)
  });
  if (response && response.errno && Number(response.errno) !== 0) {
    throw new Error(response.msg || '剧OK详情接口返回错误');
  }
  if (!response || !response.data) {
    throw new Error('剧OK详情接口没有返回 data');
  }
  return response.data;
}

function fetchSearch(query, source, page) {
  try {
    return requestJSON(
      JUOK_BASE +
        '/api/search?q=' +
        encodeURIComponent(query) +
        '&source=' +
        encodeURIComponent(source || '360kan') +
        '&page=' +
        encodeURIComponent(page || 1),
      { referer: JUOK_BASE + '/search?q=' + encodeURIComponent(query) }
    );
  } catch (error) {
    return { results: [] };
  }
}

function requestJSON(url, options) {
  const response = requestRaw('GET', url, null, options || {});
  return responseToJSON(response, url);
}

function postJSON(url, body, options) {
  const response = requestRaw('POST', url, body || {}, options || {});
  return responseToJSON(response, url);
}

function requestText(url, options) {
  const response = requestRaw('GET', url, null, options || {});
  const data = response && response.data != null ? response.data : response && response.body;
  if (typeof data === 'string') return data;
  return JSON.stringify(data || {});
}

function requestRaw(method, url, body, options) {
  const headers = mergeObjects(defaultHeaders(options && options.referer), (options && options.headers) || {});
  if (method === 'POST') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.post === 'function') {
      return Widget.http.post(url, body || {}, { headers });
    }
    if (typeof $fetch !== 'undefined' && typeof $fetch.post === 'function') {
      return $fetch.post(url, body || {}, { headers });
    }
  } else {
    if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
      return Widget.http.get(url, { headers });
    }
    if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
      return $fetch.get(url, { headers });
    }
  }
  throw new Error('当前 JS 环境没有可用的 HTTP 客户端');
}

function responseToJSON(response, url) {
  if (!response) throw new Error('请求失败：' + url);
  if (response.error) throw new Error(response.error);
  const data = response.data != null ? response.data : response.body;
  if (data && typeof data === 'object') return data;
  const text = String(data || '').trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error('接口返回不是 JSON：' + url);
  }
}

function defaultHeaders(referer) {
  return {
    'User-Agent': JUOK_UA,
    Accept: 'application/json,text/plain,*/*',
    Referer: referer || JUOK_BASE + '/'
  };
}

function imageHeaders(referer) {
  return {
    'User-Agent': JUOK_UA,
    Referer: referer || JUOK_BASE + '/'
  };
}

function mapVideoItem(video, catId, rank) {
  const category = categoryByCatId(catId) || JUOK_CATEGORIES[0];
  const id = firstNonEmpty(video.ent_id, video.id);
  const year = yearFrom(firstNonEmpty(video.pubdate, video.year));
  const upinfo = episodeText(video, catId);
  const tags = normalizeStringArray(firstNonEmpty(video.moviecategory, video.tvstation)).slice(0, 3);
  const area = normalizeStringArray(video.area).join(' / ');
  const poster = imageURL(firstNonEmpty(video.cdncover, video.cover, video.cdnvcover));
  const backdrop = imageURL(firstNonEmpty(video.cdnvcover, video.cdncover, video.cover));
  return {
    id: '/detail/' + catId + '/' + id,
    title: stripTags(video.title || id),
    subtitle: firstNonEmpty(upinfo, area, category.title),
    type: category.type,
    poster,
    backdrop,
    imageHeaders: imageHeaders(),
    overview: firstNonEmpty(video.description, video.comment, video.lasttitle),
    year,
    rating: scoreValue(firstNonEmpty(video.doubanscore, video.score)),
    rank,
    remarks: firstNonEmpty(upinfo, video.tag, video.comment),
    metadataText: [year || '', area].filter(Boolean).join(' · '),
    badges: tags.concat(video.payment || video.vip ? ['VIP'] : []).slice(0, 4),
    aspectRatio: '2:3',
    action: {
      type: 'detail',
      itemId: '/detail/' + catId + '/' + id,
      title: stripTags(video.title || id),
      itemAspectRatio: '2:3'
    },
    providerIds: { juok3: id }
  };
}

function categoryEntry(category, previewItems) {
  return {
    id: makePageId(category.catId, 'ranklatest'),
    title: category.title,
    subtitle: '浏览' + category.title + '片库',
    type: 'collection',
    poster: previewItems[0] && (previewItems[0].backdrop || previewItems[0].poster),
    backdrop: previewItems[0] && (previewItems[0].backdrop || previewItems[0].poster),
    imageHeaders: imageHeaders(),
    overview: '按最新、热度和评分浏览剧OK的' + category.title + '资源。',
    metadataText: '分类入口',
    badges: ['剧OK', category.title],
    previewItems: previewItems || [],
    action: categoryAction(category.catId, category.title, 'ranklatest')
  };
}

function categoryAction(catId, title, sort) {
  return {
    type: 'category',
    pageId: makePageId(catId, sort || 'ranklatest'),
    title: title || (categoryByCatId(catId) || JUOK_CATEGORIES[0]).title,
    itemAspectRatio: '2:3'
  };
}

function mapDetail(detail, params) {
  const category = categoryByCatId(params.cat) || JUOK_CATEGORIES[0];
  const title = stripTags(detail.title || params.id);
  const poster = imageURL(firstNonEmpty(detail.cover, detail.cdncover, detail.cdnvcover));
  const backdrop = imageURL(firstNonEmpty(detail.cdnvcover, detail.cdncover, detail.cover));
  const genres = normalizeStringArray(firstNonEmpty(detail.moviecategory, detail.tvstation, detail.tag));
  const actors = normalizeStringArray(detail.actor);
  const directors = normalizeStringArray(detail.director).filter(function (name) {
    return name && name !== '未知';
  });
  const year = yearFrom(detail.pubdate);
  const result = {
    id: '/detail/' + params.cat + '/' + params.id,
    title,
    type: category.type,
    poster,
    backdrop,
    detailImageAspectRatio: '2:3',
    overview: firstNonEmpty(detail.description, detail.comment),
    year,
    rating: scoreValue(firstNonEmpty(detail.doubanscore, detail.score)),
    genres,
    studios: normalizeStringArray(detail.area),
    cast: directors
      .map(function (name) {
        return { name, role: '导演' };
      })
      .concat(
        actors.map(function (name) {
          return { name, role: '演员' };
        })
      ),
    recommendations: buildRecommendations(params.cat, params.id),
    resourceGroups: []
  };

  if (params.cat === 1) {
    result.resourceGroups = buildMovieResourceGroups(detail, params);
  } else {
    result.seasons = [buildSeason(detail, params)];
  }
  return result;
}

function buildSeason(detail, params) {
  const episodeData = bestEpisodeData(detail, params);
  const episodes = episodeData.episodes || [];
  const total = numberValue(firstNonEmpty(detail.total, detail.upinfo, episodes.length), episodes.length);
  return {
    id: 'season-1',
    title: '第 1 季',
    seasonNumber: 1,
    episodes: episodes.map(function (episode, index) {
      const number = numberValue(firstNonEmpty(episode.playlink_num, index + 1), index + 1);
      return {
        id: String(firstNonEmpty(episode.playlink_num, number)),
        title: episodeTitle(episode, number, detail),
        episodeNumber: number,
        seasonNumber: 1,
        overview: firstNonEmpty(episode.title, episode.pubdate, detail.description, detail.comment),
        poster: imageURL(firstNonEmpty(episode.cdn_v_cover, episode.v_cover, episode.cover, detail.cdncover, detail.cover)),
        imageHeaders: imageHeaders(),
        action: {
          type: 'play',
          itemId: '/detail/' + params.cat + '/' + params.id,
          episodeId: String(firstNonEmpty(episode.playlink_num, number)),
          title: episodeTitle(episode, number, detail)
        }
      };
    }),
    overview: total ? '共 ' + total + ' 集' : undefined
  };
}

function bestEpisodeData(detail, params) {
  const sites = sortSites(normalizeStringArray(detail.playlink_sites));
  let bestSite = firstSite(detail);
  let bestEpisodes =
    (detail.allepidetail && detail.allepidetail[bestSite]) ||
    detail.defaultepisode ||
    [];
  const expectedTotal = numberValue(firstNonEmpty(detail.total, detail.upinfo), 0);

  sites.forEach(function (site) {
    let siteDetail = detail;
    if (!siteDetail.allepidetail || !siteDetail.allepidetail[site]) {
      try {
        siteDetail = fetchDetail(params.cat, params.id, site);
      } catch (error) {
        siteDetail = detail;
      }
    }
    const episodes = (siteDetail.allepidetail && siteDetail.allepidetail[site]) || [];
    if (episodes.length > bestEpisodes.length) {
      bestSite = site;
      bestEpisodes = episodes;
    }
  });

  if (expectedTotal > 0 && bestEpisodes.length >= expectedTotal) {
    return { site: bestSite, episodes: bestEpisodes };
  }
  return { site: bestSite, episodes: bestEpisodes };
}

function buildRecommendations(catId, currentId) {
  try {
    const items = fetchFilterItems(catId, 'rankhot', 1, 14).filter(function (item) {
      const parsed = parseDetailId(item.id);
      return parsed.id !== currentId;
    });
    if (!items.length) return [];
    return [
      {
        id: 'juok-related',
        title: '相关推荐',
        style: 'discover.standard',
        items: items.slice(0, 12)
      }
    ];
  } catch (error) {
    return [];
  }
}

function buildMovieResourceGroups(detail, params) {
  const versions = [];
  const sites = sortSites(normalizeStringArray(detail.playlink_sites));
  const details = detail.playlinksdetail || {};
  const links = detail.playlinks || {};
  sites.forEach(function (site, index) {
    const playUrl = firstNonEmpty(details[site] && details[site].default_url, links[site]);
    if (!playUrl) return;
    versions.push({
      id: makeVersionId({
        cat: params.cat,
        itemId: params.id,
        site,
        ep: '1',
        title: detail.title,
        playUrl
      }),
      name: siteName(site),
      subtitle: site,
      container: isDirectMediaURL(playUrl) ? mediaContainer(playUrl) : undefined,
      default: index === 0,
      action: { type: 'play', versionId: '', url: playUrl }
    });
    versions[versions.length - 1].action.versionId = versions[versions.length - 1].id;
  });
  return versions.length ? [{ id: 'online', title: '在线播放', versions }] : [];
}

function buildEpisodeResourceGroups(detail, params, episodeId) {
  const versions = [];
  const sites = sortSites(normalizeStringArray(detail.playlink_sites));
  sites.forEach(function (site, index) {
    let siteDetail = detail;
    if (!siteDetail.allepidetail || !siteDetail.allepidetail[site]) {
      try {
        siteDetail = fetchDetail(params.cat, params.id, site);
      } catch (error) {
        siteDetail = detail;
      }
    }
    const episodes = (siteDetail.allepidetail && siteDetail.allepidetail[site]) || [];
    const episode =
      episodes.find(function (item) {
        return String(item.playlink_num) === String(episodeId);
      }) || episodes[0];
    const playUrl = firstNonEmpty(episode && episode.url, siteDetail.playlinks && siteDetail.playlinks[site]);
    if (!playUrl) return;
    versions.push({
      id: makeVersionId({
        cat: params.cat,
        itemId: params.id,
        site,
        ep: String(firstNonEmpty(episode && episode.playlink_num, episodeId, '1')),
        title: siteDetail.title || detail.title,
        playUrl
      }),
      name: siteName(site),
      subtitle: episode ? episodeTitle(episode, episode.playlink_num, detail) : '第 ' + episodeId + ' 集',
      container: isDirectMediaURL(playUrl) ? mediaContainer(playUrl) : undefined,
      default: index === 0,
      action: { type: 'play', versionId: '', url: playUrl }
    });
    versions[versions.length - 1].action.versionId = versions[versions.length - 1].id;
  });
  return versions.length ? [{ id: 'online', title: '在线播放', versions }] : [];
}

function mapSearch360Item(item) {
  const cat = numberValue(item.cat_id, 1);
  const id = firstNonEmpty(item.en_id, item.ent_id, item.id);
  if (!id) return null;
  const title = stripTags(firstNonEmpty(item.titleTxt, item.title, item.name));
  const type = cat === 1 ? 'movie' : 'series';
  const poster = imageURL(firstNonEmpty(item.cover, item.cdncover, item.vod_pic));
  return {
    id: '/detail/' + cat + '/' + id,
    title,
    subtitle: firstNonEmpty(item.cat_name, type === 'movie' ? '电影' : '剧集'),
    type,
    poster,
    backdrop: poster,
    imageHeaders: imageHeaders(),
    overview: item.description,
    year: yearFrom(item.year),
    rating: scoreValue(item.score),
    remarks: item.coverInfo && item.coverInfo.txt,
    metadataText: [item.year, normalizeStringArray(item.area).join(' / ')].filter(Boolean).join(' · '),
    badges: normalizeStringArray(item.tag).concat(['剧OK']).slice(0, 4),
    aspectRatio: '2:3',
    action: { type: 'detail', itemId: '/detail/' + cat + '/' + id, title, itemAspectRatio: '2:3' },
    providerIds: { juok3: id }
  };
}

function mapExternalSearchItem(item) {
  const id = externalId(item);
  const title = stripTags(item.vod_name || item.title || '');
  if (!title) return null;
  const type = externalType(item);
  const poster = imageURL(firstNonEmpty(item.vod_pic, item.cover));
  const detail = externalDetailFromSearch(item);
  storeExternalDetail(id, detail);
  return {
    id,
    title,
    subtitle: firstNonEmpty(item.sourceName, item.type_name, '外部线路'),
    type,
    poster,
    backdrop: poster,
    imageHeaders: imageHeaders(),
    overview: firstNonEmpty(item.vod_content, item.description),
    year: yearFrom(item.vod_year),
    remarks: item.vod_remarks,
    metadataText: [item.vod_year, item.vod_area].filter(Boolean).join(' · '),
    badges: [item.sourceName || item.sourceKey || 'D线路', item.type_name].filter(Boolean).slice(0, 4),
    aspectRatio: '2:3',
    action: { type: 'detail', itemId: id, title, itemAspectRatio: '2:3' },
    providerIds: { juok3External: String(item.vod_id || '') }
  };
}

function externalDetail(itemId) {
  const detail = readExternalDetail(itemId);
  if (!detail) {
    throw new Error('搜索结果缓存已失效，请重新搜索后进入详情。');
  }
  return detail;
}

function externalDetailFromSearch(item) {
  const id = externalId(item);
  const title = stripTags(item.vod_name || '');
  const type = externalType(item);
  const poster = imageURL(item.vod_pic);
  return {
    id,
    title,
    type,
    poster,
    backdrop: poster,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    detailImageAspectRatio: '2:3',
    overview: firstNonEmpty(item.vod_content, item.description, item.vod_remarks),
    year: yearFrom(item.vod_year),
    genres: [item.type_name].filter(Boolean),
    studios: [item.sourceName || item.sourceKey].filter(Boolean),
    resourceGroups: externalGroupsFromSearch(item),
    recommendations: []
  };
}

function externalResourceGroups(itemId) {
  const detail = readExternalDetail(itemId);
  return detail ? detail.resourceGroups || [] : [];
}

function externalGroupsFromSearch(item) {
  const versions = parseVodPlayURL(item.vod_play_url).map(function (entry, index) {
    return {
      id: 'external:' + String(item.sourceKey || 'dytt') + ':' + String(item.vod_id || index) + ':' + index,
      name: entry.name || '播放',
      subtitle: item.sourceName || item.vod_play_from || '外部线路',
      url: entry.url,
      container: mediaContainer(entry.url),
      default: index === 0,
      action: { type: 'play', url: entry.url }
    };
  });
  return versions.length ? [{ id: String(item.sourceKey || 'external'), title: item.sourceName || '外部线路', versions }] : [];
}

function parseVodPlayURL(value) {
  return String(value || '')
    .split('#')
    .map(function (part) {
      const trimmed = part.trim();
      if (!trimmed) return null;
      const index = trimmed.indexOf('$');
      if (index >= 0) {
        return { name: trimmed.slice(0, index), url: trimmed.slice(index + 1) };
      }
      return { name: '播放', url: trimmed };
    })
    .filter(function (entry) {
      return entry && /^https?:\/\//i.test(entry.url);
    });
}

function externalId(item) {
  return [
    'external',
    encodeURIComponent(String(item.sourceKey || 'dytt')),
    encodeURIComponent(String(item.vod_id || item.id || '')),
    encodeURIComponent(String(item.vod_name || item.title || ''))
  ].join(':');
}

function storeExternalDetail(id, detail) {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set('juok3.external.' + id, detail);
  }
}

function readExternalDetail(id) {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.get === 'function') {
    const value = Widget.storage.get('juok3.external.' + id);
    if (value && typeof value === 'object') return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        return null;
      }
    }
  }
  return null;
}

function isExternalId(value) {
  return String(value || '').indexOf('external:') === 0;
}

function externalType(item) {
  const text = String(firstNonEmpty(item.type_name, item.vod_type, item.vod_class)).toLowerCase();
  if (/电视剧|连续剧|国产剧|欧美剧|日韩剧|韩剧|日剧|泰剧|动漫|动画|综艺|短剧|番/i.test(text)) {
    return 'series';
  }
  return 'movie';
}

function makePageId(catId, sort) {
  return 'category:' + catId + ':' + (sort || 'ranklatest');
}

function parsePageId(value) {
  const text = String(value || '').trim();
  const match = /^category:(\d+)(?::([^:]+))?/.exec(text);
  if (match) {
    return { catId: Number(match[1]), sort: match[2] || 'ranklatest' };
  }
  const alias = JUOK_CATEGORIES.find(function (category) {
    return category.alias === text || '/category/' + category.alias === text;
  });
  if (alias) return { catId: alias.catId, sort: 'ranklatest', title: alias.title };
  return { catId: 1, sort: 'ranklatest' };
}

function parseDetailId(value) {
  const text = String(value || '').trim();
  const match = /^\/?detail\/(\d+)\/([^/?#]+)/.exec(text);
  if (match) {
    return { cat: Number(match[1]), id: decodeURIComponent(match[2]) };
  }
  const compact = /^(\d+)[|:](.+)$/.exec(text);
  if (compact) {
    return { cat: Number(compact[1]), id: decodeURIComponent(compact[2]) };
  }
  return { cat: 0, id: text };
}

function makeVersionId(data) {
  return [
    'play',
    encodeURIComponent(String(data.cat || '')),
    encodeURIComponent(String(data.itemId || '')),
    encodeURIComponent(String(data.site || '')),
    encodeURIComponent(String(data.ep || '')),
    encodeURIComponent(String(data.title || '')),
    encodeURIComponent(String(data.playUrl || ''))
  ].join(':');
}

function parseVersionId(value) {
  const text = String(value || '');
  if (text.indexOf('play:') !== 0) return {};
  const parts = text.split(':');
  return {
    cat: decodeURIComponent(parts[1] || ''),
    itemId: decodeURIComponent(parts[2] || ''),
    site: decodeURIComponent(parts[3] || ''),
    ep: decodeURIComponent(parts[4] || ''),
    title: decodeURIComponent(parts[5] || ''),
    playUrl: decodeURIComponent(parts.slice(6).join(':') || '')
  };
}

function categoryByCatId(catId) {
  return JUOK_CATEGORIES.find(function (category) {
    return Number(category.catId) === Number(catId);
  });
}

function findHomeSection(id) {
  return JUOK_HOME_SECTIONS.find(function (section) {
    return section.id === id;
  });
}

function categoryIdFromDetail(detail) {
  const sites = detail && detail.playlink_sites;
  if (detail && detail.moviecategory && !detail.allepidetail) return 1;
  return sites && detail && detail.defaultepisode ? 3 : 2;
}

function firstSite(detail) {
  const episodeSites = Object.keys((detail && detail.allepidetail) || {});
  if (episodeSites.length) return episodeSites[0];
  const sites = normalizeStringArray(detail.playlink_sites);
  return sortSites(sites)[0] || Object.keys(detail.playlinks || {})[0] || '';
}

function episodeTitle(episode, number, detail) {
  if (episode && episode.pubdate) return String(episode.pubdate);
  if (episode && episode.title) return stripTags(episode.title);
  const cat = categoryIdFromDetail(detail || {});
  return cat === 3 ? '第 ' + number + ' 期' : '第 ' + pad2(number) + ' 集';
}

function episodeText(video, catId) {
  if (catId === 1) return firstNonEmpty(video.tag, video.comment);
  if (catId === 3) return firstNonEmpty(video.tag, video.upinfo, video.lasttitle);
  const up = numberValue(video.upinfo, 0);
  const total = numberValue(video.total, 0);
  if (up && total && up >= total) return '全' + total + '集';
  if (up) return '更新至' + up + '集';
  if (total) return '全' + total + '集';
  return '';
}

function scoreValue(value) {
  const num = Number(value);
  if (!isFinite(num) || num <= 0) return undefined;
  return num;
}

function yearFrom(value) {
  const match = /(\d{4})/.exec(String(value || ''));
  if (!match) return undefined;
  const year = Number(match[1]);
  return year > 1800 ? year : undefined;
}

function imageURL(value) {
  const text = String(value || '').trim();
  if (!text) return undefined;
  if (/^https?:\/\//i.test(text)) return text;
  if (text.indexOf('//') === 0) return 'https:' + text;
  if (text[0] === '/') return JUOK_BASE + text;
  return text;
}

function isDirectMediaURL(url) {
  return /\.(m3u8|mp4|mkv|mov|flv)(\?|#|$)/i.test(String(url || ''));
}

function isPlayerErrorURL(url) {
  return /(^|\/)error\.(mp4|m3u8)(\?|#|$)/i.test(String(url || ''));
}

function mediaContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(String(url || ''));
  return match ? match[1].toLowerCase() : undefined;
}

function playback(url) {
  return {
    url,
    container: mediaContainer(url),
    headers: {
      'User-Agent': JUOK_UA,
      Referer: JUOK_BASE + '/'
    },
    preferDirectAVPlayer: /\.(m3u8)(\?|#|$)/i.test(String(url || ''))
  };
}

function resolvePlayerURL(url, useProxy) {
  if (!url) return '';
  if (useProxy) {
    return JUOK_BASE + '/api/player/proxy?url=' + encodeURIComponent(url);
  }
  if (String(url).charAt(0) === '/') return JUOK_BASE + url;
  return url;
}

function siteName(site) {
  return JUOK_SITE_NAMES[site] || site || '播放';
}

function sortSites(sites) {
  const priority = {};
  JUOK_SITE_PRIORITY.forEach(function (site, index) {
    priority[site] = index;
  });
  return (sites || []).slice().sort(function (a, b) {
    const left = priority[a] == null ? 999 : priority[a];
    const right = priority[b] == null ? 999 : priority[b];
    if (left !== right) return left - right;
    return String(a).localeCompare(String(b));
  });
}

function stripTags(value) {
  return decodeEntities(
    String(value || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
  ).trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/&#(\d+);/g, function (_, num) {
      return String.fromCharCode(parseInt(num, 10));
    })
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(function (item) {
      return stripTags(item);
    }).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/[,\s/|]+/)
      .map(stripTags)
      .filter(Boolean);
  }
  return [];
}

function firstNonEmpty() {
  for (let index = 0; index < arguments.length; index += 1) {
    const value = arguments[index];
    if (Array.isArray(value)) {
      if (value.length) return value;
    } else if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }
  return '';
}

function numberValue(value, fallback) {
  const num = Number(value);
  return isFinite(num) ? num : fallback;
}

function mergeObjects(a, b) {
  const result = {};
  Object.keys(a || {}).forEach(function (key) {
    if (a[key] !== undefined && a[key] !== null) result[key] = a[key];
  });
  Object.keys(b || {}).forEach(function (key) {
    if (b[key] !== undefined && b[key] !== null) result[key] = b[key];
  });
  return result;
}

function pad2(value) {
  const text = String(value);
  return text.length >= 2 ? text : '0' + text;
}

function searchDedupeKey(item) {
  return [String(item.type || ''), String(item.title || '').trim(), String(item.year || '')].join('|');
}

function home() {
  return getHome();
}

function homeSection(ext) {
  return getHomeSection(ext || {});
}

function getSection(ext) {
  return getHomeSection(ext || {});
}

function section(ext) {
  return getHomeSection(ext || {});
}

function loadSection(ext) {
  return getHomeSection(ext || {});
}

function category(ext) {
  return getCategory(ext || {});
}

function detail(ext) {
  return getDetail(ext || {});
}

function resources(ext) {
  return getResourceVersions(ext || {});
}

function getVersions(ext) {
  return getResourceVersions(ext || {});
}

function resolve(ext) {
  return resolvePlayback(ext || {});
}

function play(ext) {
  return resolvePlayback(ext || {});
}

function getCategories() {
  return JUOK_CATEGORIES.map(function (category) {
    return {
      id: makePageId(category.catId, 'ranklatest'),
      title: category.title,
      name: category.title,
      group: '剧OK',
      type: 'folder',
      kind: category.type,
      sourceId: WidgetMetadata.id
    };
  });
}

function getItems(ext) {
  return getCategory(ext || {}).items || [];
}

const Juok3MediaLibrary = {
  metadata: WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  getCategory,
  getDetail,
  getResourceVersions,
  resolvePlayback,
  search,
  getSearch,
  onSearch,
  matchResources,
  matchMovie,
  matchEpisode,
  getCategories,
  getItems,
  home,
  homeSection,
  getSection,
  section,
  loadSection,
  category,
  detail,
  resources,
  getVersions,
  resolve,
  play
};

function __jsEvalReturn() {
  return Juok3MediaLibrary;
}

if (typeof globalThis !== 'undefined') {
  globalThis.Juok3MediaLibrary = Juok3MediaLibrary;
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getHomeSection = getHomeSection;
  globalThis.getCategory = getCategory;
  globalThis.getDetail = getDetail;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.search = search;
  globalThis.getSearch = getSearch;
  globalThis.onSearch = onSearch;
  globalThis.matchResources = matchResources;
  globalThis.matchMovie = matchMovie;
  globalThis.matchEpisode = matchEpisode;
  globalThis.getCategories = getCategories;
  globalThis.getItems = getItems;
  globalThis.home = home;
  globalThis.homeSection = homeSection;
  globalThis.getSection = getSection;
  globalThis.section = section;
  globalThis.loadSection = loadSection;
  globalThis.category = category;
  globalThis.detail = detail;
  globalThis.resources = resources;
  globalThis.getVersions = getVersions;
  globalThis.resolve = resolve;
  globalThis.play = play;
  globalThis.__jsEvalReturn = __jsEvalReturn;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Juok3MediaLibrary;
}
