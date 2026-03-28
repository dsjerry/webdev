# Garbage Collection (WASM GC)

WebAssembly GC (WASM GC) is a proposal to add garbage-collected memory management to WebAssembly. It enables languages like Kotlin, Dart, and OCaml to compile to efficient WASM.

## Current State

Without WASM GC, languages must:
- Use manual memory management (Rust)
- Bundle a full GC runtime (large binary size)
- Use linear memory with manual allocation (complex)

## When to Use WASM GC

Use WASM GC when:
- Compiling GC languages to WASM
- Handling complex object graphs
- Prioritizing developer experience
- Porting existing JVM/Flutter code

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WASM GC | 119+ | 119+ | Experimental | 119+ |

::: tip
Enable experimental flags if needed, check support with `WebAssembly.validate()`.
:::

## Framework Support

### Flutter Web with WASM GC

```dart
// Dart/Flutter Web app
// Benefits from WASM GC:
import 'dart:ui' as ui;

// Efficient object management
// Smaller bundle size than JS
// Near-native performance
```

---

Continue learning [WASI Standard](./3-wasi).
