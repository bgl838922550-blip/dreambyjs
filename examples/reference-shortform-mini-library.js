// @name Reference Shortform Mini Library

const SOURCE_ID = 'reference-shortform';
const SOURCE_NAME = '短内容参考源';
const DEMO_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const SHORTS = [
  {
    id: 'coffee-01',
    title: '十分钟咖啡纪录短片',
    topic: '纪录',
    minutes: 10,
    poster: 'https://dummyimage.com/720x1280/7c2d12/ffffff.png?text=Coffee',
    backdrop: 'https://dummyimage.com/1280x720/7c2d12/ffffff.png?text=Coffee+Short',
    overview: '用短片结构演示详情、资源版本和播放记录。'
  },
  {
    id: 'city-02',
    title: '城市夜行短片',
    topic: '城市',
    minutes: 8,
    poster: 'https://dummyimage.com/720x1280/0f172a/ffffff.png?text=City',
    backdrop: 'https://dummyimage.com/1280x720/0f172a/ffffff.png?text=City+Night',
    overview: '适合竖向海报墙的短内容条目。'
  },
  {
    id: 'food-03',
    title: '街头美食速写',
    topic: '美食',
    minutes: 12,
    poster: 'https://dummyimage.com/720x1280/854d0e/ffffff.png?text=Food',
    backdrop: 'https://dummyimage.com/1280x720/854d0e/ffffff.png?text=Street+Food',
    overview: '演示短剧/短视频类自定义媒体库可以复用原生详情页。'
  }
];

function getManifest() {
  return {
    id: SOURCE_ID,
    name: SOURCE_NAME,
    version: '1.0.0',
    author: 'baiPlay',
    description: '短内容/短剧参考源，适合验证竖向海报、专题入口、选集与播放。',
    logo: SHORTS[0].poster,
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      playback: true,
      resourceVersions: true
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    }
  };
}

function shortItem(item, rank) {
  return {
    id: `${SOURCE_ID}:short:${item.id}`,
    title: item.title,
    subtitle: `${item.topic} · ${item.minutes} 分钟`,
    type: 'movie',
    poster: item.poster,
    backdrop: item.backdrop,
    overview: item.overview,
    runtimeMinutes: item.minutes,
    rank,
    badges: ['短内容', item.topic],
    aspectRatio: '2:3',
    action: { type: 'detail', itemId: `${SOURCE_ID}:short:${item.id}` }
  };
}

function topicEntry(topic) {
  const seed = SHORTS.filter((item) => item.topic === topic);
  return {
    id: `${SOURCE_ID}:topic:${topic}`,
    title: topic,
    subtitle: `${seed.length} 条短内容`,
    type: 'collection',
    poster: seed[0].backdrop,
    backdrop: seed[0].backdrop,
    previewItems: seed.map(shortItem),
    action: { type: 'category', pageId: topic, title: topic }
  };
}

function getHome() {
  const items = SHORTS.map(shortItem);
  const topics = Array.from(new Set(SHORTS.map((item) => item.topic))).map(topicEntry);
  return {
    pageType: 'home',
    title: SOURCE_NAME,
    heroAspectRatio: '16:9',
    hero: items,
    sections: [
      {
        id: 'topics',
        title: '短内容专题',
        style: 'discover.annualWidePreview',
        items: topics
      },
      {
        id: 'latest',
        title: '最新短片',
        style: 'media.posterGrid',
        moreAction: { type: 'category', pageId: 'all', title: '最新短片' },
        items
      }
    ]
  };
}

function getCategory(ctx) {
  const pageId = (ctx && (ctx.pageId || ctx.id)) || 'all';
  const items = pageId === 'all' ? SHORTS : SHORTS.filter((item) => item.topic === pageId);
  return {
    pageType: 'category',
    id: pageId,
    title: (ctx && ctx.title) || '短内容',
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: items.map(shortItem)
  };
}

function search(ctx) {
  const query = String((ctx && (ctx.query || ctx.keyword || ctx.text)) || '').toLowerCase();
  const results = SHORTS.filter((item) => {
    if (!query) return true;
    return item.id.toLowerCase().indexOf(query) >= 0
      || item.title.toLowerCase().indexOf(query) >= 0
      || item.topic.toLowerCase().indexOf(query) >= 0
      || item.overview.toLowerCase().indexOf(query) >= 0;
  });
  return (results.length ? results : SHORTS).map(shortItem);
}

function shortFromId(itemId) {
  const id = String(itemId || '').split(':').pop();
  return SHORTS.find((item) => item.id === id) || SHORTS[0];
}

function getDetail(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:short:${SHORTS[0].id}`;
  const item = shortFromId(itemId);
  return {
    id: itemId,
    title: item.title,
    type: 'movie',
    poster: item.poster,
    backdrop: item.backdrop,
    overview: item.overview,
    runtimeMinutes: item.minutes,
    genres: ['短内容', item.topic],
    resourceGroups: getResourceVersions({ itemId }),
    recommendations: [
      {
        id: 'more-shorts',
        title: '继续看短片',
        style: 'discover.standard',
        items: SHORTS.map(shortItem)
      }
    ]
  };
}

function getResourceVersions(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:short:${SHORTS[0].id}`;
  return [
    {
      id: 'shortform',
      title: '短片播放',
      versions: [
        {
          id: `${itemId}:hls`,
          name: 'HLS',
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getManifest, getHome, getCategory, getDetail, getResourceVersions, resolvePlayback, search };
}
