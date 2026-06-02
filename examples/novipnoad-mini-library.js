// @name NO视频 Mini Library

const BASE = 'https://www.novipnoad.net';
const PLAYER_BASE = 'https://player.novipnoad.net';
const ENC_BASE = 'https://enc-vod.oss-internal.novipnoad.net';
const IMAGE_BASE = 'https://img.novipnoad.net';
const COOKIE_KEY = 'novipnoad.cf.cookie';
const RC4_KEY = 'ce974576';
const NOVIPNOAD_LOGO =
  'data:image/png;base64,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';
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const CATEGORY_SHORTCUTS = [
  { id: '/', title: '首页', subtitle: 'NO视频推荐' },
  { id: '/movie/', title: '电影', subtitle: '电影片库' },
  { id: '/tv/western/', title: '欧美剧', subtitle: '欧美剧集' },
  { id: '/tv/japan/', title: '日剧', subtitle: '日本剧集' },
  { id: '/tv/korea/', title: '韩剧', subtitle: '韩国剧集' },
  { id: '/tv/hongkong/', title: '港剧', subtitle: '香港剧集' },
  { id: '/tv/taiwan/', title: '台剧', subtitle: '台湾剧集' },
  { id: '/tv/thailand/', title: '泰剧', subtitle: '泰国剧集' },
  { id: '/tv/turkey/', title: '土耳其剧', subtitle: '土耳其剧集' },
  { id: '/anime/', title: '动画', subtitle: '动画与番剧' },
  { id: '/shows/', title: '综艺', subtitle: '综艺节目' },
  { id: '/music/', title: '音乐', subtitle: '音乐现场与 MV' },
  { id: '/short/', title: '短片', subtitle: '短片合集' },
  { id: '/other/', title: '其他', subtitle: '其他视频' }
];

function getManifest() {
  return {
    id: 'novipnoad',
    name: 'NO视频',
    version: '1.0.0',
    author: 'baiPlay',
    logo: NOVIPNOAD_LOGO,
    description:
      'NO视频自定义媒体库示例。站点主页启用了 Cloudflare 浏览器校验，纯 HTTP 运行环境可能需要写入 novipnoad.cf.cookie 或由 App 提供浏览器代理请求。',
    capabilities: {
      search: true,
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

  const result = Widget.http.get(url, { headers });
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
  return match ? match[1] : '';
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
  const blocks = [];
  const pattern = /<div\b[^>]*class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi;
  let match;
  while ((match = pattern.exec(html || ''))) {
    const classes = String(match[1] || match[2] || match[3] || '').split(/\s+/);
    if (classes.indexOf('video-item') >= 0) blocks.push(match.index);
  }
  const output = [];
  for (let index = 0; index < blocks.length; index += 1) {
    output.push((html || '').slice(blocks[index], index + 1 < blocks.length ? blocks[index + 1] : html.length));
  }
  return output;
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
    if (/\/(?:movie|tv|anime|shows|music|short|other)\/[^"'\s<>]+\.html/i.test(candidateHref)) {
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
    attr(linkAttrs, 'title') ||
    attr(linkInner, 'alt') ||
    attr(block, 'title') ||
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
    subtitle: typeLabel || fallbackTitle || '',
    type: mediaTypeFrom(href, rawTitle, block),
    poster: image,
    backdrop: image,
    overview: stripTags(
      firstMatch(block, /<div[^>]+class=["'][^"']*(?:gv-ex|item-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    ),
    year: parseYear(rawTitle),
    rank,
    remarks: parseRemarks(rawTitle, block),
    badges,
    action: { type: 'detail', itemId: id }
  };
}

function parseCards(html, fallbackTitle) {
  const seen = {};
  const items = [];
  parseVideoItemBlocks(html).forEach(function (block) {
    const card = parseCard(block, fallbackTitle, items.length + 1);
    if (!card || seen[card.id]) return;
    seen[card.id] = true;
    items.push(card);
  });
  return items;
}

function parseCarousel(html) {
  const start = (html || '').indexOf('id=big-carousel');
  const end = (html || '').indexOf('</header>');
  const block = start >= 0 ? html.slice(start, end > start ? end : undefined) : html;
  return parseCards(block, '轮播推荐')
    .slice(0, 14)
    .map(function (item) {
      item.backdrop = item.backdrop || item.poster;
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
      moreAction: moreHref ? { type: 'category', pageId: pathId(moreHref), title } : undefined,
      items
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

function shortcutItems() {
  return CATEGORY_SHORTCUTS.map(function (item) {
    return {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      type: 'collection',
      action: { type: 'category', pageId: item.id, title: item.title }
    };
  });
}

function getHome() {
  const html = fetchText('/');
  const hero = parseCarousel(html);
  const sections = parseSmartBoxSections(html);
  sections.unshift({
    id: 'novip-categories',
    title: '分类',
    style: 'discover.watchProviders',
    items: shortcutItems()
  });
  return {
    pageType: 'home',
    title: 'NO视频',
    hero,
    sections
  };
}

function categoryPath(pageId, page) {
  const id = pageId || '/';
  if (id === '/') return '/';
  if (/^https?:\/\//i.test(id)) return absolute(id).replace(BASE, '');
  const clean = id.split('?')[0].replace(/\/?$/, '/');
  const query = id.indexOf('?') >= 0 ? id.slice(id.indexOf('?')) : '';
  if (page && page > 1) return clean + 'page/' + page + '/' + query;
  return clean + query;
}

function getCategory(ext) {
  const pageId = ext.pageId || ext.id || '/';
  const page = Number(ext.page || 1);
  const path = categoryPath(pageId, page);
  const html = fetchText(path);
  const title =
    ext.title ||
    stripTags(firstMatch(html, /<h2[^>]+class=["'][^"']*light-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i)) ||
    shortcutTitle(pageId) ||
    '分类';
  const sections = parseSmartBoxSections(html);
  const items = parseCards(html, title);
  return {
    pageType: 'category',
    id: pageId,
    title,
    style: 'media.posterGrid',
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
  const block = firstMatch(html, /window\.playInfo\s*=\s*\{([\s\S]*?)\}\s*;?/i);
  return {
    vid: firstMatch(block, /vid\s*:\s*["']([^"']+)["']/i),
    pkey: firstMatch(block, /pkey\s*:\s*["']([^"']+)["']/i)
  };
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
  const meta = firstMatch(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (meta && !/NO视频为用户提供/i.test(meta)) return stripTags(meta).replace(/\s*\[&hellip;\]\s*$/, '');
  const content = firstMatch(html, /<div[^>]+class=["'][^"']*item-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  return stripTags(content)
    .replace(/Category:.*/i, '')
    .replace(/Tags:.*/i, '')
    .replace(/\[&hellip;\]/g, '')
    .trim();
}

function getDetail(ext) {
  const itemId = ext.itemId || ext.id || '';
  const html = fetchText(itemId);
  const rawTitle =
    firstMatch(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i) ||
    stripTags(firstMatch(html, /<h1[^>]+class=["'][^"']*entry-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)) ||
    itemId;
  const poster = absolute(
    firstMatch(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) || pickImage(html),
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

  return {
    id: itemId,
    title,
    originalTitle: stripTags(rawTitle),
    type,
    poster,
    backdrop: poster,
    overview: parseOverviewFromDetail(html),
    year: parseYear(rawTitle),
    genres,
    seasons,
    resourceGroups: seasons.length ? [] : playInfo.vid ? buildResourceGroups(itemId, playInfo.vid, '') : [],
    recommendations: [
      {
        id: 'related',
        title: '相关推荐',
        style: 'discover.posterCompact',
        items: parseCards(firstMatch(html, /<div[^>]+class=["'][^"']*related-single[^"']*["'][^>]*>([\s\S]*?)<div id=["']comments["']/i) || html, '相关推荐')
          .filter(function (item) {
            return item.id !== itemId;
          })
          .slice(0, 18)
      }
    ]
  };
}

function buildResourceGroups(itemId, vid, episodeTitle) {
  return [
    {
      id: 'online',
      title: '在线播放',
      versions: [
        {
          id: vid || 'default',
          name: '在线播放',
          subtitle: episodeTitle || '',
          action: { type: 'play', itemId, episodeId: vid || '', versionId: vid || 'default', title: episodeTitle || '在线播放' },
          default: true
        }
      ]
    }
  ];
}

function getResourceVersions(ext) {
  const itemId = ext.itemId || ext.id || '';
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
  const itemId = ext.itemId || ext.id || '';
  const detailURL = siteURL(itemId);
  const html = fetchText(itemId);
  const playInfo = parsePlayInfo(html);
  const episodes = parseEpisodes(html, itemId, '');
  const requested = ext.versionId || ext.episodeId || playInfo.vid || '';
  const episode =
    episodes.find(function (item) {
      return item.id === requested;
    }) || null;
  const vid = requested || (episode ? episode.id : '') || playInfo.vid;
  const pkey = playInfo.pkey;
  if (!vid || !pkey) throw new Error('没有解析到 NO视频播放参数');

  const refPath = itemId || '/';
  const playerURL =
    PLAYER_BASE + '/v1/?url=' + encodeURIComponent(vid) + '&pkey=' + pkey + '&ref=' + encodeURIComponent(refPath);
  const playerFrameURL = PLAYER_BASE + '/v1/player.php?id=' + encodeURIComponent(vid);
  const browserResult = browserFetchPlayer(playerURL, detailURL);
  const directPlayback = playbackFromBrowserResult(browserResult, playerFrameURL);
  if (directPlayback) return directPlayback;

  let vkey = extractBrowserVkey(browserResult);
  if (!vkey || !vkey.ckey) {
    const playerHTML = fetchPlayer(playerURL, detailURL);
    vkey = extractVkey(playerHTML);
  }
  if (!vkey || !vkey.ckey) throw new Error('NO视频播放器校验未通过，无法生成播放密钥');

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
      waitAfterLoad: 1.0,
      waitForSessionStorageKey: 'vkey',
      waitForMediaSource: true,
      waitForAny: false,
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
  const storages = [result.sessionStorage, result.localStorage];
  for (let index = 0; index < storages.length; index += 1) {
    const storage = storages[index] || {};
    const raw = storage.vkey || storage.VKEY || storage.player_vkey || '';
    if (!raw) continue;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (error) {
      return null;
    }
  }
  const html = result.data || result.html || '';
  return extractVkey(html);
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
  return /media\.oss-internal\.novipnoad\.net\/(?:hls|ts)\//i.test(value);
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
      const direct = /sessionStorage\.setItem\(['"]vkey['"]\s*,\s*'([^']+)'/.exec(text);
      if (direct) {
        captured = direct[1];
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
  const items = parseCards(html, '搜索结果');
  return {
    pageType: 'search',
    title: '搜索结果',
    items,
    page,
    hasMore: hasNextPage(html, page)
  };
}

function onSearch(ext) {
  return search(ext);
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
