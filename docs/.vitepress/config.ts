import { defineConfig } from "vitepress"

// =============================================
// 中文导航配置（默认语言，根路径）
// =============================================
const zhNav = [
    { text: "WebAssembly", link: "/wasm/" },
    {
        text: "WebAPI",
        items: [
            { text: "Web Audio API", link: "/webapi/webaudio/" },
            { text: "IndexedDB", link: "/webapi/indexeddb/" },
            { text: "WebSocket", link: "/webapi/websocket/" },
            { text: "WebRTC", link: "/webapi/webrtc/" },
            { text: "Web Worker", link: "/webapi/webworker/" },
        ],
    },
]

// 中文侧边栏配置
const zhSidebar: Record<string, any[]> = {
    "/wasm/": [
        {
            text: "入门",
            items: [
                {
                    text: "什么是 WebAssembly",
                    link: "/wasm/1-getting-started/1-what-is-wasm",
                },
                {
                    text: "环境搭建",
                    link: "/wasm/1-getting-started/2-setup-env",
                },
                {
                    text: "第一个 WASM 模块",
                    link: "/wasm/1-getting-started/3-first-module",
                },
                {
                    text: "Rust 编写 WASM",
                    link: "/wasm/1-getting-started/4-rust-wasm",
                },
            ],
        },
        {
            text: "核心概念",
            items: [
                {
                    text: "内存模型",
                    link: "/wasm/2-core-concepts/1-memory-model",
                },
                {
                    text: "调用约定",
                    link: "/wasm/2-core-concepts/2-call-convention",
                },
                {
                    text: "导入导出",
                    link: "/wasm/2-core-concepts/3-import-export",
                },
                { text: "类型系统", link: "/wasm/2-core-concepts/4-types" },
            ],
        },
        {
            text: "JavaScript 集成",
            items: [
                {
                    text: "JS 中使用 WASM",
                    link: "/wasm/3-integration/1-js-usage",
                },
                { text: "WAT 文本格式", link: "/wasm/3-integration/2-wat" },
                {
                    text: "性能优化",
                    link: "/wasm/3-integration/3-performance",
                },
                {
                    text: "调试技巧",
                    link: "/wasm/3-integration/4-debugging",
                },
            ],
        },
        {
            text: "高级应用",
            items: [
                { text: "多线程", link: "/wasm/4-advanced/1-threads" },
                { text: "垃圾回收", link: "/wasm/4-advanced/2-gc" },
                { text: "WASI 标准", link: "/wasm/4-advanced/3-wasi" },
                { text: "主流框架", link: "/wasm/4-advanced/4-frameworks" },
            ],
        },
    ],

    "/webapi/": [
        {
            text: "Web Audio API",
            items: [
                { text: "概述", link: "/webapi/webaudio/" },
                { text: "基础用法", link: "/webapi/webaudio/basic" },
                { text: "进阶用法", link: "/webapi/webaudio/advanced" },
                { text: "实战案例", link: "/webapi/webaudio/practical" },
            ],
        },
        {
            text: "IndexedDB",
            items: [
                { text: "概述", link: "/webapi/indexeddb/" },
                { text: "基础用法", link: "/webapi/indexeddb/basic" },
                { text: "进阶用法", link: "/webapi/indexeddb/advanced" },
                { text: "实战案例", link: "/webapi/indexeddb/practical" },
            ],
        },
        {
            text: "WebSocket",
            items: [
                { text: "概述", link: "/webapi/websocket/" },
                { text: "基础用法", link: "/webapi/websocket/basic" },
                { text: "进阶用法", link: "/webapi/websocket/advanced" },
                { text: "实战案例", link: "/webapi/websocket/practical" },
            ],
        },
        {
            text: "WebRTC",
            items: [
                { text: "概述", link: "/webapi/webrtc/" },
                {
                    text: "RTCPeerConnection",
                    link: "/webapi/webrtc/peer-connection",
                },
                { text: "信令机制", link: "/webapi/webrtc/signaling" },
                {
                    text: "RTCDataChannel",
                    link: "/webapi/webrtc/data-channel",
                },
                { text: "媒体流处理", link: "/webapi/webrtc/media" },
                { text: "实战：P2P 通话", link: "/webapi/webrtc/practical" },
            ],
        },
        {
            text: "Web Worker",
            items: [
                { text: "概述", link: "/webapi/webworker/" },
                { text: "基础用法", link: "/webapi/webworker/basic" },
                {
                    text: "专用 vs 共享",
                    link: "/webapi/webworker/dedicated-vs-shared",
                },
                {
                    text: "MessageChannel",
                    link: "/webapi/webworker/message-channel",
                },
                {
                    text: "Service Worker",
                    link: "/webapi/webworker/service-worker",
                },
                { text: "实战案例", link: "/webapi/webworker/practical" },
            ],
        },
    ],
}

// =============================================
// 英文导航配置（/en/ 路径）
// =============================================
const enNav = [
    { text: "WebAssembly", link: "/en/wasm/" },
    {
        text: "WebAPI",
        items: [
            { text: "Web Audio API", link: "/en/webapi/webaudio/" },
            { text: "IndexedDB", link: "/en/webapi/indexeddb/" },
            { text: "WebSocket", link: "/en/webapi/websocket/" },
            { text: "WebRTC", link: "/en/webapi/webrtc/" },
            { text: "Web Worker", link: "/en/webapi/webworker/" },
        ],
    },
    { text: "Community", link: "https://webassembly.org/" },
    { text: "GitHub", link: "https://github.com/WebAssembly/spec" },
]

// 英文侧边栏配置
const enSidebar: Record<string, any[]> = {
    "/en/wasm/": [
        {
            text: "Getting Started",
            items: [
                {
                    text: "What is WebAssembly",
                    link: "/en/wasm/1-getting-started/1-what-is-wasm",
                },
                {
                    text: "Environment Setup",
                    link: "/en/wasm/1-getting-started/2-setup-env",
                },
                {
                    text: "First WASM Module",
                    link: "/en/wasm/1-getting-started/3-first-module",
                },
                {
                    text: "Rust to WASM",
                    link: "/en/wasm/1-getting-started/4-rust-wasm",
                },
            ],
        },
        {
            text: "Core Concepts",
            items: [
                {
                    text: "Memory Model",
                    link: "/en/wasm/2-core-concepts/1-memory-model",
                },
                {
                    text: "Call Convention",
                    link: "/en/wasm/2-core-concepts/2-call-convention",
                },
                {
                    text: "Import & Export",
                    link: "/en/wasm/2-core-concepts/3-import-export",
                },
                {
                    text: "Type System",
                    link: "/en/wasm/2-core-concepts/4-types",
                },
            ],
        },
        {
            text: "JavaScript Integration",
            items: [
                {
                    text: "Using WASM in JS",
                    link: "/en/wasm/3-integration/1-js-usage",
                },
                {
                    text: "WAT Text Format",
                    link: "/en/wasm/3-integration/2-wat",
                },
                {
                    text: "Performance Tips",
                    link: "/en/wasm/3-integration/3-performance",
                },
                {
                    text: "Debugging",
                    link: "/en/wasm/3-integration/4-debugging",
                },
            ],
        },
        {
            text: "Advanced Topics",
            items: [
                {
                    text: "Multi-threading",
                    link: "/en/wasm/4-advanced/1-threads",
                },
                {
                    text: "Garbage Collection",
                    link: "/en/wasm/4-advanced/2-gc",
                },
                { text: "WASI Standard", link: "/en/wasm/4-advanced/3-wasi" },
                {
                    text: "Frameworks",
                    link: "/en/wasm/4-advanced/4-frameworks",
                },
            ],
        },
    ],

    "/en/webapi/": [
        {
            text: "Web Audio API",
            items: [
                { text: "Overview", link: "/en/webapi/webaudio/" },
                { text: "Basic Usage", link: "/en/webapi/webaudio/basic" },
                { text: "Advanced", link: "/en/webapi/webaudio/advanced" },
                { text: "Practice", link: "/en/webapi/webaudio/practical" },
            ],
        },
        {
            text: "IndexedDB",
            items: [
                { text: "Overview", link: "/en/webapi/indexeddb/" },
                { text: "Basic Usage", link: "/en/webapi/indexeddb/basic" },
                { text: "Advanced", link: "/en/webapi/indexeddb/advanced" },
                { text: "Practice", link: "/en/webapi/indexeddb/practical" },
            ],
        },
        {
            text: "WebSocket",
            items: [
                { text: "Overview", link: "/en/webapi/websocket/" },
                { text: "Basic Usage", link: "/en/webapi/websocket/basic" },
                { text: "Advanced", link: "/en/webapi/websocket/advanced" },
                { text: "Practice", link: "/en/webapi/websocket/practical" },
            ],
        },
        {
            text: "WebRTC",
            items: [
                { text: "Overview", link: "/en/webapi/webrtc/" },
                {
                    text: "PeerConnection",
                    link: "/en/webapi/webrtc/peer-connection",
                },
                { text: "Signaling", link: "/en/webapi/webrtc/signaling" },
                { text: "DataChannel", link: "/en/webapi/webrtc/data-channel" },
                { text: "Media Stream", link: "/en/webapi/webrtc/media" },
                { text: "Practice", link: "/en/webapi/webrtc/practical" },
            ],
        },
        {
            text: "Web Worker",
            items: [
                { text: "Overview", link: "/en/webapi/webworker/" },
                { text: "Basic Usage", link: "/en/webapi/webworker/basic" },
                {
                    text: "Dedicated vs Shared",
                    link: "/en/webapi/webworker/dedicated-vs-shared",
                },
                {
                    text: "MessageChannel",
                    link: "/en/webapi/webworker/message-channel",
                },
                {
                    text: "Service Worker",
                    link: "/en/webapi/webworker/service-worker",
                },
                { text: "Practice", link: "/en/webapi/webworker/practical" },
            ],
        },
    ],
}

export default defineConfig({
    title: "WebDev Learn",
    description: "From zero to mastery in web development",

    themeConfig: {
        logo: "/logo.svg",
        search: {
            provider: "local",
            options: {
                detailedView: true,
            },
        },
        nav: zhNav,
        sidebar: zhSidebar,
        outline: {
            level: [2, 3],
            label: "页面导航",
        },
        footer: {
            message: "基于 MIT 协议发布",
            copyright: "版权所有 © 2024-present WebDev Learn",
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/dsjerry/webdev" },
        ],
        editLink: {
            pattern:
                "https://github.com/dsjerry/webdev/edit/main/docs/:path",
            text: "在 GitHub 上编辑此页",
        },
        docFooter: {
            prev: "上一页",
            next: "下一页",
        },
    },

    locales: {
        root: {
            lang: "zh-CN",
            label: "简体中文",
            link: "/",
            themeConfig: {
                nav: zhNav,
                sidebar: zhSidebar,
                outline: {
                    level: [2, 3],
                    label: "页面导航",
                },
                footer: {
                    message: "基于 MIT 协议发布",
                    copyright: "版权所有 © 2024-present WebDev Learn",
                },
                socialLinks: [
                    { icon: "github", link: "https://github.com/dsjerry/webdev" },
                ],
                editLink: {
                    pattern:
                        "https://github.com/dsjerry/webdev/edit/main/docs/:path",
                    text: "在 GitHub 上编辑此页",
                },
                docFooter: {
                    prev: "上一页",
                    next: "下一页",
                },
            },
        },
        en: {
            lang: "en-US",
            label: "English",
            link: "/en/",
            themeConfig: {
                nav: enNav,
                sidebar: enSidebar,
                outline: {
                    level: [2, 3],
                    label: "On This Page",
                },
                footer: {
                    message: "Released under the MIT License.",
                    copyright: "Copyright © 2024-present WebDev Learn",
                },
                socialLinks: [
                    { icon: "github", link: "https://github.com/dsjerry/webdev" },
                ],
                editLink: {
                    pattern:
                        "https://github.com/dsjerry/webdev/edit/main/docs/:path",
                    text: "Edit this page on GitHub",
                },
                docFooter: {
                    prev: "Previous Page",
                    next: "Next Page",
                },
            },
        },
    },

    markdown: {
        lineNumbers: true,
        theme: {
            light: "github-light",
            dark: "github-dark",
        },
    },

    head: [
        ["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
        ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ],
})
