---
title: WebSocket Advanced Usage
description: Reconnection, heartbeat, binary data, subprotocols, debugging — make WebSocket production-ready
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 4+ · Edge 12+
:::

## Auto Reconnection

WebSocket doesn't auto-reconnect after disconnect. Here's a reconnection wrapper with exponential backoff:

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

## Heartbeat

Detect if connection is truly alive:

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

## Binary Data

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

## Notes

- **Don't `new WebSocket()` repeatedly for reconnection**: Wait for previous connection to fully close (`onclose`) before creating new one
- **Heartbeat shouldn't use `send()` with strings**: "ping"/"pong" easily confused with business messages
- **Don't reconnect in `onclose` directly**: If close code is `1000` (normal close), shouldn't reconnect
- **Security**: Always use `wss://`, never use `ws://` in production
