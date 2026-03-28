# 调试技巧

调试 WebAssembly 需要结合浏览器工具、编译器设置和最佳实践。

## 浏览器 DevTools

### Chrome/Edge

1. 打开 DevTools (F12)
2. 进入 **Sources** 面板
3. 在文件树中找到 WASM 文件
4. 直接在 WAT 视图中设置断点

## 源映射

### 生成源映射

```bash
# 使用 wasm-pack
wasm-pack build --dev --source-map
```

### 源映射支持

```javascript
// 现代浏览器支持 WASM 源映射
const response = await fetch('/module.wasm');
const { instance } = await WebAssembly.instantiateStreaming(response, {
  env: { /* 导入 */ }
});

// DevTools 会显示原始源代码位置
instance.exports.process(42); // 在源代码中设置断点
```

## 从 WASM 输出日志

### Rust 中的控制台日志

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!(concat!($($t)*), "").to_string()))
}

#[wasm_bindgen]
pub fn debug_value(x: i32) -> i32 {
    console_log!("处理值: {}", x);
    x * 2
}
```

## 内存检查

### 读取 WASM 内存

```javascript
// 访问导出的内存
const memory = instance.exports.memory;

// 创建类型化数组视图
const int32View = new Int32Array(memory.buffer);
const uint8View = new Uint8Array(memory.buffer);

// 读取指定地址的值
function readInt32(ptr) {
    return int32View[ptr / 4];
}

function readString(ptr) {
    const len = int32View[(ptr / 4) - 1]; // 假设长度存储在指针前
    const bytes = uint8View.slice(ptr, ptr + len);
    return new TextDecoder().decode(bytes);
}
```

## 常见调试场景

| 场景 | 症状 | 解决方案 |
|------|------|----------|
| 值错误 | 输出不符合预期 | 检查类型转换、内存布局 |
| 崩溃 | 页面冻结或抛出错误 | 添加日志，检查无限循环 |
| 内存问题 | 数据损坏 | 验证缓冲区大小、对齐 |
| 链接错误 | 缺少导入 | 提供所有必需的导入 |
| 类型错误 | 调用失败 | 精确匹配函数签名 |

## 外部工具

### wasm-objdump

```bash
# 检查 WASM 二进制文件
wasm-objdump -h module.wasm    # 头部
wasm-objdump -d module.wasm    # 反汇编
wasm-objdump --section=NAME module.wasm  # 特定段
```

### wasm2wat

```bash
# 转换为文本以便检查
wasm2wat module.wasm -o module.wat
```

### Twiggy

```bash
# 分析代码大小
twiggy top module.wasm
twiggy calls module.wasm
twiggy unreachable module.wasm
```

---

继续学习 [高级应用](../4-advanced/1-threads)的多线程和更多内容。
