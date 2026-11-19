import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  FileSpreadsheet,
  RefreshCw,
  Search,
  X,
  RotateCcw,
  Eye,
  Check,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_internal_transfers';

const DEFAULT_TRANSFERS = [
  {
    id: 'IT-10024',
    ticket: 'TRF-90812',
    dateKey: '2026-11-18',
    createdAt: '2026-11-18T14:25:00.000Z',
    clientName: 'Alexander Wright',
    clientEmail: 'alex.wright@demo.example.com',
    amount: 1500.0,
    fromLogin: '800101',
    fromInfo: 'ECN (1:500)',
    toLogin: '800102',
    toInfo: 'Standard (1:200)',
    remark: 'Rebalancing trading capital',
    leverageChange: '1:500 → 1:200',
    isCrossCategory: false,
    status: 'Completed',
  },
  {
    id: 'IT-10023',
    ticket: 'TRF-90805',
    dateKey: '2026-11-17',
    createdAt: '2026-11-17T09:12:00.000Z',
    clientName: 'Sofia Al-Mansoor',
    clientEmail: 'sofia.mansoor@demo.example.com',
    amount: 500.0,
    fromLogin: '800103',
    fromInfo: 'Raw Spread (1:500)',
    toLogin: '800106',
    toInfo: 'Demo Sandbox (1:500)',
    remark: 'Demo strategy test transfer',
    leverageChange: '',
    isCrossCategory: false,
    status: 'Pending',
  },
  {
    id: 'IT-10020',
    ticket: 'TRF-90791',
    dateKey: '2026-11-15',
    createdAt: '2026-11-15T16:40:00.000Z',
    clientName: 'David Miller',
    clientEmail: 'david.miller@demo.example.com',
    amount: 2000.0,
    fromLogin: '800105',
    fromInfo: 'Standard (1:400)',
    toLogin: '800104',
    toInfo: 'Pro (1:100)',
    remark: 'Cross-account margin adjustment',
    leverageChange: '1:400 → 1:100',
    isCrossCategory: true,
    status: 'Needs Review',
  },
];

function exportToCSV(filename, headers, rows) {
  const sanitize = (val) => {
    let s = String(val ?? '');
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csvContent = [
    headers.map(sanitize).join(','),
    ...rows.map((row) => row.map(sanitize).join(',')),
  ].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminInternalTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [actionDialog, setActionDialog] = useState(null); // { item, action: 'approve' | 'reject' }
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Load transfers
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTransfers(JSON.parse(saved));
      } else {
        setTransfers(DEFAULT_TRANSFERS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TRANSFERS));
      }
    } catch {
      setTransfers(DEFAULT_TRANSFERS);
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setTransfers(JSON.parse(saved));
        else setTransfers(DEFAULT_TRANSFERS);
      } catch {
        setTransfers(DEFAULT_TRANSFERS);
      }
      setIsRefreshing(false);
    }, 400);
  };

  const handleConfirmAction = async () => {
    if (!actionDialog) return;
    if (actionDialog.action === 'reject' && !rejectReason.trim()) {
      setActionError('Please give the client a reason.');
      return;
    }

    setActionLoading(true);
    setActionError('');

    try {
      const newStatus = actionDialog.action === 'approve' ? 'Completed' : 'Rejected';
      const updated = transfers.map((t) =>
        t.id === actionDialog.item.id
          ? {
              ...t,
              status: newStatus,
              remark:
                actionDialog.action === 'reject'
                  ? `${t.remark || ''} [Rejected: ${rejectReason.trim()}]`.trim()
                  : t.remark,
            }
          : t
      );
      setTransfers(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      setActionDialog(null);
      setRejectReason('');
    } catch (err) {
      setActionError(err.message || 'The request could not be completed.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTransfers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return transfers.filter((item) => {
      const matchesSearch =
        !q ||
        `${item.clientName} ${item.clientEmail} ${item.fromLogin} ${item.toLogin} ${item.ticket} ${item.remark}`
          .toLowerCase()
          .includes(q);

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesStart = !startDate || item.dateKey >= startDate;
      const matchesEnd = !endDate || item.dateKey <= endDate;

      return matchesSearch && matchesStatus && matchesStart && matchesEnd;
    });
  }, [transfers, search, statusFilter, startDate, endDate]);

  const handleExportCSV = () => {
    const rows = filteredTransfers.map((item) => [
      item.ticket,
      item.createdAt ? new Date(item.createdAt).toLocaleString() : '',
      item.clientName,
      item.clientEmail,
      `#${item.fromLogin} ${item.fromInfo || ''}`.trim(),
      `#${item.toLogin} ${item.toInfo || ''}`.trim(),
      Number(item.amount).toFixed(2),
      item.status,
      item.remark || '',
    ]);
    exportToCSV('Internal_Transfers_Report', [
      'Reference',
      'Date',
      'Client',
      'Email',
      'From',
      'To',
      'Amount',
      'Status',
      'Remark',
    ], rows);
  };

  const hasActiveFilters = search || statusFilter !== 'All' || startDate || endDate;

  return (
    <div className="space-y-6">
      {/* 1. Header Card matching reference */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Internal Transfers</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Internal
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Transfers
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Monitor, audit, and reconcile client transfers between MT5 accounts and wallets.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-secondary absolute top-3 right-3 sm:static !p-2 sm:!px-[0.85rem] sm:!py-2 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
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
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter & Controls Card matching reference */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              placeholder="Search by client, trading account, ticket..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Failed">Failed</option>
              <option value="Needs Review">Needs Review</option>
            </select>
            <div className="flex items-center gap-1.5">
              <input
                className="py-1.5 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 outline-none cursor-pointer"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-slate-400 text-xs">to</span>
              <input
                className="py-1.5 px-2.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 outline-none cursor-pointer"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                  setStartDate('');
                  setEndDate('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
                title="Reset filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}
            <div className="hidden xl:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
              <span className="font-bold text-slate-700 mr-1">{filteredTransfers.length}</span> transfers
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table matching reference */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">From → To</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remark</th>
                <th style={{ textAlign: 'right' }} className="py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No internal transfers yet.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.clientName}</div>
                      <div className="text-[11px] text-slate-500">{item.clientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800">
                          #{item.fromLogin}
                        </span>
                        <ArrowRight size={13} className="text-slate-400" />
                        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800">
                          #{item.toLogin}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {item.fromInfo || '—'} → {item.toInfo || '—'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                      ${Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Completed</span>
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>Pending</span>
                        </span>
                      )}
                      {item.status === 'Needs Review' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-purple-50 text-purple-700 border-purple-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                          <span>Needs Review</span>
                        </span>
                      )}
                      {(item.status === 'Rejected' || item.status === 'Failed') && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>{item.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate text-xs" title={item.remark}>
                      {item.remark || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDetail(item)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View transfer details"
                        >
                          <Eye size={16} />
                        </button>
                        {(item.status === 'Pending' || item.status === 'Needs Review') && (
                          <>
                            <button
                              type="button"
                              onClick={() => setActionDialog({ item, action: 'approve' })}
                              className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Approve transfer"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionDialog({ item, action: 'reject' })}
                              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Reject transfer"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Transfer Details</h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {selectedDetail.ticket}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.4rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }} className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl font-bold text-slate-900">
                  ${Number(selectedDetail.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div>
                  {selectedDetail.status === 'Completed' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Completed</span>
                    </span>
                  )}
                  {selectedDetail.status === 'Pending' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span>Pending</span>
                    </span>
                  )}
                  {selectedDetail.status === 'Needs Review' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-purple-50 text-purple-700 border-purple-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      <span>Needs Review</span>
                    </span>
                  )}
                  {(selectedDetail.status === 'Rejected' || selectedDetail.status === 'Failed') && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>{selectedDetail.status}</span>
                    </span>
                  )}
                </div>
              </div>

              {selectedDetail.leverageChange && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                  <span>Moves funds between accounts with different leverage ({selectedDetail.leverageChange}).</span>
                </div>
              )}

              <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-slate-500 text-xs">Client</dt>
                  <dd className="min-w-0 text-right text-slate-900 text-xs font-semibold">
                    <div>{selectedDetail.clientName}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{selectedDetail.clientEmail}</div>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-slate-500 text-xs">Requested</dt>
                  <dd className="min-w-0 text-right text-slate-900 text-xs">
                    {selectedDetail.createdAt ? new Date(selectedDetail.createdAt).toLocaleString() : '—'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-slate-500 text-xs">From</dt>
                  <dd className="min-w-0 text-right text-slate-900 text-xs">
                    <span className="font-mono font-bold">#{selectedDetail.fromLogin}</span>{' '}
                    <span className="text-slate-500">({selectedDetail.fromInfo})</span>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-slate-500 text-xs">To</dt>
                  <dd className="min-w-0 text-right text-slate-900 text-xs">
                    <span className="font-mono font-bold">#{selectedDetail.toLogin}</span>{' '}
                    <span className="text-slate-500">({selectedDetail.toInfo})</span>
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-slate-500 text-xs">Remark</dt>
                  <dd className="min-w-0 text-right text-slate-900 text-xs">
                    {selectedDetail.remark || '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Approve / Reject Dialog */}
      {actionDialog && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => !actionLoading && setActionDialog(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">
              {actionDialog.action === 'approve' ? 'Approve transfer?' : 'Reject transfer?'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {actionDialog.item.clientName || actionDialog.item.clientEmail}:{' '}
              <strong>${Number(actionDialog.item.amount).toFixed(2)}</strong> from #{actionDialog.item.fromLogin} to #
              {actionDialog.item.toLogin}.
            </p>
            {actionDialog.item.leverageChange && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                Leverage changes {actionDialog.item.leverageChange}.
              </p>
            )}
            {actionDialog.action === 'approve' ? (
              <p className="mt-3 text-xs text-slate-500">
                The balance is checked again on MT5, then the funds are moved and the client is emailed.
              </p>
            ) : (
              <label className="mt-3 block text-sm">
                <span className="font-medium text-slate-700">Reason (sent to the client)</span>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Enter rejection reason..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </label>
            )}

            {actionError && (
              <p role="alert" className="mt-2 text-xs font-semibold text-rose-600">
                {actionError}
              </p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActionDialog(null)}
                disabled={actionLoading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={actionLoading}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white cursor-pointer disabled:opacity-60 ${
                  actionDialog.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionLoading
                  ? 'Working…'
                  : actionDialog.action === 'approve'
                  ? 'Approve and move funds'
                  : 'Reject request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer matching reference */}
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
