// @name Reference TMDB Cinema Mini Library

const SOURCE_ID = 'reference-tmdb-cinema';
const SOURCE_NAME = 'TMDB 电影精选参考源';
const DEMO_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const FALLBACK_MOVIES = [
  {
    id: 603,
    tmdbId: 603,
    title: 'The Matrix',
    mediaType: 'movie',
    year: 1999,
    rating: 8.2,
    overview: '一名程序员发现现实世界背后的真相。',
    poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg'
  },
  {
    id: 155,
    tmdbId: 155,
    title: 'The Dark Knight',
    mediaType: 'movie',
    year: 2008,
    rating: 8.5,
    overview: '哥谭市的秩序与混乱在蝙蝠侠和小丑之间展开。',
    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg'
  },
  {
    id: 27205,
    tmdbId: 27205,
    title: 'Inception',
    mediaType: 'movie',
    year: 2010,
    rating: 8.4,
    overview: '盗梦团队在层层梦境中执行一次几乎不可能的任务。',
    poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/s3TBrRGB1iav7gFOCNx3H31MoES.jpg'
  }
];

function getManifest() {
  return {
    id: SOURCE_ID,
    name: SOURCE_NAME,
    version: '1.0.0',
    author: 'baiPlay',
    description: '稳定电影参考源：用 Widget.tmdb 获取电影数据，用公开 HLS 测试流验证播放链路。',
    logo: FALLBACK_MOVIES[0].poster,
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      playback: true,
      resourceVersions: true,
      resourceMatching: true,
      resourceMatch: {
        enabled: true,
        parameters: ['tmdbId', 'title', 'originalTitle', 'alternativeTitles', 'year', 'runtimeMinutes', 'mediaType']
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true
    }
  };
}

function widgetTMDB(action, options) {
  try {
    if (typeof Widget !== 'undefined' && Widget.tmdb && typeof Widget.tmdb[action] === 'function') {
      const result = Widget.tmdb[action](options || {});
      if (result && Array.isArray(result.results) && result.results.length) return result.results;
      if (result && result.id) return result;
    }
  } catch (error) {
    if (typeof console !== 'undefined' && console.warn) console.warn(error.message || String(error));
  }
  return null;
}

function movieItems(seed, label) {
  return seed.map((item, index) => toItem(item, index + 1, label));
}

function toItem(item, rank, label) {
  const id = `${SOURCE_ID}:movie:${item.tmdbId || item.id}`;
  const title = item.title || item.displayTitle || item.name || '电影';
  return {
    id,
    title,
    type: 'movie',
    subtitle: label || '电影',
    poster: item.poster,
    backdrop: item.backdrop,
    overview: item.overview,
    year: item.year,
    rating: item.rating,
    rank,
    badges: ['TMDB', '参考源'],
    providerIds: { tmdb: String(item.tmdbId || item.id) },
    action: { type: 'detail', id, itemId: id }
  };
}

function getHome() {
  const trending = widgetTMDB('trending', { type: 'movie', timeWindow: 'week', page: 1 }) || FALLBACK_MOVIES;
  const classics = movieItems(FALLBACK_MOVIES, '经典电影');
  const hot = movieItems(trending.slice(0, 12), '本周热门');
  return {
    pageType: 'home',
    title: SOURCE_NAME,
    heroAspectRatio: '16:9',
    hero: hot.slice(0, 6),
    sections: [
      {
        id: 'trending',
        title: '本周热门电影',
        style: 'discover.ranked',
        moreAction: { type: 'category', pageId: 'trending', title: '本周热门电影' },
        items: hot
      },
      {
        id: 'classics',
        title: '协议验证片单',
        style: 'discover.standard',
        moreAction: { type: 'category', pageId: 'classics', title: '协议验证片单' },
        items: classics
      }
    ]
  };
}

function getCategory(ctx) {
  const pageId = (ctx && (ctx.pageId || ctx.id)) || 'trending';
  const seed = pageId === 'classics'
    ? FALLBACK_MOVIES
    : (widgetTMDB('trending', { type: 'movie', timeWindow: 'week', page: Number(ctx.page || 1) }) || FALLBACK_MOVIES);
  return {
    pageType: 'category',
    id: pageId,
    title: pageId === 'classics' ? '协议验证片单' : '本周热门电影',
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: movieItems(seed, '电影')
  };
}

function search(ctx) {
  const query = (ctx && (ctx.query || ctx.keyword || ctx.text)) || '';
  const seed = query
    ? (widgetTMDB('search', { type: 'movie', query, page: Number(ctx.page || 1) }) || FALLBACK_MOVIES)
    : FALLBACK_MOVIES;
  return movieItems(seed, query ? `搜索：${query}` : '搜索结果');
}

function getDetail(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:movie:${FALLBACK_MOVIES[0].tmdbId}`;
  const tmdbId = Number(String(itemId).split(':').pop());
  const detail = widgetTMDB('detail', { type: 'movie', id: tmdbId }) || FALLBACK_MOVIES.find((item) => item.tmdbId === tmdbId) || FALLBACK_MOVIES[0];
  const title = detail.title || detail.displayTitle || detail.name || '电影';
  return {
    id: itemId,
    title,
    originalTitle: detail.originalTitle,
    type: 'movie',
    poster: detail.poster,
    backdrop: detail.backdrop,
    overview: detail.overview,
    year: detail.year,
    rating: detail.rating,
    runtimeMinutes: detail.runtimeMinutes || 120,
    genres: detail.genres || ['电影'],
    providerIds: { tmdb: String(tmdbId || detail.tmdbId || detail.id || '') },
    resourceGroups: getResourceVersions({ itemId }),
    recommendations: [
      {
        id: 'related',
        title: '相关推荐',
        style: 'discover.standard',
        items: movieItems(FALLBACK_MOVIES, '相关推荐')
      }
    ]
  };
}

function getResourceVersions(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:movie:${FALLBACK_MOVIES[0].tmdbId}`;
  return [
    {
      id: 'online',
      title: '在线播放',
      versions: [
        {
          id: `${itemId}:demo-hls`,
          name: '公开 HLS 测试流',
          subtitle: '用于验证播放器链路',
          url: DEMO_HLS,
          container: 'm3u8',
          default: true
        }
      ]
    }
  ];
}

function resolvePlayback(ctx) {
  return {
    url: (ctx && ctx.url) || DEMO_HLS,
    container: 'm3u8',
    headers: {}
  };
}

function matchResources(ctx) {
  const tmdbId = ctx && (ctx.tmdbId || ctx.tmdbID || (ctx.providerIds && ctx.providerIds.tmdb));
  const title = (ctx && (ctx.title || ctx.name || ctx.query)) || '';
  const candidates = tmdbId
    ? FALLBACK_MOVIES.filter((item) => String(item.tmdbId) === String(tmdbId))
    : FALLBACK_MOVIES.filter((item) => item.title.toLowerCase().indexOf(String(title).toLowerCase()) >= 0);
  return {
    results: movieItems(candidates.length ? candidates : FALLBACK_MOVIES.slice(0, 1), '匹配资源').map((item) => ({
      ...item,
      score: 0.96,
      matchReason: tmdbId ? 'tmdbId' : 'title',
      resourceGroups: getResourceVersions({ itemId: item.id })
    }))
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getManifest, getHome, getCategory, getDetail, getResourceVersions, resolvePlayback, search, matchResources };
}
