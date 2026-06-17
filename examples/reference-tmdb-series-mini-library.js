// @name Reference TMDB Series Mini Library

const SOURCE_ID = 'reference-tmdb-series';
const SOURCE_NAME = 'TMDB 剧集精选参考源';
const DEMO_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const FALLBACK_SERIES = [
  {
    id: 1399,
    tmdbId: 1399,
    title: 'Game of Thrones',
    mediaType: 'tv',
    year: 2011,
    rating: 8.4,
    overview: '多个家族围绕铁王座展开权力角逐。',
    poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg'
  },
  {
    id: 66732,
    tmdbId: 66732,
    title: 'Stranger Things',
    mediaType: 'tv',
    year: 2016,
    rating: 8.6,
    overview: '小镇少年们发现了来自异世界的秘密。',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop: 'https://image.tmdb.org/t/p/w780/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'
  }
];

function getManifest() {
  return {
    id: SOURCE_ID,
    name: SOURCE_NAME,
    version: '1.0.0',
    author: 'baiPlay',
    description: '稳定剧集参考源：覆盖剧集详情、季、集、集播放和聚合搜索。',
    logo: FALLBACK_SERIES[0].poster,
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
        parameters: ['tmdbId', 'title', 'year', 'mediaType', 'seasonNumber', 'episodeNumber', 'episodeTitle']
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true
    }
  };
}

function tmdb(action, options) {
  try {
    if (typeof Widget !== 'undefined' && Widget.tmdb && typeof Widget.tmdb[action] === 'function') {
      const result = Widget.tmdb[action](options || {});
      if (result && Array.isArray(result.results) && result.results.length) return result.results;
      if (result && result.id) return result;
    }
  } catch (error) {}
  return null;
}

function toItem(item, rank, label) {
  const id = `${SOURCE_ID}:series:${item.tmdbId || item.id}`;
  const title = item.title || item.displayTitle || item.name || '剧集';
  return {
    id,
    title,
    type: 'series',
    subtitle: label || '剧集',
    poster: item.poster,
    backdrop: item.backdrop,
    overview: item.overview,
    year: item.year,
    rating: item.rating,
    rank,
    badges: ['剧集', 'TMDB'],
    providerIds: { tmdb: String(item.tmdbId || item.id) },
    action: { type: 'detail', id, itemId: id }
  };
}

function seriesItems(seed, label) {
  return seed.map((item, index) => toItem(item, index + 1, label));
}

function getHome() {
  const trending = tmdb('trending', { type: 'tv', timeWindow: 'week' }) || FALLBACK_SERIES;
  return {
    pageType: 'home',
    title: SOURCE_NAME,
    heroAspectRatio: '16:9',
    hero: seriesItems(trending.slice(0, 6), '本周剧集'),
    sections: [
      {
        id: 'trending-tv',
        title: '本周热门剧集',
        style: 'discover.ranked',
        moreAction: { type: 'category', pageId: 'trending-tv', title: '本周热门剧集' },
        items: seriesItems(trending.slice(0, 12), '热门剧集')
      },
      {
        id: 'series-fixtures',
        title: '剧集协议验证',
        style: 'discover.editorial',
        moreAction: { type: 'category', pageId: 'series-fixtures', title: '剧集协议验证' },
        items: seriesItems(FALLBACK_SERIES, '协议验证')
      }
    ]
  };
}

function getCategory(ctx) {
  const pageId = (ctx && (ctx.pageId || ctx.id)) || 'trending-tv';
  const seed = pageId === 'series-fixtures'
    ? FALLBACK_SERIES
    : (tmdb('trending', { type: 'tv', timeWindow: 'week', page: Number(ctx.page || 1) }) || FALLBACK_SERIES);
  return {
    pageType: 'category',
    id: pageId,
    title: pageId === 'series-fixtures' ? '剧集协议验证' : '本周热门剧集',
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: seriesItems(seed, '剧集')
  };
}

function search(ctx) {
  const query = (ctx && (ctx.query || ctx.keyword || ctx.text)) || '';
  const seed = query ? (tmdb('search', { type: 'tv', query, page: Number(ctx.page || 1) }) || FALLBACK_SERIES) : FALLBACK_SERIES;
  return seriesItems(seed, query ? `搜索：${query}` : '搜索结果');
}

function episodesFor(itemId, detail) {
  const poster = detail.backdrop || detail.poster;
  return [1, 2, 3, 4, 5, 6].map((number) => ({
    id: `${itemId}:s1e${number}`,
    title: `第 ${number} 集`,
    seasonNumber: 1,
    episodeNumber: number,
    overview: `${detail.title || detail.displayTitle} 的参考剧集第 ${number} 集。`,
    poster,
    action: { type: 'play', itemId, seasonId: `${itemId}:s1`, episodeId: `${itemId}:s1e${number}` }
  }));
}

function getDetail(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:series:${FALLBACK_SERIES[0].tmdbId}`;
  const tmdbId = Number(String(itemId).split(':').pop());
  const detail = tmdb('detail', { type: 'tv', id: tmdbId }) || FALLBACK_SERIES.find((item) => item.tmdbId === tmdbId) || FALLBACK_SERIES[0];
  const title = detail.title || detail.displayTitle || detail.name || '剧集';
  return {
    id: itemId,
    title,
    originalTitle: detail.originalTitle || detail.originalName,
    type: 'series',
    poster: detail.poster,
    backdrop: detail.backdrop,
    overview: detail.overview,
    year: detail.year,
    rating: detail.rating,
    genres: detail.genres || ['剧集'],
    providerIds: { tmdb: String(tmdbId || detail.tmdbId || detail.id || '') },
    seasons: [
      {
        id: `${itemId}:s1`,
        title: '第 1 季',
        seasonNumber: 1,
        episodes: episodesFor(itemId, { ...detail, title })
      }
    ],
    resourceGroups: getResourceVersions({ itemId }),
    recommendations: [
      {
        id: 'related',
        title: '相似剧集',
        style: 'discover.standard',
        items: seriesItems(FALLBACK_SERIES, '相似剧集')
      }
    ]
  };
}

function getResourceVersions(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:series:${FALLBACK_SERIES[0].tmdbId}`;
  const episodeId = ctx && ctx.episodeId;
  return [
    {
      id: 'episodes',
      title: episodeId ? '当前集播放源' : '剧集播放源',
      versions: [
        {
          id: `${episodeId || itemId}:demo-hls`,
          name: '公开 HLS 测试流',
          subtitle: episodeId ? '单集播放' : '默认播放',
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
  const title = String((ctx && (ctx.title || ctx.name || ctx.query)) || '').toLowerCase();
  const tmdbId = ctx && (ctx.tmdbId || ctx.tmdbID || (ctx.providerIds && ctx.providerIds.tmdb));
  const matches = tmdbId
    ? FALLBACK_SERIES.filter((item) => String(item.tmdbId) === String(tmdbId))
    : FALLBACK_SERIES.filter((item) => item.title.toLowerCase().indexOf(title) >= 0);
  return {
    results: seriesItems(matches.length ? matches : FALLBACK_SERIES.slice(0, 1), '匹配资源').map((item) => ({
      ...item,
      score: 0.94,
      matchReason: tmdbId ? 'tmdbId' : 'title',
      resourceGroups: getResourceVersions({ itemId: item.id })
    }))
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getManifest, getHome, getCategory, getDetail, getResourceVersions, resolvePlayback, search, matchResources };
}
