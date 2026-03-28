---
title: Media Stream Processing
description: getUserMedia usage, MediaStream track management, constraints tuning
outline: [2, 3]
---

:::tip Browser Support
Chrome 56+ · Firefox 44+ · Safari 11+ · Edge 79+
:::

## Overview

`getUserMedia` is the entry point for WebRTC — it asks the browser for camera and microphone permissions, returning a `MediaStream`. This stream can be directly consumed by `video`/`audio` elements, or added to `RTCPeerConnection` to send to the peer.

## Quick Start

```html
<video id="local" autoplay muted></video>
<audio id="remote" autoplay></audio>

<script type="module">
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  localVideo.srcObject = stream;
</script>
```

:::warning Note
The `muted` attribute on local `video` prevents echo (your own voice from speakers gets picked up by microphone again). Remote audio does not need `muted`.
:::

## MediaStream Structure

A `MediaStream` contains multiple `MediaStreamTrack`s:

```js
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

stream.getVideoTracks(); // [MediaStreamTrack]
stream.getAudioTracks(); // [MediaStreamTrack]
stream.getTracks();      // All tracks
```

Each `MediaStreamTrack` can be independently enabled/disabled:

```js
videoTrack.enabled = false; // Pause camera (black screen but not released)
videoTrack.stop();          // Completely release camera
```

## Constraints

```js
await navigator.mediaDevices.getUserMedia({
  video: {
    width:  { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720,  max: 1080 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: 'user',   // Front camera
    // facingMode: 'environment', // Back camera
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
});
```

:::tip
`ideal` is the target value, `min`/`max` are hard boundaries. Browser tries to approach `ideal` while satisfying constraints.
:::

## Notes

- **HTTPS required**: Apart from `localhost` and `file://`, `getUserMedia` throws `NotAllowedError` under non-HTTPS
- **Permission prompt only shows once**: If user denies, subsequent calls keep denying; need to guide user to manually enable in browser settings
- **Device labels empty before permission**: `enumerateDevices` returns empty `label` strings before authorization; must call `getUserMedia` once for authorization first to see device names
- **Tab switch pauses media stream**: Browser automatically lowers frame rate to save resources
