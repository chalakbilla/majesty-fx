import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  DollarSign,
  Eye,
  FileSpreadsheet,
  Layers,
  RefreshCw,
  Search,
  UserCheck,
  Users,
} from 'lucide-react';

const initialAccounts = [
  {
    id: 1,
    initials: 'GA',
    name: 'Ghulam Abbas',
    email: 'ghulam.abas6533@gmail.com',
    role: 'follower',
    roleLabel: 'COPIER / FOLLOWER',
    strategy: 'Test Trader',
    mode: 'Mode: proportional',
    login: '#9009095877833',
    allocated: '$500.00',
    equity: '$500.00',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'ACTIVE',
    statusBg: 'rgb(220, 252, 231)',
    statusColor: 'rgb(22, 101, 52)',
    statusBorder: 'rgb(187, 247, 208)',
    avatarGradient: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(3, 105, 161))',
  },
  {
    id: 2,
    initials: 'MH',
    name: 'Mohammad Hamid',
    email: 'maharshdoshi42@gmail.com',
    role: 'follower',
    roleLabel: 'COPIER / FOLLOWER',
    strategy: 'SHAHIL AHMED',
    mode: 'Mode: equal',
    login: '#9009095877279',
    allocated: '$1,000.00',
    equity: '$678.79',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'ACTIVE',
    statusBg: 'rgb(220, 252, 231)',
    statusColor: 'rgb(22, 101, 52)',
    statusBorder: 'rgb(187, 247, 208)',
    avatarGradient: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(3, 105, 161))',
  },
  {
    id: 3,
    initials: 'S',
    name: 'SignalFX',
    email: 'tradeworld2475@gmail.com',
    role: 'follower',
    roleLabel: 'COPIER / FOLLOWER',
    strategy: 'SHAHIL AHMED',
    mode: 'Mode: proportional',
    login: '#9009095877271',
    allocated: '$500.00',
    equity: '$338.75',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'PAUSED',
    statusBg: 'rgb(254, 243, 199)',
    statusColor: 'rgb(180, 83, 9)',
    statusBorder: 'rgb(253, 230, 138)',
    avatarGradient: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(3, 105, 161))',
  },
  {
    id: 4,
    initials: 'VF',
    name: 'Valued Follower',
    email: 'ID: cli_1792137355291',
    role: 'follower',
    roleLabel: 'COPIER / FOLLOWER',
    strategy: 'Test Trader',
    mode: 'Mode: proportional',
    login: '#9009095877267',
    allocated: '$500.00',
    equity: '$500.00',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'ACTIVE',
    statusBg: 'rgb(220, 252, 231)',
    statusColor: 'rgb(22, 101, 52)',
    statusBorder: 'rgb(187, 247, 208)',
    avatarGradient: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(3, 105, 161))',
  },
  {
    id: 5,
    initials: 'VF',
    name: 'Valued Follower',
    email: 'ID: cli_1791610855289',
    role: 'follower',
    roleLabel: 'COPIER / FOLLOWER',
    strategy: 'Alpha Pro Trader',
    mode: 'Mode: proportional',
    login: '#9009095877068',
    allocated: '$500.00',
    equity: '$500.00',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'ACTIVE',
    statusBg: 'rgb(220, 252, 231)',
    statusColor: 'rgb(22, 101, 52)',
    statusBorder: 'rgb(187, 247, 208)',
    avatarGradient: 'linear-gradient(135deg, rgb(2, 132, 199), rgb(3, 105, 161))',
  },
  {
    id: 6,
    initials: 'DP',
    name: 'Demo Partner (IB)',
    email: 'demoib@majestyfx.com',
    role: 'master',
    roleLabel: 'MASTER PROVIDER',
    strategy: 'Master Strategy',
    mode: '',
    login: '#800107',
    allocated: '$15,000.00',
    equity: '$15,000.00',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'ACTIVE',
    statusBg: 'rgb(220, 252, 231)',
    statusColor: 'rgb(22, 101, 52)',
    statusBorder: 'rgb(187, 247, 208)',
    avatarGradient: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(217, 119, 6))',
  },
  {
    id: 7,
    initials: 'MC',
    name: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    role: 'master',
    roleLabel: 'MASTER PROVIDER',
    strategy: 'Master Strategy',
    mode: '',
    login: '#800104',
    allocated: '$24,100.00',
    equity: '$24,100.00',
    gain: '+$0.00',
    gainColor: 'rgb(22, 163, 74)',
    status: 'ACTIVE',
    statusBg: 'rgb(220, 252, 231)',
    statusColor: 'rgb(22, 101, 52)',
    statusBorder: 'rgb(187, 247, 208)',
    avatarGradient: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(217, 119, 6))',
  },
];

export default function AdminCopyTradingAccounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'followers' | 'masters'
  const [searchQuery, setSearchQuery] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filtered = accounts.filter((acc) => {
    if (activeTab === 'followers' && acc.role !== 'follower') return false;
    if (activeTab === 'masters' && acc.role !== 'master') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        acc.name.toLowerCase().includes(q) ||
        acc.email.toLowerCase().includes(q) ||
        acc.strategy.toLowerCase().includes(q) ||
        acc.login.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['#', 'Client Name', 'Email', 'Role', 'Strategy', 'Mode', 'MT5 Login', 'Allocated', 'Live Equity', 'Gain P&L', 'Status'];
    const rows = filtered.map((a, i) => [
      i + 1,
      `"${a.name}"`,
      `"${a.email}"`,
      `"${a.roleLabel}"`,
      `"${a.strategy}"`,
      `"${a.mode || 'N/A'}"`,
      `"${a.login}"`,
      `"${a.allocated}"`,
      `"${a.equity}"`,
      `"${a.gain}"`,
      `"${a.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `copy_trading_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 pb-8 font-montserrat">
      {/* 1. Page Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0">
            <Link className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap" to="/admin">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Copy Trading Accounts</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>Copy Trading</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>Accounts</span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">
                  Social Trading Hub
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Live administrative directory of real client copy trading accounts, follower allocations, and master strategies
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Total Copy Accounts */}
        <div className="admin-kpi-card" title="Total Copy Accounts">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title="7">7</div>
            <div className="admin-kpi-title">Total Copy Accounts</div>
            <div className="admin-kpi-sub">
              <span className="truncate">6 active connections</span>
            </div>
          </div>
        </div>

        {/* Follower Accounts */}
        <div className="admin-kpi-card" title="Follower Accounts">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title="5">5</div>
            <div className="admin-kpi-title">Follower Accounts</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Real clients copying</span>
            </div>
          </div>
        </div>

        {/* Total Pooled AUM */}
        <div className="admin-kpi-card" title="Total Pooled AUM">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
              boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
            }}
          >
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title="$41,617.54">$41,617.54</div>
            <div className="admin-kpi-title">Total Pooled AUM</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Combined strategy equity</span>
            </div>
          </div>
        </div>

        {/* Master Strategies */}
        <div className="admin-kpi-card" title="Master Strategies">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
              boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
            }}
          >
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title="2">2</div>
            <div className="admin-kpi-title">Master Strategies</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Verified strategy providers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Data Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 bg-slate-200/60 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Accounts (7)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('followers')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'followers'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Followers (5)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('masters')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'masters'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Masters (2)
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, email, strategy, or login..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>CLIENT / ACCOUNT HOLDER</th>
                  <th>ROLE</th>
                  <th>STRATEGY / TARGET</th>
                  <th>MT5 LOGIN</th>
                  <th>ALLOCATED</th>
                  <th>LIVE EQUITY</th>
                  <th>GAIN / P&amp;L</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="data-table-empty">
                      No copy trading accounts found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((acc, idx) => (
                    <tr key={acc.id}>
                      <td data-label="#" style={{ color: 'rgb(100, 116, 139)', fontSize: '0.8rem' }}>
                        {idx + 1}
                      </td>
                      <td data-label="CLIENT / ACCOUNT HOLDER">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: acc.avatarGradient,
                              color: 'rgb(255, 255, 255)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '11px',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {acc.initials}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: 'rgb(15, 23, 42)', fontSize: '12px' }}>
                              {acc.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                              {acc.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td data-label="ROLE">
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            backgroundColor: acc.role === 'master' ? 'rgb(254, 243, 199)' : 'rgb(224, 242, 254)',
                            color: acc.role === 'master' ? 'rgb(180, 83, 9)' : 'rgb(3, 105, 161)',
                            border: acc.role === 'master' ? '1px solid rgb(253, 230, 138)' : '1px solid rgb(186, 230, 253)',
                          }}
                        >
                          {acc.role === 'master' ? (
                            <Crown className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          <span>{acc.roleLabel}</span>
                        </span>
                      </td>
                      <td data-label="STRATEGY / TARGET">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: 'rgb(15, 23, 42)', fontSize: '12px' }}>
                            {acc.strategy}
                          </span>
                          {acc.mode && (
                            <span style={{ fontSize: '11px', color: 'rgb(100, 116, 139)', textTransform: 'capitalize' }}>
                              {acc.mode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        data-label="MT5 LOGIN"
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'rgb(37, 99, 235)',
                          fontSize: '12px',
                        }}
                      >
                        {acc.login}
                      </td>
                      <td
                        data-label="ALLOCATED"
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: 'rgb(51, 65, 85)',
                          fontSize: '12px',
                        }}
                      >
                        {acc.allocated}
                      </td>
                      <td
                        data-label="LIVE EQUITY"
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'rgb(5, 150, 105)',
                          fontSize: '12px',
                        }}
                      >
                        {acc.equity}
                      </td>
                      <td data-label="GAIN / P&L">
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '12px',
                            color: acc.gainColor,
                          }}
                        >
                          {acc.gain}
                        </span>
                      </td>
                      <td data-label="STATUS">
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: acc.statusBg,
                            color: acc.statusColor,
                            border: `1px solid ${acc.statusBorder}`,
                          }}
                        >
                          {acc.status}
                        </span>
                      </td>
                      <td data-label="ACTIONS" data-actions="" style={{ textAlign: 'right' }}>
                        <div className="admin-action-group" style={{ justifyContent: 'flex-end', gap: '4px' }}>
                          <Link
                            className="admin-action-btn admin-action-btn-view"
                            title="View in CRM Clients"
                            to="/admin/clients"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            className="admin-action-btn admin-action-btn-view"
                            title={acc.role === 'master' ? 'Manage Master Strategy' : 'Manage Follower Subscription'}
                            to="/admin/copy-trading-accounts"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pager matching exported template */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{filtered.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  aria-label="Rows per page"
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(e.target.value)}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </label>
              <nav className="table-pager-pages" aria-label="Pages">
                <button type="button" className="table-pager-btn" disabled aria-label="Previous page">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button type="button" className="table-pager-btn table-pager-num" aria-current="page">
                  1
                </button>
                <button type="button" className="table-pager-btn" disabled aria-label="Next page">
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
