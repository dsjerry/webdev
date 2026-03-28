# Your First WASM Module

Let's build a simple but complete WebAssembly module. We'll use WebAssembly Text Format (WAT) to clearly demonstrate.

## Write WAT Code

Create `add.wat`:

```wat
(module
  ;; Define an add function
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)

  ;; Export function
  (export "add" (func $add)))
```

## Compile to Binary

Compile with `wat2wasm`:

```bash
wat2wasm add.wat -o add.wasm
```

## Use in JavaScript

Create `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>First WASM Module</title>
</head>
<body>
    <h1>My First WASM Module</h1>
    <div id="result"></div>

    <script type="module">
        async function loadWasm() {
            const response = await fetch('add.wasm');
            const bytes = await response.arrayBuffer();
            const { instance } = await WebAssembly.instantiate(bytes);

            const result = instance.exports.add(40, 2);
            document.getElementById('result').textContent = `Result: ${result}`;
        }

        loadWasm();
    </script>
</body>
</html>
```

## Modern Loading: Streaming Compilation

For better performance, use `instantiateStreaming`:

```javascript
const response = await fetch('add.wasm');
const { instance } = await WebAssembly.instantiateStreaming(response);
// Directly from promise — no arrayBuffer needed
```

## Add More Functions

Expand our module:

```wat
(module
  ;; Add function
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)

  ;; Subtract function
  (func $sub (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.sub)

  ;; Multiply function
  (func $mul (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.mul)

  ;; Divide function
  (func $div (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.div_s)

  ;; Conditional: check equality
  (func $isEqual (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.eq)

  ;; Export all functions
  (export "add" (func $add))
  (export "sub" (func $sub))
  (export "mul" (func $mul))
  (export "div" (func $div))
  (export "isEqual" (func $isEqual)))
```

## Understanding Syntax

| Instruction | Description |
|-------------|-------------|
| `local.get` | Push local variable onto stack |
| `i32.add` | Pop two values, add, push result |
| `param $name type` | Declare function parameter |
| `result type` | Declare return type |
| `export "name"` | Export function for JavaScript |

## What's Next

You've built your first WASM module! Next, learn how to [compile with Rust](./4-rust-wasm) for more complex projects.

::: tip Challenge
Try creating a WASM module that calculates the Fibonacci sequence. Test it with different values!
:::
