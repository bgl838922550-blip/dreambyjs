// @name YouTube

// Behavior references: FreeTube, NewPipe/NewPipeExtractor, SmartTube, YouTube.js and yt-dlp.
// The script only adapts YouTube data and streams. baiPlay still chooses the playback strategy.

const YT_SITE = 'https://www.youtube.com';
const YT_ICON = 'https://www.youtube.com/s/desktop/28b0985e/img/favicon_144x144.png';
const YT_API_KEY_FALLBACK = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
const YT_WEB_VERSION_FALLBACK = '2.20260727.01.00';
const YT_TV_VERSION = '7.20260707.07.00';
const YT_TV_DOWNGRADED_VERSION = '5.20260707';
const YT_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
const YT_TV_UA = 'Mozilla/5.0 (ChromiumStylePlatform) Cobalt/25.lts.30.1034943-gold (unlike Gecko), Unknown_TV_Unknown_0/Unknown (Unknown, Unknown)';
const YT_BOTGUARD_API_KEY = 'AIzaSyDyT5W0Jh49F30Pqqtyfdf7pDLFKLJoAnw';
const YT_BOTGUARD_REQUEST_KEY = 'O43z0dpjhgX20SCx4KAo';
const YT_PLAYER_API_BASE = 'https://youtubei.googleapis.com';
const YT_PLAYER_API_FALLBACK_BASE = YT_SITE;
const YT_TOKEN_REFRESH_LEEWAY_MS = 5 * 60 * 1000;
const YT_OAUTH_SHADOW_CACHE_KEY = 'youtube.oauth.session.v1';
let activeOAuthRefresh = null;

const WidgetMetadata = {
  id: 'youtube-mini-library',
  name: 'YouTube',
  title: 'YouTube',
  version: '1.2.6',
  author: 'baiPlay',
  site: YT_SITE,
  logo: YT_ICON,
  icon: YT_ICON,
  description: '浏览 YouTube 推荐、订阅、Shorts、直播、历史、稍后观看、播放列表和频道，支持设备码登录、多清晰度 DASH/HLS、字幕与观看进度。'
};

const HOME_SECTIONS = {
  'youtube-home-recommended': {
    title: '为你推荐',
    style: 'discover.spotlight',
    pageId: 'feed:home',
    promotesToHero: true,
    auth: false
  },
  'youtube-home-continue': {
    title: '继续观看',
    style: 'discover.standard',
    pageId: 'feed:continue',
    auth: true
  },
  'youtube-home-subscriptions': {
    title: '订阅更新',
    style: 'discover.standard',
    pageId: 'feed:subscriptions',
    auth: true
  },
  'youtube-home-live': {
    title: '正在直播',
    style: 'discover.standard',
    pageId: 'destination:live',
    auth: false
  },
  'youtube-home-shorts': {
    title: 'Shorts',
    style: 'discover.posterCompact',
    pageId: 'search:#Shorts',
    auth: false
  },
  'youtube-home-watchlater': {
    title: '稍后观看',
    style: 'discover.posterCompact',
    pageId: 'playlist:WL',
    auth: true
  },
  'youtube-home-playlists': {
    title: '我的播放列表',
    style: 'discover.annualWidePreview',
    pageId: 'feed:playlists',
    auth: true,
    previews: true
  },
  'youtube-home-channels': {
    title: '订阅的频道',
    style: 'discover.annualListPreview',
    pageId: 'feed:channels',
    auth: true,
    previews: true
  },
  'youtube-home-music': {
    title: '音乐',
    style: 'discover.standard',
    pageId: 'destination:music',
    auth: false
  },
  'youtube-home-gaming': {
    title: '游戏',
    style: 'discover.standard',
    pageId: 'destination:gaming',
    auth: false
  },
  'youtube-home-news': {
    title: '新闻',
    style: 'discover.standard',
    pageId: 'destination:news',
    auth: false
  },
  'youtube-home-sports': {
    title: '体育',
    style: 'discover.standard',
    pageId: 'destination:sports',
    auth: false
  }
};

const DESTINATIONS = {
  live: { title: '直播', browseId: 'UC4R8DWoMoI7CAwX8_LjQHig', fallbackQuery: 'live' },
  music: { title: '音乐', browseId: 'UC-9-kyTW8ZkZNDHQJ6FgpwQ', fallbackQuery: 'music' },
  gaming: { title: '游戏', browseId: 'UCOpNcN46UbXVtpKMrmU4Abg', fallbackQuery: 'gaming' },
  news: { title: '新闻', browseId: 'UCYfdidRxbB8Qhf0Nx7ioOYw', fallbackQuery: 'news' },
  sports: { title: '体育', browseId: 'UCEgdi0XIXXZ-qJOFPf4JSKw', fallbackQuery: 'sports' }
};

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
      playbackHistory: true,
      resourceMatching: true,
      resourceMatch: {
        enabled: true,
        parameters: ['tmdbId', 'imdbId', 'title', 'year', 'mediaType', 'seasonNumber', 'episodeNumber', 'episodeTitle']
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true
    },
    authentication: {
      type: 'qrCode',
      title: '登录 YouTube',
      description: '扫描二维码打开 Google 设备授权页，并输入页面显示的授权码。',
      parameterNames: [
        'AccessToken', 'RefreshToken', 'TokenExpiresAt', 'OAuthClientId', 'OAuthClientSecret'
      ],
      startFunction: 'startAuthentication',
      pollFunction: 'pollAuthentication',
      logoutFunction: 'logoutAuthentication',
      pollIntervalSeconds: 5
    },
    parameters: [
      {
        name: 'Cookie',
        title: 'YouTube Cookie',
        type: 'password',
        value: '',
        required: false,
        description: '可选兼容方式。推荐使用上方设备码登录；手工导入时请填写登录 youtube.com 后的完整 Cookie。'
      },
      { name: 'AccessToken', title: '访问令牌', type: 'hidden', value: '', required: false },
      { name: 'RefreshToken', title: '刷新令牌', type: 'hidden', value: '', required: false },
      { name: 'TokenExpiresAt', title: '令牌到期时间', type: 'hidden', value: '', required: false },
      { name: 'OAuthClientId', title: 'OAuth Client ID', type: 'hidden', value: '', required: false },
      { name: 'OAuthClientSecret', title: 'OAuth Client Secret', type: 'hidden', value: '', required: false },
      { name: 'VisitorData', title: 'Visitor Data', type: 'hidden', value: '', required: false },
      {
        name: 'PoToken',
        title: 'YouTube PoToken',
        type: 'password',
        value: '',
        required: false,
        description: '可选手工兜底。通常留空，小程序会在 YouTube 强制校验播放请求时自动生成。'
      },
      {
        name: 'maxHeight',
        title: '最高画质',
        type: 'select',
        value: '2160',
        required: false,
        options: [
          { title: '最高可用', value: '4320' },
          { title: '4K', value: '2160' },
          { title: '1440P', value: '1440' },
          { title: '1080P', value: '1080' },
          { title: '720P', value: '720' },
          { title: '480P', value: '480' },
          { title: '360P', value: '360' }
        ]
      },
      {
        name: 'preferredCodec',
        title: '视频编码偏好',
        type: 'select',
        value: 'auto',
        required: false,
        options: [
          { title: '自动', value: 'auto' },
          { title: 'H.264 优先', value: 'h264' },
          { title: 'VP9 优先', value: 'vp9' },
          { title: 'AV1 优先', value: 'av1' }
        ]
      }
    ]
  };
}

async function startAuthentication() {
  const identity = await fetchOAuthClientIdentity();
  const body = {
    client_id: identity.clientId,
    scope: 'http://gdata.youtube.com https://www.googleapis.com/auth/youtube-paid-content',
    device_id: randomIdentifier(),
    device_model: 'ytlr::'
  };
  const data = await postOAuthJSON(YT_SITE + '/o/oauth2/device/code', body, {
    'User-Agent': YT_TV_UA,
    Referer: YT_SITE + '/tv'
  });
  if (!data || !data.device_code || !data.user_code || !data.verification_url) {
    throw new Error('YouTube 没有返回有效的设备授权码');
  }
  const token = encodeURIComponent(JSON.stringify({
    deviceCode: data.device_code,
    clientId: identity.clientId,
    clientSecret: identity.clientSecret,
    expiresAt: Date.now() + numberValue(data.expires_in, 1800) * 1000,
    interval: numberValue(data.interval, 5),
    userCode: data.user_code
  }));
  return {
    qrContent: stringValue(data.verification_url),
    token,
    userCode: stringValue(data.user_code),
    message: '打开授权页后输入代码：' + stringValue(data.user_code),
    expiresInSeconds: numberValue(data.expires_in, 1800),
    pollIntervalSeconds: Math.max(5, numberValue(data.interval, 5))
  };
}

async function pollAuthentication(ctx) {
  const state = decodeAuthenticationToken(ctx && (ctx.token || ctx.pollToken || ctx.sessionId));
  if (!state || !state.deviceCode || !state.clientId || !state.clientSecret) {
    return { status: 'failed', message: '缺少 YouTube 设备授权凭据', parameterUpdates: {} };
  }
  if (numberValue(state.expiresAt, 0) > 0 && Date.now() >= numberValue(state.expiresAt, 0)) {
    return { status: 'expired', message: '设备授权码已过期，请重新生成', parameterUpdates: {} };
  }
  const data = await postOAuthJSON(YT_SITE + '/o/oauth2/token', {
    client_id: state.clientId,
    client_secret: state.clientSecret,
    code: state.deviceCode,
    grant_type: 'http://oauth.net/grant_type/device/1.0'
  }, { 'User-Agent': YT_TV_UA });
  if (data && data.error) {
    if (data.error === 'authorization_pending' || data.error === 'slow_down') {
      return {
        status: 'pending',
        message: '等待授权，设备代码：' + stringValue(state.userCode),
        parameterUpdates: {}
      };
    }
    if (data.error === 'expired_token') {
      return { status: 'expired', message: '设备授权码已过期，请重新生成', parameterUpdates: {} };
    }
    if (data.error === 'access_denied') {
      return { status: 'cancelled', message: 'YouTube 登录授权已取消', parameterUpdates: {} };
    }
    return { status: 'failed', message: 'YouTube 登录失败：' + cleanText(data.error), parameterUpdates: {} };
  }
  if (!data || !data.access_token || !data.refresh_token) {
    return { status: 'failed', message: 'YouTube 登录结果缺少完整令牌', parameterUpdates: {} };
  }
  const parameterUpdates = {
    AccessToken: stringValue(data.access_token),
    RefreshToken: stringValue(data.refresh_token),
    TokenExpiresAt: String(Date.now() + numberValue(data.expires_in, 3600) * 1000),
    OAuthClientId: stringValue(state.clientId),
    OAuthClientSecret: stringValue(state.clientSecret)
  };
  cacheOAuthShadow(parameterUpdates);
  return {
    status: 'success',
    message: 'YouTube 登录成功',
    parameterUpdates
  };
}

function logoutAuthentication() {
  removeCache(YT_OAUTH_SHADOW_CACHE_KEY);
  return { status: 'success' };
}

function getHome() {
  const sections = Object.keys(HOME_SECTIONS).map(function (id) {
    const definition = HOME_SECTIONS[id];
    return {
      id,
      title: definition.title,
      style: definition.style,
      subtitle: definition.auth ? '登录后加载' : '',
      lazy: true,
      promotesToHero: !!definition.promotesToHero,
      loadAction: { type: 'custom', id, sectionId: id, title: definition.title },
      moreAction: categoryAction(definition.pageId, definition.title),
      items: []
    };
  });
  return {
    pageType: 'home',
    id: 'youtube-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '16:9',
    hero: [],
    sections
  };
}

async function getHomeSection(ctx) {
  ctx = ctx || {};
  const sectionId = stringValue(ctx.sectionId || ctx.id || ctx.pageId);
  const definition = HOME_SECTIONS[sectionId];
  if (!definition) return emptySection(sectionId || 'youtube-home-unknown', ctx.title || 'YouTube', ctx.style);
  try {
    const config = readConfig(ctx);
    if (definition.auth) requireLogin(config);
    let items = definition.auth
      ? await loadPageItems(definition.pageId, 1, config)
      : await loadPublicPageItems(definition.pageId, 1, config);
    if (definition.pageId === 'feed:continue') {
      items = items.filter(function (item) {
        return item.playbackProgress && numberValue(item.playbackProgress.positionSeconds, 0) > 0;
      });
    }
    if (definition.previews) items = await enrichCollectionItems(items.slice(0, 12), config, 4);
    return {
      id: sectionId,
      title: definition.title,
      style: stringValue(ctx.style) || definition.style,
      subtitle: items.length ? '' : '暂无内容',
      lazy: false,
      promotesToHero: !!definition.promotesToHero,
      moreAction: categoryAction(definition.pageId, definition.title),
      items: items.slice(0, 24)
    };
  } catch (error) {
    return emptySection(sectionId, definition.title, ctx.style || definition.style, humanError(error));
  }
}

async function getCategory(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const pageId = stringValue(ctx.pageId || ctx.categoryId || ctx.id || 'feed:home');
  const page = Math.max(1, numberValue(ctx.page, 1));
  const title = cleanText(ctx.title) || pageTitle(pageId);
  try {
    if (isPrivatePage(pageId)) requireLogin(config);
    let items = isPrivatePage(pageId)
      ? await loadPageItems(pageId, page, config)
      : await loadPublicPageItems(pageId, page, config);
    if (pageId === 'feed:playlists' || pageId === 'feed:channels') {
      items = await enrichCollectionItems(items.slice(0, 30), config, 4);
    }
    return {
      pageType: 'category',
      id: pageId,
      pageId,
      title,
      page,
      style: pageId === 'feed:playlists' ? 'discover.annualWidePreview' : 'media.posterGrid',
      itemAspectRatio: pageId === 'search:#Shorts' ? '9:16' : '16:9',
      items,
      hasMore: hasContinuation(pageId, page + 1)
    };
  } catch (error) {
    return {
      pageType: 'category', id: pageId, pageId, title, page,
      itemAspectRatio: '16:9', items: [], hasMore: false, subtitle: humanError(error)
    };
  }
}

async function search(ctx) {
  ctx = ctx || {};
  const query = cleanText(ctx.query || ctx.keyword || ctx.text);
  if (!query) return { pageType: 'search', title: '搜索 YouTube', query: '', page: 1, items: [], hasMore: false };
  const config = readConfig(ctx);
  const page = Math.max(1, numberValue(ctx.page, 1));
  try {
    const result = await fetchSearchPage(query, page, config, stringValue(ctx.params || ctx.filterParams));
    return {
      pageType: 'search',
      id: 'youtube-search:' + query,
      title: '搜索：' + query,
      query,
      page,
      itemAspectRatio: '16:9',
      items: normalizeSearchItems(result.items),
      hasMore: !!result.nextToken
    };
  } catch (error) {
    return {
      pageType: 'search', title: '搜索：' + query, query, page,
      itemAspectRatio: '16:9', items: [], hasMore: false, subtitle: humanError(error)
    };
  }
}

async function getDetail(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const initialItem = ctx.initialItem || ctx.item || {};
  const videoId = firstVideoId([
    ctx.itemId,
    ctx.id,
    ctx.url,
    ctx.href,
    ctx.providerIds,
    ctx.action,
    initialItem.providerIds,
    initialItem.action,
    initialItem.id,
    initialItem
  ]);
  if (!videoId) throw new Error('缺少 YouTube 视频 ID');
  const cachedItem = readCachedVideoItem(videoId);

  const nextPromise = fetchNext(videoId, config).catch(function () { return {}; });
  const playerPromise = requestPlayer(videoId, config).catch(function (error) {
    return { playabilityStatus: { status: 'ERROR', reason: humanError(error) } };
  });
  const results = await Promise.all([nextPromise, playerPromise]);
  const next = results[0] || {};
  const player = results[1] || {};
  const details = player.videoDetails || {};
  const microformat = player.microformat && player.microformat.playerMicroformatRenderer || {};
  const primary = findFirstRenderer(next, 'videoPrimaryInfoRenderer') || {};
  const secondary = findFirstRenderer(next, 'videoSecondaryInfoRenderer') || {};
  const structuredHeader = findFirstRenderer(next, 'videoDescriptionHeaderRenderer') || {};
  const structuredBody = findFirstRenderer(next, 'expandableVideoDescriptionBodyRenderer') || {};
  const owner = secondary.owner && secondary.owner.videoOwnerRenderer || {};
  const ownerRun = firstRun(owner.title);
  const title = cleanText(
    details.title ||
    textValue(primary.title) ||
    textValue(structuredHeader.title) ||
    ctx.title ||
    ctx.name ||
    initialItem.title ||
    initialItem.name ||
    cachedItem.title
  ) || videoId;
  const channelId = stringValue(
    details.channelId ||
    endpointBrowseId(ownerRun && ownerRun.navigationEndpoint) ||
    endpointBrowseId(structuredHeader.channelNavigationEndpoint)
  );
  const channelName = cleanText(
    details.author ||
    (ownerRun && ownerRun.text) ||
    textValue(structuredHeader.channel)
  );
  const subscriberCountText = cleanText(textValue(owner.subscriberCountText));
  const poster = bestThumbnail(details.thumbnail || microformat.thumbnail) ||
    imageURL(initialItem.poster || initialItem.backdrop) ||
    cachedItem.poster ||
    videoThumbnail(videoId, 'maxresdefault');
  const durationSeconds = numberValue(details.lengthSeconds, durationFromText(textValue(primary.lengthText)));
  const related = collectItems(next).filter(function (item) {
    return item.type === 'movie' && item.id !== videoId;
  }).slice(0, 24);
  const playerError = playabilityError(player);
  const groups = playerError ? fallbackResourceGroups(videoId, title, playerError) : resourceGroupsFromPlayer(player, videoId, title, config);
  const resumeSeconds = findResumeSeconds(next, durationSeconds) || numberValue(
    player.playbackStartConfig && player.playbackStartConfig.startSeconds,
    0
  );
  const primaryDateText = textValue(primary.dateText) || textValue(structuredHeader.publishDate);
  const isLive = isActiveLiveVideo(player, primary, microformat);
  const wasLive = !isLive && (
    !!details.isLiveContent ||
    !!microformat.liveBroadcastDetails ||
    /(?:直播|streamed|premiered)/i.test(primaryDateText)
  );
  const publishDate = normalizedPublishDate(
    microformat.publishDate || microformat.uploadDate || primaryDateText
  );
  const publishDateText = publishDate || cleanPublishDateText(primaryDateText);
  const likeCountText = likeCountFromNext(next);
  const keywords = uniqueStrings(arrayValue(details.keywords).map(cleanText).filter(Boolean));
  const badges = rendererBadgeTexts(primary).concat(rendererBadgeTexts(secondary));
  const genres = uniqueStrings([
    cleanText(microformat.category),
    isLive ? '直播' : '',
    wasLive ? '直播回放' : '',
    badges.filter(function (value) { return value === '字幕' || value === 'CC'; })[0]
  ]).filter(Boolean);

  const detail = {
    pageType: 'detail',
    id: videoId,
    type: 'movie',
    title,
    originalTitle: title,
    year: yearFromDate(publishDate),
    poster,
    backdrop: poster,
    detailImageAspectRatio: '16:9',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    overview: cleanMultilineText(
      textValue(structuredBody.attributedDescriptionBodyText) ||
      textValue(structuredBody.descriptionBodyText) ||
      details.shortDescription ||
      textValue(secondary.attributedDescription) ||
      textValue(secondary.description)
    ) || '该视频暂无简介。',
    runtimeMinutes: durationSeconds > 0 ? Math.max(1, Math.round(durationSeconds / 60)) : undefined,
    viewCountText: formatCount(details.viewCount) ||
      textValue(primary.viewCount && primary.viewCount.videoViewCountRenderer && primary.viewCount.videoViewCountRenderer.viewCount) ||
      textValue(structuredHeader.views),
    favoriteCountText: likeCountText,
    genres,
    studios: channelName ? [channelName] : [],
    tags: keywords.slice(0, 24),
    remarks: isLive ? 'LIVE' : wasLive ? '直播回放' : cleanText(microformat.category),
    facts: [
      publishDateText ? { title: isLive || wasLive ? '直播日期' : '发布日期', value: publishDateText } : null,
      subscriberCountText ? { title: '频道订阅', value: subscriberCountText } : null,
      cleanText(microformat.category) ? { title: '分类', value: cleanText(microformat.category) } : null,
      keywords.length ? { title: '标签', value: keywords.slice(0, 4).join(' / ') } : null
    ].filter(Boolean),
    sourceUrl: YT_SITE + '/watch?v=' + videoId,
    providerIds: {
      YouTubeVideoId: videoId,
      YouTubeChannelId: channelId || undefined,
      MiniLibraryPlaybackTitle: title
    },
    cast: channelName ? [{
      name: channelName,
      role: subscriberCountText ? 'UP 主 · ' + subscriberCountText : 'UP 主',
      avatar: bestThumbnail(owner.thumbnail || structuredHeader.channelThumbnail),
      avatarHeaders: imageHeaders(),
      action: channelId ? categoryAction('channel:' + channelId, channelName) : undefined
    }] : [],
    resourceGroups: groups,
    recommendations: [{
      id: 'youtube-related:' + videoId,
      title: '接下来观看',
      style: 'discover.standard',
      items: related
    }]
  };
  if (resumeSeconds > 0) {
    detail.playbackProgress = {
      itemId: videoId,
      positionSeconds: resumeSeconds,
      durationSeconds: durationSeconds || undefined,
      completed: false
    };
    detail.playbackProgressAuthoritative = true;
  }
  return detail;
}

async function getResourceVersions(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const payload = decodePlaybackPayload(ctx.url || ctx.playUrl || ctx.href);
  const videoId = firstVideoId([
    payload.videoId,
    ctx.itemId,
    ctx.id,
    ctx.url,
    ctx.href,
    ctx.providerIds,
    ctx.initialItem,
    ctx.item
  ]);
  if (!videoId) return { itemId: '', groups: [] };
  const title = cleanText(payload.title || ctx.title) || videoId;
  try {
    const player = await requestPlayer(videoId, config);
    const error = playabilityError(player);
    if (error) return { itemId: videoId, groups: fallbackResourceGroups(videoId, title, error) };
    return { itemId: videoId, groups: resourceGroupsFromPlayer(player, videoId, title, config) };
  } catch (error) {
    if (isLoginError(error)) throw error;
    return { itemId: videoId, groups: fallbackResourceGroups(videoId, title, humanError(error)) };
  }
}

async function resolvePlayback(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const payload = decodePlaybackPayload(ctx.url || ctx.playUrl || ctx.href);
  const videoId = firstVideoId([
    payload.videoId,
    ctx.itemId,
    ctx.id,
    ctx.url,
    ctx.href,
    ctx.providerIds,
    ctx.initialItem,
    ctx.item
  ]);
  if (!videoId) throw new Error('播放参数缺少 YouTube 视频 ID');
  const refreshPlayback = truthyValue(ctx.refreshPlayback || ctx.forceRefreshPlayback || ctx.retryPlayback);
  const shouldProbeMedia = refreshPlayback || truthyValue(ctx.probeOnly || ctx.statusProbe);
  let player;
  try {
    player = await requestPlayer(
      videoId,
      config,
      payload.clientName,
      payload.clientProfile,
      refreshPlayback
    );
  } catch (error) {
    if (isLoginError(error) || !canUseBrowserPlaybackFallback(config)) throw error;
    return resolveWithBrowser(videoId, config, humanError(error));
  }
  const error = playabilityError(player);
  if (error) {
    if (stringValue(player.playabilityStatus && player.playabilityStatus.status) === 'LOGIN_REQUIRED' && hasLogin(config)) {
      throw loginError('YouTube 没有接受当前账号的播放授权，请重新登录后再试');
    }
    if (!canUseBrowserPlaybackFallback(config)) throw new Error(error);
    return resolveWithBrowser(videoId, config, error);
  }
  const selectedMediaAvailable = playerExposesRequestedMedia(player, payload, config);
  if (shouldProbeMedia || !selectedMediaAvailable) {
    try {
      player = await ensureReachablePlayerMedia(videoId, config, payload, player);
    } catch (mediaError) {
      if (numberValue(payload.itag, 0) || !canUseBrowserPlaybackFallback(config)) throw mediaError;
      return resolveWithBrowser(videoId, config, humanError(mediaError));
    }
  }
  cachePlaybackTracking(videoId, player);

  const streaming = player.streamingData || {};
  const playbackConfig = mediaConfigForPlayer(config, player);
  const subtitles = subtitlesFromPlayer(player, playbackConfig);
  const mediaHeader = mediaHeadersForPlayer(player);
  if (streaming.hlsManifestUrl && (player.__baiPlaySelectedMediaMode === 'hls' ||
      !numberValue(payload.itag, 0) && (payload.mode === 'hls' || isPlayerLive(player) || !hasPlayableDirectPlayerMedia(player)))) {
    const hlsSelection = numberValue(payload.itag, 0)
      ? player.__baiPlaySelectedHLSVariant || await selectHLSVariantFromPlayer(player, payload, config)
      : null;
    if (numberValue(payload.itag, 0) && !hlsSelection) {
      throw new Error('所选 YouTube 画质已不可用，请返回详情页刷新画质列表后重新选择');
    }
    return {
      url: hlsSelection && hlsSelection.url || mediaURL(streaming.hlsManifestUrl, playbackConfig),
      container: 'm3u8',
      playlistText: hlsSelection && hlsSelection.playlistText || undefined,
      playlistBaseURL: hlsSelection && hlsSelection.masterURL || undefined,
      headers: mediaHeader,
      subtitles,
      isLive: isPlayerLive(player),
      streamKind: isPlayerLive(player) ? 'live' : 'vod'
    };
  }

  const formats = allFormats(player);
  const selectedVideo = selectVideoFormat(formats, payload, config);
  const progressive = selectProgressiveFormat(formats, payload, config);
  if (numberValue(payload.itag, 0) && !selectedVideo) {
    throw new Error('所选 YouTube 画质已不可用，请返回详情页刷新画质列表后重新选择');
  }
  if (selectedVideo && directFormatURL(selectedVideo)) {
    const audioTracks = selectAudioFormats(formats).map(function (format) {
      return dashDescriptor(format, false, numberValue(player.videoDetails && player.videoDetails.lengthSeconds, 0), playbackConfig);
    }).filter(validDashDescriptor);
    const videoTrack = dashDescriptor(
      selectedVideo,
      true,
      numberValue(player.videoDetails && player.videoDetails.lengthSeconds, 0),
      playbackConfig
    );
    if (validDashDescriptor(videoTrack) && audioTracks.length) {
      return {
        url: numberValue(payload.itag, 0) ? '' : progressive ? mediaURL(directFormatURL(progressive), playbackConfig) : '',
        container: 'm3u8',
        headers: mediaHeader,
        subtitles,
        isLive: false,
        streamKind: 'vod',
        dash: {
          durationSeconds: numberValue(player.videoDetails && player.videoDetails.lengthSeconds, 0),
          videoTracks: [videoTrack],
          audioTracks
        }
      };
    }
  }
  if (progressive && directFormatURL(progressive)) {
    return {
      url: mediaURL(directFormatURL(progressive), playbackConfig),
      container: containerFromMime(progressive.mimeType),
      headers: mediaHeader,
      subtitles,
      isLive: false,
      streamKind: 'vod'
    };
  }
  if (!canUseBrowserPlaybackFallback(config)) {
    throw new Error('YouTube 没有返回可直接使用的媒体地址');
  }
  return resolveWithBrowser(videoId, config, 'YouTube 没有返回可直接使用的媒体地址');
}

async function getPlaybackProgress(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const videoId = videoIdFrom(ctx.itemId || ctx.id || ctx.url);
  if (!videoId) return { positionSeconds: 0, completed: false };
  try {
    const next = await fetchNext(videoId, config);
    const duration = numberValue(ctx.durationSeconds, 0);
    return {
      itemId: videoId,
      positionSeconds: findResumeSeconds(next, duration),
      durationSeconds: duration || undefined,
      completed: false
    };
  } catch (_) {
    return { itemId: videoId, positionSeconds: 0, completed: false };
  }
}

async function reportPlaybackProgress(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  if (!hasLogin(config)) return { ok: true, skipped: true };
  const videoId = videoIdFrom(ctx.itemId || ctx.id || ctx.url);
  const position = Math.max(0, numberValue(ctx.positionSeconds, 0));
  if (!videoId) return { ok: true, skipped: true };
  try {
    let tracking = readPlaybackTracking(videoId);
    if (!tracking || !tracking.watchtimeURL) {
      const player = await requestPlayer(videoId, config);
      tracking = cachePlaybackTracking(videoId, player);
    }
    if (!tracking || !tracking.watchtimeURL) return { ok: true, skipped: true };
    if (!tracking.started && tracking.playbackURL) {
      await rawGET(appendURLParameters(normalizeStatsURL(tracking.playbackURL), {
        cpn: tracking.cpn, fmt: 251, rtn: 0, rt: 0
      }), statsHeaders(config), 10);
      tracking.started = true;
      writeCache(playbackTrackingKey(videoId), JSON.stringify(tracking));
    }
    await rawGET(appendURLParameters(normalizeStatsURL(tracking.watchtimeURL), {
      cpn: tracking.cpn,
      st: position.toFixed(3),
      et: position.toFixed(3),
      cmt: position.toFixed(3),
      final: '1'
    }), statsHeaders(config), 10);
    return { ok: true };
  } catch (_) {
    return { ok: false };
  }
}

async function matchResources(ctx) {
  ctx = ctx || {};
  const title = cleanText(ctx.title || ctx.name || ctx.originalTitle);
  if (!title) return { results: [] };
  const mediaType = stringValue(ctx.mediaType || ctx.type).toLowerCase();
  const season = numberValue(ctx.seasonNumber || ctx.season, 0);
  const episode = numberValue(ctx.episodeNumber || ctx.episode, 0);
  const queries = [title];
  if (episode > 0) {
    queries.unshift(title + ' S' + pad2(season || 1) + 'E' + pad2(episode));
    queries.push(title + ' 第' + episode + '集');
  } else if (mediaType === 'movie') {
    queries.unshift(title + ' full movie');
  }
  const config = readConfig(ctx);
  const batches = await Promise.all(queries.slice(0, 3).map(function (query) {
    return fetchSearchPage(query, 1, config, 'EgIQAQ%3D%3D').then(function (result) {
      return result.items;
    }).catch(function () { return []; });
  }));
  const excluded = /(?:预告|花絮|片段|解说|reaction|review|recap|trailer|clip|teaser|behind\s+the\s+scenes)/i;
  const results = uniqueItems([].concat.apply([], batches)).filter(function (item) {
    if (item.type !== 'movie' || excluded.test(item.title)) return false;
    if (mediaType === 'movie') return numberValue(item.durationSeconds, 0) >= 20 * 60;
    return episode <= 0 || titleSimilarity(item.title, title) >= 45;
  }).map(function (item) {
    const score = titleSimilarity(item.title, title);
    item.matchScore = score;
    item.provider = 'YouTube';
    return item;
  }).sort(function (left, right) {
    return numberValue(right.matchScore, 0) - numberValue(left.matchScore, 0);
  }).slice(0, 8);
  return { results };
}

function matchMovie(ctx) {
  return matchResources(Object.assign({}, ctx || {}, { mediaType: 'movie' }));
}

function matchEpisode(ctx) {
  return matchResources(Object.assign({}, ctx || {}, { mediaType: 'tv' }));
}

async function loadPageItems(pageId, page, config) {
  if (pageId === 'feed:home') {
    const browseId = config && config.accessToken ? 'default' : 'FEwhat_to_watch';
    const result = await fetchBrowsePage(browseId, '', page, config, pageId);
    if (result.items.length) return result.items;
    return (await fetchSearchPage('trending', page, anonymousConfig(config), 'EgIQAQ%3D%3D')).items;
  }
  if (pageId === 'feed:continue') {
    const result = await fetchBrowsePage('FEhistory', '', page, config, pageId);
    return result.items;
  }
  if (pageId === 'feed:subscriptions') {
    return (await fetchBrowsePage('FEsubscriptions', '', page, config, pageId)).items;
  }
  if (pageId === 'feed:history') {
    return (await fetchBrowsePage('FEhistory', '', page, config, pageId)).items;
  }
  if (pageId === 'feed:playlists') {
    const result = await fetchBrowsePage('FElibrary', 'KgN5b3U%3D', page, config, pageId);
    const playlists = result.items.filter(function (item) { return item.type === 'collection'; });
    return playlists.length ? playlists : result.items;
  }
  if (pageId === 'feed:channels') return fetchSubscribedChannels(page, config);
  if (pageId.indexOf('destination:') === 0) {
    const key = pageId.slice('destination:'.length);
    const destination = DESTINATIONS[key];
    if (!destination) return [];
    const result = await fetchBrowsePage(destination.browseId, '', page, config, pageId);
    if (result.items.length) return result.items;
    return (await fetchSearchPage(destination.fallbackQuery, page, anonymousConfig(config), 'EgIQAQ%3D%3D')).items;
  }
  if (pageId.indexOf('playlist:') === 0) {
    const playlistId = pageId.slice('playlist:'.length);
    return (await fetchBrowsePage(playlistBrowseId(playlistId), '', page, config, pageId)).items.filter(function (item) {
      return item.type === 'movie';
    });
  }
  if (pageId.indexOf('channel:') === 0) {
    const channelId = pageId.slice('channel:'.length);
    return fetchChannelVideos(channelId, page, config, pageId);
  }
  if (pageId.indexOf('browse:') === 0) {
    const value = pageId.slice('browse:'.length).split('|');
    return (await fetchBrowsePage(value[0], value[1] || '', page, config, pageId)).items;
  }
  if (pageId.indexOf('search:') === 0) {
    const query = decodeURIComponent(pageId.slice('search:'.length));
    return (await fetchSearchPage(query, page, config, '')).items;
  }
  return [];
}

async function loadPublicPageItems(pageId, page, config) {
  if (hasLogin(config)) {
    try {
      const signedItems = await loadPageItems(pageId, page, config);
      if (signedItems.length) return signedItems;
    } catch (_) {}
  }
  return loadPageItems(pageId, page, anonymousConfig(config));
}

function anonymousConfig(config) {
  return Object.assign({}, config || {}, {
    cookie: '',
    accessToken: '',
    refreshToken: '',
    tokenExpiresAt: 0,
    oauthClientId: '',
    oauthClientSecret: '',
    streamingPoToken: ''
  });
}

async function fetchBrowsePage(browseId, params, page, config, cacheId) {
  const key = 'browse:' + (cacheId || browseId) + ':' + stringValue(params) + ':' + authenticationMode(config);
  const result = await fetchPagedInnertube('browse', {
    browseId,
    params: params ? decodeURIComponent(params) : undefined
  }, page, config, key);
  return { response: result.response, items: collectItems(result.response), nextToken: result.nextToken };
}

async function fetchSearchPage(query, page, config, params) {
  const key = 'search:' + query + ':' + stringValue(params) + ':' + authenticationMode(config);
  const result = await fetchPagedInnertube('search', {
    query,
    params: params ? decodeURIComponent(params) : undefined
  }, page, config, key);
  return { response: result.response, items: collectItems(result.response), nextToken: result.nextToken };
}

async function fetchPagedInnertube(endpoint, initialPayload, page, config, cacheId) {
  const targetPage = Math.max(1, numberValue(page, 1));
  let token = targetPage > 1 ? readContinuation(cacheId, targetPage) : '';
  if (targetPage > 1 && !token) {
    let previousResponse = await innertube(endpoint, initialPayload, config);
    let previousToken = findContinuationToken(previousResponse);
    writeContinuation(cacheId, 2, previousToken);
    for (let current = 2; current < targetPage && previousToken; current += 1) {
      previousResponse = await innertube(endpoint, { continuation: previousToken }, config);
      previousToken = findContinuationToken(previousResponse);
      writeContinuation(cacheId, current + 1, previousToken);
    }
    token = previousToken;
  }
  const response = targetPage === 1
    ? await innertube(endpoint, initialPayload, config)
    : token
      ? await innertube(endpoint, { continuation: token }, config)
      : {};
  const nextToken = findContinuationToken(response);
  writeContinuation(cacheId, targetPage + 1, nextToken);
  return { response, nextToken };
}

async function fetchChannelVideos(channelId, page, config, cacheId) {
  if (page > 1) {
    return (await fetchBrowsePage(channelId, readCache(channelTabKey(channelId)) || '', page, config, cacheId)).items;
  }
  const first = await innertube('browse', { browseId: channelId }, config);
  const tab = findChannelVideosTab(first);
  if (tab && tab.params) {
    writeCache(channelTabKey(channelId), tab.params);
    return (await fetchBrowsePage(channelId, tab.params, 1, config, cacheId)).items.filter(function (item) {
      return item.type === 'movie';
    });
  }
  return collectItems(first).filter(function (item) { return item.type === 'movie'; });
}

async function fetchSubscribedChannels(page, config) {
  try {
    const result = await fetchBrowsePage('FEchannels', '', page, config, 'feed:channels');
    const channels = result.items.filter(function (item) { return item.type === 'channel'; });
    if (channels.length) return channels;
  } catch (_) {}
  if (page > 1) return [];
  const guide = await innertube('guide', {}, config);
  const sections = findRenderers(guide, 'guideSectionRenderer');
  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index] || {};
    const title = textValue(section.formattedTitle || section.title).toLowerCase();
    if (title.indexOf('订阅') < 0 && title.indexOf('subscription') < 0) continue;
    return arrayValue(section.items).map(function (entry) {
      const renderer = entry.guideEntryRenderer || {};
      const browseId = endpointBrowseId(renderer.navigationEndpoint);
      if (!browseId || browseId.indexOf('UC') !== 0) return null;
      return channelItem({
        channelId: browseId,
        title: renderer.formattedTitle || renderer.title,
        thumbnail: renderer.thumbnail
      });
    }).filter(Boolean);
  }
  return [];
}

async function enrichCollectionItems(items, config, limit) {
  return Promise.all(arrayValue(items).map(async function (item) {
    if (!item || (item.type !== 'collection' && item.type !== 'channel')) return item;
    try {
      const previews = item.type === 'channel'
        ? await fetchChannelVideos(stringValue(item.providerIds && item.providerIds.YouTubeChannelId || item.id), 1, config, 'preview:' + item.id)
        : await loadPageItems('playlist:' + stringValue(item.providerIds && item.providerIds.YouTubePlaylistId || item.id), 1, config);
      const previewItems = previews.filter(function (entry) { return entry.type === 'movie'; }).slice(0, limit || 4);
      const image = item.backdrop || item.poster || (previewItems[0] && previewItems[0].backdrop);
      return Object.assign({}, item, {
        poster: image,
        backdrop: image,
        previewItems
      });
    } catch (_) {
      return Object.assign({}, item, { previewItems: [] });
    }
  }));
}

async function fetchNext(videoId, config) {
  return innertube('next', { videoId }, config);
}

async function requestPlayer(videoId, config, preferredClient, preferredProfile, bypassCache) {
  const cachedPlayer = bypassCache ? null : readCachedPlayer(videoId, config);
  if (cachedPlayer &&
      (!preferredClient || cachedPlayer.__baiPlayClientName === preferredClient) &&
      (!preferredProfile || cachedPlayer.__baiPlayClientProfile === preferredProfile)) {
    adoptPlayerPoToken(config, cachedPlayer);
    return cachedPlayer;
  }

  const bases = uniqueStrings([YT_PLAYER_API_BASE, YT_PLAYER_API_FALLBACK_BASE]);
  let lastError = null;
  let best = null;
  for (let index = 0; index < bases.length; index += 1) {
    try {
      const player = await requestFreshPlayer(
        videoId,
        config,
        preferredClient,
        bases[index],
        preferredProfile
      );
      if (hasPlayablePlayerMedia(player)) {
        cachePlayerResponse(videoId, player);
        return player;
      }
      best = best || player;
    } catch (error) {
      lastError = error;
      if (error && error.bestPlayer) best = error.bestPlayer;
    }
  }
  if (best) return best;
  throw lastError || new Error('YouTube 播放接口没有返回结果');
}

function playerExposesRequestedMedia(player, payload, config) {
  const streaming = player && player.streamingData || {};
  const requestedItag = numberValue(payload && payload.itag, 0);
  if (!requestedItag) {
    return hasPlayablePlayerMedia(player);
  }
  const match = matchVideoFormat(allFormats(player), payload || {}, config || {});
  if (!match || !directFormatURL(match.format)) return !!streaming.hlsManifestUrl;
  if (isProgressiveFormat(match.format)) return true;
  return selectAudioFormats(allFormats(player)).length > 0;
}

// WEB can return OK with SABR-only metadata and no downloadable format URLs.
// Only stop trying clients when the host can actually assemble audio and video.
function hasPlayableDirectPlayerMedia(player) {
  const formats = allFormats(player);
  const hasAudio = selectAudioFormats(formats).length > 0;
  return formats.some(function (format) {
    return isBaiPlayVideoFormat(format) && (isProgressiveFormat(format) || hasAudio);
  });
}

function hasPlayablePlayerMedia(player) {
  return stringValue(player && player.playabilityStatus && player.playabilityStatus.status) === 'OK' &&
    (!!(player.streamingData && player.streamingData.hlsManifestUrl) || hasPlayableDirectPlayerMedia(player));
}

function isPlayerLive(player) {
  const details = player && player.videoDetails || {};
  const microformat = player && player.microformat && player.microformat.playerMicroformatRenderer || {};
  const broadcast = microformat.liveBroadcastDetails || {};
  if (broadcast.endTimestamp) return false;
  return isActiveLiveVideo(player, null, microformat) ||
    details.isLiveContent === true && !numberValue(details.lengthSeconds, 0);
}

async function ensureReachablePlayerMedia(videoId, config, payload, player) {
  const firstProbe = await probePlayerMedia(player, payload, config);
  if (firstProbe.ok) return player;

  const currentBase = stringValue(player && player.__baiPlayPlayerAPIBase) || YT_PLAYER_API_BASE;
  const alternateBase = currentBase === YT_PLAYER_API_BASE
    ? YT_PLAYER_API_FALLBACK_BASE
    : YT_PLAYER_API_BASE;
  const currentProfile = stringValue(
    payload.clientProfile || player && player.__baiPlayClientProfile
  ) || defaultProfileForClientName(payload.clientName || player && player.__baiPlayClientName, config);
  const recoveryProfiles = uniqueStrings([
    currentProfile,
    'visionos',
    'tv-downgraded',
    'web-safari',
    'web-pot',
    'visionos',
    'web',
    'android-vr',
    'ios'
  ]);
  const attempts = [];
  function addAttempt(profile, base) {
    const key = profile + '|' + base;
    if (!profile || !base || attempts.some(function (entry) { return entry.key === key; })) return;
    attempts.push({ key, profile, base });
  }
  addAttempt(currentProfile, currentBase);
  addAttempt(currentProfile, alternateBase);
  recoveryProfiles.forEach(function (profile) { addAttempt(profile, YT_PLAYER_API_BASE); });
  recoveryProfiles.slice(0, 3).forEach(function (profile) {
    addAttempt(profile, YT_PLAYER_API_FALLBACK_BASE);
  });

  let lastProbe = firstProbe;
  const observedStatuses = [];
  let requestedQualityWasExposed = firstProbe.qualityAvailable === true;
  if (numberValue(firstProbe.status, 0) > 0) observedStatuses.push(numberValue(firstProbe.status, 0));
  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    try {
      const candidate = await requestFreshPlayer(
        videoId,
        config,
        payload.clientName || player.__baiPlayClientName,
        attempt.base,
        attempt.profile
      );
      if (playabilityError(candidate)) continue;
      const probe = await probePlayerMedia(candidate, payload, config);
      lastProbe = probe;
      if (probe.qualityAvailable === true) requestedQualityWasExposed = true;
      if (numberValue(probe.status, 0) > 0) observedStatuses.push(numberValue(probe.status, 0));
      if (probe.ok) {
        cachePlayerResponse(videoId, candidate);
        return candidate;
      }
    } catch (_) {}
  }

  if (!requestedQualityWasExposed && lastProbe && lastProbe.reason === 'format-missing') {
    throw new Error('所选 YouTube 画质在重新获取播放授权后已不可用，请刷新详情页后重新选择');
  }
  if (observedStatuses.indexOf(403) >= 0) {
    throw new Error('YouTube 拒绝了所选媒体地址（状态码 403）。已尝试 TV、Web、visionOS、iOS 与 Android VR 播放客户端；可能原因包括该视频强制 PoToken、账号播放策略或代理节点动态出口，不能只按网络分组名称判断');
  }
  const status = numberValue(lastProbe && lastProbe.status, 0);
  if (status > 0) {
    throw new Error('YouTube 所选媒体地址探测失败（HTTP ' + status + '），请稍后重试或刷新详情页');
  }
  throw new Error('YouTube 所选媒体地址连接失败，已切换多个播放客户端仍未取得可用响应');
}

async function probePlayerMedia(player, payload, config) {
  payload = payload || {};
  const formats = allFormats(player);
  const requestedItag = numberValue(payload.itag, 0);
  const directMatch = matchVideoFormat(formats, payload, config);
  const selected = directMatch && directMatch.format ||
    (!requestedItag ? selectProgressiveFormat(formats, payload, config) : null) ||
    (!requestedItag ? formats.filter(isBaiPlayVideoFormat)[0] : null);
  const hasProbe = typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.probe === 'function';
  let directFailure = null;

  if (selected && directFormatURL(selected)) {
    if (!hasProbe) {
      player.__baiPlaySelectedMediaMode = 'dash';
      return { ok: true, status: 0, qualityAvailable: true, qualityMatch: directMatch && directMatch.kind || 'auto' };
    }

    const targets = [{ kind: 'video', format: selected }];
    if (!isProgressiveFormat(selected)) {
      const audio = selectAudioFormats(formats)[0];
      if (!audio) {
        directFailure = { ok: false, status: 0, reason: 'audio-missing', qualityAvailable: true };
      } else {
        targets.push({ kind: 'audio', format: audio });
      }
    }
    if (!directFailure) directFailure = await probeMediaTargets(player, targets, config);
    if (directFailure.ok) {
      player.__baiPlaySelectedMediaMode = 'dash';
      directFailure.qualityAvailable = true;
      directFailure.qualityMatch = directMatch && directMatch.kind || 'auto';
      return directFailure;
    }
    directFailure.qualityAvailable = true;
  }

  if (player && player.streamingData && player.streamingData.hlsManifestUrl) {
    const hlsSelection = requestedItag
      ? await selectHLSVariantFromPlayer(player, payload, config)
      : { url: mediaURL(player.streamingData.hlsManifestUrl, mediaConfigForPlayer(config, player)), matchKind: 'auto' };
    if (hlsSelection) {
      if (!hasProbe) {
        player.__baiPlaySelectedMediaMode = 'hls';
        player.__baiPlaySelectedHLSVariant = hlsSelection;
        return { ok: true, status: 0, qualityAvailable: true, qualityMatch: hlsSelection.matchKind };
      }
      const hlsProbe = await probeMediaURL(player, hlsSelection.url, 'hls');
      hlsProbe.qualityAvailable = true;
      hlsProbe.qualityMatch = hlsSelection.matchKind;
      if (hlsProbe.ok) {
        player.__baiPlaySelectedMediaMode = 'hls';
        player.__baiPlaySelectedHLSVariant = hlsSelection;
        return hlsProbe;
      }
      if (!directFailure || !numberValue(directFailure.status, 0)) return hlsProbe;
    }
  }

  if (directFailure) return directFailure;
  return {
    ok: false,
    status: 0,
    reason: requestedItag ? 'format-missing' : 'media-missing',
    qualityAvailable: false
  };
}

async function probeMediaTargets(player, targets, config) {
  const playbackConfig = mediaConfigForPlayer(config, player);
  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index];
    const result = await probeMediaURL(
      player,
      mediaURL(directFormatURL(target.format), playbackConfig),
      target.kind
    );
    if (!result.ok) return result;
  }
  return { ok: true, status: 206 };
}

async function probeMediaURL(player, url, kind) {
  try {
    const response = await Widget.http.probe(url, {
      headers: mediaHeadersForPlayer(player),
      timeout: 4,
      maxBytes: 512
    });
    const status = numberValue(response && (response.status || response.statusCode), 0);
    if (status === 200 || status === 206) return { ok: true, status };
    return {
      ok: false,
      status,
      reason: kind + '-http',
      finalURL: stringValue(response && (response.finalURL || response.url))
    };
  } catch (_) {
    return { ok: false, status: 0, reason: kind + '-network' };
  }
}

async function requestFreshPlayer(videoId, config, preferredClient, endpointBase, forcedProfile) {
  let authenticatedResult = await requestPlayerWithConfig(
    videoId,
    config,
    preferredClient,
    endpointBase,
    forcedProfile
  );
  if (authenticatedResult.playable) {
    authenticatedResult.playable.__baiPlayAuthMode = authenticatedResult.playable.__baiPlayAuthMode || authenticationMode(config);
    return authenticatedResult.playable;
  }

  if (authenticatedResult.authError && canRefreshOAuth(config)) {
    await refreshOAuthIfNeeded(config, true);
    authenticatedResult = await requestPlayerWithConfig(
      videoId,
      config,
      preferredClient,
      endpointBase,
      forcedProfile
    );
    if (authenticatedResult.playable) {
      authenticatedResult.playable.__baiPlayAuthMode = authenticatedResult.playable.__baiPlayAuthMode || authenticationMode(config);
      return authenticatedResult.playable;
    }
  }

  if (hasLogin(config)) {
    const publicResult = await requestPlayerWithConfig(
      videoId,
      anonymousConfig(config),
      preferredClient,
      endpointBase,
      forcedProfile
    );
    if (publicResult.playable) {
      publicResult.playable.__baiPlayAuthMode = 'anonymous-fallback';
      return publicResult.playable;
    }
    if (authenticatedResult.authError) throw authenticatedResult.authError;
    const error = authenticatedResult.error || publicResult.error || new Error('YouTube 播放接口没有返回结果');
    error.bestPlayer = authenticatedResult.best || publicResult.best || null;
    throw error;
  }

  if (authenticatedResult.best) return authenticatedResult.best;
  throw authenticatedResult.error || new Error('YouTube 播放接口没有返回结果');
}

async function requestPlayerWithConfig(videoId, config, preferredClient, endpointBase, forcedProfile) {
  let clients = playerClients(preferredClient, config);
  if (forcedProfile) {
    clients = clients.filter(function (client) { return client.profileId === forcedProfile; });
  }
  let best = null;
  let bestError = null;
  let authError = null;
  for (let index = 0; index < clients.length; index += 1) {
    const client = clients[index];
    try {
      let poTokens = null;
      if (client.supportsWebPoToken && (client.requiresPoToken || config.poToken)) {
        poTokens = await ensurePoTokens(videoId, config);
        if (client.requiresPoToken && !poTokens) continue;
        if (poTokens) config.visitorData = poTokens.visitorData || config.visitorData;
      }
      const requestPayload = {
        videoId,
        contentCheckOk: true,
        racyCheckOk: true,
        playbackContext: {
          contentPlaybackContext: { vis: 0, splay: false, lactMilliseconds: '-1' }
        }
      };
      const playerPoToken = poTokens && poTokens.playerPoToken;
      if (playerPoToken) requestPayload.serviceIntegrityDimensions = { poToken: playerPoToken };
      // Native playback has its own anonymous visitor session. Never send TV OAuth
      // or WEB cookies/visitorData to this client; account browsing stays separate.
      const response = client.profileId === 'visionos'
        ? await requestVisionOSPlayer(videoId, client, endpointBase)
        : await innertube('player', requestPayload, config, { client, endpointBase });
      response.__baiPlayClientName = client.clientName;
      response.__baiPlayClientProfile = client.profileId;
      response.__baiPlayMediaHeaders = mediaHeadersFromClient(client);
      response.__baiPlayPlayerAPIBase = endpointBase || YT_PLAYER_API_BASE;
      if (client.profileId === 'visionos') {
        response.__baiPlayAuthMode = hasLogin(config) ? 'anonymous-fallback' : 'anonymous';
      }
      if (poTokens) {
        response.__baiPlayStreamingPoToken = poTokens.streamingPoToken;
        response.__baiPlayPoTokenExpiresAt = poTokens.expiresAt;
      }
      const status = stringValue(response.playabilityStatus && response.playabilityStatus.status);
      if (hasPlayablePlayerMedia(response)) {
        return { playable: response, best: response, error: null, authError: null };
      }
      if (!best || status === 'OK') best = response;
      const responseError = playabilityError(response);
      if (responseError) bestError = new Error(responseError);
      if (status === 'LOGIN_REQUIRED' && hasLogin(config) && client.profileId !== 'visionos') {
        authError = loginError('YouTube 没有接受当前账号的播放授权，请重新登录后再试');
      }
    } catch (error) {
      bestError = error instanceof Error ? error : new Error(humanError(error));
      if (isLoginError(error)) {
        authError = error;
        break;
      }
    }
  }
  return { playable: null, best, error: bestError, authError };
}

// Request shape verified against NewPipeExtractor's VISIONOS client (2026-10).
// A WEB visitor and a Safari UA are not interchangeable with this native session.
async function requestVisionOSPlayer(videoId, client, endpointBase) {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': client.userAgent,
    'X-Goog-Api-Format-Version': '2'
  };
  const context = {
    client: {
      clientName: client.clientName, clientVersion: client.clientVersion,
      clientScreen: client.clientScreen, platform: client.platform,
      deviceMake: client.deviceMake, deviceModel: client.deviceModel,
      osName: client.osName, osVersion: client.osVersion,
      hl: 'zh-CN', gl: 'US', utcOffsetMinutes: 0
    },
    request: { internalExperimentFlags: [], useSsl: true },
    user: { lockedSafetyMode: false }
  };
  const cacheKey = 'youtube.visitor.visionos.v1.' + client.clientVersion;
  let visitor = parseJSON(readCache(cacheKey));
  if (!visitor || !visitor.visitorData || Date.now() - numberValue(visitor.updatedAt, 0) >= 30 * 60 * 1000) {
    const result = await postJSON(YT_SITE + '/youtubei/v1/visitor_id?prettyPrint=false', { context }, headers);
    const visitorData = stringValue(result && result.responseContext && result.responseContext.visitorData);
    if (!visitorData) throw new Error('YouTube 没有返回有效的播放会话，请稍后重试');
    visitor = { visitorData, updatedAt: Date.now() };
    writeCache(cacheKey, JSON.stringify(visitor));
  }
  context.client.visitorData = visitor.visitorData;
  const cpn = randomToken(16);
  const url = stringValue(endpointBase || YT_PLAYER_API_BASE).replace(/\/$/, '') +
    '/youtubei/v1/player?prettyPrint=false&t=' + randomToken(12) + '&id=' + encodeURIComponent(videoId);
  const response = await postJSON(url, { context, videoId, cpn, contentCheckOk: true, racyCheckOk: true }, headers);
  if (response.videoDetails && response.videoDetails.videoId && response.videoDetails.videoId !== videoId) {
    throw new Error('YouTube 返回的视频与请求不一致');
  }
  response.__baiPlayPlaybackNonce = cpn;
  if (!hasPlayablePlayerMedia(response)) removeCache(cacheKey);
  return response;
}

function cachePlayerResponse(videoId, player) {
  if (!player || stringValue(player.playabilityStatus && player.playabilityStatus.status) !== 'OK') return;
  const reduced = {
    playabilityStatus: player.playabilityStatus,
    streamingData: player.streamingData,
    videoDetails: player.videoDetails,
    microformat: player.microformat,
    captions: player.captions,
    playbackTracking: player.playbackTracking,
    __baiPlayClientName: player.__baiPlayClientName,
    __baiPlayClientProfile: player.__baiPlayClientProfile,
    __baiPlayMediaHeaders: player.__baiPlayMediaHeaders,
    __baiPlayPlayerAPIBase: player.__baiPlayPlayerAPIBase,
    __baiPlayAuthMode: player.__baiPlayAuthMode,
    __baiPlayPlaybackNonce: player.__baiPlayPlaybackNonce,
    __baiPlayStreamingPoToken: player.__baiPlayStreamingPoToken,
    __baiPlayPoTokenExpiresAt: player.__baiPlayPoTokenExpiresAt,
    __baiPlayCachedAt: Date.now()
  };
  writeCache('youtube.player.v4.' + videoId, JSON.stringify(reduced));
}

function readCachedPlayer(videoId, config) {
  const player = parseJSON(readCache('youtube.player.v4.' + videoId));
  if (!player || Date.now() - numberValue(player.__baiPlayCachedAt, 0) > 10 * 60 * 1000) return null;
  if (!hasPlayablePlayerMedia(player)) return null;
  if (player.__baiPlayClientProfile === 'visionos' && !player.__baiPlayPlaybackNonce) return null;
  const expectedMode = authenticationMode(config);
  const cachedMode = stringValue(player.__baiPlayAuthMode || 'anonymous');
  if (cachedMode !== expectedMode && !(expectedMode !== 'anonymous' && cachedMode === 'anonymous-fallback')) return null;
  return player;
}

function adoptPlayerPoToken(config, player) {
  const expiresAt = numberValue(player && player.__baiPlayPoTokenExpiresAt, 0);
  if (player && player.__baiPlayStreamingPoToken && (!expiresAt || expiresAt > Date.now() + 30 * 1000)) {
    config.streamingPoToken = stringValue(player.__baiPlayStreamingPoToken);
  }
}

function playerClients(preferredClient, config) {
  const profiles = [
    {
      profileId: 'web',
      clientName: 'WEB', clientVersion: YT_WEB_VERSION_FALLBACK, clientId: '1', userAgent: YT_UA,
      platform: 'DESKTOP', supportsWebPoToken: true
    },
    {
      profileId: 'web-pot',
      clientName: 'WEB', clientVersion: YT_WEB_VERSION_FALLBACK, clientId: '1', userAgent: YT_UA,
      platform: 'DESKTOP', supportsWebPoToken: true, requiresPoToken: true
    },
    {
      profileId: 'web-safari',
      clientName: 'WEB', clientVersion: YT_WEB_VERSION_FALLBACK, clientId: '1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15,gzip(gfe)',
      platform: 'DESKTOP', supportsWebPoToken: true
    },
    {
      profileId: 'visionos',
      clientName: 'VISIONOS', clientVersion: '1.04', clientId: '101',
      deviceMake: 'Apple', deviceModel: 'RealityDevice17,1', osName: 'visionOS', osVersion: '26.6.0.23O770',
      clientScreen: 'WATCH', platform: 'MOBILE',
      userAgent: 'com.google.visionos.youtube/1.04(RealityDevice17,1; U; CPU visionOS 26_6_0 like Mac OS X; US)'
    },
    {
      profileId: 'ios',
      clientName: 'IOS', clientVersion: '21.26.4', clientId: '5',
      deviceMake: 'Apple', deviceModel: 'iPhone16,2', osName: 'iPhone', osVersion: '18.3.2.22D82',
      userAgent: 'com.google.ios.youtube/21.26.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X;)',
      platform: 'MOBILE', clientFormFactor: 'SMALL_FORM_FACTOR'
    },
    {
      profileId: 'android-vr',
      clientName: 'ANDROID_VR', clientVersion: '1.65.10', clientId: '28', androidSdkVersion: 32,
      deviceMake: 'Oculus', deviceModel: 'Quest 3', osName: 'Android', osVersion: '12L',
      userAgent: 'com.google.android.apps.youtube.vr.oculus/1.65.10 (Linux; U; Android 12L) gzip',
      platform: 'MOBILE', clientFormFactor: 'SMALL_FORM_FACTOR'
    },
    {
      profileId: 'android',
      clientName: 'ANDROID', clientVersion: '21.26.364', clientId: '3', androidSdkVersion: 30,
      osName: 'Android', osVersion: '11',
      userAgent: 'com.google.android.youtube/21.26.364 (Linux; U; Android 11) gzip',
      platform: 'MOBILE', clientFormFactor: 'SMALL_FORM_FACTOR'
    },
    tvInnertubeClient(YT_TV_VERSION, 'tv'),
    tvInnertubeClient(YT_TV_DOWNGRADED_VERSION, 'tv-downgraded')
  ];
  const profileOrder = hasLogin(config)
    ? ['visionos', 'tv-downgraded', 'web-safari', 'web', 'tv', 'web-pot', 'ios', 'android-vr', 'android']
    : ['visionos', 'web-safari', 'ios', 'web', 'tv-downgraded', 'web-pot', 'tv', 'android-vr', 'android'];
  const ordered = profileOrder.map(function (profileId) {
    return profiles.filter(function (profile) { return profile.profileId === profileId; })[0];
  }).filter(Boolean);
  if (!preferredClient) return ordered;
  return ordered.sort(function (left, right) {
    return left.clientName === preferredClient ? -1 : right.clientName === preferredClient ? 1 : 0;
  });
}

function defaultProfileForClientName(clientName, config) {
  const expected = stringValue(clientName).toUpperCase();
  const match = playerClients(null, config).filter(function (client) {
    return client.clientName === expected;
  })[0];
  return match && match.profileId || (hasLogin(config) ? 'tv-downgraded' : 'visionos');
}

function tvInnertubeClient(version, profileId) {
  return {
    profileId: profileId || 'tv',
    clientName: 'TVHTML5',
    clientVersion: version || YT_TV_VERSION,
    clientId: '7',
    clientScreen: 'WATCH',
    userAgent: YT_TV_UA,
    referer: YT_SITE + '/tv',
    tvAppInfo: {
      appQuality: 'TV_APP_QUALITY_FULL_ANIMATION',
      zylonLeftNav: true
    },
    webpSupport: false,
    animatedWebpSupport: true
  };
}

function defaultInnertubeClient(endpoint, config, session) {
  if (config && config.accessToken && endpoint !== 'player') return tvInnertubeClient();
  return {
    clientName: 'WEB', clientVersion: session.clientVersion, clientId: '1', userAgent: YT_UA,
    referer: YT_SITE + '/'
  };
}

async function innertube(endpoint, payload, config, options) {
  config = config || {};
  options = options || {};
  await refreshOAuthIfNeeded(config);
  const session = await bootstrapSession(config);
  const client = options.client || defaultInnertubeClient(endpoint, config, session);
  const contextClient = {
    clientName: client.clientName,
    clientVersion: client.clientVersion,
    hl: 'zh-CN',
    gl: 'US',
    visitorData: config.visitorData || session.visitorData || undefined,
    userAgent: client.userAgent || YT_UA,
    timeZone: 'America/New_York',
    utcOffsetMinutes: -240
  };
  ['deviceMake', 'deviceModel', 'osName', 'osVersion', 'androidSdkVersion', 'platform', 'clientFormFactor', 'clientScreen'].forEach(function (key) {
    if (client[key] !== undefined) contextClient[key] = client[key];
  });
  if (client.tvAppInfo) contextClient.tvAppInfo = Object.assign({}, client.tvAppInfo);
  if (client.webpSupport !== undefined) contextClient.webpSupport = !!client.webpSupport;
  if (client.animatedWebpSupport !== undefined) contextClient.animatedWebpSupport = !!client.animatedWebpSupport;
  const body = Object.assign({}, payload || {}, {
    context: {
      client: contextClient,
      user: { enableSafetyMode: false, lockedSafetyMode: false },
      request: { useSsl: true, internalExperimentFlags: [] }
    }
  });
  if (endpoint === 'player') {
    const playbackContext = body.playbackContext = body.playbackContext || {};
    const contentPlaybackContext = playbackContext.contentPlaybackContext = playbackContext.contentPlaybackContext || {};
    if (!contentPlaybackContext.signatureTimestamp && numberValue(session.signatureTimestamp, 0) > 0) {
      contentPlaybackContext.signatureTimestamp = numberValue(session.signatureTimestamp, 0);
    }
  }
  const endpointBase = endpoint === 'player'
    ? stringValue(options.endpointBase || YT_PLAYER_API_BASE).replace(/\/$/, '')
    : YT_SITE;
  const url = endpointBase + '/youtubei/v1/' + endpoint + '?key=' + encodeURIComponent(session.apiKey) + '&prettyPrint=false';
  let headers = await innertubeHeaders(config, client, session);
  let response;
  try {
    response = await postJSON(url, body, headers);
  } catch (error) {
    if (!options.oauthRetry && canRefreshOAuth(config) && isLoginError(error)) {
      await refreshOAuthIfNeeded(config, true);
      return innertube(endpoint, payload, config, Object.assign({}, options, { oauthRetry: true }));
    } else {
      throw error;
    }
  }
  if (response && response.responseContext && response.responseContext.visitorData) {
    session.visitorData = stringValue(response.responseContext.visitorData);
  }
  if (response && response.error) {
    const apiError = cleanText(response.error.message || response.error.status);
    if (!options.oauthRetry && canRefreshOAuth(config) && isOAuthAuthorizationFailure(response.error)) {
      await refreshOAuthIfNeeded(config, true);
      return innertube(endpoint, payload, config, Object.assign({}, options, { oauthRetry: true }));
    }
    if (isOAuthAuthorizationFailure(response.error)) throw loginError('YouTube 登录授权已失效或未被接口接受，请重新登录');
    throw new Error('YouTube API：' + apiError);
  }
  if (hasLogin(config) && endpoint !== 'player' && responseAuthenticationState(response) === 'logged-out') {
    if (!options.oauthRetry && canRefreshOAuth(config)) {
      await refreshOAuthIfNeeded(config, true);
      return innertube(endpoint, payload, config, Object.assign({}, options, { oauthRetry: true }));
    }
    throw loginError('YouTube 登录授权已失效或未被接口接受，请重新登录');
  }
  return response || {};
}

async function bootstrapSession(config) {
  const cached = readCache('youtube.innertube.session.v1');
  let session = parseJSON(cached) || {};
  if (session.apiKey && session.clientVersion && numberValue(session.signatureTimestamp, 0) > 0 &&
      Date.now() - numberValue(session.updatedAt, 0) < 12 * 60 * 60 * 1000) {
    if (config.visitorData) session.visitorData = config.visitorData;
    return session;
  }
  try {
    const html = await getText(YT_SITE + '/', baseHeaders(config), 18);
    session = {
      apiKey: firstMatch(html, [
        /INNERTUBE_API_KEY\\?"\s*:\s*\\?"([^"\\]+)/,
        /"INNERTUBE_API_KEY"\s*:\s*"([^"]+)/
      ]) || YT_API_KEY_FALLBACK,
      clientVersion: firstMatch(html, [
        /INNERTUBE_CLIENT_VERSION\\?"\s*:\s*\\?"([^"\\]+)/,
        /"INNERTUBE_CLIENT_VERSION"\s*:\s*"([^"]+)/
      ]) || YT_WEB_VERSION_FALLBACK,
      visitorData: config.visitorData || decodeURIComponentSafe(firstMatch(html, [
        /VISITOR_DATA\\?"\s*:\s*\\?"([^"\\]+)/,
        /visitorData\\?"\s*:\s*\\?"([^"\\]+)/
      ])),
      signatureTimestamp: numberValue(firstMatch(html, [
        /"STS"\s*:\s*(\d+)/,
        /"signatureTimestamp"\s*:\s*(\d+)/
      ]), 0),
      updatedAt: Date.now()
    };
  } catch (_) {
    session = {
      apiKey: YT_API_KEY_FALLBACK,
      clientVersion: YT_WEB_VERSION_FALLBACK,
      visitorData: config.visitorData || '',
      signatureTimestamp: 0,
      updatedAt: Date.now()
    };
  }
  writeCache('youtube.innertube.session.v1', JSON.stringify(session));
  return session;
}

async function innertubeHeaders(config, client, session) {
  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/json',
    Origin: YT_SITE,
    Referer: client.referer || YT_SITE + '/',
    'User-Agent': client.userAgent || YT_UA,
    'X-Youtube-Client-Name': stringValue(client.clientId || '1'),
    'X-Youtube-Client-Version': stringValue(client.clientVersion || session.clientVersion)
  };
  const visitorData = config.visitorData || session.visitorData;
  if (visitorData) headers['X-Goog-Visitor-Id'] = visitorData;
  if (config.accessToken) {
    headers.Authorization = 'Bearer ' + config.accessToken;
  } else if (config.cookie) {
    const authorization = sidAuthorization(config.cookie, YT_SITE);
    if (authorization) headers.Authorization = authorization;
    headers.Cookie = config.cookie;
    headers['X-Goog-AuthUser'] = '0';
    headers['X-Origin'] = YT_SITE;
  }
  return headers;
}

function collectItems(root) {
  const items = [];
  const seen = {};
  const mappings = {
    videoRenderer: videoItem,
    gridVideoRenderer: videoItem,
    compactVideoRenderer: videoItem,
    playlistVideoRenderer: videoItem,
    playlistPanelVideoRenderer: videoItem,
    reelItemRenderer: videoItem,
    videoWithContextRenderer: videoItem,
    playlistRenderer: playlistItem,
    gridPlaylistRenderer: playlistItem,
    compactPlaylistRenderer: playlistItem,
    radioRenderer: playlistItem,
    compactRadioRenderer: playlistItem,
    channelRenderer: channelItem,
    gridChannelRenderer: channelItem,
    tileRenderer: tileItem,
    lockupViewModel: lockupItem
  };
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      if (/^(?:adSlotRenderer|searchPyvRenderer|promotedSparklesWebRenderer|playerLegacyDesktopWatchAdsRenderer)$/i.test(key)) {
        continue;
      }
      if (mappings[key]) {
        const item = mappings[key](value[key]);
        if (item) {
          const identity = item.type + ':' + item.id;
          if (!seen[identity]) {
            seen[identity] = true;
            items.push(item);
          }
        }
      } else {
        walk(value[key]);
      }
    }
  }
  walk(root);
  return items;
}

function normalizeSearchItems(items) {
  return arrayValue(items).map(function (item) {
    // The native search result opens media details. Playlists, mixes and
    // channels do not have a canonical videoId, so keep them in their
    // dedicated browse pages instead of returning broken search cards.
    if (!item || item.type !== 'movie') return null;
    const videoId = videoIdFrom(
      item.providerIds && item.providerIds.YouTubeVideoId ||
      item.action && item.action.itemId ||
      item.id
    );
    if (!videoId) return null;
    const title = cleanText(item.title) || videoId;
    return Object.assign({}, item, {
      id: videoId,
      providerIds: Object.assign({}, item.providerIds || {}, {
        YouTubeVideoId: videoId,
        MiniLibraryPlaybackTitle: title
      }),
      action: Object.assign({}, item.action || {}, {
        type: 'detail',
        itemId: videoId,
        title
      })
    });
  }).filter(Boolean);
}

function tileItem(renderer) {
  renderer = renderer || {};
  const header = renderer.header || {};
  const tileHeader = header.tileHeaderRenderer || header.trackTileHeaderRenderer || {};
  const metadata = renderer.metadata && renderer.metadata.tileMetadataRenderer ||
    firstTileOverlayMetadata(tileHeader) || {};
  const command = renderer.onSelectCommand || {};
  const contentId = stringValue(renderer.contentId);
  const contentType = stringValue(renderer.contentType);
  const isVideoContent = /(?:VIDEO|SHORT)/i.test(contentType);
  const isPlaylistContent = /PLAYLIST|RADIO|MIX/i.test(contentType);
  const isChannelContent = /CHANNEL/i.test(contentType);
  const videoId = videoIdFromEndpoint(command) || (isVideoContent ? videoIdFrom(contentId) : '');
  const title = cleanText(textValue(metadata.title || tileHeader.title)) || contentId || 'YouTube';
  const thumbnail = tileHeader.thumbnail || tileHeader.movingThumbnail || tileHeader.onFocusThumbnail;
  const lines = tileMetadataLines(metadata);
  const durationText = tileDurationText(tileHeader);
  const isLive = tileStatusStyle(tileHeader) === 'LIVE' || lines.some(function (line) {
    return /(?:live|直播|watching|正在观看)/i.test(line);
  });

  const playlistId = playlistIdFromEndpoint(command) || (isPlaylistContent ? playlistIdFrom(contentId) : '');
  if (isPlaylistContent && playlistId) {
    return playlistItem({
      playlistId,
      title: { simpleText: title },
      thumbnail,
      videoCountText: { simpleText: lines[0] || '' }
    });
  }

  const browseId = endpointBrowseIdDeep(command) || (isChannelContent ? contentId : '');
  if (isChannelContent && browseId) {
    return channelItem({
      channelId: browseId,
      title: { simpleText: title },
      thumbnail,
      descriptionSnippet: { simpleText: lines.join(' · ') }
    });
  }

  if (videoId) {
    const item = videoItem({
      videoId,
      title: { simpleText: title },
      thumbnail,
      lengthText: durationText ? { simpleText: durationText } : undefined,
      badges: isLive ? [{ metadataBadgeRenderer: { label: 'LIVE' } }] : []
    });
    if (!item) return null;
    item.subtitle = joinText(lines);
    item.remarks = isLive ? 'LIVE' : durationText;
    const endpoint = firstEndpointCommand(command);
    const startTime = numberValue(endpoint.watchEndpoint && endpoint.watchEndpoint.startTimeSeconds, 0);
    if (startTime > 0) {
      item.playbackProgress = {
        itemId: videoId,
        positionSeconds: startTime,
        durationSeconds: item.durationSeconds,
        completed: false
      };
    }
    return item;
  }

  if (playlistId) {
    return playlistItem({
      playlistId: playlistId || contentId.replace(/^VL/, ''),
      title: { simpleText: title },
      thumbnail,
      videoCountText: { simpleText: lines[0] || '' }
    });
  }

  if (browseId) {
    return channelItem({
      channelId: browseId,
      title: { simpleText: title },
      thumbnail,
      descriptionSnippet: { simpleText: lines.join(' · ') }
    });
  }
  return null;
}

function firstTileOverlayMetadata(tileHeader) {
  const overlays = arrayValue(tileHeader && tileHeader.thumbnailOverlays);
  for (let index = 0; index < overlays.length; index += 1) {
    if (overlays[index] && overlays[index].tileMetadataRenderer) return overlays[index].tileMetadataRenderer;
  }
  return null;
}

function tileMetadataLines(metadata) {
  return arrayValue(metadata && metadata.lines).map(function (line) {
    const items = arrayValue(line && line.lineRenderer && line.lineRenderer.items);
    return joinText(items.map(function (entry) {
      const item = entry && entry.lineItemRenderer || {};
      const badge = item.badge && (item.badge.metadataBadgeRenderer || item.badge.adBadgeViewModel) || {};
      return textValue(item.text) || textValue(badge.label);
    }));
  }).filter(Boolean);
}

function tileDurationText(tileHeader) {
  if (tileHeader && tileHeader.duration) return cleanText(textValue(tileHeader.duration));
  const overlays = arrayValue(tileHeader && tileHeader.thumbnailOverlays);
  for (let index = 0; index < overlays.length; index += 1) {
    const status = overlays[index] && overlays[index].thumbnailOverlayTimeStatusRenderer;
    if (status) return cleanText(textValue(status.text));
  }
  return '';
}

function tileStatusStyle(tileHeader) {
  const overlays = arrayValue(tileHeader && tileHeader.thumbnailOverlays);
  for (let index = 0; index < overlays.length; index += 1) {
    const status = overlays[index] && overlays[index].thumbnailOverlayTimeStatusRenderer;
    if (status && status.style) return stringValue(status.style);
  }
  return '';
}

function videoItem(renderer) {
  renderer = renderer || {};
  const videoId = videoIdFrom(renderer.videoId) || videoIdFromEndpoint(renderer.navigationEndpoint);
  if (!videoId) return null;
  const title = cleanText(textValue(renderer.title || renderer.headline)) || videoId;
  const authorRun = firstRun(renderer.ownerText || renderer.shortBylineText || renderer.longBylineText);
  const author = cleanText(authorRun && authorRun.text);
  const channelId = endpointBrowseId(authorRun && authorRun.navigationEndpoint);
  const durationText = cleanText(textValue(renderer.lengthText)) || overlayDurationText(renderer);
  const durationSeconds = durationFromText(durationText);
  const poster = bestThumbnail(renderer.thumbnail) || videoThumbnail(videoId, 'hqdefault');
  const published = cleanText(textValue(renderer.publishedTimeText));
  const views = cleanText(textValue(renderer.shortViewCountText || renderer.viewCountText));
  const badges = rendererBadgeTexts(renderer);
  const isLive = !!renderer.upcomingEventData || badges.some(function (badge) {
    return /live|直播/i.test(badge);
  });
  const resumeSeconds = findResumeSeconds(renderer, durationSeconds);
  const item = {
    id: videoId,
    type: 'movie',
    title,
    poster,
    backdrop: poster,
    imageHeaders: imageHeaders(),
    subtitle: joinText([author, isLive ? 'LIVE' : views, published]),
    remarks: isLive ? 'LIVE' : durationText,
    durationSeconds: durationSeconds || undefined,
    providerIds: {
      YouTubeVideoId: videoId,
      YouTubeChannelId: channelId || undefined,
      MiniLibraryPlaybackTitle: title
    },
    action: { type: 'detail', itemId: videoId, title }
  };
  if (resumeSeconds > 0) {
    item.playbackProgress = {
      itemId: videoId,
      positionSeconds: resumeSeconds,
      durationSeconds: durationSeconds || undefined,
      completed: false
    };
  }
  cacheVideoItem(item);
  return item;
}

function cacheVideoItem(item) {
  if (!item || !item.id || !item.title) return;
  writeCache('youtube.item.v1.' + item.id, JSON.stringify({
    title: item.title,
    poster: item.poster || item.backdrop || '',
    cachedAt: Date.now()
  }));
}

function readCachedVideoItem(videoId) {
  const item = parseJSON(readCache('youtube.item.v1.' + videoId));
  if (!item || Date.now() - numberValue(item.cachedAt, 0) > 7 * 24 * 60 * 60 * 1000) return {};
  return item;
}

function playlistItem(renderer) {
  renderer = renderer || {};
  const playlistId = stringValue(
    renderer.playlistId ||
    renderer.navigationEndpoint && renderer.navigationEndpoint.browseEndpoint && renderer.navigationEndpoint.browseEndpoint.browseId ||
    renderer.navigationEndpoint && renderer.navigationEndpoint.watchEndpoint && renderer.navigationEndpoint.watchEndpoint.playlistId
  ).replace(/^VL/, '');
  if (!playlistId) return null;
  const title = cleanText(textValue(renderer.title)) || 'YouTube 播放列表';
  const poster = bestThumbnail(renderer.thumbnail || renderer.thumbnails) || thumbnailFromRendererVideos(renderer);
  const count = cleanText(textValue(renderer.videoCountText || renderer.videoCountShortText));
  const author = cleanText(textValue(renderer.shortBylineText || renderer.longBylineText));
  return {
    id: playlistId,
    type: 'collection',
    title,
    poster: poster || YT_ICON,
    backdrop: poster || YT_ICON,
    imageFit: 'fit',
    imageHeaders: imageHeaders(),
    subtitle: joinText([author, count]),
    remarks: count,
    previewItems: [],
    providerIds: { YouTubePlaylistId: playlistId },
    action: categoryAction('playlist:' + playlistId, title)
  };
}

function channelItem(renderer) {
  renderer = renderer || {};
  const channelId = stringValue(
    renderer.channelId ||
    renderer.navigationEndpoint && renderer.navigationEndpoint.browseEndpoint && renderer.navigationEndpoint.browseEndpoint.browseId
  );
  if (!channelId) return null;
  const title = cleanText(textValue(renderer.title || renderer.formattedTitle)) || 'YouTube 频道';
  const poster = bestThumbnail(renderer.thumbnail || renderer.avatar) || YT_ICON;
  return {
    id: channelId,
    type: 'channel',
    title,
    poster,
    backdrop: poster,
    imageFit: 'fit',
    imageHeaders: imageHeaders(),
    subtitle: cleanText(textValue(renderer.subscriberCountText || renderer.videoCountText || renderer.descriptionSnippet)),
    remarks: cleanText(textValue(renderer.subscriberCountText)),
    previewItems: [],
    providerIds: { YouTubeChannelId: channelId },
    action: categoryAction('channel:' + channelId, title)
  };
}

function lockupItem(renderer) {
  renderer = renderer || {};
  const contentId = stringValue(renderer.contentId);
  const metadata = renderer.metadata && renderer.metadata.lockupMetadataViewModel || {};
  const title = cleanText(
    metadata.title && (metadata.title.content || textValue(metadata.title)) || renderer.title
  );
  const endpoint = renderer.rendererContext && renderer.rendererContext.commandContext &&
    renderer.rendererContext.commandContext.onTap && renderer.rendererContext.commandContext.onTap.innertubeCommand ||
    renderer.navigationEndpoint || {};
  const contentType = stringValue(renderer.contentType);
  const isVideoContent = /(?:VIDEO|SHORT)/i.test(contentType);
  const isPlaylistContent = /PLAYLIST|RADIO|MIX/i.test(contentType);
  const isChannelContent = /CHANNEL/i.test(contentType);
  const browseId = endpointBrowseIdDeep(endpoint);
  const watchId = videoIdFromEndpoint(endpoint);
  const playlistId = playlistIdFromEndpoint(endpoint) || (isPlaylistContent ? playlistIdFrom(contentId) : '');
  const image = renderer.contentImage && renderer.contentImage.thumbnailViewModel &&
    renderer.contentImage.thumbnailViewModel.image || renderer.thumbnail;
  const poster = bestThumbnail(image) || (watchId ? videoThumbnail(watchId, 'hqdefault') : YT_ICON);
  if (isPlaylistContent && playlistId) {
    return playlistItem({ playlistId, title: { simpleText: title }, thumbnail: image });
  }
  if (isChannelContent && (browseId || /^UC/.test(contentId))) {
    return channelItem({ channelId: browseId || contentId, title: { simpleText: title }, thumbnail: image });
  }
  if (watchId || isVideoContent && videoIdFrom(contentId)) {
    return videoItem({ videoId: watchId || videoIdFrom(contentId), title: { simpleText: title }, thumbnail: image });
  }
  if (playlistId) {
    return playlistItem({ playlistId, title: { simpleText: title }, thumbnail: image });
  }
  if (browseId || /^UC/.test(contentId)) {
    return channelItem({ channelId: browseId || contentId, title: { simpleText: title }, thumbnail: image });
  }
  return null;
}

function resourceGroupsFromPlayer(player, videoId, title, config) {
  const streaming = player.streamingData || {};
  const isLive = isPlayerLive(player);
  if (streaming.hlsManifestUrl && (isLive || !hasPlayableDirectPlayerMedia(player))) {
    return [{
      id: isLive ? 'youtube-live' : 'youtube-hls',
      title: isLive ? 'YouTube 直播' : 'YouTube 画质',
      versions: [{
        id: 'hls:auto',
        name: '自动',
        subtitle: 'HLS 自适应',
        container: 'm3u8',
        default: true,
        url: encodePlaybackPayload({
          videoId, title, mode: 'hls',
          clientName: player.__baiPlayClientName,
          clientProfile: player.__baiPlayClientProfile
        }),
        action: {
          type: 'play', itemId: videoId, versionId: 'hls:auto', title,
          url: encodePlaybackPayload({
            videoId, title, mode: 'hls',
            clientName: player.__baiPlayClientName,
            clientProfile: player.__baiPlayClientProfile
          })
        }
      }]
    }];
  }
  const formats = allFormats(player);
  const maxHeight = numberValue(config.maxHeight, 2160);
  const hasAudio = selectAudioFormats(formats).length > 0;
  const videos = formats.filter(function (format) {
    return isBaiPlayVideoFormat(format) && (isProgressiveFormat(format) || hasAudio) &&
      numberValue(format.height, 0) <= maxHeight;
  }).sort(compareVideoFormats(config));
  const byQuality = {};
  videos.forEach(function (format) {
    const height = videoQualityHeight(format);
    const fps = numberValue(format.fps, 0);
    const key = height + ':' + (fps > 30 ? fps : 30);
    if (!byQuality[key] || videoCodecScore(format, config) > videoCodecScore(byQuality[key], config)) {
      byQuality[key] = format;
    }
  });
  let selected = Object.keys(byQuality).map(function (key) { return byQuality[key]; });
  if (!selected.length) selected = formats.filter(function (format) {
    return isProgressiveFormat(format) && isBaiPlayVideoFormat(format);
  }).slice(0, 1);
  selected.sort(function (left, right) {
    return numberValue(right.height, 0) - numberValue(left.height, 0) || numberValue(right.fps, 0) - numberValue(left.fps, 0);
  });
  const versions = selected.slice(0, 12).map(function (format, index) {
    const itag = numberValue(format.itag, 0);
    const payload = encodePlaybackPayload({
      videoId,
      title,
      itag,
      width: numberValue(format.width, 0),
      height: numberValue(format.height, 0),
      qualityHeight: videoQualityHeight(format),
      fps: numberValue(format.fps, 0),
      videoRange: youtubeVideoRange(format),
      codec: codecFromMime(format.mimeType),
      mimeType: cleanText(format.mimeType),
      bitrate: numberValue(format.bitrate || format.averageBitrate, 0),
      clientName: player.__baiPlayClientName,
      clientProfile: player.__baiPlayClientProfile
    });
    return {
      id: 'itag:' + itag,
      name: format.qualityLabel || (numberValue(format.height, 0) + 'P'),
      subtitle: formatSubtitle(format),
      container: 'm3u8',
      default: index === 0,
      url: payload,
      action: { type: 'play', itemId: videoId, versionId: 'itag:' + itag, title, url: payload }
    };
  });
  if (!versions.length) return fallbackResourceGroups(videoId, title, '播放时自动解析');
  return [{ id: 'youtube-quality', title: 'YouTube 画质', versions }];
}

function fallbackResourceGroups(videoId, title, reason) {
  const payload = encodePlaybackPayload({ videoId, title, mode: 'auto' });
  return [{
    id: 'youtube-auto',
    title: 'YouTube 播放',
    versions: [{
      id: 'auto', name: '自动', subtitle: cleanText(reason) || '播放时解析',
      container: 'm3u8', default: true, url: payload,
      action: { type: 'play', itemId: videoId, versionId: 'auto', title, url: payload }
    }]
  }];
}

function allFormats(player) {
  const streaming = player && player.streamingData || {};
  return arrayValue(streaming.formats).concat(arrayValue(streaming.adaptiveFormats));
}

function selectVideoFormat(formats, payload, config) {
  const match = matchVideoFormat(formats, payload, config);
  return match && match.format || null;
}

function matchVideoFormat(formats, payload, config) {
  const hasAudio = selectAudioFormats(formats).length > 0;
  const videos = formats.filter(function (format) {
    return isBaiPlayVideoFormat(format) && (isProgressiveFormat(format) || hasAudio) &&
      numberValue(format.height, 0) <= numberValue(config.maxHeight, 2160);
  });
  const requestedItag = numberValue(payload.itag, 0);
  if (requestedItag) {
    const exact = videos.filter(function (format) { return numberValue(format.itag, 0) === requestedItag; })[0];
    if (exact) return { format: exact, kind: 'exact' };

    const equivalent = videos.filter(function (format) {
      return isEquivalentVideoQuality(format, payload);
    }).sort(function (left, right) {
      const requestedCodec = stringValue(payload.codec).toLowerCase();
      const leftCodec = codecFromMime(left.mimeType).toLowerCase();
      const rightCodec = codecFromMime(right.mimeType).toLowerCase();
      const leftCodecMatch = requestedCodec && leftCodec === requestedCodec ? 1 : 0;
      const rightCodecMatch = requestedCodec && rightCodec === requestedCodec ? 1 : 0;
      if (leftCodecMatch !== rightCodecMatch) return rightCodecMatch - leftCodecMatch;
      return videoCodecScore(right, config) - videoCodecScore(left, config) ||
        numberValue(right.bitrate, 0) - numberValue(left.bitrate, 0);
    })[0];
    return equivalent ? { format: equivalent, kind: 'equivalent' } : null;
  }
  const requestedHeight = requestedVideoQualityHeight(payload, numberValue(config.maxHeight, 2160));
  const selected = videos.sort(function (left, right) {
    const leftDistance = Math.abs(videoQualityHeight(left) - requestedHeight);
    const rightDistance = Math.abs(videoQualityHeight(right) - requestedHeight);
    if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    return videoCodecScore(right, config) - videoCodecScore(left, config) || numberValue(right.bitrate, 0) - numberValue(left.bitrate, 0);
  })[0];
  return selected ? { format: selected, kind: 'auto' } : null;
}

function selectProgressiveFormat(formats, payload, config) {
  const requestedItag = numberValue(payload.itag, 0);
  if (requestedItag) {
    return formats.filter(function (format) {
      return isProgressiveFormat(format) && isBaiPlayVideoFormat(format) &&
        numberValue(format.itag, 0) === requestedItag;
    })[0] || null;
  }
  const requestedHeight = requestedVideoQualityHeight(payload, numberValue(config.maxHeight, 2160));
  return formats.filter(function (format) {
    return isProgressiveFormat(format) && isBaiPlayVideoFormat(format) && numberValue(format.height, 0) <= numberValue(config.maxHeight, 2160);
  }).sort(function (left, right) {
    return Math.abs(videoQualityHeight(left) - requestedHeight) - Math.abs(videoQualityHeight(right) - requestedHeight) ||
      numberValue(right.bitrate, 0) - numberValue(left.bitrate, 0);
  })[0] || null;
}

function isEquivalentVideoQuality(format, payload) {
  const requestedHeight = requestedVideoQualityHeight(payload, 0);
  if (!requestedHeight || videoQualityHeight(format) !== requestedHeight) return false;
  if (!equivalentFrameRate(numberValue(payload.fps, 0), numberValue(format && format.fps, 0))) return false;
  const requestedRange = normalizeVideoRange(payload.videoRange);
  return !requestedRange || normalizeVideoRange(youtubeVideoRange(format)) === requestedRange;
}

function requestedVideoQualityHeight(payload, fallback) {
  const explicit = numberValue(payload && payload.qualityHeight, 0);
  if (explicit) return explicit;
  const width = numberValue(payload && payload.width, 0);
  const height = numberValue(payload && payload.height, 0);
  if (width && height) return Math.min(width, height);
  return height || numberValue(fallback, 0);
}

function videoQualityHeight(format) {
  const labelHeight = numberValue(firstMatch(stringValue(format && format.qualityLabel), [/^(\d+)p/i]), 0);
  if (labelHeight) return labelHeight;
  const width = numberValue(format && format.width, 0);
  const height = numberValue(format && format.height, 0);
  return width && height ? Math.min(width, height) : height;
}

function equivalentFrameRate(requested, candidate) {
  const expected = numberValue(requested, 0);
  const actual = numberValue(candidate, 0);
  if (!expected) return true;
  if (!actual) return expected <= 30;
  return Math.abs(expected - actual) <= 1;
}

function normalizeVideoRange(value) {
  const range = stringValue(value).toUpperCase();
  if (!range) return '';
  if (/HDR|PQ|HLG|SMPTE2084/.test(range)) return 'HDR';
  return 'SDR';
}

async function selectHLSVariantFromPlayer(player, payload, config) {
  if (!player || !player.streamingData || !player.streamingData.hlsManifestUrl) return null;
  const playbackConfig = mediaConfigForPlayer(config, player);
  const masterURL = mediaURL(player.streamingData.hlsManifestUrl, playbackConfig);
  try {
    const manifest = await getText(masterURL, mediaHeadersForPlayer(player), 8);
    const variants = parseHLSMasterVariants(manifest, masterURL);
    if (!variants.length) return null;
    const requestedItag = numberValue(payload && payload.itag, 0);
    const exact = requestedItag
      ? variants.filter(function (variant) { return variant.itag === requestedItag; })[0]
      : null;
    const selected = exact || variants.filter(function (variant) {
      return isEquivalentHLSQuality(variant, payload);
    }).sort(function (left, right) {
      const requestedCodec = stringValue(payload && payload.codec).toLowerCase();
      const leftCodecMatch = requestedCodec && stringValue(left.codec).toLowerCase() === requestedCodec ? 1 : 0;
      const rightCodecMatch = requestedCodec && stringValue(right.codec).toLowerCase() === requestedCodec ? 1 : 0;
      return rightCodecMatch - leftCodecMatch || numberValue(right.bandwidth, 0) - numberValue(left.bandwidth, 0);
    })[0];
    if (!selected) return null;
    return Object.assign({}, selected, {
      matchKind: exact ? 'exact-hls' : 'equivalent-hls',
      masterURL,
      playlistText: filteredHLSMaster(manifest, masterURL, selected)
    });
  } catch (_) {
    return null;
  }
}

function isEquivalentHLSQuality(variant, payload) {
  const requestedHeight = requestedVideoQualityHeight(payload, 0);
  if (!requestedHeight || numberValue(variant && variant.qualityHeight, 0) !== requestedHeight) return false;
  if (!equivalentFrameRate(numberValue(payload && payload.fps, 0), numberValue(variant && variant.fps, 0))) return false;
  const requestedRange = normalizeVideoRange(payload && payload.videoRange);
  return !requestedRange || normalizeVideoRange(variant && variant.videoRange) === requestedRange;
}

function parseHLSMasterVariants(text, masterURL) {
  const lines = stringValue(text).replace(/\r/g, '').split('\n');
  const variants = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.indexOf('#EXT-X-STREAM-INF:') !== 0) continue;
    const streamInfoIndex = index;
    const attributes = parseHLSAttributes(line.slice('#EXT-X-STREAM-INF:'.length));
    let uri = '';
    for (let next = index + 1; next < lines.length; next += 1) {
      const candidate = lines[next].trim();
      if (!candidate) continue;
      if (candidate.charAt(0) === '#') break;
      uri = candidate;
      index = next;
      break;
    }
    if (!uri) continue;
    const resolution = stringValue(attributes.RESOLUTION).match(/^(\d+)x(\d+)$/i);
    const width = resolution ? numberValue(resolution[1], 0) : 0;
    const height = resolution ? numberValue(resolution[2], 0) : 0;
    const codecs = stringValue(attributes.CODECS);
    const videoCodec = codecs.split(',').map(function (codec) { return codec.trim(); }).filter(function (codec) {
      return /^(?:avc[13]|hvc1|hev1|vp0?9|av01)/i.test(codec);
    })[0] || '';
    const url = resolveRelativeURL(uri, masterURL);
    variants.push({
      url,
      streamInfoLine: line,
      streamInfoIndex,
      attributes,
      itag: hlsItagFromURL(url),
      width,
      height,
      qualityHeight: width && height ? Math.min(width, height) : height,
      fps: numberValue(attributes['FRAME-RATE'], 0),
      videoRange: normalizeVideoRange(attributes['VIDEO-RANGE'] || 'SDR'),
      codec: videoCodec,
      codecs,
      bandwidth: numberValue(attributes['AVERAGE-BANDWIDTH'] || attributes.BANDWIDTH, 0)
    });
  }
  return variants.filter(function (variant) { return !!variant.url && !!variant.qualityHeight; });
}

function filteredHLSMaster(text, masterURL, selected) {
  const lines = stringValue(text).replace(/\r/g, '').split('\n');
  const referencedGroups = {};
  ['AUDIO', 'VIDEO', 'SUBTITLES', 'CLOSED-CAPTIONS'].forEach(function (type) {
    const groupId = stringValue(selected && selected.attributes && selected.attributes[type]);
    if (groupId && groupId.toUpperCase() !== 'NONE') referencedGroups[type + '\n' + groupId] = true;
  });

  const output = ['#EXTM3U'];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line || line === '#EXTM3U') continue;
    if (line.indexOf('#EXT-X-MEDIA:') === 0) {
      const attributes = parseHLSAttributes(line.slice('#EXT-X-MEDIA:'.length));
      const key = stringValue(attributes.TYPE).toUpperCase() + '\n' + stringValue(attributes['GROUP-ID']);
      if (referencedGroups[key]) output.push(absolutizeHLSAttributeURI(line, masterURL));
      continue;
    }
    if (line.indexOf('#EXT-X-STREAM-INF:') === 0) {
      if (index === numberValue(selected && selected.streamInfoIndex, -1)) {
        output.push(absolutizeHLSAttributeURI(line, masterURL));
        output.push(stringValue(selected && selected.url));
      }
      continue;
    }
    if (line.indexOf('#EXT-X-I-FRAME-STREAM-INF:') === 0) continue;
    if (line.charAt(0) === '#') output.push(absolutizeHLSAttributeURI(line, masterURL));
  }
  return output.join('\n') + '\n';
}

function absolutizeHLSAttributeURI(line, masterURL) {
  return stringValue(line)
    .replace(/(\bURI=)"([^"]*)"/gi, function (_, prefix, uri) {
      return prefix + '"' + resolveRelativeURL(uri, masterURL) + '"';
    })
    .replace(/(\bURI=)([^",\s][^,\s]*)/gi, function (_, prefix, uri) {
      return prefix + resolveRelativeURL(uri, masterURL);
    });
}

function parseHLSAttributes(value) {
  const output = {};
  const expression = /(?:^|,)([A-Z0-9-]+)=("[^"]*"|[^,]*)/g;
  let match;
  while ((match = expression.exec(stringValue(value)))) {
    output[match[1]] = stringValue(match[2]).replace(/^"|"$/g, '');
  }
  return output;
}

function hlsItagFromURL(url) {
  return numberValue(firstMatch(stringValue(url), [
    /\/itag\/(\d+)(?:\/|$)/i,
    /[?&]itag=(\d+)(?:&|$)/i
  ]), 0);
}

function selectAudioFormats(formats) {
  const audios = formats.filter(function (format) {
    return /^audio\/mp4(?:;|$)/i.test(stringValue(format && format.mimeType)) && directFormatURL(format) &&
      /^\d+-\d+$/.test(rangeString(format.initRange)) && /^\d+-\d+$/.test(rangeString(format.indexRange));
  });
  const byLanguage = {};
  audios.forEach(function (format) {
    const language = cleanText(format.audioTrack && (format.audioTrack.id || format.audioTrack.displayName)) || 'und';
    const existing = byLanguage[language];
    if (!existing || audioFormatScore(format) > audioFormatScore(existing)) byLanguage[language] = format;
  });
  return Object.keys(byLanguage).map(function (key) { return byLanguage[key]; }).sort(function (left, right) {
    return audioFormatScore(right) - audioFormatScore(left);
  }).slice(0, 6);
}

function dashDescriptor(format, isVideo, durationSeconds, config) {
  const init = rangeString(format.initRange);
  const index = rangeString(format.indexRange);
  const mime = cleanText(format.mimeType);
  const audioTrack = format.audioTrack || {};
  return {
    id: stringValue(format.itag),
    name: isVideo ? undefined : cleanText(audioTrack.displayName) || audioCodecName(mime),
    language: isVideo ? undefined : cleanText(audioTrack.id && audioTrack.id.split('.')[0]) || 'und',
    url: mediaURL(directFormatURL(format), config),
    fallbackURLs: googleVideoFallbackURLs(directFormatURL(format)).map(function (url) {
      return mediaURL(url, config);
    }),
    codec: codecFromMime(mime),
    mimeType: mime.split(';')[0] || (isVideo ? 'video/mp4' : 'audio/mp4'),
    bandwidth: numberValue(format.bitrate || format.averageBitrate, 0),
    width: isVideo ? numberValue(format.width, 0) : undefined,
    height: isVideo ? numberValue(format.height, 0) : undefined,
    frameRate: isVideo ? stringValue(format.fps) : undefined,
    videoRange: isVideo ? youtubeVideoRange(format) : undefined,
    durationSeconds: durationSeconds || numberValue(format.approxDurationMs, 0) / 1000,
    segmentBase: { initialization: init, indexRange: index }
  };
}

function googleVideoFallbackURLs(url) {
  const value = stringValue(url).replace(/&amp;/g, '&');
  const match = /^(https?:\/\/)([^/]+)(\/.*)$/i.exec(value);
  if (!match || !/(?:^|\.)googlevideo\.com$/i.test(match[2])) return [];
  const hostPrefix = /^([a-z0-9-]+---)sn-/i.exec(match[2]);
  if (!hostPrefix) return [];
  const hosts = decodeURIComponentSafe(urlParameter(value, 'mn')).split(',').map(function (host) {
    return cleanText(host);
  }).filter(function (host) {
    return /^sn-[a-z0-9-]+$/i.test(host);
  });
  return uniqueStrings(hosts.map(function (host) {
    return match[1] + hostPrefix[1] + host + '.googlevideo.com' + match[3];
  })).filter(function (candidate) {
    return candidate !== value;
  });
}

function subtitlesFromPlayer(player, config) {
  const renderer = player && player.captions && player.captions.playerCaptionsTracklistRenderer || {};
  return arrayValue(renderer.captionTracks).map(function (track, index) {
    const url = appendURLParameters(track.baseUrl, { fmt: 'vtt' });
    const language = cleanText(track.languageCode) || 'und';
    return {
      id: stringValue(track.vssId || language || index),
      title: cleanText(textValue(track.name)) || language,
      language,
      format: 'vtt',
      url,
      headers: mediaHeadersForPlayer(player),
      default: index === 0 && track.kind !== 'asr',
      forced: false,
      hearingImpaired: false
    };
  }).filter(function (track) { return !!track.url; });
}

async function ensurePoTokens(videoId, config) {
  if (config.poToken) {
    return {
      visitorData: config.visitorData || '',
      playerPoToken: config.poToken,
      streamingPoToken: config.poToken,
      expiresAt: 0
    };
  }
  if (typeof Widget === 'undefined' || !Widget.browser || typeof Widget.browser.fetch !== 'function') return null;

  try {
    const session = await bootstrapSession(config);
    let visitorData = config.visitorData || session.visitorData || '';
    if (!visitorData) {
      const html = await getText(YT_SITE + '/', baseHeaders(config), 18);
      visitorData = decodeURIComponentSafe(firstMatch(html, [
        /VISITOR_DATA\\?"\s*:\s*\\?"([^"\\]+)/,
        /visitorData\\?"\s*:\s*\\?"([^"\\]+)/
      ]));
      if (visitorData) {
        session.visitorData = visitorData;
        session.updatedAt = Date.now();
        writeCache('youtube.innertube.session.v1', JSON.stringify(session));
      }
    }
    if (!visitorData) return null;

    const cacheKey = 'youtube.potoken.v1.' + videoId;
    const cached = parseJSON(readCache(cacheKey));
    if (cached && cached.visitorData === visitorData && cached.playerPoToken && cached.streamingPoToken &&
        numberValue(cached.expiresAt, 0) > Date.now() + 60 * 1000) {
      return cached;
    }

    const resultKey = '__baiplay_youtube_potoken_' + randomToken(18);
    const result = await Widget.browser.fetch(YT_SITE + '/', {
      html: buildPoTokenDocument(visitorData, videoId, resultKey),
      baseURL: YT_SITE + '/',
      visible: false,
      timeout: 35,
      waitAfterLoad: 0.2,
      waitForLocalStorageKey: resultKey,
      headers: { 'User-Agent': YT_UA }
    });
    const storage = result && result.localStorage || {};
    let raw = storage[resultKey];
    if (!raw) {
      const frameStores = arrayValue(result && result.frameLocalStorage);
      for (let index = 0; index < frameStores.length && !raw; index += 1) raw = frameStores[index] && frameStores[index][resultKey];
    }
    const generated = parseJSON(raw);
    if (!generated || generated.error || !generated.playerPoToken || !generated.streamingPoToken) return null;
    generated.visitorData = visitorData;
    writeCache(cacheKey, JSON.stringify(generated));
    return generated;
  } catch (_) {
    return null;
  }
}

function buildPoTokenDocument(visitorData, videoId, resultKey) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>YouTube integrity check</title></head><body><script>
(function () {
  var RESULT_KEY = ${JSON.stringify(resultKey)};
  var VISITOR_DATA = ${JSON.stringify(visitorData)};
  var VIDEO_ID = ${JSON.stringify(videoId)};
  var API_KEY = ${JSON.stringify(YT_BOTGUARD_API_KEY)};
  var REQUEST_KEY = ${JSON.stringify(YT_BOTGUARD_REQUEST_KEY)};
  try { localStorage.removeItem(RESULT_KEY); } catch (_) {}

  function finish(value) {
    try { localStorage.setItem(RESULT_KEY, JSON.stringify(value)); } catch (_) {}
  }
  function bytesFromBase64(value) {
    var normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/').replace(/\\./g, '=');
    while (normalized.length % 4) normalized += '=';
    var binary = atob(normalized);
    var output = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) output[index] = binary.charCodeAt(index);
    return output;
  }
  function base64URLFromBytes(value) {
    var binary = '';
    for (var index = 0; index < value.length; index += 1) binary += String.fromCharCode(value[index]);
    return btoa(binary).replace(/\\+/g, '-').replace(/\\//g, '_');
  }
  function descramble(value) {
    var input = bytesFromBase64(value);
    var output = new Uint8Array(input.length);
    for (var index = 0; index < input.length; index += 1) output[index] = (input[index] + 97) & 255;
    return new TextDecoder().decode(output);
  }
  function firstString(value) {
    if (!Array.isArray(value)) return null;
    for (var index = 0; index < value.length; index += 1) if (typeof value[index] === 'string') return value[index];
    return null;
  }
  function parseChallenge(scrambled) {
    var data = scrambled.length > 1 && typeof scrambled[1] === 'string'
      ? JSON.parse(descramble(scrambled[1]))
      : scrambled[0];
    return {
      interpreterJavascript: firstString(data[1]),
      interpreterURL: firstString(data[2]),
      program: data[4],
      globalName: data[5]
    };
  }
  function serviceRequest(path, body) {
    return fetch('https://www.youtube.com' + path, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json+protobuf',
        'x-goog-api-key': API_KEY,
        'x-user-agent': 'grpc-web-javascript/0.1'
      },
      body: JSON.stringify(body)
    }).then(function (response) {
      if (!response.ok) throw new Error('BotGuard HTTP ' + response.status);
      return response.json();
    });
  }
  function loadBotGuard(challenge) {
    var vm = window[challenge.globalName];
    if (!vm || !vm.a) throw new Error('BotGuard VM unavailable');
    var functions = {};
    vm.a(challenge.program, function (asyncSnapshotFunction, shutdownFunction, passEventFunction, checkCameraFunction) {
      functions.asyncSnapshotFunction = asyncSnapshotFunction;
      functions.shutdownFunction = shutdownFunction;
      functions.passEventFunction = passEventFunction;
      functions.checkCameraFunction = checkCameraFunction;
    }, true, undefined, function () {}, [[], []])[0];
    return new Promise(function (resolve, reject) {
      var attempts = 0;
      var timer = setInterval(function () {
        if (functions.asyncSnapshotFunction) {
          clearInterval(timer);
          resolve(functions);
        } else if (++attempts >= 10000) {
          clearInterval(timer);
          reject(new Error('BotGuard snapshot timeout'));
        }
      }, 1);
    });
  }
  function snapshot(functions, webPoSignalOutput) {
    return new Promise(function (resolve, reject) {
      try {
        functions.asyncSnapshotFunction(function (response) { resolve(response); }, [
          undefined, undefined, webPoSignalOutput, undefined
        ]);
      } catch (error) { reject(error); }
    });
  }
  function mint(webPoSignalOutput, integrityToken, identifier) {
    var getMinter = webPoSignalOutput[0];
    if (!getMinter) throw new Error('PoToken minter unavailable');
    var callback = getMinter(integrityToken);
    if (typeof callback !== 'function') throw new Error('PoToken callback unavailable');
    var value = callback(new TextEncoder().encode(identifier));
    if (!(value instanceof Uint8Array)) throw new Error('Invalid PoToken result');
    return base64URLFromBytes(value);
  }

  serviceRequest('/api/jnn/v1/Create', [REQUEST_KEY]).then(async function (scrambled) {
    var challenge = parseChallenge(scrambled);
    var interpreter = challenge.interpreterJavascript;
    if (!interpreter && challenge.interpreterURL) {
      var response = await fetch(challenge.interpreterURL, { credentials: 'include' });
      if (!response.ok) throw new Error('BotGuard interpreter HTTP ' + response.status);
      interpreter = await response.text();
    }
    if (!interpreter) throw new Error('BotGuard interpreter unavailable');
    new Function(interpreter).call(window);
    var functions = await loadBotGuard(challenge);
    var webPoSignalOutput = [];
    var botguardResponse = await snapshot(functions, webPoSignalOutput);
    var integrityData = await serviceRequest('/api/jnn/v1/GenerateIT', [REQUEST_KEY, botguardResponse]);
    var integrityToken = bytesFromBase64(integrityData[0]);
    var expiresIn = Math.max(60, Number(integrityData[1] || 0) - 600);
    var streamingPoToken = mint(webPoSignalOutput, integrityToken, VISITOR_DATA);
    var playerPoToken = mint(webPoSignalOutput, integrityToken, VIDEO_ID);
    finish({
      playerPoToken: playerPoToken,
      streamingPoToken: streamingPoToken,
      expiresAt: Date.now() + expiresIn * 1000
    });
  }).catch(function (error) {
    finish({ error: String(error && error.message || error || 'PoToken failed') });
  });
})();
</script></body></html>`;
}

async function resolveWithBrowser(videoId, config, sourceReason) {
  if (typeof Widget === 'undefined' || !Widget.browser || typeof Widget.browser.fetch !== 'function') {
    throw new Error(sourceReason || 'YouTube 播放地址解析失败');
  }
  const result = await Widget.browser.fetch(YT_SITE + '/watch?v=' + encodeURIComponent(videoId), {
    visible: false,
    timeout: 45,
    waitAfterLoad: 2,
    waitForMediaSource: true,
    headers: baseHeaders(config)
  });
  const urls = browserMediaURLs(result);
  const hls = urls.filter(function (url) {
    return /(?:\.m3u8(?:\?|$)|\/api\/manifest\/hls)/i.test(url);
  })[0];
  if (hls) {
    return {
      url: hls, container: 'm3u8', headers: mediaHeaders(),
      isLive: true, streamKind: 'live'
    };
  }
  const progressiveItags = { 18: true, 22: true, 37: true, 38: true, 59: true, 78: true };
  const progressive = urls.filter(function (url) {
    const itag = numberValue(urlParameter(url, 'itag'), 0);
    const mime = decodeURIComponentSafe(urlParameter(url, 'mime'));
    return progressiveItags[itag] || mime.indexOf('video/mp4') >= 0 && url.indexOf('audio') >= 0;
  }).sort(function (left, right) {
    return numberValue(urlParameter(right, 'itag'), 0) - numberValue(urlParameter(left, 'itag'), 0);
  })[0];
  if (progressive) {
    return {
      url: progressive,
      container: 'mp4',
      headers: mediaHeaders(),
      isLive: false,
      streamKind: 'vod'
    };
  }
  throw new Error((sourceReason ? sourceReason + '；' : '') + '隐藏浏览器也没有捕获到带音频的可播放地址');
}

function canUseBrowserPlaybackFallback(config) {
  return !(config && config.accessToken) || !!(config && config.cookie);
}

function browserMediaURLs(result) {
  const values = [];
  arrayValue(result && result.mediaSources).forEach(function (url) {
    if (/^https?:\/\//i.test(stringValue(url))) values.push(stringValue(url));
  });
  arrayValue(result && result.capturedRequests).forEach(function (entry) {
    const url = stringValue(entry && (entry.url || entry.requestURL));
    if (/^https?:\/\//i.test(url) && /(?:googlevideo\.com|\.m3u8|\/videoplayback)/i.test(url)) values.push(url);
  });
  return uniqueStrings(values).filter(function (url) { return url.indexOf('range=') < 0; });
}

function findContinuationToken(root) {
  const renderers = findRenderers(root, 'continuationItemRenderer');
  for (let index = renderers.length - 1; index >= 0; index -= 1) {
    const renderer = renderers[index] || {};
    const endpoint = renderer.continuationEndpoint || {};
    const token = endpoint.continuationCommand && endpoint.continuationCommand.token ||
      endpoint.commandExecutorCommand && endpoint.commandExecutorCommand.commands &&
      endpoint.commandExecutorCommand.commands[0] && endpoint.commandExecutorCommand.commands[0].continuationCommand &&
      endpoint.commandExecutorCommand.commands[0].continuationCommand.token;
    if (token) return stringValue(token);
  }
  const commands = findObjectsWithKey(root, 'continuationCommand');
  for (let index = commands.length - 1; index >= 0; index -= 1) {
    if (commands[index] && commands[index].token) return stringValue(commands[index].token);
  }
  return '';
}

function findChannelVideosTab(root) {
  const tabs = findRenderers(root, 'tabRenderer');
  const preferred = ['视频', 'videos', '直播', 'live'];
  for (let nameIndex = 0; nameIndex < preferred.length; nameIndex += 1) {
    for (let tabIndex = 0; tabIndex < tabs.length; tabIndex += 1) {
      const tab = tabs[tabIndex] || {};
      const title = cleanText(textValue(tab.title)).toLowerCase();
      if (title !== preferred[nameIndex]) continue;
      const browse = tab.endpoint && tab.endpoint.browseEndpoint || {};
      return { browseId: stringValue(browse.browseId), params: stringValue(browse.params) };
    }
  }
  return null;
}

function findResumeSeconds(root, durationSeconds) {
  let result = 0;
  function walk(value) {
    if (!value || typeof value !== 'object' || result > 0) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (value.resumePlaybackPositionRenderer) {
      const renderer = value.resumePlaybackPositionRenderer;
      result = numberValue(renderer.startPositionSeconds || renderer.resumePositionSeconds, 0);
      if (result > 0) return;
    }
    if (value.thumbnailOverlayResumePlaybackRenderer) {
      const percent = numberValue(value.thumbnailOverlayResumePlaybackRenderer.percentDurationWatched, 0);
      if (percent > 0 && durationSeconds > 0) {
        result = durationSeconds * percent / 100;
        return;
      }
    }
    Object.keys(value).forEach(function (key) { walk(value[key]); });
  }
  walk(root);
  return result;
}

function findRenderers(root, rendererName) {
  const results = [];
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    Object.keys(value).forEach(function (key) {
      if (key === rendererName) results.push(value[key]);
      walk(value[key]);
    });
  }
  walk(root);
  return results;
}

function findFirstRenderer(root, rendererName) {
  return findRenderers(root, rendererName)[0] || null;
}

function findObjectsWithKey(root, targetKey) {
  const results = [];
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    Object.keys(value).forEach(function (key) {
      if (key === targetKey && value[key] && typeof value[key] === 'object') results.push(value[key]);
      walk(value[key]);
    });
  }
  walk(root);
  return results;
}

async function fetchOAuthClientIdentity() {
  const html = await getText(YT_SITE + '/tv', {
    'User-Agent': YT_TV_UA,
    Referer: YT_SITE + '/tv',
    'Accept-Language': 'en-US'
  }, 20);
  const inlineIdentity = html.match(/clientId:"([0-9]+-[^"]+\.apps\.googleusercontent\.com)",[A-Za-z_$][\w$]*:"([A-Za-z0-9_-]{16,})"/);
  if (inlineIdentity) {
    return { clientId: inlineIdentity[1], clientSecret: inlineIdentity[2] };
  }
  const scriptPath = firstMatch(html, [
    /<script\s+id="base-js"\s+src="([^"]+)"/i,
    /<script[^>]+src="([^"]+\/kabuki\/[^\"]+)"/i,
    /s\.src\s*=\s*['"]([^'"]+\/kabuki\/[^'"]+)['"]/i
  ]);
  if (!scriptPath) throw new Error('无法读取 YouTube TV 登录脚本');
  const scriptURL = absoluteURL(YT_SITE, scriptPath.replace(/&amp;/g, '&'));
  const script = await getText(scriptURL, {
    'User-Agent': YT_TV_UA,
    Referer: YT_SITE + '/tv'
  }, 20);
  const match = script.match(/clientId:"([0-9]+-[^"]+\.apps\.googleusercontent\.com)",[A-Za-z_$][\w$]*:"([A-Za-z0-9_-]{16,})",scopes:/);
  if (!match) throw new Error('YouTube TV 登录凭据格式已变化，请更新小程序');
  return { clientId: match[1], clientSecret: match[2] };
}

function canRefreshOAuth(config) {
  return !!(config && config.accessToken && config.refreshToken && config.oauthClientId && config.oauthClientSecret);
}

async function refreshOAuthIfNeeded(config, force) {
  if (!config || !config.accessToken || !config.refreshToken) return config;
  const previousAccessToken = config.accessToken;
  syncOAuthFromPersistedParameters(config);
  applyOAuthShadowIfNewer(config);
  if (force && config.accessToken !== previousAccessToken) return config;
  if (force && config.oauthForcedRefreshAttempted) return config;
  if (!force && numberValue(config.tokenExpiresAt, 0) - Date.now() > YT_TOKEN_REFRESH_LEEWAY_MS) return config;
  if (!config.oauthClientId || !config.oauthClientSecret) {
    throw loginError('YouTube 登录信息缺少续期凭据，请重新授权');
  }
  if (force) config.oauthForcedRefreshAttempted = true;

  let ownsRefresh = false;
  if (!activeOAuthRefresh) {
    activeOAuthRefresh = performCoordinatedOAuthRefresh(config);
    ownsRefresh = true;
  }
  const refresh = activeOAuthRefresh;
  try {
    const updates = await refresh;
    applyOAuthParameterValues(config, updates);
    return config;
  } finally {
    if (ownsRefresh && activeOAuthRefresh === refresh) activeOAuthRefresh = null;
  }
}

async function performCoordinatedOAuthRefresh(config) {
  let lease = null;
  const parameters = typeof Widget !== 'undefined' && Widget.parameters;
  if (parameters && typeof parameters.beginRefresh === 'function') {
    lease = parameters.beginRefresh({
      expectedName: 'AccessToken',
      expectedValue: config.accessToken,
      timeoutSeconds: 22
    });
    if (lease && lease.parameters) applyOAuthParameterValues(config, lease.parameters);
    if (!lease || lease.acquired !== true) {
      if (lease && lease.updated && canRefreshOAuth(config)) return oauthValuesFromConfig(config);
      throw new Error(lease && lease.timedOut
        ? '等待其他 YouTube 会话续期超时'
        : 'YouTube 会话续期未取得执行权');
    }
  }

  try {
    if (applyOAuthShadowIfNewer(config)) return oauthValuesFromConfig(config);
    return await performOAuthRefreshRequest(config);
  } finally {
    if (lease && lease.leaseId && parameters && typeof parameters.endRefresh === 'function') {
      parameters.endRefresh(lease.leaseId);
    }
  }
}

async function performOAuthRefreshRequest(config) {
  const data = await postOAuthJSON(YT_SITE + '/o/oauth2/token', {
    client_id: config.oauthClientId,
    client_secret: config.oauthClientSecret,
    refresh_token: config.refreshToken,
    grant_type: 'refresh_token'
  }, { 'User-Agent': YT_TV_UA });
  if (data && data.error) {
    const reason = cleanText(data.error_description || data.error);
    throw loginError('YouTube 登录续期失败' + (reason ? '：' + reason : '，请重新授权'));
  }
  if (!data || !data.access_token) throw loginError('YouTube 登录已失效，请重新授权');
  const updates = {
    AccessToken: stringValue(data.access_token),
    RefreshToken: stringValue(data.refresh_token || config.refreshToken),
    TokenExpiresAt: String(Date.now() + Math.max(60, numberValue(data.expires_in, 3600)) * 1000),
    OAuthClientId: config.oauthClientId,
    OAuthClientSecret: config.oauthClientSecret
  };
  cacheOAuthShadow(updates);
  if (parametersCanPersist()) {
    try {
      Widget.parameters.update(updates);
    } catch (_) {
      // Older hosts may expose update() with an empty fallback-manifest allowlist.
    }
  }
  applyOAuthParameterValues(config, updates);
  return updates;
}

function parametersCanPersist() {
  return typeof Widget !== 'undefined' && Widget.parameters && typeof Widget.parameters.update === 'function';
}

function syncOAuthFromPersistedParameters(config) {
  if (typeof Widget === 'undefined' || !Widget.parameters || typeof Widget.parameters.current !== 'function') {
    return false;
  }
  try {
    return applyOAuthParameterValues(config, Widget.parameters.current());
  } catch (_) {
    return false;
  }
}

function cacheOAuthShadow(values) {
  const normalized = oauthValuesFromObject(values);
  if (!normalized.AccessToken || !normalized.RefreshToken || !numberValue(normalized.TokenExpiresAt, 0)) return;
  writeCache(YT_OAUTH_SHADOW_CACHE_KEY, JSON.stringify(normalized));
}

function applyOAuthShadowIfNewer(config) {
  const cached = parseJSON(readCache(YT_OAUTH_SHADOW_CACHE_KEY));
  if (!cached || numberValue(cached.TokenExpiresAt, 0) <= numberValue(config && config.tokenExpiresAt, 0)) return false;
  return applyOAuthParameterValues(config, cached);
}

function oauthValuesFromObject(values) {
  values = values || {};
  return {
    AccessToken: stringValue(values.AccessToken || values.accessToken).trim(),
    RefreshToken: stringValue(values.RefreshToken || values.refreshToken).trim(),
    TokenExpiresAt: String(numberValue(values.TokenExpiresAt || values.tokenExpiresAt, 0)),
    OAuthClientId: stringValue(values.OAuthClientId || values.oauthClientId).trim(),
    OAuthClientSecret: stringValue(values.OAuthClientSecret || values.oauthClientSecret).trim()
  };
}

function applyOAuthParameterValues(config, values) {
  config = config || {};
  values = values || {};
  const previous = [
    config.accessToken, config.refreshToken, config.tokenExpiresAt,
    config.oauthClientId, config.oauthClientSecret
  ].join('|');
  const accessToken = stringValue(values.AccessToken || values.accessToken).trim();
  const refreshToken = stringValue(values.RefreshToken || values.refreshToken).trim();
  const tokenExpiresAt = numberValue(values.TokenExpiresAt || values.tokenExpiresAt, 0);
  const clientId = stringValue(values.OAuthClientId || values.oauthClientId).trim();
  const clientSecret = stringValue(values.OAuthClientSecret || values.oauthClientSecret).trim();
  if (accessToken) config.accessToken = accessToken;
  if (refreshToken) config.refreshToken = refreshToken;
  if (tokenExpiresAt > 0) config.tokenExpiresAt = tokenExpiresAt;
  if (clientId) config.oauthClientId = clientId;
  if (clientSecret) config.oauthClientSecret = clientSecret;
  return previous !== [
    config.accessToken, config.refreshToken, config.tokenExpiresAt,
    config.oauthClientId, config.oauthClientSecret
  ].join('|');
}

function oauthValuesFromConfig(config) {
  return oauthValuesFromObject(config);
}

function sidAuthorization(cookie, origin) {
  const values = [
    ['SAPISIDHASH', cookieValue(cookie, 'SAPISID') || cookieValue(cookie, '__Secure-3PAPISID')],
    ['SAPISID1PHASH', cookieValue(cookie, '__Secure-1PAPISID')],
    ['SAPISID3PHASH', cookieValue(cookie, '__Secure-3PAPISID')]
  ];
  const timestamp = Math.floor(Date.now() / 1000);
  return values.map(function (entry) {
    if (!entry[1]) return '';
    return entry[0] + ' ' + timestamp + '_' + sha1Hex(timestamp + ' ' + entry[1] + ' ' + origin);
  }).filter(Boolean).join(' ');
}

function sha1Hex(value) {
  const text = stringValue(value);
  if (typeof $crypto !== 'undefined' && $crypto && typeof $crypto.sha1 === 'function') return stringValue($crypto.sha1(text));
  if (typeof Widget !== 'undefined' && Widget.crypto && typeof Widget.crypto.sha1 === 'function') return stringValue(Widget.crypto.sha1(text));
  if (typeof require === 'function') return require('crypto').createHash('sha1').update(text).digest('hex');
  throw new Error('当前小程序环境缺少 SHA1 能力');
}

function cachePlaybackTracking(videoId, player) {
  const tracking = player && player.playbackTracking || {};
  const value = {
    playbackURL: stringValue(tracking.videostatsPlaybackUrl && tracking.videostatsPlaybackUrl.baseUrl),
    watchtimeURL: stringValue(tracking.videostatsWatchtimeUrl && tracking.videostatsWatchtimeUrl.baseUrl),
    cpn: randomToken(16),
    started: false
  };
  if (value.playbackURL || value.watchtimeURL) writeCache(playbackTrackingKey(videoId), JSON.stringify(value));
  return value;
}

function readPlaybackTracking(videoId) {
  return parseJSON(readCache(playbackTrackingKey(videoId)));
}

function playbackTrackingKey(videoId) {
  return 'youtube.playback.tracking.' + videoId;
}

function readConfig(ctx) {
  ctx = ctx || {};
  const params = Object.assign({}, ctx.config || {}, ctx.settings || {}, ctx.parameters || {}, ctx.params || {});
  const rawCookie = stringValue(params.Cookie || params.cookie || ctx.Cookie || ctx.cookie).trim();
  const config = {
    cookie: rawCookie.replace(/^cookie\s*:\s*/i, '').replace(/^['"]|['"]$/g, '').trim(),
    accessToken: stringValue(params.AccessToken || params.accessToken || ctx.AccessToken).trim(),
    refreshToken: stringValue(params.RefreshToken || params.refreshToken || ctx.RefreshToken).trim(),
    tokenExpiresAt: numberValue(params.TokenExpiresAt || params.tokenExpiresAt || ctx.TokenExpiresAt, 0),
    oauthClientId: stringValue(params.OAuthClientId || params.oauthClientId || ctx.OAuthClientId).trim(),
    oauthClientSecret: stringValue(params.OAuthClientSecret || params.oauthClientSecret || ctx.OAuthClientSecret).trim(),
    visitorData: stringValue(params.VisitorData || params.visitorData || ctx.VisitorData).trim(),
    poToken: stringValue(params.PoToken || params.poToken || ctx.PoToken).trim(),
    maxHeight: Math.max(360, numberValue(params.maxHeight || ctx.maxHeight, 2160)),
    preferredCodec: normalizeCodecPreference(params.preferredCodec || ctx.preferredCodec)
  };
  applyOAuthShadowIfNewer(config);
  return config;
}

function hasLogin(config) {
  return !!(config && (config.accessToken || cookieValue(config.cookie, 'SAPISID') || cookieValue(config.cookie, '__Secure-3PAPISID')));
}

function authenticationMode(config) {
  if (config && config.accessToken) return 'oauth';
  if (config && config.cookie) return 'cookie';
  return 'anonymous';
}

function requireLogin(config) {
  if (!hasLogin(config)) throw loginError('请先在右上角设置中登录 YouTube，或导入完整 Cookie');
}

function loginError(message) {
  const error = new Error(message);
  error.code = 'LOGIN_REQUIRED';
  return error;
}

function isLoginError(error) {
  if (!error) return false;
  if (error.code === 'LOGIN_REQUIRED') return true;
  return /(?:HTTP\s*401|登录授权.*(?:失效|未被)|unauthenticated|invalid credentials)/i.test(humanError(error));
}

function isOAuthAuthorizationFailure(value) {
  const text = cleanText(value && (value.status || value.message || value.error || value.error_description) || value);
  return /(?:UNAUTHENTICATED|LOGIN_REQUIRED|invalid[_ -]?(?:grant|token|credentials)|expired[_ -]?token|auth(?:entication|orization).*(?:failed|required|expired)|token.*expired)/i.test(text);
}

function responseAuthenticationState(response) {
  const context = response && response.responseContext || {};
  const webContext = context.mainAppWebResponseContext || {};
  if (webContext.loggedOut === true) return 'logged-out';
  if (webContext.loggedOut === false) return 'logged-in';
  const groups = arrayValue(context.serviceTrackingParams);
  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    const params = arrayValue(groups[groupIndex] && groups[groupIndex].params);
    for (let paramIndex = 0; paramIndex < params.length; paramIndex += 1) {
      const param = params[paramIndex] || {};
      if (stringValue(param.key).toLowerCase() !== 'logged_in') continue;
      return stringValue(param.value) === '1' ? 'logged-in' : 'logged-out';
    }
  }
  return 'unknown';
}

function isPrivatePage(pageId) {
  return ['feed:continue', 'feed:subscriptions', 'feed:history', 'feed:playlists', 'feed:channels', 'playlist:WL', 'playlist:LL'].some(function (prefix) {
    return pageId === prefix || pageId.indexOf(prefix) === 0;
  });
}

function pageTitle(pageId) {
  const titles = {
    'feed:home': '为你推荐',
    'feed:continue': '继续观看',
    'feed:subscriptions': '订阅更新',
    'feed:history': '观看历史',
    'feed:playlists': '我的播放列表',
    'feed:channels': '订阅的频道',
    'playlist:WL': '稍后观看',
    'playlist:LL': '喜欢的视频'
  };
  if (titles[pageId]) return titles[pageId];
  if (pageId.indexOf('destination:') === 0) {
    const destination = DESTINATIONS[pageId.slice('destination:'.length)];
    return destination && destination.title || 'YouTube';
  }
  if (pageId.indexOf('search:') === 0) return decodeURIComponent(pageId.slice('search:'.length));
  return 'YouTube';
}

function categoryAction(pageId, title) {
  return { type: 'category', pageId, title, itemAspectRatio: pageId === 'search:#Shorts' ? '9:16' : '16:9' };
}

function emptySection(id, title, style, subtitle) {
  return {
    id: id || 'youtube-empty',
    title: title || 'YouTube',
    style: style || 'discover.standard',
    subtitle: subtitle || '暂无内容',
    lazy: false,
    items: []
  };
}

function humanError(error) {
  const message = cleanText(error && error.message ? error.message : error);
  return message || '加载失败，请稍后重试';
}

function playabilityError(player) {
  const status = player && player.playabilityStatus || {};
  if (!status.status || status.status === 'OK') return '';
  const reason = cleanText(status.reason || textValue(status.messages && status.messages[0]));
  if (status.status === 'LOGIN_REQUIRED') return 'YouTube 要求登录确认当前播放请求，请先完成设备授权';
  if (/members.only|会员|members-only/i.test(reason)) return '该视频仅限频道会员观看';
  if (/private|私享|私人/i.test(reason)) return '该视频是私人视频';
  if (/not available|unavailable|无法观看|不可用/i.test(reason)) return reason || '该视频当前不可用';
  return reason || ('YouTube 播放状态：' + status.status);
}

function rendererBadgeTexts(renderer) {
  const values = [];
  arrayValue(renderer && renderer.badges).concat(arrayValue(renderer && renderer.ownerBadges)).forEach(function (entry) {
    const badge = entry && entry.metadataBadgeRenderer || {};
    const text = cleanText(badge.label || badge.tooltip || badge.accessibilityData && badge.accessibilityData.label);
    if (text) values.push(text);
  });
  return uniqueStrings(values);
}

function textValue(value) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return stringValue(value);
  if (value.simpleText != null) return stringValue(value.simpleText);
  if (value.content != null) return stringValue(value.content);
  if (Array.isArray(value.runs)) return value.runs.map(function (run) { return stringValue(run && run.text); }).join('');
  if (value.accessibility && value.accessibility.accessibilityData) return stringValue(value.accessibility.accessibilityData.label);
  return '';
}

function firstRun(value) {
  return value && Array.isArray(value.runs) ? value.runs[0] : null;
}

function endpointBrowseId(endpoint) {
  return stringValue(endpoint && endpoint.browseEndpoint && endpoint.browseEndpoint.browseId);
}

function firstEndpointCommand(value, depth) {
  if (!value || typeof value !== 'object' || numberValue(depth, 0) > 8) return {};
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const command = firstEndpointCommand(value[index], numberValue(depth, 0) + 1);
      if (Object.keys(command).length) return command;
    }
    return {};
  }
  if (value.watchEndpoint || value.reelWatchEndpoint || value.watchPlaylistEndpoint || value.browseEndpoint) {
    return value;
  }
  const preferredKeys = [
    'innertubeCommand', 'navigationEndpoint', 'onSelectCommand', 'onTap',
    'command', 'commandContext', 'commandExecutorCommand', 'serialCommand', 'commands'
  ];
  for (let index = 0; index < preferredKeys.length; index += 1) {
    const nested = value[preferredKeys[index]];
    const command = firstEndpointCommand(nested, numberValue(depth, 0) + 1);
    if (Object.keys(command).length) return command;
  }
  return {};
}

function videoIdFromEndpoint(value) {
  const endpoint = firstEndpointCommand(value);
  return videoIdFrom(
    endpoint.watchEndpoint && endpoint.watchEndpoint.videoId ||
    endpoint.reelWatchEndpoint && endpoint.reelWatchEndpoint.videoId ||
    endpoint.commandMetadata && endpoint.commandMetadata.webCommandMetadata && endpoint.commandMetadata.webCommandMetadata.url
  );
}

function endpointBrowseIdDeep(value) {
  return endpointBrowseId(firstEndpointCommand(value));
}

function playlistIdFromEndpoint(value) {
  const endpoint = firstEndpointCommand(value);
  return playlistIdFrom(
    endpoint.watchPlaylistEndpoint && endpoint.watchPlaylistEndpoint.playlistId ||
    endpoint.watchEndpoint && endpoint.watchEndpoint.playlistId ||
    endpoint.browseEndpoint && endpoint.browseEndpoint.browseId ||
    endpoint.commandMetadata && endpoint.commandMetadata.webCommandMetadata && endpoint.commandMetadata.webCommandMetadata.url
  );
}

function bestThumbnail(value) {
  if (!value) return '';
  let thumbnails = arrayValue(value.thumbnails || value.sources || value);
  if (!thumbnails.length && value.image && value.image.sources) thumbnails = arrayValue(value.image.sources);
  const selected = thumbnails.filter(Boolean).sort(function (left, right) {
    return numberValue(right.width, 0) * numberValue(right.height, 0) - numberValue(left.width, 0) * numberValue(left.height, 0);
  })[0];
  return imageURL(selected && (selected.url || selected.src));
}

function thumbnailFromRendererVideos(renderer) {
  const videos = arrayValue(renderer && renderer.videos);
  for (let index = 0; index < videos.length; index += 1) {
    const item = videoItem(videos[index] && (videos[index].childVideoRenderer || videos[index].playlistVideoRenderer));
    if (item && item.poster) return item.poster;
  }
  return '';
}

function videoThumbnail(videoId, size) {
  return 'https://i.ytimg.com/vi/' + encodeURIComponent(videoId) + '/' + (size || 'hqdefault') + '.jpg';
}

function imageURL(value) {
  const url = stringValue(value).replace(/&amp;/g, '&');
  if (!url) return '';
  if (url.indexOf('//') === 0) return 'https:' + url;
  return url;
}

function imageHeaders() {
  return { Referer: YT_SITE + '/', 'User-Agent': YT_UA };
}

function mediaHeaders(clientName) {
  if (stringValue(clientName).toUpperCase() === 'TVHTML5') {
    return { Origin: YT_SITE, Referer: YT_SITE + '/tv', 'User-Agent': YT_TV_UA };
  }
  return { Origin: YT_SITE, Referer: YT_SITE + '/', 'User-Agent': YT_UA };
}

function mediaHeadersFromClient(client) {
  const clientName = stringValue(client && client.clientName).toUpperCase();
  const headers = { 'User-Agent': client && client.userAgent || YT_UA };
  if (/^(?:IOS|ANDROID|ANDROID_VR|VISIONOS)$/.test(clientName)) return headers;
  headers.Origin = YT_SITE;
  headers.Referer = client && client.referer || (clientName === 'TVHTML5' ? YT_SITE + '/tv' : YT_SITE + '/');
  return headers;
}

function mediaHeadersForPlayer(player) {
  const headers = player && player.__baiPlayMediaHeaders;
  if (headers && typeof headers === 'object') return Object.assign({}, headers);
  return mediaHeaders(player && player.__baiPlayClientName);
}

function mediaConfigForPlayer(config, player) {
  const output = Object.assign({}, config || {});
  output.playbackNonce = stringValue(player && player.__baiPlayPlaybackNonce);
  output.streamingPoToken = '';
  const expiresAt = numberValue(player && player.__baiPlayPoTokenExpiresAt, 0);
  if (player && player.__baiPlayStreamingPoToken && (!expiresAt || expiresAt > Date.now() + 30 * 1000)) {
    output.streamingPoToken = stringValue(player.__baiPlayStreamingPoToken);
  }
  return output;
}

function statsHeaders(config) {
  const headers = baseHeaders(config);
  headers.Accept = '*/*';
  return headers;
}

function baseHeaders(config) {
  const headers = {
    Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
    'User-Agent': YT_UA,
    Referer: YT_SITE + '/'
  };
  if (config && config.cookie) headers.Cookie = config.cookie;
  return headers;
}

function directFormatURL(format) {
  return stringValue(format && format.url);
}

function isVideoFormat(format) {
  return /^video\//i.test(stringValue(format && format.mimeType));
}

function isAudioFormat(format) {
  return /^audio\//i.test(stringValue(format && format.mimeType));
}

function isProgressiveFormat(format) {
  return isVideoFormat(format) && !!(format && format.audioQuality);
}

function isBaiPlayVideoFormat(format) {
  if (!isVideoFormat(format) || !directFormatURL(format)) return false;
  if (isProgressiveFormat(format)) return containerFromMime(format.mimeType) === 'mp4';
  return /^video\/mp4(?:;|$)/i.test(stringValue(format.mimeType)) &&
    /^\d+-\d+$/.test(rangeString(format.initRange)) &&
    /^\d+-\d+$/.test(rangeString(format.indexRange));
}

function compareVideoFormats(config) {
  return function (left, right) {
    return numberValue(right.height, 0) - numberValue(left.height, 0) ||
      numberValue(right.fps, 0) - numberValue(left.fps, 0) ||
      videoCodecScore(right, config) - videoCodecScore(left, config) ||
      numberValue(right.bitrate, 0) - numberValue(left.bitrate, 0);
  };
}

function videoCodecScore(format, config) {
  const codec = codecFromMime(format && format.mimeType).toLowerCase();
  const preference = config && config.preferredCodec || 'auto';
  if (preference === 'h264') return /^avc[13]/.test(codec) ? 100 : /^vp0?9/.test(codec) ? 40 : 20;
  if (preference === 'vp9') return /^vp0?9/.test(codec) ? 100 : /^avc[13]/.test(codec) ? 50 : 30;
  if (preference === 'av1') return /^av01/.test(codec) ? 100 : /^vp0?9/.test(codec) ? 60 : 40;
  if (/^(avc1|avc3|hvc1|hev1)/.test(codec)) return 90;
  if (/^vp0?9/.test(codec)) return 70;
  if (/^av01/.test(codec)) return 60;
  return 20;
}

function audioFormatScore(format) {
  const codec = codecFromMime(format && format.mimeType).toLowerCase();
  const codecScore = /^mp4a/.test(codec) ? 1000000000 : /opus/.test(codec) ? 500000000 : 0;
  const defaultScore = format && format.audioTrack && format.audioTrack.audioIsDefault ? 10000000 : 0;
  return codecScore + defaultScore + numberValue(format && (format.averageBitrate || format.bitrate), 0);
}

function formatSubtitle(format) {
  const mime = cleanText(format && format.mimeType);
  const parts = [codecDisplayName(codecFromMime(mime))];
  if (numberValue(format && format.fps, 0) > 30) parts.push(format.fps + ' FPS');
  const range = youtubeVideoRange(format);
  if (range && range !== 'SDR') parts.push(range);
  if (numberValue(format && format.bitrate, 0) > 0) parts.push(formatBitrate(format.bitrate));
  return uniqueStrings(parts).filter(Boolean).join(' · ');
}

function codecFromMime(mime) {
  const match = stringValue(mime).match(/codecs="([^"]+)"/i);
  return match ? match[1].split(',')[0].trim() : '';
}

function codecDisplayName(codec) {
  const value = stringValue(codec).toLowerCase();
  if (/^(avc1|avc3)/.test(value)) return 'H.264';
  if (/^(hvc1|hev1)/.test(value)) return 'HEVC';
  if (/^vp0?9/.test(value)) return 'VP9';
  if (/^av01/.test(value)) return 'AV1';
  return codec || '视频';
}

function audioCodecName(mime) {
  const codec = codecFromMime(mime).toLowerCase();
  if (/^mp4a/.test(codec)) return 'AAC';
  if (/opus/.test(codec)) return 'Opus';
  if (/ac-3|ec-3/.test(codec)) return 'Dolby Audio';
  return codec || '音轨';
}

function youtubeVideoRange(format) {
  const value = stringValue(format && (format.qualityLabel || format.colorInfo && format.colorInfo.transferCharacteristics)).toLowerCase();
  if (/hdr|smpte2084|pq/.test(value)) return 'HDR';
  return 'SDR';
}

function rangeString(range) {
  if (!range) return '';
  const start = numberValue(range.start, -1);
  const end = numberValue(range.end, -1);
  return start >= 0 && end >= start ? start + '-' + end : '';
}

function validDashDescriptor(track) {
  return !!(track && track.url && /^(?:video|audio)\/mp4$/i.test(stringValue(track.mimeType)) &&
    /^\d+-\d+$/.test(track.segmentBase && track.segmentBase.initialization) &&
    /^\d+-\d+$/.test(track.segmentBase && track.segmentBase.indexRange));
}

function containerFromMime(mime) {
  const value = stringValue(mime).toLowerCase();
  if (value.indexOf('webm') >= 0) return 'webm';
  return 'mp4';
}

function mediaURL(url, config) {
  let value = stringValue(url).replace(/&amp;/g, '&');
  if (!value) return '';
  if (config && config.playbackNonce && /^https?:\/\/[^/]+\.googlevideo\.com\/videoplayback(?:[?]|$)/i.test(value)) {
    value = appendURLParameters(value, { cpn: config.playbackNonce });
  }
  const streamingPoToken = config && config.streamingPoToken;
  if (streamingPoToken && value.indexOf('pot=') < 0 && value.indexOf('/pot/') < 0 && value.indexOf('sabr=1') < 0) {
    if (/\.m3u8(?:[?#]|$)/i.test(value)) value = appendHLSStreamingPoToken(value, streamingPoToken);
    else value = appendURLParameters(value, { pot: streamingPoToken });
  }
  return value;
}

function appendHLSStreamingPoToken(url, token) {
  const value = stringValue(url);
  const suffixIndex = value.search(/[?#]/);
  const path = suffixIndex >= 0 ? value.slice(0, suffixIndex) : value;
  const suffix = suffixIndex >= 0 ? value.slice(suffixIndex) : '';
  const encoded = encodeURIComponent(stringValue(token));
  const manifestSuffix = /(\/(?:file|playlist)\/index\.m3u8)$/i;
  if (manifestSuffix.test(path)) return path.replace(manifestSuffix, '/pot/' + encoded + '$1') + suffix;
  return path.replace(/\/$/, '') + '/pot/' + encoded + suffix;
}

function overlayDurationText(renderer) {
  const overlays = arrayValue(renderer && renderer.thumbnailOverlays);
  for (let index = 0; index < overlays.length; index += 1) {
    const time = overlays[index] && overlays[index].thumbnailOverlayTimeStatusRenderer;
    if (time) return cleanText(textValue(time.text));
  }
  return '';
}

function durationFromText(value) {
  const parts = stringValue(value).trim().split(':').map(Number);
  if (!parts.length || parts.some(function (part) { return !isFinite(part); })) return 0;
  return parts.reduce(function (total, part) { return total * 60 + part; }, 0);
}

function formatBitrate(value) {
  const bitrate = numberValue(value, 0);
  if (bitrate >= 1000000) return (bitrate / 1000000).toFixed(bitrate >= 10000000 ? 0 : 1) + ' Mbps';
  if (bitrate >= 1000) return Math.round(bitrate / 1000) + ' Kbps';
  return '';
}

function formatCount(value) {
  const number = numberValue(value, 0);
  if (!number) return '';
  if (number >= 100000000) return (number / 100000000).toFixed(1) + '亿次观看';
  if (number >= 10000) return (number / 10000).toFixed(1) + '万次观看';
  return number + '次观看';
}

function isActiveLiveVideo(player, primary, microformat) {
  const details = player && player.videoDetails || {};
  const liveDetails = microformat && microformat.liveBroadcastDetails || {};
  const viewRenderer = primary && primary.viewCount && primary.viewCount.videoViewCountRenderer || {};
  return details.isLive === true ||
    details.isLiveNow === true ||
    liveDetails.isLiveNow === true ||
    viewRenderer.isLive === true;
}

function likeCountFromNext(next) {
  const buttons = findObjectsWithKey(next, 'buttonViewModel');
  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index] || {};
    if (stringValue(button.iconName).toUpperCase() !== 'LIKE') continue;
    const title = cleanText(button.title || button.accessibilityText);
    if (title && !/^(?:喜欢|喜歡|like)$/i.test(title)) return title;
  }
  const toggles = findRenderers(next, 'toggleButtonRenderer');
  for (let index = 0; index < toggles.length; index += 1) {
    const toggle = toggles[index] || {};
    if (stringValue(toggle.defaultIcon && toggle.defaultIcon.iconType).toUpperCase() !== 'LIKE') continue;
    const title = cleanText(textValue(toggle.defaultText || toggle.defaultTooltip));
    if (title && !/^(?:喜欢|喜歡|like)$/i.test(title)) return title;
  }
  return '';
}

function normalizedPublishDate(value) {
  const text = stringValue(value).trim();
  if (!text) return '';
  const match = text.match(/(\d{4})\D{0,3}(\d{1,2})\D{0,3}(\d{1,2})/);
  if (!match) return '';
  return match[1] + '-' + pad2(match[2]) + '-' + pad2(match[3]);
}

function cleanPublishDateText(value) {
  return cleanText(value)
    .replace(/^(?:直播开始日期|直播開始日期|首播日期|发布日期|發佈日期|上传日期|上傳日期)\s*[：:]\s*/i, '');
}

function yearFromDate(value) {
  const match = stringValue(value).match(/(\d{4})/);
  return match ? numberValue(match[1], 0) : undefined;
}

async function getText(url, headers, timeout) {
  const response = await rawGET(url, headers, timeout);
  const raw = response && response.data !== undefined
    ? response.data
    : response && response.body !== undefined
      ? response.body
      : response;
  return typeof raw === 'string' ? raw : raw == null ? '' : JSON.stringify(raw);
}

async function rawGET(url, headers, timeout) {
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const response = await Widget.http.get(url, { headers: headers || {}, timeout: timeout || 18 });
    assertHTTPResponse(response, 'YouTube');
    return response;
  }
  if (typeof fetch === 'function') {
    const response = await fetch(url, { method: 'GET', headers: headers || {}, redirect: 'follow' });
    const text = await response.text();
    if (!response.ok) throw new Error('YouTube HTTP ' + response.status);
    return text;
  }
  throw new Error('当前小程序环境缺少 HTTP GET 能力');
}

async function postJSON(url, body, headers) {
  let response;
  const requestHeaders = Object.assign({ 'Content-Type': 'application/json' }, headers || {});
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.post === 'function') {
    response = await Widget.http.post(url, JSON.stringify(body || {}), { headers: requestHeaders, timeout: 22 });
    assertHTTPResponse(response, 'YouTube', !!requestHeaders.Authorization);
  } else if (typeof fetch === 'function') {
    const fetched = await fetch(url, {
      method: 'POST', headers: requestHeaders, body: JSON.stringify(body || {}), redirect: 'follow'
    });
    const text = await fetched.text();
    if (!fetched.ok) {
      if (fetched.status === 401 && requestHeaders.Authorization) {
        throw loginError('YouTube 登录授权已失效或未被接口接受，请重新登录');
      }
      throw new Error('YouTube HTTP ' + fetched.status);
    }
    response = text;
  } else {
    throw new Error('当前小程序环境缺少 HTTP POST 能力');
  }
  const raw = response && response.data !== undefined
    ? response.data
    : response && response.body !== undefined
      ? response.body
      : response;
  if (raw && typeof raw === 'object') return raw;
  const parsed = parseJSON(raw);
  if (parsed) return parsed;
  throw new Error('YouTube 接口返回的不是 JSON');
}

async function postOAuthJSON(url, values, headers) {
  const requestHeaders = Object.assign({
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }, headers || {});
  const body = JSON.stringify(values || {});
  let response;
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.post === 'function') {
    response = await Widget.http.post(url, body, { headers: requestHeaders, timeout: 22 });
  } else if (typeof fetch === 'function') {
    const fetched = await fetch(url, {
      method: 'POST', headers: requestHeaders, body, redirect: 'follow'
    });
    response = await fetched.text();
    if (!fetched.ok && !parseJSON(response)) throw new Error('YouTube OAuth HTTP ' + fetched.status);
  } else {
    throw new Error('当前小程序环境缺少 HTTP POST 能力');
  }
  const raw = response && response.data !== undefined
    ? response.data
    : response && response.body !== undefined
      ? response.body
      : response;
  const parsed = raw && typeof raw === 'object' ? raw : parseJSON(raw);
  if (parsed) return parsed;
  const status = numberValue(response && (response.status || response.statusCode), 0);
  if (status >= 400) throw new Error('YouTube OAuth HTTP ' + status);
  throw new Error('YouTube OAuth 接口返回的不是 JSON');
}

function assertHTTPResponse(response, subject, wasAuthenticated) {
  const status = numberValue(response && (response.status || response.statusCode), 200);
  if (status === 401 && wasAuthenticated) {
    throw loginError('YouTube 登录授权已失效或未被接口接受，请重新登录');
  }
  if (status >= 400) throw new Error((subject || '请求') + ' HTTP ' + status);
}

function encodePlaybackPayload(value) {
  return 'ytplay://' + encodeURIComponent(JSON.stringify(value || {}));
}

function decodePlaybackPayload(value) {
  const text = stringValue(value);
  if (text.indexOf('ytplay://') !== 0) return {};
  return parseJSON(decodeURIComponentSafe(text.slice('ytplay://'.length))) || {};
}

function decodeAuthenticationToken(value) {
  return parseJSON(decodeURIComponentSafe(stringValue(value))) || null;
}

function videoIdFrom(value) {
  if (value && typeof value === 'object') {
    return videoIdFrom(
      value.videoId ||
      value.YouTubeVideoId ||
      value.providerIds && value.providerIds.YouTubeVideoId ||
      value.action && value.action.itemId ||
      videoIdFromEndpoint(value)
    );
  }
  const text = stringValue(value).trim();
  if (!text) return '';
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text;
  const payload = decodePlaybackPayload(text);
  if (payload.videoId) return videoIdFrom(payload.videoId);
  const parsed = parseJSON(text);
  if (parsed && parsed !== value) {
    const parsedId = videoIdFrom(parsed);
    if (parsedId) return parsedId;
  }
  const prefixed = text.match(/^(?:(?:youtube|yt)[\s:|/-]*)?(?:video|watch)[\s:|/-]+([A-Za-z0-9_-]{11})$/i);
  if (prefixed) return prefixed[1];
  const match = text.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/|embed\/)|[?&]v=)([A-Za-z0-9_-]{11})/i);
  if (match) return match[1];
  const decoded = decodeURIComponentSafe(text);
  if (decoded !== text) return videoIdFrom(decoded);
  return match ? match[1] : '';
}

function firstVideoId(values) {
  const candidates = arrayValue(values);
  for (let index = 0; index < candidates.length; index += 1) {
    const videoId = videoIdFrom(candidates[index]);
    if (videoId) return videoId;
  }
  return '';
}

function playlistIdFrom(value) {
  const text = stringValue(value).trim();
  if (!text) return '';
  const queryMatch = text.match(/[?&]list=([A-Za-z0-9_-]+)/i);
  if (queryMatch) return queryMatch[1].replace(/^VL/, '');
  const prefixed = text.match(/^(?:playlist[\s:|/-]+|VL)([A-Za-z0-9_-]+)$/i);
  if (prefixed) return prefixed[1].replace(/^VL/, '');
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_|WL)[A-Za-z0-9_-]*$/i.test(text)) return text.replace(/^VL/, '');
  return '';
}

function playlistBrowseId(value) {
  const playlistId = stringValue(value).replace(/^VL/, '');
  return 'VL' + playlistId;
}

function findFirstMatchValue(value, expressions) {
  return firstMatch(stringValue(value), expressions);
}

function firstMatch(value, expressions) {
  for (let index = 0; index < expressions.length; index += 1) {
    const match = stringValue(value).match(expressions[index]);
    if (match && match[1]) return match[1];
  }
  return '';
}

function absoluteURL(base, path) {
  const value = stringValue(path).replace(/&amp;/g, '&');
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  return stringValue(base).replace(/\/$/, '') + '/' + value.replace(/^\//, '');
}

function resolveRelativeURL(path, base) {
  const value = stringValue(path).replace(/&amp;/g, '&');
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  try {
    if (typeof URL !== 'undefined') return new URL(value, stringValue(base)).toString();
  } catch (_) {}
  const origin = firstMatch(stringValue(base), [/^(https?:\/\/[^/]+)/i]);
  if (value.charAt(0) === '/') return origin + value;
  const directory = stringValue(base).replace(/[?#].*$/, '').replace(/\/[^/]*$/, '/');
  return directory + value;
}

function appendURLParameters(url, params) {
  let value = stringValue(url);
  if (!value) return '';
  Object.keys(params || {}).forEach(function (key) {
    const encoded = encodeURIComponent(key) + '=' + encodeURIComponent(stringValue(params[key]));
    const expression = new RegExp('([?&])' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=[^&]*');
    if (expression.test(value)) value = value.replace(expression, '$1' + encoded);
    else value += (value.indexOf('?') >= 0 ? '&' : '?') + encoded;
  });
  return value;
}

function normalizeStatsURL(value) {
  return stringValue(value).replace(/^https:\/\/s\./, 'https://www.');
}

function urlParameter(url, name) {
  const match = stringValue(url).match(new RegExp('[?&]' + name + '=([^&]*)'));
  return match ? match[1] : '';
}

function cookieValue(cookie, name) {
  const expression = new RegExp('(?:^|;\\s*)' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]+)', 'i');
  const match = stringValue(cookie).match(expression);
  return match ? match[1] : '';
}

function randomIdentifier() {
  return randomToken(8) + '-' + randomToken(4) + '-' + randomToken(4) + '-' + randomToken(4) + '-' + randomToken(12);
}

function randomToken(length) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let value = '';
  for (let index = 0; index < length; index += 1) value += alphabet[Math.floor(Math.random() * alphabet.length)];
  return value;
}

function readContinuation(cacheId, page) {
  return stringValue(readCache(continuationKey(cacheId, page)));
}

function writeContinuation(cacheId, page, token) {
  writeCache(continuationKey(cacheId, page), stringValue(token));
}

function hasContinuation(cacheId, page) {
  return !!readContinuation(cacheId, page);
}

function continuationKey(cacheId, page) {
  return 'youtube.continuation.' + stringValue(cacheId).replace(/[^A-Za-z0-9_.:-]/g, '_') + '.' + page;
}

function channelTabKey(channelId) {
  return 'youtube.channel.tab.' + stringValue(channelId);
}

function readCache(key) {
  try {
    if (typeof $cache !== 'undefined' && $cache && typeof $cache.get === 'function') return $cache.get(key);
    if (typeof Widget !== 'undefined' && Widget.cache && typeof Widget.cache.get === 'function') return Widget.cache.get(key);
  } catch (_) {}
  return '';
}

function writeCache(key, value) {
  try {
    if (typeof $cache !== 'undefined' && $cache && typeof $cache.set === 'function') return $cache.set(key, value);
    if (typeof Widget !== 'undefined' && Widget.cache && typeof Widget.cache.set === 'function') return Widget.cache.set(key, value);
  } catch (_) {}
  return undefined;
}

function removeCache(key) {
  try {
    if (typeof $cache !== 'undefined' && $cache && typeof $cache.remove === 'function') return $cache.remove(key);
    if (typeof Widget !== 'undefined' && Widget.cache && typeof Widget.cache.remove === 'function') return Widget.cache.remove(key);
  } catch (_) {}
  return undefined;
}

function parseJSON(value) {
  if (value && typeof value === 'object') return value;
  try {
    const text = stringValue(value).trim();
    return text ? JSON.parse(text) : null;
  } catch (_) {
    return null;
  }
}

function decodeURIComponentSafe(value) {
  try { return decodeURIComponent(stringValue(value)); } catch (_) { return stringValue(value); }
}

function normalizeCodecPreference(value) {
  const text = stringValue(value).toLowerCase();
  return ['auto', 'h264', 'vp9', 'av1'].indexOf(text) >= 0 ? text : 'auto';
}

function cleanText(value) {
  return stringValue(value).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

function cleanMultilineText(value) {
  return stringValue(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(function (line) { return line.replace(/[\t\f\v ]+/g, ' ').trim(); })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stringValue(value) {
  return value == null ? '' : String(value);
}

function numberValue(value, fallback) {
  const number = Number(value);
  return isFinite(number) ? number : (fallback == null ? 0 : fallback);
}

function truthyValue(value) {
  if (value === true || value === 1) return true;
  return /^(?:1|true|yes|on)$/i.test(stringValue(value).trim());
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueStrings(values) {
  const seen = {};
  return arrayValue(values).map(stringValue).filter(function (value) {
    if (!value || seen[value]) return false;
    seen[value] = true;
    return true;
  });
}

function uniqueItems(values) {
  const seen = {};
  return arrayValue(values).filter(function (item) {
    const key = item && item.type + ':' + item.id;
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function joinText(values) {
  return uniqueStrings(arrayValue(values).map(cleanText).filter(Boolean)).join(' · ');
}

function titleSimilarity(left, right) {
  const a = cleanText(left).toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]/g, '');
  const b = cleanText(right).toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]/g, '');
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.indexOf(b) >= 0 || b.indexOf(a) >= 0) return 78;
  const shorter = a.length < b.length ? a : b;
  let common = 0;
  for (let index = 0; index < shorter.length; index += 1) {
    if (a.indexOf(shorter[index]) >= 0 && b.indexOf(shorter[index]) >= 0) common += 1;
  }
  return Math.round(common / Math.max(a.length, b.length) * 100);
}

function pad2(value) {
  const number = numberValue(value, 0);
  return number < 10 ? '0' + number : String(number);
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
function resolvePlay(ctx) { return resolvePlayback(ctx || {}); }
function play(ctx) { return resolvePlayback(ctx || {}); }
function getPlayinfo(ctx) { return resolvePlayback(ctx || {}); }
function getSearch(ctx) { return search(ctx || {}); }
function onSearch(ctx) { return search(ctx || {}); }

const YouTubeMiniLibrary = {
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
  resolvePlayback,
  resolvePlay,
  play,
  getPlayinfo,
  getPlaybackProgress,
  reportPlaybackProgress,
  search,
  getSearch,
  onSearch,
  matchResources,
  matchMovie,
  matchEpisode,
  startAuthentication,
  pollAuthentication,
  logoutAuthentication
};

if (typeof module !== 'undefined' && module.exports) module.exports = YouTubeMiniLibrary;
if (typeof globalThis !== 'undefined') {
  Object.keys(YouTubeMiniLibrary).forEach(function (key) {
    globalThis[key] = YouTubeMiniLibrary[key];
  });
}
