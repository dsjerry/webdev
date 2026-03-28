---
title: IndexedDB Overview
description: What is IndexedDB and why it's the preferred choice for browser storage
outline: [2, 3]
---

:::tip Browser Support
Chrome 4+ · Firefox 4+ · Safari 8+ · Edge 12+
All modern browsers support it, including mobile.
:::

## Overview

Browser local storage has three paths: `localStorage`, `IndexedDB`, and `Cache API` (paired with Service Worker). `localStorage` only stores strings, has small capacity, blocks synchronously; `IndexedDB` is a complete local database.

**IndexedDB** is a browser-native NoSQL database that stores large structured data locally, supports indexed queries, transactions, cursor traversal, with capacity reaching hundreds of MB or even GB (depending on disk space).

In short: Want to store large amounts of data in the browser, work offline, query fast? IndexedDB is the answer.

## Core Differences from localStorage

| | localStorage | IndexedDB |
|--|-------------|-----------|
| Data types | Strings only | Any structurable-cloneable value (including binary) |
| Capacity | ~5MB | Hundreds of MB to GB level |
| API style | Synchronous (blocks main thread) | Asynchronous (Promise / events) |
| Query ability | None (key-only) | Indexes, range queries, cursors |
| Transaction support | None | Atomic operations |
| Use cases | Small configs, user preferences | Large business data, offline storage |

## Core Concepts

IndexedDB's data model has four layers:

### 1. Database

A database can contain multiple object stores, similar to MySQL's "database" concept:

```js
// Open database (created automatically if doesn't exist)
const request = indexedDB.open('MyAppDB', 1);
```

### 2. Object Store

Similar to a "table" concept, but each record is an object (JavaScript object):

```js
// Create in versionchange transaction
db.createObjectStore('users', { keyPath: 'id' });
db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
```

### 3. Index

Create indexes on object stores for fast field queries, similar to database indexes:

```js
const store = db.createObjectStore('users', { keyPath: 'id' });
store.createIndex('email', 'email', { unique: true });  // Query by email
store.createIndex('age', 'age');                        // Query by age
```

### 4. Transaction

All read/write operations must happen inside a transaction, ensuring atomicity:

```js
const tx = db.transaction('users', 'readwrite');
const store = tx.objectStore('users');
store.add({ id: 1, name: 'Alice', email: 'alice@example.com' });
```

## Quick Start

```js
// Open database
const openDB = (name, version) =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(name, version);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });

(async () => {
  const db = await openDB('DemoDB', 1);

  // Write
  const tx = db.transaction('notes', 'readwrite');
  await tx.objectStore('notes').add({ title: 'Hello', content: 'World' });

  // Read (by key)
  const tx2 = db.transaction('notes', 'readonly');
  const req = tx2.objectStore('notes').get(1);
  req.onsuccess = () => console.log(req.result); // { id: 1, title: 'Hello', ... }
})();
```

## Notes

- **API style is old**: IndexedDB's native API uses events and request objects, leading to deeply nested code; in real projects use `idb` or `Dexie.js` wrapper libraries
- **Version upgrade is synchronous**: Schema changes in `onupgradeneeded` callback must be done synchronously, cannot await
- **Transactions cannot span databases**: A transaction can only operate on object stores in the same database
- **Key types**: Primary keys (keyPath) can only be strings, dates, numbers, or ArrayBuffer, not objects
