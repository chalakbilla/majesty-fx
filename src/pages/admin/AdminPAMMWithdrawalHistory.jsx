import { useState, useMemo, useCallback } from 'react';
import useCollection from '../../hooks/useCollection.js';
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

export default function AdminPAMMWithdrawalHistory({
  initialStatus = 'ALL',
  customTitle = 'PAMM Withdrawal History',
  customSubtitle = 'Manage investor profit and capital withdrawal requests across PAMM pools',
}) {
  const { items: withdrawals, update: updateWithdrawal } = useCollection('pammWithdrawals');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [viewRequest, setViewRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  };

  // UPDATE: approve -> Completed
  const handleApprove = (item) => {
    if (window.confirm(`Are you sure you want to approve PAMM withdrawal request ${item.requestId} for ${item.amount}?`)) {
      updateWithdrawal(item.id, { status: 'Completed', processDate: new Date().toISOString().slice(0, 10) });
    }
  };

  // UPDATE: reject -> Rejected (+ reason)
  const handleReject = (e) => {
    if (e) e.preventDefault();
    if (!rejectRequest) return;
    updateWithdrawal(rejectRequest.id, {
      status: 'Rejected',
      rejectionReason: rejectionReason || 'Rejected by administrator',
      processDate: new Date().toISOString().slice(0, 10),
    });
    setRejectRequest(null);
    setRejectionReason('');
  };

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((item) => {
      if (initialStatus !== 'ALL' && item.status?.toLowerCase() !== initialStatus.toLowerCase()) {
        return false;
      }
      if (initialStatus === 'ALL' && statusFilter !== 'ALL' && item.status?.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (methodFilter !== 'ALL' && item.paymentMethod !== methodFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.requestId?.toLowerCase().includes(q);
        const matchesClient = item.clientName?.toLowerCase().includes(q) || item.clientEmail?.toLowerCase().includes(q);
        const matchesAccount = item.pammAccountNumber?.toLowerCase().includes(q) || item.pammAccountName?.toLowerCase().includes(q);
        const matchesMethod = item.paymentMethod?.toLowerCase().includes(q);
        return matchesId || matchesClient || matchesAccount || matchesMethod;
      }
      return true;
    });
  }, [withdrawals, initialStatus, statusFilter, methodFilter, searchQuery]);

  const distinctMethods = useMemo(() => {
    const s = new Set();
    withdrawals.forEach((w) => {
      if (w.paymentMethod) s.add(w.paymentMethod);
    });
    return Array.from(s);
  }, [withdrawals]);

  // Compute KPI metrics
  const totalRequests = withdrawals.length;
  const completedWithdrawals = withdrawals.filter((w) => w.status === 'Completed');
  const completedAmount = completedWithdrawals.reduce((sum, w) => {
    const n = parseFloat(String(w.amount).replace(/[^0-9.-]+/g, '')) || 0;
    return sum + n;
  }, 0);
  const pendingCount = withdrawals.filter((w) => w.status === 'Pending' || w.status === 'Processing').length;
  const rejectedCount = withdrawals.filter((w) => w.status === 'Rejected').length;

  // Title split logic
  const titleWords = (customTitle || 'PAMM Withdrawal History').split(' ');
  const lastWord = titleWords.pop();
  const mainTitle = titleWords.join(' ');

  const handleExportCSV = () => {
    if (filteredWithdrawals.length === 0) return;
    const headers = [
      '#',
      'Request ID',
      'Client Name',
      'Client Email',
      'PAMM Account Number',
      'PAMM Account Name',
      'Amount',
      'Payment Method',
      'Payment Details',
      'Request Date',
      'Process Date',
      'Status',
      'Rejection Reason',
    ];
    const rows = filteredWithdrawals.map((w, idx) => [
      idx + 1,
      w.requestId || '',
      `"${(w.clientName || '').replace(/"/g, '""')}"`,
      w.clientEmail || '',
      w.pammAccountNumber || '',
      `"${(w.pammAccountName || '').replace(/"/g, '""')}"`,
      w.amount || '',
      w.paymentMethod || '',
      `"${(w.paymentDetails || '').replace(/"/g, '""')}"`,
      w.requestDate || '',
      w.processDate || '',
      w.status || '',
      `"${(w.rejectionReason || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${customTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner Card */}
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
                    {mainTitle}
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    {lastWord}
                  </span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">
                  Fund Operations
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                {customSubtitle}
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
            {initialStatus === 'ALL' && (
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
            )}
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
                    <td colSpan={10} className="data-table-empty">
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                        No PAMM withdrawal records found
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                        There are currently no withdrawal requests matching this view.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map((item, index) => {
                    const isPending = item.status === 'Pending' || item.status === 'Processing';
                    const isCompleted = item.status === 'Completed';
                    const isRejected = item.status === 'Rejected';

                    return (
                      <tr key={item.id || item.requestId || index}>
                        <td>{index + 1}</td>
                        <td className="font-mono font-medium text-slate-900">{item.requestId || '—'}</td>
                        <td>
                          <div>
                            <div className="font-semibold text-slate-900">{item.clientName || '—'}</div>
                            <div className="text-[11px] text-slate-500 font-normal">{item.clientEmail || '—'}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className="inline-block font-mono font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-[11px]">
                              {item.pammAccountNumber || '—'}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-0.5">{item.pammAccountName || '—'}</div>
                          </div>
                        </td>
                        <td className="font-bold text-slate-900">{item.amount || '—'}</td>
                        <td>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {item.paymentMethod || '—'}
                          </span>
                        </td>
                        <td className="text-slate-600">{item.requestDate || '—'}</td>
                        <td className="text-slate-600">{item.processDate || '—'}</td>
                        <td>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Completed
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              {item.status || 'Pending'}
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Rejected
                            </span>
                          )}
                          {!isCompleted && !isPending && !isRejected && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                              {item.status || '—'}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="inline-flex items-center gap-1 justify-center">
                            <button
                              type="button"
                              onClick={() => setViewRequest(item)}
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            {isPending && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(item)}
                                  disabled={isUpdating}
                                  className="p-1 rounded text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Approve Withdrawal"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectRequest(item);
                                    setRejectionReason('');
                                  }}
                                  disabled={isUpdating}
                                  className="p-1 rounded text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                                  title="Reject Withdrawal"
                                >
                                  <XCircle size={14} />
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

      {/* View Details Modal */}
      {viewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                PAMM Withdrawal Details — <span className="font-mono text-orange-600">{viewRequest.requestId}</span>
              </h3>
              <button
                type="button"
                onClick={() => setViewRequest(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-500 uppercase">Investor / Client</div>
                  <div className="text-sm font-semibold text-slate-900 mt-0.5">{viewRequest.clientName || '—'}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{viewRequest.clientEmail || '—'}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] font-medium text-slate-500 uppercase">PAMM Account</div>
                  <div className="text-sm font-semibold text-orange-600 font-mono mt-0.5">
                    {viewRequest.pammAccountNumber || '—'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{viewRequest.pammAccountName || '—'}</div>
                </div>
              </div>

              <div className="p-3 bg-orange-50/40 rounded-lg border border-orange-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-medium text-orange-800 uppercase">Withdrawal Amount</div>
                  <div className="text-lg font-bold text-orange-600 mt-0.5">{viewRequest.amount}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-medium text-slate-500 uppercase">Status</div>
                  <div className="mt-0.5 font-bold text-slate-900">{viewRequest.status}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Payment Method</span>
                  <span className="font-semibold text-slate-800">{viewRequest.paymentMethod || '—'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Payment Destination / Details</span>
                  <span className="font-mono text-slate-800 break-all text-right max-w-[260px]">
                    {viewRequest.paymentDetails || '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Request Date</span>
                  <span className="text-slate-800">{viewRequest.requestDate || '—'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Process Date</span>
                  <span className="text-slate-800">{viewRequest.processDate || '—'}</span>
                </div>
                {viewRequest.rejectionReason && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 mt-2">
                    <span className="font-semibold">Rejection Reason:</span> {viewRequest.rejectionReason}
                  </div>
                )}
              </div>
            </div>
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setViewRequest(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleReject}
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                Reject Withdrawal — <span className="font-mono text-rose-600">{rejectRequest.requestId}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setRejectRequest(null);
                  setRejectionReason('');
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                Please provide a documented compliance or audit reason for rejecting withdrawal request{' '}
                <strong className="text-slate-900 font-mono">{rejectRequest.requestId}</strong> ({rejectRequest.amount}) for{' '}
                <strong>{rejectRequest.clientName}</strong>:
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Rejection Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., AML verification pending, incorrect beneficiary account number..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectRequest(null);
                  setRejectionReason('');
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !rejectionReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
