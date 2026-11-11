// @name NO视频 Mini Library

const DEFAULT_BASE = 'https://www.novipnoad.net';
let BASE = DEFAULT_BASE;
const PLAYER_BASE = 'https://player.novipnoad.net';
const ENC_BASE = 'https://enc-vod.oss-internal.novipnoad.net';
const IMAGE_BASE = 'https://img.novipnoad.net';
const COOKIE_KEY = 'novipnoad.cf.cookie';
const NOVIPNOAD_LOGO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAGiElEQVR42u1df2gcRRR+SqVFOSmHEAgtAaU9SyCgMVRaKi2CQkGUgmIxGAJ6Nn2cKBH/EAqiCVFaLEpAQylUhIiEFmmJGE4sLRWJCaXQUqj4R4tQLAeKoT+knH3uwHcSQnKd2d3Znd2dB8sme7Pz432z897MvvmWyIsXL1685F2E6V6vhXQB6PVa8AAUVvk9HoB0ARj0AKSn/EeFqeoBSA+AVzINgDB1C1O/MI0Ff08J02zwSF8RpgVhagqT4LyA67NIN4b7ulOs+wZh+iRTAAhTJyqslNiAgqMeDeSn8u1MsC0vC9NEJgAQpgFhmolJ4Xc7VDkDCfT+/U4DIEwdwjQSY08P82So8jss9f4fnQRAmEoYo5spKX7p0UR9SjG1byN6/7xzAAjTUIo9XueJGIqhjbvR+90BAN7MjKOKX85GdEdo5wFh+tsZAFCBZkaUv3hYqoZo66vCdBJ5pA+AMI1nTPFLj3GDtj4uTJ9iTpIuADC00zEp4YIwHRammjA9I0wVYSoHHswqlLUK/1fwew3pL8RU/vTdDLQwrRGm14XpzKL70gEAk6nZiI2uw2B3RaxLF/KpR6zPbLtJXJD/VmH6QphupQoAlH8uZCNvwn2rWKpbBfnfDFm/c8uBEAxTDwnTm8I0tyR9sgBg2Anb85UfXk6ok5RRXtgnobQkv2eF6UthupM2AGHG/GO2erzmE3EsjE1YlMfDwvTeCvYmOQBCejtD5IDARoTyjoTpRWE6ukKaZABAAaZeTZ9j61J9Ibwm1e6PhOmyBgCP2ZzhNg29mzI5KLANdcPJWrv0/wNgs9ImywvHM/JO4rhBm/7UAOBJF8bOesbexNVjmMApAN4WpvtsuZwNgzG/nDEAyjHMpL8WpqdsVdDEj+6jDAoMc1jl/ypM7wQTvwdsvclqZsnVTNhFbfX+HbYqNaI7yaIcSIjJ2iX0/gdtVUh37K/kBICKIQCTNnv/gO7aDuVEsM4/ZuBwDNvs/TOaq5plyplorqIq/Wy3udSs0wv2U45Fo/2dtgquFmnsjwBC1VahU3mb8cYMwhvq1aTNAnW8n5q1lT93QWjgZfwTNgvq1hx+jgjTa8K0qUAgfI9wlHtsFtKv6YKdD2bKnyP9hoIAMGo9DF7TD57H+RdhOogA1UfIS2IGuAXAv8J0GhEIL3kQ4gFg1gAAddxAgOrHAGGj12I0AK4YAiAIUP0BIOxOc7tQHgBYCAGAOv4CCAfgKfQK0/1eo+YANEMC0ALhJHxlNZve5jUa//pHOwAET9AZvKR+y2s02SegddxCmq+8RpOzAcsdF71Gk/GCVjy8Ru3PAzwAKc6EPQgprwV5ACwAoLsa+o8HwQ4Auu8DfvIA2ANB543YZ8J0tiggJNoG3XfCwnRI+fp5B6FNe6ZsFagbFbFHzXYRoJpLENKKitCOC1LrPQhQ/S1vIKQWF0RmkXHbEKD6jSkIrgKhGxlnuxIDBvt+dwSVfhcgXAoT5p2xeZDYZuIy8YYEUcVPA4TJKDtOUla+bnR0I6kKjRhswl4LEIaxm3we74szA4TB/oCRpCpktEMGIGwHn8IEIib+iIPJJKb2rG3z25DBltUOF8dEwV6rEhhFqogZmoZduJ0Q789tlDeN8quoT6lNG032iI0l/Vga75IEp04v1pU+gF34OVDGVcvKv4pyJlFuP+qxpk37THZJNuIi/DMFIdQ+YRU3KkzPwy4ojokToIK5FrPiryHfEyhnGOVu0mhbPROcF2F3ygvTOtgFxSz+PhiuvsM60u8RDPUN3H8W+R1G/oMob51Gm0x2ys9QmhKFKwLDmOLWf06Y9grTh1hH+haG+jyIMNQjfh3jeIuT5w7+v47fLyP9adx/CPntRf49GrRjYbgi0g82i8qWgiWOzcFw8QLWkfbBUB4BFYwK/z6FcXwOruwc/j+F348i/UHcvwf5bdZZGgjLluLSND0SXxCI99ZDETthKGsgQxoFC/k4eNkmcB7H9VGkq+G+nchnfYvYL0ZbZsymmCQIkRmz1NeGMM9QhnoL6MB2gYd/EMyEVZwHcX0X0m3BfR06Xy2KgzHLNQBi5YwLrq0GIV4XvkTRgz27vTj34HoX0q3WrGesnHGugVA41kRXQSgUb6irw1FhmHNdBqIw3NEug1AY9nSXQSjE9wOyAETuv6CRFQOd22/IZAmI3H5FKYtg5Oo7YlkGIjdf0suT95TJb0l68eLFixcvXrx48eLFixcH5T9Vf6oFIzbl3gAAAABJRU5ErkJggg==';
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const CATEGORY_SHORTCUTS = [
  { id: '/', title: '首页', subtitle: 'NO视频推荐', group: '推荐', kind: 'home', style: 'discover.annualWidePreview' },
  { id: '/movie/', title: '电影', subtitle: '电影片库', group: '片库', kind: 'movie' },
  { id: '/anime/', title: '动画', subtitle: '动画与番剧', group: '片库', kind: 'series' },
  { id: '/shows/', title: '综艺', subtitle: '综艺节目', group: '片库', kind: 'series' },
  { id: '/tv/western/', title: '欧美剧', subtitle: '欧美剧集', group: '剧集地区', kind: 'series' },
  { id: '/tv/japan/', title: '日剧', subtitle: '日本剧集', group: '剧集地区', kind: 'series' },
  { id: '/tv/korea/', title: '韩剧', subtitle: '韩国剧集', group: '剧集地区', kind: 'series' },
  { id: '/tv/hongkong/', title: '港剧', subtitle: '香港剧集', group: '剧集地区', kind: 'series' },
  { id: '/tv/taiwan/', title: '台剧', subtitle: '台湾剧集', group: '剧集地区', kind: 'series' },
  { id: '/tv/thailand/', title: '泰剧', subtitle: '泰国剧集', group: '剧集地区', kind: 'series' },
  { id: '/tv/turkey/', title: '土耳其剧', subtitle: '土耳其剧集', group: '剧集地区', kind: 'series' },
  { id: '/music/', title: '音乐', subtitle: '音乐现场与 MV', group: '其他', kind: 'movie' },
  { id: '/short/', title: '短片', subtitle: '短片合集', group: '其他', kind: 'movie' },
  { id: '/other/', title: '其他', subtitle: '其他视频', group: '其他', kind: 'movie' }
];

const HOME_MEDIA_SECTIONS = [
  { id: 'novip-home-featured', title: '首页推荐', pageId: '/', style: 'discover.spotlight', promotesToHero: true, contentType: 'mixed' },
  { id: 'novip-home-movie', title: '电影', pageId: '/movie/', style: 'discover.ranked', contentType: 'movie' },
  { id: 'novip-home-western', title: '欧美剧', pageId: '/tv/western/', style: 'discover.spotlight', contentType: 'series' },
  { id: 'novip-home-japan', title: '日剧', pageId: '/tv/japan/', style: 'discover.editorial', contentType: 'series' },
  { id: 'novip-home-korea', title: '韩剧', pageId: '/tv/korea/', style: 'discover.posterCompact', contentType: 'series' },
  { id: 'novip-home-anime', title: '动画', pageId: '/anime/', style: 'discover.spotlight', contentType: 'series' },
  { id: 'novip-home-shows', title: '综艺', pageId: '/shows/', style: 'discover.posterCompact', contentType: 'series' }
];

const HOME_SECTION_DEFINITIONS = [
  { id: 'novip-categories', title: '分类入口', style: 'discover.annualWidePreview', ids: ['/', '/movie/', '/anime/', '/shows/'] },
  {
    id: 'novip-tv-regions',
    title: '剧集地区',
    style: 'discover.annualListPreview',
    ids: ['/tv/western/', '/tv/japan/', '/tv/korea/', '/tv/hongkong/', '/tv/taiwan/', '/tv/thailand/', '/tv/turkey/']
  },
  { id: 'novip-more-library', title: '更多内容', style: 'discover.annualPosterStack', ids: ['/music/', '/short/', '/other/'] }
];

const CATEGORY_PREVIEW_ITEM_LIMIT = 10;
const CATEGORY_PREVIEW_CACHE = {};
const MINI_LIBRARY_ITEM_ASPECT_RATIO = '2:3';
const MINI_LIBRARY_HERO_ASPECT_RATIO = '16:9';

const WidgetMetadata = {
  id: 'baiplay_novipnoad_media_library',
  title: 'NO视频',
  name: 'NO视频',
  logo: NOVIPNOAD_LOGO,
  icon: NOVIPNOAD_LOGO,
  site: BASE,
  version: '1.2.6',
  author: 'baiPlay',
  description:
    'NO视频自定义媒体库。支持站点地址切换、首页懒加载、分类搜索、播放接口解析和 TMDB 资源匹配；站点启用 Cloudflare 时使用 App 浏览器会话。'
};

function imageHeaders(referer) {
  return {
    'User-Agent': UA,
    Referer: referer || BASE + '/'
  };
}

function getManifest(ext) {
  activateBaseURL(ext);
  return {
    id: WidgetMetadata.id,
    name: WidgetMetadata.name,
    title: WidgetMetadata.title,
    version: WidgetMetadata.version,
    author: WidgetMetadata.author,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    site: BASE,
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
          'runtimeMinutes',
          'mediaType',
          'seasonNumber',
          'episodeNumber',
          'episodeTitle',
          'episodeRuntimeMinutes'
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
        name: 'baseURL',
        title: '站点地址',
        type: 'input',
        value: DEFAULT_BASE,
        defaultValue: DEFAULT_BASE,
        description: '主站失效时，请查看 findno.tv 导航页，填入其中当前公布的 novipnoad.net、.cc、.us、.uk 或 .ca 首页地址。'
      }
    ]
  };
}

function normalizeBaseURL(value) {
  let text = String(value || '').trim();
  if (!text) return DEFAULT_BASE;
  if (!/^https?:\/\//i.test(text)) text = 'https://' + text;
  const match = /^https?:\/\/(www\.)?novipnoad\.(net|cc|us|uk|ca)\/?$/i.exec(text);
  if (!match) return DEFAULT_BASE;
  return 'https://' + (match[1] ? 'www.' : '') + 'novipnoad.' + match[2].toLowerCase();
}

function activateBaseURL(ext) {
  const args = ext && typeof ext === 'object' ? ext : {};
  let persisted = {};
  try {
    if (typeof Widget !== 'undefined' && Widget.parameters && typeof Widget.parameters.current === 'function') {
      persisted = Widget.parameters.current() || {};
    }
  } catch (_) {}
  const values = Object.assign(
    {},
    persisted,
    args.parameters || {},
    args.params || {},
    args.settings || {},
    args.config || {},
    args
  );
  BASE = normalizeBaseURL(values.baseURL || values.base_url || DEFAULT_BASE);
  return BASE;
}

function absolute(path, base) {
  if (!path) return '';
  const value = decodeEntities(String(path).trim());
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  if (value.indexOf('/upload/') === 0 || value.indexOf('/sinaimg/') === 0 || value.indexOf('/imgs.') === 0) {
    return IMAGE_BASE + value;
  }
  const root = base || BASE;
  if (value[0] !== '/') return root.replace(/\/+$/, '') + '/' + value;
  return root.replace(/\/+$/, '') + value;
}

function pathId(url) {
  const raw = decodeEntities(String(url || '').trim());
  const internalHost = /^(?:https?:)?\/\/(?:www\.)?novipnoad\.(?:net|cc|us|uk|ca|com)(?=[:/?#]|$)/i.exec(raw);
  if (internalHost) return raw.slice(internalHost[0].length) || '/';
  if (raw.indexOf('//') === 0) return '';
  if (/^https?:\/\//i.test(raw)) return '';
  const value = absolute(raw).replace(BASE, '');
  return value || '/';
}

function normalizePageId(value) {
  let id = String(value || '/').trim();
  id = id.replace(/^category:/, '');
  if (!id) return '/';
  if (/^https?:\/\//i.test(id)) return pathId(id) || '/';
  if (id[0] !== '/') id = '/' + id;
  return id;
}

function normalizeItemId(value) {
  let id = String(value || '').trim();
  id = id.replace(/^detail:/, '');
  if (/^https?:\/\//i.test(id)) id = pathId(id);
  return id;
}

function siteURL(path) {
  return absolute(path || '/', BASE);
}

function getCookieHeader() {
  const cached = Widget.storage.get(COOKIE_KEY);
  if (typeof cached === 'string' && cached.trim()) return cached.trim();
  if (cached && typeof cached.cookie === 'string') return cached.cookie.trim();
  return '';
}

function requestURL(url, referer, options) {
  const requestOptions = options || {};
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: referer || BASE + '/'
  };
  if (requestOptions.noCache) {
    headers['Cache-Control'] = 'no-cache';
    headers.Pragma = 'no-cache';
  }
  const cookie = getCookieHeader();
  if (cookie) headers.Cookie = cookie;

  let result;
  try {
    result = Widget.http.get(url, {
      headers,
      timeout: requestOptions.timeout || 30,
      useBrowserCookie: true,
      attachBrowserCookie: true,
      useBrowserFallback: requestOptions.allowBrowserFallback !== false,
      browserFallback: requestOptions.allowBrowserFallback !== false,
      allowBrowserFallback: requestOptions.allowBrowserFallback !== false
    });
  } catch (error) {
    const mapped = mapSiteRequestError(error);
    if (mapped) throw new Error(mapped);
    throw error;
  }
  if (result && result.error) {
    const mapped = mapSiteRequestError(result.error);
    throw new Error(mapped || String(result.error));
  }
  const data = typeof result.data === 'string' ? result.data : JSON.stringify(result.data || {});
  if (isCloudflareChallenge(data, result.status, result.headers || {})) {
    throw new Error(cloudflareMessage(''));
  }
  if (Number(result.status) >= 400) throw new Error('NO视频站点请求失败（HTTP ' + Number(result.status) + '）');
  return data;
}

function mapSiteRequestError(error) {
  const message = error && error.message ? error.message : String(error || '');
  if (!/cloudflare|cf_clearance|challenge-platform|浏览器验证|验证未完成|验证已取消|verify you are human/i.test(message)) {
    return '';
  }
  return cloudflareMessage(message);
}

function cloudflareMessage(message) {
  if (/取消|cancelled|canceled/i.test(String(message || ''))) {
    return 'NO视频的站点验证已取消；完成验证后重试。';
  }
  return 'NO视频需要完成 Cloudflare 浏览器验证。请在 App 显示的原站页面完成验证后重试。';
}

function fetchText(path, referer, options) {
  return requestURL(siteURL(path), referer || BASE + '/', options);
}

function fetchPlaybackDetailPage(itemId, episodeID) {
  if (!Widget.browser || typeof Widget.browser.fetch !== 'function') {
    throw new Error('当前 App 不支持 NO视频详情页刷新，请更新 App');
  }
  const url = siteURL(appendCacheBust(itemId));
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: BASE + '/',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  };
  const cookie = getCookieHeader();
  if (cookie) headers.Cookie = cookie;

  let result;
  try {
    // Navigate the real detail page in the App's WebKit session. Supplying
    // inline HTML here would skip the site's detail-page scripts and redirects.
    const browserOptions = {
      visible: !!episodeID,
      timeout: 90,
      waitAfterLoad: episodeID ? 1.2 : 0.8,
      headers
    };
    if (episodeID) {
      browserOptions.clickSelector = episodeClickSelector(episodeID);
      browserOptions.waitForFrameURLContains = episodeID;
    }
    result = Widget.browser.fetch(url, browserOptions);
  } catch (error) {
    const message = String(error && error.message || error || '');
    if (/超时|timeout|timed out/i.test(message)) throw new Error('NO视频详情页加载超时，请重试');
    throw new Error('NO视频详情页加载失败，请重试');
  }
  if (result && result.error) {
    const mapped = mapSiteRequestError(result.error);
    if (mapped) throw new Error(mapped);
    if (/没有匹配的剧集按钮/.test(String(result.error))) throw new Error('NO视频详情页没有找到所选剧集，请返回详情重新选择');
    if (/没有切换到所选剧集/.test(String(result.error))) throw new Error('NO视频播放器没有切换到所选剧集，请重试');
    if (/超时|timeout|timed out/i.test(String(result.error))) throw new Error('NO视频详情页加载超时，请重试');
    throw new Error('NO视频详情页未加载完成，请重试');
  }

  const html = result && typeof result.data === 'string' ? result.data : '';
  if (isCloudflareChallenge(html, result && result.status, result && result.headers)) {
    throw new Error('NO视频详情页验证未完成，请完成页面验证后重试');
  }
  if (Number(result && result.status) >= 400) {
    throw new Error('NO视频详情页请求失败（HTTP ' + Number(result.status) + '）');
  }
  if (!html) throw new Error('NO视频详情页没有返回内容，请重试');
  return html;
}

function episodeClickSelector(episodeID) {
  const value = String(episodeID || '');
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('NO视频所选剧集 ID 无效');
  return '[data-vid="' + value + '"]';
}

function selectedEpisodeIDHint(ext, itemId) {
  if (!/^\/tv\//i.test(String(itemId || '')) && !ext.seasonId && ext.seasonNumber == null && ext.episodeNumber == null) return '';
  const values = [ext.episodeId, ext.versionId].map(function (value) {
    return String(value == null ? '' : value).trim();
  }).filter(Boolean);
  if (!values.length || values.some(function (value) { return value !== values[0]; })) return '';
  return /^(?:ftn|ali)-[A-Za-z0-9_-]+$/i.test(values[0]) ? values[0] : '';
}

function fetchPlayer(url, referer, options) {
  return requestURL(url, referer || BASE + '/', options);
}

function isCloudflareChallenge(html, status, headers) {
  const text = String(html || '');
  const headerText = JSON.stringify(headers || {});
  return (
    /cf-mitigated["']?\s*[:=]\s*["']?challenge|challenge-platform|Just a moment|Cloudflare Ray ID|cf-browser-verification|Attention Required! \| Cloudflare|Verify you are human/i.test(text + headerText)
  );
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

function stripTags(value) {
  return decodeEntities(
    String(value || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
  ).trim();
}

function firstMatch(html, pattern) {
  const match = pattern.exec(html || '');
  if (!match) return '';
  for (let index = 1; index < match.length; index += 1) {
    if (match[index]) return match[index];
  }
  return '';
}

function firstNonEmptyValue() {
  for (let index = 0; index < arguments.length; index += 1) {
    const value = arguments[index];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function mediaHrefPattern() {
  return /\/(?:movie|tv|anime|shows|music|short|other)\/[^"'\s<>]+\.html/i;
}

function metaContent(html, key, value) {
  const source = String(html || '');
  const tagPattern = /<meta\b[^>]*>/gi;
  let match;
  while ((match = tagPattern.exec(source))) {
    const tag = match[0] || '';
    const tagValue = attr(tag, key);
    if (tagValue && tagValue.toLowerCase() === String(value || '').toLowerCase()) {
      return attr(tag, 'content');
    }
  }
  return '';
}

function attr(block, name) {
  const pattern = new RegExp(name + '\\s*=\\s*(?:"([^"]*)"|\\\'([^\\\']*)\\\'|([^\\s>]+))', 'i');
  const match = pattern.exec(block || '');
  return match ? decodeEntities(match[1] || match[2] || match[3] || '') : '';
}

function pickImage(block) {
  const images = [];
  const pattern = /(?:data-original|data-src|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let match;
  while ((match = pattern.exec(block || ''))) {
    const image = match[1] || match[2] || match[3] || '';
    if (/\.(?:jpg|jpeg|png|webp)(?:$|[?#])/i.test(image)) images.push(image);
  }
  const selected = images.find(url => !/loading|pixel|logo|avatar|apple-touch-icon|ogp/i.test(url)) || images[0] || '';
  return selected ? absolute(selected, IMAGE_BASE) : '';
}

function extractLeadingTags(title) {
  const match = /^【([^】]+)】/.exec(title || '');
  if (!match) return [];
  return match[1]
    .split(/[\/、,，\s]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .filter(item => !/^\d{4}|^\d+P$|中字|字幕|官方|破烂熊|追新番|神叨/i.test(item))
    .slice(0, 4);
}

function trailingTags(title) {
  const tags = [];
  const pattern = /【([^】]+)】/g;
  let match;
  while ((match = pattern.exec(title || ''))) {
    tags.push(match[1]);
  }
  return tags.slice(1);
}

function cleanMediaTitle(rawTitle) {
  const original = stripTags(rawTitle);
  const withoutLeading = original.replace(/^【[^】]+】\s*/, '');
  const withoutTrailing = withoutLeading.replace(/\s*【[^】]+】\s*$/g, '').replace(/\s*\(\d{4}\)\s*/g, ' ').trim();
  return withoutTrailing || original;
}

function parseYear(title) {
  const match = /\((19\d{2}|20\d{2})\)|【\s*(19\d{2}|20\d{2})/.exec(title || '');
  return match ? Number(match[1] || match[2]) : undefined;
}

function parseRemarks(title, block) {
  const original = stripTags(title || '');
  const tail = trailingTags(original).filter(Boolean).join(' / ');
  const status =
    firstMatch(original, /(更新至\s*\d+\s*(?:集|话|期)|\d+\s*集全|\d+\s*话全|全集|完结|END|EP?\s*\d+|第\s*\d+\s*(?:集|季|期)|1080P|4K|官方中字|中英字幕)/i) ||
    '';
  const content = stripTags(firstMatch(block, /<div[^>]+class=["'][^"']*item-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i));
  return status || tail || content.slice(0, 28) || '';
}

function categoryLabelFromUrl(url, title, block) {
  const text = [url || '', title || '', block || ''].join(' ');
  if (/\/movie\//i.test(text)) return '电影';
  if (/\/tv\/western\//i.test(text)) return '欧美剧';
  if (/\/tv\/japan\//i.test(text)) return '日剧';
  if (/\/tv\/korea\//i.test(text)) return '韩剧';
  if (/\/tv\/hongkong\//i.test(text)) return '港剧';
  if (/\/tv\/taiwan\//i.test(text)) return '台剧';
  if (/\/tv\/thailand\//i.test(text)) return '泰剧';
  if (/\/tv\/turkey\//i.test(text)) return '土耳其剧';
  if (/\/anime\//i.test(text)) return '动画';
  if (/\/shows\//i.test(text)) return '综艺';
  if (/\/music\//i.test(text)) return '音乐';
  if (/\/short\//i.test(text)) return '短片';
  if (/\/other\//i.test(text)) return '其他';
  if (/美剧|欧美剧|日剧|韩剧|港剧|台剧|泰剧|土耳其剧/.test(text)) return '剧集';
  if (/动漫|动画|番剧/.test(text)) return '动画';
  return '';
}

function mediaTypeFrom(url, title, block) {
  const text = [url || '', title || '', block || ''].join(' ');
  if (/\/movie\//i.test(text)) return 'movie';
  if (/\/tv\/|\/anime\/|\/shows\//i.test(text)) return 'series';
  if (/美剧|欧美剧|日剧|韩剧|港剧|台剧|泰剧|土耳其剧|动漫|动画|番剧|综艺|第\s*\d+\s*季|\d+\s*集全|更新至|完结|EP?\s*\d+/i.test(text)) {
    return 'series';
  }
  return 'movie';
}

function parseEpisodeNumber(text, fallback) {
  const value = String(text || '');
  const explicit = /(?:第\s*)?0*(\d+)\s*(?:集|话|期|回)|(?:^|[^a-z])e(?:p(?:isode)?)?\s*0*(\d+)|(?:^|\s)0*(\d{1,3})(?:\s*完结|\s*END|$)/i.exec(
    value
  );
  if (explicit) return Number(explicit[1] || explicit[2] || explicit[3]);
  return fallback;
}

function parseVideoItemBlocks(html) {
  const source = html || '';
  const blocks = [];
  const pattern = /<div\b[^>]*class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi;
  let match;
  while ((match = pattern.exec(source))) {
    const classes = String(match[1] || match[2] || match[3] || '').split(/\s+/);
    if (
      classes.indexOf('video-item') >= 0 ||
      classes.indexOf('post-item') >= 0 ||
      classes.indexOf('grid-item') >= 0 ||
      classes.indexOf('movie-item') >= 0 ||
      classes.indexOf('item') >= 0 && mediaHrefPattern().test(source.slice(match.index, match.index + 900))
    ) {
      blocks.push(match.index);
    }
  }
  const output = [];
  for (let index = 0; index < blocks.length; index += 1) {
    output.push(source.slice(blocks[index], index + 1 < blocks.length ? blocks[index + 1] : source.length));
  }
  return output;
}

function parseAnchorItemBlocks(html) {
  const source = String(html || '');
  const output = [];
  const seen = {};
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(source))) {
    const href = attr(match[1] || '', 'href');
    if (!mediaHrefPattern().test(href)) continue;
    const id = pathId(href);
    if (!id || seen[id]) continue;
    seen[id] = true;
    output.push(expandAnchorBlock(source, match.index, pattern.lastIndex, match[0]));
  }
  return output;
}

function expandAnchorBlock(source, anchorStart, anchorEnd, anchorHTML) {
  const before = source.slice(Math.max(0, anchorStart - 1800), anchorStart);
  const after = source.slice(anchorEnd, Math.min(source.length, anchorEnd + 2200));
  const containerStartRel = Math.max(
    before.lastIndexOf('<article'),
    before.lastIndexOf('<li'),
    before.lastIndexOf('<div'),
    before.lastIndexOf('<section')
  );
  const start = containerStartRel >= 0 ? Math.max(0, anchorStart - before.length + containerStartRel) : anchorStart;
  const closeCandidates = ['</article>', '</li>', '</div>', '</section>']
    .map(function (tag) {
      const index = source.indexOf(tag, anchorEnd);
      return index >= 0 ? index + tag.length : -1;
    })
    .filter(function (index) {
      return index > anchorEnd;
    })
    .sort(function (left, right) {
      return left - right;
    });
  const end = closeCandidates[0] || Math.min(source.length, anchorEnd + after.length);
  const block = source.slice(start, end);
  return mediaHrefPattern().test(block) ? block : anchorHTML;
}

function parseCard(block, fallbackTitle, rank) {
  const linkPattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let linkMatch;
  let href = '';
  let linkAttrs = '';
  let linkInner = '';
  while ((linkMatch = linkPattern.exec(block || ''))) {
    const candidateAttrs = linkMatch[1] || '';
    const candidateHref = attr(candidateAttrs, 'href');
    if (mediaHrefPattern().test(candidateHref)) {
      href = candidateHref;
      linkAttrs = candidateAttrs;
      linkInner = linkMatch[2] || '';
      break;
    }
  }
  if (!href) return null;

  const id = pathId(href);
  if (!id) return null;
  const rawTitle =
    stripTags(firstMatch(block, /<h3[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h3>/i)) ||
    stripTags(firstMatch(block, /<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)) ||
    attr(linkAttrs, 'title') ||
    attr(linkInner, 'alt') ||
    attr(block, 'alt') ||
    attr(block, 'title') ||
    stripTags(linkInner) ||
    fallbackTitle ||
    id;
  const title = cleanMediaTitle(rawTitle);
  if (!title || /NO视频|NOVIPNOAD/i.test(title)) return null;

  const typeLabel = categoryLabelFromUrl(href, rawTitle, block);
  const genres = extractLeadingTags(rawTitle);
  const badges = [typeLabel].concat(genres).filter(Boolean).slice(0, 4);
  const image = pickImage(block);
  return {
    id,
    title,
    name: title,
    originalTitle: stripTags(rawTitle),
    subtitle: typeLabel || fallbackTitle || '',
    type: mediaTypeFrom(href, rawTitle, block),
    poster: image,
    backdrop: image,
    imageHeaders: imageHeaders(siteURL(id)),
    overview: stripTags(
      firstMatch(block, /<div[^>]+class=["'][^"']*(?:gv-ex|item-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    ),
    year: parseYear(rawTitle),
    rank,
    remarks: parseRemarks(rawTitle, block),
    metadataText: parseRemarks(rawTitle, block) || typeLabel || '',
    badges,
    providerIds: {
      novipnoad: id,
      source: WidgetMetadata.id
    },
    action: { type: 'detail', id, itemId: id }
  };
}

function parseCards(html, fallbackTitle) {
  const seen = {};
  const items = [];
  const blocks = parseVideoItemBlocks(html).concat(parseAnchorItemBlocks(html));
  blocks.forEach(function (block) {
    const card = parseCard(block, fallbackTitle, items.length + 1);
    if (!card || seen[card.id]) return;
    seen[card.id] = true;
    items.push(card);
  });
  return items;
}

function toHeroMediaItem(item) {
  if (!item) return item;
  const image = item.backdrop || item.poster;
  item.backdrop = image || item.backdrop;
  item.poster = image || item.poster;
  item.aspectRatio = item.aspectRatio || MINI_LIBRARY_HERO_ASPECT_RATIO;
  return item;
}

function toPosterMediaItem(item) {
  if (!item) return item;
  item.aspectRatio = item.aspectRatio || MINI_LIBRARY_ITEM_ASPECT_RATIO;
  return item;
}

function parseCarousel(html) {
  const start = (html || '').indexOf('id=big-carousel');
  const end = (html || '').indexOf('</header>');
  const block = start >= 0 ? html.slice(start, end > start ? end : undefined) : html;
  return parseCards(block, '轮播推荐')
    .slice(0, 14)
    .map(function (item) {
      item.backdrop = item.backdrop || item.poster;
      item.aspectRatio = '16:9';
      return item;
    });
}

function parseSmartBoxSections(html) {
  const source = html || '';
  const positions = [];
  const pattern = /<div\b[^>]*class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi;
  let match;
  while ((match = pattern.exec(source))) {
    const classes = String(match[1] || match[2] || match[3] || '').split(/\s+/);
    if (classes.indexOf('smart-box') >= 0) positions.push(match.index);
  }

  const sections = [];
  positions.forEach(function (start, index) {
    const block = source.slice(start, index + 1 < positions.length ? positions[index + 1] : source.length);
    const title =
      stripTags(firstMatch(block, /<h[23][^>]+class=["'][^"']*(?:light-title|related-title|title)[^"']*["'][^>]*>([\s\S]*?)<\/h[23]>/i)) ||
      '推荐';
    const items = parseCards(block, title);
    if (!items.length) return;
    const moreHref = firstMoreHref(block);
    sections.push({
      id: sectionId(title, index + 1),
      title,
      style: sectionStyle(title, block),
      moreAction: moreHref ? {
        type: 'category',
        id: pathId(moreHref),
        pageId: pathId(moreHref),
        title,
        itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO
      } : undefined,
      items: items.map(toHeroMediaItem)
    });
  });
  return sections;
}

function firstMoreHref(block) {
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(block || ''))) {
    const text = stripTags(match[2]);
    const href = attr(match[1], 'href');
    if (href && /更多|More/i.test(text)) return href;
  }
  return '';
}

function sectionStyle(title, block) {
  if (/本月热门|排行|榜单|热门/i.test(title || '')) return 'discover.ranked';
  if (/smart-box-style-1/i.test(block || '')) return 'discover.spotlight';
  return 'discover.posterCompact';
}

function sectionId(title, index) {
  return (
    'novip-' +
    index +
    '-' +
    String(title || 'section')
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
      .slice(0, 24)
  );
}

function findCategory(pageId) {
  const id = normalizePageId(pageId || '/');
  return (
    CATEGORY_SHORTCUTS.find(function (item) {
      return item.id === id;
    }) ||
    CATEGORY_SHORTCUTS.find(function (item) {
      return item.id.replace(/\/+$/, '') === String(id).replace(/\/+$/, '');
    })
  );
}

function categoryShortcutItems(categoryIds) {
  const categories = (categoryIds && categoryIds.length ? categoryIds : CATEGORY_SHORTCUTS.map(function (item) { return item.id; }))
    .map(findCategory)
    .filter(Boolean);
  return categories.map(function (category, index) {
    return categoryShortcutItem(category, index + 1, []);
  });
}

function categoryShortcutItemsWithPreviews(categoryIds, previewLimit) {
  const categories = (categoryIds && categoryIds.length ? categoryIds : CATEGORY_SHORTCUTS.map(function (item) { return item.id; }))
    .map(findCategory)
    .filter(Boolean);
  return categories.map(function (category, index) {
    return categoryShortcutItem(category, index + 1, loadCategoryPreviewItems(category, previewLimit));
  });
}

function categoryShortcutItem(category, rank, previewItems) {
  const previews = Array.isArray(previewItems) ? previewItems.slice(0, CATEGORY_PREVIEW_ITEM_LIMIT) : [];
  const image = firstCategoryPreviewImage(previews) || NOVIPNOAD_LOGO;
  const metadataText = category.group || '分类';
  const item = {
    id: 'category:' + category.id,
    title: category.title,
    name: category.title,
    subtitle: category.subtitle || metadataText,
    type: 'collection',
    mediaType: 'collection',
    poster: image,
    backdrop: image,
    imageHeaders: imageHeaders(siteURL(category.id)),
    overview: categoryOverview(category),
    summary: categoryOverview(category),
    plot: categoryOverview(category),
    content: categoryOverview(category),
    description: categoryOverview(category),
    metadataText,
    remarks: metadataText,
    rank,
    badges: [category.group || '分类', category.kind || 'NO视频'].filter(Boolean),
    aspectRatio: MINI_LIBRARY_HERO_ASPECT_RATIO,
    previewItems: previews,
    action: {
      type: 'category',
      id: category.id,
      pageId: category.id,
      title: category.title,
      itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO
    },
    providerIds: {
      novipnoadCategory: category.id,
      source: WidgetMetadata.id
    }
  };
  return applyCategoryPreviewItems(item, previews);
}

function categoryOverview(category) {
  return '浏览 NO视频 ' + (category.title || '分类') + ' 中的影视资源。';
}

function loadCategoryPreviewItems(category, limit) {
  if (!category || !category.id) return [];
  const displayLimit = Math.max(1, Math.min(CATEGORY_PREVIEW_ITEM_LIMIT, Number(limit || CATEGORY_PREVIEW_ITEM_LIMIT)));
  const cacheKey = BASE + '|' + category.id;
  if (CATEGORY_PREVIEW_CACHE[cacheKey]) return CATEGORY_PREVIEW_CACHE[cacheKey].slice(0, displayLimit);
  try {
    const html = fetchText(category.id);
    const previews = parseCards(html, category.title)
      .map(toHeroMediaItem)
      .filter(function (item) {
        return item && (item.backdrop || item.poster);
      })
      .slice(0, CATEGORY_PREVIEW_ITEM_LIMIT);
    CATEGORY_PREVIEW_CACHE[cacheKey] = previews;
    return previews.slice(0, displayLimit);
  } catch (error) {
    return [];
  }
}

function cachedCategoryPreviewItems(category, limit) {
  if (!category || !category.id) return [];
  const displayLimit = Math.max(1, Math.min(CATEGORY_PREVIEW_ITEM_LIMIT, Number(limit || CATEGORY_PREVIEW_ITEM_LIMIT)));
  return (CATEGORY_PREVIEW_CACHE[BASE + '|' + category.id] || []).slice(0, displayLimit);
}

function cacheCategoryPreviewItems(categoryOrPageId, items) {
  const category = typeof categoryOrPageId === 'string' ? findCategory(categoryOrPageId) : categoryOrPageId;
  if (!category || !category.id || !Array.isArray(items) || !items.length) return;
  const previews = items
    .map(toHeroMediaItem)
    .filter(function (item) {
      return item && (item.backdrop || item.poster);
    })
    .slice(0, CATEGORY_PREVIEW_ITEM_LIMIT);
  if (previews.length) CATEGORY_PREVIEW_CACHE[BASE + '|' + category.id] = previews;
}

function applyCategoryPreviewItems(item, previewItems) {
  if (!item || !Array.isArray(previewItems) || !previewItems.length) return item;
  const previews = previewItems.slice(0, CATEGORY_PREVIEW_ITEM_LIMIT);
  const image = firstCategoryPreviewImage(previews);
  item.previewItems = previews;
  if (image) {
    item.poster = image;
    item.backdrop = image;
  }
  item.subtitle = previews.length + ' 条代表内容';
  item.metadataText = item.metadataText || item.subtitle;
  return item;
}

function firstCategoryPreviewImage(previewItems) {
  if (!Array.isArray(previewItems)) return '';
  for (let index = 0; index < previewItems.length; index += 1) {
    const item = previewItems[index] || {};
    const image = item.backdrop || item.poster;
    if (image) return image;
  }
  return '';
}

function previewLimitForSectionStyle(style) {
  const value = String(style || '');
  if (value === 'discover.annualWidePreview') return 5;
  if (value === 'discover.annualListPreview') return 3;
  if (value === 'discover.annualPosterStack') return 4;
  return CATEGORY_PREVIEW_ITEM_LIMIT;
}

function lazyHomeDefinitionSection(definition, items, isLazy) {
  return {
    id: definition.id,
    title: definition.title,
    style: definition.style,
    lazy: isLazy !== false,
    isLazy: isLazy !== false,
    moreAction: items[0] && items[0].action ? {
      type: 'category',
      id: items[0].action.id,
      pageId: items[0].action.pageId,
      title: definition.title,
      itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO
    } : undefined,
    loadAction: { type: 'custom', id: definition.id, title: definition.title },
    items
  };
}

function lazyHomeMediaSection(definition, index) {
  return {
    id: definition.id,
    title: definition.title,
    style: definition.style,
    contentType: definition.contentType,
    lazy: true,
    isLazy: true,
    promotesToHero: !!definition.promotesToHero,
    moreAction: {
      type: 'category',
      id: definition.pageId,
      pageId: definition.pageId,
      title: definition.title,
      itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO
    },
    loadAction: { type: 'custom', id: definition.id, pageId: definition.pageId, title: definition.title },
    items: [],
    rank: index
  };
}

function completedHomeMediaSection(definition, items, index) {
  return {
    id: definition.id,
    title: definition.title,
    style: definition.style,
    contentType: definition.contentType,
    lazy: false,
    isLazy: false,
    promotesToHero: !!definition.promotesToHero,
    moreAction: {
      type: 'category',
      id: definition.pageId,
      pageId: definition.pageId,
      title: definition.title,
      itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO
    },
    loadAction: { type: 'custom', id: definition.id, pageId: definition.pageId, title: definition.title },
    items: Array.isArray(items) ? items : [],
    rank: index
  };
}

function homeItemsFromHTML(html, definition) {
  const groups = [];
  if (definition.promotesToHero || definition.pageId === '/') groups.push(parseCarousel(html));
  groups.push(parseCards(html, definition.title));
  parseSmartBoxSections(html).forEach(function (section) {
    groups.push(section.items || []);
  });
  const items = uniqueMediaItems(groups).map(toHeroMediaItem).slice(0, 18);
  cacheCategoryPreviewItems(definition.pageId, items);
  return items;
}

function uniqueMediaItems(groups) {
  const seen = {};
  const items = [];
  (groups || []).forEach(function (group) {
    (group || []).forEach(function (item) {
      if (!item || !item.id || seen[item.id]) return;
      seen[item.id] = true;
      if (!item.rank) item.rank = items.length + 1;
      items.push(item);
    });
  });
  return items;
}

function homeSectionDefinition(ext) {
  const sectionId = ext.sectionId || ext.id || ext.actionId || '';
  const pageId = ext.pageId || ext.categoryId || '';
  return (
    HOME_MEDIA_SECTIONS.find(function (item) {
      return item.id === sectionId;
    }) ||
    HOME_MEDIA_SECTIONS.find(function (item) {
      return item.pageId === pageId;
    })
  );
}

function getHome(ext) {
  activateBaseURL(ext);
  return {
    pageType: 'home',
    title: WidgetMetadata.title,
    heroAspectRatio: MINI_LIBRARY_HERO_ASPECT_RATIO,
    hero: [],
    sections: HOME_MEDIA_SECTIONS.map(function (definition, index) {
        return lazyHomeMediaSection(definition, index + 1);
      }).concat(
        HOME_SECTION_DEFINITIONS.map(function (definition) {
          return lazyHomeDefinitionSection(definition, categoryShortcutItems(definition.ids), true);
        })
      )
  };
}

function getHomeSection(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  const sectionId = ext.sectionId || ext.id || '';

  const definitionSection = HOME_SECTION_DEFINITIONS.find(function (item) {
    return item.id === sectionId;
  });
  if (definitionSection) {
    return lazyHomeDefinitionSection(
      definitionSection,
      categoryShortcutItemsWithPreviews(definitionSection.ids, previewLimitForSectionStyle(definitionSection.style)),
      false
    );
  }

  const definition = homeSectionDefinition(ext) || {
    id: sectionId || 'novip-home-unknown',
    title: ext.title || '媒体',
    pageId: ext.pageId || ext.categoryId || '/',
    style: ext.style || 'discover.posterCompact'
  };
  const index =
    HOME_MEDIA_SECTIONS.findIndex(function (item) {
      return item.id === definition.id;
    }) + 1;

  try {
    const html = fetchText(definition.pageId);
    return completedHomeMediaSection(definition, homeItemsFromHTML(html, definition), index || 1);
  } catch (error) {
    const section = completedHomeMediaSection(definition, [], index || 1);
    section.subtitle = error && error.message ? error.message : '暂时无法加载，请重试';
    return section;
  }
}

function home(ext) {
  return getHome(ext || {});
}

function homeSection(ext) {
  return getHomeSection(ext || {});
}

function getSection(ext) {
  return getHomeSection(ext || {});
}

function section(ext) {
  return getHomeSection(ext || {});
}

function loadSection(ext) {
  return getHomeSection(ext || {});
}

function categoryPath(pageId, page) {
  const id = normalizePageId(pageId || '/');
  if (id === '/') return page && page > 1 ? '/page/' + page + '/' : '/';
  if (/^https?:\/\//i.test(id)) return pathId(id) || '/';
  const clean = id.split('?')[0].replace(/\/?$/, '/');
  const query = id.indexOf('?') >= 0 ? id.slice(id.indexOf('?')) : '';
  if (page && page > 1) return clean + 'page/' + page + '/' + query;
  return clean + query;
}

function getCategory(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  const pageId = normalizePageId(ext.pageId || ext.id || '/');
  const page = Number(ext.page || 1);
  const path = categoryPath(pageId, page);
  const html = fetchText(path);
  const category = findCategory(pageId);
  const title =
    ext.title ||
    stripTags(firstMatch(html, /<h2[^>]+class=["'][^"']*light-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i)) ||
    (category && category.title) ||
    '分类';
  const sections = parseSmartBoxSections(html);
  const items = parseCards(html, title).map(toPosterMediaItem);
  cacheCategoryPreviewItems(pageId, items);
  return {
    pageType: 'category',
    id: pageId,
    title,
    style: 'media.posterGrid',
    itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO,
    imageOrientation: 'portrait',
    selectedSortValue: ext.sort || ext.sortBy || ext.sort_by || '',
    sort: [],
    sections,
    items,
    page,
    hasMore: hasNextPage(html, page)
  };
}

function shortcutTitle(pageId) {
  const found = CATEGORY_SHORTCUTS.find(function (item) {
    return item.id === pageId;
  });
  return found ? found.title : '';
}

function hasNextPage(html, page) {
  if (/class=["'][^"']*nextpostslink|rel=["']next["']|下一页|Next/i.test(html || '')) return true;
  const next = Number(page || 1) + 1;
  return new RegExp('/page/' + next + '/').test(html || '');
}

function parsePlayInfo(html) {
  const source = String(html || '');
  const block =
    firstMatch(source, /(?:window\.)?playInfo\s*=\s*\{([\s\S]*?)\}\s*;?/i) ||
    firstMatch(source, /(?:var|let|const)\s+playInfo\s*=\s*\{([\s\S]*?)\}\s*;?/i) ||
    '';
  const playerFrameMatch = /<iframe\b(?=[^>]*\bid\s*=\s*(?:"player-iframe"|'player-iframe'|player-iframe))[^>]*>/i.exec(source);
  const playerFrame = playerFrameMatch ? playerFrameMatch[0] : '';
  const playerFrameSource = attr(playerFrame, 'src');
  const playerURL =
    (/^https?:\/\/player\.novipnoad\.(?:net|cc|us|uk|ca|com)\//i.test(playerFrameSource) ? playerFrameSource : '') ||
    firstMatch(source, /<iframe\b[^>]+src\s*=\s*(?:"([^"]*player\.novipnoad\.(?:net|cc|us|uk|ca|com)[^"]*)"|'([^']*player\.novipnoad\.(?:net|cc|us|uk|ca|com)[^']*)'|([^\s>]*player\.novipnoad\.(?:net|cc|us|uk|ca|com)[^\s>]*))/i) ||
    firstMatch(source, /(https?:\/\/player\.novipnoad\.(?:net|cc|us|uk|ca|com)\/v1\/\?[^"'<>\s]+)/i);
  const playerQuery = parseQueryString(decodeEntities(playerURL));
  const vid = firstNonEmptyValue(
    firstMatch(block, /["']?vid["']?\s*:\s*["']([^"']+)["']/i),
    firstMatch(block, /["']?url["']?\s*:\s*["']([^"']+)["']/i),
    firstMatch(source, /\bdata-vid\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i),
    firstMatch(source, /\bdata-url\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i),
    firstMatch(source, /\bvid\s*=\s*["']([^"']+)["']/i),
    playerQuery.url,
    playerQuery.id
  );
  const pkey = firstNonEmptyValue(
    firstMatch(block, /["']?pkey["']?\s*:\s*["']([^"']+)["']/i),
    firstMatch(source, /\bdata-pkey\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i),
    firstMatch(source, /\bdata-key\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i),
    firstMatch(source, /\bpkey\s*=\s*["']([^"']+)["']/i),
    playerQuery.pkey
  );
  return {
    playerURL: playerURL ? absolute(playerURL, PLAYER_BASE) : '',
    vid: firstNonEmptyValue(
      vid,
      isPlayableURL(vid) ? vid : ''
    ),
    pkey
  };
}

function parseQueryString(url) {
  const output = {};
  const value = String(url || '');
  const query = value.indexOf('?') >= 0 ? value.slice(value.indexOf('?') + 1) : value;
  query.split('&').forEach(function (part) {
    const pieces = part.split('=');
    if (!pieces[0]) return;
    const key = safeDecodeURIComponent(pieces[0]);
    const raw = pieces.slice(1).join('=');
    output[key] = safeDecodeURIComponent(raw || '');
  });
  return output;
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(String(value || '').replace(/\+/g, '%20'));
  } catch (error) {
    return String(value || '');
  }
}

function parseEpisodes(html, itemId, poster) {
  const episodes = [];
  const seen = {};
  const pattern = /<a\b([^>]*\bdata-vid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html || ''))) {
    const vid = decodeEntities(match[2] || match[3] || match[4] || '');
    if (!vid || seen[vid]) continue;
    const title = stripTags(match[5]) || '第 ' + (episodes.length + 1) + ' 集';
    const number = parseEpisodeNumber(title, episodes.length + 1);
    seen[vid] = true;
    episodes.push({
      id: vid,
      title,
      episodeNumber: number,
      seasonNumber: 1,
      poster,
      action: { type: 'play', itemId, seasonId: 'season-1', episodeId: vid, versionId: vid, title }
    });
  }
  return episodes;
}

function parseCategoryFromDetail(html) {
  const categoryLink = firstMatch(
    html,
    /<a\b[^>]+href\s*=\s*(?:"[^"]*\/(?:movie|tv|anime|shows|music|short|other)\/[^"]*"|'[^']*\/(?:movie|tv|anime|shows|music|short|other)\/[^']*'|[^\s>]*\/(?:movie|tv|anime|shows|music|short|other)\/[^\s>]*)[^>]*rel\s*=\s*(?:"category tag"|'category tag'|[^\s>]+)[^>]*>([\s\S]*?)<\/a>/i
  );
  return stripTags(categoryLink);
}

function parseOverviewFromDetail(html) {
  const meta =
    metaContent(html, 'name', 'description') ||
    metaContent(html, 'property', 'og:description') ||
    firstMatch(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (meta && !/NO视频为用户提供/i.test(meta)) return stripTags(meta).replace(/\s*\[&hellip;\]\s*$/, '');
  const content = firstMatch(html, /<div[^>]+class=["'][^"']*item-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  return stripTags(content)
    .replace(/Category:.*/i, '')
    .replace(/Tags:.*/i, '')
    .replace(/\[&hellip;\]/g, '')
    .trim();
}

function detailHTML(itemId, options) {
  const requestOptions = options || {};
  const storageKey = 'novipnoad.detail.latest.v1';
  const cacheID = BASE + '|' + itemId;
  let cached;
  if (!requestOptions.noCache) {
    try { cached = Widget.storage.get(storageKey); } catch (_) {}
  }
  if (!requestOptions.noCache && cached && cached.id === cacheID && typeof cached.html === 'string' &&
      Number(cached.expiresAt) > Date.now() && Number(cached.expiresAt) <= Date.now() + 60000) {
    return cached.html;
  }
  const requestPath = requestOptions.noCache ? appendCacheBust(itemId) : itemId;
  const html = fetchText(requestPath, BASE + '/', requestOptions);
  if ((!requestOptions.noCache || requestOptions.refreshCache) && html && html.length <= 2 * 1024 * 1024) {
    try { Widget.storage.set(storageKey, { id: cacheID, html, expiresAt: Date.now() + 60000 }); } catch (_) {}
  }
  return html;
}

function appendCacheBust(path) {
  const value = String(path || '');
  const separator = value.indexOf('?') >= 0 ? '&' : '?';
  return value + separator + '__baiplay_refresh=' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function detailTitle(html, itemId) {
  return metaContent(html, 'property', 'og:title') ||
    metaContent(html, 'name', 'twitter:title') ||
    stripTags(firstMatch(html, /<h1[^>]+class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)) ||
    stripTags(firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)) ||
    stripTags(firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).replace(/\s*[-_｜|].*NO视频.*$/i, '') ||
    itemId;
}

function parseDetailEpisodes(html, itemId, poster, rawTitle) {
  const title = rawTitle || detailTitle(html, itemId);
  const seasonNumber = seasonNumberFromTitle(title) || 1;
  const episodes = parseEpisodes(html, itemId, poster);
  if (!episodes.length && mediaTypeFrom(itemId, title, html) === 'series') {
    const coverage = episodeCoverageFromTitle(title);
    const info = parsePlayInfo(html);
    if (info.vid && coverage && !coverage.bundle && coverage.start === coverage.end) {
      episodes.push({
        id: info.vid,
        title: '第 ' + coverage.start + ' 集',
        episodeNumber: coverage.start,
        poster
      });
    }
  }
  return episodes.map(function (episode) {
    episode.seasonNumber = seasonNumber;
    episode.action = Object.assign({}, episode.action || {}, {
      type: 'play', itemId, seasonId: 'season-' + seasonNumber,
      episodeId: episode.id, versionId: episode.id, title: episode.title
    });
    return episode;
  });
}

function selectedEpisode(episodes, ext) {
  const args = ext || {};
  const generic = /^(?:default|online|play|source|line|线路|播放)$/i;
  const id = function (value) {
    const text = String(value == null ? '' : value).trim();
    return generic.test(text) ? '' : text;
  };
  let requestedID = id(args.episodeId);
  const versionID = id(args.versionId);
  const seasonID = id(args.seasonId);
  let season = args.seasonNumber != null ? Number(args.seasonNumber) : null;
  let number = args.episodeNumber != null ? Number(args.episodeNumber) : null;
  const composite = /^(\d+)_(\d+)$/.exec(requestedID);
  if (composite) {
    if (season != null && season !== Number(composite[1])) return null;
    if (number != null && number !== Number(composite[2])) return null;
    season = Number(composite[1]);
    number = Number(composite[2]);
    requestedID = '';
  }
  if (season != null && (!Number.isInteger(season) || season < 1)) return null;
  if (number != null && (!Number.isInteger(number) || number < 1)) return null;
  return episodes.find(function (episode) {
    if (requestedID && episode.id !== requestedID) return false;
    if (versionID && episode.id !== versionID) return false;
    if (season != null && Number(episode.seasonNumber) !== season) return false;
    if (number != null && Number(episode.episodeNumber) !== number) return false;
    if (seasonID && seasonID !== 'season-' + episode.seasonNumber && seasonID !== String(episode.seasonNumber)) return false;
    return true;
  }) || null;
}

function requestedPlaybackToken(ext) {
  const args = ext || {};
  const values = [args.episodeId, args.versionId]
    .map(playableToken)
    .filter(Boolean);
  if (values.length > 1 && values.some(function (value) { return value !== values[0]; })) return null;
  return values.length ? values[0] : '';
}

function playbackVidForDetail(playInfo, episodes, ext, html, itemId) {
  const episode = selectedEpisode(episodes, ext);
  if (episode) return episode.id;

  const requested = requestedPlaybackToken(ext);
  if (requested === null) return '';
  const isSeries = mediaTypeFrom(itemId, detailTitle(html, itemId), html) === 'series';
  if (!episodes.length && isSeries && requested) return requested;
  if (!episodes.length && requested && requested !== playInfo.vid) return '';
  return playInfo.vid || '';
}

function getDetail(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  const itemId = normalizeItemId(ext.itemId || ext.id || '');
  const html = detailHTML(itemId);
  const rawTitle = detailTitle(html, itemId);
  const poster = absolute(
    metaContent(html, 'property', 'og:image') ||
      metaContent(html, 'name', 'twitter:image') ||
      firstMatch(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) ||
      pickImage(html),
    IMAGE_BASE
  );
  const playInfo = parsePlayInfo(html);
  const episodes = parseDetailEpisodes(html, itemId, poster, rawTitle);
  const type = episodes.length || mediaTypeFrom(itemId, rawTitle, html) === 'series' ? 'series' : 'movie';
  const category = parseCategoryFromDetail(html) || categoryLabelFromUrl(itemId, rawTitle, html);
  const genres = unique(extractLeadingTags(rawTitle).concat(category ? [category] : []));
  const title = cleanMediaTitle(rawTitle);

  const seasons = episodes.length
    ? [
        {
          id: 'season-' + episodes[0].seasonNumber,
          title: '第 ' + episodes[0].seasonNumber + ' 季',
          seasonNumber: episodes[0].seasonNumber,
          episodes
        }
      ]
    : [];
  const recommendations = parseCards(
    firstMatch(html, /<div[^>]+class=["'][^"']*related-single[^"']*["'][^>]*>([\s\S]*?)<div id=["']comments["']/i) || html,
    '相关推荐'
  )
    .filter(function (item) {
      return item.id !== itemId;
    })
    .map(toHeroMediaItem)
    .slice(0, 18);

  return {
    id: itemId,
    title,
    name: title,
    originalTitle: stripTags(rawTitle),
    type,
    poster,
    backdrop: poster,
    imageHeaders: imageHeaders(siteURL(itemId)),
    posterHeaders: imageHeaders(siteURL(itemId)),
    backdropHeaders: imageHeaders(siteURL(itemId)),
    detailImageAspectRatio: MINI_LIBRARY_HERO_ASPECT_RATIO,
    overview: parseOverviewFromDetail(html),
    year: parseYear(rawTitle),
    genres,
    providerIds: {
      novipnoad: itemId,
      source: WidgetMetadata.id
    },
    seasons,
    resourceGroups: seasons.length ? [] : playInfo.vid ? buildResourceGroups(itemId, playInfo.vid, '') : [],
    resourceSummary: {
      versionCount: seasons.length ? episodes.length : playInfo.vid ? 1 : 0,
      sourceCount: playInfo.vid || episodes.length ? 1 : 0
    },
    recommendations: [
      {
        id: 'novip-related',
        title: '相关推荐',
        style: 'discover.posterCompact',
        items: recommendations
      }
    ]
  };
}

function buildResourceGroups(itemId, vid, episodeTitle, episode) {
  const directURL = isPlayableURL(vid) ? vid : '';
  const seasonNumber = episode && episode.seasonNumber;
  const episodeNumber = episode && episode.episodeNumber;
  return [
    {
      id: 'online',
      title: '在线播放',
      versions: [
        {
          id: vid || 'default',
          name: '在线播放',
          title: '在线播放',
          subtitle: episodeTitle || '',
          sourceName: 'NO视频',
          availability: 'playable',
          seasonNumber,
          episodeNumber,
          url: directURL || undefined,
          container: directURL ? inferContainer(directURL, '') : undefined,
          headers: directURL ? playbackHeaders(PLAYER_BASE + '/') : undefined,
          action: {
            type: 'play', itemId, seasonId: seasonNumber ? 'season-' + seasonNumber : undefined,
            episodeId: vid || '', versionId: vid || 'default', title: episodeTitle || '在线播放'
          },
          default: true
        }
      ]
    }
  ];
}

function getResourceVersions(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  const itemId = normalizeItemId(ext.itemId || ext.id || '');
  const html = detailHTML(itemId);
  const playInfo = parsePlayInfo(html);
  const episodes = parseDetailEpisodes(html, itemId, pickImage(html), detailTitle(html, itemId));
  const episode = selectedEpisode(episodes, ext);
  if (episodes.length && !episode) return [];
  const vid = playbackVidForDetail(playInfo, episodes, ext, html, itemId);
  if (!vid) return [];
  return buildResourceGroups(itemId, vid, episode ? episode.title : '', episode);
}

function resolvePlayback(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  const itemId = normalizeItemId(ext.itemId || ext.id || '');
  const detailURL = siteURL(itemId);
  const direct = playbackFromInfo({ url: ext.url || ext.playUrl || ext.play_url || '' }, detailURL);
  if (direct) return direct;

  // For a selected series episode, click its real detail-page button in WebKit
  // and wait until the site's player iframe points at that episode.
  let html = fetchPlaybackDetailPage(itemId, selectedEpisodeIDHint(ext, itemId));
  let playInfo = parsePlayInfo(html);
  let episodes = parseDetailEpisodes(html, itemId, '', detailTitle(html, itemId));
  let episode = selectedEpisode(episodes, ext);
  if (episodes.length && !episode) throw new Error('NO视频没有所选剧集，请返回详情重新选集');
  if (episode && !selectedEpisodeIDHint(ext, itemId)) {
    html = fetchPlaybackDetailPage(itemId, episode.id);
    playInfo = parsePlayInfo(html);
    episodes = parseDetailEpisodes(html, itemId, '', detailTitle(html, itemId));
    episode = selectedEpisode(episodes, ext);
    if (!episode) throw new Error('NO视频没有所选剧集，请返回详情重新选集');
  }
  const vid = playbackVidForDetail(playInfo, episodes, ext, html, itemId);
  if (!vid) throw new Error('NO视频没有所选剧集，请返回详情重新选集');
  const directVideo = playbackFromInfo({ url: vid }, detailURL);
  if (directVideo) return directVideo;
  const playerURL = selectedPlayerURL(playInfo, vid, itemId);
  if (!playerURL) throw new Error('没有解析到 NO视频播放参数');

  // Player HTML embeds short-lived authorization data. Always fetch a fresh copy.
  let playerHTML = fetchPlayer(playerURL, detailURL, { timeout: 8, allowBrowserFallback: false, noCache: true });
  if (looksLikeExpiredPlayerAuthorization(playerHTML)) {
    // A newly issued pkey can still expire in transit. Refresh once more only
    // when the player explicitly reports that condition.
    const refreshedHTML = fetchPlaybackDetailPage(itemId, episode ? episode.id : '');
    const refreshedInfo = parsePlayInfo(refreshedHTML);
    const refreshedEpisodes = parseDetailEpisodes(refreshedHTML, itemId, '', detailTitle(refreshedHTML, itemId));
    const refreshedEpisode = selectedEpisode(refreshedEpisodes, ext);
    if (refreshedEpisodes.length && !refreshedEpisode) throw new Error('NO视频没有所选剧集，请返回详情重新选集');
    const refreshedVid = refreshedEpisodes.length ? refreshedEpisode.id : refreshedInfo.vid;
    if (!refreshedVid || refreshedVid !== vid) throw new Error('NO视频没有所选剧集，请返回详情重新选集');
    const refreshedPlayerURL = selectedPlayerURL(refreshedInfo, vid, itemId);
    if (!refreshedPlayerURL) throw new Error('NO视频没有解析到刷新后的播放参数');
    playerHTML = fetchPlayer(refreshedPlayerURL, detailURL, { timeout: 8, allowBrowserFallback: false, noCache: true });
    if (looksLikeExpiredPlayerAuthorization(playerHTML)) {
      throw new Error('NO视频播放授权已过期，请返回详情刷新后重试');
    }
    return resolvePlaybackFromPlayerPage(playerHTML, refreshedPlayerURL, vid, itemId, detailURL);
  }
  return resolvePlaybackFromPlayerPage(playerHTML, playerURL, vid, itemId, detailURL);
}

function resolvePlaybackFromPlayerPage(playerHTML, playerURL, vid, itemId, detailURL) {
  const dependencyURL = playerDecryptURL(playerHTML, playerURL);
  const decryptSource = fetchPlayer(dependencyURL, playerURL, { timeout: 8, allowBrowserFallback: false, noCache: true });
  const document = playerPlaybackDocument(playerHTML, decryptSource, vid, itemId);
  const result = browserFetchPlayer(playerURL, detailURL, document);
  const info = browserStoredValue(result, 'baiplay-playback');
  if (info && info.error) throw new Error('NO视频' + String(info.error));
  const resolved = playbackFromInfo(info, playerURL);
  if (resolved) return resolved;
  const directKey = playbackFromInfo(extractBrowserVkey(result), playerURL);
  if (directKey) return directKey;
  const captured = playbackFromBrowserResult(result, playerURL);
  if (captured) return captured;
  if (info) throw new Error('NO视频没有返回有效播放地址');
  throw new Error('NO视频没有取得播放地址，请重试');
}

function selectedPlayerURL(info, vid, refPath) {
  if (info.playerURL) {
    let replaced = false;
    const value = info.playerURL.replace(/([?&](?:url|id)=)[^&#]*/gi, function (_, prefix) {
      replaced = true;
      return prefix + encodeURIComponent(vid);
    });
    return replaced ? value : value + (value.indexOf('?') >= 0 ? '&' : '?') + 'url=' + encodeURIComponent(vid);
  }
  if (!info.pkey) return '';
  return PLAYER_BASE + '/v1/?url=' + encodeURIComponent(vid) + '&pkey=' + encodeURIComponent(info.pkey) + '&ref=' + encodeURIComponent(refPath || '/');
}

function playerDecryptURL(html, playerURL) {
  const scripts = /<script\b[^>]*\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))[^>]*>/gi;
  let match;
  while ((match = scripts.exec(String(html || '')))) {
    const source = decodeEntities(match[1] || match[2] || match[3] || '');
    if (!/(?:^|\/)js\/jquery\.min\.js(?:[?#]|$)/i.test(source)) continue;
    const origin = firstMatch(playerURL, /^(https?:\/\/[^/]+)/i);
    const url = /^https?:\/\//i.test(source) ? source : origin + '/' + source.replace(/^\/+/, '');
    if (/^https:\/\/player\.novipnoad\.(?:net|cc|us|uk|ca|com)\/js\/jquery\.min\.js(?:[?#]|$)/i.test(url)) return url;
  }
  throw new Error('NO视频播放器解密组件已变化，请更新媒体库脚本');
}

function playerPlaybackDocument(playerHTML, decryptSource, vid, refPath) {
  const scripts = /<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi;
  let match;
  let authSource = '';
  while ((match = scripts.exec(String(playerHTML || '')))) {
    const start = match[1].search(/function\s+__\s*\(\s*\)/);
    if (start >= 0) { authSource = match[1].slice(start); break; }
  }
  if (!authSource) {
    if (looksLikeExpiredPlayerAuthorization(playerHTML)) {
      throw new Error('NO视频播放授权已过期，请返回详情刷新后重试');
    }
    throw new Error('NO视频播放器授权方式已变化，请更新媒体库脚本');
  }
  function scriptText(value) { return String(value).replace(/<\/script/gi, '<\\/script'); }
  function attribute(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  const child = '<!doctype html><meta charset="utf-8"><iframe id="play_iframe" src="about:blank"></iframe><script>' + scriptText(authSource) + '</script>';
  const config = JSON.stringify({ enc: ENC_BASE, vid: String(vid).replace(/^ftn-/, ''), ref: refPath || '/' }).replace(/</g, '\\u003c');
  // Execute source code only in WebKit, where its DOM/canvas/WASM checks work.
  // Fetch and decrypt in this same document immediately after AUTH, before it expires.
  return '<!doctype html><meta charset="utf-8"><script>sessionStorage.removeItem("baiplay-playback");sessionStorage.removeItem("vkey");</script>' +
    '<script>' + scriptText(decryptSource) + '</script>' +
    '<iframe id="baiplay-key-frame" srcdoc="' + attribute(child) + '"></iframe><script>' +
    '(function(){var config=' + config + ',started=false,done=false,poll,timer;' +
    'function finish(value){if(done)return;done=true;clearInterval(poll);clearTimeout(timer);sessionStorage.setItem("baiplay-playback",JSON.stringify(value));}' +
    'timer=setTimeout(function(){finish({error:"播放器解析超时，请重试"});},10000);' +
    'poll=setInterval(function(){try{var child=document.getElementById("baiplay-key-frame").contentWindow;' +
    'var target=child.document.getElementById("play_iframe");' +
    'if(started||typeof child.__!=="function"||!target||target.contentDocument.readyState!=="complete")return;' +
    'if(typeof JSON.decrypt!=="function"){finish({error:"播放解密组件加载失败，请重试"});return;}' +
    'started=true;clearInterval(poll);target.contentWindow.addEventListener("message",function(e){' +
    'if(done||e.source!==child||!e.data||e.data.action!=="AUTH"||!e.data.ckey)return;' +
    'try{var key=JSON.parse(child.sessionStorage.getItem("vkey")||"null");' +
    'if(!key||!key.ref||!key.ip||!key.time){finish({error:"播放授权参数不完整，请重试"});return;}' +
    'var script=document.createElement("script");script.src=config.enc+"/ftn/"+encodeURIComponent(config.vid)+".js?ckey="+encodeURIComponent(String(e.data.ckey).toUpperCase())+"&ref="+encodeURIComponent(key.ref||config.ref)+"&ip="+encodeURIComponent(key.ip)+"&time="+encodeURIComponent(key.time);' +
    'script.onload=function(){var value=window.videoUrl;if(typeof value==="string"){try{value=JSON.parse(value);}catch(_){value={url:value};}}finish(value&&typeof value==="object"?value:{error:"播放接口没有返回有效数据，请重试"});};' +
    'script.onerror=function(){finish({error:"播放接口请求失败，请重试"});};document.head.appendChild(script);' +
    '}catch(_){finish({error:"播放授权失败，请重试"});}});child.__();' +
    '}catch(_){finish({error:"播放授权执行失败，请重试"});}},50);})();</script>';
}

function looksLikeExpiredPlayerAuthorization(html) {
  const text = String(html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').toLowerCase();
  return /(?:页面|播放|授权|链接).{0,12}(?:已过期|过期|失效)|(?:过期|失效).{0,12}(?:刷新|重试)|\b(?:page|playback|authorization|link)\s+(?:has\s+)?expired\b|\bexpired\b.{0,40}\brefresh\b/.test(text);
}

function browserFetchPlayer(url, referer, document) {
  if (!Widget.browser || typeof Widget.browser.fetch !== 'function') throw new Error('当前 App 不支持 NO视频播放解析，请更新 App');
  let result;
  try {
    result = Widget.browser.fetch(url, {
      html: document,
      baseURL: url,
      visible: false,
      timeout: 14,
      waitAfterLoad: 0.1,
      waitForSessionStorageKey: 'baiplay-playback',
      headers: { 'User-Agent': UA, Referer: referer || BASE + '/' }
    });
  } catch (error) {
    if (/超时|timeout|timed out/i.test(String(error && error.message || error))) throw new Error('NO视频播放器解析超时，请重试');
    throw new Error('NO视频播放器解析失败，请重试');
  }
  if (result && result.error) {
    if (/超时|timeout|timed out/i.test(String(result.error))) throw new Error('NO视频播放器解析超时，请重试');
    throw new Error('NO视频播放器解析失败，请重试');
  }
  return result;
}

function browserStoredValue(result, name) {
  if (!result) return null;
  const storages = [result.sessionStorage].concat(Array.isArray(result.frameSessionStorage) ? result.frameSessionStorage : []);
  for (let index = 0; index < storages.length; index += 1) {
    const raw = (storages[index] || {})[name];
    if (!raw) continue;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch (_) {}
  }
  return null;
}

function extractBrowserVkey(result) {
  return browserStoredValue(result, 'vkey') || browserStoredValue(result, 'VKEY') || browserStoredValue(result, 'player_vkey');
}

function playbackFromInfo(info, referer) {
  if (!info || typeof info !== 'object') return null;
  if (info.code != null && Number(info.code) !== 200 && Number(info.code) !== 0) return null;
  const qualities = Array.isArray(info.quality) ? info.quality : Array.isArray(info.list) ? info.list : [];
  const candidates = [qualities[Number(info.defaultQuality || 0)]].concat(qualities, [info]);
  for (let index = 0; index < candidates.length; index += 1) {
    const entry = candidates[index];
    if (!entry || typeof entry !== 'object') continue;
    let url = String(entry.url || entry.playUrl || entry.play_url || entry.src || entry.m3u8 || '').trim();
    if (url.indexOf('//') === 0) url = 'https:' + url;
    if (!/^https?:\/\/[^/?#\s]+(?:[/?#]|$)/i.test(url)) continue;
    const path = safeDecodeURIComponent(url.split(/[?#]/)[0]);
    if (/\.(?:html?|php)(?:$|\/)|\/(?:undefined|null)(?:$|\/)/i.test(path)) continue;
    const container = inferContainer(url, entry.type || entry.container || info.type || '');
    if (!container || isBrowserOnlyPlaybackURL(url)) continue;
    return { url, container, headers: playbackHeaders(referer) };
  }
  return null;
}

function playbackHeaders(referer) {
  return { 'User-Agent': UA, Referer: referer || PLAYER_BASE + '/', Origin: PLAYER_BASE, Accept: '*/*', 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8' };
}

function playableToken(value) {
  const text = String(value || '').trim();
  if (!text || /^(default|online|play|source|line|线路|播放)$/i.test(text)) return '';
  if (isPlayableURL(text) || /^ftn-[A-Za-z0-9_-]+$/i.test(text) || /^[A-Za-z0-9_-]{12,}$/.test(text)) return text;
  return '';
}

function playbackFromBrowserResult(result, referer) {
  if (!result) return null;
  const candidates = (result.mediaSources || []).concat((result.capturedRequests || []).map(function (entry) { return entry && entry.url; }));
  for (let index = 0; index < candidates.length; index += 1) {
    const playback = playbackFromInfo({ url: candidates[index] }, referer);
    if (playback) return playback;
  }
  return null;
}

function isBrowserOnlyPlaybackURL(url) {
  return /media\.oss-internal\.novipnoad\.net\/ts\/|\.(?:ts|m2ts)(?:$|[?#&])/i.test(String(url || ''));
}

function isPlayableURL(url) {
  return /^(?:https?:)?\/\/[^\s]+\.(?:m3u8|m3u|mpd|mp4|m4v|mov|mkv|flv|avi|webm|ts|m2ts)(?:$|[?#&])/i.test(String(url || ''));
}

function inferContainer(url, type) {
  const text = safeDecodeURIComponent(String(url || '')) + ' ' + String(type || '').toLowerCase();
  const match = /\.(m3u8|m3u|mpd|mp4|m4v|mov|mkv|flv|avi|webm|ts|m2ts)(?:$|[?#&\s])/i.exec(text);
  if (match) return match[1].toLowerCase();
  const kind = String(type || '').toLowerCase();
  if (/mpegurl|hls|^m3u8$/.test(kind)) return 'm3u8';
  if (/dash|^mpd$/.test(kind)) return 'mpd';
  if (/^(?:video\/)?(?:mp4|m4v|mov|mkv|flv|avi|webm)$/.test(kind)) return kind.replace(/^video\//, '');
  return '';
}


function unique(values) {
  const seen = {};
  return (values || []).filter(function (item) {
    const key = String(item || '').trim();
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function searchPage(query, page, options) {
  const safeQuery = String(query || '').trim().slice(0, 100);
  const safePage = Math.max(1, Number(page || 1));
  const path = '/?s=' + encodeURIComponent(safeQuery) + (safePage > 1 ? '&paged=' + safePage : '');
  const html = fetchText(path, BASE + '/', options);
  const items = parseCards(html, '搜索结果').map(toPosterMediaItem);
  return {
    pageType: 'search',
    title: safeQuery ? '搜索：' + safeQuery : '搜索结果',
    style: 'media.posterGrid',
    itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO,
    imageOrientation: 'portrait',
    items,
    page: safePage,
    hasMore: hasNextPage(html, safePage)
  };
}

function search(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  return searchPage(
    ext.query || ext.text || ext.keyword || '',
    ext.page || 1,
    { allowBrowserFallback: ext.allowBrowserFallback !== false }
  );
}

function onSearch(ext) {
  return search(ext);
}

function getSearch(ext) {
  return search(ext || {});
}

function chineseNumber(value) {
  const text = String(value || '').replace(/两/g, '二').replace(/〇/g, '零');
  if (/^\d+$/.test(text)) return Number(text);
  const digits = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  let total = 0;
  let current = 0;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (Object.prototype.hasOwnProperty.call(digits, char)) {
      current = digits[char];
    } else if (char === '十' || char === '百') {
      total += (current || 1) * (char === '十' ? 10 : 100);
      current = 0;
    } else {
      return 0;
    }
  }
  return total + current;
}

function seasonNumberFromTitle(value) {
  let text = decodeEntities(String(value || ''));
  if (typeof text.normalize === 'function') text = text.normalize('NFKC');
  const match = /第\s*([一二三四五六七八九十百零〇两\d]+)\s*季|\bseason\s*(\d{1,2})\b|\bs(\d{1,2})(?=\b|\s*e\d)/i.exec(text);
  if (!match) return 0;
  const number = Number(match[2] || match[3] || chineseNumber(match[1]));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function normalizedMatchTitle(value, removeSeason, candidate) {
  let text = stripTags(value || '');
  if (typeof text.normalize === 'function') text = text.normalize('NFKC');
  text = text
    .replace(/【[^】]*】/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\((?:19|20)\d{2}\)/g, ' ')
    .replace(/(?:中字|中英字幕|官方中字|高清|蓝光)|\b(?:WEB-DL|1080P|720P|4K)\b/gi, ' ')
    .replace(/(?:更新至|全|共)\s*[一二三四五六七八九十百零〇两\d]+\s*(?:集|话|期|回)|[一二三四五六七八九十百零〇两\d]+\s*(?:集|话|期|回)\s*(?:全|完结|END)/gi, ' ');
  if (removeSeason) {
    text = text
      .replace(/第\s*[一二三四五六七八九十百零〇两\d]+\s*季/gi, ' ')
      .replace(/\bseason\s*\d{1,2}\b|\bs\d{1,2}(?=\b|\s*e\d)/gi, ' ');
  }
  if (candidate && removeSeason) {
    text = text
      .replace(/第\s*[一二三四五六七八九十百零〇两\d]+(?:\s*[-~至]\s*[一二三四五六七八九十百零〇两\d]+)?\s*(?:集|话|期|回)/gi, ' ')
      .replace(/\b(?:EPISODE|EP?|E)\s*\d+(?:\s*[-~至]\s*(?:EP?|E)?\s*\d+)?\s*(?:集|话|期|回)?\b/gi, ' ')
      .replace(/#\s*\d{1,3}\b/g, ' ');
    text = text.replace(/(?:^|[\s(])0*\d{1,3}(?:\s*[-~至]\s*0*\d{1,3})?\s*(?:集|话|期|回)?(?:\s*(?:完结|END))?[\s)]*$/i, ' ');
  }
  return text
    .toLowerCase()
    .replace(/[\s\u3000\u200b-\u200d!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~，。！？：；、“”‘’（）《》【】·…—]/g, '')
    .trim();
}

function matchTitle(itemTitle, titles, isSeries) {
  const candidate = normalizedMatchTitle(itemTitle, isSeries, true);
  const exactTitle = normalizedMatchTitle(itemTitle, isSeries, false);
  if (!candidate && !exactTitle) return false;
  return titles.some(function (title) {
    const target = normalizedMatchTitle(title, isSeries, false);
    return target && (exactTitle === target || candidate === target);
  });
}

function episodeCoverageFromTitle(value) {
  let text = cleanMediaTitle(stripTags(value || ''));
  if (typeof text.normalize === 'function') text = text.normalize('NFKC');
  const bundle = /(?:更新至|全|共)\s*([一二三四五六七八九十百零〇两\d]+)\s*(?:集|话|期|回)|([一二三四五六七八九十百零〇两\d]+)\s*(?:集|话|期|回)\s*(?:全|完结|END)/i.exec(text);
  if (bundle) {
    const count = chineseNumber(bundle[1] || bundle[2]);
    return count > 0 ? { start: 1, end: count, bundle: true } : null;
  }
  const range = /\bS\d{1,2}\s*E0*(\d{1,3})\s*[-~至]\s*(?:E)?0*(\d{1,3})\b|(?:^|[\s(])(?:EP?|第)?\s*0*(\d{1,3})\s*[-~至]\s*(?:EP?|第)?\s*0*(\d{1,3})\s*(?:集|话|期|回)?[\s)]*$/i.exec(text);
  if (range) {
    const start = Number(range[1] || range[3]);
    const end = Number(range[2] || range[4]);
    return start > 0 && end >= start ? { start, end, bundle: true } : null;
  }
  const explicit = /\bS\d{1,2}\s*E0*(\d{1,3})\b|第\s*([一二三四五六七八九十百零〇两\d]+)\s*(?:集|话|期|回)|\b(?:EPISODE|EP?|E)\s*0*(\d{1,3})\b|#\s*0*(\d{1,3})|[\s(]0*(\d{1,3})(?:\s*(?:集|话|期|回|完结|END))?[\s)]*$/i.exec(text);
  const number = explicit ? chineseNumber(explicit[1] || explicit[2] || explicit[3] || explicit[4] || explicit[5]) : 0;
  return number > 0 ? { start: number, end: number } : null;
}

function candidateMatches(item, titles, expectedType, year, season, episode, isSeries) {
  if (!item || !item.id || (expectedType && item.type !== expectedType)) return false;
  const sourceTitle = item.originalTitle || item.title || item.name || '';
  if (!matchTitle(sourceTitle, titles, isSeries)) return false;
  const candidateYear = Number(item.year || parseYear(sourceTitle) || 0);
  if (year && candidateYear && candidateYear !== year) return false;
  if (isSeries) {
    const candidateSeason = seasonNumberFromTitle(sourceTitle);
    if (candidateSeason && candidateSeason !== season) return false;
    if (season > 1 && candidateSeason !== season) return false;
    const coverage = episodeCoverageFromTitle(sourceTitle);
    if (episode && coverage && (episode < coverage.start || episode > coverage.end)) return false;
  }
  return true;
}

function matchResources(ext) {
  ext = ext || {};
  activateBaseURL(ext);
  const rawTitles = []
    .concat(ext.title || ext.name || [])
    .concat(ext.originalTitle || ext.originalName || [])
    .concat(ext.alternativeTitles || [])
    .concat(ext.searchTitles || [])
    .concat(ext.titles || []);
  const titles = unique(rawTitles.filter(function (value) { return typeof value === 'string' && value.trim(); })).slice(0, 4);
  const mediaType = String(ext.mediaType || ext.type || '').toLowerCase();
  const expectedType = mediaType === 'tv' || mediaType === 'series' || mediaType === 'season' || mediaType === 'episode'
    ? 'series'
    : mediaType === 'movie' ? 'movie' : '';
  const isSeries = expectedType === 'series' || ext.seasonNumber != null || ext.episodeNumber != null;
  const season = Math.max(1, Number(ext.seasonNumber || ext.season || 1));
  const episode = Math.max(0, Number(ext.episodeNumber || ext.episode || 0));
  const year = Number(isSeries ? (ext.seasonYear || ext.targetSeasonYear || (season === 1 ? ext.seriesYear || ext.year : 0)) : (ext.year || ext.releaseYear || 0));
  const results = [];
  const seen = {};

  for (let index = 0; index < titles.length && results.length < 8; index += 1) {
    let page;
    try {
      page = searchPage(titles[index], 1, { allowBrowserFallback: false });
    } catch (error) {
      if (mapSiteRequestError(error)) break;
      throw error;
    }
    (page.items || []).forEach(function (item) {
      if (seen[item && item.id] || !candidateMatches(item, titles, expectedType, year, season, episode, isSeries)) return;
      seen[item.id] = true;
      results.push(item);
    });
  }
  return { results: results.slice(0, 8) };
}

function matchMovie(ext) {
  return matchResources(ext);
}

function matchEpisode(ext) {
  return matchResources(ext);
}

function getCategories() {
  return CATEGORY_SHORTCUTS.map(function (category) {
    return {
      id: category.id,
      title: category.title,
      name: category.title,
      group: category.group || '分类',
      type: 'folder',
      kind: category.kind || 'category',
      sourceId: WidgetMetadata.id
    };
  });
}

function getItems(ext) {
  const page = getCategory(ext || {});
  return page.items || [];
}

function category(ext) {
  return getCategory(ext || {});
}

function detail(ext) {
  return getDetail(ext || {});
}

function resources(ext) {
  return getResourceVersions(ext || {});
}

function getVersions(ext) {
  return getResourceVersions(ext || {});
}

function resolve(ext) {
  return resolvePlayback(ext || {});
}

function play(ext) {
  return resolvePlayback(ext || {});
}

if (typeof globalThis !== 'undefined') {
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getHomeSection = getHomeSection;
  globalThis.getCategory = getCategory;
  globalThis.getCategories = getCategories;
  globalThis.getItems = getItems;
  globalThis.getDetail = getDetail;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.getVersions = getVersions;
  globalThis.resources = resources;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.resolve = resolve;
  globalThis.play = play;
  globalThis.search = search;
  globalThis.getSearch = getSearch;
  globalThis.onSearch = onSearch;
  globalThis.matchResources = matchResources;
  globalThis.matchMovie = matchMovie;
  globalThis.matchEpisode = matchEpisode;
  globalThis.home = home;
  globalThis.homeSection = homeSection;
  globalThis.getSection = getSection;
  globalThis.section = section;
  globalThis.loadSection = loadSection;
  globalThis.category = category;
  globalThis.detail = detail;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WidgetMetadata, getManifest, getHome, getHomeSection, getCategory, getDetail, getResourceVersions, resolvePlayback, search, matchResources };
}
