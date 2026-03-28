---
title: Dedicated Worker vs Shared Worker
description: When to use Dedicated Worker, when to use SharedWorker
outline: [2, 3]
---

:::tip Browser Support
Dedicated Worker: Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+

SharedWorker: Chrome 4+ · Firefox 29+ · Safari 15.2+ · Edge 79+

**Note**: Safari's SharedWorker support came relatively late; mobile Safari 15.2+ has full support.
:::

## Overview

**Dedicated Worker** is exclusive to the main thread/tab that created it; it dies when that tab closes. **Shared Worker** can be shared across multiple pages, tabs, and Worker instances of the same origin.

How to choose? Need cross-tab shared state or resources? Use SharedWorker. Just running computation within one page? Use Dedicated Worker.

## SharedWorker Quick Start

```js
// === SharedWorker ===
const connections = new Set();

self.onconnect = (e) => {
  const port = e.ports[0];
  connections.add(port);

  port.onmessage = (e) => {
    connections.forEach(p => p.postMessage(e.data));
  };

  port.start();
};
```

```js
// === main.js (any tab) ===
const worker = new SharedWorker('./shared-worker.js', 'my-shared-worker');

worker.port.onmessage = (e) => {
  console.log('Received broadcast:', e.data);
};

worker.port.start();
worker.port.postMessage('hello from tab 1');
```

## When to Use Dedicated Worker?

- Background computation (sorting, compression, encryption)
- Audio/video codec processing
- Large data JSON parsing
- Timed polling (WebSocket heartbeat, server push streams)

## When to Use SharedWorker?

- **Cross-tab data sharing**: e.g. user opens two tabs, one tab logs in, the other tab auto-syncs login state
- **Cross-tab connection sharing**: One WebSocket connection, multiple tabs share it, avoid rebuilding connections
- **Counter/state broadcasting**: Global event bus

## Notes

- **SharedWorker's `name` parameter** is important. Same name points to same Worker instance; different names create different Workers
- **Safari compatibility**: If you need to support Safari below 15.2, don't use SharedWorker, or prepare a fallback (BroadcastChannel)
- **BroadcastChannel is a lighter alternative**: If you only need cross-tab communication without keeping long connection state, `BroadcastChannel` API is simpler
