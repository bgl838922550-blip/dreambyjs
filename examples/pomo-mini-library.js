// @name Pomo Mini Library

const POMO_ID = 'pomo-mini-library';
const POMO_NAME = 'Pomo';
const POMO_BASE = 'https://pomo.mom';
const POMO_LOGO = 'https://www.pomo.mom/content/uploadfile/basiclogoUrl.png';
const POMO_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#171717"/><stop offset=".55" stop-color="#2a2110"/><stop offset="1" stop-color="#f5c518"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><text x="80" y="430" font-size="120" font-family="Arial, sans-serif" font-weight="800" fill="#fff">Pomo</text></svg>'
  );
const POMO_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const POMO_PAGE_SIZE = 24;

const POMO_SECTIONS = [
  { id: 'latest', title: '最新上映', subtitle: '站点首页最新收录', path: '', style: 'discover.spotlight', promotesToHero: true },
  { id: 'huayu', title: '华语热门', subtitle: '华语热门影片', path: 'huayurm', style: 'discover.posterCompact' },
  { id: 'jiating', title: '家庭影院', subtitle: '适合客厅观看', path: 'jiating', style: 'discover.posterCompact' },
  { id: 'donghua', title: '动画大电影', subtitle: '动画电影专区', path: 'donghuadadiany', style: 'discover.editorial' },
  { id: 'lengmen', title: '冷门佳片', subtitle: '小众与补遗', path: 'lengmenjiapian', style: 'discover.editorial' },
  { id: 'top250', title: 'TOP250', subtitle: '高分榜单', path: 'paihangbang', style: 'discover.ranked' },
  { id: 'dianshiju', title: '剧集', subtitle: '剧集内容', path: 'dianshiju', style: 'discover.spotlight' },
  { id: 'bluray', title: '蓝光原盘', subtitle: '蓝光与原盘资源', path: 'sort/12', style: 'discover.standard' }
];

const WidgetMetadata = {
  id: POMO_ID,
  name: POMO_NAME,
  title: POMO_NAME,
  version: '1.0.0',
  author: 'baiPlay',
  site: POMO_BASE + '/',
  logo: POMO_LOGO,
  icon: POMO_LOGO,
  description: 'Pomo 影视自定义媒体库，支持首页分类、搜索、详情和在线播放线路。'
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
      playback: true,
      resourceVersions: true,
      aggregation: true,
      playbackHistory: true,
      resourceMatching: false
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    },
    parameters: [
      {
        name: 'base_url',
        title: '站点地址',
        type: 'input',
        defaultValue: POMO_BASE,
        required: false,
        description: '默认使用 https://pomo.mom/，站点迁移时可在这里替换。'
      }
    ]
  };
}

async function getHome(ctx = {}) {
  const cfg = readConfig(ctx);
  let hero = [];
  let latest = [];

  try {
    const html = await requestText(homeURL(cfg), { referer: cfg.baseURL + '/' });
    hero = extractHeroItems(html, cfg).slice(0, 6);
    latest = extractCards(html, cfg).slice(0, 12).map(itemCard);
    cfg.filterGroups = extractFilterGroups(html);
  } catch (_) {}

  return {
    pageType: 'home',
    id: 'pomo-home',
    title: POMO_NAME,
    heroAspectRatio: '16:9',
    hero: hero.length ? hero : latest.slice(0, 5),
    sections: [
      {
        id: 'pomo-section:latest',
        title: '最新上映',
        subtitle: '站点首页最新收录',
        style: 'discover.spotlight',
        promotesToHero: true,
        moreAction: categoryAction('cat:latest', '最新上映'),
        items: latest,
        lazy: latest.length === 0,
        isLazy: latest.length === 0
      }
    ].concat(POMO_SECTIONS.slice(1).map(function (section) {
      return {
        id: 'pomo-section:' + section.id,
        title: section.title,
        subtitle: section.subtitle,
        style: section.style,
        moreAction: categoryAction('cat:' + section.id, section.title),
        loadAction: { type: 'custom', id: 'pomo-section:' + section.id, title: section.title },
        lazy: true,
        isLazy: true,
        items: []
      };
    })).concat([
      {
        id: 'pomo-section:filters',
        title: '筛选浏览',
        subtitle: '按类型、年份、地区和语言筛选',
        style: 'discover.annualCategories',
        moreAction: categoryAction('filters:all', '筛选浏览'),
        items: filterGroupEntries(cfg).slice(0, 8),
        lazy: false,
        isLazy: false
      },
      {
        id: 'pomo-section:categories',
        title: '分类导航',
        subtitle: '进入站点固定栏目',
        style: 'discover.annualCategories',
        moreAction: categoryAction('categories', '分类导航'),
        items: POMO_SECTIONS.slice(1).map(categoryEntry),
        lazy: false,
        isLazy: false
      }
    ])
  };
}

async function getHomeSection(ctx = {}) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const id = stringValue(args.sectionId || args.id);
  const sectionId = id.replace(/^pomo-section:/, '');
  if (sectionId === 'filters') {
    try {
      const html = await requestText(homeURL(cfg), { referer: cfg.baseURL + '/' });
      cfg.filterGroups = extractFilterGroups(html);
    } catch (_) {}
    return {
      id: id || 'pomo-section:filters',
      title: '筛选浏览',
      subtitle: '按网页筛选项生成',
      style: 'discover.annualCategories',
      moreAction: categoryAction('filters:all', '筛选浏览'),
      lazy: false,
      isLazy: false,
      items: filterGroupEntries(cfg)
    };
  }
  if (sectionId === 'categories') {
    return {
      id: id || 'pomo-section:categories',
      title: '分类导航',
      subtitle: '进入站点固定栏目',
      style: 'discover.annualCategories',
      moreAction: categoryAction('categories', '分类导航'),
      lazy: false,
      isLazy: false,
      items: POMO_SECTIONS.slice(1).map(categoryEntry)
    };
  }
  const section = findSection(sectionId) || POMO_SECTIONS[0];

  try {
    const html = await requestText(categoryURL(cfg, section, 1), { referer: cfg.baseURL + '/' });
    const cards = extractCards(html, cfg).slice(0, 12).map(itemCard);
    return {
      id: id || 'pomo-section:' + section.id,
      title: section.title,
      subtitle: cards.length ? section.subtitle + ' · ' + cards.length + ' 条' : section.subtitle,
      style: section.style,
      promotesToHero: section.promotesToHero === true,
      moreAction: categoryAction('cat:' + section.id, section.title),
      lazy: false,
      isLazy: false,
      items: cards
    };
  } catch (error) {
    return errorSection(id || 'pomo-section:' + section.id, section.title, error);
  }
}

async function getCategory(ctx = {}) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const pageId = stringValue(args.pageId || args.id || 'cat:latest');
  const page = positiveInt(args.page, 1);

  if (pageId === 'categories') {
    return {
      pageType: 'category',
      id: 'categories',
      title: 'Pomo 分类',
      style: 'media.posterGrid',
      itemAspectRatio: '16:9',
      imageFit: 'cover',
      items: POMO_SECTIONS.map(categoryEntry),
      page: 1,
      hasMore: false
    };
  }

  if (pageId === 'filters:all') {
    const html = await requestText(homeURL(cfg), { referer: cfg.baseURL + '/' });
    cfg.filterGroups = extractFilterGroups(html);
    return {
      pageType: 'category',
      id: 'filters:all',
      title: '筛选浏览',
      style: 'media.posterGrid',
      itemAspectRatio: '16:9',
      imageFit: 'cover',
      items: filterGroupEntries(cfg),
      page: 1,
      hasMore: false
    };
  }

  if (pageId.indexOf('filters:') === 0) {
    const field = pageId.slice('filters:'.length);
    const html = await requestText(homeURL(cfg), { referer: cfg.baseURL + '/' });
    cfg.filterGroups = extractFilterGroups(html);
    const group = findFilterGroup(cfg, field);
    return {
      pageType: 'category',
      id: pageId,
      title: group ? group.title : '筛选项',
      style: 'media.posterGrid',
      itemAspectRatio: '16:9',
      imageFit: 'cover',
      items: (group ? group.options : []).map(function (option) {
        return filterOptionEntry(group, option);
      }),
      page: 1,
      hasMore: false
    };
  }

  if (pageId.indexOf('filter:') === 0) {
    const parsed = parseFilterPageId(pageId);
    const order = stringValue(args.order || args.sort || args.sort_by || args.selectedSortValue || parsed.order || 'new');
    const html = await requestText(filteredURL(cfg, parsed.field, parsed.value, order, page), { referer: cfg.baseURL + '/' });
    const cards = extractCards(html, cfg).map(itemCard);
    const title = filterTitle(parsed.field, parsed.value);
    return {
      pageType: 'category',
      id: 'filter:' + parsed.field + ':' + encodePart(parsed.value),
      title,
      style: 'media.posterGrid',
      itemAspectRatio: '3:4',
      imageFit: 'cover',
      items: cards,
      page,
      hasMore: cards.length >= 12,
      selectedSortValue: order,
      sort: [
        { id: 'new', title: '最新上映', value: 'new' },
        { id: 'old', title: '最早上映', value: 'old' },
        { id: 'rating', title: 'IMDB评分', value: 'rating' }
      ]
    };
  }

  const sectionId = pageId.replace(/^cat:/, '');
  const section = findSection(sectionId) || POMO_SECTIONS[0];
  const html = await requestText(categoryURL(cfg, section, page), { referer: cfg.baseURL + '/' });
  const cards = extractCards(html, cfg).map(itemCard);

  return {
    pageType: 'category',
    id: 'cat:' + section.id,
    title: section.title,
    subtitle: section.subtitle,
    style: 'media.posterGrid',
    itemAspectRatio: '3:4',
    imageFit: 'cover',
    items: cards,
    page,
    hasMore: cards.length >= 12
  };
}

async function search(ctx = {}) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const query = stringValue(args.query || args.keyword || args.text).trim();
  if (!query) {
    return {
      pageType: 'category',
      id: 'pomo-search-empty',
      title: '搜索 Pomo',
      style: 'media.posterGrid',
      itemAspectRatio: '3:4',
      items: [],
      page: 1,
      hasMore: false
    };
  }

  const page = positiveInt(args.page, 1);
  const html = await requestText(searchURL(cfg, query, page), { referer: cfg.baseURL + '/' });
  const cards = extractCards(html, cfg).map(itemCard);
  return {
    pageType: 'category',
    id: 'pomo-search:' + encodePart(query),
    title: '搜索 ' + query,
    style: 'media.posterGrid',
    itemAspectRatio: '3:4',
    imageFit: 'cover',
    items: cards,
    page,
    hasMore: cards.length >= 12
  };
}

async function getDetail(ctx = {}) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const id = itemIdFrom(args.itemId || args.id || args.link || args.versionId);
  if (!id) throw new Error('缺少 Pomo 影片 ID');

  const html = await requestText(detailURL(cfg, id), { referer: cfg.baseURL + '/' });
  const detail = parseDetail(html, id, cfg);
  const groups = await getResourceVersions(Object.assign({}, args, { itemId: 'pomo:' + id, _detail: detail }));

  return {
    id: 'pomo:' + id,
    itemId: 'pomo:' + id,
    title: detail.title || 'Pomo',
    originalTitle: detail.alias,
    type: inferMediaType(detail),
    mediaType: inferMediaType(detail),
    poster: detail.poster || POMO_PLACEHOLDER,
    backdrop: detail.backdrops[0] || detail.poster || POMO_PLACEHOLDER,
    imageHeaders: imageHeaders(cfg.baseURL + '/' + id),
    posterHeaders: imageHeaders(cfg.baseURL + '/' + id),
    backdropHeaders: imageHeaders(cfg.baseURL + '/' + id),
    detailImageAspectRatio: detail.backdrops.length ? '16:9' : '3:4',
    overview: detail.overview,
    rating: detail.rating,
    year: yearFrom(detail.releaseDate || detail.title),
    genres: splitList(detail.genres),
    countries: splitList(detail.country),
    languages: splitList(detail.language),
    cast: splitPeople(detail.actors).map(function (name) {
      return { id: 'actor:' + name, name, title: name, role: '演员' };
    }),
    crew: splitPeople(detail.director).map(function (name) {
      return { id: 'director:' + name, name, title: name, role: '导演' };
    }),
    metadata: [
      detail.alias ? { title: '别名', value: detail.alias } : null,
      detail.genres ? { title: '类型', value: detail.genres } : null,
      detail.country ? { title: '国家', value: detail.country } : null,
      detail.releaseDate ? { title: '时间', value: detail.releaseDate } : null,
      detail.language ? { title: '语言', value: detail.language } : null
    ].filter(Boolean),
    providerIds: {
      pomo: id,
      sourceURL: detailURL(cfg, id)
    },
    resourceGroups: groups,
    recommendations: detail.backdrops.length ? [
      {
        id: 'pomo-stills',
        title: '影视剧照',
        style: 'discover.standard',
        items: detail.backdrops.slice(0, 12).map(function (image, index) {
          return {
            id: 'still:' + id + ':' + index,
            title: detail.title + ' 剧照',
            type: 'image',
            poster: image,
            backdrop: image,
            imageHeaders: imageHeaders(cfg.baseURL + '/' + id),
            aspectRatio: '16:9',
            imageFit: 'cover',
            action: { type: 'none' }
          };
        })
      }
    ] : []
  };
}

async function getResourceVersions(ctx = {}) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const id = itemIdFrom(args.itemId || args.id || args.link || args.versionId);
  if (!id) return [];
  const streams = await fetchStreams(cfg, id);
  if (!streams.length) return [];
  return [
    {
      id: 'pomo-online',
      title: '在线播放',
      versions: streams.map(function (stream, index) {
        const versionId = encodePayload({
          itemId: 'pomo:' + id,
          movieId: id,
          name: stream.name,
          rawURL: stream.url,
          index
        });
        return {
          id: versionId,
          versionId,
          name: stream.name || '线路 ' + (index + 1),
          subtitle: stream.description || 'Pomo',
          url: stream.url,
          container: 'm3u8',
          headers: playbackHeaders(cfg, id),
          default: index === 0,
          action: {
            type: 'play',
            itemId: 'pomo:' + id,
            versionId,
            title: stream.name || '线路 ' + (index + 1)
          }
        };
      })
    }
  ];
}

async function resolvePlayback(ctx = {}) {
  const args = argsify(ctx);
  const cfg = readConfig(args);
  const payload = decodePayload(args.versionId || args.id || '');
  const id = itemIdFrom(args.itemId || payload.itemId || args.link);
  const rawURL = stringValue(args.url || args.playUrl || args.src || payload.rawURL);
  if (!rawURL) throw new Error('没有可播放的 Pomo 线路地址');

  const parsedURL = await parsePlaybackURL(cfg, rawURL, id);
  return {
    url: parsedURL || rawURL,
    container: 'm3u8',
    headers: playbackHeaders(cfg, id),
    isLive: false,
    streamKind: 'vod',
    mediaKind: 'video'
  };
}

async function fetchStreams(cfg, movieId) {
  const html = await requestText(cfg.baseURL + '/?plugin=plyr_player&gid=' + encodeURIComponent(movieId), {
    referer: detailURL(cfg, movieId)
  });
  let streams = extractRouteStreams(html);
  if (!streams.length) streams = extractM3U8Fallback(html);
  return uniqueBy(streams, function (stream) {
    return stream.url;
  });
}

async function parsePlaybackURL(cfg, rawURL, movieId) {
  const apiURL = cfg.baseURL + '/content/plugins/plyr_player/api.php?type=parse&url=' + encodeURIComponent(rawURL);
  try {
    const json = await requestJSON(apiURL, { referer: cfg.baseURL + '/?plugin=plyr_player&gid=' + encodeURIComponent(movieId || '') });
    const data = json && (json.data || json.url || json.playUrl);
    return /^https?:\/\//i.test(stringValue(data)) ? data : '';
  } catch (_) {
    return '';
  }
}

function extractHeroItems(html, cfg) {
  const blocks = matchAll(html, /<div\b[^>]*class=["'][^"']*carousel-item[^"']*["'][^>]*>([\s\S]*?)(?=<div\b[^>]*class=["'][^"']*carousel-item|<\/div>\s*<\/div>\s*<div class="grid|<div class="grid)/gi);
  const items = [];
  blocks.forEach(function (match) {
    const block = match[1] || '';
    const href = firstMatch(block, /<a\b[^>]*href=["']([^"']*\/\d+(?:\.html)?[^"']*)["'][^>]*>/i);
    const id = idFromURL(href);
    if (!id) return;
    const image = absoluteURL(firstMatch(block, /<img\b[^>]*src=["']([^"']+)["'][^>]*>/i), cfg.baseURL);
    const title = cleanText(firstMatch(block, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i)) || cleanText(firstMatch(block, /alt=["']([^"']+)["']/i));
    const subtitle = cleanText(firstMatch(block, /<p\b[^>]*>([\s\S]*?)<\/p>/i));
    items.push(itemCard({
      id,
      title: title || 'Pomo',
      poster: image,
      backdrop: image,
      overview: subtitle,
      subtitle,
      rating: 0,
      sourceURL: detailURL(cfg, id)
    }));
  });
  return uniqueBy(items, function (item) {
    return item.id;
  });
}

function extractCards(html, cfg) {
  const cards = matchAll(html, /<a\b([^>]*href=["'][^"']*\/\d+(?:\.html)?[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi)
    .map(function (match) {
      const block = '<a ' + (match[1] || '') + '>' + (match[2] || '') + '</a>';
      if (block.indexOf('<img') < 0) return null;
      return parseCardBlock(block, cfg);
    })
    .filter(Boolean);
  return uniqueBy(cards, function (card) {
    return card.id;
  });
}

function parseCardBlock(block, cfg) {
  const href = firstMatch(block, /<a\b[^>]*href=["']([^"']*\/\d+(?:\.html)?[^"']*)["'][^>]*>/i);
  const id = idFromURL(href);
  if (!id) return null;
  const image = absoluteURL(firstMatch(block, /<img\b[^>]*src=["']([^"']+)["'][^>]*>/i), cfg.baseURL);
  const alt = cleanText(firstMatch(block, /<img\b[^>]*alt=["']([^"']*)["']/i));
  const title = cleanText(firstMatch(block, /<h3\b[^>]*>([\s\S]*?)<\/h3>/i)) || alt || 'Pomo';
  const textDivs = matchAll(block, /<div\b[^>]*class=["'][^"']*text-\[12px\][^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)
    .map(function (match) {
      return cleanText(match[1]);
    })
    .filter(Boolean);
  const enTitle = textDivs[0] || '';
  const genre = textDivs[1] || '';
  const rating = scoreValue(firstMatch(block, /<span\b[^>]*class=["'][^"']*highlight[^"']*["'][^>]*>([\s\S]*?)<\/span>/i));
  return {
    id,
    title,
    poster: image,
    backdrop: image,
    subtitle: [enTitle, genre].filter(Boolean).join(' · '),
    overview: [enTitle, genre].filter(Boolean).join(' / '),
    rating,
    genres: splitList(genre),
    sourceURL: detailURL(cfg, id)
  };
}

function parseDetail(html, id, cfg) {
  const title = cleanText(firstMatch(html, /<h2\b[^>]*class=["'][^"']*x-dbjs-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i))
    || cleanText(firstMatch(html, /<title>([\s\S]*?)<\/title>/i)).replace(/\s*[-–]\s*Pomo.*$/i, '');
  const poster = absoluteURL(
    firstMatch(html, /<div\b[^>]*class=["'][^"']*x-dbjs-poster[^"']*["'][^>]*>[\s\S]*?<img\b[^>]*src=["']([^"']+)["']/i)
      || firstMatch(html, /<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i),
    cfg.baseURL
  );
  const rating = scoreValue(firstMatch(html, /<div\b[^>]*class=["'][^"']*rating-badge[^"']*["'][^>]*>([\s\S]*?)<\/div>/i));
  const meta = {};
  matchAll(html, /<div\b[^>]*class=["'][^"']*meta-row[^"']*["'][^>]*>\s*<span>([\s\S]*?)<\/span>([\s\S]*?)<\/div>/gi).forEach(function (match) {
    const key = cleanText(match[1]).replace(/[：:]\s*$/, '');
    const value = cleanText(match[2]);
    if (key && value) meta[key] = value;
  });
  const overview = cleanText(firstMatch(html, /<div\b[^>]*class=["'][^"']*x-dbjs-desc-block[^"']*["'][^>]*>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i));
  const stillBlock = firstMatch(html, /<ul\b[^>]*class=["'][^"']*pic-col5[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i);
  const backdrops = uniqueBy(matchAll(stillBlock, /<img\b[^>]*src=["']([^"']+)["']/gi)
    .map(function (match) {
      return absoluteURL(match[1], cfg.baseURL);
    })
    .filter(Boolean), function (url) { return url; });
  return {
    id,
    title,
    poster,
    rating,
    alias: meta['别名'] || '',
    genres: meta['类型'] || '',
    country: meta['国家'] || '',
    director: meta['导演'] || '',
    releaseDate: meta['时间'] || '',
    language: meta['语言'] || '',
    actors: meta['演员阵容'] || meta['演员'] || '',
    overview,
    backdrops
  };
}

function extractRouteStreams(html) {
  const streams = [];
  const routeRegex = /const\s+(route\d+Data)\s*=\s*\[([\s\S]*?)\];/g;
  let routeMatch;
  while ((routeMatch = routeRegex.exec(String(html || ''))) !== null) {
    const routeName = routeMatch[1] || '';
    const routeBody = routeMatch[2] || '';
    const routeNum = routeName.replace('route', '').replace('Data', '');
    const strings = matchAll(routeBody, /"([^"]+)"/g);
    strings.forEach(function (match) {
      const decoded = unescapeJSONString(match[1] || '');
      const dollar = decoded.indexOf('$');
      if (dollar < 0) return;
      const label = decoded.slice(0, dollar).trim();
      const url = decoded.slice(dollar + 1).trim();
      if (!/^https?:\/\//i.test(url)) return;
      streams.push({
        name: '线路' + routeNum + (label ? ' ' + label : ''),
        description: label,
        url
      });
    });
  }
  return streams;
}

function extractM3U8Fallback(html) {
  const seen = {};
  let index = 0;
  return matchAll(html, /(https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*)/gi)
    .map(function (match) {
      return unescapeJSONString(match[1] || '');
    })
    .filter(function (url) {
      if (!url || seen[url]) return false;
      seen[url] = true;
      return true;
    })
    .map(function (url) {
      index += 1;
      return { name: '线路' + index, description: '', url };
    });
}

function itemCard(card) {
  const id = String(card.id || '').trim();
  return {
    id: 'pomo:' + id,
    itemId: 'pomo:' + id,
    title: card.title || 'Pomo',
    subtitle: card.subtitle || '',
    type: inferMediaType(card),
    mediaType: inferMediaType(card),
    poster: card.poster || POMO_PLACEHOLDER,
    backdrop: card.backdrop || card.poster || POMO_PLACEHOLDER,
    imageHeaders: imageHeaders(card.sourceURL || POMO_BASE + '/' + id),
    posterHeaders: imageHeaders(card.sourceURL || POMO_BASE + '/' + id),
    backdropHeaders: imageHeaders(card.sourceURL || POMO_BASE + '/' + id),
    overview: card.overview || card.subtitle || '',
    rating: card.rating || undefined,
    year: yearFrom(card.title),
    genres: card.genres || [],
    providerIds: {
      pomo: id,
      sourceURL: card.sourceURL || POMO_BASE + '/' + id
    },
    action: {
      type: 'detail',
      itemId: 'pomo:' + id,
      id: 'pomo:' + id,
      title: card.title || 'Pomo'
    }
  };
}

function categoryEntry(section) {
  return {
    id: 'cat:' + section.id,
    title: section.title,
    subtitle: section.subtitle,
    type: 'collection',
    poster: POMO_PLACEHOLDER,
    backdrop: POMO_PLACEHOLDER,
    imageFit: 'cover',
    aspectRatio: '16:9',
    badges: ['Pomo'],
    action: categoryAction('cat:' + section.id, section.title)
  };
}

function filterGroupEntries(cfg) {
  const groups = (cfg && cfg.filterGroups && cfg.filterGroups.length ? cfg.filterGroups : defaultFilterGroups())
    .filter(function (group) {
      return group.field !== 'order' && group.options && group.options.length;
    });
  return groups.map(function (group) {
    const preview = group.options.slice(0, 5).map(function (option) {
      return option.title;
    }).join(' / ');
    return {
      id: 'filters:' + group.field,
      title: group.title,
      subtitle: group.options.length + ' 个选项',
      type: 'collection',
      poster: POMO_PLACEHOLDER,
      backdrop: POMO_PLACEHOLDER,
      overview: preview,
      metadataText: 'Pomo 筛选',
      badges: ['筛选', group.title],
      aspectRatio: '16:9',
      imageFit: 'cover',
      action: categoryAction('filters:' + group.field, group.title)
    };
  });
}

function filterOptionEntry(group, option) {
  return {
    id: 'filter:' + group.field + ':' + encodePart(option.value),
    title: option.title,
    subtitle: group.title,
    type: 'collection',
    poster: POMO_PLACEHOLDER,
    backdrop: POMO_PLACEHOLDER,
    overview: '浏览' + group.title + '：' + option.title,
    metadataText: 'Pomo 筛选',
    badges: [group.title],
    aspectRatio: '16:9',
    imageFit: 'cover',
    action: categoryAction('filter:' + group.field + ':' + encodePart(option.value), option.title)
  };
}

function extractFilterGroups(html) {
  const groups = [];
  matchAll(html, /<select\b([^>]*name=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/select>/gi).forEach(function (match) {
    const field = stringValue(match[2]).trim();
    if (!field) return;
    const options = matchAll(match[3] || '', /<option\b[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)
      .map(function (optionMatch) {
        return {
          value: htmlDecode(optionMatch[1]).trim(),
          title: cleanText(optionMatch[2])
        };
      })
      .filter(function (option) {
        return option.value && option.title;
      });
    if (!options.length) return;
    groups.push({
      field,
      title: filterFieldTitle(field),
      options
    });
  });
  return groups.length ? groups : defaultFilterGroups();
}

function defaultFilterGroups() {
  return [
    {
      field: 'genre',
      title: '影片类型',
      options: ['剧情', '动作', '喜剧', '爱情', '科幻', '悬疑', '犯罪', '恐怖', '动画', '家庭'].map(optionFromText)
    },
    {
      field: 'year',
      title: '上映年份',
      options: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'].map(optionFromText)
    },
    {
      field: 'area',
      title: '上映地区',
      options: ['大陆', '香港', '台湾', '美国', '日本', '韩国', '英国', '法国'].map(optionFromText)
    },
    {
      field: 'lang',
      title: '语言',
      options: ['汉语普通话', '国语', '英语', '粤语', '日语', '韩语'].map(optionFromText)
    }
  ];
}

function optionFromText(text) {
  return { title: text, value: text };
}

function findFilterGroup(cfg, field) {
  const groups = cfg && cfg.filterGroups && cfg.filterGroups.length ? cfg.filterGroups : defaultFilterGroups();
  return groups.find(function (group) {
    return group.field === field;
  }) || null;
}

function filterFieldTitle(field) {
  if (field === 'genre') return '影片类型';
  if (field === 'year') return '上映年份';
  if (field === 'area') return '上映地区';
  if (field === 'lang') return '语言';
  if (field === 'order') return '排序';
  return field;
}

function parseFilterPageId(pageId) {
  const parts = stringValue(pageId).split(':');
  return {
    field: parts[1] || '',
    value: decodePart(parts.slice(2).join(':') || ''),
    order: ''
  };
}

function filterTitle(field, value) {
  return filterFieldTitle(field) + ' · ' + value;
}

function errorSection(id, title, error) {
  const message = error && error.message ? error.message : String(error || '未知错误');
  return {
    id: id || 'pomo-error',
    title: title || 'Pomo',
    subtitle: message,
    style: 'discover.annualWidePreview',
    lazy: false,
    isLazy: false,
    items: [
      {
        id: (id || 'pomo') + ':error',
        title: '加载失败',
        subtitle: truncate(message, 64),
        type: 'collection',
        poster: POMO_PLACEHOLDER,
        backdrop: POMO_PLACEHOLDER,
        overview: message,
        badges: ['失败'],
        action: { type: 'none' }
      }
    ]
  };
}

function categoryAction(pageId, title) {
  return { type: 'category', pageId, title, itemAspectRatio: '3:4' };
}

function findSection(id) {
  return POMO_SECTIONS.find(function (section) {
    return section.id === id;
  }) || null;
}

function homeURL(cfg) {
  return cfg.baseURL + '/';
}

function categoryURL(cfg, section, page) {
  if (!section || !section.path) return page > 1 ? cfg.baseURL + '/page/' + page : cfg.baseURL + '/';
  return page > 1 ? cfg.baseURL + '/' + section.path + '/page/' + page : cfg.baseURL + '/' + section.path;
}

function searchURL(cfg, query, page) {
  const prefix = page > 1 ? cfg.baseURL + '/page/' + page : cfg.baseURL + '/';
  return prefix + '?keyword=' + encodeURIComponent(query);
}

function filteredURL(cfg, field, value, order, page) {
  const prefix = page > 1 ? cfg.baseURL + '/page/' + page : cfg.baseURL + '/';
  const query = [];
  if (field && value) query.push(encodeURIComponent(field) + '=' + encodeURIComponent(value));
  if (order) query.push('order=' + encodeURIComponent(order));
  return prefix + (query.length ? '?' + query.join('&') : '');
}

function detailURL(cfg, id) {
  return cfg.baseURL + '/' + encodeURIComponent(id);
}

function imageHeaders(referer) {
  return {
    Referer: referer || POMO_BASE + '/',
    'User-Agent': POMO_UA
  };
}

function playbackHeaders(cfg, id) {
  return {
    Referer: id ? cfg.baseURL + '/?plugin=plyr_player&gid=' + encodeURIComponent(id) : cfg.baseURL + '/',
    Origin: cfg.baseURL,
    'User-Agent': POMO_UA
  };
}

async function requestText(url, options) {
  const response = await requestRaw(url, options || {});
  if (typeof response === 'string') return response;
  if (response && response.error) throw new Error(response.error);
  if (response && response.data !== undefined) return stringValue(response.data);
  if (response && response.body !== undefined) return stringValue(response.body);
  return stringValue(response);
}

async function requestJSON(url, options) {
  const text = await requestText(url, options || {});
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error('接口返回不是 JSON');
  }
}

async function requestRaw(url, options) {
  const headers = Object.assign({
    'User-Agent': POMO_UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7'
  }, options.headers || {});
  if (options.referer) headers.Referer = options.referer;

  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    return Widget.http.get(url, { headers, timeout: options.timeout || 20 });
  }
  if (typeof fetch === 'function') {
    const response = await fetch(url, { headers, redirect: 'follow' });
    const text = await response.text();
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return text;
  }
  throw new Error('当前小程序环境缺少 HTTP 客户端');
}

function readConfig(ctx) {
  const args = argsify(ctx);
  const params = args.params || args.config || args.settings || args.parameters || {};
  const baseURL = normalizeBaseURL(params.base_url || params.baseURL || args.base_url || args.baseURL || POMO_BASE);
  return { baseURL };
}

function normalizeBaseURL(value) {
  const text = stringValue(value).trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(text) ? text : POMO_BASE;
}

function idFromURL(value) {
  const match = stringValue(value).match(/\/(\d+)(?:\.html)?(?:[?#].*)?$/);
  return match && match[1] ? match[1] : '';
}

function itemIdFrom(value) {
  const text = stringValue(value);
  if (!text) return '';
  const payload = decodePayload(text);
  if (payload.movieId) return stringValue(payload.movieId);
  const pomoMatch = text.match(/^pomo:(\d+)/);
  if (pomoMatch) return pomoMatch[1];
  const urlId = idFromURL(text);
  if (urlId) return urlId;
  const number = text.match(/^\d+$/);
  return number ? number[0] : '';
}

function inferMediaType(value) {
  const text = [
    value && value.title,
    value && value.subtitle,
    value && value.genres,
    value && value.overview
  ].join(' ');
  return /剧集|电视剧|更新至|第\s*\d+\s*集|season|episode/i.test(text) ? 'series' : 'movie';
}

function splitList(value) {
  return uniqueBy(stringValue(value)
    .split(/\s*[\/,，、|]\s*|\s{2,}/g)
    .map(function (part) { return cleanText(part); })
    .filter(Boolean), function (item) { return item.toLowerCase(); });
}

function splitPeople(value) {
  return splitList(value).filter(function (name) {
    return name.length <= 32;
  });
}

function yearFrom(value) {
  const match = stringValue(value).match(/(?:19|20)\d{2}/);
  return match ? Number(match[0]) : undefined;
}

function scoreValue(value) {
  const match = cleanText(value).match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function absoluteURL(value, base) {
  const text = htmlDecode(stringValue(value).trim());
  if (!text) return '';
  if (/^\/\//.test(text)) return 'https:' + text;
  if (/^https?:\/\//i.test(text)) return text;
  try {
    return new URL(text, base || POMO_BASE).href;
  } catch (_) {
    return text;
  }
}

function cleanText(value) {
  return htmlDecode(
    stringValue(value)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>|<\/div>|<\/li>/gi, '\n')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function htmlDecode(value) {
  return stringValue(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/&#(\d+);/g, function (_, code) {
      return String.fromCharCode(parseInt(code, 10));
    });
}

function unescapeJSONString(value) {
  return htmlDecode(stringValue(value))
    .replace(/\\\//g, '/')
    .replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
      return String.fromCharCode(parseInt(hex, 16));
    })
    .replace(/\\"/g, '"');
}

function matchAll(value, regex) {
  const result = [];
  const text = stringValue(value);
  regex.lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    result.push(match);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return result;
}

function firstMatch(value, regex) {
  const match = stringValue(value).match(regex);
  return match ? (match[1] || '') : '';
}

function uniqueBy(list, keyFn) {
  const seen = {};
  const result = [];
  (list || []).forEach(function (item) {
    const key = stringValue(keyFn(item));
    if (!key || seen[key]) return;
    seen[key] = true;
    result.push(item);
  });
  return result;
}

function positiveInt(value, fallback) {
  const number = Number(value);
  return isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function truncate(value, length) {
  const text = stringValue(value);
  if (text.length <= length) return text;
  return text.slice(0, Math.max(0, length - 1)).trim() + '…';
}

function encodePart(value) {
  return encodeURIComponent(stringValue(value));
}

function decodePart(value) {
  try {
    return decodeURIComponent(stringValue(value));
  } catch (_) {
    return stringValue(value);
  }
}

function encodePayload(payload) {
  const text = JSON.stringify(payload || {});
  if (typeof btoa === 'function') return 'pomo-play:' + btoa(unescape(encodeURIComponent(text)));
  if (typeof Buffer !== 'undefined') return 'pomo-play:' + Buffer.from(text, 'utf8').toString('base64');
  return 'pomo-play:' + encodeURIComponent(text);
}

function decodePayload(value) {
  const text = stringValue(value);
  if (!text.indexOf || text.indexOf('pomo-play:') !== 0) return {};
  const raw = text.slice('pomo-play:'.length);
  try {
    if (typeof atob === 'function') return JSON.parse(decodeURIComponent(escape(atob(raw)))) || {};
  } catch (_) {}
  try {
    if (typeof Buffer !== 'undefined') return JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) || {};
  } catch (_) {}
  try {
    return JSON.parse(decodeURIComponent(raw)) || {};
  } catch (_) {
    return {};
  }
}

function argsify(ctx) {
  if (!ctx) return {};
  if (typeof ctx === 'string') {
    try { return JSON.parse(ctx); } catch (_) { return {}; }
  }
  return ctx || {};
}

function stringValue(value) {
  return value === undefined || value === null ? '' : String(value);
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
