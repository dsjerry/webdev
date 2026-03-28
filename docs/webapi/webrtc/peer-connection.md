---
title: RTCPeerConnection
description: WebRTC 的核心 — 建立、管理、关闭点对点连接
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## 概述

`RTCPeerConnection` 是 WebRTC 的心脏。它代表两个端点之间的一条逻辑连接，管理媒体协商、网络候选交换、加密传输。

## 快速开始

```js
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
});

pc.onconnectionstatechange = () => {
  console.log('状态:', pc.connectionState);
};

pc.onicecandidate = (event) => {
  if (event.candidate) {
    sendToPeer(event.candidate);
  }
};

pc.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};
```

## 媒体协商

两个端点需要交换 SDP（Session Description Protocol）：

```js
// === 发起方 ===
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
sendToPeer({ type: 'offer', sdp: offer.sdp });

// === 接收方 ===
await pc.setRemoteDescription(offer);
const answer = await pc.createAnswer();
await pc.setLocalDescription(answer);
sendToPeer({ type: 'answer', sdp: answer.sdp });

// === 发起方收到 answer ===
await pc.setRemoteDescription(answer);
```

## 关闭连接

```js
pc.close();
```

:::danger 关闭后不能复用
`close()` 后该实例就废弃了。如果要重连，创建一个新的 `RTCPeerConnection`。
:::

## 注意事项

- **必须配 `iceServers`**：不配的话 ICE 候选永远为空，连接无法建立
- **offer/answer 是串行的**：一方 `setLocalDescription` 完成后才能发出去，对端收到才能 `setRemoteDescription`
- **同一 track 可被多个 `addTrack` 复用**：`RTCRtpSender` 可以复用同一个轨道到多个连接
