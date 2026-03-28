# WAT Text Format

WebAssembly Text Format (WAT) is the human-readable text representation of WebAssembly binary format. Understanding WAT helps you deeply understand how WASM works.

## Why Learn WAT?

- **Debugging** — Read compiled WASM output
- **Learning** — Deeply understand WASM semantics
- **Optimization** — Write efficient low-level code
- **Testing** — Verify binary output

## Basic Syntax

### Module Structure

```wat
(module
  ;; Comments with ;;
  (func $name ...)
  (memory ...)
  (table ...)
  (global ...))
```

## Functions

### Basic Functions

```wat
;; Function that returns 42
(module
  (func (export "answer") (result i32)
    (i32.const 42)))
```

### Functions with Parameters

```wat
(module
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add))
```

## Stack Machine

WASM is a stack machine — instructions operate on a stack:

```wat
;; Add two numbers
(i32.const 5)     ;; Push 5
(i32.const 3)     ;; Push 3
(i32.add)         ;; Pop 3 and 5, push 8
```

## Instruction Reference

### Constants

```wat
(i32.const 42)     ;; Push i32 constant
(i64.const 9223372036854775807)  ;; Push i64
(f32.const 3.14)   ;; Push f32
(f64.const 2.718281828)  ;; Push f64
```

### Local Variables

```wat
(local.get $x)      ;; Push local variable
(local.set $x)      ;; Pop and store to local variable
(local.tee $x)       ;; Duplicate top of stack, then store
```

## Tools

### WAT to WASM

```bash
# Install wabt (WebAssembly Binary Toolkit)
# macOS
brew install wabt
# Linux
sudo apt install wabt

# WAT to WASM
wat2wasm input.wat -o output.wasm

# WASM to WAT
wasm2wat input.wasm -o output.wat
```

---

Continue learning [Performance Optimization](./3-performance).
