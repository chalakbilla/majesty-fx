import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination footer built on the dashboard's existing `.table-pager` styles.
 * Pair it with `useTableControls`:  <TablePager table={table} />
 */
export default function TablePager({ table, sizes = [10, 25, 50, 100] }) {
  const { page, setPage, totalPages, pageSize, setPageSize, total, from, to } = table;

  // 1 … 4 5 [6] 7 8 … 20
  const pages = [];
  for (let p = 1; p <= totalPages; p += 1) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '…') pages.push('…');
  }

  return (
    <div className="table-pager">
      <span className="table-pager-info">
        Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{total}</strong> entries
      </span>
      <div className="table-pager-controls">
        <label className="table-pager-size">
          <span>Rows</span>
          <select aria-label="Rows per page" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <nav className="table-pager-pages" aria-label="Pages">
          <button
            type="button"
            className="table-pager-btn"
            disabled={page <= 1}
            aria-label="Previous page"
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={13} /> <span>Prev</span>
          </button>
          {pages.map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="table-pager-gap">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className="table-pager-btn table-pager-num"
                aria-current={p === page ? 'page' : undefined}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            className="table-pager-btn"
            disabled={page >= totalPages}
            aria-label="Next page"
            onClick={() => setPage(page + 1)}
          >
            <span>Next</span> <ChevronRight size={13} />
          </button>
        </nav>
      </div>
    </div>
  );
}
