// @name 短剧天天看

const BASE = 'https://www.baixiaotangtop.com';
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="10" y1="8" x2="86" y2="88" gradientUnits="userSpaceOnUse"><stop stop-color="#ff4f6d"/><stop offset=".48" stop-color="#7c5cff"/><stop offset="1" stop-color="#20d4b8"/></linearGradient></defs><rect width="96" height="96" rx="24" fill="#101018"/><rect x="14" y="13" width="68" height="70" rx="18" fill="url(#g)"/><rect x="24" y="25" width="48" height="8" rx="4" fill="white" opacity=".92"/><rect x="24" y="43" width="24" height="8" rx="4" fill="white" opacity=".82"/><path d="M39 61.5v-15l14 7.5-14 7.5Z" fill="white"/><rect x="24" y="68" width="48" height="6" rx="3" fill="white" opacity=".75"/></svg>'
  );

const WidgetMetadata = {
  id: 'baiplay_baixiaotang_shortdrama',
  title: '短剧天天看',
  name: '短剧天天看',
  logo: LOGO,
  icon: LOGO,
  site: BASE,
  version: '1.0.0',
  author: 'baiPlay',
  description: '短剧专用自定义媒体库，接入天天影院短剧频道，支持首页、题材、排序、搜索、剧集详情、选集和播放解析。'
};

const QUICK_FILTERS = [
  { id: 'latest', title: '今日上新', subtitle: '最新收录短剧', path: '/vodtype/36.html', style: 'discover.spotlight', sort: 'time' },
  { id: 'hot', title: '爆款热播', subtitle: '按人气排序', path: '/vodshow/36--hits---------.html', style: 'discover.ranked', sort: 'hits' },
  { id: 'score', title: '高分短剧', subtitle: '按评分排序', path: '/vodshow/36--score---------.html', style: 'discover.editorial', sort: 'score' },
  { id: 'mandarin', title: '国语短剧', subtitle: '国语资源专区', path: '/vodshow/36----%E5%9B%BD%E8%AF%AD-------.html', style: 'discover.posterCompact', sort: 'time' }
];

const TOPIC_FILTERS = [
  { id: 'topic-ceo', title: '总裁', subtitle: '霸总甜宠', keyword: '总裁' },
  { id: 'topic-madam', title: '夫人', subtitle: '豪门夫人', keyword: '夫人' },
  { id: 'topic-heiress', title: '千金', subtitle: '真假千金', keyword: '千金' },
  { id: 'topic-remarriage', title: '闪婚', subtitle: '闪婚先婚后爱', keyword: '闪婚' },
  { id: 'topic-rebirth', title: '重生', subtitle: '重生逆袭', keyword: '重生' },
  { id: 'topic-revenge', title: '复仇', subtitle: '爽感复仇', keyword: '复仇' },
  { id: 'topic-mengbao', title: '萌宝', subtitle: '萌宝亲情', keyword: '萌宝' },
  { id: 'topic-warrior', title: '战神', subtitle: '战神归来', keyword: '战神' },
  { id: 'topic-god-doctor', title: '神医', subtitle: '神医下山', keyword: '神医' },
  { id: 'topic-dragon', title: '龙王', subtitle: '龙王归来', keyword: '龙王' }
];

const YEAR_FILTERS = [
  { id: 'year-2026', title: '2026', subtitle: '今年新剧', path: '/vodshow/36-----------2026.html', sortable: false },
  { id: 'year-2025', title: '2025', subtitle: '近年热门', path: '/vodshow/36-----------2025.html', sortable: false },
  { id: 'year-2024', title: '2024', subtitle: '经典补看', path: '/vodshow/36-----------2024.html', sortable: false },
  { id: 'year-2023', title: '2023', subtitle: '高密度片单', path: '/vodshow/36-----------2023.html', sortable: false }
];

const HOME_SECTIONS = [
  { id: 'latest', title: '今日上新', path: '/vodtype/36.html', style: 'discover.spotlight', promotesToHero: true },
  { id: 'hot', title: '爆款热播', path: '/vodshow/36--hits---------.html', style: 'discover.ranked' },
  { id: 'score', title: '高分短剧', path: '/vodshow/36--score---------.html', style: 'discover.editorial' },
  { id: 'mandarin', title: '国语短剧', path: '/vodshow/36----%E5%9B%BD%E8%AF%AD-------.html', style: 'discover.posterCompact' },
  { id: '2026', title: '2026 新剧', path: '/vodshow/36-----------2026.html', style: 'discover.spotlight' },
  { id: '2025', title: '2025 热门', path: '/vodshow/36-----------2025.html', style: 'discover.posterCompact' }
];

const SORT_OPTIONS = [
  { id: 'time', title: '按时间', value: 'time' },
  { id: 'hits', title: '按人气', value: 'hits' },
  { id: 'score', title: '按评分', value: 'score' }
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
        parameters: ['title', 'alternativeTitles', 'year', 'mediaType', 'seasonNumber', 'episodeNumber']
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    }
  };
}

function getHome() {
  return {
    pageType: 'home',
    id: 'baixiaotang-shortdrama-home',
    title: WidgetMetadata.title,
    heroAspectRatio: '2:3',
    hero: [],
    sections: [
      {
        id: 'shortdrama-quick-filters',
        title: '短剧频道',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'shortdrama-quick-filters', title: '短剧频道' },
        items: QUICK_FILTERS.map(function (entry) {
          return categoryEntry(entry, []);
        })
      },
      {
        id: 'shortdrama-topics',
        title: '题材搜索',
        style: 'discover.annualListPreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'shortdrama-topics', title: '题材搜索' },
        items: TOPIC_FILTERS.map(function (entry) {
          return topicEntry(entry, []);
        })
      },
      {
        id: 'shortdrama-years',
        title: '年份入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'shortdrama-years', title: '年份入口' },
        items: YEAR_FILTERS.map(function (entry) {
          return categoryEntry(entry, []);
        })
      }
    ].concat(
      HOME_SECTIONS.map(function (section) {
        return {
          id: 'shortdrama-' + section.id,
          title: section.title,
          style: section.style,
          lazy: true,
          promotesToHero: !!section.promotesToHero,
          loadAction: { type: 'custom', id: 'shortdrama-' + section.id, title: section.title },
          moreAction: categoryAction(section.path, section.title, section.id),
          items: []
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const sectionId = String((ctx && (ctx.sectionId || ctx.id)) || '');

  if (sectionId === 'shortdrama-quick-filters') {
    return {
      id: sectionId,
      title: '短剧频道',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: QUICK_FILTERS.map(function (entry) {
        const preview = fetchList(entry.path, 1).items.slice(0, 6);
        return categoryEntry(entry, preview);
      })
    };
  }

  if (sectionId === 'shortdrama-topics') {
    return {
      id: sectionId,
      title: '题材搜索',
      style: 'discover.annualListPreview',
      lazy: false,
      items: TOPIC_FILTERS.map(function (entry) {
        const preview = search({ query: entry.keyword, page: 1 }).items.slice(0, 6);
        return topicEntry(entry, preview);
      })
    };
  }

  if (sectionId === 'shortdrama-years') {
    return {
      id: sectionId,
      title: '年份入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: YEAR_FILTERS.map(function (entry) {
        const preview = fetchList(entry.path, 1).items.slice(0, 6);
        return categoryEntry(entry, preview);
      })
    };
  }

  const section = HOME_SECTIONS.filter(function (item) {
    return 'shortdrama-' + item.id === sectionId;
  })[0];
  if (!section) {
    return {
      id: sectionId || 'unknown',
      title: (ctx && ctx.title) || '短剧',
      style: (ctx && ctx.style) || 'discover.posterCompact',
      lazy: false,
      items: []
    };
  }

  const page = fetchList(section.path, 1);
  return {
    id: 'shortdrama-' + section.id,
    title: section.title,
    style: section.style,
    lazy: false,
    promotesToHero: !!section.promotesToHero,
    moreAction: categoryAction(section.path, section.title, section.id),
    items: page.items.slice(0, 18)
  };
}

function getCategory(ctx) {
  const page = numberValue(ctx && ctx.page, 1);
  const sort = String((ctx && (ctx.sort || ctx.sortBy || ctx.sort_by || ctx.selectedSort)) || '');
  const pageId = String((ctx && (ctx.pageId || ctx.id)) || 'latest');
  const parsed = parsePageId(pageId);

  if (parsed.query) {
    const result = search({ query: parsed.query, page });
    return {
      pageType: 'category',
      id: pageId,
      title: (ctx && ctx.title) || parsed.title || parsed.query,
      style: 'media.posterGrid',
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait',
      imageFit: 'fill',
      items: result.items,
      page,
      hasMore: result.hasMore,
      sortOptions: [],
      selectedSortValue: ''
    };
  }

  let path = parsed.path || '/vodtype/36.html';
  if (sort && parsed.sortable !== false) path = applySort(path, sort);
  path = withPage(path, page);

  const list = fetchList(path, page);
  return {
    pageType: 'category',
    id: makePageId(path),
    title: (ctx && ctx.title) || parsed.title || '短剧',
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    imageFit: 'fill',
    items: list.items,
    page,
    hasMore: list.hasMore,
    sortOptions: parsed.sortable === false ? [] : SORT_OPTIONS,
    selectedSortValue: sort || parsed.sort || 'time'
  };
}

function getDetail(ctx) {
  const itemId = normalizeItemId((ctx && (ctx.itemId || ctx.id)) || '');
  if (!itemId) throw new Error('短剧详情参数为空');
  const html = fetchText(itemId, BASE + '/vodtype/36.html');
  const detail = parseDetail(html, itemId);
  cacheDetail(detail);
  return detail;
}

function getResourceVersions(ctx) {
  const itemId = normalizeItemId((ctx && (ctx.itemId || ctx.id)) || '');
  const episodeId = String((ctx && (ctx.episodeId || ctx.episode || ctx.episodeIndex)) || '1');
  const detail = getCachedDetail(itemId) || getDetail({ itemId });
  const episode = findEpisode(detail, episodeId) || (detail.seasons && detail.seasons[0] && detail.seasons[0].episodes[0]);
  if (!episode) return [];

  return [
    {
      id: 'main',
      title: '高清资源',
      versions: [
        {
          id: versionId(itemId, episode),
          title: '高清资源',
          name: '高清资源',
          playPage: episode.playPage,
          href: episode.playPage,
          quality: 'HD',
          sourceName: '天天影院',
          availability: 'requiresResolve',
          action: {
            type: 'play',
            itemId,
            seasonId: 's1',
            episodeId: String(episode.id || episode.index || episodeId),
            versionId: versionId(itemId, episode),
            url: episode.playPage,
            playPage: episode.playPage
          },
          ext: { playPage: episode.playPage }
        }
      ]
    }
  ];
}

function resolvePlayback(ctx) {
  const direct = firstNonEmpty(ctx && ctx.url, ctx && ctx.playUrl, ctx && ctx.play_url);
  if (isDirectMediaURL(direct)) return playback(direct, BASE + '/');

  const parsed = parseVersionId(ctx && (ctx.versionId || ctx.id || ctx.sourceId));
  let playPage = firstNonEmpty(
    ctx && ctx.playPage,
    ctx && ctx.href,
    ctx && ctx.ext && ctx.ext.playPage,
    isPlayPageURL(direct) ? direct : '',
    parsed.playPage
  );
  const itemId = normalizeItemId(firstNonEmpty(ctx && ctx.itemId, parsed.itemId, itemIdFromPlayPage(playPage)));
  if (!playPage && itemId) {
    const detail = getCachedDetail(itemId) || getDetail({ itemId });
    const episode = findEpisode(detail, firstNonEmpty(ctx && ctx.episodeId, parsed.episodeId, '1'));
    playPage = episode && episode.playPage;
  }
  if (!playPage) throw new Error('短剧播放失败：缺少播放页');

  const referer = absolute(playPage);
  const html = fetchText(playPage, itemId ? absolute(itemId) : BASE + '/vodtype/36.html');
  const player = parsePlayerConfig(html);
  const url = player.url || player.playUrl || '';
  if (!url) throw new Error('短剧播放失败：播放页没有返回媒体地址');
  return playback(url, referer);
}

function search(ctx) {
  const keyword = String((ctx && (ctx.query || ctx.keyword || ctx.text || ctx.wd)) || '').trim();
  const page = numberValue(ctx && ctx.page, 1);
  if (!keyword) {
    return {
      pageType: 'search',
      title: '搜索短剧',
      keyword,
      style: 'media.posterGrid',
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait',
      items: [],
      page,
      hasMore: false
    };
  }
  const path = page > 1
    ? '/vodsearch/' + encodeURIComponent(keyword) + '----------' + page + '---.html'
    : '/vodsearch/-------------.html?wd=' + encodeURIComponent(keyword);
  const html = fetchText(path, BASE + '/');
  const items = parseSearchItems(html);
  return {
    pageType: 'search',
    title: '搜索：' + keyword,
    keyword,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    items,
    page,
    hasMore: hasNextPage(html, page)
  };
}

function getSearch(ctx) {
  return search(ctx || {});
}

function onSearch(ctx) {
  return search(ctx || {});
}

function getCategories() {
  return QUICK_FILTERS.concat(
    TOPIC_FILTERS.map(function (entry) {
      return { id: makeQueryPageId(entry.keyword), title: entry.title, group: '题材', type: 'folder', kind: 'series' };
    }),
    YEAR_FILTERS.map(function (entry) {
      return { id: makePageId(entry.path), title: entry.title, group: '年份', type: 'folder', kind: 'series' };
    })
  ).map(function (entry) {
    return {
      id: entry.id || makePageId(entry.path),
      title: entry.title,
      name: entry.title,
      group: entry.group || '短剧',
      type: 'folder',
      kind: 'series',
      sourceId: WidgetMetadata.id
    };
  });
}

function getItems(ctx) {
  return getCategory(ctx || {}).items || [];
}

function home() {
  return getHome();
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

function detail(ctx) {
  return getDetail(ctx || {});
}

function resources(ctx) {
  return getResourceVersions(ctx || {});
}

function getVersions(ctx) {
  return getResourceVersions(ctx || {});
}

function resolve(ctx) {
  return resolvePlayback(ctx || {});
}

function play(ctx) {
  return resolvePlayback(ctx || {});
}

function categoryEntry(entry, previewItems) {
  return {
    id: entry.id || makePageId(entry.path),
    title: entry.title,
    name: entry.title,
    subtitle: entry.subtitle || '短剧',
    description: entry.subtitle || '短剧',
    type: 'collection',
    style: entry.style || 'discover.annualWidePreview',
    poster: previewItems && previewItems[0] && previewItems[0].poster,
    backdrop: previewItems && previewItems[0] && previewItems[0].poster,
    previewItems: previewItems || [],
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    action: categoryAction(entry.path, entry.title, entry.id)
  };
}

function genreEntry(genre, previewItems) {
  return topicEntry({ id: 'topic-' + genre, title: genre, subtitle: genre + '短剧精选', keyword: genre }, previewItems);
}

function topicEntry(entry, previewItems) {
  return {
    id: entry.id || makeQueryPageId(entry.keyword),
    title: entry.title,
    name: entry.title,
    subtitle: entry.subtitle || '题材短剧',
    description: entry.subtitle || '题材短剧',
    type: 'collection',
    style: 'discover.annualListPreview',
    poster: previewItems && previewItems[0] && previewItems[0].poster,
    backdrop: previewItems && previewItems[0] && previewItems[0].poster,
    previewItems: previewItems || [],
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    action: {
      type: 'category',
      id: makeQueryPageId(entry.keyword),
      pageId: makeQueryPageId(entry.keyword),
      title: entry.title,
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait'
    }
  };
}

function categoryAction(path, title, id) {
  return {
    type: 'category',
    id: id || makePageId(path),
    pageId: makePageId(path),
    title,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait'
  };
}

function fetchList(path, page) {
  const html = fetchText(withPage(path, page || 1), BASE + '/vodtype/36.html');
  return {
    items: parsePosterItems(html),
    hasMore: hasNextPage(html, page || 1)
  };
}

function parsePosterItems(html) {
  const items = [];
  const blocks = matchAll(String(html || ''), /<li\b[^>]*>\s*<div class="ewave-vodlist__box">([\s\S]*?)<\/li>/gi);
  blocks.forEach(function (block, index) {
    const thumb = firstMatch(block, /<div class="[^"]*ewave-vodlist__thumb[^"]*"([\s\S]*?)<\/div>/i);
    const title = firstNonEmpty(
      attr(thumb, 'title'),
      attr(thumb, 'alt'),
      firstMatch(block, /<h4[^>]*class="[^"]*title[^"]*"[^>]*>\s*<a[^>]*title="([^"]+)"/i)
    );
    const href = firstNonEmpty(
      firstMatch(thumb, /<a\b[^>]*class="[^"]*thumb-link[^"]*"[^>]*href="([^"]+)"/i),
      firstMatch(block, /<h4[^>]*class="[^"]*title[^"]*"[^>]*>\s*<a[^>]*href="([^"]+)"/i)
    );
    if (!title || !href || !/\/voddetail\//.test(href)) return;
    const poster = absolute(firstNonEmpty(attr(thumb, 'data-original'), attr(thumb, 'src')));
    const episodeText = stripTags(firstMatch(thumb, /<span class="pic-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i));
    const rating = scoreValue(stripTags(firstMatch(thumb, /<span class="pic-tag[^"]*"[^>]*>([\s\S]*?)<\/span>/i)));
    const actor = cleanText(stripTags(firstMatch(block, /<p class="[^"]*text-actor[^"]*"[^>]*>([\s\S]*?)<\/p>/i)));
    items.push(mediaItem({
      id: normalizeItemId(href),
      title,
      poster,
      subtitle: episodeText || actor || '短剧',
      description: actor,
      rating,
      episodeText,
      rank: index + 1
    }));
  });
  return dedupeItems(items);
}

function parseSearchItems(html) {
  const items = [];
  const list = firstMatch(html, /<ul class="[^"]*ewave-vodlist__media[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  const blocks = matchAll(list, /(<li\b[^>]*>[\s\S]*?<\/li>)/gi);
  blocks.forEach(function (block, index) {
    if (!/\/voddetail\//.test(block)) return;
    const href = firstMatch(block, /href="([^"]*\/voddetail\/[^"]+)"/i);
    const title = firstNonEmpty(
      attr(firstMatch(block, /<a class="[^"]*v-thumb[^"]*"([\s\S]*?)>/i), 'title'),
      stripTags(firstMatch(block, /<h3 class="title">\s*<a[^>]*>([\s\S]*?)<\/a>/i))
    );
    if (!href || !title) return;
    const poster = absolute(firstNonEmpty(firstMatch(block, /data-original="([^"]+)"/i), firstMatch(block, /src="([^"]+)"/i)));
    const episodeText = stripTags(firstMatch(block, /<span class="pic-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i));
    const year = yearFrom(firstMatch(block, /年份：<\/span>\s*([^<\s]+)/i));
    const area = cleanText(firstMatch(block, /地区：<\/span>\s*([^<]+)/i));
    const actors = cleanText(firstMatch(block, /主演：<\/span>\s*([^<]+)/i));
    items.push(mediaItem({
      id: normalizeItemId(href),
      title,
      poster,
      subtitle: episodeText || [area, year].filter(Boolean).join(' · ') || '短剧',
      description: actors,
      year,
      episodeText,
      rank: index + 1
    }));
  });
  return dedupeItems(items);
}

function parseDetail(html, itemId) {
  const title = cleanText(firstNonEmpty(
    firstMatch(html, /<h1 class="title">\s*<span[^>]*>([\s\S]*?)<\/span>/i),
    firstMatch(html, /<title>《([^》]+)》/i)
  ));
  const poster = absolute(firstMatch(html, /<div class="[^"]*v-thumb[^"]*"[\s\S]*?<img[^>]+data-original="([^"]+)"/i));
  const status = cleanText(firstMatch(html, /<span class="pic-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i));
  const rating = scoreValue(firstMatch(html, /<span class="score[^"]*">([\d.]+)/i));
  const typeText = stripTags(firstMatch(html, /<span class="text-muted">类型：<\/span>([\s\S]*?)<\/p>/i));
  const area = cleanText(firstMatch(html, /地区：<\/span><a[^>]*>([\s\S]*?)<\/a>/i));
  const year = yearFrom(firstMatch(html, /年份：<\/span><a[^>]*>([\s\S]*?)<\/a>/i));
  const actorsText = cleanText(firstMatch(html, /主演：<\/span>([\s\S]*?)<\/p>/i));
  const directorText = cleanText(firstMatch(html, /导演：<\/span>([\s\S]*?)<\/p>/i));
  const updateText = cleanText(firstMatch(html, /更新：<\/span>([\s\S]*?)<\/p>/i));
  const overview = cleanOverview(firstMatch(html, /<div class="ewave-pannel_bd">\s*<p class="col-pd">([\s\S]*?)<\/p>/i), title);
  const episodes = parseEpisodes(html);
  const recommendations = parsePosterItems(html).filter(function (item) {
    return item.id !== itemId;
  }).slice(0, 18);

  return {
    pageType: 'detail',
    id: itemId,
    itemId,
    type: 'series',
    title,
    name: title,
    originalTitle: title,
    poster,
    backdrop: poster,
    detailImageAspectRatio: '2:3',
    imageAspectRatio: '2:3',
    posterAspectRatio: '2:3',
    overview: overview || shortOverview(title, year, area, status),
    rating,
    year,
    status,
    genres: unique(['短剧'].concat(splitList(typeText).filter(function (name) { return name !== '类型：'; }))),
    countries: area ? [area] : [],
    cast: splitPeople(actorsText).map(function (name) {
      return { id: 'actor-' + name, name, role: '主演', action: { type: 'search', query: name, title: name } };
    }),
    crew: splitPeople(directorText).map(function (name) {
      return { id: 'director-' + name, name, role: '导演', job: '导演' };
    }),
    facts: [
      status ? { title: '集数', value: status } : null,
      updateText ? { title: '更新', value: updateText } : null
    ].filter(Boolean),
    seasons: [
      {
        id: 's1',
        title: '全集',
        index: 1,
        episodes
      }
    ],
    recommendations,
    resourceSummary: {
      versionCount: 1,
      episodeCount: episodes.length,
      defaultVersionId: episodes[0] ? versionId(itemId, episodes[0]) : ''
    },
    sourceUrl: absolute(itemId),
    source: WidgetMetadata.id
  };
}

function parseEpisodes(html) {
  const playlist = firstMatch(html, /<ul class="[^"]*ewave-content__playlist[^"]*"[^>]*>([\s\S]*?)<\/ul>/i);
  const episodes = [];
  matchAll(playlist, /<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi).forEach(function (match, index) {
    const href = match[1];
    const title = cleanText(stripTags(match[2])) || '第' + pad2(index + 1) + '集';
    const epIndex = numberValue(firstMatch(title, /(\d+)/), index + 1);
    episodes.push({
      id: String(epIndex),
      episodeId: String(epIndex),
      title,
      name: title,
      index: epIndex,
      episodeNumber: epIndex,
      overview: title,
      playPage: normalizePath(href),
      action: {
        type: 'play',
        itemId: '',
        seasonId: 's1',
        episodeId: String(epIndex),
        versionId: '',
        url: normalizePath(href),
        playPage: normalizePath(href)
      }
    });
  });
  return episodes.map(function (episode) {
    const itemMatch = /\/vodplay\/(\d+)-/.exec(episode.playPage || '');
    const itemId = itemMatch ? '/voddetail/' + itemMatch[1] + '.html' : '';
    episode.action.itemId = itemId;
    episode.action.versionId = versionId(itemId, episode);
    return episode;
  });
}

function parsePlayerConfig(html) {
  const jsonLike = firstMatch(html, /var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/i);
  if (!jsonLike) return {};
  try {
    return JSON.parse(jsonLike.replace(/\\\//g, '/'));
  } catch (error) {
    return parseLooseObject(jsonLike);
  }
}

function parseLooseObject(value) {
  const out = {};
  matchAll(value, /["']?([a-zA-Z0-9_]+)["']?\s*:\s*(?:"([^"]*)"|'([^']*)'|([^,}]+))/g).forEach(function (match) {
    out[match[1]] = decodeJSString(firstNonEmpty(match[2], match[3], match[4]));
  });
  return out;
}

function mediaItem(input) {
  const title = cleanText(input.title);
  const id = normalizeItemId(input.id);
  const subtitle = cleanText(input.subtitle);
  const badges = unique([input.episodeText, input.year, input.rating ? String(input.rating) : ''].filter(Boolean)).slice(0, 3);
  return {
    id,
    itemId: id,
    title,
    name: title,
    type: 'series',
    mediaType: 'series',
    poster: input.poster,
    cover: input.poster,
    backdrop: input.poster,
    subtitle,
    description: cleanText(input.description),
    overview: cleanText(input.description),
    year: input.year,
    rating: input.rating,
    rank: input.rank,
    badges,
    genres: ['短剧'],
    episodeText: input.episodeText,
    itemAspectRatio: '2:3',
    imageOrientation: 'portrait',
    action: {
      type: 'detail',
      itemId: id,
      id,
      title,
      itemAspectRatio: '2:3',
      imageOrientation: 'portrait'
    }
  };
}

function playback(url, referer) {
  return {
    url,
    videoUrl: url,
    container: inferContainer(url),
    headers: {
      'User-Agent': UA,
      Referer: referer || BASE + '/'
    },
    isLive: false,
    streamKind: 'vod'
  };
}

function fetchText(path, referer) {
  const url = absolute(path);
  const headers = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Referer: referer || BASE + '/'
  };
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    const response = Widget.http.get(url, { headers });
    if (typeof response === 'string') return response;
    if (response && typeof response.data === 'string') return response.data;
    if (response && response.data != null) return JSON.stringify(response.data);
    return String(response || '');
  }
  if (typeof $fetch !== 'undefined' && typeof $fetch.get === 'function') {
    const response = $fetch.get(url, { headers });
    return typeof response === 'string' ? response : String((response && response.data) || '');
  }
  throw new Error('当前环境没有可用的 HTTP GET 能力');
}

function absolute(path) {
  const value = decodeEntities(String(path || '').trim());
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  if (value[0] === '/') return BASE + value;
  return BASE + '/' + value;
}

function normalizePath(value) {
  const text = String(value || '').trim();
  if (/^https?:\/\//i.test(text)) return text.replace(BASE, '');
  return text.charAt(0) === '/' ? text : '/' + text;
}

function normalizeItemId(value) {
  let id = String(value || '').trim();
  if (/^https?:\/\//i.test(id)) id = id.replace(BASE, '');
  id = id.replace(/^detail:/, '');
  if (/^\/vodplay\/(\d+)-/.test(id)) id = id.replace(/^\/vodplay\/(\d+)-.*$/, '/voddetail/$1.html');
  return normalizePath(id);
}

function makePageId(path) {
  if (!path) return 'path:/vodtype/36.html';
  if (/^(latest|hot|score|genre-)/.test(String(path))) return String(path);
  return 'path:' + normalizePath(path);
}

function makeQueryPageId(keyword) {
  return 'query:' + encodeURIComponent(String(keyword || '').trim());
}

function parsePageId(pageId) {
  const id = String(pageId || '').replace(/^category:/, '');
  if (id === 'latest') return { path: '/vodtype/36.html', title: '今日上新', sort: 'time' };
  if (id === 'hot') return { path: '/vodshow/36--hits---------.html', title: '爆款热播', sort: 'hits' };
  if (id === 'score') return { path: '/vodshow/36--score---------.html', title: '高分短剧', sort: 'score' };
  if (id.indexOf('query:') === 0) {
    const query = decodeURIComponent(id.slice('query:'.length));
    return { query, title: query };
  }
  if (id.indexOf('genre-') === 0) {
    const genre = id.slice('genre-'.length);
    return { query: genre, title: genre };
  }
  if (id.indexOf('path:') === 0) {
    const path = normalizePath(id.slice(5));
    return { path, sort: sortFromPath(id), sortable: isSortablePath(path) };
  }
  const path = normalizePath(id || '/vodtype/36.html');
  return { path, sort: sortFromPath(id), sortable: isSortablePath(path) };
}

function genrePath(genre, sort) {
  const encoded = encodeURIComponent(genre);
  if (sort && sort !== 'time') return '/vodshow/36--' + sort + '-' + encoded + '--------.html';
  return '/vodshow/36---' + encoded + '--------.html';
}

function applySort(path, sort) {
  const parsed = parsePathGenre(path);
  if (parsed.genre) return genrePath(parsed.genre, sort);
  if (/36----/.test(String(path || ''))) {
    if (sort === 'hits') return '/vodshow/36--hits--%E5%9B%BD%E8%AF%AD-------.html';
    if (sort === 'score') return '/vodshow/36--score--%E5%9B%BD%E8%AF%AD-------.html';
    return '/vodshow/36----%E5%9B%BD%E8%AF%AD-------.html';
  }
  if (sort === 'hits') return '/vodshow/36--hits---------.html';
  if (sort === 'score') return '/vodshow/36--score---------.html';
  return '/vodtype/36.html';
}

function isSortablePath(path) {
  const value = String(path || '');
  if (/36-----------20\d{2}\.html/.test(value)) return false;
  return true;
}

function parsePathGenre(path) {
  const value = decodeURIComponent(String(path || ''));
  const match = /\/vodshow\/36--(?:hits|score)?-?([^-\s]+)--------\.html/.exec(value);
  if (match && match[1] && match[1] !== '-') return { genre: match[1] };
  return {};
}

function sortFromPath(path) {
  if (/--hits/.test(String(path))) return 'hits';
  if (/--score/.test(String(path))) return 'score';
  return 'time';
}

function withPage(path, page) {
  const value = normalizePath(path || '/vodtype/36.html');
  const pg = numberValue(page, 1);
  if (pg <= 1) return value;
  if (/\/vodtype\/36(?:-\d+)?\.html/.test(value)) return '/vodtype/36-' + pg + '.html';
  return value.replace(/\.html(?:\?.*)?$/, '-' + pg + '.html');
}

function hasNextPage(html, page) {
  const text = String(html || '');
  if (/>下一页<\/a>/i.test(text)) return true;
  const mobile = /<span class="num">(\d+)\/(\d+)<\/span>/i.exec(text);
  if (mobile) {
    return Number(mobile[1]) < Number(mobile[2]);
  }
  return new RegExp('[-]' + (numberValue(page, 1) + 1) + '\\.html').test(text);
}

function findEpisode(detail, episodeId) {
  const episodes = (detail && detail.seasons && detail.seasons[0] && detail.seasons[0].episodes) || [];
  const id = String(episodeId || '1');
  return episodes.filter(function (episode) {
    return String(episode.id) === id || String(episode.episodeId) === id || String(episode.index) === id;
  })[0];
}

function versionId(itemId, episode) {
  return ['main', normalizeItemId(itemId), episode && (episode.id || episode.index || episode.episodeId), episode && episode.playPage]
    .filter(Boolean)
    .join('|');
}

function parseVersionId(value) {
  const parts = String(value || '').split('|');
  return {
    itemId: parts[1] || '',
    episodeId: parts[2] || '',
    playPage: parts[3] || ''
  };
}

function isPlayPageURL(value) {
  return /(?:^|\/)vodplay\/\d+-\d+-\d+\.html(?:[?#].*)?$/i.test(String(value || ''));
}

function itemIdFromPlayPage(value) {
  const match = /\/vodplay\/(\d+)-/.exec(String(value || ''));
  return match ? '/voddetail/' + match[1] + '.html' : '';
}

function isDirectMediaURL(url) {
  return /\.(m3u8|m3u|mp4|mkv|mov|flv|ts)(\?|#|$)/i.test(String(url || ''));
}

function inferContainer(url) {
  const match = /\.([a-z0-9]+)(?:\?|#|$)/i.exec(String(url || ''));
  return match ? match[1].toLowerCase() : undefined;
}

function cleanOverview(value, title) {
  let text = stripTags(String(value || '').replace(/<br\s*\/?>/gi, '\n'));
  text = text
    .replace(/^《[^》]+》上映于.*?剧情简介：/s, '')
    .replace(new RegExp('^《' + escapeRegExp(title || '') + '》剧情简介：'), '')
    .replace(/\s+/g, ' ')
    .trim();
  return text;
}

function shortOverview(title, year, area, status) {
  return ['《' + title + '》', year ? year + '年' : '', area || '', status || '', '短剧'].filter(Boolean).join(' · ');
}

function splitPeople(value) {
  const text = cleanText(value);
  if (!text || /^(未知|未录入|暂无|无)$/.test(text)) return [];
  return unique(text.split(/[,\s，、/]+/).filter(Boolean)).slice(0, 12);
}

function splitList(value) {
  return unique(cleanText(value).split(/[,\s，、/]+/).filter(Boolean));
}

function scoreValue(value) {
  const num = Number(String(value || '').trim());
  if (!isFinite(num) || num <= 0) return undefined;
  return num;
}

function yearFrom(value) {
  const match = /(\d{4})/.exec(String(value || ''));
  if (!match) return undefined;
  const year = Number(match[1]);
  return year > 1800 ? year : undefined;
}

function numberValue(value, fallback) {
  const num = Number(value);
  return isFinite(num) && num > 0 ? num : fallback;
}

function firstNonEmpty() {
  for (let i = 0; i < arguments.length; i += 1) {
    const value = arguments[i];
    if (value == null) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
}

function firstMatch(value, regex) {
  const match = regex.exec(String(value || ''));
  return match ? match[1] || '' : '';
}

function matchAll(value, regex) {
  const out = [];
  const text = String(value || '');
  let match;
  regex.lastIndex = 0;
  while ((match = regex.exec(text))) {
    out.push(match.length > 2 ? match : match[1]);
    if (match.index === regex.lastIndex) regex.lastIndex += 1;
  }
  return out;
}

function attr(value, name) {
  return decodeEntities(firstMatch(value, new RegExp(name + '="([^"]*)"', 'i')));
}

function stripTags(value) {
  return decodeEntities(String(value || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' '));
}

function cleanText(value) {
  return decodeEntities(String(value || '').replace(/&nbsp;/g, ' ')).replace(/\s+/g, ' ').trim();
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

function decodeJSString(value) {
  return String(value || '')
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
    const key = String(value || '').trim();
    if (!key || seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cacheDetail(detail) {
  if (!detail || !detail.id) return;
  if (typeof Widget !== 'undefined' && Widget.storage && typeof Widget.storage.set === 'function') {
    Widget.storage.set('baixiaotang.detail.' + detail.id, detail);
  }
}

function getCachedDetail(itemId) {
  if (!itemId || typeof Widget === 'undefined' || !Widget.storage || typeof Widget.storage.get !== 'function') return null;
  const value = Widget.storage.get('baixiaotang.detail.' + itemId);
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

const BaixiaotangShortDramaLibrary = {
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
  getCategories,
  getItems,
  home,
  homeSection,
  getSection,
  section,
  loadSection,
  category,
  detail,
  resources,
  getVersions,
  resolve,
  play
};

const __jsEvalReturn = BaixiaotangShortDramaLibrary;

if (typeof globalThis !== 'undefined') {
  globalThis.BaixiaotangShortDramaLibrary = BaixiaotangShortDramaLibrary;
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getHomeSection = getHomeSection;
  globalThis.getCategory = getCategory;
  globalThis.getDetail = getDetail;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.search = search;
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
  globalThis.detail = detail;
  globalThis.resources = resources;
  globalThis.getVersions = getVersions;
  globalThis.resolve = resolve;
  globalThis.play = play;
  globalThis.__jsEvalReturn = __jsEvalReturn;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaixiaotangShortDramaLibrary;
}
