---
title: WebRTC 实战：P2P 视频通话
description: 用 WebRTC + 信令服务器，实现两个浏览器之间的实时视频通话
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+

**注意**：需要 HTTPS 或 localhost 环境。
:::

## 概述

这一节把前面的知识串联起来：本地媒体采集 → 创建连接 → 信令交换 → 远端视频播放。核心流程拢共约 80 行代码。

## 注意事项

- **HTTPS**：除 localhost 外必须 HTTPS，可以借助 ngrok 或 Cloudflare Tunnel 暴露本地服务
- **STUN 服务器**：`stun.l.google.com:19302` 是 Google 公共 STUN，仅用于演示；生产环境建议自建或购买 TURN 服务
- **TURN 中继**：在严格网络环境下（企业网、对称型 NAT），STUN 不够用，必须配 TURN 服务器，否则连接 `failed`
- **回音问题**：本示例中本地视频加了 `muted`，远端音频没加——如果仍有回音，检查系统声卡设置或使用耳机
