# 多线程

WebAssembly 通过 SharedArrayBuffer 和原子操作支持多线程。这使得真正的并行执行成为可能。

## SharedArrayBuffer

SharedArrayBuffer 允许线程间共享内存：

```javascript
// 创建共享内存
const sharedMemory = new SharedArrayBuffer(65536); // 64KB

// 创建视图
const sharedView = new Int32Array(sharedMemory);

// Worker 1
const worker1 = new Worker('worker1.js');
worker1.postMessage({ sharedBuffer: sharedMemory });

// Worker 2
const worker2 = new Worker('worker2.js');
worker2.postMessage({ sharedBuffer: sharedMemory });
```

## 原子操作

### 原子读取-修改-写入

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn atomic_increment(memory: &mut [i32], index: usize) -> i32 {
    let old = memory[index];
    memory[index] = old + 1;
    old + 1
}
```

## JavaScript 线程 API

### Worker 设置

```javascript
// main.js
const sharedMemory = new SharedArrayBuffer(65536);

const worker = new Worker('wasm-worker.js');
worker.postMessage({ type: 'init', memory: sharedMemory });

// 监听消息
worker.onmessage = (event) => {
    console.log('结果:', event.data.result);
};
```

### 生产者-消费者模式

```javascript
// 共享状态
const sharedMemory = new SharedArrayBuffer(65536);
const state = new Int32Array(sharedMemory);

// 常量
const EMPTY = 0;
const PRODUCING = 1;
const CONSUMING = 2;
const DONE = 3;

// 生产者线程
async function produce(items) {
    for (const item of items) {
        Atomics.wait(state, 0, EMPTY);
        state[1] = item;
        state[0] = CONSUMING;
        Atomics.notify(state, 0, 1);
    }
    state[0] = DONE;
    Atomics.notify(state, 0, 1);
}

// 消费者线程
async function consume() {
    while (true) {
        Atomics.wait(state, 0, CONSUMING);
        if (state[0] === DONE) break;
        const item = state[1];
        processItem(item);
        state[0] = EMPTY;
        Atomics.notify(state, 0, 1);
    }
}
```

## JavaScript 中的原子操作

```javascript
const sharedArray = new Int32Array(new SharedArrayBuffer(1024));

// 原子操作
Atomics.add(sharedArray, 0, 10);      // 加 10
Atomics.sub(sharedArray, 0, 5);       // 减 5
Atomics.and(sharedArray, 0, 0b1111);  // 位与
Atomics.or(sharedArray, 0, 0b1111);   // 位或
Atomics.xor(sharedArray, 0, 0b1111);  // 位异或

// 比较交换
const old = Atomics.compareExchange(sharedArray, 0, 5, 10);

// 加载和存储
const value = Atomics.load(sharedArray, 0);
Atomics.store(sharedArray, 0, value + 1);

// 等待和通知
Atomics.wait(sharedArray, 0, expectedValue, timeout);
Atomics.notify(sharedArray, 0, count);
```

## 浏览器要求

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| SharedArrayBuffer | 92+ | 79+ | 15.2+ | 92+ |
| Atomics | 92+ | 79+ | 15.2+ | 92+ |
| Worker | 所有 | 所有 | 所有 | 所有 |

::: warning 跨域隔离
SharedArrayBuffer 需要跨域隔离。设置以下响应头：
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
:::

## 性能考虑

| 方面 | 建议 |
|------|------|
| 粒度 | 使用细粒度原子操作 |
| 竞争 | 最小化锁持有时间 |
| 伪共享 | 将数据填充到不同的缓存行 |
| 内存 | 谨慎使用共享内存 |

---

继续学习 [垃圾回收](./2-gc)。
