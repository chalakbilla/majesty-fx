import { useState, useMemo, useCallback } from 'react';
import {
  Award,
  CheckCircle,
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';

export default function AdminPAMMCommissionReport() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatement, setSelectedStatement] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pamm/commissions', {
        headers: { 'x-requested-with': 'XMLHttpRequest' },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.reports)) {
        setReports(res.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error('Failed to load PAMM commission reports:', err);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadData();
    }, 400);
  };

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const q = searchQuery.toLowerCase().trim();
    return reports.filter(
      (r) =>
        r.period?.toLowerCase().includes(q) ||
        r.pammAccount?.toLowerCase().includes(q) ||
        r.fundManager?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
    );
  }, [reports, searchQuery]);

  // Aggregated KPIs
  const totalPoolProfits = useMemo(() => {
    return reports.reduce((sum, r) => sum + (Number(r.totalProfit) || 0), 0);
  }, [reports]);

  const totalManagerFees = useMemo(() => {
    return reports.reduce((sum, r) => sum + (Number(r.managerShare) || 0), 0);
  }, [reports]);

  const totalInvestorPayouts = useMemo(() => {
    return reports.reduce((sum, r) => sum + (Number(r.investorPayout) || 0), 0);
  }, [reports]);

  const settledCount = useMemo(() => {
    return reports.filter((r) => r.status === 'Settled').length;
  }, [reports]);

  const handleExportCSV = () => {
    if (filteredReports.length === 0) return;

    const escapeCSV = (val) => {
      let s = String(val ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };

    const headers = [
      '#',
      'Period',
      'PAMM Account',
      'Fund Manager',
      'Total Profit ($)',
      'Manager Share ($)',
      'Investor Payout ($)',
      'Status',
    ];

    const rows = filteredReports.map((r, i) => [
      r.id || i + 1,
      r.period,
      r.pammAccount,
      r.fundManager,
      `$${Number(r.totalProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      `$${Number(r.managerShare || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} (${r.managerPercent || '20%'})`,
      `$${Number(r.investorPayout || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      r.status,
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pamm_commission_reports_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5">
        {/* Top Header Card matching majestyfx.com-admin-pamm-commission-report */}
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
                      PAMM Commission
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Report
                    </span>
                  </h1>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      Fee Accounting
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Live periodic statements, management performance fees, and investor profit payouts
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRefresh}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      title="Refresh"
                    >
                      <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      disabled={filteredReports.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-orange text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {/* Total Pool Profits */}
          <div className="admin-kpi-card" title="Total Pool Profits">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <TrendingUp size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div
                className="admin-kpi-value"
                title={`$${totalPoolProfits.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              >
                ${totalPoolProfits.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="admin-kpi-title">Total Pool Profits</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Generated Returns</span>
              </div>
            </div>
          </div>

          {/* Manager Performance Fees */}
          <div className="admin-kpi-card" title="Manager Performance Fees">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
              }}
            >
              <Award size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div
                className="admin-kpi-value"
                title={`$${totalManagerFees.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              >
                ${totalManagerFees.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="admin-kpi-title">Manager Performance Fees</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Earned Management Share</span>
              </div>
            </div>
          </div>

          {/* Investor Payouts */}
          <div className="admin-kpi-card" title="Investor Payouts">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
                boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
              }}
            >
              <DollarSign size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div
                className="admin-kpi-value"
                title={`$${totalInvestorPayouts.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              >
                ${totalInvestorPayouts.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="admin-kpi-title">Investor Payouts</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Net Distributed Earnings</span>
              </div>
            </div>
          </div>

          {/* Settled Statements */}
          <div className="admin-kpi-card" title="Settled Statements">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <CheckCircle size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={`${settledCount} / ${reports.length}`}>
                {settledCount} / {reports.length}
              </div>
              <div className="admin-kpi-title">Settled Statements</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Audited Accounting Cycles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search period, PAMM account, manager..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Total Statements: <strong className="text-slate-800">{filteredReports.length}</strong>
              </span>
            </div>
          </div>

          {/* Data Table */}
          <div className="data-table data-table--plain">
            <div className="data-table-scroll">
              <table className="data-table-grid" data-cards="">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>PERIOD</th>
                    <th>PAMM ACCOUNT</th>
                    <th>FUND MANAGER</th>
                    <th>TOTAL PROFIT</th>
                    <th>MANAGER FEE SHARE</th>
                    <th>INVESTOR PAYOUT</th>
                    <th>SETTLEMENT STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td className="data-table-empty" colSpan={9}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                          No PAMM commission records available
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                          Statements will be automatically generated upon pool profit distribution.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report, idx) => (
                      <tr key={report.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{report.period}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                          {report.pammAccount}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155', fontWeight: 600 }}>{report.fundManager}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                          ${Number(report.totalProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#16a34a' }}>
                          ${Number(report.managerShare || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} &nbsp;
                          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>
                            ({report.managerPercent || '20%'})
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb' }}>
                          ${Number(report.investorPayout || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.55rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor:
                                report.status === 'Settled'
                                  ? '#dcfce7'
                                  : report.status === 'Processing'
                                  ? '#fef3c7'
                                  : '#fee2e2',
                              color:
                                report.status === 'Settled'
                                  ? '#15803d'
                                  : report.status === 'Processing'
                                  ? '#92400e'
                                  : '#991b1b',
                            }}
                          >
                            {report.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="admin-action-group" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedStatement(report)}
                              className="admin-action-btn admin-action-btn-view"
                              title="View Statement Breakdown"
                              aria-label="View Statement Breakdown"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: Statement Details */}
        {selectedStatement && (
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
            onClick={() => setSelectedStatement(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: '480px',
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
                  backgroundColor: '#f8fafc',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  PAMM Settlement Statement ({selectedStatement.pammAccount})
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedStatement(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Audit Period</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.825rem' }}>{selectedStatement.period}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Fund Manager</span>
                  <span style={{ fontWeight: 600, color: '#2563eb', fontSize: '0.825rem' }}>{selectedStatement.fundManager}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Net Pool Profit</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.825rem' }}>
                    ${Number(selectedStatement.totalProfit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>
                    Performance Fee Share ({selectedStatement.managerPercent || '20%'})
                  </span>
                  <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.825rem' }}>
                    ${Number(selectedStatement.managerShare || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Total Investor Payout</span>
                  <span style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.825rem' }}>
                    ${Number(selectedStatement.investorPayout || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Settlement Status</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: selectedStatement.status === 'Settled' ? '#16a34a' : '#d97706',
                      fontSize: '0.825rem',
                    }}
                  >
                    {selectedStatement.status}
                  </span>
                </div>
              </div>

              <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStatement(null)}
                  style={{
                    backgroundColor: '#475569',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.45rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
