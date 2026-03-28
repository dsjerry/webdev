---
title: WebSocket Overview
description: What is WebSocket, why it makes real-time communication possible
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 4+ · Edge 12+
All modern browsers support it, including mobile.
:::

## Overview

HTTP is a "question-and-answer" pattern: client sends request, server returns response, then connection closes. Want the server to push messages to the browser? Can't do it.

**WebSocket** solves this. After HTTP handshake it upgrades to a persistent bidirectional channel — client and server can send messages at any time, no need to re-establish connection.

In short: Want the server to proactively send messages to the browser? WebSocket is the answer.

## Essential Differences from HTTP

| | HTTP | WebSocket |
|--|------|-----------|
| Connection direction | Client initiates | Both can initiate |
| Who speaks first | Client | Either party |
| Connection lifecycle | Open per request | Maintained after handshake |
| Communication format | Request/response text | Message frames (text or binary) |
| Header overhead | Full headers per request | Almost no headers after handshake |
| Use cases | REST API, file retrieval | Real-time push, collaboration, gaming |

## Quick Start

```js
// Establish connection
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
  console.log('Connection established');
  ws.send('Hello, server');  // Send message
};

ws.onmessage = (e) => {
  console.log('Received:', e.data);  // Received: Hello, server
};

ws.onerror = (e) => {
  console.error('WebSocket error:', e);
};

ws.onclose = () => {
  console.log('Connection closed');
};
```

`wss://` is the encrypted version (equivalent to HTTPS), must use it in production.

## Core Concepts

### URL Format

```
ws://  localhost:8080/chat      # Plain text, not recommended
wss:// example.com/chat         # Encrypted, recommended
```

Path (`/chat`) is determined by server, same semantic as HTTP routing.

### Connection Establishment

```
Client                              Server
  |                                   |
  |--- HTTP GET + Upgrade header ----->|
  |<-- 101 Switching Protocols -------|
  |                                   |
  |========= WebSocket Connection =====|
  |<========= Bidirectional msgs =====|
  |========= Bidirectional msgs =====>|
  |                                   |
  |--- Close frame ------------------->|
  |<-- Close frame -------------------|
```

Server returns `101 Switching Protocols` indicates successful handshake, then enters WebSocket protocol.

### Subprotocol

If multiple logics need to run on the same TCP connection (e.g. chat + game), subprotocol can be negotiated during handshake:

```js
const ws = new WebSocket('wss://example.com', ['graphql-ws', 'mqtt']);
```

Server picks one and returns it in `Sec-WebSocket-Protocol` header, both sides parse message format per agreed subprotocol.

### Heartbeat

TCP itself doesn't sense if peer is alive (e.g. pulling the network cable doesn't immediately trigger TCP error). Heartbeat mechanism needed:

- Client periodically sends a `ping` message, server replies `pong`
- If no message received for a while, connection is considered dead
- WebSocket protocol has no built-in ping/pong, implement it at application layer or use frame types `0x9` / `0xA`

:::tip Browser auto-handles
Browser auto-replies `0xA` (pong) when receiving `0x9` (ping) frame, no manual handling needed.
:::

## Notes

- **Must be HTTPS/WSS**: Modern browsers have strict restrictions on WebSocket in non-secure contexts (except `localhost`)
- **Server needs support too**: WebSocket is a protocol, requires server cooperation (Node.js, Go, Python, etc.)
- **Not needed for all scenarios**: If only need "client polls server", Server-Sent Events (SSE) is simpler
- **Doesn't self-heal**: Browser doesn't auto-reconnect after disconnect, must implement reconnection logic yourself
