# Import and Export

WebAssembly modules communicate through a well-defined import/export system. This enables powerful inter-module communication.

## Export System

Exports make functions, memory, and tables available to the outside world.

### Export Functions

```wat
(module
  (func (export "greet") (result i32)
    (i32.const 42)))

;; JavaScript usage:
const result = instance.exports.greet(); // 42
```

### Export Memory

```wat
(module
  (memory (export "memory") 1))

;; JavaScript usage:
const memory = instance.exports.memory;
const view = new Uint8Array(memory.buffer);
view[0] = 100;
```

## Import System

Imports let WASM use functions and memory provided by the host environment.

### Basic Import

```wat
(module
  (import "env" "log" (func $log (param i32)))
  (func (export "process") (param i32 i32)
    local.get 0
    local.get 1
    i32.add
    call $log))
```

```javascript
const importObject = {
  env: {
    log: (value) => console.log('WASM says:', value)
  }
};

const { instance } = await WebAssembly.instantiate(wasmBytes, importObject);
```

## Best Practices

1. **Organize by namespace** — Group imports by namespace (`console`, `env`, `js`)
2. **Type safety** — Exactly match WASM types with import signatures
3. **Error handling** — Use error codes or exceptions
4. **Minimize imports** — Each import has overhead

---

Continue learning [Type System](./4-types) for detailed type information.
