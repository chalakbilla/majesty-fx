import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  StopCircle,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_rejected_followers';

// seed data lives in src/data/json (INITIAL_REJECTED_FOLLOWERS)

export default function AdminRejectedFollowers() {
  const { items: followers, setItems: setFollowers } = useCollection('rejectedFollowers');

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Stopped/rejected follower subscriptions list refreshed.');
    }, 450);
  };

  // Filtered followers
  const filteredFollowers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return followers;
    return followers.filter((f) => {
      const name = (f.clientName || '').toLowerCase();
      const email = (f.clientEmail || '').toLowerCase();
      const id = (f.clientId || '').toLowerCase();
      const master = (f.masterName || '').toLowerCase();
      const login = String(f.copierAccountLogin || '');
      return (
        name.includes(q) ||
        email.includes(q) ||
        id.includes(q) ||
        master.includes(q) ||
        login.includes(q)
      );
    });
  }, [followers, searchTerm]);

  // Derived KPIs
  const stoppedCount = followers.length;
  const totalRealizedPnL = followers.reduce((sum, f) => sum + (f.realizedPnL || 0), 0);
  const totalFormerAllocated = followers.reduce((sum, f) => sum + (f.allocatedAmount || 0), 0);

  // Pagination
  const totalPages = Math.ceil(filteredFollowers.length / pageSize) || 1;
  const paginatedFollowers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFollowers.slice(start, start + pageSize);
  }, [filteredFollowers, currentPage, pageSize]);

  const handleExportCSV = () => {
    if (filteredFollowers.length === 0) return;

    const headers = [
      'Client',
      'Copied Master',
      'Copier MT5',
      'Allocated',
      'Realized P&L',
      'Copy Mode',
      'Start Date',
      'Status',
    ];

    const escapeCell = (val) => {
      let str = String(val ?? '');
      if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvRows = [
      headers.map(escapeCell).join(','),
      ...filteredFollowers.map((f) =>
        [
          f.clientName ? `${f.clientName} (${f.clientEmail})` : f.clientId,
          f.masterName,
          f.copierAccountLogin,
          `$${(f.allocatedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          `${(f.realizedPnL || 0) >= 0 ? '+' : ''}$${(f.realizedPnL || 0).toFixed(2)}`,
          f.copyMode,
          f.startDate,
          f.status,
        ]
          .map(escapeCell)
          .join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rejected_followers_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: toastMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${toastMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            color: toastMsg.type === 'error' ? '#991b1b' : '#166534',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {toastMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Stopped / Rejected
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Followers
                  </span>
                </h1>
                <div className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Subscription History
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Historical copy trading follower subscriptions that have been discontinued or cancelled
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    disabled={filteredFollowers.length === 0}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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

      {/* 2. 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Stopped Subscriptions */}
        <div className="admin-kpi-card" title="Stopped Subscriptions">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(251, 113, 133), rgb(225, 29, 72))',
              boxShadow: 'rgba(225, 29, 72, 0.22) 0px 3px 8px',
            }}
          >
            <StopCircle size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={stoppedCount}>
              {stoppedCount}
            </div>
            <div className="admin-kpi-title">Stopped Subscriptions</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Discontinued mirror accounts</span>
            </div>
          </div>
        </div>

        {/* Total Realized P&L */}
        <div className="admin-kpi-card" title="Total Realized P&L">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background:
                totalRealizedPnL >= 0
                  ? 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))'
                  : 'linear-gradient(135deg, rgb(251, 113, 133), rgb(225, 29, 72))',
              boxShadow:
                totalRealizedPnL >= 0
                  ? 'rgba(5, 150, 105, 0.22) 0px 3px 8px'
                  : 'rgba(225, 29, 72, 0.22) 0px 3px 8px',
            }}
          >
            <TrendingUp size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={
                totalRealizedPnL >= 0
                  ? `+$${totalRealizedPnL.toFixed(2)}`
                  : `-$${Math.abs(totalRealizedPnL).toFixed(2)}`
              }
            >
              {totalRealizedPnL >= 0
                ? `+$${totalRealizedPnL.toFixed(2)}`
                : `-$${Math.abs(totalRealizedPnL).toFixed(2)}`}
            </div>
            <div className="admin-kpi-title">Total Realized P&amp;L</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Net performance balance</span>
            </div>
          </div>
        </div>

        {/* Former Allocated */}
        <div className="admin-kpi-card" title="Former Allocated">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <DollarSign size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={`$${totalFormerAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            >
              ${totalFormerAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="admin-kpi-title">Former Allocated</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Historical mirror capital</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by client ID, master name, or login..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-800">{filteredFollowers.length}</strong> stopped{' '}
              {filteredFollowers.length === 1 ? 'subscription' : 'subscriptions'}
            </span>
          </div>
        </div>

        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Copied Master</th>
                  <th>Copier MT5</th>
                  <th>Allocated</th>
                  <th>Realized P&amp;L</th>
                  <th>Copy Mode</th>
                  <th>Start Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFollowers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                      <XCircle size={36} color="#cbd5e1" style={{ margin: '0 auto 0.75rem auto' }} />
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: '#334155' }}>
                        No stopped or rejected follower subscriptions found.
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        Cancelled or stopped subscriptions will appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedFollowers.map((follower, index) => (
                    <tr key={follower.id || index}>
                      <td data-label="Client">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 700, color: 'rgb(15, 23, 42)', fontSize: '12px' }}>
                            {follower.clientName || follower.clientId}
                          </span>
                          <span style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                            {follower.clientEmail || follower.clientId}
                          </span>
                        </div>
                      </td>
                      <td data-label="Copied Master" style={{ fontWeight: 700, color: 'rgb(30, 41, 59)' }}>
                        {follower.masterName}
                      </td>
                      <td
                        data-label="Copier MT5"
                        style={{ fontFamily: 'monospace', fontWeight: 600, color: 'rgb(37, 99, 235)' }}
                      >
                        {follower.copierAccountLogin}
                      </td>
                      <td
                        data-label="Allocated"
                        style={{ fontFamily: 'monospace', fontWeight: 600, color: 'rgb(51, 65, 85)' }}
                      >
                        $
                        {(follower.allocatedAmount || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td data-label="Realized P&L">
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: (follower.realizedPnL || 0) >= 0 ? 'rgb(16, 185, 129)' : 'rgb(225, 29, 72)',
                          }}
                        >
                          {(follower.realizedPnL || 0) >= 0 ? '+' : ''}$
                          {(follower.realizedPnL || 0).toFixed(2)}
                        </span>
                      </td>
                      <td
                        data-label="Copy Mode"
                        style={{ textTransform: 'capitalize', color: 'rgb(71, 85, 105)', fontWeight: 600 }}
                      >
                        {follower.copyMode}
                      </td>
                      <td
                        data-label="Start Date"
                        style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgb(100, 116, 139)' }}
                      >
                        {follower.startDate}
                      </td>
                      <td data-label="Status">
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: 'rgb(241, 245, 249)',
                            color: 'rgb(100, 116, 139)',
                            border: '1px solid rgb(203, 213, 225)',
                          }}
                        >
                          {follower.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pager */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>{filteredFollowers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * pageSize, filteredFollowers.length)}</strong> of{' '}
              <strong>{filteredFollowers.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  aria-label="Rows per page"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
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
                  <ChevronLeft size={13} />
                  <span>Prev</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`table-pager-btn table-pager-num ${currentPage === num ? 'font-bold bg-slate-200' : ''}`}
                    aria-current={currentPage === num ? 'page' : undefined}
                    onClick={() => setCurrentPage(num)}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={13} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
