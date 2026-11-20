import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  Download,
  RefreshCw,
  Search,
  Filter,
  RotateCcw,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCode,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_payment_method_history';

// seed data lives in src/data/json (INITIAL_AUDIT_LOGS)

function formatConfig(val) {
  if (val === null || val === undefined) return 'No previous value';
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}

export default function AdminPaymentMethodHistory() {
  const { items: logs, setItems: setLogs } = useCollection('paymentMethodHistory');

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeLog, setActiveLog] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


    const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'All' && log.action.toLowerCase() !== actionFilter.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          log.methodName.toLowerCase().includes(q) ||
          log.modifiedBy.toLowerCase().includes(q) ||
          (log.ipAddress && log.ipAddress.toLowerCase().includes(q)) ||
          formatConfig(log.newValue).toLowerCase().includes(q) ||
          formatConfig(log.previousValue).toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, searchTerm, actionFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Method Name',
      'Action',
      'Previous Value',
      'New Value',
      'Modified By',
      'IP Address',
      'Timestamp',
      'Status',
    ];

    const rows = filtered.map((l) => [
      l.id,
      l.methodName,
      l.action,
      formatConfig(l.previousValue),
      formatConfig(l.newValue),
      l.modifiedBy,
      l.ipAddress,
      l.timestamp,
      l.status,
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
    link.download = `payment_method_history_audit_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasFilterActive = searchTerm || actionFilter !== 'All';

  const getActionBadge = (action) => {
    const act = (action || '').toLowerCase();
    if (act === 'created') {
      return (
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: 'rgb(239, 246, 255)',
            color: 'rgb(37, 99, 235)',
          }}
        >
          Created
        </span>
      );
    }
    if (act === 'deleted') {
      return (
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: 'rgb(254, 242, 242)',
            color: 'rgb(220, 38, 38)',
          }}
        >
          Deleted
        </span>
      );
    }
    return (
      <span
        style={{
          padding: '0.15rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          backgroundColor: 'rgb(254, 243, 199)',
          color: 'rgb(180, 83, 9)',
        }}
      >
        Updated
      </span>
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
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <Link to="/admin/payment-methods" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              System Settings
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Payment Method History</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Payment Methods
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Audit History
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Comprehensive immutable audit trail of payment methods, gateway configurations, and treasury account changes
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
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

      {/* 2. Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2.5 flex-1">
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by method name, admin email, IP..."
                className="w-full pl-8 pr-8 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="All">All Actions</option>
                <option value="Created">Created</option>
                <option value="Updated">Updated</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasFilterActive && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('All');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg whitespace-nowrap">
              {filtered.length} logs
            </span>
          </div>
        </div>
      </div>

      {/* 3. Table Box */}
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
                  <th>LOG ID</th>
                  <th>PAYMENT METHOD</th>
                  <th>ACTION TYPE</th>
                  <th>PREVIOUS CONFIG</th>
                  <th>UPDATED CONFIG</th>
                  <th>MODIFIED BY</th>
                  <th>IP ADDRESS</th>
                  <th>TIMESTAMP</th>
                  <th>AUDIT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((log, idx) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid rgb(241, 245, 249)',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    }}
                  >
                    <td
                      data-label="LOG ID"
                      style={{ padding: '0.75rem 1rem', color: 'rgb(100, 116, 139)' }}
                      title={log.id}
                    >
                      #{log.id.length > 18 ? `${log.id.slice(0, 18)}...` : log.id}
                    </td>
                    <td
                      data-label="PAYMENT METHOD"
                      style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'rgb(15, 23, 42)' }}
                    >
                      {log.methodName}
                    </td>
                    <td data-label="ACTION TYPE" style={{ padding: '0.75rem 1rem' }}>
                      {getActionBadge(log.action)}
                    </td>
                    <td
                      data-label="PREVIOUS CONFIG"
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'rgb(100, 116, 139)',
                        fontFamily: 'monospace',
                        maxWidth: '220px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={formatConfig(log.previousValue)}
                      onClick={() => setActiveLog({ ...log, viewingConfig: 'previous' })}
                      className="cursor-pointer hover:underline"
                    >
                      {formatConfig(log.previousValue)}
                    </td>
                    <td
                      data-label="UPDATED CONFIG"
                      style={{
                        padding: '0.75rem 1rem',
                        fontWeight: 600,
                        color: 'rgb(15, 23, 42)',
                        fontFamily: 'monospace',
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={formatConfig(log.newValue)}
                      onClick={() => setActiveLog({ ...log, viewingConfig: 'new' })}
                      className="cursor-pointer hover:underline"
                    >
                      {formatConfig(log.newValue)}
                    </td>
                    <td
                      data-label="MODIFIED BY"
                      style={{ padding: '0.75rem 1rem', color: 'rgb(37, 99, 235)' }}
                    >
                      {log.modifiedBy}
                    </td>
                    <td
                      data-label="IP ADDRESS"
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'rgb(100, 116, 139)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {log.ipAddress || '—'}
                    </td>
                    <td
                      data-label="TIMESTAMP"
                      style={{ padding: '0.75rem 1rem', color: 'rgb(100, 116, 139)' }}
                    >
                      {log.timestamp}
                    </td>
                    <td data-label="AUDIT STATUS" style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgb(220, 252, 231)',
                          color: 'rgb(21, 128, 61)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-slate-400 font-medium text-xs">
                      No audit records match the selected filter.
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

      {/* 4. Config Detail Modal */}
      {activeLog && (
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
          onClick={() => setActiveLog(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '85vh',
              overflowY: 'auto',
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
                <FileCode className="w-5 h-5 text-orange-600" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  Gateway Config Audit: {activeLog.methodName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>LOG ID</span>
                  <code style={{ fontSize: '0.8rem' }}>#{activeLog.id}</code>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>ACTION TYPE</span>
                  {getActionBadge(activeLog.action)}
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>MODIFIED BY</span>
                  <strong style={{ color: 'rgb(37, 99, 235)' }}>{activeLog.modifiedBy}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>TIMESTAMP</span>
                  <span>{activeLog.timestamp}</span>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                  PREVIOUS CONFIGURATION
                </span>
                <pre
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: '#64748b',
                  }}
                >
                  {formatConfig(activeLog.previousValue)}
                </pre>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                  UPDATED / CURRENT CONFIGURATION
                </span>
                <pre
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: '#0f172a',
                    fontWeight: 600,
                  }}
                >
                  {formatConfig(activeLog.newValue)}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveLog(null)}
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
                Close Audit Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Version Footer */}
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
