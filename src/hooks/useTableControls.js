import { useEffect, useMemo, useState } from 'react';

const toText = (v) => (v === null || v === undefined ? '' : String(v).toLowerCase());

/**
 * Search + filter + pagination for any array of records.
 *
 *   const t = useTableControls(items, {
 *     searchFields: ['client', 'email', 'txId'],
 *     filters: { status: statusFilter },          // '' / 'all' / undefined = ignored
 *     pageSize: 10,
 *     resetKey: activeTab,   // optional – any value that should send you back to page 1
 *   });
 *   t.rows        -> rows of the current page
 *   t.filtered    -> every row matching search + filters (for export/stats)
 *   t.page, t.setPage, t.pageSize, t.setPageSize, t.totalPages, t.total
 *
 * `searchFields` entries may be a key or a function(record) => string.
 * A filter value may also be a function(record) => boolean.
 */
export default function useTableControls(
  items,
  { searchFields = [], filters = {}, pageSize: initialPageSize = 10, initialSearch = '', resetKey = '' } = {}
) {
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(Number(initialPageSize) || 10);

  const filterKey = JSON.stringify(
    Object.entries(filters).map(([k, v]) => [k, typeof v === 'function' ? 'fn' : v])
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((rec) => {
      for (const [key, value] of Object.entries(filters)) {
        if (typeof value === 'function') {
          if (!value(rec)) return false;
          continue;
        }
        if (value === '' || value === undefined || value === null) continue;
        if (typeof value === 'string' && value.toLowerCase() === 'all') continue;
        if (toText(rec[key]) !== toText(value)) return false;
      }
      if (!q) return true;
      return searchFields.some((f) => toText(typeof f === 'function' ? f(rec) : rec[f]).includes(q));
    });
  }, [items, search, filterKey]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Jump back to page 1 whenever the result set changes shape.
  useEffect(() => {
    setPage(1);
  }, [search, filterKey, pageSize, resetKey]);

  const safePage = Math.min(page, totalPages);
  const rows = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  return {
    search,
    setSearch,
    page: safePage,
    setPage,
    pageSize,
    setPageSize: (n) => setPageSize(Number(n) || 10),
    totalPages,
    total,
    filtered,
    rows,
    from: total === 0 ? 0 : (safePage - 1) * pageSize + 1,
    to: Math.min(safePage * pageSize, total),
  };
}
