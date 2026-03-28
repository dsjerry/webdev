---
title: Web Worker
description: Browser background thread module
---

# Web Worker

Offload heavy computation from the main thread. Keep UI responsive, run complex logic in background.

## Module Contents

- [Overview](./overview) — What is a Worker, why is it needed
- [Basic Usage](./basic) — Create, postMessage, terminate
- [Dedicated vs Shared](./dedicated-vs-shared) — When to use Dedicated / Shared Worker
- [MessageChannel](./message-channel) — Direct communication between two Workers
- [Service Worker](./service-worker) — Network proxy and offline cache
- [Practice: Offload Heavy Computation](./practical) — Fibonacci + large array sorting moved to Worker
