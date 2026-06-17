// @name Sample Mini Library

const poster =
  'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg';
const backdrop =
  'https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg';
const sampleImageHeaders = {
  Referer: 'https://www.themoviedb.org/',
  'User-Agent': 'Mozilla/5.0'
};

function getManifest() {
  return {
    id: 'sample-mini-library',
    name: '示例自定义媒体库',
    version: '1.0.0',
    author: 'baiPlay',
    logo: poster,
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

function media(id, index) {
  return {
    id,
    title: `示例影片 ${index}`,
    subtitle: '自定义媒体库',
    type: index % 3 === 0 ? 'series' : 'movie',
    poster,
    backdrop,
    imageHeaders: sampleImageHeaders,
    year: 2026,
    rating: 8 + (index % 10) / 10,
    rank: index,
    remarks: index % 2 === 0 ? '4K' : 'HD',
    badges: ['示例', 'JS'],
    aspectRatio: '16:9',
    action: { type: 'detail', itemId: id }
  };
}

function categoryEntry(id, title, index, previewItems) {
  return {
    id,
    title,
    subtitle: `${previewItems.length} 项内容`,
    type: 'collection',
    poster: previewItems[0]?.backdrop || backdrop,
    backdrop: previewItems[0]?.backdrop || backdrop,
    imageHeaders: sampleImageHeaders,
    overview: `浏览${title}中的代表性影视资源。`,
    metadataText: '分类入口',
    badges: ['分类', '榜单'],
    previewItems,
    action: { type: 'category', pageId: id, title }
  };
}

function getHome() {
  const items = Array.from({ length: 12 }, (_, index) => media(`sample-${index + 1}`, index + 1));
  const categoryItems = [
    categoryEntry('annual-action', '动作精选', 1, items.slice(0, 3)),
    categoryEntry('annual-drama', '剧情佳作', 2, items.slice(3, 6)),
    categoryEntry('annual-animation', '动画推荐', 3, items.slice(6, 9)),
    categoryEntry('annual-series', '剧集专题', 4, items.slice(9, 12))
  ];
  return {
    pageType: 'home',
    title: '示例自定义媒体库',
    heroAspectRatio: '16:9',
    hero: items.slice(0, 6),
    sections: [
      {
        id: 'annual-categories',
        title: '年度分类入口',
        style: 'discover.annualListPreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'annual-categories', title: '年度分类入口' },
        items: categoryItems
      },
      {
        id: 'ranked',
        title: '热门榜单',
        style: 'discover.ranked',
        moreAction: { type: 'category', pageId: 'ranked', title: '热门榜单' },
        items
      },
      {
        id: 'spotlight',
        title: '焦点推荐',
        style: 'discover.spotlight',
        items: items.slice(0, 8)
      },
      {
        id: 'editorial',
        title: '编辑精选',
        style: 'discover.editorial',
        items: items.slice(2, 10)
      },
      {
        id: 'compact',
        title: '快速浏览',
        style: 'discover.posterCompact',
        items
      },
      {
        id: 'grid',
        title: '海报墙',
        style: 'media.posterGrid',
        items
      }
    ]
  };
}

function getHomeSection(ctx = {}) {
  const sectionId = ctx.sectionId || ctx.id;
  if (sectionId !== 'annual-categories') {
    return { id: sectionId, title: ctx.title || '榜单', style: ctx.style || 'discover.standard', lazy: false, items: [] };
  }
  const items = Array.from({ length: 12 }, (_, index) => media(`sample-${index + 1}`, index + 1));
  return {
    id: 'annual-categories',
    title: '年度分类入口',
    style: 'discover.annualListPreview',
    lazy: false,
    items: [
      categoryEntry('annual-action', '动作精选', 1, items.slice(0, 3)),
      categoryEntry('annual-drama', '剧情佳作', 2, items.slice(3, 6)),
      categoryEntry('annual-animation', '动画推荐', 3, items.slice(6, 9)),
      categoryEntry('annual-series', '剧集专题', 4, items.slice(9, 12))
    ]
  };
}

function getCategory(ext) {
  const pageId = ext.pageId || ext.id || 'ranked';
  const items = Array.from({ length: 30 }, (_, index) => media(`${pageId}-${index + 1}`, index + 1));
  return {
    pageType: 'category',
    id: pageId,
    title: pageId === 'ranked' ? '热门榜单' : '分类',
    style: 'media.posterGrid',
    items
  };
}

function getDetail(ext) {
  const itemId = ext.itemId || ext.id || 'sample-1';
  return {
    id: itemId,
    title: `示例影片 ${itemId.split('-').pop() || '1'}`,
    type: itemId.indexOf('series') >= 0 ? 'series' : 'movie',
    poster,
    backdrop,
    imageHeaders: sampleImageHeaders,
    posterHeaders: sampleImageHeaders,
    backdropHeaders: sampleImageHeaders,
    year: 2026,
    rating: 8.6,
    runtimeMinutes: 126,
    genres: ['动作', '科幻'],
    overview: '这是一个自定义媒体库详情示例。社区小程序只负责返回结构化数据，App 负责原生详情页、资源版本和播放器。',
    resourceGroups: [
      {
        id: 'online',
        title: '在线播放',
        versions: [
          {
            id: 'demo-hls',
            name: '示例 HLS',
            subtitle: '直接播放地址',
            url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            container: 'm3u8',
            default: true
          }
        ]
      }
    ],
    recommendations: [
      {
        id: 'related',
        title: '相关推荐',
        style: 'discover.standard',
        items: Array.from({ length: 10 }, (_, index) => media(`related-${index + 1}`, index + 1))
      }
    ]
  };
}

function getResourceVersions(ext) {
  const detail = getDetail(ext);
  return detail.resourceGroups;
}

function resolvePlayback(ext) {
  if (ext.url) {
    return { url: ext.url };
  }
  return {
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    container: 'm3u8',
    preferDirectAVPlayer: false
  };
}

function search(ext) {
  const query = ext.query || ext.text || ext.keyword || '';
  const items = Array.from({ length: 12 }, (_, index) => {
    const item = media(`search-${index + 1}`, index + 1);
    item.title = `${query || '搜索'} 结果 ${index + 1}`;
    return item;
  });
  return { pageType: 'search', title: '搜索结果', items };
}

function onSearch(ext) {
  return search(ext);
}

function matchResources(ext) {
  const query = ext.title || ext.name || (ext.searchTitles && ext.searchTitles[0]) || '';
  const items = search({ query, page: 1 }).items;
  return {
    results: items
      .filter(item => !ext.mediaType || ext.mediaType === 'movie' || item.type === 'series')
      .slice(0, 6)
  };
}

function matchMovie(ext) {
  return matchResources(ext);
}

function matchEpisode(ext) {
  return matchResources(ext);
}
