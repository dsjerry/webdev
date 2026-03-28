---
title: WebAssembly Guide
---

# WebAssembly (WASM)

WebAssembly (WASM) is a binary instruction format for a stack-based virtual machine, designed as a portable compilation target for multiple programming languages. It enables high-performance applications to run on the web.

## What You'll Learn

This guide takes you from zero to productive WASM skills:

| Chapter | Topic | Difficulty |
|---------|-------|------------|
| 1 | Getting Started | Beginner |
| 2 | Core Concepts | Intermediate |
| 3 | JavaScript Integration | Intermediate |
| 4 | Advanced Topics | Advanced |

## Why WebAssembly?

- **Near-native performance** — Run code at near-native speed
- **Language-agnostic** — Compile from C, C++, Rust, Go and more
- **Secure by design** — Sandboxed execution environment
- **Universal platform** — Supported in all modern browsers

## Quick Preview

```javascript
// Load and use a WASM module in JavaScript
const response = await fetch('/module.wasm');
const bytes = await response.arrayBuffer();
const { instance } = await WebAssembly.instantiate(bytes);
const result = instance.exports.add(1, 2);
console.log(result); // 3
```

## Chapter Contents

### [Chapter 1: Getting Started](./1-getting-started/1-what-is-wasm)

Learn the basics of WebAssembly and set up your development environment.

### [Chapter 2: Core Concepts](./2-core-concepts/1-memory-model)

Understand core concepts: memory model, types, and call conventions.

### [Chapter 3: JavaScript Integration](./3-integration/1-js-usage)

Learn how to call WASM functions from JavaScript and vice versa.

### [Chapter 4: Advanced Topics](./4-advanced/1-threads)

Explore multi-threading, garbage collection, WASI, and major frameworks.

---

> Ready? [Start with What is WebAssembly](./1-getting-started/1-what-is-wasm)
