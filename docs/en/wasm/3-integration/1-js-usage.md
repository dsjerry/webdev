# Using WASM in JavaScript

This chapter covers everything needed to integrate WebAssembly with JavaScript applications.

## Loading WASM Modules

### Basic Loading

```javascript
// Method 1: ArrayBuffer (better compatibility)
async function loadWasm(url) {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes);
  return instance.exports;
}

// Method 2: Streaming compilation (faster, recommended)
async function loadWasmStreaming(url) {
  const response = await fetch(url);
  const { instance } = await WebAssembly.instantiateStreaming(response);
  return instance.exports;
}
```

### Using Exported Functions

```javascript
const wasm = await loadWasmStreaming('/add.wasm');

console.log(wasm.add(10, 5));        // 15
console.log(wasm.subtract(10, 5));   // 5
console.log(wasm.multiply(10, 5));   // 50
console.log(wasm.divide(10, 5));     // 2
```

## Complete Integration Example

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>WASM Integration</title>
</head>
<body>
    <h1>WASM + JavaScript Example</h1>
    <div id="output"></div>

    <script type="module">
        const response = await fetch('/module.wasm');
        const { instance } = await WebAssembly.instantiateStreaming(response);
        const exports = instance.exports;

        document.getElementById('output').innerHTML = `
            <p>add(10, 5) = ${exports.add(10, 5)}</p>
            <p>Memory size: ${exports.memory.buffer.byteLength} bytes</p>
        `;
    </script>
</body>
</html>
```

## Handling Strings

### Rust

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
```

### JavaScript

```javascript
import init, { reverse_string } from './pkg/my_lib.js';

await init();

const original = "Hello, WebAssembly!";
const reversed = reverse_string(original);
console.log(original);  // "Hello, WebAssembly!"
console.log(reversed);  // "!ylbmassAeb ,olleH"
```

## Handling Arrays

### Rust

```rust
#[wasm_bindgen]
pub fn sum_array(arr: &[i32]) -> i32 {
    arr.iter().sum()
}

#[wasm_bindgen]
pub fn filter_positive(arr: &[i32]) -> Vec<i32> {
    arr.iter().filter(|&&x| x > 0).cloned().collect()
}
```

### JavaScript

```javascript
import init, { sum_array, filter_positive } from './pkg/my_lib.js';

await init();

// Array sum
const numbers = new Int32Array([1, 2, 3, 4, 5]);
console.log(sum_array(numbers)); // 15

// Filter positives
const mixed = new Int32Array([-1, 2, -3, 4, -5]);
const positive = filter_positive(mixed);
console.log([...positive]); // [2, 4]
```

## Error Handling

### Rust

```rust
#[wasm_bindgen]
pub fn divide(a: i32, b: i32) -> Result<i32, JsValue> {
    if b == 0 {
        Err(JsValue::from_str("Division by zero"))
    } else {
        Ok(a / b)
    }
}
```

### JavaScript

```javascript
try {
    const result = divide(10, 0);
    console.log(result);
} catch (error) {
    console.error('Error:', error.message);
}
```

## Performance Best Practices

| Practice | Benefit |
|----------|---------|
| Use `instantiateStreaming` | Faster loading |
| Reuse ArrayBuffer | Avoid GC pressure |
| Batch operations | Reduce JS-WASM calls |
| Use TypedArrays | Efficient memory access |

---

Continue learning [WAT Text Format](./2-wat).
