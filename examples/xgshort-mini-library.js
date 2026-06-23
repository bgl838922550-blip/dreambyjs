// @name 西瓜短剧

const XG_BASE = 'https://www.xgshort.com';
const XG_API = XG_BASE + '/api';
const XG_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const XG_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="10" y1="8" x2="86" y2="88" gradientUnits="userSpaceOnUse"><stop stop-color="#ff3b5f"/><stop offset=".54" stop-color="#ff8a2a"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="96" height="96" rx="24" fill="#101014"/><rect x="13" y="14" width="70" height="68" rx="20" fill="url(#g)"/><path d="M32 30c8-10 24-10 32 0 10 13 1 35-16 42-17-7-26-29-16-42Z" fill="#fff" opacity=".92"/><path d="M41 42v18l17-9-17-9Z" fill="#101014"/><path d="M26 26c12-10 32-10 44 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".62"/></svg>'
  );

const CHANNELS = [
  { id: 1, key: 'drama', title: '短剧', mediaType: 'series', style: 'discover.spotlight' },
  { id: 2, key: 'movie', title: '电影', mediaType: 'movie', style: 'discover.ranked' },
  { id: 3, key: 'series', title: '电视剧', mediaType: 'series', style: 'discover.posterCompact' }
];

const DEFAULT_FILTER_IDS = [0, 0, 0, 0, 0, 0];
const HOME_TOPIC_LIMIT = 12;
const TOPIC_PREVIEW_LIMIT = 4;
const MAX_DETAIL_EPISODES = 500;

const SORT_OPTIONS = [
  { id: '0', title: '最新', value: '0' },
  { id: '1', title: '人气最高', value: '1' },
  { id: '2', title: '评分最高', value: '2' }
];

const memoryStore = {};

const WidgetMetadata = {
  id: 'xgshort-mini-library',
  name: '西瓜短剧',
  title: '西瓜短剧',
  version: '1.0.0',
  author: 'baiPlay',
  site: XG_BASE,
  logo: XG_LOGO,
  icon: XG_LOGO,
  description: '接入 xgshort.com API 的短剧自定义媒体库，支持首页、频道筛选、短剧详情、全集选集、搜索、播放解析和刷短剧模式。'
};

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
      playback: true,
      resourceVersions: true,
      shortFeed: true,
      aggregation: true,
      playbackHistory: true,
      resourceMatching: false,
      resourceMatch: {
        enabled: false,
        parameters: ['title', 'alternativeTitles', 'year', 'mediaType', 'seasonNumber', 'episodeNumber']
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    }
  };
}

async function getHome() {
  const modules = await safeHomeModules(1, 1);
  const hero = bannerItems(modules);
  const homeList = moduleVideoItems(modules).slice(0, 18);

  return {
    pageType: 'home',
    id: 'xgshort-home',
    title: WidgetMetadata.title,
    heroAspectRatio: '16:9',
    hero,
    sections: [
      {
        id: 'xgshort-feed-entry',
        title: '刷短剧',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'xgshort-feed-entry', title: '刷短剧' },
        items: [shortFeedEntry([])]
      },
      {
        id: 'xgshort-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'xgshort-channels', title: '频道入口' },
        items: CHANNELS.map(function (channel, index) {
          return channelEntry(channel, [], index + 1);
        })
      },
      {
        id: 'xgshort-topics',
        title: '题材速览',
        style: 'discover.annualListPreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'xgshort-topics', title: '题材速览' },
        items: topicSeedItems([], 1)
      },
      {
        id: 'xgshort-home-hot',
        title: '首页热播',
        style: 'discover.spotlight',
        moreAction: categoryAction('channel:1', '短剧热播', '2:3'),
        lazy: homeList.length === 0,
        loadAction: { type: 'custom', id: 'xgshort-home-hot', title: '首页热播' },
        items: homeList
      },
      {
        id: 'xgshort-drama-rank',
        title: '短剧人气榜',
        style: 'discover.ranked',
        lazy: true,
        loadAction: { type: 'custom', id: 'xgshort-drama-rank', title: '短剧人气榜' },
        moreAction: categoryAction('filter:1:1,0,0,0,0,0', '短剧人气榜', '2:3'),
        items: []
      },
      {
        id: 'xgshort-movie',
        title: '电影片单',
        style: 'discover.editorial',
        lazy: true,
        loadAction: { type: 'custom', id: 'xgshort-movie', title: '电影片单' },
        moreAction: categoryAction('channel:2', '电影片单', '2:3'),
        items: []
      },
      {
        id: 'xgshort-series',
        title: '电视剧片单',
        style: 'discover.posterCompact',
        lazy: true,
        loadAction: { type: 'custom', id: 'xgshort-series', title: '电视剧片单' },
        moreAction: categoryAction('channel:3', '电视剧片单', '2:3'),
        items: []
      }
    ]
  };
}

async function getHomeSection(ctx = {}) {
  const sectionId = stringValue(ctx.sectionId || ctx.id);

  if (sectionId === 'xgshort-feed-entry') {
    const preview = await safeRecommendItems(1, 8);
    return {
      id: sectionId,
      title: '刷短剧',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: [shortFeedEntry(preview)]
    };
  }

  if (sectionId === 'xgshort-channels') {
    const items = [];
    for (let index = 0; index < CHANNELS.length; index += 1) {
      const channel = CHANNELS[index];
      const preview = await safeFilterItems(channel.id, DEFAULT_FILTER_IDS, 1, 5);
      items.push(channelEntry(channel, preview, index + 1));
    }
    return {
      id: sectionId,
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items
    };
  }

  if (sectionId === 'xgshort-topics') {
    const filters = await safeFilterTags();
    const topics = topicSeedItems(filters, 1);
    const items = [];
    for (let index = 0; index < topics.length; index += 1) {
      const topic = topics[index];
      const ids = parseFilterPageId(topic.action.pageId).ids;
      const preview = (await safeFilterItems(1, ids, 1, TOPIC_PREVIEW_LIMIT)).slice(0, TOPIC_PREVIEW_LIMIT);
      topic.previewItems = preview;
      topic.metadataText = preview.length ? `${preview.length} 条预览` : topic.metadataText;
      items.push(topic);
    }
    return {
      id: sectionId,
      title: '题材速览',
      style: 'discover.annualListPreview',
      lazy: false,
      items
    };
  }

  if (sectionId === 'xgshort-home-hot') {
    const items = await safeFilterItems(1, DEFAULT_FILTER_IDS, 1, 18);
    return mediaSection(sectionId, '首页热播', 'discover.spotlight', categoryAction('channel:1', '短剧热播', '2:3'), items);
  }

  if (sectionId === 'xgshort-drama-rank') {
    const items = await safeFilterItems(1, [1, 0, 0, 0, 0, 0], 1, 18);
    return mediaSection(sectionId, '短剧人气榜', 'discover.ranked', categoryAction('filter:1:1,0,0,0,0,0', '短剧人气榜', '2:3'), items);
  }

  if (sectionId === 'xgshort-movie') {
    const items = await safeFilterItems(2, DEFAULT_FILTER_IDS, 1, 18);
    return mediaSection(sectionId, '电影片单', 'discover.editorial', categoryAction('channel:2', '电影片单', '2:3'), items);
  }

  if (sectionId === 'xgshort-series') {
    const items = await safeFilterItems(3, DEFAULT_FILTER_IDS, 1, 18);
    return mediaSection(sectionId, '电视剧片单', 'discover.posterCompact', categoryAction('channel:3', '电视剧片单', '2:3'), items);
  }

  return {
    id: sectionId || 'xgshort-empty',
    title: ctx.title || '西瓜短剧',
    style: ctx.style || 'discover.posterCompact',
    lazy: false,
    items: []
  };
}

async function getCategory(ctx = {}) {
  const pageId = stringValue(ctx.pageId || ctx.id || 'channel:1');
  const page = positiveInt(ctx.page, 1);
  const sortValue = stringValue(ctx.sort || ctx.sortBy || ctx.sort_by || ctx.selectedSort);

  if (pageId === 'feed' || pageId === 'shortFeed' || pageId === 'xgshort-feed') {
    const result = await recommendPage(page, 10);
    return {
      pageType: 'shortFeed',
      id: 'feed',
      title: ctx.title || '刷短剧',
      style: 'media.posterGrid',
      itemAspectRatio: '9:16',
      items: result.items,
      page,
      hasMore: result.hasMore
    };
  }

  const parsed = parseFilterPageId(pageId);
  const ids = parsed.ids.slice();
  if (sortValue && /^\d+$/.test(sortValue)) ids[0] = Number(sortValue);
  const result = await filterPage(parsed.channelId, ids, page, 30);
  const channel = channelById(parsed.channelId);
  return {
    pageType: 'category',
    id: pageId,
    title: ctx.title || parsed.title || channel.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: result.items,
    page,
    hasMore: result.hasMore,
    sortOptions: SORT_OPTIONS,
    selectedSortValue: String(ids[0] || 0)
  };
}

async function search(ctx = {}) {
  const query = stringValue(ctx.query || ctx.keyword || ctx.text);
  if (!query) return [];
  const page = positiveInt(ctx.page, 1);
  const response = await apiGet('/list/fuzzysearch', { keyword: query, page, size: 30 });
  const payload = unwrapData(response);
  const list = arrayValue(payload && payload.list);
  let items = list.map(seriesItem);
  if (!items.length && page === 1) {
    items = await safeFilterItems(1, DEFAULT_FILTER_IDS, 1, 12);
  }
  return {
    pageType: 'category',
    id: 'search:' + encodeURIComponent(query),
    title: '搜索 ' + query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items,
    page,
    hasMore: !!(payload && payload.hasMore)
  };
}

async function getDetail(ctx = {}) {
  const seriesShortId = parseSeriesShortId(ctx.itemId || ctx.id);
  if (!seriesShortId) throw new Error('西瓜短剧详情参数无效');
  const detail = await loadSeriesDetail(seriesShortId);
  const series = detail.seriesInfo || {};
  const episodes = detail.episodes || [];
  const firstEpisode = episodes[0] || {};
  const cover = imageURL(series.coverUrl || firstEpisode.seriesCoverUrl);
  const actors = splitPeople(series.actor || series.starring || firstEpisode.seriesActor || firstEpisode.seriesStarring);
  const title = stringValue(series.title || firstEpisode.seriesTitle || seriesShortId);
  const tags = uniqueStrings([].concat(arrayValue(series.tags), arrayValue(detail.tags), arrayValue(firstEpisode.tags)));
  const recommendations = await safeRecommendItems(1, 18);

  return {
    id: makeSeriesId(seriesShortId),
    title,
    type: 'series',
    poster: cover,
    backdrop: cover,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    detailImageAspectRatio: '2:3',
    overview: stringValue(series.description || firstEpisode.seriesDescription),
    year: yearFrom(series.postTime || firstEpisode.createdAt || tags.join(' ')),
    rating: scoreValue(series.score || firstEpisode.seriesScore),
    runtimeMinutes: secondsToMinutes(firstEpisode.duration),
    viewCountText: formatCount(series.playCount || firstEpisode.playCount),
    favoriteCountText: formatCount(firstEpisode.favoriteCount),
    genres: tags.slice(0, 8),
    cast: actors.map(function (name) {
      return {
        name,
        role: '演员',
        action: { type: 'search', query: name, title: name }
      };
    }),
    providerIds: {
      MiniLibraryItemId: makeSeriesId(seriesShortId),
      MiniLibraryType: 'series'
    },
    seasons: [
      {
        id: 'season-1',
        title: episodeSeasonTitle(series.updateStatus, episodes.length),
        seasonNumber: 1,
        episodes: episodes.map(function (episode) {
          return episodeItem(episode, series, cover);
        })
      }
    ],
    resourceGroups: episodes.length ? resourceGroupsForEpisode(episodes[0]) : [],
    recommendations: [
      {
        id: 'xgshort-related',
        title: '继续刷短剧',
        style: 'discover.standard',
        items: recommendations.map(function (item) {
          item.action = { type: 'detail', itemId: item.action.itemId };
          return item;
        })
      }
    ]
  };
}

async function getResourceVersions(ctx = {}) {
  const seriesShortId = parseSeriesShortId(ctx.itemId || ctx.id);
  if (!seriesShortId) return [];
  const detail = await loadSeriesDetail(seriesShortId);
  const episodes = detail.episodes || [];
  const episodeId = stringValue(ctx.episodeId);
  const episode = episodes.find(function (item) {
    return String(item.shortId || item.id) === episodeId || String(item.episodeNumber) === episodeId;
  }) || episodes[0];
  return episode ? resourceGroupsForEpisode(episode) : [];
}

async function resolvePlayback(ctx = {}) {
  const directURL = stringValue(ctx.url || ctx.playUrl);
  if (/^https?:\/\//i.test(directURL)) {
    return playbackResult(directURL);
  }

  const parsed = parseVersionId(ctx.versionId || ctx.sourceId || ctx.id || ctx.url || ctx.playPage || ctx.href);
  const accessKey = parsed.episodeAccessKey || directURL;
  if (!accessKey) throw new Error('西瓜短剧播放参数缺少 accessKey');

  const response = await apiPost('/video/url/query', {
    type: 'episode',
    accessKey
  });
  const payload = unwrapData(response);
  const urls = arrayValue(payload && payload.urls);
  const selected = selectPlayableURL(urls, parsed);
  const finalURL = stringValue(selected && (selected.cdnUrl || selected.ossUrl || selected.url || selected.playUrl));
  if (!finalURL) throw new Error('西瓜短剧没有返回可播放地址');
  return playbackResult(finalURL);
}

async function recommendPage(page, size) {
  const response = await apiGet('/video/recommend', { page, size });
  const payload = unwrapData(response);
  const list = arrayValue(payload && payload.list);
  return {
    items: list.map(feedEpisodeItem),
    hasMore: !!(payload && payload.hasMore)
  };
}

async function filterPage(channelId, ids, page, size) {
  const normalizedIds = normalizeFilterIds(ids);
  const response = await apiGet('/list/getfiltersdata', {
    channeid: channelId,
    ids: normalizedIds.join(','),
    page,
    size
  });
  const payload = unwrapData(response);
  const list = arrayValue(payload && payload.list);
  return {
    items: list.map(seriesItem),
    hasMore: !!(payload && payload.hasMore)
  };
}

async function loadSeriesDetail(seriesShortId) {
  const cacheKey = 'xgshort.detail.' + seriesShortId;
  const cached = storageGet(cacheKey);
  if (cached && cached.time && cached.data && Date.now() - Number(cached.time) < 10 * 60 * 1000) {
    return cached.data;
  }

  let page = 1;
  let hasMore = true;
  let seriesInfo = null;
  let tags = [];
  const episodes = [];
  while (hasMore && episodes.length < MAX_DETAIL_EPISODES) {
    const response = await apiGet('/video/episodes', {
      seriesShortId,
      page,
      size: Math.min(200, MAX_DETAIL_EPISODES - episodes.length)
    });
    const payload = unwrapData(response);
    if (!seriesInfo && payload && payload.seriesInfo) seriesInfo = payload.seriesInfo;
    if (payload && payload.tags) tags = payload.tags;
    const list = arrayValue(payload && payload.list);
    episodes.push.apply(episodes, list);
    hasMore = !!(payload && payload.hasMore) && list.length > 0;
    page += 1;
  }

  const detail = { seriesInfo: seriesInfo || {}, tags, episodes };
  storageSet(cacheKey, { time: Date.now(), data: detail });
  return detail;
}

async function safeHomeModules(channelId, page) {
  try {
    const response = await apiGet('/home/gethomemodules', { channeid: channelId, page });
    const payload = unwrapData(response);
    return arrayValue(payload && payload.list);
  } catch (_) {
    return [];
  }
}

async function safeFilterTags() {
  try {
    const response = await apiGet('/list/getfilterstags');
    const payload = unwrapData(response);
    return arrayValue(payload && payload.list);
  } catch (_) {
    return [];
  }
}

async function safeFilterItems(channelId, ids, page, size) {
  try {
    return (await filterPage(channelId, ids, page, size)).items;
  } catch (_) {
    return [];
  }
}

async function safeRecommendItems(page, size) {
  try {
    return (await recommendPage(page, size)).items;
  } catch (_) {
    return [];
  }
}

function mediaSection(id, title, style, moreAction, items) {
  return {
    id,
    title,
    style,
    lazy: false,
    moreAction,
    items
  };
}

function shortFeedEntry(previewItems) {
  return {
    id: 'xgshort-feed',
    title: '刷短剧',
    subtitle: '上下滑动连续看',
    type: 'collection',
    poster: previewItems[0] && (previewItems[0].backdrop || previewItems[0].poster),
    backdrop: previewItems[0] && (previewItems[0].poster || previewItems[0].backdrop),
    overview: '像西瓜短剧首页一样，上下滑动直接播放推荐短剧。',
    metadataText: previewItems.length ? `${previewItems.length} 条预览` : '推荐流',
    badges: ['竖屏', '自动播放', '短剧'],
    aspectRatio: '16:9',
    imageFit: 'fill',
    imageHeaders: imageHeaders(),
    previewItems,
    action: {
      type: 'category',
      pageId: 'feed',
      title: '刷短剧',
      presentation: 'shortFeed',
      itemAspectRatio: '9:16'
    },
    providerIds: {
      MiniLibraryPresentation: 'shortFeed'
    }
  };
}

function channelEntry(channel, previewItems, rank) {
  return {
    id: 'xgshort-channel-' + channel.id,
    title: channel.title,
    subtitle: channel.key === 'drama' ? '热门短剧' : channel.title + '频道',
    type: 'collection',
    poster: previewItems[0] && previewItems[0].poster,
    backdrop: previewItems[0] && (previewItems[0].backdrop || previewItems[0].poster),
    overview: '浏览 ' + channel.title + ' 频道内容',
    metadataText: previewItems.length ? `${previewItems.length} 条预览` : '频道',
    badges: [channel.title],
    rank,
    aspectRatio: '16:9',
    imageHeaders: imageHeaders(),
    previewItems,
    action: categoryAction('channel:' + channel.id, channel.title, '2:3')
  };
}

function topicSeedItems(filters, channelId) {
  const topicFilter = filters.find(function (entry) {
    return String(entry.name || '').indexOf('题材') >= 0;
  });
  const rawTopics = arrayValue(topicFilter && topicFilter.list)
    .filter(function (entry) {
      return Number(entry.classifyId) > 0;
    })
    .slice(0, HOME_TOPIC_LIMIT);
  const topics = rawTopics.length ? rawTopics : [
    { classifyId: 1, classifyName: '男频' },
    { classifyId: 2, classifyName: '女频' },
    { classifyId: 3, classifyName: '逆袭' },
    { classifyId: 4, classifyName: '都市' },
    { classifyId: 8, classifyName: '霸总' },
    { classifyId: 9, classifyName: '甜宠' },
    { classifyId: 15, classifyName: '重生' },
    { classifyId: 47, classifyName: '总裁' }
  ];
  return topics.map(function (topic, index) {
    const ids = [0, Number(topic.classifyId), 0, 0, 0, 0];
    const title = stringValue(topic.classifyName);
    return {
      id: 'xgshort-topic-' + topic.classifyId,
      title,
      subtitle: '题材 · ' + title,
      type: 'collection',
      overview: '浏览 ' + title + ' 题材短剧',
      metadataText: '题材分类',
      badges: ['题材', title],
      rank: index + 1,
      previewItems: [],
      action: categoryAction('filter:' + channelId + ':' + ids.join(','), title, '2:3')
    };
  });
}

function categoryAction(pageId, title, itemAspectRatio) {
  return {
    type: 'category',
    pageId,
    title,
    itemAspectRatio
  };
}

function bannerItems(modules) {
  const banners = [];
  modules.forEach(function (module) {
    arrayValue(module.banners).forEach(function (banner) {
      if (banner.isAd) return;
      const seriesShortId = stringValue(banner.shortId);
      if (!seriesShortId) return;
      const image = imageURL(banner.showURL);
      banners.push({
        id: 'xgshort-banner-' + seriesShortId,
        title: stringValue(banner.title) || '西瓜短剧',
        type: 'series',
        poster: image,
        backdrop: image,
        aspectRatio: '16:9',
        imageHeaders: imageHeaders(),
        badges: ['推荐'],
        action: { type: 'detail', itemId: makeSeriesId(seriesShortId), title: banner.title }
      });
    });
  });
  return banners;
}

function moduleVideoItems(modules) {
  const items = [];
  modules.forEach(function (module) {
    arrayValue(module.list).forEach(function (entry) {
      items.push(seriesItem(entry));
    });
  });
  return items;
}

function seriesItem(entry) {
  const shortId = stringValue(entry.shortId || entry.seriesShortId || entry.url || entry.id);
  const title = stringValue(entry.title || entry.seriesTitle || entry.name) || shortId;
  const poster = imageURL(entry.coverUrl || entry.seriesCoverUrl || entry.poster || entry.image);
  const contentType = stringValue(entry.contentType || entry.type);
  const type = mediaTypeFrom(contentType, entry);
  return {
    id: makeSeriesId(shortId),
    title,
    subtitle: [contentType, entry.upStatus || entry.updateStatus, formatCount(entry.playCount)].filter(Boolean).join(' · '),
    type,
    poster,
    backdrop: poster,
    overview: stringValue(entry.description || entry.seriesDescription),
    year: yearFrom((arrayValue(entry.tags).join(' ') || entry.createdAt || '')),
    rating: scoreValue(entry.score || entry.seriesScore),
    remarks: stringValue(entry.upStatus || entry.updateStatus),
    metadataText: formatCount(entry.playCount),
    badges: uniqueStrings([contentType].concat(arrayValue(entry.tags))).slice(0, 4),
    aspectRatio: '2:3',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    action: { type: 'detail', itemId: makeSeriesId(shortId), title }
  };
}

function feedEpisodeItem(entry) {
  const seriesShortId = stringValue(entry.seriesShortId);
  const episodeShortId = stringValue(entry.shortId || entry.episodeShortId);
  const title = stringValue(entry.seriesTitle || entry.title) || episodeShortId;
  const episodeTitle = episodeDisplayTitle(entry);
  const poster = imageURL(entry.seriesCoverUrl || entry.coverUrl);
  const versionId = makeVersionId(entry, firstURLHint(entry));
  const resourceGroups = resourceGroupsForEpisode(entry);
  return {
    id: makeEpisodeItemId(seriesShortId, episodeShortId || entry.episodeNumber),
    title,
    subtitle: episodeTitle,
    type: 'episode',
    poster,
    backdrop: poster,
    overview: stringValue(entry.seriesDescription),
    year: yearFrom(arrayValue(entry.tags).join(' ') || entry.createdAt),
    rating: scoreValue(entry.seriesScore),
    remarks: secondsToText(entry.duration),
    metadataText: [episodeTitle, formatCount(entry.playCount)].filter(Boolean).join(' · '),
    badges: uniqueStrings([entry.contentType].concat(arrayValue(entry.tags))).slice(0, 4),
    aspectRatio: '9:16',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    providerIds: {
      MiniLibraryPlaybackTitle: title,
      MiniLibraryEpisodeId: episodeShortId,
      MiniLibraryPresentation: 'shortFeed'
    },
    resourceGroups,
    action: {
      type: 'play',
      itemId: makeSeriesId(seriesShortId),
      episodeId: episodeShortId,
      versionId,
      title: title + ' ' + episodeTitle
    }
  };
}

function episodeItem(episode, series, cover) {
  const episodeShortId = stringValue(episode.shortId || episode.episodeShortId || episode.id);
  const episodeTitle = episodeDisplayTitle(episode);
  const resourceGroups = resourceGroupsForEpisode(episode);
  return {
    id: episodeShortId,
    title: episodeTitle,
    episodeNumber: positiveInt(episode.episodeNumber, undefined),
    seasonNumber: 1,
    overview: stringValue(series.description || episode.seriesDescription),
    poster: cover,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    resourceGroups,
    action: {
      type: 'play',
      itemId: makeSeriesId(episode.seriesShortId || series.shortId || ''),
      episodeId: episodeShortId,
      versionId: makeVersionId(episode, firstURLHint(episode)),
      title: episodeTitle
    }
  };
}

function resourceGroupsForEpisode(episode) {
  const urls = arrayValue(episode.urls);
  const versions = urls.length ? urls.map(function (urlHint, index) {
    const versionId = makeVersionId(episode, urlHint);
    const playURL = stringValue(urlHint.cdnUrl || urlHint.ossUrl || urlHint.url || urlHint.playUrl);
    return {
      id: versionId,
      name: qualityName(urlHint.quality) || '播放',
      subtitle: secondsToText(episode.duration),
      url: playURL || undefined,
      container: playURL ? containerFromURL(playURL) : undefined,
      headers: playbackHeaders(),
      default: index === 0,
      action: {
        type: 'play',
        episodeId: stringValue(episode.shortId || episode.episodeShortId),
        versionId,
        url: playURL || versionId,
        headers: playbackHeaders(),
        title: qualityName(urlHint.quality) || '播放'
      }
    };
  }) : [
    {
      id: makeVersionId(episode, {}),
      name: '播放',
      subtitle: secondsToText(episode.duration),
      default: true,
      action: {
        type: 'play',
        episodeId: stringValue(episode.shortId || episode.episodeShortId),
        versionId: makeVersionId(episode, {}),
        url: makeVersionId(episode, {}),
        title: '播放'
      }
    }
  ];
  return [
    {
      id: 'xgshort-quality',
      title: '清晰度',
      versions
    }
  ];
}

function makeSeriesId(shortId) {
  return 'series:' + encodeURIComponent(stringValue(shortId));
}

function parseSeriesShortId(value) {
  const text = stringValue(value);
  if (!text) return '';
  const match = /^series:(.+)$/.exec(text);
  if (match) return decodeURIComponent(match[1]);
  return decodeURIComponent(text.split(':').pop() || text);
}

function makeEpisodeItemId(seriesShortId, episodeShortId) {
  return 'episode:' + encodeURIComponent(stringValue(seriesShortId)) + ':' + encodeURIComponent(stringValue(episodeShortId));
}

function makeVersionId(episode, urlHint) {
  return [
    'xgplay',
    encodeURIComponent(stringValue(episode.episodeAccessKey || episode.accessKey)),
    encodeURIComponent(stringValue(urlHint && urlHint.accessKey)),
    encodeURIComponent(stringValue(urlHint && urlHint.quality)),
    encodeURIComponent(stringValue(episode.shortId || episode.episodeShortId || episode.id))
  ].join(':');
}

function parseVersionId(value) {
  const text = stringValue(value);
  if (text.indexOf('xgplay:') !== 0) return {};
  const parts = text.split(':');
  return {
    episodeAccessKey: decodeURIComponent(parts[1] || ''),
    qualityAccessKey: decodeURIComponent(parts[2] || ''),
    quality: decodeURIComponent(parts[3] || ''),
    episodeShortId: decodeURIComponent(parts[4] || '')
  };
}

function parseFilterPageId(value) {
  const text = stringValue(value);
  if (text.indexOf('filter:') === 0) {
    const parts = text.split(':');
    return {
      channelId: positiveInt(parts[1], 1),
      ids: normalizeFilterIds((parts[2] || '').split(',').map(function (item) { return positiveInt(item, 0); })),
      title: decodeURIComponent(parts.slice(3).join(':') || '')
    };
  }
  if (text.indexOf('channel:') === 0) {
    return {
      channelId: positiveInt(text.split(':')[1], 1),
      ids: DEFAULT_FILTER_IDS.slice(),
      title: ''
    };
  }
  return {
    channelId: 1,
    ids: DEFAULT_FILTER_IDS.slice(),
    title: ''
  };
}

function normalizeFilterIds(ids) {
  const result = DEFAULT_FILTER_IDS.slice();
  (ids || []).forEach(function (value, index) {
    if (index < result.length) result[index] = positiveInt(value, 0);
  });
  return result;
}

function channelById(id) {
  return CHANNELS.find(function (channel) {
    return Number(channel.id) === Number(id);
  }) || CHANNELS[0];
}

function firstURLHint(entry) {
  return arrayValue(entry && entry.urls)[0] || {};
}

function selectPlayableURL(urls, parsed) {
  if (!urls.length) return null;
  if (parsed.qualityAccessKey) {
    const byAccessKey = urls.find(function (url) {
      return stringValue(url.accessKey) === parsed.qualityAccessKey;
    });
    if (byAccessKey) return byAccessKey;
  }
  if (parsed.quality) {
    const byQuality = urls.find(function (url) {
      return stringValue(url.quality).toLowerCase() === parsed.quality.toLowerCase();
    });
    if (byQuality) return byQuality;
  }
  return urls.slice().sort(function (left, right) {
    return qualityScore(right.quality) - qualityScore(left.quality);
  })[0];
}

function playbackResult(url) {
  return {
    url,
    container: containerFromURL(url),
    headers: playbackHeaders(),
    isLive: false,
    streamKind: 'vod'
  };
}

function playbackHeaders() {
  return {
    'User-Agent': XG_UA,
    Referer: XG_BASE + '/',
    Origin: XG_BASE
  };
}

async function apiGet(path, query) {
  const auth = await ensureAuth();
  return requestJSON('GET', apiURL(path, query), null, authHeaders(auth));
}

async function apiPost(path, body) {
  const auth = await ensureAuth();
  return requestJSON('POST', apiURL(path), body, authHeaders(auth));
}

async function ensureAuth() {
  const cached = storageGet('xgshort.auth');
  if (cached && cached.accessToken && Number(cached.expiresAt) > Date.now() + 60 * 1000) {
    return cached;
  }
  const guestToken = cached && cached.guestToken ? cached.guestToken : '';
  const response = await requestJSON('POST', apiURL('/auth/guest-login'), { guestToken }, baseHeaders());
  const tokenType = stringValue(response.token_type || response.tokenType || 'Bearer') || 'Bearer';
  const accessToken = stringValue(response.access_token || response.accessToken);
  if (!accessToken) throw new Error('西瓜短剧游客登录失败');
  const auth = {
    tokenType,
    accessToken,
    refreshToken: stringValue(response.refresh_token || response.refreshToken),
    guestToken: stringValue(response.guestToken || guestToken),
    expiresAt: Date.now() + Math.max(1, positiveInt(response.expires_in, 604800) - 300) * 1000
  };
  storageSet('xgshort.auth', auth);
  return auth;
}

function authHeaders(auth) {
  const headers = baseHeaders();
  headers.Authorization = auth.tokenType + ' ' + auth.accessToken;
  return headers;
}

function baseHeaders() {
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': XG_UA,
    Origin: XG_BASE,
    Referer: XG_BASE + '/',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9,en;q=0.7'
  };
}

function imageHeaders() {
  return {
    'User-Agent': XG_UA,
    Referer: XG_BASE + '/'
  };
}

async function requestJSON(method, url, body, headers) {
  let response;
  if (typeof Widget !== 'undefined' && Widget.http) {
    if (method === 'POST' && typeof Widget.http.post === 'function') {
      response = Widget.http.post(url, body || {}, { headers, timeout: 15 });
    } else if (typeof Widget.http.get === 'function') {
      response = Widget.http.get(url, { headers, timeout: 15 });
    }
  } else if (typeof fetch === 'function') {
    const fetchResponse = await fetch(url, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(body || {}) : undefined
    });
    response = {
      status: fetchResponse.status,
      data: await fetchResponse.text(),
      url: fetchResponse.url
    };
  }
  if (!response) throw new Error('当前小程序环境缺少 HTTP 请求能力');
  const status = Number(response.status || 0);
  let data = response.data;
  if (typeof data === 'string') {
    if (/cloudflare|challenge-platform|cf_clearance/i.test(data)) {
      throw new Error('西瓜短剧接口返回 Cloudflare 校验页');
    }
    try {
      data = JSON.parse(data);
    } catch (error) {
      throw new Error('西瓜短剧接口返回数据不是 JSON');
    }
  }
  if (status >= 400) {
    throw new Error('西瓜短剧接口请求失败：HTTP ' + status);
  }
  if (data && typeof data === 'object' && data.code && Number(data.code) !== 200) {
    throw new Error(data.message || data.msg || '西瓜短剧接口返回错误');
  }
  return data;
}

function apiURL(path, query) {
  let url = /^https?:\/\//i.test(path) ? path : XG_API + (path.charAt(0) === '/' ? path : '/' + path);
  const params = [];
  Object.keys(query || {}).forEach(function (key) {
    const value = query[key];
    if (value == null || value === '') return;
    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
  });
  if (params.length) url += (url.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
  return url;
}

function unwrapData(response) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'data')) return response.data;
  return response;
}

function storageGet(key) {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.get === 'function') {
    return Widget.storage.get(key);
  }
  return memoryStore[key] || null;
}

function storageSet(key, value) {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set(key, value);
    return;
  }
  memoryStore[key] = value;
}

function mediaTypeFrom(contentType, entry) {
  const text = stringValue(contentType);
  if (/电影|movie/i.test(text)) return 'movie';
  if (entry && entry.isSerial === false && !/短剧|剧|series|tv/i.test(text)) return 'movie';
  return 'series';
}

function episodeDisplayTitle(episode) {
  const number = positiveInt(episode.episodeNumber, 0);
  const title = stringValue(episode.episodeTitle || episode.title);
  if (number > 0) return '第 ' + number + ' 集';
  return title || '正片';
}

function episodeSeasonTitle(updateStatus, count) {
  const status = stringValue(updateStatus);
  if (status) return status + ' · 共 ' + count + ' 集';
  return '剧集 · 共 ' + count + ' 集';
}

function splitPeople(value) {
  return uniqueStrings(
    stringValue(value)
      .split(/[,，、/|]+/)
      .map(function (item) { return item.trim(); })
      .filter(Boolean)
  ).slice(0, 18);
}

function uniqueStrings(values) {
  const seen = {};
  const result = [];
  (values || []).forEach(function (value) {
    const text = stringValue(value);
    if (!text || seen[text]) return;
    seen[text] = true;
    result.push(text);
  });
  return result;
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function stringValue(value) {
  if (value == null) return '';
  return String(value).trim();
}

function positiveInt(value, fallback) {
  const number = Number(value);
  if (!isFinite(number) || number < 0) return fallback == null ? 0 : fallback;
  return Math.floor(number);
}

function scoreValue(value) {
  const score = Number(value);
  if (!isFinite(score) || score <= 0) return undefined;
  return score;
}

function yearFrom(value) {
  const match = /(?:^|[^\d])((?:19|20)\d{2})(?:[^\d]|$)/.exec(stringValue(value));
  return match ? Number(match[1]) : undefined;
}

function secondsToMinutes(seconds) {
  const value = Number(seconds);
  if (!isFinite(value) || value <= 0) return undefined;
  return Math.max(1, Math.round(value / 60));
}

function secondsToText(seconds) {
  const value = Number(seconds);
  if (!isFinite(value) || value <= 0) return '';
  const minutes = Math.floor(value / 60);
  const rest = Math.floor(value % 60);
  if (minutes <= 0) return rest + '秒';
  return minutes + ':' + String(rest).padStart(2, '0');
}

function formatCount(value) {
  const number = Number(value);
  if (!isFinite(number) || number <= 0) return '';
  if (number >= 100000000) return trimNumber(number / 100000000) + '亿';
  if (number >= 10000) return trimNumber(number / 10000) + '万';
  return String(Math.round(number));
}

function trimNumber(value) {
  return (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, '');
}

function qualityName(value) {
  const text = stringValue(value);
  return text ? text.toUpperCase() : '';
}

function qualityScore(value) {
  const match = /(\d{3,4})/.exec(stringValue(value));
  return match ? Number(match[1]) : 0;
}

function containerFromURL(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(stringValue(url));
  return match ? match[1].toLowerCase() : undefined;
}

function imageURL(value) {
  const text = stringValue(value);
  if (!text) return undefined;
  if (/^https?:\/\//i.test(text)) return text;
  if (text.indexOf('//') === 0) return 'https:' + text;
  if (text.charAt(0) === '/') return XG_BASE + text;
  return text;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getManifest,
    getHome,
    getHomeSection,
    getCategory,
    getDetail,
    getResourceVersions,
    resolvePlayback,
    search
  };
}
