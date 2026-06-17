// @name Live TV Mini Library

const WidgetMetadata = {
  id: 'live-tv-mini-library',
  name: '电视直播',
  title: '电视直播',
  version: '1.0.0',
  author: 'baiPlay',
  description: '通过 M3U/M3U8 直播订阅生成自定义媒体库分组，频道点击后直接调用播放器。',
  logo: 'https://i.miji.bid/2025/05/17/c4a0703b68a4d2313a27937d82b72b6a.png',
};

const USER_AGENT = 'AptvPlayer-UA';
const SUBSCRIPTION_USER_AGENT = 'AptvPlayer/1.4.6';
const DEFAULT_BG_COLOR = 'DCDCDC';
const FALLBACK_WIDE_IMAGE = 'https://i.miji.bid/2025/05/17/c4a0703b68a4d2313a27937d82b72b6a.png';
const FALLBACK_POSTER_IMAGE = 'https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const STATUS_CACHE_TTL_MS = 30 * 60 * 1000;
const PLAY_PROBE_TIMEOUT = 3;
const PLAY_PROBE_LIMIT = 8;
const MAX_CHANNEL_ALTERNATES = 16;
const SOURCE_PREVIEW_CHANNEL_LIMIT = 5;
const HUYA_YQK_URL = 'http://add.aptvapp.com/https://cdn.jsdelivr.net/gh/Kimentanm/aptv@master/m3u/yqk.m3u';

function imageHeaders(referer) {
  return {
    Referer: referer || 'https://aptv.app/',
    'User-Agent': USER_AGENT
  };
}

const BUILT_IN_SOURCES = [
  {
    id: 'jsnzkpg-live',
    title: 'Jsnzkpg 直播',
    subtitle: '综合直播源',
    url: 'https://raw.githubusercontent.com/Jsnzkpg/Jsnzkpg/Jsnzkpg/Jsnzkpg1.m3u',
  },
  {
    id: 'kimentanm-aptv',
    title: 'Kimentanm APTV',
    subtitle: '综合直播源',
    url: 'https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u',
  },
  {
    id: 'aptv-sdyd',
    title: 'APTV 山东移动',
    subtitle: '山东移动直播源',
    url: 'https://itv.aptv.app/china-iptv/sdyd.m3u',
  },
  {
    id: 'guovin-iptv',
    title: 'Guovin IPTV',
    subtitle: '自动聚合直播源',
    url: 'https://cdn.jsdelivr.net/gh/Guovin/iptv-api@gd/output/result.m3u',
  },
  {
    id: 'iptv-org-cn',
    title: 'IPTV-org 中国',
    subtitle: '公开频道列表',
    url: 'https://iptv-org.github.io/iptv/countries/cn.m3u',
  },
  {
    id: 'yang-gather',
    title: 'YanG Gather',
    subtitle: 'Gather 聚合源',
    url: 'https://raw.githubusercontent.com/YanG-1989/m3u/main/Gather.m3u',
  },
  {
    id: 'free-tv',
    title: 'Free-TV',
    subtitle: '全球公开直播',
    url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
  },
  {
    id: 'huya-yqk',
    title: '虎牙一起看',
    subtitle: '虎牙一起看直播源',
    url: HUYA_YQK_URL,
  },
];

function getManifest() {
  return {
    id: WidgetMetadata.id,
    name: WidgetMetadata.name,
    title: WidgetMetadata.title,
    version: WidgetMetadata.version,
    author: WidgetMetadata.author,
    description: WidgetMetadata.description,
    logo: WidgetMetadata.logo,
    capabilities: {
      home: true,
      category: true,
      detail: false,
      search: true,
      resourceVersions: false,
      playback: true,
      aggregation: false,
      playbackHistory: false,
      resourceMatching: false,
    },
    aggregation: {
      search: false,
      playbackHistory: false,
      resourceMatching: false,
    },
    parameters: [
      {
        name: 'subscriptions',
        title: '订阅列表',
        type: 'objectList',
        required: false,
        description: '可选。支持配置多个订阅，每条包含名称和链接，会显示在内置直播源前面。',
        fields: [
          { name: 'name', title: '名称', type: 'input', required: true },
          { name: 'url', title: '链接', type: 'input', required: true },
        ],
        placeholders: [
          { title: '虎牙一起看', value: JSON.stringify([{ name: '虎牙一起看', url: HUYA_YQK_URL }]) },
          { title: 'APTV 山东移动', value: JSON.stringify([{ name: 'APTV 山东移动', url: 'https://itv.aptv.app/china-iptv/sdyd.m3u' }]) },
          { title: 'Kimentanm APTV', value: JSON.stringify([{ name: 'Kimentanm APTV', url: 'https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u' }]) },
        ],
      },
      {
        name: 'url',
        title: '兼容旧订阅链接',
        type: 'input',
        required: false,
        description: '兼容旧版本单订阅配置。新配置建议使用订阅列表。',
      },
      {
        name: 'group_filter',
        title: '分组过滤',
        type: 'input',
        description: '可填写普通关键字或正则表达式，只保留匹配 group-title 的频道。',
        placeholders: [
          { title: '全部', value: '' },
          { title: '央视&卫视', value: '.*(央视|卫视).*' },
          { title: '央视', value: '央视' },
          { title: '卫视', value: '卫视' },
        ],
      },
      {
        name: 'name_filter',
        title: '频道名过滤',
        type: 'input',
        description: '可填写普通关键字或正则表达式，只保留匹配频道名的频道。',
        placeholders: [
          { title: '全部', value: '' },
          { title: '体育', value: '体育|CCTV5|五星' },
          { title: '电影', value: '电影|影院|影视' },
          { title: '少儿', value: '少儿|卡通|动画' },
        ],
      },
      {
        name: 'bg_color',
        title: '台标背景色',
        type: 'input',
        value: DEFAULT_BG_COLOR,
        description: '无台标时的占位图背景色，填写 6 位 RGB，例如 DCDCDC。',
        placeholders: [
          { title: '亮灰色', value: 'DCDCDC' },
          { title: '钢蓝', value: '4682B4' },
          { title: '海洋蓝', value: '20B2AA' },
          { title: '浅粉红', value: 'FFB6C1' },
          { title: '小麦色', value: 'F5DEB3' },
        ],
      },
      {
        name: 'direction',
        title: '台标优先方向',
        type: 'enumeration',
        value: 'H',
        enumOptions: [
          { title: '横向', value: 'H' },
          { title: '竖向', value: 'V' },
        ],
      },
      {
        name: 'status_probe_limit',
        title: '后台探测数量',
        type: 'input',
        value: '80',
        description: '进入频道列表后后台探测多少个频道的可播放状态。页面会先显示，探测结果随后更新。',
        placeholders: [
          { title: '关闭', value: '0' },
          { title: '默认', value: '80' },
          { title: '较多', value: '200' },
        ],
      },
    ],
  };
}

async function getHome(ctx = {}) {
  const config = readConfig(ctx);
  const sources = homeSources(config);

  return {
    pageType: 'home',
    id: 'live-home',
    title: WidgetMetadata.title,
    heroAspectRatio: '16:9',
    hero: [],
    sections: sources.map(sourceSection),
  };
}

async function getHomeSection(ctx = {}) {
  const config = readConfig(ctx);
  const source = sourceFromContext(ctx, config);
  const section = sourceSection(source);

  try {
    const channels = await loadChannels(config, source);
    const groups = buildGroups(channels);
    return {
      ...section,
      lazy: false,
      isLazy: false,
      subtitle: `${channels.length} 个频道 · ${groups.length} 个分组`,
      items: groups.map((group, index) => groupEntry(source, group, index)),
    };
  } catch (error) {
    return {
      ...section,
      lazy: false,
      isLazy: false,
      subtitle: '加载失败',
      items: [
        errorEntry(source, error),
      ],
    };
  }
}

async function getCategory(ctx = {}) {
  const config = readConfig(ctx);
  const pageId = String(ctx.pageId || ctx.id || 'all');
  const page = Math.max(1, Number(ctx.page || 1));
  const pageSize = 80;
  const source = sourceFromPageId(pageId, config);
  const groupTitle = groupTitleFromPageId(pageId);
  const channels = await loadChannels(config, source);
  if (isSourceGroupsPageId(pageId)) {
    const groups = buildGroups(channels);
    const start = (page - 1) * pageSize;
    const pageGroups = groups.slice(start, start + pageSize);
    return {
      pageType: 'category',
      id: pageId,
      title: `${source.title} · 分组`,
      style: 'discover.annualWidePreview',
      itemAspectRatio: '16:9',
      items: pageGroups.map((group, index) => groupEntry(source, group, start + index)),
      page,
      hasMore: start + pageSize < groups.length,
    };
  }

  const selectedChannels = groupTitle
    ? channels.filter((channel) => channel.group === groupTitle)
    : channels;
  const start = (page - 1) * pageSize;
  const pageItems = selectedChannels.slice(start, start + pageSize);
  const title = groupTitle || `${source.title} · 全部频道`;

  return {
    pageType: 'category',
    id: pageId,
    title,
    style: 'media.posterGrid',
    itemAspectRatio: '16:9',
    items: pageItems.map(channelItem),
    page,
    hasMore: start + pageSize < selectedChannels.length,
  };
}

async function search(ctx = {}) {
  const config = readConfig(ctx);
  const query = String(ctx.query || ctx.keyword || ctx.text || '').trim();
  if (!query) return [];

  const results = [];
  for (const source of homeSources(config)) {
    if (results.length >= 80) break;
    try {
      const channels = await loadChannels(config, source);
      channels
        .filter((channel) => includesText(channel.title, query) || includesText(channel.group, query))
        .slice(0, 80 - results.length)
        .forEach((channel) => results.push(channelItem(channel)));
    } catch (_) {}
  }
  return results;
}

async function resolvePlayback(ctx = {}) {
  const payload = decodeChannelPayload(ctx.itemId || ctx.id || ctx.url || '');
  const candidates = playbackCandidates(payload, ctx.url);
  const probeOnly = !!(ctx.probeOnly || ctx.statusProbe);
  if (!candidates.length) {
    throw new Error('没有可播放的直播地址');
  }
  let playable;
  try {
    const selected = selectPreferredCandidate(candidates, probeOnly);
    playable = selected && (selected.huyaResolved || probeOnly) ? selected : resolvePlayableCandidate(selected);
    markPlaybackCandidateStatus(playable, 'ok');
  } catch (error) {
    if (!probeOnly) {
      candidates.forEach((candidate) => markPlaybackCandidateStatus(candidate, 'failed'));
    }
    throw error;
  }

  return {
    url: playable.url,
    container: playable.container || containerFromURL(playable.url),
    headers: playbackHeaders(playable),
    isLive: true,
    streamKind: 'live',
  };
}

async function loadChannels(config, source) {
  const activeSource = source || primarySource(config);
  const sourceConfig = { ...config, url: activeSource.url };
  const text = await fetchM3UContent(activeSource.url);
  const parsedChannels = parseM3UContent(text, sourceConfig)
    .filter((channel) => matchesFilter(channel.group, config.group_filter))
    .filter((channel) => matchesFilter(channel.title, config.name_filter));
  const channels = mergeChannelAlternates(parsedChannels);
  return channels.map((channel, index) => ({
    ...channel,
    sourceId: activeSource.id,
    sourceTitle: activeSource.title,
    index: index + 1,
    total: channels.length,
  }));
}

async function fetchM3UContent(url, visited = {}) {
  const cacheKey = 'm3u:' + url;
  const cached = Widget.storage.get(cacheKey);
  if (cached && cached.time && cached.data && Date.now() - Number(cached.time) < CACHE_TTL_MS) {
    return String(cached.data);
  }

  let lastFailure = '';
  for (const profile of subscriptionRequestProfiles(url)) {
    let response;
    let status = 0;
    let data = '';
    try {
      response = await Widget.http.get(url, { headers: profile.headers });
      status = Number(response && response.status ? response.status : 0);
      data = typeof response.data === 'string' ? response.data : String(response.data || '');
    } catch (error) {
      lastFailure = error && error.message ? error.message : String(error);
    }

    if (isValidM3UContent(data)) {
      Widget.storage.set(cacheKey, { time: Date.now(), data });
      return data;
    }

    const nestedURL = subURLFromM3U(data);
    if (nestedURL && !visited[nestedURL]) {
      visited[url] = true;
      try {
        const nestedData = await fetchM3UContent(absolutizeURL(nestedURL, url), visited);
        Widget.storage.set(cacheKey, { time: Date.now(), data: nestedData });
        return nestedData;
      } catch (error) {
        lastFailure = error && error.message ? error.message : String(error);
      }
    }

    const preview = data.replace(/\s+/g, ' ').slice(0, 120);
    lastFailure = status ? `HTTP ${status} ${preview}` : preview;
  }

  const wrappedURL = unwrappedAptvURL(url);
  if (wrappedURL && !visited[wrappedURL]) {
    visited[url] = true;
    const fallbackData = await fetchM3UContent(wrappedURL, visited);
    Widget.storage.set(cacheKey, { time: Date.now(), data: fallbackData });
    return fallbackData;
  }

  throw new Error(`订阅内容不是有效的 M3U 直播列表${lastFailure ? `：${lastFailure}` : ''}`);
}

function subscriptionRequestProfiles(url) {
  const normalizedURL = String(url || '').toLowerCase();
  const userAgents = normalizedURL.includes('aptv.app')
    ? [SUBSCRIPTION_USER_AGENT, USER_AGENT]
    : [USER_AGENT, SUBSCRIPTION_USER_AGENT];
  userAgents.push('Mozilla/5.0');

  const seen = {};
  return userAgents
    .filter((ua) => {
      const key = String(ua || '').trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    })
    .map((ua) => ({
      headers: {
        'User-Agent': ua,
        Referer: 'https://aptv.app/',
        Accept: '*/*',
      },
    }));
}

function isValidM3UContent(value) {
  const text = String(value || '');
  return text.includes('#EXTM3U') && text.includes('#EXTINF');
}

function subURLFromM3U(value) {
  const lines = String(value || '').split(/\r?\n/);
  for (const line of lines) {
    const match = line.trim().match(/^#EXT-X-SUB-URL\s+(.+)$/i);
    if (match && match[1]) return match[1].trim();
  }
  return '';
}

function unwrappedAptvURL(value) {
  const text = String(value || '').trim();
  const match = text.match(/^https?:\/\/add\.aptvapp\.com\/(https?:\/\/.+)$/i);
  return match && match[1] ? match[1] : '';
}

function parseM3UContent(content, config) {
  const lines = String(content || '').split(/\r?\n/);
  const channels = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === '#EXTM3U') continue;

    if (line.startsWith('#EXTINF:')) {
      const commaIndex = line.lastIndexOf(',');
      const title = cleanChannelTitle(commaIndex >= 0 ? line.slice(commaIndex + 1).trim() : '直播频道');
      const attrs = commaIndex >= 0 ? line.slice(0, commaIndex) : line;
      current = {
        title,
        group: attr(attrs, 'group-title') || '未分类',
        tvgName: cleanChannelTitle(attr(attrs, 'tvg-name') || title),
        tvgId: attr(attrs, 'tvg-id') || '',
        logo: attr(attrs, 'tvg-logo') || '',
        headers: headersFromExtinf(attrs),
      };
      continue;
    }

    if (current && line.startsWith('#EXTVLCOPT:')) {
      current.headers = {
        ...(current.headers || {}),
        ...headersFromVLCOption(line.slice('#EXTVLCOPT:'.length)),
      };
      continue;
    }

    if (current && !line.startsWith('#')) {
      const title = current.title || current.tvgName || '直播频道';
      const tvgName = current.tvgName || title;
      const logo = current.logo || placeholderImage(title, config);
      const url = absolutizeURL(line, config.url);
      channels.push({
        title,
        group: current.group || '未分类',
        tvgName,
        tvgId: current.tvgId || '',
        url,
        headers: current.headers || {},
        poster: config.direction === 'V' ? logo : logo,
        backdrop: config.direction === 'V' ? logo : (current.logo || placeholderImage(title, config, true)),
        imageHeaders: imageHeaders(config.url),
      });
      current = null;
    }
  }

  return channels;
}

function channelItem(channel) {
  const itemId = encodeChannelPayload(channel);
  const lineCount = Array.isArray(channel.alternates) ? channel.alternates.length : 1;
  const playTitle = playbackTitle(channel.title);
  const status = channel.playStatus || cachedChannelPlayStatus(channel).status;
  const statusSuffix = playbackStatusSuffix(status);
  const displayTitle = channel.total
    ? `${channel.title} (${channel.index}/${channel.total})${statusSuffix}`
    : `${channel.title}${statusSuffix}`;
  return {
    id: itemId,
    title: displayTitle,
    subtitle: channel.group,
    type: 'live',
    poster: channel.poster || FALLBACK_POSTER_IMAGE,
    backdrop: channel.backdrop || channel.poster || FALLBACK_WIDE_IMAGE,
    imageHeaders: channel.imageHeaders || imageHeaders(channel.url),
    metadataText: channel.group,
    overview: channel.url,
    badges: playbackStatusBadges(status, lineCount),
    aspectRatio: '16:9',
    imageFit: 'fit',
    action: {
      type: 'play',
      itemId,
      versionId: 'live',
      title: playTitle,
    },
    providerIds: {
      LiveURL: channel.url,
      LiveTitle: playTitle,
      LiveGroup: channel.group,
      LiveTvgId: channel.tvgId || '',
      LiveHuyaRoomId: huyaRoomIdFromURL(channel.url),
      LiveLineCount: String(lineCount),
      LiveSourceId: channel.sourceId || '',
      LiveSourceTitle: channel.sourceTitle || '',
    },
  };
}

function groupEntry(source, group, index) {
  const previewItems = group.channels.slice(0, SOURCE_PREVIEW_CHANNEL_LIMIT).map(channelItem);
  const first = group.channels[0] || {};
  const pageId = sourcePageId(source, group.title);
  return {
    id: pageId,
    title: group.title,
    subtitle: `${group.channels.length} 个频道`,
    type: 'collection',
    poster: first.poster || FALLBACK_POSTER_IMAGE,
    backdrop: first.backdrop || first.poster || FALLBACK_WIDE_IMAGE,
    imageHeaders: first.imageHeaders || imageHeaders(source.url),
    overview: `浏览 ${group.title} 分组下的直播频道。`,
    metadataText: '直播分组',
    badges: ['直播', '分组'],
    rank: index + 1,
    aspectRatio: '16:9',
    imageFit: 'fit',
    previewItems,
    action: {
      type: 'category',
      pageId,
      title: group.title,
      itemAspectRatio: '16:9',
    },
  };
}

function errorEntry(source, error) {
  return {
    id: `source-error:${source.id}`,
    title: source.title,
    subtitle: '订阅加载失败',
    type: 'collection',
    poster: FALLBACK_POSTER_IMAGE,
    backdrop: FALLBACK_WIDE_IMAGE,
    imageHeaders: imageHeaders(source.url),
    overview: error && error.message ? error.message : String(error || '加载失败'),
    metadataText: '直播源',
    badges: ['直播', '失败'],
    aspectRatio: '16:9',
    imageFit: 'fit',
    action: { type: 'none' },
  };
}

function sourceSection(source) {
  return {
    id: `source:${source.id}`,
    title: source.title,
    subtitle: source.subtitle || '直播订阅',
    style: 'discover.annualWidePreview',
    lazy: true,
    isLazy: true,
    moreAction: {
      type: 'category',
      pageId: sourceGroupsPageId(source),
      title: `${source.title} · 分组`,
      itemAspectRatio: '16:9',
    },
    loadAction: {
      type: 'category',
      pageId: sourceGroupsPageId(source),
      title: source.title,
      itemAspectRatio: '16:9',
    },
    items: [],
  };
}

function homeSources(config) {
  const sources = config.subscriptions.map((source, index) => ({
    id: source.id || `custom-${index + 1}`,
    title: source.name || source.title || `自定义订阅 ${index + 1}`,
    subtitle: source.url,
    url: source.url,
  }));
  return sources.concat(BUILT_IN_SOURCES);
}

function primarySource(config) {
  return homeSources(config)[0] || BUILT_IN_SOURCES[0];
}

function sourceFromContext(ctx, config) {
  const rawId = String(ctx.sectionId || ctx.id || ctx.pageId || ctx.categoryId || '').trim();
  if (rawId.startsWith('source:')) {
    return sourceById(rawId.slice('source:'.length), config);
  }
  return sourceFromPageId(rawId, config);
}

function sourceFromPageId(pageId, config) {
  const text = String(pageId || '').trim();
  if (text.startsWith('src:')) {
    const parts = text.split(':');
    return sourceById(decodeKey(parts[1] || ''), config);
  }
  return primarySource(config);
}

function sourceById(id, config) {
  const sourceId = String(id || '').trim();
  return homeSources(config).find((source) => source.id === sourceId) || primarySource(config);
}

function sourcePageId(source, groupTitle) {
  const base = `src:${encodeKey(source.id)}`;
  return groupTitle ? `${base}:group:${encodeKey(groupTitle)}` : `${base}:all`;
}

function sourceGroupsPageId(source) {
  return `src:${encodeKey(source.id)}:groups`;
}

function isSourceGroupsPageId(pageId) {
  const text = String(pageId || '').trim();
  return text.startsWith('src:') && text.split(':').includes('groups');
}

function groupTitleFromPageId(pageId) {
  const text = String(pageId || '').trim();
  if (text.startsWith('src:')) {
    const parts = text.split(':');
    const groupIndex = parts.indexOf('group');
    return groupIndex >= 0 && parts[groupIndex + 1] ? decodeKey(parts[groupIndex + 1]) : '';
  }
  if (text.startsWith('group:')) {
    return decodeKey(text.slice('group:'.length));
  }
  return '';
}

function buildGroups(channels) {
  const map = {};
  for (const channel of channels) {
    const key = channel.group || '未分类';
    if (!map[key]) map[key] = [];
    map[key].push(channel);
  }
  return Object.keys(map).map((title) => ({ title, channels: map[title] }));
}

function cachedChannelPlayStatus(channel) {
  const candidates = playbackCandidates(channel || {}, channel && channel.url);
  if (!candidates.length) return { status: '' };

  let sawKnown = false;
  let sawUnknown = false;
  for (const candidate of candidates) {
    const cached = cachedPlaybackCandidateStatus(candidate);
    if (cached.status === 'ok') return cached;
    if (cached.status === 'failed') sawKnown = true;
    if (!cached.status) sawUnknown = true;
  }
  if (sawKnown && !sawUnknown) return { status: 'failed' };
  return { status: '' };
}

function cachedPlaybackCandidateStatus(candidate) {
  const key = playbackStatusCacheKey(candidate);
  if (!key) return { status: '' };
  const cached = Widget.storage.get(key);
  if (!cached || !cached.status || !cached.time) return { status: '' };
  if (Date.now() - Number(cached.time || 0) > STATUS_CACHE_TTL_MS) return { status: '' };
  return cached;
}

function markPlaybackCandidateStatus(candidate, status, reason) {
  const key = playbackStatusCacheKey(candidate);
  if (!key || !status) return;
  Widget.storage.set(key, {
    status,
    reason: reason || '',
    time: Date.now(),
    url: String(candidate && candidate.url || ''),
  });
}

function playbackStatusCacheKey(candidate) {
  const url = String(candidate && candidate.url || '').trim();
  if (!url) return '';
  return `live-status:${encodeKey(url)}`;
}

function playbackStatusSuffix(status) {
  if (status === 'ok') return ' ✅';
  if (status === 'failed') return ' ❌';
  return '';
}

function playbackStatusBadges(status, lineCount) {
  const badges = ['直播'];
  if (status === 'ok') badges.push('可播');
  if (status === 'failed') badges.push('失效');
  if (lineCount > 1) badges.push(`${lineCount} 线`);
  return badges;
}

function mergeChannelAlternates(channels) {
  const map = {};
  const merged = [];
  for (const channel of channels) {
    const key = [
      normalizeChannelName(channel.tvgId || channel.title),
      normalizeChannelName(channel.title),
      channel.group || '',
    ].join('|');
    const stream = streamCandidate(channel);
    if (!map[key]) {
      const base = {
        ...channel,
        alternates: [],
      };
      map[key] = base;
      merged.push(base);
    }
    if (!map[key].alternates.some((item) => item.url === stream.url)) {
      map[key].alternates.push(stream);
    }
  }

  const relatedMap = {};
  for (const channel of merged) {
    const relatedKey = normalizeChannelName(channel.tvgId || channel.title);
    if (!relatedKey) continue;
    if (!relatedMap[relatedKey]) relatedMap[relatedKey] = [];
    channel.alternates.forEach((alternate) => {
      if (!relatedMap[relatedKey].some((item) => item.url === alternate.url)) {
        relatedMap[relatedKey].push(alternate);
      }
    });
  }

  return merged.map((channel) => {
    const relatedKey = normalizeChannelName(channel.tvgId || channel.title);
    const expandedAlternates = [...(channel.alternates || [])];
    (relatedMap[relatedKey] || []).forEach((alternate) => {
      if (!expandedAlternates.some((item) => item.url === alternate.url)) {
        expandedAlternates.push(alternate);
      }
    });
    const alternates = sortCandidates(expandedAlternates).slice(0, MAX_CHANNEL_ALTERNATES);
    const first = alternates[0] || streamCandidate(channel);
    return {
      ...channel,
      url: first.url,
      headers: first.headers || {},
      alternates,
    };
  });
}

function readConfig(ctx) {
  const source = ctx.params || ctx.config || ctx.settings || ctx.parameters || ctx || {};
  const subscriptions = readSubscriptions(source);
  return {
    url: String(source.url || '').trim(),
    subscriptions,
    group_filter: String(source.group_filter || '').trim(),
    name_filter: String(source.name_filter || '').trim(),
    bg_color: sanitizeColor(source.bg_color || DEFAULT_BG_COLOR),
    direction: String(source.direction || 'H').trim().toUpperCase() === 'V' ? 'V' : 'H',
    status_probe_limit: boundedInteger(source.status_probe_limit, 80, 0, 300),
  };
}

function attr(source, name) {
  const escaped = String(name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp("(?:^|[\\s,])" + escaped + "=(?:\"([^\"]*)\"|'([^']*)'|([^\\s,]+))", 'i');
  const match = String(source || '').match(re);
  return match ? (match[1] || match[2] || match[3] || '').trim() : '';
}

function headersFromExtinf(attrs) {
  const userAgent = attr(attrs, 'http-user-agent') || attr(attrs, 'ghttp-user-agent') || attr(attrs, 'user-agent');
  const referer = attr(attrs, 'http-referrer') || attr(attrs, 'http-referer') || attr(attrs, 'referrer') || attr(attrs, 'referer');
  const cookie = attr(attrs, 'http-cookie') || attr(attrs, 'cookie');
  const headers = parseHeaderList(attr(attrs, 'http-header') || attr(attrs, 'headers') || '');
  if (userAgent) headers['User-Agent'] = normalizeUserAgent(userAgent);
  if (referer) headers.Referer = normalizeHeaderValue('Referer', referer);
  if (cookie) headers.Cookie = cookie;
  return normalizeHeaders(headers);
}

function headersFromVLCOption(value) {
  const text = String(value || '').trim();
  if (!text) return {};
  const [rawKey, ...rest] = text.split('=');
  const key = rawKey.trim();
  const rawValue = rest.join('=').trim();
  if (!key || !rawValue) return {};
  if (/^http-header$/i.test(key)) {
    return normalizeHeaders(parseHeaderList(rawValue));
  }
  if (/^http-user-agent$/i.test(key)) {
    return { 'User-Agent': normalizeUserAgent(rawValue) };
  }
  if (/^http-referrer$|^http-referer$/i.test(key)) {
    return { Referer: normalizeHeaderValue('Referer', rawValue) };
  }
  if (/^http-cookie$/i.test(key)) {
    return { Cookie: rawValue };
  }
  return {};
}

function normalizeUserAgent(value) {
  return String(value || '').trim() || USER_AGENT;
}

function parseHeaderList(value) {
  const text = String(value || '').trim();
  if (!text) return {};
  const headers = {};
  const entries = text
    .split(/\r?\n|\|+|,(?=[A-Za-z0-9-]+\s*[=:])/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  entries.forEach((entry) => {
    const equalIndex = entry.indexOf('=');
    const colonIndex = entry.indexOf(':');
    const separatorIndex = equalIndex >= 0
      ? equalIndex
      : (colonIndex >= 0 ? colonIndex : -1);
    if (separatorIndex <= 0) return;

    const key = entry.slice(0, separatorIndex).trim();
    const rawValue = entry.slice(separatorIndex + 1).trim();
    if (!key || !rawValue) return;
    headers[key] = normalizeHeaderValue(key, rawValue);
  });
  return headers;
}

function normalizeHeaders(value) {
  const headers = {};
  Object.entries(value || {}).forEach(([key, rawValue]) => {
    const name = canonicalHeaderName(key);
    const text = normalizeHeaderValue(name, rawValue);
    if (name && text) headers[name] = text;
  });
  return headers;
}

function canonicalHeaderName(value) {
  const key = String(value || '').trim();
  const lower = key.toLowerCase();
  if (lower === 'ua' || lower === 'user-agent' || lower === 'http-user-agent') return 'User-Agent';
  if (lower === 'referer' || lower === 'referrer' || lower === 'http-referer' || lower === 'http-referrer') return 'Referer';
  if (lower === 'cookie' || lower === 'http-cookie') return 'Cookie';
  return key;
}

function normalizeHeaderValue(key, value) {
  const text = String(value || '').trim();
  if (/^(referer|referrer|origin)$/i.test(String(key || ''))) {
    return text.replace(/^(https?):\/([^/])/i, '$1://$2');
  }
  return text;
}

function playbackCandidates(payload, directURL) {
  const candidates = [];
  const add = (value) => {
    const candidate = normalizeCandidate(value, payload);
    if (candidate.url && !candidates.some((item) => item.url === candidate.url)) {
      candidates.push(candidate);
    }
  };

  if (directURL) add({ url: directURL, headers: payload.headers, referer: payload.referer });
  if (Array.isArray(payload.alternates)) payload.alternates.forEach(add);
  add({ url: payload.url, headers: payload.headers, referer: payload.referer });
  return sortCandidates(candidates);
}

function selectPreferredCandidate(candidates, probeOnly = false) {
  const sorted = sortCandidates(candidates);
  const probeTargets = probeOnly ? sorted.slice(0, PLAY_PROBE_LIMIT) : sorted;
  let firstFailure = '';

  for (const candidate of probeTargets) {
    const result = probeCandidate(candidate);
    if (result.ok) {
      markPlaybackCandidateStatus(candidate, 'ok');
      markPlaybackCandidateStatus(result.playable || candidate, 'ok');
      return result.playable || candidate;
    }
    markPlaybackCandidateStatus(candidate, 'failed', result.reason);
    if (!firstFailure && result.reason) firstFailure = result.reason;
  }

  throw new Error(firstFailure || '直播地址不可用');
}

function probeCandidate(candidate) {
  const url = String(candidate.url || '').trim();
  if (!url) return { ok: false, reason: '直播地址为空' };
  if (!/^https?:\/\//i.test(url)) return { ok: true };

  try {
    const playable = resolvePlayableCandidate(candidate, true);
    return playable && playable.url
      ? { ok: true, playable }
      : { ok: false, reason: '直播地址不可用' };
  } catch (error) {
    return { ok: false, reason: error && error.message ? error.message : String(error) };
  }
}

function resolvePlayableCandidate(candidate, probeOnly = false) {
  if (candidate && candidate.huyaResolved) return candidate;

  const huyaPlayable = resolveHuyaCandidate(candidate, probeOnly);
  if (huyaPlayable) return huyaPlayable;

  const url = String(candidate.url || '').trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    return candidate;
  }

  const response = fetchProbeResponse(url, playbackHeaders(candidate), PLAY_PROBE_TIMEOUT);
  assertPlayableHTTPResponse(response, url);
  const detectedContainer = containerFromPlaybackResponse(response, url);
  if (detectedContainer !== 'm3u8') {
    return {
      ...candidate,
      url: response.finalURL || url,
      container: detectedContainer || containerFromURL(response.finalURL || url),
    };
  }

  const playlist = response.text;
  if (!playlist.includes('#EXTM3U')) {
    throw new Error('直播地址返回的不是有效 HLS 列表');
  }

  const playlistURL = response.finalURL || url;
  const variant = selectHLSVariant(playlist, playlistURL);
  const resolved = variant
    ? { ...candidate, url: variant.url, referer: candidate.referer || playlistURL }
    : { ...candidate, url: playlistURL || url };

  const mediaResponse = variant
    ? fetchProbeResponse(resolved.url, playbackHeaders(resolved), PLAY_PROBE_TIMEOUT)
    : response;
  assertPlayableHTTPResponse(mediaResponse, resolved.url);
  const playable = {
    ...resolved,
    url: mediaResponse.finalURL || resolved.url,
    container: 'm3u8',
  };
  probeFirstHLSSegment(mediaResponse.text, playable);

  if (probeOnly) return playable;
  return playable;
}

function resolveHuyaCandidate(candidate, probeOnly = false) {
  const roomId = String(huyaRoomIdFromURL(candidate && candidate.url) || (candidate && candidate.huyaRoomId) || '').trim();
  if (!roomId) return null;

  const proxyPlayable = {
    ...candidate,
    url: String(candidate && candidate.url || '').trim(),
    referer: String(candidate && candidate.url || '').trim(),
    headers: huyaProxyHeaders(candidate && candidate.headers),
    container: huyaProxyContainer(candidate && candidate.url),
    huyaRoomId: roomId,
    huyaResolved: true,
  };
  if (proxyPlayable.url && huyaProxyURL(proxyPlayable.url)) {
    return proxyPlayable;
  }

  const referer = `https://m.huya.com/${roomId}`;
  const apiURL = `https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=${encodeURIComponent(roomId)}`;
  const response = fetchTextResponse(apiURL, huyaPlaybackHeaders(roomId, candidate && candidate.headers), PLAY_PROBE_TIMEOUT);
  let payload;
  try {
    payload = JSON.parse(response.text);
  } catch (_) {
    throw new Error('虎牙播放接口返回格式错误');
  }

  const data = payload && payload.data ? payload.data : {};
  if (String(data.liveStatus || '').toUpperCase() !== 'ON' || String(data.realLiveStatus || '').toUpperCase() !== 'ON') {
    throw new Error('虎牙直播间当前未开播');
  }

  const lines = huyaHLSLines(data);
  if (!lines.length) throw new Error('虎牙直播未返回 HLS 播放地址');

  let firstFailure = '';
  for (const line of lines) {
    const playable = {
      ...candidate,
      url: line.url,
      referer,
      headers: huyaPlaybackHeaders(roomId, candidate && candidate.headers),
      huyaRoomId: roomId,
      huyaCdnType: line.cdnType || '',
      huyaResolved: true,
    };

    try {
      const playlistResponse = fetchTextResponse(playable.url, playbackHeaders(playable), PLAY_PROBE_TIMEOUT);
      if (!playlistResponse.text.includes('#EXTM3U')) {
        throw new Error('虎牙线路返回的不是 HLS 列表');
      }

      const variant = selectHLSVariant(playlistResponse.text, playlistResponse.finalURL || playable.url);
      if (variant) {
        const variantCandidate = {
          ...playable,
          url: variant.url,
          referer: playable.referer,
        };
        const variantResponse = fetchTextResponse(variantCandidate.url, playbackHeaders(variantCandidate), PLAY_PROBE_TIMEOUT);
        if (!variantResponse.text.includes('#EXTM3U')) {
          throw new Error('虎牙二级线路返回的不是 HLS 列表');
        }
        probeFirstHLSSegment(variantResponse.text, variantCandidate);
        return {
          ...variantCandidate,
          url: variantResponse.finalURL || variantCandidate.url,
        };
      }

      probeFirstHLSSegment(playlistResponse.text, playable);
      return {
        ...playable,
        url: playlistResponse.finalURL || playable.url,
      };
    } catch (error) {
      if (!firstFailure) firstFailure = error && error.message ? error.message : String(error);
    }
  }

  throw new Error(`虎牙直播线路不可用${firstFailure ? `：${firstFailure}` : ''}`);
}

function huyaHLSLines(data) {
  const stream = data && data.stream ? data.stream : {};
  const lines = stream.hls && Array.isArray(stream.hls.multiLine)
    ? stream.hls.multiLine
    : [];
  const fromMultiLine = lines
    .map((line) => ({
      url: String(line && line.url || '').trim(),
      cdnType: String(line && line.cdnType || '').trim(),
      priority: Number(line && line.webPriorityRate || line && line.iWebPriorityRate || 0),
      lineIndex: Number(line && line.lineIndex || line && line.iLineIndex || 0),
    }))
    .filter((line) => line.url);

  const baseLines = Array.isArray(stream.baseSteamInfoList) ? stream.baseSteamInfoList : [];
  const fromBase = baseLines
    .map((line) => {
      const baseURL = String(line && line.sHlsUrl || '').trim();
      const streamName = String(line && line.sStreamName || '').trim();
      const suffix = String(line && line.sHlsUrlSuffix || 'm3u8').trim();
      const antiCode = String(line && line.sHlsAntiCode || '').trim();
      if (!baseURL || !streamName) return null;
      return {
        url: `${baseURL.replace(/\/+$/, '')}/${streamName}.${suffix}${antiCode ? `?${antiCode}` : ''}`,
        cdnType: String(line && line.sCdnType || '').trim(),
        priority: Number(line && line.iWebPriorityRate || line && line.iPCPriorityRate || 0),
        lineIndex: Number(line && line.iLineIndex || 0),
      };
    })
    .filter(Boolean);

  const seen = {};
  return fromMultiLine.concat(fromBase)
    .filter((line) => {
      if (seen[line.url]) return false;
      seen[line.url] = true;
      return true;
    })
    .sort((left, right) => {
      const leftScore = huyaLineScore(left);
      const rightScore = huyaLineScore(right);
      if (leftScore !== rightScore) return rightScore - leftScore;
      return (left.lineIndex || 0) - (right.lineIndex || 0);
    });
}

function huyaLineScore(line) {
  const cdn = String(line.cdnType || '').toUpperCase();
  let score = Number(line.priority || 0);
  if (cdn === 'HS') score += 140;
  if (cdn === 'TX') score -= 10;
  if (cdn === 'AL') score -= 30;
  if (score < 0) score -= 20;
  return score;
}

function huyaRoomIdFromURL(url) {
  const text = String(url || '').trim();
  const match =
    text.match(/\/live\/huya\/(\d+)/i)
    || text.match(/\/huya\/(\d+)(?:$|[/?#])/i)
    || text.match(/[?&]roomid=(\d+)/i)
    || text.match(/^https?:\/\/(?:www\.|m\.)?huya\.com\/(\d+)(?:$|[/?#])/i);
  return match && match[1] ? match[1] : '';
}

function huyaProxyURL(url) {
  return /\/(?:live\/)?huya\/\d+(?:$|[/?#])/i.test(String(url || '').trim());
}

function huyaProxyContainer(url) {
  const text = String(url || '').trim();
  if (/\/live\/huya\/\d+(?:$|[/?#])/i.test(text)) return 'flv';
  return containerFromURL(text);
}

function huyaProxyHeaders(extraHeaders) {
  return normalizeHeaders({
    'User-Agent': SUBSCRIPTION_USER_AGENT,
    ...(extraHeaders || {}),
  });
}

function huyaPlaybackHeaders(roomId, extraHeaders) {
  return normalizeHeaders({
    'User-Agent': SUBSCRIPTION_USER_AGENT,
    Referer: `https://m.huya.com/${roomId}`,
    ...(extraHeaders || {}),
  });
}

function fetchText(url, headers, timeout) {
  return fetchTextResponse(url, headers, timeout).text;
}

function fetchProbeResponse(url, headers, timeout) {
  const probe = Widget.http && typeof Widget.http.probe === 'function'
    ? Widget.http.probe
    : null;
  if (!probe) return fetchTextResponse(url, headers, timeout);

  const response = probe(url, {
    timeout,
    maxBytes: 4096,
    headers: {
      ...headers,
      Accept: '*/*',
    },
  });
  const status = Number(response && response.status ? response.status : 0);
  if (status && (status < 200 || status >= 400)) {
    throw new Error(`直播地址返回 HTTP ${status}`);
  }
  return {
    text: responseDataText(response && response.data),
    finalURL: String(
      (response && (response.finalURL || response.urlEffective || response.responseURL || response.url))
      || url
    ).trim(),
    status,
    headers: response && (response.headers || response.respHeaders || {}),
  };
}

function fetchTextResponse(url, headers, timeout) {
  const response = Widget.http.get(url, {
    timeout,
    headers: {
      ...headers,
      Accept: '*/*',
    },
  });
  const status = Number(response && response.status ? response.status : 0);
  if (status && (status < 200 || status >= 400)) {
    throw new Error(`直播地址返回 HTTP ${status}`);
  }
  return {
    text: responseDataText(response && response.data),
    finalURL: String(
      (response && (response.finalURL || response.urlEffective || response.responseURL || response.url))
      || url
    ).trim(),
    status,
    headers: response && (response.headers || response.respHeaders || {}),
  };
}

function responseDataText(data) {
  if (typeof data === 'string') return data;
  if (data == null) return '';
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data);
    } catch (_) {
      return String(data || '');
    }
  }
  return String(data || '');
}

function headerValue(headers, name) {
  const target = String(name || '').toLowerCase();
  const entries = Object.entries(headers || {});
  for (const [key, value] of entries) {
    if (String(key || '').toLowerCase() === target) return String(value || '');
  }
  return '';
}

function assertPlayableHTTPResponse(response, url) {
  const text = String(response && response.text || '').trim();
  const contentType = headerValue(response && response.headers, 'content-type').toLowerCase();
  const finalURL = String((response && response.finalURL) || url || '').toLowerCase();
  if (contentType.includes('application/json') || text.startsWith('{') || text.startsWith('[')) {
    throw new Error(`直播地址返回 JSON，不是媒体流：${playbackErrorPreview(text)}`);
  }
  if (
    contentType.includes('text/html')
    || /^<!doctype\s+html/i.test(text)
    || /^<html[\s>]/i.test(text)
    || finalURL.includes('/404')
  ) {
    throw new Error(`直播地址返回网页，不是媒体流：${playbackErrorPreview(text)}`);
  }
}

function playbackErrorPreview(value) {
  return String(value || '').replace(/\s+/g, ' ').slice(0, 80);
}

function containerFromPlaybackResponse(response, fallbackURL) {
  const text = String(response && response.text || '');
  const finalURL = String((response && response.finalURL) || fallbackURL || '');
  const contentType = headerValue(response && response.headers, 'content-type').toLowerCase();
  const urlContainer = containerFromURL(finalURL || fallbackURL);
  const trimmed = text.trimStart();

  if (
    contentType.includes('mpegurl')
    || contentType.includes('vnd.apple')
    || contentType.includes('m3u')
    || trimmed.startsWith('#EXTM3U')
    || urlContainer === 'm3u8'
  ) {
    return 'm3u8';
  }
  if (contentType.includes('x-flv') || contentType.includes('flv') || trimmed.startsWith('FLV') || urlContainer === 'flv') {
    return 'flv';
  }
  if (contentType.includes('mp2t') || contentType.includes('mpegts') || urlContainer === 'ts') {
    return 'ts';
  }
  if (contentType.includes('mp4') || contentType.includes('quicktime') || urlContainer === 'mp4') {
    return 'mp4';
  }
  if (urlContainer && urlContainer !== 'm3u8') return urlContainer;
  return 'm3u8';
}

function selectHLSVariant(playlist, baseURL) {
  const lines = String(playlist || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const variants = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith('#EXT-X-STREAM-INF')) continue;
    const uri = nextPlaylistURI(lines, index + 1);
    if (!uri) continue;
    variants.push({
      url: absolutizeURL(uri, baseURL),
      bandwidth: Number(attr(line, 'BANDWIDTH') || 0),
      resolution: attr(line, 'RESOLUTION'),
      codecs: attr(line, 'CODECS'),
    });
  }

  variants.sort((left, right) => {
    const leftScore = variantScore(left);
    const rightScore = variantScore(right);
    if (leftScore !== rightScore) return rightScore - leftScore;
    return (right.bandwidth || 0) - (left.bandwidth || 0);
  });

  return variants[0] || null;
}

function nextPlaylistURI(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line || line.startsWith('#')) continue;
    return line;
  }
  return '';
}

function variantScore(variant) {
  const resolution = String(variant.resolution || '');
  const match = resolution.match(/(\d+)x(\d+)/);
  const pixels = match ? Number(match[1]) * Number(match[2]) : 0;
  const codecs = String(variant.codecs || '').toLowerCase();
  let score = pixels;
  if (codecs.includes('hvc1') || codecs.includes('hev1')) score += 1000;
  if (codecs.includes('av01')) score -= 1000;
  return score;
}

function probeFirstHLSSegment(playlist, candidate) {
  const lines = String(playlist || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const segment = lines.find((line) => line && !line.startsWith('#'));
  if (!segment) return;

  const segmentURL = absolutizeURL(segment, candidate.url);
  if (!/^https?:\/\//i.test(segmentURL)) return;

  const response = Widget.http.get(segmentURL, {
    timeout: PLAY_PROBE_TIMEOUT,
    headers: {
      ...playbackHeaders(candidate),
      Range: 'bytes=0-0',
    },
  });
  const status = Number(response && response.status ? response.status : 0);
  if (status && (status < 200 || status >= 400)) {
    throw new Error(`直播分片返回 HTTP ${status}`);
  }
}

function streamCandidate(channel) {
  return normalizeCandidate({
    url: channel.url,
    title: channel.title,
    group: channel.group,
    referer: channel.referer,
    headers: channel.headers,
    huyaRoomId: channel.huyaRoomId || huyaRoomIdFromURL(channel.url),
  }, channel);
}

function normalizeCandidate(value, fallback = {}) {
  if (typeof value === 'string') {
    return {
      url: value.trim(),
      headers: {},
      referer: fallback.referer || value.trim(),
    };
  }

  const url = String((value && (value.url || value.playUrl || value.src)) || '').trim();
  const headers = {
    ...(fallback.headers || {}),
    ...((value && value.headers) || {}),
  };
  const referer = String((value && (value.referer || value.referrer)) || fallback.referer || url).trim();
  return {
    url,
    title: (value && value.title) || fallback.title || '',
    group: (value && value.group) || fallback.group || '',
    referer,
    headers,
    huyaRoomId: huyaRoomIdFromURL(url) || (value && value.huyaRoomId) || fallback.huyaRoomId || '',
  };
}

function playbackHeaders(candidate) {
  const headers = normalizeHeaders({
    'User-Agent': USER_AGENT,
    ...(candidate.headers || {}),
  });
  if (!headers['User-Agent']) headers['User-Agent'] = USER_AGENT;
  if (!headers.Referer && candidate.referer) {
    headers.Referer = normalizeHeaderValue('Referer', candidate.referer);
  }
  return headers;
}

function sortCandidates(candidates) {
  return [...(candidates || [])]
    .filter((candidate) => candidate && String(candidate.url || '').trim())
    .sort((left, right) => candidateScore(left) - candidateScore(right));
}

function candidateScore(candidate) {
  const url = String(candidate.url || '').toLowerCase();
  const container = containerFromURL(url);
  let score = 0;
  if (container === 'm3u8' || container === 'm3u') score -= 30;
  if (url.startsWith('https://')) score -= 4;
  if (/live\.php|\.php\?|\.asp\?|\.aspx\?/i.test(url)) score += 12;
  if (/backup\.m3u8/i.test(url)) score += 20;
  return score;
}

function normalizeChannelName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '');
}

function cleanChannelTitle(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*(?:\((?:\s*\d+\s*\/\s*\d+\s*|源\d+|线路\d+|备用\d+|高清|超清|标清|HD|FHD|4K)\)|（(?:\s*\d+\s*\/\s*\d+\s*|源\d+|线路\d+|备用\d+|高清|超清|标清|HD|FHD|4K)）)\s*$/i, '')
    .trim();
}

function playbackTitle(value) {
  return cleanChannelTitle(value).replace(/\s*[\(（]\s*\d+\s*\/\s*\d+\s*[\)）]\s*$/g, '').trim() || '直播频道';
}

function readSubscriptions(source) {
  const items = [];
  parseSubscriptionList(source.subscriptions || source.subscriptionList || source.sources || source.playlists)
    .forEach((entry) => addSubscription(items, entry));
  const legacyURL = String(source.url || '').trim();
  if (legacyURL) {
    addSubscription(items, {
      name: String(source.name || source.title || '自定义订阅').trim(),
      url: legacyURL,
    });
  }
  return items;
}

function parseSubscriptionList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object') return [value];

  const text = String(value || '').trim();
  if (!text) return [];
  if (/^[\[{]/.test(text)) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (_) {}
  }

  return text
    .split(/\r?\n|;;+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*\|\s*/);
      if (parts.length >= 2) return { name: parts[0], url: parts.slice(1).join('|') };
      return { url: line };
    });
}

function addSubscription(items, entry) {
  const url = String((entry && (entry.url || entry.link || entry.href || entry.value)) || '').trim();
  if (!url || items.some((item) => item.url === url)) return;
  const rawName = String((entry && (entry.name || entry.title || entry.label)) || '').trim();
  const name = rawName || `自定义订阅 ${items.length + 1}`;
  items.push({
    id: `custom-${normalizeChannelName(name || url).slice(0, 24) || items.length + 1}`,
    name,
    title: name,
    url,
  });
}

function matchesFilter(value, filter) {
  const pattern = String(filter || '').trim();
  if (!pattern) return true;
  const text = String(value || '');
  try {
    return new RegExp(pattern, 'i').test(text);
  } catch (_) {
    return text.toLowerCase().includes(pattern.toLowerCase());
  }
}

function includesText(value, query) {
  return String(value || '').toLowerCase().includes(String(query || '').toLowerCase());
}

function sanitizeColor(value) {
  const color = String(value || DEFAULT_BG_COLOR).replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
  return color.length === 6 ? color : DEFAULT_BG_COLOR;
}

function boundedInteger(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(number)));
}

function absolutizeURL(value, baseURL) {
  const url = String(value || '').trim();
  if (!url || /^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
  try {
    return new URL(url, baseURL).toString();
  } catch (_) {
    return url;
  }
}

function placeholderImage(title, config, wide) {
  const size = wide ? '640x360' : '360x360';
  return `https://placehold.co/${size}/${config.bg_color}/222222/png?text=${encodeURIComponent(shortTitle(title))}`;
}

function shortTitle(title) {
  return String(title || 'Live').replace(/\s+/g, '').slice(0, 12) || 'Live';
}

function containerFromURL(url) {
  const clean = String(url || '').split('?')[0].split('#')[0].toLowerCase();
  let pathname = clean;
  try {
    pathname = new URL(clean).pathname.toLowerCase();
  } catch (_) {}
  const filename = pathname.slice(pathname.lastIndexOf('/') + 1);
  const ext = filename.includes('.') ? filename.slice(filename.lastIndexOf('.') + 1) : '';
  if (ext === 'm3u' || ext === 'm3u8') return 'm3u8';
  if (ext === 'flv') return 'flv';
  if (ext === 'ts') return 'ts';
  if (ext === 'mp4') return 'mp4';
  if (['php', 'asp', 'aspx', 'jsp'].includes(ext)) return '';
  return ext || '';
}

function encodeChannelPayload(channel) {
  return 'live:' + base64Encode(JSON.stringify({
    url: channel.url,
    title: playbackTitle(channel.title),
    group: channel.group,
    referer: channel.url,
    headers: channel.headers || {},
    alternates: channel.alternates || [streamCandidate(channel)],
  }));
}

function decodeChannelPayload(value) {
  const text = String(value || '');
  if (!text.startsWith('live:')) return { url: text };
  try {
    return JSON.parse(base64Decode(text.slice('live:'.length))) || {};
  } catch (_) {
    return {};
  }
}

function encodeKey(value) {
  return base64Encode(String(value || ''));
}

function decodeKey(value) {
  try {
    return base64Decode(String(value || ''));
  } catch (_) {
    return String(value || '');
  }
}

function base64Encode(value) {
  const text = String(value || '');
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (_) {
    return btoa(text);
  }
}

function base64Decode(value) {
  const raw = atob(String(value || ''));
  try {
    return decodeURIComponent(escape(raw));
  } catch (_) {
    return raw;
  }
}

globalThis.getManifest = getManifest;
globalThis.getHome = getHome;
globalThis.home = getHome;
globalThis.getHomeSection = getHomeSection;
globalThis.homeSection = getHomeSection;
globalThis.getCategory = getCategory;
globalThis.category = getCategory;
globalThis.search = search;
globalThis.quickSearch = search;
globalThis.resolvePlayback = resolvePlayback;
globalThis.resolve = resolvePlayback;
globalThis.play = resolvePlayback;
