---
title: Service Worker vs Worker
description: Clarify the boundaries of three types of Workers, Service Worker is not a regular Web Worker
outline: [2, 3]
---

:::tip Browser Support
Dedicated Worker / SharedWorker: Nearly all browsers

Service Worker: Chrome 40+ · Firefox 44+ · Safari 11.1+ · Edge 79+

Worklet: Chrome 49+ / Safari incomplete support
:::

## Overview

Many people confuse Service Worker with Dedicated/Shared Workers, thinking they're all "background threads". Actually, they solve completely different problems:

- **Dedicated / Shared Worker**: Help main thread share compute load, communicate via `postMessage`
- **Service Worker**: Acts as a proxy between browser and network, intercepts/manages requests via event-driven fetch responses

Service Worker is not a Worker thread; it's a **separate lifecycle running under the registered domain**, more like a script running in the background that can intercept network requests, push notifications, manage caches.

## A Table Explains the Differences

| Feature | Dedicated Worker | Shared Worker | Service Worker |
|---------|-----------------|--------------|----------------|
| Creation | `new Worker(url)` | `new SharedWorker(url, name)` | `navigator.serviceWorker.register(url)` |
| Thread model | Independent thread | Independent thread (shareable across tabs) | Independent thread (event-driven) |
| DOM access | No | No | No |
| Network requests | `fetch` | `fetch` | `fetch` + **Intercept fetch** |
| Cache management | No | No | **Cache API / Cache Storage** |
| Push notifications | No | No | **Push API / Notification API** |
| Lifecycle | `terminate()` / `close()` | `close()` | Install → Activate → Deprecated |
| Offline capability | No | No | **Can implement offline apps** |
| Scope | Own | Same origin | **Has path scope** |
| Communication | `postMessage` | `postMessage` (via port) | **Events (fetch, push, message)** |
| Use case | Compute-intensive tasks | Cross-tab shared state | Network proxy, PWA offline, push |

## When to Use Which?

```
Do you need to intercept network requests?
  ├── No → Do you need cross-tab shared state?
  │         ├── No → Dedicated Worker
  │         └── Yes → Shared Worker (or BroadcastChannel)
  └── Yes → Service Worker (PWA / offline apps / push)
```

## Notes

- **HTTPS required**: Service Worker must run under HTTPS (except localhost)
- **Scope restrictions**: Service Worker's `scope` determines which path requests it can intercept; subpaths are covered, parent paths are not
- **Multiple versions can coexist**: Old version is garbage collected after all pages stop using it
- **`self` in Service Worker is `ServiceWorkerGlobalScope`**: Has `caches`, `fetch`, `clients` APIs not available in Dedicated Worker
- **Service Worker events disappear after exit**: It only lives when events trigger; browser suspends it when idle — this is by design, not a bug
