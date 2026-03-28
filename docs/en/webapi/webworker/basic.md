---
title: Worker Basic Usage
description: Create Worker, postMessage communication, terminate — complete lifecycle
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+
:::

## Overview

Dedicated Worker is the most common Worker type. Master `new Worker()`, `postMessage`, `onmessage`, `terminate()` — those four APIs and you've learned Worker.

## Quick Start

```js
// === main.js ===
const worker = new Worker('./worker.js');

worker.onmessage = (e) => {
  console.log('Worker says:', e.data);
};

worker.postMessage(42);
```

```js
// === worker.js ===
self.onmessage = (e) => {
  const num = e.data;
  self.postMessage(`Received ${num}`);
};
```

## Create Worker

```js
// Method 1: External script file
const worker = new Worker('./worker.js');

// Method 2: Inline Worker (no extra file needed)
const blob = new Blob([`
  self.onmessage = (e) => self.postMessage(e.data * 2);
`], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

## terminate and close

```js
// Main thread forcibly closes Worker
worker.terminate();

// Worker exits itself
self.close();
```

:::danger terminate vs close
- `worker.terminate()`: Main thread actively closes, terminates Worker immediately, whatever it's doing is aborted
- `self.close()`: Worker calls it itself, exits after current task finishes
:::

## Notes

- **`this === self` in Worker thread**: `this.postMessage` and `self.postMessage` are identical, prefer `self`
- **Cannot access `window`**: But can `importScripts()` to load same-origin scripts
- **`importScripts` is synchronous**: Execution continues after loading, no cross-origin support
- **Worker's `console.log`** prints in browser's **Worker Console** (DevTools → Source → Workers panel), not main page console
