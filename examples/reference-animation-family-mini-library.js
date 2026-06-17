// @name Reference Animation Family Mini Library

const SOURCE_ID = 'reference-animation-family';
const SOURCE_NAME = '动画家庭参考源';
const DEMO_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const FALLBACK_ITEMS = [
  {
    id: 862,
    tmdbId: 862,
    title: 'Toy Story',
    mediaType: 'movie',
    year: 1995,
    rating: 8.0,
    overview: '玩具们在孩子看不见的时候拥有自己的冒险。',
    poster: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/3Rfvhy1Nl6sSGJwyjb0QiZzZYlB.jpg'
  },
  {
    id: 508943,
    tmdbId: 508943,
    title: 'Luca',
    mediaType: 'movie',
    year: 2021,
    rating: 7.8,
    overview: '两个少年在意大利海边度过一个难忘夏天。',
    poster: 'https://image.tmdb.org/t/p/w500/jTswp6KyDYKtvC52GbHagrZbGvD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/620hnMVLu6RSZW6a5rwO8gqpt0t.jpg'
  },
  {
    id: 129,
    tmdbId: 129,
    title: 'Spirited Away',
    mediaType: 'movie',
    year: 2001,
    rating: 8.5,
    overview: '少女误入神灵世界，在奇幻旅程中学会勇气。',
    poster: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg'
  }
];

function getManifest() {
  return {
    id: SOURCE_ID,
    name: SOURCE_NAME,
    version: '1.0.0',
    author: 'baiPlay',
    description: '面向家庭场景的动画片单参考源，演示专题入口和 TMDB 辅助搜索。',
    logo: FALLBACK_ITEMS[0].poster,
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      playback: true,
      resourceVersions: true,
      resourceMatching: true
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true
    }
  };
}

function tmdbSearch(query) {
  try {
    if (typeof Widget !== 'undefined' && Widget.tmdb) {
      const result = Widget.tmdb.search({ type: 'movie', query, page: 1 });
      if (result && result.results && result.results.length) return result.results;
    }
  } catch (error) {}
  return FALLBACK_ITEMS;
}

function itemCard(item, rank, subtitle) {
  const id = `${SOURCE_ID}:movie:${item.tmdbId || item.id}`;
  return {
    id,
    title: item.title || item.displayTitle || item.name || '动画',
    type: 'movie',
    subtitle,
    poster: item.poster,
    backdrop: item.backdrop,
    overview: item.overview,
    year: item.year,
    rating: item.rating,
    rank,
    badges: ['动画', '家庭'],
    providerIds: { tmdb: String(item.tmdbId || item.id) },
    action: { type: 'detail', id, itemId: id }
  };
}

function categoryEntry(id, title, seed) {
  return {
    id,
    title,
    type: 'collection',
    subtitle: `${seed.length} 部`,
    poster: seed[0].backdrop || seed[0].poster,
    backdrop: seed[0].backdrop,
    previewItems: seed.map((item, index) => itemCard(item, index + 1, title)).slice(0, 3),
    action: { type: 'category', pageId: id, title }
  };
}

function getHome() {
  const items = FALLBACK_ITEMS.map((item, index) => itemCard(item, index + 1, '家庭动画'));
  const entries = [
    categoryEntry('pixar-like', '温暖冒险', FALLBACK_ITEMS.slice(0, 2)),
    categoryEntry('fantasy', '奇幻成长', FALLBACK_ITEMS.slice(1, 3)),
    categoryEntry('all-animation', '全部动画', FALLBACK_ITEMS)
  ];
  return {
    pageType: 'home',
    title: SOURCE_NAME,
    heroAspectRatio: '16:9',
    hero: items,
    sections: [
      {
        id: 'topics',
        title: '动画专题入口',
        style: 'discover.annualListPreview',
        items: entries
      },
      {
        id: 'family-picks',
        title: '家庭精选',
        style: 'discover.posterCompact',
        moreAction: { type: 'category', pageId: 'all-animation', title: '家庭精选' },
        items
      }
    ]
  };
}

function getCategory(ctx) {
  const pageId = (ctx && (ctx.pageId || ctx.id)) || 'all-animation';
  let seed = FALLBACK_ITEMS;
  if (pageId === 'pixar-like') seed = tmdbSearch('Pixar').slice(0, 12);
  if (pageId === 'fantasy') seed = tmdbSearch('Spirited Away').slice(0, 12);
  return {
    pageType: 'category',
    id: pageId,
    title: (ctx && ctx.title) || '家庭动画',
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: seed.map((item, index) => itemCard(item, index + 1, '家庭动画'))
  };
}

function search(ctx) {
  const query = (ctx && (ctx.query || ctx.keyword || ctx.text)) || 'animation';
  return tmdbSearch(query).map((item, index) => itemCard(item, index + 1, `搜索：${query}`));
}

function getDetail(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:movie:${FALLBACK_ITEMS[0].tmdbId}`;
  const tmdbId = Number(String(itemId).split(':').pop());
  let item = FALLBACK_ITEMS.find((value) => value.tmdbId === tmdbId);
  if (!item) {
    try {
      if (typeof Widget !== 'undefined' && Widget.tmdb) {
        item = Widget.tmdb.detail({ type: 'movie', id: tmdbId });
      }
    } catch (error) {}
  }
  item = item || FALLBACK_ITEMS[0];
  return {
    id: itemId,
    title: item.title || item.displayTitle || item.name || '动画',
    type: 'movie',
    poster: item.poster,
    backdrop: item.backdrop,
    overview: item.overview,
    year: item.year,
    rating: item.rating,
    runtimeMinutes: 95,
    genres: item.genres || ['动画', '家庭'],
    providerIds: { tmdb: String(tmdbId || item.tmdbId || item.id || '') },
    resourceGroups: getResourceVersions({ itemId }),
    recommendations: [
      {
        id: 'more-animation',
        title: '更多动画',
        style: 'discover.standard',
        items: FALLBACK_ITEMS.map((value, index) => itemCard(value, index + 1, '更多动画'))
      }
    ]
  };
}

function getResourceVersions(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:movie:${FALLBACK_ITEMS[0].tmdbId}`;
  return [
    {
      id: 'demo',
      title: '播放版本',
      versions: [
        {
          id: `${itemId}:family-hls`,
          name: '家庭模式 HLS',
          subtitle: '公开测试流',
          url: DEMO_HLS,
          container: 'm3u8',
          default: true
        }
      ]
    }
  ];
}

function resolvePlayback(ctx) {
  return { url: (ctx && ctx.url) || DEMO_HLS, container: 'm3u8', headers: {} };
}

function matchResources(ctx) {
  const title = String((ctx && (ctx.title || ctx.name || ctx.query)) || '').toLowerCase();
  const matches = FALLBACK_ITEMS.filter((item) => item.title.toLowerCase().indexOf(title) >= 0);
  return {
    results: (matches.length ? matches : FALLBACK_ITEMS.slice(0, 1)).map((item, index) => ({
      ...itemCard(item, index + 1, '匹配资源'),
      score: 0.9,
      matchReason: 'family-animation',
      resourceGroups: getResourceVersions({ itemId: `${SOURCE_ID}:movie:${item.tmdbId}` })
    }))
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getManifest, getHome, getCategory, getDetail, getResourceVersions, resolvePlayback, search, matchResources };
}
