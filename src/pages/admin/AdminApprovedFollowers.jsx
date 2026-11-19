import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  PauseCircle,
  PlayCircle,
  StopCircle,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileSpreadsheet,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_approved_followers';

const INITIAL_FOLLOWERS = [
  {
    id: 'sub_1',
    clientName: 'Ghulam Abbas',
    clientEmail: 'ghulam.abas6533@gmail.com',
    clientId: 'cli_ghulam_abbas',
    masterName: 'Test Trader',
    copierAccountLogin: '9009095877833',
    allocatedAmount: 500.0,
    currentEquity: 500.0,
    unrealizedPnL: 0.0,
    realizedPnL: 0.0,
    copyMode: 'proportional',
    status: 'active',
  },
  {
    id: 'sub_2',
    clientName: 'SignalFX',
    clientEmail: 'tradeworld2475@gmail.com',
    clientId: 'cli_signalfx',
    masterName: 'SHAHIL AHMED',
    copierAccountLogin: '9009095877271',
    allocatedAmount: 500.0,
    currentEquity: 338.75,
    unrealizedPnL: 0.0,
    realizedPnL: -161.25,
    copyMode: 'proportional',
    status: 'paused',
  },
  {
    id: 'sub_3',
    clientName: 'Valued Follower',
    clientEmail: 'cli_1792137355291',
    clientId: 'cli_1792137355291',
    masterName: 'Test Trader',
    copierAccountLogin: '9009095877267',
    allocatedAmount: 500.0,
    currentEquity: 500.0,
    unrealizedPnL: 0.0,
    realizedPnL: 0.0,
    copyMode: 'proportional',
    status: 'active',
  },
  {
    id: 'sub_4',
    clientName: 'Valued Follower',
    clientEmail: 'cli_1791610855289',
    clientId: 'cli_1791610855289',
    masterName: 'Alpha Pro Trader',
    copierAccountLogin: '9009095877068',
    allocatedAmount: 500.0,
    currentEquity: 500.0,
    unrealizedPnL: 0.0,
    realizedPnL: 0.0,
    copyMode: 'proportional',
    status: 'active',
  },
];

export default function AdminApprovedFollowers() {
  const [followers, setFollowers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_FOLLOWERS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(followers));
    } catch {
      // ignore
    }
  }, [followers]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Follower subscriptions list refreshed successfully.');
    }, 450);
  };

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAction = (id, action) => {
    setActionLoadingId(id);
    setTimeout(() => {
      if (action === 'pause') {
        setFollowers((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: 'paused' } : f))
        );
        showToast('Follower copy subscription paused.');
      } else if (action === 'resume') {
        setFollowers((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: 'active' } : f))
        );
        showToast('Follower copy subscription resumed.');
      } else if (action === 'stop') {
        setFollowers((prev) => prev.filter((f) => f.id !== id));
        showToast('Follower copy subscription stopped and removed.');
      }
      setActionLoadingId(null);
    }, 350);
  };

  // Filtered Followers
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

  // Derived KPI calculations
  const activeCount = followers.filter((f) => f.status === 'active').length;
  const pausedCount = followers.filter((f) => f.status === 'paused').length;
  const totalAllocated = followers.reduce((sum, f) => sum + (f.allocatedAmount || 0), 0);
  const totalPnL = followers.reduce(
    (sum, f) => sum + (f.realizedPnL || 0) + (f.unrealizedPnL || 0),
    0
  );

  // Pagination
  const totalPages = Math.ceil(filteredFollowers.length / pageSize) || 1;
  const paginatedFollowers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFollowers.slice(start, start + pageSize);
  }, [filteredFollowers, currentPage, pageSize]);

  const handleExportCSV = () => {
    if (filteredFollowers.length === 0) return;

    const headers = [
      'Client ID',
      'Master Strategy',
      'Copier MT5',
      'Allocated Capital',
      'Current Equity',
      'Floating P/L',
      'Realized P/L',
      'Copy Mode',
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
          `$${(f.currentEquity || f.allocatedAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          `${(f.unrealizedPnL || 0) >= 0 ? '+' : ''}$${(f.unrealizedPnL || 0).toFixed(2)}`,
          `${(f.realizedPnL || 0) >= 0 ? '+' : ''}$${(f.realizedPnL || 0).toFixed(2)}`,
          f.copyMode,
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
    link.download = `approved_followers_${new Date().toISOString().slice(0, 10)}.csv`;
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
                    Approved
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Followers
                  </span>
                </h1>
                <div className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  Subscriber Engine
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Active and paused client subscriptions mirroring trades in real-time from master strategies
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-orange text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Active Subscriptions */}
        <div className="admin-kpi-card" title="Active Subscriptions">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <Users size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={activeCount}>
              {activeCount}
            </div>
            <div className="admin-kpi-title">Active Subscriptions</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Live mirror sessions</span>
            </div>
          </div>
        </div>

        {/* Paused Subscriptions */}
        <div className="admin-kpi-card" title="Paused Subscriptions">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
              boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
            }}
          >
            <PauseCircle size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={pausedCount}>
              {pausedCount}
            </div>
            <div className="admin-kpi-title">Paused Subscriptions</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Temporarily halted</span>
            </div>
          </div>
        </div>

        {/* Total Allocated */}
        <div className="admin-kpi-card" title="Total Allocated">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
              boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
            }}
          >
            <DollarSign size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={`$${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            >
              ${totalAllocated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="admin-kpi-title">Total Allocated</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Combined follower equity</span>
            </div>
          </div>
        </div>

        {/* Total Follower P&L */}
        <div className="admin-kpi-card" title="Total Follower P&L">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background:
                totalPnL >= 0
                  ? 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))'
                  : 'linear-gradient(135deg, rgb(251, 113, 133), rgb(225, 29, 72))',
              boxShadow:
                totalPnL >= 0
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
                totalPnL >= 0
                  ? `+$${totalPnL.toFixed(2)}`
                  : `-$${Math.abs(totalPnL).toFixed(2)}`
              }
            >
              {totalPnL >= 0 ? `+$${totalPnL.toFixed(2)}` : `-$${Math.abs(totalPnL).toFixed(2)}`}
            </div>
            <div className="admin-kpi-title">Total Follower P&amp;L</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Net earnings</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Followers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search header bar */}
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
              placeholder="Search by client ID, master or login..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-800">{filteredFollowers.length}</strong> follower{' '}
              {filteredFollowers.length === 1 ? 'subscription' : 'subscriptions'}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>CLIENT</th>
                  <th>MASTER STRATEGY</th>
                  <th>COPIER MT5</th>
                  <th>ALLOCATED</th>
                  <th>CURRENT EQUITY</th>
                  <th>FLOATING P/L</th>
                  <th>REALIZED P/L</th>
                  <th>MODE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFollowers.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No active follower subscriptions found.
                    </td>
                  </tr>
                ) : (
                  paginatedFollowers.map((follower, index) => {
                    const rowNum = (currentPage - 1) * pageSize + index + 1;
                    const isActive = follower.status === 'active';
                    const isPaused = follower.status === 'paused';
                    const isProcessing = actionLoadingId === follower.id;

                    return (
                      <tr key={follower.id || index}>
                        <td data-label="#" style={{ color: 'rgb(100, 116, 139)', fontSize: '0.8rem' }}>
                          {rowNum}
                        </td>
                        <td data-label="CLIENT">
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: 'rgb(15, 23, 42)', fontSize: '12px' }}>
                              {follower.clientName || follower.clientId}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                              {follower.clientEmail || follower.clientId}
                            </span>
                          </div>
                        </td>
                        <td
                          data-label="MASTER STRATEGY"
                          style={{ fontWeight: 700, color: 'rgb(15, 23, 42)' }}
                        >
                          {follower.masterName}
                        </td>
                        <td
                          data-label="COPIER MT5"
                          style={{ fontFamily: 'monospace', fontWeight: 600, color: 'rgb(37, 99, 235)' }}
                        >
                          #{follower.copierAccountLogin}
                        </td>
                        <td
                          data-label="ALLOCATED"
                          style={{ fontFamily: 'monospace', fontWeight: 600, color: 'rgb(51, 65, 85)' }}
                        >
                          $
                          {(follower.allocatedAmount || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          data-label="CURRENT EQUITY"
                          style={{ fontFamily: 'monospace', fontWeight: 700, color: 'rgb(5, 150, 105)' }}
                        >
                          $
                          {(follower.currentEquity || follower.allocatedAmount || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td data-label="FLOATING P/L">
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: (follower.unrealizedPnL || 0) >= 0 ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)',
                            }}
                          >
                            {(follower.unrealizedPnL || 0) >= 0 ? '+' : ''}$
                            {(follower.unrealizedPnL || 0).toFixed(2)}
                          </span>
                        </td>
                        <td data-label="REALIZED P/L">
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: (follower.realizedPnL || 0) >= 0 ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)',
                            }}
                          >
                            {(follower.realizedPnL || 0) >= 0 ? '+' : ''}$
                            {(follower.realizedPnL || 0).toFixed(2)}
                          </span>
                        </td>
                        <td
                          data-label="MODE"
                          style={{ textTransform: 'capitalize', color: 'rgb(71, 85, 105)', fontWeight: 600 }}
                        >
                          {follower.copyMode}
                        </td>
                        <td data-label="STATUS">
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              backgroundColor: isActive ? 'rgb(220, 252, 231)' : 'rgb(254, 243, 199)',
                              color: isActive ? 'rgb(22, 101, 52)' : 'rgb(180, 83, 9)',
                            }}
                          >
                            {isActive ? 'ACTIVE' : 'PAUSED'}
                          </span>
                        </td>
                        <td data-label="ACTIONS" data-actions="" style={{ textAlign: 'right' }}>
                          <div
                            className="admin-action-group"
                            style={{ justifyContent: 'flex-end', gap: '0.35rem' }}
                          >
                            {isActive ? (
                              <button
                                type="button"
                                onClick={() => handleAction(follower.id, 'pause')}
                                disabled={isProcessing}
                                title="Pause copying"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.2rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backgroundColor: 'rgb(255, 251, 235)',
                                  color: 'rgb(180, 83, 9)',
                                  border: '1px solid rgb(253, 230, 138)',
                                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                                }}
                              >
                                <PauseCircle size={11} />
                                <span>Pause</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAction(follower.id, 'resume')}
                                disabled={isProcessing}
                                title="Resume copying"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.2rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backgroundColor: 'rgb(236, 253, 245)',
                                  color: 'rgb(4, 120, 87)',
                                  border: '1px solid rgb(167, 243, 208)',
                                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                                }}
                              >
                                <PlayCircle size={11} />
                                <span>Resume</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleAction(follower.id, 'stop')}
                              disabled={isProcessing}
                              title="Stop copying"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: 'rgb(254, 226, 226)',
                                color: 'rgb(153, 27, 27)',
                                border: '1px solid rgb(254, 205, 211)',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                              }}
                            >
                              <StopCircle size={11} />
                              <span>Stop</span>
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

          {/* Table Pager matching reference */}
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
