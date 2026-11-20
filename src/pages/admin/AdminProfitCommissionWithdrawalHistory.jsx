import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  Download,
  RefreshCw,
  Search,
  RotateCcw,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_profit_commission_withdrawals';

// seed data lives in src/data/json (DEFAULT_WITHDRAWALS)

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

export default function AdminProfitCommissionWithdrawalHistory() {
  const { items: withdrawals } = useCollection('profitCommissionWithdrawals');
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

    const fetchWithdrawals = () => {
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchWithdrawals();
  };

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((item) => {
      const matchesTab = activeTab === 'All' || item.status === activeTab;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.requestId.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.accountLogin.toLowerCase().includes(q) ||
        item.paymentMethod.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [withdrawals, activeTab, search]);

  const handleExportCSV = () => {
    const rows = filteredWithdrawals.map((item) => [
      item.requestId,
      item.dateTime,
      item.email,
      item.accountLogin,
      item.commissionAmount.toFixed(2),
      item.status,
      item.adminComment,
      item.paymentMethod,
    ]);
    exportToCSV('profit_commission_withdrawals', [
      'Request ID',
      'Date & Time',
      'Email',
      'Account Login',
      'Commission Amount',
      'Status',
      'Admin Comment',
      'Payment Method',
    ], rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Card matching reference */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Profit Commission
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Withdrawal History
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                View, audit, approve and export profit commission withdrawal requests
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                >
                  <Download size={14} className="text-slate-500" />
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

      {errorMessage && (
        <p role="alert" className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
          {errorMessage}
        </p>
      )}

      {/* 2. Tabs & Filter Bar matching reference */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/60 self-start">
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email, login, request ID..."
                className="w-full pl-8 pr-8 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {(search || activeTab !== 'Pending') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setActiveTab('Pending');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            <div className="hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/80 rounded-lg">
              {filteredWithdrawals.length} records
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Table matching reference */}
      <div className="data-table">
        <div className="data-table-scroll">
          <table className="data-table-grid" data-cards="">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>REQUEST ID</th>
                <th>DATE &amp; TIME</th>
                <th>EMAIL</th>
                <th>ACCOUNT LOGIN</th>
                <th>COMMISSION AMOUNT</th>
                <th>STATUS</th>
                <th>ADMIN COMMENT</th>
                <th>PAYMENT METHOD</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="data-table-empty py-10 text-center text-slate-500 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-orange-600" />
                    <span>Loading commission withdrawals...</span>
                  </td>
                </tr>
              ) : filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={10} className="data-table-empty py-10 text-center text-slate-400 text-xs">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td style={{ color: '#64748b' }}>{index + 1}</td>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{item.requestId}</td>
                    <td style={{ color: '#64748b' }} className="whitespace-nowrap text-xs">{item.dateTime}</td>
                    <td style={{ color: '#0f172a' }}>{item.email}</td>
                    <td style={{ fontFamily: 'monospace' }}>#{item.accountLogin}</td>
                    <td style={{ fontWeight: 700, color: '#16a34a' }}>
                      ${item.commissionAmount.toFixed(2)}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor:
                            item.status === 'Approved'
                              ? '#dcfce7'
                              : item.status === 'Pending'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            item.status === 'Approved'
                              ? '#15803d'
                              : item.status === 'Pending'
                              ? '#d97706'
                              : '#b91c1c',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.adminComment || '—'}
                    </td>
                    <td style={{ color: '#475569' }}>{item.paymentMethod || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-action-group">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(item)}
                          title="View Details"
                          aria-label="View Details"
                          className="admin-action-btn admin-action-btn-view p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
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
      </div>

      {/* Details Modal matching reference */}
      {selectedRecord && (
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
          onClick={() => setSelectedRecord(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '520px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
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
                <AlertCircle size={20} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  Commission Withdrawal Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Request ID</span>
                <strong style={{ color: '#0f172a' }}>{selectedRecord.requestId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Status</span>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.15rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor:
                      selectedRecord.status === 'Approved'
                        ? '#dcfce7'
                        : selectedRecord.status === 'Pending'
                        ? '#fef3c7'
                        : '#fee2e2',
                    color:
                      selectedRecord.status === 'Approved'
                        ? '#15803d'
                        : selectedRecord.status === 'Pending'
                        ? '#d97706'
                        : '#b91c1c',
                  }}
                >
                  {selectedRecord.status}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Client Email</span>
                <strong style={{ color: '#0f172a' }}>{selectedRecord.email}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Commission Amount</span>
                <strong style={{ color: '#16a34a', fontSize: '1rem' }}>
                  ${selectedRecord.commissionAmount.toFixed(2)}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Account Login</span>
                <span style={{ fontFamily: 'monospace' }}>#{selectedRecord.accountLogin}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Payment Method</span>
                <span>{selectedRecord.paymentMethod}</span>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', display: 'block' }}>Audit / Admin Comment</span>
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    marginTop: '0.25rem',
                    color: '#475569',
                  }}
                >
                  {selectedRecord.adminComment || 'No comments'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
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
    </div>
  );
}
