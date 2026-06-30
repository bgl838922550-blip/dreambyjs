// @name PPnix

const PPNIX_BASE = 'https://www.ppnix.com';
const PPNIX_LANG = '/cn';
const PPNIX_HOME = PPNIX_BASE + PPNIX_LANG + '/';
const PPNIX_LOGO = PPNIX_BASE + '/r/logo.png';
const PPNIX_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const WidgetMetadata = {
  id: 'ppnix-mini-library',
  name: 'PPnix',
  title: 'PPnix',
  version: '1.0.0',
  author: 'baiPlay',
  logo: PPNIX_LOGO,
  icon: PPNIX_LOGO,
  site: PPNIX_HOME,
  description:
    'PPnix 简体中文自定义媒体库，支持首页榜单、电影/电视剧分类、站内搜索、详情、选集、字幕和 HLS 播放解析。'
};

const PPNIX_CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '电影片库', path: '/cn/movie/', type: 'movie' },
  { id: 'tv', title: '电视剧', subtitle: '剧集片库', path: '/cn/tv/', type: 'series' },
  { id: 'movie-popular', title: '电影人气榜', subtitle: '按人气排序', path: '/cn/movie/----onclick.html', type: 'movie' },
  { id: 'tv-popular', title: '电视剧人气榜', subtitle: '按人气排序', path: '/cn/tv/----onclick.html', type: 'series' }
];

const PPNIX_HOME_SECTIONS = [
  {
    id: 'ppnix-now-movie',
    title: '正在上映电影',
    homeTitle: '正在上映',
    tab: 0,
    style: 'discover.posterCompact',
    contentType: 'movie',
    morePath: '/cn/movie/'
  },
  {
    id: 'ppnix-now-tv',
    title: '正在上映电视剧',
    homeTitle: '正在上映',
    tab: 1,
    style: 'discover.spotlight',
    contentType: 'series',
    morePath: '/cn/tv/'
  },
  {
    id: 'ppnix-hot-movie',
    title: '热门电影',
    homeTitle: '热门电影',
    tab: 0,
    style: 'discover.ranked',
    contentType: 'movie',
    morePath: '/cn/movie/----onclick.html'
  },
  {
    id: 'ppnix-hot-action',
    title: '动作电影',
    homeTitle: '热门电影',
    tab: 1,
    style: 'discover.spotlight',
    contentType: 'movie',
    morePath: '/cn/movie/动作----onclick.html'
  },
  {
    id: 'ppnix-hot-comedy',
    title: '喜剧电影',
    homeTitle: '热门电影',
    tab: 2,
    style: 'discover.posterCompact',
    contentType: 'movie',
    morePath: '/cn/movie/喜剧----onclick.html'
  },
  {
    id: 'ppnix-hot-scifi',
    title: '科幻电影',
    homeTitle: '热门电影',
    tab: 3,
    style: 'discover.editorial',
    contentType: 'movie',
    morePath: '/cn/movie/科幻----onclick.html'
  },
  {
    id: 'ppnix-hot-horror',
    title: '恐怖电影',
    homeTitle: '热门电影',
    tab: 4,
    style: 'discover.posterCompact',
    contentType: 'movie',
    morePath: '/cn/movie/恐怖----onclick.html'
  },
  {
    id: 'ppnix-hot-tv',
    title: '热门电视剧',
    homeTitle: '热门电视剧',
    tab: 0,
    style: 'discover.spotlight',
    contentType: 'series',
    morePath: '/cn/tv/----onclick.html'
  },
  {
    id: 'ppnix-month-rank',
    title: '本月排行榜',
    rankTitle: '本月排行榜',
    style: 'discover.rankedPosterCompact',
    contentType: 'mixed',
    morePath: '/cn/tv/----onclick.html'
  },
  {
    id: 'ppnix-movie-rank',
    title: '电影排行榜',
    rankTitle: '电影排行榜',
    style: 'discover.rankedPosterCompact',
    contentType: 'movie',
    morePath: '/cn/movie/----newstime.html'
  },
  {
    id: 'ppnix-tv-rank',
    title: '电视剧排行榜',
    rankTitle: '电视剧排行榜',
    style: 'discover.rankedPosterCompact',
    contentType: 'series',
    morePath: '/cn/tv/----newstime.html'
  }
];

const PPNIX_SORT_OPTIONS = [
  { id: 'newstime', title: '最新', value: 'newstime' },
  { id: 'onclick', title: '人气', value: 'onclick' },
  { id: 'rating', title: '评分', value: 'rating' }
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
      subtitles: true,
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
      resourceMatching: false
    }
  };
}

function getHome() {
  const html = safeFetchText('/cn/', PPNIX_HOME);
  const nowMovies = html ? parseHomeTabItems(html, '正在上映', 0, 'movie') : [];
  const nowTV = html ? parseHomeTabItems(html, '正在上映', 1, 'series') : [];
  const hotMovies = html ? parseHomeTabItems(html, '热门电影', 0, 'movie') : [];
  const hotTV = html ? parseHomeTabItems(html, '热门电视剧', 0, 'series') : [];
  const hero = dedupeItems(nowMovies.concat(nowTV).concat(hotMovies).concat(hotTV)).slice(0, 8);

  return {
    pageType: 'home',
    id: 'ppnix-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '2:3',
    hero: hero.map(function (item, index) {
      const next = cloneItem(item);
      next.rank = index + 1;
      next.aspectRatio = '2:3';
      return next;
    }),
    carousel: hero,
    sections: [
      {
        id: 'ppnix-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'ppnix-channels', title: '频道入口' },
        items: PPNIX_CHANNELS.map(function (channel, index) {
          return channelEntry(channel, [], index + 1);
        })
      },
      {
        id: 'ppnix-now-movie',
        title: '正在上映电影',
        style: 'discover.posterCompact',
        contentType: 'movie',
        lazy: false,
        moreAction: categoryAction('/cn/movie/', '正在上映电影', 'movie'),
        items: nowMovies
      },
      {
        id: 'ppnix-now-tv',
        title: '正在上映电视剧',
        style: 'discover.spotlight',
        contentType: 'series',
        lazy: false,
        moreAction: categoryAction('/cn/tv/', '正在上映电视剧', 'series'),
        items: nowTV
      },
      {
        id: 'ppnix-hot-movie',
        title: '热门电影',
        style: 'discover.ranked',
        contentType: 'movie',
        lazy: false,
        moreAction: categoryAction('/cn/movie/----onclick.html', '热门电影', 'movie'),
        items: hotMovies
      },
      {
        id: 'ppnix-hot-tv',
        title: '热门电视剧',
        style: 'discover.spotlight',
        contentType: 'series',
        lazy: false,
        moreAction: categoryAction('/cn/tv/----onclick.html', '热门电视剧', 'series'),
        items: hotTV
      }
    ].concat(
      PPNIX_HOME_SECTIONS.filter(function (section) {
        return !/^(ppnix-now-movie|ppnix-now-tv|ppnix-hot-movie|ppnix-hot-tv)$/.test(section.id);
      }).map(function (section) {
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.contentType,
          lazy: true,
          loadAction: { type: 'custom', id: section.id, title: section.title },
          moreAction: categoryAction(section.morePath, section.title, section.contentType),
          items: []
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const args = argsify(ctx);
  const sectionId = stringValue(args.sectionId || args.id);
  if (sectionId === 'ppnix-channels') {
    return {
      id: 'ppnix-channels',
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: PPNIX_CHANNELS.map(function (channel, index) {
        const preview = safeFetchList(channel.path, 1, channel.type).items.slice(0, 4);
        return channelEntry(channel, preview, index + 1);
      })
    };
  }

  const section = PPNIX_HOME_SECTIONS.filter(function (item) {
    return item.id === sectionId;
  })[0];
  if (!section) {
    return {
      id: sectionId || 'ppnix-unknown-section',
      title: args.title || 'PPnix',
      style: args.style || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  try {
    const html = fetchText('/cn/', PPNIX_HOME);
    const items = section.rankTitle
      ? parseRankItems(html, section.rankTitle, section.contentType, section.morePath).slice(0, 18)
      : parseHomeTabItems(html, section.homeTitle, section.tab || 0, section.contentType).slice(0, 18);
    return {
      id: section.id,
      title: section.title,
      style: section.style,
      contentType: section.contentType,
      lazy: false,
      moreAction: categoryAction(section.morePath, section.title, section.contentType),
      items: items
    };
  } catch (error) {
    return {
      id: section.id,
      title: section.title,
      style: section.style,
      contentType: section.contentType,
      lazy: false,
      moreAction: categoryAction(section.morePath, section.title, section.contentType),
      items: []
    };
  }
}

function getCategory(ctx) {
  const args = argsify(ctx);
  const page = numberValue(args.page, 1);
  const parsed = parsePageId(args.pageId || args.id || args.path || '/cn/movie/');
  const sort = normalizeSort(args.sort || args.sortBy || args.sort_by || args.selectedSortValue || parsed.sort || 'newstime');
  const path = pagePath(parsed.path, page, sort, parsed.sortable);
  const html = fetchText(path, PPNIX_HOME);
  const items = parsePosterItems(html, parsed.contentType || contentTypeFromPath(path));
  const title = args.title || titleFromHTML(html) || parsed.title || titleFromPath(path);

  return {
    pageType: 'category',
    id: makePageId(parsed.path),
    title: title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: parsed.contentType,
    items,
    page,
    hasMore: hasNextPage(html),
    sortOptions: parsed.sortable ? PPNIX_SORT_OPTIONS : [],
    selectedSortValue: parsed.sortable ? sort : ''
  };
}

function getDetail(ctx) {
  const args = argsify(ctx);
  const itemId = normalizeItemId(args.itemId || args.id || args.href || args.url);
  if (!itemId) throw new Error('PPnix 详情参数为空');
  const detailURL = absoluteURL(itemId);
  const html = fetchText(detailURL, PPNIX_HOME);
  const detail = parseDetail(html, itemId);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const parsedVersion = decodeVersionId(args.versionId || args.id || args.sourceId);
  const itemId = normalizeItemId(args.itemId || args.id || parsedVersion.itemId || itemIdFromInfoId(args.infoid || parsedVersion.infoid));
  const episodeId = stringValue(args.episodeId || args.episode || args.episodeNumber || parsedVersion.episodeId || parsedVersion.param || '1');
  const detail = itemId ? getCachedDetail(itemId) || getDetail({ itemId }) : null;
  if (!detail) return [];
  return buildResourceGroups(detail, episodeId);
}

function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const direct = stringValue(args.url || args.playUrl || args.play_url || args.videoUrl);
  if (isDirectMediaURL(direct)) {
    return playback(absoluteURL(direct), direct, args.itemId || PPNIX_HOME, args.title);
  }

  const parsed = decodeVersionId(args.versionId || args.id || args.sourceId || direct);
  let itemId = normalizeItemId(args.itemId || parsed.itemId || itemIdFromInfoId(args.infoid || parsed.infoid));
  let detail = itemId ? getCachedDetail(itemId) : null;
  if (!detail && itemId) detail = getDetail({ itemId });
  if (!detail && parsed.infoid) {
    detail = {
      id: itemId || '',
      title: args.title || 'PPnix',
      sourceUrl: itemId ? absoluteURL(itemId) : PPNIX_HOME,
      playbackConfig: {
        infoid: parsed.infoid,
        params: parsed.param ? [parsed.param] : [],
        subtitles: parsed.subtitles || []
      }
    };
  }
  if (!detail || !detail.playbackConfig || !detail.playbackConfig.infoid) {
    throw new Error('PPnix 播放失败：没有找到播放配置');
  }

  const infoid = stringValue(detail.playbackConfig.infoid || parsed.infoid);
  const params = detail.playbackConfig.params || [];
  const param = stringValue(args.playParam || args.param || parsed.param || episodeParamFromContext(args, params) || params[0] || '1080P');
  const playURL = PPNIX_BASE + '/info/m3u8/' + encodeURIComponent(infoid) + '/' + encodeURIComponent(param) + '.m3u8';
  const result = playback(playURL, detail.sourceUrl || absoluteURL(itemId || ''), itemId || detail.id, args.title || detail.title, buildSubtitles(detail, param));
  result.playlistText = buildPlayablePlaylistText(playURL, result.headers);
  result.playlistBaseURL = playURL;
  return result;
}

function search(ctx) {
  const args = argsify(ctx);
  const query = stringValue(args.query || args.keyword || args.text || args.wd).trim();
  const page = numberValue(args.page, 1);
  if (!query) {
    return {
      pageType: 'search',
      id: 'ppnix-search',
      title: '搜索 PPnix',
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

  const sort = normalizeSort(args.sort || args.sortBy || args.sort_by || 'default');
  const sortSuffix = sort && sort !== 'default' ? sort : '';
  const path =
    '/cn/search/' +
    encodeURIComponent(query.replace(/-/g, ' ')) +
    '--' +
    (page > 1 ? String(page - 1) : '') +
    (sortSuffix ? '-' + sortSuffix : '') +
    '.html';
  const html = fetchText(path, PPNIX_HOME);
  return {
    pageType: 'search',
    id: 'ppnix-search:' + query,
    title: '搜索：' + query,
    keyword: query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items: parsePosterItems(html, 'mixed'),
    page,
    hasMore: hasNextPage(html),
    sortOptions: [
      { id: 'default', title: '综合', value: 'default' },
      { id: 'newstime', title: '时间', value: 'newstime' },
      { id: 'onclick', title: '人气', value: 'onclick' },
      { id: 'rating', title: '评分', value: 'rating' }
    ],
    selectedSortValue: sort
  };
}

function matchResources() {
  return { results: [] };
}

function home(ctx) {
  return getHome(ctx || {});
}

function homeSection(ctx) {
  return getHomeSection(ctx || {});
}

function getSection(ctx) {
  return getHomeSection(ctx || {});
}

function section(ctx) {
  return getHomeSection(ctx || {});
}

function loadSection(ctx) {
  return getHomeSection(ctx || {});
}

function category(ctx) {
  return getCategory(ctx || {});
}

function catalog(ctx) {
  return getCategory(ctx || {});
}

function list(ctx) {
  return getCategory(ctx || {});
}

function detail(ctx) {
  return getDetail(ctx || {});
}

function resources(ctx) {
  return getResourceVersions(ctx || {});
}

function getVersions(ctx) {
  return getResourceVersions(ctx || {});
}

function versions(ctx) {
  return getResourceVersions(ctx || {});
}

function getPlaySources(ctx) {
  return getResourceVersions(ctx || {});
}

function resolve(ctx) {
  return resolvePlayback(ctx || {});
}

function resolvePlay(ctx) {
  return resolvePlayback(ctx || {});
}

function play(ctx) {
  return resolvePlayback(ctx || {});
}

function getPlayinfo(ctx) {
  return resolvePlayback(ctx || {});
}

function getSearch(ctx) {
  return search(ctx || {});
}

function onSearch(ctx) {
  return search(ctx || {});
}

function channelEntry(channel, previewItems, rank) {
  const first = previewItems && previewItems[0];
  return {
    id: 'ppnix-channel-' + channel.id,
    title: channel.title,
    name: channel.title,
    subtitle: channel.subtitle,
    description: '浏览 PPnix ' + channel.title + '内容。',
    overview: '浏览 PPnix ' + channel.title + '内容。',
    type: 'collection',
    mediaType: channel.type,
    poster: first && first.poster,
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
    action: categoryAction(channel.path, channel.title, channel.type)
  };
}

function categoryAction(path, title, contentType) {
  return {
    type: 'category',
    id: makePageId(path),
    pageId: makePageId(path),
    title: title || titleFromPath(path),
    contentType: contentType || contentTypeFromPath(path),
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait'
  };
}

function mediaItem(input) {
  const id = normalizeItemId(input.id || input.href);
  const title = cleanText(input.title || input.name);
  const type = input.type || contentTypeFromPath(id || input.href || '');
  const poster = absoluteURL(input.poster || input.cover || '');
  const backdrop = absoluteURL(input.backdrop || input.landscape || input.still || '');
  const subtitle = cleanText(input.subtitle || [input.year, input.remarks].filter(Boolean).join(' · '));
  return {
    id,
    itemId: id,
    title: title || 'PPnix',
    name: title || 'PPnix',
    type,
    mediaType: type,
    poster,
    cover: poster,
    backdrop,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    subtitle,
    description: cleanText(input.description || input.overview || subtitle),
    overview: cleanText(input.description || input.overview || subtitle),
    year: numberValue(input.year, undefined),
    rating: scoreValue(input.rating),
    rank: input.rank,
    badges: unique([input.remarks, input.year, input.rating ? String(input.rating) : ''].filter(Boolean)).slice(0, 3),
    remarks: cleanText(input.remarks),
    status: cleanText(input.remarks),
    aspectRatio: '2:3',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: {
      type: 'detail',
      id,
      itemId: id,
      title: title || 'PPnix',
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait'
    },
    providerIds: providerIdsFromItemId(id)
  };
}

function parseHomeTabItems(html, title, tabIndex, contentType) {
  const block = findHomePanel(html, title);
  if (!block) return [];
  const lists = collectListContents(block);
  return parsePosterItems(lists[tabIndex || 0] || '', contentType);
}

function parseRankItems(html, title, contentType, fallbackPath) {
  const block = findRankPanel(html, title);
  const posterIndex = buildPosterIndexFromHTML(html);
  mergePosterIndex(posterIndex, buildPosterIndexFromPath(fallbackPath, contentType));
  const items = [];
  matchAll(block, /<li\b[^>]*>\s*<span[^>]*>(\d+)<\/span>[\s\S]*?<a\b[^>]*href=["']([^"']+)["'][^>]*title=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>[\s\S]*?<time[^>]*>([\s\S]*?)<\/time>[\s\S]*?<\/li>/gi).forEach(function (match) {
    const rank = numberValue(match[1], items.length + 1);
    const href = match[2];
    const titleText = decodeEntities(match[3]);
    const date = cleanText(match[4]);
    const id = normalizeItemId(href);
    const indexed = posterIndex[id] || {};
    const poster = indexed.poster || fetchDetailPoster(id);
    const rating = indexed.rating;
    items.push(
      mediaItem({
        id: id || href,
        title: titleText,
        type: contentTypeFromPath(href) || contentType,
        poster,
        rating,
        subtitle: date,
        remarks: date,
        rank
      })
    );
  });
  return dedupeItems(items);
}

function buildPosterIndexFromHTML(html) {
  const index = {};
  parsePosterItems(html, 'mixed').forEach(function (item) {
    const id = normalizeItemId(item.id || item.itemId || '');
    if (!id || index[id]) return;
    index[id] = {
      poster: item.poster || item.cover || item.backdrop || '',
      rating: item.rating
    };
  });
  return index;
}

function buildPosterIndexFromPath(path, contentType) {
  if (!path) return {};
  try {
    const html = fetchText(path, PPNIX_HOME);
    return buildPosterIndexFromHTML(html);
  } catch (error) {
    return {};
  }
}

function mergePosterIndex(target, source) {
  Object.keys(source || {}).forEach(function (key) {
    if (!key || target[key]) return;
    target[key] = source[key];
  });
  return target;
}

function fetchDetailPoster(itemId) {
  const id = normalizeItemId(itemId);
  if (!id) return '';
  if (__ppnixPosterCache[id] !== undefined) return __ppnixPosterCache[id];
  try {
    const html = fetchText(absoluteURL(id), PPNIX_HOME);
    const poster = parseDetailPoster(html);
    __ppnixPosterCache[id] = poster;
    return poster;
  } catch (error) {
    __ppnixPosterCache[id] = '';
    return '';
  }
}

function parseDetailPoster(html) {
  const text = String(html || '');
  return absoluteURL(firstNonEmpty(
    firstMatch(text, /<header\b[^>]*class=["'][^"']*product-header[^"']*["'][^>]*>[\s\S]*?<img\b[^>]*src=["']([^"']+)["']/i),
    firstMatch(text, /<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
  ));
}

function findHomePanel(html, title) {
  const text = String(html || '');
  const titleIndex = text.indexOf('<h3>' + title + '</h3>');
  if (titleIndex < 0) return '';
  const start = text.lastIndexOf('<div class="container', titleIndex);
  const next = text.indexOf('<div class="container', titleIndex + title.length);
  return text.slice(start >= 0 ? start : titleIndex, next > titleIndex ? next : text.length);
}

function findRankPanel(html, title) {
  const text = String(html || '');
  const titleIndex = text.indexOf('<h3>' + title + '</h3>');
  if (titleIndex < 0) return '';
  const start = text.lastIndexOf('<div class="lists lists-rank', titleIndex);
  const next = text.indexOf('<div class="lists lists-rank', titleIndex + title.length);
  const nextContainer = text.indexOf('<div class="container', titleIndex + title.length);
  const end = positiveMin(next, nextContainer);
  return text.slice(start >= 0 ? start : titleIndex, end > titleIndex ? end : text.length);
}

function collectListContents(html) {
  const lists = [];
  matchAll(html, /<div\b[^>]*class=["'][^"']*lists-content[^"']*["'][^>]*>\s*<ul\b[^>]*>([\s\S]*?)<\/ul>\s*<\/div>/gi).forEach(function (match) {
    if (!/thumbnail|<li/i.test(match[1])) return;
    lists.push(match[1]);
  });
  return lists;
}

function parsePosterItems(html, contentType) {
  const items = [];
  const blocks = matchAll(String(html || ''), /<li\b[^>]*>([\s\S]*?)<\/li>/gi);
  blocks.forEach(function (match, index) {
    const block = match[1];
    const href = firstNonEmpty(
      firstMatch(block, /<a\b[^>]*class=["'][^"']*thumbnail[^"']*["'][^>]*href=["']([^"']+)["']/i),
      firstMatch(block, /<h2\b[^>]*>[\s\S]*?<a\b[^>]*href=["']([^"']+)["']/i),
      firstMatch(block, /<a\b[^>]*href=["']([^"']*\/cn\/(?:movie|tv)\/\d+\.html)["']/i)
    );
    if (!href || !/\/cn\/(?:movie|tv)\/\d+\.html/i.test(href)) return;
    const title = cleanText(
      firstNonEmpty(
        attr(firstMatch(block, /<h2\b[\s\S]*?<a\b([^>]*)>/i), 'title'),
        attr(firstMatch(block, /<img\b([^>]*)>/i), 'alt'),
        stripTags(firstMatch(block, /<h2\b[^>]*>[\s\S]*?<a\b[^>]*>([\s\S]*?)<\/a>/i))
      )
    );
    const poster = firstNonEmpty(
      attr(firstMatch(block, /<img\b([^>]*)>/i), 'data-src'),
      attr(firstMatch(block, /<img\b([^>]*)>/i), 'data-original'),
      attr(firstMatch(block, /<img\b([^>]*)>/i), 'src')
    );
    const year = yearFrom(firstNonEmpty(
      firstMatch(block, /<div\b[^>]*class=["'][^"']*countrie[^"']*["'][^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i),
      firstMatch(block, /<span\b[^>]*class=["'][^"']*orange[^"']*["'][^>]*>(\d{4})<\/span>/i)
    ));
    const note = cleanText(stripTags(firstMatch(block, /<div\b[^>]*class=["'][^"']*note[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)));
    const rating = scoreValue(stripTags(firstMatch(block, /<span\b[^>]*class=["'][^"']*rate[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)));
    items.push(
      mediaItem({
        id: href,
        title,
        poster,
        type: contentTypeFromPath(href) || contentType,
        year,
        rating,
        remarks: note,
        subtitle: [year || '', note || ''].filter(Boolean).join(' · '),
        rank: index + 1
      })
    );
  });
  return dedupeItems(items);
}

function parseDetail(html, itemId) {
  const text = String(html || '');
  const detailURL = absoluteURL(itemId);
  const config = parsePlaybackConfig(text);
  const type = contentTypeFromPath(itemId) || (config.classid === '2' ? 'series' : 'movie');
  const poster = parseDetailPoster(text);
  const titleBlock = firstMatch(text, /<h1\b[^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i);
  const year = yearFrom(firstNonEmpty(
    firstMatch(titleBlock, /<span[^>]*>\s*\((\d{4})\)\s*<\/span>/i),
    firstMatch(text, /<title>[\s\S]*?\((\d{4})\)/i)
  ));
  const rating = scoreValue(firstMatch(titleBlock, /<span\b[^>]*class=["'][^"']*rate[^"']*["'][^>]*>([\d.]+)<\/span>/i));
  const rawTitle = cleanTitle(firstNonEmpty(
    stripTags(titleBlock.replace(/<span[^>]*>\s*\(\d{4}\)\s*<\/span>/i, '').replace(/<span\b[^>]*class=["'][^"']*(?:star|rate)[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, '')),
    firstMatch(text, /<title>([\s\S]*?)\s*\(\d{4}\)\s*-\s*PPnix<\/title>/i),
    attr(firstMatch(text, /<header\b[^>]*class=["'][^"']*product-header[^"']*["'][^>]*>[\s\S]*?<img\b([^>]*)>/i), 'alt')
  ));
  const titleParts = splitDisplayTitle(rawTitle);
  const title = titleParts.title;
  const originalTitle = titleParts.originalTitle || title;
  const meta = parseProductExcerpts(text);
  const directors = parseLinkedPeople(meta['导演']);
  const actors = parseLinkedPeople(meta['主演']);
  const genres = parseLinkedTerms(meta['类型']);
  const countries = parseLinkedTerms(meta['国家']);
  const aliases = splitList(stripTags(meta['又名']));
  const overview = cleanText(stripTags(firstNonEmpty(meta['简介'], firstMatch(text, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i))));
  const params = config.params || [];
  const episodes = params.map(function (param, index) {
    const episodeIndex = numberValue(param, index + 1);
    const episodeTitle = type === 'movie' && params.length === 1 ? '正片' : '第 ' + episodeIndex + ' 集';
    const version = encodeVersionId({
      itemId,
      infoid: config.infoid,
      param,
      episodeId: String(episodeIndex),
      subtitles: config.subtitles
    });
    return {
      id: String(episodeIndex),
      episodeId: String(episodeIndex),
      title: episodeTitle,
      name: episodeTitle,
      index: episodeIndex,
      episodeNumber: episodeIndex,
      seasonNumber: 1,
      poster,
      still: poster,
      imageHeaders: imageHeaders(),
      posterHeaders: imageHeaders(),
      stillHeaders: imageHeaders(),
      action: {
        type: 'play',
        itemId,
        episodeId: String(episodeIndex),
        versionId: version,
        playParam: param,
        title: title + ' ' + episodeTitle
      }
    };
  });

  const detail = {
    pageType: 'detail',
    id: itemId,
    itemId,
    type,
    mediaType: type,
    title,
    name: title,
    originalTitle,
    poster,
    cover: poster,
    backdrop: poster,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    detailImageAspectRatio: '2:3',
    imageAspectRatio: '2:3',
    posterAspectRatio: '2:3',
    year,
    rating,
    overview,
    genres: genres.map(function (item) { return item.name; }),
    countries: countries.map(function (item) { return item.name; }),
    areas: countries.map(function (item) { return item.name; }),
    aliases,
    actors: actors.map(function (item) { return item.name; }),
    directors: directors.map(function (item) { return item.name; }),
    cast: actors.map(function (person) {
      return {
        id: person.id,
        name: person.name,
        role: '主演',
        action: person.action
      };
    }),
    crew: directors.map(function (person) {
      return {
        id: person.id,
        name: person.name,
        role: '导演',
        job: '导演',
        action: person.action
      };
    }),
    facts: [
      year ? { title: '年份', value: String(year) } : null,
      countries.length ? { title: '国家', value: countries.map(function (item) { return item.name; }).join(' / ') } : null,
      aliases.length ? { title: '又名', value: aliases.join(' / ') } : null,
      params.length ? { title: type === 'movie' ? '版本' : '集数', value: type === 'movie' ? params.join(' / ') : String(params.length) + ' 集' } : null
    ].filter(Boolean),
    seasons:
      type === 'series'
        ? [
            {
              id: 'season-1',
              title: '选集',
              index: 1,
              seasonNumber: 1,
              episodeCount: episodes.length,
              episodes
            }
          ]
        : [],
    resourceGroups: type === 'movie' ? buildResourceGroupsFromConfig(itemId, title, config, '1') : [],
    recommendations: [
      {
        id: 'ppnix-related',
        title: '为你推荐',
        style: 'discover.posterCompact',
        items: parseRecommendations(text, itemId, type).slice(0, 18)
      }
    ],
    resourceSummary: {
      versionCount: params.length || 0,
      episodeCount: type === 'series' ? params.length : 0,
      defaultVersionId: params[0]
        ? encodeVersionId({
            itemId,
            infoid: config.infoid,
            param: params[0],
            episodeId: type === 'series' ? '1' : '',
            subtitles: config.subtitles
          })
        : ''
    },
    sourceUrl: detailURL,
    source: WidgetMetadata.id,
    playbackConfig: config,
    providerIds: {
      ppnixInfoId: stringValue(config.infoid),
      ppnixClassId: stringValue(config.classid),
      ppnixPath: itemId
    }
  };
  if (config.infoid) {
    rememberInfoId(config.infoid, itemId);
  }
  return detail;
}

function parseProductExcerpts(html) {
  const meta = {};
  matchAll(html, /<div\b[^>]*class=["'][^"']*product-excerpt[^"']*["'][^>]*>\s*([^：:<]+)：\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/div>/gi).forEach(function (match) {
    meta[cleanText(match[1])] = match[2];
  });
  return meta;
}

function parseLinkedPeople(html) {
  const items = [];
  matchAll(html || '', /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi).forEach(function (match) {
    const href = normalizePath(match[1]);
    const name = cleanText(stripTags(match[2]));
    if (!name) return;
    items.push({
      id: makePageId(href),
      name,
      action: categoryAction(href, name, 'mixed')
    });
  });
  if (!items.length) {
    splitPeople(stripTags(html)).forEach(function (name) {
      items.push({ id: 'person:' + name, name, action: { type: 'search', query: name, title: name } });
    });
  }
  return items;
}

function parseLinkedTerms(html) {
  const items = [];
  matchAll(html || '', /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi).forEach(function (match) {
    const href = normalizePath(match[1]);
    const name = cleanText(stripTags(match[2]));
    if (!name) return;
    items.push({
      id: makePageId(href),
      name,
      action: categoryAction(href, name, contentTypeFromPath(href))
    });
  });
  if (!items.length) {
    splitList(stripTags(html)).forEach(function (name) {
      items.push({ id: name, name });
    });
  }
  return items;
}

function parsePlaybackConfig(html) {
  const script = firstMatch(html, /(<script>\s*classid\s*=\s*\d+;[\s\S]*?m3u8\s*=\s*\[[\s\S]*?\]\s*<\/script>)/i);
  const classid = numberValue(firstMatch(script, /classid\s*=\s*(\d+)/i), undefined);
  const classurl = firstMatch(script, /classurl\s*=\s*['"]([^'"]+)['"]/i);
  const infoid = firstMatch(script, /infoid\s*=\s*(\d+)/i);
  const sub = firstMatch(script, /sub\s*=\s*['"]([^'"]*)['"]/i);
  const listRaw = firstMatch(script, /m3u8\s*=\s*\[([\s\S]*?)\]/i);
  const params = [];
  matchAll(listRaw, /['"]([^'"]+)['"]/g).forEach(function (match) {
    params.push(match[1]);
  });
  return {
    classid,
    classurl,
    infoid,
    subtitles: String(sub || '').split('|').filter(Boolean),
    params
  };
}

function buildResourceGroups(detail, episodeId) {
  const config = detail && detail.playbackConfig;
  if (!config || !config.infoid) return [];
  return buildResourceGroupsFromConfig(detail.id || detail.itemId, detail.title, config, episodeId);
}

function buildResourceGroupsFromConfig(itemId, title, config, episodeId) {
  const params = config.params || [];
  if (!params.length) return [];
  const isSeries = contentTypeFromPath(itemId) === 'series' || String(config.classid) === '2';
  const targetEpisode = numberValue(episodeId, 1);
  const selectedParam = isSeries ? params[Math.max(0, targetEpisode - 1)] || params[0] : params[0];
  const version = {
    id: encodeVersionId({
      itemId,
      infoid: config.infoid,
      param: selectedParam,
      episodeId: isSeries ? String(targetEpisode) : '',
      subtitles: config.subtitles
    }),
    name: isSeries ? 'PPnix' : selectedParam,
    title: isSeries ? 'PPnix' : selectedParam,
    subtitle: isSeries ? '第 ' + targetEpisode + ' 集' : 'HLS',
    quality: selectedParam,
    sourceName: 'PPnix',
    availability: 'requiresResolve',
    default: true,
    playParam: selectedParam,
    action: {
      type: 'play',
      itemId,
      episodeId: isSeries ? String(targetEpisode) : '',
      versionId: encodeVersionId({
        itemId,
        infoid: config.infoid,
        param: selectedParam,
        episodeId: isSeries ? String(targetEpisode) : '',
        subtitles: config.subtitles
      }),
      playParam: selectedParam,
      title: title || 'PPnix'
    }
  };
  return [
    {
      id: 'ppnix-hls',
      title: '在线播放',
      versions: [version]
    }
  ];
}

function parseRecommendations(html, itemId, contentType) {
  const marker = String(html || '').indexOf('list-like');
  const block = marker >= 0 ? String(html || '').slice(marker) : html;
  return parsePosterItems(block, contentType).filter(function (item) {
    return item.id !== itemId;
  });
}

function buildSubtitles(detail, param) {
  const config = detail && detail.playbackConfig;
  const infoid = config && config.infoid;
  if (!infoid) return [];
  return (config.subtitles || []).map(function (language) {
    return {
      id: 'ppnix-sub-' + language,
      title: subtitleTitle(language),
      name: subtitleTitle(language),
      language: subtitleLanguage(language),
      format: 'srt',
      url: PPNIX_BASE + '/info/subtitle/' + encodeURIComponent(infoid) + '/' + encodeURIComponent(param) + '/' + encodeURIComponent(language) + '.srt',
      headers: requestHeaders(detail.sourceUrl || PPNIX_HOME, 'text')
    };
  });
}

function playback(url, referer, itemId, title, subtitles) {
  return {
    url,
    container: /\.m3u8(?:$|\?)/i.test(url) ? 'm3u8' : '',
    headers: requestHeaders(referer || PPNIX_HOME, 'hls'),
    isLive: false,
    streamKind: 'vod',
    title: title || '',
    subtitles: subtitles || [],
    providerIds: providerIdsFromItemId(itemId || '')
  };
}

function buildPlayablePlaylistText(playURL, headers) {
  const raw = fetchTextWithHeaders(playURL, headers || requestHeaders(PPNIX_HOME, 'hls'));
  if (!/^#EXTM3U/m.test(raw)) {
    throw new Error('PPnix 播放失败：接口没有返回有效的 M3U8 清单');
  }

  const fixedKey = fetchPPnixAES128Key();
  return raw
    .replace(/URI=(["'])\.\.\/key\1/gi, 'URI="' + fixedKey + '"')
    .replace(/URI=\.\.\/key(?=,|$)/gi, 'URI="' + fixedKey + '"')
    .replace(/https?:\/\/ipfs\.ppnix\.com\/ipfs\//gi, ppnixIPFSGatewayPrefix());
}

function fetchPPnixAES128Key() {
  const data = fetchTextWithHeaders(PPNIX_BASE + '/info/m3u8/key', requestHeaders(PPNIX_HOME, 'hls')).trim();
  const key = data.slice(0, 16);
  if (key.length !== 16) {
    throw new Error('PPnix 播放失败：AES-128 密钥长度异常');
  }
  return 'data:application/octet-stream,' + percentEncodeBytes(key);
}

function ppnixIPFSGatewayPrefix() {
  return 'https://' + ppnixGatewayIndex() + '.ppnix.com/ipfs/';
}

function ppnixGatewayIndex() {
  const hour = Math.floor(Date.now() / 3600000);
  return (hour % 16) + 1;
}

function percentEncodeBytes(value) {
  return String(value || '').replace(/[^A-Za-z0-9_.~-]/g, function (ch) {
    const code = ch.charCodeAt(0);
    return '%' + (code < 16 ? '0' : '') + code.toString(16).toUpperCase();
  });
}

function fetchList(path, page, contentType) {
  const parsed = parsePageId(path);
  const html = fetchText(pagePath(parsed.path, page || 1, parsed.sort || 'newstime', parsed.sortable), PPNIX_HOME);
  return {
    items: parsePosterItems(html, contentType || parsed.contentType || contentTypeFromPath(path)),
    hasMore: hasNextPage(html)
  };
}

function safeFetchList(path, page, contentType) {
  try {
    return fetchList(path, page, contentType);
  } catch (error) {
    return { items: [], hasMore: false };
  }
}

function fetchText(pathOrURL, referer) {
  const url = absoluteURL(pathOrURL || PPNIX_HOME);
  const result = Widget.http.get(url, {
    headers: requestHeaders(referer || PPNIX_HOME, 'html'),
    timeout: 20
  });
  return responseText(result);
}

function fetchTextWithHeaders(pathOrURL, headers) {
  const url = absoluteURL(pathOrURL || PPNIX_HOME);
  const result = Widget.http.get(url, {
    headers: headers || requestHeaders(PPNIX_HOME, 'html'),
    timeout: 20
  });
  return responseText(result);
}

function responseText(result) {
  const data = result && result.data;
  if (typeof data === 'string') return data;
  return JSON.stringify(data || {});
}

function safeFetchText(pathOrURL, referer) {
  try {
    return fetchText(pathOrURL, referer);
  } catch (error) {
    return '';
  }
}

function requestHeaders(referer, kind) {
  const headers = {
    'User-Agent': PPNIX_UA,
    Referer: referer || PPNIX_HOME,
    Accept: '*/*'
  };
  if (kind === 'html') {
    headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
  } else if (kind === 'hls') {
    headers.Accept = 'application/vnd.apple.mpegurl,application/x-mpegURL,text/plain,*/*';
    headers.Origin = PPNIX_BASE;
  } else if (kind === 'text') {
    headers.Accept = 'text/plain,*/*';
  }
  return headers;
}

function imageHeaders() {
  return {
    'User-Agent': PPNIX_UA,
    Referer: PPNIX_HOME
  };
}

function pagePath(path, page, sort, sortable) {
  const normalized = normalizePath(path || '/cn/movie/');
  const currentPage = Math.max(1, numberValue(page, 1));
  if (!sortable) {
    if (currentPage <= 1) return normalized;
    return injectPageNumber(normalized, currentPage);
  }
  const selectedSort = normalizeSort(sort || sortFromPath(normalized) || 'newstime');
  const base = stripSortSuffix(normalized);
  if (currentPage <= 1) {
    return applySort(base, selectedSort, 1);
  }
  return applySort(base, selectedSort, currentPage);
}

function applySort(path, sort, page) {
  const selectedSort = normalizeSort(sort || 'newstime');
  const currentPage = Math.max(1, numberValue(page, 1));
  let normalized = normalizePath(path || '/cn/movie/');
  if (/\/(?:movie|tv)\/$/i.test(normalized)) {
    normalized += '----.html';
  }
  normalized = stripSortSuffix(normalized);
  if (/----\.html$/i.test(normalized)) {
    if (currentPage <= 1) return normalized.replace(/----\.html$/i, '----' + selectedSort + '.html');
    return normalized.replace(/----\.html$/i, '---' + (currentPage - 1) + '-' + selectedSort + '.html');
  }
  if (currentPage <= 1) return normalized;
  return injectPageNumber(normalized, currentPage);
}

function injectPageNumber(path, page) {
  const currentPage = Math.max(1, numberValue(page, 1));
  if (currentPage <= 1) return path;
  if (/---\d+-(?:newstime|onclick|rating)\.html$/i.test(path)) {
    return path.replace(/---\d+-(newstime|onclick|rating)\.html$/i, '---' + (currentPage - 1) + '-$1.html');
  }
  if (/---\d+-\.html$/i.test(path)) {
    return path.replace(/---\d+-\.html$/i, '---' + (currentPage - 1) + '-.html');
  }
  if (/----(?:newstime|onclick|rating)\.html$/i.test(path)) {
    return path.replace(/----(newstime|onclick|rating)\.html$/i, '---' + (currentPage - 1) + '-$1.html');
  }
  if (/----\.html$/i.test(path)) {
    return path.replace(/----\.html$/i, '---' + (currentPage - 1) + '-.html');
  }
  if (/\/(?:movie|tv)\/$/i.test(path)) {
    return path.replace(/\/$/, '/---' + (currentPage - 1) + '-.html');
  }
  if (/--\.html$/i.test(path)) {
    return path.replace(/--\.html$/i, '--' + (currentPage - 1) + '.html');
  }
  return path;
}

function stripSortSuffix(path) {
  return normalizePath(path || '')
    .replace(/---\d+-(?:newstime|onclick|rating)\.html$/i, '----.html')
    .replace(/----(?:newstime|onclick|rating)\.html$/i, '----.html');
}

function parsePageId(value) {
  const decoded = decodePageId(value);
  const path = normalizePath(decoded || '/cn/movie/');
  const sortable = /\/cn\/(?:movie|tv)\//i.test(path);
  return {
    path,
    title: titleFromPath(path),
    contentType: contentTypeFromPath(path),
    sort: sortFromPath(path),
    sortable
  };
}

function makePageId(path) {
  return 'path:' + normalizePath(path || '/cn/movie/');
}

function decodePageId(value) {
  const raw = stringValue(value);
  if (raw.indexOf('path:') === 0) return raw.slice(5);
  return raw;
}

function normalizePath(pathOrURL) {
  const value = decodeEntities(stringValue(pathOrURL)).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) {
    const match = /^https?:\/\/[^/]+(\/[\s\S]*)$/i.exec(value);
    return match ? match[1] : '/';
  }
  if (value.indexOf('//') === 0) return 'https:' + value;
  if (value[0] === '/') return value;
  return '/' + value;
}

function normalizeItemId(value) {
  const path = normalizePath(value);
  if (/\/cn\/(?:movie|tv)\/\d+\.html/i.test(path)) return path;
  return '';
}

function absoluteURL(value) {
  const raw = decodeEntities(stringValue(value)).trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.indexOf('//') === 0) return 'https:' + raw;
  if (raw[0] === '/') return PPNIX_BASE + raw;
  return PPNIX_BASE + '/' + raw;
}

function contentTypeFromPath(path) {
  const value = stringValue(path);
  if (/\/tv\//i.test(value)) return 'series';
  if (/\/movie\//i.test(value)) return 'movie';
  return 'mixed';
}

function titleFromPath(path) {
  const value = normalizePath(path);
  if (/\/cn\/movie\/?$/i.test(value)) return '电影';
  if (/\/cn\/tv\/?$/i.test(value)) return '电视剧';
  if (/casts\/([^/]+)--/i.test(value)) return decodeURIComponent(firstMatch(value, /casts\/([^/]+)--/i) || '');
  if (/directors\/([^/]+)--/i.test(value)) return decodeURIComponent(firstMatch(value, /directors\/([^/]+)--/i) || '');
  const genre = firstMatch(value, /\/(?:movie|tv)\/([^-/]+)-/i);
  if (genre) return safeDecodeURIComponent(genre);
  return 'PPnix';
}

function titleFromHTML(html) {
  const raw = firstNonEmpty(
    firstMatch(html, /<header>\s*<h3>([\s\S]*?)<\/h3>/i),
    firstMatch(html, /<title>([\s\S]*?)\s*-\s*PPnix<\/title>/i)
  );
  return cleanText(stripTags(raw)).replace(/^"(.+)"\s*搜索结果$/, '$1');
}

function sortFromPath(path) {
  return firstMatch(path, /-(newstime|onclick|rating)\.html$/i) || '';
}

function normalizeSort(value) {
  const raw = stringValue(value).toLowerCase();
  if (/hot|popular|hits|onclick|人气|最热/.test(raw)) return 'onclick';
  if (/score|rating|rate|评分|高分/.test(raw)) return 'rating';
  if (/default|综合/.test(raw)) return 'default';
  return 'newstime';
}

function hasNextPage(html) {
  return /class=["'][^"']*next-page[^"']*["'][\s\S]*?<a\b/i.test(String(html || ''));
}

function providerIdsFromItemId(itemId) {
  const path = normalizeItemId(itemId) || stringValue(itemId);
  const infoid = firstMatch(path, /\/(?:movie|tv)\/(\d+)\.html/i);
  const ids = { ppnixPath: path };
  if (infoid) ids.ppnixInfoId = infoid;
  return ids;
}

function itemIdFromInfoId(infoid) {
  const key = stringValue(infoid);
  return (__ppnixInfoCache && __ppnixInfoCache[key]) || '';
}

let __ppnixDetailCache = {};
let __ppnixInfoCache = {};
let __ppnixPosterCache = {};

function cacheDetail(detail) {
  if (!detail || !detail.id) return;
  __ppnixDetailCache[detail.id] = detail;
  const infoid = detail.playbackConfig && detail.playbackConfig.infoid;
  if (infoid) rememberInfoId(infoid, detail.id);
}

function getCachedDetail(itemId) {
  return __ppnixDetailCache[normalizeItemId(itemId)] || null;
}

function rememberInfoId(infoid, itemId) {
  const key = stringValue(infoid);
  const id = normalizeItemId(itemId);
  if (key && id) __ppnixInfoCache[key] = id;
}

function encodeVersionId(payload) {
  return 'ppnix-version:' + encodeURIComponent(JSON.stringify(payload || {}));
}

function decodeVersionId(value) {
  const raw = stringValue(value);
  if (raw.indexOf('ppnix-version:') !== 0) return {};
  try {
    return JSON.parse(decodeURIComponent(raw.slice('ppnix-version:'.length)));
  } catch (error) {
    return {};
  }
}

function episodeParamFromContext(args, params) {
  const episode = numberValue(args.episodeId || args.episode || args.episodeNumber, 0);
  if (episode > 0 && params && params.length >= episode) return params[episode - 1];
  return '';
}

function isDirectMediaURL(url) {
  return /^https?:\/\/[\s\S]+\.(?:m3u8|mp4|mkv|mov|flv|ts|mpd)(?:$|[?#])/i.test(stringValue(url));
}

function subtitleTitle(language) {
  if (language === 'cn') return '简体中文';
  if (language === 'tw') return '繁体中文';
  if (language === 'en') return 'English';
  return language;
}

function subtitleLanguage(language) {
  if (language === 'cn') return 'zh-Hans';
  if (language === 'tw') return 'zh-Hant';
  if (language === 'en') return 'en';
  return language;
}

function cleanTitle(value) {
  return cleanText(value)
    .replace(/\s*-\s*PPnix$/i, '')
    .replace(/\s+\d(?:\.\d)?$/, '')
    .trim();
}

function splitDisplayTitle(value) {
  const title = cleanText(value);
  const match = /^([\u3400-\u9fff][\u3400-\u9fff0-9：，。、“”《》！!？?\s·\-]+?)\s+([A-Za-z][\s\S]*)$/.exec(title);
  if (!match) return { title, originalTitle: title };
  return {
    title: cleanText(match[1]),
    originalTitle: cleanText(match[2])
  };
}

function splitPeople(value) {
  return unique(
    cleanText(value)
      .split(/\s*\/\s*|,|，|、/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean)
  );
}

function splitList(value) {
  return unique(
    cleanText(value)
      .split(/\s*\/\s*|,|，|、/)
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean)
  );
}

function scoreValue(value) {
  const numeric = parseFloat(cleanText(value));
  if (!isFinite(numeric) || numeric <= 0) return undefined;
  return numeric;
}

function yearFrom(value) {
  const match = /(?:^|[^\d])((?:19|20)\d{2})(?:[^\d]|$)/.exec(stringValue(value));
  return match ? Number(match[1]) : undefined;
}

function attr(tag, name) {
  const pattern = new RegExp("\\s" + name + "\\s*=\\s*([\"'])([\\s\\S]*?)\\1", 'i');
  const match = pattern.exec(String(tag || ''));
  return match ? decodeEntities(match[2]) : '';
}

function firstMatch(value, regex) {
  const match = regex.exec(String(value || ''));
  return match ? match[1] || '' : '';
}

function matchAll(value, regex) {
  const out = [];
  let match;
  const source = String(value || '');
  const flags = regex.flags.indexOf('g') >= 0 ? regex.flags : regex.flags + 'g';
  const pattern = new RegExp(regex.source, flags);
  while ((match = pattern.exec(source))) {
    out.push(match);
    if (match.index === pattern.lastIndex) pattern.lastIndex += 1;
  }
  return out;
}

function firstNonEmpty() {
  for (let i = 0; i < arguments.length; i += 1) {
    const value = arguments[i];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return '';
}

function cleanText(value) {
  return decodeEntities(String(value || '').replace(/&nbsp;/g, ' ')).replace(/\s+/g, ' ').trim();
}

function stripTags(value) {
  return decodeEntities(String(value || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' '));
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/&#(\d+);/g, function (_, code) {
      return String.fromCharCode(parseInt(code, 10));
    })
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(String(value || ''));
  } catch (error) {
    return String(value || '');
  }
}

function stringValue(value) {
  if (value === undefined || value === null) return '';
  return String(value);
}

function numberValue(value, fallback) {
  const number = Number(value);
  return isFinite(number) ? number : fallback;
}

function unique(items) {
  const seen = {};
  const out = [];
  (items || []).forEach(function (item) {
    const key = String(item || '').trim();
    if (!key || seen[key]) return;
    seen[key] = true;
    out.push(item);
  });
  return out;
}

function dedupeItems(items) {
  const seen = {};
  const out = [];
  (items || []).forEach(function (item) {
    const key = item && (item.id || item.itemId || item.title);
    if (!key || seen[key]) return;
    seen[key] = true;
    out.push(item);
  });
  return out;
}

function cloneItem(item) {
  try {
    return JSON.parse(JSON.stringify(item || {}));
  } catch (error) {
    return item || {};
  }
}

function positiveMin(a, b) {
  if (a < 0) return b;
  if (b < 0) return a;
  return Math.min(a, b);
}

function argsify(ctx) {
  if (!ctx) return {};
  if (typeof ctx === 'string') {
    try {
      return JSON.parse(ctx);
    } catch (error) {
      return {};
    }
  }
  return ctx;
}
