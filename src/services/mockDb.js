/**
 * mockDb — a tiny JSON-backed "database" for the admin dashboard.
 *
 * - Each collection is seeded from a static JSON file (src/data/json/*.json).
 * - Changes are persisted to localStorage, so they survive a refresh.
 * - Every collection is a shared store: any page/component that uses the same
 *   collection name sees the same data (e.g. approving a pending master
 *   account makes it appear on the approved page).
 * - Exposes the usual CRUD operations plus `reset()` back to the JSON seed.
 */

const registry = new Map(); // name -> definition
const stores = new Map(); // name -> { items, listeners }

const hasStorage = () => {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export function genId(prefix = 'id') {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Register a collection. `seed` is the parsed JSON array. */
export function defineCollection(name, { seed, storageKey, idKey = 'id', idPrefix }) {
  registry.set(name, {
    name,
    seed: Array.isArray(seed) ? seed : [],
    storageKey: storageKey || `majesty_admin_${name}`,
    idKey,
    idPrefix: idPrefix || name,
  });
}

function readPersisted(def) {
  if (!hasStorage()) return null;
  try {
    const raw = localStorage.getItem(def.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persist(def, items) {
  if (!hasStorage()) return;
  try {
    localStorage.setItem(def.storageKey, JSON.stringify(items));
  } catch {
    /* storage full / blocked – state still lives in memory */
  }
}

function getDef(name) {
  const def = registry.get(name);
  if (!def) throw new Error(`mockDb: collection "${name}" is not defined`);
  return def;
}

function getStore(name) {
  let store = stores.get(name);
  if (!store) {
    const def = getDef(name);
    const saved = readPersisted(def);
    store = { items: saved ?? clone(def.seed), listeners: new Set() };
    stores.set(name, store);
  }
  return store;
}

function commit(name, items) {
  const def = getDef(name);
  const store = getStore(name);
  store.items = items; // new array reference -> triggers React re-render
  persist(def, items);
  store.listeners.forEach((l) => l());
}

/* ---------------------------------- API ---------------------------------- */

export const mockDb = {
  subscribe(name, listener) {
    const store = getStore(name);
    store.listeners.add(listener);
    return () => store.listeners.delete(listener);
  },

  /** Stable snapshot (same reference until the collection changes). */
  snapshot(name) {
    return getStore(name).items;
  },

  list(name) {
    return getStore(name).items;
  },

  get(name, id) {
    const { idKey } = getDef(name);
    return getStore(name).items.find((r) => r[idKey] === id) ?? null;
  },

  /** CREATE – prepends by default (newest first, like the real dashboard). */
  create(name, record, { append = false } = {}) {
    const def = getDef(name);
    const created = { ...record };
    if (created[def.idKey] === undefined || created[def.idKey] === '') {
      created[def.idKey] = genId(def.idPrefix);
    }
    const items = getStore(name).items;
    commit(name, append ? [...items, created] : [created, ...items]);
    return created;
  },

  /** UPDATE – shallow-merges `patch` (or the result of a function) into the record. */
  update(name, id, patch) {
    const { idKey } = getDef(name);
    let updated = null;
    const next = getStore(name).items.map((r) => {
      if (r[idKey] !== id) return r;
      updated = { ...r, ...(typeof patch === 'function' ? patch(r) : patch) };
      return updated;
    });
    if (updated) commit(name, next);
    return updated;
  },

  /** UPDATE MANY – patch every record matching `predicate`. */
  updateWhere(name, predicate, patch) {
    let count = 0;
    const next = getStore(name).items.map((r) => {
      if (!predicate(r)) return r;
      count += 1;
      return { ...r, ...(typeof patch === 'function' ? patch(r) : patch) };
    });
    if (count) commit(name, next);
    return count;
  },

  /** DELETE */
  remove(name, id) {
    const { idKey } = getDef(name);
    const items = getStore(name).items;
    const next = items.filter((r) => r[idKey] !== id);
    if (next.length !== items.length) commit(name, next);
    return next.length !== items.length;
  },

  removeWhere(name, predicate) {
    const items = getStore(name).items;
    const next = items.filter((r) => !predicate(r));
    if (next.length !== items.length) commit(name, next);
    return items.length - next.length;
  },

  /** Replace the whole collection (bulk save). */
  replaceAll(name, items) {
    commit(name, Array.isArray(items) ? items : []);
  },

  /** Restore the original JSON seed. */
  reset(name) {
    const def = getDef(name);
    const fresh = clone(def.seed);
    commit(name, fresh);
    return fresh;
  },

  /** Move a record from one collection to another (e.g. pending -> rejected). */
  move(fromName, toName, id, patch = {}) {
    const record = this.get(fromName, id);
    if (!record) return null;
    this.remove(fromName, id);
    return this.create(toName, { ...record, ...patch });
  },
};

/** Next numeric id for collections that use auto-increment numbers. */
export function nextNumericId(items, idKey = 'id') {
  return items.reduce((max, r) => Math.max(max, Number(r[idKey]) || 0), 0) + 1;
}
