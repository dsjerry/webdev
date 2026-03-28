---
title: WebAssembly 指南
---

# WebAssembly (WASM)

<vp-badge type="info" text="Web 开发" />

WebAssembly（简称 WASM）是一种二进制指令格式，用于基于栈的虚拟机的可移植编译目标。它使高性能应用能够在网页上运行。

## 你将学到什么

本指南带你从零基础到掌握 WASM 实用技能：

| 章节 | 主题 | 难度 |
|------|------|------|
| 1 | 入门 | 初级 |
| 2 | 核心概念 | 中级 |
| 3 | JavaScript 集成 | 中级 |
| 4 | 高级应用 | 高级 |

## 为什么选择 WebAssembly？

- **接近原生的性能** —— 以接近原生的速度运行代码
- **语言无关** —— 可从 C、C++、Rust、Go 等多种语言编译
- **安全设计** —— 沙箱执行环境
- **通用平台** —— 支持所有现代浏览器

## 快速预览

```javascript
// 在 JavaScript 中加载和使用 WASM 模块
const response = await fetch('/module.wasm');
const bytes = await response.arrayBuffer();
const { instance } = await WebAssembly.instantiate(bytes);
const result = instance.exports.add(1, 2);
console.log(result); // 3
```

## 章节内容

### [第一章：入门](./1-getting-started/1-what-is-wasm)

了解 WebAssembly 的基础知识并搭建开发环境。

### [第二章：核心概念](./2-core-concepts/1-memory-model)

理解核心概念：内存模型、类型和调用约定。

### [第三章：JavaScript 集成](./3-integration/1-js-usage)

学习如何在 JavaScript 中调用 WASM 函数，反之亦然。

### [第四章：高级应用](./4-advanced/1-threads)

探索多线程、垃圾回收、WASI 和主流框架。

---

> 准备好了吗？[从什么是 WebAssembly 开始](./1-getting-started/1-what-is-wasm)
