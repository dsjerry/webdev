---
title: MessageChannel
description: 创建私有通信管道，让两个 Worker 直接对话，不走主线程
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 41+ · Safari 10+ · Edge 12+
MessageChannel 在主线程、Worker、ServiceWorker 中均可用。
:::

## 概述

`MessageChannel` 让你在两个上下文之间建立一条**私有、直连**的通信管道，而不需要经过 Worker 的主脚本。

典型场景：主线程同时管理两个 Worker，但这两个 Worker 之间需要直接交换大量数据。如果走主线程中转，所有数据都要"主线程进、主线程出"，白白多一次拷贝。用 MessageChannel，可以让两个 Worker 直接对话，主线程只负责建立连接。

## 快速开始

```js
// === main.js ===
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

const workerB = new Worker('./worker-b.js');
workerB.postMessage({ type: 'PORT', port: port2 }, [port2]);

port1.onmessage = (e) => console.log('A 说:', e.data);

port1.start();
```

## MessageChannel 的两个端口

`new MessageChannel()` 返回 `{ port1, port2 }`：

- `port1` 发送 → `port2` 接收
- `port2` 发送 → `port1` 接收
- 一端关闭后，另一端会收到 `onmessageerror`

## 和 BroadcastChannel 的对比

| 特性 | MessageChannel | BroadcastChannel |
|------|---------------|------------------|
| 通信对象 | 两个特定端口 | 同源所有 Tab + Worker |
| 是否需要中转 | 端口需手动分发 | 不需要，天然广播 |
| 方向 | 全双工，直连 | 全双工，广播 |
| 兼容性 | 更好（IE10+） | Safari 15.4+ |

## 注意事项

- **端口必须 `.start()`**：即使绑定了 `onmessage`，部分浏览器仍要求显式调用 `.start()` 激活端口
- **不要在 port 上同时绑定 `onmessage` 和 `addEventListener('message')` 两次**：消息会被处理两遍
- **端口转移后原线程失去所有权**：如果 `postMessage` 时把 `port2` 作为 transferable 传出去，原线程就不能再用了
