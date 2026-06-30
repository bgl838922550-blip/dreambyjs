// @name 在线之家

const ZXZJ_BASE = 'https://www.zxzj.run';
const ZXZJ_LOGO = ZXZJ_BASE + '/statics/img/logo.png';
const ZXZJ_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const WidgetMetadata = {
  id: 'zxzj-mini-library',
  name: '在线之家',
  title: '在线之家',
  version: '1.0.0',
  author: 'baiPlay',
  logo: ZXZJ_LOGO,
  icon: ZXZJ_LOGO,
  site: ZXZJ_BASE,
  description: '在线之家自定义媒体库，支持电影、美剧、韩剧、日剧、泰剧、动漫、搜索、详情、选集、线路和播放解析。'
};

const ZXZJ_CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '热门电影', path: '/vodtype/1.html', typeId: 1, mediaType: 'movie' },
  { id: 'us', title: '美剧', subtitle: '欧美剧集', path: '/vodtype/2.html', typeId: 2, mediaType: 'series' },
  { id: 'kr', title: '韩剧', subtitle: '韩国剧集', path: '/vodtype/3.html', typeId: 3, mediaType: 'series' },
  { id: 'jp', title: '日剧', subtitle: '日本剧集', path: '/vodtype/4.html', typeId: 4, mediaType: 'series' },
  { id: 'thai', title: '泰剧', subtitle: '泰国剧集', path: '/vodtype/5.html', typeId: 5, mediaType: 'series' },
  { id: 'anime', title: '动漫', subtitle: '动画番剧', path: '/vodtype/6.html', typeId: 6, mediaType: 'series' }
];

const ZXZJ_HOME_SECTIONS = [
  {
    id: 'zxzj-home-latest',
    title: '最近更新',
    source: 'home:first',
    style: 'discover.spotlight',
    contentType: 'mixed',
    morePath: '/'
  },
  {
    id: 'zxzj-movie',
    title: '电影',
    source: 'home:电影',
    path: '/vodtype/1.html',
    style: 'discover.posterCompact',
    contentType: 'movie'
  },
  {
    id: 'zxzj-us',
    title: '美剧',
    source: 'home:美剧',
    path: '/vodtype/2.html',
    style: 'discover.spotlight',
    contentType: 'series'
  },
  {
    id: 'zxzj-kr',
    title: '韩剧',
    source: 'home:韩剧',
    path: '/vodtype/3.html',
    style: 'discover.rankedPosterCompact',
    contentType: 'series'
  },
  {
    id: 'zxzj-jp',
    title: '日剧',
    source: 'home:日剧',
    path: '/vodtype/4.html',
    style: 'discover.editorial',
    contentType: 'series'
  },
  {
    id: 'zxzj-thai',
    title: '泰剧',
    source: 'home:泰剧',
    path: '/vodtype/5.html',
    style: 'discover.posterCompact',
    contentType: 'series'
  },
  {
    id: 'zxzj-anime',
    title: '动漫',
    source: 'home:动漫',
    path: '/vodtype/6.html',
    style: 'discover.ranked',
    contentType: 'series'
  }
];

const ZXZJ_SORT_OPTIONS = [
  { id: 'time', title: '最新', value: 'time' },
  { id: 'hits', title: '最热', value: 'hits' },
  { id: 'score', title: '评分', value: 'score' }
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
          'title',
          'originalTitle',
          'alternativeTitles',
          'year',
          'mediaType',
          'seasonNumber',
          'episodeNumber'
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

function getHome(ctx) {
  const html = safeFetchText('/', ZXZJ_BASE + '/');
  const latest = html ? parseFirstVodList(html, 'mixed').slice(0, 12) : [];
  const hero = latest.slice(0, 8).map(function (item, index) {
    const next = cloneItem(item);
    next.rank = index + 1;
    next.aspectRatio = '2:3';
    return next;
  });

  return {
    pageType: 'home',
    id: 'zxzj-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '2:3',
    hero,
    carousel: hero,
    sections: [
      {
        id: 'zxzj-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'zxzj-channels', sectionId: 'zxzj-channels', title: '频道入口' },
        items: ZXZJ_CHANNELS.map(function (channel, index) {
          return channelEntry(channel, [], index + 1);
        })
      }
    ].concat(
      ZXZJ_HOME_SECTIONS.map(function (section) {
        const eagerItems = section.id === 'zxzj-home-latest' ? latest : [];
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.contentType,
          lazy: true,
          promotesToHero: section.id === 'zxzj-home-latest',
          loadAction: { type: 'custom', id: section.id, sectionId: section.id, title: section.title },
          moreAction: categoryAction(section.path || section.morePath || '/', section.title, section.contentType),
          items: eagerItems
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const args = argsify(ctx);
  const sectionId = stringValue(args.sectionId || args.id || args.pageId);

  if (sectionId === 'zxzj-channels') {
    return {
      id: 'zxzj-channels',
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: ZXZJ_CHANNELS.map(function (channel, index) {
        const preview = safeFetchList(channel.path, 1, channel.mediaType).items.slice(0, 6);
        return channelEntry(channel, preview, index + 1);
      })
    };
  }

  const section = findById(ZXZJ_HOME_SECTIONS, sectionId);
  if (!section) {
    return {
      id: sectionId || 'zxzj-unknown-section',
      title: stringValue(args.title) || WidgetMetadata.title,
      style: stringValue(args.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  let items = [];
  if (section.source && section.source.indexOf('home:') === 0) {
    const html = safeFetchText('/', ZXZJ_BASE + '/');
    const sourceName = section.source.slice('home:'.length);
    items =
      sourceName === 'first'
        ? parseFirstVodList(html, section.contentType)
        : parseHomePanelItems(html, sourceName, section.contentType);
  }
  if (!items.length && section.path) items = safeFetchList(section.path, 1, section.contentType).items;

  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.contentType,
    lazy: false,
    promotesToHero: section.id === 'zxzj-home-latest',
    moreAction: categoryAction(section.path || section.morePath || '/', section.title, section.contentType),
    items: items.slice(0, 18)
  };
}

function getCategory(ctx) {
  const args = argsify(ctx);
  const page = numberValue(args.page, 1);
  const parsed = parsePageId(args.pageId || args.id || args.categoryId || args.path || '/');
  const sort = normalizeSort(args.sort || args.sortBy || args.sort_by || args.selectedSortValue || parsed.sort || 'time');

  if (parsed.query) {
    const result = search({ query: parsed.query, page });
    return {
      pageType: 'category',
      id: makePageId('query:' + parsed.query),
      title: parsed.query,
      style: 'media.posterGrid',
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait',
      imageFit: 'fill',
      items: result.items,
      page,
      hasMore: result.hasMore,
      sortOptions: [],
      selectedSortValue: ''
    };
  }

  let path = parsed.path || '/';
  if (path !== '/' && parsed.sortable !== false) path = applySort(path, sort);
  const list = fetchList(path, page, parsed.contentType || contentTypeFromPath(path));

  return {
    pageType: 'category',
    id: makePageId(parsed.path || path),
    title: stringValue(args.title) || parsed.title || titleFromPath(path) || WidgetMetadata.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: parsed.contentType || contentTypeFromPath(path),
    items: list.items,
    page,
    hasMore: list.hasMore,
    sortOptions: path === '/' || parsed.sortable === false ? [] : ZXZJ_SORT_OPTIONS,
    selectedSortValue: path === '/' || parsed.sortable === false ? '' : sort
  };
}

function getDetail(ctx) {
  const args = argsify(ctx);
  const itemId = normalizeItemId(args.itemId || args.id || args.href || args.url);
  if (!itemId) throw new Error('在线之家详情参数为空');
  const detailURL = absoluteURL(itemId);
  const html = fetchText(detailURL, ZXZJ_BASE + '/');
  const detail = parseDetail(html, itemId);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const parsed = decodeVersionId(args.versionId || args.id || args.sourceId);
  const itemId = normalizeItemId(args.itemId || parsed.itemId || itemIdFromPlayPage(args.playPage || parsed.playPage));
  const episodeId = stringValue(args.episodeId || args.episode || args.episodeNumber || parsed.episodeId || '1');
  const detail = itemId ? getCachedDetail(itemId) || getDetail({ itemId }) : null;
  if (!detail) return [];
  return buildResourceGroups(detail, episodeId);
}

function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const direct = stringValue(args.url || args.playUrl || args.play_url || args.videoUrl);
  if (isDirectMediaURL(direct)) return playback(absoluteMediaURL(direct), args.referer || args.sourceUrl || ZXZJ_BASE + '/');

  const parsed = decodeVersionId(args.versionId || args.id || args.sourceId || direct);
  let playPage = stringValue(args.playPage || args.href || (args.ext && args.ext.playPage) || parsed.playPage);
  const itemId = normalizeItemId(args.itemId || parsed.itemId || itemIdFromPlayPage(playPage));
  const episodeId = stringValue(args.episodeId || parsed.episodeId || '1');
  if (!playPage && itemId) {
    const detail = getCachedDetail(itemId) || getDetail({ itemId });
    const groups = buildResourceGroups(detail, episodeId);
    const firstVersion = groups[0] && groups[0].versions && groups[0].versions[0];
    playPage = firstVersion && firstVersion.playPage;
  }
  if (!playPage) throw new Error('在线之家播放失败：缺少播放页');

  const playPageURL = absoluteURL(playPage);
  const playHTML = fetchText(playPageURL, itemId ? absoluteURL(itemId) : ZXZJ_BASE + '/');
  const player = parsePlayerConfig(playHTML);
  const playerURL = absoluteMediaURL(player.url || player.playUrl || '');
  if (!playerURL) throw new Error('在线之家播放失败：播放页没有返回播放器地址');
  if (isDirectMediaURL(playerURL)) return playback(playerURL, playPageURL);

  const playerHTML = fetchText(playerURL, playPageURL);
  const finalURL = decodeExternalPlayerURL(playerHTML);
  if (!finalURL) throw new Error('在线之家播放失败：播放器没有返回媒体地址');
  return playback(finalURL, playerURL);
}

function search(ctx) {
  const args = argsify(ctx);
  const query = stringValue(args.query || args.keyword || args.text || args.wd).trim();
  const page = numberValue(args.page, 1);
  if (!query) {
    return {
      pageType: 'search',
      id: 'zxzj-search',
      title: '搜索 在线之家',
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

  const path =
    page > 1
      ? '/vodsearch/' + encodeURIComponent(query) + '----------' + page + '---.html'
      : '/vodsearch/-------------.html?wd=' + encodeURIComponent(query);
  const html = fetchText(path, ZXZJ_BASE + '/');
  return {
    pageType: 'search',
    id: 'zxzj-search:' + query,
    title: '搜索：' + query,
    keyword: query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items: parsePosterItems(html, 'mixed'),
    page,
    hasMore: hasNextPage(html, page)
  };
}

function matchResources() {
  return { results: [] };
}

function getCategories() {
  return ZXZJ_CHANNELS.map(function (channel) {
    return {
      id: makePageId(channel.path),
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
    id: 'zxzj-channel-' + channel.id,
    title: channel.title,
    name: channel.title,
    subtitle: channel.subtitle || channel.title,
    description: '浏览在线之家' + channel.title + '频道。',
    overview: '浏览在线之家' + channel.title + '频道。',
    type: 'collection',
    mediaType: channel.mediaType,
    poster: first && first.poster,
    backdrop: first && (first.backdrop || first.poster),
    imageHeaders: imageHeaders(),
    previewItems: previewItems || [],
    badges: [channel.title],
    rank,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: categoryAction(channel.path, channel.title, channel.mediaType)
  };
}

function categoryAction(path, title, contentType) {
  return {
    type: 'category',
    id: makePageId(path),
    pageId: makePageId(path),
    title,
    contentType,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill'
  };
}

function fetchList(path, page, contentType) {
  const html = fetchText(withPage(path === '/' ? '/' : path, page || 1), ZXZJ_BASE + '/');
  return {
    items: parsePosterItems(html, contentType || contentTypeFromPath(path)),
    hasMore: hasNextPage(html, page || 1)
  };
}

function safeFetchList(path, page, contentType) {
  try {
    return fetchList(path, page, contentType);
  } catch (error) {
    return { items: [], hasMore: false, error: String((error && error.message) || error || '') };
  }
}

function parseFirstVodList(html, contentType) {
  const block = firstMatch(html, /<ul\b[^>]*class=["'][^"']*stui-vodlist[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i);
  return parsePosterItems(block, contentType);
}

function parseHomePanelItems(html, title, contentType) {
  const block = findPanelByTitle(html, title);
  return parsePosterItems(block, contentType);
}

function findPanelByTitle(html, title) {
  const text = String(html || '');
  const headRegex = /<div\b[^>]*class=["'][^"']*stui-vodlist__head[^"']*["'][^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<\/div>/gi;
  let match;
  while ((match = headRegex.exec(text))) {
    const headTitle = cleanText(stripTags(match[1])).replace(/^更多\s*/, '').trim();
    if (headTitle !== title) continue;
    const start = match.index;
    const listStart = text.indexOf('<ul class="stui-vodlist', headRegex.lastIndex);
    const nextHead = text.indexOf('<div class="stui-vodlist__head"', headRegex.lastIndex);
    if (listStart < 0) return '';
    return text.slice(start, nextHead > listStart ? nextHead : text.length);
  }
  return '';
}

function parsePosterItems(html, contentType) {
  const items = [];
  const blocks = matchAll(String(html || ''), /<li\b[^>]*>([\s\S]*?<div class=["'][^"']*stui-vodlist__box[^"']*["'][\s\S]*?)<\/li>/gi);
  blocks.forEach(function (block, index) {
    const thumb = firstMatch(block, /(<a\b[^>]*class=["'][^"']*stui-vodlist__thumb[^"']*["'][^>]*>)/i);
    const href = firstNonEmpty(attr(thumb, 'href'), firstMatch(block, /<a\b[^>]+href=["']([^"']*\/vod(?:detail|play)\/[^"']+)["']/i));
    const title = cleanText(firstNonEmpty(attr(thumb, 'title'), attr(thumb, 'alt'), firstMatch(block, /<h4[^>]*class=["'][^"']*title[^"']*["'][^>]*>\s*<a[^>]*title=["']([^"']+)["']/i)));
    if (!title || !href || !/\/vod(?:detail|play)\//.test(href)) return;
    const itemId = normalizeItemId(href);
    const poster = absoluteURL(firstNonEmpty(attr(thumb, 'data-original'), attr(thumb, 'data-src'), attr(thumb, 'src')));
    const status = cleanText(stripTags(firstMatch(block, /<span\b[^>]*class=["'][^"']*pic-text[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)));
    const rating = scoreValue(stripTags(firstMatch(block, /<span\b[^>]*class=["'][^"']*pic-tag[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)));
    items.push(
      mediaItem({
        id: itemId,
        title,
        poster,
        subtitle: status,
        description: status,
        rating,
        status,
        rank: index + 1,
        contentType
      })
    );
  });
  return dedupeItems(items);
}

function parseDetail(html, itemId) {
  const detailURL = absoluteURL(itemId);
  const title = cleanText(firstNonEmpty(firstMatch(html, /<h1[^>]*class=["'][^"']*title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i), firstMatch(html, /<title>《([^》]+)》/i)));
  const poster = absoluteURL(
    firstNonEmpty(
      firstMatch(html, /<div class=["'][^"']*stui-content__thumb[^"']*["'][\s\S]*?<img[^>]+data-original=["']([^"']+)["']/i),
      firstMatch(html, /<div class=["'][^"']*stui-content__thumb[^"']*["'][\s\S]*?<img[^>]+src=["']([^"']+)["']/i)
    )
  );
  const typeLine = cleanText(stripTags(firstMatch(html, /<p\b[^>]*class=["'][^"']*data[^"']*["'][^>]*>\s*类型：([\s\S]*?)<\/p>/i)));
  const meta = parseTypeLine(typeLine);
  const actorsText = cleanText(stripTags(firstMatch(html, /<p\b[^>]*class=["'][^"']*data[^"']*["'][^>]*>\s*主演：([\s\S]*?)<\/p>/i)));
  const directorText = cleanText(stripTags(firstMatch(html, /<p\b[^>]*class=["'][^"']*data[^"']*["'][^>]*>\s*导演：([\s\S]*?)<\/p>/i)));
  const updateText = cleanText(stripTags(firstMatch(html, /<p\b[^>]*class=["'][^"']*data[^"']*["'][^>]*>\s*更新：([\s\S]*?)<\/p>/i)));
  const overview = cleanOverview(
    firstNonEmpty(
      firstMatch(html, /<span\b[^>]*class=["'][^"']*detail-content[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
      firstMatch(html, /<span\b[^>]*class=["'][^"']*detail-sketch[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
      firstMatch(html, /<meta name=["']description["'] content=["']([^"']+)["']/i)
    ),
    title
  );
  const playSources = parsePlaySources(html, itemId);
  const primaryEpisodes = primaryEpisodesFromSources(playSources);
  const type = inferDetailType(meta.typeText, '', primaryEpisodes);
  const recommendations = parseRecommendations(html, itemId, type).slice(0, 18);
  const genres = unique(splitList(meta.typeText));
  const cast = splitPeople(actorsText).map(function (name) {
    return { id: 'actor:' + name, name, role: '主演', action: { type: 'search', query: name, title: name } };
  });
  const crew = splitPeople(directorText).map(function (name) {
    return { id: 'director:' + name, name, role: '导演', job: '导演', action: { type: 'search', query: name, title: name } };
  });

  const detail = {
    pageType: 'detail',
    id: itemId,
    itemId,
    type,
    mediaType: type,
    title,
    name: title,
    originalTitle: title,
    poster,
    cover: poster,
    backdrop: poster,
    imageHeaders: imageHeaders(detailURL),
    posterHeaders: imageHeaders(detailURL),
    backdropHeaders: imageHeaders(detailURL),
    detailImageAspectRatio: '2:3',
    imageAspectRatio: '2:3',
    posterAspectRatio: '2:3',
    overview: overview || shortOverview(title, meta.year, meta.area, meta.typeText),
    year: meta.year,
    genres,
    countries: meta.area ? [meta.area] : [],
    cast,
    crew,
    facts: [
      meta.typeText ? { title: '类型', value: meta.typeText } : null,
      meta.area ? { title: '地区', value: meta.area } : null,
      updateText ? { title: '更新', value: updateText } : null
    ].filter(Boolean),
    seasons: primaryEpisodes.length
      ? [
          {
            id: 's1',
            title: type === 'movie' ? '播放' : '全集',
            index: 1,
            episodes: primaryEpisodes
          }
        ]
      : [],
    recommendations,
    playSources,
    resourceSummary: {
      versionCount: playSources.length,
      episodeCount: primaryEpisodes.length,
      defaultVersionId: primaryEpisodes[0]
        ? encodeVersionId(itemId, playSources[0] && playSources[0].id, primaryEpisodes[0].id, primaryEpisodes[0].playPage)
        : ''
    },
    sourceUrl: detailURL,
    source: WidgetMetadata.id,
    providerIds: {
      zxzjPath: itemId
    }
  };
  if (type === 'movie' && primaryEpisodes[0]) {
    detail.resourceGroups = buildResourceGroups(detail, primaryEpisodes[0].id);
  }
  return detail;
}

function parseTypeLine(value) {
  const line = cleanText(value).replace(/^类型：/, '');
  const parts = line.split('/').map(function (part) {
    return cleanText(part);
  });
  const typeText = cleanText((parts[0] || '').replace(/^类型：/, ''));
  const area = cleanText((parts[1] || '').replace(/^地区：/, ''));
  const year = yearFrom(parts[2] || '');
  return { typeText, area, year };
}

function parseRecommendations(html, itemId, contentType) {
  const marker = String(html || '').indexOf('猜你喜欢');
  const block = marker >= 0 ? String(html || '').slice(marker) : '';
  return parsePosterItems(block, contentType).filter(function (item) {
    return item.id !== itemId;
  });
}

function parsePlaySources(html, itemId) {
  const text = String(html || '');
  const heads = [];
  const headRegex = /<div\b[^>]*class=["'][^"']*stui-vodlist__head[^"']*["'][^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<\/div>/gi;
  let headMatch;
  while ((headMatch = headRegex.exec(text))) {
    const afterHead = text.slice(headRegex.lastIndex);
    const list = firstMatch(afterHead, /<ul\b[^>]*class=["'][^"']*stui-content__playlist[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i);
    const title = cleanText(stripTags(headMatch[1]));
    if (!title || /猜你喜欢|更多|热门|推荐/.test(title) || !list) continue;
    heads.push({ title, list });
  }

  return heads
    .map(function (source, lineIndex) {
      const episodes = [];
      matchAll(source.list, /<a\b[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi).forEach(function (match, index) {
        const href = normalizePath(match[1]);
        if (!/\/vodplay\//.test(href)) return;
        const name = cleanText(stripTags(match[2])) || '第' + pad2(index + 1) + '集';
        const epIndex = episodeIndexFromTitle(name, index + 1);
        episodes.push({
          id: String(epIndex),
          episodeId: String(epIndex),
          title: name,
          name,
          index: epIndex,
          episodeNumber: epIndex,
          seasonNumber: 1,
          overview: name,
          playPage: href,
          lineId: 'line' + (lineIndex + 1),
          lineTitle: source.title
        });
      });
      return {
        id: 'line' + (lineIndex + 1),
        title: source.title || '线路' + (lineIndex + 1),
        name: source.title || '线路' + (lineIndex + 1),
        episodes
      };
    })
    .filter(function (source) {
      return source.episodes.length > 0;
    });
}

function primaryEpisodesFromSources(playSources) {
  const first = (playSources || []).filter(function (source) {
    return source.episodes && source.episodes.length;
  })[0];
  if (!first) return [];
  return first.episodes.map(function (episode) {
    const itemId = itemIdFromPlayPage(episode.playPage);
    return {
      id: String(episode.id),
      episodeId: String(episode.id),
      title: episode.title,
      name: episode.title,
      index: episode.index,
      episodeNumber: episode.episodeNumber,
      seasonNumber: 1,
      overview: episode.overview,
      playPage: episode.playPage,
      action: {
        type: 'play',
        itemId,
        seasonId: 's1',
        episodeId: String(episode.id),
        versionId: encodeVersionId(itemId, first.id, episode.id, episode.playPage),
        playPage: episode.playPage,
        title: episode.title
      }
    };
  });
}

function buildResourceGroups(detail, episodeId) {
  const sources = (detail && detail.playSources) || [];
  const itemId = normalizeItemId(detail && (detail.itemId || detail.id));
  const target = stringValue(episodeId || '1');
  const versions = [];
  sources.forEach(function (source, index) {
    const episode = findSourceEpisode(source, target) || source.episodes[0];
    if (!episode) return;
    const id = encodeVersionId(itemId, source.id || 'line' + (index + 1), episode.id, episode.playPage);
    versions.push({
      id,
      title: source.title || '线路' + (index + 1),
      name: source.title || '线路' + (index + 1),
      subtitle: episode.title,
      playPage: episode.playPage,
      href: episode.playPage,
      quality: source.title || 'HD',
      sourceName: WidgetMetadata.title,
      availability: 'requiresResolve',
      default: index === 0,
      action: {
        type: 'play',
        itemId,
        seasonId: 's1',
        episodeId: String(episode.id),
        versionId: id,
        playPage: episode.playPage,
        title: episode.title
      },
      ext: { playPage: episode.playPage }
    });
  });
  return versions.length ? [{ id: 'zxzj-lines', title: '播放线路', versions }] : [];
}

function findSourceEpisode(source, episodeId) {
  const target = stringValue(episodeId || '1');
  return ((source && source.episodes) || []).filter(function (episode) {
    return (
      String(episode.id) === target ||
      String(episode.episodeId) === target ||
      String(episode.index) === target ||
      String(episode.episodeNumber) === target
    );
  })[0];
}

function parsePlayerConfig(html) {
  const jsonLike = firstMatch(html, /var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/i);
  if (!jsonLike) return {};
  try {
    return JSON.parse(jsonLike.replace(/\\\//g, '/'));
  } catch (error) {
    return parseLooseObject(jsonLike);
  }
}

function parseLooseObject(value) {
  const out = {};
  matchAll(value, /["']?([a-zA-Z0-9_]+)["']?\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,}]+))/g).forEach(function (match) {
    out[match[1]] = decodeJSString(firstNonEmpty(match[2], match[3], match[4]));
  });
  return out;
}

function decodeExternalPlayerURL(html) {
  const jsonLike = firstMatch(html, /var\s+result_v2\s*=\s*(\{[\s\S]*?\})\s*;/i);
  if (!jsonLike) {
    const direct = firstMatch(html, /https?:\/\/[^"'<>\\\s]+\.(?:m3u8|mp4|mkv|mov|flv|ts)[^"'<>\\\s]*/i);
    return direct ? decodeJSString(direct) : '';
  }
  let result;
  try {
    result = JSON.parse(jsonLike);
  } catch (error) {
    result = parseLooseObject(jsonLike);
  }
  const data = stringValue(result && result.data);
  if (!data) return '';
  const reversed = data.split('').reverse().join('');
  const plain = hexToText(reversed);
  const decoded = removeMiddleNoise(plain, 7);
  return absoluteMediaURL(decoded);
}

function hexToText(hex) {
  const text = stringValue(hex);
  let out = '';
  for (let i = 0; i < text.length; i += 2) {
    const code = parseInt(text.slice(i, i + 2), 16);
    if (!isNaN(code)) out += String.fromCharCode(code);
  }
  return out;
}

function removeMiddleNoise(value, length) {
  const text = stringValue(value);
  const count = numberValue(length, 0);
  if (!text || text.length <= count) return text;
  const start = Math.max(0, Math.floor((text.length - count) / 2));
  return text.slice(0, start) + text.slice(start + count);
}

function mediaItem(input) {
  const title = cleanText(input.title);
  const id = normalizeItemId(input.id);
  const type = itemMediaType(input);
  const subtitle = cleanText(input.subtitle);
  const badges = unique([input.status, input.year, input.rating ? String(input.rating) : ''].filter(Boolean)).slice(0, 3);
  return {
    id,
    itemId: id,
    title,
    name: title,
    type,
    mediaType: type,
    poster: input.poster,
    cover: input.poster,
    backdrop: input.poster,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    subtitle,
    description: cleanText(input.description),
    overview: cleanText(input.description),
    year: input.year,
    rating: input.rating,
    rank: input.rank,
    badges,
    remarks: input.status,
    status: input.status,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: {
      type: 'detail',
      itemId: id,
      id,
      title,
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait'
    }
  };
}

function playback(url, referer) {
  const finalURL = absoluteMediaURL(url);
  const headers = playbackHeaders(finalURL, referer);
  return {
    url: finalURL,
    videoUrl: finalURL,
    container: inferContainer(finalURL),
    headers,
    header: headers,
    Header: headers,
    isLive: false,
    streamKind: 'vod'
  };
}

function playbackHeaders(url, referer) {
  const finalReferer = referer || ZXZJ_BASE + '/';
  const origin = originFrom(finalReferer) || ZXZJ_BASE;
  return {
    'User-Agent': ZXZJ_UA,
    Accept: '*/*',
    Origin: origin,
    Referer: finalReferer
  };
}

function fetchText(pathOrURL, referer) {
  const url = absoluteURL(pathOrURL);
  const headers = {
    'User-Agent': ZXZJ_UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: referer || ZXZJ_BASE + '/'
  };
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const result = Widget.http.get(url, { headers });
    return responseText(result);
  }
  if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
    const result = $fetch.get(url, { headers });
    return responseText(result);
  }
  if (typeof require === 'function') {
    const childProcess = require('child_process');
    return childProcess.execFileSync('curl', ['-L', '--compressed', '-A', ZXZJ_UA, '-e', headers.Referer, url], {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 8
    });
  }
  throw new Error('当前环境没有可用的 HTTP GET 能力');
}

function safeFetchText(pathOrURL, referer) {
  try {
    return fetchText(pathOrURL, referer);
  } catch (error) {
    return '';
  }
}

function responseText(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result.data === 'string') return result.data;
  if (result && result.data != null) return JSON.stringify(result.data);
  return String(result || '');
}

function imageHeaders(referer) {
  return {
    'User-Agent': ZXZJ_UA,
    Referer: referer || ZXZJ_BASE + '/'
  };
}

function argsify(ctx) {
  if (!ctx) return {};
  if (typeof ctx === 'object') return ctx;
  if (typeof ctx === 'string') {
    try {
      return JSON.parse(ctx);
    } catch (error) {
      return {};
    }
  }
  return {};
}

function absoluteURL(path) {
  const value = decodeEntities(stringValue(path).trim());
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  if (value.charAt(0) === '/') return ZXZJ_BASE + value;
  return ZXZJ_BASE + '/' + value;
}

function absoluteMediaURL(path) {
  const value = decodeJSString(stringValue(path).trim());
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  return absoluteURL(value);
}

function normalizePath(value) {
  const text = decodeEntities(stringValue(value).trim());
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) {
    return text.replace(/^https?:\/\/[^/]+/i, '') || '/';
  }
  return text.charAt(0) === '/' ? text : '/' + text;
}

function normalizeItemId(value) {
  let id = stringValue(value).trim();
  if (!id) return '';
  id = id.replace(/^detail:/, '');
  if (/^https?:\/\//i.test(id)) id = normalizePath(id);
  if (/^\/vodplay\/(\d+)-/.test(id)) id = id.replace(/^\/vodplay\/(\d+)-.*$/, '/voddetail/$1.html');
  return normalizePath(id);
}

function makePageId(path) {
  const value = stringValue(path || '/').trim();
  if (value.indexOf('query:') === 0) return value;
  if (value.indexOf('path:') === 0) return value;
  return 'path:' + normalizePath(value || '/');
}

function parsePageId(pageId) {
  const raw = stringValue(pageId || '').replace(/^category:/, '');
  if (raw.indexOf('query:') === 0) {
    const query = decodeURIComponent(raw.slice('query:'.length));
    return { query, title: query };
  }
  const path = raw.indexOf('path:') === 0 ? normalizePath(raw.slice(5)) : normalizePath(raw || '/');
  const channel = channelFromPath(path);
  return {
    path,
    title: channel ? channel.title : titleFromPath(path),
    contentType: channel ? channel.mediaType : contentTypeFromPath(path),
    typeId: typeIdFromPath(path),
    sort: sortFromPath(path),
    sortable: path !== '/'
  };
}

function channelFromPath(path) {
  const typeId = typeIdFromPath(path);
  return ZXZJ_CHANNELS.filter(function (channel) {
    return Number(channel.typeId) === Number(typeId);
  })[0];
}

function titleFromPath(path) {
  const channel = channelFromPath(path);
  if (channel) return channel.title;
  if (path === '/') return WidgetMetadata.title;
  return WidgetMetadata.title;
}

function typeIdFromPath(path) {
  const match = /\/vod(?:type|show)\/(\d+)/.exec(stringValue(path));
  return match ? Number(match[1]) : 0;
}

function contentTypeFromPath(path) {
  const channel = channelFromPath(path);
  return channel ? channel.mediaType : 'mixed';
}

function normalizeSort(value) {
  const text = stringValue(value || 'time');
  if (text === 'hits' || text === 'score') return text;
  return 'time';
}

function applySort(path, sort) {
  const typeId = typeIdFromPath(path);
  if (!typeId) return path;
  if (sort === 'hits') return '/vodshow/' + typeId + '--hits---------.html';
  if (sort === 'score') return '/vodshow/' + typeId + '--score---------.html';
  return '/vodtype/' + typeId + '.html';
}

function sortFromPath(path) {
  if (/--hits/.test(stringValue(path))) return 'hits';
  if (/--score/.test(stringValue(path))) return 'score';
  return 'time';
}

function withPage(path, page) {
  const value = normalizePath(path || '/');
  const pg = numberValue(page, 1);
  if (pg <= 1 || value === '/') return value;
  if (/\/vodtype\/(\d+)(?:-\d+)?\.html/.test(value)) {
    return value.replace(/\/vodtype\/(\d+)(?:-\d+)?\.html/, '/vodtype/$1-' + pg + '.html');
  }
  if (/\/vodshow\/(\d+)-/.test(value)) return withVodshowPage(value, pg);
  if (/\/vodsearch\/(.+?)----------\d+---\.html/.test(value)) {
    return value.replace(/----------\d+---\.html/, '----------' + pg + '---.html');
  }
  return value.replace(/\.html(?:\?.*)?$/, '-' + pg + '.html');
}

function withVodshowPage(path, page) {
  const value = normalizePath(path || '');
  const match = /^\/vodshow\/(\d+)(.*?)\.html$/.exec(value);
  if (!match) return value;
  const typeId = match[1];
  const tail = match[2] || '-----------';
  const parts = tail.split('-');
  while (parts.length < 12) parts.push('');
  if (parts.length > 12) parts.length = 12;
  parts[8] = String(page);
  return '/vodshow/' + typeId + parts.join('-') + '.html';
}

function hasNextPage(html, page) {
  const text = stringValue(html);
  if (/>下一页<\/a>/i.test(text)) return true;
  const mobile = /<li class=["']active num["']>\s*<a>(\d+)\/(\d+)<\/a>/i.exec(text) || /<span class=["']num["']>(\d+)\/(\d+)<\/span>/i.exec(text);
  if (mobile) return Number(mobile[1]) < Number(mobile[2]);
  return new RegExp('[-]' + (numberValue(page, 1) + 1) + '(?:---)?\\.html').test(text);
}

function inferDetailType(typeText, status, episodes) {
  const text = stringValue(typeText) + ' ' + stringValue(status);
  if (/电影/.test(text)) return 'movie';
  if (/美剧|韩剧|日剧|泰剧|动漫|动画|剧|综艺|更新至|全\s*\d+\s*集|第\s*\d+\s*集|第\s*\d+\s*期/.test(text)) return 'series';
  if ((episodes || []).length <= 1) return 'movie';
  return 'series';
}

function mediaTypeFromTypeText(typeText, status) {
  const text = stringValue(typeText);
  if (/^movie$/i.test(text)) return 'movie';
  if (/^series$/i.test(text)) return 'series';
  if (/^mixed$/i.test(text)) return inferDetailType('', status, []);
  if (/电影/.test(text)) return 'movie';
  if (/美剧|韩剧|日剧|泰剧|动漫|动画|剧|综艺/.test(text)) return 'series';
  return inferDetailType(text, status, []);
}

function itemMediaType(input) {
  if (input && input.contentType === 'movie') return 'movie';
  if (input && input.contentType === 'series') return 'series';
  const signal = [input && input.status, input && input.subtitle, input && input.description].join(' ');
  if (/更新至|全\s*\d+\s*集|第\s*\d+\s*集|第\s*\d+\s*期|已完结/.test(signal)) return 'series';
  if (/HD|TC|TS|BD|正片|国语|中字|英语|粤语/.test(signal) && input && input.contentType !== 'series') return 'movie';
  return mediaTypeFromTypeText((input && input.contentType) || signal, signal);
}

function episodeIndexFromTitle(title, fallback) {
  const match = /(?:第)?0*(\d+)(?:集|期)?/.exec(stringValue(title));
  return match ? Number(match[1]) : fallback;
}

function encodeVersionId(itemId, lineId, episodeId, playPage) {
  return ['zxzj', normalizeItemId(itemId), lineId || 'line1', episodeId || '1', normalizePath(playPage)].filter(Boolean).join('|');
}

function decodeVersionId(value) {
  const parts = stringValue(value).split('|');
  if (parts[0] !== 'zxzj') return {};
  return {
    itemId: parts[1] || '',
    lineId: parts[2] || '',
    episodeId: parts[3] || '',
    playPage: parts[4] || ''
  };
}

function itemIdFromPlayPage(value) {
  const match = /\/vodplay\/(\d+)-/.exec(stringValue(value));
  return match ? '/voddetail/' + match[1] + '.html' : '';
}

function isDirectMediaURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts)(\?|#|$)/i.test(stringValue(url));
}

function inferContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(stringValue(url));
  return match ? match[1].toLowerCase() : undefined;
}

function originFrom(url) {
  const match = /^(https?:\/\/[^/]+)/i.exec(stringValue(url));
  return match ? match[1] : '';
}

function cleanOverview(value, title) {
  let text = stripTags(stringValue(value).replace(/<br\s*\/?>/gi, '\n'));
  text = text
    .replace(/^.*?剧情[:：]/, '')
    .replace(new RegExp('^《' + escapeRegExp(title || '') + '》(?:剧情简介|简介)?[:：]?'), '')
    .replace(/^简介[:：]?/, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

function shortOverview(title, year, area, typeText) {
  return ['《' + title + '》', year ? year + '年' : '', area || '', typeText || '影视资源'].filter(Boolean).join(' · ');
}

function splitPeople(value) {
  const text = cleanText(value);
  if (!text || /^(未知|未录入|暂无|无)$/.test(text)) return [];
  return unique(text.split(/[,\s，、/]+/).filter(Boolean)).slice(0, 16);
}

function splitList(value) {
  return unique(cleanText(value).split(/[,\s，、/]+/).filter(Boolean));
}

function scoreValue(value) {
  const num = Number(stringValue(value).trim());
  if (!isFinite(num) || num <= 0) return undefined;
  return num;
}

function yearFrom(value) {
  const match = /(\d{4})/.exec(stringValue(value));
  if (!match) return undefined;
  const year = Number(match[1]);
  return year > 1800 ? year : undefined;
}

function numberValue(value, fallback) {
  const num = Number(value);
  return isFinite(num) && num > 0 ? num : fallback;
}

function stringValue(value) {
  if (value == null) return '';
  return String(value);
}

function pad2(value) {
  const num = numberValue(value, 0);
  return num < 10 ? '0' + num : String(num);
}

function firstNonEmpty() {
  for (let i = 0; i < arguments.length; i += 1) {
    const value = arguments[i];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function firstMatch(value, regex) {
  const match = regex.exec(stringValue(value));
  return match ? match[1] || '' : '';
}

function matchAll(value, regex) {
  const out = [];
  const text = stringValue(value);
  let match;
  regex.lastIndex = 0;
  while ((match = regex.exec(text))) {
    out.push(match.length > 2 ? match : match[1]);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return out;
}

function attr(value, name) {
  return decodeEntities(firstMatch(value, new RegExp(name + "=[\"']([^\"']*)[\"']", 'i')));
}

function stripTags(value) {
  return decodeEntities(stringValue(value).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' '));
}

function cleanText(value) {
  return decodeEntities(stringValue(value).replace(/&nbsp;/g, ' ')).replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return stringValue(value)
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

function decodeJSString(value) {
  return stringValue(value)
    .replace(/^["']|["']$/g, '')
    .replace(/\\\//g, '/')
    .replace(/\\u([0-9a-f]{4})/gi, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
}

function dedupeItems(items) {
  const seen = {};
  return (items || []).filter(function (item) {
    const key = item && item.id;
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function unique(values) {
  const seen = {};
  return (values || []).filter(function (value) {
    const key = stringValue(value).trim();
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function findById(items, id) {
  return (items || []).filter(function (item) {
    return item && item.id === id;
  })[0];
}

function cloneItem(item) {
  if (!item) return {};
  const out = {};
  Object.keys(item).forEach(function (key) {
    out[key] = item[key];
  });
  return out;
}

function escapeRegExp(value) {
  return stringValue(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cacheDetail(detail) {
  if (!detail || !detail.id) return;
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set('zxzj.detail.' + detail.id, detail);
  }
}

function getCachedDetail(itemId) {
  if (!itemId || typeof Widget === 'undefined' || !Widget.storage || typeof Widget.storage.get !== 'function') return null;
  const value = Widget.storage.get('zxzj.detail.' + itemId);
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  return null;
}

const ZxzjMiniLibrary = {
  metadata: WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  getCategory,
  getDetail,
  getResourceVersions,
  resolvePlayback,
  search,
  matchResources,
  getSearch,
  onSearch,
  getCategories,
  getItems,
  home,
  homeSection,
  getSection,
  section,
  loadSection,
  category,
  catalog,
  list,
  detail,
  resources,
  getVersions,
  versions,
  getPlaySources,
  resolve,
  resolvePlay,
  play,
  getPlayinfo
};

const __jsEvalReturn = ZxzjMiniLibrary;

if (typeof globalThis !== 'undefined') {
  globalThis.ZxzjMiniLibrary = ZxzjMiniLibrary;
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getHomeSection = getHomeSection;
  globalThis.getCategory = getCategory;
  globalThis.getDetail = getDetail;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.search = search;
  globalThis.matchResources = matchResources;
  globalThis.getSearch = getSearch;
  globalThis.onSearch = onSearch;
  globalThis.getCategories = getCategories;
  globalThis.getItems = getItems;
  globalThis.home = home;
  globalThis.homeSection = homeSection;
  globalThis.getSection = getSection;
  globalThis.section = section;
  globalThis.loadSection = loadSection;
  globalThis.category = category;
  globalThis.catalog = catalog;
  globalThis.list = list;
  globalThis.detail = detail;
  globalThis.resources = resources;
  globalThis.getVersions = getVersions;
  globalThis.versions = versions;
  globalThis.getPlaySources = getPlaySources;
  globalThis.resolve = resolve;
  globalThis.resolvePlay = resolvePlay;
  globalThis.play = play;
  globalThis.getPlayinfo = getPlayinfo;
}

if (typeof module !== 'undefined') {
  module.exports = ZxzjMiniLibrary;
}
