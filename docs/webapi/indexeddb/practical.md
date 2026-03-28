---
title: IndexedDB 实战：离线笔记应用
description: 从零实现一个离线可用的笔记应用，支持增删改查、本地持久化
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
:::

## 概述

这一节把前面的知识串联起来：打开数据库 → 定义 schema → 增删改查全流程。配合 Service Worker 实现离线可用——即使断网，笔记也不会丢失。

## 注意事项

- **Service Worker 路径**：必须在网站根目录（或通过 `scope` 配置）才能缓存全站资源
- **IndexedDB 在 SW 中可用**：Service Worker 中可以使用 IndexedDB，不需要额外配置
- **更新 SW**：修改 `sw.js` 后需要触发 `skipWaiting` + `clients.claim()` 才能立即生效，否则要等所有标签页关闭
- **IndexedDB 是异步的**：UI 更新要等 `await db.xxx()` 完成后再渲染
