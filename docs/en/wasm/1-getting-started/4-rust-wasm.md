# Writing WebAssembly with Rust

Rust is the most popular programming language for WebAssembly development. It offers excellent tooling, memory safety, and near-zero-cost abstractions.

## Why Rust + WASM?

- **Memory safety** — No garbage collector, no undefined behavior
- **Excellent performance** — Comparable to C/C++
- **First-class tooling** — Top-notch wasm-pack and wasm-bindgen support
- **Rich ecosystem** — Large library ecosystem on crates.io

## Project Setup

### 1. Initialize Project

```bash
cargo new --lib my-wasm-lib
cd my-wasm-lib
```

### 2. Configure Cargo.toml

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

### 3. Install wasm-bindgen-cli

```bash
cargo install wasm-bindgen-cli
```

## Basic Example

### Rust Code

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

### Build

```bash
wasm-pack build --target web
```

Generated files:
- `pkg/my_wasm_lib_bg.wasm` — Binary WASM module
- `pkg/my_wasm_lib.js` — JS bindings

### JavaScript Usage

```javascript
import init, { greet, add, fibonacci } from './pkg/my_wasm_lib.js';

await init();

console.log(greet('World'));     // "Hello, World!"
console.log(add(10, 20));      // 30
console.log(fibonacci(10));   // 55
```

## Handling Complex Types

### Passing Arrays

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sum_array(arr: &[i32]) -> i32 {
    arr.iter().sum()
}
```

### Returning Strings

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
```

### Using Structs

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

## Performance Optimization

| Optimization | Note |
|--------------|------|
| `#[inline(always)]` | Force inline small functions |
| `release` profile | Required for production |
| `lto = true` | Link-time optimization |
| `opt-level = "s"` | Optimize for size |
| `opt-level = "z"` | Smaller optimized size |

### Optimized Cargo.toml

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

## What's Next

You've mastered Rust + WASM basics! Continue learning [Core Concepts](../2-core-concepts/1-memory-model).

::: tip Resources
- [Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [crates.io](https://crates.io/) — Search for wasm-related packages
:::
