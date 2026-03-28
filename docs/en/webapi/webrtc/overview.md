---
title: WebRTC Overview
description: What is WebRTC, why it makes browser calling possible
outline: [2, 3]
---

:::tip Browser Support
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## Overview

WebRTC (Web Real-Time Communication) enables two browsers to establish bidirectional audio/video and data channels directly, without server relay. It's composed of three APIs: `getUserMedia` captures local media stream, `RTCPeerConnection` establishes P2P connection, `RTCDataChannel` transfers arbitrary binary data.

In short: Want two users to call, transfer files, play games directly in browsers? WebRTC is built for exactly that.

## Quick Start

```html
<video id="local" autoplay muted></video>

<script type="module">
  const video = document.getElementById('local');

  // Get local camera
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });

  // Put it in the video element
  video.srcObject = stream;
</script>
```

Three lines of code, one API call — camera feed appears.

## Core Concepts

### Three Building Blocks

| API | Responsibility |
|-----|---------------|
| `getUserMedia` | Capture local camera/microphone, produce MediaStream |
| `RTCPeerConnection` | Establish, manage, close P2P connections |
| `RTCDataChannel` | Open an arbitrary data channel on the connection |

### Signaling

WebRTC itself doesn't solve "how to find the other party". This part needs server cooperation — typically use WebSocket to exchange SDP offer/answer and ICE candidate addresses. Signaling server can be anything: Node.js, Go, even PHP.

### ICE / STUN / TURN

- **ICE**: Unified framework, combines STUN and TURN
- **STUN**: Helps you get your public IP (NAT traversal helper)
- **TURN**: When P2P direct connection fails, relay server forwards data (final fallback)

## Notes

- **HTTPS required**: Apart from `localhost`, all `getUserMedia` calls must use HTTPS
- **Permission prompt**: Browser authorization dialog pops up each call, cannot bypass
- **Performance**: Audio/video encoding is CPU-intensive, consider bitrate limits on low-end devices
