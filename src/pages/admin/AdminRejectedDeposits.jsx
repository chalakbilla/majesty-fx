import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  FileSpreadsheet,
  RefreshCw,
  Search,
  RotateCcw,
  X,
  Eye,
  ChevronLeft,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_rejected_deposits';

const DEFAULT_REJECTED_DEPOSITS = [
  {
    id: 'dep_demo_05',
    requestId: 'dep_demo_05',
    dateTime: '11/7/2026, 3:12:55 PM',
    email: 'elena.rostova@demo.example.com',
    tradeId: '800105',
    amount: 'USD 1,200.00',
    amountNum: 1200.0,
    paymentMethod: 'crypto_usdt',
    status: 'rejected',
    proof: '0xbad0000000000000000000000000000000000000',
    proofUrl: '',
    adminComment: 'Transaction hash could not be found on explorer',
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

export default function AdminRejectedDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDeposits = async () => {
    try {
      let apiLoaded = false;
      try {
        const res = await fetch('/api/admin/rejected-deposits');
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.deposits)) {
          setDeposits(
            data.deposits.map((e) => {
              const t = Number(e.amount);
              return {
                id: e.id,
                requestId: e.id,
                dateTime: e.created_at ? new Date(e.created_at).toLocaleString() : '',
                email: e.client_email || '',
                tradeId: e.account_login != null ? String(e.account_login) : '',
                amount: Number.isFinite(t)
                  ? `${e.currency || 'USD'} ${t.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  : '',
                amountNum: Number.isFinite(t) ? t : 0,
                paymentMethod: e.payment_method || '',
                status: e.status || 'rejected',
                proof: e.tx_hash || e.receipt_url || e.proof_url || 'No proof recorded',
                proofUrl: e.receipt_url || e.proof_url || '',
                adminComment: e.admin_comment || e.remarks || 'No rejection reason recorded',
              };
            })
          );
          setErrorMessage('');
          apiLoaded = true;
        }
      } catch {}

      if (!apiLoaded) {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            setDeposits(JSON.parse(saved));
          } else {
            setDeposits(DEFAULT_REJECTED_DEPOSITS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REJECTED_DEPOSITS));
          }
        } catch {
          setDeposits(DEFAULT_REJECTED_DEPOSITS);
        }
        setErrorMessage('');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to load rejected deposits.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setErrorMessage('');
    await fetchDeposits();
  };

  const filteredDeposits = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return deposits;
    return deposits.filter(
      (item) =>
        item.email.toLowerCase().includes(q) ||
        item.requestId.toLowerCase().includes(q) ||
        item.tradeId.toLowerCase().includes(q) ||
        item.paymentMethod.toLowerCase().includes(q) ||
        item.adminComment.toLowerCase().includes(q)
    );
  }, [deposits, search]);

  const totalPages = Math.max(1, Math.ceil(filteredDeposits.length / rowsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredDeposits.slice(start, start + rowsPerPage);
  }, [filteredDeposits, currentPage, rowsPerPage]);

  const handleExportCSV = () => {
    const rows = filteredDeposits.map((item) => [
      item.id,
      item.requestId,
      item.dateTime,
      item.email,
      item.tradeId,
      item.amount,
      item.paymentMethod,
      item.status,
      item.proof,
      item.adminComment,
    ]);
    exportToCSV('Rejected_Deposits_Report', [
      'ID',
      'Request ID',
      'Date & Time',
      'Email',
      'Trade ID',
      'Amount',
      'Payment Method',
      'Status',
      'Proof',
      'Rejection Reason',
    ], rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card matching reference zip strictly */}
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
            <span className="whitespace-nowrap text-slate-800 font-semibold">Rejected Deposits</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Rejected
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Deposits
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Audit declined deposit requests, compliance rejection reasons, and transaction proofs.
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
                <RefreshCw
                  size={14}
                  className={`text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p role="alert" style={{ margin: 0, color: '#b91c1c', fontSize: '0.85rem' }}>
          {errorMessage}
        </p>
      )}

      {/* 2. Search & Controls matching exact reference */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by email, trade id, request id..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {search && (
            <button
              onClick={() => setSearch('')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
          <div className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
            <span className="font-bold text-slate-700 mr-1">{filteredDeposits.length}</span> records
          </div>
        </div>
      </div>

      {/* 3. Data Table matching exact reference DOM & classes */}
      <div className="data-table">
        <div className="data-table-scroll">
          <table className="data-table-grid" data-cards="">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>REQUEST ID</th>
                <th>DATE &amp; TIME</th>
                <th>EMAIL</th>
                <th>TRADE ID</th>
                <th>AMOUNT</th>
                <th>PAYMENT METHOD</th>
                <th>STATUS</th>
                <th>PROOF</th>
                <th>REJECTION REASON</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="data-table-empty">
                    Loading rejected deposits...
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="data-table-empty">
                    {search ? 'No rejected deposits match the search.' : 'No data available'}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((item) => (
                  <tr key={item.id}>
                    <td data-label="#" style={{ color: 'rgb(100, 116, 139)' }}>
                      {item.id}
                    </td>
                    <td
                      data-label="REQUEST ID"
                      onClick={() => setSelectedAudit(item)}
                      style={{ fontWeight: 700, color: 'rgb(37, 99, 235)', cursor: 'pointer' }}
                    >
                      {item.requestId}
                    </td>
                    <td data-label="DATE & TIME" style={{ color: 'rgb(100, 116, 139)' }}>
                      {item.dateTime}
                    </td>
                    <td data-label="EMAIL" style={{ color: 'rgb(15, 23, 42)', fontWeight: 600 }}>
                      {item.email}
                    </td>
                    <td data-label="TRADE ID" style={{ fontFamily: 'monospace' }}>
                      {item.tradeId}
                    </td>
                    <td data-label="AMOUNT" style={{ fontWeight: 700, color: 'rgb(220, 38, 38)' }}>
                      {item.amount}
                    </td>
                    <td data-label="PAYMENT METHOD" style={{ color: 'rgb(51, 65, 85)' }}>
                      {item.paymentMethod}
                    </td>
                    <td data-label="STATUS">
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgb(254, 226, 226)',
                          color: 'rgb(185, 28, 28)',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td
                      data-label="PROOF"
                      onClick={() => setSelectedAudit(item)}
                      style={{
                        color: 'rgb(37, 99, 235)',
                        cursor: 'pointer',
                      }}
                      title={item.proof}
                    >
                      {item.proofUrl ? (
                        <a href={item.proofUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                          Open proof
                        </a>
                      ) : (
                        item.proof
                      )}
                    </td>
                    <td
                      data-label="REJECTION REASON"
                      style={{
                        color: 'rgb(220, 38, 38)',
                        fontStyle: 'italic',
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={item.adminComment}
                    >
                      {item.adminComment}
                    </td>
                    <td data-actions="" data-label="ACTIONS" style={{ textAlign: 'right' }}>
                      <div className="admin-action-group">
                        <button
                          onClick={() => setSelectedAudit(item)}
                          title="Audit Record"
                          aria-label="Audit Record"
                          className="admin-action-btn admin-action-btn-view"
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

        {/* Pager matching reference exact structure */}
        <div className="table-pager">
          <span className="table-pager-info">
            Showing <strong>{filteredDeposits.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to{' '}
            <strong>{Math.min(currentPage * rowsPerPage, filteredDeposits.length)}</strong> of{' '}
            <strong>{filteredDeposits.length}</strong> entries
          </span>
          <div className="table-pager-controls">
            <label className="table-pager-size">
              <span>Rows</span>
              <select
                aria-label="Rows per page"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
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
              <button
                type="button"
                className="table-pager-btn table-pager-num"
                aria-current="page"
              >
                {currentPage}
              </button>
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

      {/* 4. Audit Modal matching reference script 1blp1ebed_7dn.js */}
      {selectedAudit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedAudit(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#dc2626' }}>
                Rejected Deposit Audit ({selectedAudit.requestId})
              </h3>
              <button
                onClick={() => setSelectedAudit(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                marginTop: '1rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>CLIENT EMAIL</span>
                <strong>{selectedAudit.email}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>TRADE ACCOUNT</span>
                <strong>{selectedAudit.tradeId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>REQUESTED AMOUNT</span>
                <strong style={{ color: '#dc2626', fontSize: '1.1rem' }}>{selectedAudit.amount}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>PAYMENT METHOD</span>
                <strong>{selectedAudit.paymentMethod}</strong>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                  REASON FOR REJECTION
                </span>
                <p
                  style={{
                    margin: '0.25rem 0 0 0',
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  {selectedAudit.adminComment}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setSelectedAudit(null)}
                style={{
                  padding: '0.45rem 1.25rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer matching reference */}
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
