# Type System

WebAssembly has a simple but powerful type system with four value types and SIMD type support.

## Value Types

| Type | Size | Description | Range |
|------|------|-------------|-------|
| `i32` | 32 bit | Signed integer | -2^31 to 2^31-1 |
| `i64` | 64 bit | Signed integer | -2^63 to 2^63-1 |
| `f32` | 32 bit | IEEE 754 floating point | ~6-7 digit precision |
| `f64` | 64 bit | IEEE 754 floating point | ~15-16 digit precision |

## Integer Types

### Signed vs Unsigned

```wat
;; Signed (i32, i64) — two's complement
(func (export "signed_div") (param i32 i32) (result i32)
  local.get 0
  local.get 1
  i32.div_s)      ;; Signed division

(func (export "unsigned_div") (param i32 i32) (result i32)
  local.get 0
  local.get 1
  i32.div_u)      ;; Unsigned division
```

## SIMD Types

WebAssembly SIMD provides 128-bit vector operations:

| Type | Size | Description |
|------|------|-------------|
| `v128` | 128 bit | SIMD vector |

### SIMD Instructions

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

## Rust Type Mapping

| Rust Type | WASM Type |
|------------|-----------|
| `i32` | `i32` |
| `i64` | `i64` |
| `f32` | `f32` |
| `f64` | `f64` |
| `&[i32]` | Linear memory slice |
| `&str` | Pointer + length |
| `&[u8]` | Linear memory slice |
| `String` | Pointer + length (allocated) |

---

Continue learning [JavaScript Integration](../3-integration/1-js-usage).
