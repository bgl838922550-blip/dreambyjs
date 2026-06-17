// @name Reference Live Channels Mini Library

const SOURCE_ID = 'reference-live-channels';
const SOURCE_NAME = '直播频道参考源';

const CHANNELS = [
  {
    id: 'mux-test',
    title: 'Mux 测试频道',
    group: '测试',
    logo: 'https://dummyimage.com/512x512/1f2937/ffffff.png?text=MUX',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id: 'bbb',
    title: 'Big Buck Bunny 频道',
    group: '公开样片',
    logo: 'https://dummyimage.com/512x512/2563eb/ffffff.png?text=BBB',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id: 'sintel',
    title: 'Sintel 频道',
    group: '公开样片',
    logo: 'https://dummyimage.com/512x512/059669/ffffff.png?text=S',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  }
];

function getManifest() {
  return {
    id: SOURCE_ID,
    name: SOURCE_NAME,
    version: '1.0.0',
    author: 'baiPlay',
    description: '直播类自定义媒体库参考源，演示频道分组、搜索和直播播放解析。',
    logo: CHANNELS[0].logo,
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

function channelItem(channel, rank) {
  return {
    id: `${SOURCE_ID}:channel:${channel.id}`,
    title: channel.title,
    subtitle: channel.group,
    type: 'live',
    poster: channel.logo,
    backdrop: channel.logo,
    overview: `${channel.title} 是用于验证直播播放链路的公开测试频道。`,
    rank,
    badges: ['直播', channel.group],
    aspectRatio: '1:1',
    imageFit: 'fit',
    providerIds: { LiveTitle: channel.title },
    action: { type: 'play', itemId: `${SOURCE_ID}:channel:${channel.id}`, url: channel.url, title: channel.title }
  };
}

function getHome() {
  const items = CHANNELS.map(channelItem);
  return {
    pageType: 'home',
    title: SOURCE_NAME,
    itemAspectRatio: '1:1',
    hero: items.slice(0, 1),
    sections: [
      {
        id: 'all-live',
        title: '全部直播频道',
        style: 'media.posterGrid',
        moreAction: { type: 'category', pageId: 'all-live', title: '全部直播频道', itemAspectRatio: '1:1' },
        items
      },
      {
        id: 'sample-live',
        title: '公开样片频道',
        style: 'discover.standard',
        moreAction: { type: 'category', pageId: '公开样片', title: '公开样片频道', itemAspectRatio: '1:1' },
        items: CHANNELS.filter((channel) => channel.group === '公开样片').map(channelItem)
      }
    ]
  };
}

function getCategory(ctx) {
  const pageId = (ctx && (ctx.pageId || ctx.id)) || 'all-live';
  const channels = pageId === 'all-live' ? CHANNELS : CHANNELS.filter((channel) => channel.group === pageId);
  return {
    pageType: 'category',
    id: pageId,
    title: (ctx && ctx.title) || '直播频道',
    style: 'media.posterGrid',
    itemAspectRatio: '1:1',
    items: channels.map(channelItem)
  };
}

function search(ctx) {
  const query = String((ctx && (ctx.query || ctx.keyword || ctx.text)) || '').toLowerCase();
  const results = CHANNELS.filter((channel) => {
    if (!query) return true;
    return channel.id.toLowerCase().indexOf(query) >= 0
      || channel.title.toLowerCase().indexOf(query) >= 0
      || channel.group.toLowerCase().indexOf(query) >= 0
      || channel.url.toLowerCase().indexOf(query) >= 0;
  });
  return (results.length ? results : CHANNELS).map(channelItem);
}

function channelFromId(itemId) {
  const key = String(itemId || '').split(':').pop();
  return CHANNELS.find((channel) => channel.id === key) || CHANNELS[0];
}

function getDetail(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:channel:${CHANNELS[0].id}`;
  const channel = channelFromId(itemId);
  return {
    id: itemId,
    title: channel.title,
    type: 'live',
    poster: channel.logo,
    backdrop: channel.logo,
    overview: `${channel.title}：公开测试直播源，用于验证直播频道、自定义媒体库播放记录和播放器调起。`,
    genres: ['直播', channel.group],
    providerIds: { LiveTitle: channel.title },
    resourceGroups: getResourceVersions({ itemId })
  };
}

function getResourceVersions(ctx) {
  const itemId = (ctx && (ctx.itemId || ctx.id)) || `${SOURCE_ID}:channel:${CHANNELS[0].id}`;
  const channel = channelFromId(itemId);
  return [
    {
      id: 'live',
      title: '直播源',
      versions: [
        {
          id: `${itemId}:live`,
          name: '直播 HLS',
          subtitle: channel.group,
          url: channel.url,
          container: 'm3u8',
          default: true
        }
      ]
    }
  ];
}

function resolvePlayback(ctx) {
  const itemId = ctx && (ctx.itemId || ctx.id);
  const channel = channelFromId(itemId);
  return {
    url: (ctx && ctx.url) || channel.url,
    container: 'm3u8',
    isLive: true,
    streamKind: 'live',
    headers: {}
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getManifest, getHome, getCategory, getDetail, getResourceVersions, resolvePlayback, search };
}
