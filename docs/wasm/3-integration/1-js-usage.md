# 在 JavaScript 中使用 WASM

本章涵盖将 WebAssembly 与 JavaScript 应用程序集成所需的一切。

## 加载 WASM 模块

### 基础加载

```javascript
// 方法 1: ArrayBuffer（兼容性好）
async function loadWasm(url) {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes);
  return instance.exports;
}

// 方法 2: 流式编译（更快，推荐）
async function loadWasmStreaming(url) {
  const response = await fetch(url);
  const { instance } = await WebAssembly.instantiateStreaming(response);
  return instance.exports;
}
```

### 使用导出的函数

```javascript
const wasm = await loadWasmStreaming('/add.wasm');

console.log(wasm.add(10, 5));        // 15
console.log(wasm.subtract(10, 5));   // 5
console.log(wasm.multiply(10, 5));   // 50
console.log(wasm.divide(10, 5));     // 2
```

## 完整的集成示例

### HTML + JavaScript

```html
<!DOCTYPE html>
<html>
<head>
    <title>WASM 集成</title>
</head>
<body>
    <h1>WASM + JavaScript 示例</h1>
    <div id="output"></div>

    <script type="module">
        const response = await fetch('/module.wasm');
        const { instance } = await WebAssembly.instantiateStreaming(response);
        const exports = instance.exports;

        // 使用导出的函数
        document.getElementById('output').innerHTML = `
            <p>add(10, 5) = ${exports.add(10, 5)}</p>
            <p>内存大小: ${exports.memory.buffer.byteLength} 字节</p>
        `;
    </script>
</body>
</html>
```

## 处理字符串

### Rust: 字符串反转

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
```

### JavaScript: 字符串处理

```javascript
import init, { reverse_string } from './pkg/my_lib.js';

await init();

const original = "你好，WebAssembly！";
const reversed = reverse_string(original);

console.log(original);  // "你好，WebAssembly！"
console.log(reversed);  // "!ylbmassAeb ，好你"
```

## 处理数组

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

// 数组求和
const numbers = new Int32Array([1, 2, 3, 4, 5]);
console.log(sum_array(numbers)); // 15

// 过滤正数
const mixed = new Int32Array([-1, 2, -3, 4, -5]);
const positive = filter_positive(mixed);
console.log([...positive]); // [2, 4]
```

## 错误处理

### Rust

```rust
#[wasm_bindgen]
pub fn divide(a: i32, b: i32) -> Result<i32, JsValue> {
    if b == 0 {
        Err(JsValue::from_str("除数不能为零"))
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
    console.error('错误:', error.message);
}
```

## 性能最佳实践

| 实践 | 收益 |
|------|------|
| 使用 `instantiateStreaming` | 加载更快 |
| 复用 ArrayBuffer | 避免 GC 压力 |
| 批量操作 | 减少 JS-WASM 调用 |
| 使用类型化数组 | 高效的内存访问 |

---

继续学习 [WAT 文本格式](./2-wat)。
