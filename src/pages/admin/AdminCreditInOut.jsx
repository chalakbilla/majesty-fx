import React, { useState, useEffect, useMemo, useRef } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Plus,
  FileSpreadsheet,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  Search,
  RotateCcw,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_credit_adjustments';

// seed data lives in src/data/json (DEFAULT_CREDIT_RECORDS)

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

export default function AdminCreditInOut() {
  const { items: adjustments, create } = useCollection('creditAdjustments');
  const { items: tradingAccounts } = useCollection('tradingAccounts');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [tradeId, setTradeId] = useState('');
  const [amount, setAmount] = useState('');
  const [actionType, setActionType] = useState('Credit In');
  const [comment, setComment] = useState('');
  const idempotencyRef = useRef(null);

    // READ: the list comes straight from the JSON-backed store; "refresh" just re-syncs the view.
  const fetchAdjustments = () => {
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchAdjustments();
  };

  const filteredAdjustments = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return adjustments;
    return adjustments.filter(
      (item) =>
        item.accountName.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.tradeId.toLowerCase().includes(q) ||
        item.comment.toLowerCase().includes(q)
    );
  }, [adjustments, search]);

  const totalAdded = useMemo(
    () =>
      filteredAdjustments
        .filter((item) => item.type === 'Credit In')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [filteredAdjustments]
  );

  const totalRemoved = useMemo(
    () =>
      filteredAdjustments
        .filter((item) => item.type === 'Credit Out')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [filteredAdjustments]
  );

  const netAmount = totalAdded - totalRemoved;

    // CREATE: credit-in / credit-out adjustment (prepended to the list)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!tradeId.trim() || isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid account login and amount.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const login = tradeId.trim();
    const account = tradingAccounts.find((a) => String(a.accountNo) === login);
    create({
      id: `CR-${Date.now().toString().slice(-6)}`,
      accountName: account?.clientName || `Trader #${login}`,
      email: account?.email || `client${login}@majestyfx.com`,
      tradeId: login,
      amount: numAmount,
      type: actionType,
      comment: comment.trim() || 'Manual credit adjustment',
      date: new Date().toLocaleString(),
    });

    setIsModalOpen(false);
    setTradeId('');
    setAmount('');
    setComment('');
    setSubmitting(false);
  };

  const handleExportCSV = () => {
    const rows = filteredAdjustments.map((item) => [
      item.id,
      item.accountName,
      item.email,
      item.tradeId,
      Number(item.amount).toFixed(2),
      item.type,
      item.comment,
      item.date,
    ]);
    exportToCSV('Credit_Bonus_Management', [
      '#',
      'Account Name',
      'Email',
      'Trade ID',
      'Amount ($)',
      'Type',
      'Comment',
      'Date',
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
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Credit In/Out</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Credit
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Management
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Allocate promotional trading bonuses, adjust margins, and manage credit ins and outs.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Add / Deduct Credit</span>
                </button>
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

      {errorMessage && (
        <p role="alert" style={{ margin: 0, color: '#b91c1c', fontSize: '0.85rem' }}>
          {errorMessage}
        </p>
      )}

      {/* 2. 4 KPI Cards matching reference */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Card 1: Total Records */}
        <div className="admin-kpi-card" title="Total Records">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(148, 163, 184), rgb(71, 85, 105))',
              boxShadow: 'rgba(71, 85, 105, 0.22) 0px 3px 8px',
            }}
          >
            <Layers size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(filteredAdjustments.length)}>
              {filteredAdjustments.length}
            </div>
            <div className="admin-kpi-title">Total Records</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Filtered Adjustments</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Added */}
        <div className="admin-kpi-card" title="Total Added">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <ArrowUpRight size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`$${totalAdded.toLocaleString()}`}>
              ${totalAdded.toLocaleString()}
            </div>
            <div className="admin-kpi-title">Total Added</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Credit In Injections</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Removed */}
        <div className="admin-kpi-card" title="Total Removed">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(251, 113, 133), rgb(225, 29, 72))',
              boxShadow: 'rgba(225, 29, 72, 0.22) 0px 3px 8px',
            }}
          >
            <ArrowDownLeft size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`$${totalRemoved.toLocaleString()}`}>
              ${totalRemoved.toLocaleString()}
            </div>
            <div className="admin-kpi-title">Total Removed</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Credit Out Deductions</span>
            </div>
          </div>
        </div>

        {/* Card 4: Net Amount */}
        <div className="admin-kpi-card" title="Net Amount">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <Scale size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`$${netAmount.toLocaleString()}`}>
              ${netAmount.toLocaleString()}
            </div>
            <div className="admin-kpi-title">Net Amount</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Active Margin Impact</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search & Controls bar matching reference */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            placeholder="Search by account, email, trade ID, comment..."
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
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
          <div className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
            <span className="font-bold text-slate-700 mr-1">{filteredAdjustments.length}</span> adjustments
          </div>
        </div>
      </div>

      {/* 4. Data Table matching reference */}
      <div className="data-table">
        <div className="data-table-scroll">
          <table className="data-table-grid" data-cards="">
            <thead>
              <tr>
                <th>ID</th>
                <th>ACCOUNT NAME</th>
                <th>EMAIL</th>
                <th>TRADE ID</th>
                <th>AMOUNT</th>
                <th>TYPE</th>
                <th>COMMENT</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="data-table-empty py-10 text-center text-slate-500 text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-orange-600" />
                    <span>Loading credit adjustments...</span>
                  </td>
                </tr>
              ) : filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="data-table-empty py-10 text-center text-slate-400 text-xs">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50/80 transition-colors">
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{item.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{item.accountName}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#0f172a' }}>{item.email}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 600 }}>#{item.tradeId}</td>
                    <td
                      style={{
                        padding: '0.75rem 1rem',
                        fontWeight: 700,
                        color: item.type === 'Credit In' ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {item.type === 'Credit In' ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: item.type === 'Credit In' ? '#dcfce7' : '#fee2e2',
                          color: item.type === 'Credit In' ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b', maxWidth: '250px' }} className="truncate" title={item.comment}>
                      {item.comment}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }} className="whitespace-nowrap text-xs">
                      {item.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal: Manage Account Credit / Bonus */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                Manage Account Credit / Bonus
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  ACTION TYPE
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.825rem' }}
                >
                  <option value="Credit In">Credit In (Add Bonus)</option>
                  <option value="Credit Out">Credit Out (Remove Bonus)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                    TRADE ID / ACCOUNT # *
                  </label>
                  <input
                    type="text"
                    value={tradeId}
                    onChange={(e) => setTradeId(e.target.value)}
                    placeholder="MT5 account login"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.825rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                    AMOUNT ($) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    placeholder="Amount"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.825rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  ADMIN COMMENT / REASON
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Reason for this balance adjustment"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '0.25rem', fontSize: '0.825rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.45rem 1rem', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '0.25rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.45rem 1.25rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  {submitting ? 'Processing...' : 'Apply Credit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Footer matching reference */}
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
