---
title: RTCPeerConnection
description: The core of WebRTC — establish, manage, and close peer-to-peer connections
outline: [2, 3]
---

:::tip Browser Support
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## Overview

`RTCPeerConnection` is the heart of WebRTC. It represents a logical connection between two endpoints, managing media negotiation, network candidate exchange, and encrypted transmission.

## Quick Start

```js
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
});

pc.onconnectionstatechange = () => {
  console.log('State:', pc.connectionState);
};

pc.onicecandidate = (event) => {
  if (event.candidate) {
    sendToPeer(event.candidate);
  }
};

pc.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};
```

## Media Negotiation

Two endpoints need to exchange SDP (Session Description Protocol):

```js
// === Caller ===
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
sendToPeer({ type: 'offer', sdp: offer.sdp });

// === Callee ===
await pc.setRemoteDescription(offer);
const answer = await pc.createAnswer();
await pc.setLocalDescription(answer);
sendToPeer({ type: 'answer', sdp: answer.sdp });

// === Caller receives answer ===
await pc.setRemoteDescription(answer);
```

## Close Connection

```js
pc.close();
```

:::danger Cannot reuse after close
After `close()` the instance is discarded. To reconnect, create a new `RTCPeerConnection`.
:::

## Notes

- **`iceServers` is required**: Without it, ICE candidates will always be empty and connection can't establish
- **offer/answer is sequential**: One side must `setLocalDescription` before sending; peer receives and `setRemoteDescription` before responding
- **Same track can be reused by multiple `addTrack`**: `RTCRtpSender` can reuse the same track to multiple connections
