---
title: Web Audio API Basic Usage
description: Create context, load audio, playback control — core operations of Web Audio API
outline: [2, 3]
---

:::tip Browser Support
Chrome 35+ · Firefox 25+ · Safari 14.1+ · Edge 79+
:::

## Create AudioContext

All audio operations start here:

```js
// Modern browsers (new spec)
const ctx = new AudioContext();

// Old Safari (WebKit prefix)
const ctx = new (window.AudioContext || window.webkitAudioContext)();
```

:::warning User gesture restriction
Chrome/Edge and other modern browsers require AudioContext to be created inside a user interaction callback. If created at the wrong time, the browser auto-sets its state to `suspended`; call `ctx.resume()` to make it work.
:::

## Play an Audio File

Full flow: Load → Decode → Create source node → Connect → Play:

```js
async function playAudio(ctx, url) {
  // 1. Load audio file
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  // 2. Decode to AudioBuffer
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

  // 3. Create source node
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  // 4. Connect: source → destination (speakers)
  source.connect(ctx.destination);

  // 5. Play
  source.start(0);  // Parameter is start time (seconds), 0 = immediate

  return source;
}

button.onclick = async () => {
  const ctx = new AudioContext();
  await playAudio(ctx, '/music.mp3');
};
```

## OscillatorNode (Synthesize Sound)

OscillatorNode doesn't load files, it generates waveforms directly:

```js
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

// Set waveform type and frequency
osc.type = 'sine';                        // 'sine' | 'square' | 'sawtooth' | 'triangle'
osc.frequency.setValueAtTime(440, ctx.currentTime); // 440 Hz = A4

// Set volume
gain.gain.setValueAtTime(0, ctx.currentTime);

// Connect
osc.connect(gain);
gain.connect(ctx.destination);

// Play
osc.start();

// Fade volume from 0 to 0.5 over 1 second (avoid pops)
gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1);

// Stop after 2 seconds
osc.stop(ctx.currentTime + 2);
```

### Waveform Type Comparison

| Type | Sound character | Spectrum |
|------|----------------|----------|
| `sine` | Pure, smooth | Fundamental only |
| `triangle` | Soft, light | Fundamental + odd harmonics |
| `sawtooth` | Bright, harsh | All harmonics |
| `square` | Thick, cartoonish | All harmonics (odd more prominent) |

## Playback Control

### Pause and Resume

```js
// Pause (suspend)
await ctx.suspend();

// Resume
await ctx.resume();

// Get current time
console.log('Current position:', ctx.currentTime, 'seconds');
```

### Seek by Playback Progress

`AudioBufferSourceNode` accepts `offset` and `duration`:

```js
const source = ctx.createBufferSource();
source.buffer = audioBuffer;
source.connect(ctx.destination);

// Start at 3 seconds, stop after 5 seconds
source.start(0, 3, 5);
```

### Volume Control

```js
const gain = ctx.createGain();

// Set volume immediately (0 ~ 1)
gain.gain.setValueAtTime(0.5, ctx.currentTime);

// Linearly ramp to 0 over 1 second
gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);

// Exponential decay to 0.001 (good for fade out)
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
```

## Microphone Input

Combine with `getUserMedia` to route microphone into the audio node graph:

```js
async function micInput(ctx) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = ctx.createMediaStreamSource(stream);
  // Microphone → gain node → output (hear your own delayed voice)
  const gain = ctx.createGain();
  gain.gain.value = 0.5;
  source.connect(gain).connect(ctx.destination);
}
```

Microphone input can connect directly to `MediaRecorder` for recording, or to effect processing nodes.

## Autoplay Restrictions with MP3

Browsers have autoplay policy restrictions: audio with sound cannot autoplay without user interaction. Silent audio files (like music without sound) are not affected.

```js
button.onclick = async () => {
  // Create context after user click
  const ctx = new AudioContext();
  await ctx.resume();  // Ensure not suspended
  await playAudio(ctx, '/bg-music.mp3');
};
```

## Notes

- **`start()` can only be called once**: `AudioBufferSourceNode` cannot restart after playback ends; create a new node
- **`ctx.destination` is the final output node**: Any audio must connect to it to produce sound
- **`ctx.currentTime` is audio context time**, not wall clock, not affected by `ctx.suspend()` / `ctx.resume()`
- **OscillatorNode cannot restart after stop**: Create a new node
