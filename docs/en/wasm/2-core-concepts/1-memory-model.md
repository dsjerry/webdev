# Memory Model

WebAssembly has a unique memory model based on linear memory. Understanding it is key to effective WASM development.

## What is Linear Memory?

WebAssembly provides a single, contiguous, mutable byte array called **linear memory**.

## Core Features

| Feature | Description |
|---------|-------------|
| **Contiguous** | Single memory block, no fragmentation |
| **Mutable** | Readable and writable at runtime |
| **Byte-addressable** | Each byte has a unique address (0, 1, 2, ...) |
| **Resizable** | Memory can grow in 64KB pages (1 page = 65536 bytes) |
| **Sandboxed** | WASM can only access its own memory |

## Memory Access from JavaScript

```javascript
const memory = new WebAssembly.Memory({ initial: 1, maximum: 10 });

// Write memory using TypedArray view
const view = new Uint8Array(memory.buffer);
view[0] = 42;
view[1] = 0;
view[2] = 0;
view[3] = 0;

// Read from memory
console.log(view[0]); // 42
```

## Using TypedArrays

JavaScript provides typed arrays to work with WASM memory:

```javascript
const memory = new WebAssembly.Memory({ initial: 1 });

// Uint8Array - 8-bit unsigned integer
const bytes = new Uint8Array(memory.buffer);

// Int32Array - 32-bit signed integer
const int32 = new Int32Array(memory.buffer);

// Float64Array - 64-bit floating point
const float64 = new Float64Array(memory.buffer);

// Write and read
int32[0] = 1000000;
float64[1] = 3.14159;
bytes[8] = 255;

console.log(int32[0]);      // 1000000
console.log(float64[1]);   // 3.14159
console.log(bytes[8]);     // 255
```

## Memory Growth

```javascript
const memory = new WebAssembly.Memory({
    initial: 1,     // 1 page (64KB)
    maximum: 100,   // Max 100 pages (6.4MB)
    shared: false   // Not shared between threads
});

// Grow memory by 1 page
memory.grow(1);
console.log(memory.buffer.byteLength); // 131072 (128KB)
```

## Alignment

Data must be properly aligned in memory:

| Type | Size | Alignment |
|------|------|----------|
| i8 / u8 | 1 | 1 |
| i16 / u16 | 2 | 2 |
| i32 / u32 / f32 | 4 | 4 |
| i64 / u64 / f64 | 8 | 8 |

## Passing Strings

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
```

wasm-bindgen does this behind the scenes:
1. Allocates space in WASM linear memory
2. Copies string bytes to that memory
3. Returns pointer and length to JS

## Performance Considerations

| Practice | Benefit |
|----------|---------|
| Minimize cross-boundary access | Better cache performance |
| Use appropriate types | Avoid unnecessary conversions |
| Batch operations | Reduce function call overhead |
| Keep data locality | Better memory access patterns |

---

Continue learning [Call Convention](./2-call-convention) to understand how functions exchange data.
