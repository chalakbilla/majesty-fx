import { useState } from 'react';
import {
  ChevronRight,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  Users,
} from 'lucide-react';
import { ibClients, ibPartners } from '../../data/adminData.js';

export default function AdminIBClients() {
  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('all');

  const filteredClients = ibClients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.account.toLowerCase().includes(search.toLowerCase()) ||
      c.partner.toLowerCase().includes(search.toLowerCase());

    const matchesPartner =
      partnerFilter === 'all' || c.partnerCode === partnerFilter;

    return matchesSearch && matchesPartner;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-montserrat">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-purple-50/30 rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Admin Console</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-semibold">IB Partner Network</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                IB Partner Network <span className="text-[#ff5a0a]">Clients</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Full downline directory of retail traders allocated across registered master IB partners.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#ff5a0a] hover:bg-[#ea580c] rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Client to IB</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by client name, email, account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#7c3aed]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium outline-none cursor-pointer"
          >
            <option value="all">All Master IBs</option>
            {ibPartners.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-sora text-base sm:text-lg font-bold text-slate-900">
            Referred Traders Directory ({filteredClients.length})
          </h2>
          <span className="text-xs text-slate-500">Live MT5 bridge allocation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider font-sora">
                <th className="py-3 px-4">Client ID</th>
                <th className="py-3 px-4">Trader Name</th>
                <th className="py-3 px-4">Assigned IB Partner</th>
                <th className="py-3 px-4">MT5 Account</th>
                <th className="py-3 px-4">Volume (Lots)</th>
                <th className="py-3 px-4">Current Equity</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-700">{c.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{c.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{c.partner}</div>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-purple-50 text-purple-700 rounded border border-purple-200">
                      {c.partnerCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{c.account}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{c.volume}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{c.equity}</td>
                  <td className="py-3.5 px-4 text-slate-500">{c.registered}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
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
