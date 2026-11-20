import { useState } from 'react';
import { Search } from 'lucide-react';
import useCollection from '../../hooks/useCollection.js';
import useTableControls from '../../hooks/useTableControls.js';
import TablePager from '../../components/admin/TablePager.jsx';

export default function AdminTradeReport() {
  const [search, setSearch] = useState('');
  const { items: trades } = useCollection('trades');
  const [typeFilter, setTypeFilter] = useState('');
  const filtered = trades.filter(
    (t) =>
      (!typeFilter || t.type === typeFilter) &&
      (!search || t.account.includes(search) || t.ticket.includes(search) || t.symbol.toLowerCase().includes(search.toLowerCase()))
  );
  const table = useTableControls(filtered, { pageSize: 10, resetKey: `${search}|${typeFilter}` });

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-slate-900">Trade</span>{' '}
          <span className="text-orange-600">Report</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Real-time trade stream, MT5 tickets, closed orders, and commission volume analytics.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by account or symbol..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer">
              <option value="">All Types</option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
            <span className="text-xs text-slate-500 font-bold">{filtered.length} Trades Logged</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <th className="py-3 px-4">TICKET</th>
                <th className="py-3 px-4">ACCOUNT</th>
                <th className="py-3 px-4">SYMBOL</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">VOLUME</th>
                <th className="py-3 px-4">OPEN PRICE</th>
                <th className="py-3 px-4">CLOSE PRICE</th>
                <th className="py-3 px-4">NET PROFIT</th>
                <th className="py-3 px-4">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.rows.map((t) => (
                <tr key={t.ticket} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">#{t.ticket}</td>
                  <td className="py-3 px-4 font-mono">{t.account}</td>
                  <td className="py-3 px-4 font-bold">{t.symbol}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{t.volume} Lots</td>
                  <td className="py-3 px-4 font-mono">{t.openPrice}</td>
                  <td className="py-3 px-4 font-mono">{t.closePrice}</td>
                  <td className={`py-3 px-4 font-bold ${String(t.profit).startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{t.profit}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePager table={table} />
      </div>
    </div>
  );
}
