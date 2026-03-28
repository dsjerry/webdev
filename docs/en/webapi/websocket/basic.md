---
title: WebSocket Basic Usage
description: Connect, send, receive, close — the four core operations of WebSocket
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 4+ · Edge 12+
:::

## Create Connection

`WebSocket` constructor takes two arguments:

```js
const ws = new WebSocket(url, [protocols]);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | WebSocket server address, must be `ws://` or `wss://` |
| `protocols` | string \| string[] | Optional, subprotocol name |

## Lifecycle Events

WebSocket has four core events:

```js
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
  // Handshake successful, connection established, can send messages now
};

ws.onmessage = (event) => {
  const data = event.data;
  console.log('Received:', data);
};

ws.onerror = (event) => {
  console.error('WebSocket error');
};

ws.onclose = (event) => {
  console.log('Close code:', event.code);
  console.log('Reason:', event.reason);
};
```

### readyState

| Value | Constant | Meaning |
|-------|----------|---------|
| 0 | `CONNECTING` | Connecting |
| 1 | `OPEN` | Connected, can send messages |
| 2 | `CLOSING` | Closing |
| 3 | `CLOSED` | Closed |

## Send Messages

```js
ws.send('Hello');
ws.send(JSON.stringify({ type: 'message', content: 'Hello' }));

const buffer = new ArrayBuffer(8);
const view = new DataView(buffer);
view.setFloat32(0, 3.14);
ws.send(buffer);
```

## Close Connection

```js
ws.close(1000, 'Done');
```

## Notes

- **Sending large messages**: WebSocket has no hard limit on single message size, but messages >1MB should be sent in chunks
- **UTF-8 encoding**: Strings are encoded as UTF-8 by default; don't send binary data as strings (triggers encoding conversion)
- **Browser doesn't auto-reconnect**: If you need to recover after close, you must manually `new WebSocket()` again
