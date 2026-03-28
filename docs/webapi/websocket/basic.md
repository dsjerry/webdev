---
title: WebSocket 基础用法
description: 连接、发送、接收、关闭 — WebSocket 的四个核心操作
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 4+ · Safari 4+ · Edge 12+
:::

## 创建连接

`WebSocket` 构造函数接收两个参数：

```js
const ws = new WebSocket(url, [protocols]);
```

| 参数 | 类型 | 说明 |
|------|------|------|
| `url` | string | WebSocket 服务器地址，必须是 `ws://` 或 `wss://` |
| `protocols` | string \| string[] | 可选，子协议名称 |

## 生命周期事件

WebSocket 有四个核心事件：

```js
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
  // 握手成功，连接已建立，可以发消息了
};

ws.onmessage = (event) => {
  const data = event.data;
  console.log('收到:', data);
};

ws.onerror = (event) => {
  console.error('WebSocket 出错了');
};

ws.onclose = (event) => {
  console.log('关闭码:', event.code);
  console.log('原因:', event.reason);
};
```

### readyState

| 值 | 常量 | 含义 |
|----|------|------|
| 0 | `CONNECTING` | 正在连接 |
| 1 | `OPEN` | 已连接，可以发消息 |
| 2 | `CLOSING` | 正在关闭 |
| 3 | `CLOSED` | 已关闭 |

## 发送消息

```js
ws.send('Hello');
ws.send(JSON.stringify({ type: 'message', content: '你好' }));

const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);
view.setFloat32(0, 3.14);
ws.send(buffer);
```

## 关闭连接

```js
ws.close(1000, 'Done');
```

## 注意事项

- **发送大消息**：WebSocket 对单条消息大小没有硬性限制，但过大消息（>1MB）建议分段发送
- **UTF-8 编码**：字符串默认按 UTF-8 编码，二进制数据不要用字符串发送（会触发编码转换）
- **浏览器不会自动重连**：关闭后如果需要恢复连接，必须自己重新 `new WebSocket()`
