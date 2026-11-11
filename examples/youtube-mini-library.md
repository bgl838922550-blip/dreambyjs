# YouTube 自定义媒体库

## 1.2.7 续播归属修复（2026-10-24）

旧脚本递归扫描整份 `next` 响应，可能把推荐视频的续播位置或已看百分比套用到当前视频。例如推荐视频已看 37%，当前未观看视频时长 300 秒，详情会错误显示从 111 秒续播。

进度提取现在必须匹配目标视频 ID，只接收所属视频 renderer 内的明确续播标记。`currentVideoEndpoint` 不会让推荐栏继承主视频身份，章节跳转的 `startTimeSeconds` 和播放器起点 `playbackStartConfig.startSeconds` 也不再当作观看历史。负数、非有限值、超出时长或已到结尾的值不作为续播时间。

没有可靠进度时，详情省略 `playbackProgress`，查询接口返回 `null`，由 App 保留真实本地观看记录。单纯打开详情不会写入本地历史；过去已经点击播放并落库的记录无法可靠区分来源，因此本次不批量删除历史。

```sh
node scripts/test_youtube_mini_library_progress.js
```

## 1.2.6 播放资源修复（2026-10-24）

本次仅修改 YouTube JS 适配器，继续使用 App 已有的 MP4 DASH/SIDX 播放接口。

### 故障证据

用 REA 捕获公开 watch 页 `jNQXAC9IVRw`：网页播放器为 `cbcfbf2f`，WEB 客户端版本为 `2.20261023.01.00`。初始 player response 返回 `OK`，包含 `adaptiveFormats` 的编码、尺寸及范围，但没有各轨道的 `url` 或 `signatureCipher`，只有 `serverAbrStreamingUrl`。网页通过 POST `/videoplayback?sabr=1` 获取媒体，观察到 HTTP 200。

因此，不能把 `OK`、轨道元数据或 SABR 地址当成 App 可直接读取的 MP4 轨道。旧脚本还会在有 `hlsManifestUrl` 时隐藏完整画质列表，并将点播标成直播。

REA evidence: `ev_68e14b4e47d0f23571b0eb78918f175813f478c5e512d2d9ffabfeb9f092337d`。捕获包含部分不可读取的网络响应体；以上结论只依赖已取得的初始 player JSON 和请求/响应记录。

### 获取方式

- 公共播放优先使用独立的 VISIONOS 1.04 会话，原生 UA、设备及系统字段保持一致。
- 先请求同客户端的 `visitor_id`，再调用 `player`；请求携带随机 `cpn`、`t` 和视频 `id`。音视频媒体 URL 使用同一个 `cpn`。
- 播放会话不复用 WEB visitor，不携带 TV OAuth 或 Cookie。原生客户端失败时继续原有账号客户端；首页、订阅等账号功能沿用已有登录协议。
- 只有可组装的 MP4 视频与 MP4 音频（均有初始化和索引范围）、带音频的 MP4 或 HLS 才算可用响应。SABR-only、纯音频、缺少 SIDX 或只有 WebM 音频时继续尝试其他客户端/接口。
- 点播有完整 DASH 轨道时优先列出具体画质；HLS-only 保留自动入口，已结束的直播按点播处理。
- player 缓存升级为 v4，保留播放 `cpn`，不再复用旧 v3 的失效请求结果。

接口形态参考（按行为重新实现，未引入第三方运行时）：

- NewPipeExtractor：`https://github.com/TeamNewPipe/NewPipeExtractor/blob/dev/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/YoutubeStreamHelper.java`
- NewPipeExtractor：`https://github.com/TeamNewPipe/NewPipeExtractor/blob/dev/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/YoutubeParsingHelper.java`
- NewPipeExtractor：`https://github.com/TeamNewPipe/NewPipeExtractor/blob/dev/extractor/src/main/java/org/schabi/newpipe/extractor/services/youtube/ClientsConstants.java`
- yt-dlp：`https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/youtube/_base.py`
- yt-dlp：`https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/youtube/_video.py`
- YouTube.js：`https://github.com/LuanRT/YouTube.js/blob/main/src/core/Player.ts`

### 验证

离线回归使用真实 `MiniLibraryService.swift` 中的 `hostBootstrapScript`，验证文本 JSON 转换、会话隔离、客户端和 API base 回退、轨道配对、缓存及 HLS 分类：

```sh
node scripts/test_youtube_mini_library_playback.js
node scripts/test_youtube_mini_library_home.js
node scripts/test_youtube_mini_library_auth.js
```

真实网络验证执行生产 JS 的 `getResourceVersions → resolvePlayback(probeOnly)`，再按返回的初始化范围和 SIDX 范围做有上限的 Range 请求：

| 公开视频 | 列出的画质 | 本次选择 | 结果 |
| --- | --- | --- | --- |
| `jNQXAC9IVRw` | 240p、144p | 240p H.264 + AAC | 视频/音频 init 与 index 共 4 次 HTTP 206 |
| `aqz-KE-bpKQ` | 2160p60 至 144p，共 8 档 | 1080p60 H.264 + AAC | 视频/音频 init 与 index 共 4 次 HTTP 206 |

8 次响应长度均与请求范围一致，初始化含 `ftyp/moov`，索引含 `sidx`，单次最多读取 1508 字节。该验证证明轨道解析及所需媒体范围可读取；没有在 iPhone 上完成画面/声音、拖动和长时间播放验证，也没有验证所有地区或账号受限视频。
