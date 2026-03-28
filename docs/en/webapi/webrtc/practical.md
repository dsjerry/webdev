---
title: "WebRTC Practice: P2P Video Call"
description: Implement real-time video call between two browsers using WebRTC + signaling server
outline: [2, 3]
---

:::tip Browser Support
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+

**Note**: Requires HTTPS or localhost environment.
:::

## Overview

This section ties together everything you've learned: local media capture → create connection → signaling exchange → remote video playback. Core flow is about 80 lines of code.

## Notes

- **HTTPS**: Must use HTTPS outside localhost; can use ngrok or Cloudflare Tunnel to expose local services
- **STUN server**: `stun.l.google.com:19302` is Google's public STUN, for demo only; build or buy TURN service for production
- **TURN relay**: In strict network environments (enterprise network, symmetric NAT), STUN is not enough, must configure TURN server; otherwise connection `failed`
- **Echo issue**: This example has local video with `muted`, remote audio without — if still getting echo, check system sound card settings or use headphones
