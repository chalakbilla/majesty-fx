import { useState, useMemo } from 'react';
import {
  Award,
  DollarSign,
  Download,
  Eye,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';

export default function AdminPAMMActiveAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Master Account form state matching exact UI in media_1795116980226_68fbbd32.png
  const [newAccount, setNewAccount] = useState({
    accountNo: '',
    strategyPool: '',
    fundManager: 'Institutional Master',
    balance: '$10,000',
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!newAccount.accountNo || !newAccount.strategyPool || !newAccount.fundManager) return;

    const parsedAum = parseFloat(String(newAccount.balance || '').replace(/[^0-9.]/g, '')) || 10000;
    const accountEntry = {
      id: accounts.length + 1,
      accountNo: newAccount.accountNo,
      strategyPool: newAccount.strategyPool,
      clientName: newAccount.strategyPool,
      aum: parsedAum,
      allTimeProfit: '+0.00%',
      maxDrawdown: '0.00%',
      fundManager: newAccount.fundManager,
      status: 'Active',
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      investors: 0,
    };

    setAccounts([accountEntry, ...accounts]);
    setCreateModalOpen(false);
    setNewAccount({
      accountNo: '',
      strategyPool: '',
      fundManager: 'Institutional Master',
      balance: '$10,000',
    });
  };

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.accountNo.toLowerCase().includes(q) ||
          a.strategyPool.toLowerCase().includes(q) ||
          a.fundManager.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [accounts, statusFilter, searchQuery]);

  // KPI Calculations
  const totalMasterPools = accounts.length;
  const totalManagedAum = accounts.reduce((acc, a) => acc + (a.aum || 0), 0);
  const activeMasterPools = accounts.filter((a) => a.status === 'Active').length;
  const enrolledInvestors = accounts.reduce((acc, a) => acc + (a.investors || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleExportCSV = () => {
    if (filteredAccounts.length === 0) return;
    const headers = ['#', 'Account No', 'Strategy Pool', 'AUM / Balance', 'All-Time Profit', 'Max Drawdown', 'Fund Manager', 'Status', 'Start Date'];
    const rows = filteredAccounts.map((a, i) => [
      i + 1,
      `"${a.accountNo}"`,
      `"${a.strategyPool}"`,
      `"${formatCurrency(a.aum)}"`,
      `"${a.allTimeProfit}"`,
      `"${a.maxDrawdown}"`,
      `"${a.fundManager}"`,
      a.status,
      `"${a.startDate}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pamm_active_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5">
        {/* Header Card matching majestyfx.com-admin-pamm-active-accounts */}
        <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          />
          <div className="flex flex-col gap-3.5 sm:gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
              <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                    <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                      Total PAMM
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Active Accounts
                    </span>
                  </h1>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    PAMM Engine
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Live managed accounts and institutional multi-asset Master pools
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Master Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={filteredAccounts.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards matching majestyfx.com-admin-pamm-active-accounts */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {/* Card 1: Total Master Pools */}
          <div className="admin-kpi-card" title="Total Master Pools">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(totalMasterPools)}>
                {totalMasterPools}
              </div>
              <div className="admin-kpi-title">Total Master Pools</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Institutional PAMM Accounts</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Managed AUM */}
          <div className="admin-kpi-card" title="Total Managed AUM">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
                boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
              }}
            >
              <DollarSign className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={formatCurrency(totalManagedAum)}>
                {totalManagedAum === 0 ? '$0' : formatCurrency(totalManagedAum)}
              </div>
              <div className="admin-kpi-title">Total Managed AUM</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Collective Master Balance</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Master Pools */}
          <div className="admin-kpi-card" title="Active Master Pools">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
              }}
            >
              <Award className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(activeMasterPools)}>
                {activeMasterPools}
              </div>
              <div className="admin-kpi-title">Active Master Pools</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Currently Trading Live</span>
              </div>
            </div>
          </div>

          {/* Card 4: Enrolled Investors */}
          <div className="admin-kpi-card" title="Enrolled Investors">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(enrolledInvestors)}>
                {enrolledInvestors}
              </div>
              <div className="admin-kpi-title">Enrolled Investors</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Allocated Sub-Accounts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative w-full sm:w-72">
                <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search account, strategy, manager..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{filteredAccounts.length}</strong> accounts
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="data-table data-table--plain">
            <div className="data-table-scroll">
              <table className="data-table-grid" data-cards="">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ACCOUNT NO</th>
                    <th>STRATEGY POOL</th>
                    <th>AUM / BALANCE</th>
                    <th>ALL-TIME PROFIT</th>
                    <th>MAX DRAWDOWN</th>
                    <th>FUND MANAGER</th>
                    <th>STATUS</th>
                    <th>START DATE</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td className="data-table-empty" colSpan={10}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                          No active PAMM accounts found
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                          No accounts matched your filter criteria or no accounts have been created yet.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account, index) => (
                      <tr key={account.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="font-mono text-slate-400 text-xs">{index + 1}</td>
                        <td>
                          <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-xs">
                            #{account.accountNo}
                          </span>
                        </td>
                        <td>
                          <div className="font-bold text-slate-900 text-xs">{account.strategyPool}</div>
                          <div className="text-[11px] text-slate-400">Institutional Strategy</div>
                        </td>
                        <td className="font-mono font-bold text-slate-900 text-xs">
                          {formatCurrency(account.aum)}
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {account.allTimeProfit}
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {account.maxDrawdown}
                          </span>
                        </td>
                        <td>
                          <div className="font-semibold text-slate-900 text-xs">{account.fundManager}</div>
                          <div className="text-[11px] text-slate-400">{account.investors} Investors</div>
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              account.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {account.status}
                          </span>
                        </td>
                        <td className="text-slate-500 text-xs">{account.startDate}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteAccount(account.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Pool"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Master PAMM Pool Modal matching media_1795116980226_68fbbd32.png exactly */}
      {createModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '460px',
              width: '100%',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Create Master PAMM Pool
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  PAMM Pool Identifier / Account No
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PAMM-185"
                  value={newAccount.accountNo}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNo: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  className="focus:border-violet-500"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Strategy / Pool Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Momentum Alpha"
                  value={newAccount.strategyPool}
                  onChange={(e) => setNewAccount({ ...newAccount, strategyPool: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  className="focus:border-violet-500"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Fund Manager
                </label>
                <input
                  type="text"
                  required
                  placeholder="Fund manager name"
                  value={newAccount.fundManager}
                  onChange={(e) => setNewAccount({ ...newAccount, fundManager: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  className="focus:border-violet-500"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Initial Master Capital Allocation ($)
                </label>
                <input
                  type="text"
                  required
                  placeholder="$10,000"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    color: '#1e293b',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  className="focus:border-violet-500"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'rgb(139, 92, 246)',
                    color: '#ffffff',
                    borderRadius: '0.375rem',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(139, 92, 246, 0.2)',
                  }}
                >
                  Save Master Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
