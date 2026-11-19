import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Loader2,
  RefreshCw,
  Search,
  Wallet,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_ib_withdrawals';

const initialMockWithdrawals = [
  {
    id: 1,
    rawId: 'ibw_1001',
    reqId: 'IBW-1001',
    ibName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    amount: '$1,250.00',
    numericAmount: 1250,
    method: 'USDT (TRC20)',
    details: 'TYD2v7wM59H8GjU1284xLqZaB93Nkd11',
    status: 'PENDING',
    requestedDate: 'Nov 18, 2026, 14:20',
    processedDate: '-',
  },
  {
    id: 2,
    rawId: 'ibw_1002',
    reqId: 'IBW-1002',
    ibName: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    amount: '$3,800.00',
    numericAmount: 3800,
    method: 'Bank Wire Transfer',
    details: 'Barclays UK • Acc: ****8921 • Sort: 20-00-15',
    status: 'COMPLETED',
    requestedDate: 'Nov 16, 2026, 11:05',
    processedDate: 'Nov 16, 2026, 15:40',
  },
  {
    id: 3,
    rawId: 'ibw_1003',
    reqId: 'IBW-1003',
    ibName: 'Sophia Al-Mansoor',
    email: 'sophia.m@majestyfx.partner.com',
    amount: '$850.00',
    numericAmount: 850,
    method: 'USDT (TRC20)',
    details: 'TPLq3v892JnmZ47x9W81KdX0183Yua77',
    status: 'COMPLETED',
    requestedDate: 'Nov 15, 2026, 09:12',
    processedDate: 'Nov 15, 2026, 10:30',
  },
  {
    id: 4,
    rawId: 'ibw_1004',
    reqId: 'IBW-1004',
    ibName: 'Elena Rostova',
    email: 'elena.rostova@demo.example.com',
    amount: '$500.00',
    numericAmount: 500,
    method: 'Bank Wire Transfer',
    details: 'Deutsche Bank • IBAN: DE89 **** **** 4812',
    status: 'REJECTED',
    requestedDate: 'Nov 14, 2026, 16:45',
    processedDate: 'Nov 15, 2026, 08:20',
  },
];

export default function AdminIBCommissionWithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockWithdrawals;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [alertNotice, setAlertNotice] = useState(null);

  // Save to localStorage whenever withdrawals change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withdrawals));
    } catch {}
  }, [withdrawals]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setAlertNotice(null);
    try {
      let desk = 'all';
      try {
        const auth = localStorage.getItem('majesty_admin_auth');
        if (auth) {
          const parsed = JSON.parse(auth);
          if (parsed.desk) desk = parsed.desk;
        }
      } catch {}

      const res = await fetch(`/api/ib/withdrawals${desk && desk !== 'all' ? `?desk=${desk}` : ''}`, {
        headers: { 'x-portal-scope': 'admin', 'x-admin-desk': desk },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.withdrawals) && res.withdrawals.length > 0) {
        const formatted = res.withdrawals.map((item, idx) => ({
          id: idx + 1,
          rawId: item.id,
          reqId: item.id && item.id.startsWith('ibw_') ? `IBW-${item.id.slice(-5)}` : item.id || `WDR-${idx + 1}`,
          ibName: item.ibName || 'IB Partner',
          email: item.ibEmail || '-',
          amount: `$${(parseFloat(item.amount) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          numericAmount: parseFloat(item.amount) || 0,
          method: item.paymentMethod
            ? item.paymentMethod.toUpperCase() === 'USDT' || item.paymentMethod.toLowerCase().includes('trc')
              ? 'USDT (TRC20)'
              : item.paymentMethod.toUpperCase() === 'BANK'
              ? 'Bank Wire Transfer'
              : item.paymentMethod
            : 'Bank Wire Transfer',
          details: item.walletAddress || item.bankDetails || item.details || item.notes || '-',
          status: (item.status || 'pending').toUpperCase(),
          requestedDate: item.createdAt
            ? new Date(item.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-',
          processedDate:
            item.status === 'completed' || item.status === 'rejected'
              ? item.updatedAt
                ? new Date(item.updatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Processed'
              : '-',
        }));
        setWithdrawals(formatted);
      }
    } catch (e) {
      console.warn('Failed to fetch live IB withdrawals:', e);
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

  // Approve action
  const handleApprove = async (item) => {
    if (!item.rawId) return;
    if (window.confirm(`Are you sure you want to approve payout request ${item.reqId} for ${item.amount}?`)) {
      setActionInProgress(item.rawId);
      setAlertNotice(null);
      try {
        await fetch('/api/ib/withdrawals', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.rawId, status: 'completed' }),
        }).catch(() => null);

        // Update local state
        const now = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.rawId === item.rawId
              ? { ...w, status: 'COMPLETED', processedDate: now }
              : w
          )
        );
        setAlertNotice({
          type: 'success',
          text: `Payout request ${item.reqId} approved and settled successfully.`,
        });
      } catch (err) {
        setAlertNotice({
          type: 'error',
          text: err.message || 'Error approving request',
        });
      } finally {
        setActionInProgress(null);
      }
    }
  };

  // Reject action
  const handleReject = async (item) => {
    if (!item.rawId) return;
    const reason = window.prompt(
      `Enter reason for rejecting request ${item.reqId}:`,
      'KYC review required or insufficient trading volume.'
    );
    if (reason !== null) {
      setActionInProgress(item.rawId);
      setAlertNotice(null);
      try {
        await fetch('/api/ib/withdrawals', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.rawId,
            status: 'rejected',
            reason: reason.trim() || 'Request declined by administrator',
          }),
        }).catch(() => null);

        const now = new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.rawId === item.rawId
              ? { ...w, status: 'REJECTED', processedDate: now }
              : w
          )
        );
        setAlertNotice({
          type: 'success',
          text: `Payout request ${item.reqId} was rejected.`,
        });
      } catch (err) {
        setAlertNotice({
          type: 'error',
          text: err.message || 'Error rejecting request',
        });
      } finally {
        setActionInProgress(null);
      }
    }
  };

  // Filtered rows
  const filtered = useMemo(() => {
    return withdrawals.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.ibName.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.reqId.toLowerCase().includes(q) ||
          item.method.toLowerCase().includes(q) ||
          item.details.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [withdrawals, statusFilter, searchQuery]);

  // Statistics
  const completedWithdrawals = useMemo(
    () => withdrawals.filter((w) => w.status === 'COMPLETED'),
    [withdrawals]
  );
  const totalWithdrawn = useMemo(() => {
    return completedWithdrawals.reduce((sum, w) => sum + (w.numericAmount || 0), 0);
  }, [completedWithdrawals]);

  const pendingApprovals = useMemo(
    () => withdrawals.filter((w) => w.status === 'PENDING').length,
    [withdrawals]
  );

  const averagePayout = useMemo(() => {
    if (completedWithdrawals.length === 0) return 0;
    return totalWithdrawn / completedWithdrawals.length;
  }, [completedWithdrawals, totalWithdrawn]);

  const completedCount = completedWithdrawals.length;

  // Export CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No withdrawal records available to export.');
      return;
    }
    const headers = [
      '#',
      'Request ID',
      'IB Name',
      'Email',
      'Amount (USD)',
      'Method',
      'Destination Details',
      'Status',
      'Requested Date',
      'Processed Date',
    ];
    const rows = filtered.map((e, idx) => [
      idx + 1,
      e.reqId,
      `"${(e.ibName || '').replace(/"/g, '""')}"`,
      e.email,
      e.amount,
      e.method,
      `"${(e.details || '').replace(/"/g, '""')}"`,
      e.status,
      e.requestedDate,
      e.processedDate,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ib_commission_withdrawals_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    IB Commission
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Withdrawal History
                  </span>
                </h1>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Live Settlement Ledger
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Live record of commission payout requests from registered IB Partners
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={filtered.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  title="Refresh page data"
                >
                  <RefreshCw size={13} className={isLoading ? 'animate-spin text-orange-600' : 'text-slate-600'} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Notice */}
      {alertNotice && (
        <div
          className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between border ${
            alertNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertNotice.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <AlertCircle size={16} className="text-rose-600" />
            )}
            <span>{alertNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertNotice(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. 4 KPI Cards Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Total Withdrawn */}
        <div className="admin-kpi-card" title="Total Withdrawn">
          <div
            className="admin-kpi-icon-squircle text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <CreditCard size={18} strokeWidth={2} />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={totalWithdrawn.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            >
              {totalWithdrawn.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <div className="admin-kpi-title">Total Withdrawn</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Net Commission Payouts</span>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="admin-kpi-card" title="Pending Approvals">
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
            <div className="admin-kpi-value" title={String(pendingApprovals)}>
              {pendingApprovals}
            </div>
            <div className="admin-kpi-title">Pending Approvals</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Queued Requests</span>
            </div>
          </div>
        </div>

        {/* Average Payout */}
        <div className="admin-kpi-card" title="Average Payout">
          <div
            className="admin-kpi-icon-squircle text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <CheckCircle2 size={18} strokeWidth={2} />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={averagePayout.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            >
              {averagePayout.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </div>
            <div className="admin-kpi-title">Average Payout</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Per Settled Request</span>
            </div>
          </div>
        </div>

        {/* Completed Payouts */}
        <div className="admin-kpi-card" title="Completed Payouts">
          <div
            className="admin-kpi-icon-squircle text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
              boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
            }}
          >
            <CheckCircle size={18} strokeWidth={2} />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(completedCount)}>
              {completedCount}
            </div>
            <div className="admin-kpi-title">Completed Payouts</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Total Transfers Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Table Box Card */}
      <div
        className="admin-table-box"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Indigo Table Title Banner */}
        <div
          style={{
            backgroundColor: '#4338ca',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>IB Commission Payout Requests</span>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.15rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {filtered.length} {filtered.length === 1 ? 'request' : 'requests'}
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.65rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by IB name, email, request ID..."
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.85rem',
                  width: '300px',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.45rem 0.75rem',
                fontSize: '0.85rem',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {(searchQuery || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ea580c',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Reset filters
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing <strong>{filtered.length}</strong> of <strong>{withdrawals.length}</strong> records
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>#</th>
                  <th>REQ ID</th>
                  <th>IB NAME</th>
                  <th>EMAIL</th>
                  <th>AMOUNT</th>
                  <th>METHOD</th>
                  <th>DESTINATION DETAILS</th>
                  <th>STATUS</th>
                  <th>REQUESTED DATE</th>
                  <th>PROCESSED DATE</th>
                  <th style={{ textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CreditCard size={24} color="#94a3b8" />
                        </div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#334155' }}>
                          No IB commission withdrawal requests found.
                        </p>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '380px' }}>
                          {searchQuery || statusFilter !== 'ALL'
                            ? 'No results match your active search and filter criteria.'
                            : 'When IB partners request a payout of their withdrawable commission, the requests will appear here for review and settlement.'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, index) => (
                    <tr
                      key={item.rawId || item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{index + 1}</td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.reqId}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#4338ca' }}>
                        {item.ibName}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#2563eb' }}>{item.email}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#ea580c' }}>
                        {item.amount}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{item.method}</td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          color: '#64748b',
                          fontFamily: 'monospace',
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.details}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor:
                              item.status === 'COMPLETED'
                                ? '#dcfce7'
                                : item.status === 'REJECTED'
                                ? '#fee2e2'
                                : '#fef3c7',
                            color:
                              item.status === 'COMPLETED'
                                ? '#166534'
                                : item.status === 'REJECTED'
                                ? '#991b1b'
                                : '#92400e',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.requestedDate}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.processedDate}</td>
                      <td
                        style={{
                          padding: '0.75rem 1rem',
                          position: 'sticky',
                          right: 0,
                          zIndex: 10,
                          backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                          textAlign: 'center',
                        }}
                      >
                        {item.status === 'PENDING' ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleApprove(item)}
                              disabled={actionInProgress === item.rawId}
                              style={{
                                backgroundColor: '#16a34a',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '0.25rem',
                                padding: '0.35rem 0.55rem',
                                cursor: actionInProgress === item.rawId ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: actionInProgress === item.rawId ? 0.6 : 1,
                              }}
                              title="Approve and Settle Payout"
                              aria-label="Approve Payout"
                            >
                              {actionInProgress === item.rawId ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={13} strokeWidth={2.5} />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(item)}
                              disabled={actionInProgress === item.rawId}
                              style={{
                                backgroundColor: '#dc2626',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '0.25rem',
                                padding: '0.35rem 0.55rem',
                                cursor: actionInProgress === item.rawId ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: actionInProgress === item.rawId ? 0.6 : 1,
                              }}
                              title="Reject Payout Request"
                              aria-label="Reject Payout"
                            >
                              <X size={13} strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                            {item.status === 'COMPLETED' ? 'Settled' : 'Declined'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            margin: '1rem 1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>Majesty IB Portal v2.0 • Secure Settlement Desk</span>
          <span>All transactions logged to Master Ledger</span>
        </footer>
      </div>
    </div>
  );
}
