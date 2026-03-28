# 性能优化

优化 WebAssembly 需要同时理解 WASM 内部机制和 JS-WASM 边界。

## 基准测试基础

### 使用 Performance.now()

```javascript
function benchmark(fn, iterations = 1000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = performance.now();
    return end - start;
}

// 对比 WASM 和 JS
const wasmTime = benchmark(() => wasm.add(100, 200));
const jsTime = benchmark(() => jsAdd(100, 200));
console.log(`WASM: ${wasmTime}ms, JS: ${jsTime}ms`);
```

## 关键优化策略

### 1. 最小化 JS-WASM 边界穿越

坏模式 — 多次小调用：

```javascript
// 坏：多次边界穿越
for (let i = 0; i < 1000; i++) {
    wasm.process(data[i]); // 1000 次边界穿越！
}
```

好模式 — 批量处理：

```javascript
// 好：一次边界穿越处理数组
wasm.processAll(data); // 1 次边界穿越
```

### 2. 使用适当的数据类型

```rust
// 在 32 位架构上优先使用 i32
#[wasm_bindgen]
pub fn sum_i32(arr: &[i32]) -> i32 {
    arr.iter().sum()
}

// 图形处理使用 f32（比 f64 更快）
#[wasm_bindgen]
pub fn normalize_vertices(vertices: &mut [f32]) {
    for v in vertices.chunks_mut(3) {
        let len = (v[0]*v[0] + v[1]*v[1] + v[2]*v[2]).sqrt();
        v[0] /= len;
        v[1] /= len;
        v[2] /= len;
    }
}
```

### 3. 预分配内存

```javascript
// 坏：每次都创建新的 ArrayBuffer
async function process(data) {
    const wasm = await init();
    const buffer = new Uint8Array(data);
    return wasm.process(buffer); // 每次调用都分配内存
}

// 好：复用内存
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

### 4. 启用 SIMD 加速向量运算

```rust
#[cfg(target_arch = "wasm32")]
use std::arch::wasm32::*;

#[wasm_bindgen]
pub fn dot_product(a: &[f32], b: &[f32]) -> f32 {
    let len = a.len();
    let mut result = 0.0_f32;

    let mut i = 0;
    while i + 4 <= len {
        let a_simd = f32x4(a[i], a[i+1], a[i+2], a[i+3]);
        let b_simd = f32x4(b[i], b[i+1], b[i+2], b[i+3]);
        result += f32x4_extract_lane(simd_mul(a_simd, b_simd), 0);
        result += f32x4_extract_lane(simd_mul(a_simd, b_simd), 1);
        result += f32x4_extract_lane(simd_mul(a_simd, b_simd), 2);
        result += f32x4_extract_lane(simd_mul(a_simd, b_simd), 3);
        i += 4;
    }

    // 处理剩余元素
    while i < len {
        result += a[i] * b[i];
        i += 1;
    }

    result
}
```

### 5. 发布版本优化

```toml
# Cargo.toml
[profile.release]
opt-level = 3          # 最大优化
lto = true             # 链接时优化
codegen-units = 1      # 单代码生成单元以获得更好优化
panic = "abort"        # 更小的二进制文件，无展开
strip = true           # 移除调试符号
```

```bash
# 构建优化版本
wasm-pack build --release --target web

# 使用 wasm-opt
wasm-opt -O3 input.wasm -o output.wasm
```

## 优化清单

| 类别 | 检查项 | 影响 |
|------|--------|------|
| 调用 | 最小化 JS-WASM 穿越 | 高 |
| 类型 | 尽可能使用 i32 而非 i64 | 中 |
| 内存 | 预分配，复用缓冲区 | 高 |
| SIMD | 启用向量运算 | 高 |
| 构建 | 发布版本启用 LTO | 高 |
| 二进制 | 运行 wasm-opt 最终输出 | 中 |

---

继续学习 [调试技巧](./4-debugging)。
