# 垃圾回收 (WASM GC)

WebAssembly GC (WASM GC) 是一个提案，旨在为 WebAssembly 添加垃圾回收的内存管理。它使 Kotlin、Dart 和 OCaml 等语言能够编译为高效的 WASM。

## 当前状态

没有 WASM GC，语言必须：

- 使用手动内存管理（Rust）
- 捆绑完整的 GC 运行时（体积大）
- 使用线性内存手动分配（复杂）

## 何时使用 WASM GC

在以下情况使用 WASM GC：

- 将 GC 语言编译为 WASM
- 处理复杂的对象图
- 优先考虑开发者体验
- 移植现有的 JVM/Flutter 代码

## 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| WASM GC | 119+ | 119+ | 实验性 | 119+ |

::: tip
如需要，可通过启用实验性标志后使用 `WebAssembly.validate()` 检查支持。
:::

## 框架支持

### Flutter Web 与 WASM GC

```dart
// Dart/Flutter Web 应用
// 从 WASM GC 获益：
import 'dart:ui' as ui;

// 高效的对象管理
// 比 JS 更小的包体积
// 接近原生的性能
```

---

继续学习 [WASI 标准](./3-wasi)。
