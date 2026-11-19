import { useState } from 'react';
import {
  CheckCircle,
  CreditCard,
  Download,
  Inbox,
  RefreshCw,
  Search,
  Wallet,
} from 'lucide-react';

export default function AdminIBCommissionWithdrawalHistory() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filtered = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.reqId.toLowerCase().includes(q) ||
        r.ibName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-slate-900">IB Commission</span>{' '}
            <span className="text-orange-600">Withdrawal History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Live record of commission payout requests from registered IB Partners
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching screenshot media_1795073277303_107f1505.png */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Withdrawn */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">$0.00</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Withdrawn</div>
            <div className="text-[11px] text-slate-400">Net Commission Payouts</div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">0</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Pending Approvals</div>
            <div className="text-[11px] text-slate-400">Queued Requests</div>
          </div>
        </div>

        {/* Average Payout */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">$0.00</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Average Payout</div>
            <div className="text-[11px] text-slate-400">Per Settled Request</div>
          </div>
        </div>

        {/* Completed Payouts */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">0</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Completed Payouts</div>
            <div className="text-[11px] text-slate-400">Total Transfers Completed</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {/* Purple Bar Header */}
        <div className="bg-[#4338ca] text-white px-5 py-3.5 flex items-center justify-between">
          <h2 className="font-sora font-bold text-sm">
            IB Commission Payout Requests <span className="opacity-80 font-normal">({requests.length} requests)</span>
          </h2>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by IB name, email, request ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table / Empty State matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">REQ ID</th>
                <th className="py-3 px-3">IB NAME</th>
                <th className="py-3 px-3">EMAIL</th>
                <th className="py-3 px-3">AMOUNT</th>
                <th className="py-3 px-3">METHOD</th>
                <th className="py-3 px-3">DESTINATION DETAILS</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3">REQUESTED DATE</th>
                <th className="py-3 px-3">PROCESSED DATE</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-20 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="text-base font-bold text-slate-800">
                        No IB commission withdrawal requests found.
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        When IB partners request a payout of their withdrawable commission, the
                        requests will appear here for review and settlement.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td className="py-3 px-3">{i + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{r.reqId}</td>
                    <td className="py-3 px-3 font-semibold">{r.ibName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{r.email}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{r.amount}</td>
                    <td className="py-3 px-3 uppercase text-[11px] font-semibold">{r.method}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{r.destination}</td>
                    <td className="py-3 px-3">{r.status}</td>
                    <td className="py-3 px-3 font-mono text-[11px]">{r.date}</td>
                    <td className="py-3 px-3 font-mono text-[11px]">{r.processedDate || '—'}</td>
                    <td className="py-3 px-3 text-right">—</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
