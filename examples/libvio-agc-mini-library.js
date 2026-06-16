// @name LIBVIO AGC Mini Library

const LIBVIO_DEFAULT_BASE = 'https://www.libvio.lat';
const LIBVIO_DECRYPT_SALT = 'RY7e48naFXPsLJC';
const LIBVIO_API_URL = 'https://hd.ticktockwow.com/smartplay-cache/api/webvideo_ty.php';
const LIBVIO_LOGO = 'https://www.libvio.lat/favicon.ico';
const LIBVIO_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const LIBVIO_TYPES = [
  { id: 1, alias: 'movie', title: '电影', type: 'movie', style: 'discover.spotlight' },
  { id: 2, alias: 'drama', title: '电视剧', type: 'series', style: 'discover.ranked' },
  { id: 3, alias: 'doc', title: '纪录片', type: 'movie', style: 'discover.posterCompact' },
  { id: 4, alias: 'anime', title: '动漫', type: 'series', style: 'discover.editorial' },
  { id: 5, alias: 'tvshow', title: '综艺', type: 'series', style: 'discover.posterCompact' },
  { id: 13, alias: 'cn', title: '国产剧', type: 'series', style: 'discover.ranked' },
  { id: 15, alias: 'jp', title: '日韩剧', type: 'series', style: 'discover.posterCompact' },
  { id: 16, alias: 'us', title: '欧美剧', type: 'series', style: 'discover.posterCompact' }
];

function getManifest() {
  return {
    id: 'libvio-agc-mini-library',
    name: 'LIBVIO',
    title: 'LIBVIO',
    version: '1.0.0',
    author: 'baiPlay',
    logo: LIBVIO_LOGO,
    icon: LIBVIO_LOGO,
    site: LIBVIO_DEFAULT_BASE,
    description: '由 AGC Player video-libvio 小程序改写的 baiPlay 自定义媒体库，支持分类、搜索、详情、选集、线路切换和播放解析。',
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      playback: true,
      resourceVersions: true,
      aggregation: true,
      playbackHistory: true,
      resourceMatching: false,
      resourceMatch: {
        enabled: false,
        parameters: [
          'tmdbId',
          'imdbId',
          'tvdbId',
          'title',
          'originalTitle',
          'alternativeTitles',
          'year',
          'mediaType',
          'seasonNumber',
          'episodeNumber',
          'episodeTitle'
        ]
      }
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    },
    parameters: [
      {
        name: 'baseURL',
        title: '站点地址',
        type: 'input',
        defaultValue: LIBVIO_DEFAULT_BASE,
        required: true,
        description: 'LIBVIO 当前可访问域名。'
      }
    ]
  };
}

function getHome(ctx) {
  const base = baseURL(ctx);
  const hero = safeFetchTypeItems(base, 2, 1, 8).map(function (item) {
    item.aspectRatio = '2:3';
    return item;
  });

  return {
    pageType: 'home',
    id: 'libvio-home',
    title: 'LIBVIO',
    heroAspectRatio: '2:3',
    hero: hero,
    sections: [
      {
        id: 'libvio-category-entry',
        title: '分类入口',
        style: 'discover.annualWidePreview',
        lazy: true,
        loadAction: { type: 'custom', id: 'libvio-category-entry', title: '分类入口' },
        items: LIBVIO_TYPES.map(function (type) {
          return categoryEntry(base, type, []);
        })
      }
    ].concat(
      LIBVIO_TYPES.map(function (type) {
        return {
          id: 'libvio-type-' + type.id,
          title: type.title,
          style: type.style || 'discover.standard',
          lazy: true,
          loadAction: { type: 'custom', id: 'libvio-type-' + type.id, title: type.title, typeId: type.id },
          moreAction: categoryAction(type),
          items: []
        };
      })
    )
  };
}

function getHomeSection(ctx) {
  const base = baseURL(ctx);
  const sectionId = stringValue(ctx && (ctx.sectionId || ctx.id));

  if (sectionId === 'libvio-category-entry') {
    return {
      id: 'libvio-category-entry',
      title: '分类入口',
      style: 'discover.annualWidePreview',
      lazy: false,
      items: LIBVIO_TYPES.map(function (type) {
        return categoryEntry(base, type, safeFetchTypeItems(base, type.id, 1, 4));
      })
    };
  }

  const typeId = numberValue((ctx && ctx.typeId) || sectionId.replace(/^libvio-type-/, ''), 1);
  const type = typeById(typeId) || LIBVIO_TYPES[0];
  return {
    id: 'libvio-type-' + type.id,
    title: type.title,
    style: type.style || 'discover.standard',
    lazy: false,
    moreAction: categoryAction(type),
    items: safeFetchTypeItems(base, type.id, 1, 18)
  };
}

function getCategory(ctx) {
  const base = baseURL(ctx);
  const pageId = stringValue(ctx && (ctx.pageId || ctx.id)) || 'type:1';
  const typeId = parseTypeId(pageId);
  const type = typeById(typeId) || LIBVIO_TYPES[0];
  const page = numberValue(ctx && ctx.page, 1);
  const response = fetchTypeList(base, type.id, page, 30);

  return {
    pageType: 'category',
    id: 'type:' + type.id,
    title: type.title,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: response.items,
    page: page,
    hasMore: page < response.pages
  };
}

function getDetail(ctx) {
  const base = baseURL(ctx);
  const parsed = parseItemRef(ctx && (ctx.itemId || ctx.id || ctx.vod_id));
  if (!parsed.vodId) {
    throw new Error('LIBVIO 详情参数无效');
  }

  const itemId = makeItemId(parsed.vodId, parsed.typeId);
  const detailURL = absoluteURL(base, '/detail/' + parsed.vodId + '.html');
  const html = fetchText(base, detailURL, { referer: base + '/' });
  const title = cleanTitle(
    firstNonEmpty(
      pickMetaTitle(html),
      firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
      firstMatch(html, /<title>([\s\S]*?)<\/title>/i),
      parsed.title,
      'LIBVIO'
    )
  );
  const poster = pickPoster(base, firstNonEmpty(
    firstMatch(html, /<div[^>]+class=["'][^"']*stui-content__thumb[^"']*["'][^>]*>([\s\S]*?)<\/div>/i),
    html
  ));
  const overview = cleanText(
    firstNonEmpty(
      firstMatch(html, /<span[^>]+class=["'][^"']*(?:detail-content|vod_content)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
      firstMatch(html, /<div[^>]+class=["'][^"']*(?:detail-content|vod_content|stui-content__desc)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i),
      labeledValue(html, ['简介', '剧情'])
    )
  );
  const groups = parsePlayGroups(base, html, itemId, '');
  const bestGroup = groups.slice().sort(function (a, b) {
    return (b.versions || []).length - (a.versions || []).length;
  })[0];
  const episodeCount = bestGroup && bestGroup.versions ? bestGroup.versions.length : 0;
  const declaredType = parsed.typeId ? (typeById(parsed.typeId) || {}).type : '';
  const mediaType = declaredType || (episodeCount > 1 ? 'series' : 'movie');
  const seasons = mediaType === 'series' ? buildSeasons(bestGroup, itemId) : [];
  const recommendations = parseVodList(base, html, parsed.typeId || 0)
    .filter(function (item) { return parseItemRef(item.id).vodId !== parsed.vodId; })
    .slice(0, 12);

  return {
    id: itemId,
    title: title,
    type: mediaType,
    poster: poster,
    backdrop: poster,
    year: numberValue(labeledValue(html, ['年份', '年代']) || firstMatch(html, /(?:年份|年代)[^0-9]*(\d{4})/i), undefined),
    genres: splitList(labeledValue(html, ['类型'])).concat((typeById(parsed.typeId) || {}).title || []).filter(Boolean),
    areas: splitList(labeledValue(html, ['地区'])),
    actors: splitPeople(labeledValue(html, ['主演'])),
    cast: splitPeople(labeledValue(html, ['主演'])).map(function (name) { return { name: name }; }),
    overview: overview,
    remarks: cleanText(firstNonEmpty(labeledValue(html, ['更新', '备注']), parsed.remarks)),
    seasons: seasons,
    resourceGroups: seasons.length ? [] : groups,
    recommendations: [
      {
        id: 'related',
        title: '相关推荐',
        style: 'discover.posterCompact',
        items: recommendations
      }
    ],
    metadata: {
      versionCount: groups.reduce(function (count, group) { return count + ((group.versions || []).length || 0); }, 0),
      sourceCount: groups.length
    },
    providerIds: { libvio: parsed.vodId }
  };
}

function getResourceVersions(ctx) {
  const base = baseURL(ctx);
  const parsed = parseItemRef(ctx && (ctx.itemId || ctx.id || ctx.vod_id));
  if (!parsed.vodId) return [];
  const itemId = makeItemId(parsed.vodId, parsed.typeId);
  const html = fetchText(base, absoluteURL(base, '/detail/' + parsed.vodId + '.html'), { referer: base + '/' });
  return parsePlayGroups(base, html, itemId, stringValue(ctx && ctx.episodeId));
}

function resolvePlayback(ctx) {
  const base = baseURL(ctx);
  const payload = decodePayload(ctx && (ctx.versionId || ctx.sourceId || ctx.id));
  const direct = firstNonEmpty(
    ctx && ctx.url,
    ctx && ctx.playUrl,
    ctx && ctx.play_url,
    payload.url,
    payload.playUrl
  );
  if (isDirectMediaURL(direct)) {
    return playback(absoluteURL(base, direct), direct, base);
  }

  const playPageURL = absoluteURL(base, direct || payload.url || payload.playUrl || '');
  if (!playPageURL) {
    throw new Error('LIBVIO 播放失败：缺少播放页地址');
  }

  const html = fetchText(base, playPageURL, { referer: detailReferer(base, payload.itemId) });
  const player = extractPlayerData(html);
  if (!player || !player.url) {
    const directURL = firstMatch(html, /(https?:\/\/[^"']+\.(?:m3u8|mp4|flv|mpd)[^"']*)/i);
    if (directURL) return playback(directURL, playPageURL, base);
    throw new Error('LIBVIO 没有解析到播放信息');
  }

  const from = stringValue(player.from).toLowerCase();
  if (from === 'quark' || from === 'baidu' || /网盘|云盘|夸克|百度|迅雷|阿里|uc/i.test(from)) {
    throw new Error('该线路是网盘资源，不支持直接播放，请切换其他线路');
  }

  let videoURL = stringValue(player.url);
  const encrypt = Number(player.encrypt || 0);
  if (encrypt === 1) {
    videoURL = safeDecodeURIComponent(videoURL);
  } else if (encrypt === 2) {
    videoURL = safeBase64Decode(videoURL);
  }

  if (isDirectMediaURL(videoURL)) {
    return playback(absoluteURL(base, videoURL), playPageURL, base);
  }

  if (isHexString(videoURL)) {
    const resolved = resolveHexPlayback(base, videoURL, playPageURL);
    if (resolved) return playback(resolved, playPageURL, base);
  }

  if (videoURL) {
    return playback(absoluteURL(base, videoURL), playPageURL, base);
  }
  throw new Error('LIBVIO 播放地址为空，请切换其他线路');
}

function search(ctx) {
  const base = baseURL(ctx);
  const query = stringValue(ctx && (ctx.query || ctx.text || ctx.keyword)).trim();
  const page = numberValue(ctx && ctx.page, 1);
  if (!query) {
    return { pageType: 'search', title: '搜索结果', style: 'media.posterGrid', items: [] };
  }
  const html = fetchText(
    base,
    '/search/' + encodeURIComponent(query) + '----------' + page + '---.html',
    { referer: base + '/' }
  );
  const items = parseVodList(base, html, 0);
  return {
    pageType: 'search',
    title: '搜索：' + query,
    style: 'media.posterGrid',
    itemAspectRatio: '2:3',
    items: items,
    page: page,
    hasMore: page < parsePagination(html, /----------(\d+)---\.html/g)
  };
}

function onSearch(ctx) {
  return search(ctx || {});
}

function getSearch(ctx) {
  return search(ctx || {});
}

function matchResources() {
  return { results: [] };
}

function matchMovie() {
  return matchResources();
}

function matchEpisode() {
  return matchResources();
}

function fetchTypeList(base, typeId, page, size) {
  const currentPage = numberValue(page, 1);
  const html = fetchText(base, '/type/' + typeId + '-' + currentPage + '.html', { referer: base + '/' });
  const pages = parsePagination(html, /\/type\/\d+-(\d+)\.html/g);
  return {
    page: currentPage,
    pages: pages,
    total: pages * numberValue(size, 30),
    items: parseVodList(base, html, typeId)
  };
}

function safeFetchTypeItems(base, typeId, page, limit) {
  try {
    return fetchTypeList(base, typeId, page || 1, limit || 12).items.slice(0, limit || 12);
  } catch (error) {
    print('LIBVIO category fetch failed: ' + (error && error.message ? error.message : error));
    return [];
  }
}

function fetchText(base, pathOrURL, options) {
  const url = absoluteURL(base, pathOrURL);
  const headers = Object.assign(
    {
      'User-Agent': LIBVIO_UA,
      Referer: (options && options.referer) || base + '/',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    (options && options.headers) || {}
  );
  const result = Widget.http.get(url, { headers: headers, timeout: 20 });
  const data = result && result.data;
  if (typeof data === 'string') return data;
  return JSON.stringify(data || {});
}

function postJSON(url, body, options) {
  const headers = Object.assign(
    {
      'User-Agent': LIBVIO_UA,
      Accept: 'application/json,text/plain,*/*',
      'Content-Type': 'application/json'
    },
    (options && options.headers) || {}
  );
  if (options && options.referer) headers.Referer = options.referer;
  const result = Widget.http.post(url, body || {}, { headers: headers, timeout: 20 });
  const data = result && result.data;
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch (error) { return { raw: data }; }
  }
  return data || {};
}

function parseVodList(base, html, typeId) {
  const text = String(html || '');
  let blocks = [];
  const listBlocks = collectTagBlocks(text, 'ul', /stui-vodlist/i);
  for (let i = 0; i < listBlocks.length; i += 1) {
    blocks = blocks.concat(collectTagBlocks(listBlocks[i], 'li', /./));
  }
  if (!blocks.length) {
    blocks = collectTagBlocks(text, 'div', /stui-vodlist__box|vodlist__box/i);
  }

  const seen = {};
  const items = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const item = parseVodItem(base, blocks[index], typeId, index + 1);
    if (!item || seen[item.id]) continue;
    seen[item.id] = true;
    items.push(item);
  }
  return items;
}

function parseVodItem(base, block, typeId, rank) {
  const href = firstNonEmpty(
    firstMatch(block, /href=["']([^"']*\/detail\/\d+\.html[^"']*)["']/i),
    firstMatch(block, /href=["']([^"']*\/voddetail\/\d+\.html[^"']*)["']/i)
  );
  const vodId = firstNonEmpty(
    firstMatch(href, /\/detail\/(\d+)\.html/i),
    firstMatch(href, /\/voddetail\/(\d+)\.html/i),
    firstMatch(block, /vod_id["']?\s*[:=]\s*["']?(\d+)/i)
  );
  if (!vodId) return null;

  const title = cleanTitle(firstNonEmpty(
    firstMatch(block, /title=["']([^"']+)["']/i),
    firstMatch(block, /alt=["']([^"']+)["']/i),
    firstMatch(block, /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i),
    firstMatch(block, /<a[^>]*>([\s\S]*?)<\/a>/i)
  ));
  const poster = pickPoster(base, block);
  const type = (typeById(typeId) || {}).type || inferType(title, block);
  const itemId = makeItemId(vodId, typeId);
  const remarks = cleanText(firstNonEmpty(
    firstMatch(block, /<span[^>]+class=["'][^"']*(?:pic-text|remarks|note|text-right|score)[^"']*["'][^>]*>([\s\S]*?)<\/span>/i),
    firstMatch(block, /<div[^>]+class=["'][^"']*(?:pic-text|remarks|note)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
  ));

  return {
    id: itemId,
    title: title || 'LIBVIO',
    type: type,
    poster: poster,
    backdrop: poster,
    subtitle: remarks || ((typeById(typeId) || {}).title || ''),
    overview: remarks || '',
    rank: rank,
    remarks: remarks,
    badges: [((typeById(typeId) || {}).title || '')].filter(Boolean),
    action: { type: 'detail', itemId: itemId, title: title },
    providerIds: { libvio: vodId }
  };
}

function parsePlayGroups(base, html, itemId, selectedEpisodeId) {
  const sourceTitles = parseSourceTitles(html);
  const containers = parsePlaylistContainers(html);
  const groups = [];
  for (let index = 0; index < containers.length; index += 1) {
    const container = containers[index];
    const title = cleanText(sourceTitles[container.number] || sourceTitles[index + 1] || container.title || ('线路 ' + (index + 1)));
    if (/网盘|云盘|夸克|百度|迅雷|阿里|uc/i.test(title)) continue;
    const links = parsePlaylistLinks(base, container.html, itemId, selectedEpisodeId);
    if (!links.length) continue;
    groups.push({
      id: 'line-' + (groups.length + 1),
      title: title || '线路 ' + (groups.length + 1),
      versions: links
    });
  }
  return groups;
}

function parseSourceTitles(html) {
  const titles = {};
  const pattern = /<a[^>]+href=["']#playlist(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(String(html || '')))) {
    titles[Number(match[1])] = cleanText(match[2]);
  }
  return titles;
}

function parsePlaylistContainers(html) {
  const text = String(html || '');
  const containers = [];
  const idPattern = /<div[^>]+id=["']playlist(\d+)["'][^>]*>/gi;
  let match;
  while ((match = idPattern.exec(text))) {
    const start = match.index;
    const next = findNextPlaylistStart(text, idPattern.lastIndex);
    const block = text.slice(start, next < 0 ? text.length : next);
    containers.push({
      number: Number(match[1]),
      title: nearestHeading(text.slice(Math.max(0, start - 900), start)),
      html: block
    });
  }
  if (containers.length) return containers;

  const openPattern = /<ul\b[^>]*class=["'][^"']*(?:stui-content__playlist|playlist)[^"']*["'][^>]*>/gi;
  let listMatch;
  while ((listMatch = openPattern.exec(text))) {
    const end = closingTagEnd(text, 'ul', openPattern.lastIndex);
    if (end < 0) continue;
    const block = text.slice(listMatch.index, end);
    containers.push({
      number: containers.length + 1,
      title: nearestHeading(text.slice(Math.max(0, listMatch.index - 900), listMatch.index)),
      html: block
    });
    openPattern.lastIndex = end;
  }
  return containers;
}

function findNextPlaylistStart(text, fromIndex) {
  const next = /<div[^>]+id=["']playlist\d+["'][^>]*>/i.exec(text.slice(fromIndex));
  return next ? fromIndex + next.index : -1;
}

function parsePlaylistLinks(base, html, itemId, selectedEpisodeId) {
  const versions = [];
  const pattern = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(String(html || '')))) {
    const href = absoluteURL(base, match[1]);
    if (!/\/play\/\d+-\d+-\d+\.html/i.test(href)) continue;
    const title = cleanText(match[2]) || '播放';
    const episodeId = episodeIdFromPlayURL(href) || String(versions.length + 1);
    if (selectedEpisodeId && selectedEpisodeId !== episodeId && selectedEpisodeId !== href) continue;
    const payload = {
      itemId: itemId,
      episodeId: episodeId,
      title: title,
      url: href,
      playUrl: href
    };
    versions.push({
      id: encodePayload(payload),
      name: selectedEpisodeId ? '播放' : title,
      title: title,
      subtitle: selectedEpisodeId ? title : '',
      url: href,
      action: {
        type: 'play',
        itemId: itemId,
        episodeId: episodeId,
        versionId: encodePayload(payload),
        url: href
      }
    });
  }
  return versions;
}

function buildSeasons(group, itemId) {
  if (!group || !group.versions || group.versions.length <= 1) return [];
  const episodes = group.versions.map(function (version, index) {
    const payload = decodePayload(version.id);
    const episodeId = payload.episodeId || String(index + 1);
    return {
      id: episodeId,
      title: version.title || version.name || '第 ' + (index + 1) + ' 集',
      index: index + 1,
      episodeNumber: index + 1,
      seasonNumber: 1,
      action: { type: 'play', itemId: itemId, episodeId: episodeId }
    };
  });
  return [
    {
      id: 'season-1',
      title: '选集',
      index: 1,
      seasonNumber: 1,
      episodeCount: episodes.length,
      episodes: episodes
    }
  ];
}

function resolveHexPlayback(base, hexURL, playPageURL) {
  const artURL = absoluteURL(base, '/static/player/artplayer/?url=' + encodeURIComponent(hexURL) + '&next=');
  const artHTML = fetchText(base, artURL, { referer: playPageURL });
  const playPage = firstMatch(artHTML, /const\s+playPageUrl\s*=\s*["']([^"']*)["']/i);
  const timestamp = firstMatch(artHTML, /const\s+timestamp\s*=\s*["'](\d+)["']/i);
  const seed = firstMatch(artHTML, /const\s+secretKeySeed\s*=\s*["']([^"']*)["']/i);
  if (!playPage || !timestamp) {
    throw new Error('LIBVIO 未找到加密播放参数');
  }

  const t = Math.floor(Date.now() / 1000);
  const api = postJSON(
    LIBVIO_API_URL,
    {
      vkey: playPage,
      code: seed,
      t: t,
      signature: $crypto.md5(String(t))
    },
    {
      referer: artURL,
      headers: {
        Origin: base,
        Referer: artURL
      }
    }
  );

  if (!api || Number(api.code) !== 200 || !api.url) {
    throw new Error('LIBVIO 播放 API 返回错误：' + (api && api.code != null ? api.code : 'empty'));
  }

  return tryDecryptPlaybackURL(String(api.url), timestamp + LIBVIO_DECRYPT_SALT);
}

function tryDecryptPlaybackURL(encrypted, material) {
  const candidates = keyCandidates(material);
  for (let index = 0; index < candidates.length; index += 1) {
    const item = candidates[index];
    const decoded = $crypto.aesDecryptBase64(encrypted, item.key, {
      iv: item.iv,
      mode: 'CBC',
      inputEncoding: 'base64',
      keyEncoding: item.keyEncoding || 'utf8',
      outputEncoding: 'utf8'
    });
    if (isDirectMediaURL(decoded)) return decoded;
  }
  throw new Error('LIBVIO 解密播放地址失败');
}

function keyCandidates(material) {
  const raw = String(material || '');
  const md5 = $crypto.md5(raw);
  const first16 = raw.slice(0, 16);
  const last16 = raw.slice(Math.max(0, raw.length - 16));
  return uniqueKeyPairs([
    { key: last16, iv: first16 },
    { key: first16, iv: last16 },
    { key: raw, iv: raw },
    { key: first16, iv: first16 },
    { key: last16, iv: last16 },
    { key: md5.slice(16, 32), iv: md5.slice(0, 16) },
    { key: md5.slice(0, 16), iv: md5.slice(16, 32) },
    { key: md5, iv: md5 }
  ]);
}

function uniqueKeyPairs(items) {
  const seen = {};
  return items.filter(function (item) {
    if (!item.key || !item.iv) return false;
    const key = item.key + '|' + item.iv;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

function extractPlayerData(html) {
  const text = String(html || '');
  const marker = text.search(/player_aaaa\s*=/i);
  if (marker < 0) return null;
  const braceStart = text.indexOf('{', marker);
  if (braceStart < 0) return null;
  const braceEnd = findBalancedBraceEnd(text, braceStart);
  if (braceEnd < 0) return null;
  const json = text.slice(braceStart, braceEnd + 1);
  try {
    return JSON.parse(json);
  } catch (error) {
    try {
      return eval('(' + json + ')');
    } catch (evalError) {
      return null;
    }
  }
}

function findBalancedBraceEnd(text, start) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const ch = text[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = '';
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function categoryEntry(base, type, previewItems) {
  const first = previewItems && previewItems[0];
  return {
    id: 'type:' + type.id,
    title: type.title,
    subtitle: 'LIBVIO ' + type.title,
    type: 'collection',
    poster: (first && first.poster) || LIBVIO_LOGO,
    backdrop: (first && first.backdrop) || (first && first.poster) || LIBVIO_LOGO,
    overview: '浏览 LIBVIO ' + type.title + '资源。',
    metadataText: '分类入口',
    badges: [type.title],
    previewItems: previewItems || [],
    action: categoryAction(type)
  };
}

function categoryAction(type) {
  return { type: 'category', pageId: 'type:' + type.id, title: type.title, typeId: type.id };
}

function playback(url, referer, base) {
  const finalURL = absoluteURL(base || LIBVIO_DEFAULT_BASE, url);
  return {
    url: finalURL,
    container: containerFromURL(finalURL),
    headers: {
      'User-Agent': LIBVIO_UA,
      Referer: referer || base || LIBVIO_DEFAULT_BASE
    },
    streamKind: 'vod',
    prefersDirectAVPlayer: /\.m3u8(?:$|\?)/i.test(finalURL)
  };
}

function baseURL(ctx) {
  const source = (ctx && (ctx.params || ctx.parameters || ctx.config || ctx.settings)) || {};
  const value = stringValue(source.baseURL || source.baseUrl || source.host || LIBVIO_DEFAULT_BASE);
  return value.replace(/\/+$/, '') || LIBVIO_DEFAULT_BASE;
}

function typeById(typeId) {
  const id = Number(typeId);
  for (let index = 0; index < LIBVIO_TYPES.length; index += 1) {
    if (LIBVIO_TYPES[index].id === id) return LIBVIO_TYPES[index];
  }
  return null;
}

function parseTypeId(pageId) {
  const match = /(?:type:|type-|category:)?(\d+)/.exec(String(pageId || ''));
  return match ? Number(match[1]) : 1;
}

function makeItemId(vodId, typeId) {
  return 'libvio-item:' + encodeURIComponent(JSON.stringify({ vodId: String(vodId || ''), typeId: Number(typeId || 0) }));
}

function parseItemRef(value) {
  const raw = String(value || '');
  if (raw.indexOf('libvio-item:') === 0) {
    try {
      return JSON.parse(decodeURIComponent(raw.slice('libvio-item:'.length)));
    } catch (error) {
      return {};
    }
  }
  const detailId = firstMatch(raw, /\/detail\/(\d+)\.html/i);
  const number = firstMatch(raw, /^(\d+)$/);
  return { vodId: detailId || number || raw, typeId: 0 };
}

function encodePayload(payload) {
  return 'libvio-version:' + encodeURIComponent(JSON.stringify(payload || {}));
}

function decodePayload(value) {
  const raw = String(value || '');
  if (raw.indexOf('libvio-version:') !== 0) return {};
  try {
    return JSON.parse(decodeURIComponent(raw.slice('libvio-version:'.length))) || {};
  } catch (error) {
    return {};
  }
}

function detailReferer(base, itemId) {
  const parsed = parseItemRef(itemId);
  return parsed.vodId ? absoluteURL(base, '/detail/' + parsed.vodId + '.html') : base + '/';
}

function absoluteURL(base, value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.indexOf('//') === 0) return 'https:' + raw;
  if (raw[0] === '/') return base.replace(/\/+$/, '') + raw;
  return base.replace(/\/+$/, '') + '/' + raw.replace(/^\/+/, '');
}

function pickPoster(base, block) {
  const images = [];
  const pattern = /(?:data-original|data-src|src|original)=["']([^"']+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^"']*)?)["']/gi;
  let match;
  while ((match = pattern.exec(String(block || '')))) {
    images.push(match[1]);
  }
  const chosen = images.filter(function (url) {
    return !/blank|placeholder|loading|logo|favicon|icon/i.test(url);
  })[0] || images[0] || LIBVIO_LOGO;
  return absoluteURL(base, chosen);
}

function parsePagination(html, pattern) {
  let pages = 1;
  let match;
  while ((match = pattern.exec(String(html || '')))) {
    pages = Math.max(pages, numberValue(match[1], 1));
  }
  return pages;
}

function collectTagBlocks(html, tag, classPattern) {
  const source = String(html || '');
  const blocks = [];
  const openPattern = new RegExp('<' + tag + '\\b[^>]*>', 'gi');
  let match;
  while ((match = openPattern.exec(source))) {
    const open = match[0];
    if (classPattern && !classPattern.test(open)) continue;
    const end = closingTagEnd(source, tag, openPattern.lastIndex);
    if (end < 0) continue;
    blocks.push(source.slice(match.index, end));
    openPattern.lastIndex = end;
  }
  return blocks;
}

function closingTagEnd(source, tag, fromIndex) {
  const pattern = new RegExp('</?' + tag + '\\b[^>]*>', 'gi');
  pattern.lastIndex = fromIndex;
  let depth = 1;
  let match;
  while ((match = pattern.exec(source))) {
    if (match[0].indexOf('</') === 0) {
      depth -= 1;
    } else if (match[0].slice(-2) !== '/>') {
      depth += 1;
    }
    if (depth === 0) return pattern.lastIndex;
  }
  return -1;
}

function nearestHeading(html) {
  const matches = [];
  const pattern = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let match;
  while ((match = pattern.exec(String(html || '')))) {
    matches.push(cleanText(match[1]));
  }
  return matches.length ? matches[matches.length - 1] : '';
}

function pickMetaTitle(html) {
  return cleanText(firstMatch(html, /<div[^>]+class=["'][^"']*stui-content__detail[^"']*["'][^>]*>[\s\S]*?<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i));
}

function labeledValue(html, labels) {
  const text = String(html || '');
  for (let index = 0; index < labels.length; index += 1) {
    const label = labels[index];
    const patterns = [
      new RegExp(label + '\\s*[:：]\\s*</?[^>]*>\\s*([^<\\n]+)', 'i'),
      new RegExp(label + '\\s*[:：]\\s*([\\s\\S]{0,160}?)(?:</p>|<br|</li>|</div>)', 'i')
    ];
    for (let i = 0; i < patterns.length; i += 1) {
      const value = cleanText(firstMatch(text, patterns[i]));
      if (value) return value;
    }
  }
  return '';
}

function firstMatch(value, pattern) {
  const match = pattern.exec(String(value || ''));
  return match ? match[1] : '';
}

function firstNonEmpty() {
  for (let index = 0; index < arguments.length; index += 1) {
    const value = arguments[index];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return '';
}

function cleanTitle(value) {
  return cleanText(value)
    .replace(/\s*[-_]\s*LIBVIO.*$/i, '')
    .replace(/\s*在线观看.*$/i, '')
    .trim();
}

function cleanText(value) {
  return decodeEntities(
    String(value || '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, function (_, code) { return String.fromCharCode(Number(code)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, code) { return String.fromCharCode(parseInt(code, 16)); });
}

function splitList(value) {
  return cleanText(value)
    .split(/[\/,，、\s]+/)
    .map(function (item) { return item.trim(); })
    .filter(Boolean);
}

function splitPeople(value) {
  return splitList(value).filter(function (name) {
    return name && !/主演|演员|未知/.test(name);
  });
}

function inferType(title, html) {
  const text = String(title || '') + ' ' + cleanText(html);
  return /第\s*\d+\s*集|更新至|全\s*\d+\s*集|电视剧|连续剧|动漫|动画|综艺|番剧/i.test(text) ? 'series' : 'movie';
}

function episodeIdFromPlayURL(url) {
  return firstMatch(url, /\/play\/\d+-\d+-(\d+)\.html/i);
}

function isDirectMediaURL(url) {
  const value = String(url || '').trim();
  if (!value) return false;
  if (/^(rtmp|rtsp|udp|rtp):\/\//i.test(value)) return true;
  return /^(https?:)?\/\//i.test(value) && /\.(m3u8|m3u|mp4|mkv|mov|flv|ts|webm|avi|mpd)(?:$|\?)/i.test(value);
}

function isHexString(value) {
  const text = String(value || '').trim();
  return text.length >= 16 && text.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(text);
}

function containerFromURL(url) {
  const lower = String(url || '').split('?')[0].toLowerCase();
  const match = /\.([a-z0-9]+)$/.exec(lower);
  return match ? match[1] : '';
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(String(value || ''));
  } catch (error) {
    try { return unescape(String(value || '')); } catch (_) { return String(value || ''); }
  }
}

function safeBase64Decode(value) {
  try {
    return decodeURIComponent(escape(atob(String(value || ''))));
  } catch (error) {
    try { return atob(String(value || '')); } catch (_) { return String(value || ''); }
  }
}

function numberValue(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function stringValue(value) {
  return value === undefined || value === null ? '' : String(value);
}
