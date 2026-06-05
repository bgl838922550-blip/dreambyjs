/*
 * Jable custom media library source for baiPlay.
 *
 * It keeps the Forward widget-compatible entry points and also exposes:
 * - baiPlay media-library API: getCategories/getItems/getDetail/matchMedia/getPlayback
 * - mini-app source API: home/homeVod/category/detail/search/play
 */

const JABLE_BASE_URL = "https://jable.tv";
const JABLE_LIST_BLOCK = "list_videos_common_videos_list";
const JABLE_SEARCH_BLOCK = "list_videos_videos_list_search_result";

const JABLE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
};

const JABLE_PLAY_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  Origin: JABLE_BASE_URL,
};

const SOURCE_PAGE_LIMIT = 24;

const JABLE_SORTS = {
  latest: "post_date",
  viewed: "video_viewed",
  favorite: "most_favourited",
  best: "post_date_and_popularity",
};

const JABLE_CATEGORIES = [
  {
    id: "hot",
    title: "\u70ed\u95e8",
    kind: "list",
    url: `${JABLE_BASE_URL}/hot/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    sortOptions: [
      { id: "today", title: "\u4eca\u65e5\u70ed\u95e8", value: "video_viewed_today" },
      { id: "week", title: "\u672c\u5468\u70ed\u95e8", value: "video_viewed_week" },
      { id: "month", title: "\u672c\u6708\u70ed\u95e8", value: "video_viewed_month" },
      { id: "all", title: "\u6240\u6709\u65f6\u95f4", value: "video_viewed" },
    ],
    defaultSort: "video_viewed_today",
  },
  {
    id: "new-release",
    title: "\u6700\u65b0",
    kind: "list",
    url: `${JABLE_BASE_URL}/new-release/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    defaultSort: "latest-updates",
  },
  {
    id: "chinese-subtitle",
    title: "\u4e2d\u6587\u5b57\u5e55",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/chinese-subtitle/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "uncensored-leak",
    title: "\u65e0\u7801\u6d41\u51fa",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/uncensored-leak/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "roleplay",
    title: "\u89d2\u8272\u626e\u6f14",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/roleplay/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "models-yua-mikami",
    title: "\u4e09\u4e0a\u60a0\u4e9a",
    group: "\u5973\u4f18",
    kind: "model",
    url: `${JABLE_BASE_URL}/s1/models/yua-mikami/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "models-saika-kawakita",
    title: "\u6cb3\u5317\u5f69\u4f3d",
    group: "\u5973\u4f18",
    kind: "model",
    url: `${JABLE_BASE_URL}/models/saika-kawakita2/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "models-otsuki-hibiki",
    title: "\u5927\u69fb\u54cd",
    group: "\u5973\u4f18",
    kind: "model",
    url: `${JABLE_BASE_URL}/models/hibiki-otsuki/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "models-julia",
    title: "JULIA",
    group: "\u5973\u4f18",
    kind: "model",
    url: `${JABLE_BASE_URL}/models/julia/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-black-pantyhose",
    title: "\u9ed1\u4e1d",
    group: "\u8863\u7740",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/black-pantyhose/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-pantyhose",
    title: "\u4e1d\u889c",
    group: "\u8863\u7740",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/pantyhose/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-school-uniform",
    title: "\u6821\u670d",
    group: "\u8863\u7740",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/school-uniform/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-cosplay",
    title: "Cosplay",
    group: "\u8863\u7740",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/Cosplay/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-ntr",
    title: "NTR",
    group: "\u5267\u60c5",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/ntr/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-time-stop",
    title: "\u65f6\u95f4\u505c\u6b62",
    group: "\u5267\u60c5",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/time-stop/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-private-cam",
    title: "\u5077\u62cd",
    group: "\u5267\u60c5",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/private-cam/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-hot-spring",
    title: "\u6e29\u6cc9",
    group: "\u5730\u70b9",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/hot-spring/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-car",
    title: "\u6c7d\u8f66",
    group: "\u5730\u70b9",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/car/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-big-tits",
    title: "\u5de8\u4e73",
    group: "\u8eab\u6750",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/big-tits/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-mature-woman",
    title: "\u719f\u5973",
    group: "\u8eab\u6750",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/mature-woman/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
  {
    id: "tag-more-than-4-hours",
    title: "\u56db\u5c0f\u65f6\u4ee5\u4e0a",
    group: "\u5176\u4ed6",
    kind: "tag",
    url: `${JABLE_BASE_URL}/tags/more-than-4-hours/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
  },
];

const JABLE_EXTRA_CATEGORY_SHORTCUTS = [
  ["models-momonogi-kana", "\u6843\u4e43\u6728\u9999\u5948", "\u5973\u4f18", "model", "/models/momonogi-kana/"],
  ["models-kana-mito", "\u6c34\u6237\u9999\u5948", "\u5973\u4f18", "model", "/models/kana-mito/"],
  ["models-shinoda-yuu", "\u7be0\u7530\u3086\u3046", "\u5973\u4f18", "model", "/s1/models/shinoda-yuu/"],
  ["models-kaede-karen", "\u67ab\u53ef\u601c", "\u5973\u4f18", "model", "/models/kaede-karen/"],
  ["models-akiho-yoshizawa", "\u5409\u6ca2\u660e\u6b65", "\u5973\u4f18", "model", "/models/akiho-yoshizawa/"],
  ["models-mitani-akari", "\u7f8e\u8c37\u6731\u91cc", "\u5973\u4f18", "model", "/s1/models/mitani-akari/"],
  ["models-yamagishi-aika", "\u5c71\u5cb8\u9022\u82b1", "\u5973\u4f18", "model", "/models/yamagishi-aika/"],
  ["models-nanasawa-mia", "\u4e03\u6cfd\u7f8e\u4e9a", "\u5973\u4f18", "model", "/models/nanasawa-mia/"],
  ["models-honjou-suzu", "\u672c\u5e84\u9234", "\u5973\u4f18", "model", "/models/honjou-suzu/"],
  ["models-sakura-momo", "\u685c\u7a7a\u3082\u3082", "\u5973\u4f18", "model", "/models/sakura-momo/"],
  ["tag-flesh-toned-pantyhose", "\u8089\u4e1d", "\u8863\u7740", "tag", "/tags/flesh-toned-pantyhose/"],
  ["tag-fishnets", "\u6e14\u7f51", "\u8863\u7740", "tag", "/tags/fishnets/"],
  ["tag-swimsuit", "\u6c34\u7740", "\u8863\u7740", "tag", "/tags/swimsuit/"],
  ["tag-cheongsam", "\u65d7\u888d", "\u8863\u7740", "tag", "/tags/cheongsam/"],
  ["tag-wedding-dress", "\u5a5a\u7eb1", "\u8863\u7740", "tag", "/tags/wedding-dress/"],
  ["tag-maid", "\u5973\u50d5", "\u8863\u7740", "tag", "/tags/maid/"],
  ["tag-kimono", "\u548c\u670d", "\u8863\u7740", "tag", "/tags/kimono/"],
  ["tag-glasses", "\u773c\u955c", "\u8863\u7740", "tag", "/tags/glasses/"],
  ["tag-knee-socks", "\u8fc7\u819d\u889c", "\u8863\u7740", "tag", "/tags/knee-socks/"],
  ["tag-sportswear", "\u8fd0\u52a8\u88c5", "\u8863\u7740", "tag", "/tags/sportswear/"],
  ["tag-affair", "\u51fa\u8f68", "\u5267\u60c5", "tag", "/tags/affair/"],
  ["tag-ugly-man", "\u9189\u7537", "\u5267\u60c5", "tag", "/tags/ugly-man/"],
  ["tag-kinship", "\u4eb2\u5c5e", "\u5267\u60c5", "tag", "/tags/kinship/"],
  ["tag-virginity", "\u7ae5\u8d1e", "\u5267\u60c5", "tag", "/tags/virginity/"],
  ["tag-avenge", "\u590d\u4ec7", "\u5267\u60c5", "tag", "/tags/avenge/"],
  ["tag-hypnosis", "\u50ac\u7720", "\u5267\u60c5", "tag", "/tags/hypnosis/"],
  ["tag-age-difference", "\u5e74\u9f84\u5dee", "\u5267\u60c5", "tag", "/tags/age-difference/"],
  ["tag-rainy-day", "\u4e0b\u96e8\u5929", "\u5267\u60c5", "tag", "/tags/rainy-day/"],
  ["tag-tram", "\u7535\u8f66", "\u5730\u70b9", "tag", "/tags/tram/"],
  ["tag-prison", "\u76d1\u72f1", "\u5730\u70b9", "tag", "/tags/prison/"],
  ["tag-swimming-pool", "\u6cf3\u6c60", "\u5730\u70b9", "tag", "/tags/swimming-pool/"],
  ["tag-toilet", "\u5395\u6240", "\u5730\u70b9", "tag", "/tags/toilet/"],
  ["tag-school", "\u5b66\u6821", "\u5730\u70b9", "tag", "/tags/school/"],
  ["tag-magic-mirror", "\u9b54\u955c\u53f7", "\u5730\u70b9", "tag", "/tags/magic-mirror/"],
  ["tag-bathing-place", "\u6d17\u6d74\u573a", "\u5730\u70b9", "tag", "/tags/bathing-place/"],
  ["tag-library", "\u56fe\u4e66\u9986", "\u5730\u70b9", "tag", "/tags/library/"],
  ["tag-gym-room", "\u5065\u8eab\u623f", "\u5730\u70b9", "tag", "/tags/gym-room/"],
  ["tag-tall", "\u957f\u8eab", "\u8eab\u6750", "tag", "/tags/tall/"],
  ["tag-flexible-body", "\u8f6f\u4f53", "\u8eab\u6750", "tag", "/tags/flexible-body/"],
  ["tag-small-tits", "\u8d2b\u4e73", "\u8eab\u6750", "tag", "/tags/small-tits/"],
  ["tag-beautiful-leg", "\u7f8e\u817f", "\u8eab\u6750", "tag", "/tags/beautiful-leg/"],
  ["tag-beautiful-butt", "\u7f8e\u5c3b", "\u8eab\u6750", "tag", "/tags/beautiful-butt/"],
  ["tag-tattoo", "\u7eb9\u8eab", "\u8eab\u6750", "tag", "/tags/tattoo/"],
  ["tag-short-hair", "\u77ed\u53d1", "\u8eab\u6750", "tag", "/tags/short-hair/"],
  ["tag-hairless-pussy", "\u767d\u864e", "\u8eab\u6750", "tag", "/tags/hairless-pussy/"],
  ["tag-girl", "\u5c11\u5973", "\u8eab\u6750", "tag", "/tags/girl/"],
  ["tag-married-woman", "\u5df2\u5a5a\u5987\u5973", "\u804c\u4e1a", "tag", "/tags/married-woman/"],
  ["tag-ol", "OL", "\u804c\u4e1a", "tag", "/tags/ol/"],
  ["tag-nurse", "\u62a4\u58eb", "\u804c\u4e1a", "tag", "/tags/nurse/"],
  ["tag-teacher", "\u8001\u5e08", "\u804c\u4e1a", "tag", "/tags/teacher/"],
  ["tag-flight-attendant", "\u7a7a\u59d0", "\u804c\u4e1a", "tag", "/tags/flight-attendant/"],
  ["tag-creampie", "\u4e2d\u51fa", "\u4ea4\u5408", "tag", "/tags/creampie/"],
  ["tag-blowjob", "\u53e3\u4ea4", "\u4ea4\u5408", "tag", "/tags/blowjob/"],
  ["tag-cum-in-mouth", "\u53e3\u7206", "\u4ea4\u5408", "tag", "/tags/cum-in-mouth/"],
  ["tag-deep-throat", "\u6df1\u5589", "\u4ea4\u5408", "tag", "/tags/deep-throat/"],
  ["tag-kiss", "\u63a5\u543b", "\u4ea4\u5408", "tag", "/tags/kiss/"],
  ["tag-squirting", "\u6f6e\u5439", "\u4ea4\u5408", "tag", "/tags/squirting/"],
  ["tag-outdoor", "\u6237\u5916", "\u73a9\u6cd5", "tag", "/tags/outdoor/"],
  ["tag-bondage", "\u6346\u7ed1", "\u73a9\u6cd5", "tag", "/tags/bondage/"],
  ["tag-chikan", "\u75f4\u6c49", "\u73a9\u6cd5", "tag", "/tags/chikan/"],
  ["tag-massage", "\u6309\u6469", "\u73a9\u6cd5", "tag", "/tags/massage/"],
  ["tag-groupsex", "\u591aP", "\u73a9\u6cd5", "tag", "/tags/groupsex/"],
  ["category-uniform", "\u5236\u670d\u8bf1\u60d1", "\u4e3b\u9898", "category", "/categories/uniform/"],
  ["category-sex-only", "\u76f4\u63a5\u5f00\u556a", "\u4e3b\u9898", "category", "/categories/sex-only/"],
  ["category-pov", "\u7537\u53cb\u89c6\u89d2", "\u4e3b\u9898", "category", "/categories/pov/"],
  ["category-uncensored", "\u65e0\u7801\u89e3\u653e", "\u4e3b\u9898", "category", "/categories/uncensored/"],
  ["category-lesbian", "\u5973\u540c\u6b22\u6109", "\u4e3b\u9898", "category", "/categories/lesbian/"],
  ["tag-variety-show", "\u7efc\u827a", "\u6742\u9879", "tag", "/tags/variety-show/"],
  ["tag-thanksgiving", "\u611f\u8c22\u796d", "\u6742\u9879", "tag", "/tags/thanksgiving/"],
  ["tag-festival", "\u8282\u65e5\u4e3b\u9898", "\u6742\u9879", "tag", "/tags/festival/"],
  ["tag-debut-retires", "\u5904\u5973\u4f5c/\u9690\u9000\u4f5c", "\u6742\u9879", "tag", "/tags/debut-retires/"],
].map(([id, title, group, kind, path]) => ({
  id,
  title,
  group,
  kind,
  url: makeAsyncListUrl(path),
}));

const JABLE_ALL_CATEGORIES = dedupeCategoryDefinitions([...JABLE_CATEGORIES, ...JABLE_EXTRA_CATEGORY_SHORTCUTS]);

const JABLE_HOME_CATEGORY_IDS = [
  "hot",
  "new-release",
  "chinese-subtitle",
  "uncensored-leak",
  "roleplay",
  "category-uniform",
  "category-sex-only",
  "category-pov",
  "category-uncensored",
  "category-lesbian",
  "tag-black-pantyhose",
  "tag-pantyhose",
  "tag-school-uniform",
  "tag-cosplay",
  "tag-ntr",
  "tag-time-stop",
  "tag-private-cam",
  "tag-big-tits",
  "tag-mature-woman",
  "tag-creampie",
  "tag-blowjob",
  "models-yua-mikami",
  "models-saika-kawakita",
  "models-otsuki-hibiki",
  "models-julia",
  "models-momonogi-kana",
  "models-nanasawa-mia",
  "models-honjou-suzu",
];

var WidgetMetadata = {
  id: "baiplay_jable_media_library",
  title: "Jable",
  description: "Jable custom media library source for baiPlay",
  author: "baiPlay",
  site: JABLE_BASE_URL,
  version: "1.0.0",
  requiredVersion: "0.0.2",
  detailCacheDuration: 60,
  modules: [
    {
      id: "posterWall",
      title: "\u5206\u7c7b\u6d77\u62a5\u5899",
      description: "\u6309 Jable \u5206\u7c7b\u6d4f\u89c8",
      requiresWebView: false,
      functionName: "loadPosterWall",
      cacheDuration: 1800,
      params: [
        {
          name: "categoryId",
          title: "\u5206\u7c7b",
          type: "enumeration",
          enumOptions: JABLE_ALL_CATEGORIES.map((item) => ({ title: item.title, value: item.id })),
          value: "hot",
        },
        {
          name: "sort_by",
          title: "\u6392\u5e8f",
          type: "enumeration",
          enumOptions: [
            { title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
            { title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
            { title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
          ],
        },
        { name: "from", title: "\u9875\u7801", type: "page", value: "1" },
      ],
    },
    {
      id: "search",
      title: "\u641c\u7d22",
      description: "\u641c\u7d22 Jable",
      requiresWebView: false,
      functionName: "search",
      cacheDuration: 1800,
      params: [
        { name: "keyword", title: "\u5173\u952e\u8bcd", type: "input" },
        { name: "from", title: "\u9875\u7801", type: "page", value: "1" },
      ],
    },
  ],
  search: {
    title: "\u641c\u7d22 Jable",
    functionName: "search",
    params: [{ name: "keyword", title: "\u5173\u952e\u8bcd", type: "input" }],
  },
};

async function init(cfg = {}) {
  return {
    ok: true,
    source: WidgetMetadata.id,
    site: JABLE_BASE_URL,
    config: cfg || {},
  };
}

function getManifest() {
  return {
    id: WidgetMetadata.id,
    name: "Jable",
    title: "Jable",
    version: WidgetMetadata.version || "1.0.0",
    author: WidgetMetadata.author || "baiPlay",
    description: WidgetMetadata.description,
    site: JABLE_BASE_URL,
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      resourceVersions: true,
      playback: true,
      aggregation: true,
      playbackHistory: true,
      resourceMatching: true,
      resourceMatch: {
        enabled: true,
        parameters: [
          "tmdbId",
          "imdbId",
          "tvdbId",
          "title",
          "originalTitle",
          "alternativeTitles",
          "year",
          "runtimeMinutes",
          "mediaType",
          "seasonNumber",
          "episodeNumber",
          "episodeTitle",
          "episodeRuntimeMinutes",
        ],
      },
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: true,
    },
  };
}

async function getCategories() {
  return JABLE_ALL_CATEGORIES.map((category) => ({
    id: category.id,
    title: category.title,
    name: category.title,
    group: category.group || "\u63a8\u8350",
    type: "folder",
    kind: category.kind,
    sourceId: WidgetMetadata.id,
    sortOptions: category.sortOptions || defaultSortOptions(),
  }));
}

async function getHome(ctx = {}) {
  const ext = argsify(ctx);
  const page = normalizePage(ext.page || ext.pg || ext.from || 1);
  const categoryIds = Array.isArray(ext.categoryIds) && ext.categoryIds.length ? ext.categoryIds : JABLE_HOME_CATEGORY_IDS;
  const sections = [
    {
      id: "jable-categories",
      title: "\u5206\u7c7b",
      style: "discover.watchProviders",
      items: categoryShortcutItems(),
    },
  ];
  let hero = [];
  let firstError = null;

  for (const categoryId of categoryIds) {
    const category = findCategory(categoryId);
    try {
      const items = await loadPosterWall({
        categoryId: category.id,
        page,
        sort_by: ext.sort_by || ext.sortBy || category.defaultSort,
      });
      const mediaItems = items.map((item, index) => toMiniMediaItem(item, index + 1, category)).filter(Boolean);
      if (!mediaItems.length) continue;
      if (!hero.length) hero = mediaItems.slice(0, 6);
      const action = { type: "category", id: category.id, pageId: category.id, title: category.title };
      sections.push({
        id: category.id,
        title: category.title,
        style: homeSectionStyle(category),
        contentType: "movie",
        more: action,
        moreAction: action,
        items: mediaItems.slice(0, SOURCE_PAGE_LIMIT),
      });
    } catch (error) {
      if (!firstError) firstError = error;
      logInfo("Jable home section skipped: " + category.id + " - " + (error && error.message ? error.message : error));
    }
  }

  if (!hero.length && firstError) {
    throw firstError;
  }

  const result = {
    pageType: "home",
    title: "Jable",
    sections,
  };
  if (hero.length) result.hero = hero;
  return result;
}

async function getCategory(ctx = {}) {
  const ext = argsify(ctx);
  const pageId = ext.pageId || ext.categoryId || ext.tid || ext.id || "hot";
  const page = normalizePage(ext.page || ext.pg || ext.from || 1);
  const category = findCategory(pageId);
  const sortBy = ext.sort_by || ext.sortBy || ext.sort || category.defaultSort;
  const items = await loadPosterWall({ categoryId: category.id, page, sort_by: sortBy });

  return {
    pageType: "category",
    id: category.id,
    title: ext.title || category.title || "\u5206\u7c7b",
    style: "media.posterGrid",
    page,
    hasMore: items.length >= SOURCE_PAGE_LIMIT,
    sort: (category.sortOptions || defaultSortOptions()).map((sort) => ({
      id: sort.id || sort.value,
      title: sort.title,
      value: sort.value || sort.id,
    })),
    items: items.map((item, index) => toMiniMediaItem(item, (page - 1) * SOURCE_PAGE_LIMIT + index + 1, category)).filter(Boolean),
  };
}

async function home(filter = true) {
  const result = {
    class: JABLE_ALL_CATEGORIES.map(toSourceClass),
    categories: await getCategories(),
  };

  if (filter !== false && filter !== "0") {
    result.filters = buildSourceFilters();
  }

  return result;
}

async function homeVod(params = {}) {
  const categoryId = params.categoryId || params.tid || JABLE_HOME_CATEGORY_IDS[0];
  const items = await loadPosterWall({
    categoryId,
    page: params.page || params.pg || 1,
    sort_by: params.sort_by || params.sortBy || "video_viewed_today",
  });
  return toSourcePage(items, params.page || params.pg || 1);
}

async function homeSections(params = {}) {
  const page = normalizePage(params.page || params.pg || 1);
  const categoryIds = params.categoryIds || JABLE_HOME_CATEGORY_IDS;
  const sections = [];

  for (const categoryId of categoryIds) {
    const category = findCategory(categoryId);
    const items = await loadPosterWall({
      categoryId: category.id,
      page,
      sort_by: category.defaultSort,
    });
    sections.push({
      id: category.id,
      title: category.title,
      type: "posterWall",
      style: homeSectionStyle(category),
      items,
      list: items.map(toVodItem),
    });
  }

  return { sections };
}

async function category(tidOrParams = "hot", pg = 1, filter = false, extend = {}) {
  if (tidOrParams && typeof tidOrParams === "object" && !Array.isArray(tidOrParams)) {
    if (tidOrParams.raw) {
      return loadPosterWall(tidOrParams);
    }
    const page = normalizePage(tidOrParams.page || tidOrParams.pg || tidOrParams.from || 1);
    const items = await loadPosterWall({
      categoryId: tidOrParams.categoryId || tidOrParams.tid || tidOrParams.id || "hot",
      page,
      sort_by: tidOrParams.sort_by || tidOrParams.sortBy || tidOrParams.sort,
    });
    return toSourcePage(items, page);
  }

  const page = normalizePage(pg);
  const categoryId = tidOrParams || "hot";
  const sortBy = extend && (extend.sort_by || extend.sortBy || extend.sort);
  const items = await loadPosterWall({ categoryId, page, sort_by: sortBy });
  return toSourcePage(items, page);
}

async function loadPosterWall(params = {}) {
  const page = normalizePage(params.page || params.from);
  const category = findCategory(params.categoryId || params.id || "hot");
  const sortBy = params.sort_by || params.sortBy || category.defaultSort || JABLE_SORTS.latest;
  const listUrl = buildListUrl(category.url, { sortBy, page });
  const sections = await loadPageSections({ url: listUrl });
  return sections.flatMap((section) => section.childItems).map((item) => normalizeLibraryItem(item, category));
}

async function getItems(params = {}) {
  if (params.keyword || params.query) {
    return searchLibrary({ keyword: params.keyword || params.query, from: params.page || params.from });
  }
  return loadPosterWall(params);
}

async function search(paramsOrKeyword = {}, quick = false, pg = 1) {
  const parsedArgs = argsify(paramsOrKeyword);
  if (typeof paramsOrKeyword === "string" && Object.keys(parsedArgs).length) {
    return getSearchPage(parsedArgs);
  }
  if (typeof paramsOrKeyword === "string" && arguments.length <= 1) {
    return getSearchPage({ keyword: paramsOrKeyword, page: 1 });
  }
  if (typeof paramsOrKeyword === "string" || arguments.length > 1) {
    const items = await searchLibrary({ keyword: paramsOrKeyword, from: pg });
    return toSourcePage(items, pg);
  }
  if (paramsOrKeyword && typeof paramsOrKeyword === "object" && paramsOrKeyword.wd && !paramsOrKeyword.keyword && !paramsOrKeyword.query) {
    const page = normalizePage(paramsOrKeyword.page || paramsOrKeyword.pg || paramsOrKeyword.from || 1);
    const items = await searchLibrary({ keyword: paramsOrKeyword.wd, from: page });
    return toSourcePage(items, page);
  }
  return getSearchPage(paramsOrKeyword);
}

async function getSearchPage(ctx = {}) {
  const ext = argsify(ctx);
  const keyword = String(ext.keyword || ext.query || ext.text || ext.wd || "").trim();
  const page = normalizePage(ext.page || ext.pg || ext.from || 1);
  const items = keyword ? await searchLibrary({ keyword, from: page, sort_by: ext.sort_by || ext.sortBy }) : [];
  return {
    pageType: "search",
    keyword,
    title: keyword ? `\u641c\u7d22\u7ed3\u679c: ${keyword}` : "\u641c\u7d22\u7ed3\u679c",
    page,
    hasMore: items.length >= SOURCE_PAGE_LIMIT,
    items: items.map((item, index) => toMiniMediaItem(item, (page - 1) * SOURCE_PAGE_LIMIT + index + 1, { title: "\u641c\u7d22" })),
  };
}

async function onSearch(ctx = {}) {
  return getSearchPage(ctx);
}

async function searchLibrary(params = {}) {
  const ext = argsify(params);
  const keyword = String(ext.keyword || ext.query || ext.text || ext.wd || "").trim();
  if (!keyword) {
    return [];
  }

  const page = normalizePage(ext.page || ext.pg || ext.from);
  const encodedKeyword = encodeURIComponent(keyword);
  let url = `${JABLE_BASE_URL}/search/${encodedKeyword}/?mode=async&function=get_block&block_id=${JABLE_SEARCH_BLOCK}&q=${encodedKeyword}`;

  if (ext.sort_by || ext.sortBy) {
    url += `&sort_by=${encodeURIComponent(ext.sort_by || ext.sortBy)}`;
  }
  if (page) {
    url += `&from=${page}`;
  }

  const items = await loadPage({ url });
  return items.map((item) => normalizeLibraryItem(item, { id: "search", title: "\u641c\u7d22" }));
}

async function loadPage(params = {}) {
  const sections = await loadPageSections(params);
  return sections.flatMap((section) => section.childItems);
}

async function loadPageSections(params = {}) {
  let url = params.url;
  if (!url) {
    throw new Error("Jable list url is required.");
  }
  if (params.sort_by) {
    url += `&sort_by=${params.sort_by}`;
  }
  if (params.from) {
    url += `&from=${params.from}`;
  }

  const response = await httpGet(url, { headers: JABLE_HEADERS });
  if (!response || !response.data || typeof response.data !== "string") {
    throw new Error("\u65e0\u6cd5\u83b7\u53d6\u6709\u6548\u7684HTML\u5185\u5bb9");
  }

  const htmlContent = response.data;
  if (!htmlContent) {
    throw new Error("Jable returned empty list html.");
  }

  return parseHtml(htmlContent);
}

async function parseHtml(htmlContent) {
  if (hasWidgetHtml()) {
    return parseHtmlWithCheerio(Widget.html.load(htmlContent));
  }
  return parseHtmlWithRegex(htmlContent);
}

function parseHtmlWithCheerio($) {
  const sectionSelector = ".site-content .py-3,.pb-e-lg-40";
  const itemSelector = ".video-img-box";
  const sections = [];
  const sectionElements = $(sectionSelector).toArray();

  for (const sectionElement of sectionElements) {
    const $sectionElement = $(sectionElement);
    const sectionTitle = $sectionElement.find(".title-box .h3-md").first().text().trim();
    const items = [];

    for (const itemElement of $sectionElement.find(itemSelector).toArray()) {
      const $itemElement = $(itemElement);
      const $title = $itemElement.find(".title a").first();
      const link = absolutizeUrl($title.attr("href") || "");
      if (!isJableVideoUrl(link)) {
        continue;
      }

      const $cover = $itemElement.find("img").first();
      items.push(
        toForwardVideoItem({
          link,
          title: cleanText($title.text()),
          cover: firstNonEmpty($cover.attr("data-src"), $cover.attr("src")),
          preview: $cover.attr("data-preview"),
          durationText: cleanText($itemElement.find(".absolute-bottom-right .label").first().text()),
        })
      );
    }

    if (items.length) {
      sections.push({ title: sectionTitle || "\u5f71\u7247", childItems: items });
    }
  }

  return sections.length ? sections : [{ title: "\u5f71\u7247", childItems: parseHtmlWithRegexItems($.html()) }];
}

function parseHtmlWithRegex(htmlContent) {
  const items = parseHtmlWithRegexItems(htmlContent);
  return items.length ? [{ title: "\u5f71\u7247", childItems: items }] : [];
}

function parseHtmlWithRegexItems(htmlContent) {
  const html = String(htmlContent || "");
  const items = [];
  const cardRegex = /<div[^>]*class=["'][^"']*video-img-box[^"']*["'][\s\S]*?(?=<div[^>]*class=["'][^"']*video-img-box|<\/body>|$)/gi;
  let cardMatch;

  while ((cardMatch = cardRegex.exec(html))) {
    const cardHtml = cardMatch[0];
    const link = absolutizeUrl(extractAttr(cardHtml, /<a[^>]+href=["']([^"']+)["'][^>]*>/i));
    if (!isJableVideoUrl(link)) {
      continue;
    }

    const imgHtml = extractMatch(cardHtml, /<img\b[^>]*>/i);
    const title = cleanText(
      stripTags(extractMatch(cardHtml, /<div[^>]*class=["'][^"']*title[^"']*["'][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)) ||
        decodeHtml(extractAttr(imgHtml, /\balt=["']([^"']*)["']/i))
    );
    const cover = firstNonEmpty(
      extractAttr(imgHtml, /\bdata-src=["']([^"']+)["']/i),
      extractAttr(imgHtml, /\bsrc=["']([^"']+)["']/i)
    );
    const preview = extractAttr(imgHtml, /\bdata-preview=["']([^"']+)["']/i);
    const durationText = cleanText(stripTags(extractMatch(cardHtml, /<span[^>]*class=["'][^"']*label[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)));

    items.push(toForwardVideoItem({ link, title, cover, preview, durationText }));
  }

  return dedupeById(items);
}

async function getDetail(input) {
  const ext = argsify(input);
  const link = getLink(Object.keys(ext).length ? ext : input);
  const detail = await loadDetail(link);
  return normalizeDetail(detail, Object.keys(ext).length ? ext : input);
}

async function detail(idsOrInput) {
  if (idsOrInput && typeof idsOrInput === "object" && !Array.isArray(idsOrInput) && idsOrInput.raw) {
    return getDetail(idsOrInput);
  }

  const id = firstSourceId(idsOrInput);
  if (!id) {
    return { list: [] };
  }

  const item = await getDetail(id);
  return { list: [toVodDetail(item)] };
}

async function loadDetail(link) {
  const pageUrl = getLink(link);
  const response = await httpGet(pageUrl, {
    headers: {
      "User-Agent": JABLE_HEADERS["User-Agent"],
      Referer: JABLE_BASE_URL + "/",
    },
  });
  if (!response || !response.data || typeof response.data !== "string") {
    throw new Error("\u65e0\u6cd5\u83b7\u53d6\u6709\u6548\u7684HTML\u5185\u5bb9");
  }
  const html = response.data;
  if (!html) {
    throw new Error("Jable returned empty detail html.");
  }

  const match = html.match(/var\s+hlsUrl\s*=\s*['"](.*?)['"]/i);
  const hlsUrl = match && match[1] ? match[1] : "";
  if (!hlsUrl) {
    throw new Error("\u65e0\u6cd5\u83b7\u53d6\u6709\u6548\u7684\u64ad\u653e\u5730\u5740\uff0c\u53ef\u80fd\u9700\u8981\u4ee3\u7406\u9a8c\u8bc1");
  }

  const metadata = extractDetailMetadata(html, pageUrl);
  return {
    id: pageUrl,
    type: "movie",
    title: metadata.title,
    name: metadata.title,
    link: pageUrl,
    videoUrl: hlsUrl,
    posterPath: metadata.poster,
    backdropPath: metadata.poster,
    mediaType: "movie",
    description: metadata.description,
    releaseDate: metadata.releaseDate || metadata.durationText,
    durationText: metadata.durationText,
    genreTitle: metadata.tags.join(" / "),
    actors: metadata.actors,
    tags: metadata.tags,
    studio: metadata.studio,
    playerType: "ijk",
    customHeaders: {
      ...JABLE_PLAY_HEADERS,
      Referer: pageUrl,
    },
  };
}

async function matchMedia(params = {}) {
  const ext = argsify(params);
  const link = getLink(ext);
  if (isJableVideoUrl(link)) {
    const detail = await getDetail(link);
    return [{ score: 1, reason: "direct-link", item: detail }];
  }

  const keyword = firstNonEmpty(
    ext.keyword,
    ext.query,
    ext.jableCode,
    extractJavCode(ext.title || ext.name || ext.originalTitle || ""),
    ext.title,
    ext.name,
    ext.originalTitle
  );

  if (!keyword) {
    return [];
  }

  const results = await searchLibrary({ keyword, from: 1 });
  const ranked = results
    .map((item) => ({
      score: scoreMatch(item, ext, keyword),
      reason: "search",
      item,
    }))
    .filter((match) => match.score > 0.2)
    .sort((a, b) => b.score - a.score);

  return ranked;
}

async function matchResources(ctx = {}) {
  const ext = argsify(ctx);
  const titles = unique(
    []
      .concat(ext.keyword || ext.query || [])
      .concat(ext.jableCode || [])
      .concat(ext.title || ext.name || [])
      .concat(ext.originalTitle || ext.originalName || [])
      .concat(ext.alternativeTitles || [])
      .concat(ext.searchTitles || [])
      .concat(ext.titles || [])
  ).slice(0, 5);
  const results = [];
  const seen = {};

  for (let index = 0; index < titles.length && results.length < 8; index += 1) {
    const keyword = firstNonEmpty(extractJavCode(titles[index]), titles[index]);
    if (!keyword) continue;
    const matches = await matchMedia({ ...ext, keyword, query: keyword });
    for (const match of matches) {
      const item = toMiniMediaItem(match.item, results.length + 1, { title: "Jable" });
      if (!item || seen[item.id]) continue;
      seen[item.id] = true;
      item.score = match.score;
      item.matchReason = match.reason;
      results.push(item);
      if (results.length >= 8) break;
    }
  }

  return { results };
}

async function matchMovie(ctx = {}) {
  return matchResources(ctx);
}

async function matchEpisode(ctx = {}) {
  return matchResources(ctx);
}

async function getPlayback(input) {
  const ext = argsify(input);
  if (ext.url || ext.playUrl || ext.videoUrl) {
    return playbackFromDirectUrl(ext.url || ext.playUrl || ext.videoUrl, ext);
  }
  const detail = input && input.videoUrl ? input : await getDetail(Object.keys(ext).length ? ext : input);
  if (!detail.videoUrl) {
    throw new Error("Cannot extract Jable HLS url. The page may require browser verification or the video source is not public.");
  }
  return {
    id: detail.id,
    title: detail.title || detail.name,
    url: detail.videoUrl,
    videoUrl: detail.videoUrl,
    type: "hls",
    protocol: "hls",
    container: "m3u8",
    mimeType: "application/vnd.apple.mpegurl",
    playerType: "ijk",
    headers: detail.customHeaders || {
      ...JABLE_PLAY_HEADERS,
      Referer: detail.link || detail.id,
    },
    mediaSourceId: `${detail.id}#hls`,
  };
}

async function getResourceVersions(ctx = {}) {
  const detail = await getDetail(ctx);
  return detail.resourceGroups || [];
}

async function resolvePlayback(ctx = {}) {
  const ext = argsify(ctx);
  if (ext.url || ext.playUrl || ext.videoUrl) {
    return playbackFromDirectUrl(ext.url || ext.playUrl || ext.videoUrl, ext);
  }
  const playback = await getPlayback(ext);
  return {
    url: playback.url,
    container: playback.container || "m3u8",
    headers: playback.headers || playback.header || {},
    subtitles: [],
    danmaku: null,
    startPosition: 0,
    preferDirectAVPlayer: true,
  };
}

async function play(flagOrInput, id, flags) {
  if (arguments.length === 1 && flagOrInput && typeof flagOrInput === "object" && flagOrInput.raw) {
    return getPlayback(flagOrInput);
  }

  const playback = await getPlayback(id || flagOrInput);
  return {
    parse: 0,
    jx: 0,
    playUrl: "",
    url: playback.url,
    videoUrl: playback.videoUrl,
    type: playback.type,
    protocol: playback.protocol,
    contentType: playback.mimeType,
    header: playback.headers,
    headers: playback.headers,
    Header: playback.headers,
    mediaSourceId: playback.mediaSourceId,
  };
}

async function homeContent(filter) {
  return home(filter);
}

async function categoryContent(tid, pg, filter, extend) {
  return category(tid, pg, filter, extend);
}

async function detailContent(ids) {
  return detail(ids);
}

async function playerContent(flag, id, flags) {
  return play(flag, id, flags);
}

async function searchContent(wd, quick, pg) {
  return search(wd, quick, pg);
}

function normalizeLibraryItem(item, category) {
  const link = getLink(item);
  const id = link || item.id;
  const title = cleanText(item.title || item.name || "");
  return {
    id,
    sourceId: WidgetMetadata.id,
    type: "movie",
    mediaType: "movie",
    title,
    name: title,
    link,
    posterPath: item.posterPath || item.backdropPath,
    backdropPath: item.backdropPath || item.posterPath,
    thumbnailURL: item.posterPath || item.backdropPath,
    previewUrl: item.previewUrl,
    releaseDate: item.releaseDate || item.durationText,
    durationText: item.durationText || item.releaseDate,
    description: item.description || "",
    genreTitle: (category && category.title) || item.genreTitle || "",
    categoryId: category && category.id,
    providerIds: {
      jable: id,
      source: WidgetMetadata.id,
    },
    playable: true,
    playerType: "ijk",
  };
}

function normalizeDetail(detail, originalInput) {
  const base = normalizeLibraryItem(
    {
      ...originalInput,
      ...detail,
      posterPath: detail.posterPath || (originalInput && originalInput.posterPath),
      backdropPath: detail.backdropPath || (originalInput && originalInput.backdropPath),
    },
    { id: "detail", title: detail.genreTitle || "\u8be6\u60c5" }
  );

  return {
    ...base,
    ...detail,
    pageType: "detail",
    type: "movie",
    poster: detail.posterPath || base.posterPath || "",
    backdrop: detail.backdropPath || detail.posterPath || base.backdropPath || "",
    overview: detail.description,
    genres: detail.tags || [],
    cast: (detail.actors || []).map((name) => ({ id: name, name })),
    resourceGroups: buildMiniResourceGroups(detail),
    resourceSummary: {
      versionCount: detail.videoUrl ? 1 : 0,
      episodeCount: 0,
      defaultVersionId: detail.videoUrl ? `${detail.id}#hls` : "",
    },
    recommendations: [],
    mediaSources: [
      {
        id: `${detail.id}#hls`,
        name: "Jable HLS",
        displayName: "Jable HLS",
        protocol: "hls",
        container: "m3u8",
        url: detail.videoUrl,
        path: detail.videoUrl,
        headers: detail.customHeaders,
      },
    ],
  };
}

function categoryShortcutItems() {
  return JABLE_ALL_CATEGORIES.slice(0, 48).map((category) => ({
    id: category.id,
    title: category.title,
    subtitle: category.group || "Jable",
    type: "collection",
    action: { type: "category", id: category.id, pageId: category.id, title: category.title },
  }));
}

function homeSectionStyle(category) {
  const group = String((category && category.group) || "");
  const kind = String((category && category.kind) || "");
  const id = String((category && category.id) || "");
  if (kind === "tag" || kind === "category") return "discover.spotlight";
  if (/衣着|剧情|地点|身材|职业|交合|玩法|主题|杂项/.test(group)) return "discover.spotlight";
  if (/^tag-|^category-/.test(id)) return "discover.spotlight";
  return "discover.standard";
}

function toMiniMediaItem(item, rank, category) {
  if (!item) return null;
  const link = getLink(item);
  const id = link || item.id || item.itemId;
  const title = cleanText(item.title || item.name || item.vod_name || "");
  if (!id || !title) return null;
  const poster = firstNonEmpty(item.poster, item.posterPath, item.backdrop, item.backdropPath, item.thumbnailURL, item.vod_pic);
  const remarks = firstNonEmpty(item.remarks, item.durationText, item.releaseDate, item.vod_remarks);
  const subtitle = firstNonEmpty(item.subtitle, remarks, item.genreTitle, category && category.title);
  const badges = []
    .concat(item.badges || [])
    .concat(category && category.title ? [category.title] : [])
    .filter(Boolean)
    .slice(0, 4);

  return {
    id,
    title,
    subtitle,
    type: "movie",
    poster,
    backdrop: firstNonEmpty(item.backdrop, item.backdropPath, poster),
    overview: item.overview || item.description || item.vod_content || "",
    year: item.year || undefined,
    rating: item.rating || undefined,
    rank,
    remarks,
    badges,
    providerIds: {
      jable: id,
      source: WidgetMetadata.id,
    },
    action: { type: "detail", id, itemId: id },
  };
}

function buildMiniResourceGroups(detail) {
  if (!detail || !detail.videoUrl) return [];
  const itemId = detail.link || detail.id;
  const versionId = `${itemId}#hls`;
  const title = detail.title || detail.name || "Jable HLS";
  return [
    {
      id: "online",
      title: "\u5728\u7ebf\u64ad\u653e",
      versions: [
        {
          id: versionId,
          title: "Jable HLS",
          name: "Jable HLS",
          subtitle: firstNonEmpty(detail.durationText, "\u76f4\u63a5\u64ad\u653e\u5730\u5740"),
          quality: "",
          sourceName: "Jable",
          availability: "playable",
          container: "m3u8",
          url: detail.videoUrl,
          headers: detail.customHeaders,
          default: true,
          action: {
            type: "play",
            itemId,
            versionId,
            url: detail.videoUrl,
            title,
          },
        },
      ],
    },
  ];
}

function playbackFromDirectUrl(url, ext = {}) {
  const link = absolutizeUrl(url);
  const referer = firstNonEmpty(ext.referer, ext.refererUrl, ext.itemId, ext.link, ext.id, JABLE_BASE_URL + "/");
  const container = inferContainer(link);
  const headers = ext.headers || ext.header || ext.customHeaders || { ...JABLE_PLAY_HEADERS, Referer: absolutizeUrl(referer) };
  return {
    id: ext.versionId || ext.id || link,
    title: ext.title || ext.name || "Jable HLS",
    url: link,
    videoUrl: link,
    type: container === "m3u8" ? "hls" : container,
    protocol: container === "m3u8" ? "hls" : "",
    container,
    mimeType: container === "m3u8" ? "application/vnd.apple.mpegurl" : "",
    playerType: "ijk",
    headers,
    subtitles: [],
    danmaku: null,
    startPosition: 0,
    preferDirectAVPlayer: container === "m3u8" || container === "mpd" || container === "ts",
    mediaSourceId: ext.versionId || `${link}#direct`,
  };
}

function inferContainer(url) {
  const value = String(url || "").split("?")[0].split("#")[0].toLowerCase();
  const match = value.match(/\.([a-z0-9]+)$/);
  if (!match) return "";
  if (match[1] === "m3u" || match[1] === "m3u8") return "m3u8";
  return match[1];
}

function toSourceClass(category) {
  return {
    type_id: category.id,
    type_name: category.title,
    group: category.group || "\u63a8\u8350",
    kind: category.kind,
  };
}

function buildSourceFilters() {
  const filters = {};
  for (const category of JABLE_ALL_CATEGORIES) {
    filters[category.id] = [
      {
        key: "sort_by",
        name: "\u6392\u5e8f",
        value: (category.sortOptions || defaultSortOptions()).map((sort) => ({
          n: sort.title,
          v: sort.value || sort.id,
        })),
      },
    ];
  }
  return filters;
}

function toSourcePage(items, page) {
  const currentPage = normalizePage(page);
  const list = (items || []).map(toVodItem);
  const hasNextPage = list.length >= SOURCE_PAGE_LIMIT;
  return {
    page: currentPage,
    pagecount: hasNextPage ? currentPage + 1 : currentPage,
    limit: SOURCE_PAGE_LIMIT,
    total: hasNextPage ? currentPage * SOURCE_PAGE_LIMIT + 1 : (currentPage - 1) * SOURCE_PAGE_LIMIT + list.length,
    list,
    items,
  };
}

function toVodItem(item) {
  const link = getLink(item);
  const title = cleanText(item.title || item.name || item.vod_name || "");
  const poster = firstNonEmpty(item.posterPath, item.backdropPath, item.thumbnailURL, item.vod_pic);
  return {
    vod_id: link || item.id || item.vod_id,
    vod_name: title,
    vod_pic: poster,
    vod_remarks: firstNonEmpty(item.durationText, item.releaseDate, item.vod_remarks),
    vod_tag: "file",
    type_name: item.genreTitle || "",
    vod_content: item.description || item.overview || "",
    id: link || item.id || item.vod_id,
    title,
    name: title,
    link,
    posterPath: poster,
    backdropPath: item.backdropPath || poster,
    thumbnailURL: poster,
    mediaType: item.mediaType || "movie",
    type: item.type || "movie",
    playable: item.playable !== false,
    playerType: item.playerType || "ijk",
  };
}

function toVodDetail(detail) {
  const vod = toVodItem(detail);
  const title = detail.title || detail.name || vod.vod_name || "\u64ad\u653e";
  const playId = detail.link || detail.id || vod.vod_id;
  return {
    ...vod,
    vod_id: playId,
    vod_name: title,
    vod_pic: detail.posterPath || detail.backdropPath || vod.vod_pic,
    type_name: detail.genreTitle || vod.type_name,
    vod_year: detail.releaseDate || "",
    vod_area: "Jable",
    vod_actor: Array.isArray(detail.actors) ? detail.actors.join(", ") : "",
    vod_director: detail.studio || "",
    vod_content: detail.description || detail.overview || "",
    vod_play_from: "Jable",
    vod_play_url: `${title}$${playId}`,
    mediaSources: detail.mediaSources,
    videoUrl: detail.videoUrl,
    customHeaders: detail.customHeaders,
  };
}

function toForwardVideoItem({ link, title, cover, preview, durationText }) {
  const url = absolutizeUrl(link);
  return {
    id: url,
    type: "url",
    title: title || extractTitleFromUrl(url),
    posterPath: absolutizeUrl(cover),
    backdropPath: absolutizeUrl(cover),
    previewUrl: absolutizeUrl(preview),
    link: url,
    mediaType: "movie",
    description: "",
    releaseDate: durationText || "",
    durationText: durationText || "",
    playerType: "ijk",
  };
}

function extractDetailMetadata(html, pageUrl) {
  if (hasWidgetHtml()) {
    const $ = Widget.html.load(html);
    const title = cleanText($("h4, h1, .video-title, title").first().text());
    const poster = absolutizeUrl(
      firstNonEmpty(
        $('meta[property="og:image"]').attr("content"),
        $("video").attr("poster"),
        $(".video-img-box img").attr("data-src"),
        $("img").first().attr("data-src"),
        $("img").first().attr("src")
      ),
      pageUrl
    );
    const description = cleanText(firstNonEmpty($('meta[name="description"]').attr("content"), $(".description").text()));
    const durationText = cleanText($(".absolute-bottom-right .label, .duration, [class*='duration']").first().text());
    const tags = $(".tags a, a[href*='/tags/']")
      .toArray()
      .map((el) => cleanText($(el).text()))
      .filter(Boolean);
    const actors = $("a[href*='/models/']")
      .toArray()
      .map((el) => cleanText($(el).text()))
      .filter(Boolean);
    const studio = cleanText($("a[href*='/studios/']").first().text());

    return {
      title: title || extractTitleFromUrl(pageUrl),
      poster,
      description,
      durationText,
      releaseDate: "",
      tags: unique(tags),
      actors: unique(actors),
      studio,
    };
  }

  const title = cleanText(
    firstNonEmpty(
      decodeHtml(extractAttr(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)),
      stripTags(extractMatch(html, /<h[14][^>]*>([\s\S]*?)<\/h[14]>/i)),
      decodeHtml(extractMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i))
    )
  );
  const poster = absolutizeUrl(
    firstNonEmpty(
      extractAttr(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i),
      extractAttr(html, /<video[^>]+poster=["']([^"']+)["']/i),
      extractAttr(html, /<img[^>]+data-src=["']([^"']+)["']/i),
      extractAttr(html, /<img[^>]+src=["']([^"']+)["']/i)
    ),
    pageUrl
  );

  return {
    title: title || extractTitleFromUrl(pageUrl),
    poster,
    description: cleanText(decodeHtml(extractAttr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i))),
    durationText: cleanText(stripTags(extractMatch(html, /<span[^>]*class=["'][^"']*label[^"']*["'][^>]*>([\s\S]*?)<\/span>/i))),
    releaseDate: "",
    tags: unique(extractAnchorTexts(html, /\/tags\//)),
    actors: unique(extractAnchorTexts(html, /\/models\//)),
    studio: unique(extractAnchorTexts(html, /\/studios\//))[0] || "",
  };
}

function extractHlsUrl(html) {
  return (
    extractMatch(html, /var\s+hlsUrl\s*=\s*["']([^"']+)["']/i) ||
    extractMatch(html, /hlsUrl\s*[:=]\s*["']([^"']+\.m3u8[^"']*)["']/i) ||
    extractMatch(html, /["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i) ||
    extractMatch(html, /source\s+src=["']([^"']+\.m3u8[^"']*)["']/i)
  );
}

function buildListUrl(url, { sortBy, page }) {
  let nextUrl = String(url || "");
  if (sortBy) {
    nextUrl = setQueryParam(nextUrl, "sort_by", sortBy);
  }
  if (page) {
    nextUrl = setQueryParam(nextUrl, "from", String(page));
  }
  return nextUrl;
}

function findCategory(categoryId) {
  return JABLE_ALL_CATEGORIES.find((item) => item.id === categoryId) || JABLE_ALL_CATEGORIES[0];
}

function makeAsyncListUrl(path) {
  return `${JABLE_BASE_URL}${path}?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`;
}

function dedupeCategoryDefinitions(categories) {
  const seen = new Set();
  return categories.filter((category) => {
    const key = `${category.id}|${category.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function defaultSortOptions() {
  return [
    { id: "latest", title: "\u6700\u8fd1\u66f4\u65b0", value: "post_date" },
    { id: "viewed", title: "\u6700\u591a\u89c2\u770b", value: "video_viewed" },
    { id: "favorite", title: "\u6700\u591a\u6536\u85cf", value: "most_favourited" },
  ];
}

async function httpGet(url, options = {}) {
  if (typeof Widget !== "undefined" && Widget.http && typeof Widget.http.get === "function") {
    return Widget.http.get(url, options);
  }
  if (typeof fetch === "function") {
    const response = await fetch(url, {
      method: "GET",
      headers: options.headers || {},
    });
    const data = await response.text();
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }
  if (typeof $http !== "undefined" && typeof $http.get === "function") {
    return $http.get(url, options);
  }
  throw new Error("No HTTP client is available in this JavaScript runtime.");
}

function getResponseText(response) {
  if (typeof response === "string") {
    return response;
  }
  if (!response) {
    return "";
  }
  if (typeof response.data === "string") {
    return response.data;
  }
  if (typeof response.body === "string") {
    return response.body;
  }
  return String(response.data || response.body || "");
}

function hasWidgetHtml() {
  return typeof Widget !== "undefined" && Widget.html && typeof Widget.html.load === "function";
}

function argsify(ctx) {
  if (!ctx) return {};
  if (typeof ctx === "string") {
    const value = ctx.trim();
    if (!value) return {};
    if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]"))) {
      try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      } catch (error) {
        return {};
      }
    }
    return {};
  }
  if (typeof ctx === "object" && !Array.isArray(ctx)) return ctx;
  return {};
}

function getLink(input) {
  if (!input) {
    return "";
  }
  if (typeof input === "string") {
    return absolutizeUrl(input);
  }
  return absolutizeUrl(firstNonEmpty(input.link, input.itemId, input.url, input.playUrl, input.videoUrl, input.versionId, input.id, input.videoId));
}

function firstSourceId(input) {
  if (Array.isArray(input)) {
    return firstSourceId(input[0]);
  }
  if (input && typeof input === "object") {
    return getLink(input);
  }
  return firstNonEmpty(...String(input || "").split("$$$").flatMap((part) => part.split(",")));
}

function normalizePage(page) {
  const value = Number(page || 1);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

function scoreMatch(item, params, keyword) {
  const title = normalizeTitle(item.title || item.name);
  const query = normalizeTitle(firstNonEmpty(params.title, params.name, params.originalTitle, keyword));
  const expectedCode = normalizeCode(firstNonEmpty(params.jableCode, extractJavCode(query), extractJavCode(keyword)));
  const itemCode = normalizeCode(extractJavCode(title));

  if (expectedCode && itemCode && expectedCode === itemCode) {
    return 1;
  }
  if (query && title === query) {
    return 0.95;
  }
  if (query && title.includes(query)) {
    return 0.8;
  }
  if (expectedCode && title.includes(expectedCode.toLowerCase())) {
    return 0.75;
  }

  const queryTokens = query.split(/\s+/).filter((token) => token.length > 1);
  if (!queryTokens.length) {
    return 0.3;
  }
  const matchedTokens = queryTokens.filter((token) => title.includes(token)).length;
  return matchedTokens / queryTokens.length;
}

function extractJavCode(value) {
  const match = String(value || "").toUpperCase().match(/\b([A-Z]{2,8})[-_\s]?(\d{2,6})\b/);
  return match ? `${match[1]}-${match[2]}` : "";
}

function normalizeCode(value) {
  const code = extractJavCode(value);
  return code || String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\u3000]/g, " ")
    .replace(/[._\-:：/\\()[\]{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractAnchorTexts(html, hrefPattern) {
  const items = [];
  const regex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(String(html || "")))) {
    const attrs = match[1] || "";
    if (hrefPattern.test(attrs)) {
      const text = cleanText(stripTags(match[2]));
      if (text) {
        items.push(text);
      }
    }
  }
  return items;
}

function extractTitleFromUrl(url) {
  const parts = String(url || "").split("/").filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] || "Jable");
}

function isJableVideoUrl(url) {
  return /^https?:\/\/(?:www\.)?jable\.tv\/videos\/[^/?#]+\/?/i.test(String(url || ""));
}

function absolutizeUrl(url, base = JABLE_BASE_URL) {
  if (!url) {
    return "";
  }
  const value = String(url).trim();
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  if (value.startsWith("/")) {
    const origin = String(base).match(/^(https?:\/\/[^/]+)/i);
    return `${origin ? origin[1] : JABLE_BASE_URL}${value}`;
  }
  if (/^https?:\/\//i.test(base)) {
    return `${String(base).replace(/[#?].*$/, "").replace(/\/[^/]*$/, "/")}${value}`;
  }
  return value;
}

function setQueryParam(url, name, value) {
  const [urlWithoutHash, hash = ""] = String(url || "").split("#");
  const [base, query = ""] = urlWithoutHash.split("?");
  const params = query
    .split("&")
    .filter(Boolean)
    .map((part) => part.split("="))
    .filter(([key]) => decodeURIComponent(key) !== name);
  params.push([encodeURIComponent(name), encodeURIComponent(value)]);
  const nextQuery = params.map(([key, val]) => `${key}=${val}`).join("&");
  return `${base}?${nextQuery}${hash ? `#${hash}` : ""}`;
}

function extractMatch(value, regex) {
  const match = String(value || "").match(regex);
  return match ? match[1] || match[0] || "" : "";
}

function extractAttr(value, regex) {
  return decodeHtml(extractMatch(value, regex));
}

function stripTags(value) {
  return String(value || "").replace(/<[^>]*>/g, " ");
}

function cleanText(value) {
  return decodeHtml(value).replace(/\s+/g, " ").trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, " ")
    .replace(/&nbsp;/g, " ");
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
}

function logInfo(value) {
  if (typeof $log !== "undefined" && $log && typeof $log.info === "function") {
    $log.info(value);
    return;
  }
  if (typeof console !== "undefined" && console && typeof console.log === "function") {
    console.log(value);
  }
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

const JableMediaLibrary = {
  metadata: WidgetMetadata,
  categories: JABLE_ALL_CATEGORIES,
  init,
  getManifest,
  getHome,
  getCategory,
  home,
  homeVod,
  homeContent,
  homeSections,
  category,
  categoryContent,
  detail,
  detailContent,
  play,
  playerContent,
  searchContent,
  getCategories,
  getItems,
  getPosterWall: loadPosterWall,
  getDetail,
  getResourceVersions,
  resolvePlayback,
  matchResources,
  matchMovie,
  matchEpisode,
  matchMedia,
  getPlayback,
  search,
  getSearch: getSearchPage,
  onSearch,
  searchLibrary,
  loadPage,
  loadPageSections,
  loadDetail,
};

function __jsEvalReturn() {
  return JableMediaLibrary;
}

if (typeof globalThis !== "undefined") {
  globalThis.JableMediaLibrary = JableMediaLibrary;
  globalThis.WidgetMetadata = WidgetMetadata;
  globalThis.init = init;
  globalThis.getManifest = getManifest;
  globalThis.getHome = getHome;
  globalThis.getCategory = getCategory;
  globalThis.getResourceVersions = getResourceVersions;
  globalThis.resolvePlayback = resolvePlayback;
  globalThis.matchResources = matchResources;
  globalThis.matchMovie = matchMovie;
  globalThis.matchEpisode = matchEpisode;
  globalThis.getSearch = getSearchPage;
  globalThis.onSearch = onSearch;
  globalThis.home = home;
  globalThis.homeVod = homeVod;
  globalThis.homeContent = homeContent;
  globalThis.homeSections = homeSections;
  globalThis.category = category;
  globalThis.categoryContent = categoryContent;
  globalThis.detail = detail;
  globalThis.detailContent = detailContent;
  globalThis.play = play;
  globalThis.playerContent = playerContent;
  globalThis.search = search;
  globalThis.searchContent = searchContent;
  globalThis.__jsEvalReturn = __jsEvalReturn;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = JableMediaLibrary;
}
