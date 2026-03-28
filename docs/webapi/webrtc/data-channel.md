---
title: RTCDataChannel
description: WebRTC 上的任意数据通道 — 发送文本、二进制、JSON，延迟比 TCP 低
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## 概述

`RTCDataChannel` 是在 `RTCPeerConnection` 上建立的一条任意数据通道。它和 WebSocket 的区别是：DataChannel 走 P2P 直连，不经过服务器，延迟更低，而且是**双向全双工**的。

游戏手柄同步、文件传输、协同编辑、实时白板——这些场景用 DataChannel 再合适不过。

## 快速开始

```js
// === 发起端 ===
const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

const channel = pc.createDataChannel('chat', { ordered: true });

channel.onopen = () => {
  channel.send('你好，对端！');
};

channel.onmessage = (e) => {
  console.log('收到:', e.data);
};

// === 接收端 ===
pc.ondatachannel = (e) => {
  const recvChannel = e.channel;
  recvChannel.onopen = () => recvChannel.send('回复：你也在！');
  recvChannel.onmessage = (e) => console.log('收到:', e.data);
};
```

## 可靠性模式

```js
pc.createDataChannel('label', {
  ordered: true,    // 保证顺序（像 TCP）
  // ordered: false, // 追求低延迟，不保证顺序（像 UDP）
});
```

| 模式 | 适用场景 |
|------|---------|
| `ordered: true` | 文件传输、JSON 消息、协同编辑（需要顺序） |
| `ordered: false` | 游戏手柄、实时位置、语音指令（允许丢包） |

## 和 WebSocket 的对比

| 特性 | RTCDataChannel | WebSocket |
|------|---------------|-----------|
| 传输路径 | P2P 直连 | 经服务器中转 |
| 延迟 | 极低 | 较高 |
| 断线重连 | 需要重建连接 | 自动重连 |
| 服务器成本 | 无需转发服务器 | 需要 |
| 复杂度 | 信令复杂 | 简单 |

## 注意事项

- **必须先完成 ICE 协商**：`readyState` 变成 `'open'` 必须等连接建立后
- **对端必须在线**：P2P 意味着两端都要保持页面打开；没有"离线消息"概念
- **大数据块要分片**：单次 `send` 不能超过 16 MB
- **NAT 穿透失败 = 无法使用**：和媒体流一样，P2P 数据也依赖 ICE
