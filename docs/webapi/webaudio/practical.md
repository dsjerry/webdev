---
title: Web Audio API 实战：音频可视化音乐播放器
description: 从零实现一个带频谱可视化、播放控制、音量调节的音乐播放器
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 35+ · Firefox 25+ · Safari 14.1+ · Edge 79+

**注意**：需要用户交互后才能播放音频，需要 HTTPS 环境。
:::

## 概述

这一节把 Web Audio API 的知识串联起来：加载音频 → 节点连接 → AnalyserNode 频谱分析 → Canvas 渲染。拢共约 250 行代码，实现一个完整的音乐播放器。

## 架构

```
[AudioBufferSourceNode] → [AnalyserNode] → [GainNode] → [destination]
         ↓                         ↓
    播放/暂停/跳转           getByteFrequencyData()
                                   ↓
                          [Canvas 频谱柱状图]
```

## 关键实现解析

### 频谱绘制

核心在于 `AnalyserNode.getByteFrequencyData()` 返回的数组：

```js
const freqData = new Uint8Array(analyser.frequencyBinCount); // 128 个频段
analyser.getByteFrequencyData(freqData);
// freqData[i] 的值 0~255 对应第 i 个频段的能量
```

每根柱子的高度直接用 `value / 255` 映射到 canvas 高度，颜色按频率从暖到冷渐变（低音偏红，高音偏蓝紫）。

### 进度同步

播放进度用 `AudioContext.currentTime` 计算，而不是 `setInterval`：

```js
// 播放开始时记录偏移量
this.startTime = this.ctx.currentTime - offset;

// 任何时刻都能准确获取当前播放位置
const currentTime = this.ctx.currentTime - this.startTime;
```

## 注意事项

- **选择本地音频文件**：点击"选择本地音频文件"按钮，选择 MP3、WAV、OGG 等格式的音频文件
- **Canvas 高清屏适配**：`canvas.width` 使用 `devicePixelRatio` 乘以实际像素，保证 Retina 屏幕清晰
- **播放结束后自动停止**：通过 `source.onended` 事件检测播放结束，更新 UI 状态
- **FFT 大小影响分辨率**：`fftSize = 256` 产生 128 个频段。如需更细腻的可视化可改为 2048（产生 1024 个频段，但性能开销更大）
