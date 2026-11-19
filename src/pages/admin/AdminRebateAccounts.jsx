import { useState, useMemo } from 'react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Download,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react';

const initialAccounts = [
  {
    id: 1,
    partnerName: 'Demo Partner (IB)',
    email: 'demoib@majestyfx.com',
    referralCode: 'MJDEMO999',
    tier: 'Tier demo',
    forex: '$6',
    metals: '$8',
    crypto: '$12',
    indices: '$4',
    clients: 12,
    volume: '240.00',
    totalRebate: '$2400.00',
    status: 'approved',
  },
  {
    id: 2,
    partnerName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    referralCode: 'MJDEMO1001',
    tier: 'Tier demo',
    forex: '$6',
    metals: '$8',
    crypto: '$12',
    indices: '$4',
    clients: 8,
    volume: '142.50',
    totalRebate: '$1425.00',
    status: 'approved',
  },
  {
    id: 3,
    partnerName: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    referralCode: 'MJDEMO2002',
    tier: 'Tier demo',
    forex: '$6',
    metals: '$8',
    crypto: '$12',
    indices: '$4',
    clients: 15,
    volume: '385.00',
    totalRebate: '$3850.00',
    status: 'approved',
  },
];

export default function AdminRebateAccounts() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(
      (a) =>
        a.partnerName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.referralCode.toLowerCase().includes(q) ||
        a.tier.toLowerCase().includes(q)
    );
  }, [accounts, searchQuery]);

  // Dynamic KPI calculations based on data
  const activePartnersCount = accounts.length;
  const totalClientAccounts = accounts.reduce((sum, a) => sum + a.clients, 0);
  const totalRebatesNum = accounts.reduce(
    (sum, a) => sum + parseFloat(a.totalRebate.replace(/[^0-9.]/g, '') || 0),
    0
  );
  const avgRebatePerPartner =
    activePartnersCount > 0 ? (totalRebatesNum / activePartnersCount).toFixed(2) : '0.00';

  const handleExportCSV = () => {
    const headers = [
      'Partner',
      'Email',
      'Referral Code',
      'Tier',
      'Forex',
      'Metals',
      'Crypto',
      'Indices',
      'Clients',
      'Volume (Lots)',
      'Total Rebate',
      'Status',
    ];
    const rows = filteredAccounts.map((a) => [
      `"${a.partnerName}"`,
      `"${a.email}"`,
      `"${a.referralCode}"`,
      `"${a.tier}"`,
      `"${a.forex}"`,
      `"${a.metals}"`,
      `"${a.crypto}"`,
      `"${a.indices}"`,
      a.clients,
      `"${a.volume}"`,
      `"${a.totalRebate}"`,
      a.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `rebate_accounts_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5 pb-8">
        {/* Header Card matching majestyfx.com-admin-rebate-accounts */}
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
                      Rebate
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Accounts
                    </span>
                  </h1>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    Cashback Ledger
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  IB partner rebate plans and cumulative cashback ledger
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
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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

        {/* 4 KPI Cards matching majestyfx.com-admin-rebate-accounts */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {/* Card 1: Active IB Partners */}
          <div className="admin-kpi-card" title="Active IB Partners">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(activePartnersCount)}>
                {activePartnersCount}
              </div>
              <div className="admin-kpi-title">Active IB Partners</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Tiered affiliates</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Client Accounts */}
          <div className="admin-kpi-card" title="Total Client Accounts">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
                boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
              }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(totalClientAccounts)}>
                {totalClientAccounts}
              </div>
              <div className="admin-kpi-title">Total Client Accounts</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Referred traders</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Rebates Paid */}
          <div className="admin-kpi-card" title="Total Rebates Paid">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
              }}
            >
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={`$${totalRebatesNum.toFixed(2)}`}>
                ${totalRebatesNum.toFixed(2)}
              </div>
              <div className="admin-kpi-title">Total Rebates Paid</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Cumulative volume rebate</span>
              </div>
            </div>
          </div>

          {/* Card 4: Avg Rebate / Partner */}
          <div className="admin-kpi-card" title="Avg Rebate / Partner">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={`$${avgRebatePerPartner}`}>
                ${avgRebatePerPartner}
              </div>
              <div className="admin-kpi-title">Avg Rebate / Partner</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Performance yield</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Card matching majestyfx.com-admin-rebate-accounts */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner name, email or code..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{filteredAccounts.length}</strong> rebate accounts
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="data-table data-table--plain">
            <div className="data-table-scroll">
              <table className="data-table-grid" data-cards="">
                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Referral Code</th>
                    <th>Tier</th>
                    <th>Forex</th>
                    <th>Metals</th>
                    <th>Crypto</th>
                    <th>Indices</th>
                    <th>Clients</th>
                    <th>Volume (Lots)</th>
                    <th>Total Rebate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="data-table-empty">
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                          No rebate accounts found
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                          No accounts match your search criteria.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4" data-label="Partner">
                          <div className="font-bold text-slate-800">{account.partnerName}</div>
                          <div className="text-slate-400 text-[10px]">{account.email}</div>
                        </td>
                        <td
                          className="py-3 px-4 font-mono font-bold text-indigo-700 text-[11px]"
                          data-label="Referral Code"
                        >
                          {account.referralCode}
                        </td>
                        <td className="py-3 px-4" data-label="Tier">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                            {account.tier}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 font-mono" data-label="Forex">
                          {account.forex}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 font-mono" data-label="Metals">
                          {account.metals}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 font-mono" data-label="Crypto">
                          {account.crypto}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700 font-mono" data-label="Indices">
                          {account.indices}
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-700" data-label="Clients">
                          {account.clients}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600" data-label="Volume (Lots)">
                          {account.volume}
                        </td>
                        <td
                          className="py-3 px-4 font-extrabold text-emerald-700 font-mono"
                          data-label="Total Rebate"
                        >
                          {account.totalRebate}
                        </td>
                        <td className="py-3 px-4" data-label="Status">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                            {account.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pager matching reference */}
            <div className="table-pager">
              <span className="table-pager-info">
                Showing <strong>{filteredAccounts.length > 0 ? 1 : 0}</strong> to{' '}
                <strong>{Math.min(rowsPerPage, filteredAccounts.length)}</strong> of{' '}
                <strong>{filteredAccounts.length}</strong> entries
              </span>
              <div className="table-pager-controls">
                <label className="table-pager-size">
                  <span>Rows</span>
                  <select
                    aria-label="Rows per page"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </label>
                <nav aria-label="Pages" className="table-pager-pages">
                  <button
                    type="button"
                    aria-label="Previous page"
                    className="table-pager-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    aria-current="page"
                    className="table-pager-btn table-pager-num"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    aria-label="Next page"
                    className="table-pager-btn"
                    disabled
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
