---
title: Signaling Mechanism
description: How WebRTC finds the other party without knowing their address
outline: [2, 3]
---

:::tip Browser Support
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## Overview

WebRTC itself only handles transport, not "who speaks first". Before two endpoints start exchanging media data, they must agree on media capabilities (SDP offer/answer) and network paths (ICE candidate). This negotiation is called **Signaling**.

## Why is Signaling Needed?

Browser A doesn't know Browser B's IP; Browser B doesn't know Browser A's IP. These two strangers need a "middleman" both can access — the signaling server.

The signaling server forwards two types of messages:
1. **SDP**: My media capabilities (codecs, resolution, whether to include audio...)
2. **ICE Candidate**: Network paths I've found (IP + port + protocol combination)

## SDP Offer / Answer

Standard flow:

```
A (caller)                          B (callee)
   |-- createOffer() -->             |
   |-- setLocalDescription(offer)   |
   |-- send offer SDP --------->    | Receive SDP
                                      |-- setRemoteDescription(offer)
                                      |-- createAnswer()
                                      |-- setLocalDescription(answer)
   |<---- send answer SDP ---------| Receive answer
   |-- setRemoteDescription(answer)|
```

## ICE Candidate Exchange

```js
pc.onicecandidate = ({ candidate }) => {
  if (candidate) {
    ws.send(JSON.stringify(candidate));
  }
};

ws.onmessage = ({ data }) => {
  const candidate = JSON.parse(data);
  pc.addIceCandidate(candidate);
};
```

## Notes

- **Signaling server is not part of WebRTC**: Can use any protocol and backend, even manual copy-paste SDP (for debugging)
- **offer/answer must be paired**: Sent offer must wait for answer, can't send two offers
- **ICE candidate collection has delay**: After `setRemoteDescription`, wait a few seconds to collect enough candidates
- **HTTPS required in production**: STUN/TURN servers also require TLS
```

