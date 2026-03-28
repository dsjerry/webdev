---
title: Web Worker Overview
description: What is a Worker, why is it needed, and how does it work
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+
:::

## Overview

JavaScript is single-threaded. All code runs on the main thread: UI rendering, event handling, timers, network callbacks — everything competes for the same thread. When a CPU-intensive task runs, the UI freezes.

**Web Worker** solves this by providing a background thread where JavaScript can run without blocking the UI. The main thread sends messages to the Worker, the Worker processes and sends results back.

## When Do You Need Workers?

- Image/video processing (canvas manipulation, resize, filter)
- Large data computation (sorting, filtering, statistics)
- Audio/video codec processing
- Large JSON parsing
- Data compression/decompression
- Encryption and decryption
- Game loop physics calculations

## Communication Mechanism

Workers communicate via messages:

```
Main Thread                              Worker
    |                                       |
    |-- postMessage(data) ----------------->|
    |                                       | (processes in background)
    |<---------- postMessage(result) --------|
    |                                       |
```

Data is structured-cloned (similar to `postMessage` in iframes), supporting most JavaScript types.

## Worker Types

| Type | Scope | Lifecycle |
|------|-------|-----------|
| **Dedicated Worker** | Owned by one main thread/tab | Dies with owner tab |
| **Shared Worker** | Shared across same-origin tabs/workers | Dies when all ports close |
| **Service Worker** | Acts as network proxy | Event-driven, independent lifecycle |

## Quick Start

```js
// === main.js ===
const worker = new Worker('./worker.js');

worker.onmessage = (e) => {
  console.log('Worker result:', e.data);
};

worker.postMessage({ type: 'FIB', n: 40 });
```

```js
// === worker.js ===
self.onmessage = (e) => {
  const { type, n } = e.data;

  if (type === 'FIB') {
    // Run in background, UI not blocked
    const result = fibonacci(n);
    self.postMessage(result);
  }
};

function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
```

## What Workers Cannot Do

- Access `window` object
- Access `document` object
- Modify page DOM
- Use some browser APIs (localStorage, alert, confirm)

## Notes

- **Worker has its own global scope** (`self`), not the `window` you're familiar with
- **Browser DevTools support**: Chrome DevTools can debug Workers in Sources → Workers panel
- **`console.log` in Worker** goes to Worker console, not main page console
