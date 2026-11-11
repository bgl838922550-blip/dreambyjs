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
async function getPlaybackProgress(ctx) {} // optional source-side resume query
async function reportPlaybackProgress(ctx) {} // optional source-side report
async function search(ctx) {}
async function matchResources(ctx) {}
async function onAction(ctx) {}
async function startAuthentication(ctx) {}
async function pollAuthentication(ctx) {}
async function logoutAuthentication(ctx) {}
```

Common aliases are accepted: `home`, `homeSection`, `getSection`, `category`, `catalog`, `list`, `detail`, `getVersions`, `versions`, `resolvePlay`, `play`, `getPlayinfo`, `quickSearch`, `getSearch`, `onSearch`, `matchMovie`, `matchEpisode`, `resourceMatch`, `handleAction`, `beginAuthentication`, `startLogin`, `checkAuthentication`, and `pollLogin`.

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

Parameter types include `input`, `password`, `number`, `boolean`/`toggle`, `enumeration`/`select`, and `objectList`. Use `hidden`/`internal` for persisted authentication state that must not appear in the settings form.

### QR authentication

Login-capable libraries may declare a generic QR authentication flow. The JS owns the site's endpoints, signing, and status codes; the App renders the QR code, polls off the UI path, and atomically stores successful parameter updates.

```js
authentication: {
  type: "qrCode",
  title: "Scan to sign in",
  parameterName: "Cookie",
  startFunction: "startAuthentication",
  pollFunction: "pollAuthentication",
  logoutFunction: "logoutAuthentication",
  pollIntervalSeconds: 4
}
```

`startAuthentication(ctx)` returns `{ qrContent, token, userCode?, message?, expiresInSeconds?, pollIntervalSeconds? }`. Return a device code separately as `userCode` so the App can display it completely below the QR code; do not rely on embedding it only in `message`. `pollAuthentication(ctx)` receives the same opaque value as `ctx.token`, `ctx.pollToken`, and `ctx.sessionId`, and returns `{ status, message?, parameterUpdates }`. Use `pending`/`scanned` while waiting, `success` after login, and `expired`/`failed`/`cancelled` for terminal failures. `parameterUpdates` is only accepted for names listed in `parameterName`/`parameterNames` or declared manifest parameters. A cancelled or failed login never replaces the existing values.

For later Cookie or token renewal, JS may call `Widget.parameters.update({ Cookie, AccessToken, RefreshToken })` after the site has returned a complete valid replacement session. The App only accepts non-empty values whose names are declared by manifest `parameters`, atomically merges them into this library's stored parameters, and makes the new values available to subsequent calls in the same runner. An invalid update throws and leaves the previous credentials intact. Never print credentials.

Each interface call may run in a separate Runner/JSContext, so a JS global promise is not a cross-request refresh lock. For rotating refresh tokens, first read `Widget.parameters.current()`, then call `Widget.parameters.beginRefresh({ expectedName: "RefreshToken", expectedValue, timeoutSeconds })`. A successful lease returns `{ acquired: true, leaseId, parameters }`; if another runner has already persisted a replacement value, it returns `{ acquired: false, updated: true, parameters }`. Adopt those returned parameters immediately. Always release an acquired lease with `Widget.parameters.endRefresh(leaseId)` in `finally`; expired leases are reclaimed by the App.

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
- `discover.rankedPosterCompact`
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
    prefersPosterAsDetailBackdropOnPhone: false,
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
          {
            id: "e1",
            title: "Episode 1",
            episodeNumber: 1,
            runtimeMinutes: 45,
            playbackProgress: { positionSeconds: 321, durationSeconds: 2700, completed: false },
            action: { type: "play", episodeId: "e1" }
          }
        ]
      }
    ],
    playbackProgress: {
      itemId: "series-123",
      seasonId: "s1",
      episodeId: "e1",
      positionSeconds: 321,
      durationSeconds: 2700,
      completed: false,
      updatedAt: "2026-07-24T12:00:00Z"
    },
    episodePlaybackProgresses: [],
    playbackProgressAuthoritative: true,
    recommendations: [
      { id: "related", title: "Related", style: "discover.standard", items: [] }
    ],
    resourceGroups: []
  };
}
```

Set `prefersPosterAsDetailBackdropOnPhone: true` when the iPhone detail background should use the vertical `poster`. iPadOS and tvOS continue to use the landscape `backdrop`.

Movie details may omit `seasons`. Series details should include episodes so the native episode selector can render. Actors are clickable only when their object includes an `action`.

For movie cuts, language editions, or other peer playback choices that should appear as a simple horizontal row, return one season with `presentation: "selection"`. The App uses the season's `title` as the section heading, hides season/range controls, and displays each episode's own title without an `E01` prefix. Omit `seasonNumber` and `episodeNumber` for these choices.

Details may inline source-side resume data at `playbackProgress`, in `episodePlaybackProgresses`, or on each episode as `playbackProgress`. The App merges inline data with local mini-library history, selects the latest resumable episode, and shows its resume time in the native play button. Set `playbackProgressAuthoritative: true` only when `getDetail()` has completed the source account-history lookup, including the valid no-history case. The App then skips a duplicate `getPlaybackProgress()` call for playback launched from that detail. Do not invent `updatedAt` when the source does not expose one.

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
    danmaku: {
      url: "https://example.com/comments/12345.xml",
      format: "xml",
      sourceName: "Example",
      headers: { Referer: "https://example.com/" },
      timeOffsetSeconds: 0
    },
    startPositionSeconds: 0,
    isLive: false,
    streamKind: "vod",
    decryptPlaylistSegments: false,
    normalizePlaylistSegments: false,
    segmentURLRewriteRules: [
      {
        matchHost: "ipfs.example.com",
        candidateHosts: ["1.example.com", "2.example.com"],
        includeOriginal: false
      }
    ]
  };
}
```

`resolvePlayback()` describes the media only. Do not use strategy fields such as `preferDirectAVPlayer`, `forceDirectAVPlayer`, `playbackStrategy`, `strategy`, `forceStrategy`, or `playerStrategy`.

For nonfragmented MP4 with a source-supplied CENC AES-CTR media key, return `mp4Cenc: { key: keyHex, fallbackSources: [{ url, headers, key }] }` alongside the ordinary `url/container/headers`. `key` is exactly 32 hexadecimal characters; up to seven fallbacks may override the main headers and key. The App reads the front `moov` index and decrypts requested byte ranges through its own temporary HTTP server before native playback. It supports 8/16-byte sample IVs and subsamples; it rejects CBCS, constant IV, key rotation, fragmented MP4 and late `moov`. Do not combine this descriptor with live playback, DASH or `playlistText`. Return media keys only from `resolvePlayback()`, never metadata, versions or persisted parameters. Playback preparation removes the key descriptor before handing the local MP4 URL to the player; no companion service is needed.

### Optional playback progress interfaces

The App always stores a local mini-library playback record. A source does not need to implement these interfaces unless it has its own account history, such as Bilibili.

```js
async function getPlaybackProgress(ctx) {
  const args = argsify(ctx)
  return {
    itemId: args.itemId,
    episodeId: args.episodeId,
    versionId: args.versionId,
    positionSeconds: 123.4,
    durationSeconds: 1420,
    completed: false,
    updatedAt: "2026-01-01T12:00:00.000Z"
  }
}

async function reportPlaybackProgress(ctx) {
  const args = argsify(ctx)
  return { ok: true }
}
```

`ctx` includes `itemId`, `seasonId`, `episodeId`, `versionId`, `providerIds`, `positionSeconds`, `durationSeconds`, `event`, `completed`, `sessionStartedAt`, and `timestamp`. `event` is one of `progress`, `pause`, `stop`, and `completed`. The App throttles progress events and sends terminal events immediately. Source queries/reports are best effort and must never be required for playback to start. Local history is used first; a source result is used when local history is absent or the source result is newer. Prefer inline detail progress for sources whose detail API already returns history; `getPlaybackProgress()` remains the fallback when detail progress is not authoritative.

`danmaku` (aliases: `danmu`, `danmakuSource`) may be a URL string or an object with `url`, `format`, `headers`, `sourceName`, and `timeOffsetSeconds`. Supported formats are `json`, `xml`, and `bilibili-xml`; when omitted, the App auto-detects JSON or `<d p="...">` XML. The App loads comments asynchronously after the player opens and applies its existing danmaku visibility, offset, density, font, opacity, and display-area settings. Return the source for the exact episode, part, or `cid` being played.

For ISO-BMFF DASH byte-range streams, `url` may be empty when a valid `dash.videoTracks` array is present. It may also contain a legacy MP4/HLS fallback. Each DASH track supplies its remote URL, optional fallback URLs and headers, codec metadata, plus `segmentBase.initialization` and `segmentBase.indexRange` values such as `"0-999"` and `"1000-4999"`:

```js
{
  url: "",
  headers: { Referer: "https://example.com/" },
  dash: {
    durationSeconds: 1420.5,
    videoTracks: [{
      id: "120",
      url: "https://cdn.example.com/video.m4s",
      fallbackURLs: ["https://backup.example.com/video.m4s"],
      codec: "hev1.1.6.L120.90",
      mimeType: "video/mp4",
      bandwidth: 12000000,
      width: 3840,
      height: 2160,
      frameRate: "60",
      segmentBase: { initialization: "0-999", indexRange: "1000-4999" }
    }],
    audioTracks: [{
      id: "aac-high",
      name: "High bitrate AAC",
      language: "zh",
      url: "https://cdn.example.com/audio.m4s",
      codec: "mp4a.40.2",
      bandwidth: 192000,
      segmentBase: { initialization: "0-799", indexRange: "800-3999" }
    }]
  }
}
```

The App fetches only the SIDX ranges at startup and proxies media byte ranges on demand. H.264/HEVC tracks feed the generated local playlists into HLSRemux. ISO-BMFF/MP4 AV1 or VP9 tracks instead use a generated local HLS master with native AVPlayer decoding, so actual support still depends on the device and OS hardware decoder. WebM VP9 is not an ISO-BMFF/SIDX track and must not be relabeled as MP4 or returned through this `SegmentBase` path. Audio tracks can describe AAC, AC-3/E-AC-3, FLAC, and other formats handled by the existing remux audio pipeline. Return one useful track per codec/quality class instead of every bitrate duplicate.

Use `segmentURLRewriteRules` only to describe generic HLS segment URL host candidates, such as a site that uses a service worker to rewrite `ipfs.example.com` to multiple CDN hosts. The App tries those candidates inside its local HLS segment proxy.

For custom HLS playlists returned through `playlistText`, `decryptPlaylistSegments` tells the App to decrypt AES-128 segments locally when the key is supplied through `playlistAssets`. `normalizePlaylistSegments` asks the App's local HLS segment proxy to lightly remux/standardize plaintext MPEG-TS segments before returning them to AVPlayer. Use these only to describe source media quirks, not to select a player strategy.

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

Only implement for VOD/movie/series libraries that should participate in TMDB detail resource matching. Manifest should declare:

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
      "seriesYear",
      "seasonYear",
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

For episodes, `searchTitles` contains only the base title, original title, and aliases. Search those names first, then rank the returned candidates by exact season markers (`第三季`, `第3季`, `S3`, `S03`, `Season 3`), `seasonYear`, `seriesYear`, media type, and provider IDs. Resolve `episodeNumber` from the selected season's episode list. Season-qualified searches are only a fallback when every base-title search is empty. Preserve the library's original result title and episode-list title for display; the host does not synthesize an `SxxExx` label.

When the user has not disabled aggregation and the manifest declares both aggregation and resource matching, baiPlay calls `matchMovie`, `matchEpisode`, or `matchResources` from TMDB movie/series detail pages. Matched mini-library resources are shown in the resource picker under the "媒体库" group, then playback still goes through the mini library's detail/resource-version/resolvePlayback flow. Do not enable this for live-only or short-feed-only libraries.

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

`Widget.http.get/post/probe` automatically parse valid JSON response bodies: `response.data` may be an object, array or primitive, while HTML remains a string. Use parsed JSON directly, or `JSON.stringify()` structured data if a shared request helper must return text; do not convert an object with `String()` before `JSON.parse()`. API tests should use the production host bootstrap where available so response handling matches the App.

Use `Widget.browser.fetch()` only for browser-only work such as Cloudflare validation, player key creation, or media request capture. Keep ordinary list/detail/search parsing on HTTP/API calls. For a self-contained browser computation, pass `html` (aliases `inlineHTML`/`documentHTML`) and an optional `baseURL`; the App loads that document in the hidden browser instead of navigating to `url`. The base URL controls relative-resource resolution and browser origin. Existing wait options such as `waitForLocalStorageKey` and `waitForSessionStorageKey` work for inline documents too.

For a real site verification form, declare `verificationSelector` as a CSS selector string of at most 512 characters. With `visible: false`, the App shows the original page only when that selector matches, waits for the user to complete verification, and returns the HTML and cookies after the element disappears. Cancellation, timeout, and invalid selectors return an error. Call this only after HTTP encounters verification, and select an element unique to the verification form; do not automate CAPTCHA solving or use ordinary login/list/player elements as verification markers.

The marker must remain present while the user focuses or edits the input and after a rejected submission. Avoid classes removed by initialization or focus handlers: MacCMS removes `.mac_verify` on focus, so prefer a stable form container and input name. Verify that only successful completion removes the marker.

Browser tasks run one at a time, and queue time counts toward the timeout. Cancelling verification also cancels queued tasks for that origin; cancelling the calling App task stops its pending HTTP/browser work. A page must finish loading and satisfy the requested wait conditions before success is returned. Ordinary navigation replacement and stale page callbacks cannot complete a newer page.

Browser cookies retain domain, path, secure and expiry scope. HTTP `useBrowserCookie: true` merges applicable browser cookies with an explicit `Cookie` header; a valid browser cookie takes precedence over an explicit cookie with the same name. Without that option, HTTP leaves the explicit header unchanged. Browser requests seed applicable cached/explicit cookies into the cookie store, preserving the browser's existing applicable values. Returned `headers.Cookie` covers the final page URL only. Session cookies remain in memory; only unexpired persistent cookies are saved across App restarts. The older unscoped cache is discarded and may require verification once more.

```js
const verified = Widget.browser.fetch(protectedPageURL, {
  visible: false,
  verificationSelector: 'form.site-verification input[name="verify"]',
  timeout: 120,
  headers: { Referer: siteURL }
});
```

```js
const result = Widget.browser.fetch("https://example.com/", {
  html: "<!doctype html><script>localStorage.setItem('result', 'ready')</script>",
  baseURL: "https://example.com/",
  visible: false,
  waitForLocalStorageKey: "result"
})
```

## Common Pitfalls

- Returning `undefined` from `getHomeSection()` causes decode failures. Return a section object.
- Forgetting `capabilities.search` hides the mini library from search.
- Returning `type: "movie"` for all search results breaks movie/series display; map the source type correctly.
- Omitting image headers/referers can make posters disappear even when data loads.
- For landscape category pages, put `itemAspectRatio: "16:9"` on the action and the returned page to avoid first-frame portrait layout.
- Local JS should expose functions on `globalThis` or `module.exports` for broad compatibility.
