---
title: IndexedDB 进阶用法
description: 索引、游标、分页、版本迁移、性能优化 — 让 IndexedDB 在生产环境可靠运行
outline: [2, 3]
---

:::tip 浏览器支持
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
:::

## 索引查询

索引是快速查询的核心。在 `onupgradeneeded` 中创建：

```js
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('products', { keyPath: 'id' });

  // 创建多个索引
  store.createIndex('category', 'category');
  store.createIndex('price', 'price');
  store.createIndex('name', 'name');
  store.createIndex('inStock', 'inStock', { unique: false });
};
```

### 索引查询方法

| 方法 | 说明 |
|------|------|
| `index.get(value)` | 按索引值精确查询，返回第一条 |
| `index.getAll([query])` | 返回所有匹配的记录 |
| `index.getAllKeys([query])` | 只返回主键，不返回整条记录（更省内存） |
| `index.count([query])` | 返回匹配记录的数量 |

```js
const tx = db.transaction('products', 'readonly');
const store = tx.objectStore('products');

// 查询所有电子产品
const index = store.index('category');
const req = index.getAll('electronics');

// 价格范围查询（100 ~ 500）
const range = IDBKeyRange.bound(100, 500);
const priceIndex = store.index('price');
const priceReq = priceIndex.getAll(range);
```

## 游标（Cursor）

游标遍历比 `getAll()` 更省内存，适合大数据集：

```js
const tx = db.transaction('products', 'readonly');
const store = tx.objectStore('products');
const index = store.index('price');

// 打开游标，按价格升序遍历
const cursor = index.openCursor(IDBKeyRange.lowerBound(100));

cursor.onsuccess = (event) => {
  const cur = event.target.result;
  if (!cur) return; // 遍历结束
  console.log('产品:', cur.value.name, '价格:', cur.value.price);
  cur.continue();
};
```

### 游标方向

```js
index.openCursor(null, 'next');      // 默认：升序
index.openCursor(null, 'prev');      // 降序
index.openCursor(null, 'nextunique'); // 跳过重复值
```

## 键范围（IDBKeyRange）

精确值、范围、开区间/闭区间自由组合：

```js
const { upperBound, lowerBound, bound, only } = IDBKeyRange;

only(100);                           // 只有 100
lowerBound(100);                     // >= 100
upperBound(500);                     // < 500
bound(100, 500);                     // >= 100 && < 500（闭区间）
bound(100, 500, false, false);     // > 100 && <= 500（开区间）
```

## 版本迁移

`onupgradeneeded` 是做 schema 迁移的唯一地方。以下是一个多版本迁移示例：

```js
const request = indexedDB.open('MyAppDB', 3); // 升级到版本 3

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const oldVersion = event.oldVersion;

  if (oldVersion < 2) {
    db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
  }

  if (oldVersion < 3) {
    if (!db.objectStoreNames.contains('users')) {
      const store = db.createObjectStore('users', { keyPath: 'id' });
      store.createIndex('email', 'email', { unique: true });
    }
    const store = db.objectStore('users');
    if (!store.indexNames.contains('age')) {
      store.createIndex('age', 'age');
    }
  }
};
```

:::warning onupgradeneeded 里不能 await
`onupgradeneeded` 是同步回调，不能在里面 `await`。所有 schema 变更必须同步完成。
:::

## 性能建议

| 建议 | 原因 |
|------|------|
| 批量写入用单条事务 | 每条事务有固定开销 |
| 大字段存为 `Blob` | Blob 存储在 IndexedDB 的独立区域，不会阻塞主数据库 |
| 查询用索引不用全表扫描 | `store.getAll()` 会遍历全表，索引查询 O(log n) |
| 及时关闭事务 | 长时间开启的事务会阻塞 schema 升级 |

## 注意事项

- **`IDBKeyRange.only()` 只能匹配唯一值**：如果索引不唯一，`get()` 只返回第一条
- **索引更新不是实时的**：如果修改了记录中已建索引的字段，索引会自动更新，不需要手动重建
- **游标遍历期间不要修改仓库结构**：会导致游标意外结束
