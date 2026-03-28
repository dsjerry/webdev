---
title: "IndexedDB Practice: Offline Notes App"
description: Build an offline-capable notes app from scratch with CRUD and local persistence
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
:::

## Overview

This section ties together everything you've learned: open database → define schema → full CRUD flow. Combined with Service Worker for offline capability — even when offline, notes won't be lost.

## Notes

- **Service Worker path**: Must be in site root (or configured via `scope`) to cache all site resources
- **IndexedDB is available in SW**: Service Worker can use IndexedDB, no extra configuration needed
- **Updating SW**: After modifying `sw.js`, need to trigger `skipWaiting` + `clients.claim()` for immediate effect; otherwise must wait for all tabs to close
- **IndexedDB is asynchronous**: UI updates need to wait for `await db.xxx()` to complete before rendering
