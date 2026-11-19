import { useState, useMemo } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  Layers,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const initialAccountTypes = [
  {
    id: 1,
    name: 'Basic',
    badge: 'Starter',
    badgeColor: 'bg-orange-100 text-orange-700',
    description: 'Perfect for beginners entering financial markets with zero commission and high leverage.',
    category: 'live',
    mt5Group: 'real\\PRO B',
    minDeposit: '$50',
    maxLeverage: '1:1000',
    spread: '2.40 pips',
    commission: 'Zero',
    active: true,
  },
  {
    id: 2,
    name: 'Standard',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Ideal for active day traders requiring institutional execution and balanced margins.',
    category: 'live',
    mt5Group: 'real\\PRO B',
    minDeposit: '$100',
    maxLeverage: '1:500',
    spread: '1.20 pips',
    commission: 'Zero',
    active: true,
  },
  {
    id: 3,
    name: 'ECN Pro',
    badge: 'Raw Spread',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'Direct Tier-1 institutional liquidity with ultra-tight 0.0 pip raw interbank spreads.',
    category: 'live',
    mt5Group: 'real\\PRO A',
    minDeposit: '$1,000',
    maxLeverage: '1:500',
    spread: '0.00 pips',
    commission: '$6.00/lot',
    active: true,
  },
  {
    id: 4,
    name: 'ECN',
    badge: 'High Leverage',
    badgeColor: 'bg-amber-100 text-amber-700',
    description: 'Ultra-fast execution with low fixed markups and complete market depth access.',
    category: 'live',
    mt5Group: 'real\\PRO A',
    minDeposit: '$500',
    maxLeverage: '1:1000',
    spread: '0.60 pips',
    commission: '$3.50/lot',
    active: true,
  },
  {
    id: 5,
    name: 'PAMM',
    badge: 'Managed Strategy',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    description: 'Connect to verified fund managers with automatic, proportional profit distributions.',
    category: 'managed',
    mt5Group: 'real\\PRO B',
    minDeposit: '$50',
    maxLeverage: '1:1000',
    spread: '1.40 pips',
    commission: 'Zero',
    active: true,
  },
  {
    id: 6,
    name: 'Demo Account',
    badge: 'Risk Free',
    badgeColor: 'bg-slate-100 text-slate-700',
    description: 'Master your trading strategies on live markets with $100,000 virtual balance and zero financial risk.',
    category: 'demo',
    mt5Group: 'demo\\forex-hedge-usd-01',
    minDeposit: '$100,000',
    maxLeverage: '1:2000',
    spread: '0.80 pips',
    commission: 'Zero',
    active: true,
  },
  {
    id: 7,
    name: 'VVIP',
    badge: 'Institutional',
    badgeColor: 'bg-rose-100 text-rose-700',
    description: 'Exclusive tier with institutional multi-level rebates and white-glove service.',
    category: 'live',
    mt5Group: 'real\\PRO A',
    minDeposit: '$5,000',
    maxLeverage: '1:500',
    spread: '0.20 pips',
    commission: '$2.00/lot',
    active: true,
  },
];

export default function AdminAccountTypes() {
  const [types, setTypes] = useState(initialAccountTypes);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const toggleVisibility = (id) => {
    setTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const filtered = useMemo(() => {
    return types.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.mt5Group.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === 'all' || t.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [types, search, categoryFilter]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Category',
      'MT5 Group',
      'Min Deposit',
      'Max Leverage',
      'Spread',
      'Commission',
      'Status',
    ];
    const rows = filtered.map((t) => [
      t.id,
      t.name,
      t.category,
      t.mt5Group,
      t.minDeposit,
      t.maxLeverage,
      t.spread,
      t.commission,
      t.active ? 'Active' : 'Hidden',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `account_types_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span className="whitespace-nowrap text-slate-500">Configurations</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Account Types</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">Account</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight">Types</span>
                </h1>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
                    <Layers className="w-3.5 h-3.5 text-orange-600" />
                    <span>Live Config</span>
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Institutional spread configurations, margin tiers, MT5 group assignments, and leverage limits.
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

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, group, or description..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:bg-white transition-colors"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="live">Live Accounts</option>
            <option value="managed">Managed / PAMM</option>
            <option value="demo">Demo Accounts</option>
          </select>
        </div>
        <div className="text-xs font-semibold text-slate-500 self-end md:self-center">
          Showing <span className="text-slate-900 font-bold">{filtered.length}</span> of {types.length} types
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-slate-400">#</th>
                <th className="py-3.5 px-4">Account Type</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">MT5 Group</th>
                <th className="py-3.5 px-4">Min Deposit</th>
                <th className="py-3.5 px-4">Max Leverage</th>
                <th className="py-3.5 px-4">Spread / Comm.</th>
                <th className="py-3.5 px-4">Client Visibility</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{t.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.badgeColor}`}>
                        {t.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 max-w-sm truncate mt-0.5">
                      {t.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        t.category === 'live'
                          ? 'bg-emerald-100 text-emerald-700'
                          : t.category === 'managed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-blue-600 font-medium text-xs">
                    {t.mt5Group}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{t.minDeposit}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{t.maxLeverage}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{t.spread}</div>
                    <div className="text-[10px] text-slate-400">Comm: {t.commission}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(t.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                        t.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Click to toggle client visibility"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      <span>{t.active ? 'Active (Clients Can Open)' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingType(t);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer"
                        title="Edit Account Type Configuration"
                      >
                        <Pencil className="w-3 h-3 text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleVisibility(t.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer ${
                          t.active
                            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={t.active ? 'Hide from client portal' : 'Show in client portal'}
                      >
                        {t.active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{t.active ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 font-medium">
                    No account types matching criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Edit Modal */}
      {modalOpen && editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit {editingType.name} Configuration
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">MT5 Group</label>
                <input
                  type="text"
                  value={editingType.mt5Group}
                  onChange={(e) =>
                    setEditingType({ ...editingType, mt5Group: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Deposit</label>
                  <input
                    type="text"
                    value={editingType.minDeposit}
                    onChange={(e) =>
                      setEditingType({ ...editingType, minDeposit: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Leverage</label>
                  <input
                    type="text"
                    value={editingType.maxLeverage}
                    onChange={(e) =>
                      setEditingType({ ...editingType, maxLeverage: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Spread</label>
                  <input
                    type="text"
                    value={editingType.spread}
                    onChange={(e) =>
                      setEditingType({ ...editingType, spread: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commission</label>
                  <input
                    type="text"
                    value={editingType.commission}
                    onChange={(e) =>
                      setEditingType({ ...editingType, commission: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setTypes((prev) =>
                    prev.map((t) => (t.id === editingType.id ? editingType : t))
                  );
                  setModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
