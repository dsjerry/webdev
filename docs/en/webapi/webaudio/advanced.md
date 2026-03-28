---
title: Web Audio API Advanced Usage
description: Effects, spectrum analysis, recording, MIDI — make Web Audio API production-ready
outline: [2, 3]
---

:::tip Browser Support
Chrome 35+ · Firefox 25+ · Safari 14.1+ · Edge 79+
:::

## Spectrum Analysis (AnalyserNode)

AnalyserNode provides real-time frequency/time-domain data for visualization:

```js
const ctx = new AudioContext();
const analyser = ctx.createAnalyser();

// Configuration
analyser.fftSize = 2048;        // FFT window size (larger = higher frequency resolution)
analyser.smoothingTimeConstant = 0.8; // Smoothing factor 0~1, 1 = smoothest

// Connect: source → analyser → speakers
source.connect(analyser);
analyser.connect(ctx.destination);

// Get frequency data (Uint8Array, length = fftSize / 2)
const frequencyData = new Uint8Array(analyser.frequencyBinCount); // 1024

function draw() {
  analyser.getByteFrequencyData(frequencyData);
  // frequencyData[i] value range 0~255, corresponds to frequency i * (sampleRate / fftSize) Hz
  requestAnimationFrame(draw);
}
draw();
```

### Time-domain Waveform Data

```js
const timeData = new Uint8Array(analyser.fftSize);
analyser.getByteTimeDomainData(timeData); // Time-domain waveform (0~255, 128 is silent baseline)
```

## Filter (BiquadFilterNode)

BiquadFilterNode implements common audio filters:

```js
const filter = ctx.createBiquadFilter();

// Filter type
filter.type = 'lowpass';   // Low-pass: keep low frequencies, attenuate highs
filter.type = 'highpass';  // High-pass: keep high frequencies, attenuate lows
filter.type = 'bandpass';  // Band-pass: keep only a certain frequency band
filter.type = 'notch';     // Notch: cut out a certain frequency band
filter.type = 'peaking';   // Peaking: boost/cut a certain frequency band

// Center frequency (Hz)
filter.frequency.setValueAtTime(1000, ctx.currentTime);

// Q value (quality factor, controls bandwidth. Higher Q = narrower band)
filter.Q.setValueAtTime(1, ctx.currentTime);

// Gain (for peaking type only, in dB)
filter.gain.setValueAtTime(6, ctx.currentTime);
```

### Equalizer Example (Three-band)

```js
function createEQ(ctx, source) {
  // Low: 100Hz low-shelf, +3dB
  const low = ctx.createBiquadFilter();
  low.type = 'lowshelf';
  low.frequency.value = 100;
  low.gain.value = 3;

  // Mid: 1kHz peaking, -2dB (cut vocals)
  const mid = ctx.createBiquadFilter();
  mid.type = 'peaking';
  mid.frequency.value = 1000;
  mid.gain.value = -2;
  mid.Q.value = 1;

  // High: 8kHz high-shelf, +4dB
  const high = ctx.createBiquadFilter();
  high.type = 'highshelf';
  high.frequency.value = 8000;
  high.gain.value = 4;

  // Chain in series
  source.connect(low).connect(mid).connect(high).connect(ctx.destination);
}
```

## Delay Effect (DelayNode)

```js
const delay = ctx.createDelay(5.0); // Max delay 5 seconds
delay.delayTime.value = 0.3;         // Current delay 0.3 seconds

// Dry/wet mix
const dryGain = ctx.createGain();
const wetGain = ctx.createGain();
const feedbackGain = ctx.createGain();

dryGain.gain.value = 0.6;
wetGain.gain.value = 0.4;
feedbackGain.gain.value = 0.3; // Feedback amount

source.connect(dryGain).connect(ctx.destination);        // Dry signal
source.connect(delay);
delay.connect(wetGain).connect(ctx.destination);          // Wet signal
delay.connect(feedbackGain).connect(delay);               // Feedback loop
```

## Recording (MediaRecorder + Blob)

Record microphone input to an audio file:

```js
async function recordMic(durationSec = 5) {
  const ctx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = ctx.createMediaStreamSource(stream);

  // MediaRecorder records directly from MediaStream (no need to route through AudioContext)
  const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
  const chunks = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    // Download file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  recorder.start();
  setTimeout(() => recorder.stop(), durationSec * 1000);
}
```

## Reverb (ConvolverNode)

Use impulse response files (IR) to simulate real spaces:

```js
async function loadIR(ctx, url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return ctx.decodeAudioData(buf);
}

async function addReverb(ctx, source, irUrl) {
  const convolver = ctx.createConvolver();
  convolver.buffer = await loadIR(ctx, irUrl);

  const dryGain = ctx.createGain();
  const wetGain = ctx.createGain();
  dryGain.gain.value = 0.7;
  wetGain.gain.value = 0.3;

  source.connect(dryGain).connect(ctx.destination);
  source.connect(convolver).connect(wetGain).connect(ctx.destination);
}
```

## Audio Event Scheduling

Schedule notes with precise timing to build a sequencer:

```js
const ctx = new AudioContext();

function playNote(frequency, startTime, duration = 0.5) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = frequency;
  osc.connect(gain).connect(ctx.destination);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

// Play C major scale (each note 0.3 seconds apart)
const C_MAJOR = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
const start = ctx.currentTime + 0.1;
C_MAJOR.forEach((freq, i) => {
  playNote(freq, start + i * 0.3);
});
```

## AudioWorklet (Custom Audio Processing)

AudioWorklet lets you write custom DSP in JavaScript (runs in a worker thread, doesn't block UI):

```js
// Register processor (in a separate file)
// processor.js
class BitcrusherProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.quantizationSteps = 16;
  }
  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    for (let ch = 0; ch < input.length; ch++) {
      for (let i = 0; i < input[ch].length; i++) {
        const step = 2 / this.quantizationSteps;
        output[ch][i] = step * Math.floor(input[ch][i] / step + 0.5);
      }
    }
    return true;
  }
}
registerProcessor('bitcrusher', BitcrusherProcessor);
```

```js
// Load from main thread
await ctx.audioWorklet.addModule('/processor.js');
const crusher = new AudioWorkletNode(ctx, 'bitcrusher');
```

:::tip AudioWorklet vs ScriptProcessorNode
`ScriptProcessorNode` is deprecated (runs on main thread, blocks UI). New projects must use `AudioWorklet`.
:::

## Notes

- **`AnalyserNode.getByteFrequencyData()` must be called every frame**: Put it in a `requestAnimationFrame` loop, avoid CPU spinning
- **Don't make audio node chains too long**: More than 10 processing nodes increases latency; keep it to 5-8
- **MediaRecorder mimeType**: Not all browsers support all formats. Check `MediaRecorder.isTypeSupported()` before recording
- **`ctx.close()` destroys all nodes**: After closing the context, it cannot be restored; you need to rebuild
