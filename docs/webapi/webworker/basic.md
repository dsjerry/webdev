---
title: Worker 基础用法
description: 创建 Worker、postMessage 通信、terminate 关闭 — 完整生命周期
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+
:::

## 概述

Dedicated Worker 是最常用的 Worker 类型。掌握 `new Worker()`、`postMessage`、`onmessage`、`terminate()` 这四个 API，Worker 你就算入门了。

## 快速开始

```js
// === main.js ===
const worker = new Worker('./worker.js');

worker.onmessage = (e) => {
  console.log('Worker 说:', e.data);
};

worker.postMessage(42);
```

```js
// === worker.js ===
self.onmessage = (e) => {
  const num = e.data;
  self.postMessage(`已收到 ${num}`);
};
```

## 创建 Worker

```js
// 方式一：通过外部脚本文件
const worker = new Worker('./worker.js');

// 方式二：内联 Worker（不需要额外文件）
const blob = new Blob([`
  self.onmessage = (e) => self.postMessage(e.data * 2);
`], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

## terminate 和 close

```js
// 主线程强制关闭 Worker
worker.terminate();

// Worker 内部自己退出
self.close();
```

:::danger terminate vs close
- `worker.terminate()`：主线程主动关闭，立即终止 Worker，不管它在干什么
- `self.close()`：Worker 自己调用，会等当前任务跑完再退出
:::

## 注意事项

- **Worker 线程里 `this === self`**：`this.postMessage` 和 `self.postMessage` 完全等价，推荐用 `self`
- **不能访问 `window`**：但可以 `importScripts()` 加载同源脚本
- **`importScripts` 是同步的**：加载完成后才继续执行，不支持跨域
- **Worker 的 `console.log`** 会打印在浏览器的 **Worker 控制台**里（开发者工具 → Source → Workers 面板），不是主页面控制台
