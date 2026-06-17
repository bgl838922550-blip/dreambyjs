#!/usr/bin/env python3
"""Create a baiPlay mini-library JavaScript skeleton."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def js(value: object) -> str:
    return json.dumps(value, ensure_ascii=False)


def slug(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or "mini-library"


def skeleton(library_id: str, name: str, base_url: str, kind: str) -> str:
    is_live = kind == "live"
    search_enabled = not is_live
    return f"""// @name {name}

const WidgetMetadata = {{
  id: {js(library_id)},
  name: {js(name)},
  title: {js(name)},
  version: '1.0.0',
  author: 'community',
  site: {js(base_url)},
  logo: '',
  icon: '',
  description: 'baiPlay custom mini media library.'
}};

const BASE_URL = WidgetMetadata.site.replace(/\\/+$/, '/') || {js(base_url)};
const DEFAULT_HEADERS = {{
  'User-Agent': 'Mozilla/5.0',
  Referer: BASE_URL
}};

function argsify(ctx) {{
  if (!ctx) return {{}};
  if (typeof ctx === 'string') {{
    try {{ return JSON.parse(ctx); }} catch (_) {{ return {{ raw: ctx }}; }}
  }}
  return ctx;
}}

function absoluteURL(path) {{
  if (!path) return '';
  if (/^https?:\\/\\//i.test(path)) return path;
  if (typeof $utils !== 'undefined' && $utils.absoluteURL) return $utils.absoluteURL(BASE_URL, path);
  return new URL(path, BASE_URL).toString();
}}

async function httpGet(url, options) {{
  const requestURL = absoluteURL(url);
  const merged = Object.assign({{}}, options || {{}}, {{
    headers: Object.assign({{}}, DEFAULT_HEADERS, (options && options.headers) || {{}})
  }});
  if (typeof Widget !== 'undefined' && Widget.http && Widget.http.get) return Widget.http.get(requestURL, merged);
  if (typeof $http !== 'undefined' && $http.get) return $http.get(requestURL, merged);
  throw new Error('HTTP host API is unavailable');
}}

function getManifest() {{
  return {{
    id: WidgetMetadata.id,
    name: WidgetMetadata.name,
    title: WidgetMetadata.title,
    version: WidgetMetadata.version,
    author: WidgetMetadata.author,
    description: WidgetMetadata.description,
    logo: WidgetMetadata.logo,
    icon: WidgetMetadata.icon || WidgetMetadata.logo,
    capabilities: {{
      home: true,
      category: true,
      detail: {str(not is_live).lower()},
      search: {str(search_enabled).lower()},
      resourceVersions: {str(not is_live).lower()},
      playback: true,
      resourceMatching: false
    }},
    aggregation: {{
      search: {str(search_enabled).lower()},
      playbackHistory: {str(not is_live).lower()},
      resourceMatching: false
    }},
    parameters: [
      {{
        name: 'baseUrl',
        title: 'Base URL',
        type: 'input',
        value: BASE_URL,
        required: false
      }}
    ]
  }};
}}

function mediaItem(raw, index) {{
  const id = String(raw.id || raw.itemId || raw.url || `item-${{index + 1}}`);
  const title = raw.title || raw.name || id;
  const poster = raw.poster || raw.cover || raw.pic || raw.logo || '';
  const backdrop = raw.backdrop || raw.thumb || poster;
  return {{
    id,
    title,
    subtitle: raw.subtitle || raw.remarks || '',
    type: raw.type || {js("episode" if is_live else "movie")},
    poster,
    backdrop,
    overview: raw.overview || raw.description || '',
    year: raw.year,
    rating: raw.rating,
    rank: index + 1,
    remarks: raw.remarks,
    metadataText: raw.metadataText || raw.durationText,
    badges: raw.badges || [],
    aspectRatio: raw.aspectRatio || '16:9',
    imageFit: raw.imageFit || {js("fit" if is_live else "fill")},
    imageHeaders: raw.imageHeaders || DEFAULT_HEADERS,
    action: raw.action || {{
      type: {js("play" if is_live else "detail")},
      itemId: id,
      url: raw.url,
      title
    }}
  }};
}}

async function getHome(ctx = {{}}) {{
  const args = argsify(ctx);
  const baseUrl = (args.params && args.params.baseUrl) || BASE_URL;
  return {{
    pageType: 'home',
    id: 'home',
    title: WidgetMetadata.title,
    heroAspectRatio: '16:9',
    hero: [],
    sections: [
      {{
        id: 'latest',
        title: 'Latest',
        style: {js("discover.annualWidePreview" if is_live else "discover.spotlight")},
        lazy: true,
        promotesToHero: true,
        subtitle: baseUrl,
        moreAction: {{ type: 'category', pageId: 'latest', title: 'Latest', itemAspectRatio: '16:9' }},
        items: []
      }}
    ]
  }};
}}

async function getHomeSection(ctx = {{}}) {{
  const args = argsify(ctx);
  return {{
    id: args.sectionId || args.id || 'latest',
    title: args.title || 'Latest',
    style: args.style || {js("discover.annualWidePreview" if is_live else "discover.spotlight")},
    lazy: false,
    items: []
  }};
}}

async function getCategory(ctx = {{}}) {{
  const args = argsify(ctx);
  return {{
    pageType: 'category',
    id: args.pageId || args.id || 'latest',
    title: args.title || 'Latest',
    style: 'media.posterGrid',
    itemAspectRatio: '16:9',
    page: Number(args.page || 1),
    hasMore: false,
    sort: [
      {{ id: 'latest', title: 'Latest', value: 'latest' }},
      {{ id: 'hot', title: 'Hot', value: 'hot' }}
    ],
    selectedSortValue: args.sortBy || args.sort_by || args.sort || 'latest',
    items: []
  }};
}}

async function getDetail(ctx = {{}}) {{
  const args = argsify(ctx);
  const itemId = args.itemId || args.id || 'item-1';
  return {{
    pageType: 'detail',
    id: itemId,
    type: 'movie',
    title: args.title || itemId,
    poster: '',
    backdrop: '',
    detailImageAspectRatio: '16:9',
    imageHeaders: DEFAULT_HEADERS,
    overview: '',
    genres: [],
    cast: [],
    seasons: [],
    recommendations: [],
    resourceGroups: await getResourceVersions(Object.assign({{}}, args, {{ itemId }})).then(result => result.groups || result)
  }};
}}

async function getResourceVersions(ctx = {{}}) {{
  const args = argsify(ctx);
  return {{
    itemId: args.itemId || args.id,
    seasonId: args.seasonId,
    episodeId: args.episodeId,
    groups: [
      {{
        id: 'default',
        title: 'Default',
        versions: [
          {{
            id: 'default',
            name: 'Default',
            container: args.container || undefined,
            headers: DEFAULT_HEADERS,
            action: {{
              type: 'play',
              itemId: args.itemId || args.id,
              seasonId: args.seasonId,
              episodeId: args.episodeId,
              versionId: 'default',
              url: args.url
            }}
          }}
        ]
      }}
    ]
  }};
}}

async function resolvePlayback(ctx = {{}}) {{
  const args = argsify(ctx);
  const url = args.url || args.playUrl;
  if (!url) throw new Error('Missing playback URL');
  return {{
    url,
    container: args.container || inferContainer(url),
    headers: DEFAULT_HEADERS,
    isLive: {str(is_live).lower()},
    streamKind: {js("live" if is_live else "vod")}
  }};
}}

async function search(ctx = {{}}) {{
  const args = argsify(ctx);
  const keyword = args.keyword || args.query || args.text || '';
  return {{
    pageType: 'search',
    title: 'Search',
    keyword,
    page: Number(args.page || 1),
    hasMore: false,
    items: []
  }};
}}

function inferContainer(url) {{
  const clean = String(url || '').split('?')[0].toLowerCase();
  const ext = clean.match(/\\.([a-z0-9]+)$/);
  return ext ? ext[1] : undefined;
}}

const exported = {{
  WidgetMetadata,
  getManifest,
  getHome,
  getHomeSection,
  getCategory,
  getDetail,
  getResourceVersions,
  resolvePlayback,
  search
}};

if (typeof module !== 'undefined') module.exports = exported;
if (typeof globalThis !== 'undefined') {{
  Object.assign(globalThis, exported);
  globalThis.home = getHome;
  globalThis.homeSection = getHomeSection;
  globalThis.category = getCategory;
  globalThis.detail = getDetail;
  globalThis.getVersions = getResourceVersions;
  globalThis.resolvePlay = resolvePlayback;
  globalThis.quickSearch = search;
}}
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a baiPlay mini-library JavaScript skeleton.")
    parser.add_argument("--id", required=True, help="Stable library id, for example novipnoad-mini-library")
    parser.add_argument("--name", required=True, help="Display name")
    parser.add_argument("--base-url", default="", help="Target website or API base URL")
    parser.add_argument("--kind", choices=["vod", "live"], default="vod", help="Skeleton flavor")
    parser.add_argument("--output", required=True, help="Output JS path")
    args = parser.parse_args()

    library_id = slug(args.id)
    base_url = args.base_url or "https://example.com/"
    if base_url and not base_url.endswith("/"):
        base_url += "/"

    output = Path(args.output).expanduser()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(skeleton(library_id, args.name, base_url, args.kind), encoding="utf-8")
    print(str(output))


if __name__ == "__main__":
    main()
