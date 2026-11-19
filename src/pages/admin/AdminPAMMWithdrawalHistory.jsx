import { useState, useMemo, useCallback } from 'react';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  X,
  XCircle,
} from 'lucide-react';

export default function AdminPAMMWithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [viewRequest, setViewRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint =
        statusFilter !== 'ALL'
          ? `/api/pamm/withdrawals?status=${encodeURIComponent(statusFilter.toLowerCase())}`
          : '/api/pamm/withdrawals';
      const res = await fetch(endpoint, {
        headers: { 'x-requested-with': 'XMLHttpRequest' },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.withdrawals)) {
        setWithdrawals(res.withdrawals);
      } else {
        setWithdrawals([]);
      }
    } catch (err) {
      console.error('Failed to load PAMM withdrawals:', err);
      setWithdrawals([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadData();
    }, 400);
  };

  const handleApprove = async (item) => {
    if (window.confirm(`Are you sure you want to approve PAMM withdrawal request ${item.requestId} for ${item.amount}?`)) {
      setIsUpdating(true);
      try {
        await fetch('/api/pamm/withdrawals', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: item.requestId, status: 'Completed' }),
        }).catch(() => null);

        // Update locally
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.requestId === item.requestId
              ? { ...w, status: 'Completed', processDate: new Date().toISOString().slice(0, 10) }
              : w
          )
        );
      } catch (err) {
        alert(err.message || 'Error approving withdrawal');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleReject = async (e) => {
    if (e) e.preventDefault();
    if (!rejectRequest) return;
    setIsUpdating(true);
    try {
      await fetch('/api/pamm/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: rejectRequest.requestId,
          status: 'Rejected',
          rejectionReason: rejectionReason || 'Rejected by administrator',
        }),
      }).catch(() => null);

      // Update locally
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.requestId === rejectRequest.requestId
            ? {
                ...w,
                status: 'Rejected',
                reason: rejectionReason || 'Rejected by administrator',
                processDate: new Date().toISOString().slice(0, 10),
              }
            : w
        )
      );

      setRejectRequest(null);
      setRejectionReason('');
    } catch (err) {
      alert(err.message || 'Error rejecting withdrawal');
    } finally {
      setIsUpdating(false);
    }
  };

  const distinctMethods = useMemo(() => {
    const s = new Set();
    withdrawals.forEach((w) => {
      if (w.paymentMethod) s.add(w.paymentMethod);
    });
    return Array.from(s);
  }, [withdrawals]);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((item) => {
      if (statusFilter !== 'ALL' && item.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (methodFilter !== 'ALL' && item.paymentMethod !== methodFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.requestId?.toLowerCase().includes(q) ||
          item.clientName?.toLowerCase().includes(q) ||
          item.accountNo?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [withdrawals, searchQuery, statusFilter, methodFilter]);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return { bg: '#dcfce7', color: '#15803d', label: 'Completed' };
      case 'Pending':
        return { bg: '#fef3c7', color: '#b45309', label: 'Pending' };
      case 'Processing':
        return { bg: '#e0e7ff', color: '#4338ca', label: 'Processing' };
      case 'Rejected':
        return { bg: '#fee2e2', color: '#b91c1c', label: 'Rejected' };
      default:
        return { bg: '#f1f5f9', color: '#475569', label: status || 'Pending' };
    }
  };

  // KPI calculations
  const totalRequests = withdrawals.length;
  const completedWithdrawals = withdrawals.filter((w) => w.status === 'Completed');
  const completedAmount = completedWithdrawals.reduce((sum, w) => sum + (Number(w.amountNum) || 0), 0);
  const pendingCount = withdrawals.filter((w) => w.status === 'Pending' || w.status === 'Processing').length;
  const rejectedCount = withdrawals.filter((w) => w.status === 'Rejected').length;

  const handleExportCSV = () => {
    if (filteredWithdrawals.length === 0) return;

    const escapeCSV = (val) => {
      let s = String(val ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Request ID',
      'Client Name',
      'Account No',
      'Amount',
      'Payment Method',
      'Status',
      'Request Date',
      'Process Date',
      'Rejection Reason',
    ];

    const rows = filteredWithdrawals.map((w) => [
      w.requestId,
      w.clientName,
      w.accountNo,
      w.amount,
      w.paymentMethod,
      w.status,
      w.requestDate,
      w.processDate || '-',
      w.reason || '-',
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pamm_withdrawals_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5">
        {/* Top Header Card matching majestyfx.com-admin-pamm-withdrawal-history */}
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
                      PAMM Withdrawal
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      History
                    </span>
                  </h1>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      Fund Operations
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Manage investor profit and capital withdrawal requests across PAMM pools
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
                      disabled={filteredWithdrawals.length === 0}
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
          {/* Total Payout Requests */}
          <div className="admin-kpi-card" title="Total Payout Requests">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <DollarSign size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(totalRequests)}>
                {totalRequests}
              </div>
              <div className="admin-kpi-title">Total Payout Requests</div>
              <div className="admin-kpi-sub">
                <span className="truncate">All Investor Submissions</span>
              </div>
            </div>
          </div>

          {/* Completed Withdrawals */}
          <div className="admin-kpi-card" title="Completed Withdrawals">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
                boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
              }}
            >
              <CheckCircle size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div
                className="admin-kpi-value"
                title={`$${completedAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              >
                ${completedAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="admin-kpi-title">Completed Withdrawals</div>
              <div className="admin-kpi-sub">
                <span className="truncate">{completedWithdrawals.length} Requests Disbursed</span>
              </div>
            </div>
          </div>

          {/* Pending / Processing */}
          <div className="admin-kpi-card" title="Pending / Processing">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <Clock size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(pendingCount)}>
                {pendingCount}
              </div>
              <div className="admin-kpi-title">Pending / Processing</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Awaiting Admin Clearance</span>
              </div>
            </div>
          </div>

          {/* Rejected Withdrawals */}
          <div className="admin-kpi-card" title="Rejected Withdrawals">
            <div
              className="admin-kpi-icon-squircle text-white"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 113, 133), rgb(225, 29, 72))',
                boxShadow: 'rgba(225, 29, 72, 0.22) 0px 3px 8px',
              }}
            >
              <XCircle size={18} strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(rejectedCount)}>
                {rejectedCount}
              </div>
              <div className="admin-kpi-title">Rejected Withdrawals</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Documented Compliance Flags</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table Header Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search request ID, client, account..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Rejected">Rejected</option>
              </select>
              {distinctMethods.length > 0 && (
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="ALL">All Methods</option>
                  {distinctMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{filteredWithdrawals.length}</strong>{' '}
                {filteredWithdrawals.length === 1 ? 'request' : 'requests'}
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
                    <th>REQUEST ID</th>
                    <th>INVESTOR / CLIENT</th>
                    <th>PAMM ACCOUNT</th>
                    <th>AMOUNT</th>
                    <th>PAYMENT METHOD</th>
                    <th>REQUEST DATE</th>
                    <th>PROCESS DATE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td className="data-table-empty" colSpan={10}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                          No PAMM withdrawal records found
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                          There are currently no withdrawal requests matching this view.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((item, idx) => {
                      const badge = getStatusBadge(item.status);
                      return (
                        <tr key={item.id || item.requestId || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{idx + 1}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                            {item.requestId}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{item.clientName}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontFamily: 'monospace' }}>{item.accountNo}</td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>{item.amount}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{item.paymentMethod}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.requestDate}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.processDate || '-'}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                padding: '0.15rem 0.55rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: badge.bg,
                                color: badge.color,
                              }}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <div className="admin-action-group" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setViewRequest(item)}
                                title="View Details"
                                aria-label="View Details"
                                className="admin-action-btn admin-action-btn-view"
                              >
                                <Eye size={13} />
                              </button>
                              {item.status === 'Pending' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(item)}
                                    disabled={isUpdating}
                                    title="Approve Withdrawal"
                                    aria-label="Approve Withdrawal"
                                    className="admin-action-btn admin-action-btn-approve"
                                  >
                                    <CheckCircle size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectRequest(item);
                                      setRejectionReason('');
                                    }}
                                    disabled={isUpdating}
                                    title="Reject Withdrawal"
                                    aria-label="Reject Withdrawal"
                                    className="admin-action-btn admin-action-btn-reject"
                                  >
                                    <XCircle size={13} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal: View Withdrawal Details */}
        {viewRequest && (
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
            onClick={() => setViewRequest(null)}
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
                  PAMM Withdrawal Request ({viewRequest.requestId})
                </h3>
                <button
                  type="button"
                  onClick={() => setViewRequest(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Investor Name</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.825rem' }}>{viewRequest.clientName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>PAMM Pool Account</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.825rem', fontFamily: 'monospace' }}>
                    {viewRequest.accountNo}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Withdrawal Amount</span>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.825rem' }}>{viewRequest.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Payment Method</span>
                  <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.825rem' }}>{viewRequest.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Request Date</span>
                  <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.825rem' }}>{viewRequest.requestDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Processing Date</span>
                  <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.825rem' }}>{viewRequest.processDate || '-'}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: viewRequest.reason ? '1px solid #f1f5f9' : 'none',
                    paddingBottom: '0.5rem',
                  }}
                >
                  <span style={{ color: '#64748b', fontSize: '0.825rem' }}>Current Status</span>
                  <span style={{ fontWeight: 700, color: getStatusBadge(viewRequest.status).color, fontSize: '0.825rem' }}>
                    {viewRequest.status}
                  </span>
                </div>
                {viewRequest.reason && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600 }}>Rejection Reason</span>
                    <span style={{ color: '#475569', fontSize: '0.8rem', backgroundColor: '#fef2f2', padding: '0.45rem', borderRadius: '4px' }}>
                      {viewRequest.reason}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setViewRequest(null)}
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

        {/* Modal: Reject Request Reason */}
        {rejectRequest && (
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
            onClick={() => setRejectRequest(null)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                maxWidth: '440px',
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
                  backgroundColor: '#fef2f2',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#991b1b' }}>
                  Reject PAMM Withdrawal ({rejectRequest.requestId})
                </h3>
                <button
                  type="button"
                  onClick={() => setRejectRequest(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleReject} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', color: '#475569' }}>
                    Please specify the reason for rejecting <strong>{rejectRequest.clientName}</strong>&apos;s request for{' '}
                    <strong>{rejectRequest.amount}</strong>:
                  </p>
                  <textarea
                    required
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g. Beneficiary details mismatch, margin requirements, etc."
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.825rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setRejectRequest(null)}
                    style={{
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#64748b',
                      borderRadius: '0.375rem',
                      padding: '0.45rem 1rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    style={{
                      backgroundColor: '#dc2626',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '0.375rem',
                      padding: '0.45rem 1rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: isUpdating ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isUpdating ? 'Updating...' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
