---
title: "WebSocket Practice: Real-time Multi-user Chat"
description: Build a multi-user real-time chat app with reconnection, heartbeat, and room separation from scratch
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 4+ · Edge 12+

**Note**: Requires HTTPS or localhost environment.
:::

## Overview

This section ties together everything you've learned: connection management → heartbeat keep-alive → room message broadcast → reconnection recovery. The app consists of server (Node.js + `ws`) and client, about 200 lines total.

## Notes

- **Cross-device access**: Change server IP to LAN IP (e.g. `ws://192.168.1.x:8080`), update client URL accordingly
- **External deployment**: Production server must use `wss://` (add TLS proxy like Nginx), client uses `wss://`
- **Close codes**: If graceful shutdown needed, send a `{ type: 'leave' }` message before `close()`
- **Message frequency**: Chat doesn't have high message volume, but for high-frequency data streams (like games) use binary protocol and control frame rate
