// @name NO视频 Mini Library

const BASE = 'https://www.novipnoad.net';
const PLAYER_BASE = 'https://player.novipnoad.net';
const ENC_BASE = 'https://enc-vod.oss-internal.novipnoad.net';
const IMAGE_BASE = 'https://img.novipnoad.net';
const COOKIE_KEY = 'novipnoad.cf.cookie';
const RC4_KEY = 'ce974576';
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
  version: '1.1.0',
  author: 'baiPlay',
  description:
    'NO视频自定义媒体库示例。首页按自定义媒体库协议懒加载；站点启用 Cloudflare 时仍由 App 浏览器代理或 cf_clearance Cookie 处理。'
};

function imageHeaders(referer) {
  return {
    'User-Agent': UA,
    Referer: referer || BASE + '/'
  };
}

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
      resourceMatching: false
    }
  };
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
  const value = absolute(url).replace(BASE, '');
  return value || '/';
}

function normalizePageId(value) {
  let id = String(value || '/').trim();
  id = id.replace(/^category:/, '');
  if (!id) return '/';
  if (/^https?:\/\//i.test(id)) return pathId(id);
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

function requestURL(url, referer) {
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: referer || BASE + '/'
  };
  const cookie = getCookieHeader();
  if (cookie) headers.Cookie = cookie;

  const result = Widget.http.get(url, {
    headers,
    useBrowserCookie: true,
    attachBrowserCookie: true,
    useBrowserFallback: true,
    browserFallback: true,
    allowBrowserFallback: true
  });
  const data = typeof result.data === 'string' ? result.data : JSON.stringify(result.data || {});
  if (isCloudflareChallenge(data, result.status, result.headers || {})) {
    throw new Error(
      'NO视频启用了 Cloudflare 浏览器校验，当前小程序 HTTP 环境无法直接读取页面。请在 App 侧提供浏览器代理请求，或在 Widget.storage 的 novipnoad.cf.cookie 写入可用 cf_clearance Cookie。'
    );
  }
  return data;
}

function fetchText(path, referer) {
  return requestURL(siteURL(path), referer || BASE + '/');
}

function fetchPlayer(url, referer) {
  return requestURL(url, referer || BASE + '/');
}

function isCloudflareChallenge(html, status, headers) {
  const text = String(html || '');
  const headerText = JSON.stringify(headers || {});
  return (
    Number(status) === 403 ||
    /cf-mitigated|challenge-platform|Just a moment|Cloudflare Ray ID|cf-browser-verification/i.test(text + headerText)
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
  const cacheKey = category.id;
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
  return (CATEGORY_PREVIEW_CACHE[category.id] || []).slice(0, displayLimit);
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
  if (previews.length) CATEGORY_PREVIEW_CACHE[category.id] = previews;
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

function getHome() {
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
    return completedHomeMediaSection(definition, [], index || 1);
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
  if (id === '/') return '/';
  if (/^https?:\/\//i.test(id)) return absolute(id).replace(BASE, '');
  const clean = id.split('?')[0].replace(/\/?$/, '/');
  const query = id.indexOf('?') >= 0 ? id.slice(id.indexOf('?')) : '';
  if (page && page > 1) return clean + 'page/' + page + '/' + query;
  return clean + query;
}

function getCategory(ext) {
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
  const playerURL =
    firstMatch(source, /<iframe\b[^>]+src\s*=\s*(?:"([^"]*player\.novipnoad\.net[^"]*)"|'([^']*player\.novipnoad\.net[^']*)'|([^\s>]*player\.novipnoad\.net[^\s>]*))/i) ||
    firstMatch(source, /(https?:\/\/player\.novipnoad\.net\/v1\/\?[^"'<>\s]+)/i);
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

function getDetail(ext) {
  const itemId = normalizeItemId(ext.itemId || ext.id || '');
  const html = fetchText(itemId);
  const rawTitle =
    metaContent(html, 'property', 'og:title') ||
    metaContent(html, 'name', 'twitter:title') ||
    firstMatch(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i) ||
    stripTags(firstMatch(html, /<h1[^>]+class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)) ||
    stripTags(firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)) ||
    stripTags(firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i)).replace(/\s*[-_｜|].*NO视频.*$/i, '') ||
    itemId;
  const poster = absolute(
    metaContent(html, 'property', 'og:image') ||
      metaContent(html, 'name', 'twitter:image') ||
      firstMatch(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) ||
      pickImage(html),
    IMAGE_BASE
  );
  const playInfo = parsePlayInfo(html);
  const episodes = parseEpisodes(html, itemId, poster);
  const type = episodes.length || mediaTypeFrom(itemId, rawTitle, html) === 'series' ? 'series' : 'movie';
  const category = parseCategoryFromDetail(html) || categoryLabelFromUrl(itemId, rawTitle, html);
  const genres = unique(extractLeadingTags(rawTitle).concat(category ? [category] : []));
  const title = cleanMediaTitle(rawTitle);

  const seasons = episodes.length
    ? [
        {
          id: 'season-1',
          title: '第 1 季',
          seasonNumber: 1,
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

function buildResourceGroups(itemId, vid, episodeTitle) {
  const directURL = isPlayableURL(vid) ? vid : '';
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
          url: directURL || undefined,
          container: directURL ? inferContainer(directURL, '') : undefined,
          headers: directURL ? playbackHeaders(PLAYER_BASE + '/') : undefined,
          action: { type: 'play', itemId, episodeId: vid || '', versionId: vid || 'default', title: episodeTitle || '在线播放' },
          default: true
        }
      ]
    }
  ];
}

function getResourceVersions(ext) {
  const itemId = normalizeItemId(ext.itemId || ext.id || '');
  const html = fetchText(itemId);
  const playInfo = parsePlayInfo(html);
  const episodes = parseEpisodes(html, itemId, pickImage(html));
  const requested = ext.episodeId || ext.versionId || '';
  const episode =
    episodes.find(function (item) {
      return item.id === requested;
    }) || episodes[0];
  const vid = requested || playInfo.vid || (episode ? episode.id : '');
  if (!vid) return [];
  return buildResourceGroups(itemId, vid, episode ? episode.title : '');
}

function resolvePlayback(ext) {
  const itemId = normalizeItemId(ext.itemId || ext.id || '');
  const detailURL = siteURL(itemId);
  const html = fetchText(itemId);
  const playInfo = parsePlayInfo(html);
  const episodes = parseEpisodes(html, itemId, '');
  const directInput = ext.url || ext.playUrl || ext.play_url || '';
  if (isPlayableURL(directInput)) {
    const container = inferContainer(directInput, '');
    return {
      url: directInput,
      container,
      headers: playbackHeaders(detailURL),
      preferDirectAVPlayer: shouldUseDirectAVPlayer(directInput, container)
    };
  }
  const requested = playableToken(ext.versionId) || playableToken(ext.episodeId) || playInfo.vid || '';
  const episode =
    episodes.find(function (item) {
      return item.id === requested || item.id === ext.episodeId;
    }) || null;
  const vid = requested || (episode ? episode.id : '') || playInfo.vid;
  const pkey = playInfo.pkey;
  if (!vid || !pkey) throw new Error('没有解析到 NO视频播放参数');

  const refPath = itemId || '/';
  const playerURL =
    playInfo.playerURL ||
    PLAYER_BASE + '/v1/?url=' + encodeURIComponent(vid) + '&pkey=' + encodeURIComponent(pkey) + '&ref=' + encodeURIComponent(refPath);
  const playerFrameURL = PLAYER_BASE + '/v1/player.php?id=' + encodeURIComponent(vid);
  const playbackReferer = playerURL || playerFrameURL;
  const browserResult = browserFetchPlayer(playerURL, detailURL);
  let lastError = '';

  let vkey = extractBrowserVkey(browserResult);
  if (vkey) {
    const directFromBrowserVkey = playbackFromVkeyDirect(vkey, playbackReferer);
    if (directFromBrowserVkey) return directFromBrowserVkey;
  }
  if (!vkey || !vkey.ckey) {
    try {
      const playerHTML = fetchPlayer(playerURL, detailURL);
      const playerVkey = extractVkey(playerHTML);
      if (playerVkey) vkey = playerVkey;
    } catch (error) {
      lastError = error && error.message ? error.message : String(error);
    }
  }
  if (vkey) {
    const directFromVkey = playbackFromVkeyDirect(vkey, playbackReferer);
    if (directFromVkey) return directFromVkey;
  }
  if (vkey && vkey.ckey) {
    try {
      return encryptedPlaybackFromVkey(vid, vkey, refPath, playbackReferer);
    } catch (error) {
      lastError = error && error.message ? error.message : String(error);
    }
  }

  const directPlayback = playbackFromBrowserResult(browserResult, playbackReferer);
  if (directPlayback) return directPlayback;

  if (!vkey || !vkey.ckey) {
    throw new Error('NO视频播放器校验未通过，无法生成播放密钥' + (lastError ? '：' + lastError : ''));
  }
  throw new Error(lastError || 'NO视频没有返回播放地址');
}

function encryptedPlaybackFromVkey(vid, vkey, refPath, playerFrameURL) {
  const numericId = String(vid).replace(/^ftn-/, '');
  const encURL =
    ENC_BASE +
    '/ftn/' +
    numericId +
    '.js?ckey=' +
    String(vkey.ckey).toUpperCase() +
    '&ref=' +
    encodeURIComponent(vkey.ref || refPath) +
    '&ip=' +
    encodeURIComponent(vkey.ip || '') +
    '&time=' +
    encodeURIComponent(vkey.time || '');
  const encJS = fetchPlayer(encURL, playerFrameURL);
  const payload = firstMatch(encJS, /JSON\.decrypt\(["']([^"']+)["']\)/i);
  if (!payload) throw new Error('NO视频没有返回可解密播放信息');

  const decrypted = rc4DecryptBase64(payload, RC4_KEY);
  let info;
  try {
    info = JSON.parse(decrypted);
  } catch (error) {
    throw new Error('NO视频播放信息解析失败：' + error.message);
  }
  const qualities = info.quality || info.list || [];
  const selected = qualities[Number(info.defaultQuality || 0)] || qualities[0] || info;
  const url = selected.url || selected.playUrl || info.url || '';
  if (!url) throw new Error('NO视频没有返回播放地址');
  const container = inferContainer(url, selected.type || info.type);
  return {
    url,
    container,
    headers: playbackHeaders(playerFrameURL),
    preferDirectAVPlayer: shouldUseDirectAVPlayer(url, container)
  };
}

function playbackFromVkeyDirect(vkey, referer) {
  const url = firstNonEmptyValue(
    vkey && vkey.url,
    vkey && vkey.playUrl,
    vkey && vkey.play_url,
    vkey && vkey.src,
    vkey && vkey.m3u8
  );
  if (!isPlayableURL(url)) return null;
  const container = inferContainer(url, vkey.type || vkey.container || '');
  return {
    url,
    container,
    headers: playbackHeaders(referer),
    preferDirectAVPlayer: shouldUseDirectAVPlayer(url, container)
  };
}

function playbackHeaders(referer) {
  return {
    'User-Agent': UA,
    Referer: referer || PLAYER_BASE + '/',
    Origin: PLAYER_BASE,
    Accept: '*/*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  };
}

function browserFetchPlayer(url, referer) {
  if (!Widget.browser || typeof Widget.browser.fetch !== 'function') return null;
  try {
    return Widget.browser.fetch(url, {
      visible: false,
      timeout: 60,
      waitAfterLoad: 2.0,
      waitForSessionStorageKey: 'vkey',
      waitForMediaSource: true,
      waitForAny: true,
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: referer || BASE + '/'
      }
    });
  } catch (error) {
    return null;
  }
}

function extractBrowserVkey(result) {
  if (!result) return null;
  const storages = [result.sessionStorage, result.localStorage]
    .concat(Array.isArray(result.frameSessionStorage) ? result.frameSessionStorage : [])
    .concat(Array.isArray(result.frameLocalStorage) ? result.frameLocalStorage : []);
  for (let index = 0; index < storages.length; index += 1) {
    const storage = storages[index] || {};
    const raw = storage.vkey || storage.VKEY || storage.player_vkey || '';
    if (!raw) continue;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (error) {
      continue;
    }
  }
  const html = result.data || result.html || '';
  return extractVkey(html);
}

function playableToken(value) {
  const text = String(value || '').trim();
  if (!text || /^(default|online|play|source|line|线路|播放)$/i.test(text)) return '';
  if (isPlayableURL(text)) return text;
  if (/^ftn-[A-Za-z0-9_-]+$/i.test(text)) return text;
  if (/^[A-Za-z0-9_-]{12,}$/.test(text)) return text;
  return '';
}

function playbackFromBrowserResult(result, referer) {
  if (!result) return null;
  const candidates = [];
  const seen = {};
  (result.mediaSources || []).forEach(function (url) {
    const value = String(url || '');
    if (value && !seen[value]) {
      seen[value] = true;
      candidates.push(value);
    }
  });
  (result.capturedRequests || []).forEach(function (entry) {
    const value = entry && entry.url ? String(entry.url) : '';
    if (value && !seen[value]) {
      seen[value] = true;
      candidates.push(value);
    }
  });
  candidates.sort(function (left, right) {
    return playableURLScore(left) - playableURLScore(right);
  });
  for (let index = 0; index < candidates.length; index += 1) {
    const url = String(candidates[index] || '');
    if (!isPlayableURL(url)) continue;
    if (isBrowserOnlyPlaybackURL(url)) continue;
    const container = inferContainer(url, '');
    return {
      url,
      container,
      headers: playbackHeaders(referer),
      preferDirectAVPlayer: shouldUseDirectAVPlayer(url, container)
    };
  }
  return null;
}

function isBrowserOnlyPlaybackURL(url) {
  const value = String(url || '');
  return /media\.oss-internal\.novipnoad\.net\/ts\//i.test(value) || /\.(?:ts|m2ts)(?:$|[?#&])/i.test(value);
}

function isPlayableURL(url) {
  const value = String(url || '');
  return /\.(?:m3u8|m3u|mpd|mp4|m4v|mov|mkv|flv|avi|webm|ts|m2ts)(?:$|[?#&])/i.test(value);
}

function playableURLScore(url) {
  const value = String(url || '');
  if (/\.(?:m3u8|m3u|mpd)(?:$|[?#&])/i.test(value)) return 1;
  if (/\.(?:mp4|m4v|mov|mkv|flv|avi|webm)(?:$|[?#&])/i.test(value)) return 2;
  if (/\.(?:ts|m2ts)(?:$|[?#&])/i.test(value)) return 3;
  return 99;
}

function extractVkey(html) {
  const stored = parseStoredVkey(html);
  if (stored) return stored;
  const source = extractFunctionSource(html, 'function __');
  if (!source) return null;
  let captured = '';
  const fakeStorage = {
    length: 0,
    key: function () {
      return null;
    },
    getItem: function () {
      return null;
    },
    removeItem: function () {},
    setItem: function (key, value) {
      if (key === 'vkey') captured = value;
    }
  };
  const fakeDocument = {
    body: {},
    head: {},
    visibilityState: 'visible',
    createElement: function () {
      return {
        getContext: function () {
          return {
            measureText: function () {
              return { width: 42 };
            }
          };
        }
      };
    }
  };
  function FakeIDBFactory() {}
  const fakeWindow = {
    document: fakeDocument,
    navigator: { userAgent: UA },
    performance: {
      now: function () {
        return 123.456;
      }
    },
    Object: Object,
    Function: Function,
    Math: Math,
    JSON: JSON,
    Array: Array,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    RegExp: RegExp,
    atob: typeof atob === 'function' ? atob : function (value) {
      const bytes = base64ToBytes(value);
      let output = '';
      for (let index = 0; index < bytes.length; index += 1) output += String.fromCharCode(bytes[index]);
      return output;
    },
    indexedDB: Object.create(FakeIDBFactory.prototype),
    MutationObserver: function () {},
    sessionStorage: fakeStorage,
    localStorage: fakeStorage,
    eval: function (code) {
      const text = String(code || '');
      const direct = /sessionStorage\.setItem\(['"]vkey['"]\s*,\s*(["'])([\s\S]*?)\1\)/.exec(text);
      if (direct) {
        captured = unescapeJSString(direct[2]);
        return '';
      }
      if (/Object[\s\S]*prototype[\s\S]*toString[\s\S]*sessionStorage|indexedDB/i.test(text)) {
        return '[object Storage]|string|[object IDBFactory]';
      }
      if (/gqlasl|indexedDB|MutationObserver/i.test(text)) {
        return '[object Storage]|string|[object IDBFactory]';
      }
      return '';
    }
  };
  fakeWindow.window = fakeWindow;
  fakeDocument.defaultView = fakeWindow;

  try {
    const runner = new Function('window', 'document', source + '; return __();');
    runner(fakeWindow, fakeDocument);
  } catch (error) {
    throw new Error('NO视频播放器校验脚本执行失败：' + error.message);
  }

  if (!captured) return null;
  try {
    return JSON.parse(captured);
  } catch (error) {
    return null;
  }
}

function parseStoredVkey(html) {
  const source = String(html || '');
  const patterns = [
    /sessionStorage\.setItem\(['"]vkey['"]\s*,\s*(["'])([\s\S]*?)\1\)/i,
    /localStorage\.setItem\(['"]vkey['"]\s*,\s*(["'])([\s\S]*?)\1\)/i,
    /["']vkey["']\s*:\s*(["'])([\s\S]*?)\1/i
  ];
  for (let index = 0; index < patterns.length; index += 1) {
    const match = patterns[index].exec(source);
    if (!match) continue;
    try {
      return JSON.parse(unescapeJSString(match[2]));
    } catch (error) {}
  }
  return null;
}

function unescapeJSString(value) {
  return String(value || '')
    .replace(/\\x([0-9a-f]{2})/gi, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/\\u([0-9a-f]{4})/gi, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

function extractFunctionSource(html, marker) {
  const start = String(html || '').indexOf(marker);
  if (start < 0) return '';
  const braceStart = html.indexOf('{', start);
  if (braceStart < 0) return '';
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = braceStart; index < html.length; index += 1) {
    const char = html[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = '';
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '{') {
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  return '';
}

function base64ToBytes(value) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = String(value || '').replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes = [];
  let buffer = 0;
  let bits = 0;
  for (let index = 0; index < clean.length; index += 1) {
    const char = clean[index];
    if (char === '=') break;
    const code = alphabet.indexOf(char);
    if (code < 0) continue;
    buffer = (buffer << 6) | code;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  return bytes;
}

function rc4(data, key) {
  const s = [];
  for (let i = 0; i < 256; i += 1) s[i] = i;
  let j = 0;
  for (let i = 0; i < 256; i += 1) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) & 255;
    const t = s[i];
    s[i] = s[j];
    s[j] = t;
  }
  const out = [];
  let i = 0;
  j = 0;
  for (let n = 0; n < data.length; n += 1) {
    i = (i + 1) & 255;
    j = (j + s[i]) & 255;
    const t = s[i];
    s[i] = s[j];
    s[j] = t;
    out.push(data[n] ^ s[(s[i] + s[j]) & 255]);
  }
  return out;
}

function bytesToUtf8(bytes) {
  let out = '';
  for (let i = 0; i < bytes.length; ) {
    const b0 = bytes[i++];
    if (b0 < 0x80) {
      out += String.fromCharCode(b0);
    } else if (b0 >= 0xc0 && b0 < 0xe0 && i < bytes.length) {
      const b1 = bytes[i++];
      out += String.fromCharCode(((b0 & 0x1f) << 6) | (b1 & 0x3f));
    } else if (b0 >= 0xe0 && b0 < 0xf0 && i + 1 < bytes.length) {
      const b1 = bytes[i++];
      const b2 = bytes[i++];
      out += String.fromCharCode(((b0 & 0x0f) << 12) | ((b1 & 0x3f) << 6) | (b2 & 0x3f));
    } else {
      out += String.fromCharCode(b0);
    }
  }
  return out;
}

function rc4DecryptBase64(payload, key) {
  return bytesToUtf8(rc4(base64ToBytes(payload), key));
}

function inferContainer(url, type) {
  const text = decodeURIComponent(String(url || '') + ' ' + String(type || '')).toLowerCase();
  const match = /\.(m3u8|m3u|mpd|ism|f4m|mp4|m4v|mov|mkv|flv|avi|webm|ts|m2ts)(?:$|[?#&\s])/i.exec(text);
  if (match) return match[1].toLowerCase();
  if (/mpegurl|hls/.test(text)) return 'm3u8';
  if (/dash/.test(text)) return 'mpd';
  return '';
}

function shouldUseDirectAVPlayer(url, container) {
  const value = String(container || inferContainer(url, '')).toLowerCase();
  return /^(m3u8|m3u|mpd|ism|f4m)$/.test(value);
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

function search(ext) {
  const query = ext.query || ext.text || ext.keyword || '';
  const page = Number(ext.page || 1);
  const path = '/?s=' + encodeURIComponent(query) + (page > 1 ? '&paged=' + page : '');
  const html = fetchText(path);
  const items = parseCards(html, '搜索结果').map(toPosterMediaItem);
  return {
    pageType: 'search',
    title: query ? '搜索：' + query : '搜索结果',
    style: 'media.posterGrid',
    itemAspectRatio: MINI_LIBRARY_ITEM_ASPECT_RATIO,
    imageOrientation: 'portrait',
    items,
    page,
    hasMore: hasNextPage(html, page)
  };
}

function onSearch(ext) {
  return search(ext);
}

function getSearch(ext) {
  return search(ext || {});
}

function matchResources(ext) {
  const titles = unique(
    []
      .concat(ext.title || ext.name || [])
      .concat(ext.originalTitle || ext.originalName || [])
      .concat(ext.alternativeTitles || [])
      .concat(ext.searchTitles || [])
      .concat(ext.titles || [])
  ).slice(0, 4);
  const mediaType = String(ext.mediaType || ext.type || '').toLowerCase();
  const expectedType = mediaType === 'tv' || mediaType === 'series' ? 'series' : mediaType === 'movie' ? 'movie' : '';
  const year = Number(ext.year || ext.releaseYear || 0);
  const results = [];
  const seen = {};

  for (let i = 0; i < titles.length && results.length < 8; i++) {
    const page = search({ query: titles[i], page: 1 });
    (page.items || []).forEach(function (item) {
      if (!item || seen[item.id]) return;
      if (expectedType && item.type !== expectedType) return;
      if (year && item.year && Math.abs(Number(item.year) - year) > 1) return;
      seen[item.id] = true;
      results.push(item);
    });
  }

  return { results };
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
