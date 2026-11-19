import { useState } from 'react';
import { Activity, Download, FileSpreadsheet, RefreshCw, Search } from 'lucide-react';

export default function AdminTradeReport() {
  const [search, setSearch] = useState('');
  const trades = [
    { ticket: '984102', account: '800106', symbol: 'EURUSD', type: 'BUY', volume: '1.50', openPrice: '1.05420', closePrice: '1.05640', profit: '+$330.00', time: '2026-11-17 14:22' },
    { ticket: '984103', account: '800107', symbol: 'XAUUSD', type: 'SELL', volume: '0.50', openPrice: '2615.40', closePrice: '2608.10', profit: '+$365.00', time: '2026-11-17 13:50' },
    { ticket: '984104', account: '800104', symbol: 'GBPUSD', type: 'BUY', volume: '2.00', openPrice: '1.26110', closePrice: '1.26420', profit: '+$620.00', time: '2026-11-17 11:15' },
    { ticket: '984105', account: '800103', symbol: 'BTCUSD', type: 'BUY', volume: '0.10', openPrice: '91200.00', closePrice: '92150.00', profit: '+$95.00', time: '2026-11-17 09:30' },
  ];

  const filtered = trades.filter((t) => !search || t.account.includes(search) || t.symbol.toLowerCase().includes(search.toLowerCase()));

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
          <span className="text-xs text-slate-500 font-bold">{filtered.length} Trades Logged</span>
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
              {filtered.map((t) => (
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
                  <td className="py-3 px-4 font-bold text-emerald-600">{t.profit}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
