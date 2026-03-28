---
title: 专用 Worker vs 共享 Worker
description: 什么时候用 Dedicated Worker，什么时候用 SharedWorker
outline: [2, 3]
---

:::tip 浏览器支持
Dedicated Worker: Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+

SharedWorker: Chrome 4+ · Firefox 29+ · Safari 15.2+ · Edge 79+

**注意**：Safari 对 SharedWorker 的支持相对较晚，移动端 Safari 15.2+ 才完整支持。
:::

## 概述

**Dedicated Worker** 归创建它的那个主线程独享，关闭主线程 Tab 它就死了。**Shared Worker** 则可以被同源的多个页面、多个标签页、多个 Worker 实例共享。

怎么选？需要跨 Tab 共享状态或资源？用 SharedWorker。只在一个页面内跑计算？用 Dedicated Worker。

## SharedWorker 快速开始

```js
// === SharedWorker ===
const connections = new Set();

self.onconnect = (e) => {
  const port = e.ports[0];
  connections.add(port);

  port.onmessage = (e) => {
    connections.forEach(p => p.postMessage(e.data));
  };

  port.start();
};
```

```js
// === main.js（任意 Tab） ===
const worker = new SharedWorker('./shared-worker.js', 'my-shared-worker');

worker.port.onmessage = (e) => {
  console.log('收到广播:', e.data);
};

worker.port.start();
worker.port.postMessage('hello from tab 1');
```

## 什么时候用 Dedicated Worker？

- 后台计算（排序、压缩、加密）
- 音视频编解码
- 大数据 JSON 解析
- 定时轮询（WebSocket 心跳、服务器推流）

## 什么时候用 SharedWorker？

- **跨 Tab 共享数据**：比如同一个用户开了两个 Tab，一个 Tab 登录了，另一个 Tab 自动同步登录状态
- **跨 Tab 共享连接**：一个 WebSocket 连接，多个 Tab 共用，避免重复建立连接
- **计数器/状态广播**：全局事件总线

## 注意事项

- **SharedWorker 的 `name` 参数**很重要。同一个 name 指向同一个 Worker 实例；不同 name 则创建不同的 Worker
- **Safari 兼容**：如果要支持 Safari 15.2 以下，不要用 SharedWorker，或准备兜底方案（BroadcastChannel）
- **BroadcastChannel 是更轻的替代**：如果只需要跨 Tab 通信、不需要保持长连接状态，`BroadcastChannel` API 更简单
