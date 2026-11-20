import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { mockDb } from '../services/mockDb.js';
import '../data/collections.js'; // makes sure every collection is registered

/**
 * React binding for a mockDb collection.
 *
 *   const { items, create, update, remove, reset } = useCollection('withdrawals');
 *
 * All pages that use the same collection name stay in sync automatically.
 */
export default function useCollection(name) {
  const subscribe = useCallback((cb) => mockDb.subscribe(name, cb), [name]);
  const getSnapshot = useCallback(() => mockDb.snapshot(name), [name]);
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const api = useMemo(
    () => ({
      create: (record, opts) => mockDb.create(name, record, opts),
      update: (id, patch) => mockDb.update(name, id, patch),
      updateWhere: (predicate, patch) => mockDb.updateWhere(name, predicate, patch),
      remove: (id) => mockDb.remove(name, id),
      removeWhere: (predicate) => mockDb.removeWhere(name, predicate),
      replaceAll: (next) => mockDb.replaceAll(name, next),
      // useState-style setter: setItems(list) or setItems(prev => list)
      setItems: (updater) =>
        mockDb.replaceAll(name, typeof updater === 'function' ? updater(mockDb.snapshot(name)) : updater),
      reset: () => mockDb.reset(name),
      get: (id) => mockDb.get(name, id),
      move: (toName, id, patch) => mockDb.move(name, toName, id, patch),
    }),
    [name]
  );

  return { items, ...api };
}
