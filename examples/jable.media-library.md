# Jable 自定义媒体库

脚本：`jable.media-library.js`，版本 `1.1.0`。

首页先读取热门列表并生成轮播，其余媒体分组按需加载。分类入口直接展示，复用五分钟内成功加载的预览，不再为首页逐个请求所有分类。验证失败和网络错误不会作为成功的空列表缓存。

HTTP 请求启用 App 的 Cloudflare 验证回退和 Cookie 复用。需要人工验证时由 App 展示网站原页面；完成后继续请求。分类接口同时兼容 HTML 和 JSON 包装的 HTML。

播放线路在本地生成；点击播放时再读取最新地址，避免获取线路时重复加载详情和推荐。解析支持转义的 HLS URL 和常见 packed 配置，不在 App 脚本环境执行远端代码。静态解析不足时只进行一次 WebKit 媒体捕获，优先使用播放器配置；无归属的多个地址会提示重试。页面与播放使用一致的 User-Agent、Referer 和 Origin，页面 Cookie 不会直接传给外域 CDN。

离线验证使用 App 实际的 JavaScript HTTP 桥及中性页面样本：

```sh
node --check docs/examples/jable.media-library.js
node scripts/test_jable_mini_library_home.js
node scripts/test_jable_mini_library_playback.js
```

真实站点仍需在 App 中完成验证后检查首页、分类、详情和起播；离线测试不等同于真机播放验证。
