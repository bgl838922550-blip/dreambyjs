/*
 * Jable custom media library source for baiPlay.
 *
 * It keeps the Forward widget-compatible entry points and also exposes:
 * - baiPlay media-library API: getCategories/getItems/getDetail/matchMedia/getPlayback
 * - mini-app source API: home/homeVod/category/detail/search/play
 */

// @name Jable

const JABLE_BASE_URL = "https://jable.tv";
const JABLE_LIST_BLOCK = "list_videos_common_videos_list";
const JABLE_SEARCH_BLOCK = "list_videos_videos_list_search_result";
const JABLE_TITLE = "Jable";
const JABLE_DETAIL_PAYLOAD_PREFIX = "jable://detail?";
const JABLE_LOGO = "data:image/png;base64,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";

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
const CATEGORY_PREVIEW_ITEM_LIMIT = 10;
const CATEGORY_PREVIEW_CONCURRENCY = 3;
const CATEGORY_PREVIEW_CACHE = {};

const JABLE_SORTS = {
  latest: "post_date",
  viewed: "video_viewed",
  favorite: "most_favourited",
  best: "post_date_and_popularity",
};

const JABLE_MODEL_SORT_OPTIONS = [
  { id: "best", title: "\u8fd1\u671f\u6700\u4f73", value: JABLE_SORTS.best },
  { id: "viewed", title: "\u6700\u591a\u89c2\u770b", value: JABLE_SORTS.viewed },
  { id: "latest", title: "\u6700\u8fd1\u66f4\u65b0", value: JABLE_SORTS.latest },
  { id: "favorite", title: "\u6700\u9ad8\u6536\u85cf", value: JABLE_SORTS.favorite },
];

const JABLE_CATEGORY_PAGE_ASPECT_RATIO = "16:9";
const JABLE_DYNAMIC_CATEGORY_PREFIX = "dynamic:";

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

const JABLE_OFFICIAL_TOPIC_CATEGORIES = [
  {
    id: "roleplay",
    title: "\u89d2\u8272\u5287\u60c5",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/roleplay/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/9/s1_roleplay.jpg",
    itemCountText: "30960 \u90e8\u5f71\u7247",
  },
  {
    id: "chinese-subtitle",
    title: "\u4e2d\u6587\u5b57\u5e55",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/chinese-subtitle/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/12/s1_chinese-subtitle.jpg",
    itemCountText: "20442 \u90e8\u5f71\u7247",
  },
  {
    id: "category-uniform",
    title: "\u5236\u670d\u8a98\u60d1",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/uniform/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/10/s1_uniform.jpg",
    itemCountText: "11567 \u90e8\u5f71\u7247",
  },
  {
    id: "category-pantyhose",
    title: "\u7d72\u896a\u7f8e\u817f",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/pantyhose/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/3/s1_pantyhose.jpg",
    itemCountText: "6883 \u90e8\u5f71\u7247",
  },
  {
    id: "category-sex-only",
    title: "\u76f4\u63a5\u958b\u556a",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/sex-only/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/13/s1_sex-only.jpg",
    itemCountText: "6397 \u90e8\u5f71\u7247",
  },
  {
    id: "category-groupsex",
    title: "\u591aP\u7fa4\u4ea4",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/groupsex/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/4/s1_groupsex.jpg",
    itemCountText: "5236 \u90e8\u5f71\u7247",
  },
  {
    id: "category-bdsm",
    title: "\u4e3b\u5974\u8abf\u6559",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/bdsm/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/14/s1_sm.jpg",
    itemCountText: "5195 \u90e8\u5f71\u7247",
  },
  {
    id: "category-pov",
    title: "\u7537\u53cb\u8996\u89d2",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/pov/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/5/s1_pov.jpg",
    itemCountText: "3973 \u90e8\u5f71\u7247",
  },
  {
    id: "category-insult",
    title: "\u51cc\u8fb1\u5feb\u611f",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/insult/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/11/s1_rape.jpg",
    itemCountText: "3440 \u90e8\u5f71\u7247",
  },
  {
    id: "category-private-cam",
    title: "\u76dc\u651d\u5077\u62cd",
    group: "\u5f71\u7247\u4e3b\u9898",
    kind: "category",
    url: `${JABLE_BASE_URL}/categories/private-cam/?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`,
    artwork: "https://assets-cdn.jable.tv/contents/categories/8/s1_s1_private-cam.jpg",
    itemCountText: "516 \u90e8\u5f71\u7247",
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

const JABLE_ALL_CATEGORIES = dedupeCategoryDefinitions([
  ...JABLE_OFFICIAL_TOPIC_CATEGORIES,
  ...JABLE_CATEGORIES,
  ...JABLE_EXTRA_CATEGORY_SHORTCUTS,
]);

const JABLE_HOME_TOPIC_IDS = [
  "roleplay",
  "chinese-subtitle",
  "category-uniform",
  "category-pantyhose",
  "category-sex-only",
  "category-groupsex",
  "category-bdsm",
  "category-pov",
  "category-insult",
  "category-private-cam",
];

const JABLE_HOME_CATEGORY_IDS = [
  "hot",
  "new-release",
  "chinese-subtitle",
  "uncensored-leak",
  "roleplay",
  "category-uniform",
  "category-pantyhose",
  "category-sex-only",
  "category-groupsex",
  "category-bdsm",
  "category-pov",
  "category-insult",
  "category-private-cam",
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

const JABLE_HOME_MEDIA_SECTION_IDS = [
  "hot",
  "new-release",
  "chinese-subtitle",
  "uncensored-leak",
  "roleplay",
];

const JABLE_HOME_SECTION_DEFINITIONS = [
  {
    id: "jable-categories",
    title: "\u5f71\u7247\u4e3b\u9898",
    style: "discover.annualWidePreview",
    ids: JABLE_HOME_TOPIC_IDS,
  },
  {
    id: "jable-featured",
    title: "\u63a8\u8350\u699c\u5355",
    style: "discover.annualListPreview",
    ids: ["hot", "new-release", "chinese-subtitle", "uncensored-leak", "roleplay"],
  },
  {
    id: "jable-themes",
    title: "\u4e3b\u9898",
    style: "discover.annualWidePreview",
    ids: ["category-uniform", "category-sex-only", "category-pov", "category-uncensored", "category-lesbian"],
  },
  {
    id: "jable-models",
    title: "\u5973\u4f18",
    style: "discover.annualPosterStack",
    ids: [
      "models-yua-mikami",
      "models-saika-kawakita",
      "models-otsuki-hibiki",
      "models-julia",
      "models-momonogi-kana",
      "models-kana-mito",
      "models-shinoda-yuu",
      "models-kaede-karen",
      "models-nanasawa-mia",
      "models-honjou-suzu",
    ],
  },
  {
    id: "jable-outfits",
    title: "\u8863\u7740",
    style: "discover.annualPosterStack",
    ids: [
      "tag-black-pantyhose",
      "tag-pantyhose",
      "tag-school-uniform",
      "tag-cosplay",
      "tag-flesh-toned-pantyhose",
      "tag-fishnets",
      "tag-swimsuit",
      "tag-cheongsam",
      "tag-maid",
      "tag-kimono",
    ],
  },
  {
    id: "jable-plot",
    title: "\u5267\u60c5",
    style: "discover.annualListPreview",
    ids: [
      "tag-ntr",
      "tag-time-stop",
      "tag-private-cam",
      "tag-affair",
      "tag-kinship",
      "tag-hypnosis",
      "tag-age-difference",
      "tag-rainy-day",
    ],
  },
  {
    id: "jable-place",
    title: "\u5730\u70b9",
    style: "discover.annualWidePreview",
    ids: [
      "tag-hot-spring",
      "tag-car",
      "tag-tram",
      "tag-prison",
      "tag-swimming-pool",
      "tag-school",
      "tag-magic-mirror",
      "tag-library",
    ],
  },
  {
    id: "jable-body",
    title: "\u8eab\u6750",
    style: "discover.annualPosterStack",
    ids: [
      "tag-big-tits",
      "tag-mature-woman",
      "tag-tall",
      "tag-flexible-body",
      "tag-small-tits",
      "tag-beautiful-leg",
      "tag-beautiful-butt",
      "tag-short-hair",
    ],
  },
  {
    id: "jable-play",
    title: "\u73a9\u6cd5",
    style: "discover.annualListPreview",
    ids: ["tag-creampie", "tag-blowjob", "tag-outdoor", "tag-bondage", "tag-chikan", "tag-massage", "tag-groupsex"],
  },
];

const JABLE_CATEGORY_ARTWORKS = [
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4FOoPAAOjAYfHZ7NgAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPQ7a8GAAIkAThOG1OeAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGNYEV8FAAM0AYJWliY8AAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOoyT4KAAMTAa1f3BC3AAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPYn+0KAANcAXAluVRvAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOwr58CAAJTAVPB7DbrAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOYXRwCAAMPAWMHtnUVAAAAAElFTkSuQmCC",
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPwb94OAAKuAYqydUaeAAAAAElFTkSuQmCC",
];

var WidgetMetadata = {
  id: "baiplay_jable_media_library",
  title: "Jable",
  name: "Jable",
  logo: JABLE_LOGO,
  icon: JABLE_LOGO,
  description: "Jable 自定义媒体库示例，支持分类海报墙、搜索、详情资源和原生播放器调用。",
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
    name: WidgetMetadata.name || WidgetMetadata.title || JABLE_TITLE,
    title: WidgetMetadata.title || JABLE_TITLE,
    version: WidgetMetadata.version || "1.0.0",
    author: WidgetMetadata.author || "baiPlay",
    logo: WidgetMetadata.logo || JABLE_LOGO,
    icon: WidgetMetadata.icon || WidgetMetadata.logo || JABLE_LOGO,
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
    sortOptions: sortOptionsForCategory(category),
    defaultSort: defaultSortForCategory(category),
  }));
}

async function getHome(ctx = {}) {
  const sections = [];

  for (let index = 0; index < JABLE_HOME_MEDIA_SECTION_IDS.length; index += 1) {
    const categoryId = JABLE_HOME_MEDIA_SECTION_IDS[index];
    const category = findCategory(categoryId);
    sections.push(lazyHomeMediaSection(category, index + 1));
  }

  for (const definition of JABLE_HOME_SECTION_DEFINITIONS) {
    const items = categoryShortcutItems(definition.ids);
    if (!items.length) continue;
    sections.push(lazyHomeDefinitionSection(definition, items));
  }

  return {
    pageType: "home",
    title: JABLE_TITLE,
    heroAspectRatio: "16:9",
    hero: [],
    sections,
  };
}

async function getHomeSection(ctx = {}) {
  const ext = argsify(ctx);
  const sectionId = ext.sectionId || ext.id || "";

  if (sectionId.indexOf("jable-home-") === 0) {
    const categoryId = sectionId.replace(/^jable-home-/, "");
    const category = findCategory(categoryId);
    return loadHomeMediaSection(category, JABLE_HOME_MEDIA_SECTION_IDS.indexOf(category && category.id) + 1 || 1);
  }

  const definition = JABLE_HOME_SECTION_DEFINITIONS.find((item) => item.id === sectionId);
  if (definition) {
    const items = await categoryShortcutItemsWithPreviews(definition.ids);
    return lazyHomeDefinitionSection(definition, items, false);
  }

  throw new Error(`Unknown Jable home section: ${sectionId}`);
}

function lazyHomeMediaSection(category, sectionIndex) {
  return {
    id: `jable-home-${category.id}`,
    title: category.title,
    style: "discover.spotlight",
    contentType: "movie",
    lazy: true,
    isLazy: true,
    promotesToHero: category.id === "hot",
    moreAction: {
      type: "category",
      id: category.id,
      pageId: category.id,
      title: category.title,
      itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    },
    loadAction: {
      type: "custom",
      id: `jable-home-${category.id}`,
      title: category.title,
    },
    items: [],
    rank: sectionIndex,
  };
}

function lazyHomeDefinitionSection(definition, items, isLazy = true) {
  return {
    id: definition.id,
    title: definition.title,
    style: definition.style,
    lazy: isLazy,
    isLazy,
    moreAction: {
      type: "category",
      id: items[0] && items[0].action && items[0].action.id,
      pageId: items[0] && items[0].action && items[0].action.pageId,
      title: definition.title,
      itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    },
    loadAction: {
      type: "custom",
      id: definition.id,
      title: definition.title,
    },
    items,
  };
}

async function loadHomeMediaSection(category, sectionIndex) {
  if (!category) {
    return completedHomeMediaSection(
      { id: "unknown", title: "\u5a92\u4f53" },
      [],
      sectionIndex
    );
  }
  try {
    const items = await loadPosterWall({
      categoryId: category.id,
      page: 1,
      sort_by: defaultSortForCategory(category),
    });
    const mediaItems = items
      .map((item, index) => toMiniMediaItem(item, index + 1, category))
      .filter(Boolean)
      .slice(0, 12);
    return completedHomeMediaSection(category, mediaItems, sectionIndex);
  } catch (error) {
    logInfo(`Jable home section skipped (${category.id}): ` + (error && error.message ? error.message : error));
    return completedHomeMediaSection(category, [], sectionIndex);
  }
}

function completedHomeMediaSection(category, items, sectionIndex) {
  return {
    id: `jable-home-${category.id}`,
    title: category.title,
    style: "discover.spotlight",
    contentType: "movie",
    moreAction: {
      type: "category",
      id: category.id,
      pageId: category.id,
      title: category.title,
      itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    },
    items: Array.isArray(items) ? items : [],
    lazy: false,
    isLazy: false,
    promotesToHero: category.id === "hot",
    rank: sectionIndex,
  };
}

async function getCategory(ctx = {}) {
  const ext = argsify(ctx);
  const pageId = ext.pageId || ext.categoryId || ext.tid || ext.id || "hot";
  const page = normalizePage(ext.page || ext.pg || ext.from || 1);
  const category = { ...findCategory(pageId) };
  if (ext.title || ext.name) {
    category.title = cleanText(ext.title || ext.name) || category.title;
  }
  const sortBy = ext.sort_by || ext.sortBy || ext.sort || defaultSortForCategory(category);
  const items = await loadPosterWall({ categoryId: category.id, category, page, sort_by: sortBy });

  return {
    pageType: "category",
    id: category.id,
    title: ext.title || category.title || "\u5206\u7c7b",
    style: "media.posterGrid",
    itemAspectRatio: category.itemAspectRatio || JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    imageOrientation: category.imageOrientation || "landscape",
    page,
    hasMore: items.length >= SOURCE_PAGE_LIMIT,
    selectedSortValue: sortBy,
    sort: sortOptionsForCategory(category).map((sort) => ({
      id: sort.id || sort.value,
      title: sort.title,
      value: sort.value || sort.id,
    })),
    items: items.map((item, index) => toMiniMediaItem(item, (page - 1) * SOURCE_PAGE_LIMIT + index + 1, category)).filter(Boolean),
  };
}

async function home(filter = true) {
  return getHome({ filter });
}

async function homeVod(params = {}) {
  const categoryId = params.categoryId || params.tid || JABLE_HOME_CATEGORY_IDS[0];
  const items = await loadPosterWall({
      categoryId,
      page: params.page || params.pg || 1,
      sort_by: params.sort_by || params.sortBy || defaultSortForCategory(findCategory(categoryId)),
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
      sort_by: defaultSortForCategory(category),
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
  const category = params.category || findCategory(params.categoryId || params.id || "hot");
  const sortBy = params.sort_by || params.sortBy || defaultSortForCategory(category);
  const listUrl = buildListUrl(category.url, { sortBy, page });
  const sections = await loadPageSections({ url: listUrl });
  const categoryContext = { ...category, currentSort: sortBy };
  return sections.flatMap((section) => section.childItems).map((item) => normalizeLibraryItem(item, categoryContext));
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
      const $videoLinks = $itemElement.find("a[href*='/videos/']");
      const $title = firstUsefulJableTitleLink($, $itemElement, $videoLinks);
      const link = absolutizeUrl(
        ($title && $title.attr("href")) ||
          $videoLinks
            .toArray()
            .map((element) => $(element).attr("href"))
            .find((href) => isJableVideoUrl(absolutizeUrl(href || ""))) ||
          ""
      );
      if (!isJableVideoUrl(link)) {
        continue;
      }

      const $cover = $itemElement.find("img").first();
      const metadata = jableCardMetadataFromCheerio($, $itemElement);
      const cardHtml = $itemElement.html();
      const cardText = cleanText($itemElement.text());
      items.push(
        toForwardVideoItem({
          link,
          title: bestJableTitle(
            ...jableTitleCandidatesFromCheerio($, $itemElement, $videoLinks),
            $cover.attr("alt"),
            $cover.attr("title")
          ),
          cover: firstNonEmpty($cover.attr("data-src"), $cover.attr("src")),
          preview: $cover.attr("data-preview"),
          durationText: cleanText($itemElement.find(".absolute-bottom-right .label").first().text()),
          actors: metadata.actors,
          tags: metadata.tags,
          viewCountText: detailCountText(cardHtml, cardText, "views"),
          favoriteCountText: detailCountText(cardHtml, cardText, "favorites"),
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
    const anchors = extractAnchors(cardHtml);
    const videoAnchors = anchors.filter((anchor) => isJableVideoUrl(absolutizeUrl(anchor.href)));
    const link = absolutizeUrl(firstNonEmpty(...videoAnchors.map((anchor) => anchor.href)));
    if (!isJableVideoUrl(link)) {
      continue;
    }

    const imgHtml = extractMatch(cardHtml, /<img\b[^>]*>/i);
    const title = bestJableTitle(
      ...jableTitleCandidatesFromRegex(cardHtml, videoAnchors),
      extractAttr(imgHtml, /\balt=["']([^"']*)["']/i),
      extractAttr(imgHtml, /\btitle=["']([^"']*)["']/i)
    );
    const cover = firstNonEmpty(
      extractAttr(imgHtml, /\bdata-src=["']([^"']+)["']/i),
      extractAttr(imgHtml, /\bsrc=["']([^"']+)["']/i)
    );
    const preview = extractAttr(imgHtml, /\bdata-preview=["']([^"']+)["']/i);
    const durationText = cleanText(stripTags(extractMatch(cardHtml, /<span[^>]*class=["'][^"']*label[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)));
    const metadata = jableCardMetadataFromAnchors(anchors);

    const cardText = cleanText(stripTags(cardHtml));
    items.push(toForwardVideoItem({
      link,
      title,
      cover,
      preview,
      durationText,
      actors: metadata.actors,
      tags: metadata.tags,
      viewCountText: detailCountText(cardHtml, cardText, "views"),
      favoriteCountText: detailCountText(cardHtml, cardText, "favorites"),
    }));
  }

  return dedupeById(items);
}

function jableCardMetadataFromCheerio($, $itemElement) {
  const anchors = $itemElement.find("a").toArray().map((element) => {
    const $link = $(element);
    return {
      href: $link.attr("href"),
      text: $link.text(),
      title: $link.attr("title"),
      ariaLabel: $link.attr("aria-label"),
      originalTitle: $link.attr("data-original-title"),
    };
  });
  return jableCardMetadataFromAnchors(anchors);
}

function jableCardMetadataFromAnchors(anchors) {
  const actors = [];
  const tags = [];
  for (const anchor of anchors || []) {
    const metadata = classifyJableMetadataAnchor(anchor);
    if (!metadata) continue;
    if (metadata.type === "actor") actors.push(metadata.actor || metadata.title);
    if (metadata.type === "tag") tags.push(metadata.title);
  }
  return {
    actors: uniquePeople(actors),
    tags: unique(tags),
  };
}

function classifyJableMetadataAnchor(anchor) {
  const href = absolutizeUrl(anchor && anchor.href);
  if (!href || isJableVideoUrl(href)) return null;

  const type = /\/(?:s\d+\/)?models\//i.test(href)
    ? "actor"
    : /\/(?:tags|categories)\//i.test(href)
      ? "tag"
      : "";
  if (!type) return null;

  const title = cleanText(
    firstNonEmpty(
      anchor && anchor.text,
      anchor && anchor.title,
      anchor && anchor.ariaLabel,
      anchor && anchor.originalTitle,
      jableCategoryTitleFromHref(href)
    )
  );
  if (!title || isJableDurationText(title)) return null;

  const category = categoryFromMetadataHref(href, title, type);
  const action = category
    ? {
        type: "category",
        id: category.id,
        pageId: category.id,
        title: category.title,
        itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
      }
    : null;

  return {
    type,
    title,
    href,
    categoryId: category && category.id,
    actor: type === "actor"
      ? {
          id: (category && category.id) || title,
          name: title,
          title,
          role: "\u6f14\u5458",
          url: href,
          href,
          action,
        }
      : null,
    action,
  };
}

function firstUsefulJableTitleLink($, $itemElement, $videoLinks) {
  const titleLink = $itemElement.find(".title a[href*='/videos/']").first();
  if (titleLink && titleLink.length && !isJableDurationText(titleLink.text())) {
    return titleLink;
  }

  for (const element of $videoLinks.toArray()) {
    const $link = $(element);
    const candidates = [
      $link.text(),
      $link.attr("title"),
      $link.attr("aria-label"),
      $link.attr("data-original-title"),
    ].map(cleanText);
    if (candidates.some((value) => value && !isJableDurationText(value))) {
      return $link;
    }
  }

  return titleLink && titleLink.length ? titleLink : $videoLinks.first();
}

function jableTitleCandidatesFromCheerio($, $itemElement, $videoLinks) {
  const candidates = [];
  const append = (value) => {
    const text = cleanText(value);
    if (text && !isJableDurationText(text)) candidates.push(text);
  };

  $itemElement.find(".title a[href*='/videos/'], a[href*='/videos/']").each((_, element) => {
    const $link = $(element);
    append($link.text());
    append($link.attr("title"));
    append($link.attr("aria-label"));
    append($link.attr("data-original-title"));
  });

  $videoLinks.each((_, element) => {
    const $link = $(element);
    append($link.text());
    append($link.attr("title"));
    append($link.attr("aria-label"));
    append($link.attr("data-original-title"));
  });

  return unique(candidates);
}

function jableTitleCandidatesFromRegex(cardHtml, videoAnchors) {
  const candidates = [];
  const append = (value) => {
    const text = cleanText(value);
    if (text && !isJableDurationText(text)) candidates.push(text);
  };

  append(stripTags(extractMatch(cardHtml, /<div[^>]*class=["'][^"']*\btitle\b[^"']*["'][^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i)));
  for (const anchor of videoAnchors) {
    append(anchor.text);
    append(anchor.title);
    append(anchor.ariaLabel);
    append(anchor.originalTitle);
  }

  return unique(candidates);
}

async function getDetail(input) {
  const ext = argsify(input);
  const source = Object.keys(ext).length ? ext : input;
  const detail = await loadDetail(source);
  return normalizeDetail(detail, source);
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
  const context = buildDetailContext(link);
  const pageUrl = context.url;
  if (!pageUrl) {
    throw new Error("Jable detail url is required.");
  }

  const metadata = await loadDetailMetadata(context);
  const actors = uniquePeople(context.actors.concat(metadata.actors || []));
  const tags = unique(context.tags.concat(metadata.tags || []));
  const viewCountText = firstNonEmpty(metadata.viewCountText, context.viewCountText);
  const favoriteCountText = firstNonEmpty(metadata.favoriteCountText, context.favoriteCountText);
  const detailImage = firstNonEmpty(
    metadata.detailImage,
    metadata.backdrop,
    metadata.poster,
    jableDetailImageUrl(context.backdrop),
    jableDetailImageUrl(context.poster),
    context.backdrop,
    context.poster
  );
  const detailImageAspectRatio = firstNonEmpty(metadata.detailImageAspectRatio, context.detailImageAspectRatio);
  const recommendations = await loadListRecommendations(context);
  const runtimeMinutes = durationTextToMinutes(context.durationText);
  return {
    id: context.itemId,
    type: "movie",
    title: context.title,
    name: context.title,
    link: pageUrl,
    videoUrl: "",
    posterPath: detailImage || context.poster,
    backdropPath: detailImage || context.backdrop || context.poster,
    detailImage: detailImage,
    detailImageAspectRatio,
    imageAspectRatio: detailImageAspectRatio,
    backdropAspectRatio: detailImageAspectRatio,
    heroAspectRatio: detailImageAspectRatio,
    mediaType: "movie",
    description: context.overview,
    overview: context.overview,
    summary: context.overview,
    plot: context.overview,
    content: context.overview,
    subtitle: context.overview,
    releaseDate: context.durationText,
    durationText: context.durationText,
    metadataText: context.durationText,
    runtimeMinutes,
    runtime: runtimeMinutes,
    duration: runtimeMinutes,
    viewCountText,
    favoriteCountText,
    genreTitle: context.categoryTitle,
    actors,
    tags,
    genres: tags,
    studio: JABLE_TITLE,
    studios: [JABLE_TITLE],
    recommendations,
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
      const item = toMiniMediaItem(match.item, results.length + 1, { title: JABLE_TITLE });
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
  const source = Object.keys(ext).length ? ext : input;
  const directUrl = firstNonEmpty(ext.playUrl, ext.videoUrl, isPlayableDirectUrl(ext.url) ? ext.url : "");
  if (directUrl) {
    return playbackFromDirectUrl(directUrl, ext);
  }
  const playback = await loadPlayback(source);
  return {
    id: playback.id,
    title: playback.title,
    url: playback.url,
    videoUrl: playback.url,
    type: "hls",
    protocol: "hls",
    container: "m3u8",
    mimeType: "application/vnd.apple.mpegurl",
    playerType: "ijk",
    headers: playback.headers,
    mediaSourceId: playback.mediaSourceId,
  };
}

async function getResourceVersions(ctx = {}) {
  const detail = await getDetail(ctx);
  return detail.resourceGroups || [];
}

async function resolvePlayback(ctx = {}) {
  const ext = argsify(ctx);
  const directUrl = firstNonEmpty(ext.playUrl, ext.videoUrl, isPlayableDirectUrl(ext.url) ? ext.url : "");
  if (directUrl) {
    return playbackFromDirectUrl(directUrl, ext);
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
  const overview = item.overview || item.summary || item.plot || item.content || item.description || "";
  const actors = uniquePeople(item.actors || item.cast || item.people);
  const tags = normalizeTextList(item.tags || item.genres || item.genre);
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
    metadataText: item.durationText || item.releaseDate,
    viewCountText: item.viewCountText || item.viewsText || item.views || "",
    favoriteCountText: item.favoriteCountText || item.favoritesText || item.favorites || "",
    fullTitle: item.fullTitle || item.originalTitle || title,
    originalTitle: item.originalTitle || item.fullTitle || title,
    description: overview,
    overview,
    summary: overview,
    plot: overview,
    content: overview,
    genreTitle: (category && category.title) || item.genreTitle || "",
    categoryId: category && category.id,
    categoryTitle: category && category.title,
    sortBy: category && (category.currentSort || defaultSortForCategory(category)),
    actors,
    tags,
    genres: tags,
    providerIds: {
      jable: id,
      source: WidgetMetadata.id,
    },
    playable: true,
    playerType: "ijk",
  };
}

function normalizeDetail(detail, originalInput) {
  const originalObject = originalInput && typeof originalInput === "object" && !Array.isArray(originalInput) ? originalInput : {};
  const resourceGroups = buildMiniResourceGroups(detail);
  const defaultVersion = resourceGroups.flatMap((group) => group.versions || [])[0];
  const base = normalizeLibraryItem(
    {
      ...originalObject,
      ...detail,
      posterPath: detail.posterPath || originalObject.posterPath,
      backdropPath: detail.backdropPath || originalObject.backdropPath,
    },
    { id: "detail", title: detail.genreTitle || "\u8be6\u60c5" }
  );
  const mediaSources = detail.videoUrl
    ? [
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
      ]
    : [];

  return {
    ...base,
    ...detail,
    pageType: "detail",
    type: "movie",
    poster: detail.posterPath || base.posterPath || "",
    backdrop: detail.backdropPath || detail.posterPath || base.backdropPath || "",
    detailImageAspectRatio: detail.detailImageAspectRatio || detail.imageAspectRatio || base.aspectRatio || "",
    imageAspectRatio: detail.imageAspectRatio || detail.detailImageAspectRatio || base.aspectRatio || "",
    backdropAspectRatio: detail.backdropAspectRatio || detail.detailImageAspectRatio || detail.imageAspectRatio || "",
    overview: detail.overview || detail.description || detail.summary || detail.plot || detail.content || base.overview,
    summary: detail.summary || detail.overview || detail.description || base.summary,
    plot: detail.plot || detail.overview || detail.description || base.overview,
    content: detail.content || detail.overview || detail.description || base.overview,
    genres: unique([].concat(detail.genres || []).concat(detail.tags || [])),
    studios: detail.studios || (detail.studio ? [detail.studio] : []),
    cast: miniCastMembers(detail.cast || detail.actors || []),
    resourceGroups,
    resourceSummary: {
      versionCount: defaultVersion ? 1 : 0,
      episodeCount: 0,
      defaultVersionId: defaultVersion ? defaultVersion.id : "",
    },
    recommendations: detail.recommendations || [],
    mediaSources,
  };
}

function categoryShortcutItems(categoryIds) {
  const categories = Array.isArray(categoryIds) && categoryIds.length
    ? categoryIds.map((id) => JABLE_ALL_CATEGORIES.find((item) => item.id === id)).filter(Boolean)
    : JABLE_ALL_CATEGORIES.slice(0, 48);

  return categories.map((category, index) => categoryShortcutItem(category, index + 1));
}

async function categoryShortcutItemsWithPreviews(categoryIds) {
  const categories = Array.isArray(categoryIds) && categoryIds.length
    ? categoryIds.map((id) => JABLE_ALL_CATEGORIES.find((item) => item.id === id)).filter(Boolean)
    : JABLE_ALL_CATEGORIES.slice(0, 48);
  const items = categories.map((category, index) => categoryShortcutItem(category, index + 1));

  await eachLimit(categories, CATEGORY_PREVIEW_CONCURRENCY, async (category, index) => {
    const previewItems = await loadCategoryPreviewItems(category);
    applyCategoryPreviewItems(items[index], previewItems);
  });

  return items;
}

function categoryShortcutItem(category, rank, previewItems = []) {
  const group = category.group || "\u63a8\u8350";
  const image = firstCategoryPreviewImage(previewItems) || categoryArtwork(category, rank);
  const metadataText = firstNonEmpty(category.itemCountText, group);
  const item = {
    id: `category:${category.id}`,
    title: category.title,
    name: category.title,
    subtitle: metadataText,
    type: "collection",
    mediaType: "collection",
    poster: image,
    posterPath: image,
    backdrop: image,
    backdropPath: image,
    thumbnailURL: image,
    overview: categoryOverview(category),
    summary: categoryOverview(category),
    plot: categoryOverview(category),
    content: categoryOverview(category),
    description: categoryOverview(category),
    metadataText,
    remarks: metadataText,
    rank,
    badges: [group, category.kind || "Jable"].filter(Boolean),
    previewItems,
    action: {
      type: "category",
      id: category.id,
      pageId: category.id,
      title: category.title,
      itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    },
    providerIds: {
      jableCategory: category.id,
      source: WidgetMetadata.id,
    },
  };
  applyCategoryPreviewItems(item, previewItems);
  return item;
}

async function loadCategoryPreviewItems(category) {
  if (!category || !category.id) return [];
  const cacheKey = categoryPreviewCacheKey(category);
  if (CATEGORY_PREVIEW_CACHE[cacheKey]) {
    return CATEGORY_PREVIEW_CACHE[cacheKey];
  }

  try {
    const items = await loadPosterWall({
      categoryId: category.id,
      page: 1,
      sort_by: defaultSortForCategory(category),
    });
    const previewItems = items
      .map((item, index) => toMiniMediaItem(item, index + 1, category))
      .filter((item) => item && firstNonEmpty(item.backdrop, item.poster))
      .slice(0, CATEGORY_PREVIEW_ITEM_LIMIT);
    CATEGORY_PREVIEW_CACHE[cacheKey] = previewItems;
    return previewItems;
  } catch (error) {
    logInfo(`Jable category preview skipped (${category.id}): ` + (error && error.message ? error.message : error));
    CATEGORY_PREVIEW_CACHE[cacheKey] = [];
    return [];
  }
}

function cacheCategoryPreviewItems(category, items) {
  if (!category || !category.id || !Array.isArray(items) || !items.length) return;
  const previewItems = items
    .filter((item) => item && firstNonEmpty(item.backdrop, item.poster, item.backdropPath, item.posterPath, item.thumbnailURL))
    .slice(0, CATEGORY_PREVIEW_ITEM_LIMIT);
  if (previewItems.length) {
    CATEGORY_PREVIEW_CACHE[categoryPreviewCacheKey(category)] = previewItems;
  }
}

function categoryPreviewCacheKey(category) {
  return `${category.id}:${defaultSortForCategory(category)}`;
}

function applyCategoryPreviewItems(item, previewItems) {
  if (!item || !Array.isArray(previewItems) || !previewItems.length) {
    return item;
  }

  const previews = previewItems.slice(0, CATEGORY_PREVIEW_ITEM_LIMIT);
  const image = firstCategoryPreviewImage(previews);
  item.previewItems = previews;
  if (image) {
    item.poster = image;
    item.posterPath = image;
    item.backdrop = image;
    item.backdropPath = image;
    item.thumbnailURL = image;
  }
  item.subtitle = `${previews.length} \u6761\u4ee3\u8868\u5185\u5bb9`;
  item.metadataText = item.metadataText || `${previews.length} \u6761\u4ee3\u8868\u5185\u5bb9`;
  return item;
}

function firstCategoryPreviewImage(previewItems) {
  if (!Array.isArray(previewItems)) return "";
  for (const item of previewItems) {
    const image = firstNonEmpty(
      item && item.backdrop,
      item && item.backdropPath,
      item && item.poster,
      item && item.posterPath,
      item && item.thumbnailURL
    );
    if (image) return image;
  }
  return "";
}

async function eachLimit(items, limit, iterator) {
  const source = Array.isArray(items) ? items : [];
  const concurrency = Math.max(1, Math.min(limit || 1, source.length || 1));
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < source.length) {
      const index = cursor;
      cursor += 1;
      await iterator(source[index], index);
    }
  });
  await Promise.all(workers);
}

function categoryOverview(category) {
  const group = category.group || "\u63a8\u8350";
  const kindText = category.kind === "model"
    ? "\u5973\u4f18"
    : category.kind === "tag"
      ? "\u6807\u7b7e"
      : category.kind === "category"
        ? "\u5206\u7c7b"
        : "\u699c\u5355";
  return `\u6d4f\u89c8 Jable ${group}\u4e2d\u7684${category.title}${kindText}\u5185\u5bb9`;
}

function categoryArtwork(category, rank) {
  const configuredArtwork = firstNonEmpty(
    category && category.artwork,
    category && category.image,
    category && category.poster,
    category && category.posterPath,
    category && category.backdrop,
    category && category.backdropPath,
    category && category.thumbnailURL
  );
  if (configuredArtwork) return configuredArtwork;
  const group = String(category.group || category.kind || "");
  if (category.id === "hot") return JABLE_CATEGORY_ARTWORKS[0];
  if (category.id === "new-release") return JABLE_CATEGORY_ARTWORKS[1];
  if (/女优/.test(group)) return JABLE_CATEGORY_ARTWORKS[2];
  if (/衣着/.test(group)) return JABLE_CATEGORY_ARTWORKS[3];
  if (/剧情/.test(group)) return JABLE_CATEGORY_ARTWORKS[4];
  if (/地点/.test(group)) return JABLE_CATEGORY_ARTWORKS[5];
  if (/交合|玩法/.test(group)) return JABLE_CATEGORY_ARTWORKS[6];
  if (/主题/.test(group)) return JABLE_CATEGORY_ARTWORKS[7];
  return JABLE_CATEGORY_ARTWORKS[(rank - 1) % JABLE_CATEGORY_ARTWORKS.length];
}

function metadataFromCategory(categoryId, categoryTitle) {
  const category = findCategoryExact(categoryId);
  const resolvedCategory = category || dynamicCategoryFromId(categoryId);
  const title = cleanText(categoryTitle || (resolvedCategory && resolvedCategory.title));
  if (!title) {
    return { actors: [], tags: [] };
  }
  const id = (resolvedCategory && resolvedCategory.id) || String(categoryId || "");
  const kind = (resolvedCategory && resolvedCategory.kind) || "";
  if (kind === "model" || /^models-/.test(id)) {
    return {
      actors: [
        {
          id,
          name: title,
          title,
          role: "\u6f14\u5458",
          action: { type: "category", id, pageId: id, title, itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO },
        },
      ],
      tags: [],
    };
  }
  if (kind === "tag" || kind === "category" || /^(tag|category)-/.test(id)) {
    return { actors: [], tags: [title] };
  }
  return { actors: [], tags: [] };
}

function findCategoryExact(categoryId) {
  return JABLE_ALL_CATEGORIES.find((item) => item.id === categoryId) || null;
}

function jableCategoryTitleFromHref(href) {
  const path = jablePath(href);
  if (!path) return "";
  const category = JABLE_ALL_CATEGORIES.find((item) => jablePath(item.url) === path);
  return category ? category.title : "";
}

function jablePath(url) {
  return absolutizeUrl(url)
    .replace(/^https?:\/\/[^/]+/i, "")
    .split(/[?#]/)[0]
    .replace(/\/+$/, "/");
}

function normalizeTextList(value) {
  const result = [];
  const append = (item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      append(firstNonEmpty(item.name, item.title, item.text));
      return;
    }
    const text = cleanText(item);
    if (text && !isJableDurationText(text)) {
      result.push(text);
    }
  };

  if (Array.isArray(value)) {
    value.forEach(append);
    return unique(result);
  }

  const text = cleanText(value);
  if (!text) return [];

  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      return normalizeTextList(JSON.parse(text));
    } catch (error) {
      // Fall through to delimiter parsing.
    }
  }

  text
    .split(/[|,，、]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach(append);
  return unique(result);
}

function firstListValue(...values) {
  for (const value of values) {
    if (Array.isArray(value) && value.length) return value;
    if (value && typeof value === "object") return value;
    if (value !== undefined && value !== null && String(value).trim()) return value;
  }
  return "";
}

function miniCastMembers(value) {
  const rawItems = Array.isArray(value) ? value : normalizeTextList(value);
  return rawItems
    .map((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const name = cleanText(firstNonEmpty(item.name, item.title));
        if (!name) return null;
        const action = item.action || personCategoryAction(item, name);
        return {
          id: item.id || (action && (action.pageId || action.id)) || name,
          name,
          role: item.role || "\u6f14\u5458",
          image: item.image || item.poster || item.avatar || "",
          action,
        };
      }
      const name = cleanText(item);
      return name ? { id: name, name, role: "\u6f14\u5458" } : null;
    })
    .filter(Boolean);
}

function personCategoryAction(item, fallbackName) {
  const href = firstNonEmpty(item && item.href, item && item.url, item && item.link);
  const category = href ? categoryFromMetadataHref(href, fallbackName, "actor") : dynamicCategoryFromId(item && (item.categoryId || item.id));
  if (!category) return null;
  return {
    type: "category",
    id: category.id,
    pageId: category.id,
    title: cleanText(fallbackName || category.title) || category.title,
    itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
  };
}

function durationTextToMinutes(value) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }

  const text = cleanText(value)
    .replace(/：/g, ":")
    .toLowerCase();
  if (!text) return undefined;

  const colonParts = text.match(/^(\d{1,3})(?::(\d{2}))(?::(\d{2}))?$/);
  if (colonParts) {
    const first = Number(colonParts[1]);
    const second = Number(colonParts[2]);
    const third = colonParts[3] ? Number(colonParts[3]) : 0;
    const seconds = colonParts[3] ? first * 3600 + second * 60 + third : first * 60 + second;
    return Math.max(1, Math.ceil(seconds / 60));
  }

  const hourMinute = text.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hour|hours|小时)\s*(\d+)?\s*(?:m|min|mins|minute|minutes|分钟|分)?/i);
  if (hourMinute) {
    const hours = Number(hourMinute[1]);
    const minutes = hourMinute[2] ? Number(hourMinute[2]) : 0;
    return Math.max(1, Math.round(hours * 60 + minutes));
  }

  const minutes = text.match(/(\d{1,4})\s*(?:m|min|mins|minute|minutes|分钟|分)/i);
  if (minutes) {
    return Math.max(1, Number(minutes[1]));
  }

  return undefined;
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
  const rawTitle = cleanText(firstNonEmpty(item.fullTitle, item.originalTitle, item.title, item.name, item.vod_name));
  const titleParts = splitJableTitle(rawTitle);
  const title = titleParts.title || rawTitle;
  if (!id || !title) return null;
  const poster = firstNonEmpty(item.poster, item.posterPath, item.backdrop, item.backdropPath, item.thumbnailURL, item.vod_pic);
  const remarks = firstNonEmpty(item.remarks, item.durationText, item.releaseDate, item.vod_remarks);
  const titleOverview = titleParts.overview || titleParts.rawTitle;
  const overview = firstNonEmpty(item.overview, item.summary, item.plot, item.content, item.description, item.vod_content, titleOverview);
  const subtitle = firstNonEmpty(item.subtitle, titleOverview, remarks, item.genreTitle, category && category.title);
  const categoryMetadata = metadataFromCategory(category && category.id, category && category.title);
  const actors = uniquePeople(normalizeTextList(item.actors || item.cast || item.people).concat(categoryMetadata.actors));
  const tags = unique(normalizeTextList(item.tags || item.genres || item.genre).concat(categoryMetadata.tags));
  const viewCountText = firstNonEmpty(item.viewCountText, item.viewsText, item.views);
  const favoriteCountText = firstNonEmpty(item.favoriteCountText, item.favoritesText, item.favorites);
  const detailPayload = buildDetailPayload({
    url: link,
    title: rawTitle,
    overview,
    poster,
    backdrop: firstNonEmpty(item.backdrop, item.backdropPath, poster),
    durationText: remarks,
    categoryId: item.categoryId || (category && category.id),
    categoryTitle: item.categoryTitle || item.genreTitle || (category && category.title),
    sortBy: item.sortBy || (category && (category.currentSort || defaultSortForCategory(category))),
    actors,
    tags,
    viewCountText,
    favoriteCountText,
    detailImageAspectRatio: item.detailImageAspectRatio || item.imageAspectRatio || item.aspectRatio || "16:9",
  });
  const badges = []
    .concat(item.badges || [])
    .concat(tags)
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
    overview,
    summary: overview,
    plot: overview,
    content: overview,
    description: overview,
    metadataText: remarks,
    runtimeMinutes: durationTextToMinutes(remarks) || undefined,
    viewCountText,
    favoriteCountText,
    year: item.year || undefined,
    rating: item.rating || undefined,
    rank,
    remarks,
    badges,
    actors,
    tags,
    genres: tags,
    providerIds: {
      jable: id,
      source: WidgetMetadata.id,
      MiniLibraryDetailPayload: detailPayload,
    },
    action: { type: "detail", id: detailPayload || id, itemId: detailPayload || id },
  };
}

function toHeroMediaItem(item) {
  if (!item) return item;
  const image = firstNonEmpty(item.backdrop, item.backdropPath, item.poster, item.posterPath, item.thumbnailURL);
  return {
    ...item,
    poster: image || item.poster,
    posterPath: image || item.posterPath || item.poster,
    backdrop: image || item.backdrop || item.poster,
    backdropPath: image || item.backdropPath || item.backdrop || item.poster,
    thumbnailURL: image || item.thumbnailURL || item.poster,
    aspectRatio: "16:9",
  };
}

function buildMiniResourceGroups(detail) {
  if (!detail) return [];
  const itemId = detail.id || detail.link;
  if (!itemId) return [];
  const versionId = itemId;
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
          headers: detail.customHeaders,
          default: true,
          action: {
            type: "play",
            itemId,
            versionId,
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
        value: sortOptionsForCategory(category).map((sort) => ({
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
  const titleParts = splitJableTitle(detail.name || detail.title || title);
  const description = mergeDescription(detail.description, detail.overview, detail.subtitle, titleParts.overview || titleParts.rawTitle);
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
    vod_content: description,
    vod_play_from: "Jable",
    vod_play_url: `${title}$${playId}`,
    mediaSources: detail.mediaSources,
    videoUrl: detail.videoUrl,
    customHeaders: detail.customHeaders,
  };
}

function toForwardVideoItem({
  link,
  title,
  cover,
  preview,
  durationText,
  actors = [],
  tags = [],
  viewCountText = "",
  favoriteCountText = "",
}) {
  const url = absolutizeUrl(link);
  const fullTitle = title || extractTitleFromUrl(url);
  const titleParts = splitJableTitle(fullTitle);
  const overview = titleParts.overview || titleParts.rawTitle || "";
  const normalizedActors = normalizeTextList(actors);
  const normalizedTags = normalizeTextList(tags);
  return {
    id: url,
    type: "url",
    title: fullTitle,
    fullTitle,
    originalTitle: fullTitle,
    posterPath: absolutizeUrl(cover),
    backdropPath: absolutizeUrl(cover),
    previewUrl: absolutizeUrl(preview),
    link: url,
    mediaType: "movie",
    description: overview,
    overview,
    summary: overview,
    plot: overview,
    content: overview,
    releaseDate: durationText || "",
    durationText: durationText || "",
    metadataText: durationText || "",
    runtimeMinutes: durationTextToMinutes(durationText) || undefined,
    viewCountText,
    favoriteCountText,
    actors: normalizedActors,
    tags: normalizedTags,
    genres: normalizedTags,
    badges: normalizedTags.slice(0, 4),
    playerType: "ijk",
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

async function loadPlayback(input) {
  const context = buildDetailContext(input);
  const pageUrl = context.url;
  if (!pageUrl) {
    throw new Error("Jable playback url is required.");
  }

  const response = await httpGet(pageUrl, {
    headers: {
      "User-Agent": JABLE_HEADERS["User-Agent"],
      Referer: JABLE_BASE_URL + "/",
    },
  });
  const html = getResponseText(response);
  if (!html) {
    throw new Error("\u65e0\u6cd5\u83b7\u53d6\u6709\u6548\u7684HTML\u5185\u5bb9");
  }

  const hlsUrl = extractHlsUrl(html);
  if (!hlsUrl) {
    throw new Error("\u65e0\u6cd5\u83b7\u53d6\u6709\u6548\u7684\u64ad\u653e\u5730\u5740\uff0c\u53ef\u80fd\u9700\u8981\u4ee3\u7406\u9a8c\u8bc1");
  }

  return {
    id: context.itemId,
    title: context.title,
    url: hlsUrl,
    headers: {
      ...JABLE_PLAY_HEADERS,
      Referer: pageUrl,
    },
    mediaSourceId: context.itemId,
  };
}

async function loadDetailMetadata(context) {
  const pageUrl = context && context.url;
  if (!pageUrl) {
    return emptyDetailMetadata();
  }

  try {
    const response = await httpGet(buildDetailMetadataUrl(pageUrl), {
      headers: {
        ...JABLE_HEADERS,
        Referer: pageUrl,
      },
    });
    const html = getResponseText(response);
    if (!html) return emptyDetailMetadata();
    return parseDetailMetadata(html);
  } catch (error) {
    logInfo("Jable detail metadata skipped: " + (error && error.message ? error.message : error));
    return emptyDetailMetadata();
  }
}

function buildDetailMetadataUrl(pageUrl) {
  let url = setQueryParam(pageUrl, "mode", "async");
  url = setQueryParam(url, "function", "get_block");
  url = setQueryParam(url, "block_id", "video_view_video_view");
  url = setQueryParam(url, "_", String(Date.now ? Date.now() : new Date().getTime()));
  return url;
}

function emptyDetailMetadata() {
  return {
    actors: [],
    tags: [],
    viewCountText: "",
    favoriteCountText: "",
    detailImage: "",
    detailImageAspectRatio: "",
  };
}

function parseDetailMetadata(htmlContent) {
  const html = htmlFromAsyncPayload(htmlContent);
  if (!html || looksLikeCloudflareChallenge(html)) {
    return emptyDetailMetadata();
  }
  if (hasWidgetHtml()) {
    return parseDetailMetadataWithCheerio(Widget.html.load(html));
  }
  return parseDetailMetadataWithRegex(html);
}

function parseDetailMetadataWithCheerio($) {
  const anchors = $("a").toArray().map((element) => {
    const $link = $(element);
    return {
      href: $link.attr("href"),
      text: $link.text(),
      title: $link.attr("title"),
      ariaLabel: $link.attr("aria-label"),
      originalTitle: $link.attr("data-original-title"),
    };
  });
  const metadata = jableCardMetadataFromAnchors(anchors);
  const text = cleanText($("body").length ? $("body").text() : $.html());
  const html = $.html();
  const detailImage = extractDetailImageInfoWithCheerio($);
  const stats = extractDetailStatsWithCheerio($);

  return {
    actors: metadata.actors,
    tags: metadata.tags,
    viewCountText: stats.viewCountText || detailCountText(html, text, "views"),
    favoriteCountText: stats.favoriteCountText || detailCountText(html, text, "favorites"),
    detailImage: detailImage.url,
    backdrop: detailImage.url,
    poster: detailImage.url,
    detailImageAspectRatio: detailImage.aspectRatio,
  };
}

function parseDetailMetadataWithRegex(htmlContent) {
  const html = String(htmlContent || "");
  const anchors = extractAnchors(html);
  const metadata = jableCardMetadataFromAnchors(anchors);
  const text = cleanText(stripTags(html));
  const detailImage = extractDetailImageInfoWithRegex(html);
  const stats = extractDetailStatsWithRegex(html);

  return {
    actors: metadata.actors,
    tags: metadata.tags,
    viewCountText: stats.viewCountText || detailCountText(html, text, "views"),
    favoriteCountText: stats.favoriteCountText || detailCountText(html, text, "favorites"),
    detailImage: detailImage.url,
    backdrop: detailImage.url,
    poster: detailImage.url,
    detailImageAspectRatio: detailImage.aspectRatio,
  };
}

function extractDetailImageInfoWithCheerio($) {
  const candidates = [];
  const metaWidth = numberFromText(
    $('meta[property="og:image:width"],meta[name="og:image:width"],meta[property="twitter:image:width"],meta[name="twitter:image:width"]')
      .first()
      .attr("content")
  );
  const metaHeight = numberFromText(
    $('meta[property="og:image:height"],meta[name="og:image:height"],meta[property="twitter:image:height"],meta[name="twitter:image:height"]')
      .first()
      .attr("content")
  );

  function push(url, width, height, source) {
    pushDetailImageCandidate(candidates, url, width, height, source);
  }

  $('meta[property="og:image"],meta[name="og:image"],meta[property="twitter:image"],meta[name="twitter:image"],link[rel="image_src"]').each((_, element) => {
    const $element = $(element);
    push($element.attr("content") || $element.attr("href"), metaWidth, metaHeight, "meta");
  });

  $("video,source,img,[data-poster],[data-cover],[data-image],[data-src],[data-original],[style]").each((_, element) => {
    const $element = $(element);
    const width = numberFromText(firstNonEmpty($element.attr("width"), $element.attr("data-width")));
    const height = numberFromText(firstNonEmpty($element.attr("height"), $element.attr("data-height")));
    push($element.attr("poster"), width, height, "poster");
    push($element.attr("data-poster"), width, height, "data-poster");
    push($element.attr("data-cover"), width, height, "data-cover");
    push($element.attr("data-image"), width, height, "data-image");
    push($element.attr("data-src"), width, height, "data-src");
    push($element.attr("data-original"), width, height, "data-original");
    push($element.attr("src"), width, height, "src");
    const styleUrl = extractCssImageUrl($element.attr("style"));
    push(styleUrl, width, height, "style");
  });

  return bestDetailImageCandidate(candidates);
}

function extractDetailImageInfoWithRegex(html) {
  const candidates = [];
  const source = String(html || "");
  const metaWidth = extractMetaNumber(source, /(?:og|twitter):image:width/i);
  const metaHeight = extractMetaNumber(source, /(?:og|twitter):image:height/i);
  const attrUrlRegex = /\b(?:poster|content|src|data-src|data-original|data-poster|data-cover|data-image|href)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi;
  let match;
  while ((match = attrUrlRegex.exec(source))) {
    const tagStart = source.lastIndexOf("<", match.index);
    const tagEnd = source.indexOf(">", match.index);
    const tag = tagStart >= 0 && tagEnd > tagStart ? source.slice(tagStart, tagEnd + 1) : "";
    const dimensions = extractImageDimensionsFromTag(tag);
    pushDetailImageCandidate(
      candidates,
      match[1],
      dimensions.width || metaWidth,
      dimensions.height || metaHeight,
      "attr"
    );
  }

  const cssUrlRegex = /url\((["']?)([^"')]+\.(?:jpg|jpeg|png|webp)(?:\?[^"')]+)?)\1\)/gi;
  while ((match = cssUrlRegex.exec(source))) {
    pushDetailImageCandidate(candidates, match[2], 0, 0, "style");
  }

  return bestDetailImageCandidate(candidates);
}

function pushDetailImageCandidate(candidates, url, width, height, source) {
  const detailUrl = jableDetailImageUrl(url);
  if (!detailUrl || !isJableDetailImageCandidate(detailUrl)) return;
  candidates.push({
    url: detailUrl,
    width: Number(width) || 0,
    height: Number(height) || 0,
    source: source || "",
    score: detailImageScore(detailUrl, source),
  });
}

function bestDetailImageCandidate(candidates) {
  const items = (candidates || []).filter((item) => item && item.url);
  if (!items.length) return { url: "", aspectRatio: "" };
  items.sort((a, b) => b.score - a.score);
  const best = items[0];
  const aspectRatio = best.width > 0 && best.height > 0 ? best.width / best.height : "";
  return {
    url: best.url,
    aspectRatio: aspectRatio ? String(Number(aspectRatio.toFixed(4))) : "",
  };
}

function jableDetailImageUrl(url) {
  const absolute = absolutizeUrl(decodeHtml(url || ""));
  if (!absolute || !/\.(?:jpg|jpeg|png|webp)(?:\?|$)/i.test(absolute)) return "";
  return absolute.replace(/\/\d+x\d+\/\d+\.(jpg|jpeg|png|webp)(\?[^#]*)?$/i, "/preview.$1$2");
}

function isJableDetailImageCandidate(url) {
  const value = String(url || "").toLowerCase();
  if (!value) return false;
  if (/(?:logo|favicon|avatar|profile|banner)[^/]*\.(?:jpg|jpeg|png|webp)(?:\?|$)/i.test(value)) return false;
  return value.includes("/contents/videos_screenshots/") || value.includes("/videos_screenshots/");
}

function detailImageScore(url, source) {
  const value = String(url || "").toLowerCase();
  let score = 0;
  if (value.includes("/contents/videos_screenshots/")) score += 100;
  if (/\/preview\.(?:jpg|jpeg|png|webp)(?:\?|$)/i.test(value)) score += 90;
  if (/\/cover\.(?:jpg|jpeg|png|webp)(?:\?|$)/i.test(value)) score += 70;
  if (!/\/\d+x\d+\//.test(value)) score += 35;
  if (/poster|meta|data-poster|data-cover/i.test(source || "")) score += 20;
  return score;
}

function extractCssImageUrl(value) {
  const match = String(value || "").match(/url\((["']?)([^"')]+)\1\)/i);
  return match ? match[2] : "";
}

function extractImageDimensionsFromTag(tag) {
  return {
    width: numberFromText(firstNonEmpty(
      extractAttr(tag, /\bwidth=["']?([0-9.]+)/i),
      extractAttr(tag, /\bdata-width=["']?([0-9.]+)/i)
    )),
    height: numberFromText(firstNonEmpty(
      extractAttr(tag, /\bheight=["']?([0-9.]+)/i),
      extractAttr(tag, /\bdata-height=["']?([0-9.]+)/i)
    )),
  };
}

function extractMetaNumber(html, propertyPattern) {
  const source = String(html || "");
  const regex = /<meta\b[^>]*>/gi;
  let match;
  while ((match = regex.exec(source))) {
    const tag = match[0];
    const key = firstNonEmpty(
      extractAttr(tag, /\bproperty=["']([^"']+)/i),
      extractAttr(tag, /\bname=["']([^"']+)/i)
    );
    if (!propertyPattern.test(key)) continue;
    const value = numberFromText(extractAttr(tag, /\bcontent=["']([^"']+)/i));
    if (value) return value;
  }
  return 0;
}

function detailCountText(html, text, kind) {
  const value = kind === "views"
    ? extractViewCountText(html, text)
    : extractFavoriteCountText(html, text);
  if (!value) return "";
  return kind === "views" ? `观看 ${value}` : `收藏 ${value}`;
}

function extractViewCountText(html, text) {
  return firstNonEmpty(
    extractCountAfterIcon(html, "icon-eye"),
    extractCountFromJsonLike(html, ["video_viewed", "videoViewed", "view_count", "viewCount", "views", "viewed"]),
    extractCountFromAttributes(html, /(?:^|[-_:])(?:views?|viewed|video[-_:]?viewed)(?:$|[-_:])/i),
    extractCountNearIcon(html, /(?:\bviews?\b|video[-_]?viewed|icon[-_]?eye|fa[-_]?eye|bi[-_]?eye|观看|觀看|播放)/i),
    extractCountNearClass(html, /(?:\bviews?\b|video[-_]?viewed|icon[-_]?eye|fa[-_]?eye|bi[-_]?eye|观看|觀看|播放)/i),
    extractCountByLabel(text, /(?:\bviews?\b|观看|觀看|播放(?:次数)?)/i),
    extractCountFromContext(html, /(?:\bviews?\b|video[-_]?viewed|观看|觀看|播放(?:次数)?)/i)
  );
}

function extractFavoriteCountText(html, text) {
  return firstNonEmpty(
    extractFavoriteButtonCount(html),
    extractCountAfterIcon(html, "icon-heart-inline"),
    extractCountAfterIcon(html, "icon-heart"),
    extractCountFromJsonLike(html, ["most_favourited", "mostFavorited", "favorite_count", "favourite_count", "favoriteCount", "favouriteCount", "favorites", "favourites", "likes"]),
    extractCountFromAttributes(html, /(?:^|[-_:])(?:favou?rites?|favou?rited|likes?|heart)(?:$|[-_:])/i),
    extractCountNearIcon(html, /(?:favou?rites?|favou?rited|likes?|icon[-_]?heart|fa[-_]?heart|bi[-_]?heart|收藏|喜[欢歡]|点赞|點讚)/i),
    extractCountNearClass(html, /(?:favou?rites?|favou?rited|likes?|icon[-_]?heart|fa[-_]?heart|bi[-_]?heart|收藏|喜[欢歡]|点赞|點讚)/i),
    extractCountByLabel(text, /(?:favou?rites?|likes?|收藏(?:次数)?|喜[欢歡]|点赞|點讚)/i),
    extractCountFromContext(html, /(?:favou?rites?|favou?rited|likes?|收藏(?:次数)?|喜[欢歡]|点赞|點讚)/i)
  );
}

function htmlFromAsyncPayload(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw[0] !== "{" && raw[0] !== "[") return raw;
  try {
    const parsed = JSON.parse(raw);
    return firstHtmlField(parsed);
  } catch (error) {
    return raw;
  }
}

function firstHtmlField(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return firstNonEmpty(...value.map(firstHtmlField));
  }
  if (!value || typeof value !== "object") return "";
  return firstNonEmpty(
    value.html,
    value.content,
    firstHtmlField(value.result),
    firstHtmlField(value.data),
    value.text,
    value.body,
    value.payload && firstHtmlField(value.payload),
    value.response && firstHtmlField(value.response)
  );
}

function looksLikeCloudflareChallenge(value) {
  const text = String(value || "").toLowerCase();
  return text.includes("just a moment")
    || text.includes("cf-chl-")
    || text.includes("cf-browser-verification")
    || text.includes("cf-mitigated")
    || text.includes("cloudflare ray id")
    || text.includes("/cdn-cgi/challenge-platform")
    || (text.includes("cloudflare") && (text.includes("challenge") || text.includes("turnstile")));
}

function extractVideoInfoHtml(html) {
  const source = String(html || "");
  const startMatch = /<section\b[^>]*class=["'][^"']*\bvideo-info\b[^"']*["'][^>]*>/i.exec(source);
  if (!startMatch) return "";
  const start = startMatch.index;
  const closeIndex = source.indexOf("</section>", start);
  if (closeIndex < 0) return source.slice(start);
  return source.slice(start, closeIndex + "</section>".length);
}

function extractFavoriteButtonCount(html) {
  const source = String(html || "");
  const buttonPattern = /<(?:button|a)\b[^>]*class=["'][^"']*\bfav\b[^"']*["'][^>]*>[\s\S]*?<\/(?:button|a)>/gi;
  let match;
  while ((match = buttonPattern.exec(source))) {
    const value = cleanCountText(
      extractMatch(match[0], /<span\b[^>]*class=["'][^"']*\bcount\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)
    );
    if (value) return value;
  }
  return "";
}

function extractCountAfterIcon(html, iconId) {
  const source = String(html || "");
  const escapedIcon = escapeRegex(iconId);
  const pattern = new RegExp(
    `<svg\\b[\\s\\S]{0,360}?<use\\b[^>]*(?:xlink:href|href)=["'][^"']*#${escapedIcon}["'][^>]*>[\\s\\S]*?<\\/svg>([\\s\\S]{0,220})`,
    "gi"
  );
  let match;
  while ((match = pattern.exec(source))) {
    const valueHtml = String(match[1] || "").split(/<svg\b/i)[0];
    const value = cleanCountText(valueHtml);
    if (value) return value;
  }
  return "";
}

function extractCountNearClass(html, classPattern) {
  const source = String(html || "");
  const tagRegex = /<[^>]+(?:class|id)=["']([^"']+)["'][^>]*>([\s\S]*?)<\/[^>]+>/gi;
  let match;
  while ((match = tagRegex.exec(source))) {
    if (!classPattern.test(match[1] || "")) continue;
    const value = cleanCountText(stripTags(match[2]));
    if (value) return value;
  }
  return "";
}

function extractCountNearIcon(html, markerPattern) {
  const source = String(html || "");
  const tagRegex = /<[^>]+(?:class|id|title|aria-label|data-original-title)=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = tagRegex.exec(source))) {
    if (!markerPattern.test(match[1] || "")) continue;
    const windowText = source.slice(match.index, Math.min(source.length, match.index + 520));
    const value = cleanCountText(stripTags(windowText));
    if (value) return value;
  }
  return "";
}

function extractCountFromAttributes(html, namePattern) {
  const source = String(html || "");
  const attrRegex = /\b([a-zA-Z0-9:_-]*(?:view|viewed|fav|favour|favor|like|heart)[a-zA-Z0-9:_-]*)=["']([^"']*)["']/gi;
  let match;
  while ((match = attrRegex.exec(source))) {
    const name = match[1] || "";
    if (!namePattern.test(name)) continue;
    const value = cleanCountText(match[2]);
    if (value) return value;
  }
  return "";
}

function extractCountFromJsonLike(html, keys) {
  const source = decodeHtml(String(html || ""));
  for (const key of keys || []) {
    const escaped = escapeRegex(key);
    const patterns = [
      new RegExp(`["']${escaped}["']\\s*[:=]\\s*["']?([0-9][0-9,，.]*\\s*(?:万|萬|k|K|m|M)?)`, "i"),
      new RegExp(`\\b${escaped}\\b\\s*[:=]\\s*["']?([0-9][0-9,，.]*\\s*(?:万|萬|k|K|m|M)?)`, "i"),
    ];
    for (const pattern of patterns) {
      const match = source.match(pattern);
      const value = match ? cleanCountText(match[1]) : "";
      if (value) return value;
    }
  }
  return "";
}

function extractCountFromContext(html, keywordPattern) {
  const source = cleanText(stripTags(html));
  if (!source) return "";
  const regex = new RegExp(keywordPattern.source, "gi");
  let match;
  while ((match = regex.exec(source))) {
    const start = Math.max(0, match.index - 80);
    const end = Math.min(source.length, match.index + 140);
    const value = cleanCountText(source.slice(start, end));
    if (value) return value;
  }
  return "";
}

function extractCountByLabel(text, labelPattern) {
  const source = cleanText(text);
  if (!source) return "";
  const pattern = new RegExp(
    `(?:${labelPattern.source})\\s*[:：]?\\s*([0-9][0-9,，.]*\\s*(?:万|萬|k|K|m|M)?)|([0-9][0-9,，.]*\\s*(?:万|萬|k|K|m|M)?)\\s*(?:${labelPattern.source})`,
    "i"
  );
  const match = source.match(pattern);
  return match ? cleanCountText(match[1] || match[2]) : "";
}

function cleanCountText(value) {
  const text = cleanText(stripTags(value))
    .replace(/,/g, "")
    .replace(/，/g, "");
  const match = text.match(/[0-9](?:[0-9\s]*[0-9])?(?:\.[0-9]+)?\s*(?:万|萬|k|K|m|M)?/);
  if (!match) return "";
  return match[0]
    .replace(/\s+/g, " ")
    .trim();
}

function numberFromText(value) {
  const match = String(value || "").match(/[0-9]+(?:\.[0-9]+)?/);
  return match ? Number(match[0]) || 0 : 0;
}

function extractDetailStatsWithCheerio($) {
  const $info = $(".video-info").first();
  if (!$info.length) {
    return { viewCountText: "", favoriteCountText: "" };
  }

  const infoHtml = $info.html() || "";
  const viewCount = extractCountAfterIcon(infoHtml, "icon-eye");
  const favoriteCount = firstNonEmpty(
    cleanCountText($info.find(".btn-action.fav .count, button.fav .count, a.fav .count, .fav .count").first().text()),
    extractCountAfterIcon(infoHtml, "icon-heart"),
    extractCountAfterIcon(infoHtml, "icon-heart-inline")
  );

  return {
    viewCountText: viewCount ? `观看 ${viewCount}` : "",
    favoriteCountText: favoriteCount ? `收藏 ${favoriteCount}` : "",
  };
}

function extractDetailStatsWithRegex(html) {
  const infoHtml = extractVideoInfoHtml(html);
  if (!infoHtml) {
    return { viewCountText: "", favoriteCountText: "" };
  }
  const viewCount = extractCountAfterIcon(infoHtml, "icon-eye");
  const favoriteCount = firstNonEmpty(
    extractFavoriteButtonCount(infoHtml),
    extractCountAfterIcon(infoHtml, "icon-heart"),
    extractCountAfterIcon(infoHtml, "icon-heart-inline")
  );
  return {
    viewCountText: viewCount ? `观看 ${viewCount}` : "",
    favoriteCountText: favoriteCount ? `收藏 ${favoriteCount}` : "",
  };
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function loadListRecommendations(context) {
  const category = findCategory(context.categoryId || "hot");
  try {
    const items = await loadPosterWall({
      categoryId: category.id,
      page: 1,
      sort_by: context.sortBy || defaultSortForCategory(category),
    });
    const relatedItems = items
      .map((item, index) => toMiniMediaItem(item, index + 1, category))
      .filter(Boolean)
      .filter((item) => getLink(item) !== context.url)
      .slice(0, 12);
    if (!relatedItems.length) return [];
    return [
      {
        id: "jable-related",
        title: "\u731c\u4f60\u559c\u6b22",
        style: "discover.posterCompact",
        items: relatedItems,
      },
    ];
  } catch (error) {
    logInfo("Jable related list skipped: " + (error && error.message ? error.message : error));
    return [];
  }
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
  return findCategoryExact(categoryId) || dynamicCategoryFromId(categoryId) || JABLE_ALL_CATEGORIES[0];
}

function makeAsyncListUrl(path) {
  return `${JABLE_BASE_URL}${path}?mode=async&function=get_block&block_id=${JABLE_LIST_BLOCK}`;
}

function makeAsyncListUrlFromHref(href) {
  const path = jablePath(href);
  return path ? makeAsyncListUrl(path) : "";
}

function dynamicCategoryFromId(categoryId) {
  const id = String(categoryId || "");
  if (!id.startsWith(JABLE_DYNAMIC_CATEGORY_PREFIX)) return null;

  const encodedPath = id.slice(JABLE_DYNAMIC_CATEGORY_PREFIX.length);
  let path = "";
  try {
    path = decodeURIComponent(encodedPath);
  } catch (error) {
    path = encodedPath;
  }
  if (!path || path[0] !== "/") return null;

  const href = absolutizeUrl(path);
  const kind = /\/(?:s\d+\/)?models\//i.test(path)
    ? "model"
    : /\/tags\//i.test(path)
      ? "tag"
      : /\/categories\//i.test(path)
        ? "category"
        : "list";
  const title = jableCategoryTitleFromHref(href) || titleFromCategoryPath(path);
  const category = {
    id,
    title,
    group: kind === "model" ? "\u5973\u4f18" : kind === "tag" ? "\u6807\u7b7e" : "\u5206\u7c7b",
    kind,
    url: makeAsyncListUrl(path),
    itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    imageOrientation: "landscape",
  };
  if (kind === "model") {
    category.sortOptions = JABLE_MODEL_SORT_OPTIONS;
    category.defaultSort = JABLE_SORTS.best;
  }
  return category;
}

function categoryFromMetadataHref(href, title, type) {
  const url = absolutizeUrl(href);
  const path = jablePath(url);
  if (!path) return null;

  const existing = JABLE_ALL_CATEGORIES.find((item) => jablePath(item.url) === path);
  if (existing) return existing;

  const kind = type === "actor" ? "model" : /\/tags\//i.test(path) ? "tag" : "category";
  const id = `${JABLE_DYNAMIC_CATEGORY_PREFIX}${encodeURIComponent(path)}`;
  const category = {
    id,
    title: cleanText(title) || titleFromCategoryPath(path),
    group: kind === "model" ? "\u5973\u4f18" : kind === "tag" ? "\u6807\u7b7e" : "\u5206\u7c7b",
    kind,
    url: makeAsyncListUrl(path),
    itemAspectRatio: JABLE_CATEGORY_PAGE_ASPECT_RATIO,
    imageOrientation: "landscape",
  };
  if (kind === "model") {
    category.sortOptions = JABLE_MODEL_SORT_OPTIONS;
    category.defaultSort = JABLE_SORTS.best;
  }
  return category;
}

function titleFromCategoryPath(path) {
  const parts = String(path || "").split("/").filter(Boolean);
  const raw = parts[parts.length - 1] || "Jable";
  try {
    return decodeURIComponent(raw).replace(/[-_]+/g, " ");
  } catch (error) {
    return raw.replace(/[-_]+/g, " ");
  }
}

function sortOptionsForCategory(category) {
  if (category && Array.isArray(category.sortOptions) && category.sortOptions.length) {
    return category.sortOptions;
  }
  if (category && category.kind === "model") {
    return JABLE_MODEL_SORT_OPTIONS;
  }
  return defaultSortOptions();
}

function defaultSortForCategory(category) {
  if (category && category.defaultSort) {
    return category.defaultSort;
  }
  if (category && category.kind === "model") {
    return JABLE_SORTS.best;
  }
  return JABLE_SORTS.latest;
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
    const payload = parseDetailPayload(value);
    if (payload) return payload;
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
    const payload = parseDetailPayload(input);
    if (payload && payload.url) {
      return absolutizeUrl(payload.url);
    }
    return absolutizeUrl(input);
  }
  return absolutizeUrl(
    firstNonEmpty(
      input.link,
      detailPayloadUrl(input.itemId),
      detailPayloadUrl(input.versionId),
      input.url,
      input.playUrl,
      input.videoUrl,
      input.id,
      input.videoId
    )
  );
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

function buildDetailContext(input) {
  const payload = parseDetailPayload(input) || {};
  const ext = argsifyWithoutPayload(input);
  const url = absolutizeUrl(
    firstNonEmpty(
      payload.url,
      detailPayloadUrl(ext.itemId),
      detailPayloadUrl(ext.versionId),
      ext.link,
      ext.url,
      ext.id,
      typeof input === "string" ? input : ""
    )
  );
  const rawTitle = cleanText(firstNonEmpty(payload.title, ext.fullTitle, ext.originalTitle, ext.title, ext.name, extractTitleFromUrl(url)));
  const titleParts = splitJableTitle(rawTitle);
  const title = titleParts.title || rawTitle || extractTitleFromUrl(url);
  const overview = firstNonEmpty(payload.overview, ext.overview, ext.summary, ext.plot, ext.content, ext.description, titleParts.overview, titleParts.rawTitle);
  const poster = absolutizeUrl(firstNonEmpty(payload.poster, ext.poster, ext.posterPath, ext.backdrop, ext.backdropPath, ext.thumbnailURL));
  const backdrop = absolutizeUrl(firstNonEmpty(payload.backdrop, ext.backdrop, ext.backdropPath, poster));
  const categoryId = firstNonEmpty(payload.categoryId, ext.categoryId);
  const categoryTitle = firstNonEmpty(payload.categoryTitle, ext.categoryTitle, ext.genreTitle);
  const categoryMetadata = metadataFromCategory(categoryId, categoryTitle);
  const actors = uniquePeople(
    normalizeTextList(firstListValue(payload.actors, payload.actor, ext.actors, ext.cast, ext.people))
      .concat(categoryMetadata.actors)
  );
  const tags = unique(
    normalizeTextList(firstListValue(payload.tags, payload.genres, payload.genre, ext.tags, ext.genres, ext.genre))
      .concat(categoryMetadata.tags)
  );
  const viewCountText = firstNonEmpty(payload.viewCountText, payload.viewsText, payload.views, ext.viewCountText, ext.viewsText, ext.views);
  const favoriteCountText = firstNonEmpty(
    payload.favoriteCountText,
    payload.favoritesText,
    payload.favorites,
    ext.favoriteCountText,
    ext.favoritesText,
    ext.favorites
  );
  const detailImageAspectRatio = firstNonEmpty(
    payload.detailImageAspectRatio,
    payload.imageAspectRatio,
    payload.backdropAspectRatio,
    payload.aspectRatio,
    ext.detailImageAspectRatio,
    ext.imageAspectRatio,
    ext.backdropAspectRatio,
    ext.aspectRatio
  );
  const itemId = buildDetailPayload({
    url,
    title: rawTitle || title,
    overview,
    poster,
    backdrop,
    durationText: firstNonEmpty(payload.durationText, ext.durationText, ext.releaseDate, ext.remarks),
    categoryId,
    categoryTitle,
    sortBy: firstNonEmpty(payload.sortBy, ext.sortBy, ext.sort_by),
    actors,
    tags,
    viewCountText,
    favoriteCountText,
    detailImageAspectRatio,
  }) || url;

  return {
    itemId,
    url,
    rawTitle,
    title,
    overview,
    poster,
    backdrop,
    durationText: firstNonEmpty(payload.durationText, ext.durationText, ext.releaseDate, ext.remarks),
    categoryId,
    categoryTitle,
    sortBy: firstNonEmpty(payload.sortBy, ext.sortBy, ext.sort_by),
    actors,
    tags,
    viewCountText,
    favoriteCountText,
    detailImageAspectRatio,
  };
}

function buildDetailPayload(data = {}) {
  const url = absolutizeUrl(data.url);
  if (!url) return "";
  const params = [
    ["url", url],
    ["title", data.title],
    ["overview", data.overview],
    ["poster", data.poster],
    ["backdrop", data.backdrop],
    ["durationText", data.durationText],
    ["categoryId", data.categoryId],
    ["categoryTitle", data.categoryTitle],
    ["sortBy", data.sortBy],
    ["actors", normalizeTextList(data.actors)],
    ["tags", normalizeTextList(data.tags)],
    ["viewCountText", data.viewCountText],
    ["favoriteCountText", data.favoriteCountText],
    ["detailImageAspectRatio", data.detailImageAspectRatio],
  ]
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(detailPayloadValue(value))}`);
  return `${JABLE_DETAIL_PAYLOAD_PREFIX}${params.join("&")}`;
}

function detailPayloadValue(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(normalizeTextList(value));
  }
  return String(value);
}

function parseDetailPayload(input) {
  if (!input) return null;
  if (typeof input === "object" && !Array.isArray(input)) {
    return parseDetailPayload(input.itemId) || parseDetailPayload(input.versionId) || parseDetailPayload(input.id);
  }
  const value = String(input || "").trim();
  if (!value.startsWith(JABLE_DETAIL_PAYLOAD_PREFIX)) return null;
  const query = value.slice(JABLE_DETAIL_PAYLOAD_PREFIX.length);
  const result = {};
  query.split("&").filter(Boolean).forEach((part) => {
    const index = part.indexOf("=");
    const key = index >= 0 ? part.slice(0, index) : part;
    const val = index >= 0 ? part.slice(index + 1) : "";
    try {
      result[decodeURIComponent(key)] = decodeURIComponent(val);
    } catch (error) {
      result[key] = val;
    }
  });
  return result.url ? result : null;
}

function detailPayloadUrl(value) {
  const payload = parseDetailPayload(value);
  return payload && payload.url ? payload.url : "";
}

function argsifyWithoutPayload(ctx) {
  if (!ctx) return {};
  if (typeof ctx === "string") {
    const value = ctx.trim();
    if (!value || value.startsWith(JABLE_DETAIL_PAYLOAD_PREFIX)) return {};
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

function isPlayableDirectUrl(url) {
  const value = String(url || "").trim();
  if (!/^https?:\/\//i.test(value)) return false;
  if (isJableVideoUrl(value)) return false;
  return /\.(m3u8?|mp4|mkv|mov|webm|ts|mpd)(?:[?#]|$)/i.test(value);
}

function isJableDurationText(value) {
  const text = cleanText(value);
  if (!text) return true;
  if (/^\d{1,3}:\d{2}(?::\d{2})?$/.test(text)) return true;
  if (/^\d{1,4}\s*(?:min|mins|minutes|分钟|分)$/i.test(text)) return true;
  if (/^\d{1,2}\s*(?:h|hr|hrs|hour|hours|小时)\s*\d{0,2}\s*(?:m|min|minutes|分钟)?$/i.test(text)) return true;
  return false;
}

function bestJableTitle(...values) {
  const titles = unique(values.map(cleanText).filter((value) => value && !isJableDurationText(value)));
  if (!titles.length) return "";

  const withOverview = titles
    .map((title) => ({ title, parts: splitJableTitle(title) }))
    .filter((item) => item.parts.overview)
    .sort((a, b) => b.parts.overview.length - a.parts.overview.length);

  if (withOverview.length) return withOverview[0].title;
  return titles.sort((a, b) => b.length - a.length)[0];
}

function splitJableTitle(value) {
  const fullTitle = cleanText(value);
  if (!fullTitle) {
    return { title: "", overview: "", rawTitle: "" };
  }

  const match = fullTitle.match(/\b([A-Za-z]{2,8})[-_\s]?(\d{2,6})\b/);
  if (!match) {
    return { title: fullTitle, overview: "", rawTitle: fullTitle };
  }

  const code = `${match[1].toUpperCase()}-${match[2]}`;
  const before = fullTitle.slice(0, match.index).trim();
  const after = fullTitle.slice((match.index || 0) + match[0].length).trim();
  const overview = cleanText([before, after].filter(Boolean).join(" "))
    .replace(/^[\s._\-:：/\\|()[\]{}]+/, "")
    .trim();

  return { title: code, overview, rawTitle: fullTitle };
}

function mergeDescription(...values) {
  const parts = [];
  const seen = new Set();
  for (const value of values) {
    const text = cleanText(value);
    if (!text) continue;
    const key = normalizeTitle(text);
    if (seen.has(key)) continue;
    if (parts.some((part) => normalizeTitle(part).includes(key) || key.includes(normalizeTitle(part)))) continue;
    seen.add(key);
    parts.push(text);
  }
  return parts.join("\n\n");
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

function extractAnchors(html) {
  const anchors = [];
  const regex = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(String(html || "")))) {
    const attrs = match[1] || "";
    anchors.push({
      href: extractAttr(attrs, /\bhref=["']([^"']+)["']/i),
      text: stripTags(match[2]),
      title: extractAttr(attrs, /\btitle=["']([^"']*)["']/i),
      ariaLabel: extractAttr(attrs, /\baria-label=["']([^"']*)["']/i),
      originalTitle: extractAttr(attrs, /\bdata-original-title=["']([^"']*)["']/i),
    });
  }
  return anchors;
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

function uniquePeople(items) {
  const source = Array.isArray(items) ? items : normalizeTextList(items);
  const seen = new Set();
  const result = [];
  for (const item of source || []) {
    const name = cleanText(
      item && typeof item === "object" && !Array.isArray(item)
        ? firstNonEmpty(item.name, item.title, item.text)
        : item
    );
    if (!name) continue;
    const action = item && typeof item === "object" && !Array.isArray(item) ? item.action : null;
    const key = `${name}|${action && (action.pageId || action.id) ? action.pageId || action.id : ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item && typeof item === "object" && !Array.isArray(item) ? item : name);
  }
  return result;
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
  getHomeSection,
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
  globalThis.getHomeSection = getHomeSection;
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
