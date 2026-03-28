---
title: WebSocket 进阶用法
description: 重连、心跳、二进制数据、子协议、调试 — 让 WebSocket 在生产环境可靠运行
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 4+ · Safari 4+ · Edge 12+
:::

## 自动重连

WebSocket 断开后不会自动重连。以下是一个带指数退避的重连封装：

```js
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.maxRetries = options.maxRetries ?? 10;
    this.baseDelay = options.baseDelay ?? 1000;
    this._connect();
  }

  _connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retryCount = 0;
      if (this.onopen) this.onopen();
    };

    this.ws.onmessage = (e) => {
      if (this.onmessage) this.onmessage(e);
    };

    this.ws.onerror = (e) => {
      if (this.onerror) this.onerror(e);
    };

    this.ws.onclose = (e) => {
      if (this.onclose) this.onclose(e);
      this._scheduleReconnect();
    };
  }

  _scheduleReconnect() {
    if (this.retryCount >= this.maxRetries) return;
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.retryCount),
      30000
    );
    this.retryCount++;
    setTimeout(() => this._connect(), delay);
  }

  send(data) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  close(code = 1000) {
    this.maxRetries = 0;
    this.ws?.close(code);
  }
}
```

## 心跳机制

检测连接是否真正存活：

```js
class HeartbeatWebSocket {
  constructor(url) {
    this.interval = 30000;    // 30s ping interval
    this.timeout = 10000;      // 10s no pong = disconnected
    this._connect();
  }

  _connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this._startHeartbeat();
    };

    this.ws.onmessage = (e) => {
      if (e.data === 'pong') {
        clearTimeout(this._timeoutTimer);
        return;
      }
      if (this.onmessage) this.onmessage(e);
    };

    this.ws.onclose = () => {
      this._stopHeartbeat();
    };
  }

  _startHeartbeat() {
    this._hbTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
        this._timeoutTimer = setTimeout(() => {
          this.ws.close();
        }, this.timeout);
      }
    }, this.interval);
  }

  _stopHeartbeat() {
    clearInterval(this._hbTimer);
    clearTimeout(this._timeoutTimer);
  }

  send(data) {
    this.ws?.readyState === WebSocket.OPEN && this.ws.send(data);
  }
}
```

## 二进制数据

```js
const buffer = new ArrayBuffer(4);
new Uint8Array(buffer).set([0x48, 0x65, 0x6c, 0x6c]); // "Hell"
ws.send(buffer);

ws.onmessage = (e) => {
  if (e.data instanceof ArrayBuffer) {
    const view = new DataView(e.data);
    console.log('ArrayBuffer:', view.getUint32(0));
  } else if (e.data instanceof Blob) {
    e.data.text().then(console.log);
  }
};
```

## 注意事项

- **重连时不要重复 `new WebSocket()`**：等上一个连接彻底关闭（`onclose`）后再建新连接
- **心跳不要用 `send()` 发送字符串**："ping"/"pong" 容易和业务消息混淆
- **不要在 `onclose` 里直接重连**：如果关闭码是 `1000`（正常关闭），不应该重连
- **安全**：永远用 `wss://`，绝对不要在生产环境用 `ws://`
