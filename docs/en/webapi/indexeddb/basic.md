---
title: IndexedDB Basic Usage
description: Open database, CRUD operations — core operations of IndexedDB
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
:::

## Open Database

`indexedDB.open()` returns a request object; get database instance via `onsuccess`:

```js
const request = indexedDB.open('MyAppDB', 1);

// Triggered when database version upgrades (also triggers on first creation)
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  console.log('Database version:', db.version);
};

// Successfully opened
request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('Database opened');
};

// Error
request.onerror = (event) => {
  console.error('Failed to open database:', event.target.error);
};
```

:::warning Version number can only increase
The version number passed when opening database must be >= current version. `onupgradeneeded` is called on upgrade. Version numbers can only go up, never down.
:::

## Create Object Store

Create object store (store) in `onupgradeneeded` callback:

```js
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Create users store, primary key is id
  if (!db.objectStoreNames.contains('users')) {
    const store = db.createObjectStore('users', { keyPath: 'id' });
    // Create index on id field
    store.createIndex('email', 'email', { unique: true });
    store.createIndex('name', 'name');
  }
};
```

### keyPath vs autoIncrement

| Option | Description |
|--------|-------------|
| `keyPath: 'id'` | Primary key from a field of the record object, must be unique |
| `autoIncrement: true` | Primary key auto-generated integer (starting from 1), no need to provide in record |

Choose one, they cannot be used together.

## Create (Add / Put)

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');

// add: throws error on duplicate primary key
store.add({ id: 1, name: 'Alice', email: 'alice@example.com', age: 25 });

// put: overwrites on duplicate primary key (upsert behavior)
store.put({ id: 2, name: 'Bob', email: 'bob@example.com', age: 30 });
```

## Read (Get)

```js
const tx = db.transaction('users', 'readonly');
const store = tx.objectStore('users');

// Get one by primary key
const req1 = store.get(1);
req1.onsuccess = () => console.log(req1.result);

// Get all
const req2 = store.getAll();
req2.onsuccess = () => console.log(req2.result);

// Get via index
const index = store.index('email');
const req3 = index.get('alice@example.com');
req3.onsuccess = () => console.log(req3.result);
```

## Update (Put)

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');

// Overwrite entire record (must include primary key field)
store.put({ id: 1, name: 'Alice Updated', email: 'alice@example.com', age: 26 });
```

## Delete

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');

// Delete one by primary key
store.delete(1);

// Clear entire store
store.clear();
```

## Notes

- **Every operation needs `db.transaction()`**: Transactions auto-commit when all operations complete, no manual commit needed
- **Transactions must stay active**: If you `await` async operations inside a transaction callback, the transaction may have closed (browser's transaction timeout mechanism)
- **keyPath cannot be modified**: Can only "modify" a primary key by deleting old record and adding new one
