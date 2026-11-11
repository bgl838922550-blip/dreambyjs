# 红果短剧自定义媒体库

在 App 的「添加媒体库 → 自定义媒体库」导入 [hongguo-shortdrama-mini-library.js](hongguo-shortdrama-mini-library.js)，或者从媒体库广场的「红果短剧」卡片添加。导入后不需要填写地址、口令或其他参数，也不需要在电脑或 NAS 上启动额外服务。

媒体库直接从红果官网读取首页、真人剧、漫剧、AI 剧、搜索、详情和分集数据。首页提供「热门推荐」和分类入口，「刷短剧」按剧集组成竖屏队列；详情页按官网当前返回结果展示分集，实际可播放性由官方片源状态决定。观看记录和续播由 App 保存，图片请求会带官网 Referer，以便正常显示站点图片。

## 直接播放

点击集数后，App 会调用脚本的 `resolvePlayback()`。脚本优先请求官方 App 播放接口：签名获取分集的 `video_model`，读取其 `fallback_api`，解析媒体 URL 和来源返回的 CENC 内容密钥，再返回 MP4 播放描述。普通 MP4 返回标准字段；CENC MP4 另外附带 `mp4Cenc`。

```js
{
  url,
  headers,
  isLive: false,
  streamKind: 'vod',
  container: 'mp4',
  // 仅在官方片源使用 CENC 时返回；不写入列表、版本或用户参数。
  mp4Cenc: {
    key: contentKeyHex,
    fallbackSources: [{ url: backupUrl, headers: backupHeaders, key: backupKeyHex }]
  }
}
```

媒体 URL 指向官方 CDN，脚本不会把播放地址转交给第三方服务。媒体库提供资源描述，App 根据地址、容器、媒体探测和运行时结果选择播放路径，并负责播放、拖动、选集和续播。对于 `mp4Cenc`，App 使用自身的临时 HTTP Range 地址按需读取和解密，再交给内置播放器；这个地址只运行在当前设备上，不需要部署播放服务。内容密钥只用于当前播放准备与读取，不保存到观看记录。

主片源和最多 7 个 CENC 备用片源各自携带对应密钥，App 最多尝试 8 个候选源。原生 CENC 路径支持前置 `moov` 的非分片 MP4、AES-CTR、8/16 字节样本 IV 和子样本；CBCS、constant IV、密钥轮换、分片 MP4 或末置 `moov` 会明确报错。

App 对临时网络错误、408/429/5xx 和短响应最多重试同一 Range 一次。准备阶段的上游读取失败会触发一次重新取源，并用新描述重新准备索引和密钥；403 不会原地重试旧地址。格式或密钥错误不触发重新取源，取消播放后不继续重试。播放中的重试始终使用当前候选源，避免混用不同文件的索引。`[CENCMP4]` 日志记录准备、候选失败和 Range 重试的原因，不输出片源地址、请求头或密钥。

官方 App 取源失败时，脚本才请求官网对应的播放器页面。它检查 `publicVideoSeo` 是否明确标记可公开播放，并校验剧集 ID 和分集 ID；全部满足时，回退到官网公开的 360P MP4。公开分集范围由官网响应决定，不能按集数推断。两条路径都不可用时，App 会显示“红果本集片源暂不可用，且没有可直接播放的官网公开片源，请稍后重试”。详情页列出的分集不保证当前官方片源可用。

脚本只使用自定义媒体库宿主提供的 `Widget.http`、`$http` 或 `$fetch`，并兼容常见的响应容器。它不依赖 Node.js、外部播放服务、捕获的设备 ID 或红果账号。旧版本保存的播放版本 ID 仍可迁移到当前直接播放版本，不会访问旧的服务地址。

## 使用步骤

1. 在 App 中导入脚本，确认媒体库列表出现「红果短剧」。
2. 打开首页或分类，搜索剧名并进入详情；详情页显示官网当前返回的分集列表。
3. 点选分集，App 使用脚本返回的官方 MP4 播放；官方 App 取源失败时尝试官网公开 360P，两条路径都不可用时显示取源错误。
4. 打开「刷短剧」可上下切换剧集，进入详情后仍可选择其他分集。

## 验证

从仓库根目录运行：

```sh
node --check docs/examples/hongguo-shortdrama-mini-library.js
node scripts/test_hongguo_mini_library.js
node scripts/validate_mini_library_examples.js
```

在 macOS 安装 Xcode Command Line Tools 后，可另外验证 App 内 CENC 读取与恢复流程：

```sh
python3 scripts/test_mini_library_cenc_http.py
python3 scripts/test_mini_library_cenc_refresh.py
```

HTTP 测试使用本地加密 MP4 和故障响应，覆盖完整读取、HEAD、Range、临时错误重试、候选错误保留和取消。取源测试使用实际服务方法及记录调用的脚本替身，验证仅重新取源一次、重新准备所选分集、失败不循环、取消和格式错误不重新取源。

当前离线验证使用模拟官方 App 和官网响应，覆盖媒体库清单和运行时隔离、SSR 首页和分类、搜索和分页、详情和分集列表、竖屏刷剧和资源版本、官方请求签名、媒体 URL 解密、CENC 内容密钥与备用源密钥隔离、候选数量限制、公开 MP4 回退、三种宿主 HTTP API 和响应容器兼容性、输入与请求目标校验，以及纯 JavaScript 的 MD5、SHA-512、SM3 和 AES-CBC 向量。结果为：

```text
Passed 12 offline Hongguo mini-library test groups (official source, native CENC, public fallback, no companion service)
```

语法检查和离线测试通过，证明脚本在模拟响应下符合当前适配逻辑；它们没有验证官方当前片源可用性，也没有验证真机画面、声音或拖动播放。

真机验收时，应使用包含 `mp4Cenc` 原生支持的 App 版本，并导入当前脚本。确认首页分类和搜索结果可见，详情页能加载分集；选择分集后检查画面、声音、拖动到中间继续播放、切换分集和退出重进后的进度恢复。官方片源均不可用时，App 应显示取源错误。

## 参考来源

- [jackotom/hongguo-drama](https://github.com/jackotom/hongguo-drama)：红果播放源适配和媒体库组织方式参考。
- [N3urda/hongguoTV](https://github.com/N3urda/hongguoTV)：媒体库 API 结构和分集数据组织方式参考。
- 脚本顶部保留 GPL-3.0 来源声明；适配代码已经移植为 baiPlay 自定义媒体库可直接执行的 JavaScript。
