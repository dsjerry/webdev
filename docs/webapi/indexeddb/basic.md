---
title: IndexedDB 基础用法
description: 打开数据库、增删改查 — IndexedDB 的核心操作
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
:::

## 打开数据库

`indexedDB.open()` 返回一个请求对象，通过 `onsuccess` 获取数据库实例：

```js
const request = indexedDB.open('MyAppDB', 1);

// 数据库版本升级时触发（首次创建也会触发）
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  console.log('数据库版本:', db.version);
};

// 成功打开
request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('数据库已打开');
};

// 出错
request.onerror = (event) => {
  console.error('打开数据库失败:', event.target.error);
};
```

:::warning 版本号只能递增
每次打开数据库时传入的版本号必须 >= 当前版本。升级时 `onupgradeneeded` 会被调用。版本号只能升不能降。
:::

## 创建对象仓库

在 `onupgradeneeded` 回调中创建对象仓库（store）：

```js
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // 创建 users 仓库，主键为 id
  if (!db.objectStoreNames.contains('users')) {
    const store = db.createObjectStore('users', { keyPath: 'id' });
    // 在 id 字段上建索引
    store.createIndex('email', 'email', { unique: true });
    store.createIndex('name', 'name');
  }
};
```

### keyPath vs autoIncrement

| 选项 | 说明 |
|------|------|
| `keyPath: 'id'` | 主键取自记录对象的某个字段，必须保证唯一 |
| `autoIncrement: true` | 主键自动生成整数（从 1 开始递增），无需在记录里提供 |

两者二选一，不能同时使用。

## 增（Add / Put）

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');

// add：主键重复时报错
store.add({ id: 1, name: 'Alice', email: 'alice@example.com', age: 25 });

// put：主键重复时覆盖（upsert 行为）
store.put({ id: 2, name: 'Bob', email: 'bob@example.com', age: 30 });
```

## 查（Get）

```js
const tx = db.transaction('users', 'readonly');
const store = tx.objectStore('users');

// 按主键查一条
const req1 = store.get(1);
req1.onsuccess = () => console.log(req1.result);

// 查所有
const req2 = store.getAll();
req2.onsuccess = () => console.log(req2.result);

// 通过索引查
const index = store.index('email');
const req3 = index.get('alice@example.com');
req3.onsuccess = () => console.log(req3.result);
```

## 改（Put）

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');

// 覆盖整条记录（必须包含主键字段）
store.put({ id: 1, name: 'Alice Updated', email: 'alice@example.com', age: 26 });
```

## 删（Delete）

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');

// 按主键删一条
store.delete(1);

// 清空整个仓库
store.clear();
```

## 注意事项

- **每次操作都要 `db.transaction()`**：事务在所有操作完成后自动提交，不需要手动 commit
- **事务必须保持活跃**：如果在事务回调里 `await` 异步操作，事务可能已关闭（浏览器的事务超时机制）
- **keyPath 不能修改**：只能删除旧记录、添加新记录来"修改"主键
