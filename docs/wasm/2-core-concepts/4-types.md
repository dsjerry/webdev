# 类型系统

WebAssembly 有一个简单但强大的类型系统，包含四种值类型和 SIMD 类型支持。

## 值类型

| 类型 | 大小 | 描述 | 范围 |
|------|------|-------------|-------|
| `i32` | 32 位 | 有符号整数 | -2^31 到 2^31-1 |
| `i64` | 64 位 | 有符号整数 | -2^63 到 2^63-1 |
| `f32` | 32 位 | IEEE 754 浮点数 | ~6-7 位精度 |
| `f64` | 64 位 | IEEE 754 浮点数 | ~15-16 位精度 |

## 整数类型

### 有符号 vs 无符号

```wat
;; 有符号（i32, i64）— 二进制补码
(func (export "signed_div") (param i32 i32) (result i32)
  local.get 0
  local.get 1
  i32.div_s)      ;; 有符号除法

(func (export "unsigned_div") (param i32 i32) (result i32)
  local.get 0
  local.get 1
  i32.div_u)      ;; 无符号除法
```

### 整数运算

| 运算 | 有符号 | 无符号 |
|------|--------|---------|
| 加法 | `i32.add` | — |
| 减法 | `i32.sub` | — |
| 乘法 | `i32.mul` | — |
| 除法 | `i32.div_s` | `i32.div_u` |
| 取模 | `i32.rem_s` | `i32.rem_u` |
| 比较 | `i32.lt_s` | `i32.lt_u` |

## 浮点类型

### 浮点运算

```wat
;; 基本运算
(func (export "float_math") (param f32 f32) (result f32)
  local.get 0
  local.get 1
  f32.add)     ;; 加法

;; 特殊运算
(func (export "sqrt") (param f64) (result f64)
  local.get 0
  f64.sqrt)

(func (export "floor") (param f64) (result f64)
  local.get 0
  f64.floor)
```

## SIMD 类型

WebAssembly SIMD 提供 128 位向量运算：

| 类型 | 大小 | 描述 |
|------|------|-------------|
| `v128` | 128 位 | SIMD 向量 |

### SIMD 指令

```wat
(module
  (func (export "add_i8x16") (param v128 v128) (result v128)
    local.get 0
    local.get 1
    i8x16.add))

  (func (export "splat_i32x4") (param i32) (result v128)
    local.get 0
    i32x4.splat))
```

## Rust 类型映射

| Rust 类型 | WASM 类型 |
|------------|-----------|
| `i32` | `i32` |
| `i64` | `i64` |
| `f32` | `f32` |
| `f64` | `f64` |
| `&[i32]` | 线性内存切片 |
| `&str` | 指针 + 长度 |
| `&[u8]` | 线性内存切片 |
| `String` | 指针 + 长度（已分配） |

---

继续学习 [JavaScript 集成](../3-integration/1-js-usage)。
