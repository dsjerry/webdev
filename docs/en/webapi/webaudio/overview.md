---
title: Web Audio API Overview
description: What is Web Audio API and why it's the preferred solution for browser audio processing
outline: [2, 3]
---

:::tip Browser Support
Chrome 35+ · Firefox 25+ · Safari 14.1+ · Edge 79+
All modern browsers support it, including mobile.
:::

## Overview

Browsers natively support two audio APIs: the `Audio` element (`<audio>`) is great for playing files, while **Web Audio API** is a complete **audio signal processing engine**.

Web Audio API works on an "Audio Node Graph": route audio signal through a series of processing nodes (GainNode for gain, AnalyserNode for analysis, BiquadFilterNode for filtering), then output to speakers. This node-graph approach lets you build arbitrarily complex audio processing chains like assembling building blocks.

In short: Want audio visualization, effects processing, synthesizers, DJ apps? Web Audio API is built for exactly that.

## Difference from `<audio>` Element

| | `<audio>` | Web Audio API |
|--|----------|---------------|
| Control granularity | Play/pause/seek only | Sample-accurate processing |
| Real-time processing | No | Yes (delay, reverb, filtering in real time) |
| Audio analysis | No | Yes (AnalyserNode for frequency spectrum) |
| Multi-track mixing | Hard | Natural (node graph connections) |
| Use cases | Background music, video audio | Effects, music production, voice processing |

## Core Concepts

### AudioContext

The entry point for all audio operations, similar to Canvas's `getContext('2d')`:

```js
// Create audio context (requires user interaction in newer browsers)
const ctx = new AudioContext();
```

:::warning User gesture restriction
Chrome requires `AudioContext` to be created inside a user interaction (like click) callback, otherwise it will be auto-suspended.
:::

### AudioNode

AudioNode is the basic unit of audio processing, in three categories:

| Type | Examples | Role |
|------|---------|------|
| Source nodes | `OscillatorNode`, `AudioBufferSourceNode` | Generate audio signals |
| Processing nodes | `GainNode`, `BiquadFilterNode`, `ConvolverNode` | Modify signals |
| Output nodes | `AudioDestinationNode` (speakers) | Final output |

### Audio Node Graph

```
[Source] → [Processing Node A] → [Processing Node B] → ... → [Output]
```

```js
const ctx = new AudioContext();

// Create nodes
const osc = ctx.createOscillator();   // Oscillator (generates sound)
const gain = ctx.createGain();         // Gain (volume control)

// Connect: osc → gain → speakers
osc.connect(gain);
gain.connect(ctx.destination);

osc.start();  // Start playback
gain.gain.setValueAtTime(0, ctx.currentTime);  // Mute
```

## Quick Start

```js
// Must be inside a user interaction event (triggered by clicking a button)
button.onclick = () => {
  const ctx = new AudioContext();

  // Create oscillator (square wave, 440Hz = A4 note)
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(440, ctx.currentTime);

  // Create gain node (volume control)
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, ctx.currentTime); // 30% volume

  // Connect and play
  osc.connect(gain).connect(ctx.destination);
  osc.start();

  // Auto stop after 1 second
  osc.stop(ctx.currentTime + 1);
};
```

## Common Nodes

| Node | Purpose |
|------|---------|
| `OscillatorNode` | Synthesize waveforms (sine, square, sawtooth, triangle) |
| `AudioBufferSourceNode` | Play pre-loaded audio files |
| `GainNode` | Volume/gain control |
| `BiquadFilterNode` | Low-pass, high-pass, band-pass filtering |
| `DelayNode` | Delay effects |
| `ConvolverNode` | Convolution reverb |
| `AnalyserNode` | Frequency/waveform analysis (for visualization) |
| `MediaStreamSource` | Microphone input |
| `MediaRecorder` | Record audio to file |

## Notes

- **User gesture restriction**: AudioContext is auto-suspended in new browsers, call `ctx.resume()` after user interaction
- **Nodes can connect to multiple destinations**: A single `AudioBufferSourceNode` can connect to multiple target nodes simultaneously
- **Audio files need decoding first**: Use `ctx.decodeAudioData(arrayBuffer)` to convert MP3/WAV to AudioBuffer before playing
- **Nodes cannot be reused**: Each node's parameters cannot be reset after creation; create a new node
