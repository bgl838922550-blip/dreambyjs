// @name 哔哩哔哩

const BILIBILI_API = 'https://api.bilibili.com';
const BILIBILI_SITE = 'https://www.bilibili.com/';
const BILIBILI_ICON = 'https://www.bilibili.com/favicon.ico';
const BILIBILI_PASSPORT = 'https://passport.bilibili.com';
const BILIBILI_TV_APP_KEY = '5ae412b53418aac5';
const BILIBILI_TV_APP_SECRET = '5b9cf6c9786efd204dcf0c1ce2d08436';
const BILIBILI_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const BILIBILI_TOKEN_REFRESH_LEEWAY_MS = 24 * 60 * 60 * 1000;
const BILIBILI_MIXIN_TABLE = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
  33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
  61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
  36, 20, 34, 44, 52
];

const WidgetMetadata = {
  id: 'bilibili-mini-library',
  name: '哔哩哔哩',
  title: '哔哩哔哩',
  version: '1.6.5',
  author: 'baiPlay',
  site: BILIBILI_SITE,
  logo: BILIBILI_ICON,
  icon: BILIBILI_ICON,
  description: '使用 B 站 Web API 浏览热门、内容分区、追番追剧、关注动态、收藏夹和历史记录，支持 UGC 与 PGC 详情、选集、搜索、账号清晰度播放和 TMDB 正式 PGC 资源匹配。'
};

const QUALITY_NAMES = {
  127: '8K 超高清',
  126: '杜比视界',
  125: 'HDR 真彩',
  120: '4K 超清',
  116: '1080P 60帧',
  112: '1080P 高码率',
  80: '1080P 高清',
  74: '720P 60帧',
  64: '720P 高清',
  32: '480P 清晰',
  16: '360P 流畅'
};

const HOME_SECTIONS = {
  'bili-home-popular': {
    title: '全站热门',
    style: 'discover.spotlight',
    pageId: 'popular',
    promotesToHero: true,
    login: false
  },
  'bili-home-following': {
    title: '关注动态',
    style: 'discover.standard',
    pageId: 'following',
    login: true
  },
  'bili-home-favorites': {
    title: '我的收藏夹',
    style: 'discover.annualWidePreview',
    pageId: 'favorites',
    login: true
  },
  'bili-home-watchlater': {
    title: '稍后再看',
    style: 'discover.posterCompact',
    pageId: 'watchlater',
    login: true
  },
  'bili-home-history': {
    title: '观看历史',
    style: 'discover.standard',
    pageId: 'history',
    login: true
  },
  'bili-home-creators': {
    title: '关注的 UP 主',
    style: 'discover.annualListPreview',
    pageId: 'creators',
    login: true
  },
  'bili-home-ranking': {
    title: '全站排行榜',
    style: 'discover.ranked',
    pageId: 'ranking',
    login: false
  },
  'bili-home-follow-bangumi': {
    title: '我的追番',
    style: 'discover.posterCompact',
    pageId: 'pgc-follow:1',
    login: true
  }
};

const PGC_CATEGORIES = {
  1: { title: '番剧', subtitle: '追新番与经典动画' },
  2: { title: '电影', subtitle: '电影与院线作品' },
  3: { title: '纪录片', subtitle: '人文、自然与社会纪录' },
  4: { title: '国创', subtitle: '国产动画与原创作品' },
  5: { title: '电视剧', subtitle: '国内外电视剧集' },
  7: { title: '综艺', subtitle: '综艺与娱乐节目' }
};

const REGION_CATEGORIES = {
  1: { title: '动画', subtitle: '动画短片、MAD 与手书', rankId: 1005 },
  119: { title: '鬼畜', subtitle: '鬼畜调教与人力 VOCALOID', rankId: 1007 },
  129: { title: '舞蹈', subtitle: '宅舞、街舞与舞蹈综合', rankId: 1004 },
  5: { title: '娱乐', subtitle: '娱乐杂谈与明星综艺', rankId: 1002 },
  188: { title: '科技数码', subtitle: '数码、科学与计算机技术', rankId: 1012 },
  211: { title: '美食', subtitle: '美食制作与探店记录', rankId: 1020 },
  223: { title: '汽车', subtitle: '汽车生活、评测与赛事', rankId: 1013 },
  234: { title: '体育运动', subtitle: '竞技体育与日常运动', rankId: 1018 },
  4: { title: '游戏', subtitle: '单机、网游与电竞', rankId: 1008 },
  3: { title: '音乐', subtitle: '音乐现场、演奏与翻唱', rankId: 1003 },
  181: { title: '影视', subtitle: '影视剪辑与影评杂谈', rankId: 1001 },
  36: { title: '知识', subtitle: '科普、社科与职业知识', rankId: 1010 },
  202: { title: '资讯', subtitle: '社会与综合资讯' },
  85: { title: '小剧场', subtitle: '剧情短片与小剧场', rankId: 1001 },
  155: { title: '时尚美妆', subtitle: '美妆、穿搭与时尚', rankId: 1014 },
  160: { title: '生活', subtitle: '日常、家居与出行' },
  217: { title: '动物圈', subtitle: '萌宠与动物纪录', rankId: 1024 }
};

const PRIMARY_CONTENT_ENTRIES = [
  'pgc:1', 'pgc:4', 'pgc:7', 'region:1', 'region:119', 'region:129', 'region:5',
  'region:188', 'region:211', 'region:223', 'region:234', 'pgc:2', 'pgc:5', 'pgc:3',
  'region:4', 'region:3', 'region:181', 'region:36', 'region:202', 'region:85',
  'region:155', 'more-regions'
];

const ENTRY_HOME_SECTIONS = {
  'bili-content-entry': {
    title: '内容分区',
    subtitle: '热门、动态与 B 站内容分区',
    style: 'discover.annualListPreview',
    pageId: 'content-groups'
  },
  'bili-account-entry': {
    title: '我的 B 站',
    subtitle: '追番追剧、收藏与记录',
    style: 'discover.annualListPreview',
    pageId: 'account-groups'
  }
};

let cachedProfile = null;
let cachedWbiKeys = null;
let activeSessionRefresh = null;

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
      resourceVersions: true,
      playback: true,
      playbackHistory: true,
      resourceMatching: true,
      resourceMatch: {
        enabled: true,
        parameters: ['tmdbId', 'imdbId', 'tvdbId', 'title', 'year', 'mediaType', 'seasonNumber', 'episodeNumber', 'episodeTitle']
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true
    },
    authentication: {
      type: 'qrCode',
      title: '扫码登录 B 站',
      description: '请使用哔哩哔哩手机客户端扫码并确认登录。',
      parameterNames: ['Cookie', 'AccessToken', 'RefreshToken', 'TokenExpiresAt'],
      startFunction: 'startAuthentication',
      pollFunction: 'pollAuthentication',
      logoutFunction: 'logoutAuthentication',
      pollIntervalSeconds: 4
    },
    parameters: [
      {
        name: 'Cookie',
        title: 'B 站 Cookie',
        type: 'password',
        value: '',
        required: true,
        description: '推荐使用上方扫码登录自动填写。也可以在浏览器登录 bilibili.com 后手工粘贴完整 Cookie；至少应包含 SESSDATA。'
      },
      {
        name: 'AccessToken',
        title: 'B 站访问令牌',
        type: 'hidden',
        value: '',
        required: false
      },
      {
        name: 'RefreshToken',
        title: 'B 站刷新令牌',
        type: 'hidden',
        value: '',
        required: false
      },
      {
        name: 'TokenExpiresAt',
        title: 'B 站令牌到期时间',
        type: 'hidden',
        value: '',
        required: false
      },
      {
        name: 'maxQuality',
        title: '最高请求清晰度',
        type: 'select',
        value: '127',
        required: false,
        options: [
          { title: '自动最高（含 8K）', value: '127' },
          { title: '4K', value: '120' },
          { title: '1080P 60帧', value: '116' },
          { title: '1080P 高码率', value: '112' },
          { title: '1080P', value: '80' },
          { title: '720P', value: '64' },
          { title: '480P', value: '32' },
          { title: '360P', value: '16' }
        ],
        description: '实际可用清晰度由账号权限和视频资源决定。登录大会员后可读取 DASH 中的 4K、1080P 高码率、1080P60、HDR 等专属轨道。'
      }
    ]
  };
}

async function startAuthentication() {
  const root = await postPassportForm(
    '/x/passport-tv-login/qrcode/auth_code',
    signTVLoginParameters({})
  );
  if (numberValue(root && root.code, -1) !== 0) {
    throw new Error('B 站二维码申请失败：' + cleanText(root && (root.message || root.msg || root.code)));
  }
  const data = root && root.data || {};
  const authCode = stringValue(data.auth_code || data.authCode);
  const qrURL = stringValue(data.url);
  if (!authCode || !qrURL) throw new Error('B 站二维码接口没有返回有效登录凭据');
  return {
    qrContent: qrURL,
    token: authCode,
    message: '请使用哔哩哔哩手机客户端扫码',
    expiresInSeconds: 180,
    pollIntervalSeconds: 4
  };
}

async function pollAuthentication(ctx) {
  ctx = ctx || {};
  const authCode = stringValue(ctx.token || ctx.pollToken || ctx.sessionId || ctx.auth_code).trim();
  if (!authCode) return { status: 'failed', message: '缺少二维码轮询凭据', parameterUpdates: {} };

  const root = await postPassportForm(
    '/x/passport-tv-login/qrcode/poll',
    signTVLoginParameters({ auth_code: authCode })
  );
  const code = numberValue(root && root.code, -1);
  if (code === 86039) return { status: 'pending', message: '等待扫码确认', parameterUpdates: {} };
  if (code === 86038) return { status: 'expired', message: '二维码已失效，请重新生成', parameterUpdates: {} };
  if (code !== 0) {
    return {
      status: 'failed',
      message: 'B 站登录失败：' + cleanText(root && (root.message || root.msg || code)),
      parameterUpdates: {}
    };
  }

  const data = root && root.data || {};
  const updates = sessionParameterUpdates(data);
  if (stringValue(updates.Cookie).indexOf('SESSDATA=') < 0) {
    return { status: 'failed', message: '登录结果缺少 SESSDATA，请重新扫码', parameterUpdates: {} };
  }
  return {
    status: 'success',
    message: '登录成功',
    parameterUpdates: updates
  };
}

function logoutAuthentication() {
  cachedProfile = null;
  cachedWbiKeys = null;
  activeSessionRefresh = null;
  return { status: 'success' };
}

function getHome() {
  const entrySections = Object.keys(ENTRY_HOME_SECTIONS).map(function (id) {
    const definition = ENTRY_HOME_SECTIONS[id];
    return {
      id,
      title: definition.title,
      subtitle: definition.subtitle,
      style: definition.style,
      lazy: true,
      loadAction: { type: 'custom', id, sectionId: id, title: definition.title },
      moreAction: categoryAction(definition.pageId, definition.title),
      items: entryGroupItems(definition.pageId)
    };
  });
  const sectionEntries = Object.keys(HOME_SECTIONS).map(function (id) {
    const definition = HOME_SECTIONS[id];
    return {
      id,
      title: definition.title,
      style: definition.style,
      subtitle: definition.login ? '登录后加载' : 'B 站公开内容',
      lazy: true,
      promotesToHero: !!definition.promotesToHero,
      loadAction: { type: 'custom', id, sectionId: id, title: definition.title },
      moreAction: categoryAction(definition.pageId, definition.title),
      items: []
    };
  });

  return {
    pageType: 'home',
    id: 'bilibili-home',
    title: WidgetMetadata.title,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon,
    heroAspectRatio: '16:9',
    hero: [],
    sections: entrySections.concat(sectionEntries)
  };
}

async function getHomeSection(ctx) {
  ctx = ctx || {};
  const sectionId = stringValue(ctx.sectionId || ctx.id || ctx.pageId);
  const entryDefinition = ENTRY_HOME_SECTIONS[sectionId];
  if (entryDefinition) {
    try {
      const config = readConfig(ctx);
      const style = stringValue(ctx.style) || entryDefinition.style;
      const items = await enrichEntryItems(entryGroupItems(entryDefinition.pageId), config, style);
      return {
        id: sectionId,
        title: entryDefinition.title,
        subtitle: entryDefinition.subtitle,
        style,
        lazy: false,
        moreAction: categoryAction(entryDefinition.pageId, entryDefinition.title),
        items
      };
    } catch (error) {
      return emptySection(sectionId, entryDefinition.title, ctx.style || entryDefinition.style, humanError(error));
    }
  }
  const definition = HOME_SECTIONS[sectionId];
  if (!definition) {
    return emptySection(sectionId || 'bili-home-unknown', ctx.title || '哔哩哔哩', ctx.style || 'discover.standard', '未知首页模块');
  }

  try {
    const config = readConfig(ctx);
    if (definition.login) requireCookie(config);
    let items = [];
    const style = stringValue(ctx.style) || definition.style;
    if (definition.pageId === 'popular') items = await fetchPopular(1, 20, config);
    else if (definition.pageId === 'following') items = await fetchFollowingPage(1, config);
    else if (definition.pageId === 'favorites') items = await fetchFavoriteFolders(config, 12);
    else if (definition.pageId === 'watchlater') items = await fetchWatchLater(config);
    else if (definition.pageId === 'history') items = await fetchHistoryPage(1, config);
    else if (definition.pageId === 'creators') items = await fetchCreators(1, 12, config);
    else if (definition.pageId === 'ranking') items = await fetchRanking(config);
    else if (definition.pageId === 'pgc-follow:1') items = (await fetchPGCFollows(1, 1, 20, config)).items;

    if (definition.pageId === 'favorites' || definition.pageId === 'creators') {
      items = await enrichEntryItems(items, config, style);
    }

    return {
      id: sectionId,
      title: definition.title,
      style,
      subtitle: items.length ? '' : '暂无内容',
      lazy: false,
      promotesToHero: !!definition.promotesToHero,
      moreAction: categoryAction(definition.pageId, definition.title),
      items
    };
  } catch (error) {
    return emptySection(sectionId, definition.title, ctx.style || definition.style, humanError(error));
  }
}

async function getCategory(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const pageId = stringValue(ctx.pageId || ctx.id || 'popular');
  const page = Math.max(1, numberValue(ctx.page, 1));
  const title = stringValue(ctx.title) || categoryTitle(pageId);

  try {
    if (pageId === 'content-groups' || pageId === 'account-groups') {
      const style = stringValue(ctx.style) || 'discover.annualListPreview';
      const items = await enrichEntryItems(entryGroupItems(pageId), config, style);
      return categoryPage(pageId, title, 1, items, false, style, '16:9');
    }
    if (pageId === 'more-regions') {
      const style = stringValue(ctx.style) || 'discover.annualListPreview';
      const items = await enrichEntryItems([contentEntry('region:160'), contentEntry('region:217')], config, style);
      return categoryPage(pageId, title || '更多分区', 1, items, false, style, '16:9');
    }
    if (pageId.indexOf('pgc:') === 0) {
      const seasonType = numberValue(pageId.slice('pgc:'.length), 1);
      const result = await fetchPGCIndex(seasonType, page, 30, config);
      return categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid', '3:4');
    }
    if (pageId.indexOf('pgc-follow:') === 0) {
      requireCookie(config);
      const followType = numberValue(pageId.slice('pgc-follow:'.length), 1) === 2 ? 2 : 1;
      const result = await fetchPGCFollows(followType, page, 30, config);
      return categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid', '3:4');
    }
    if (pageId.indexOf('region:') === 0) {
      const regionId = numberValue(pageId.slice('region:'.length), 0);
      const result = await fetchRegionPage(regionId, page, 30, config);
      return categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid', '16:9');
    }
    if (pageId === 'popular') {
      const items = await fetchPopular(page, 30, config);
      return categoryPage(pageId, title, page, items, items.length >= 30, 'media.posterGrid');
    }
    if (pageId === 'ranking') {
      const items = await fetchRanking(config);
      return categoryPage(pageId, title, 1, items, false, 'discover.ranked');
    }
    if (pageId === 'following') {
      requireCookie(config);
      const result = await fetchFollowingPage(page, config, true);
      return categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid');
    }
    if (pageId === 'favorites') {
      requireCookie(config);
      const style = stringValue(ctx.style) || 'discover.annualWidePreview';
      const items = await enrichEntryItems(await fetchFavoriteFolders(config, 100), config, style);
      return categoryPage(pageId, title, 1, items, false, style);
    }
    if (pageId.indexOf('favorite:') === 0) {
      requireCookie(config);
      const folderId = pageId.slice('favorite:'.length);
      const sortValue = normalizeFavoriteSort(ctx.sortBy || ctx.sort_by || ctx.selectedSortValue || 'mtime');
      const result = await fetchFavoriteItems(folderId, page, 30, sortValue, config);
      const resultPage = categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid');
      resultPage.selectedSortValue = sortValue;
      resultPage.sort = [
        { id: 'mtime', title: '最近收藏', value: 'mtime' },
        { id: 'pubtime', title: '最近投稿', value: 'pubtime' },
        { id: 'view', title: '最多播放', value: 'view' }
      ];
      return resultPage;
    }
    if (pageId === 'watchlater') {
      requireCookie(config);
      const all = await fetchWatchLater(config);
      return pagedLocalCategory(pageId, title, page, all, 30);
    }
    if (pageId === 'history') {
      requireCookie(config);
      const result = await fetchHistoryPage(page, config, true);
      return categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid');
    }
    if (pageId === 'creators') {
      requireCookie(config);
      const pageSize = 20;
      const style = stringValue(ctx.style) || 'discover.annualListPreview';
      const items = await enrichEntryItems(await fetchCreators(page, pageSize, config), config, style);
      return categoryPage(pageId, title, page, items, items.length >= pageSize, style);
    }
    if (pageId.indexOf('up:') === 0) {
      const mid = pageId.slice('up:'.length).split(':')[0];
      const order = normalizeCreatorSort(ctx.sortBy || ctx.sort_by || ctx.selectedSortValue || 'pubdate');
      const result = await fetchCreatorVideos(mid, page, 30, order, config);
      const resultPage = categoryPage(pageId, title, page, result.items, result.hasMore, 'media.posterGrid');
      resultPage.selectedSortValue = order;
      resultPage.sort = [
        { id: 'pubdate', title: '最近投稿', value: 'pubdate' },
        { id: 'click', title: '最多播放', value: 'click' },
        { id: 'stow', title: '最多收藏', value: 'stow' }
      ];
      return resultPage;
    }

    return categoryPage(pageId, title, page, [], false, 'media.posterGrid');
  } catch (error) {
    const isPGC = pageId.indexOf('pgc:') === 0 || pageId.indexOf('pgc-follow:') === 0;
    const failed = categoryPage(pageId, title, page, [], false, pageId === 'favorites' || pageId === 'creators' ? 'discover.annualWidePreview' : 'media.posterGrid', isPGC ? '3:4' : '16:9');
    failed.subtitle = humanError(error);
    return failed;
  }
}

async function search(ctx) {
  ctx = ctx || {};
  const keyword = cleanText(ctx.keyword || ctx.query || ctx.text);
  const page = Math.max(1, numberValue(ctx.page, 1));
  if (!keyword) {
    return { pageType: 'search', title: '搜索哔哩哔哩', keyword, page, hasMore: false, items: [] };
  }
  try {
    const config = readConfig(ctx);
    const searchResults = await Promise.all([
      requestWbiData('/x/web-interface/wbi/search/type', {
        search_type: 'video',
        keyword,
        order: 'totalrank',
        page,
        page_size: 20
      }, config, { origin: 'https://search.bilibili.com' }).then(searchSuccess).catch(searchFailure),
      requestWbiData('/x/web-interface/wbi/search/type', {
        search_type: 'media_bangumi',
        keyword,
        page,
        pagesize: 10
      }, config, { origin: 'https://search.bilibili.com' }).then(searchSuccess).catch(searchFailure),
      requestWbiData('/x/web-interface/wbi/search/type', {
        search_type: 'media_ft',
        keyword,
        page,
        pagesize: 10
      }, config, { origin: 'https://search.bilibili.com' }).then(searchSuccess).catch(searchFailure)
    ]);
    const successful = searchResults.filter(function (result) { return !!result.data; });
    if (!successful.length) throw searchResults[0].error || new Error('B 站搜索失败');
    const videoData = searchResults[0].data || {};
    const bangumiData = searchResults[1].data || {};
    const filmData = searchResults[2].data || {};
    const videoItems = arrayValue(videoData.result).map(function (item, index) {
      return videoItem(item, (page - 1) * 20 + index + 1, 'search');
    }).filter(validVideoItem);
    const pgcItems = arrayValue(bangumiData.result).concat(arrayValue(filmData.result)).map(function (item, index) {
      return pgcSearchItem(item, index + 1);
    }).filter(validPGCItem);
    const numPages = Math.max(
      numberValue(videoData.numPages, page),
      numberValue(bangumiData.numPages, page),
      numberValue(filmData.numPages, page)
    );
    return {
      pageType: 'search',
      id: 'bili-search:' + keyword,
      title: '搜索哔哩哔哩',
      keyword,
      page,
      hasMore: page < numPages,
      style: 'media.posterGrid',
      itemAspectRatio: '16:9',
      items: pgcItems.concat(videoItems)
    };
  } catch (error) {
    return {
      pageType: 'search',
      title: '搜索哔哩哔哩',
      keyword,
      page,
      hasMore: false,
      subtitle: humanError(error),
      items: []
    };
  }
}

async function matchResources(ctx) {
  ctx = ctx || {};
  const mediaType = normalizeMatchMediaType(ctx.mediaType || ctx.type);
  return matchPGCResources(ctx, mediaType);
}

async function matchMovie(ctx) {
  return matchPGCResources(Object.assign({}, ctx || {}, { mediaType: 'movie' }), 'movie');
}

async function matchEpisode(ctx) {
  return matchPGCResources(Object.assign({}, ctx || {}, { mediaType: 'tv' }), 'tv');
}

async function matchPGCResources(ctx, mediaType) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const titles = matchTitlesFromContext(ctx);
  const strongTitles = primaryMatchTitlesFromContext(ctx);
  if (!titles.length) return { results: [] };

  const targetSeason = mediaType === 'movie'
    ? 0
    : Math.max(1, numberValue(ctx.seasonNumber || ctx.season, 1));
  const targetEpisode = mediaType === 'movie'
    ? 0
    : Math.max(0, numberValue(ctx.episodeNumber || ctx.episode, 0));
  const targetYear = mediaType === 'movie'
    ? numberValue(ctx.year || ctx.releaseYear, 0)
    : numberValue(ctx.seasonYear || ctx.targetSeasonYear || ctx.year || ctx.releaseYear, 0);
  const targetRuntime = mediaType === 'movie'
    ? numberValue(ctx.runtimeMinutes || ctx.runtime || ctx.duration, 0)
    : numberValue(ctx.episodeRuntimeMinutes || ctx.runtimeMinutes || ctx.runtime || ctx.duration, 0);
  const searchTypes = mediaType === 'movie' ? ['media_ft'] : ['media_bangumi', 'media_ft'];
  const rawCandidates = await searchPGCCandidates(titles, searchTypes, config);
  const scoredCandidates = rawCandidates.map(function (raw) {
    return {
      raw,
      score: scorePGCSearchCandidate(
        raw,
        titles,
        strongTitles,
        mediaType,
        targetSeason,
        targetEpisode,
        targetYear
      )
    };
  }).filter(function (candidate) {
    return candidate.score >= 35;
  }).sort(function (left, right) {
    return right.score - left.score;
  });

  const verified = await mapWithConcurrency(scoredCandidates.slice(0, 10), 3, async function (candidate) {
    try {
      return await verifyPGCMatch(
        candidate.raw,
        candidate.score,
        ctx,
        mediaType,
        titles,
        strongTitles,
        targetSeason,
        targetEpisode,
        targetYear,
        targetRuntime,
        config
      );
    } catch (_) {
      return null;
    }
  });
  const seen = {};
  const results = verified.filter(function (result) {
    if (!result) return false;
    const key = stringValue(result.providerIds && result.providerIds.BilibiliSeasonID) || result.id;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  }).sort(function (left, right) {
    return numberValue(right.matchScore, 0) - numberValue(left.matchScore, 0);
  }).slice(0, 5);
  return { results };
}

async function searchPGCCandidates(titles, searchTypes, config) {
  const queries = arrayValue(titles).slice(0, 3);
  const candidates = [];
  const seen = {};
  for (let queryIndex = 0; queryIndex < queries.length; queryIndex += 1) {
    const keyword = cleanText(queries[queryIndex]);
    if (!keyword) continue;
    const responses = await Promise.all(searchTypes.map(function (searchType) {
      return requestWbiData('/x/web-interface/wbi/search/type', {
        search_type: searchType,
        keyword,
        page: 1,
        pagesize: 20,
        page_size: 20
      }, config, { origin: 'https://search.bilibili.com' }).catch(function () { return null; });
    }));
    responses.forEach(function (data) {
      arrayValue(data && data.result).forEach(function (raw) {
        const seasonId = pgcSeasonIdFromRaw(raw);
        if (!seasonId || seen[seasonId]) return;
        seen[seasonId] = true;
        candidates.push(raw);
      });
    });
    if (candidates.length >= 20) break;
  }
  return candidates;
}

async function verifyPGCMatch(raw, searchScore, ctx, mediaType, titles, strongTitles, targetSeason, targetEpisode, targetYear, targetRuntime, config) {
  const initialSeasonId = pgcSeasonIdFromRaw(raw);
  if (!initialSeasonId) return null;
  const initialInfo = await requestData('/pgc/view/web/season', { season_id: initialSeasonId }, config, {
    referer: pgcReferer('', initialSeasonId)
  });
  const options = [{ seasonId: initialSeasonId, info: initialInfo }];
  if (mediaType !== 'movie' && targetSeason > 1) {
    const related = arrayValue(initialInfo && initialInfo.seasons);
    const relatedSeason = related.filter(function (season) {
      return pgcSeasonNumberFromText(season && (season.title || season.season_title || season.name)) === targetSeason;
    })[0];
    if (relatedSeason) {
      const relatedSeasonId = pgcSeasonIdFromRaw(relatedSeason);
      if (relatedSeasonId && relatedSeasonId !== initialSeasonId) {
        try {
          const relatedInfo = await requestData('/pgc/view/web/season', { season_id: relatedSeasonId }, config, {
            referer: pgcReferer('', relatedSeasonId)
          });
          options.unshift({ seasonId: relatedSeasonId, info: relatedInfo });
        } catch (_) {}
      }
    }
  }

  for (let optionIndex = 0; optionIndex < options.length; optionIndex += 1) {
    const option = options[optionIndex];
    const info = option.info || {};
    const seasonId = stringValue(info.season_id || option.seasonId);
    const seasonType = numberValue(info.show_season_type || info.season_type || info.type, numberValue(raw.season_type, 0));
    if (!isAllowedPGCMatchType(seasonType, mediaType)) continue;
    const infoTitles = pgcTitleValues(info);
    const infoTitleScore = titleSimilarity(titles, infoTitles);
    if (infoTitleScore < 42) continue;
    if (titleSimilarity(strongTitles, infoTitles) < 74) continue;
    const explicitSeason = pgcSeasonNumberFromText(infoTitles.join(' '));
    if (mediaType !== 'movie' && explicitSeason && explicitSeason !== targetSeason) continue;
    if (mediaType === 'movie' && explicitSeason) continue;
    if (mediaType !== 'movie' && hasConflictingPGCEpisodeNumber(infoTitles, targetEpisode)) continue;

    const episodes = arrayValue(info.episodes).filter(function (episode) {
      return stringValue(episode && (episode.id || episode.ep_id)) && stringValue(episode && episode.cid);
    });
    const selectedEpisode = selectPGCMatchEpisode(episodes, targetEpisode, ctx.episodeTitle || ctx.episodeName);
    if (!selectedEpisode) continue;
    const episodeID = stringValue(selectedEpisode.id || selectedEpisode.ep_id);
    const resourceTitle = pgcMatchedResourceTitle(info.title, selectedEpisode);
    const groupsResult = await getPGCResourceVersions(
      { itemId: pgcSeasonItemId(seasonId), episodeId: episodeID, title: resourceTitle },
      { seasonId, episodeId: episodeID },
      config,
      { kind: 'pgc', seasonId, epId: episodeID, cid: stringValue(selectedEpisode.cid), bvid: bvidFrom(selectedEpisode.bvid), title: resourceTitle }
    );
    const groups = arrayValue(groupsResult && groupsResult.groups ? groupsResult.groups : groupsResult);
    if (!groups.some(function (group) { return arrayValue(group && group.versions).length > 0; })) continue;

    const result = pgcMatchItem(info, raw, seasonId, seasonType, selectedEpisode, groups, searchScore + infoTitleScore, targetSeason);
    if (targetYear > 0) result.matchScore += yearMatchScore(pgcYearFromInfo(info), targetYear);
    if (targetRuntime > 0) result.matchScore += runtimeMatchScore(selectedEpisode, targetRuntime);
    return result;
  }
  return null;
}

function pgcMatchItem(info, raw, seasonId, seasonType, episode, groups, matchScore, targetSeason) {
  const item = pgcItem(Object.assign({}, raw || {}, info || {}, {
    season_id: seasonId,
    season_type: seasonType,
    title: cleanText(info && info.title) || cleanText(raw && raw.title),
    cover: info && (info.cover || info.square_cover) || raw && (raw.cover || raw.square_cover),
    ss_horizontal_cover: info && (info.bkg_cover || info.ss_horizontal_cover) || raw && raw.ss_horizontal_cover
  }), 0, seasonType, 'match');
  const itemID = matchedPGCSeasonItemId(seasonId, targetSeason || 1);
  const episodeID = stringValue(episode && (episode.id || episode.ep_id));
  item.id = itemID;
  item.action = { type: 'detail', itemId: itemID };
  item.resourceGroups = groups;
  item.matchScore = matchScore;
  item.year = pgcYearFromInfo(info) || item.year;
  item.providerIds = Object.assign({}, item.providerIds || {}, {
    BilibiliSeasonID: seasonId,
    BilibiliEpisodeID: episodeID,
    BilibiliMediaID: stringValue(info && info.media_id),
    BilibiliSeasonType: String(seasonType),
    BilibiliMatchedSeason: String(targetSeason || 1)
  });
  return item;
}

function normalizeMatchMediaType(value) {
  const text = stringValue(value).toLowerCase();
  return text === 'movie' || text === 'film' ? 'movie' : 'tv';
}

function matchTitlesFromContext(ctx) {
  ctx = ctx || {};
  const values = [];
  function add(value) {
    arrayValue(value).forEach(add);
    if (!Array.isArray(value)) values.push(value);
  }
  add(ctx.searchTitles || ctx.titles);
  add(ctx.title || ctx.name);
  add(ctx.originalTitle || ctx.originalName);
  add(ctx.alternativeTitles || ctx.aliases);
  return uniqueStrings(values).slice(0, 8);
}

function primaryMatchTitlesFromContext(ctx) {
  ctx = ctx || {};
  const values = [ctx.title, ctx.name, ctx.originalTitle, ctx.originalName];
  if (!uniqueStrings(values).length) {
    values.push.apply(values, arrayValue(ctx.searchTitles || ctx.titles).slice(0, 2));
  }
  return uniqueStrings(values).slice(0, 4);
}

function scorePGCSearchCandidate(raw, titles, strongTitles, mediaType, targetSeason, targetEpisode, targetYear) {
  const seasonType = numberValue(raw && (raw.season_type || raw.seasonType), 0);
  if (seasonType && !isAllowedPGCMatchType(seasonType, mediaType)) return -100;
  const candidateTitles = pgcTitleValues(raw);
  const score = titleSimilarity(titles, candidateTitles);
  if (score < 35) return score;
  if (titleSimilarity(strongTitles, candidateTitles) < 74) return -100;
  const explicitSeason = pgcSeasonNumberFromText(candidateTitles.join(' '));
  if (mediaType !== 'movie' && explicitSeason && explicitSeason !== targetSeason) return -100;
  if (mediaType !== 'movie' && hasConflictingPGCEpisodeNumber(candidateTitles, targetEpisode)) return -100;
  if (mediaType === 'movie' && explicitSeason) return score - 20;
  const year = pgcYearFromRaw(raw);
  return score + yearMatchScore(year, targetYear);
}

function isAllowedPGCMatchType(seasonType, mediaType) {
  if (mediaType === 'movie') return seasonType === 2;
  return [1, 3, 4, 5, 7].indexOf(seasonType) >= 0;
}

function pgcSeasonIdFromRaw(raw) {
  return stringValue(raw && (raw.season_id || raw.pgc_season_id || raw.seasonId));
}

function pgcTitleValues(raw) {
  raw = raw || {};
  const values = [raw.title, raw.season_title, raw.seasonTitle, raw.name, raw.jp_title, raw.jpTitle, raw.alias, raw.season_alias];
  if (raw.publish) values.push(raw.publish.title, raw.publish.alias);
  return uniqueStrings(values);
}

function pgcYearFromRaw(raw) {
  raw = raw || {};
  return yearFromTimestamp(raw.pubtime || raw.pub_time || raw.pubdate) || yearFromDateText(raw.pub_time_show || raw.pubTimeShow);
}

function pgcYearFromInfo(info) {
  info = info || {};
  const publish = info.publish || {};
  return yearFromDateText(publish.pub_time || publish.pub_time_show || info.pub_time) ||
    yearFromTimestamp(info.pubtime || info.pubdate);
}

function yearMatchScore(actual, target) {
  actual = numberValue(actual, 0);
  target = numberValue(target, 0);
  if (!actual || !target) return 0;
  const difference = Math.abs(actual - target);
  if (difference === 0) return 14;
  if (difference === 1) return 7;
  return -Math.min(18, difference * 4);
}

function runtimeMatchScore(episode, targetRuntime) {
  const actual = pgcDurationSeconds(episode && episode.duration) / 60;
  if (!actual || !targetRuntime) return 0;
  const difference = Math.abs(actual - targetRuntime);
  if (difference <= 3) return 8;
  if (difference <= 10) return 3;
  return -Math.min(12, Math.round(difference / 5));
}

function selectPGCMatchEpisode(episodes, episodeNumber, episodeTitle) {
  episodes = arrayValue(episodes);
  if (!episodes.length) return null;
  const requestedNumber = numberValue(episodeNumber, 0);
  if (requestedNumber > 0) {
    const numbered = episodes.filter(function (episode) {
      return pgcEpisodeNumberFromRaw(episode) === requestedNumber;
    })[0];
    if (numbered) return numbered;
    const hasNumberedEpisodes = episodes.some(function (episode) {
      return pgcEpisodeNumberFromRaw(episode) > 0;
    });
    if (hasNumberedEpisodes) return null;
    const byIndex = episodes[requestedNumber - 1];
    if (byIndex) return byIndex;
  }
  const requestedTitle = cleanText(episodeTitle);
  if (requestedTitle) {
    const titled = episodes.slice().sort(function (left, right) {
      return titleSimilarity([requestedTitle], pgcTitleValues(right)) - titleSimilarity([requestedTitle], pgcTitleValues(left));
    })[0];
    if (titled && titleSimilarity([requestedTitle], pgcTitleValues(titled)) >= 55) return titled;
  }
  return episodes[0];
}

function pgcEpisodeNumberFromRaw(episode) {
  const values = [episode && episode.title, episode && episode.index, episode && episode.index_title, episode && episode.long_title];
  for (let index = 0; index < values.length; index += 1) {
    const text = cleanText(values[index]);
    const match = text.match(/(?:第\s*)?(\d{1,4})(?:\s*集|\s*话)?$/);
    if (match) return numberValue(match[1], 0);
  }
  return 0;
}

function hasConflictingPGCEpisodeNumber(values, targetEpisode) {
  const requested = numberValue(targetEpisode, 0);
  if (!(requested > 0)) return false;
  const explicitEpisodes = [];
  arrayValue(values).forEach(function (value) {
    pgcEpisodeNumbersFromText(value).forEach(function (number) {
      if (explicitEpisodes.indexOf(number) < 0) explicitEpisodes.push(number);
    });
  });
  return explicitEpisodes.length > 0 && explicitEpisodes.indexOf(requested) < 0;
}

function pgcEpisodeNumbersFromText(value) {
  const text = cleanText(value);
  const numbers = [];
  const expressions = [
    /s\s*0*[0-9]{1,3}\s*e\s*0*([0-9]{1,4})/gi,
    /第\s*([0-9一二三四五六七八九十]+)\s*[集话]/g,
    /(?:^|[^a-z0-9])ep(?:isode)?\s*0*([0-9]{1,4})(?=[^0-9]|$)/gi
  ];
  expressions.forEach(function (expression) {
    let match;
    while ((match = expression.exec(text)) !== null) {
      const number = numberValue(match[1], chineseSeasonNumber(match[1]));
      if (number > 0 && numbers.indexOf(number) < 0) numbers.push(number);
    }
  });
  return numbers;
}

function pgcMatchedResourceTitle(seriesTitle, episode) {
  const title = cleanText(seriesTitle);
  const episodeTitle = cleanText(
    episode && (episode.long_title || episode.index_title || episode.share_copy || episode.title)
  );
  if (!episodeTitle || matchTitleKey(title).indexOf(matchTitleKey(episodeTitle)) >= 0) return title;
  return uniqueStrings([title, episodeTitle]).join(' · ');
}

function titleSimilarity(targets, candidates) {
  const left = arrayValue(targets).map(matchTitleKey).filter(Boolean);
  const right = arrayValue(candidates).map(matchTitleKey).filter(Boolean);
  let best = 0;
  left.forEach(function (target) {
    right.forEach(function (candidate) {
      if (target === candidate) best = Math.max(best, 100);
      else if (matchTitleBase(target) === matchTitleBase(candidate)) best = Math.max(best, 96);
      else if (target.length >= 4 && candidate.indexOf(target) >= 0) best = Math.max(best, 78);
      else if (candidate.length >= 4 && target.indexOf(candidate) >= 0) best = Math.max(best, 74);
      else best = Math.max(best, characterSimilarity(target, candidate));
    });
  });
  return best;
}

function matchTitleKey(value) {
  return cleanText(value).toLowerCase().replace(/[\s\u3000'"“”‘’·,，。.!！?？:：;；、|\/\\_+～~\-]/g, '');
}

function matchTitleBase(value) {
  return stringValue(value).replace(/(?:第[一二三四五六七八九十百千万0-9]+季|season\s*[0-9]+|\bs[0-9]+\b)/gi, '');
}

function characterSimilarity(left, right) {
  if (!left || !right) return 0;
  const shorter = left.length < right.length ? left : right;
  if (shorter.length < 4) return 0;
  let common = 0;
  for (let index = 0; index < shorter.length; index += 1) {
    if (left.indexOf(shorter[index]) >= 0 && right.indexOf(shorter[index]) >= 0) common += 1;
  }
  return Math.min(68, Math.round(common / Math.max(left.length, right.length) * 100));
}

function pgcSeasonNumberFromText(value) {
  const text = cleanText(value);
  const match = text.match(/(?:第\s*([0-9一二三四五六七八九十百千万]+)\s*季|\bS(?:eason)?\s*([0-9]+)\b)/i);
  if (!match) return 0;
  return numberValue(match[1], chineseSeasonNumber(match[1])) || numberValue(match[2], 0);
}

function chineseSeasonNumber(value) {
  const text = stringValue(value);
  const map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  if (map[text]) return map[text];
  if (text.indexOf('十') >= 0) {
    const parts = text.split('十');
    return (parts[0] ? map[parts[0]] * 10 : 10) + (parts[1] ? map[parts[1]] : 0);
  }
  return 0;
}

async function getDetail(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const pgcReference = pgcReferenceFrom(ctx.itemId || ctx.id || ctx.url || ctx.href);
  if (pgcReference) return getPGCDetail(ctx, pgcReference, config);
  const bvid = bvidFrom(ctx.itemId || ctx.id || ctx.url || ctx.href);
  if (!bvid) throw new Error('缺少 B 站 BV 号');

  const viewData = await requestData('/x/web-interface/view', { bvid }, config, { referer: videoReferer(bvid) });
  if (!viewData || !viewData.bvid) throw new Error('B 站没有返回视频详情');
  const redirectedPGCReference = pgcReferenceFrom(viewData.redirect_url);
  if (redirectedPGCReference) {
    return getPGCDetail(ctx, redirectedPGCReference, config);
  }
  const firstCID = stringValue((arrayValue(viewData.pages)[0] || {}).cid || viewData.cid);
  const relatedPromise = requestData('/x/web-interface/archive/related', { bvid }, config, { referer: videoReferer(bvid) }).catch(function () { return []; });
  const tagsPromise = requestData('/x/tag/archive/tags', { bvid }, config, { referer: videoReferer(bvid) }).catch(function () { return []; });
  const resourcesPromise = getResourceVersions(Object.assign({}, ctx, { itemId: bvid, episodeId: firstCID, title: viewData.title }));
  const results = await Promise.all([relatedPromise, tagsPromise, resourcesPromise]);
  const related = arrayValue(results[0]);
  const tags = arrayValue(results[1]);
  const resourceResult = results[2] || {};
  const resourceGroups = arrayValue(resourceResult.groups ? resourceResult.groups : resourceResult);
  const pages = arrayValue(viewData.pages);
  const owner = viewData.owner || {};
  const stat = viewData.stat || {};
  const poster = imageURL(viewData.pic);
  const dimension = viewData.dimension || {};
  const multiPart = pages.length > 1;
  const playbackProgress = enrichUGCPlaybackProgress(
    resourceResult.playbackProgress,
    bvid,
    pages,
    numberValue(viewData.duration, 0)
  );
  const detail = {
    pageType: 'detail',
    id: bvid,
    type: multiPart ? 'series' : 'movie',
    title: cleanText(viewData.title) || bvid,
    originalTitle: cleanText(viewData.title) || bvid,
    year: yearFromTimestamp(viewData.pubdate),
    poster,
    backdrop: poster,
    detailImageAspectRatio: aspectRatioFromDimension(dimension),
    prefersPosterAsDetailBackdropOnPhone: true,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    overview: cleanText(viewData.desc) || '该视频暂无简介。',
    runtimeMinutes: Math.max(1, Math.round(numberValue(viewData.duration, 0) / 60)),
    viewCountText: formatCount(stat.view),
    favoriteCountText: formatCount(stat.favorite),
    genres: uniqueStrings([cleanText(viewData.tname)].concat(tags.map(function (tag) { return cleanText(tag.tag_name); }))).slice(0, 12),
    remarks: cleanText(viewData.tname),
    providerIds: {
      BVID: bvid,
      AID: stringValue(viewData.aid),
      BilibiliCID: firstCID,
      MiniLibraryPlaybackTitle: cleanText(viewData.title) || bvid
    },
    cast: owner.name ? [{
      name: cleanText(owner.name),
      role: 'UP 主',
      avatar: imageURL(owner.face),
      avatarHeaders: imageHeaders(),
      action: {
        type: 'category',
        pageId: 'up:' + stringValue(owner.mid),
        title: cleanText(owner.name),
        itemAspectRatio: '16:9'
      }
    }] : [],
    playbackProgress,
    playbackProgressAuthoritative: true,
    resourceGroups,
    recommendations: [{
      id: 'bili-related:' + bvid,
      title: '相关推荐',
      style: 'discover.standard',
      items: related.slice(0, 20).map(function (item, index) { return videoItem(item, index + 1, 'related'); }).filter(validVideoItem)
    }]
  };

  if (multiPart) {
    detail.seasons = [{
      id: 'parts:' + bvid,
      title: '视频分 P',
      seasonNumber: 1,
      episodes: pages.map(function (page, index) {
        const cid = stringValue(page.cid);
        return {
          id: cid,
          title: cleanText(page.part) || ('P' + (index + 1)),
          episodeNumber: numberValue(page.page, index + 1),
          runtimeMinutes: Math.max(1, Math.round(numberValue(page.duration, 0) / 60)),
          poster,
          still: poster,
          imageHeaders: imageHeaders(),
          action: {
            type: 'play',
            itemId: bvid,
            seasonId: 'parts:' + bvid,
            episodeId: cid,
            title: cleanText(page.part) || ('P' + (index + 1))
          }
        };
      })
    }];
  }
  return detail;
}

async function getResourceVersions(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const payload = decodePlayPayload(ctx.url || ctx.playUrl || ctx.href || '');
  const pgcReference = payload.kind === 'pgc'
    ? { seasonId: stringValue(payload.seasonId), episodeId: stringValue(payload.epId) }
    : pgcReferenceFrom(ctx.itemId || ctx.id || ctx.url || ctx.href || ctx.episodeId);
  if (pgcReference) return getPGCResourceVersions(ctx, pgcReference, config, payload);
  const bvid = bvidFrom(ctx.itemId || ctx.id || ctx.url || ctx.href);
  if (!bvid) return { itemId: '', groups: [] };
  let cid = stringValue(ctx.episodeId || ctx.cid);
  if (!cid) {
    const viewData = await requestData('/x/web-interface/view', { bvid }, config, { referer: videoReferer(bvid) });
    cid = stringValue(((arrayValue(viewData.pages)[0] || {}).cid) || viewData.cid);
  }
  if (!cid) throw new Error('无法确定视频 CID');

  const maxQuality = normalizeQuality(config.maxQuality);
  const playInfo = await requestPlayInfo(bvid, cid, maxQuality, config);
  const qualities = availableQualities(playInfo, maxQuality);
  const title = cleanText(ctx.title) || bvid;
  const versions = qualities.map(function (quality, index) {
    const payload = encodePlayPayload({ bvid, cid, qn: quality, title });
    return {
      id: 'qn:' + quality,
      name: qualityName(quality),
      subtitle: qualitySubtitle(quality, playInfo),
      container: 'm3u8',
      default: index === 0,
      headers: playbackHeaders(bvid, config),
      action: {
        type: 'play',
        itemId: bvid,
        episodeId: cid,
        versionId: 'qn:' + quality,
        url: payload,
        title
      }
    };
  });
  return {
    itemId: bvid,
    episodeId: cid,
    playbackProgress: playbackProgressFromPlayInfo(playInfo, {
      itemId: bvid,
      episodeId: cid,
      durationSeconds: numberValue(playInfo && playInfo.dash && playInfo.dash.duration, 0)
    }),
    groups: [{ id: 'bilibili-quality', title: 'B 站清晰度', versions }]
  };
}

async function resolvePlayback(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  const payload = decodePlayPayload(ctx.url || ctx.playUrl || ctx.href || '');
  const pgcReference = payload.kind === 'pgc'
    ? { seasonId: stringValue(payload.seasonId), episodeId: stringValue(payload.epId) }
    : pgcReferenceFrom(ctx.itemId || ctx.id || ctx.url || ctx.href || ctx.episodeId);
  if (pgcReference) return resolvePGCPlayback(ctx, pgcReference, config, payload);
  const bvid = bvidFrom(payload.bvid || ctx.itemId || ctx.id || ctx.url);
  if (!bvid) throw new Error('播放参数缺少 BV 号');
  let cid = stringValue(payload.cid || ctx.episodeId || ctx.cid);
  if (!cid) {
    const viewData = await requestData('/x/web-interface/view', { bvid }, config, { referer: videoReferer(bvid) });
    cid = stringValue(((arrayValue(viewData.pages)[0] || {}).cid) || viewData.cid);
  }
  const versionQuality = stringValue(ctx.versionId).replace(/^qn:/, '');
  const quality = normalizeQuality(payload.qn || versionQuality || config.maxQuality);
  const playInfo = await requestPlayInfo(bvid, cid, quality, config);
  const headers = playbackHeaders(bvid, config);
  const dashPlayback = buildDASHPlayback(playInfo, quality, headers);
  if (dashPlayback) {
    return attachDanmaku(
      applyPlaybackResume(dashPlayback, playInfo, cid),
      cid,
      config,
      videoReferer(bvid)
    );
  }
  const legacyPlayInfo = await requestPlayInfo(bvid, cid, quality, config, 0);
  const legacyPlayback = applyPlaybackResume(
    buildLegacyMP4Playback(legacyPlayInfo, headers, '该视频'),
    legacyPlayInfo,
    cid
  );
  return attachDanmaku(
    legacyPlayback,
    cid,
    config,
    videoReferer(bvid)
  );
}

async function getPlaybackProgress(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  requireCookie(config);
  const payload = decodePlayPayload(ctx.url || ctx.playUrl || ctx.href || '');
  const reference = pgcReferenceFrom(ctx.itemId || ctx.id || ctx.url || ctx.href || ctx.episodeId);
  const providerIds = ctx.providerIds || {};
  const knownBVID = bvidFrom(payload.bvid || ctx.bvid || contextProviderValue(providerIds, ['BVID']));
  const knownCID = stringValue(
    payload.cid || contextProviderValue(providerIds, ['BilibiliCID', 'CID']) || (reference ? ctx.cid : (ctx.cid || ctx.episodeId))
  );
  const episode = reference
    ? await resolvePGCEpisode(ctx, reference, config, payload)
    : null;
  const bvid = knownBVID || (episode && episode.bvid) || '';
  const cid = knownCID || (episode && episode.cid) || '';
  if (!bvid || !cid) return null;

  let data;
  try {
    data = await requestData('/x/player/v2', { bvid, cid }, config, {
      referer: reference ? pgcReferer(episode.epId, episode.seasonId) : videoReferer(bvid)
    });
  } catch (_) {
    return null;
  }
  const lastCID = stringValue(data && (data.last_play_cid || data.lastPlayCid));
  if (lastCID && lastCID !== cid) return null;
  const position = numberValue(data && (data.last_play_time || data.lastPlayTime), 0) / 1000;
  return {
    itemId: ctx.itemId || ctx.id,
    episodeId: episode ? episode.epId : ctx.episodeId,
    positionSeconds: Math.max(0, position),
    durationSeconds: numberValue(ctx.durationSeconds, 0) || undefined,
    completed: false
  };
}

async function reportPlaybackProgress(ctx) {
  ctx = ctx || {};
  const config = readConfig(ctx);
  requireCookie(config);
  const payload = decodePlayPayload(ctx.url || ctx.playUrl || ctx.href || '');
  const providerIds = ctx.providerIds || {};
  const reference = pgcReferenceFrom(ctx.itemId || ctx.id || ctx.url || ctx.href || ctx.episodeId);
  const episode = reference
    ? await resolvePGCEpisode(ctx, reference, config, payload)
    : null;
  const bvid = bvidFrom(payload.bvid || ctx.bvid || contextProviderValue(providerIds, ['BVID']) || (episode && episode.bvid));
  const cid = stringValue(
    payload.cid || contextProviderValue(providerIds, ['BilibiliCID', 'CID']) || (reference ? ctx.cid : (ctx.cid || ctx.episodeId)) || (episode && episode.cid)
  );
  if (!cid) throw new Error('B 站进度上报缺少 CID');

  const position = Math.max(0, numberValue(ctx.positionSeconds || ctx.position || ctx.playedTime, 0));
  const fields = {
    aid: stringValue(ctx.aid || contextProviderValue(providerIds, ['AID'])),
    bvid,
    cid,
    played_time: String(Math.floor(position)),
    real_played_time: String(Math.floor(position)),
    realtime: String(Math.floor(position)),
    start_ts: String(Math.floor(numberValue(ctx.sessionStartedAt, Date.now() / 1000))),
    type: reference ? '4' : '3',
    sub_type: reference ? '1' : '0',
    dt: '2',
    outer: '0',
    play_type: position <= 0 ? '1' : '0',
    spmid: '333.788.0.0',
    from_spmid: '',
    refer_url: reference ? pgcReferer(episode && episode.epId, episode && episode.seasonId) : videoReferer(bvid),
    csrf: csrfFromCookie(config.cookie)
  };
  if (reference) {
    fields.epid = stringValue(episode && episode.epId || contextProviderValue(providerIds, ['BilibiliEpisodeID']));
    fields.sid = stringValue(episode && episode.seasonId || contextProviderValue(providerIds, ['BilibiliSeasonID']));
  }
  const root = await postAPIForm('/x/click-interface/web/heartbeat', fields, config, {
    referer: reference ? fields.refer_url : videoReferer(bvid)
  });
  if (numberValue(root && root.code, -1) !== 0) {
    throw new Error('B 站观看进度上报失败：' + cleanText(root && (root.message || root.msg || root.code)));
  }
  return { ok: true };
}

async function getPGCDetail(ctx, reference, config) {
  const matchedSeasonNumber = matchedPGCSeasonNumberFrom(ctx && (ctx.itemId || ctx.id || ctx.url || ctx.href));
  const params = reference.episodeId
    ? { ep_id: reference.episodeId }
    : { season_id: reference.seasonId };
  const seasonInfo = await requestData('/pgc/view/web/season', params, config, {
    referer: pgcReferer(reference.episodeId, reference.seasonId)
  });
  const seasonId = stringValue(seasonInfo && seasonInfo.season_id || reference.seasonId);
  if (!seasonInfo || !seasonId) throw new Error('B 站没有返回番剧/影视详情');

  const seasonType = numberValue(seasonInfo.show_season_type || seasonInfo.season_type || seasonInfo.type, 1);
  const typeDefinition = PGC_CATEGORIES[seasonType] || { title: '番剧影视' };
  const isMovie = seasonType === 2;
  const episodes = arrayValue(seasonInfo.episodes);
  const sectionDefinitions = arrayValue(seasonInfo.section);
  const supplementaryEntries = [];
  sectionDefinitions.forEach(function (section) {
    arrayValue(section && section.episodes).forEach(function (episode) {
      supplementaryEntries.push({ episode, sectionTitle: cleanText(section && section.title) });
    });
  });
  const requestedEpisodeId = pgcEpisodeIdFrom(ctx.episodeId || reference.episodeId);
  const requestedMainEpisode = episodes.filter(function (episode) {
    return !requestedEpisodeId || String(episode.id) === requestedEpisodeId;
  })[0];
  const requestedSupplement = requestedEpisodeId ? supplementaryEntries.filter(function (entry) {
    return stringValue(entry.episode && (entry.episode.id || entry.episode.ep_id)) === requestedEpisodeId;
  })[0] : null;
  const firstEpisode = requestedMainEpisode || requestedSupplement && requestedSupplement.episode || episodes[0] || {};
  const isSupplementaryDetail = !!requestedSupplement && !requestedMainEpisode;
  const episodeId = stringValue(firstEpisode.id || requestedEpisodeId);
  const supplementaryTitle = cleanText(
    firstEpisode.long_title || firstEpisode.index_title || firstEpisode.share_copy || firstEpisode.title
  );
  const detailTitle = isSupplementaryDetail
    ? (supplementaryTitle || requestedSupplement.sectionTitle || cleanText(seasonInfo.title))
    : cleanText(seasonInfo.title);
  const supplementaryImage = imageURL(firstEpisode.cover || firstEpisode.first_frame);
  const portraitPoster = imageURL(seasonInfo.cover || seasonInfo.square_cover);
  const poster = portraitPoster || supplementaryImage;
  const backdrop = imageURL(
    isSupplementaryDetail
      ? (firstEpisode.cover || firstEpisode.first_frame || seasonInfo.bkg_cover || seasonInfo.cover)
      : (seasonInfo.bkg_cover || seasonInfo.new_ep && seasonInfo.new_ep.cover || firstEpisode.cover || seasonInfo.cover)
  );
  const playPayload = {
    kind: 'pgc',
    seasonId,
    epId: episodeId,
    cid: stringValue(firstEpisode.cid),
    bvid: bvidFrom(firstEpisode.bvid),
    title: detailTitle
  };
  const relatedRecommendationPromise = requestData(
    '/pgc/season/web/related/recommend',
    { season_id: seasonId },
    config,
    { referer: pgcReferer(episodeId, seasonId) }
  ).catch(function () { return {}; });
  let resourceResult = {};
  let resourceGroups = [];
  if (episodeId && firstEpisode.cid) {
    try {
      const resources = await getPGCResourceVersions(
        Object.assign({}, ctx, { itemId: pgcSeasonItemId(seasonId), episodeId, title: detailTitle }),
        { seasonId, episodeId },
        config,
        playPayload
      );
      resourceResult = resources || {};
      resourceGroups = arrayValue(resources && resources.groups ? resources.groups : resources);
    } catch (_) {
      resourceResult = {};
      resourceGroups = [];
    }
  }

  const seasonGroups = [];
  if (episodes.length && (!isMovie || episodes.length > 1)) {
    seasonGroups.push({
      id: 'pgc-main:' + seasonId,
      title: cleanText(seasonInfo.positive && seasonInfo.positive.title) || '正片',
      presentation: isMovie ? 'selection' : undefined,
      seasonNumber: isMovie ? undefined : (matchedSeasonNumber || 1),
      episodes: episodes.map(function (episode, index) {
        return pgcEpisodeItem(episode, index, seasonId, seasonInfo.title, isMovie);
      })
    });
  }

  const supplementarySections = sectionDefinitions.map(function (section, sectionIndex) {
    const sectionEpisodes = arrayValue(section && section.episodes);
    if (!sectionEpisodes.length) return null;
    const sectionTitle = cleanText(section.title) || ('特别内容 ' + (sectionIndex + 1));
    return {
      id: 'bili-pgc-section:' + stringValue(section.id || sectionIndex + 1),
      title: cleanText(section.title) || ('特别内容 ' + (sectionIndex + 1)),
      style: 'discover.standard',
      items: sectionEpisodes.map(function (episode, index) {
        return pgcSupplementItem(episode, index, seasonId, seasonInfo.title, sectionTitle);
      }).filter(Boolean)
    };
  }).filter(function (section) {
    return section && section.items.length;
  });

  const relatedSeries = arrayValue(seasonInfo.seasons).filter(function (season) {
    return stringValue(season && season.season_id) !== seasonId;
  }).slice(0, 20).map(function (season, index) {
    return pgcItem(season, index + 1, seasonType, 'series');
  }).filter(validPGCItem);
  const cast = parsePGCCast(seasonInfo.actors);
  const upInfo = seasonInfo.up_info || {};
  if (upInfo.uname) {
    cast.unshift({
      name: cleanText(upInfo.uname),
      role: '内容提供',
      image: imageURL(upInfo.avatar),
      imageHeaders: imageHeaders(),
      action: upInfo.mid ? categoryAction('up:' + stringValue(upInfo.mid), cleanText(upInfo.uname)) : undefined
    });
  }
  const stat = seasonInfo.stat || {};
  const publish = seasonInfo.publish || {};
  const rating = numberValue(seasonInfo.rating && seasonInfo.rating.score, 0);
  const seasonPlaybackProgress = pgcSeasonPlaybackProgress(seasonInfo, seasonId, episodes);
  const resourcePlaybackProgress = resourceResult.playbackProgress;
  const playbackProgress = isSupplementaryDetail
    ? (seasonPlaybackProgress && seasonPlaybackProgress.episodeId === episodeId
      ? seasonPlaybackProgress
      : resourcePlaybackProgress)
    : (seasonPlaybackProgress || resourcePlaybackProgress);
  const relatedRecommendationData = await relatedRecommendationPromise;
  const recommendedItems = arrayValue(relatedRecommendationData && relatedRecommendationData.season)
    .concat(arrayValue(relatedRecommendationData && relatedRecommendationData.relates))
    .filter(function (season) {
      return stringValue(season && season.season_id) !== seasonId;
    })
    .slice(0, 20)
    .map(function (season, index) {
      return pgcItem(season, index + 1, season && season.season_type || seasonType, 'related');
    })
    .filter(validPGCItem);
  const recommendations = supplementarySections.slice();
  if (relatedSeries.length) {
    recommendations.push({
      id: 'bili-pgc-related-series:' + seasonId,
      title: '相关系列',
      style: 'discover.posterCompact',
      items: relatedSeries
    });
  }
  if (recommendedItems.length) {
    recommendations.push({
      id: 'bili-pgc-recommendations:' + seasonId,
      title: '相关推荐',
      style: 'discover.posterCompact',
      items: recommendedItems
    });
  }

  return {
    pageType: 'detail',
    id: isSupplementaryDetail ? ('pgc:ep:' + episodeId) : pgcSeasonItemId(seasonId),
    type: isMovie || isSupplementaryDetail ? 'movie' : 'series',
    title: detailTitle || ('B 站' + typeDefinition.title),
    originalTitle: isSupplementaryDetail
      ? detailTitle
      : (cleanText(seasonInfo.jp_title || seasonInfo.alias) || cleanText(seasonInfo.title)),
    year: yearFromDateText(publish.pub_time),
    poster,
    backdrop,
    detailImageAspectRatio: '16:9',
    prefersPosterAsDetailBackdropOnPhone: true,
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    overview: isSupplementaryDetail
      ? (cleanText(firstEpisode.share_copy || firstEpisode.desc || firstEpisode.long_title) || cleanText(seasonInfo.evaluate))
      : (cleanText(seasonInfo.evaluate || seasonInfo.share_sub_title) || '该内容暂无简介。'),
    rating: rating > 0 ? rating : undefined,
    runtimeMinutes: firstEpisode.duration ? Math.max(1, Math.round(pgcDurationSeconds(firstEpisode.duration) / 60)) : undefined,
    viewCountText: formatCount(stat.views || stat.view),
    favoriteCountText: formatCount(stat.favorites || stat.favorite),
    genres: uniqueStrings(arrayValue(seasonInfo.styles).map(function (style) {
      return typeof style === 'object' ? style.name : style;
    })).slice(0, 12),
    remarks: isSupplementaryDetail
      ? (requestedSupplement.sectionTitle || cleanText(firstEpisode.badge))
      : cleanText(seasonInfo.new_ep && seasonInfo.new_ep.index_show || seasonInfo.show_season_type || typeDefinition.title),
    providerIds: {
      BilibiliSeasonID: seasonId,
      BilibiliMediaID: stringValue(seasonInfo.media_id),
      BilibiliEpisodeID: episodeId,
      BVID: bvidFrom(firstEpisode.bvid),
      BilibiliCID: stringValue(firstEpisode.cid),
      MiniLibraryPlaybackTitle: detailTitle || ('B 站' + typeDefinition.title)
    },
    cast,
    playbackProgress,
    playbackProgressAuthoritative: true,
    seasons: isSupplementaryDetail ? [] : seasonGroups,
    resourceGroups,
    recommendations
  };
}

async function getPGCResourceVersions(ctx, reference, config, payload) {
  payload = payload || {};
  const episode = await resolvePGCEpisode(ctx, reference, config, payload);
  const maxQuality = normalizeQuality(config.maxQuality);
  const playInfo = await requestPGCPlayInfo(episode, maxQuality, config);
  const qualities = availableQualities(playInfo, maxQuality);
  const title = cleanText(payload.title || ctx.title) || episode.title || ('B 站第 ' + episode.epId + ' 集');
  const versions = qualities.map(function (quality, index) {
    const playPayload = encodePlayPayload({
      kind: 'pgc',
      seasonId: episode.seasonId,
      epId: episode.epId,
      cid: episode.cid,
      bvid: episode.bvid,
      qn: quality,
      title
    });
    return {
      id: 'qn:' + quality,
      name: qualityName(quality),
      subtitle: qualitySubtitle(quality, playInfo),
      container: 'm3u8',
      default: index === 0,
      headers: pgcPlaybackHeaders(episode.epId),
      action: {
        type: 'play',
        itemId: pgcSeasonItemId(episode.seasonId),
        episodeId: episode.epId,
        versionId: 'qn:' + quality,
        url: playPayload,
        title
      }
    };
  });
  return {
    itemId: pgcSeasonItemId(episode.seasonId),
    episodeId: episode.epId,
    playbackProgress: playbackProgressFromPlayInfo(playInfo, {
      itemId: pgcSeasonItemId(episode.seasonId),
      episodeId: episode.epId,
      expectedCID: episode.cid,
      durationSeconds: numberValue(playInfo && playInfo.dash && playInfo.dash.duration, 0)
    }),
    groups: [{ id: 'bilibili-pgc-quality', title: 'B 站清晰度', versions }]
  };
}

async function resolvePGCPlayback(ctx, reference, config, payload) {
  payload = payload || {};
  const episode = await resolvePGCEpisode(ctx, reference, config, payload);
  const versionQuality = stringValue(ctx.versionId).replace(/^qn:/, '');
  const quality = normalizeQuality(payload.qn || versionQuality || config.maxQuality);
  const playInfo = await requestPGCPlayInfo(episode, quality, config);
  const headers = pgcPlaybackHeaders(episode.epId);
  const dashPlayback = buildDASHPlayback(playInfo, quality, headers);
  if (dashPlayback) {
    return attachDanmaku(
      applyPlaybackResume(dashPlayback, playInfo, episode.cid),
      episode.cid,
      config,
      pgcReferer(episode.epId, episode.seasonId)
    );
  }
  const legacyPlayInfo = await requestPGCPlayInfo(episode, quality, config, 0);
  const legacyPlayback = applyPlaybackResume(
    buildLegacyMP4Playback(legacyPlayInfo, headers, '该集'),
    legacyPlayInfo,
    episode.cid
  );
  return attachDanmaku(
    legacyPlayback,
    episode.cid,
    config,
    pgcReferer(episode.epId, episode.seasonId)
  );
}

async function resolvePGCEpisode(ctx, reference, config, payload) {
  const knownEpisodeId = pgcEpisodeIdFrom(payload.epId || ctx.episodeId || reference.episodeId);
  const knownCID = stringValue(payload.cid || ctx.cid);
  const knownSeasonId = stringValue(payload.seasonId || reference.seasonId);
  const knownBVID = bvidFrom(payload.bvid || ctx.bvid);
  if (knownEpisodeId && knownCID) {
    return {
      seasonId: knownSeasonId,
      epId: knownEpisodeId,
      cid: knownCID,
      bvid: knownBVID,
      title: cleanText(payload.title || ctx.title)
    };
  }

  const detailParams = knownEpisodeId ? { ep_id: knownEpisodeId } : { season_id: knownSeasonId };
  const seasonInfo = await requestData('/pgc/view/web/season', detailParams, config, {
    referer: pgcReferer(knownEpisodeId, knownSeasonId)
  });
  const episodes = arrayValue(seasonInfo && seasonInfo.episodes);
  const episode = episodes.filter(function (item) {
    return !knownEpisodeId || stringValue(item.id) === knownEpisodeId;
  })[0] || episodes[0];
  if (!episode || !episode.id || !episode.cid) throw new Error('无法确定 B 站 PGC 剧集的 ep_id 和 CID');
  return {
    seasonId: stringValue(seasonInfo.season_id || knownSeasonId),
    epId: stringValue(episode.id),
    cid: stringValue(episode.cid),
    bvid: bvidFrom(episode.bvid),
    title: cleanText(payload.title || ctx.title || episode.long_title || episode.title)
  };
}

async function requestPGCPlayInfo(episode, quality, config, requestedFnval) {
  const fnval = requestedFnval === 0 ? 0 : 4048;
  const params = {
    ep_id: episode.epId,
    cid: episode.cid,
    season_id: episode.seasonId,
    bvid: episode.bvid,
    qn: quality,
    fnval,
    fnver: 0,
    fourk: 1,
    support_multi_audio: 1,
    voice_balance: 1,
    gaia_source: 'pre-load',
    isGaiaAvoided: 'true',
    web_location: '1315873',
    try_look: 1
  };
  const options = { referer: pgcReferer(episode.epId, episode.seasonId) };
  let signedParams = params;
  try {
    signedParams = signWbiParams(params, await getWbiKeys(config));
  } catch (_) {}

  let root = await requestRoot('/pgc/player/web/v2/playurl', signedParams, config, options);
  if (numberValue(root && root.code, -1) === -352) {
    cachedWbiKeys = null;
    try {
      signedParams = signWbiParams(params, await getWbiKeys(config));
      root = await requestRoot('/pgc/player/web/v2/playurl', signedParams, config, options);
    } catch (_) {}
  }
  let code = numberValue(root && root.code, -1);
  let result = root && (root.result !== undefined ? root.result : root.data);
  let playInfo = result && (result.video_info || result);
  if (code === 0 && playInfo) return copyPlaybackResumeFields(playInfo, result);

  if (code === -400 || code === -404 || (code === 0 && !playInfo)) {
    root = await requestRoot('/pgc/player/web/playurl', signedParams, config, options);
    code = numberValue(root && root.code, -1);
    result = root && (root.result !== undefined ? root.result : root.data);
    playInfo = result && (result.video_info || result);
    if (code === 0 && playInfo) return copyPlaybackResumeFields(playInfo, result);
  }
  throw pgcPlaybackError(root);
}

async function fetchPopular(page, pageSize, config) {
  const data = await requestData('/x/web-interface/popular', { pn: page, ps: pageSize }, config);
  return arrayValue(data && data.list).map(function (item, index) {
    return videoItem(item, (page - 1) * pageSize + index + 1, 'popular');
  }).filter(validVideoItem);
}

async function fetchRanking(config) {
  let data;
  try {
    data = await requestData('/x/web-interface/ranking/v2', { rid: 0, type: 'all' }, config);
  } catch (error) {
    data = await requestWbiData('/x/web-interface/ranking/v2', { rid: 0, type: 'all' }, config);
  }
  return arrayValue(data && data.list).map(function (item, index) {
    return videoItem(item, index + 1, 'ranking');
  }).filter(validVideoItem);
}

async function fetchRegionPage(regionId, page, pageSize, config) {
  const definition = REGION_CATEGORIES[regionId] || {};
  let data = null;
  try {
    data = await requestData('/x/web-interface/newlist', {
      rid: regionId,
      type: 0,
      pn: page,
      ps: pageSize
    }, config);
  } catch (_) {
    data = null;
  }
  let rawItems = arrayValue(data && data.archives);
  let hasMore = rawItems.length >= pageSize;

  if (!rawItems.length && page === 1 && definition.rankId) {
    try {
      const ranking = await requestWbiData('/x/web-interface/ranking/v2', {
        rid: definition.rankId,
        type: 'all'
      }, config);
      rawItems = arrayValue(ranking && ranking.list).slice(0, pageSize);
      hasMore = false;
    } catch (_) {}
  }

  if (!rawItems.length && definition.title) {
    const searchData = await requestWbiData('/x/web-interface/wbi/search/type', {
      search_type: 'video',
      keyword: definition.title,
      order: 'totalrank',
      page,
      page_size: pageSize
    }, config, { origin: 'https://search.bilibili.com' });
    rawItems = arrayValue(searchData && searchData.result);
    hasMore = page < numberValue(searchData && searchData.numPages, page);
  }

  return {
    items: rawItems.map(function (item, index) {
      return videoItem(item, (page - 1) * pageSize + index + 1, 'region');
    }).filter(validVideoItem),
    hasMore
  };
}

async function fetchPGCIndex(seasonType, page, pageSize, config) {
  const data = await requestData('/pgc/season/index/result', {
    season_type: seasonType,
    st: seasonType,
    type: 1,
    order: 3,
    sort: 0,
    page,
    pagesize: pageSize,
    season_version: -1,
    spoken_language_type: -1,
    area: -1,
    is_finish: -1,
    copyright: -1,
    season_status: -1,
    season_month: -1,
    year: -1,
    release_date: -1,
    style_id: -1,
    producer_id: -1
  }, config, { referer: 'https://www.bilibili.com/anime/index/' });
  return {
    items: arrayValue(data && data.list).map(function (item, index) {
      return pgcItem(item, (page - 1) * pageSize + index + 1, seasonType, 'index');
    }).filter(validPGCItem),
    hasMore: numberValue(data && data.has_next, 0) === 1
  };
}

async function fetchPGCFollows(followType, page, pageSize, config) {
  const profile = await currentProfile(config);
  const data = await requestData('/x/space/bangumi/follow/list', {
    vmid: profile.mid,
    type: followType,
    pn: page,
    ps: pageSize
  }, config, { referer: 'https://space.bilibili.com/' + profile.mid + '/bangumi' });
  const total = numberValue(data && data.total, 0);
  return {
    items: arrayValue(data && data.list).map(function (item, index) {
      return pgcItem(item, (page - 1) * pageSize + index + 1, item.season_type, 'follow');
    }).filter(validPGCItem),
    hasMore: total > page * pageSize
  };
}

async function fetchFollowingPage(page, config, includeMeta) {
  requireCookie(config);
  let offset = '';
  let data = null;
  for (let index = 1; index <= page; index += 1) {
    data = await requestData('/x/polymer/web-dynamic/v1/feed/all', {
      type: 'video',
      offset: index === 1 ? '' : offset,
      page: index,
      timezone_offset: -480,
      platform: 'web',
      features: 'itemOpusStyle,listOnlyfans,opusBigCover,onlyfansVote,commentsNewVersion',
      web_location: '333.1365'
    }, config, { referer: 'https://t.bilibili.com/' });
    offset = stringValue(data && data.offset);
    if (!data || !data.has_more || !offset) break;
  }
  const items = arrayValue(data && data.items).map(function (item, index) {
    return dynamicVideoItem(item, (page - 1) * 20 + index + 1);
  }).filter(validVideoItem);
  const result = { items, hasMore: !!(data && data.has_more && offset) };
  return includeMeta ? result : items;
}

async function fetchFavoriteFolders(config, limit) {
  const profile = await currentProfile(config);
  const data = await requestData('/x/v3/fav/folder/created/list-all', {
    up_mid: profile.mid,
    web_location: '333.1387'
  }, config, { referer: 'https://space.bilibili.com/' + profile.mid + '/favlist' });
  return arrayValue(data && data.list).slice(0, limit).map(function (folder, index) {
    return favoriteFolderItem(folder, index + 1);
  });
}

async function fetchFavoriteItems(folderId, page, pageSize, order, config) {
  const data = await requestData('/x/v3/fav/resource/list', {
    media_id: folderId,
    pn: page,
    ps: pageSize,
    order,
    platform: 'web'
  }, config, { referer: 'https://space.bilibili.com/' });
  return {
    items: arrayValue(data && data.medias).map(function (item, index) {
      return favoriteVideoItem(item, (page - 1) * pageSize + index + 1);
    }).filter(validVideoItem),
    hasMore: !!(data && data.has_more)
  };
}

async function fetchWatchLater(config) {
  const data = await requestData('/x/v2/history/toview', {}, config, { referer: 'https://www.bilibili.com/watchlater/' });
  return arrayValue(data && data.list).map(function (item, index) {
    return watchLaterItem(item, index + 1);
  }).filter(validVideoItem);
}

async function fetchHistoryPage(page, config, includeMeta) {
  let cursor = { max: 0, view_at: 0, business: '' };
  let data = null;
  for (let index = 1; index <= page; index += 1) {
    data = await requestData('/x/web-interface/history/cursor', {
      ps: 30,
      max: cursor.max || 0,
      view_at: cursor.view_at || 0,
      business: cursor.business || ''
    }, config, { referer: 'https://www.bilibili.com/account/history' });
    cursor = (data && data.cursor) || {};
    if (!arrayValue(data && data.list).length) break;
  }
  const items = arrayValue(data && data.list).map(function (item, index) {
    return historyVideoItem(item, (page - 1) * 30 + index + 1);
  }).filter(validVideoItem);
  const result = { items, hasMore: items.length >= 30 && numberValue(cursor.view_at, 0) > 0 };
  return includeMeta ? result : items;
}

async function fetchCreators(page, pageSize, config) {
  const profile = await currentProfile(config);
  const data = await requestData('/x/relation/followings', {
    vmid: profile.mid,
    pn: page,
    ps: pageSize,
    order_type: ''
  }, config, { referer: 'https://space.bilibili.com/' + profile.mid + '/fans/follow' });
  return arrayValue(data && data.list).map(function (creator, index) {
    return creatorItem(creator, (page - 1) * pageSize + index + 1);
  });
}

async function fetchCreatorVideos(mid, page, pageSize, order, config) {
  const data = await requestWbiData('/x/space/wbi/arc/search', {
    mid,
    pn: page,
    ps: pageSize,
    order,
    index: 1
  }, config, { origin: 'https://space.bilibili.com' });
  const list = data && data.list && data.list.vlist;
  const count = numberValue(data && data.page && data.page.count, 0);
  return {
    items: arrayValue(list).map(function (item, index) {
      return videoItem(item, (page - 1) * pageSize + index + 1, 'creator');
    }).filter(validVideoItem),
    hasMore: page * pageSize < count
  };
}

function previewLimitForStyle(style) {
  const value = stringValue(style);
  if (value === 'discover.annualPosterStack') return 4;
  if (value === 'discover.annualWidePreview') return 5;
  if (value === 'discover.annualListPreview') return 3;
  if (value === 'discover.annualCategories' || value === 'discover.annualClassic') return 10;
  return 5;
}

async function mapWithConcurrency(values, concurrency, transform) {
  const source = arrayValue(values);
  if (!source.length) return [];
  const results = new Array(source.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= source.length) return;
      results[index] = await transform(source[index], index);
    }
  }

  const workers = [];
  const workerCount = Math.min(Math.max(1, numberValue(concurrency, 1)), source.length);
  for (let index = 0; index < workerCount; index += 1) workers.push(worker());
  await Promise.all(workers);
  return results;
}

function itemCategoryPageId(item) {
  return stringValue(item && item.action && (item.action.pageId || item.action.id));
}

function uniquePreviewItems(items, limit) {
  const seen = {};
  const result = [];
  arrayValue(items).forEach(function (item) {
    if (!item || result.length >= limit) return;
    const key = stringValue(item.id || (item.action && item.action.itemId) || item.title);
    if (!key || seen[key]) return;
    seen[key] = true;
    result.push(item);
  });
  return result;
}

async function previewItemsForPageId(pageId, config, limit) {
  pageId = stringValue(pageId);
  limit = Math.max(1, numberValue(limit, 3));

  if (pageId === 'popular') return (await fetchPopular(1, limit, config)).slice(0, limit);
  if (pageId === 'ranking') return (await fetchRanking(config)).slice(0, limit);
  if (pageId === 'following') return (await fetchFollowingPage(1, config)).slice(0, limit);
  if (pageId === 'watchlater') return (await fetchWatchLater(config)).slice(0, limit);
  if (pageId === 'history') return (await fetchHistoryPage(1, config)).slice(0, limit);

  if (pageId.indexOf('pgc:') === 0) {
    return (await fetchPGCIndex(numberValue(pageId.slice('pgc:'.length), 1), 1, limit, config)).items.slice(0, limit);
  }
  if (pageId.indexOf('pgc-follow:') === 0) {
    const followType = numberValue(pageId.slice('pgc-follow:'.length), 1) === 2 ? 2 : 1;
    return (await fetchPGCFollows(followType, 1, limit, config)).items.slice(0, limit);
  }
  if (pageId.indexOf('region:') === 0) {
    return (await fetchRegionPage(numberValue(pageId.slice('region:'.length), 0), 1, limit, config)).items.slice(0, limit);
  }
  if (pageId.indexOf('favorite:') === 0) {
    return (await fetchFavoriteItems(pageId.slice('favorite:'.length), 1, limit, 'mtime', config)).items.slice(0, limit);
  }
  if (pageId.indexOf('up:') === 0) {
    const mid = pageId.slice('up:'.length).split(':')[0];
    return (await fetchCreatorVideos(mid, 1, limit, 'pubdate', config)).items.slice(0, limit);
  }

  if (pageId === 'favorites') {
    const folders = await fetchFavoriteFolders(config, Math.min(limit, 3));
    const previews = [];
    for (let index = 0; index < folders.length && previews.length < limit; index += 1) {
      const folderPageId = itemCategoryPageId(folders[index]);
      const nextItems = await safePreviewItemsForPageId(folderPageId, config, limit - previews.length);
      previews.push.apply(previews, nextItems);
    }
    return uniquePreviewItems(previews, limit);
  }

  if (pageId === 'creators') {
    const creators = await fetchCreators(1, Math.min(limit, 3), config);
    const previews = [];
    for (let index = 0; index < creators.length && previews.length < limit; index += 1) {
      const creatorPageId = itemCategoryPageId(creators[index]);
      const nextItems = await safePreviewItemsForPageId(creatorPageId, config, limit - previews.length);
      previews.push.apply(previews, nextItems);
    }
    return uniquePreviewItems(previews, limit);
  }

  if (pageId === 'more-regions') {
    const perRegionLimit = Math.max(2, Math.ceil(limit / 2));
    const groups = await Promise.all([
      safePreviewItemsForPageId('region:160', config, perRegionLimit),
      safePreviewItemsForPageId('region:217', config, perRegionLimit)
    ]);
    const interleaved = [];
    for (let index = 0; index < perRegionLimit; index += 1) {
      groups.forEach(function (group) {
        if (group[index]) interleaved.push(group[index]);
      });
    }
    return uniquePreviewItems(interleaved, limit);
  }

  return [];
}

async function safePreviewItemsForPageId(pageId, config, limit) {
  try {
    return await previewItemsForPageId(pageId, config, limit);
  } catch (_) {
    return [];
  }
}

async function enrichEntryItems(items, config, style) {
  const previewLimit = previewLimitForStyle(style);
  return mapWithConcurrency(items, 3, async function (item) {
    const pageId = itemCategoryPageId(item);
    if (!pageId) return item;
    const previewItems = await safePreviewItemsForPageId(pageId, config, previewLimit);
    return Object.assign({}, item, { previewItems });
  });
}

async function currentProfile(config) {
  requireCookie(config);
  const fingerprint = md5Hex(config.cookie);
  if (cachedProfile && cachedProfile.fingerprint === fingerprint) return cachedProfile.data;
  const root = await requestRoot('/x/web-interface/nav', {}, config, {});
  const data = root && root.data;
  if (!data || !data.isLogin || !data.mid) throw loginError('B 站 Cookie 已失效，请重新复制完整 Cookie');
  const profile = {
    mid: stringValue(data.mid),
    name: cleanText(data.uname),
    face: imageURL(data.face),
    vip: data.vipStatus === 1
  };
  cachedProfile = { fingerprint, data: profile };
  return profile;
}

async function requestPlayInfo(bvid, cid, quality, config, requestedFnval) {
  const fnval = requestedFnval === 0 ? 0 : 4048;
  const params = {
    bvid,
    cid,
    qn: quality,
    fnval,
    fnver: 0,
    fourk: 1,
    voice_balance: 1,
    gaia_source: 'pre-load',
    isGaiaAvoided: 'true',
    web_location: '1315873'
  };
  if (fnval === 0) {
    params.platform = 'html5';
    params.high_quality = 1;
    return requestData('/x/player/playurl', params, config, { referer: videoReferer(bvid) });
  }
  return requestWbiData('/x/player/wbi/playurl', params, config, { referer: videoReferer(bvid) });
}

async function requestWbiData(path, params, config, options) {
  const requestOptions = Object.assign({}, options || {}, { omitReferer: true });
  try {
    const keys = await getWbiKeys(config);
    return await requestData(path, signWbiParams(params || {}, keys), config, requestOptions);
  } catch (error) {
    if (!/(-352|-403|WBI|签名)/i.test(humanError(error))) throw error;
    cachedWbiKeys = null;
    const refreshedKeys = await getWbiKeys(config);
    return requestData(path, signWbiParams(params || {}, refreshedKeys), config, requestOptions);
  }
}

async function getWbiKeys(config) {
  const fingerprint = md5Hex(config.cookie || 'anonymous');
  if (cachedWbiKeys && cachedWbiKeys.fingerprint === fingerprint && Date.now() - cachedWbiKeys.time < 12 * 60 * 60 * 1000) {
    return cachedWbiKeys.data;
  }
  const root = await requestRoot('/x/web-interface/nav', {}, config, {});
  const wbi = root && root.data && root.data.wbi_img;
  const imgKey = keyFromWbiURL(wbi && wbi.img_url);
  const subKey = keyFromWbiURL(wbi && wbi.sub_url);
  if (!imgKey || !subKey) throw new Error('无法获取 B 站 WBI 签名密钥');
  const keys = { imgKey, subKey };
  cachedWbiKeys = { fingerprint, time: Date.now(), data: keys };
  return keys;
}

function signWbiParams(params, keys) {
  const original = stringValue(keys.imgKey) + stringValue(keys.subKey);
  let mixin = '';
  BILIBILI_MIXIN_TABLE.forEach(function (index) {
    if (index < original.length) mixin += original[index];
  });
  mixin = mixin.slice(0, 32);
  const normalized = {};
  Object.keys(params || {}).forEach(function (key) {
    if (params[key] == null) return;
    normalized[key] = stringValue(params[key]).replace(/[!'()*]/g, '');
  });
  normalized.wts = Math.floor(Date.now() / 1000);
  const query = Object.keys(normalized).sort().map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(stringValue(normalized[key]));
  }).join('&');
  normalized.w_rid = md5Hex(query + mixin);
  return normalized;
}

async function requestData(path, params, config, options) {
  const root = await requestRoot(path, params, config, options || {});
  if (!root || typeof root !== 'object') throw new Error('B 站接口返回为空');
  if (numberValue(root.code, 0) !== 0) {
    if (numberValue(root.code, 0) === -101) throw loginError('B 站 Cookie 未登录或已失效');
    throw new Error('B 站接口错误 ' + root.code + '：' + cleanText(root.message || root.msg || '请求失败'));
  }
  return root.data !== undefined ? root.data : root.result;
}

async function requestRoot(path, params, config, options) {
  options = options || {};
  if (config && !options.skipSessionRefresh) {
    try {
      await refreshSessionIfNeeded(config, false);
    } catch (_) {}
  }

  let root = await requestRootOnce(path, params, config, options);
  if (numberValue(root && root.code, 0) === -101 && config && !options.skipSessionRefresh && canRefreshSession(config)) {
    try {
      if (await refreshSessionIfNeeded(config, true)) {
        root = await requestRootOnce(path, params, config, Object.assign({}, options, { skipSessionRefresh: true }));
      }
    } catch (error) {
      throw loginError('B 站登录已失效，自动续期失败，请重新扫码登录：' + humanError(error));
    }
  }
  return root;
}

async function requestRootOnce(path, params, config, options) {
  const url = absoluteURL(path, params);
  const headers = requestHeaders(config, options);
  let response;
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.get === 'function') {
    response = await Widget.http.get(url, { headers, timeout: 18 });
  } else if (typeof fetch === 'function') {
    const fetched = await fetch(url, { headers, redirect: 'follow' });
    const text = await fetched.text();
    if (!fetched.ok) throw new Error('B 站 HTTP ' + fetched.status);
    response = text;
  } else {
    throw new Error('当前小程序环境缺少 HTTP 请求能力');
  }
  const raw = response && response.data !== undefined
    ? response.data
    : response && response.body !== undefined
      ? response.body
      : response;
  if (raw && typeof raw === 'object') return raw;
  const text = stringValue(raw).trim();
  if (/错误号\s*:\s*412|security control policy|<title>出错啦/i.test(text)) {
    throw new Error('B 站接口触发 412 风控，请确认 Cookie 包含 buvid3 后稍后重试');
  }
  try {
    return JSON.parse(text);
  } catch (_) {
    throw new Error('B 站接口返回的不是 JSON：' + cleanText(text).slice(0, 80));
  }
}

function sessionParameterUpdates(data, existingCookie) {
  data = data || {};
  const cookieInfo = data.cookie_info || data.cookieInfo || {};
  const tokenInfo = data.token_info || data.tokenInfo || {};
  const cookies = arrayValue(cookieInfo.cookies).map(function (cookie) {
    const name = stringValue(cookie && cookie.name).trim();
    const value = stringValue(cookie && cookie.value).trim();
    return name && value ? name + '=' + value : '';
  }).filter(Boolean);
  const updates = { Cookie: mergeCookieHeader(existingCookie, cookies) };
  const accessToken = stringValue(tokenInfo.access_token || tokenInfo.accessToken).trim();
  const refreshToken = stringValue(tokenInfo.refresh_token || tokenInfo.refreshToken).trim();
  const expiresIn = numberValue(tokenInfo.expires_in || tokenInfo.expiresIn, 0);
  if (accessToken) updates.AccessToken = accessToken;
  if (refreshToken) updates.RefreshToken = refreshToken;
  if (expiresIn > 0) updates.TokenExpiresAt = String(Date.now() + expiresIn * 1000);
  return updates;
}

function mergeCookieHeader(existingCookie, refreshedCookies) {
  const names = [];
  const values = {};
  function append(value) {
    stringValue(value).split(';').forEach(function (part) {
      const trimmed = part.trim();
      const separator = trimmed.indexOf('=');
      if (separator <= 0) return;
      const name = trimmed.slice(0, separator).trim();
      const cookieValue = trimmed.slice(separator + 1).trim();
      if (!name || !cookieValue) return;
      if (!Object.prototype.hasOwnProperty.call(values, name)) names.push(name);
      values[name] = cookieValue;
    });
  }
  append(existingCookie);
  arrayValue(refreshedCookies).forEach(append);
  return names.map(function (name) { return name + '=' + values[name]; }).join('; ');
}

function canRefreshSession(config) {
  return !!(config && config.accessToken && config.refreshToken);
}

async function refreshSessionIfNeeded(config, force) {
  const adoptedPersistedSession = syncSessionFromPersistedParameters(config);
  if (force && adoptedPersistedSession) return true;
  if (!canRefreshSession(config)) return false;
  const expiresAt = numberValue(config.tokenExpiresAt, 0);
  if (!force && (!expiresAt || expiresAt > Date.now() + BILIBILI_TOKEN_REFRESH_LEEWAY_MS)) return false;
  if (!force && config.sessionRefreshAttempted) return false;
  config.sessionRefreshAttempted = true;

  let ownsRefresh = false;
  if (!activeSessionRefresh) {
    activeSessionRefresh = performCoordinatedSessionRefresh(config);
    ownsRefresh = true;
  }
  const refresh = activeSessionRefresh;
  try {
    const updates = await refresh;
    applySessionParameterValues(config, updates);
    return true;
  } finally {
    if (ownsRefresh && activeSessionRefresh === refresh) activeSessionRefresh = null;
  }
}

async function performCoordinatedSessionRefresh(config) {
  let lease = null;
  const parameters = typeof Widget !== 'undefined' && Widget.parameters;
  if (parameters && typeof parameters.beginRefresh === 'function') {
    lease = parameters.beginRefresh({
      expectedName: 'RefreshToken',
      expectedValue: config.refreshToken,
      timeoutSeconds: 22
    });
    if (lease && lease.parameters) applySessionParameterValues(config, lease.parameters);
    if (!lease || lease.acquired !== true) {
      if (lease && lease.updated && canRefreshSession(config)) return sessionValuesFromConfig(config);
      throw new Error(lease && lease.timedOut
        ? '等待其他 B 站会话续期超时'
        : 'B 站会话续期未取得执行权');
    }
  }

  try {
    return await performSessionRefreshRequest(config);
  } finally {
    if (lease && lease.leaseId && parameters && typeof parameters.endRefresh === 'function') {
      parameters.endRefresh(lease.leaseId);
    }
  }
}

async function performSessionRefreshRequest(config) {
  const root = await postPassportForm(
    '/api/v2/oauth2/refresh_token',
    signTVLoginParameters({
      access_key: config.accessToken,
      refresh_token: config.refreshToken
    })
  );
  const code = numberValue(root && root.code, -1);
  if (code !== 0) {
    throw new Error('续期接口错误 ' + code + '：' + cleanText(root && (root.message || root.msg || '请求失败')));
  }

  const updates = sessionParameterUpdates(root && root.data, config.cookie);
  if (stringValue(updates.Cookie).indexOf('SESSDATA=') < 0 || !updates.AccessToken || !updates.RefreshToken) {
    throw new Error('续期接口没有返回完整的新 Cookie 和令牌');
  }
  if (typeof Widget === 'undefined' || !Widget.parameters || typeof Widget.parameters.update !== 'function') {
    throw new Error('当前 App 版本不支持持久化续期参数');
  }
  Widget.parameters.update(updates);
  applySessionParameterValues(config, updates);
  cachedProfile = null;
  cachedWbiKeys = null;
  return updates;
}

function syncSessionFromPersistedParameters(config) {
  if (typeof Widget === 'undefined' || !Widget.parameters || typeof Widget.parameters.current !== 'function') {
    return false;
  }
  try {
    return applySessionParameterValues(config, Widget.parameters.current());
  } catch (_) {
    return false;
  }
}

function applySessionParameterValues(config, values) {
  config = config || {};
  values = values || {};
  const previous = [config.cookie, config.accessToken, config.refreshToken, config.tokenExpiresAt].join('|');
  const cookie = stringValue(values.Cookie || values.cookie).trim();
  const accessToken = stringValue(values.AccessToken || values.accessToken).trim();
  const refreshToken = stringValue(values.RefreshToken || values.refreshToken).trim();
  const tokenExpiresAt = numberValue(values.TokenExpiresAt || values.tokenExpiresAt, 0);
  if (cookie) config.cookie = cookie;
  if (accessToken) config.accessToken = accessToken;
  if (refreshToken) config.refreshToken = refreshToken;
  if (tokenExpiresAt > 0) config.tokenExpiresAt = tokenExpiresAt;
  const current = [config.cookie, config.accessToken, config.refreshToken, config.tokenExpiresAt].join('|');
  if (current !== previous) {
    cachedProfile = null;
    cachedWbiKeys = null;
  }
  return current !== previous;
}

function sessionValuesFromConfig(config) {
  return {
    Cookie: stringValue(config && config.cookie),
    AccessToken: stringValue(config && config.accessToken),
    RefreshToken: stringValue(config && config.refreshToken),
    TokenExpiresAt: String(numberValue(config && config.tokenExpiresAt, 0))
  };
}

function signTVLoginParameters(values) {
  const params = Object.assign({}, values || {}, {
    appkey: BILIBILI_TV_APP_KEY,
    ts: String(Math.floor(Date.now() / 1000)),
    local_id: '0',
    mobi_app: 'iphone',
    device: 'pad',
    device_name: 'iPad'
  });
  const signingText = Object.keys(params).sort().map(function (key) {
    return key + '=' + stringValue(params[key]);
  }).join('&');
  params.sign = md5Hex(signingText + BILIBILI_TV_APP_SECRET);
  return params;
}

async function postPassportForm(path, params) {
  const url = BILIBILI_PASSPORT + path;
  const body = Object.keys(params || {}).sort().map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(stringValue(params[key]));
  }).join('&');
  const headers = {
    'User-Agent': BILIBILI_UA,
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/x-www-form-urlencoded',
    Origin: 'https://www.bilibili.com',
    Referer: BILIBILI_SITE
  };
  let response;
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.post === 'function') {
    response = await Widget.http.post(url, body, { headers, timeout: 18 });
  } else if (typeof fetch === 'function') {
    const fetched = await fetch(url, { method: 'POST', headers, body, redirect: 'follow' });
    const text = await fetched.text();
    if (!fetched.ok) throw new Error('B 站登录接口 HTTP ' + fetched.status);
    response = text;
  } else {
    throw new Error('当前小程序环境缺少 HTTP POST 能力');
  }
  if (response && numberValue(response.status, 200) >= 400) {
    throw new Error('B 站登录接口 HTTP ' + response.status);
  }
  const raw = response && response.data !== undefined
    ? response.data
    : response && response.body !== undefined
      ? response.body
      : response;
  if (raw && typeof raw === 'object') return raw;
  try {
    return JSON.parse(stringValue(raw).trim());
  } catch (_) {
    throw new Error('B 站登录接口返回的不是 JSON');
  }
}

async function postAPIForm(path, params, config, options) {
  options = options || {};
  const url = absoluteURL(path, {});
  const body = Object.keys(params || {}).filter(function (key) {
    return params[key] !== undefined && params[key] !== null;
  }).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(stringValue(params[key]));
  }).join('&');
  const headers = Object.assign({}, requestHeaders(config || {}, options), {
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  let response;
  if (typeof Widget !== 'undefined' && Widget.http && typeof Widget.http.post === 'function') {
    response = await Widget.http.post(url, body, { headers, timeout: 18 });
  } else if (typeof fetch === 'function') {
    const fetched = await fetch(url, { method: 'POST', headers, body, redirect: 'follow' });
    const text = await fetched.text();
    if (!fetched.ok) throw new Error('B 站 HTTP ' + fetched.status);
    response = text;
  } else {
    throw new Error('当前小程序环境缺少 HTTP POST 能力');
  }
  const raw = response && response.data !== undefined
    ? response.data
    : response && response.body !== undefined
      ? response.body
      : response;
  if (raw && typeof raw === 'object') return raw;
  try {
    return JSON.parse(stringValue(raw).trim());
  } catch (_) {
    throw new Error('B 站接口返回的不是 JSON');
  }
}

function requestHeaders(config, options) {
  const headers = {
    'User-Agent': BILIBILI_UA,
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.7',
    Origin: options.origin || 'https://www.bilibili.com'
  };
  if (!options.omitReferer) headers.Referer = options.referer || BILIBILI_SITE;
  if (config && config.cookie) headers.Cookie = config.cookie;
  return headers;
}

function csrfFromCookie(cookie) {
  const match = stringValue(cookie).match(/(?:^|;\s*)bili_jct=([^;]+)/i);
  return match ? match[1] : '';
}

function contextProviderValue(providerIds, keys) {
  providerIds = providerIds || {};
  keys = keys || [];
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex += 1) {
    const key = keys[keyIndex].toLowerCase();
    const entry = Object.keys(providerIds).filter(function (candidate) {
      return candidate.toLowerCase() === key;
    })[0];
    if (entry && providerIds[entry] != null && stringValue(providerIds[entry]).trim()) {
      return stringValue(providerIds[entry]).trim();
    }
  }
  return '';
}

function imageHeaders() {
  return {
    Referer: BILIBILI_SITE,
    'User-Agent': BILIBILI_UA
  };
}

function playbackHeaders(bvid, config) {
  return {
    Referer: videoReferer(bvid),
    Origin: 'https://www.bilibili.com',
    'User-Agent': BILIBILI_UA
  };
}

function pgcPlaybackHeaders(episodeId) {
  return {
    Referer: pgcReferer(episodeId, ''),
    Origin: 'https://www.bilibili.com',
    'User-Agent': BILIBILI_UA
  };
}

function videoItem(raw, rank, source) {
  raw = raw || {};
  const owner = raw.owner || raw.upper || {};
  const stat = raw.stat || raw.cnt_info || {};
  const bvid = bvidFrom(raw.bvid || raw.bv_id || raw.arcurl || raw.short_link_v2);
  const title = cleanText(raw.title || raw.name);
  const poster = imageURL(raw.pic || raw.cover || raw.first_frame);
  const duration = durationSeconds(raw.duration);
  const dimension = raw.dimension || (raw.ugc && raw.ugc.dimension) || {};
  const viewCount = stat.view !== undefined ? stat.view : (stat.play !== undefined ? stat.play : raw.play);
  const favoriteCount = stat.favorite !== undefined ? stat.favorite : (stat.collect !== undefined ? stat.collect : raw.favorites);
  return {
    id: bvid || stringValue(raw.aid || raw.id),
    title: title || bvid,
    subtitle: joinText([cleanText(owner.name || raw.author || raw.author_name), duration ? formatDuration(duration) : '']),
    metadataText: joinText([formatCount(viewCount) ? formatCount(viewCount) + ' 播放' : '', source === 'ranking' && rank ? '第 ' + rank + ' 名' : '']),
    type: 'movie',
    poster,
    backdrop: poster,
    overview: cleanText(raw.desc || raw.description || raw.intro),
    year: yearFromTimestamp(raw.pubdate || raw.ctime),
    rank,
    remarks: cleanText(raw.tname || raw.typename || raw.rcmd_reason && raw.rcmd_reason.content),
    badges: uniqueStrings([cleanText(raw.tname || raw.typename), raw.videos > 1 ? raw.videos + 'P' : '']).slice(0, 2),
    aspectRatio: aspectRatioFromDimension(dimension),
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    viewCountText: formatCount(viewCount),
    favoriteCountText: formatCount(favoriteCount),
    providerIds: { BVID: bvid, AID: stringValue(raw.aid || raw.id) },
    action: { type: 'detail', itemId: bvid }
  };
}

function pgcItem(raw, rank, fallbackSeasonType, source) {
  raw = raw || {};
  const seasonId = stringValue(raw.season_id || raw.pgc_season_id);
  const seasonType = numberValue(fallbackSeasonType, numberValue(raw.season_type || raw.type, 1));
  const definition = PGC_CATEGORIES[seasonType] || { title: '番剧影视' };
  const title = cleanText(raw.title || raw.season_title || raw.name);
  const newEpisode = raw.new_ep || {};
  const firstEpisode = raw.first_ep || {};
  const poster = imageURL(raw.cover || raw.square_cover);
  const backdrop = imageURL(raw.ss_horizontal_cover || firstEpisode.cover || newEpisode.cover || raw.square_cover || raw.cover);
  const score = numberValue(raw.score || raw.rating && raw.rating.score || raw.media_score && raw.media_score.score, 0);
  const indexShow = cleanText(raw.index_show || newEpisode.index_show || raw.progress);
  const metadata = joinText([
    score > 0 ? score + '分' : '',
    cleanText(raw.order),
    source === 'follow' ? cleanText(raw.progress || '已追' + definition.title) : ''
  ]);
  return {
    id: pgcSeasonItemId(seasonId),
    title: title || ('B 站' + definition.title),
    subtitle: joinText([indexShow, cleanText(raw.subTitle || raw.subtitle || raw.season_type_name || definition.title)]),
    metadataText: metadata,
    type: seasonType === 2 ? 'movie' : 'series',
    poster,
    backdrop,
    overview: cleanText(raw.evaluate || raw.desc),
    year: yearFromTimestamp(raw.pubtime),
    rating: score > 0 ? score : undefined,
    rank,
    remarks: indexShow || cleanText(raw.badge || definition.title),
    badges: uniqueStrings([cleanText(raw.badge), cleanText(raw.season_type_name || definition.title)]).slice(0, 2),
    aspectRatio: '3:4',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    providerIds: {
      BilibiliSeasonID: seasonId,
      BilibiliMediaID: stringValue(raw.media_id),
      BilibiliEpisodeID: stringValue(firstEpisode.ep_id || firstEpisode.id)
    },
    action: { type: 'detail', itemId: pgcSeasonItemId(seasonId) }
  };
}

function pgcSearchItem(raw, rank) {
  const item = pgcItem(raw, rank, raw && raw.season_type, 'search');
  item.overview = cleanText(raw && raw.desc);
  item.year = yearFromTimestamp(raw && raw.pubtime);
  item.genres = uniqueStrings(stringValue(raw && raw.styles).split(','));
  return item;
}

function pgcEpisodeItem(episode, index, seasonId, seasonTitle, isFeatureVersion) {
  episode = episode || {};
  const epId = stringValue(episode.id || episode.ep_id);
  const rawIndex = cleanText(episode.title || episode.index || episode.index_title);
  const longTitle = cleanText(episode.long_title || episode.index_title || (isFeatureVersion ? '' : episode.share_copy));
  const title = isFeatureVersion
    ? joinText([rawIndex || ('版本 ' + (index + 1)), longTitle])
    : joinText([
      rawIndex ? (/^\d+(?:\.\d+)?$/.test(rawIndex) ? '第 ' + rawIndex + ' 集' : rawIndex) : '第 ' + (index + 1) + ' 集',
      longTitle
    ]);
  const still = imageURL(episode.cover || episode.first_frame);
  const duration = pgcDurationSeconds(episode.duration);
  return {
    id: epId,
    title,
    episodeNumber: isFeatureVersion ? undefined : numberValue(rawIndex, index + 1),
    runtimeMinutes: duration > 0 ? Math.max(1, Math.round(duration / 60)) : undefined,
    overview: cleanText(episode.share_copy || episode.desc),
    poster: still,
    still,
    imageHeaders: imageHeaders(),
    remarks: cleanText(episode.badge),
    action: {
      type: 'play',
      itemId: pgcSeasonItemId(seasonId),
      seasonId: 'pgc-main:' + seasonId,
      episodeId: epId,
      title: title || cleanText(seasonTitle)
    }
  };
}

function pgcSupplementItem(episode, index, seasonId, seasonTitle, sectionTitle) {
  episode = episode || {};
  const epId = stringValue(episode.id || episode.ep_id);
  if (!epId) return null;
  const rawIndex = cleanText(episode.title || episode.index || episode.index_title);
  const longTitle = cleanText(episode.long_title || episode.index_title || episode.share_copy);
  const title = longTitle || rawIndex || (cleanText(sectionTitle) + ' ' + (index + 1));
  const image = imageURL(episode.cover || episode.first_frame);
  const duration = pgcDurationSeconds(episode.duration);
  return {
    id: 'pgc:ep:' + epId,
    title,
    subtitle: joinText([cleanText(sectionTitle), duration > 0 ? formatDuration(duration) : '']),
    metadataText: cleanText(seasonTitle),
    type: 'movie',
    poster: image,
    backdrop: image,
    overview: cleanText(episode.share_copy || episode.desc) || longTitle,
    remarks: cleanText(episode.badge) || rawIndex,
    aspectRatio: '16:9',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    providerIds: {
      BilibiliSeasonID: stringValue(seasonId),
      BilibiliEpisodeID: epId,
      BVID: bvidFrom(episode.bvid),
      BilibiliCID: stringValue(episode.cid)
    },
    action: { type: 'detail', itemId: 'pgc:ep:' + epId }
  };
}

function dynamicVideoItem(raw, rank) {
  raw = raw || {};
  const modules = raw.modules || {};
  const author = modules.module_author || {};
  const dynamic = modules.module_dynamic || {};
  const major = dynamic.major || {};
  const archive = major.archive || ((raw.orig || {}).modules || {}).module_dynamic && (((raw.orig || {}).modules || {}).module_dynamic.major || {}).archive;
  if (!archive) return null;
  return videoItem({
    bvid: archive.bvid,
    aid: archive.aid,
    title: archive.title,
    pic: archive.cover,
    desc: archive.desc || (dynamic.desc && dynamic.desc.text),
    duration: archive.duration_text,
    owner: { mid: author.mid, name: author.name, face: author.face },
    stat: archive.stat || {},
    pubdate: author.pub_ts,
    tname: '关注动态'
  }, rank, 'following');
}

function favoriteVideoItem(raw, rank) {
  raw = raw || {};
  if (raw.type !== undefined && Number(raw.type) !== 2) return null;
  return videoItem({
    bvid: raw.bvid || raw.bv_id,
    aid: raw.id,
    title: raw.title,
    cover: raw.cover,
    intro: raw.intro,
    duration: raw.duration,
    upper: raw.upper,
    cnt_info: raw.cnt_info,
    dimension: raw.ugc && raw.ugc.dimension,
    pubdate: raw.ctime
  }, rank, 'favorite');
}

function watchLaterItem(raw, rank) {
  raw = raw || {};
  return videoItem(raw, rank, 'watchlater');
}

function historyVideoItem(raw, rank) {
  raw = raw || {};
  const history = raw.history || {};
  const business = stringValue(history.business || 'archive').toLowerCase();
  if (business === 'pgc') return historyPGCItem(raw, history, rank);
  if (business !== 'archive') return null;
  return videoItem({
    bvid: history.bvid,
    aid: history.oid,
    title: raw.title,
    pic: raw.cover || raw.pic || arrayValue(raw.covers)[0],
    desc: raw.show_title,
    duration: raw.duration,
    owner: { mid: raw.author_mid, name: raw.author_name, face: raw.author_face },
    stat: raw.stat,
    pubdate: raw.view_at,
    tname: raw.progress >= 0 ? ('看到 ' + formatDuration(raw.progress)) : '已看完'
  }, rank, 'history');
}

function historyPGCItem(raw, history, rank) {
  const episodeId = stringValue(history.epid || raw.epid || raw.episode_id);
  const seasonId = stringValue(raw.season_id || history.season_id || history.oid);
  const itemId = episodeId
    ? 'pgc:ep:' + episodeId
    : (seasonId ? pgcSeasonItemId(seasonId) : '');
  if (!itemId) return null;

  const title = cleanText(raw.title || raw.season_title);
  const image = imageURL(raw.cover || raw.pic || arrayValue(raw.covers)[0]);
  const progress = numberValue(raw.progress, -1);
  const progressText = progress < 0
    ? '已看完'
    : (progress > 0 ? '看到 ' + formatDuration(progress) : '尚未观看');
  const categoryText = cleanText(raw.badge || raw.badge_text || raw.tag_name || '番剧影视');
  const typeSignal = joinText([categoryText, raw.show_title, raw.title]);

  return {
    id: itemId,
    title: title || 'B 站番剧影视',
    subtitle: joinText([cleanText(raw.show_title), progressText]),
    metadataText: joinText([categoryText, yearFromTimestamp(raw.view_at)]),
    type: /电影/.test(typeSignal) ? 'movie' : 'series',
    poster: image,
    backdrop: image,
    overview: cleanText(raw.show_title || raw.desc),
    rank,
    remarks: progressText,
    badges: uniqueStrings([categoryText, cleanText(raw.show_title)]).slice(0, 2),
    aspectRatio: '16:9',
    imageHeaders: imageHeaders(),
    posterHeaders: imageHeaders(),
    backdropHeaders: imageHeaders(),
    providerIds: {
      BilibiliSeasonID: seasonId,
      BilibiliEpisodeID: episodeId,
      BilibiliCID: stringValue(history.cid)
    },
    action: { type: 'detail', itemId }
  };
}

function favoriteFolderItem(folder, rank) {
  folder = folder || {};
  const id = stringValue(folder.id || folder.fid);
  const cover = imageURL(folder.cover) || BILIBILI_ICON;
  return {
    id: 'favorite:' + id,
    title: cleanText(folder.title) || '收藏夹',
    subtitle: numberValue(folder.media_count, 0) + ' 个内容',
    metadataText: folder.fav_state ? '已收藏' : '我的收藏夹',
    type: 'collection',
    poster: cover,
    backdrop: cover,
    rank,
    aspectRatio: '16:9',
    imageFit: folder.cover ? 'fill' : 'fit',
    imageHeaders: imageHeaders(),
    previewItems: [],
    action: categoryAction('favorite:' + id, cleanText(folder.title) || '收藏夹')
  };
}

function creatorItem(creator, rank) {
  creator = creator || {};
  const mid = stringValue(creator.mid);
  const cover = imageURL(creator.face) || BILIBILI_ICON;
  return {
    id: 'up:' + mid,
    title: cleanText(creator.uname || creator.name) || ('UP ' + mid),
    subtitle: cleanText(creator.sign) || 'B 站 UP 主',
    metadataText: creator.special === 1 ? '特别关注' : '已关注',
    type: 'collection',
    poster: cover,
    backdrop: cover,
    rank,
    aspectRatio: '1:1',
    imageFit: 'fit',
    imageHeaders: imageHeaders(),
    previewItems: [],
    action: categoryAction('up:' + mid, cleanText(creator.uname || creator.name) || 'UP 主')
  };
}

function contentEntry(pageId) {
  if (pageId === 'more-regions') {
    return quickEntry(pageId, '更多', '生活与动物等内容分区', false);
  }
  const parts = stringValue(pageId).split(':');
  const value = numberValue(parts[1], 0);
  const definition = parts[0] === 'pgc' ? PGC_CATEGORIES[value] : REGION_CATEGORIES[value];
  return quickEntry(
    pageId,
    definition && definition.title || '内容分区',
    definition && definition.subtitle || '浏览 B 站分区内容',
    false
  );
}

function entryGroupItems(pageId) {
  if (pageId === 'content-groups') {
    return [
      quickEntry('popular', '热门', '全站热门视频', false),
      quickEntry('following', '动态', '关注 UP 的最新投稿', true)
    ].concat(PRIMARY_CONTENT_ENTRIES.map(contentEntry));
  }
  if (pageId === 'account-groups') {
    return [
      quickEntry('pgc-follow:1', '追番', '我追过的番剧', true),
      quickEntry('pgc-follow:2', '追剧', '我追过的影视', true),
      quickEntry('favorites', '收藏夹', '浏览自己的收藏分组', true),
      quickEntry('watchlater', '稍后再看', '账号稍后再看列表', true),
      quickEntry('history', '历史记录', '继续浏览看过的视频', true),
      quickEntry('creators', '关注 UP', '按 UP 主浏览投稿', true),
      quickEntry('ranking', '排行榜', '全站综合排行榜', false)
    ];
  }
  return [];
}

function quickEntry(pageId, title, subtitle, requiresLogin) {
  const targetAspectRatio = pageId.indexOf('pgc:') === 0 || pageId.indexOf('pgc-follow:') === 0 ? '3:4' : '16:9';
  return {
    id: 'quick:' + pageId,
    title,
    subtitle,
    metadataText: requiresLogin ? '需要登录' : '公开内容',
    type: 'collection',
    poster: BILIBILI_ICON,
    backdrop: BILIBILI_ICON,
    aspectRatio: '16:9',
    imageFit: 'fit',
    imageHeaders: imageHeaders(),
    previewItems: [],
    action: categoryAction(pageId, title, targetAspectRatio)
  };
}

function categoryAction(pageId, title, itemAspectRatio) {
  return { type: 'category', pageId, title, itemAspectRatio: itemAspectRatio || '16:9' };
}

function categoryPage(id, title, page, items, hasMore, style, itemAspectRatio) {
  return {
    pageType: 'category',
    id,
    title,
    style: style || 'media.posterGrid',
    itemAspectRatio: itemAspectRatio || '16:9',
    page,
    hasMore: !!hasMore,
    items: items || []
  };
}

function pagedLocalCategory(id, title, page, allItems, pageSize) {
  const start = (page - 1) * pageSize;
  return categoryPage(id, title, page, allItems.slice(start, start + pageSize), start + pageSize < allItems.length, 'media.posterGrid');
}

function emptySection(id, title, style, subtitle) {
  return {
    id: id || 'bili-empty',
    title: title || '哔哩哔哩',
    style: style || 'discover.standard',
    subtitle: subtitle || '暂无内容',
    lazy: false,
    items: []
  };
}

function readConfig(ctx) {
  ctx = ctx || {};
  const params = ctx.params || ctx.config || ctx.settings || ctx.parameters || {};
  const rawCookie = stringValue(params.Cookie || params.cookie || ctx.Cookie || ctx.cookie).trim();
  const cookie = rawCookie.replace(/^cookie\s*:\s*/i, '').replace(/^['"]|['"]$/g, '').trim();
  return {
    cookie,
    accessToken: stringValue(params.AccessToken || params.accessToken || ctx.AccessToken || ctx.accessToken).trim(),
    refreshToken: stringValue(params.RefreshToken || params.refreshToken || ctx.RefreshToken || ctx.refreshToken).trim(),
    tokenExpiresAt: numberValue(params.TokenExpiresAt || params.tokenExpiresAt || ctx.TokenExpiresAt || ctx.tokenExpiresAt, 0),
    maxQuality: normalizeQuality(params.maxQuality || params.quality || ctx.maxQuality || 127)
  };
}

function requireCookie(config) {
  if (!config || !config.cookie || config.cookie.indexOf('SESSDATA=') < 0) {
    throw loginError('请在右上角设置中填写包含 SESSDATA 的 B 站 Cookie');
  }
}

function loginError(message) {
  const error = new Error(message);
  error.code = 'LOGIN_REQUIRED';
  return error;
}

function humanError(error) {
  const message = cleanText(error && error.message ? error.message : error);
  return message || '加载失败，请稍后重试';
}

function searchSuccess(data) {
  return { data: data || {}, error: null };
}

function searchFailure(error) {
  return { data: null, error };
}

function pgcPlaybackError(root) {
  const code = numberValue(root && root.code, -1);
  const sourceMessage = cleanText(root && (root.message || root.msg));
  if (code === -10403) return new Error('该内容需要大会员或单独购买后才能播放');
  if (code === -101) return loginError('该内容需要先登录 B 站账号');
  if (code === -403) return new Error('B 站拒绝了该内容的播放请求');
  if (code === -404) return new Error('B 站剧集或播放资源不存在');
  if (code === -352) return new Error('B 站播放接口触发风控，请确认 Cookie 包含 buvid3 后重试');
  return new Error('B 站 PGC 播放接口错误 ' + code + '：' + (sourceMessage || '请求失败'));
}

function parsePGCCast(value) {
  return stringValue(value).split(/\r?\n/).map(function (line) {
    const text = cleanText(line);
    if (!text) return null;
    const parts = text.split(/[:：]/);
    if (parts.length < 2) return { name: text };
    const role = cleanText(parts.shift());
    const name = cleanText(parts.join('：'));
    return name ? { name, role } : { name: role };
  }).filter(Boolean).slice(0, 40);
}

function availableQualities(playInfo, maxQuality) {
  const dashQualities = uniqueNumbers(arrayValue(playInfo && playInfo.dash && playInfo.dash.video).map(function (track) {
    return numberValue(track && track.id, 0);
  }).filter(function (value) {
    return value > 0 && value <= maxQuality;
  }));
  if (dashQualities.length) return dashQualities.sort(function (a, b) { return b - a; });

  const accepted = arrayValue(playInfo && playInfo.accept_quality).map(Number).filter(function (value) {
    return isFinite(value) && value > 0 && value <= maxQuality;
  });
  const actual = numberValue(playInfo && playInfo.quality, 0);
  if (actual > 0 && actual <= maxQuality && accepted.indexOf(actual) < 0) accepted.push(actual);
  if (!accepted.length) accepted.push(actual || Math.min(maxQuality, 64));
  return uniqueNumbers(accepted).sort(function (a, b) { return b - a; });
}

function qualitySubtitle(quality, playInfo) {
  const formats = arrayValue(playInfo && playInfo.support_formats);
  const format = formats.filter(function (item) { return Number(item.quality) === Number(quality); })[0];
  const video = selectDASHVideoTrack(playInfo && playInfo.dash, quality);
  const parts = [cleanText(format && (format.new_description || format.display_desc))];
  if (video && video.codecs) parts.push(dashCodecName(video.codecs));
  if (video && numberValue(video.bandwidth, 0) > 0) parts.push(formatBitrate(video.bandwidth));
  return uniqueStrings(parts).join(' · ') || 'DASH 分轨播放';
}

function qualityName(quality) {
  return QUALITY_NAMES[quality] || (quality + 'P');
}

function normalizeQuality(value) {
  const quality = numberValue(value, 127);
  const supported = [127, 126, 125, 120, 116, 112, 80, 74, 64, 32, 16];
  if (supported.indexOf(quality) >= 0) return quality;
  return 127;
}

function buildDASHPlayback(playInfo, quality, headers) {
  const dash = playInfo && playInfo.dash;
  const video = selectDASHVideoTrack(dash, quality);
  if (!video) return null;
  const audios = selectDASHAudioTracks(dash);
  const durationSeconds = dashDurationSeconds(playInfo, dash, video, audios[0]);
  const fallbackURL = singleLegacyDURL(playInfo);
  return {
    url: fallbackURL,
    container: 'm3u8',
    headers: headers || {},
    isLive: false,
    streamKind: 'vod',
    dash: {
      durationSeconds,
      videoTracks: [dashStreamDescriptor(video, quality, durationSeconds, true)],
      audioTracks: audios.map(function (audio) {
        return dashStreamDescriptor(audio, audio.id, durationSeconds, false);
      })
    }
  };
}

function buildLegacyMP4Playback(playInfo, headers, subject) {
  const durl = arrayValue(playInfo && (playInfo.durl || playInfo.durls));
  if (!durl.length) throw new Error((subject || 'B 站') + '没有返回可播放的 DASH 或 MP4 地址');
  if (durl.length > 1) throw new Error((subject || 'B 站') + '使用多个旧式 MP4 分段，当前暂不支持无损连续播放');
  const stream = durl[0] || {};
  const url = mediaURL(stream.url || arrayValue(stream.backup_url || stream.backupUrl)[0]);
  if (!url) throw new Error((subject || 'B 站') + '返回的播放地址为空');
  return {
    url,
    container: 'mp4',
    headers: headers || {},
    isLive: false,
    streamKind: 'vod'
  };
}

function copyPlaybackResumeFields(playInfo, result) {
  playInfo = playInfo || {};
  result = result || {};
  ['last_play_time', 'last_play_cid', 'lastPlayTime', 'lastPlayCid'].forEach(function (key) {
    if (playInfo[key] == null && result[key] != null) playInfo[key] = result[key];
  });
  return playInfo;
}

function applyPlaybackResume(playback, playInfo, cid) {
  const lastCID = stringValue(playInfo && (playInfo.last_play_cid || playInfo.lastPlayCid));
  const lastTime = numberValue(playInfo && (playInfo.last_play_time || playInfo.lastPlayTime), 0);
  if (playback && lastTime > 0 && (!lastCID || lastCID === stringValue(cid))) {
    playback.startPositionSeconds = lastTime / 1000;
  }
  return playback;
}

function playbackProgressFromPlayInfo(playInfo, context) {
  playInfo = playInfo || {};
  context = context || {};
  const lastTime = numberValue(playInfo.last_play_time || playInfo.lastPlayTime, 0);
  if (!(lastTime > 0)) return undefined;

  const lastCID = stringValue(playInfo.last_play_cid || playInfo.lastPlayCid);
  const expectedCID = stringValue(context.expectedCID);
  if (expectedCID && lastCID && lastCID !== expectedCID) return undefined;

  return {
    itemId: stringValue(context.itemId) || undefined,
    seasonId: stringValue(context.seasonId) || undefined,
    episodeId: expectedCID
      ? (stringValue(context.episodeId) || undefined)
      : (lastCID || stringValue(context.episodeId) || undefined),
    positionSeconds: lastTime / 1000,
    durationSeconds: numberValue(context.durationSeconds, 0) || undefined,
    completed: false
  };
}

function enrichUGCPlaybackProgress(progress, bvid, pages, totalDurationSeconds) {
  if (!progress || !(numberValue(progress.positionSeconds, 0) > 0)) return undefined;
  const result = Object.assign({}, progress, { itemId: bvid });
  const episodeId = stringValue(result.episodeId);
  const matchedPage = arrayValue(pages).filter(function (page) {
    return stringValue(page && page.cid) === episodeId;
  })[0];
  const duration = numberValue(matchedPage && matchedPage.duration, 0)
    || (arrayValue(pages).length <= 1 ? numberValue(totalDurationSeconds, 0) : 0);
  if (duration > 0) result.durationSeconds = duration;
  return result;
}

function pgcSeasonPlaybackProgress(seasonInfo, seasonId, episodes) {
  seasonInfo = seasonInfo || {};
  const userStatus = seasonInfo.user_status || seasonInfo.userStatus || {};
  const progress = userStatus.progress || userStatus.watch_progress || userStatus.watchProgress;
  if (!progress || typeof progress !== 'object') return undefined;

  const episodeId = stringValue(
    progress.last_ep_id || progress.lastEpId || progress.ep_id || progress.epId || progress.episode_id
  );
  const lastTimeMilliseconds = numberValue(
    progress.last_time || progress.lastTime || progress.played_time || progress.playedTime,
    0
  );
  if (!episodeId || !(lastTimeMilliseconds > 0)) return undefined;

  const episode = arrayValue(episodes).filter(function (item) {
    return stringValue(item && (item.id || item.ep_id)) === episodeId;
  })[0];
  const duration = pgcDurationSeconds(episode && episode.duration);
  return {
    itemId: pgcSeasonItemId(seasonId),
    seasonId: stringValue(seasonId) || undefined,
    episodeId,
    positionSeconds: lastTimeMilliseconds / 1000,
    durationSeconds: duration > 0 ? duration : undefined,
    completed: false
  };
}

function attachDanmaku(playback, cid, config, referer) {
  const resolvedCID = stringValue(cid);
  if (!playback || !resolvedCID) return playback;
  const headers = {
    Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8',
    Referer: referer || BILIBILI_SITE,
    'User-Agent': BILIBILI_UA
  };
  if (config && config.cookie) headers.Cookie = config.cookie;
  playback.danmaku = {
    url: 'https://comment.bilibili.com/' + encodeURIComponent(resolvedCID) + '.xml',
    format: 'bilibili-xml',
    sourceName: 'B站',
    headers
  };
  return playback;
}

function selectDASHVideoTrack(dash, quality) {
  const videos = arrayValue(dash && dash.video).filter(validDASHStream);
  if (!videos.length) return null;
  const availableIds = uniqueNumbers(videos.map(function (track) { return numberValue(track.id, 0); }).filter(Boolean));
  let selectedQuality = numberValue(quality, 0);
  if (availableIds.indexOf(selectedQuality) < 0) {
    const lower = availableIds.filter(function (id) { return id <= selectedQuality; }).sort(function (a, b) { return b - a; });
    selectedQuality = lower[0] || availableIds.sort(function (a, b) { return b - a; })[0];
  }
  const tracks = videos.filter(function (track) {
    return numberValue(track.id, 0) === selectedQuality && isAppleCompatibleVideoCodec(track.codecs);
  });
  const candidates = tracks.length ? tracks : videos.filter(function (track) {
    return numberValue(track.id, 0) === selectedQuality;
  });
  const preferHEVC = selectedQuality >= 120;
  return candidates.sort(function (left, right) {
    const codecDifference = dashVideoCodecScore(right.codecs, preferHEVC) - dashVideoCodecScore(left.codecs, preferHEVC);
    if (codecDifference) return codecDifference;
    return numberValue(right.bandwidth, 0) - numberValue(left.bandwidth, 0);
  })[0] || null;
}

function selectDASHAudioTracks(dash) {
  const dolby = arrayValue(dash && dash.dolby && dash.dolby.audio);
  const flac = dash && dash.flac && dash.flac.audio ? [dash.flac.audio] : [];
  const tracks = arrayValue(dash && dash.audio).concat(dolby, flac).filter(validDASHStream);
  const bestByFamily = {};
  tracks.forEach(function (track) {
    const family = dashAudioCodecFamily(track.codecs);
    const existing = bestByFamily[family];
    if (!existing || numberValue(track.bandwidth, 0) > numberValue(existing.bandwidth, 0)) {
      bestByFamily[family] = track;
    }
  });
  const priority = { aac: 0, dolby: 1, flac: 2 };
  return Object.keys(bestByFamily).map(function (family) {
    const track = bestByFamily[family];
    track.__baiPlayAudioFamily = family;
    return track;
  }).sort(function (left, right) {
    const leftPriority = priority[left.__baiPlayAudioFamily] === undefined ? 9 : priority[left.__baiPlayAudioFamily];
    const rightPriority = priority[right.__baiPlayAudioFamily] === undefined ? 9 : priority[right.__baiPlayAudioFamily];
    return leftPriority - rightPriority;
  });
}

function dashStreamDescriptor(track, id, durationSeconds, isVideo) {
  const segmentBase = track.segment_base || track.segmentBase || {};
  return {
    id: stringValue(id || track.id),
    name: isVideo ? undefined : dashAudioTrackName(track),
    language: isVideo ? undefined : cleanText(track.lang || track.language || track.lang_key) || 'und',
    url: mediaURL(track.base_url || track.baseUrl || track.url),
    fallbackURLs: arrayValue(track.backup_url || track.backupUrl).map(mediaURL).filter(Boolean),
    codec: cleanText(track.codecs || track.codec),
    mimeType: cleanText(track.mime_type || track.mimeType) || (isVideo ? 'video/mp4' : 'audio/mp4'),
    bandwidth: numberValue(track.bandwidth, 0),
    width: isVideo ? numberValue(track.width, 0) : undefined,
    height: isVideo ? numberValue(track.height, 0) : undefined,
    frameRate: isVideo ? stringValue(track.frame_rate || track.frameRate) : undefined,
    videoRange: isVideo ? dashVideoRange(numberValue(id || track.id, 0)) : undefined,
    durationSeconds,
    segmentBase: {
      initialization: stringValue(segmentBase.initialization),
      indexRange: stringValue(segmentBase.index_range || segmentBase.indexRange)
    }
  };
}

function validDASHStream(track) {
  if (!track) return false;
  const segmentBase = track.segment_base || track.segmentBase || {};
  return !!mediaURL(track.base_url || track.baseUrl || track.url) &&
    /^\d+-\d+$/.test(stringValue(segmentBase.initialization)) &&
    /^\d+-\d+$/.test(stringValue(segmentBase.index_range || segmentBase.indexRange));
}

function isAppleCompatibleVideoCodec(value) {
  return /^(avc1|avc3|hev1|hvc1|dvh1|dvhe)/i.test(stringValue(value));
}

function dashVideoCodecScore(value, preferHEVC) {
  const codec = stringValue(value).toLowerCase();
  if (/^(dvh1|dvhe)/.test(codec)) return preferHEVC ? 5 : 2;
  if (/^(hev1|hvc1)/.test(codec)) return preferHEVC ? 4 : 2;
  if (/^(avc1|avc3)/.test(codec)) return preferHEVC ? 3 : 5;
  if (/^av01/.test(codec)) return 1;
  return 0;
}

function dashCodecName(value) {
  const codec = stringValue(value).toLowerCase();
  if (/^(dvh1|dvhe)/.test(codec)) return 'Dolby Vision';
  if (/^(hev1|hvc1)/.test(codec)) return 'HEVC';
  if (/^(avc1|avc3)/.test(codec)) return 'H.264';
  if (/^av01/.test(codec)) return 'AV1';
  return cleanText(value);
}

function dashAudioCodecFamily(value) {
  const codec = stringValue(value).toLowerCase();
  if (/^(mp4a|aac)/.test(codec)) return 'aac';
  if (/^(ec-3|ac-3|eac3|ac3)/.test(codec)) return 'dolby';
  if (/flac/i.test(codec)) return 'flac';
  return codec.split('.')[0] || 'audio';
}

function dashAudioTrackName(track) {
  const family = track && track.__baiPlayAudioFamily || dashAudioCodecFamily(track && track.codecs);
  const bitrate = formatBitrate(track && track.bandwidth);
  if (family === 'aac') return joinText(['AAC', bitrate]);
  if (family === 'dolby') return joinText(['Dolby Audio', bitrate]);
  if (family === 'flac') return joinText(['Hi-Res FLAC', bitrate]);
  return joinText([cleanText(track && track.codecs) || '音轨', bitrate]);
}

function dashVideoRange(quality) {
  return quality === 125 || quality === 126 ? 'PQ' : undefined;
}

function dashDurationSeconds(playInfo, dash, video, audio) {
  const dashDuration = numberValue(dash && dash.duration, 0);
  if (dashDuration > 0) return dashDuration;
  const trackDuration = numberValue(video && video.duration || audio && audio.duration, 0);
  if (trackDuration > 0) return trackDuration;
  const milliseconds = numberValue(playInfo && (playInfo.timelength || playInfo.time_length), 0);
  return milliseconds > 0 ? milliseconds / 1000 : undefined;
}

function singleLegacyDURL(playInfo) {
  const durl = arrayValue(playInfo && (playInfo.durl || playInfo.durls));
  if (durl.length !== 1) return '';
  return mediaURL(durl[0] && (durl[0].url || arrayValue(durl[0].backup_url || durl[0].backupUrl)[0]));
}

function formatBitrate(value) {
  const bits = numberValue(value, 0);
  if (bits >= 1000000) return trimDecimal(bits / 1000000) + ' Mbps';
  if (bits >= 1000) return Math.round(bits / 1000) + ' Kbps';
  return bits > 0 ? bits + ' bps' : '';
}

function normalizeFavoriteSort(value) {
  value = stringValue(value).toLowerCase();
  return ['mtime', 'pubtime', 'view'].indexOf(value) >= 0 ? value : 'mtime';
}

function normalizeCreatorSort(value) {
  value = stringValue(value).toLowerCase();
  return ['pubdate', 'click', 'stow'].indexOf(value) >= 0 ? value : 'pubdate';
}

function categoryTitle(pageId) {
  if (pageId === 'content-groups') return '内容分区';
  if (pageId === 'account-groups') return '我的 B 站';
  if (pageId === 'popular') return '热门';
  if (pageId === 'ranking') return '排行榜';
  if (pageId === 'following') return '关注动态';
  if (pageId === 'favorites') return '收藏夹';
  if (pageId === 'watchlater') return '稍后再看';
  if (pageId === 'history') return '历史记录';
  if (pageId === 'creators') return '关注的 UP 主';
  if (pageId === 'more-regions') return '更多分区';
  if (pageId.indexOf('pgc-follow:') === 0) return pageId.slice('pgc-follow:'.length) === '2' ? '我的追剧' : '我的追番';
  if (pageId.indexOf('pgc:') === 0) {
    const pgcDefinition = PGC_CATEGORIES[numberValue(pageId.slice('pgc:'.length), 1)];
    return pgcDefinition && pgcDefinition.title || '番剧影视';
  }
  if (pageId.indexOf('region:') === 0) {
    const regionDefinition = REGION_CATEGORIES[numberValue(pageId.slice('region:'.length), 0)];
    return regionDefinition && regionDefinition.title || 'B 站分区';
  }
  return '哔哩哔哩';
}

function validVideoItem(item) {
  return !!(item && item.id && item.title && item.action && item.action.itemId);
}

function validPGCItem(item) {
  return !!(item && item.id && item.id !== 'pgc:ss:' && item.title && item.action && item.action.itemId);
}

function bvidFrom(value) {
  const match = stringValue(value).match(/BV[0-9A-Za-z]{10}/);
  return match ? match[0] : '';
}

function pgcReferenceFrom(value) {
  const text = stringValue(value);
  let match = text.match(/pgc:ss:(\d+)/i) || text.match(/(?:\/|\b)ss(\d+)/i);
  if (match) return { seasonId: match[1], episodeId: '' };
  match = text.match(/pgc:ep:(\d+)/i) || text.match(/(?:\/|\b)ep(\d+)/i);
  if (match) return { seasonId: '', episodeId: match[1] };
  return null;
}

function pgcEpisodeIdFrom(value) {
  const text = stringValue(value);
  const match = text.match(/(?:pgc:ep:|\bep)?(\d+)/i);
  return match ? match[1] : '';
}

function pgcSeasonItemId(seasonId) {
  return 'pgc:ss:' + stringValue(seasonId);
}

function matchedPGCSeasonItemId(seasonId, seasonNumber) {
  return pgcSeasonItemId(seasonId) + ':match-season:' + Math.max(1, numberValue(seasonNumber, 1));
}

function matchedPGCSeasonNumberFrom(value) {
  const match = stringValue(value).match(/(?:^|:)match-season:(\d+)(?:$|:)/i);
  return match ? Math.max(1, numberValue(match[1], 1)) : 0;
}

function videoReferer(bvid) {
  return 'https://www.bilibili.com/video/' + bvid;
}

function pgcReferer(episodeId, seasonId) {
  if (episodeId) return 'https://www.bilibili.com/bangumi/play/ep' + episodeId;
  return 'https://www.bilibili.com/bangumi/play/ss' + seasonId;
}

function imageURL(value) {
  const text = stringValue(value).trim();
  if (!text) return '';
  if (text.indexOf('//') === 0) return 'https:' + text;
  return text.replace(/^http:\/\//i, 'https://');
}

function mediaURL(value) {
  return imageURL(value);
}

function aspectRatioFromDimension(dimension) {
  const width = numberValue(dimension && dimension.width, 0);
  const height = numberValue(dimension && dimension.height, 0);
  if (width > 0 && height > 0) return width + ':' + height;
  return '16:9';
}

function durationSeconds(value) {
  if (typeof value === 'number') return Math.max(0, value);
  const text = stringValue(value).trim();
  if (!text) return 0;
  if (/^\d+$/.test(text)) return Number(text);
  const parts = text.split(':').map(Number);
  if (parts.some(function (part) { return !isFinite(part); })) return 0;
  return parts.reduce(function (total, part) { return total * 60 + part; }, 0);
}

function pgcDurationSeconds(value) {
  const duration = numberValue(value, 0);
  return duration > 10000 ? duration / 1000 : duration;
}

function formatDuration(seconds) {
  seconds = Math.max(0, Math.round(numberValue(seconds, 0)));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) return hours + ':' + pad2(minutes) + ':' + pad2(rest);
  return minutes + ':' + pad2(rest);
}

function formatCount(value) {
  const number = numberValue(value, 0);
  if (number >= 100000000) return trimDecimal(number / 100000000) + '亿';
  if (number >= 10000) return trimDecimal(number / 10000) + '万';
  if (number > 0) return String(Math.round(number));
  return '';
}

function trimDecimal(value) {
  return (Math.round(value * 10) / 10).toFixed(value >= 100 ? 0 : 1).replace(/\.0$/, '');
}

function yearFromTimestamp(value) {
  const timestamp = numberValue(value, 0);
  if (!timestamp) return undefined;
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  return year > 1980 && year < 2200 ? year : undefined;
}

function yearFromDateText(value) {
  const match = stringValue(value).match(/(?:19|20)\d{2}/);
  return match ? numberValue(match[0], undefined) : undefined;
}

function absoluteURL(path, params) {
  const base = /^https?:\/\//i.test(path) ? path : BILIBILI_API + (path.charAt(0) === '/' ? path : '/' + path);
  const query = Object.keys(params || {}).filter(function (key) { return params[key] !== undefined && params[key] !== null && params[key] !== ''; }).map(function (key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(stringValue(params[key]));
  }).join('&');
  return query ? base + (base.indexOf('?') >= 0 ? '&' : '?') + query : base;
}

function keyFromWbiURL(value) {
  const match = stringValue(value).match(/\/([^/?]+)\.[A-Za-z0-9]+(?:\?|$)/);
  return match ? match[1] : '';
}

function md5Hex(value) {
  const text = stringValue(value);
  if (typeof $crypto !== 'undefined' && $crypto && typeof $crypto.md5 === 'function') return stringValue($crypto.md5(text));
  if (typeof Widget !== 'undefined' && Widget.crypto && typeof Widget.crypto.md5 === 'function') return stringValue(Widget.crypto.md5(text));
  if (typeof require === 'function') return require('crypto').createHash('md5').update(text).digest('hex');
  throw new Error('当前小程序环境缺少 MD5 能力');
}

function encodePlayPayload(payload) {
  return 'bilibili-play:' + base64Encode(JSON.stringify(payload || {}));
}

function decodePlayPayload(value) {
  const text = stringValue(value);
  if (text.indexOf('bilibili-play:') !== 0) return {};
  try { return JSON.parse(base64Decode(text.slice('bilibili-play:'.length))); } catch (_) { return {}; }
}

function base64Encode(value) {
  const text = stringValue(value);
  if (typeof $utils !== 'undefined' && $utils && typeof $utils.base64Encode === 'function') return stringValue($utils.base64Encode(text));
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'utf8').toString('base64');
  if (typeof btoa === 'function') return btoa(unescape(encodeURIComponent(text)));
  throw new Error('当前小程序环境缺少 Base64 编码能力');
}

function base64Decode(value) {
  const text = stringValue(value);
  if (typeof $utils !== 'undefined' && $utils && typeof $utils.base64Decode === 'function') return stringValue($utils.base64Decode(text));
  if (typeof Buffer !== 'undefined') return Buffer.from(text, 'base64').toString('utf8');
  if (typeof atob === 'function') return decodeURIComponent(escape(atob(text)));
  throw new Error('当前小程序环境缺少 Base64 解码能力');
}

function cleanText(value) {
  return stringValue(value)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#039;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function joinText(values) {
  return (values || []).map(cleanText).filter(Boolean).join(' · ');
}

function uniqueStrings(values) {
  const seen = {};
  return (values || []).map(cleanText).filter(function (value) {
    if (!value || seen[value]) return false;
    seen[value] = true;
    return true;
  });
}

function uniqueNumbers(values) {
  const seen = {};
  return (values || []).filter(function (value) {
    const key = String(value);
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function stringValue(value) {
  if (value == null) return '';
  return String(value);
}

function numberValue(value, fallback) {
  const number = Number(value);
  return isFinite(number) ? number : fallback;
}

function pad2(value) {
  return value < 10 ? '0' + value : String(value);
}

function home(ctx) { return getHome(ctx || {}); }
function homeSection(ctx) { return getHomeSection(ctx || {}); }
function getSection(ctx) { return getHomeSection(ctx || {}); }
function section(ctx) { return getHomeSection(ctx || {}); }
function loadSection(ctx) { return getHomeSection(ctx || {}); }
function category(ctx) { return getCategory(ctx || {}); }
function catalog(ctx) { return getCategory(ctx || {}); }
function list(ctx) { return getCategory(ctx || {}); }
function detail(ctx) { return getDetail(ctx || {}); }
function resources(ctx) { return getResourceVersions(ctx || {}); }
function getVersions(ctx) { return getResourceVersions(ctx || {}); }
function versions(ctx) { return getResourceVersions(ctx || {}); }
function resolvePlay(ctx) { return resolvePlayback(ctx || {}); }
function play(ctx) { return resolvePlayback(ctx || {}); }
function getPlayinfo(ctx) { return resolvePlayback(ctx || {}); }
function getSearch(ctx) { return search(ctx || {}); }
function onSearch(ctx) { return search(ctx || {}); }

const BilibiliMiniLibrary = {
  WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  home,
  homeSection,
  getSection,
  section,
  loadSection,
  getCategory,
  category,
  catalog,
  list,
  getDetail,
  detail,
  getResourceVersions,
  resources,
  getVersions,
  versions,
  resolvePlayback,
  getPlaybackProgress,
  reportPlaybackProgress,
  resolvePlay,
  play,
  getPlayinfo,
  search,
  getSearch,
  onSearch,
  matchResources,
  matchMovie,
  matchEpisode,
  startAuthentication,
  pollAuthentication,
  logoutAuthentication
};

if (typeof module !== 'undefined' && module.exports) module.exports = BilibiliMiniLibrary;
if (typeof globalThis !== 'undefined') {
  Object.keys(BilibiliMiniLibrary).forEach(function (key) {
    globalThis[key] = BilibiliMiniLibrary[key];
  });
}
