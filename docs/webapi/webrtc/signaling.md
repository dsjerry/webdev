---
title: 信令机制
description: WebRTC 如何在不知道对方地址的情况下找到对方
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## 概述

WebRTC 本身只管传输，不负责"谁先开口说话"。在两个端点开始交换媒体数据之前，它们必须先就媒体能力（SDP offer/answer）和网络路径（ICE candidate）达成一致。这部分协商工作叫**信令（Signaling）**。

## 为什么需要信令？

浏览器 A 不知道浏览器 B 的 IP；浏览器 B 不知道浏览器 A 的 IP。这两个盲人要想握手，必须通过一个双方都能访问的"中间人"——信令服务器。

信令服务器转发两种消息：
1. **SDP**：我的媒体能力（编解码器、分辨率、要不要音频……）
2. **ICE Candidate**：我找到了哪些可用的网络路径（IP + 端口 + 协议组合）

## SDP Offer / Answer

标准流程：

```
A（发起方）                        B（接收方）
   |--- createOffer() --->           |
   |--- setLocalDescription(offer)  |
   |--- 发送 offer SDP --------->   | 收到 SDP
                                     |--- setRemoteDescription(offer)
                                     |--- createAnswer()
                                     |--- setLocalDescription(answer)
   |<---- 发送 answer SDP ----------| 收到 answer
   |--- setRemoteDescription(answer)|
```

## ICE 候选交换

```js
pc.onicecandidate = ({ candidate }) => {
  if (candidate) {
    ws.send(JSON.stringify(candidate));
  }
};

ws.onmessage = ({ data }) => {
  const candidate = JSON.parse(data);
  pc.addIceCandidate(candidate);
};
```

## 注意事项

- **信令服务器不是 WebRTC 的一部分**：可以用任何协议和后端，甚至手动复制粘贴 SDP（调试用）
- **offer/answer 必须配对**：发了 offer 必须等 answer，不能连发两个 offer
- **ICE 候选收集有延迟**：`setRemoteDescription` 后要等几秒才能收到足够多的候选
- **生产环境必须用 HTTPS**：STUN/TURN 服务器也要求 TLS
