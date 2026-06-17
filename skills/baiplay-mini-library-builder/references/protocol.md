# baiPlay Mini Library Protocol Reference

Use this compact reference when the baiPlay repo docs are unavailable or when a quick schema reminder is enough. Prefer the live repo document `docs/小程序源设计规范.md` when present.

## Interfaces

All exported functions may be synchronous or async and may return an object or a JSON string.

```js
async function getManifest(ctx) {}
async function getHome(ctx) {}
async function getHomeSection(ctx) {}
async function getCategory(ctx) {}
async function getDetail(ctx) {}
async function getResourceVersions(ctx) {}
async function resolvePlayback(ctx) {}
async function search(ctx) {}
async function matchResources(ctx) {}
async function onAction(ctx) {}
```

Common aliases are accepted: `home`, `homeSection`, `getSection`, `category`, `catalog`, `list`, `detail`, `getVersions`, `versions`, `resolvePlay`, `play`, `getPlayinfo`, `quickSearch`, `getSearch`, `onSearch`, `matchMovie`, `matchEpisode`, `resourceMatch`, and `handleAction`.

The App injects user parameter values into `ctx.params`, `ctx.config`, `ctx.settings`, and `ctx.parameters`.

## Manifest

```js
function getManifest() {
  return {
    id: "example-library",
    name: "Example Library",
    title: "Example Library",
    version: "1.0.0",
    author: "community",
    logo: "https://example.com/logo.png",
    icon: "https://example.com/logo.png",
    capabilities: {
      home: true,
      category: true,
      detail: true,
      search: true,
      resourceVersions: true,
      playback: true,
      resourceMatching: false
    },
    aggregation: {
      search: true,
      playbackHistory: true,
      resourceMatching: false
    },
    parameters: [
      { name: "baseUrl", title: "Base URL", type: "input", value: "https://example.com/" },
      {
        name: "subscriptions",
        title: "Subscriptions",
        type: "objectList",
        fields: [
          { name: "name", title: "Name", type: "input", required: true },
          { name: "url", title: "URL", type: "input", required: true }
        ]
      }
    ]
  };
}
```

Parameter types include `input`, `password`, `number`, `boolean`/`toggle`, `enumeration`/`select`, and `objectList`.

## Home and Sections

```js
async function getHome(ctx) {
  return {
    pageType: "home",
    title: "Example Library",
    heroAspectRatio: "16:9",
    hero: [
      {
        id: "m1",
        title: "Movie",
        type: "movie",
        poster: "https://example.com/poster.jpg",
        backdrop: "https://example.com/backdrop.jpg",
        aspectRatio: "16:9",
        action: { type: "detail", itemId: "m1" }
      }
    ],
    sections: [
      {
        id: "hot",
        title: "Hot",
        style: "discover.spotlight",
        lazy: true,
        promotesToHero: true,
        moreAction: { type: "category", pageId: "hot", title: "Hot", itemAspectRatio: "16:9" },
        items: []
      }
    ]
  };
}

async function getHomeSection(ctx) {
  return {
    id: ctx.sectionId || ctx.id || "hot",
    title: ctx.title || "Hot",
    style: ctx.style || "discover.spotlight",
    lazy: false,
    items: []
  };
}
```

`getHomeSection()` must always return a section object. Return `items: []` with an error subtitle instead of `null`.

## Style Tokens

Ordinary media section styles:

- `discover.standard`
- `discover.ranked`
- `discover.spotlight`
- `discover.editorial`
- `discover.posterCompact`
- `media.posterGrid`

Carousel and provider styles:

- `discover.carousel`
- `discover.watchProviders`

Annual/category-card styles for second-level groups, topics, actors, channels, and collections:

- `discover.annualCategories`
- `discover.annualClassic`
- `discover.annualPosterStack`
- `discover.annualWidePreview`
- `discover.annualListPreview`

Annual/category-card items should be `type: "collection"` or `type: "category"` and may include `previewItems`. For cards that users can browse, 8-10 preview items are fine. For poster stack and wide preview styles, return only enough preview posters for the UI.

## Items and Actions

```js
{
  id: "m1",
  title: "Movie",
  subtitle: "2026 / Drama",
  type: "movie",
  poster: "https://example.com/poster.jpg",
  backdrop: "https://example.com/backdrop.jpg",
  overview: "Summary",
  year: 2026,
  rating: 7.8,
  rank: 1,
  remarks: "HD",
  metadataText: "45 min",
  badges: ["HD", "Sub"],
  aspectRatio: "16:9",
  imageFit: "fill",
  imageHeaders: { Referer: "https://example.com/", "User-Agent": "Mozilla/5.0" },
  posterHeaders: { Referer: "https://example.com/poster-page" },
  backdropHeaders: { Referer: "https://example.com/detail-page" },
  previewItems: [],
  action: { type: "detail", itemId: "m1" }
}
```

Types: `movie`, `series`, `season`, `episode`, `category`, `collection`, `person`.

Actions:

```js
{ type: "detail", itemId: "m1" }
{ type: "category", pageId: "hot", title: "Hot" }
{ type: "play", itemId: "cctv1", url: "https://example.com/live.m3u8", title: "CCTV1" }
{ type: "search", query: "keyword", title: "Search keyword" }
{ type: "custom", name: "openRank", payload: { rank: "weekly" } }
```

`imageFit` supports only `fill` and `fit`. Use `fit` for logos and live channel icons that should not be cropped.

## Category Pages

```js
async function getCategory(ctx) {
  return {
    pageType: "category",
    id: ctx.pageId || ctx.id,
    title: ctx.title || "Category",
    style: "media.posterGrid",
    itemAspectRatio: "16:9",
    page: Number(ctx.page || 1),
    hasMore: false,
    selectedSortValue: ctx.sortBy || ctx.sort_by || "latest",
    sort: [
      { id: "latest", title: "Latest", value: "latest" },
      { id: "hot", title: "Hot", value: "hot" }
    ],
    items: []
  };
}
```

Use `itemAspectRatio`, `cardAspectRatio`, `posterAspectRatio`, or `imageOrientation` to prevent portrait-first flicker on landscape lists.

## Detail Pages

```js
async function getDetail(ctx) {
  return {
    pageType: "detail",
    id: ctx.itemId || ctx.id,
    type: "series",
    title: "Series",
    originalTitle: "Original Series",
    year: 2026,
    poster: "https://example.com/poster.jpg",
    backdrop: "https://example.com/backdrop.jpg",
    detailImageAspectRatio: "16:9",
    imageHeaders: { Referer: "https://example.com/" },
    overview: "Summary",
    rating: 8.0,
    runtimeMinutes: 45,
    viewCountText: "1.2M",
    favoriteCountText: "32K",
    genres: ["Drama"],
    externalIds: { tmdb: "123", imdb: "tt123" },
    cast: [
      {
        name: "Actor",
        role: "Role",
        avatar: "https://example.com/avatar.jpg",
        avatarReferer: "https://example.com/",
        action: { type: "category", pageId: "actor-1", title: "Actor", itemAspectRatio: "16:9" }
      }
    ],
    seasons: [
      {
        id: "s1",
        title: "Season 1",
        seasonNumber: 1,
        episodes: [
          { id: "e1", title: "Episode 1", episodeNumber: 1, action: { type: "play", episodeId: "e1" } }
        ]
      }
    ],
    recommendations: [
      { id: "related", title: "Related", style: "discover.standard", items: [] }
    ],
    resourceGroups: []
  };
}
```

Movie details may omit `seasons`. Series details should include episodes so the native episode selector can render. Actors are clickable only when their object includes an `action`.

## Resource Versions and Playback

```js
async function getResourceVersions(ctx) {
  return {
    itemId: ctx.itemId,
    seasonId: ctx.seasonId,
    episodeId: ctx.episodeId,
    groups: [
      {
        id: "line",
        title: "Lines",
        versions: [
          {
            id: "hd",
            name: "HD",
            subtitle: "1080P",
            container: "m3u8",
            headers: { Referer: "https://example.com/" },
            action: { type: "play", itemId: ctx.itemId, episodeId: ctx.episodeId, versionId: "hd" }
          }
        ]
      }
    ]
  };
}

async function resolvePlayback(ctx) {
  return {
    url: "https://example.com/video/index.m3u8",
    container: "m3u8",
    headers: { Referer: "https://example.com/", "User-Agent": "Mozilla/5.0" },
    startPositionSeconds: 0,
    isLive: false,
    streamKind: "vod"
  };
}
```

`resolvePlayback()` describes the media only. Do not use strategy fields such as `preferDirectAVPlayer`, `forceDirectAVPlayer`, `playbackStrategy`, `strategy`, `forceStrategy`, or `playerStrategy`.

For live channels, set `isLive: true` and `streamKind: "live"`. The App provides the lightweight live control layer.

## Search

Declare search in manifest before implementing:

```js
capabilities: { search: true },
aggregation: { search: true }
```

```js
async function search(ctx) {
  const keyword = ctx.keyword || ctx.query || ctx.text || "";
  return {
    pageType: "search",
    title: "Search",
    keyword,
    page: Number(ctx.page || 1),
    hasMore: false,
    items: []
  };
}
```

Every search result should include a `type`, poster if available, and a detail action.

## Resource Matching

Only implement when requested. Manifest should declare:

```js
capabilities: {
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
      "episodeRuntimeMinutes"
    ]
  }
},
aggregation: { resourceMatching: true }
```

Return `{ results: [MiniLibraryItem] }` or an item array. Prefer IDs over fuzzy title matching when available.

## Host APIs

Common host helpers:

```js
$http.get(url, options)
$http.post(url, body, options)
$html.select(html, selector)
$html.text(html)
$html.attr(html, name)
$cache.get(key)
$cache.set(key, value)
$crypto.md5(text)
$crypto.sha1(text)
$crypto.aesDecrypt(value, key, options)
$crypto.aesDecryptBase64(value, key, options)
Widget.browser.fetch(url, options)
Widget.tmdb.search(options)
Widget.tmdb.detail(options)
Widget.vod.sites(options)
Widget.vod.cards(options)
Widget.vod.tracks(options)
Widget.vod.play(options)
$utils.absoluteURL(base, path)
$utils.base64Encode(text)
$utils.base64Decode(text)
$log.info(value)
```

Use `Widget.browser.fetch()` only for browser-only work such as Cloudflare validation, player key creation, or media request capture. Keep ordinary list/detail/search parsing on HTTP/API calls.

## Common Pitfalls

- Returning `undefined` from `getHomeSection()` causes decode failures. Return a section object.
- Forgetting `capabilities.search` hides the mini library from search.
- Returning `type: "movie"` for all search results breaks movie/series display; map the source type correctly.
- Omitting image headers/referers can make posters disappear even when data loads.
- For landscape category pages, put `itemAspectRatio: "16:9"` on the action and the returned page to avoid first-frame portrait layout.
- Local JS should expose functions on `globalThis` or `module.exports` for broad compatibility.
