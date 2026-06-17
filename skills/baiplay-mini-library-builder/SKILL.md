---
name: baiplay-mini-library-builder
description: Build, port, update, or debug baiPlay custom mini media library JavaScript scripts and manifests. Use when Codex is asked to create a baiPlay "custom media library", "mini library", "mini app", "自定义媒体库", or "小程序媒体库" from a website, API, M3U/IPTV source, VOD subscription, AGC/Forward widget, or existing JS file; implement or fix getManifest, getHome, getHomeSection, getCategory, getDetail, getResourceVersions, resolvePlayback, search, matchResources, image headers, user parameters, section styles, live-channel direct play, Cloudflare/browser-fetch handling, or protocol validation.
---

# baiPlay Mini Library Builder

## Purpose

Create baiPlay custom mini media libraries as native-data adapters, not web views. The JavaScript returns structured media data, actions, images, headers, user parameters, and playback URLs; baiPlay owns the native UI, navigation, search page, playback strategy, playback history, and aggregation settings.

## First Steps

1. Locate the baiPlay repo when available. Prefer the current repo docs and examples over bundled reference notes:
   - `docs/小程序源设计规范.md`
   - `docs/examples/mini-library-sample.js`
   - `docs/examples/live-mini-library.js`
   - `docs/examples/novipnoad-mini-library.js`
   - `docs/examples/jable.media-library.js`
   - `docs/examples/libvio-agc-mini-library.js`
2. If the repo docs are not available, read `references/protocol.md`.
3. For a new adapter, optionally generate a starting file with:
   ```bash
   python3 /Users/baiguangli/.codex/skills/baiplay-mini-library-builder/scripts/scaffold_mini_library.py \
     --id example-library \
     --name "Example Library" \
     --base-url "https://example.com/" \
     --output /tmp/example-library.js
   ```
4. Inspect the target source before coding. Identify whether it is an API, static HTML site, M3U/IPTV list, VOD widget/subscription, AGC/Forward widget, or Cloudflare-protected site.

## Implementation Workflow

1. Define `WidgetMetadata` and `getManifest()`.
   Include stable `id`, readable `name/title`, `version`, `author`, `logo/icon`, `capabilities`, `aggregation`, and any user `parameters`. Use `objectList` for multiple subscriptions or account/API endpoint lists.

2. Build the home page around baiPlay's discover-style sections.
   Return `pageType: "home"`, `hero` or `carousel`, `heroAspectRatio`, and `sections`. Use lazy sections for slow remote data. Each section must return a valid object even on failure; never return `null` or `undefined` from `getHomeSection()`.

3. Map cards to media actions.
   Media cards normally use `{ type: "detail", itemId }`. Live channel cards may use `{ type: "play", itemId, url, title }` so tapping directly starts playback. Category/collection cards use `{ type: "category", pageId, title }`.

4. Implement category/list pages.
   Return `pageType: "category"`, `items`, optional `hasMore`, `page`, `sort/sortOptions`, `selectedSortValue`, and a page-level image ratio such as `itemAspectRatio: "16:9"` when cards are landscape.

5. Implement details with TMDB-like data.
   Return `title`, `type`, `poster`, `backdrop`, `detailImageAspectRatio`, `overview`, `year`, `rating`, `runtimeMinutes`, `genres`, `cast`, `seasons[].episodes[]`, `recommendations`, and optional inline `resourceGroups`. Use image headers/referer fields wherever the source requires anti-hotlinking.

6. Implement resource versions and playback.
   `getResourceVersions(ctx)` returns groups of playable versions or lines. `resolvePlayback(ctx)` returns only the resource description: `url`, `container`, `headers`, `startPositionSeconds`, `isLive`, and `streamKind`. Do not return or depend on playback strategy fields such as `preferDirectAVPlayer`, `forceDirectAVPlayer`, `playbackStrategy`, or `playerStrategy`; the App chooses the player path.

7. Implement search only when supported.
   If manifest declares search support, `search(ctx)` must accept `query`, `keyword`, and `text`, return a standard search page or item array, and make every result open the mini-library detail page.

8. Implement resource matching only when explicitly requested.
   `matchResources(ctx)` is reserved for future TMDB detail matching. Declare the supported parameters in manifest if used, but avoid adding it when the user has asked not to support matching yet.

## Source Handling Rules

- Prefer official JSON/API endpoints or deterministic HTML parsing with correct headers.
- Do not use a visible browser for ordinary list/detail/search pages. Use `Widget.browser.fetch()` only for real browser-only pages such as Cloudflare verification, player key generation, canvas/sessionStorage/localStorage checks, or media request capture.
- If a site is Cloudflare-protected, let normal pages degrade gracefully and keep browser verification scoped to the page that actually needs it.
- Preserve source-specific request headers, cookies, referers, and user agents. Playback headers belong in `resolvePlayback()`. Image headers belong on items, detail images, cast images, episode stills, or recommendation items.
- Keep JS responsible for adaptation and parsing. Do not duplicate App UI, App playback decisions, playback history writes, or global search routing inside the script.

## Validation

Run the fastest checks that fit the adapter:

```bash
node --check path/to/library.js
node scripts/validate_mini_library_examples.js
```

For source-specific scripts, also run small function calls with local stubs for `$http`, `Widget.http`, `$cache`, or `Widget.vod` when possible. Verify at least:

- `getManifest()` returns valid metadata and capabilities.
- `getHome()` returns a non-empty page or valid lazy sections.
- Each `getHomeSection()` path returns a section object.
- Category/search/detail actions round-trip into `getCategory()`, `search()`, and `getDetail()`.
- Series details include episodes; movie details include resource versions.
- `resolvePlayback()` returns a final playable URL, container, headers, and live/VOD flags.

## Reference

Read `references/protocol.md` for the compact baiPlay protocol, style tokens, data shapes, host APIs, and common pitfalls.
