---
title: 媒体流处理
description: getUserMedia 的用法、MediaStream 轨道管理、约束条件调优
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## 概述

`getUserMedia` 是 WebRTC 的入口——它让浏览器向用户申请摄像头和麦克风权限，返回一条 `MediaStream`。这条流可以被 `video` / `audio` 标签直接消费，也可以加到 `RTCPeerConnection` 上发送给对端。

## 快速开始

```html
<video id="local" autoplay muted></video>
<audio id="remote" autoplay></audio>

<script type="module">
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localVideo.srcObject = stream;
</script>
```

:::warning 注意
`muted` 属性加在本地 `video` 上是为了防止回音（你自己说话的声音从扬声器出来再被麦克风录进去）。远程音频不需要 `muted`。
:::

## MediaStream 结构

一条 `MediaStream` 包含多个 `MediaStreamTrack`：

```js
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

stream.getVideoTracks(); // [MediaStreamTrack]
stream.getAudioTracks(); // [MediaStreamTrack]
stream.getTracks();      // 全部轨道
```

每个 `MediaStreamTrack` 可以独立开启/关闭：

```js
videoTrack.enabled = false; // 暂停摄像头（黑屏但不释放）
videoTrack.stop();          // 彻底释放摄像头
```

## 约束条件（Constraints）

```js
await navigator.mediaDevices.getUserMedia({
  video: {
    width:  { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720,  max: 1080 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: 'user',   // 前置摄像头
    // facingMode: 'environment', // 后置摄像头
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
});
```

:::tip
`ideal` 是目标值，`min`/`max` 是硬性边界。浏览器会在满足条件的情况下尽量逼近 `ideal`。
:::

## 注意事项

- **HTTPS 强制**：除 `localhost` 和 `file://` 外，`getUserMedia` 在非 HTTPS 下直接抛出 `NotAllowedError`
- **权限提示只弹一次**：用户拒绝后再次调用仍会拒绝，需要引导用户在浏览器设置里手动开启
- **设备标签为空**：未授权前 `enumerateDevices` 返回的 `label` 为空字符串；必须先 `getUserMedia` 一次授权后才能看到设备名
- **Tab 切换会暂停媒体流**：浏览器会自动降低帧率节省资源
