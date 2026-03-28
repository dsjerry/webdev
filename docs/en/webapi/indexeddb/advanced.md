---
title: IndexedDB Advanced Usage
description: Indexes, cursors, pagination, version migration, performance optimization — make IndexedDB production-ready
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
:::

## Index Queries

Indexes are core to fast queries. Create in `onupgradeneeded`:

```js
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const store = db.createObjectStore('products', { keyPath: 'id' });

  // Create multiple indexes
  store.createIndex('category', 'category');
  store.createIndex('price', 'price');
  store.createIndex('name', 'name');
  store.createIndex('inStock', 'inStock', { unique: false });
};
```

### Index Query Methods

| Method | Description |
|--------|-------------|
| `index.get(value)` | Exact query by index value, returns first match |
| `index.getAll([query])` | Returns all matching records |
| `index.getAllKeys([query])` | Returns primary keys only (saves memory) |
| `index.count([query])` | Returns count of matching records |

```js
const tx = db.transaction('products', 'readonly');
const store = tx.objectStore('products');

// Query all electronics
const index = store.index('category');
const req = index.getAll('electronics');

// Price range query (100 ~ 500)
const range = IDBKeyRange.bound(100, 500);
const priceIndex = store.index('price');
const priceReq = priceIndex.getAll(range);
```

## Cursor

Cursors are more memory-efficient than `getAll()` for large datasets:

```js
const tx = db.transaction('products', 'readonly');
const store = tx.objectStore('products');
const index = store.index('price');

// Open cursor, traverse by price ascending
const cursor = index.openCursor(IDBKeyRange.lowerBound(100));

cursor.onsuccess = (event) => {
  const cur = event.target.result;
  if (!cur) return; // Traversal ended
  console.log('Product:', cur.value.name, 'Price:', cur.value.price);
  cur.continue();
};
```

### Cursor Direction

```js
index.openCursor(null, 'next');      // Default: ascending
index.openCursor(null, 'prev');      // Descending
index.openCursor(null, 'nextunique'); // Skip duplicate values
```

## Key Range (IDBKeyRange)

Exact values, ranges, open/closed intervals freely combined:

```js
const { upperBound, lowerBound, bound, only } = IDBKeyRange;

only(100);                           // Only 100
lowerBound(100);                     // >= 100
upperBound(500);                     // < 500
bound(100, 500);                     // >= 100 && < 500 (closed interval)
bound(100, 500, false, false);     // > 100 && <= 500 (open interval)
```

## Version Migration

`onupgradeneeded` is the only place for schema migration. Here's a multi-version migration example:

```js
const request = indexedDB.open('MyAppDB', 3); // Upgrade to version 3

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

:::warning Cannot await in onupgradeneeded
`onupgradeneeded` is a synchronous callback, cannot await inside. All schema changes must complete synchronously.
:::

## Performance Tips

| Tip | Reason |
|-----|--------|
| Batch writes use single transaction | Each transaction has fixed overhead |
| Large fields stored as `Blob` | Blob stored in IndexedDB's separate area, won't block main database |
| Use indexes for queries, not full table scans | `store.getAll()` traverses entire table, index query is O(log n) |
| Close transactions promptly | Long-running transactions block schema upgrades |

## Notes

- **`IDBKeyRange.only()` only matches unique values**: If index is not unique, `get()` returns only the first match
- **Index updates are not real-time**: If you modify an indexed field in a record, the index auto-updates; no manual rebuild needed
- **Don't modify store structure during cursor traversal**: Will cause cursor to unexpectedly end
