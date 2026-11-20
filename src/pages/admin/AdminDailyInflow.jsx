import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  RefreshCw,
  Search,
  RotateCcw,
  X,
  Eye,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_daily_inflow';

// seed data lives in src/data/json (INITIAL_DAILY_INFLOW)

export default function AdminDailyInflow() {
  const { items: records, setItems: setRecords } = useCollection('dailyInflow');

  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


    const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = searchTerm.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.date.includes(q) ||
        r.topMethod.toLowerCase().includes(q) ||
        String(r.totalDeposit).includes(q) ||
        String(r.totalWithdrawal).includes(q);

      const matchFrom = !fromDate || r.date >= fromDate;
      const matchTo = !toDate || r.date <= toDate;

      return matchQuery && matchFrom && matchTo;
    });
  }, [records, searchTerm, fromDate, toDate]);

  // Dynamic KPI Stats
  const totalDeposits = useMemo(
    () => filtered.reduce((acc, r) => acc + (r.totalDeposit || 0), 0),
    [filtered]
  );
  const totalWithdrawals = useMemo(
    () => filtered.reduce((acc, r) => acc + (r.totalWithdrawal || 0), 0),
    [filtered]
  );
  const netInflow = totalDeposits - totalWithdrawals;

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Total Deposits ($)',
      'Total Withdrawals ($)',
      'Net Inflow ($)',
      'Deposit Count',
      'Withdrawal Count',
      'Primary Method',
    ];

    const rows = filtered.map((r) => [
      r.date,
      r.totalDeposit,
      r.totalWithdrawal,
      r.netInflow,
      r.depositCount,
      r.withdrawalCount,
      r.topMethod,
    ]);

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Daily_Inflow_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasFilterActive = searchTerm || fromDate || toDate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Daily Inflow</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Daily Treasury
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Inflow &amp; Outflow
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Daily breakdown of aggregated deposits, withdrawals, and net liquidity settlement.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export to Excel</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                title="Refresh page data"
                aria-label="Refresh"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  border: '1px solid rgb(203, 213, 225)',
                  backgroundColor: 'rgb(255, 255, 255)',
                  color: 'rgb(51, 65, 85)',
                  cursor: 'pointer',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
                  transition: '0.15s',
                }}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Total Deposits */}
        <div className="admin-kpi-card" title="Total Deposits">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`$${totalDeposits.toLocaleString()}`}>
              ${totalDeposits.toLocaleString()}
            </div>
            <div className="admin-kpi-title">Total Deposits</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Aggregated across all gateways</span>
            </div>
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="admin-kpi-card" title="Total Withdrawals">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(251, 146, 60), rgb(234, 88, 12))',
              boxShadow: 'rgba(234, 88, 12, 0.22) 0px 3px 8px',
            }}
          >
            <ArrowDownLeft className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`$${totalWithdrawals.toLocaleString()}`}>
              ${totalWithdrawals.toLocaleString()}
            </div>
            <div className="admin-kpi-title">Total Withdrawals</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Executed client payouts</span>
            </div>
          </div>
        </div>

        {/* Net Cash Inflow */}
        <div className="admin-kpi-card" title="Net Cash Inflow">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`$${netInflow.toLocaleString()}`}>
              ${netInflow.toLocaleString()}
            </div>
            <div className="admin-kpi-title">Net Cash Inflow</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Net retained liquidity</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by date, gateway, status..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 outline-none cursor-pointer"
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-1.5 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 outline-none cursor-pointer"
              />
            </div>

            {hasFilterActive && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFromDate('');
                  setToDate('');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <div className="hidden xl:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
              <span className="font-bold text-slate-700 mr-1">{filtered.length}</span> days
            </div>
          </div>
        </div>
      </div>

      {/* 4. Table Box */}
      <div
        className="admin-table-box"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: '0.5rem',
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
          overflow: 'hidden',
        }}
      >
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>TOTAL DEPOSIT</th>
                  <th>TOTAL WITHDRAW</th>
                  <th>NET INFLOW</th>
                  <th>DEPOSIT TXNS</th>
                  <th>WITHDRAW TXNS</th>
                  <th>PRIMARY GATEWAY</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgb(241, 245, 249)' }}>
                    <td data-label="DATE" style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>
                      {r.date}
                    </td>
                    <td data-label="TOTAL DEPOSIT" style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'rgb(22, 163, 74)' }}>
                      ${r.totalDeposit.toLocaleString()}
                    </td>
                    <td data-label="TOTAL WITHDRAW" style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'rgb(234, 88, 12)' }}>
                      ${r.totalWithdrawal.toLocaleString()}
                    </td>
                    <td data-label="NET INFLOW" style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'rgb(37, 99, 235)' }}>
                      {r.netInflow >= 0 ? `+$${r.netInflow.toLocaleString()}` : `-$${Math.abs(r.netInflow).toLocaleString()}`}
                    </td>
                    <td data-label="DEPOSIT TXNS" style={{ padding: '0.75rem 1rem', color: 'rgb(51, 65, 85)' }}>
                      {r.depositCount}
                    </td>
                    <td data-label="WITHDRAW TXNS" style={{ padding: '0.75rem 1rem', color: 'rgb(51, 65, 85)' }}>
                      {r.withdrawalCount}
                    </td>
                    <td data-label="PRIMARY GATEWAY" style={{ padding: '0.75rem 1rem', color: 'rgb(71, 85, 105)' }}>
                      {r.topMethod}
                    </td>
                    <td data-label="ACTION" data-actions="" style={{ padding: '0.75rem 1rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveRecord(r)}
                        className="admin-action-btn admin-action-btn-view"
                        title="Audit Inflow Record"
                        aria-label="Audit Inflow Record"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 font-medium text-xs">
                      No inflow records match the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pager Controls */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Rows per page"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
              <nav className="table-pager-pages" aria-label="Pages">
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`table-pager-btn table-pager-num ${currentPage === pageNum ? 'active' : ''}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Audit Inflow Record Modal */}
      {activeRecord && (
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
          onClick={() => setActiveRecord(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '480px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  Daily Transaction Summary: {activeRecord.date}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRecord(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Total Deposits</span>
                <strong style={{ color: '#16a34a', fontSize: '1.05rem' }}>
                  ${activeRecord.totalDeposit.toLocaleString()}
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                  ({activeRecord.depositCount} transactions)
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Total Withdrawals</span>
                <strong style={{ color: '#dc2626', fontSize: '1.05rem' }}>
                  ${activeRecord.totalWithdrawal.toLocaleString()}
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                  ({activeRecord.withdrawalCount} transactions)
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Net Liquidity Inflow</span>
                <strong style={{ color: '#2563eb', fontSize: '1.05rem' }}>
                  {activeRecord.netInflow >= 0
                    ? `+$${activeRecord.netInflow.toLocaleString()}`
                    : `-$${Math.abs(activeRecord.netInflow).toLocaleString()}`}
                </strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Primary Gateway Method</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{activeRecord.topMethod}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveRecord(null)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Version Footer */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgb(226, 232, 240)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: '0.8125rem',
          color: 'rgb(100, 116, 139)',
        }}
      >
        <span>Version 2.0</span>
      </footer>
    </div>
  );
}
