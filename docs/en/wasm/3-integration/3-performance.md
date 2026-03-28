# Performance Optimization

Optimizing WebAssembly requires understanding both WASM internals and JS-WASM boundaries.

## Benchmarking Basics

### Using Performance.now()

```javascript
function benchmark(fn, iterations = 1000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = performance.now();
    return end - start;
}

// Compare WASM and JS
const wasmTime = benchmark(() => wasm.add(100, 200));
const jsTime = benchmark(() => jsAdd(100, 200));
console.log(`WASM: ${wasmTime}ms, JS: ${jsTime}ms`);
```

## Key Optimization Strategies

### 1. Minimize JS-WASM Boundary Crossings

Bad pattern — many small calls:

```javascript
// Bad: many boundary crossings
for (let i = 0; i < 1000; i++) {
    wasm.process(data[i]); // 1000 boundary crossings!
}
```

Good pattern — batch processing:

```javascript
// Good: one boundary crossing for entire array
wasm.processAll(data); // 1 boundary crossing
```

### 2. Use Appropriate Data Types

```rust
// Prefer i32 on 32-bit architectures
#[wasm_bindgen]
pub fn sum_i32(arr: &[i32]) -> i32 {
    arr.iter().sum()
}
```

### 3. Pre-allocate Memory

```javascript
// Bad: creates new ArrayBuffer each time
async function process(data) {
    const wasm = await init();
    const buffer = new Uint8Array(data);
    return wasm.process(buffer); // Allocates memory every call
}

// Good: reuse memory
let wasm;
let memory;

async function init() {
    wasm = await loadWasm();
    memory = wasm.exports.memory;
}

function process(data) {
    const view = new Uint8Array(memory.buffer);
    view.set(data);
    return wasm.exports.process(data.length);
}
```

### 4. Release Build Optimization

```toml
# Cargo.toml
[profile.release]
opt-level = 3          # Max optimization
lto = true             # Link-time optimization
codegen-units = 1      # Single codegen unit for better optimization
panic = "abort"        # Smaller binary, no unwinding
strip = true           # Remove debug symbols
```

```bash
# Build optimized version
wasm-pack build --release --target web

# Use wasm-opt on final output
wasm-opt -O3 input.wasm -o output.wasm
```

## Optimization Checklist

| Category | Check | Impact |
|----------|-------|--------|
| Calls | Minimize JS-WASM crossings | High |
| Types | Prefer i32 over i64 where possible | Medium |
| Memory | Pre-allocate, reuse buffers | High |
| Build | Enable LTO in release | High |
| Binary | Run wasm-opt on final output | Medium |

---

Continue learning [Debugging](./4-debugging).
