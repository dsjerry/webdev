---
title: "Web Audio API Practice: Audio Visualization Music Player"
description: Build a complete music player with spectrum visualization, playback control, and volume adjustment from scratch
outline: [2, 3]
---

:::tip Browser Support
Chrome 35+ · Firefox 25+ · Safari 14.1+ · Edge 79+

**Note**: Audio playback requires user interaction and HTTPS environment.
:::

## Overview

This section ties together everything you've learned: load audio → connect nodes → AnalyserNode spectrum analysis → Canvas rendering. About 250 lines of code for a complete music player.

## Architecture

```
[AudioBufferSourceNode] → [AnalyserNode] → [GainNode] → [destination]
         ↓                         ↓
    Play/Pause/Seek       getByteFrequencyData()
                                   ↓
                          [Canvas frequency bars]
```

## Key Implementation Details

### Spectrum Drawing

The key is the array returned by `AnalyserNode.getByteFrequencyData()`:

```js
const freqData = new Uint8Array(analyser.frequencyBinCount); // 128 frequency bands
analyser.getByteFrequencyData(freqData);
// freqData[i] value 0~255 corresponds to energy of the i-th frequency band
```

Each bar's height is directly mapped from `value / 255` to canvas height, color transitions from warm to cool (low frequencies reddish, high frequencies blue-purple).

### Progress Sync

Use `AudioContext.currentTime` for playback progress, not `setInterval`:

```js
// Record offset when playback starts
this.startTime = this.ctx.currentTime - offset;

// Can accurately get current position at any time
const currentTime = this.ctx.currentTime - this.startTime;
```

## Notes

- **Select a local audio file**: Click "Select local audio file" button, choose MP3, WAV, OGG or other audio formats
- **Canvas HiDPI adaptation**: Use `devicePixelRatio` multiplied by actual pixels for `canvas.width`, ensures clarity on Retina screens
- **Auto-stop after playback ends**: Detect playback end via `source.onended` event, update UI state
- **FFT size affects resolution**: `fftSize = 256` produces 128 frequency bands. For finer visualization, change to 2048 (produces 1024 bands, but higher performance cost)
