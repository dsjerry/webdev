---
title: MessageChannel
description: Create private communication pipes, let two Workers talk directly without going through main thread
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 41+ · Safari 10+ · Edge 12+
MessageChannel is available in main thread, Worker, and ServiceWorker.
:::

## Overview

`MessageChannel` lets you establish a **private, direct** communication channel between two contexts without going through Worker's main script.

Typical scenario: main thread manages two Workers, but these two Workers need to directly exchange large amounts of data. If routing through main thread, all data must "enter main thread, exit main thread", with one extra copy overhead. With MessageChannel, two Workers can talk directly, main thread only establishes the connection.

## Quick Start

```js
// === main.js ===
const channel = new MessageChannel();
const port1 = channel.port1;
const port2 = channel.port2;

const workerB = new Worker('./worker-b.js');
workerB.postMessage({ type: 'PORT', port: port2 }, [port2]);

port1.onmessage = (e) => console.log('A says:', e.data);

port1.start();
```

## Two Ports of MessageChannel

`new MessageChannel()` returns `{ port1, port2 }`:

- `port1` sends → `port2` receives
- `port2` sends → `port1` receives
- When one end closes, the other gets `onmessageerror`

## Comparison with BroadcastChannel

| Feature | MessageChannel | BroadcastChannel |
|---------|---------------|------------------|
| Communication target | Two specific ports | All same-origin tabs + Workers |
| Needs relay | Ports must be manually distributed | No, naturally broadcasts |
| Direction | Full-duplex, direct | Full-duplex, broadcast |
| Compatibility | Better (IE10+) | Safari 15.4+ |

## Notes

- **Ports must `.start()`**: Even if `onmessage` is bound, some browsers require explicit `.start()` to activate port
- **Don't bind both `onmessage` and `addEventListener('message')` on same port**: Messages will be processed twice
- **Port transfer removes ownership from original thread**: If `postMessage` transfers `port2` as a transferable, original thread can no longer use it
