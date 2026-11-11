// @name 人人美剧

const RRMJA_DEFAULT_BASE = 'https://www.rrmja.com';
const RRMJA_API_BASE = 'https://api.rrmj.plus';
const RRMJA_PLAYER_SITE = 'https://rrsp.com.cn';
const RRMJA_VIP_TOKEN = 'rrtv-05188573836c6a02cce84f931ad161282cf039b4';
const RRMJA_SIGN_SECRET = 'ES513W0B1CsdUrR13Qk5EgDAKPeeKZY';
const RRMJA_AES_KEY = '3b744389882a4067';
const RRMJA_PLAY_IV = 'b1da7878016e4e2b';
const RRMJA_LOGO = 'https://www.rrmja.com/upload/site/20250912-1/893532e756aacf0397b22e57f8fc8557.png';
const RRMJA_ICON = 'https://www.rrmja.com/upload/site/20250915-1/7e78cb0b89f11c5b71a18a5a1fe6af94.png';
const RRMJA_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1';
const RRMJA_PC_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const RRMJA_FALLBACK_DEVICE_ID = 'baiplay-rrmja-11111111-2222-4333-8444-555555555555';
const RRMJA_MATCH_CACHE_VERSION = 'v2';

const WidgetMetadata = {
  id: 'rrmja-mini-library',
  name: '人人美剧',
  title: '人人美剧',
  version: '1.0.1',
  author: 'baiPlay',
  logo: RRMJA_LOGO,
  icon: RRMJA_ICON,
  site: RRMJA_DEFAULT_BASE,
  description: '人人美剧自定义媒体库，支持首页、分类、搜索、详情、选集、清晰度选择和播放解析。'
};

const RRMJA_CHANNELS = [
  { id: 'movie', title: '电影', subtitle: '高清电影与新片', path: '/vodtype/1.html', mediaType: 'movie', style: 'discover.posterCompact' },
  { id: 'series', title: '剧集', subtitle: '连续剧与热门剧集', path: '/vodtype/2.html', mediaType: 'series', style: 'discover.spotlight' },
  { id: 'us', title: '美剧', subtitle: '欧美剧集专题', path: '/vodshow/16-----------.html', mediaType: 'series', style: 'discover.rankedPosterCompact' },
  { id: 'asia', title: '日韩剧', subtitle: '日韩与亚洲剧集', path: '/vodshow/15-----------.html', mediaType: 'series', style: 'discover.editorial' },
  { id: 'anime', title: '动漫', subtitle: '动画与番剧', path: '/vodtype/4.html', mediaType: 'series', style: 'discover.posterCompact' },
  { id: 'show', title: '综艺', subtitle: '综艺与真人秀', path: '/vodtype/3.html', mediaType: 'series', style: 'discover.ranked' }
];

const RRMJA_HOME_SECTIONS = [
  { id: 'rrmja-hot', title: '正在热播', titlePattern: '正在热播', style: 'discover.spotlight', mediaType: 'mixed' },
  { id: 'rrmja-us', title: '美剧', titlePattern: '美剧', style: 'discover.rankedPosterCompact', mediaType: 'series', morePath: '/vodshow/16-----------.html' },
  { id: 'rrmja-asia', title: '日韩剧', titlePattern: '日韩剧', style: 'discover.editorial', mediaType: 'series', morePath: '/vodshow/15-----------.html' },
  { id: 'rrmja-anime', title: '动漫', titlePattern: '动漫', style: 'discover.posterCompact', mediaType: 'series', morePath: '/vodtype/4.html' },
  { id: 'rrmja-show', title: '综艺', titlePattern: '综艺', style: 'discover.ranked', mediaType: 'series', morePath: '/vodtype/3.html' }
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
        value: RRMJA_DEFAULT_BASE,
        required: true,
        description: '人人美剧网页地址。'
      }
    ]
  };
}

function getHome(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const html = fetchText(site, '/', site + '/');
  const hero = parseHeroItems(html, site).slice(0, 10);
  const channels = RRMJA_CHANNELS.map(function (channel, index) {
    const preview = parseSectionItemsByTitle(html, channel.title, site).slice(0, 6);
    return channelEntry(channel, preview, index + 1);
  });

  return {
    pageType: 'home',
    id: 'rrmja-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '16:9',
    hero,
    carousel: hero,
    sections: [
      {
        id: 'rrmja-channels',
        title: '频道入口',
        style: 'discover.annualWidePreview',
        lazy: false,
        items: channels
      }
    ].concat(
      RRMJA_HOME_SECTIONS.map(function (section) {
        const eagerItems = section.id === 'rrmja-hot' ? parseSectionItemsByTitle(html, section.titlePattern, site).slice(0, 18) : [];
        return {
          id: section.id,
          title: section.title,
          style: section.style,
          contentType: section.mediaType,
          lazy: true,
          loadAction: { type: 'custom', id: section.id, sectionId: section.id, title: section.title },
          moreAction: categoryAction(section.morePath || '/vodtype/2.html', section.title, section.mediaType),
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
  if (sectionId === 'rrmja-channels') {
    const html = fetchText(site, '/', site + '/');
    return {
      id: 'rrmja-channels',
      title: '频道入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: RRMJA_CHANNELS.map(function (channel, index) {
        const preview = parseSectionItemsByTitle(html, channel.title, site).slice(0, 6);
        return channelEntry(channel, preview, index + 1);
      })
    };
  }

  const section = findById(RRMJA_HOME_SECTIONS, sectionId);
  if (!section) {
    return {
      id: sectionId || 'rrmja-unknown-section',
      title: stringValue(args.title) || WidgetMetadata.title,
      style: stringValue(args.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  const html = fetchText(site, '/', site + '/');
  return {
    id: section.id,
    title: section.title,
    style: section.style,
    contentType: section.mediaType,
    lazy: false,
    moreAction: categoryAction(section.morePath || '/vodtype/2.html', section.title, section.mediaType),
    items: parseSectionItemsByTitle(html, section.titlePattern, site).slice(0, 24)
  };
}

function getCategory(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const parsed = parsePageId(args.pageId || args.id || args.categoryId || '/vodtype/2.html');
  const page = numberValue(args.page, parsed.page || 1);
  const path = pagePath(parsed.path, page);
  const html = fetchText(site, path, site + '/');
  const title = parsed.title || pageTitleFromHTML(html) || titleForPath(parsed.path);
  const items = parsePosterItems(html, site).slice(0, 60);
  return {
    pageType: 'category',
    id: parsed.id,
    title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    contentType: parsed.mediaType || mediaTypeFromPath(parsed.path),
    items,
    page,
    hasMore: hasNextPage(html, page),
    sortOptions: [],
    sort: [],
    selectedSortValue: ''
  };
}

function getDetail(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const itemId = normalizeItemId(args.itemId || args.id || args.vodId);
  if (!itemId) throw new Error('人人美剧详情参数为空');
  const path = itemId.indexOf('/voddetail/') === 0 ? itemId : '/voddetail/' + itemId + '.html';
  const html = fetchText(site, path, site + path);
  const detail = parseDetail(html, site, path);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const args = argsify(ctx);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const itemId = normalizeItemId(args.itemId || args.id || args.vodId || decoded.itemId);
  if (!itemId) return { groups: [] };

  const detail = getCachedDetail(itemId) || getDetail({ itemId, params: args.params, config: args.config, settings: args.settings });
  const target = findEpisode(detail, args.episodeId || args.episode || decoded.episodeId) || firstEpisode(detail);
  if (!target) return { itemId: detail.id, groups: [] };

  let apiError = null;
  try {
    const apiInfo = apiDramaForDetail(detail);
    const apiEpisode = apiEpisodeForTarget(apiInfo, target);
    if (apiEpisode && apiEpisode.sid) {
      const qualities = apiQualities(apiInfo);
      const versions = qualities.map(function (quality, index) {
        const qualityCode = stringValue(quality.qualityCode || quality.code || quality.name || quality);
        const displayName = qualityDisplayName(quality, qualityCode);
        const versionId = encodeVersionId({
          itemId: detail.id,
          apiDramaId: apiInfo.id,
          episodeNo: target.episodeNumber || target.index || 1,
          episodeSid: apiEpisode && apiEpisode.sid,
          qualityCode,
          lineId: target.lineId || '',
          playPath: ''
        });
        return {
          id: versionId,
          title: displayName,
          name: displayName,
          subtitle: target.title || target.name || detail.title,
          quality: displayName,
          sourceName: WidgetMetadata.title,
          availability: 'requiresResolve',
          default: index === 0,
          action: {
            type: 'play',
            itemId: detail.id,
            episodeId: target.id,
            versionId,
            title: detail.title + (target.title ? ' ' + target.title : '')
          },
          ext: {
            apiDramaId: apiInfo.id,
            episodeSid: apiEpisode && apiEpisode.sid,
            qualityCode
          }
        };
      });

      return {
        itemId: detail.id,
        seasonId: 's1',
        episodeId: target.id,
        groups: versions.length ? [{ id: 'rrmja-quality', title: '清晰度', versions }] : []
      };
    }
    apiError = new Error('人人美剧 API 没有匹配到第 ' + (target.episodeNumber || target.index || 1) + ' 集');
  } catch (error) {
    apiError = error;
  }

  const directGroups = directResourceGroupsForDetail(detail, target);
  if (directGroups.length) {
    return {
      itemId: detail.id,
      seasonId: 's1',
      episodeId: target.id,
      groups: directGroups
    };
  }
  if (apiError) throw apiError;
  return { itemId: detail.id, seasonId: 's1', episodeId: target.id, groups: [] };
}

function resolvePlayback(ctx) {
  const args = argsify(ctx);
  const decoded = decodeVersionId(args.versionId || args.id || args.sourceId);
  const direct = stringValue(args.url || args.playUrl || args.videoUrl || (args.ext && args.ext.url));
  const decodedDirect = stringValue(decoded.playPath);
  if (isDirectMediaURL(direct)) return playback(direct, { headers: sourcePlaybackHeaders(direct) });
  if (isDirectMediaURL(decodedDirect)) return playback(decodedDirect, { headers: sourcePlaybackHeaders(decodedDirect) });

  const itemId = normalizeItemId(args.itemId || args.id || args.vodId || decoded.itemId);
  const episodeSid = stringValue(args.episodeSid || (args.ext && args.ext.episodeSid) || decoded.episodeSid);
  const qualityCode = stringValue(args.qualityCode || (args.ext && args.ext.qualityCode) || decoded.qualityCode || 'HD');
  const apiDramaId = stringValue(args.apiDramaId || (args.ext && args.ext.apiDramaId) || decoded.apiDramaId);
  let sid = episodeSid;
  let dramaId = apiDramaId;
  let apiInfo = null;
  let detailForFallback = null;
  let targetForFallback = null;

  if (!dramaId || !sid) {
    const detail = getCachedDetail(itemId) || getDetail({ itemId, params: args.params, config: args.config, settings: args.settings });
    const target = findEpisode(detail, args.episodeId || decoded.episodeId) || firstEpisode(detail);
    detailForFallback = detail;
    targetForFallback = target;
    let apiError = null;
    try {
      apiInfo = apiDramaForDetail(detail);
      const apiEpisode = apiEpisodeForTarget(apiInfo, target);
      dramaId = stringValue(apiInfo.id);
      sid = stringValue(apiEpisode && apiEpisode.sid);
    } catch (error) {
      apiError = error;
    }
    if (!dramaId || !sid) {
      const directVersion = directPlaybackForTarget(detail, target, decoded.lineId);
      if (directVersion && directVersion.url) {
        return playback(directVersion.url, {
          headers: sourcePlaybackHeaders(directVersion.url),
          quality: directVersion.title || directVersion.sourceName
        });
      }
      if (apiError) throw apiError;
    }
  }

  if (!dramaId || !sid) throw new Error('人人美剧播放失败：没有匹配到 API 剧集');
  let playError = null;
  try {
    const result = apiPlayWithFallback(dramaId, sid, qualityCode, apiInfo);
    const finalURL = result && result.url;
    if (finalURL) return playback(finalURL, result);
    playError = new Error('人人美剧播放失败：播放接口没有返回地址');
  } catch (error) {
    playError = error;
  }

  if (!detailForFallback && itemId) {
    detailForFallback = getCachedDetail(itemId) || getDetail({ itemId, params: args.params, config: args.config, settings: args.settings });
    targetForFallback = findEpisode(detailForFallback, args.episodeId || decoded.episodeId) || firstEpisode(detailForFallback);
  }
  const directFallback = directPlaybackForTarget(detailForFallback, targetForFallback, decoded.lineId);
  if (directFallback && directFallback.url) {
    return playback(directFallback.url, {
      headers: sourcePlaybackHeaders(directFallback.url),
      quality: directFallback.title || directFallback.sourceName
    });
  }
  if (playError) throw playError;
  throw new Error('人人美剧播放失败：播放接口没有返回地址');
}

function search(ctx) {
  const args = argsify(ctx);
  const site = siteFromArgs(args);
  const query = stringValue(args.query || args.keyword || args.text || args.wd).trim();
  const page = numberValue(args.page, 1);
  if (!query) {
    return emptySearch(query, page);
  }
  const path = searchPath(query, page);
  const html = fetchText(site, path, site + '/');
  const items = parsePosterItems(html, site).slice(0, 48);
  return {
    pageType: 'search',
    id: 'rrmja-search:' + query,
    title: '搜索：' + query,
    keyword: query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items,
    page,
    hasMore: hasNextPage(html, page)
  };
}

function getCategories() {
  return RRMJA_CHANNELS.map(function (channel) {
    return {
      id: 'path:' + channel.path,
      title: channel.title,
      name: channel.title,
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

function channelEntry(channel, previewItems, rank) {
  const first = previewItems && previewItems[0];
  return {
    id: 'rrmja-channel-' + channel.id,
    title: channel.title,
    name: channel.title,
    subtitle: channel.subtitle,
    description: '浏览人人美剧' + channel.title + '频道。',
    overview: '浏览人人美剧' + channel.title + '频道。',
    type: 'collection',
    mediaType: channel.mediaType,
    poster: first && first.poster,
    cover: first && first.poster,
    backdrop: first && (first.backdrop || first.poster),
    imageHeaders: imageHeaders(channel.path),
    posterHeaders: imageHeaders(channel.path),
    backdropHeaders: imageHeaders(channel.path),
    previewItems: previewItems || [],
    badges: [channel.title],
    rank,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    action: categoryAction(channel.path, channel.title, channel.mediaType)
  };
}

function categoryAction(path, title, mediaType) {
  return {
    type: 'category',
    id: 'path:' + path,
    pageId: 'path:' + path,
    title: title || titleForPath(path),
    contentType: mediaType || mediaTypeFromPath(path),
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill'
  };
}

function parseHeroItems(html, site) {
  const blocks = matchAll(/<div[^>]+class=["'][^"']*slide-time-bj[^"']*["'][\s\S]*?<\/a>\s*<\/div>/gi, html);
  return blocks.map(function (block, index) {
    const href = attr(matchOne(/<a[^>]+href=["']([^"']+)["']/i, block));
    const title = cleanText(matchOne(/class=["'][^"']*this-desc-title[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, block));
    const image = absoluteImage(matchOne(/background-image:\s*url\((['"]?)(.*?)\1\)/i, block, 2));
    const info = splitInfo(cleanText(matchOne(/class=["'][^"']*this-desc-info[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, block)));
    const overview = cleanOverview(matchOne(/class=["'][^"']*slide-desc-item-a[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, block));
    const typeLabel = cleanText(matchOne(/focus-item-label-original[^>]*>([\s\S]*?)<\/span>/i, block));
    const item = baseMediaItem({
      id: normalizeItemId(href),
      path: href,
      title,
      poster: image,
      backdrop: image,
      overview,
      year: yearFrom(info.join(' ')),
      rating: scoreValue(matchOne(/this-desc-score[^>]*>[\s\S]*?<\/i>\s*([^<]+)/i, block)),
      remarks: info[info.length - 1],
      subtitle: info.join(' / '),
      typeLabel,
      rank: index + 1,
      mediaType: mediaTypeFromLabel(typeLabel, href)
    });
    item.aspectRatio = '16:9';
    item.itemAspectRatio = '16:9';
    item.imageOrientation = 'landscape';
    return item;
  }).filter(function (item) {
    return item && item.id && item.title;
  });
}

function parseSectionItemsByTitle(html, title, site) {
  const heading = new RegExp('<h4\\s+class=["\']title-h cor4["\'][^>]*>\\s*' + escapeRegExp(title) + '\\s*<\\/h4>', 'i');
  const headingMatch = heading.exec(html);
  const index = headingMatch ? headingMatch.index : -1;
  if (index < 0) return [];
  const start = index + headingMatch[0].length;
  const next = html.slice(start).search(/<h4\s+class=["']title-h cor4["']/i);
  const chunk = next >= 0 ? html.slice(index, start + next) : html.slice(index);
  return parsePosterItems(chunk, site);
}

function parsePosterItems(html, site) {
  const blocks = matchAll(/<div[^>]+class=["'][^"']*public-list-box[^"']*["'][\s\S]*?(?=<div[^>]+class=["'][^"']*public-list-box|<div[^>]+class=["'][^"']*pages|<h4\s+class=["']title-h cor4["']|$)/gi, html);
  const items = [];
  const seen = {};
  blocks.forEach(function (block, index) {
    const href = attr(matchOne(/<a[^>]+class=["'][^"']*public-list-exp[^"']*["'][^>]+href=["']([^"']+)["']/i, block));
    if (!href || href.indexOf('/voddetail/') < 0) return;
    const id = normalizeItemId(href);
    if (!id || seen[id]) return;
    seen[id] = true;
    const title =
      cleanText(matchOne(/class=["'][^"']*time-title[^"']*["'][^>]*title=["']([^"']+)["']/i, block)) ||
      cleanText(matchOne(/class=["'][^"']*public-list-exp[^"']*["'][^>]*title=["']([^"']+)["']/i, block)) ||
      cleanText(matchOne(/class=["'][^"']*time-title[^"']*["'][^>]*>([\s\S]*?)<\/a>/i, block));
    const poster = absoluteImage(
      matchOne(/<img[^>]+(?:data-src|data-original)=["']([^"']+)["']/i, block) ||
        matchOne(/<img[^>]+src=["']([^"']+)["']/i, block)
    );
    const subtitle = cleanText(matchOne(/class=["'][^"']*public-list-subtitle[^"']*["'][^>]*>([\s\S]*?)<\/div>/i, block));
    const remarks = cleanText(matchOne(/class=["'][^"']*public-list-prb[^"']*["'][^>]*>([\s\S]*?)<\/span>/i, block));
    const rating = scoreValue(matchOne(/class=["'][^"']*public-prt[^"']*["'][^>]*>([\s\S]*?)<\/span>/i, block));
    items.push(
      baseMediaItem({
        id,
        path: href,
        title,
        poster,
        backdrop: poster,
        subtitle: [yearFrom(title), remarks, subtitle].filter(Boolean).join(' / '),
        overview: subtitle,
        year: yearFrom(title),
        rating,
        remarks,
        typeLabel: '',
        rank: index + 1,
        mediaType: mediaTypeFromLabel('', href, remarks || title)
      })
    );
  });
  return items;
}

function baseMediaItem(raw) {
  const id = normalizeItemId(raw.id || raw.path);
  const path = raw.path && raw.path.indexOf('/voddetail/') === 0 ? raw.path : '/voddetail/' + id + '.html';
  const poster = raw.poster || raw.backdrop || '';
  return {
    id,
    itemId: id,
    title: raw.title,
    name: raw.title,
    type: raw.mediaType || 'mixed',
    mediaType: raw.mediaType || 'mixed',
    poster,
    cover: poster,
    backdrop: raw.backdrop || poster,
    thumb: raw.backdrop || poster,
    imageHeaders: imageHeaders(path),
    posterHeaders: imageHeaders(path),
    backdropHeaders: imageHeaders(path),
    subtitle: raw.subtitle || '',
    description: raw.overview || raw.subtitle || '',
    overview: raw.overview || raw.subtitle || '',
    year: raw.year,
    rating: raw.rating,
    rank: raw.rank,
    badges: unique([raw.remarks, raw.typeLabel].filter(Boolean)).slice(0, 3),
    remarks: raw.remarks,
    status: raw.remarks,
    itemAspectRatio: raw.itemAspectRatio || '2:3',
    imageOrientation: raw.imageOrientation || 'portrait',
    imageFit: 'fill',
    action: {
      type: 'detail',
      itemId: id,
      id,
      title: raw.title,
      itemAspectRatio: raw.itemAspectRatio || '2:3',
      imageOrientation: raw.imageOrientation || 'portrait'
    },
    providerIds: {
      rrmja: id
    }
  };
}

function parseDetail(html, site, path) {
  const itemId = normalizeItemId(path);
  const title =
    cleanText(matchOne(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html)) ||
    cleanTitle(cleanText(matchOne(/<title>([\s\S]*?)<\/title>/i, html))) ||
    cleanText(matchOne(/play-score-txt[\s\S]*?《([^》]+)》/i, html));
  const poster = absoluteImage(
    matchOne(/class=["'][^"']*lazy[^"']*gen-movie-img[^"']*["'][^>]+(?:data-src|src)=["']([^"']+)["']/i, html) ||
      matchOne(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i, html) ||
      matchOne(/<img[^>]+(?:data-src|data-original)=["']([^"']+)["'][^>]+alt=["'][^"']*封面/i, html)
  );
  const backdrop = absoluteImage(
    matchOne(/background-image:\s*url\((['"]?)(.*?)\1\)/i, html, 2) ||
      matchOne(/class=["'][^"']*vod-detail-bj[^"']*["'][\s\S]*?<img[^>]+(?:data-src|src)=["']([^"']+)["']/i, html) ||
      poster
  );
  const overview =
    cleanOverview(matchOne(/<div[^>]+id=["']height_limit["'][^>]*>([\s\S]*?)<\/div>/i, html)) ||
    cleanOverview(matchOne(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i, html));
  const rating = scoreValue(matchOne(/class=["']fraction["'][^>]*>([\s\S]*?)<\/div>/i, html));
  const scoreCount = cleanText(matchOne(/class=["']score-data[^"']*["'][^>]*>([\s\S]*?)<\/span>/i, html));
  const directors = peopleFromInfo(html, '导演');
  const actors = peopleFromInfo(html, '演员');
  const facts = infoParameters(html);
  const genres = tagList(html).concat(splitList(facts['类型'] || facts['分类'] || '')).filter(Boolean);
  const year = yearFrom(facts['年份'] || facts['上映'] || title);
  const area = cleanText(facts['地区'] || facts['国家'] || '');
  const remarks = cleanText(matchOne(/class=["'][^"']*public-list-prb[^"']*["'][^>]*>([\s\S]*?)<\/span>/i, html));
  const playSources = parsePlaySources(html, itemId, title);
  const episodes = playSources[0] && playSources[0].episodes ? playSources[0].episodes : [];
  const type = episodes.length > 1 || /剧|动漫|综艺|集|季/.test([facts['类型'], facts['分类'], remarks, title].join(' ')) ? 'series' : 'movie';
  const recommendations = parseRecommendations(html, site, path).slice(0, 18);

  const detail = {
    pageType: 'detail',
    id: itemId,
    itemId,
    type,
    mediaType: type,
    title,
    name: title,
    originalTitle: cleanText(facts['原名'] || ''),
    poster,
    cover: poster,
    backdrop: backdrop || poster,
    thumb: backdrop || poster,
    imageHeaders: imageHeaders(path),
    posterHeaders: imageHeaders(path),
    backdropHeaders: imageHeaders(path),
    detailImageAspectRatio: backdrop && backdrop !== poster ? '16:9' : '2:3',
    overview,
    description: overview,
    year,
    rating,
    score: rating,
    scoreText: scoreCount,
    area,
    country: area,
    genres: unique(genres).slice(0, 12),
    tags: unique(genres).slice(0, 12),
    status: remarks,
    remarks,
    cast: actors.map(function (name) {
      return { id: 'actor:' + name, name, role: '主演', action: { type: 'search', query: name, title: name } };
    }),
    crew: directors.map(function (name) {
      return { id: 'director:' + name, name, role: '导演', job: '导演', action: { type: 'search', query: name, title: name } };
    }),
    seasons: [
      {
        id: 's1',
        title: type === 'movie' ? '正片' : '第 1 季',
        seasonNumber: 1,
        episodes
      }
    ],
    playSources,
    recommendations,
    related: recommendations,
    resourceGroups: defaultResourceGroupsForDetail(itemId, episodes),
    providerIds: {
      rrmja: itemId
    },
    ext: {
      path,
      site,
      facts,
      playSources
    }
  };
  return detail;
}

function parsePlaySources(html, itemId, detailTitle) {
  const tabStart = html.search(/<div[^>]+class=["'][^"']*anthology-tab[^"']*["']/i);
  const listStart = html.search(/<div[^>]+class=["'][^"']*anthology-list[^"']*["']/i);
  const tabChunk = tabStart >= 0 && listStart > tabStart ? html.slice(tabStart, listStart) : '';
  const tabMatches = matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi, tabChunk).map(function (tab, index) {
    return cleanText(tab[1]).replace(/\d+\s*$/, '') || '线路 ' + (index + 1);
  });
  const listChunk = matchOne(/<div[^>]+class=["'][^"']*anthology-list[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, html) || html;
  const boxes = matchAll(/<div[^>]+class=["'][^"']*anthology-list-box[^"']*["'][\s\S]*?<\/div>\s*<\/div>/gi, listChunk);
  const sources = boxes.map(function (box, lineIndex) {
    const lineId = String(lineIndex + 1);
    const sourceName = tabMatches[lineIndex] || '线路 ' + (lineIndex + 1);
    const episodes = matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, box).map(function (entry, epIndex) {
      const playPath = attr(entry[1]);
      const epTitle = cleanText(entry[2]) || (epIndex + 1 === 1 ? '正片' : '第' + (epIndex + 1) + '集');
      const episodeNo = episodeNumberFromTitle(epTitle, epIndex + 1);
      const episodeId = 'ep:' + itemId + ':' + lineId + ':' + episodeNo;
      return {
        id: episodeId,
        episodeId,
        title: epTitle,
        name: epTitle,
        index: episodeNo,
        episodeNumber: episodeNo,
        seasonNumber: 1,
        lineId,
        sourceName,
        playPath,
        overview: epTitle,
        action: {
          type: 'play',
          itemId,
          seasonId: 's1',
          episodeId,
          versionId: encodeVersionId({
            itemId,
            episodeNo,
            qualityCode: 'HD',
            lineId,
            playPath
          }),
          title: detailTitle + ' ' + epTitle
        }
      };
    });
    return {
      id: 'line:' + lineId,
      title: sourceName,
      name: sourceName,
      episodes
    };
  }).filter(function (source) {
    return source.episodes.length > 0;
  });

  if (!sources.length) {
    sources.push({
      id: 'line:1',
      title: '人人美剧',
      name: '人人美剧',
      episodes: [
        {
          id: 'ep:' + itemId + ':1:1',
          episodeId: 'ep:' + itemId + ':1:1',
          title: '正片',
          name: '正片',
          index: 1,
          episodeNumber: 1,
          seasonNumber: 1,
          lineId: '1',
          sourceName: '人人美剧',
          action: {
            type: 'play',
            itemId,
            seasonId: 's1',
            episodeId: 'ep:' + itemId + ':1:1',
            versionId: encodeVersionId({ itemId, episodeNo: 1, qualityCode: 'HD', lineId: '1' }),
            title: detailTitle
          }
        }
      ]
    });
  }
  return sources;
}

function parseRecommendations(html, site, detailPath) {
  const index = html.indexOf('相关影片');
  if (index < 0) return [];
  return parsePosterItems(html.slice(index), site).filter(function (item) {
    return normalizeItemId(item.id) !== normalizeItemId(detailPath);
  });
}

function peopleFromInfo(html, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp('<div[^>]+class=["\'][^"\']*this-info[^"\']*["\'][^>]*>\\s*<strong[^>]*>\\s*' + escaped + '[:：]\\s*<\\/strong>([\\s\\S]*?)<\\/div>', 'i').exec(html);
  if (!match) return [];
  return unique(matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi, match[1]).map(function (entry) {
    return cleanText(entry[1]);
  }).filter(Boolean)).slice(0, 36);
}

function infoParameters(html) {
  const facts = {};
  matchAll(/<div[^>]+class=["'][^"']*info-parameter[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi, html).forEach(function (entry) {
    const text = cleanText(entry[1]);
    const parts = text.split(/[:：]/);
    if (parts.length >= 2) facts[parts[0].trim()] = parts.slice(1).join(':').trim();
  });
  matchAll(/<span[^>]*>([\s\S]*?)<\/span>/gi, html).forEach(function (entry) {
    const text = cleanText(entry[1]);
    const parts = text.split(/[:：]/);
    if (parts.length >= 2 && parts[0].length <= 6) facts[parts[0].trim()] = parts.slice(1).join(':').trim();
  });
  return facts;
}

function tagList(html) {
  return unique(matchAll(/class=["'][^"']*this-desc-tags[^"']*["'][\s\S]*?<\/div>/gi, html).join('\n').match(/<span[^>]*>([\s\S]*?)<\/span>/gi) || [])
    .map(function (tag) {
      return cleanText(tag);
    })
    .filter(Boolean);
}

function apiDramaForDetail(detail) {
  const cacheKey = 'rrmja.apiDrama.' + RRMJA_MATCH_CACHE_VERSION + '.' + detail.id + '.' + normalizeTitle(detail.title);
  const cached = cacheGet(cacheKey);
  if (cached && cached.id && cached.pageData) return cached;
  const keyword = apiSearchKeyword(detail.title);
  const searchData = apiSearchDrama(keyword);
  const list = (searchData && searchData.searchDramaList) || (searchData && searchData.data && searchData.data.searchDramaList) || [];
  const drama = bestDramaMatch(detail, list);
  if (!drama || !drama.id) throw new Error('人人美剧播放失败：API 没有匹配到《' + detail.title + '》');
  const pageData = apiDramaPage(drama.id);
  const result = {
    id: String(drama.id),
    title: drama.title || drama.name || detail.title,
    raw: drama,
    pageData
  };
  cacheSet(cacheKey, result);
  return result;
}

function defaultResourceGroupsForDetail(itemId, episodes) {
  const first = episodes && episodes[0];
  if (!first) return [];
  const versionId = encodeVersionId({
    itemId,
    episodeNo: first.episodeNumber || first.index || 1,
    qualityCode: 'AI_OD',
    lineId: first.lineId || '',
    playPath: first.playPath || ''
  });
  return [
    {
      id: 'rrmja-default',
      title: '播放',
      versions: [
        {
          id: versionId,
          title: '默认清晰度',
          name: '默认清晰度',
          subtitle: first.title || first.name || '',
          quality: 'AI_OD',
          sourceName: first.sourceName || WidgetMetadata.title,
          availability: 'requiresResolve',
          default: true,
          action: {
            type: 'play',
            itemId,
            episodeId: first.id,
            versionId,
            url: first.playPath || '',
            title: first.title || '播放'
          }
        }
      ]
    }
  ];
}

function directResourceGroupsForDetail(detail, target) {
  const versions = directVersionsForTarget(detail, target);
  if (!versions.length) return [];
  return [
    {
      id: 'rrmja-direct-lines',
      title: '站内线路',
      versions: versions.map(function (version, index) {
        const versionId = encodeVersionId({
          itemId: detail.id,
          episodeNo: target && (target.episodeNumber || target.index) || 1,
          qualityCode: 'DIRECT',
          lineId: version.lineId,
          playPath: version.url
        });
        return {
          id: versionId,
          title: version.title,
          name: version.title,
          subtitle: target && (target.title || target.name) || detail.title,
          quality: version.title,
          sourceName: version.sourceName || '站内线路',
          availability: 'requiresResolve',
          default: index === 0,
          action: {
            type: 'play',
            itemId: detail.id,
            episodeId: target && target.id,
            versionId,
            url: version.url,
            title: detail.title + (target && target.title ? ' ' + target.title : '')
          },
          ext: {
            direct: true,
            url: version.url,
            lineId: version.lineId
          }
        };
      })
    }
  ];
}

function directPlaybackForTarget(detail, target, lineId) {
  const versions = directVersionsForTarget(detail, target);
  if (!versions.length) return null;
  const selectedLine = stringValue(lineId);
  return (
    versions.filter(function (version) {
      return version.lineId === selectedLine;
    })[0] || versions[0]
  );
}

function directVersionsForTarget(detail, target) {
  const vod = macCmsDetailForItem(detail);
  const sources = parseMacCmsPlaySources(vod);
  if (!sources.length) return [];
  const epNo = numberValue(target && (target.episodeNumber || target.index), 1);
  const isMovie = detail && detail.type === 'movie';
  const versions = [];
  sources.forEach(function (source) {
    const episode =
      source.episodes.filter(function (entry) {
        return Number(entry.episodeNumber) === epNo;
      })[0] ||
      (isMovie && source.episodes[0]);
    if (!episode || !isDirectMediaURL(episode.url)) return;
    versions.push({
      lineId: source.id,
      title: source.title,
      sourceName: source.title,
      url: episode.url
    });
  });
  return versions;
}

function macCmsDetailForItem(detail) {
  const itemId = normalizeItemId(detail && (detail.id || detail.itemId));
  if (!itemId) return null;
  const cacheKey = 'rrmja.maccms.v1.' + itemId;
  const cached = cacheGet(cacheKey);
  if (cached && cached.vod_id) return cached;
  const site = normalizeSite(detail && detail.ext && detail.ext.site || RRMJA_DEFAULT_BASE);
  const path = '/api.php/provide/vod/?ac=detail&ids=' + encodeURIComponent(itemId);
  const response = fetchText(site, path, site + '/voddetail/' + itemId + '.html');
  const data = parseJSON(response);
  const vod = data && data.list && data.list[0];
  if (vod && vod.vod_id) cacheSet(cacheKey, vod);
  return vod || null;
}

function parseMacCmsPlaySources(vod) {
  if (!vod || !vod.vod_play_url) return [];
  const fromList = stringValue(vod.vod_play_from).split('$$$');
  return stringValue(vod.vod_play_url)
    .split('$$$')
    .map(function (part, sourceIndex) {
      const sourceCode = cleanText(fromList[sourceIndex] || 'line' + (sourceIndex + 1));
      const sourceTitle = macCmsSourceTitle(sourceCode, sourceIndex);
      const episodes = part
        .split('#')
        .map(function (entry, epIndex) {
          const splitIndex = entry.indexOf('$');
          if (splitIndex < 0) return null;
          const epTitle = cleanText(entry.slice(0, splitIndex)) || '第' + (epIndex + 1) + '集';
          const url = attr(entry.slice(splitIndex + 1));
          if (!url) return null;
          return {
            title: epTitle,
            episodeNumber: episodeNumberFromTitle(epTitle, epIndex + 1),
            url
          };
        })
        .filter(Boolean);
      return {
        id: 'direct:' + sourceIndex,
        title: sourceTitle,
        episodes
      };
    })
    .filter(function (source) {
      return source.episodes.length > 0;
    });
}

function macCmsSourceTitle(code, index) {
  const text = cleanText(code);
  const map = {
    ffm3u8: '非凡线路',
    dyttm3u8: '电影天堂线路',
    rrmj: '人人美剧',
    rrmjm3u8: '人人美剧'
  };
  return map[text] || text || '线路 ' + (index + 1);
}

function apiSearchDrama(keyword) {
  const params = {
    isExecuteVipActivity: true,
    keywords: keyword,
    order: 'match',
    search_after: '',
    size: 20
  };
  const payload = apiGet('/m-station/search/drama', params, '');
  return payload && payload.data ? payload.data : payload;
}

function apiDramaPage(dramaId) {
  const params = {
    dramaId: String(dramaId),
    hevcOpen: 1,
    hsdrOpen: 0,
    isAgeLimit: 0,
    quality: 'AI4K',
    tria4k: 1
  };
  const payload = apiGet('/m-station/drama/page', params, '');
  return payload && payload.data ? payload.data : payload;
}

function apiPlay(dramaId, episodeSid, qualityCode) {
  const result = apiPlayOnceWithRetry(dramaId, episodeSid, qualityCode, 3);
  if (!result || !result.url) return result;
  const playableURL = resolvePlayURLWithRetry(dramaId, episodeSid, qualityCode, result.url);
  if (!playableURL) return null;
  result.url = playableURL;
  return result;
}

function apiPlayWithFallback(dramaId, episodeSid, preferredQuality, apiInfo) {
  const candidates = unique(
    [preferredQuality]
      .concat(apiQualities(apiInfo).map(function (quality) {
        return stringValue(quality && (quality.qualityCode || quality.code || quality.name || quality));
      }))
      .concat(['AI_OD', 'AI4K', 'HD', 'SD'])
      .filter(Boolean)
  );
  let lastError = null;
  for (let i = 0; i < candidates.length; i += 1) {
    const qualityCode = candidates[i];
    try {
      const result = apiPlay(dramaId, episodeSid, qualityCode);
      if (result && result.url) {
        result.qualityCode = qualityCode;
        return result;
      }
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

function apiPlayOnce(dramaId, episodeSid, qualityCode) {
  const params = {
    dramaId: String(dramaId),
    episodeSid: String(episodeSid),
    hevcOpen: 1,
    quality: qualityCode || 'HD',
    tria4k: 1
  };
  const payload = apiGet('/m-station/drama/play', params, RRMJA_VIP_TOKEN);
  const data = payload && payload.data ? payload.data : payload;
  if (!data || !data.m3u8 || !data.m3u8.url) return null;
  const url = decryptPlayURL(data.m3u8.url, data.newSign || '');
  return {
    url,
    quality: data.m3u8.currentQuality || qualityCode,
    raw: data
  };
}

function resolvePlayURLWithRetry(dramaId, episodeSid, qualityCode, initialURL) {
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const testURL = attempt === 0 ? initialURL : refreshPlayURL(dramaId, episodeSid, qualityCode);
    if (!testURL) continue;
    const probe = probePlayableURL(testURL);
    if (probe.ok) return probe.url || testURL;
  }
  return '';
}

function refreshPlayURL(dramaId, episodeSid, qualityCode) {
  try {
    const result = apiPlayOnceWithRetry(dramaId, episodeSid, qualityCode, 3);
    return result && result.url ? result.url : '';
  } catch (error) {
    return '';
  }
}

function apiPlayOnceWithRetry(dramaId, episodeSid, qualityCode, attempts) {
  let lastError = null;
  for (let attempt = 0; attempt < Math.max(1, attempts || 1); attempt += 1) {
    try {
      const result = apiPlayOnce(dramaId, episodeSid, qualityCode);
      if (result && result.url) return result;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

function probePlayableURL(url) {
  const headers = playbackHeaders();
  headers.Range = 'bytes=0-0';
  try {
    if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
      const response = Widget.http.get(url, { headers, timeout: 5 });
      const status = Number(response && (response.status || response.statusCode || response.code));
      return {
        ok: status === 200 || status === 206,
        status,
        url: stringValue(response && (response.url || response.finalUrl || response.finalURL)) || url
      };
    }
    if (typeof $http !== 'undefined' && typeof $http.get === 'function') {
      const response = $http.get(url, { headers, timeout: 5 });
      const status = Number(response && (response.status || response.statusCode || response.code));
      return {
        ok: status === 200 || status === 206,
        status,
        url: stringValue(response && (response.url || response.finalUrl || response.finalURL)) || url
      };
    }
    if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
      const response = $fetch.get(url, { headers, timeout: 5 });
      const status = Number(response && (response.status || response.statusCode || response.code));
      return {
        ok: status === 200 || status === 206,
        status,
        url: stringValue(response && (response.url || response.finalUrl || response.finalURL)) || url
      };
    }
    if (typeof require === 'function') {
      const childProcess = require('child_process');
      const args = ['-L', '-sS', '--max-time', '5', '-o', '/dev/null', '-w', '%{http_code} %{url_effective}'];
      Object.keys(headers).forEach(function (key) {
        args.push('-H', key + ': ' + headers[key]);
      });
      args.push(url);
      const output = childProcess.execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 1024 * 256 }).trim();
      const match = /^(\d{3})\s+(.+)$/.exec(output);
      const status = match ? Number(match[1]) : 0;
      return { ok: status === 200 || status === 206, status, url: match ? match[2] : url };
    }
  } catch (error) {
    return { ok: false, status: 0, url };
  }
  return { ok: true, status: 0, url };
}

function apiGet(path, params, token) {
  const url = RRMJA_API_BASE + path;
  const query = sortedQueryString(params);
  const headers = signedHeaders('GET', url, params, token || '');
  const response = httpGet(url + '?' + query, headers, 15);
  const text = responseText(response).trim();
  const decrypted = decryptAPI(text);
  const data = parseJSON(decrypted);
  if (data && data.code && Number(data.code) !== 0 && Number(data.code) !== 200) {
    throw new Error((data.msg || data.message || '人人美剧 API 返回错误') + ' (' + data.code + ')');
  }
  return data;
}

function signedHeaders(method, url, params, token) {
  const device = deviceId();
  const pathname = pathFromURL(url);
  const query = sortedQueryString(params);
  const nowMs = String(Date.now());
  const signText =
    method.toUpperCase() +
    '\naliId:' +
    device +
    '\nct:web_pc\ncv:1.0.0\nt:' +
    nowMs +
    '\n' +
    pathname +
    '?' +
    query;
  const xCaSign = hmacSha256Base64(signText, RRMJA_SIGN_SECRET);
  return {
    Host: 'api.rrmj.plus',
    Origin: RRMJA_PLAYER_SITE + '/',
    Referer: RRMJA_PLAYER_SITE + '/',
    clientType: 'web_pc',
    clientVersion: '1.0.0',
    aliId: device,
    deviceId: device,
    umid: device,
    ct: 'web_pc',
    cv: '1.0.0',
    t: nowMs,
    uet: '9',
    'x-ca-sign': xCaSign,
    token: token || '',
    'User-Agent': 'Mozilla/5.0',
    Accept: 'application/json',
    Connection: 'keep-alive'
  };
}

function bestDramaMatch(detail, list) {
  const candidates = list || [];
  if (!candidates.length) return null;
  const target = titleMatchProfile(detail.title, detail.year);
  let best = null;
  let bestScore = -1;
  candidates.forEach(function (item) {
    const names = [item.title, item.name, item.originalName, item.enName].filter(Boolean);
    let score = 0;
    names.forEach(function (name) {
      score = Math.max(score, scoreDramaName(target, titleMatchProfile(name, item.year)));
    });
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  });
  return bestScore >= 90 ? best : null;
}

function apiSearchKeyword(title) {
  const profile = titleMatchProfile(title);
  return profile.seasonNumber && profile.baseTitle ? profile.baseTitle : cleanText(title).replace(/\s+/g, ' ').trim();
}

function apiEpisodeForTarget(apiInfo, target) {
  const pageData = apiInfo && apiInfo.pageData;
  const list = (pageData && pageData.episodeList) || [];
  const epNo = numberValue(target && (target.episodeNumber || target.index), 1);
  const exact = list.filter(function (episode) {
    return Number(episode.episodeNo) === epNo;
  })[0];
  if (exact) return exact;
  const hasNumberedEpisodes = list.some(function (episode) {
    return isFinite(Number(episode.episodeNo)) && Number(episode.episodeNo) > 0;
  });
  if (!hasNumberedEpisodes && list[epNo - 1]) return list[epNo - 1];
  if (epNo === 1 && list.length === 1) return list[0];
  return null;
}

function apiQualities(apiInfo) {
  const pageData = apiInfo && apiInfo.pageData;
  const items = (pageData && pageData.watchInfo && pageData.watchInfo.sortedItems) || [];
  if (items.length) return items;
  return [{ qualityCode: 'HD', title: '高清' }];
}

function qualityDisplayName(quality, fallback) {
  const code = stringValue(quality && (quality.qualityCode || quality.code) || fallback || 'HD');
  const label = stringValue(quality && (quality.name || quality.title || quality.qualityName || quality.currentQuality));
  if (label && label !== code) return code + ' (' + label + ')';
  const map = { AI4K: 'AI4K', AI_OD: '超清', HD: '高清', SD: '标清' };
  return map[code] || code || '播放';
}

function playback(url, raw) {
  const container = inferContainer(url) || 'mp4';
  return {
    url,
    container,
    format: container,
    headers: raw && raw.headers ? raw.headers : playbackHeaders(),
    isLive: false,
    streamKind: 'vod',
    quality: raw && raw.quality
  };
}

function fetchText(base, pathOrURL, referer) {
  const baseURL = normalizeSite(base);
  const url = absoluteURL(pathOrURL || '/', baseURL);
  const response = httpGet(url, pageHeaders(referer || baseURL + '/'), 15);
  return responseText(response);
}

function httpGet(url, headers, timeoutSeconds) {
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
    return childProcess.execFileSync('curl', args, {
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 16
    });
  }
  throw new Error('当前环境没有可用的 HTTP GET 能力');
}

function responseText(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result.data === 'string') return result.data;
  if (result && result.data != null) return typeof result.data === 'object' ? JSON.stringify(result.data) : String(result.data);
  return String(result || '');
}

function pageHeaders(referer) {
  return {
    'User-Agent': RRMJA_UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: referer || RRMJA_DEFAULT_BASE + '/',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  };
}

function imageHeaders(referer) {
  return {
    'User-Agent': RRMJA_UA,
    Referer: absoluteURL(referer || '/', RRMJA_DEFAULT_BASE)
  };
}

function playbackHeaders() {
  return {
    'User-Agent': RRMJA_PC_UA,
    Accept: '*/*',
    Referer: RRMJA_PLAYER_SITE + '/'
  };
}

function sourcePlaybackHeaders(url) {
  const headers = {
    'User-Agent': RRMJA_PC_UA,
    Accept: '*/*',
    Referer: RRMJA_DEFAULT_BASE + '/'
  };
  const host = hostFromURL(url);
  if (/rrmj|rrsp/i.test(host)) headers.Referer = RRMJA_PLAYER_SITE + '/';
  return headers;
}

function decryptAPI(value) {
  if (!value) return '';
  if (typeof $crypto !== 'undefined' && $crypto.aesDecryptBase64) {
    return String($crypto.aesDecryptBase64(value, RRMJA_AES_KEY, { mode: 'ECB', keyEncoding: 'utf8', outputEncoding: 'utf8' }));
  }
  if (typeof Widget !== 'undefined' && Widget.crypto && Widget.crypto.aesDecryptBase64) {
    return String(Widget.crypto.aesDecryptBase64(value, RRMJA_AES_KEY, { mode: 'ECB', keyEncoding: 'utf8', outputEncoding: 'utf8' }));
  }
  if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
    const key = CryptoJS.enc.Utf8.parse(RRMJA_AES_KEY);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(value) }, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  if (typeof require === 'function') {
    const crypto = require('crypto');
    const decipher = crypto.createDecipheriv('aes-128-ecb', Buffer.from(RRMJA_AES_KEY, 'utf8'), null);
    decipher.setAutoPadding(true);
    return Buffer.concat([decipher.update(Buffer.from(value, 'base64')), decipher.final()]).toString('utf8');
  }
  throw new Error('当前小程序环境缺少 AES 解密能力');
}

function decryptPlayURL(value, newSign) {
  const key = stringValue(newSign).substring(4, 20);
  if (!key) return '';
  if (typeof $crypto !== 'undefined' && $crypto.aesDecryptBase64) {
    return String($crypto.aesDecryptBase64(value, key, { iv: RRMJA_PLAY_IV, mode: 'CBC', keyEncoding: 'utf8', outputEncoding: 'utf8' }));
  }
  if (typeof Widget !== 'undefined' && Widget.crypto && Widget.crypto.aesDecryptBase64) {
    return String(Widget.crypto.aesDecryptBase64(value, key, { iv: RRMJA_PLAY_IV, mode: 'CBC', keyEncoding: 'utf8', outputEncoding: 'utf8' }));
  }
  if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
    const parsedKey = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Utf8.parse(RRMJA_PLAY_IV);
    const decrypted = CryptoJS.AES.decrypt(value, parsedKey, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  if (typeof require === 'function') {
    const crypto = require('crypto');
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(key, 'utf8'), Buffer.from(RRMJA_PLAY_IV, 'utf8'));
    decipher.setAutoPadding(true);
    return Buffer.concat([decipher.update(Buffer.from(value, 'base64')), decipher.final()]).toString('utf8');
  }
  throw new Error('当前小程序环境缺少 AES 解密能力');
}

function sortedQueryString(params) {
  return Object.keys(params || {})
    .sort()
    .map(function (key) {
      let value = params[key];
      if (typeof value === 'boolean') value = value ? 'true' : 'false';
      if (value == null) value = '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(String(value));
    })
    .join('&');
}

function hmacSha256Base64(message, secret) {
  if (typeof CryptoJS !== 'undefined' && CryptoJS.HmacSHA256) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, secret));
  }
  if (typeof require === 'function') {
    return require('crypto').createHmac('sha256', secret).update(message).digest('base64');
  }
  const blockSize = 64;
  let key = utf8Bytes(secret);
  if (key.length > blockSize) key = sha256Bytes(key);
  while (key.length < blockSize) key.push(0);
  const oKey = [];
  const iKey = [];
  for (let i = 0; i < blockSize; i += 1) {
    oKey[i] = key[i] ^ 0x5c;
    iKey[i] = key[i] ^ 0x36;
  }
  return base64Bytes(sha256Bytes(oKey.concat(sha256Bytes(iKey.concat(utf8Bytes(message))))));
}

function sha256Bytes(bytes) {
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const msg = bytes.slice();
  const bitLen = msg.length * 8;
  msg.push(0x80);
  while ((msg.length % 64) !== 56) msg.push(0);
  const high = Math.floor(bitLen / 0x100000000);
  const low = bitLen >>> 0;
  msg.push((high >>> 24) & 255, (high >>> 16) & 255, (high >>> 8) & 255, high & 255);
  msg.push((low >>> 24) & 255, (low >>> 16) & 255, (low >>> 8) & 255, low & 255);

  for (let offset = 0; offset < msg.length; offset += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i += 1) {
      const j = offset + i * 4;
      w[i] = ((msg[j] << 24) | (msg[j + 1] << 16) | (msg[j + 2] << 8) | msg[j + 3]) >>> 0;
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = add32(w[i - 16], s0, w[i - 7], s1);
    }
    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];
    let f = h[5];
    let g = h[6];
    let hh = h[7];
    for (let i = 0; i < 64; i += 1) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = add32(hh, s1, ch, k[i], w[i]);
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = add32(s0, maj);
      hh = g;
      g = f;
      f = e;
      e = add32(d, temp1);
      d = c;
      c = b;
      b = a;
      a = add32(temp1, temp2);
    }
    h[0] = add32(h[0], a);
    h[1] = add32(h[1], b);
    h[2] = add32(h[2], c);
    h[3] = add32(h[3], d);
    h[4] = add32(h[4], e);
    h[5] = add32(h[5], f);
    h[6] = add32(h[6], g);
    h[7] = add32(h[7], hh);
  }
  const out = [];
  h.forEach(function (word) {
    out.push((word >>> 24) & 255, (word >>> 16) & 255, (word >>> 8) & 255, word & 255);
  });
  return out;
}

function add32() {
  let sum = 0;
  for (let i = 0; i < arguments.length; i += 1) sum = (sum + (arguments[i] >>> 0)) >>> 0;
  return sum >>> 0;
}

function rotr(value, bits) {
  return (value >>> bits) | (value << (32 - bits));
}

function utf8Bytes(value) {
  const text = String(value);
  const bytes = [];
  for (let i = 0; i < text.length; i += 1) {
    let code = text.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(++i);
      code = 0x10000 + (((code & 0x3ff) << 10) | (next & 0x3ff));
      bytes.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return bytes;
}

function base64Bytes(bytes) {
  const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triplet = (b1 << 16) | (b2 << 8) | b3;
    out += table[(triplet >> 18) & 63] + table[(triplet >> 12) & 63];
    out += i + 1 < bytes.length ? table[(triplet >> 6) & 63] : '=';
    out += i + 2 < bytes.length ? table[triplet & 63] : '=';
  }
  return out;
}

function cacheGet(key) {
  try {
    if (typeof Widget !== 'undefined' && Widget.storage && Widget.storage.get) {
      const value = Widget.storage.get(key);
      if (!value) return null;
      return typeof value === 'string' ? JSON.parse(value) : value;
    }
  } catch (error) {}
  if (typeof globalThis !== 'undefined') {
    globalThis.__rrmjaCache = globalThis.__rrmjaCache || {};
    return globalThis.__rrmjaCache[key] || null;
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
    globalThis.__rrmjaCache = globalThis.__rrmjaCache || {};
    globalThis.__rrmjaCache[key] = value;
  }
}

function cacheDetail(detail) {
  if (detail && detail.id) cacheSet('rrmja.detail.' + detail.id, detail);
}

function getCachedDetail(itemId) {
  return cacheGet('rrmja.detail.' + normalizeItemId(itemId));
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
  let site = stringValue(value || RRMJA_DEFAULT_BASE).trim();
  if (!site) site = RRMJA_DEFAULT_BASE;
  if (!/^https?:\/\//i.test(site)) site = 'https://' + site;
  return site.replace(/\/+$/, '');
}

function deviceId() {
  if (typeof Widget !== 'undefined' && Widget.storage && Widget.storage.get && Widget.storage.set) {
    let value = Widget.storage.get('rrmja.deviceId');
    if (!value) {
      value = uuid().toUpperCase();
      Widget.storage.set('rrmja.deviceId', value);
    }
    return String(value);
  }
  return RRMJA_FALLBACK_DEVICE_ID.toUpperCase();
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) {
    const r = Math.floor(Math.random() * 16);
    const v = ch === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function parsePageId(value) {
  const raw = stringValue(value || '').replace(/^category:/, '').replace(/^path:/, '');
  const path = raw && raw.charAt(0) === '/' ? raw : '/vodtype/2.html';
  const channel = RRMJA_CHANNELS.filter(function (entry) {
    return entry.path === path;
  })[0];
  return {
    id: 'path:' + path,
    path,
    page: pageFromPath(path),
    title: channel && channel.title,
    mediaType: channel && channel.mediaType
  };
}

function pagePath(path, page) {
  const current = stringValue(path || '/vodtype/2.html');
  const num = Math.max(1, numberValue(page, 1));
  if (num <= 1) return current;
  let match = /^\/vodtype\/(\d+)(?:-\d+)?\.html$/i.exec(current);
  if (match) return '/vodtype/' + match[1] + '-' + num + '.html';
  match = /^\/vodshow\/(\d+)-([\s\S]*?)\.html$/i.exec(current);
  if (match) {
    const body = match[2];
    const parts = body.split('-');
    while (parts.length < 9) parts.push('');
    parts[8] = String(num);
    return '/vodshow/' + match[1] + '-' + parts.join('-') + '.html';
  }
  return current;
}

function pageFromPath(path) {
  const match = /-(\d+)\.html$/.exec(stringValue(path));
  return match ? Number(match[1]) : 1;
}

function hasNextPage(html, page) {
  const next = '第' + (numberValue(page, 1) + 1) + '页';
  return html.indexOf(next) >= 0 || /title=["']下一页["'][^>]+href=["'][^"']+["']/i.test(html);
}

function titleForPath(path) {
  const channel = RRMJA_CHANNELS.filter(function (entry) {
    return entry.path === path;
  })[0];
  return channel ? channel.title : WidgetMetadata.title;
}

function mediaTypeFromPath(path) {
  if (/\/vodtype\/1/.test(path)) return 'movie';
  return 'series';
}

function mediaTypeFromLabel(label, href, signal) {
  const text = [label, href, signal].join(' ');
  if (/电影|正片|HD|BD/.test(text) || /\/vodtype\/1/.test(text)) return 'movie';
  if (/剧|动漫|综艺|集|季/.test(text)) return 'series';
  return 'mixed';
}

function searchPath(query, page) {
  const encoded = encodeURIComponent(query);
  if (numberValue(page, 1) <= 1) return '/vodsearch/-------------.html?wd=' + encoded;
  return '/vodsearch/' + encoded + '----------' + numberValue(page, 1) + '---.html';
}

function emptySearch(query, page) {
  return {
    pageType: 'search',
    id: 'rrmja-search',
    title: '搜索 人人美剧',
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

function encodeVersionId(value) {
  return [
    'rrmja',
    value.itemId || '',
    value.apiDramaId || '',
    value.episodeNo || '',
    value.episodeSid || '',
    value.qualityCode || '',
    value.lineId || '',
    encodeURIComponent(value.playPath || '')
  ].join('|');
}

function decodeVersionId(value) {
  const parts = stringValue(value).split('|');
  if (parts[0] !== 'rrmja') return {};
  return {
    itemId: parts[1] || '',
    apiDramaId: parts[2] || '',
    episodeNo: parts[3] || '',
    episodeId: parts[3] || '',
    episodeSid: parts[4] || '',
    qualityCode: parts[5] || '',
    lineId: parts[6] || '',
    playPath: parts[7] ? decodeURIComponent(parts[7]) : ''
  };
}

function normalizeItemId(value) {
  const text = stringValue(value);
  const match = /\/voddetail\/(\d+)\.html/i.exec(text) || /\/vodplay\/(\d+)-/i.exec(text) || /^(\d+)$/.exec(text);
  return match ? String(match[1]) : text.replace(/^path:/, '');
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

function inferContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(stringValue(url));
  return match ? match[1].toLowerCase() : undefined;
}

function isDirectMediaURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts)(\?|#|$)/i.test(stringValue(url));
}

function hostFromURL(url) {
  const match = /^https?:\/\/([^/?#]+)/i.exec(stringValue(url));
  return match ? match[1].toLowerCase() : '';
}

function pathFromURL(url) {
  const match = /^https?:\/\/[^/]+(\/[^?#]*)/i.exec(stringValue(url));
  return match ? match[1] : '/';
}

function absoluteURL(pathOrURL, base) {
  const value = stringValue(pathOrURL).trim();
  if (!value) return normalizeSite(base) + '/';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  return normalizeSite(base) + (value.charAt(0) === '/' ? value : '/' + value);
}

function absoluteImage(value) {
  const url = stringValue(value).trim();
  if (!url || /^data:/i.test(url)) return '';
  return absoluteURL(url, RRMJA_DEFAULT_BASE);
}

function splitInfo(text) {
  return cleanText(text)
    .replace(/^[\d.]+/, '')
    .split(/\s+/)
    .map(cleanText)
    .filter(Boolean);
}

function splitList(value) {
  return unique(cleanText(value).split(/[,\s，、/]+/).filter(Boolean));
}

function titleMatchProfile(title, fallbackYear) {
  const clean = cleanText(title);
  const seasonNumber = seasonNumberFromTitle(clean);
  const explicitYear = explicitYearFromTitle(clean) || (fallbackYear ? Number(fallbackYear) : undefined);
  const withoutSeason = clean.replace(/(?:第\s*[一二三四五六七八九十百两\d]+\s*季|第\s*[一二三四五六七八九十百两\d]+\s*部|S\s*\d{1,2}|Season\s*\d{1,2})/gi, '');
  const withoutYear = withoutSeason.replace(/(^|[^\d])((?:19|20)\d{2})(?=$|[^\d])/g, '$1');
  return {
    raw: clean,
    normalized: normalizeTitle(clean),
    baseTitle: cleanText(withoutYear),
    normalizedBase: normalizeTitle(withoutYear),
    seasonNumber,
    explicitYear
  };
}

function scoreDramaName(target, candidate) {
  if (!target.normalized || !candidate.normalized) return 0;
  if (target.seasonNumber) {
    if (candidate.seasonNumber && candidate.seasonNumber !== target.seasonNumber) return 0;
    if (!candidate.seasonNumber && target.seasonNumber !== 1) return 0;
  } else if (candidate.seasonNumber && target.normalized !== candidate.normalized) {
    return 0;
  }
  if (target.explicitYear && candidate.explicitYear && target.explicitYear !== candidate.explicitYear) return 0;
  if (candidate.normalized === target.normalized) return 120;
  if (target.normalizedBase && candidate.normalizedBase && candidate.normalizedBase === target.normalizedBase) {
    let score = 102;
    if (target.seasonNumber && candidate.seasonNumber === target.seasonNumber) score += 10;
    if (target.explicitYear && candidate.explicitYear === target.explicitYear) score += 6;
    return score;
  }
  if (!target.seasonNumber && target.explicitYear && candidate.normalized === target.normalizedBase) {
    return candidate.explicitYear === target.explicitYear ? 100 : 0;
  }
  return 0;
}

function seasonNumberFromTitle(title) {
  const text = stringValue(title);
  let match = /第\s*([一二三四五六七八九十百两\d]+)\s*[季部]/.exec(text);
  if (match) return chineseNumberValue(match[1]);
  match = /\bS\s*0*(\d{1,2})\b/i.exec(text) || /\bSeason\s*0*(\d{1,2})\b/i.exec(text);
  return match ? Number(match[1]) : undefined;
}

function explicitYearFromTitle(title) {
  const match = /(?:^|[^\d])((?:19|20)\d{2})(?=$|[^\d])/.exec(stringValue(title));
  return match ? Number(match[1]) : undefined;
}

function chineseNumberValue(value) {
  const text = stringValue(value).trim();
  if (/^\d+$/.test(text)) return Number(text);
  const digits = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  if (text === '十') return 10;
  const tenIndex = text.indexOf('十');
  if (tenIndex >= 0) {
    const highText = text.slice(0, tenIndex);
    const lowText = text.slice(tenIndex + 1);
    const high = highText ? digits[highText] || 0 : 1;
    const low = lowText ? digits[lowText] || 0 : 0;
    return high * 10 + low;
  }
  if (Object.prototype.hasOwnProperty.call(digits, text)) return digits[text];
  return undefined;
}

function episodeNumberFromTitle(title, fallback) {
  const text = stringValue(title);
  const match = /第\s*0*(\d+)\s*[集期]/.exec(text) || /0*(\d+)/.exec(text);
  return match ? Number(match[1]) : fallback;
}

function scoreValue(value) {
  const num = Number(cleanText(value));
  if (!isFinite(num) || num <= 0) return undefined;
  return num;
}

function yearFrom(value) {
  const match = /(\d{4})/.exec(stringValue(value));
  if (!match) return undefined;
  const year = Number(match[1]);
  return year > 1900 && year < 2100 ? year : undefined;
}

function cleanTitle(value) {
  return cleanText(value).replace(/^《([^》]+)》[\s\S]*$/, '$1').replace(/在线观看[\s\S]*$/, '').trim();
}

function pageTitleFromHTML(html) {
  const title = cleanText(matchOne(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html)) || cleanTitle(matchOne(/<title>([\s\S]*?)<\/title>/i, html));
  return title.replace(/在线观看[\s\S]*$/, '').replace(/人人美剧[\s\S]*$/, '').trim();
}

function cleanOverview(value) {
  return stripTags(stringValue(value).replace(/<br\s*\/?>/gi, '\n'))
    .replace(/\s+/g, ' ')
    .replace(/^\s*描述[:：]\s*/g, '')
    .replace(/\s*eee\s*$/i, '')
    .trim();
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

function attr(value) {
  return htmlDecode(stringValue(value)).trim();
}

function matchOne(pattern, text, group) {
  const match = pattern.exec(stringValue(text));
  return match ? match[group || 1] || '' : '';
}

function matchAll(pattern, text) {
  const out = [];
  const source = stringValue(text);
  let match;
  const flags = pattern.flags.indexOf('g') >= 0 ? pattern.flags : pattern.flags + 'g';
  const regex = new RegExp(pattern.source, flags);
  while ((match = regex.exec(source))) {
    out.push(match.length > 1 ? match : match[0]);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return out;
}

function findById(list, id) {
  return (list || []).filter(function (entry) {
    return entry.id === id;
  })[0];
}

function normalizeTitle(value) {
  return cleanText(value).replace(/[\s：:·\-_.!！?？/\\]/g, '').toLowerCase();
}

function escapeRegExp(value) {
  return stringValue(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function parseJSON(value) {
  if (value && typeof value === 'object') return value;
  try {
    return JSON.parse(String(value || ''));
  } catch (error) {
    throw new Error('人人美剧接口响应无法解析：' + String(value || '').slice(0, 120));
  }
}

const __rrmjaExports = {
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
  module.exports = __rrmjaExports;
}

if (typeof globalThis !== 'undefined') {
  Object.keys(__rrmjaExports).forEach(function (key) {
    globalThis[key] = __rrmjaExports[key];
  });
}
