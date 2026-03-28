---
title: RTCDataChannel
description: Arbitrary data channel over WebRTC — send text, binary, JSON, lower latency than TCP
outline: [2, 3]
---

:::tip Browser Support
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## Overview

`RTCDataChannel` is an arbitrary data channel established on `RTCPeerConnection`. Unlike WebSocket, DataChannel uses P2P direct connection, no server relay, lower latency, and is **bidirectional full-duplex**.

Gamepad sync, file transfer, collaborative editing, real-time whiteboard — these scenarios fit DataChannel perfectly.

## Quick Start

```js
// === Caller ===
const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

const channel = pc.createDataChannel('chat', { ordered: true });

channel.onopen = () => {
  channel.send('Hello, peer!');
};

channel.onmessage = (e) => {
  console.log('Received:', e.data);
};

// === Callee ===
pc.ondatachannel = (e) => {
  const recvChannel = e.channel;
  recvChannel.onopen = () => recvChannel.send('Reply: You too!');
  recvChannel.onmessage = (e) => console.log('Received:', e.data);
};
```

## Reliability Modes

```js
pc.createDataChannel('label', {
  ordered: true,    // Preserve order (like TCP)
  // ordered: false, // Prioritize low latency, no order guarantee (like UDP)
});
```

| Mode | Use Case |
|------|----------|
| `ordered: true` | File transfer, JSON messages, collaborative editing (order matters) |
| `ordered: false` | Gamepad, real-time position, voice commands (packet loss tolerable) |

## Comparison with WebSocket

| Feature | RTCDataChannel | WebSocket |
|---------|---------------|-----------|
| Transmission path | P2P direct | Via server relay |
| Latency | Extremely low | Higher |
| Reconnect on disconnect | Need to rebuild connection | Auto reconnect |
| Server cost | No relay server needed | Needed |
| Complexity | Complex signaling | Simple |

## Notes

- **ICE negotiation must complete first**: `readyState` becomes `'open'` only after connection establishes
- **Peer must be online**: P2P means both ends must keep page open; no "offline message" concept
- **Large data must be fragmented**: Single `send` cannot exceed 16 MB
- **NAT traversal failure = unusable**: Like media streams, P2P data also depends on ICE
