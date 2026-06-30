// @name 天天影院

const BASE = 'https://www.baixiaotangtop.com';
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const LOGO = BASE + '/upload/site/20251127-1/78153ef75d201764cf631ee94b862df3.png';

const WidgetMetadata = {
  id: 'baiplay_baixiaotang_media_library',
  title: '天天影院',
  name: '天天影院',
  logo: LOGO,
  icon: LOGO,
  site: BASE,
  version: '1.0.0',
  author: 'baiPlay',
  description:
    '天天影院全站自定义媒体库，支持电影、电视剧、综艺、动漫、短剧、搜索、详情、选集、线路选择、播放解析和短剧刷流入口。'
};

const CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '院线与网络电影', path: '/vodtype/1.html', typeId: 1, mediaType: 'movie' },
  { id: 'series', title: '电视剧', subtitle: '国产剧、港台剧与海外剧', path: '/vodtype/2.html', typeId: 2, mediaType: 'series' },
  { id: 'variety', title: '综艺', subtitle: '综艺节目与真人秀', path: '/vodtype/3.html', typeId: 3, mediaType: 'series' },
  { id: 'anime', title: '动漫', subtitle: '国漫、日漫与少儿动画', path: '/vodtype/4.html', typeId: 4, mediaType: 'series' },
  { id: 'short', title: '短剧', subtitle: '竖屏短剧合集', path: '/vodtype/36.html', typeId: 36, mediaType: 'series' }
];

const HOME_SECTIONS = [
  {
    id: 'baixiaotang-home-recommend',
    title: '热播推荐',
    source: 'home:热播推荐',
    style: 'discover.spotlight',
    contentType: 'mixed',
    morePath: '/'
  },
  {
    id: 'baixiaotang-latest-movie',
    title: '最新电影',
    path: '/vodtype/1.html',
    style: 'discover.posterCompact',
    contentType: 'movie'
  },
  {
    id: 'baixiaotang-hot-movie',
    title: '电影热播榜',
    path: '/vodshow/1--hits---------.html',
    style: 'discover.ranked',
    contentType: 'movie'
  },
  {
    id: 'baixiaotang-latest-series',
    title: '最新电视剧',
    path: '/vodtype/2.html',
    style: 'discover.spotlight',
    contentType: 'series'
  },
  {
    id: 'baixiaotang-hot-series',
    title: '电视剧热播榜',
    path: '/vodshow/2--hits---------.html',
    style: 'discover.ranked',
    contentType: 'series'
  },
  {
    id: 'baixiaotang-latest-variety',
    title: '最新综艺',
    path: '/vodtype/3.html',
    style: 'discover.editorial',
    contentType: 'series'
  },
  {
    id: 'baixiaotang-latest-anime',
    title: '最新动漫',
    path: '/vodtype/4.html',
    style: 'discover.posterCompact',
    contentType: 'series'
  },
  {
    id: 'baixiaotang-latest-short',
    title: '最新短剧',
    path: '/vodtype/36.html',
    style: 'discover.spotlight',
    contentType: 'series'
  },
  {
    id: 'baixiaotang-hot-short',
    title: '短剧热播榜',
    path: '/vodshow/36--hits---------.html',
    style: 'discover.ranked',
    contentType: 'series'
  }
];

const SORT_OPTIONS = [
  { id: 'time', title: '最新', value: 'time' },
  { id: 'hits', title: '最热', value: 'hits' },
  { id: 'score', title: '高分', value: 'score' }
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
      shortFeed: true,
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

function getHome() {
  const html = safeFetch('/', BASE + '/');
  const hero = html ? parseHomeSlides(html) : [];
  const recommend = html ? parseHomePanelItems(html, '热播推荐', 'mixed').slice(0, 18) : [];

  return {
    pageType: 'home',
    id: 'baixiaotang-home',
    title: WidgetMetadata.title,
    heroAspectRatio: '16:9',
    hero,
    carousel: hero,
    sections: [
      {
        id: 'baixiaotang-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'baixiaotang-channels', title: '频道入口' },
        items: CHANNELS.map(function (channel, index) {
          return channelEntry(channel, [], index + 1);
        })
      },
      {
        id: 'baixiaotang-short-feed-entry',
        title: '刷短剧',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'baixiaotang-short-feed-entry', title: '刷短剧' },
        items: [shortFeedEntry([])]
      },
      {
        id: 'baixiaotang-home-recommend',
        title: '热播推荐',
        style: 'discover.spotlight',
        contentType: 'mixed',
        lazy: true,
        promotesToHero: true,
        loadAction: { type: 'custom', id: 'baixiaotang-home-recommend', title: '热播推荐' },
        moreAction: categoryAction('/', '热播推荐', 'mixed'),
        items: recommend
      }
    ].concat(
      HOME_SECTIONS.filter(function (section) {
        return section.id !== 'baixiaotang-home-recommend';
      }).map(function (section) {
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.contentType,
          lazy: true,
          loadAction: { type: 'custom', id: section.id, title: section.title },
          moreAction: categoryAction(section.path, section.title, section.contentType),
          items: []
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const sectionId = String((ctx && (ctx.sectionId || ctx.id)) || '');

  if (sectionId === 'baixiaotang-channels') {
    return {
      id: sectionId,
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: CHANNELS.map(function (channel, index) {
        const preview = safeFetchList(channel.path, 1, channel.mediaType).items.slice(0, 6);
        return channelEntry(channel, preview, index + 1);
      })
    };
  }

  if (sectionId === 'baixiaotang-short-feed-entry') {
    const preview = safeFetchList('/vodtype/36.html', 1, 'series').items.slice(0, 6);
    return {
      id: sectionId,
      title: '刷短剧',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: [shortFeedEntry(preview)]
    };
  }

  const section = HOME_SECTIONS.filter(function (item) {
    return item.id === sectionId;
  })[0];
  if (!section) {
    return {
      id: sectionId || 'baixiaotang-unknown-section',
      title: (ctx && ctx.title) || '天天影院',
      style: (ctx && ctx.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  if (section.source && section.source.indexOf('home:') === 0) {
    const html = safeFetch('/', BASE + '/');
    const title = section.source.slice('home:'.length);
    return {
      id: section.id,
      title: section.title,
      style: section.style,
      contentType: section.contentType,
      lazy: false,
      promotesToHero: true,
      moreAction: categoryAction(section.morePath || '/', section.title, section.contentType),
      items: html ? parseHomePanelItems(html, title, section.contentType).slice(0, 18) : []
    };
  }

  const page = safeFetchList(section.path, 1, section.contentType);
  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.contentType,
    lazy: false,
    moreAction: categoryAction(section.path, section.title, section.contentType),
    items: page.items.slice(0, 18)
  };
}

function getCategory(ctx) {
  const page = numberValue(ctx && ctx.page, 1);
  const pageId = String((ctx && (ctx.pageId || ctx.id)) || '/');
  const parsed = parsePageId(pageId);
  const sort = String((ctx && (ctx.sort || ctx.sortBy || ctx.sort_by || ctx.selectedSort)) || parsed.sort || 'time');

  if (parsed.feed) {
    const list = fetchList('/vodtype/36.html', page, 'series');
    return {
      pageType: 'shortFeed',
      id: 'baixiaotang-short-feed',
      title: (ctx && ctx.title) || '刷短剧',
      style: 'media.posterGrid',
      itemAspectRatio: '9:16',
      imageOrientation: 'portrait',
      imageFit: 'fill',
      page,
      hasMore: list.hasMore,
      items: list.items.map(function (item, index) {
        return shortFeedItem(item, index + 1);
      })
    };
  }

  if (parsed.query) {
    const result = search({ query: parsed.query, page });
    return {
      pageType: 'category',
      id: pageId,
      title: (ctx && ctx.title) || parsed.title || parsed.query,
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
    title: (ctx && ctx.title) || parsed.title || titleFromPath(path) || WidgetMetadata.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: parsed.contentType || contentTypeFromPath(path),
    items: list.items,
    page,
    hasMore: list.hasMore,
    sortOptions: path === '/' || parsed.sortable === false ? [] : SORT_OPTIONS,
    selectedSortValue: path === '/' || parsed.sortable === false ? '' : sort
  };
}

function getDetail(ctx) {
  const itemId = normalizeItemId((ctx && (ctx.itemId || ctx.id)) || '');
  if (!itemId) throw new Error('天天影院详情参数为空');
  const html = fetchText(itemId, BASE + '/');
  const detail = parseDetail(html, itemId);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const itemId = normalizeItemId((ctx && (ctx.itemId || ctx.id)) || itemIdFromPlayPage(ctx && ctx.playPage) || '');
  const parsed = parseVersionId(ctx && (ctx.versionId || ctx.id || ctx.sourceId));
  const episodeId = String(firstNonEmpty(ctx && ctx.episodeId, ctx && ctx.episode, ctx && ctx.episodeIndex, parsed.episodeId, '1'));
  const detail = itemId ? getCachedDetail(itemId) || getDetail({ itemId }) : null;
  if (!detail) return [];
  return buildResourceGroups(detail, episodeId);
}

function resolvePlayback(ctx) {
  const direct = firstNonEmpty(ctx && ctx.url, ctx && ctx.playUrl, ctx && ctx.play_url, ctx && ctx.videoUrl);
  if (isDirectMediaURL(direct)) return playback(direct, ctx && ctx.referer);

  const parsed = parseVersionId(ctx && (ctx.versionId || ctx.id || ctx.sourceId || direct));
  let playPage = firstNonEmpty(
    ctx && ctx.playPage,
    ctx && ctx.href,
    ctx && ctx.ext && ctx.ext.playPage,
    isPlayPageURL(direct) ? direct : '',
    parsed.playPage
  );
  const itemId = normalizeItemId(firstNonEmpty(ctx && ctx.itemId, parsed.itemId, itemIdFromPlayPage(playPage)));
  const episodeId = firstNonEmpty(ctx && ctx.episodeId, parsed.episodeId, '1');
  if (!playPage && itemId) {
    const detail = getCachedDetail(itemId) || getDetail({ itemId });
    const groups = buildResourceGroups(detail, episodeId);
    const firstVersion = groups[0] && groups[0].versions && groups[0].versions[0];
    playPage = firstVersion && firstVersion.playPage;
  }
  if (!playPage) throw new Error('天天影院播放失败：缺少播放页');

  const referer = absolute(playPage);
  const html = fetchText(playPage, itemId ? absolute(itemId) : BASE + '/');
  const player = parsePlayerConfig(html);
  const url = absoluteMediaURL(player.url || player.playUrl || '');
  if (!url) throw new Error('天天影院播放失败：播放页没有返回媒体地址');
  return playback(url, referer);
}

function search(ctx) {
  const keyword = String((ctx && (ctx.query || ctx.keyword || ctx.text || ctx.wd)) || '').trim();
  const page = numberValue(ctx && ctx.page, 1);
  if (!keyword) {
    return {
      pageType: 'search',
      title: '搜索天天影院',
      keyword,
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
      ? '/vodsearch/' + encodeURIComponent(keyword) + '----------' + page + '---.html'
      : '/vodsearch/-------------.html?wd=' + encodeURIComponent(keyword);
  const html = fetchText(path, BASE + '/');
  const items = parseSearchItems(html);
  return {
    pageType: 'search',
    title: '搜索：' + keyword,
    keyword,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items,
    page,
    hasMore: hasNextPage(html, page)
  };
}

function getSearch(ctx) {
  return search(ctx || {});
}

function onSearch(ctx) {
  return search(ctx || {});
}

function getCategories() {
  return CHANNELS.map(function (channel) {
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

function home() {
  return getHome();
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

function channelEntry(channel, previewItems, rank) {
  const first = previewItems && previewItems[0];
  return {
    id: 'baixiaotang-channel-' + channel.id,
    title: channel.title,
    name: channel.title,
    subtitle: channel.subtitle || channel.title,
    description: '浏览天天影院' + channel.title + '频道。',
    overview: '浏览天天影院' + channel.title + '频道。',
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

function shortFeedEntry(previewItems) {
  const first = previewItems && previewItems[0];
  return {
    id: 'baixiaotang-short-feed',
    title: '刷短剧',
    name: '刷短剧',
    subtitle: '上下滑动连续看',
    description: '进入 App 原生刷流页，连续观看天天影院短剧频道。',
    overview: '进入 App 原生刷流页，连续观看天天影院短剧频道。',
    type: 'collection',
    poster: first && first.poster,
    backdrop: first && (first.backdrop || first.poster),
    imageHeaders: imageHeaders(),
    previewItems: previewItems || [],
    badges: ['短剧', '刷流', '竖屏'],
    itemAspectRatio: '9:16',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: {
      type: 'category',
      pageId: 'short-feed',
      title: '刷短剧',
      presentation: 'shortFeed',
      itemAspectRatio: '9:16',
      imageOrientation: 'portrait'
    },
    providerIds: {
      MiniLibraryPresentation: 'shortFeed'
    }
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
    imageOrientation: 'portrait'
  };
}

function fetchList(path, page, contentType) {
  const html = fetchText(path === '/' ? '/' : withPage(path, page || 1), BASE + '/');
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

function parseHomeSlides(html) {
  const slides = [];
  matchAll(
    html,
    /<a\b[^>]*class="[^"]*slide-link[^"]*"[^>]*href="([^"]+)"[^>]*data-background="([^"]+)"[\s\S]*?<p class="gate">\s*<span>([\s\S]*?)<\/span>\s*<\/p>[\s\S]*?<p class="name">\s*<span>([\s\S]*?)<\/span>\s*<\/p>[\s\S]*?<p class="info">\s*<span>([\s\S]*?)<\/span>\s*<\/p>/gi
  ).forEach(function (match, index) {
    const href = match[1];
    const backdrop = absolute(match[2]);
    const gate = cleanText(stripTags(match[3]));
    const title = cleanText(stripTags(match[4]));
    const info = cleanText(stripTags(match[5]));
    if (!title || !href) return;
    const mediaType = inferTypeFromText(gate + ' ' + info);
    slides.push({
      id: normalizeItemId(href),
      itemId: normalizeItemId(href),
      title,
      name: title,
      type: mediaType,
      mediaType,
      poster: backdrop,
      backdrop,
      aspectRatio: '16:9',
      imageHeaders: imageHeaders(),
      posterHeaders: imageHeaders(),
      backdropHeaders: imageHeaders(),
      subtitle: [gate, info].filter(Boolean).join(' · '),
      badges: [gate, info].filter(Boolean).slice(0, 3),
      rank: index + 1,
      action: {
        type: 'detail',
        itemId: normalizeItemId(href),
        id: normalizeItemId(href),
        title
      }
    });
  });
  return dedupeItems(slides);
}

function parseHomePanelItems(html, title, contentType) {
  const block = findPanelByTitle(html, title);
  return parsePosterItems(block || '', contentType);
}

function findPanelByTitle(html, title) {
  const text = String(html || '');
  const titleIndex = text.indexOf(title);
  if (titleIndex < 0) return '';
  const start = text.lastIndexOf('<div class="ewave-pannel', titleIndex);
  const next = text.indexOf('<div class="ewave-pannel', titleIndex + String(title).length);
  return text.slice(start >= 0 ? start : titleIndex, next > titleIndex ? next : text.length);
}

function parsePosterItems(html, contentType) {
  const items = [];
  const blocks = matchAll(String(html || ''), /<li\b[^>]*>\s*<div class="ewave-vodlist__box">([\s\S]*?)<\/li>/gi);
  blocks.forEach(function (block, index) {
    const thumb = firstMatch(block, /<div class="[^"]*ewave-vodlist__thumb[^"]*"([\s\S]*?)<\/div>/i);
    const title = firstNonEmpty(
      attr(thumb, 'title'),
      attr(thumb, 'alt'),
      firstMatch(block, /<h4[^>]*class="[^"]*title[^"]*"[^>]*>\s*<a[^>]*title="([^"]+)"/i)
    );
    const href = firstNonEmpty(
      firstMatch(thumb, /<a\b[^>]*class="[^"]*thumb-link[^"]*"[^>]*href="([^"]+)"/i),
      firstMatch(block, /<h4[^>]*class="[^"]*title[^"]*"[^>]*>\s*<a[^>]*href="([^"]+)"/i)
    );
    if (!title || !href || !/\/voddetail\//.test(href)) return;
    const poster = absolute(firstNonEmpty(attr(thumb, 'data-original'), attr(thumb, 'src')));
    const status = cleanText(stripTags(firstMatch(thumb, /<span class="pic-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i)));
    const rating = scoreValue(stripTags(firstMatch(thumb, /<span class="pic-tag[^"]*"[^>]*>([\s\S]*?)<\/span>/i)));
    const actor = cleanText(stripTags(firstMatch(block, /<p class="[^"]*text-actor[^"]*"[^>]*>([\s\S]*?)<\/p>/i)));
    items.push(
      mediaItem({
        id: normalizeItemId(href),
        title,
        poster,
        subtitle: [status, actor].filter(Boolean).join(' · '),
        description: actor,
        rating,
        status,
        rank: index + 1,
        contentType
      })
    );
  });
  return dedupeItems(items);
}

function parseSearchItems(html) {
  const items = [];
  const list = firstMatch(html, /<ul class="[^"]*ewave-vodlist__media[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  const blocks = matchAll(list, /(<li\b[^>]*>[\s\S]*?<\/li>)/gi);
  blocks.forEach(function (block, index) {
    if (!/\/voddetail\//.test(block)) return;
    const href = firstMatch(block, /href="([^"]*\/voddetail\/[^"]+)"/i);
    const title = firstNonEmpty(
      attr(firstMatch(block, /<a class="[^"]*v-thumb[^"]*"([\s\S]*?)>/i), 'title'),
      stripTags(firstMatch(block, /<h3 class="title">\s*<a[^>]*>([\s\S]*?)<\/a>/i))
    );
    if (!href || !title) return;
    const poster = absolute(firstNonEmpty(firstMatch(block, /data-original="([^"]+)"/i), firstMatch(block, /src="([^"]+)"/i)));
    const status = cleanText(stripTags(firstMatch(block, /<span class="pic-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i)));
    const typeText = cleanText(stripTags(firstMatch(block, /类型：<\/span>([\s\S]*?)<span class="split-line">/i)));
    const area = cleanText(firstMatch(block, /地区：<\/span>\s*([^<]+)/i));
    const year = yearFrom(firstMatch(block, /年份：<\/span>\s*([^<]+)/i));
    const actors = cleanText(firstMatch(block, /主演：<\/span>\s*([^<]+)/i));
    items.push(
      mediaItem({
        id: normalizeItemId(href),
        title,
        poster,
        subtitle: [typeText, area, year].filter(Boolean).join(' · '),
        description: actors,
        year,
        status,
        rank: index + 1,
        contentType: mediaTypeFromTypeText(typeText, status)
      })
    );
  });
  return dedupeItems(items);
}

function parseDetail(html, itemId) {
  const detailUrl = absolute(itemId);
  const title = cleanText(
    firstNonEmpty(
      firstMatch(html, /<h1 class="title">\s*<span[^>]*>([\s\S]*?)<\/span>/i),
      firstMatch(html, /<title>《([^》]+)》/i)
    )
  );
  const poster = absolute(
    firstNonEmpty(
      firstMatch(html, /<div class="[^"]*v-thumb[^"]*"[\s\S]*?<img[^>]+data-original="([^"]+)"/i),
      firstMatch(html, /<div class="[^"]*v-thumb[^"]*"[\s\S]*?<img[^>]+src="([^"]+)"/i)
    )
  );
  const status = cleanText(firstMatch(html, /<span class="pic-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i));
  const rating = scoreValue(firstMatch(html, /<span class="score[^"]*">([\d.]+)/i));
  const typeText = cleanTypeText(stripTags(firstMatch(html, /<span class="text-muted">类型：<\/span>([\s\S]*?)<\/p>/i)));
  const area = cleanText(stripTags(firstMatch(html, /地区：<\/span>([\s\S]*?)<\/p>/i))).replace(/年份：.*$/, '').trim();
  const year = yearFrom(firstMatch(html, /年份：<\/span>([\s\S]*?)<\/p>/i));
  const actorsText = cleanText(stripTags(firstMatch(html, /主演：<\/span>([\s\S]*?)<\/p>/i)));
  const directorText = cleanText(stripTags(firstMatch(html, /导演：<\/span>([\s\S]*?)<\/p>/i)));
  const updateText = cleanText(stripTags(firstMatch(html, /更新：<\/span>([\s\S]*?)<\/p>/i)));
  const overview = cleanOverview(firstMatch(html, /<div class="ewave-pannel_bd">\s*<p class="col-pd">([\s\S]*?)<\/p>/i), title);
  const playSources = parsePlaySources(html, itemId);
  const primaryEpisodes = primaryEpisodesFromSources(playSources);
  const type = inferDetailType(typeText, status, primaryEpisodes);
  const recommendations = parseRecommendations(html, itemId, type).slice(0, 18);
  const genres = unique(splitList(typeText).filter(function (name) {
    return !/^(类型|地区|年份)$/.test(name);
  }));
  const cast = splitPeople(actorsText).map(function (name) {
    return { id: 'actor-' + name, name, role: '主演', action: { type: 'search', query: name, title: name } };
  });
  const crew = splitPeople(directorText).map(function (name) {
    return { id: 'director-' + name, name, role: '导演', job: '导演' };
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
    imageHeaders: imageHeaders(detailUrl),
    posterHeaders: imageHeaders(detailUrl),
    backdropHeaders: imageHeaders(detailUrl),
    detailImageAspectRatio: '2:3',
    imageAspectRatio: '2:3',
    posterAspectRatio: '2:3',
    overview: overview || shortOverview(title, year, area, status, typeText),
    rating,
    year,
    status,
    remarks: status,
    genres,
    countries: area ? [area] : [],
    cast,
    crew,
    facts: [
      status ? { title: type === 'movie' ? '清晰度' : '集数', value: status } : null,
      updateText ? { title: '更新', value: updateText } : null,
      area ? { title: '地区', value: area } : null
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
      defaultVersionId: primaryEpisodes[0] ? versionId(itemId, playSources[0] && playSources[0].id, primaryEpisodes[0].id, primaryEpisodes[0].playPage) : ''
    },
    sourceUrl: detailUrl,
    source: WidgetMetadata.id
  };
  if (type === 'movie' && primaryEpisodes[0]) {
    detail.resourceGroups = buildResourceGroups(detail, primaryEpisodes[0].id);
  }
  return detail;
}

function parseRecommendations(html, itemId, type) {
  const marker = html.indexOf('猜您喜欢');
  const block = marker >= 0 ? html.slice(marker) : html;
  return parsePosterItems(block, type).filter(function (item) {
    return item.id !== itemId;
  });
}

function parsePlaySources(html, itemId) {
  const tabs = [];
  matchAll(html, /<a\b[^>]*href="#(playlist\d+)"[^>]*>([\s\S]*?)<\/a>/gi).forEach(function (match, index) {
    tabs.push({
      id: match[1],
      title: cleanText(stripTags(match[2])) || '线路' + (index + 1)
    });
  });
  if (!tabs.length && /ewave-content__playlist/.test(html)) tabs.push({ id: 'playlist1', title: '播放线路' });

  return tabs.map(function (tab, lineIndex) {
    const list = playlistHTML(html, tab.id);
    const episodes = [];
    matchAll(list, /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi).forEach(function (match, index) {
      const href = normalizePath(match[1]);
      const name = cleanText(stripTags(match[2])) || '第' + pad2(index + 1) + '集';
      const epIndex = episodeIndexFromTitle(name, index + 1);
      episodes.push({
        id: String(epIndex),
        episodeId: String(epIndex),
        title: name,
        name,
        index: epIndex,
        episodeNumber: epIndex,
        overview: name,
        playPage: href,
        lineId: 'line' + (lineIndex + 1),
        lineTitle: tab.title
      });
    });
    return {
      id: 'line' + (lineIndex + 1),
      title: tab.title,
      name: tab.title,
      episodes
    };
  }).filter(function (source) {
    return source.episodes.length > 0;
  });
}

function playlistHTML(html, id) {
  const pattern = new RegExp('<div[^>]+id="' + escapeRegExp(id) + '"[\\s\\S]*?<ul class="[^"]*ewave-content__playlist[^"]*"[^>]*>([\\s\\S]*?)<\\/ul>', 'i');
  return firstMatch(html, pattern);
}

function primaryEpisodesFromSources(playSources) {
  const first = (playSources || []).filter(function (source) {
    return source.episodes && source.episodes.length;
  })[0];
  if (!first) return [];
  return first.episodes.map(function (episode) {
    const itemId = itemIdFromPlayPage(episode.playPage);
    const actionItemId = itemId || '';
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
        itemId: actionItemId,
        seasonId: 's1',
        episodeId: String(episode.id),
        versionId: versionId(actionItemId, first.id, episode.id, episode.playPage),
        playPage: episode.playPage,
        title: episode.title
      }
    };
  });
}

function buildResourceGroups(detail, episodeId) {
  const sources = (detail && detail.playSources) || [];
  const itemId = normalizeItemId(detail && detail.itemId);
  const target = String(episodeId || '1');
  const versions = [];
  sources.forEach(function (source, index) {
    const episode = findSourceEpisode(source, target) || source.episodes[0];
    if (!episode) return;
    const id = versionId(itemId, source.id || 'line' + (index + 1), episode.id, episode.playPage);
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
  return versions.length
    ? [
        {
          id: 'baixiaotang-lines',
          title: '播放线路',
          versions
        }
      ]
    : [];
}

function findSourceEpisode(source, episodeId) {
  const target = String(episodeId || '1');
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

function shortFeedItem(item, rank) {
  const itemId = normalizeItemId(item && item.id);
  const playPage = firstEpisodePlayPage(itemId);
  const version = versionId(itemId, 'line1', '1', playPage);
  return {
    id: 'feed:' + itemId,
    itemId,
    title: item.title,
    name: item.title,
    subtitle: firstNonEmpty(item.subtitle, item.remarks, '第1集'),
    type: 'episode',
    mediaType: 'series',
    poster: item.poster,
    cover: item.poster,
    backdrop: item.backdrop || item.poster,
    overview: item.overview || item.description,
    rank,
    badges: unique(['短剧', item.remarks, item.rating ? String(item.rating) : '']).filter(Boolean).slice(0, 4),
    aspectRatio: '9:16',
    itemAspectRatio: '9:16',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    providerIds: {
      MiniLibraryPlaybackTitle: item.title,
      MiniLibraryPresentation: 'shortFeed'
    },
    resourceGroups: [
      {
        id: 'baixiaotang-lines',
        title: '播放线路',
        versions: [
          {
            id: version,
            name: '第1集',
            title: '第1集',
            playPage,
            default: true,
            action: {
              type: 'play',
              itemId,
              episodeId: '1',
              versionId: version,
              playPage,
              title: item.title
            }
          }
        ]
      }
    ],
    action: {
      type: 'play',
      itemId,
      episodeId: '1',
      versionId: version,
      playPage,
      title: item.title
    }
  };
}

function firstEpisodePlayPage(itemId) {
  const match = /\/voddetail\/(\d+)\.html/.exec(String(itemId || ''));
  return match ? '/vodplay/' + match[1] + '-1-1.html' : '';
}

function playback(url, referer) {
  const headers = playbackHeaders(url, referer);
  return {
    url,
    videoUrl: url,
    container: inferContainer(url),
    headers,
    header: headers,
    Header: headers,
    isLive: false,
    streamKind: 'vod'
  };
}

function playbackHeaders(url, referer) {
  const playerReferer = BASE + '/static/player/dplayer.html';
  return {
    'User-Agent': UA,
    Accept: '*/*',
    Origin: BASE,
    Referer: isDirectMediaURL(url) ? playerReferer : referer || playerReferer
  };
}

function fetchText(path, referer) {
  const url = absolute(path);
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: referer || BASE + '/'
  };
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const response = Widget.http.get(url, { headers });
    if (typeof response === 'string') return response;
    if (response && typeof response.data === 'string') return response.data;
    if (response && response.data != null) return JSON.stringify(response.data);
    return String(response || '');
  }
  if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
    const response = $fetch.get(url, { headers });
    return typeof response === 'string' ? response : String((response && response.data) || '');
  }
  throw new Error('当前环境没有可用的 HTTP GET 能力');
}

function safeFetch(path, referer) {
  try {
    return fetchText(path, referer);
  } catch (error) {
    return '';
  }
}

function imageHeaders(referer) {
  return {
    'User-Agent': UA,
    Referer: referer || BASE + '/'
  };
}

function absolute(path) {
  const value = decodeEntities(String(path || '').trim());
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  if (value[0] === '/') return BASE + value;
  return BASE + '/' + value;
}

function absoluteMediaURL(path) {
  const value = decodeJSString(String(path || '').trim());
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  return absolute(value);
}

function normalizePath(value) {
  const text = decodeEntities(String(value || '').trim());
  if (!text) return '';
  if (/^https?:\/\//i.test(text)) return text.replace(BASE, '');
  return text.charAt(0) === '/' ? text : '/' + text;
}

function normalizeItemId(value) {
  let id = String(value || '').trim();
  if (/^https?:\/\//i.test(id)) id = id.replace(BASE, '');
  id = id.replace(/^detail:/, '');
  if (/^\/vodplay\/(\d+)-/.test(id)) id = id.replace(/^\/vodplay\/(\d+)-.*$/, '/voddetail/$1.html');
  return normalizePath(id);
}

function makePageId(path) {
  const value = String(path || '/').trim();
  if (value === 'short-feed' || value === 'feed') return 'short-feed';
  if (value.indexOf('query:') === 0) return value;
  if (value.indexOf('path:') === 0) return value;
  return 'path:' + normalizePath(value || '/');
}

function parsePageId(pageId) {
  const id = String(pageId || '').replace(/^category:/, '');
  if (id === 'short-feed' || id === 'feed' || id === 'shortFeed') return { feed: true, title: '刷短剧' };
  if (id.indexOf('query:') === 0) {
    const query = decodeURIComponent(id.slice('query:'.length));
    return { query, title: query };
  }
  const path = id.indexOf('path:') === 0 ? normalizePath(id.slice(5)) : normalizePath(id || '/');
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
  return CHANNELS.filter(function (channel) {
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
  const match = /\/vod(?:type|show)\/(\d+)/.exec(String(path || ''));
  return match ? Number(match[1]) : 0;
}

function contentTypeFromPath(path) {
  const channel = channelFromPath(path);
  return channel ? channel.mediaType : 'mixed';
}

function applySort(path, sort) {
  const typeId = typeIdFromPath(path);
  if (!typeId) return path;
  if (sort === 'hits') return '/vodshow/' + typeId + '--hits---------.html';
  if (sort === 'score') return '/vodshow/' + typeId + '--score---------.html';
  return '/vodtype/' + typeId + '.html';
}

function sortFromPath(path) {
  if (/--hits/.test(String(path || ''))) return 'hits';
  if (/--score/.test(String(path || ''))) return 'score';
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
  const text = String(html || '');
  if (/>下一页<\/a>/i.test(text)) return true;
  const mobile = /<span class="num">(\d+)\/(\d+)<\/span>/i.exec(text);
  if (mobile) return Number(mobile[1]) < Number(mobile[2]);
  return new RegExp('[-]' + (numberValue(page, 1) + 1) + '\\.html').test(text);
}

function inferDetailType(typeText, status, episodes) {
  const text = String(typeText || '') + ' ' + String(status || '');
  if (/电影/.test(text)) return 'movie';
  if (/电视剧|国产剧|港台剧|香港剧|台湾剧|日剧|韩剧|欧美剧|泰剧|海外剧|短剧|动漫|动画|综艺|更新至|全\s*\d+\s*集|第\s*\d+\s*集|第\s*\d+\s*期/.test(text)) {
    return 'series';
  }
  if ((episodes || []).length <= 1) return 'movie';
  return 'series';
}

function inferTypeFromText(value) {
  const text = String(value || '');
  if (/电视剧|国产剧|港台剧|香港剧|台湾剧|日剧|韩剧|欧美剧|泰剧|海外剧|短剧|动漫|动画|综艺|更新至|全\s*\d+\s*集|第\s*\d+\s*集|第\s*\d+\s*期/.test(text)) {
    return 'series';
  }
  if (/电影|剧情|动作|喜剧|爱情|科幻|恐怖|惊悚|悬疑|犯罪|战争|纪录|HD|TC|TS|BD|正片|国语|中字/.test(text)) {
    return 'movie';
  }
  return 'series';
}

function mediaTypeFromTypeText(typeText, status) {
  const type = String(typeText || '');
  if (/电视剧|国产剧|港台剧|香港剧|台湾剧|日剧|韩剧|欧美剧|泰剧|海外剧|短剧|动漫|动画|综艺/.test(type)) return 'series';
  if (/电影|剧情|动作|喜剧|爱情|科幻|恐怖|惊悚|悬疑|犯罪|战争|纪录/.test(type)) return 'movie';
  return inferTypeFromText(type + ' ' + String(status || ''));
}

function normalizeMediaType(value) {
  const text = String(value || '').toLowerCase();
  if (text === 'movie') return 'movie';
  if (text === 'series') return 'series';
  return inferTypeFromText(value);
}

function itemMediaType(input) {
  const signal = [input && input.status, input && input.subtitle, input && input.description].join(' ');
  if (/更新至|全\s*\d+\s*集|第\s*\d+\s*集|第\s*\d+\s*期|已完结/.test(signal)) return 'series';
  if (/HD|TC|TS|BD|正片|国语|中字|英语|粤语/.test(signal) && input && input.contentType !== 'series') return 'movie';
  return normalizeMediaType((input && input.contentType) || signal);
}

function cleanTypeText(value) {
  return cleanText(value)
    .replace(/\s*(地区|年份)：[\s\S]*$/g, '')
    .replace(/^类型：/, '')
    .trim();
}

function episodeIndexFromTitle(title, fallback) {
  const match = /(?:第)?0*(\d+)(?:集|期)?/.exec(String(title || ''));
  return match ? Number(match[1]) : fallback;
}

function versionId(itemId, lineId, episodeId, playPage) {
  return ['baixiaotang', normalizeItemId(itemId), lineId || 'line1', episodeId || '1', normalizePath(playPage)].filter(Boolean).join('|');
}

function parseVersionId(value) {
  const parts = String(value || '').split('|');
  if (parts[0] !== 'baixiaotang') return {};
  return {
    itemId: parts[1] || '',
    lineId: parts[2] || '',
    episodeId: parts[3] || '',
    playPage: parts[4] || ''
  };
}

function isPlayPageURL(value) {
  return /(?:^|\/)vodplay\/\d+-\d+-\d+\.html(?:[?#].*)?$/i.test(String(value || ''));
}

function itemIdFromPlayPage(value) {
  const match = /\/vodplay\/(\d+)-/.exec(String(value || ''));
  return match ? '/voddetail/' + match[1] + '.html' : '';
}

function isDirectMediaURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts)(\?|#|$)/i.test(String(url || ''));
}

function inferContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(String(url || ''));
  return match ? match[1].toLowerCase() : undefined;
}

function cleanOverview(value, title) {
  let text = stripTags(String(value || '').replace(/<br\s*\/?>/gi, '\n'));
  text = text
    .replace(/^《[^》]+》上映于.*?剧情简介：/s, '')
    .replace(new RegExp('^《' + escapeRegExp(title || '') + '》剧情简介：'), '')
    .replace(/\s+/g, ' ')
    .replace(/\}\s*等主演/g, '等主演')
    .trim();
  return text;
}

function shortOverview(title, year, area, status, typeText) {
  return ['《' + title + '》', year ? year + '年' : '', area || '', status || '', typeText || '影视资源'].filter(Boolean).join(' · ');
}

function splitPeople(value) {
  const text = cleanText(value);
  if (!text || /^(未知|未录入|暂无|无)$/.test(text)) return [];
  return unique(text.split(/[,\s，、/]+/).filter(Boolean)).slice(0, 12);
}

function splitList(value) {
  return unique(cleanText(value).split(/[,\s，、/]+/).filter(Boolean));
}

function scoreValue(value) {
  const num = Number(String(value || '').trim());
  if (!isFinite(num) || num <= 0) return undefined;
  return num;
}

function yearFrom(value) {
  const match = /(\d{4})/.exec(String(value || ''));
  if (!match) return undefined;
  const year = Number(match[1]);
  return year > 1800 ? year : undefined;
}

function numberValue(value, fallback) {
  const num = Number(value);
  return isFinite(num) && num > 0 ? num : fallback;
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
  const match = regex.exec(String(value || ''));
  return match ? match[1] || '' : '';
}

function matchAll(value, regex) {
  const out = [];
  const text = String(value || '');
  let match;
  regex.lastIndex = 0;
  while ((match = regex.exec(text))) {
    out.push(match.length > 2 ? match : match[1]);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return out;
}

function attr(value, name) {
  return decodeEntities(firstMatch(value, new RegExp(name + '="([^"]*)"', 'i')));
}

function stripTags(value) {
  return decodeEntities(String(value || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' '));
}

function cleanText(value) {
  return decodeEntities(String(value || '').replace(/&nbsp;/g, ' ')).replace(/\s+/g, ' ').trim();
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

function decodeJSString(value) {
  return String(value || '')
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
    const key = String(value || '').trim();
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cacheDetail(detail) {
  if (!detail || !detail.id) return;
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set('baixiaotang.detail.' + detail.id, detail);
  }
}

function getCachedDetail(itemId) {
  if (!itemId || typeof Widget === 'undefined' || !Widget.storage || typeof Widget.storage.get !== 'function') return null;
  const value = Widget.storage.get('baixiaotang.detail.' + itemId);
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

const BaixiaotangMiniLibrary = {
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

const __jsEvalReturn = BaixiaotangMiniLibrary;

if (typeof globalThis !== 'undefined') {
  globalThis.BaixiaotangMiniLibrary = BaixiaotangMiniLibrary;
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
  globalThis.__jsEvalReturn = __jsEvalReturn;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaixiaotangMiniLibrary;
}
