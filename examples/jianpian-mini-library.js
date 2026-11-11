// @name 荐片影院 Mini Library

const JIANPIAN_DEFAULT_API_HOST = 'https://h5.jianpianips1.com';
const JIANPIAN_BACKUP_API_HOST = 'https://h5.jianpianips2.com';
const JIANPIAN_LOGO = JIANPIAN_DEFAULT_API_HOST + '/static/logo/144x144.png';
const JIANPIAN_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const JIANPIAN_PAGE_SIZE = 10;

const WidgetMetadata = {
  id: 'jianpian-mini-library',
  name: '荐片影院',
  title: '荐片影院',
  version: '1.0.0',
  author: 'baiPlay',
  logo: JIANPIAN_LOGO,
  icon: JIANPIAN_LOGO,
  site: JIANPIAN_DEFAULT_API_HOST,
  description: '荐片影院自定义媒体库，支持首页、分类、搜索、详情、选集、线路选择和播放解析。'
};

const JIANPIAN_CHANNELS = [
  { id: 88, title: '推荐', subtitle: '首页推荐与最新内容', mediaType: 'mixed', style: 'discover.spotlight' },
  { id: 99, title: 'Netflix', subtitle: 'Netflix 专区', mediaType: 'series', style: 'discover.posterCompact' },
  { id: 1, title: '电影', subtitle: '院线新片与高清电影', mediaType: 'movie', style: 'discover.ranked' },
  { id: 2, title: '电视剧', subtitle: '热门剧集与连续剧', mediaType: 'series', style: 'discover.spotlight' },
  { id: 67, title: '短剧', subtitle: '短剧片库', mediaType: 'series', style: 'discover.editorial' },
  { id: 3, title: '动漫', subtitle: '动画、番剧与国漫', mediaType: 'series', style: 'discover.rankedPosterCompact' },
  { id: 4, title: '综艺', subtitle: '综艺节目与真人秀', mediaType: 'series', style: 'discover.posterCompact' },
  { id: 50, title: '纪录片', subtitle: '纪录片与纪实内容', mediaType: 'movie', style: 'discover.editorial' }
];

const JIANPIAN_HOME_SECTIONS = [
  { id: 'jianpian-latest-all', title: '最近更新', categoryId: 88, kind: 'latest', style: 'discover.spotlight', mediaType: 'mixed' },
  { id: 'jianpian-latest-movie', title: '电影上新', categoryId: 1, kind: 'latest', style: 'discover.posterCompact', mediaType: 'movie' },
  { id: 'jianpian-latest-tv', title: '剧集上新', categoryId: 2, kind: 'latest', style: 'discover.spotlight', mediaType: 'series' },
  { id: 'jianpian-latest-short', title: '短剧热播', categoryId: 67, kind: 'latest', style: 'discover.editorial', mediaType: 'series' },
  { id: 'jianpian-latest-anime', title: '动漫新番', categoryId: 3, kind: 'latest', style: 'discover.rankedPosterCompact', mediaType: 'series' },
  { id: 'jianpian-latest-show', title: '综艺更新', categoryId: 4, kind: 'latest', style: 'discover.posterCompact', mediaType: 'series' },
  { id: 'jianpian-latest-doc', title: '纪录片', categoryId: 50, kind: 'latest', style: 'discover.editorial', mediaType: 'movie' },
  { id: 'jianpian-rank-movie', title: '电影周榜', categoryId: 1, kind: 'rank', style: 'discover.ranked', mediaType: 'movie' },
  { id: 'jianpian-rank-tv', title: '电视剧周榜', categoryId: 2, kind: 'rank', style: 'discover.ranked', mediaType: 'series' },
  { id: 'jianpian-rank-short', title: '短剧周榜', categoryId: 67, kind: 'rank', style: 'discover.rankedPosterCompact', mediaType: 'series' },
  { id: 'jianpian-rank-anime', title: '动漫周榜', categoryId: 3, kind: 'rank', style: 'discover.ranked', mediaType: 'series' },
  { id: 'jianpian-rank-show', title: '综艺周榜', categoryId: 4, kind: 'rank', style: 'discover.rankedPosterCompact', mediaType: 'series' }
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
        name: 'apiHost',
        title: '接口地址',
        type: 'input',
        value: JIANPIAN_DEFAULT_API_HOST,
        defaultValue: JIANPIAN_DEFAULT_API_HOST,
        required: true,
        description: '荐片 H5 接口域名。默认会在主域名失败时自动尝试备用域名。'
      }
    ]
  };
}

async function getHome(ctx) {
  const args = argsify(ctx);
  const hero = await safeHeroItems(args);
  return {
    pageType: 'home',
    id: 'jianpian-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '16:9',
    hero,
    carousel: hero,
    sections: [
      {
        id: 'jianpian-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'jianpian-channels', sectionId: 'jianpian-channels', title: '频道入口' },
        items: JIANPIAN_CHANNELS.map(function (channel, index) {
          return channelEntry(args, channel, [], index + 1);
        })
      }
    ].concat(
      JIANPIAN_HOME_SECTIONS.map(function (section) {
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.mediaType,
          lazy: true,
          promotesToHero: section.id === 'jianpian-latest-all',
          loadAction: { type: 'custom', id: section.id, sectionId: section.id, title: section.title },
          moreAction: categoryAction(section.categoryId, section.title, section.mediaType, section.kind),
          items: []
        };
      })
    )
  };
}

async function getHomeSection(ctx) {
  const args = argsify(ctx);
  const sectionId = stringValue(args.sectionId || args.id || args.pageId);

  if (sectionId === 'jianpian-channels') {
    const items = [];
    for (let index = 0; index < JIANPIAN_CHANNELS.length; index += 1) {
      const channel = JIANPIAN_CHANNELS[index];
      const preview = await safeCategoryPreview(args, channel.id, channel.mediaType, 6);
      items.push(channelEntry(args, channel, preview, index + 1));
    }
    return {
      id: 'jianpian-channels',
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items
    };
  }

  const section = findById(JIANPIAN_HOME_SECTIONS, sectionId);
  if (!section) {
    return {
      id: sectionId || 'jianpian-unknown-section',
      title: stringValue(args.title) || WidgetMetadata.title,
      style: stringValue(args.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  const items = section.kind === 'rank'
    ? await safeRankItems(args, section.categoryId, section.mediaType, 18)
    : await safeCategoryPreview(args, section.categoryId, section.mediaType, 18);
  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.mediaType,
    lazy: false,
    promotesToHero: section.id === 'jianpian-latest-all',
    moreAction: categoryAction(section.categoryId, section.title, section.mediaType, section.kind),
    items
  };
}

async function getCategory(ctx) {
  const args = argsify(ctx);
  const parsed = parsePageId(args.pageId || args.id || args.categoryId || 'cat:88');
  const categoryId = numberValue(parsed.categoryId, 88);
  const channel = channelById(categoryId) || { title: parsed.title || '分类', mediaType: 'mixed' };
  const page = numberValue(args.page, 1);
  const requestedSort = stringValue(args.sort || args.sortBy || args.sort_by || args.selectedSortValue || parsed.sort);
  const selectedSort = requestedSort || (parsed.kind === 'rank' ? 'rank' : 'latest');
  const canRank = rankSupported(categoryId);
  const usesRank = selectedSort === 'rank' && canRank;
  const title = parsed.title || channel.title || '分类';
  const mediaType = parsed.mediaType || channel.mediaType || mediaTypeForCategoryId(categoryId);
  const items = usesRank
    ? await safeRankItems(args, categoryId, mediaType, 60)
    : await safeCategoryPage(args, categoryId, mediaType, page);

  return {
    pageType: 'category',
    id: parsed.id || makePageId(usesRank ? 'rank' : 'cat', categoryId, title),
    title: title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: mediaType,
    items,
    page,
    hasMore: !usesRank && items.length >= JIANPIAN_PAGE_SIZE,
    sortOptions: sortOptionsForCategory(categoryId),
    sort: sortOptionsForCategory(categoryId),
    selectedSortValue: usesRank ? 'rank' : 'latest'
  };
}

async function search(ctx) {
  const args = argsify(ctx);
  const query = stringValue(args.query || args.keyword || args.text).trim();
  const page = numberValue(args.page, 1);
  if (!query) {
    return {
      pageType: 'search',
      title: '搜索',
      style: 'media.posterGrid',
      itemAspectRatio: '2:3',
      items: [],
      page,
      hasMore: false
    };
  }

  const response = await apiGet(args, '/api/v2/search/videoV2', {
    key: query,
    page,
    pageSize: JIANPIAN_PAGE_SIZE
  });
  const data = arrayFromResponse(response);
  const items = data
    .filter(function (raw) { return raw && raw.id && String(raw.id) !== '0'; })
    .map(function (raw, index) { return mediaItem(args, raw, index + 1, mediaTypeFromRaw(raw)); });

  return {
    pageType: 'search',
    title: '搜索：' + query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    items,
    page,
    hasMore: items.length >= JIANPIAN_PAGE_SIZE
  };
}

async function getDetail(ctx) {
  const args = argsify(ctx);
  const vodId = normalizeVodId(args.itemId || args.id || args.vod_id || args.vodId);
  if (!vodId) throw new Error('荐片详情参数为空');
  const detail = await fetchDetail(args, vodId);
  return detailFromRaw(args, detail);
}

async function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const decoded = decodeVersionId(args.versionId || args.sourceId || args.id);
  const vodId = normalizeVodId(args.itemId || args.mediaId || args.vod_id || decoded.itemId || args.id);
  if (!vodId) return [];
  const detail = await fetchDetail(args, vodId);
  const episodeId = stringValue(args.episodeId || args.episode || decoded.episodeId);
  return buildResourceGroups(args, detail, episodeId);
}

async function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const payload = decodeVersionId(args.versionId || args.sourceId || args.id);
  const url = firstNonEmpty(args.url, args.playUrl, args.play_url, payload.url);
  if (!url) throw new Error('荐片播放地址为空，请切换其他线路');
  const finalURL = safeDecodeURIComponent(url);
  return {
    url: finalURL,
    container: inferContainer(finalURL),
    format: inferContainer(finalURL),
    headers: playbackHeaders(args),
    isLive: false,
    streamKind: 'vod',
    title: firstNonEmpty(args.title, payload.title)
  };
}

function getSearch(ctx) { return search(ctx || {}); }
function onSearch(ctx) { return search(ctx || {}); }
async function matchResources(ctx) {
  const args = argsify(ctx);
  const titles = matchCandidateTitles(args).slice(0, 5);
  const expectedType = expectedMatchType(args);
  const targetYear = numberValue(args.year || args.releaseYear, 0);
  const targetSeasonYear = numberValue(args.seasonYear || args.targetSeasonYear, 0);
  const results = [];
  const seen = {};

  for (let index = 0; index < titles.length && results.length < 8; index += 1) {
    const page = await search(Object.assign({}, args, { query: titles[index], page: 1 }));
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

async function safeHeroItems(args) {
  try {
    const response = await apiGet(args, '/api/v2/settings/slideList', { pos_id: 1 });
    const items = arrayFromResponse(response)
      .filter(function (raw) { return raw && raw.jump_id; })
      .map(function (raw, index) {
        const itemId = makeItemId(raw.jump_id);
        const backdrop = absoluteImage(args, firstNonEmpty(raw.pc_thumbnail, raw.tvimg, raw.macimg, raw.thumbnail));
        const poster = absoluteImage(args, firstNonEmpty(raw.thumbnail, raw.pc_thumbnail, raw.tvimg, raw.macimg));
        return {
          id: itemId,
          title: cleanText(raw.title) || WidgetMetadata.title,
          type: 'movie',
          poster,
          backdrop,
          aspectRatio: '16:9',
          imageHeaders: imageHeaders(args),
          posterHeaders: imageHeaders(args),
          backdropHeaders: imageHeaders(args),
          rank: index + 1,
          action: { type: 'detail', id: itemId, itemId, title: cleanText(raw.title) }
        };
      });
    if (items.length) return items;
  } catch (error) {
    printLog('荐片轮播加载失败：' + errorMessage(error));
  }
  return safeCategoryPreview(args, 88, 'mixed', 8);
}

async function safeCategoryPreview(args, categoryId, mediaType, limit) {
  try {
    const items = await fetchCategoryItems(args, categoryId, 1, mediaType);
    return items.slice(0, limit || 10);
  } catch (error) {
    printLog('荐片分类加载失败：' + categoryId + ' ' + errorMessage(error));
    return [];
  }
}

async function safeCategoryPage(args, categoryId, mediaType, page) {
  try {
    return await fetchCategoryItems(args, categoryId, page || 1, mediaType);
  } catch (error) {
    printLog('荐片分类页加载失败：' + categoryId + ' ' + errorMessage(error));
    return [];
  }
}

async function fetchCategoryItems(args, categoryId, page, mediaType) {
  const response = await apiGet(args, '/api/search/searchList', {
    category_id: categoryId,
    page: page || 1
  });
  return arrayFromResponse(response).map(function (raw, index) {
    return mediaItem(args, raw, index + 1, mediaType || mediaTypeForCategoryId(categoryId));
  });
}

async function safeRankItems(args, categoryId, mediaType, limit) {
  try {
    const response = await apiGet(args, '/api/weekRank/list', { category_id: categoryId });
    return arrayFromResponse(response).slice(0, limit || 10).map(function (raw, index) {
      return mediaItem(args, raw, index + 1, mediaType || mediaTypeForCategoryId(categoryId));
    });
  } catch (error) {
    printLog('荐片周榜加载失败：' + categoryId + ' ' + errorMessage(error));
    return [];
  }
}

async function fetchDetail(args, vodId) {
  const response = await apiGet(args, '/api/video/detailv2', { id: vodId });
  const data = response && response.data ? response.data : response;
  if (!data || !data.id) throw new Error('荐片详情返回异常');
  return data;
}

async function detailFromRaw(args, raw) {
  const itemId = makeItemId(raw.id);
  const mediaType = mediaTypeFromDetail(raw);
  const poster = absoluteImage(args, firstNonEmpty(raw.thumbnail, raw.path, raw.tvimg));
  const backdrop = absoluteImage(args, firstNonEmpty(raw.tvimg, raw.thumbnail, raw.path));
  const hasBackdrop = !!raw.tvimg && raw.tvimg !== raw.thumbnail;
  const sourceGroups = buildResourceGroups(args, raw, '');
  const bestLine = bestEpisodeLine(raw);
  const seasons = mediaType === 'series' ? buildSeasons(args, raw, bestLine) : [];
  const recommendations = await safeRecommendations(args, raw);
  const runtimeMinutes = parseMinutes(firstNonEmpty(raw.episode_duration, raw.duration));

  return {
    pageType: 'detail',
    id: itemId,
    title: cleanText(raw.title || raw.original_name) || WidgetMetadata.title,
    originalTitle: cleanText(raw.original_name || ''),
    type: mediaType,
    poster,
    backdrop,
    detailImageAspectRatio: hasBackdrop ? '16:9' : '2:3',
    imageHeaders: imageHeaders(args),
    posterHeaders: imageHeaders(args),
    backdropHeaders: imageHeaders(args),
    overview: cleanText(raw.description || ''),
    year: numberValue(raw.year, undefined),
    rating: normalizeRating(raw.score),
    runtimeMinutes,
    genres: uniqueStrings(arrayNames(raw.types).concat(arrayNames(raw.tags)).concat(arrayNames(raw.category))),
    studios: uniqueStrings(arrayNames(raw.languages).concat(raw.area ? [raw.area] : [])),
    cast: buildCast(raw),
    seasons,
    resourceGroups: seasons.length ? [] : sourceGroups,
    recommendations,
    providerIds: providerIds(raw),
    metadata: {
      sourceCount: sourceGroups.length ? sourceGroups[0].versions.length : 0,
      episodeCount: episodeCountFromDetail(raw, bestLine)
    }
  };
}

async function safeRecommendations(args, raw) {
  const categoryId = Number(raw && raw.top_category && raw.top_category.id) || 88;
  try {
    const items = await fetchCategoryItems(args, categoryId, 1, mediaTypeFromDetail(raw));
    const currentId = String(raw.id || '');
    const filtered = items.filter(function (item) {
      return normalizeVodId(item.id) !== currentId;
    }).slice(0, 12);
    return filtered.length
      ? [{ id: 'jianpian-related', title: '相关推荐', style: 'discover.posterCompact', items: filtered }]
      : [];
  } catch (error) {
    return [];
  }
}

function channelEntry(args, channel, previewItems, rank) {
  const first = previewItems && previewItems[0];
  const poster = first ? first.poster : JIANPIAN_LOGO;
  const backdrop = first ? (first.backdrop || first.poster) : JIANPIAN_LOGO;
  return {
    id: 'jianpian-channel-' + channel.id,
    title: channel.title,
    subtitle: channel.subtitle,
    type: 'collection',
    poster,
    backdrop,
    overview: channel.subtitle,
    rank,
    badges: [channel.mediaType === 'movie' ? '电影' : channel.mediaType === 'mixed' ? '推荐' : '剧集'],
    previewItems: previewItems || [],
    imageHeaders: imageHeaders(args),
    posterHeaders: imageHeaders(args),
    backdropHeaders: imageHeaders(args),
    action: categoryAction(channel.id, channel.title, channel.mediaType, 'latest')
  };
}

function mediaItem(args, raw, rank, fallbackType) {
  const id = makeItemId(raw.id);
  const title = cleanText(raw.title || raw.vod_name || raw.original_name) || WidgetMetadata.title;
  const mediaType = fallbackType && fallbackType !== 'mixed' ? fallbackType : mediaTypeFromRaw(raw);
  const poster = absoluteImage(args, firstNonEmpty(raw.thumbnail, raw.path, raw.tvimg, raw.tagimg));
  const backdrop = absoluteImage(args, firstNonEmpty(raw.tvimg, raw.path, raw.thumbnail, raw.tagimg));
  const year = numberValue(firstNonEmpty(raw.year, firstYear(raw.years)), undefined);
  const remarks = cleanText(raw.mask || raw.remarks || raw.category_name || '');
  const genres = uniqueStrings(arrayNames(raw.categroyies).concat(arrayNames(raw.types)).concat(arrayNames(raw.res_categories).slice(0, 2)));
  const subtitle = compactJoin([year, remarks, genres.slice(0, 2).join(' / ')], ' · ');
  const rating = normalizeRating(raw.score);
  const overview = cleanText(raw.description || '');

  return {
    id,
    title,
    subtitle,
    type: mediaType,
    poster,
    backdrop,
    overview,
    year,
    rating,
    rank,
    remarks,
    metadataText: subtitle,
    badges: genres.slice(0, 4),
    imageHeaders: imageHeaders(args),
    posterHeaders: imageHeaders(args),
    backdropHeaders: imageHeaders(args),
    action: { type: 'detail', id, itemId: id, title },
    providerIds: { jianpian: String(raw.id || '') }
  };
}

function buildSeasons(args, detail, line) {
  const source = line || bestEpisodeLine(detail);
  const list = source && Array.isArray(source.source_list) ? source.source_list : [];
  if (!list.length) return [];
  const seen = {};
  const episodes = [];
  list.forEach(function (entry, index) {
    const episodeId = episodeIdForEntry(entry, index);
    if (seen[episodeId]) return;
    seen[episodeId] = true;
    const number = episodeNumber(entry, index);
    const title = cleanEpisodeTitle(entry, index);
    episodes.push({
      id: episodeId,
      title,
      episodeNumber: number,
      seasonNumber: 1,
      poster: absoluteImage(args, firstNonEmpty(detail.thumbnail, detail.tvimg)),
      imageHeaders: imageHeaders(args),
      posterHeaders: imageHeaders(args),
      action: {
        type: 'play',
        itemId: makeItemId(detail.id),
        episodeId,
        title: cleanText(detail.title || '') + ' ' + title
      }
    });
  });
  episodes.sort(function (a, b) {
    return numberValue(a.episodeNumber, 9999) - numberValue(b.episodeNumber, 9999);
  });
  return episodes.length
    ? [{
        id: 'season-1',
        title: '选集',
        seasonNumber: 1,
        episodeCount: episodes.length,
        episodes
      }]
    : [];
}

function buildResourceGroups(args, detail, selectedEpisodeId) {
  const lines = playableLines(detail);
  const isSeries = mediaTypeFromDetail(detail) === 'series';
  let selected = stringValue(selectedEpisodeId);
  if (isSeries && !selected) {
    const firstLine = bestEpisodeLine(detail);
    const firstEntry = firstLine && firstLine.source_list && firstLine.source_list[0];
    if (firstEntry) selected = episodeIdForEntry(firstEntry, 0);
  }
  const versions = [];
  const seenURLs = {};
  lines.forEach(function (source) {
    const sourceName = cleanText(source.name || source.source_config_name || '播放线路');
    const list = Array.isArray(source.source_list) ? source.source_list : [];
    list.forEach(function (entry, index) {
      const url = normalizePlayURL(entry.url);
      if (!isPlayableURL(url)) return;
      const episodeId = episodeIdForEntry(entry, index);
      if (isSeries && selected && selected !== episodeId && selected !== String(entry.id || '')) return;
      if (isSeries && !selected) return;
      const key = url;
      if (seenURLs[key]) return;
      seenURLs[key] = true;
      const entryTitle = cleanEpisodeTitle(entry, index);
      const title = isSeries ? sourceName : movieVersionTitle(entryTitle, sourceName);
      const versionId = encodeVersionId({
        itemId: makeItemId(detail.id),
        episodeId,
        title,
        lineName: sourceName,
        sourceName: entryTitle,
        url,
        sort: entry.sort || entry.weight || ''
      });
      versions.push({
        id: versionId,
        name: title,
        title,
        subtitle: isSeries ? entryTitle : sourceName,
        url,
        container: inferContainer(url),
        headers: playbackHeaders(args),
        default: versions.length === 0,
        action: {
          type: 'play',
          itemId: makeItemId(detail.id),
          episodeId,
          versionId,
          url,
          title: cleanText(detail.title || '') + (isSeries ? ' ' + entryTitle : '')
        }
      });
    });
  });
  return versions.length ? [{ id: 'jianpian-lines', title: isSeries ? '播放线路' : '资源版本', versions }] : [];
}

function playableLines(detail) {
  const raw = Array.isArray(detail && detail.source_list_source) ? detail.source_list_source : [];
  return raw
    .filter(function (source) {
      const name = cleanText(source && (source.name || source.source_config_name));
      if (!source || !Array.isArray(source.source_list) || !source.source_list.length) return false;
      if (/ftp|网盘|云盘|磁力|迅雷/i.test(name)) return false;
      if (name === '常规线路') return false;
      return true;
    })
    .sort(function (a, b) {
      return sourcePriority(a) - sourcePriority(b);
    });
}

function bestEpisodeLine(detail) {
  const lines = playableLines(detail);
  if (!lines.length) return null;
  return lines.slice().sort(function (a, b) {
    const countA = playableCount(a);
    const countB = playableCount(b);
    if (countA !== countB) return countB - countA;
    return sourcePriority(a) - sourcePriority(b);
  })[0];
}

function playableCount(source) {
  return (source.source_list || []).filter(function (entry) {
    return isPlayableURL(normalizePlayURL(entry.url));
  }).length;
}

function sourcePriority(source) {
  const name = cleanText(source && (source.name || source.source_config_name));
  if (/^蓝光线路/.test(name)) return 0;
  if (/高清线路/.test(name)) return 1;
  if (/SN|JY|HN|WJ|DB|MT|BF|XL/i.test(name)) return 2;
  if (/极速|高速/.test(name)) return 3;
  if (/VIP/i.test(name)) return 4;
  return 5;
}

function movieVersionTitle(entryTitle, sourceName) {
  const entry = cleanText(entryTitle);
  const source = cleanText(sourceName) || '播放';
  if (!entry || /^(正片|播放|高清|蓝光|HD|BD)$/i.test(entry)) return source;
  if (entry === source) return source;
  return entry + ' · ' + source;
}

function buildCast(raw) {
  const people = [];
  arrayNames(raw.actors).forEach(function (name) {
    people.push({ name, role: '演员' });
  });
  arrayNames(raw.directors).forEach(function (name) {
    people.push({ name, role: '导演' });
  });
  arrayNames(raw.writers).forEach(function (name) {
    people.push({ name, role: '编剧' });
  });
  const seen = {};
  return people.filter(function (person) {
    const key = person.name + ':' + person.role;
    if (!person.name || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function providerIds(raw) {
  const ids = { jianpian: String(raw.id || '') };
  if (raw.douban_id) ids.douban = String(raw.douban_id);
  const imdb = firstMatch(raw.imdb_url || '', /(tt\d+)/i);
  if (imdb) ids.imdb = imdb;
  return ids;
}

function categoryAction(categoryId, title, mediaType, kind) {
  const mode = kind === 'rank' ? 'rank' : 'cat';
  return {
    type: 'category',
    id: makePageId(mode, categoryId, title),
    pageId: makePageId(mode, categoryId, title),
    title,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    mediaType: mediaType || mediaTypeForCategoryId(categoryId)
  };
}

function makePageId(kind, categoryId, title) {
  return [kind || 'cat', categoryId || 88, encodeURIComponent(title || '')].join(':');
}

function parsePageId(value) {
  const text = stringValue(value || 'cat:88');
  const parts = text.split(':');
  if ((parts[0] === 'cat' || parts[0] === 'rank') && parts.length >= 2) {
    return {
      id: text,
      kind: parts[0],
      sort: parts[0] === 'rank' ? 'rank' : 'latest',
      categoryId: numberValue(parts[1], 88),
      title: safeDecodeURIComponent(parts.slice(2).join(':')) || ''
    };
  }
  const number = numberValue(text, 88);
  return {
    id: makePageId('cat', number, ''),
    kind: 'cat',
    sort: 'latest',
    categoryId: number,
    title: ''
  };
}

function sortOptionsForCategory(categoryId) {
  const options = [{ id: 'latest', title: '最近更新', value: 'latest' }];
  if (rankSupported(categoryId)) {
    options.push({ id: 'rank', title: '周榜', value: 'rank' });
  }
  return options;
}

function rankSupported(categoryId) {
  return [1, 2, 3, 4, 67].indexOf(Number(categoryId)) >= 0;
}

async function apiGet(args, path, params) {
  let lastError = null;
  const hosts = requestHosts(args);
  for (let index = 0; index < hosts.length; index += 1) {
    const host = hosts[index];
    const url = absoluteAPIURL(host, path, params);
    try {
      const response = await httpGetJSON(url, host + '/');
      if (response && response.error) throw new Error(response.error);
      if (response && response.code !== undefined && Number(response.code) !== 1) {
        throw new Error(response.msg || response.message || '接口返回 code=' + response.code);
      }
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('荐片接口请求失败');
}

async function httpGetJSON(url, referer) {
  const headers = requestHeaders(referer);
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const result = await Widget.http.get(url, { headers, timeout: 15 });
    const data = result && result.data !== undefined ? result.data : result;
    return normalizeJSONData(data);
  }
  if (typeof $fetch !== 'undefined' && $fetch && typeof $fetch.get === 'function') {
    const result = await $fetch.get(url, { headers, timeout: 15 });
    const data = result && result.data !== undefined ? result.data : result;
    return normalizeJSONData(data);
  }
  if (typeof fetch === 'function') {
    const response = await fetch(url, { headers });
    const text = await response.text();
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return normalizeJSONData(text);
  }
  throw new Error('当前环境没有可用的 HTTP 请求能力');
}

function normalizeJSONData(data) {
  if (data == null) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (error) {
      throw new Error('接口返回不是有效 JSON');
    }
  }
  return data;
}

function requestHosts(args) {
  const preferred = normalizeHost(
    firstNonEmpty(
      args && args.apiHost,
      args && args.baseURL,
      args && args.site,
      args && args.params && (args.params.apiHost || args.params.baseURL || args.params.site),
      args && args.config && (args.config.apiHost || args.config.baseURL || args.config.site),
      args && args.settings && (args.settings.apiHost || args.settings.baseURL || args.settings.site),
      JIANPIAN_DEFAULT_API_HOST
    )
  );
  const backup = normalizeHost(JIANPIAN_BACKUP_API_HOST);
  return uniqueStrings([preferred, backup, JIANPIAN_DEFAULT_API_HOST].filter(Boolean));
}

function normalizeHost(value) {
  let text = stringValue(value).trim();
  if (!text) return JIANPIAN_DEFAULT_API_HOST;
  if (!/^https?:\/\//i.test(text)) text = 'https://' + text;
  return text.replace(/\/+$/, '');
}

function absoluteAPIURL(host, path, params) {
  const base = normalizeHost(host);
  let url = base + (String(path || '').charAt(0) === '/' ? path : '/' + path);
  const query = buildQuery(params || {});
  if (query) url += (url.indexOf('?') >= 0 ? '&' : '?') + query;
  return url;
}

function buildQuery(params) {
  const parts = [];
  Object.keys(params || {}).forEach(function (key) {
    const value = params[key];
    if (value === undefined || value === null || value === '') return;
    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(value)));
  });
  return parts.join('&');
}

function requestHeaders(referer) {
  return {
    'User-Agent': JIANPIAN_UA,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9',
    Referer: referer || JIANPIAN_DEFAULT_API_HOST + '/'
  };
}

function imageHeaders(args) {
  const host = requestHosts(args)[0] || JIANPIAN_DEFAULT_API_HOST;
  return {
    'User-Agent': JIANPIAN_UA,
    Referer: host + '/'
  };
}

function playbackHeaders(args) {
  const host = requestHosts(args)[0] || JIANPIAN_DEFAULT_API_HOST;
  return {
    'User-Agent': JIANPIAN_UA,
    Accept: '*/*',
    Referer: host + '/',
    Origin: host
  };
}

function absoluteImage(args, value) {
  const raw = decodeEntities(stringValue(value).trim());
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.indexOf('//') === 0) return 'https:' + raw;
  const host = requestHosts(args)[0] || JIANPIAN_DEFAULT_API_HOST;
  if (raw.charAt(0) === '/') return host + raw;
  return host + '/' + raw;
}

function arrayFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response && response.data)) return response.data;
  if (Array.isArray(response && response.list)) return response.list;
  if (Array.isArray(response && response.results)) return response.results;
  if (response && response.data && Array.isArray(response.data.list)) return response.data.list;
  return [];
}

function mediaTypeFromRaw(raw) {
  const top = raw && raw.top_category;
  if (top && (top.id || top.name || top.title)) {
    return mediaTypeForCategoryId(top.id || top.name || top.title);
  }
  const categories = arrayNames(raw && raw.res_categories).join(' ');
  if (/电影/.test(categories)) return 'movie';
  if (/剧|动漫|动画|综艺|短剧|纪录/.test(categories)) return 'series';
  return 'movie';
}

function mediaTypeFromDetail(raw) {
  const top = raw && raw.top_category;
  const categoryId = top && (top.id || top.title || top.name);
  if (categoryId) return mediaTypeForCategoryId(categoryId);
  const count = episodeCountFromDetail(raw, bestEpisodeLine(raw));
  return count > 1 ? 'series' : 'movie';
}

function mediaTypeForCategoryId(value) {
  const text = stringValue(value);
  const id = Number(text);
  if (id === 1 || id === 50 || /电影|纪录/.test(text)) return 'movie';
  if (id === 2 || id === 3 || id === 4 || id === 67 || id === 99 || /剧|动漫|动画|综艺|短剧|Netflix/i.test(text)) return 'series';
  return 'mixed';
}

function channelById(id) {
  const target = Number(id);
  return JIANPIAN_CHANNELS.filter(function (channel) {
    return Number(channel.id) === target;
  })[0];
}

function findById(list, id) {
  return (list || []).filter(function (item) { return item && item.id === id; })[0] || null;
}

function makeItemId(value) {
  const id = normalizeVodId(value);
  return id ? 'jp:' + id : '';
}

function normalizeVodId(value) {
  const text = stringValue(value);
  if (!text) return '';
  const prefixed = /^jp:(\d+)$/i.exec(text);
  if (prefixed) return prefixed[1];
  const direct = /^(\d+)$/.exec(text);
  if (direct) return direct[1];
  const inText = /(?:id=|\/)(\d+)(?:\.html)?/i.exec(text);
  return inText ? inText[1] : '';
}

function episodeCountFromDetail(detail, line) {
  const declared = numberValue(detail && detail.episodes_count, 0);
  if (declared > 0) return declared;
  const source = line || bestEpisodeLine(detail);
  return source && Array.isArray(source.source_list) ? source.source_list.length : 0;
}

function episodeIdForEntry(entry, index) {
  const number = episodeNumber(entry, index);
  if (number) return 'ep:' + number;
  const title = cleanText(firstNonEmpty(entry && entry.source_name, entry && entry.weight, entry && entry.sort, entry && entry.id));
  return 'ep:' + encodeURIComponent(title || String(index + 1));
}

function episodeNumber(entry, index) {
  const text = cleanText(firstNonEmpty(entry && entry.sort, entry && entry.weight, entry && entry.source_name));
  const patterns = [
    /第\s*0*(\d+)\s*[集话期]/,
    /(?:EP|Ep|ep)\s*0*(\d+)/,
    /^0*(\d+)$/
  ];
  for (let i = 0; i < patterns.length; i += 1) {
    const match = patterns[i].exec(text);
    if (match) return numberValue(match[1], index + 1);
  }
  return index + 1;
}

function cleanEpisodeTitle(entry, index) {
  return cleanText(firstNonEmpty(entry && entry.source_name, entry && entry.weight, entry && entry.sort)) || '第 ' + (index + 1) + ' 集';
}

function normalizePlayURL(url) {
  const text = stringValue(url).trim();
  if (!text) return '';
  return safeDecodeURIComponent(text);
}

function isPlayableURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts|webm|avi|mpd)(?:$|\?)/i.test(stringValue(url));
}

function inferContainer(url) {
  const lower = stringValue(url).split('#')[0].toLowerCase();
  const path = lower.split('?')[0];
  const match = /\.([a-z0-9]+)$/.exec(path);
  if (match) return match[1];
  const query = lower.indexOf('?') >= 0 ? lower.slice(lower.indexOf('?') + 1) : '';
  const candidates = ['m3u8', 'm3u', 'mpd', 'mp4', 'mkv', 'mov', 'flv', 'ts', 'webm', 'avi'];
  for (let index = 0; index < candidates.length; index += 1) {
    const ext = candidates[index];
    if (query.indexOf('.' + ext) >= 0 || query.indexOf('%2e' + ext) >= 0) return ext;
  }
  return '';
}

function encodeVersionId(payload) {
  return 'jp-version:' + encodeURIComponent(JSON.stringify(payload || {}));
}

function decodeVersionId(value) {
  const text = stringValue(value);
  if (text.indexOf('jp-version:') !== 0) return {};
  try {
    return JSON.parse(decodeURIComponent(text.slice('jp-version:'.length)));
  } catch (error) {
    return {};
  }
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

function firstNonEmpty() {
  for (let index = 0; index < arguments.length; index += 1) {
    const value = arguments[index];
    if (value === undefined || value === null) continue;
    const text = stringValue(value).trim();
    if (text) return text;
  }
  return '';
}

function stringValue(value) {
  return value === undefined || value === null ? '' : String(value);
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeRating(value) {
  const rating = numberValue(value, 0);
  return rating > 0 ? rating : undefined;
}

function parseMinutes(value) {
  const text = stringValue(value);
  if (!text) return undefined;
  const minute = /(\d+(?:\.\d+)?)\s*分钟/.exec(text);
  if (minute) return Math.round(Number(minute[1]));
  const numeric = numberValue(text, 0);
  if (!numeric) return undefined;
  if (numeric > 1000) return Math.round(numeric / 60);
  return Math.round(numeric);
}

function firstYear(value) {
  if (Array.isArray(value) && value.length) return value[0] && value[0].year;
  return '';
}

function arrayNames(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(function (item) {
      if (typeof item === 'string' || typeof item === 'number') return cleanText(item);
      return cleanText(firstNonEmpty(item && item.name, item && item.title, item && item.value, item && item.show_name));
    }).filter(Boolean);
  }
  return cleanText(value).split(/[\/,，、\s]+/).filter(Boolean);
}

function uniqueStrings(list) {
  const seen = {};
  const out = [];
  (list || []).forEach(function (item) {
    const text = cleanText(item);
    if (!text || seen[text]) return;
    seen[text] = true;
    out.push(text);
  });
  return out;
}

function matchCandidateTitles(ext) {
  return uniqueStrings(
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

function compactJoin(list, separator) {
  return (list || []).filter(function (item) {
    return item !== undefined && item !== null && stringValue(item).trim();
  }).join(separator || ' ');
}

function cleanText(value) {
  return decodeEntities(
    stringValue(value)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
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

function firstMatch(value, pattern) {
  const match = pattern.exec(stringValue(value));
  return match ? match[1] || '' : '';
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(stringValue(value));
  } catch (error) {
    return stringValue(value);
  }
}

function printLog(message) {
  if (typeof print === 'function') print(message);
  else if (typeof console !== 'undefined' && console.log) console.log(message);
}

function errorMessage(error) {
  return error && error.message ? error.message : stringValue(error);
}

const JianpianMiniLibrary = {
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

const __jsEvalReturn = JianpianMiniLibrary;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = JianpianMiniLibrary;
}

if (typeof globalThis !== 'undefined') {
  Object.keys(JianpianMiniLibrary).forEach(function (key) {
    globalThis[key] = JianpianMiniLibrary[key];
  });
  globalThis.JianpianMiniLibrary = JianpianMiniLibrary;
  globalThis.WidgetMetadata = WidgetMetadata;
}
