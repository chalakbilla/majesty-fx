import { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_account_types';

const defaultAccountTypes = [
  {
    id: 1,
    name: 'Basic',
    badge: 'Starter',
    description: 'Perfect for beginners entering financial markets with zero commission and high leverage.',
    category: 'live',
    mt5Group: 'real\\PRO B',
    minDeposit: 50,
    maxLeverage: '1:1000',
    spread: '2.40 pips',
    commission: 'Zero',
    executionMode: 'STP Execution',
    swapTerms: 'Free 15 days',
    visible: true,
    internalTransfer: true,
    depositBonus: false,
  },
  {
    id: 2,
    name: 'Standard',
    badge: 'Most Popular',
    description: 'Ideal for active day traders requiring institutional execution and balanced margins.',
    category: 'live',
    mt5Group: 'real\\PRO B',
    minDeposit: 100,
    maxLeverage: '1:500',
    spread: '2.00 pips',
    commission: 'Zero',
    executionMode: 'STP Execution',
    swapTerms: 'Free 15 days',
    visible: true,
    internalTransfer: true,
    depositBonus: false,
  },
  {
    id: 3,
    name: 'ECN Pro',
    badge: 'Raw Spread',
    description: 'Direct Tier-1 institutional liquidity with ultra-tight 0.0 pip raw interbank spreads.',
    category: 'live',
    mt5Group: 'real\\PRO A',
    minDeposit: 1000,
    maxLeverage: '1:500',
    spread: '0.00 pips',
    commission: '$12/lot',
    executionMode: 'True Raw ECN',
    swapTerms: 'Islamic swap-free',
    visible: true,
    internalTransfer: true,
    depositBonus: false,
  },
  {
    id: 4,
    name: 'ECN',
    badge: 'High Leverage',
    description: 'Ultra-fast execution with low fixed markups and complete market depth access.',
    category: 'live',
    mt5Group: 'real\\PRO A',
    minDeposit: 500,
    maxLeverage: '1:1000',
    spread: '1.00 pips',
    commission: 'Zero',
    executionMode: 'STP Execution',
    swapTerms: 'Free 15 days',
    visible: true,
    internalTransfer: true,
    depositBonus: false,
  },
  {
    id: 5,
    name: 'PAMM',
    badge: 'Managed Strategy',
    description: 'Connect to verified fund managers with automatic, proportional profit distributions.',
    category: 'managed',
    mt5Group: 'real\\PRO B',
    minDeposit: 50,
    maxLeverage: '1:1000',
    spread: '2.40 pips',
    commission: 'Zero',
    executionMode: 'PAMM Multi-Account',
    swapTerms: 'Free 15 days',
    visible: true,
    internalTransfer: true,
    depositBonus: false,
  },
  {
    id: 6,
    name: 'Demo Account',
    badge: 'Risk Free',
    description: 'Master your trading strategies on live markets with $100,000 virtual balance and zero financial risk.',
    category: 'demo',
    mt5Group: 'demo\\forex-hedge-usd-01',
    minDeposit: 100000,
    maxLeverage: '1:2000',
    spread: '2.00 pips',
    commission: 'Zero',
    executionMode: 'Demo Simulation',
    swapTerms: 'Unlimited',
    visible: true,
    internalTransfer: false,
    depositBonus: false,
  },
  {
    id: 7,
    name: 'VVIP',
    badge: 'Institutional',
    description: 'Exclusive tier with institutional multi-level rebates and white-glove service.',
    category: 'live',
    mt5Group: 'real\\PRO A',
    minDeposit: 5000,
    maxLeverage: '1:500',
    spread: '0.00 pips',
    commission: '$12/lot',
    executionMode: 'Prime Brokerage',
    swapTerms: 'VIP Bespoke',
    visible: true,
    internalTransfer: true,
    depositBonus: true,
  },
];

export default function AdminAccountTypes() {
  const [types, setTypes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return defaultAccountTypes;
  });

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formMt5Group, setFormMt5Group] = useState('');
  const [formMinDeposit, setFormMinDeposit] = useState(50);
  const [formMaxLeverage, setFormMaxLeverage] = useState('1:1000');
  const [formSpread, setFormSpread] = useState('2.00 pips');
  const [formCommission, setFormCommission] = useState('Zero');
  const [formExecutionMode, setFormExecutionMode] = useState('STP Execution');
  const [formSwapTerms, setFormSwapTerms] = useState('Free 15 days');
  const [formCategory, setFormCategory] = useState('live');
  const [formBadge, setFormBadge] = useState('Standard');
  const [formDescription, setFormDescription] = useState('Balanced execution with institutional liquidity routing.');
  const [formVisible, setFormVisible] = useState(true);
  const [formInternalTransfer, setFormInternalTransfer] = useState(true);
  const [formDepositBonus, setFormDepositBonus] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(types));
    } catch {
      // ignore
    }
  }, [types]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setSuccessMsg('Account configurations successfully synced.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 450);
  };

  const handleOpenCreateModal = () => {
    setFormName('');
    setFormMt5Group('Majestyfx\\B-Book\\Standard');
    setFormMinDeposit(50);
    setFormMaxLeverage('1:1000');
    setFormSpread('2.00 pips');
    setFormCommission('Zero');
    setFormExecutionMode('STP Execution');
    setFormSwapTerms('Free 15 days');
    setFormCategory('live');
    setFormBadge('Standard');
    setFormDescription('Balanced execution with institutional liquidity routing.');
    setFormVisible(true);
    setFormInternalTransfer(true);
    setFormDepositBonus(false);
    setCreateModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingType(t);
    setFormName(t.name);
    setFormMt5Group(t.mt5Group);
    setFormMinDeposit(t.minDeposit);
    setFormMaxLeverage(t.maxLeverage);
    setFormSpread(t.spread);
    setFormCommission(t.commission);
    setFormExecutionMode(t.executionMode || 'STP Execution');
    setFormSwapTerms(t.swapTerms || 'Free 15 days');
    setFormCategory(t.category);
    setFormBadge(t.badge);
    setFormDescription(t.description);
    setFormVisible(t.visible !== false);
    setFormInternalTransfer(t.internalTransfer !== false);
    setFormDepositBonus(!!t.depositBonus);
  };

  const handleSaveCreate = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formMt5Group.trim()) return;

    const nextId = types.length > 0 ? Math.max(...types.map((t) => t.id)) + 1 : 1;
    const newEntry = {
      id: nextId,
      name: formName.trim(),
      badge: formBadge.trim() || 'Standard',
      description: formDescription.trim(),
      category: formCategory,
      mt5Group: formMt5Group.trim(),
      minDeposit: Number(formMinDeposit) || 0,
      maxLeverage: formMaxLeverage,
      spread: formSpread.trim() || '2.00 pips',
      commission: formCommission.trim() || 'Zero',
      executionMode: formExecutionMode.trim() || 'STP Execution',
      swapTerms: formSwapTerms.trim() || 'Free 15 days',
      visible: formVisible,
      internalTransfer: formInternalTransfer,
      depositBonus: formDepositBonus,
    };

    setTypes((prev) => [...prev, newEntry]);
    setCreateModalOpen(false);
    setSuccessMsg(`Created new account type: ${newEntry.name}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingType || !formName.trim() || !formMt5Group.trim()) return;

    setTypes((prev) =>
      prev.map((t) =>
        t.id === editingType.id
          ? {
              ...t,
              name: formName.trim(),
              badge: formBadge.trim(),
              description: formDescription.trim(),
              category: formCategory,
              mt5Group: formMt5Group.trim(),
              minDeposit: Number(formMinDeposit) || 0,
              maxLeverage: formMaxLeverage,
              spread: formSpread.trim(),
              commission: formCommission.trim(),
              executionMode: formExecutionMode.trim(),
              swapTerms: formSwapTerms.trim(),
              visible: formVisible,
              internalTransfer: formInternalTransfer,
              depositBonus: formDepositBonus,
            }
          : t
      )
    );
    setEditingType(null);
    setSuccessMsg(`Updated account type: ${formName}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const toggleVisibility = (id) => {
    setTypes((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = !t.visible;
          setSuccessMsg(
            next
              ? `${t.name} is now visible to clients`
              : `${t.name} is now hidden from client portal`
          );
          setTimeout(() => setSuccessMsg(''), 3000);
          return { ...t, visible: next };
        }
        return t;
      })
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete account type "${name}"?`)) {
      setTypes((prev) => prev.filter((t) => t.id !== id));
      setSuccessMsg(`Deleted account type: ${name}`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const filtered = useMemo(() => {
    return types.filter((t) => {
      const matchSearch =
        !search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.mt5Group.toLowerCase().includes(search.toLowerCase()) ||
        t.badge.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory = activeTab === 'all' || t.category === activeTab;

      return matchSearch && matchCategory;
    });
  }, [types, search, activeTab]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Badge',
      'Category',
      'MT5 Group',
      'Min Deposit',
      'Max Leverage',
      'Spread',
      'Commission',
      'Execution Mode',
      'Swap Terms',
      'Visible',
    ];
    const rows = filtered.map((t) => [
      t.id,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.badge.replace(/"/g, '""')}"`,
      t.category,
      `"${t.mt5Group.replace(/"/g, '""')}"`,
      t.minDeposit,
      t.maxLeverage,
      `"${t.spread.replace(/"/g, '""')}"`,
      `"${t.commission.replace(/"/g, '""')}"`,
      `"${(t.executionMode || '').replace(/"/g, '""')}"`,
      `"${(t.swapTerms || '').replace(/"/g, '""')}"`,
      t.visible ? 'Yes' : 'No',
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

  const handleCopyJSON = () => {
    try {
      navigator.clipboard?.writeText(JSON.stringify(filtered, null, 2));
      setSuccessMsg('Account configurations copied as JSON.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // ignore
    }
  };

  const formatCurrency = (val) => {
    return '$' + Number(val).toLocaleString('en-US');
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
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none"
          >
            <a href="/admin" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Home
            </a>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-500">Accounts</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Account Types</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Account
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Types
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Manage the MT5 account tiers, minimum deposits, leverage limits, and visibility available for clients to open
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  style={{ backgroundColor: '#ea580c' }}
                >
                  <Plus size={14} />
                  <span>Create New Account Type</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-800 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button type="button" onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Main Card Container with Controls and Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              style={{ backgroundColor: '#ea580c' }}
            >
              <Download size={12} />
              <span>CSV Export</span>
            </button>
            <button
              type="button"
              onClick={handleCopyJSON}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              Copy JSON
            </button>

            {/* Category Tabs */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 ml-2">
              {[
                { key: 'all', label: 'All Tiers' },
                { key: 'live', label: 'live' },
                { key: 'managed', label: 'managed' },
                { key: 'demo', label: 'demo' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-white text-orange-600 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, group, or badge..."
              className="border border-slate-300 rounded px-2.5 py-1 text-xs outline-none focus:border-orange-500 min-w-[220px]"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Account Type</th>
                  <th>Category</th>
                  <th>MT5 Group</th>
                  <th>Min Deposit</th>
                  <th>Max Leverage</th>
                  <th>Spread / Comm.</th>
                  <th>Client Visibility</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="data-table-empty">
                      No account types match the search filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/40'
                        }`}
                      >
                        <td className="py-3 px-3 text-slate-400 font-mono text-[11px]" data-label="#">
                          {item.id}
                        </td>
                        <td className="py-3 px-3" data-label="Account Type">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-[13px]">{item.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                              {item.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 max-w-xs truncate mt-0.5">
                            {item.description}
                          </div>
                        </td>
                        <td className="py-3 px-3" data-label="Category">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.category === 'live'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.category === 'managed'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-blue-600 font-medium" data-label="MT5 Group">
                          {item.mt5Group}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900" data-label="Min Deposit">
                          {formatCurrency(item.minDeposit)}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700" data-label="Max Leverage">
                          {item.maxLeverage}
                        </td>
                        <td className="py-3 px-3" data-label="Spread / Comm.">
                          <div className="font-medium text-slate-800">{item.spread}</div>
                          <div className="text-[10px] text-slate-400">Comm: {item.commission}</div>
                        </td>
                        <td className="py-3 px-3" data-label="Client Visibility">
                          {item.visible !== false ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active (Clients Can Open)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Hidden (Internal Only)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right" data-label="Actions" data-actions="">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer"
                              title="Edit Account Type Configuration"
                              aria-label="Edit Account Type"
                            >
                              <Pencil size={12} className="text-blue-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleVisibility(item.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border font-semibold text-[11px] transition-colors shadow-2xs cursor-pointer ${
                                item.visible !== false
                                  ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={item.visible !== false ? 'Hide from client portal' : 'Make visible to clients'}
                              aria-label={item.visible !== false ? 'Hide' : 'Show'}
                            >
                              {item.visible !== false ? <EyeOff size={12} /> : <Eye size={12} />}
                              <span>{item.visible !== false ? 'Hide' : 'Show'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-1.5 rounded-md border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer"
                              title="Delete Account Type"
                              aria-label="Delete Account Type"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pager Matching Reference */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>1</strong> to <strong>{filtered.length}</strong> of{' '}
              <strong>{filtered.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  aria-label="Rows per page"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
              <nav className="table-pager-pages" aria-label="Pages">
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} /> <span>Prev</span>
                </button>
                <button type="button" className="table-pager-btn table-pager-num" aria-current="page">
                  1
                </button>
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage >= Math.ceil(filtered.length / rowsPerPage)}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  aria-label="Next page"
                >
                  <span>Next</span> <ChevronRight size={13} />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Tier Info */}
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>Showing {filtered.length} of {types.length} total account tiers</span>
          <span className="text-[11px] text-slate-400">
            Changes to account types immediately update the client Open Account portal.
          </span>
        </div>
      </div>

      {/* 3. Modal: Edit Account Type */}
      {editingType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Pencil size={16} className="text-orange-600" />
                  <span>Edit Account Type: {editingType.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the conditions, leverage, spreads, and MT5 routing your clients will experience.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingType(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Standard, ECN Pro"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>MT5 Group Routing *</span>
                    <span className="text-[10px] text-slate-400">Exact MT5 group path</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formMt5Group}
                    onChange={(e) => setFormMt5Group(e.target.value)}
                    placeholder="e.g. Majestyfx\B-Book\Standard or real\PRO B"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-mono text-blue-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Deposit (USD) *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 pointer-events-none text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formMinDeposit}
                      onChange={(e) => setFormMinDeposit(e.target.value)}
                      style={{ paddingLeft: '28px' }}
                      className="w-full border border-slate-300 rounded-lg pr-3 py-2 text-xs outline-none focus:border-orange-500 font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Leverage *</label>
                  <select
                    value={formMaxLeverage}
                    onChange={(e) => setFormMaxLeverage(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-semibold text-slate-800"
                  >
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:300">1:300</option>
                    <option value="1:500">1:500</option>
                    <option value="1:1000">1:1000</option>
                    <option value="1:2000">1:2000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Typical Spread</label>
                  <input
                    type="text"
                    value={formSpread}
                    onChange={(e) => setFormSpread(e.target.value)}
                    placeholder="e.g. 1.20 pips"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Commission per Lot</label>
                  <input
                    type="text"
                    value={formCommission}
                    onChange={(e) => setFormCommission(e.target.value)}
                    placeholder="e.g. Zero, $6/lot"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Execution Mode</label>
                  <input
                    type="text"
                    value={formExecutionMode}
                    onChange={(e) => setFormExecutionMode(e.target.value)}
                    placeholder="e.g. STP Execution, True Raw ECN"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Swap Terms</label>
                  <input
                    type="text"
                    value={formSwapTerms}
                    onChange={(e) => setFormSwapTerms(e.target.value)}
                    placeholder="e.g. Free 15 days, Islamic swap-free"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="live">Live Trading</option>
                    <option value="managed">Managed / PAMM</option>
                    <option value="demo">Demo Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Badge Tag</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Starter, Most Popular, Raw Spread"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Description (Displayed to clients)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description highlighting who this account tier is best for..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Visible to Clients</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formInternalTransfer}
                    onChange={(e) => setFormInternalTransfer(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Internal Transfer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formDepositBonus}
                    onChange={(e) => setFormDepositBonus(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>100% Deposit Bonus</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingType(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  style={{ backgroundColor: '#ea580c' }}
                >
                  Update Account Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Create New Account Type */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Plus size={16} className="text-orange-600" />
                  <span>Create New Account Type</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure a new trading account tier that your clients can select and open.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. VIP Zero Spread"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>MT5 Group Routing *</span>
                    <span className="text-[10px] text-slate-400">Path in MT5</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formMt5Group}
                    onChange={(e) => setFormMt5Group(e.target.value)}
                    placeholder="e.g. Majestyfx\B-Book\Standard"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-mono text-blue-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Deposit (USD) *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 pointer-events-none text-slate-400 font-bold text-xs">$</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formMinDeposit}
                      onChange={(e) => setFormMinDeposit(e.target.value)}
                      style={{ paddingLeft: '28px' }}
                      className="w-full border border-slate-300 rounded-lg pr-3 py-2 text-xs outline-none focus:border-orange-500 font-bold text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Leverage *</label>
                  <select
                    value={formMaxLeverage}
                    onChange={(e) => setFormMaxLeverage(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-semibold text-slate-800"
                  >
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:300">1:300</option>
                    <option value="1:500">1:500</option>
                    <option value="1:1000">1:1000</option>
                    <option value="1:2000">1:2000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Typical Spread</label>
                  <input
                    type="text"
                    value={formSpread}
                    onChange={(e) => setFormSpread(e.target.value)}
                    placeholder="e.g. 1.20 pips"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Commission per Lot</label>
                  <input
                    type="text"
                    value={formCommission}
                    onChange={(e) => setFormCommission(e.target.value)}
                    placeholder="e.g. Zero, $6/lot"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Execution Mode</label>
                  <input
                    type="text"
                    value={formExecutionMode}
                    onChange={(e) => setFormExecutionMode(e.target.value)}
                    placeholder="e.g. STP Execution, True Raw ECN"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Swap Terms</label>
                  <input
                    type="text"
                    value={formSwapTerms}
                    onChange={(e) => setFormSwapTerms(e.target.value)}
                    placeholder="e.g. Free 15 days, Islamic swap-free"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500 font-medium"
                  >
                    <option value="live">Live Trading</option>
                    <option value="managed">Managed / PAMM</option>
                    <option value="demo">Demo Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Badge Tag</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Starter, Most Popular, Raw Spread"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Description (Displayed to clients)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description highlighting who this account tier is best for..."
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Visible to Clients</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formInternalTransfer}
                    onChange={(e) => setFormInternalTransfer(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Internal Transfer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formDepositBonus}
                    onChange={(e) => setFormDepositBonus(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>100% Deposit Bonus</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  style={{ backgroundColor: '#ea580c' }}
                >
                  Create Account Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
