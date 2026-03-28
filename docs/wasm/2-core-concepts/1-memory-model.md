# 内存模型

WebAssembly 有一个基于线性内存的独特内存模型。理解它是有效开发 WASM 的关键。

## 什么是线性内存？

WebAssembly 提供一个单一的、连续的、可变的字节数组，称为**线性内存**。

## 核心特性

| 特性 | 描述 |
|------|------|
| **连续性** | 单一内存块，无碎片 |
| **可变性** | 运行时可读写 |
| **字节寻址** | 每个字节有唯一地址（0, 1, 2, ...） |
| **可调整大小** | 内存可以 64KB（1页 = 65536 字节）为单位增长 |
| **沙箱隔离** | WASM 只能访问自己的内存 |

## 内存布局

```
内存布局示例（小端序）：

地址:   0    1    2    3    4    5    6    7    8    9
数据:  [0x01] [0x02] [0x03] [0x04] [0x00] [0x00] [0x00] [0x00]
         └──────┬──────┘          └──────┬──────┘
          i32 在地址 0 = 0x04030201    i32 在地址 4 = 0
```

## 在 WAT 中创建内存

```wat
(module
  ;; 定义 1 页（64KB）内存并导出
  (memory (export "memory") 1)

  ;; 存储一个值
  (func $store_value
    (i32.store (i32.const 0) (i32.const 42))))
```

## JavaScript 内存访问

```javascript
const memory = new WebAssembly.Memory({ initial: 1, maximum: 10 });

// 使用 TypedArray 视图写入内存
const view = new Uint8Array(memory.buffer);
view[0] = 42;
view[1] = 0;
view[2] = 0;
view[3] = 0;

// 从内存读取
console.log(view[0]); // 42
```

## 使用 TypedArray

JavaScript 提供类型化数组来处理 WASM 内存：

```javascript
const memory = new WebAssembly.Memory({ initial: 1 });

// Uint8Array - 8位无符号整数
const bytes = new Uint8Array(memory.buffer);

// Int32Array - 32位有符号整数
const int32 = new Int32Array(memory.buffer);

// Float64Array - 64位浮点数
const float64 = new Float64Array(memory.buffer);

// 写入和读取
int32[0] = 1000000;
float64[1] = 3.14159;
bytes[8] = 255;

console.log(int32[0]);      // 1000000
console.log(float64[1]);    // 3.14159
console.log(bytes[8]);      // 255
```

## 内存增长

```javascript
const memory = new WebAssembly.Memory({
    initial: 1,     // 1 页（64KB）
    maximum: 100,   // 最多 100 页（6.4MB）
    shared: false   // 不在线程间共享
});

// 内存增长 1 页
memory.grow(1);
console.log(memory.buffer.byteLength); // 131072 (128KB)
```

## 对齐

数据在内存中必须正确对齐：

| 类型 | 大小 | 对齐 |
|------|------|------|
| i8 / u8 | 1 | 1 |
| i16 / u16 | 2 | 2 |
| i32 / u32 / f32 | 4 | 4 |
| i64 / u64 / f64 | 8 | 8 |

## 字符串传递

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}
```

wasm-bindgen 幕后操作：
1. 在 WASM 线性内存中分配空间
2. 将字符串字节复制到该内存
3. 返回指针和长度给 JS

## 性能考虑

| 实践 | 收益 |
|------|------|
| 最小化跨边界访问 | 更好的缓存性能 |
| 使用适当类型 | 避免不必要的转换 |
| 批量操作 | 减少函数调用开销 |
| 保持数据局部性 | 更好的内存访问模式 |

---

继续学习[调用约定](./2-call-convention)了解函数如何交换数据。
