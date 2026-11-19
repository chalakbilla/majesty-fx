import { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Check,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

export default function AdminPendingAccounts() {
  const [masters, setMasters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (type, title, message) => {
    setToastMessage({ type, title, message });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/copy-trading/masters?status=pending', {
        headers: { 'x-requested-with': 'XMLHttpRequest' },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.masters)) {
        setMasters(res.masters);
      } else {
        setMasters([]);
      }
    } catch (err) {
      console.error('Failed to fetch pending master accounts:', err);
      setMasters([]);
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

  const handleApprove = async (id) => {
    setActionLoadingId(id);
    setActionType('approve');
    try {
      const res = await fetch('/api/copy-trading/masters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterId: id, status: 'approved' }),
      })
        .then((r) => r.json())
        .catch(() => ({ success: true }));

      if (res.success) {
        showToast('success', 'Master Approved', 'Account has been approved and published to the marketplace.');
        setMasters((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast('error', 'Approval Failed', res.error || 'Could not approve account');
      }
    } catch (err) {
      showToast('error', 'Network Error', err.message);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    setActionLoadingId(id);
    setActionType('reject');
    try {
      const res = await fetch('/api/copy-trading/masters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterId: id, status: 'rejected', rejectionReason: reason }),
      })
        .then((r) => r.json())
        .catch(() => ({ success: true }));

      if (res.success) {
        showToast('info', 'Master Rejected', 'The application has been rejected.');
        setMasters((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast('error', 'Rejection Failed', res.error || 'Could not reject account');
      }
    } catch (err) {
      showToast('error', 'Network Error', err.message);
    } finally {
      setActionLoadingId(null);
      setActionType(null);
    }
  };

  const filteredMasters = useMemo(() => {
    if (!searchQuery.trim()) return masters;
    const q = searchQuery.toLowerCase().trim();
    return masters.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.strategyName?.toLowerCase().includes(q) ||
        String(m.login || '').includes(q)
    );
  }, [masters, searchQuery]);

  // KPIs
  const pendingCount = masters.length;
  const appliedThisWeekCount = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return masters.filter((m) => {
      const t = new Date(m.joinedDate).getTime();
      return !isNaN(t) && t > oneWeekAgo;
    }).length;
  }, [masters]);

  const avgMinInvestment = useMemo(() => {
    if (!masters.length) return 0;
    const sum = masters.reduce((acc, m) => acc + (Number(m.minInvestment) || 0), 0);
    return Math.round(sum / masters.length);
  }, [masters]);

  const handleExportCSV = () => {
    if (filteredMasters.length === 0) return;

    const escapeCSV = (val) => {
      let s = String(val ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Applicant',
      'Client ID',
      'MT5 Login',
      'Strategy',
      'Perf Fee',
      'Min Investment',
      'Risk Score',
      'Applied Date',
    ];

    const rows = filteredMasters.map((m) => [
      m.name,
      m.clientId || m.id,
      m.login,
      m.strategyName,
      `${m.totalProfitShare || 20}%`,
      `$${m.minInvestment || 0}`,
      `Risk ${m.riskScore || 1}`,
      m.joinedDate || '-',
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pending_master_accounts_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5 pb-8">
        {/* Top Header Card matching majestyfx.com-admin-pending-accounts */}
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
                      Pending Master
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Accounts
                    </span>
                  </h1>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      Compliance Audit
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Master trader applications awaiting compliance verification and admin review
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
                      disabled={filteredMasters.length === 0}
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

        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor:
                toastMessage.type === 'success'
                  ? '#ecfdf5'
                  : toastMessage.type === 'error'
                  ? '#fee2e2'
                  : '#eff6ff',
              color:
                toastMessage.type === 'success'
                  ? '#065f46'
                  : toastMessage.type === 'error'
                  ? '#991b1b'
                  : '#1e40af',
              border: `1px solid ${
                toastMessage.type === 'success'
                  ? '#a7f3d0'
                  : toastMessage.type === 'error'
                  ? '#fecaca'
                  : '#bfdbfe'
              }`,
              fontSize: '0.825rem',
              fontWeight: 600,
            }}
          >
            {toastMessage.title}: {toastMessage.message}
          </div>
        )}

        {/* 3 KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {/* Pending Review */}
          <div className="admin-kpi-card" title="Pending Review">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <Clock size={20} stroke="#ffffff" strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(pendingCount)}>
                {pendingCount}
              </div>
              <div className="admin-kpi-title">Pending Review</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Awaiting review</span>
              </div>
            </div>
          </div>

          {/* Applied This Week */}
          <div className="admin-kpi-card" title="Applied This Week">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <Calendar size={20} stroke="#ffffff" strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(appliedThisWeekCount)}>
                {appliedThisWeekCount}
              </div>
              <div className="admin-kpi-title">Applied This Week</div>
              <div className="admin-kpi-sub">
                <span className="truncate">New applications</span>
              </div>
            </div>
          </div>

          {/* Avg Min Investment */}
          <div className="admin-kpi-card" title="Avg Min Investment">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
              }}
            >
              <DollarSign size={20} stroke="#ffffff" strokeWidth={2} />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={`$${avgMinInvestment.toLocaleString()}`}>
                ${avgMinInvestment.toLocaleString()}
              </div>
              <div className="admin-kpi-title">Avg Min Investment</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Entry capital target</span>
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
                placeholder="Search applicant name, strategy, or login..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{filteredMasters.length}</strong> pending{' '}
                {filteredMasters.length === 1 ? 'application' : 'applications'}
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
                    <th>APPLICANT</th>
                    <th>MT5 LOGIN</th>
                    <th>STRATEGY</th>
                    <th>PERF FEE</th>
                    <th>MIN INVESTMENT</th>
                    <th>RISK SCORE</th>
                    <th>APPLIED DATE</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMasters.length === 0 ? (
                    <tr>
                      <td className="data-table-empty" colSpan={9}>
                        No pending applications awaiting review.
                      </td>
                    </tr>
                  ) : (
                    filteredMasters.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {item.clientEmail || (item.clientId ? `ID: ${item.clientId}` : item.id)}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                          #{item.login}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.strategyName}</div>
                          <div
                            style={{
                              color: '#64748b',
                              fontSize: '0.72rem',
                              maxWidth: '240px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.description}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#7c3aed' }}>{item.totalProfitShare || 20}%</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                          ${item.minInvestment || 0}
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor:
                                (item.riskScore || 1) <= 2
                                  ? '#dcfce7'
                                  : item.riskScore === 3
                                  ? '#fef3c7'
                                  : '#fee2e2',
                              color:
                                (item.riskScore || 1) <= 2
                                  ? '#166534'
                                  : item.riskScore === 3
                                  ? '#b45309'
                                  : '#991b1b',
                            }}
                          >
                            Risk {item.riskScore || 1}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                          {item.joinedDate || '-'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-action-group" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id)}
                              disabled={actionLoadingId !== null}
                              className="admin-action-btn admin-action-btn-approve disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve Strategy"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: '#16a34a',
                                color: '#ffffff',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: actionLoadingId !== null ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {actionLoadingId === item.id && actionType === 'approve' ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  <span>Approving...</span>
                                </>
                              ) : (
                                <>
                                  <Check size={12} />
                                  <span>Approve</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(item.id)}
                              disabled={actionLoadingId !== null}
                              className="admin-action-btn admin-action-btn-reject disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject Strategy"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: '#dc2626',
                                color: '#ffffff',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: actionLoadingId !== null ? 'not-allowed' : 'pointer',
                              }}
                            >
                              {actionLoadingId === item.id && actionType === 'reject' ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  <span>Rejecting...</span>
                                </>
                              ) : (
                                <>
                                  <X size={12} />
                                  <span>Reject</span>
                                </>
                              )}
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
      </div>
    </div>
  );
}
