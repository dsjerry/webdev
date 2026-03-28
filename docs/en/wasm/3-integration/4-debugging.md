# Debugging

Debugging WebAssembly requires combining browser tools, compiler settings, and best practices.

## Browser DevTools

### Chrome/Edge

1. Open DevTools (F12)
2. Go to **Sources** panel
3. Find WASM files in the file tree
4. Set breakpoints directly in WAT view

## Source Maps

### Generate Source Maps

```bash
# With wasm-pack
wasm-pack build --dev --source-map
```

### Source Map Support

```javascript
// Modern browsers support WASM source maps
const response = await fetch('/module.wasm');
const { instance } = await WebAssembly.instantiateStreaming(response, {
  env: { /* imports */ }
});

// DevTools will show original source location
instance.exports.process(42); // Set breakpoint in original source
```

## Logging from WASM

### Console Logging in Rust

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn debug_value(x: i32) -> i32 {
    web_sys::console::log_1(&format!("Value: {}", x).into());
    x * 2
}
```

## Memory Inspection

### Read WASM Memory

```javascript
// Access exported memory
const memory = instance.exports.memory;

// Create typed array views
const int32View = new Int32Array(memory.buffer);
const uint8View = new Uint8Array(memory.buffer);

// Read value at address
function readInt32(ptr) {
    return int32View[ptr / 4];
}
```

## Common Debugging Scenarios

| Scenario | Symptom | Solution |
|----------|---------|----------|
| Wrong values | Output not as expected | Check type conversion, memory layout |
| Crash | Page freezes or throws error | Add logging, check for infinite loops |
| Memory issues | Data corruption | Verify buffer size, alignment |
| Link error | Missing imports | Provide all required imports |
| Type error | Call fails | Match function signatures exactly |

## External Tools

### wasm-objdump

```bash
# Check WASM binary
wasm-objdump -h module.wasm    # Header
wasm-objdump -d module.wasm    # Disassemble
wasm-objdump --section=NAME module.wasm  # Specific section
```

### wasm2wat

```bash
# Convert to text for inspection
wasm2wat module.wasm -o module.wat
```

### Twiggy

```bash
# Analyze code size
twiggy top module.wasm
twiggy calls module.wasm
twiggy unreachable module.wasm
```

---

Continue learning [Advanced Topics](../4-advanced/1-threads) on multi-threading and more.
