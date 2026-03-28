# Multi-threading

WebAssembly supports true parallel execution through SharedArrayBuffer and atomic operations. This enables real parallel execution.

## SharedArrayBuffer

SharedArrayBuffer allows memory sharing between threads:

```javascript
// Create shared memory
const sharedMemory = new SharedArrayBuffer(65536); // 64KB

// Create views
const sharedView = new Int32Array(sharedMemory);

// Worker 1
const worker1 = new Worker('worker1.js');
worker1.postMessage({ sharedBuffer: sharedMemory });

// Worker 2
const worker2 = new Worker('worker2.js');
worker2.postMessage({ sharedBuffer: sharedMemory });
```

## Atomic Operations

### Atomic read-modify-write

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn atomic_increment(memory: &mut [i32], index: usize) -> i32 {
    let old = memory[index];
    memory[index] = old + 1;
    old + 1
}
```

## JavaScript Atomic Operations

```javascript
const sharedArray = new Int32Array(new SharedArrayBuffer(1024));

// Atomic operations
Atomics.add(sharedArray, 0, 10);      // Add 10
Atomics.sub(sharedArray, 0, 5);       // Subtract 5
Atomics.and(sharedArray, 0, 0b1111);  // Bitwise AND
Atomics.or(sharedArray, 0, 0b1111);   // Bitwise OR
Atomics.xor(sharedArray, 0, 0b1111);  // Bitwise XOR

// Compare exchange
const old = Atomics.compareExchange(sharedArray, 0, 5, 10);

// Load and store
const value = Atomics.load(sharedArray, 0);
Atomics.store(sharedArray, 0, value + 1);

// Wait and notify
Atomics.wait(sharedArray, 0, expectedValue, timeout);
Atomics.notify(sharedArray, 0, count);
```

## Browser Requirements

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| SharedArrayBuffer | 92+ | 79+ | 15.2+ | 92+ |
| Atomics | 92+ | 79+ | 15.2+ | 92+ |
| Worker | All | All | All | All |

::: warning Cross-Origin Isolation
SharedArrayBuffer requires cross-origin isolation. Set these response headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
:::

## Performance Considerations

| Aspect | Recommendation |
|--------|----------------|
| Granularity | Use fine-grained atomic operations |
| Contention | Minimize lock hold time |
| False sharing | Pad data to different cache lines |
| Memory | Use shared memory sparingly |

---

Continue learning [Garbage Collection](./2-gc).
