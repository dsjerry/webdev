# Rust 编写 WebAssembly

Rust 是 WebAssembly 开发最流行的编程语言。它提供优秀的工具链、内存安全性和近乎零成本的抽象。

## 为什么选择 Rust + WASM？

- **内存安全** —— 无垃圾回收器，无未定义行为
- **性能卓越** —— 可与 C/C++ 媲美
- **工具完善** —— 顶级的 wasm-pack 和 wasm-bindgen 支持
- **生态丰富** —— crates.io 上有大量库

## 项目设置

### 1. 初始化项目

```bash
cargo new --lib my-wasm-lib
cd my-wasm-lib
```

### 2. 配置 Cargo.toml

```toml
[package]
name = "my-wasm-lib"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2"
```

### 3. 安装 wasm-bindgen-cli

```bash
cargo install wasm-bindgen-cli
```

## 基础示例

### Rust 代码

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
```

### 构建

```bash
wasm-pack build --target web
```

生成的文件：
- `pkg/my_wasm_lib_bg.wasm` — 二进制 WASM 模块
- `pkg/my_wasm_lib.js` — JS 绑定

### JavaScript 使用

```javascript
import init, { greet, add, fibonacci } from './pkg/my_wasm_lib.js';

await init();

console.log(greet('世界'));     // "Hello, 世界!"
console.log(add(10, 20));      // 30
console.log(fibonacci(10));   // 55
```

## 处理复杂类型

### 传递数组

```rust
use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;

#[wasm_bindgen]
pub fn sum_array(arr: &[i32]) -> i32 {
    arr.iter().sum()
}

#[wasm_bindgen]
pub fn process_pixels(data: Clamped<Vec<u8>>) -> Vec<u8> {
    let pixels: Vec<u8> = data.into_inner();

    pixels
        .chunks(4)
        .flat_map(|chunk| {
            let [r, g, b, a] = *chunk else { return vec![] };
            let gray = (0.3 * *r as f32 + 0.59 * *g as f32 + 0.11 * *b as f32) as u8;
            vec![gray, gray, gray, *a]
        })
        .collect()
}
```

### 返回字符串

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_message() -> String {
    String::from("你好，来自 WASM！")
}

// 为了更好的性能，使用 JsValue
#[wasm_bindgen]
pub fn format_user(name: &str, age: u32) -> JsValue {
    JsValue::from_str(&format!("{} 现在 {} 岁了", name, age))
}
```

### 使用结构体

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Counter {
    count: i32,
}

#[wasm_bindgen]
impl Counter {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Counter { count: 0 }
    }

    #[wasm_bindgen]
    pub fn increment(&mut self) -> i32 {
        self.count += 1;
        self.count
    }

    #[wasm_bindgen]
    pub fn decrement(&mut self) -> i32 {
        self.count -= 1;
        self.count
    }

    #[wasm_bindgen]
    pub fn get(&self) -> i32 {
        self.count
    }
}

impl Default for Counter {
    fn default() -> Self {
        Self::new()
    }
}
```

在 JavaScript 中使用：

```javascript
const counter = new wasm.Counter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
counter.get();       // 1
```

## 异步操作

### Promise

```rust
use wasm_bindgen::prelude::*;
use js_sys::Promise;
use wasm_bindgen_futures::future_to_promise;

#[wasm_bindgen]
pub fn async_fetch_data() -> Promise {
    future_to_promise(async {
        let result = fetch_data_from_api().await;
        Ok(JsValue::from_str(&result))
    })
}
```

## 调试

### 控制台日志

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn debug_demo(value: i32) -> i32 {
    web_sys::console::log_1(&format!("输入值: {}", value).into());
    value * 2
}
```

### 启用调试信息

```bash
wasm-pack build --debug
```

### 源映射

```bash
wasm-pack build --dev
# 或发布版本带源映射
wasm-pack build --release --source-map
```

## 性能优化

| 优化项 | 说明 |
|--------|------|
| `#[inline(always)]` | 强制内联小函数 |
| `release` 配置文件 | 生产环境必用 |
| `lto = true` | 链接时优化 |
| `opt-level = "s"` | 优化大小 |
| `opt-level = "z"` | 更小的优化大小 |

### 优化的 Cargo.toml

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

## 常见模式

### 错误处理

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn safe_divide(a: f64, b: f64) -> Result<f64, JsValue> {
    if b == 0.0 {
        return Err(JsValue::from_str("除数不能为零"));
    }
    Ok(a / b)
}
```

### 模块初始化

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    web_sys::console::log_1(&"模块已初始化".into());
}
```

## 接下来

你已经掌握了 Rust + WASM 的基础。继续学习[核心概念](../2-core-concepts/1-memory-model)。

---

::: tip 资源
- [Rust 和 WebAssembly 书籍](https://rustwasm.github.io/docs/book/)
- [wasm-bindgen 指南](https://rustwasm.github.io/wasm-bindgen/)
- [crates.io](https://crates.io/) — 搜索 wasm 相关包
:::
