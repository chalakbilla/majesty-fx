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

  // New Master Account form state
  const [newAccount, setNewAccount] = useState({
    accountNo: '',
    strategyPool: '',
    aum: '',
    allTimeProfit: '+0.00%',
    maxDrawdown: '0.00%',
    fundManager: '',
    status: 'Active',
    investors: 0,
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    if (!newAccount.accountNo || !newAccount.strategyPool || !newAccount.fundManager) return;

    const parsedAum = parseFloat(newAccount.aum.replace(/[^0-9.]/g, '')) || 0;
    const accountEntry = {
      id: accounts.length + 1,
      accountNo: newAccount.accountNo,
      strategyPool: newAccount.strategyPool,
      aum: parsedAum,
      allTimeProfit: newAccount.allTimeProfit.startsWith('+') ? newAccount.allTimeProfit : `+${newAccount.allTimeProfit}`,
      maxDrawdown: newAccount.maxDrawdown,
      fundManager: newAccount.fundManager,
      status: newAccount.status,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      investors: parseInt(newAccount.investors, 10) || 0,
    };

    setAccounts([accountEntry, ...accounts]);
    setCreateModalOpen(false);
    setNewAccount({
      accountNo: '',
      strategyPool: '',
      aum: '',
      allTimeProfit: '+0.00%',
      maxDrawdown: '0.00%',
      fundManager: '',
      status: 'Active',
      investors: 0,
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

      {/* Create Master Account Modal */}
      {createModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setCreateModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Create Master PAMM Account
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  MT5 Master Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={newAccount.accountNo}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNo: e.target.value })}
                  placeholder="e.g. 800108"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Strategy Pool Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAccount.strategyPool}
                  onChange={(e) => setNewAccount({ ...newAccount, strategyPool: e.target.value })}
                  placeholder="e.g. Alpha FX Master Pool"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Fund Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAccount.fundManager}
                  onChange={(e) => setNewAccount({ ...newAccount, fundManager: e.target.value })}
                  placeholder="e.g. Marcus Chen"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Initial AUM ($)
                  </label>
                  <input
                    type="number"
                    value={newAccount.aum}
                    onChange={(e) => setNewAccount({ ...newAccount, aum: e.target.value })}
                    placeholder="25000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Enrolled Investors
                  </label>
                  <input
                    type="number"
                    value={newAccount.investors}
                    onChange={(e) => setNewAccount({ ...newAccount, investors: e.target.value })}
                    placeholder="5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    All-Time Profit (%)
                  </label>
                  <input
                    type="text"
                    value={newAccount.allTimeProfit}
                    onChange={(e) => setNewAccount({ ...newAccount, allTimeProfit: e.target.value })}
                    placeholder="+12.5%"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Status
                  </label>
                  <select
                    value={newAccount.status}
                    onChange={(e) => setNewAccount({ ...newAccount, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  Create Master Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
