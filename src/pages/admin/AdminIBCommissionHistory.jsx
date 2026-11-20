import { useState } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  Clock,
  Download,
  FileSpreadsheet,
  Layers,
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';

export default function AdminIBCommissionHistory() {
  const { items: transactions, setItems: setTransactions } = useCollection('ibCommissionHistory');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  // Form for manual record commission
  const [partner, setPartner] = useState('Demo Partner (IB)');
  const [client, setClient] = useState('Sofia Al-Mansoor');
  const [symbol, setSymbol] = useState('EURUSD');
  const [volume, setVolume] = useState('1.00');
  const [rate, setRate] = useState('8.00');

  const handleRecordCommission = (e) => {
    e.preventDefault();
    const amount = (parseFloat(volume) * parseFloat(rate)).toFixed(2);
    const newTx = {
      id: `ibc-${Date.now().toString(36)}`,
      txId: `TX-IB${Date.now().toString().slice(-6)}`,
      partner,
      client,
      ticket: `#${Math.floor(100000 + Math.random() * 900000)}`,
      symbol,
      volume: `${parseFloat(volume).toFixed(2)} Lots`,
      rate: `$${parseFloat(rate).toFixed(2)} / lot`,
      amount: `$${amount}`,
      status: 'SETTLED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setTransactions([newTx, ...transactions]);
    setRecordModalOpen(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = [
      '#',
      'TX ID',
      'IB PARTNER',
      'CLIENT NAME',
      'TICKET',
      'SYMBOL',
      'VOLUME',
      'RATE',
      'AMOUNT',
      'STATUS',
      'TIMESTAMP',
    ];
    const rows = filtered.map((t) => [
      t.id,
      t.txId,
      t.partner,
      t.client,
      t.ticket,
      t.symbol,
      t.volume,
      t.rate,
      t.amount,
      t.status,
      t.timestamp,
    ]);

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute(
      'download',
      `ib_commission_history_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = transactions.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.txId.toLowerCase().includes(q) ||
        t.partner.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        t.symbol.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCommissions = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount.replace('$', '')),
    0
  );
  const totalLots = transactions.reduce(
    (sum, t) => sum + parseFloat(t.volume.replace(' Lots', '')),
    0
  );

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Top Header Card matching reference image media_1795100631919_71ed2304.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black tracking-tight leading-tight" style={{ fontWeight: 900 }}>
              <span className="text-slate-900 font-black" style={{ color: 'rgb(15, 23, 42)', fontWeight: 900 }}>
                IB
              </span>{' '}
              <span className="font-black text-orange-600 tracking-tight" style={{ color: 'rgb(249, 115, 22)', fontWeight: 900 }}>
                Commission History
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Real-time commission settlement audit and multi-tier rebate logs
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer hover:opacity-95"
              style={{ backgroundColor: '#ff6600' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Commission</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards matching screenshot media_1795073230242_0978ee32.png */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Commissions Paid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              ${totalCommissions.toFixed(2)}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Commissions Paid</div>
            <div className="text-[11px] text-slate-400">Settled Net Commissions</div>
          </div>
        </div>

        {/* Pending Settlement */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">$0.00</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Pending Settlement</div>
            <div className="text-[11px] text-slate-400">Awaiting Batch Release</div>
          </div>
        </div>

        {/* Total Lots Processed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {totalLots.toFixed(2)} Lots
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Lots Processed</div>
            <div className="text-[11px] text-slate-400">Turnover Volume</div>
          </div>
        </div>

        {/* Active Affiliates */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {transactions.length > 0 ? 1 : 0}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">Active Affiliates</div>
            <div className="text-[11px] text-slate-400">Generating Rebates</div>
          </div>
        </div>
      </div>

      {/* Main Commission Transactions Log Card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Purple Bar Header */}
        <div className="bg-[#4338ca] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-200" />
            <h2 className="font-sora font-bold text-sm">
              Commission Transactions Log ({transactions.length} records)
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by IB, client, symbol, TX ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SETTLED">Settled</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filtered.length}</strong> real transactions
          </div>
        </div>

        {/* Table / Empty State matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">TX ID</th>
                <th className="py-3 px-3">IB PARTNER</th>
                <th className="py-3 px-3">CLIENT NAME</th>
                <th className="py-3 px-3">TICKET</th>
                <th className="py-3 px-3">SYMBOL</th>
                <th className="py-3 px-3">VOLUME</th>
                <th className="py-3 px-3">RATE</th>
                <th className="py-3 px-3">AMOUNT</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="max-w-md mx-auto space-y-2">
                      <div className="text-base font-bold text-slate-800">
                        No commission history records found
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        No commissions have been settled yet. Commissions are created automatically
                        when referred clients close MT5 trades, or manually via &quot;Record Commission&quot;.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono text-slate-400">{tx.id}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{tx.txId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{tx.partner}</td>
                    <td className="py-3 px-3">{tx.client}</td>
                    <td className="py-3 px-3 font-mono">{tx.ticket}</td>
                    <td className="py-3 px-3 font-bold">{tx.symbol}</td>
                    <td className="py-3 px-3">{tx.volume}</td>
                    <td className="py-3 px-3">{tx.rate}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{tx.amount}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{tx.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Commission Modal */}
      {recordModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setRecordModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-sora font-extrabold text-base text-slate-900">
                Record Commission Payout
              </h3>
              <button
                type="button"
                onClick={() => setRecordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordCommission} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  IB Partner
                </label>
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 bg-white"
                >
                  <option value="Demo Partner (IB)">Demo Partner (IB)</option>
                  <option value="Alexander Wright">Alexander Wright</option>
                  <option value="Marcus Chen">Marcus Chen</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Referred Client
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Symbol
                  </label>
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Lots
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Rate ($/Lot)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 font-bold flex justify-between">
                <span>Calculated Commission:</span>
                <span>${(parseFloat(volume) * parseFloat(rate)).toFixed(2)}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Record Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
