# WebDev Learn

使用 VitePress 2.0.0-alpha.17 + Bun 构建的 Web 开发学习网站，支持中英文双语。

## 特性

- **渐进式学习** — 从基础到高级的结构化课程
- **实战示例** — 手把手代码示例和真实项目案例
- **双语支持** — 中英文内容同步
- **现代技术栈** — VitePress + Vue 3
- **个性主题** — 科技感 + 渐变风格

## 技术栈

- **文档框架**: VitePress 2.0.0-alpha.17
- **包管理器**: Bun
- **国际化**: 中/英双语

## 快速开始

```bash
# 安装依赖
bun install

# 开发模式
bun run dev

# 构建生产版本
bun run build

# 预览生产版本
bun run preview
```

## 项目结构

```
docs/
├── .vitepress/
│   ├── config.mts          # VitePress 配置
│   └── theme/             # 自定义主题
│       ├── index.ts
│       └── styles/custom.css
├── index.md               # 英文首页
├── wasm/                  # WebAssembly 模块（英文）
│   ├── 1-getting-started/
│   ├── 2-core-concepts/
│   ├── 3-integration/
│   └── 4-advanced/
└── zh/
    ├── index.md           # 中文首页
    └── wasm/              # WebAssembly 模块（中文）
```

## WASM 模块内容

### 第一章：入门
- 什么是 WebAssembly
- 环境搭建
- 第一个 WASM 模块
- Rust 编写 WASM

### 第二章：核心概念
- 内存模型
- 调用约定
- 导入导出
- 类型系统

### 第三章：JavaScript 集成
- JS 中使用 WASM
- WAT 文本格式
- 性能优化
- 调试技巧

### 第四章：高级应用
- 多线程
- 垃圾回收
- WASI 标准
- 主流框架

## 访问地址

- 英文版: http://localhost:3000/
- 中文版: http://localhost:3000/zh/

## License

MIT
