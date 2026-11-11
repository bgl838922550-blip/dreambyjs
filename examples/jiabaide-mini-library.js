// @name 金牌影院

const JBD_DEFAULT_BASE = 'https://www.hxgnhb.cn';
const JBD_SIGN_KEY = 'cb808529bae6b6be45ecfab29a4889bc';
const JBD_LOGO =
  'https://obs.3688baihuo.com/upload/site_logo/20260531-1/31032dae244fccedcad3e30a5effb6d6.png';
const JBD_ICON =
  'https://obs.3688baihuo.com/upload/site_ico/20260531-1/92da5ddc802c076de628be1b70e6fb90_180x180.png';
const JBD_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1';
const JBD_DEVICE_ID = 'baiPlay-jiabaide-11111111-2222-4333-8444-555555555555';

const WidgetMetadata = {
  id: 'jiabaide-mini-library',
  name: '金牌影院',
  title: '金牌影院',
  version: '1.2.0',
  author: 'baiPlay',
  logo: JBD_LOGO,
  icon: JBD_ICON,
  site: JBD_DEFAULT_BASE,
  description: '同步金牌影院官网轮播、热播、预告、影视分组与体育直播，支持账号 Token、搜索、详情、选集和清晰度选择。'
};

const JBD_CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '院线与高清电影', typeId: 1, mediaType: 'movie', style: 'discover.posterCompact' },
  { id: 'tv', title: '电视剧', subtitle: '连续剧与热门剧集', typeId: 2, mediaType: 'series', style: 'discover.spotlight' },
  { id: 'show', title: '综艺', subtitle: '热门综艺与真人秀', typeId: 3, mediaType: 'series', style: 'discover.rankedPosterCompact' },
  { id: 'anime', title: '动漫', subtitle: '国漫、日漫与动画', typeId: 4, mediaType: 'series', style: 'discover.editorial' },
  { id: 'short', title: '短剧', subtitle: '短剧片库', typeId: 88, mediaType: 'series', style: 'discover.posterCompact' }
];

const JBD_HOME_SECTIONS = [
  { id: 'jbd-broadcast', title: '正在热播', dataKey: 'homeBroadcastPageData', module: 3, style: 'discover.posterCompact', mediaType: 'mixed' },
  { id: 'jbd-trailers', title: '新片预告', dataKey: 'homeTrailerPageData', style: 'discover.spotlight', mediaType: 'mixed' },
  { id: 'jbd-latest-movie', title: '最新电影', dataKey: 'homeNewMoviePageData', module: 2, typeId: 1, style: 'discover.posterCompact', mediaType: 'movie' },
  { id: 'jbd-latest-tv', title: '最新电视剧', dataKey: 'newestTvPageData', module: 13, typeId: 2, style: 'discover.posterCompact', mediaType: 'series' },
  { id: 'jbd-latest-show', title: '最新综艺', dataKey: 'newestVarietyPageData', module: 14, typeId: 3, style: 'discover.posterCompact', mediaType: 'series' },
  { id: 'jbd-latest-anime', title: '最新动漫', dataKey: 'newestCartoonPageData', module: 15, typeId: 4, style: 'discover.posterCompact', mediaType: 'series' },
  { id: 'jbd-latest-short', title: '最新短剧', dataKey: 'newestShortTvPageData', module: 16, typeId: 88, style: 'discover.posterCompact', mediaType: 'series' }
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
        name: 'site',
        title: '站点地址',
        type: 'input',
        value: JBD_DEFAULT_BASE,
        required: true,
        description: '金牌影院站点地址。旧版 jiabaide.cn 地址会自动迁移到当前站点。'
      },
      {
        name: 'Token',
        title: '登录 Token',
        type: 'password',
        value: '',
        required: false,
        description: '站点使用 Token 而不是 Cookie 鉴权。请在运行 baiPlay 的同一设备和网络中登录上方配置的站点后复制 localStorage 中的 token；留空使用匿名标清线路。'
      }
    ]
  };
}

function getHome(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const data = homeData(site, null, 1);
  const hero = homeBanners(site);
  const definitions = orderedHomeSections(site);

  return {
    pageType: 'home',
    id: 'jbd-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '32:9',
    hero,
    carousel: hero,
    sections: [getSportsSection(site)].concat(definitions.map(function (section) {
      return buildHomeSection(section, data[section.dataKey]);
    }))
  };
}

function getHomeSection(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const sectionId = stringValue(args.sectionId || args.id || args.pageId);

  if (sectionId === 'jbd-sports') return getSportsSection(site);

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

  try {
    return buildHomeSection(section, homeData(site, section, 1)[section.dataKey]);
  } catch (error) {
    return Object.assign(buildHomeSection(section, {}), { error: String(error.message || error) });
  }
}

function homeData(site, section, page) {
  const pairs = [['clientType', '1']];
  if (section && section.module) pairs.push(['modules_type', String(section.module)]);
  pairs.push(['pageNum', String(numberValue(page, 1))]);
  const result = apiGet(site, '/api/mw-movie/anonymous/v1/home/all/list', pairs);
  if (!result || !result.data || typeof result.data !== 'object') {
    throw new Error('金牌影院首页接口没有返回栏目数据');
  }
  return result.data;
}

function orderedHomeSections(site) {
  try {
    const response = apiGet(site, '/api/mw-movie/anonymous/get/filer/type', []);
    const types = Array.isArray(response && response.data) ? response.data : [];
    const sections = [];
    types.forEach(function (type) {
      const section = JBD_HOME_SECTIONS.filter(function (entry) {
        return entry.typeId && Number(entry.typeId) === Number(type.typeId);
      })[0];
      if (section && sections.indexOf(section) < 0) sections.push(section);
    });
    if (sections.length) return JBD_HOME_SECTIONS.slice(0, 2).concat(sections);
  } catch (error) {
    // Keep the site's normal channel order if its navigation endpoint is unavailable.
  }
  return JBD_HOME_SECTIONS;
}

function homeBanners(site) {
  try {
    const response = apiGet(site, '/api/mw-movie/anonymous/home/banner', [['clientType', '1']]);
    const banners = Array.isArray(response && response.data) ? response.data : [];
    return banners.map(function (entry, index) {
      return { entry, index };
    }).filter(function (value) {
      const entry = value.entry || {};
      const id = numberValue(entry.videoData && entry.videoData.vodId || entry.param, 0);
      return !numberValue(entry.isAd, 0) && id > 0 &&
        (entry.img || entry.imgDay) && (entry.videoData && entry.videoData.vodName || entry.name);
    }).sort(function (left, right) {
      return numberValue(left.entry.sort, 0) - numberValue(right.entry.sort, 0) || left.index - right.index;
    }).map(function (value, index) {
      const entry = value.entry;
      const raw = Object.assign({}, entry.videoData || {}, {
        vodId: entry.videoData && entry.videoData.vodId || entry.param,
        vodName: entry.videoData && entry.videoData.vodName || entry.name
      });
      const item = mediaItem(raw, index + 1);
      item.backdrop = absoluteImage(entry.img || entry.imgDay);
      item.thumb = item.backdrop;
      item.poster = item.poster || item.backdrop;
      item.cover = item.poster;
      item.aspectRatio = '32:9';
      item.imageOrientation = 'landscape';
      item.imageHeaders = item.posterHeaders = item.backdropHeaders = imageHeaders(site + '/');
      return item;
    });
  } catch (error) {
    // Never replace the official carousel with unrelated latest-film posters.
    return [];
  }
}

function homeSectionItems(section, data, page) {
  return (Array.isArray(data && data.list) ? data.list : []).map(function (raw, index) {
    const item = mediaItem(raw, index + 1 + (numberValue(page, 1) - 1) * numberValue(data.pageSize, 12));
    if (section.id === 'jbd-trailers') {
      item.poster = absoluteImage(raw.abImage || raw.vodPic);
      item.cover = item.poster;
      item.backdrop = absoluteImage(raw.bgImage || raw.vodPic);
      item.thumb = item.backdrop;
      item.badges = unique(['预告'].concat(item.badges || []));
    }
    return item;
  });
}

function buildHomeSection(section, data) {
  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.mediaType,
    lazy: false,
    promotesToHero: false,
    moreAction: section.typeId ? categoryAction(section.typeId, section.title, section.mediaType, 1) :
      section.module ? { type: 'category', id: 'home:' + section.id, pageId: 'home:' + section.id, title: section.title } : undefined,
    items: homeSectionItems(section, data, 1)
  };
}

function getCategory(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const pageId = stringValue(args.pageId || args.id || args.categoryId);
  if (pageId === 'sports') return getSportsCategory(site, args);
  if (pageId.indexOf('home:') === 0) {
    const section = findById(JBD_HOME_SECTIONS, pageId.slice(5));
    if (!section) return categoryPage(pageId, WidgetMetadata.title, 'mixed', [], 1, false, [], '');
    const page = Math.max(1, numberValue(args.page, 1));
    const data = homeData(site, section, page)[section.dataKey] || {};
    return categoryPage(pageId, section.title, section.mediaType, homeSectionItems(section, data, page),
      page, page < numberValue(data.totalPage, 1), [], '');
  }
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
  const sportsId = stringValue(args.itemId || args.id).split('|')[0];
  if (isSportsItemID(sportsId)) return getSportsDetail(site, sportsId);
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
  const sportsId = stringValue(args.itemId || args.id || args.versionId || args.sourceId).split('|')[0];
  if (isSportsItemID(sportsId)) return getSportsResourceVersions(site, Object.assign({}, args, { itemId: sportsId }));
  const token = tokenFromArgs(args);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const itemId = numberValue(args.itemId || args.id || decoded.itemId || args.vodId, 0);
  const episodeId = stringValue(args.episodeId || args.episode || decoded.episodeId || args.nid || '');
  if (!itemId) return { groups: [] };
  const detail = getCachedDetail(itemId) || getDetail({ itemId, params: args.params, config: args.config, settings: args.settings });
  const target = findEpisode(detail, episodeId) || firstEpisode(detail);
  if (!target) return { groups: [] };
  const list = safeEpisodeURL(site, itemId, target.nid || target.id, token);
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
  const sportsId = stringValue(args.itemId || args.id || args.versionId || args.sourceId).split('|')[0];
  if (isSportsItemID(sportsId)) return resolveSportsPlayback(site, Object.assign({}, args, { itemId: sportsId }));
  const token = tokenFromArgs(args);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const direct = stringValue(args.url || args.playUrl || args.videoUrl || (args.ext && args.ext.url));
  const itemId = numberValue(args.itemId || args.id || args.vodId || decoded.itemId || (args.ext && args.ext.vodId), 0);
  const nid = numberValue(args.nid || args.episodeId || decoded.nid || (args.ext && args.ext.nid), 0);
  const selectedIndex = numberValue(decoded.index || (args.ext && args.ext.index), 0);

  if (isDirectMediaURL(direct)) return playback(site, direct, itemId, nid);
  if (!itemId || !nid) throw new Error('金牌影院播放失败：缺少影片或剧集参数');

  const selected = resolveEpisodeSelection(
    site,
    itemId,
    nid,
    token,
    selectedIndex,
    decoded.resolution || (args.ext && args.ext.resolution)
  );
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

function matchMovie(ctx) {
  return matchResources(Object.assign({}, ctx || {}, { mediaType: 'movie' }));
}

function matchEpisode(ctx) {
  return matchResources(Object.assign({}, ctx || {}, { mediaType: 'tv' }));
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
  }).concat([{ id: 'sports', title: '体育直播', name: '体育直播', group: '频道', type: 'folder',
    kind: 'live', mediaType: 'live', sourceId: WidgetMetadata.id }]);
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

const JBD_SPORTS_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15';

// Sports use their own stable identity. A presenter can change matches during the day,
// so never resolve an old match simply by taking that presenter's current stream.
function isSportsItemID(value) {
  return /^sports:\d+:\d+:\d+:\d+$/.test(stringValue(value));
}

function parseSportsItemID(value) {
  const match = /^sports:(\d+):(\d+):(\d+):(\d+)$/.exec(stringValue(value));
  if (!match || Number(match[2]) <= 0) throw new Error('体育赛事参数无效');
  return { sportId: Number(match[1]), matchId: Number(match[2]), anchorId: Number(match[3]), recordId: Number(match[4]), id: match[0] };
}

function sportsItemID(raw) {
  return ['sports', numberValue(raw.sportId, 0), numberValue(raw.matchId, 0), numberValue(raw.anchorId, 0), numberValue(raw.recordId, 0)].join(':');
}

function sportsAPIData(site, method) {
  const result = apiGet(site, '/api/mw-movie/anonymous/dqSports/' + method, []);
  return result && result.data;
}

function sportsRows(site, includeSchedule) {
  let rows = [];
  let firstError = null;
  let succeeded = false;
  try {
    const data = sportsAPIData(site, 'getMatchIndexLiving/v2/web');
    if (Array.isArray(data)) rows = data;
    succeeded = true;
  } catch (error) { firstError = error; }
  if (includeSchedule) {
    try {
      const data = sportsAPIData(site, 'getMatchSchedule/web');
      const matches = {};
      rows.forEach(function (row) { matches[row.sportId + ':' + row.matchId] = true; });
      if (Array.isArray(data)) rows = rows.concat(data.filter(function (row) {
        return row && !matches[row.sportId + ':' + row.matchId];
      }));
      succeeded = true;
    } catch (error) { if (!firstError) firstError = error; }
  }
  if (!succeeded && firstError) throw firstError;
  const seen = {};
  return rows.filter(function (row) {
    if (!row || numberValue(row.matchId, 0) <= 0) return false;
    const id = sportsItemID(row);
    if (seen[id]) return false;
    seen[id] = true;
    return true;
  });
}

function sportsItem(raw) {
  const id = sportsItemID(raw);
  const replay = numberValue(raw.recordId, 0) > 0;
  const active = numberValue(raw.matchStatus, 0) === 2 && numberValue(raw.anchorId, 0) > 0;
  const state = replay ? '回放' : active ? '直播中' : stringValue(raw.matchStatusName || raw.statusLabel) || '未开播';
  const title = [stringValue(raw.hostTeamName), stringValue(raw.guestTeamName)].filter(Boolean).join(' vs ') || stringValue(raw.leagueName) || '体育赛事';
  const art = absoluteImage(raw.leagueLogo || raw.hostTeamLogo || raw.guestTeamLogo || '');
  return {
    id, itemId: id, title, name: title,
    type: replay ? 'movie' : 'live', mediaType: replay ? 'movie' : 'live',
    poster: art, cover: art, backdrop: art,
    subtitle: [raw.leagueName, state, raw.anchorNickname].filter(Boolean).join(' · '),
    overview: [raw.matchTimeStr, raw.statusLabel || raw.matchStatusName, raw.anchorNickname].filter(Boolean).join(' · '),
    badges: [state, Number(raw.sportId) === 2 ? '篮球' : '足球'],
    aspectRatio: '16:9', itemAspectRatio: '16:9', imageOrientation: 'landscape', imageFit: 'fit',
    action: { type: 'detail', id, itemId: id, title, itemAspectRatio: '16:9' },
    providerIds: { jiabaideSports: id }
  };
}

function getSportsSection(site, initialData) {
  let rows = [];
  try {
    if (Array.isArray(initialData)) rows = initialData;
    else if (initialData && Array.isArray(initialData.data)) rows = initialData.data;
    else rows = sportsRows(site, false);
  } catch (error) { rows = []; }
  return {
    id: 'jbd-sports', title: '体育直播', style: 'discover.spotlight', lazy: false,
    moreAction: { type: 'category', id: 'sports', pageId: 'sports', title: '体育直播', itemAspectRatio: '16:9' },
    items: rows.filter(function (row) { return row && numberValue(row.matchId, 0) > 0; }).map(sportsItem)
  };
}

function getSportsCategory(site, args) {
  args = args || {};
  const selected = stringValue(args.sort || args.sortBy || args.selectedSortValue || 'all');
  const sportId = selected === 'football' ? 1 : selected === 'basketball' ? 2 : 0;
  const page = Math.max(1, Math.floor(numberValue(args.page, 1)));
  const size = Math.max(1, Math.min(100, Math.floor(numberValue(args.pageSize, 30))));
  const rows = sportsRows(site, true).filter(function (row) { return !sportId || Number(row.sportId) === sportId; });
  const options = [
    { id: 'all', value: 'all', title: '全部赛事' },
    { id: 'football', value: 'football', title: '足球' },
    { id: 'basketball', value: 'basketball', title: '篮球' }
  ];
  return {
    pageType: 'category', id: 'sports', title: '体育直播', style: 'media.posterGrid',
    itemAspectRatio: '16:9', imageOrientation: 'landscape', imageFit: 'fit',
    items: rows.slice((page - 1) * size, page * size).map(sportsItem), page, hasMore: page * size < rows.length,
    sort: options, sortOptions: options, selectedSortValue: sportId ? selected : 'all'
  };
}

function sportsCurrentRow(site, reference, includeSchedule) {
  const rows = sportsRows(site, includeSchedule);
  return rows.filter(function (row) {
    return Number(row.matchId) === reference.matchId && Number(row.sportId) === reference.sportId
      && (!reference.anchorId || Number(row.anchorId) === reference.anchorId)
      && numberValue(row.recordId, 0) === reference.recordId;
  })[0] || null;
}

function sportsPageURL(site, reference) {
  const config = sportsAPIData(site, 'getConfigInfo') || {};
  const origin = stringValue(config.webDomain).replace(/\/+$/, '');
  if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(origin)) throw new Error('体育直播站点配置无效');
  const route = stringValue(config.webLiveLink || '/live/{anchorId}');
  if (!/^\/[^/]/.test(route) || route.indexOf('{anchorId}') < 0 || /[?#]/.test(route)) throw new Error('体育直播页面配置无效');
  return origin + route.replace('{anchorId}', String(reference.anchorId))
    + (reference.recordId ? '?recordId=' + reference.recordId + '&playBack=true' : '');
}

function sportsPageData(site, reference, row) {
  if (!reference.anchorId) {
    row = row || sportsCurrentRow(site, reference, false);
    if (!row || !numberValue(row.anchorId, 0)) throw new Error('这场赛事尚未提供直播，请在开播后重试');
    reference = parseSportsItemID(sportsItemID(row));
  }
  if (!reference.recordId && row && Number(row.matchStatus) !== 2) {
    throw new Error(Number(row.matchStatus) === 1 ? '这场赛事尚未开播' : '这场赛事直播已结束，暂无回放');
  }
  const pageURL = sportsPageURL(site, reference);
  const origin = /^https:\/\/[^/]+/i.exec(pageURL)[0];
  const headers = { 'User-Agent': JBD_SPORTS_UA, Referer: pageURL, Origin: origin, Accept: 'text/html,application/xhtml+xml' };
  const html = responseText(httpGet(pageURL, headers));
  const script = /<script\b[^>]*\bid\s*=\s*["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script\s*>/i.exec(html);
  if (!script) throw new Error('体育直播页面未返回播放数据');
  const data = parseJSON(script[1]);
  const page = data && data.props && data.props.pageProps;
  const live = page && page.liveDetailProp;
  if (!page || !live) throw new Error('体育直播页面未返回播放数据');
  if (page.canPlay === false || page.canPlay === 0) throw new Error('这场赛事当前不可播放');
  if (Number(live.matchId) !== reference.matchId) throw new Error('该主播已切换到其他赛事，请刷新赛事列表');
  if (reference.recordId) {
    if (page.playBack !== true || !data.query || Number(data.query.recordId) !== reference.recordId) {
      throw new Error('这场赛事的回放已不可用');
    }
  } else if (page.playBack === true || Number(live.status) !== 1 || live.pushStreamFlag === false || live.isShow === 0) {
    throw new Error('这场赛事直播尚未开始或已经结束');
  }
  const addresses = live.playAddr || {};
  const keys = reference.recordId ? ['m3u8'] : ['ori_m3u8', 'ud_m3u8', 'hd_m3u8', 'sd_m3u8', 'ld_m3u8'];
  const names = { m3u8: '赛事回放', ori_m3u8: '原画', ud_m3u8: '超清', hd_m3u8: '高清', sd_m3u8: '标清', ld_m3u8: '流畅' };
  const choices = keys.filter(function (key) {
    return /^https:\/\/[^\s"<>]+$/i.test(stringValue(addresses[key]));
  }).map(function (key) { return { key, title: names[key], url: stringValue(addresses[key]) }; });
  if (!choices.length) throw new Error(reference.recordId ? '这场赛事暂无可用回放' : '这场赛事暂无可用的 HLS 直播线路');
  return { reference, pageURL, origin, live, choices };
}

function sportsVersionGroups(itemId, stream) {
  return [{ id: 'jbd-sports-quality', title: '播放线路', versions: stream.choices.map(function (choice, index) {
    const id = itemId + '|' + choice.key;
    return {
      id, title: choice.title, quality: choice.title, container: 'm3u8', availability: 'requiresResolve', default: index === 0,
      action: { type: 'play', itemId, versionId: id, title: stream.live.liveTitle || stream.live.title }
    };
  }) }];
}

function getSportsDetail(site, itemId) {
  const reference = parseSportsItemID(itemId);
  let row = null;
  try { row = sportsCurrentRow(site, reference, !reference.anchorId); } catch (error) { /* The page can still resolve a saved replay. */ }
  const base = sportsItem(row || reference);
  base.id = itemId;
  base.itemId = itemId;
  base.action = { type: 'detail', id: itemId, itemId, title: base.title };
  let stream = null;
  let unavailable = '';
  if (reference.recordId || (!row && reference.anchorId) || (row && Number(row.matchStatus) === 2)) {
    try { stream = sportsPageData(site, reference, row); } catch (error) { unavailable = String(error.message || error); }
  }
  const title = row ? base.title : stream ? stringValue(stream.live.liveTitle || stream.live.title) || base.title : base.title;
  const groups = stream ? sportsVersionGroups(itemId, stream) : [];
  return Object.assign({}, base, {
    pageType: 'detail', title, name: title, detailImageAspectRatio: '16:9', imageAspectRatio: '16:9',
    overview: unavailable || base.overview || (reference.recordId ? '体育赛事回放' : '赛事尚未开播或暂无可用直播线路'),
    facts: [
      row && row.leagueName ? { title: '赛事', value: String(row.leagueName) } : null,
      row && row.matchTimeStr ? { title: '开赛时间', value: String(row.matchTimeStr) } : null,
      { title: '状态', value: reference.recordId ? '回放' : stream ? '直播中' : (row && row.matchStatusName) || '暂不可播放' },
      row && row.anchorNickname ? { title: '解说', value: String(row.anchorNickname) } : null
    ].filter(Boolean),
    seasons: [], resourceGroups: groups, sourceUrl: stream ? stream.pageURL : undefined,
    providerIds: { jiabaideSports: itemId }
  });
}

function getSportsResourceVersions(site, args) {
  const itemId = stringValue(args.itemId || args.id || args.versionId).split('|')[0];
  const reference = parseSportsItemID(itemId);
  let row = null;
  if (!reference.recordId) row = sportsCurrentRow(site, reference, false);
  const stream = sportsPageData(site, reference, row);
  return { itemId, groups: sportsVersionGroups(itemId, stream) };
}

function resolveSportsPlayback(site, args) {
  const itemId = stringValue(args.itemId || args.id || args.versionId).split('|')[0];
  const reference = parseSportsItemID(itemId);
  let row = null;
  if (!reference.recordId) row = sportsCurrentRow(site, reference, false);
  const stream = sportsPageData(site, reference, row);
  const versionId = stringValue(args.versionId || args.sourceId);
  const key = versionId.indexOf('|') >= 0 ? versionId.split('|').pop() : '';
  const selected = stream.choices.filter(function (choice) { return choice.key === key; })[0] || stream.choices[0];
  const headers = { 'User-Agent': JBD_SPORTS_UA, Referer: stream.pageURL, Origin: stream.origin };
  return {
    url: selected.url, videoUrl: selected.url, container: 'm3u8', title: stream.live.liveTitle || stream.live.title || selected.title,
    quality: selected.title, headers, header: headers, Header: headers,
    isLive: reference.recordId === 0, streamKind: reference.recordId ? 'vod' : 'live'
  };
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
  const result = apiGet(site, '/mw-movie/anonymous/home/newest/list', [
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
  const result = apiGet(site, '/mw-movie/anonymous/video/list', [
    ['pageNum', String(numberValue(page, 1))],
    ['pageSize', String(numberValue(pageSize, 30))],
    ['sort', String(normalizeSort(sort || '1'))],
    ['sortBy', '1'],
    ['type1', String(typeId || 1)]
  ]);
  return (result && result.data) || {};
}

function detailData(site, vodId) {
  const result = apiGet(site, '/mw-movie/anonymous/video/detail', [['id', String(vodId)]]);
  const data = result && result.data;
  if (!data || !data.vodId) throw new Error('金牌影院详情接口没有返回影片数据');
  return data;
}

function searchData(site, keyword, page) {
  const result = apiGet(site, '/mw-movie/anonymous/video/searchByWordPageable', [
    ['keyword', keyword],
    ['pageNum', String(numberValue(page, 1))],
    ['pageSize', '24'],
    ['type', 'false']
  ]);
  return (result && result.data) || {};
}

function safeEpisodeURL(site, vodId, nid, token) {
  try {
    return fetchEpisodeURL(site, vodId, nid, token);
  } catch (error) {
    if (token) throw error;
    return [];
  }
}

function fetchEpisodeURL(site, vodId, nid, token) {
  if (!token) return fetchAnonymousEpisodeURL(site, vodId, nid);

  const result = apiGet(site, '/mw-movie/anonymous/v2/video/episode/url', [
    ['clientType', '1'],
    ['id', String(vodId)],
    ['nid', String(nid)]
  ], token);
  return (result && result.data && result.data.list) || [];
}

function fetchAnonymousEpisodeURL(site, vodId, nid) {
  const result = apiGet(site, '/api/mw-movie/anonymous/v2/video/episode/url', [
    ['id', String(vodId)],
    ['nid', String(nid)]
  ]);
  const list = (result && result.data && result.data.list) || [];
  const publicList = list.filter(function (entry) {
    return entry && (!entry.needLogin || entry.flag);
  });
  return publicList.length ? publicList : list.filter(function (entry) {
    return entry && entry.flag;
  });
}

function resolveEpisodeSelection(site, vodId, nid, token, selectedIndex, selectedResolution) {
  const firstList = fetchEpisodeURL(site, vodId, nid, token);
  const first = selectEpisodeEntry(firstList, selectedIndex, selectedResolution);
  if (!first || !first.url || !token || !isIPBoundPlaybackURL(first.url)) return first;

  // The API rotates between an IP-bound `whip` URL and an `auth_key` URL.
  // Request a fresh descriptor, but never consume the temporary media URL here.
  const refreshedList = fetchEpisodeURL(site, vodId, nid, token);
  const refreshed = selectEpisodeEntry(refreshedList, selectedIndex, selectedResolution);
  if (refreshed && refreshed.url && !isIPBoundPlaybackURL(refreshed.url)) return refreshed;
  return refreshed || first;
}

function selectEpisodeEntry(list, selectedIndex, selectedResolution) {
  const entries = Array.isArray(list) ? list : [];
  const resolution = stringValue(selectedResolution);
  if (resolution) {
    const matched = entries.filter(function (entry) {
      return entry && stringValue(entry.resolution) === resolution;
    })[0];
    if (matched) return matched;
  }
  return entries[numberValue(selectedIndex, 0)] || entries[0] || null;
}

function isIPBoundPlaybackURL(url) {
  return /(?:[?&])whip=[^&]+/i.test(stringValue(url).replace(/&amp;/g, '&'));
}

function apiGet(site, path, pairs, token) {
  const base = normalizeSite(site);
  const rawQuery = queryString(pairs, false);
  const urlQuery = queryString(pairs, true);
  const t = String(Date.now());
  const headers = apiHeaders(base, rawQuery, t, token);
  const url = base + path + (urlQuery ? '?' + urlQuery : '');
  const result = httpGet(url, headers);
  const data = parseJSON(responseText(result));
  if (data && data.code && Number(data.code) !== 200) {
    if (token && Number(data.code) === 99500) {
      throw new Error('金牌影院登录 Token 已失效，请重新从已登录网页复制 Token');
    }
    throw new Error((data.msg || '接口返回错误') + ' (' + data.code + ')');
  }
  return data;
}

function apiHeaders(site, rawQuery, t, token) {
  const headers = {
    'User-Agent': JBD_UA,
    Accept: 'application/json, text/plain, */*',
    Referer: site + '/',
    'client-type': '1',
    t,
    sign: signQuery(rawQuery, t),
    deviceId: deviceId()
  };
  if (token) {
    headers.authorization = token;
    headers['Cache-Control'] = 'no-cache';
    headers.Pragma = 'no-cache';
  }
  return headers;
}

function signQuery(rawQuery, t) {
  return sha1Hex(md5Hex((rawQuery ? rawQuery + '&' : '') + 'key=' + JBD_SIGN_KEY + '&t=' + t));
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

function tokenFromArgs(args) {
  const value =
    (args && args.params && (args.params.Token || args.params.token || args.params.Authorization)) ||
    (args && args.config && (args.config.Token || args.config.token || args.config.Authorization)) ||
    (args && args.settings && (args.settings.Token || args.settings.token || args.settings.Authorization)) ||
    (args && args.parameters && (args.parameters.Token || args.parameters.token || args.parameters.Authorization)) ||
    (args && (args.Token || args.token || args.Authorization)) ||
    '';
  return normalizeToken(value);
}

function normalizeToken(value) {
  let token = stringValue(value).trim();
  token = token.replace(/^['"]|['"]$/g, '').trim();
  token = token.replace(/^authorization\s*:\s*/i, '').trim();
  token = token.replace(/^bearer\s+/i, '').trim();
  return token;
}

function normalizeSite(value) {
  let site = stringValue(value || JBD_DEFAULT_BASE).trim();
  if (!site) site = JBD_DEFAULT_BASE;
  if (!/^https?:\/\//i.test(site)) site = 'https://' + site;
  site = site.replace(/\/+$/, '');
  if (/^https?:\/\/(?:m\.|www\.)?jiabaide\.cn$/i.test(site)) return JBD_DEFAULT_BASE;
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
  matchMovie,
  matchEpisode,
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
  globalThis.matchMovie = matchMovie;
  globalThis.matchEpisode = matchEpisode;
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
