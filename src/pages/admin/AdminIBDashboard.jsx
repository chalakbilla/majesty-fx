import { useState } from 'react';
import {
  ChevronRight,
  Download,
  Eye,
  MailCheck,
  RefreshCw,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { ibPartners } from '../../data/adminData.js';

export default function AdminIBDashboard() {
  const [search, setSearch] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');

  const filteredPartners = ibPartners.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-montserrat">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-purple-50/30 rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Admin Console</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-semibold">IB Management</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                IB Management <span className="text-[#ff5a0a]">Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time partner performance, affiliate downlines, volume rebates, and payout status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Total IB Partners
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">3</div>
          <div className="text-xs text-slate-500 mt-1">Active verified introducers</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Referred Clients
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">35</div>
          <div className="text-xs text-slate-500 mt-1">Direct trader accounts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Total Commission Paid
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">$7,675.00</div>
          <div className="text-xs text-slate-500 mt-1">Cumulative volume payouts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Pending IB Withdrawals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">$0.00</div>
          <div className="text-xs text-slate-500 mt-1">All queued requests settled</div>
        </div>
      </div>

      {/* Top Performing IB Partners Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-sora text-base sm:text-lg font-bold text-slate-900">
              Top Performing IB Partners
            </h2>
            <p className="text-xs text-slate-500">Network Leaders & Commission Breakdown</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search partner, code, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="py-1.5 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#7c3aed]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider font-sora">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">IB Partner</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Referred Clients</th>
                <th className="py-3 px-4">Trading Volume</th>
                <th className="py-3 px-4">Total Commissions</th>
                <th className="py-3 px-4">Commission Balance</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 font-sora">{item.name}</div>
                    <div className="text-[11px] text-purple-700 font-mono font-semibold">{item.code}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono">{item.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.clientsCount} Clients
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono text-slate-800">{item.volume}</td>
                  <td className="py-3.5 px-4 font-bold font-mono text-emerald-600">{item.totalCommission}</td>
                  <td className="py-3.5 px-4 font-bold font-mono text-slate-900">{item.balance}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {item.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 transition-colors"
                    >
                      View Network
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pager */}
        <div className="p-3 sm:px-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to {filteredPartners.length} of {filteredPartners.length} entries</span>
          <div className="flex items-center gap-1 font-semibold">
            <button type="button" className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
              Prev
            </button>
            <span className="px-2.5 py-1 rounded bg-[#7c3aed] text-white">1</span>
            <button type="button" className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
