# What is WebAssembly?

WebAssembly (WASM) is a compact binary instruction format designed as a portable compilation target for programming languages. It enables high-performance applications to run on the web.

## Core Features

| Feature | Description |
|---------|-------------|
| **Binary format** | Efficient binary-encoded code |
| **Stack machine** | Push/pop based architecture |
| **Type safety** | Strong type system, only four value types |
| **Memory model** | Dynamically growable linear memory |
| **Sandboxed** | Isolated execution environment |

## How It Works

WASM's simple example:

```wat
;; WAT (WebAssembly Text Format) — human-readable representation
(module
  (func $add (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add)
  (export "add" (func $add)))
```

From JavaScript:

```javascript
// Exported functions can be called directly
const result = instance.exports.add(40, 2);
console.log(result); // 42
```

## WebAssembly vs JavaScript

| Aspect | JavaScript | WebAssembly |
|--------|------------|-------------|
| Format | Text | Binary |
| Parse speed | Slower | Faster |
| Execution | JIT compiled | Direct execution |
| Type system | Dynamic | Static |
| GC support | Built-in | Limited |
| DOM access | Direct | Via JS interop |

## When to Use WASM

Use WebAssembly in these scenarios:

- **Performance-critical code** — Image/video processing, game engines, codecs
- **Port existing codebases** — Reuse C/C++/Rust libraries in Web
- **Compute-intensive tasks** — Scientific computing, encryption, compression
- **Near-native performance** — Signal processing, physics simulation

::: tip
WebAssembly doesn't replace JavaScript — it's a complement to JavaScript. Use WASM for compute-intensive tasks while keeping JavaScript for DOM manipulation and business logic.
:::

## Browser Support

All modern browsers support WebAssembly:

| Browser | Supported From |
|---------|---------------|
| Chrome | 57+ |
| Firefox | 52+ |
| Safari | 11+ |
| Edge | 16+ |

## What's Next

Now that you know what WebAssembly is, let's [set up the development environment](./2-setup-env).
