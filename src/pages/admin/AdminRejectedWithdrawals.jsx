import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Download,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_rejected_withdrawals';

// seed data lives in src/data/json (DEFAULT_REJECTED_WITHDRAWALS)

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

export default function AdminRejectedWithdrawals() {
  const { items: withdrawals } = useCollection('rejectedWithdrawals');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);

    const fetchWithdrawals = () => {
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchWithdrawals();
  };

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((item) => {
      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        item.txId.toLowerCase().includes(q) ||
        item.account.toLowerCase().includes(q) ||
        item.clientName.toLowerCase().includes(q) ||
        item.clientEmail.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q) ||
        (item.rejectionReason && item.rejectionReason.toLowerCase().includes(q))
      );
    });
  }, [withdrawals, search, statusFilter]);

  const handleExportCSV = () => {
    const rows = filteredWithdrawals.map((item) => [
      item.txId,
      item.account,
      item.clientName,
      item.clientEmail,
      item.method,
      item.amount,
      item.fee,
      item.status,
      item.date,
      item.rejectionReason,
    ]);
    exportToCSV('Rejected_Withdrawals_Report', [
      'TX ID',
      'Account',
      'Client Name',
      'Client Email',
      'Method',
      'Amount',
      'Fee',
      'Status',
      'Date',
      'Rejection Reason',
    ], rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card matching reference zip strictly */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-500">Transactions &amp; Money</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Rejected Withdrawals</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">Rejected</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight">Withdrawals</span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">Real-Time Audit</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Cryptographic transaction audit trail, compliance verification status, and client ledger settlements.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                title="Refresh page data"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Filter Bar matching reference */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by TX ID, Account, Client, Method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:bg-white transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
          Showing <span className="text-slate-900 font-bold">{filteredWithdrawals.length}</span> records
        </div>
      </div>

      {/* 3. Data Table matching exact reference */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">TX ID</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Loading rejected withdrawals...
                  </td>
                </tr>
              ) : filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No rejected withdrawals match the criteria.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedAudit(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">
                      {item.txId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {item.account}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.clientName}</div>
                      <div className="text-[11px] text-slate-500">{item.clientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{item.method}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{item.amount}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">{item.fee}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Audit Modal */}
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
              maxWidth: '520px',
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
                Rejected Withdrawal Details ({selectedAudit.txId})
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
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>CLIENT</span>
                <strong>{selectedAudit.clientName}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{selectedAudit.clientEmail}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>TRADING ACCOUNT</span>
                <strong style={{ fontFamily: 'monospace' }}>{selectedAudit.account}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>WITHDRAWAL AMOUNT</span>
                <strong style={{ color: '#dc2626', fontSize: '1.1rem' }}>{selectedAudit.amount}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>METHOD &amp; FEE</span>
                <strong>{selectedAudit.method}</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Network Fee: {selectedAudit.fee}</div>
              </div>
              {selectedAudit.walletAddress && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>PAYOUT DESTINATION</span>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.5rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.25rem',
                      wordBreak: 'break-all',
                    }}
                  >
                    {selectedAudit.walletAddress}
                  </div>
                </div>
              )}
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>REJECTION REASON</span>
                <p
                  style={{
                    margin: '0.25rem 0 0 0',
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    padding: '0.6rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.825rem',
                    border: '1px solid #fecaca',
                  }}
                >
                  {selectedAudit.rejectionReason}
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
    </div>
  );
}
