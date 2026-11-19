import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  RefreshCw,
  Search,
  Eye,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_withdrawal_history_records_v3';

const INITIAL_WITHDRAWALS = [
  {
    id: 1,
    hashId: 'wth_demo_01',
    requestId: 'WTH_DEMO_01',
    date: '11/17/2026',
    time: '2:12:56 PM',
    dateTime: '11/17/2026, 2:12:56 PM',
    clientName: 'Alexander Wright',
    email: 'alex.wright@demo.example.com',
    tradeId: '#800101',
    account: '800101',
    amount: '$1,200.00',
    amountNum: 1200.0,
    fee: '$15.00',
    method: 'Bank Wire Transfer',
    status: 'Pending',
    destination: 'Chase Bank NA •••• 4819 (SWIFT: CHASUS33)',
    notes: 'Client withdrawal request submitted via Web Trader client portal.',
  },
  {
    id: 2,
    hashId: 'wth_demo_04',
    requestId: 'WTH_DEMO_04',
    date: '11/17/2026',
    time: '11:12:56 AM',
    dateTime: '11/17/2026, 11:12:56 AM',
    clientName: 'David Miller',
    email: 'david.miller@demo.example.com',
    tradeId: '#800105',
    account: '800105',
    amount: '$800.00',
    amountNum: 800.0,
    fee: '$8.00',
    method: 'Crypto BTC',
    status: 'Pending',
    destination: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    notes: 'Automated Bitcoin payout verification queue.',
  },
  {
    id: 3,
    hashId: 'wth_demo_02',
    requestId: 'WTH_DEMO_02',
    date: '11/16/2026',
    time: '4:30:15 PM',
    dateTime: '11/16/2026, 4:30:15 PM',
    clientName: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    tradeId: '#800104',
    account: '800104',
    amount: '$2,500.00',
    amountNum: 2500.0,
    fee: '$10.00',
    method: 'Crypto USDT (TRC20)',
    status: 'Approved',
    destination: 'TXyz9812401847192847102947192837102',
    notes: 'Approved and broadcasted on TRON blockchain.',
  },
  {
    id: 4,
    hashId: 'wth_demo_03',
    requestId: 'WTH_DEMO_03',
    date: '11/15/2026',
    time: '9:15:20 AM',
    dateTime: '11/15/2026, 9:15:20 AM',
    clientName: 'Demo Trader',
    email: 'democlient@majestyfx.com',
    tradeId: '#800106',
    account: '800106',
    amount: '$3,000.00',
    amountNum: 3000.0,
    fee: '$25.00',
    method: 'Bank Wire Transfer',
    status: 'Approved',
    destination: 'Barclays Bank UK •••• 9921',
    notes: 'Settled via international SWIFT batch #8841.',
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
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminWithdrawHistory() {
  const [withdrawals, setWithdrawals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_WITHDRAWALS;
  });

  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [confirmRejectModal, setConfirmRejectModal] = useState(null);

  // Tab counts
  const counts = useMemo(() => {
    const res = { All: withdrawals.length, Pending: 0, Approved: 0, Rejected: 0 };
    withdrawals.forEach((w) => {
      if (w.status === 'Pending') res.Pending++;
      else if (w.status === 'Approved') res.Approved++;
      else if (w.status === 'Rejected') res.Rejected++;
    });
    return res;
  }, [withdrawals]);

  // Filtered dataset
  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((item) => {
      // Tab filter
      if (activeTab !== 'All' && item.status.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.email.toLowerCase().includes(q) ||
          item.clientName.toLowerCase().includes(q) ||
          item.requestId.toLowerCase().includes(q) ||
          item.hashId.toLowerCase().includes(q) ||
          item.tradeId.toLowerCase().includes(q) ||
          item.account.toLowerCase().includes(q) ||
          item.method.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [withdrawals, activeTab, searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleReset = () => {
    setSearchQuery('');
    setActiveTab('All');
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    const rows = filteredWithdrawals.map((item) => [
      item.hashId,
      item.requestId,
      item.dateTime,
      item.email,
      item.tradeId,
      item.amount,
      item.fee,
      item.method,
      item.status,
    ]);
    exportToCSV(`Withdrawal_History_${new Date().toISOString().slice(0, 10)}`, [
      '#',
      'REQUEST ID',
      'DATE & TIME',
      'EMAIL',
      'ACCOUNT',
      'AMOUNT',
      'FEE',
      'METHOD',
      'STATUS',
    ], rows);
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updated = withdrawals.map((w) => (w.id === id ? { ...w, status: newStatus } : w));
    setWithdrawals(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    if (selectedWithdrawal && selectedWithdrawal.id === id) {
      setSelectedWithdrawal({ ...selectedWithdrawal, status: newStatus });
    }
    setConfirmRejectModal(null);
  };

  // Pagination slice
  const paginatedWithdrawals = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredWithdrawals.slice(start, start + rowsPerPage);
  }, [filteredWithdrawals, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredWithdrawals.length / rowsPerPage));

  return (
    <div className="space-y-6">
      {/* 1. Header Card matching reference */}
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
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Withdrawal History</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">Withdrawal</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight">History</span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                View, audit, approve, and export client withdrawal requests with real-time settlement tracking.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleExportExcel}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export to Excel</span>
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

      {/* 2. REFERRAL Financial Records Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-xs bg-orange-600 text-white shadow-orange-500/20">
              REF
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                REFERRAL Financial Records
              </h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">Visible Withdrawals:</span>
            <span className="font-extrabold text-slate-900">{filteredWithdrawals.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar with Tabs & Search */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="inline-flex bg-slate-100/90 p-1 rounded-lg gap-1 overflow-x-auto">
          {[
            {
              key: 'All',
              label: 'All',
              count: counts.All,
              badgeClass: activeTab === 'All' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600',
              activeClass: 'bg-white text-slate-900 shadow-xs',
            },
            {
              key: 'Pending',
              label: 'Pending',
              count: counts.Pending,
              badgeClass: activeTab === 'Pending' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600',
              activeClass: 'bg-amber-100/90 text-amber-900 font-bold shadow-xs',
            },
            {
              key: 'Approved',
              label: 'Approved',
              count: counts.Approved,
              badgeClass: activeTab === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600',
              activeClass: 'bg-emerald-100/90 text-emerald-900 font-bold shadow-xs',
            },
            {
              key: 'Rejected',
              label: 'Rejected',
              count: counts.Rejected,
              badgeClass: activeTab === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600',
              activeClass: 'bg-rose-100/90 text-rose-900 font-bold shadow-xs',
            },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  isActive ? tab.activeClass : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab.badgeClass}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by email, trade id, request id."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg outline-none focus:border-orange-500 transition-colors text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98] shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4. Table matching media_1795122425037_53e2b26e.png */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">REQUEST ID</th>
                <th className="py-3 px-4">DATE &amp; TIME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">TRADING ACCOUNT</th>
                <th className="py-3 px-4">AMOUNT</th>
                <th className="py-3 px-4">METHOD</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No withdrawal records found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedWithdrawals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {item.hashId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedWithdrawal(item)}
                        className="hover:underline text-blue-600 cursor-pointer font-bold font-mono"
                        title="View Audit Details"
                      >
                        {item.requestId}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs whitespace-nowrap">
                      {item.dateTime}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {item.tradeId}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {item.amount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.method}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>Pending</span>
                        </span>
                      )}
                      {item.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Approved</span>
                        </span>
                      )}
                      {item.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedWithdrawal(item)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
                          title="View Details"
                          aria-label="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setConfirmRejectModal(item)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                              title="Reject Withdrawal"
                              aria-label="Reject Withdrawal"
                            >
                              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(item.id, 'Approved')}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors cursor-pointer"
                              title="Approve Withdrawal"
                              aria-label="Approve Withdrawal"
                            >
                              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
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

        {/* 5. Footer & Pager matching media_1795122425037_53e2b26e.png */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredWithdrawals.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * rowsPerPage, filteredWithdrawals.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredWithdrawals.length}</span> entries
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5">
              <span>Rows</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-orange-500 cursor-pointer font-semibold text-xs"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold"
              >
                &lt; Prev
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded-md text-white font-bold text-xs"
                style={{ backgroundColor: '#8b5cf6' }}
              >
                {currentPage}
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs font-semibold"
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  WTH
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                    Withdrawal Audit Detail
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedWithdrawal.requestId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWithdrawal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium">Client</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{selectedWithdrawal.clientName}</span>
                  <span className="text-[11px] text-slate-500 truncate block">{selectedWithdrawal.email}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium">Trading Account</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">{selectedWithdrawal.tradeId}</span>
                  <span className="text-[11px] text-slate-500 block">MT5 Live</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Requested Amount</span>
                  <span className="font-black text-slate-900 text-base">{selectedWithdrawal.amount}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Processing Fee</span>
                  <span className="font-mono text-slate-700">{selectedWithdrawal.fee}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Method</span>
                  <span className="font-medium text-slate-800">{selectedWithdrawal.method}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Status</span>
                  <span>
                    {selectedWithdrawal.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                    {selectedWithdrawal.status === 'Approved' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Approved
                      </span>
                    )}
                    {selectedWithdrawal.status === 'Rejected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Rejected
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Date &amp; Time</span>
                  <span className="text-slate-600 text-xs font-mono">{selectedWithdrawal.dateTime}</span>
                </div>
              </div>

              {selectedWithdrawal.destination && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium mb-1">
                    Destination Bank / Wallet Address
                  </span>
                  <span className="font-mono text-[11px] text-slate-800 break-all select-all block bg-white p-2 rounded-lg border border-slate-200">
                    {selectedWithdrawal.destination}
                  </span>
                </div>
              )}

              {selectedWithdrawal.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium mb-1">Settlement Notes</span>
                  <span className="text-xs text-slate-600 block">{selectedWithdrawal.notes}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
              {selectedWithdrawal.status === 'Pending' ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedWithdrawal.id, 'Rejected')}
                    className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Reject Withdrawal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(selectedWithdrawal.id, 'Approved')}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Approve Withdrawal
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedWithdrawal(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Reject Modal */}
      {confirmRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <X size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Reject Withdrawal Request</h4>
                <p className="text-xs text-slate-500 font-mono">{confirmRejectModal.requestId}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to mark withdrawal request{' '}
              <strong className="text-slate-800">{confirmRejectModal.requestId}</strong> of{' '}
              <strong className="text-slate-800">{confirmRejectModal.amount}</strong> for{' '}
              <strong className="text-slate-800">{confirmRejectModal.email}</strong> as Rejected?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmRejectModal(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusUpdate(confirmRejectModal.id, 'Rejected')}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs cursor-pointer"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
