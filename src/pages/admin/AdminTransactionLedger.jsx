import { useState, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { useLocation } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Download,
  Filter,
  RefreshCw,
  Repeat,
  Search,
  Wallet,
  XCircle,
} from 'lucide-react';

// seed data lives in src/data/json (mockTransactions)

export default function AdminTransactionLedger({ defaultType = null, pageTitle = null }) {
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const path = location.pathname;

  const config = useMemo(() => {
    if (pageTitle) return { title: pageTitle, type: defaultType };
    if (path.includes('account-ledger')) return { title: 'Account Ledger', type: 'all' };
    if (path.includes('daily-inflow')) return { title: 'Daily Inflow', type: 'inflow' };
    if (path.includes('deposit-history')) return { title: 'Deposits', type: 'deposit' };
    if (path.includes('manual-deposit')) return { title: 'Manual Deposit', type: 'manual' };
    if (path.includes('withdraw-history')) return { title: 'Withdrawals', type: 'withdrawal' };
    if (path.includes('internal-transfer')) return { title: 'Internal Transfers', type: 'transfer' };
    if (path.includes('profit-commission')) return { title: 'Profit Commission Withdrawal History', type: 'profit_commission' };
    if (path.includes('credit-in-out')) return { title: 'Credit In/Out', type: 'credit' };
    if (path.includes('rejected-deposit')) return { title: 'Rejected Deposits', type: 'rejected_deposit' };
    if (path.includes('rejected-withdrawal')) return { title: 'Rejected Withdrawals', type: 'rejected_withdrawal' };
    return { title: 'Transactions & Money', type: 'all' };
  }, [path, pageTitle, defaultType]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const { items: mockTransactions } = useCollection('transactionLedger');

  const filtered = useMemo(() => {
    return mockTransactions.filter((tx) => {
      // Type filtering based on route
      if (config.type === 'deposit' && tx.type !== 'deposit') return false;
      if (config.type === 'withdrawal' && tx.type !== 'withdrawal') return false;
      if (config.type === 'transfer' && tx.type !== 'transfer') return false;
      if (config.type === 'profit_commission' && tx.type !== 'profit_commission') return false;
      if (config.type === 'credit' && tx.type !== 'credit') return false;
      if (config.type === 'rejected_deposit' && (tx.type !== 'deposit' || tx.status !== 'Rejected')) return false;
      if (config.type === 'rejected_withdrawal' && (tx.type !== 'withdrawal' || tx.status !== 'Rejected')) return false;

      // Status filter
      if (statusFilter !== 'all' && tx.status.toLowerCase() !== statusFilter.toLowerCase()) return false;

      // Search filter
      if (search) {
        const q = search.toLowerCase();
        return (
          tx.id.toLowerCase().includes(q) ||
          tx.account.toLowerCase().includes(q) ||
          tx.client.toLowerCase().includes(q) ||
          tx.email.toLowerCase().includes(q) ||
          tx.method.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [config.type, statusFilter, search]);

  const handleExportCSV = () => {
    const headers = ['TX ID', 'Account', 'Client', 'Email', 'Method', 'Amount', 'Fee', 'Status', 'Date'];
    const rows = filtered.map((t) => [
      t.id,
      t.account,
      t.client,
      t.email,
      t.method,
      t.amount,
      t.fee,
      t.status,
      t.date,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${config.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none">
            <span className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">Home</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-500">Transactions &amp; Money</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">{config.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">{config.title.split(' ')[0]}</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight">
                    {config.title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">
                  Real-Time Audit
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Cryptographic transaction audit trail, compliance verification status, and client ledger settlements.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                title="Refresh page data"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by TX ID, Account, Client, Method..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:bg-white transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
          Showing <span className="text-slate-900 font-bold">{filtered.length}</span> records
        </div>
      </div>

      {/* 3. Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">TX ID</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    {tx.account}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{tx.client}</div>
                    <div className="text-[11px] text-slate-500">{tx.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {tx.method}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {tx.amount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                    {tx.fee}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        tx.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'Approved'
                            ? 'bg-emerald-500'
                            : tx.status === 'Pending'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                    {tx.date}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                    No transactions matching the criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
