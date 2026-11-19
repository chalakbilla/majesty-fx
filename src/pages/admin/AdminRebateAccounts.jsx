import { useState } from 'react';
import {
  DollarSign,
  Download,
  Layers,
  PieChart,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import { initialRebateAccounts } from '../../data/adminData.js';

export default function AdminRebateAccounts() {
  const [accounts, setAccounts] = useState(initialRebateAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filtered = accounts.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.partnerName.toLowerCase().includes(q) ||
      a.partnerEmail.toLowerCase().includes(q) ||
      a.referralCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
              <span className="text-slate-900 font-extrabold">Rebate</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Accounts</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Audit real-time IB rebate accounts and category-based payout balances
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">$7,675.00</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Rebates Paid</div>
            <div className="text-[11px] text-slate-400">Cumulative volume rebate</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">3</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Rebate Accounts</div>
            <div className="text-[11px] text-slate-400">Active Earning IBs</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">767.50</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Volume Settled</div>
            <div className="text-[11px] text-slate-400">Total MT5 Lots</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">$10.00</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Avg Rate / Lot</div>
            <div className="text-[11px] text-slate-400">Blended Payout</div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-sora font-extrabold text-sm text-slate-900">
            IB Rebate Ledger
          </h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partner..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none w-48 sm:w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Partner</th>
                <th className="py-3 px-4">Referral Code</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-3">Forex</th>
                <th className="py-3 px-3">Metals</th>
                <th className="py-3 px-3">Crypto</th>
                <th className="py-3 px-3">Indices</th>
                <th className="py-3 px-3">Clients</th>
                <th className="py-3 px-4">Volume (Lots)</th>
                <th className="py-3 px-4">Total Rebate</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{acc.partnerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{acc.partnerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{acc.referralCode}</td>
                  <td className="py-3.5 px-4 font-medium">Tier {acc.tier}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{acc.forex}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{acc.metals}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{acc.crypto}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{acc.indices}</td>
                  <td className="py-3.5 px-3 font-semibold">{acc.clients}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{acc.volume}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-600">{acc.totalRebate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      {acc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
