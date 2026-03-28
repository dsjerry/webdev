---
title: "Web Worker Practice: Offload Heavy Computation"
description: Move Fibonacci + large array sorting to Worker, zero stuttering on main thread
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 3.5+ · Safari 4+ · Edge 12+
This practical example involves `crypto.getRandomValues`.
:::

## Overview

This section ties together everything you've learned: move Fibonacci calculation and large array sorting from main thread to Worker.

Scenario: You're building a data analysis page that needs to calculate Fibonacci #45 (takes ~3-5 seconds) and sort/aggregate 200,000 rows of CSV data simultaneously. If all this runs on main thread, page freezes for 5 seconds — user thinks it's broken.

We solve this with Dedicated Worker.

## Effect Demo

```
After clicking "Run Computation":

Main thread immediately responds — button turns gray Disabled
Main thread not stuttering — can scroll, click other buttons

Worker silently computes in background for 5 seconds

After completion, main thread receives result, updates UI
"✓ Done, result: 1134903170, took 3ms"
```

## Notes

- **Transferable is key**: Pass `arr.buffer` as second argument to `postMessage` — data is "transferred" not "cloned", main thread immediately releases that memory, no stuttering
- **fibonacci uses matrix exponentiation** not recursion: Recursive version O(2^n), matrix exponentiation O(log n), even #1000 computes instantly
- **Worker has no DOM**: Don't try to manipulate `document` inside Worker; all results must `postMessage` back to main thread
- **Worker errors don't crash main thread**: Worker errors can be caught with `worker.onerror`, main thread keeps running
