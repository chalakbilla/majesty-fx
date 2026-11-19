import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  RefreshCw,
  Search,
  RotateCcw,
  X,
  Eye,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_account_ledger';

const INITIAL_TRANSACTIONS = [
  {
    id: 'TX-1000',
    dateTime: '11/17/2026, 3:51:34 PM',
    client: 'Demo Trader',
    tradingAccount: '800106',
    notes: 'Deposit via crypto_usdt to #800106',
    deposit: 10000,
    withdraw: 0,
    paymentMethod: 'crypto_usdt',
    status: 'Completed',
    transactionProof: '0x92763370a24f8d91c',
  },
  {
    id: 'TX-1001',
    dateTime: '11/17/2026, 2:12:56 PM',
    client: 'Alexander Wright',
    tradingAccount: '800101',
    notes: 'Withdrawal via crypto_usdt from #800101',
    deposit: 0,
    withdraw: 1500,
    paymentMethod: 'crypto_usdt',
    status: 'Pending',
    transactionProof: '0xa8c2fec1b972e412d',
  },
  {
    id: 'TX-1002',
    dateTime: '11/17/2026, 1:12:55 PM',
    client: 'Sofia Al-Mansoor',
    tradingAccount: '800103',
    notes: 'Deposit via bank_wire to #800103',
    deposit: 3500,
    withdraw: 0,
    paymentMethod: 'bank_wire',
    status: 'Pending',
    transactionProof: '0x626a44b1c834a903e',
  },
  {
    id: 'TX-1003',
    dateTime: '11/17/2026, 11:12:56 AM',
    client: 'David Miller',
    tradingAccount: '800105',
    notes: 'Withdrawal via bank_wire from #800105',
    deposit: 0,
    withdraw: 1000,
    paymentMethod: 'bank_wire',
    status: 'Pending',
    transactionProof: '0x2a04fdc1e792c314f',
  },
  {
    id: 'TX-1004',
    dateTime: '11/17/2026, 10:12:55 AM',
    client: 'David Miller',
    tradingAccount: '800105',
    notes: 'Deposit via credit_card to #800105',
    deposit: 2500,
    withdraw: 0,
    paymentMethod: 'credit_card',
    status: 'Pending',
    transactionProof: '0xd16d6732f418b725a',
  },
  {
    id: 'TX-1005',
    dateTime: '11/10/2026, 3:12:56 PM',
    client: 'Elena Rostova',
    tradingAccount: '800105',
    notes: 'Withdrawal via crypto_usdt from #800105',
    deposit: 0,
    withdraw: 750,
    paymentMethod: 'crypto_usdt',
    status: 'Completed',
    transactionProof: '0x0e10cfea8371d936b',
  },
  {
    id: 'TX-1006',
    dateTime: '11/7/2026, 3:12:55 PM',
    client: 'Elena Rostova',
    tradingAccount: '800105',
    notes: 'Deposit via crypto_usdt to #800105',
    deposit: 1200,
    withdraw: 0,
    paymentMethod: 'crypto_usdt',
    status: 'Rejected',
    transactionProof: '0x524b551a3784e147c',
  },
  {
    id: 'TX-1007',
    dateTime: '11/5/2026, 3:12:56 PM',
    client: 'Marcus Chen',
    tradingAccount: '800104',
    notes: 'Withdrawal via bank_wire from #800104',
    deposit: 0,
    withdraw: 3000,
    paymentMethod: 'bank_wire',
    status: 'Completed',
    transactionProof: '0x209316f9a562b858d',
  },
  {
    id: 'TX-1008',
    dateTime: '10/20/2026, 3:12:55 PM',
    client: 'Alexander Wright',
    tradingAccount: '800101',
    notes: 'Deposit via crypto_usdt to #800101',
    deposit: 5000,
    withdraw: 0,
    paymentMethod: 'crypto_usdt',
    status: 'Completed',
    transactionProof: '0x85d389ee7629c469e',
  },
  {
    id: 'TX-1009',
    dateTime: '10/8/2026, 3:12:55 PM',
    client: 'Marcus Chen',
    tradingAccount: '800104',
    notes: 'Deposit via crypto_btc to #800104',
    deposit: 10000,
    withdraw: 0,
    paymentMethod: 'crypto_btc',
    status: 'Completed',
    transactionProof: '0x8ea0c857b295e870f',
  },
];

export default function AdminAccountLedger() {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TRANSACTIONS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeProof, setActiveProof] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      let desk = 'all';
      try {
        const auth = localStorage.getItem('majesty_admin_auth');
        if (auth) {
          const parsed = JSON.parse(auth);
          if (parsed.desk) desk = parsed.desk;
        }
      } catch {}

      const res = await fetch(`/api/transactions?clientId=all&desk=${encodeURIComponent(desk)}`, {
        headers: {
          'x-portal-scope': 'admin',
          'x-admin-desk': desk,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
          const mapped = data.transactions.map((tx) => {
            const t = (tx.type || '').toLowerCase();
            const amount = Number(tx.amount) || 0;
            return {
              id: tx.id || `TX-${Math.random().toString(16).slice(2, 6)}`,
              dateTime: tx.createdAt ? new Date(tx.createdAt).toLocaleString() : new Date().toLocaleString(),
              client: tx.clientName || tx.clientEmail || 'Client',
              tradingAccount: tx.accountLogin || '800101',
              notes: tx.description || t,
              deposit: t.includes('deposit') || t === 'credit' ? amount : 0,
              withdraw: t.includes('withdraw') || t === 'debit' ? amount : 0,
              paymentMethod: tx.method || 'crypto_usdt',
              status: (tx.status || 'Completed').replace(/^./, (c) => c.toUpperCase()),
              transactionProof: tx.referenceId || tx.id || '0x' + Math.random().toString(16).slice(2, 10),
            };
          });
          setTransactions(mapped);
        }
      }
    } catch {
      // Keep existing transactions on error
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Filtered transactions
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (tx) =>
        tx.client.toLowerCase().includes(q) ||
        tx.tradingAccount.toLowerCase().includes(q) ||
        tx.notes.toLowerCase().includes(q) ||
        tx.paymentMethod.toLowerCase().includes(q) ||
        tx.transactionProof.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q)
    );
  }, [transactions, searchTerm]);

  // Dynamic summary stats
  const totalInflow = useMemo(() => filtered.reduce((acc, tx) => acc + (tx.deposit || 0), 0), [filtered]);
  const totalOutflow = useMemo(() => filtered.reduce((acc, tx) => acc + (tx.withdraw || 0), 0), [filtered]);
  const depositCount = useMemo(() => filtered.filter((tx) => (tx.deposit || 0) > 0).length, [filtered]);
  const withdrawCount = useMemo(() => filtered.filter((tx) => (tx.withdraw || 0) > 0).length, [filtered]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      '#',
      'Date & Time',
      'Client',
      'Trading Account',
      'Notes',
      'Deposit ($)',
      'Withdraw ($)',
      'Payment Method',
      'Status',
      'Transaction Proof',
    ];

    const rows = filtered.map((tx, idx) => [
      idx + 1,
      tx.dateTime,
      tx.client,
      tx.tradingAccount,
      tx.notes,
      tx.deposit > 0 ? tx.deposit : 0,
      tx.withdraw > 0 ? tx.withdraw : 0,
      tx.paymentMethod,
      tx.status,
      tx.transactionProof,
    ]);

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Account_Ledger_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const lower = (status || '').toLowerCase();
    if (lower === 'completed' || lower === 'approved') {
      return (
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: 'rgb(220, 252, 231)',
            color: 'rgb(21, 128, 61)',
          }}
        >
          {status}
        </span>
      );
    }
    if (lower === 'pending') {
      return (
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: 'rgb(254, 243, 199)',
            color: 'rgb(180, 83, 9)',
          }}
        >
          {status}
        </span>
      );
    }
    return (
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
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Account Ledger</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Account
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Ledger
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Comprehensive audit ledger recording all real-time deposits, withdrawals, credits, and balance adjustments.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
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
                  className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stat Summary Row */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                Total Inflow
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5" style={{ color: 'rgb(22, 163, 74)' }}>
                ${totalInflow.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                Total Outflow
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5" style={{ color: 'rgb(234, 88, 12)' }}>
                ${totalOutflow.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                Deposit Count
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                {depositCount}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                Withdrawal Count
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                {withdrawCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by client, account #, notes..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <div className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
            <span className="font-bold text-slate-700 mr-1">{filtered.length}</span> records
          </div>
        </div>
      </div>

      {/* 3. Table Box */}
      <div
        className="admin-table-box"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: '0.5rem',
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
          overflow: 'hidden',
        }}
      >
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>DATE &amp; TIME</th>
                  <th>CLIENT</th>
                  <th>TRADING ACCOUNT #</th>
                  <th>NOTES</th>
                  <th>DEPOSIT</th>
                  <th>WITHDRAW</th>
                  <th>PAYMENT METHOD</th>
                  <th>STATUS</th>
                  <th>TRANSACTION PROOF</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgb(241, 245, 249)' }}>
                    <td data-label="DATE & TIME" style={{ padding: '0.75rem 1rem', color: 'rgb(100, 116, 139)' }}>
                      {tx.dateTime}
                    </td>
                    <td data-label="CLIENT" style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>
                      {tx.client}
                    </td>
                    <td data-label="TRADING ACCOUNT #" style={{ padding: '0.75rem 1rem', color: 'rgb(37, 99, 235)', fontWeight: 600 }}>
                      {tx.tradingAccount}
                    </td>
                    <td data-label="NOTES" style={{ padding: '0.75rem 1rem', color: 'rgb(71, 85, 105)' }}>
                      {tx.notes}
                    </td>
                    <td
                      data-label="DEPOSIT"
                      style={{
                        padding: '0.75rem 1rem',
                        fontWeight: 700,
                        color: tx.deposit > 0 ? 'rgb(22, 163, 74)' : 'rgb(100, 116, 139)',
                      }}
                    >
                      {tx.deposit > 0 ? `+$${tx.deposit.toLocaleString()}` : '$0.00'}
                    </td>
                    <td
                      data-label="WITHDRAW"
                      style={{
                        padding: '0.75rem 1rem',
                        fontWeight: 700,
                        color: tx.withdraw > 0 ? 'rgb(234, 88, 12)' : 'rgb(100, 116, 139)',
                      }}
                    >
                      {tx.withdraw > 0 ? `-$${tx.withdraw.toLocaleString()}` : '$0.00'}
                    </td>
                    <td data-label="PAYMENT METHOD" style={{ padding: '0.75rem 1rem', color: 'rgb(51, 65, 85)' }}>
                      {tx.paymentMethod}
                    </td>
                    <td data-label="STATUS" style={{ padding: '0.75rem 1rem' }}>
                      {getStatusBadge(tx.status)}
                    </td>
                    <td data-label="TRANSACTION PROOF" style={{ padding: '0.75rem 1rem' }}>
                      <button
                        type="button"
                        onClick={() => setActiveProof(tx)}
                        className="admin-action-btn admin-action-btn-view"
                        title="View Transaction Proof"
                        aria-label="View Transaction Proof"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-slate-400 font-medium text-xs">
                      No ledger records match the search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pager Controls */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Rows per page"
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
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`table-pager-btn table-pager-num ${currentPage === pageNum ? 'active' : ''}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Transaction Proof Modal */}
      {activeProof && (
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
          onClick={() => setActiveProof(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              maxWidth: '480px',
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
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                Transaction Receipt &amp; Proof
              </h3>
              <button
                type="button"
                onClick={() => setActiveProof(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>CLIENT</span>
                <strong>{activeProof.client}</strong> ({activeProof.tradingAccount})
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>NOTE</span>
                <span>{activeProof.notes}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>AMOUNT</span>
                <span
                  style={{
                    fontWeight: 800,
                    color: activeProof.deposit > 0 ? '#16a34a' : '#ea580c',
                  }}
                >
                  {activeProof.deposit > 0 ? `+$${activeProof.deposit.toLocaleString()}` : `-$${activeProof.withdraw.toLocaleString()}`}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                  TRANSACTION HASH / PROOF REF
                </span>
                <code
                  style={{
                    backgroundColor: '#f1f5f9',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '0.25rem',
                    display: 'block',
                    fontSize: '0.8rem',
                    marginTop: '0.25rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {activeProof.transactionProof}
                </code>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveProof(null)}
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

      {/* 5. Version Footer */}
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
