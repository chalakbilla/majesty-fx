import { useState, useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';

const initialStatuses = [
  {
    id: 1,
    name: 'Active',
    description: 'Account in full operational status. Trading, deposits, and automated withdrawals permitted.',
    badge: 'Standard',
    color: 'emerald',
    active: true,
  },
  {
    id: 2,
    name: 'Pending KYC',
    description: 'Account awaiting identity & residence documents verification. Trading enabled, withdrawals restricted.',
    badge: 'Compliance',
    color: 'amber',
    active: true,
  },
  {
    id: 3,
    name: 'Read Only',
    description: 'Account restricted to view-only. Open orders can be closed, new trades & deposits locked.',
    badge: 'Risk Guard',
    color: 'blue',
    active: true,
  },
  {
    id: 4,
    name: 'Suspended',
    description: 'Account fully locked due to compliance audit or negative balance safeguard trigger.',
    badge: 'Locked',
    color: 'rose',
    active: false,
  },
  {
    id: 5,
    name: 'Archived',
    description: 'Zero balance dormant account decommissioned from active MT5 routing tables.',
    badge: 'Inactive',
    color: 'slate',
    active: false,
  },
];

export default function AdminAccountStatuses() {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const filtered = useMemo(() => {
    return statuses.filter((s) => {
      return (
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [statuses, search]);

  const toggleStatus = (id) => {
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
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
            <span className="whitespace-nowrap text-slate-500">Configurations</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Account Statuses</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">Account</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight">Statuses</span>
                </h1>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
                    <Activity className="w-3.5 h-3.5 text-orange-600" />
                    <span>State Definitions</span>
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Client trading account status codes, operational restrictions, and MT5 gateway permission flags.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
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

      {/* 2. Search & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search status code or description..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:bg-white transition-colors"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filtered.length}</span> of {statuses.length}
        </div>
      </div>

      {/* 3. Statuses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-slate-400">#</th>
                <th className="py-3.5 px-4">Status Name</th>
                <th className="py-3.5 px-4">Description &amp; Restrictions</th>
                <th className="py-3.5 px-4">Active / Inactive</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{s.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${s.color}-100 text-${s.color}-700`}>
                        {s.badge}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xl">
                    {s.description}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        s.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{s.active ? 'Active' : 'Inactive'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => toggleStatus(s.id)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                        s.active
                          ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
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
