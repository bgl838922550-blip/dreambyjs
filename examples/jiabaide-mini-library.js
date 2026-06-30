// @name 金牌影院

const JBD_DEFAULT_BASE = 'https://m.jiabaide.cn';
const JBD_SIGN_KEY = 'cb808529bae6b6be45ecfab29a4889bc';
const JBD_LOGO =
  'https://obs.3688baihuo.com/upload/site_logo/20260531-1/31032dae244fccedcad3e30a5effb6d6.png';
const JBD_ICON =
  'https://obs.3688baihuo.com/upload/site_ico/20260531-1/53565006f2db042f36d9395e454dc818_180x180.png';
const JBD_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1';
const JBD_DEVICE_ID = 'baiPlay-jiabaide-11111111-2222-4333-8444-555555555555';

const WidgetMetadata = {
  id: 'jiabaide-mini-library',
  name: '金牌影院',
  title: '金牌影院',
  version: '1.0.0',
  author: 'baiPlay',
  logo: JBD_LOGO,
  icon: JBD_ICON,
  site: JBD_DEFAULT_BASE,
  description: '金牌影院自定义媒体库，支持电影、电视剧、综艺、动漫、短剧、搜索、详情、选集、清晰度选择和播放解析。'
};

const JBD_CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '院线与高清电影', typeId: 1, mediaType: 'movie', style: 'discover.posterCompact' },
  { id: 'tv', title: '电视剧', subtitle: '连续剧与热门剧集', typeId: 2, mediaType: 'series', style: 'discover.spotlight' },
  { id: 'show', title: '综艺', subtitle: '热门综艺与真人秀', typeId: 3, mediaType: 'series', style: 'discover.rankedPosterCompact' },
  { id: 'anime', title: '动漫', subtitle: '国漫、日漫与动画', typeId: 4, mediaType: 'series', style: 'discover.editorial' },
  { id: 'short', title: '短剧', subtitle: '短剧片库', typeId: 88, mediaType: 'series', style: 'discover.posterCompact' }
];

const JBD_HOME_SECTIONS = [
  { id: 'jbd-hot-movie', title: '热门电影', typeId: 1, sort: 3, style: 'discover.ranked', mediaType: 'movie' },
  { id: 'jbd-latest-movie', title: '最新电影', typeId: 1, sort: 1, style: 'discover.posterCompact', mediaType: 'movie' },
  { id: 'jbd-latest-tv', title: '最新电视剧', typeId: 2, sort: 1, style: 'discover.spotlight', mediaType: 'series' },
  { id: 'jbd-hot-tv', title: '热门电视剧', typeId: 2, sort: 3, style: 'discover.rankedPosterCompact', mediaType: 'series' },
  { id: 'jbd-latest-show', title: '最新综艺', typeId: 3, sort: 1, style: 'discover.editorial', mediaType: 'series' },
  { id: 'jbd-latest-anime', title: '最新动漫', typeId: 4, sort: 1, style: 'discover.posterCompact', mediaType: 'series' },
  { id: 'jbd-latest-short', title: '短剧上新', typeId: 88, sort: 1, style: 'discover.spotlight', mediaType: 'series' }
];

const JBD_SORT_OPTIONS = [
  { id: '1', title: '最近更新', value: '1' },
  { id: '2', title: '添加时间', value: '2' },
  { id: '3', title: '人气高低', value: '3' },
  { id: '4', title: '评分高低', value: '4' }
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
    },
    parameters: [
      {
        name: 'site',
        title: '站点地址',
        type: 'input',
        value: JBD_DEFAULT_BASE,
        required: true,
        description: '金牌影院接口地址，默认使用移动端接口。'
      }
    ]
  };
}

function getHome(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const eager = safeList(site, 1, 1, 12, 1).items;
  const hero = eager.slice(0, 8).map(function (item, index) {
    const next = cloneItem(item);
    next.rank = index + 1;
    next.aspectRatio = '2:3';
    return next;
  });

  return {
    pageType: 'home',
    id: 'jbd-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '2:3',
    hero,
    carousel: hero,
    sections: [
      {
        id: 'jbd-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'jbd-channels', sectionId: 'jbd-channels', title: '频道入口' },
        items: JBD_CHANNELS.map(function (channel, index) {
          return channelEntry(channel, [], index + 1);
        })
      }
    ].concat(
      JBD_HOME_SECTIONS.map(function (section) {
        const eagerItems = section.id === 'jbd-latest-movie' ? eager : [];
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.mediaType,
          lazy: true,
          promotesToHero: section.id === 'jbd-latest-movie',
          loadAction: { type: 'custom', id: section.id, sectionId: section.id, title: section.title },
          moreAction: categoryAction(section.typeId, section.title, section.mediaType, section.sort),
          items: eagerItems
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const sectionId = stringValue(args.sectionId || args.id || args.pageId);

  if (sectionId === 'jbd-channels') {
    return {
      id: 'jbd-channels',
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: JBD_CHANNELS.map(function (channel, index) {
        const preview = safeNewestByType(site, channel.typeId, channel.mediaType).slice(0, 6);
        return channelEntry(channel, preview, index + 1);
      })
    };
  }

  const section = findById(JBD_HOME_SECTIONS, sectionId);
  if (!section) {
    return {
      id: sectionId || 'jbd-unknown-section',
      title: stringValue(args.title) || WidgetMetadata.title,
      style: stringValue(args.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  const list = safeList(site, section.typeId, section.sort || 1, 18, 1);
  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.mediaType,
    lazy: false,
    promotesToHero: section.id === 'jbd-latest-movie',
    moreAction: categoryAction(section.typeId, section.title, section.mediaType, section.sort),
    items: list.items.slice(0, 18)
  };
}

function getCategory(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const parsed = parsePageId(args.pageId || args.id || args.categoryId || args.typeId || 'type:1');
  const page = numberValue(args.page, 1);
  const sort = normalizeSort(args.sort || args.sortBy || args.sort_by || args.selectedSortValue || parsed.sort || '1');
  const pageSize = numberValue(args.pageSize, 30);

  if (parsed.kind === 'home-type') {
    const all = fetchNewestGroups(site, parsed.typeId);
    const group = all.filter(function (entry) {
      return entry.typeId === parsed.subTypeId || entry.typeName === parsed.title;
    })[0];
    const items = (group && group.vodList ? group.vodList : []).map(function (raw, index) {
      return mediaItem(raw, index + 1, parsed.mediaType);
    });
    return categoryPage(parsed.id, parsed.title, parsed.mediaType, items, 1, false, [], '');
  }

  const list = safeList(site, parsed.typeId, sort, pageSize, page);
  return categoryPage(parsed.id, parsed.title, parsed.mediaType, list.items, page, list.hasMore, JBD_SORT_OPTIONS, sort);
}

function getDetail(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const itemId = numberValue(args.itemId || args.id || args.vodId, 0);
  if (!itemId) throw new Error('金牌影院详情参数为空');
  const data = detailData(site, itemId);
  const detail = buildDetail(site, data);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const itemId = numberValue(args.itemId || args.id || decoded.itemId || args.vodId, 0);
  const episodeId = stringValue(args.episodeId || args.episode || decoded.episodeId || args.nid || '');
  if (!itemId) return { groups: [] };
  const detail = getCachedDetail(itemId) || getDetail({ itemId, params: args.params, config: args.config, settings: args.settings });
  const target = findEpisode(detail, episodeId) || firstEpisode(detail);
  if (!target) return { groups: [] };
  const list = safeEpisodeURL(site, itemId, target.nid || target.id);
  const versions = list.map(function (entry, index) {
    const versionId = encodeVersionId(itemId, target.nid || target.id, entry.resolution || index, index);
    return {
      id: versionId,
      title: entry.resolutionName || qualityName(entry.resolution) || '播放',
      name: entry.resolutionName || qualityName(entry.resolution) || '播放',
      subtitle: target.title || target.name,
      quality: entry.resolutionName || qualityName(entry.resolution),
      resolution: entry.resolution,
      sourceName: WidgetMetadata.title,
      availability: 'requiresResolve',
      default: index === 0,
      container: inferContainer(entry.url || '') || 'm3u8',
      headers: playbackHeaders(site, itemId, target.nid || target.id),
      action: {
        type: 'play',
        itemId: String(itemId),
        episodeId: String(target.nid || target.id),
        versionId,
        title: target.title || target.name || detail.title
      },
      ext: {
        vodId: itemId,
        nid: target.nid || target.id,
        index,
        resolution: entry.resolution
      }
    };
  });
  return {
    itemId: String(itemId),
    seasonId: 's1',
    episodeId: String(target.nid || target.id),
    groups: versions.length ? [{ id: 'jbd-quality', title: '清晰度', versions }] : []
  };
}

function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const direct = stringValue(args.url || args.playUrl || args.videoUrl || (args.ext && args.ext.url));
  const itemId = numberValue(args.itemId || args.id || args.vodId || decoded.itemId || (args.ext && args.ext.vodId), 0);
  const nid = numberValue(args.nid || args.episodeId || decoded.nid || (args.ext && args.ext.nid), 0);
  const selectedIndex = numberValue(decoded.index || (args.ext && args.ext.index), 0);

  if (isDirectMediaURL(direct)) return playback(site, direct, itemId, nid);
  if (!itemId || !nid) throw new Error('金牌影院播放失败：缺少影片或剧集参数');

  const list = fetchEpisodeURL(site, itemId, nid);
  const selected = list[selectedIndex] || list[0];
  if (!selected || !selected.url) throw new Error('金牌影院播放失败：接口没有返回播放地址');
  return playback(site, selected.url, itemId, nid, selected);
}

function search(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const query = stringValue(args.query || args.keyword || args.text || args.wd).trim();
  const page = numberValue(args.page, 1);
  if (!query) {
    return {
      pageType: 'search',
      id: 'jbd-search',
      title: '搜索 金牌影院',
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
  const data = searchData(site, query, page);
  const items = ((data && data.list) || []).map(function (raw, index) {
    return mediaItem(raw, index + 1, mediaTypeFromRaw(raw));
  });
  return {
    pageType: 'search',
    id: 'jbd-search:' + query,
    title: '搜索：' + query,
    keyword: query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items,
    page,
    hasMore: page < numberValue(data && data.totalPage, page)
  };
}

function matchResources() {
  return { results: [] };
}

function getCategories() {
  return JBD_CHANNELS.map(function (channel) {
    return {
      id: makeTypePageId(channel.typeId, channel.sort || 1),
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

function categoryPage(id, title, mediaType, items, page, hasMore, sortOptions, selectedSortValue) {
  return {
    pageType: 'category',
    id,
    title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: mediaType || 'mixed',
    items: items || [],
    page: page || 1,
    hasMore: !!hasMore,
    sortOptions: sortOptions || [],
    sort: sortOptions || [],
    selectedSortValue: selectedSortValue || ''
  };
}

function channelEntry(channel, previewItems, rank) {
  const first = previewItems && previewItems[0];
  return {
    id: 'jbd-channel-' + channel.id,
    title: channel.title,
    name: channel.title,
    subtitle: channel.subtitle || channel.title,
    description: '浏览金牌影院' + channel.title + '频道。',
    overview: '浏览金牌影院' + channel.title + '频道。',
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
    action: categoryAction(channel.typeId, channel.title, channel.mediaType, 1)
  };
}

function categoryAction(typeId, title, mediaType, sort) {
  return {
    type: 'category',
    id: makeTypePageId(typeId, sort || 1),
    pageId: makeTypePageId(typeId, sort || 1),
    title,
    contentType: mediaType || mediaTypeFromTypeId(typeId),
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill'
  };
}

function subCategoryAction(typeId, subTypeId, title, mediaType) {
  return {
    type: 'category',
    id: 'homeType:' + typeId + ':' + subTypeId + ':' + encodeURIComponent(title),
    pageId: 'homeType:' + typeId + ':' + subTypeId + ':' + encodeURIComponent(title),
    title,
    contentType: mediaType || mediaTypeFromTypeId(typeId),
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill'
  };
}

function mediaItem(raw, rank, fallbackType) {
  const vodId = numberValue(raw && (raw.vodId || raw.id), 0);
  const title = cleanText(raw && (raw.vodName || raw.name || raw.title));
  const type = fallbackType || mediaTypeFromRaw(raw);
  const poster = absoluteImage(raw && (raw.vodPic || raw.pic || raw.poster));
  const backdrop = absoluteImage(raw && (raw.vodPicSlide || raw.bgImage || raw.abImage || raw.backdrop || raw.vodPic));
  const overview = cleanOverview(raw && (raw.vodBlurb || raw.vodContent || raw.content || raw.description));
  const year = yearFrom(raw && (raw.vodYear || raw.vodPubdate || raw.year));
  const rating = scoreValue(raw && (raw.vodDoubanScore || raw.vodScore || raw.score));
  const remarks = cleanText(raw && (raw.vodRemarks || raw.vodVersion || raw.vodSerial || raw.remarks));
  const genres = splitList(raw && raw.vodClass);
  const subtitle = [year, raw && raw.typeName, remarks].filter(Boolean).join(' / ');
  return {
    id: String(vodId),
    itemId: String(vodId),
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
    description: overview,
    overview,
    year,
    rating,
    rank,
    badges: unique([remarks, raw && raw.typeName, genres[0]].filter(Boolean)).slice(0, 3),
    remarks,
    status: remarks,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: {
      type: 'detail',
      itemId: String(vodId),
      id: String(vodId),
      title,
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait'
    },
    providerIds: {
      jiabaide: String(vodId)
    }
  };
}

function buildDetail(site, raw) {
  const item = mediaItem(raw, 1, mediaTypeFromRaw(raw));
  const type = detailType(raw);
  const episodes = ((raw && raw.episodeList) || []).map(function (episode, index) {
    const epIndex = numberValue(episode.sort || episode.name || index + 1, index + 1);
    const nid = numberValue(episode.nid || episode.id, 0);
    const epTitle = cleanText(episode.name) || '第' + epIndex + '集';
    return {
      id: String(nid || epIndex),
      nid,
      episodeId: String(nid || epIndex),
      title: epTitle,
      name: epTitle,
      index: epIndex,
      episodeNumber: epIndex,
      seasonNumber: 1,
      overview: epTitle,
      action: {
        type: 'play',
        itemId: String(raw.vodId),
        seasonId: 's1',
        episodeId: String(nid || epIndex),
        versionId: encodeVersionId(raw.vodId, nid || epIndex, '', 0),
        title: item.title + ' ' + epTitle
      }
    };
  });
  const cast = splitPeople(raw && raw.vodActor).map(function (name) {
    return {
      id: 'actor:' + name,
      name,
      role: '主演',
      action: { type: 'search', query: name, title: name }
    };
  });
  const crew = splitPeople(raw && raw.vodDirector).map(function (name) {
    return {
      id: 'director:' + name,
      name,
      role: '导演',
      job: '导演',
      action: { type: 'search', query: name, title: name }
    };
  });
  const genres = splitList(raw && raw.vodClass);
  const detail = {
    pageType: 'detail',
    id: String(raw.vodId),
    itemId: String(raw.vodId),
    type,
    mediaType: type,
    title: item.title,
    name: item.title,
    originalTitle: cleanText(raw && raw.vodSub),
    poster: item.poster,
    cover: item.poster,
    backdrop: item.backdrop || item.poster,
    thumb: item.backdrop || item.poster,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    detailImageAspectRatio: raw && raw.vodPicSlide ? '16:9' : '2:3',
    imageAspectRatio: raw && raw.vodPicSlide ? '16:9' : '2:3',
    posterAspectRatio: '2:3',
    overview: cleanOverview(raw && (raw.vodContent || raw.vodBlurb)) || item.overview,
    year: item.year,
    rating: item.rating,
    runtime: runtimeMinutes(raw && raw.vodDuration),
    runtimeMinutes: runtimeMinutes(raw && raw.vodDuration),
    genres,
    countries: splitList(raw && raw.vodArea),
    languages: splitList(raw && raw.vodLang),
    cast,
    crew,
    facts: [
      raw && raw.typeName ? { title: '分类', value: raw.typeName } : null,
      raw && raw.vodVersion ? { title: '版本', value: raw.vodVersion } : null,
      raw && raw.vodDuration ? { title: '片长', value: raw.vodDuration } : null,
      raw && raw.vodHits ? { title: '热度', value: String(raw.vodHits) } : null
    ].filter(Boolean),
    seasons: episodes.length
      ? [
          {
            id: 's1',
            title: type === 'movie' ? '播放' : '全集',
            index: 1,
            episodes
          }
        ]
      : [],
    recommendations: [],
    resourceSummary: {
      versionCount: 1,
      episodeCount: episodes.length,
      defaultVersionId: episodes[0] ? encodeVersionId(raw.vodId, episodes[0].nid || episodes[0].id, '', 0) : ''
    },
    sourceUrl: site + '/detail/' + raw.vodId,
    source: WidgetMetadata.id,
    providerIds: {
      jiabaide: String(raw.vodId)
    },
    rawEpisodes: episodes
  };
  return detail;
}

function playback(site, url, itemId, nid, raw) {
  const finalURL = absoluteMediaURL(url);
  const headers = playbackHeaders(site, itemId, nid);
  return {
    url: finalURL,
    videoUrl: finalURL,
    container: inferContainer(finalURL),
    headers,
    header: headers,
    Header: headers,
    title: raw && (raw.resolutionName || qualityName(raw.resolution)),
    quality: raw && (raw.resolutionName || qualityName(raw.resolution)),
    isLive: false,
    streamKind: 'vod'
  };
}

function safeList(site, typeId, sort, pageSize, page) {
  try {
    const data = listData(site, typeId, sort, pageSize, page);
    const items = ((data && data.list) || []).map(function (raw, index) {
      return mediaItem(raw, index + 1 + (numberValue(page, 1) - 1) * numberValue(pageSize, 30), mediaTypeFromRaw(raw));
    });
    return { items, hasMore: numberValue(page, 1) < numberValue(data && data.totalPage, 1) };
  } catch (error) {
    return { items: [], hasMore: false, error: String((error && error.message) || error || '') };
  }
}

function safeNewestByType(site, typeId, mediaType) {
  try {
    const groups = fetchNewestGroups(site, typeId);
    const items = [];
    groups.forEach(function (group) {
      ((group && group.vodList) || []).slice(0, 2).forEach(function (raw) {
        items.push(mediaItem(raw, items.length + 1, mediaType || mediaTypeFromRaw(raw)));
      });
    });
    return dedupeItems(items).slice(0, 8);
  } catch (error) {
    return [];
  }
}

function fetchNewestGroups(site, typeId) {
  const result = apiGet(site, '/api/mw-movie/anonymous/home/newest/list', [
    ['typeId', String(typeId)]
  ]);
  const groups = ((result && result.data && result.data.allList) || []).map(function (group) {
    const first = group && group.vodList && group.vodList[0];
    return {
      typeId: first && first.typeId,
      typeName: cleanText(group && group.typeName),
      vodList: group && group.vodList ? group.vodList : []
    };
  });
  return groups;
}

function listData(site, typeId, sort, pageSize, page) {
  const result = apiGet(site, '/api/mw-movie/anonymous/video/list', [
    ['pageNum', String(numberValue(page, 1))],
    ['pageSize', String(numberValue(pageSize, 30))],
    ['sort', String(normalizeSort(sort || '1'))],
    ['sortBy', '1'],
    ['type1', String(typeId || 1)]
  ]);
  return (result && result.data) || {};
}

function detailData(site, vodId) {
  const result = apiGet(site, '/api/mw-movie/anonymous/video/detail', [['id', String(vodId)]]);
  const data = result && result.data;
  if (!data || !data.vodId) throw new Error('金牌影院详情接口没有返回影片数据');
  return data;
}

function searchData(site, keyword, page) {
  const result = apiGet(site, '/api/mw-movie/anonymous/video/searchByWordPageable', [
    ['keyword', keyword],
    ['pageNum', String(numberValue(page, 1))],
    ['pageSize', '24'],
    ['type', 'false']
  ]);
  return (result && result.data) || {};
}

function safeEpisodeURL(site, vodId, nid) {
  try {
    return fetchEpisodeURL(site, vodId, nid);
  } catch (error) {
    return [];
  }
}

function fetchEpisodeURL(site, vodId, nid) {
  const result = apiGet(site, '/api/mw-movie/anonymous/v2/video/episode/url', [
    ['id', String(vodId)],
    ['nid', String(nid)]
  ]);
  return (result && result.data && result.data.list) || [];
}

function apiGet(site, path, pairs) {
  const base = normalizeSite(site);
  const rawQuery = queryString(pairs, false);
  const urlQuery = queryString(pairs, true);
  const t = String(Date.now());
  const headers = apiHeaders(base, rawQuery, t);
  const url = base + path + (urlQuery ? '?' + urlQuery : '');
  const result = httpGet(url, headers);
  const data = parseJSON(responseText(result));
  if (data && data.code && Number(data.code) !== 200) {
    throw new Error((data.msg || '接口返回错误') + ' (' + data.code + ')');
  }
  return data;
}

function apiHeaders(site, rawQuery, t) {
  return {
    'User-Agent': JBD_UA,
    Accept: 'application/json, text/plain, */*',
    Referer: site + '/',
    t,
    sign: signQuery(rawQuery, t),
    deviceId: deviceId()
  };
}

function signQuery(rawQuery, t) {
  return sha1Hex(md5Hex(rawQuery + '&key=' + JBD_SIGN_KEY + '&t=' + t));
}

function md5Hex(value) {
  const text = String(value);
  if (typeof $crypto !== 'undefined' && $crypto.md5) return String($crypto.md5(text));
  if (typeof Widget !== 'undefined' && Widget.crypto && Widget.crypto.md5) return String(Widget.crypto.md5(text));
  if (typeof CryptoJS !== 'undefined' && CryptoJS.MD5) return CryptoJS.MD5(text).toString();
  if (typeof require === 'function') return require('crypto').createHash('md5').update(text).digest('hex');
  throw new Error('当前小程序环境缺少 MD5 能力');
}

function sha1Hex(value) {
  const text = String(value);
  if (typeof $crypto !== 'undefined' && $crypto.sha1) return String($crypto.sha1(text));
  if (typeof Widget !== 'undefined' && Widget.crypto && Widget.crypto.sha1) return String(Widget.crypto.sha1(text));
  if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA1) return CryptoJS.SHA1(text).toString();
  if (typeof require === 'function') return require('crypto').createHash('sha1').update(text).digest('hex');
  throw new Error('当前小程序环境缺少 SHA1 能力');
}

function httpGet(url, headers) {
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    return Widget.http.get(url, { headers });
  }
  if (typeof $http !== 'undefined' && typeof $http.get === 'function') {
    return $http.get(url, { headers });
  }
  if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
    return $fetch.get(url, { headers });
  }
  if (typeof require === 'function') {
    const childProcess = require('child_process');
    const args = ['-L', '--compressed', '-sS'];
    Object.keys(headers || {}).forEach(function (key) {
      args.push('-H', key + ': ' + headers[key]);
    });
    args.push(url);
    return childProcess.execFileSync('curl', args, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 12
    });
  }
  throw new Error('当前环境没有可用的 HTTP GET 能力');
}

function responseText(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result.data === 'string') return result.data;
  if (result && result.data != null) return JSON.stringify(result.data);
  return String(result || '');
}

function parseJSON(value) {
  if (value && typeof value === 'object') return value;
  try {
    return JSON.parse(String(value || ''));
  } catch (error) {
    throw new Error('金牌影院接口响应无法解析：' + String(value || '').slice(0, 120));
  }
}

function queryString(pairs, encodeValues) {
  return (pairs || [])
    .filter(function (pair) {
      return pair && pair[0] != null && pair[1] != null;
    })
    .map(function (pair) {
      const key = String(pair[0]);
      const value = String(pair[1]);
      return key + '=' + (encodeValues ? encodeURIComponent(value) : value);
    })
    .join('&');
}

function imageHeaders(referer) {
  return {
    'User-Agent': JBD_UA,
    Referer: referer || JBD_DEFAULT_BASE + '/'
  };
}

function playbackHeaders(site, itemId, nid) {
  const base = normalizeSite(site);
  const referer = itemId && nid ? base + '/vod/play/' + itemId + '/1/' + nid : base + '/';
  return {
    'User-Agent': JBD_UA,
    Accept: '*/*',
    Origin: base,
    Referer: referer
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

function siteFromArgs(args) {
  const source =
    (args && args.params && args.params.site) ||
    (args && args.config && args.config.site) ||
    (args && args.settings && args.settings.site) ||
    (args && args.parameters && args.parameters.site) ||
    (args && args.site) ||
    WidgetMetadata.site;
  return normalizeSite(source);
}

function normalizeSite(value) {
  let site = stringValue(value || JBD_DEFAULT_BASE).trim();
  if (!site) site = JBD_DEFAULT_BASE;
  if (!/^https?:\/\//i.test(site)) site = 'https://' + site;
  site = site.replace(/\/+$/, '');
  if (/^https?:\/\/(?:www\.)?jiabaide\.cn$/i.test(site)) return JBD_DEFAULT_BASE;
  return site;
}

function deviceId() {
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.get === 'function') {
    let value = Widget.storage.get('jiabaide.deviceId');
    if (!value) {
      value = uuid();
      Widget.storage.set('jiabaide.deviceId', value);
    }
    return String(value);
  }
  return JBD_DEVICE_ID;
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) {
    const r = Math.floor(Math.random() * 16);
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parsePageId(value) {
  const raw = stringValue(value || '').replace(/^category:/, '');
  const home = /^homeType:(\d+):(\d+):(.+)$/.exec(raw);
  if (home) {
    const typeId = Number(home[1]);
    const subTypeId = Number(home[2]);
    const title = decodeURIComponent(home[3]);
    return {
      kind: 'home-type',
      id: raw,
      typeId,
      subTypeId,
      title,
      mediaType: mediaTypeFromTypeId(typeId)
    };
  }
  const match = /^type:(\d+)(?::sort:(\d+))?/.exec(raw) || /^(\d+)$/.exec(raw);
  const typeId = match ? Number(match[1]) : 1;
  const sort = match && match[2] ? match[2] : '1';
  const channel = channelFromTypeId(typeId);
  return {
    kind: 'type',
    id: makeTypePageId(typeId, sort),
    typeId,
    sort,
    title: channel ? channel.title : WidgetMetadata.title,
    mediaType: channel ? channel.mediaType : mediaTypeFromTypeId(typeId)
  };
}

function makeTypePageId(typeId, sort) {
  return 'type:' + String(typeId || 1) + ':sort:' + String(normalizeSort(sort || '1'));
}

function channelFromTypeId(typeId) {
  return JBD_CHANNELS.filter(function (channel) {
    return Number(channel.typeId) === Number(typeId);
  })[0];
}

function normalizeSort(value) {
  const text = String(value || '1');
  return /^(1|2|3|4)$/.test(text) ? text : '1';
}

function mediaTypeFromTypeId(typeId) {
  return Number(typeId) === 1 ? 'movie' : 'series';
}

function mediaTypeFromRaw(raw) {
  if (!raw) return 'mixed';
  if (Number(raw.typeId1) === 1) return 'movie';
  if (Number(raw.typeId1) === 2 || Number(raw.typeId1) === 3 || Number(raw.typeId1) === 4 || Number(raw.typeId1) === 88) {
    return 'series';
  }
  const signal = [raw.typeName, raw.vodRemarks, raw.vodSerial, raw.vodTotal].join(' ');
  if (/电影|蓝光|枪版|HD|BD|正片/.test(signal)) return 'movie';
  if (/剧|综艺|动漫|短剧|集|期/.test(signal)) return 'series';
  return 'mixed';
}

function detailType(raw) {
  if (mediaTypeFromRaw(raw) === 'movie') return 'movie';
  const episodes = raw && raw.episodeList ? raw.episodeList.length : 0;
  return episodes <= 1 && Number(raw && raw.typeId1) === 1 ? 'movie' : 'series';
}

function findEpisode(detail, episodeId) {
  const target = stringValue(episodeId);
  const episodes =
    detail &&
    detail.seasons &&
    detail.seasons[0] &&
    detail.seasons[0].episodes
      ? detail.seasons[0].episodes
      : [];
  return episodes.filter(function (episode) {
    return (
      String(episode.id) === target ||
      String(episode.nid) === target ||
      String(episode.episodeId) === target ||
      String(episode.index) === target ||
      String(episode.episodeNumber) === target
    );
  })[0];
}

function firstEpisode(detail) {
  return (
    detail &&
    detail.seasons &&
    detail.seasons[0] &&
    detail.seasons[0].episodes &&
    detail.seasons[0].episodes[0]
  );
}

function encodeVersionId(itemId, nid, resolution, index) {
  return ['jbd', itemId || '', nid || '', resolution || '', index || 0].join('|');
}

function decodeVersionId(value) {
  const parts = stringValue(value).split('|');
  if (parts[0] !== 'jbd') return {};
  return {
    itemId: parts[1] || '',
    nid: parts[2] || '',
    episodeId: parts[2] || '',
    resolution: parts[3] || '',
    index: parts[4] || ''
  };
}

function qualityName(resolution) {
  const num = numberValue(resolution, 0);
  if (num >= 2160) return '4K';
  if (num >= 1080) return '蓝光';
  if (num >= 720) return '高清';
  if (num >= 480) return '标清';
  return '';
}

function absoluteImage(value) {
  const url = stringValue(value).trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf('//') === 0) return 'https:' + url;
  return JBD_DEFAULT_BASE + (url.charAt(0) === '/' ? url : '/' + url);
}

function absoluteMediaURL(value) {
  const url = decodeJSString(stringValue(value).trim());
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf('//') === 0) return 'https:' + url;
  return JBD_DEFAULT_BASE + (url.charAt(0) === '/' ? url : '/' + url);
}

function inferContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(stringValue(url));
  return match ? match[1].toLowerCase() : undefined;
}

function isDirectMediaURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts)(\?|#|$)/i.test(stringValue(url));
}

function splitPeople(value) {
  const text = cleanText(value);
  if (!text || /^(未知|未录入|暂无|无)$/.test(text)) return [];
  return unique(text.split(/[,\s，、/]+/).filter(Boolean)).slice(0, 20);
}

function splitList(value) {
  return unique(cleanText(value).split(/[,\s，、/]+/).filter(Boolean));
}

function cleanOverview(value) {
  return stripTags(stringValue(value).replace(/<br\s*\/?>/gi, '\n')).replace(/\s+/g, ' ').trim();
}

function runtimeMinutes(value) {
  const text = stringValue(value);
  const hour = /(\d+)\s*小时/.exec(text);
  const minute = /(\d+)\s*分/.exec(text);
  const total = (hour ? Number(hour[1]) * 60 : 0) + (minute ? Number(minute[1]) : 0);
  return total || undefined;
}

function scoreValue(value) {
  const num = Number(value);
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

function cleanText(value) {
  return decodeEntities(stringValue(value).replace(/&nbsp;/g, ' ')).replace(/\s+/g, ' ').trim();
}

function stripTags(value) {
  return decodeEntities(stringValue(value).replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' '));
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

function cacheDetail(detail) {
  if (!detail || !detail.id) return;
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set('jiabaide.detail.' + detail.id, detail);
  }
}

function getCachedDetail(itemId) {
  if (!itemId || typeof Widget === 'undefined' || !Widget.storage || typeof Widget.storage.get !== 'function') return null;
  const value = Widget.storage.get('jiabaide.detail.' + itemId);
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

const JiabaideMiniLibrary = {
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

const __jsEvalReturn = JiabaideMiniLibrary;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = JiabaideMiniLibrary;
}

if (typeof globalThis !== 'undefined') {
  globalThis.JiabaideMiniLibrary = JiabaideMiniLibrary;
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
