---
title: Web Worker 实战：剥离重计算逻辑
description: 把斐波那契数列 + 大数组排序搬到 Worker 里，主线程零卡顿
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+
本实战示例涉及 `crypto.getRandomValues`。
:::

## 概述

这一节把前面的知识串联起来：把斐波那契数列计算和大数组排序从主线程剥离到 Worker。

场景假设：你在做一个数据分析页面，需要计算斐波那契第 45 项（耗时约 3-5 秒），同时对 20 万行 CSV 数据做排序和聚合。如果这些都在主线程跑，页面直接卡死 5 秒——用户以为坏了。

我们用 Dedicated Worker 解决这个问题。

## 效果演示

```
点击「运行计算」后：

主线程立刻响应 — 按钮变灰 Disabled
主线程不卡顿 — 可以滚动、点击其他按钮

Worker 在后台默默算 5 秒

完成后主线程收到结果，更新 UI
「✓ 完成，结果: 1134903170，耗时 3ms」
```

## 注意事项

- **Transferable 是关键**：把 `arr.buffer` 作为第二个参数传给 `postMessage`，数据被"转移"而不是"克隆"，主线程立即释放那块内存，不会卡顿
- **fibonacci 用矩阵快速幂**而不是递归：递归版本 O(2^n)，矩阵快速幂 O(log n)，第 1000 项也能瞬间算完
- **Worker 里没有 DOM**：不要试图在 Worker 里操作 `document`；所有结果必须 `postMessage` 回主线程
- **Worker 错误不会崩主线程**：Worker 报错后可以用 `worker.onerror` 捕获，不影响主线程运行
