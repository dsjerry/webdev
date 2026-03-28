# 调用约定

理解 WebAssembly 的调用约定对于 WASM 与 JavaScript（或其他语言）之间的互操作至关重要。

## 基于栈的调用约定

WebAssembly 使用基于栈的调用约定：

```mermaid
flowchart LR
    subgraph Caller["调用者"]
        P1[压入参数 1] --> P2[压入参数 2]
        P2 --> CALL[调用函数]
    end
    CALL --> CALLEE[被调用者弹出参数]
    CALLEE --> COMPUTE[计算结果]
    COMPUTE --> PUSH[压入结果]
    PUSH --> RET[返回]
    RET --> POP[调用者弹出结果]
```

## 参数传递

### 带参数的 WAT 函数

```wat
;; 参数按顺序压栈，由被调用者弹出
(func $add (param $a i32) (param $b i32) (result i32)
  local.get $a    ;; 将 $a 压入栈
  local.get $b    ;; 将 $b 压入栈
  i32.add)        ;; 弹出两个值，相加，结果压栈
```

## 局部变量

```wat
(func $factorial (param $n i32) (result i32)
  (local $result i32)
  (local $temp i32)

  (local.set $result (i32.const 1))

  (block $done (result i32)
    (loop $loop
      (br_if $done (i32.le_s (local.get $n) (i32.const 1)))
      (local.set $temp (local.get $result))
      (local.set $result (i32.mul (local.get $result) (local.get $n)))
      (local.set $n (i32.sub (local.get $n) (i32.const 1)))
      (br $loop))
    (local.get $result)))
```

## 分支和控制流

### If-Else

```wat
(func $max (param $a i32) (param $b i32) (result i32)
  (if (i32.gt_s (local.get $a) (local.get $b))
    (then (local.get $a))
    (else (local.get $b))))
```

### 循环

```wat
(func $sum_to (param $n i32) (result i32)
  (local $sum i32)
  (local.set $sum (i32.const 0))
  (block $done
    (loop $start
      (br_if $done (i32.eqz (local.get $n)))
      (local.set $sum (i32.add (local.get $sum) (local.get $n)))
      (local.set $n (i32.sub (local.get $n) (i32.const 1)))
      (br $start)))
  (local.get $sum))
```

## 与 JavaScript 的互操作

### 传递数字

```javascript
// 简单 - 直接传递数字
const result = instance.exports.add(1, 2); // 3
```

### 传递字符串

```rust
// Rust 接收指针 + 长度
#[wasm_bindgen]
pub fn process_string(ptr: *const u8, len: usize) -> usize {
    let slice = unsafe { std::slice::from_raw_parts(ptr, len) };
    // 处理...
    len
}
```

### 接收数组

```rust
#[wasm_bindgen]
pub fn sum_array(arr: &[i32]) -> i32 {
    arr.iter().sum()
}
```

## 性能提示

| 技巧 | 说明 |
|------|------|
| 使用小类型 | 在 32 位架构上 i32 比 i64 更快 |
| 最小化参数 | 通过指针传递结构体，而非值传递 |
| 内联小函数 | 减少调用开销 |
| 避免过度分支 | 分支深度影响性能 |

---

继续学习[导入和导出](./3-import-export)了解模块通信。
