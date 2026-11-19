import { useState, useMemo } from 'react';
import {
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';

export default function AdminTotalPAMMClients() {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.clientName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.pammAccount.toLowerCase().includes(q) ||
        c.strategy.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  // Dynamic KPI calculations
  const totalInvestors = clients.length;
  const totalCapital = clients.reduce((sum, c) => sum + (c.investedCapital || 0), 0);
  const totalEquity = clients.reduce((sum, c) => sum + (c.currentEquity || 0), 0);
  const netProfit = clients.reduce((sum, c) => sum + (c.totalProfit || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleExportCSV = () => {
    if (filteredClients.length === 0) return;
    const headers = [
      '#',
      'Client Name',
      'Email',
      'PAMM Account',
      'Strategy',
      'Invested Capital',
      'Current Equity',
      'Total P/L',
      'Status',
    ];
    const rows = filteredClients.map((c, i) => [
      i + 1,
      `"${c.clientName}"`,
      `"${c.email}"`,
      `"${c.pammAccount}"`,
      `"${c.strategy}"`,
      `"${formatCurrency(c.investedCapital)}"`,
      `"${formatCurrency(c.currentEquity)}"`,
      `"${c.totalProfit >= 0 ? '+' : ''}${formatCurrency(c.totalProfit)}"`,
      c.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `pamm_clients_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-6">
        {/* Header Card matching majestyfx.com-admin-total-pamm-clients */}
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
                      Clients
                    </span>
                  </h1>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      PAMM Engine
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Live overview of all investors and participants enrolled in PAMM investment pools
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
                      disabled={filteredClients.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-orange text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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

        {/* 4 KPI Cards matching majestyfx.com-admin-total-pamm-clients */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {/* Card 1: Total PAMM Investors */}
          <div className="admin-kpi-card" title="Total PAMM Investors">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <Users className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(totalInvestors)}>
                {totalInvestors}
              </div>
              <div className="admin-kpi-title">Total PAMM Investors</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Active Pool Participants</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Capital Deployed */}
          <div className="admin-kpi-card" title="Total Capital Deployed">
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
              <div className="admin-kpi-value" title={totalCapital === 0 ? '$0' : formatCurrency(totalCapital)}>
                {totalCapital === 0 ? '$0' : formatCurrency(totalCapital)}
              </div>
              <div className="admin-kpi-title">Total Capital Deployed</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Principal Allocation</span>
              </div>
            </div>
          </div>

          {/* Card 3: Current Total Equity */}
          <div className="admin-kpi-card" title="Current Total Equity">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
              }}
            >
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={totalEquity === 0 ? '$0' : formatCurrency(totalEquity)}>
                {totalEquity === 0 ? '$0' : formatCurrency(totalEquity)}
              </div>
              <div className="admin-kpi-title">Current Total Equity</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Mark-to-Market Valuation</span>
              </div>
            </div>
          </div>

          {/* Card 4: Net Investor Profit */}
          <div className="admin-kpi-card" title="Net Investor Profit">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={netProfit === 0 ? '+$0' : `+${formatCurrency(netProfit)}`}>
                {netProfit === 0 ? '+$0' : `+${formatCurrency(netProfit)}`}
              </div>
              <div className="admin-kpi-title">Net Investor Profit</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Cumulative P/L Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PAMM clients by name, email, strategy..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{filteredClients.length}</strong> clients
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
                    <th>CLIENT NAME</th>
                    <th>EMAIL</th>
                    <th>PAMM ACCOUNT</th>
                    <th>STRATEGY</th>
                    <th>INVESTED CAPITAL</th>
                    <th>CURRENT EQUITY</th>
                    <th>TOTAL P/L</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td className="data-table-empty" colSpan={10}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                          No PAMM clients found
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                          There are currently no investors enrolled in PAMM pools.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client, index) => (
                      <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="font-mono text-slate-400 text-xs">{index + 1}</td>
                        <td className="font-bold text-slate-900 text-xs">{client.clientName}</td>
                        <td className="text-blue-600 text-xs">{client.email}</td>
                        <td>
                          <span className="font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-xs">
                            #{client.pammAccount}
                          </span>
                        </td>
                        <td className="font-medium text-slate-800 text-xs">{client.strategy}</td>
                        <td className="font-mono font-bold text-slate-900 text-xs">
                          {formatCurrency(client.investedCapital)}
                        </td>
                        <td className="font-mono font-bold text-slate-900 text-xs">
                          {formatCurrency(client.currentEquity)}
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            +{formatCurrency(client.totalProfit)}
                          </span>
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {client.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="View Client"
                          >
                            <Eye className="w-3.5 h-3.5" />
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
    </div>
  );
}
