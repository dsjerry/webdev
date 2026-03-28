# 第一个 WASM 模块

让我们构建一个简单但完整的 WebAssembly 模块。我们将使用 WebAssembly 文本格式（WAT）来清晰地展示。

## 编写 WAT 代码

创建 `add.wat` 文件：

```wat
(module
  ;; 定义一个加法函数
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)

  ;; 导出函数
  (export "add" (func $add)))
```

## 编译为二进制

使用 `wat2wasm` 编译：

```bash
wat2wasm add.wat -o add.wasm
```

## 在 JavaScript 中使用

创建 `index.html`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>第一个 WASM 模块</title>
</head>
<body>
    <h1>我的第一个 WASM 模块</h1>
    <div id="result"></div>

    <script type="module">
        async function loadWasm() {
            const response = await fetch('add.wasm');
            const bytes = await response.arrayBuffer();
            const { instance } = await WebAssembly.instantiate(bytes);

            const result = instance.exports.add(40, 2);
            document.getElementById('result').textContent = `结果: ${result}`;
        }

        loadWasm();
    </script>
</body>
</html>
```

## 现代加载方式：流式编译

为了更好的性能，使用 `instantiateStreaming`：

```javascript
const response = await fetch('add.wasm');
const { instance } = await WebAssembly.instantiateStreaming(response);
// 直接从 promise 获取 - 不需要 arrayBuffer
```

## 添加更多函数

扩展我们的模块：

```wat
(module
  ;; 加法函数
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)

  ;; 减法函数
  (func $sub (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.sub)

  ;; 乘法函数
  (func $mul (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul)

  ;; 除法函数
  (func $div (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_s)

  ;; 条件判断：检查是否相等
  (func $isEqual (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.eq)

  ;; 导出所有函数
  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
  (export "isEqual" (func $isEqual)))
```

## 测试所有函数

```javascript
const exports = instance.exports;

console.log('加法:', exports.add(10, 5));      // 15
console.log('减法:', exports.sub(10, 5));      // 5
console.log('乘法:', exports.mul(10, 5));      // 50
console.log('除法:', exports.div(10, 5));      // 2
console.log('相等:', exports.isEqual(5, 5));  // 1 (true)
```

## 理解语法

| 指令 | 描述 |
|------|------|
| `local.get` | 将局部变量压入栈 |
| `i32.add` | 弹出两个值，相加，结果压栈 |
| `param $name type` | 声明函数参数 |
| `result type` | 声明返回类型 |
| `export "name"` | 导出函数供 JavaScript 使用 |

## 局部变量

函数可以有局部变量：

```wat
(func $factorial (param $n i32) (result i32)
  (local $result i32)
  (local $temp i32)
  (local.set $result (i32.const 1))
  (block $break (result i32)
    (loop $continue
      (br_if $break (i32.eqz (local.get $n)))
      (local.set $temp (local.get $result))
      (local.set $result (i32.mul (local.get $result) (local.get $n)))
      (local.set $n (i32.sub (local.get $n) (i32.const 1)))
      (br $continue))
    (local.get $result)))
```

## 错误处理

WASM 的错误处理有限。常见错误：

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| `LinkError` | 缺少导入 | 提供所有必需的导入 |
| `RuntimeError` | 陷阱（除零） | 调用前验证输入 |
| `TypeError` | 参数类型错误 | 匹配函数签名 |

## 下一步

你已经构建了第一个 WASM 模块！接下来学习如何[使用 Rust 编译](./4-rust-wasm)实现更复杂的项目。

---

::: tip 挑战
尝试创建一个计算斐波那契数列的 WASM 模块。用不同的值测试它！
:::
