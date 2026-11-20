import React, { useState, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  ShieldCheck,
  PlusCircle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Eye,
  Check,
  X,
  Copy,
  Coins,
  Landmark,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  User,
  Mail,
  CheckCircle2,
} from 'lucide-react';

// seed data lives in src/data/json (INITIAL_DEPOSITS)

const AVAILABLE_ACCOUNTS = [
  { login: '800106', clientName: 'Demo Trader', clientEmail: 'democlient@majestyfx.com', desk: 'referral', accountType: 'Standard Account', balance: 10000 },
  { login: '800103', clientName: 'Sofia Al-Mansoor', clientEmail: 'sofia.mansoor@demo.example.com', desk: 'referral', accountType: 'Raw Spread Account', balance: 3500 },
  { login: '800105', clientName: 'David Miller', clientEmail: 'david.miller@demo.example.com', desk: 'referral', accountType: 'Standard Account', balance: 2500 },
  { login: '800101', clientName: 'Alexander Wright', clientEmail: 'alex.wright@demo.example.com', desk: 'referral', accountType: 'VIP Account', balance: 5000 },
  { login: '800104', clientName: 'Marcus Chen', clientEmail: 'marcus.chen@demo.example.com', desk: 'referral', accountType: 'Standard Account', balance: 10000 },
];

export default function AdminDepositHistory() {
  const { items: deposits, setItems: setDeposits } = useCollection('deposits');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adminCommentInput, setAdminCommentInput] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Manual Deposit Modal state
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [manualAmount, setManualAmount] = useState('');
  const [manualMethod, setManualMethod] = useState('crypto usdt');
  const [manualTxHash, setManualTxHash] = useState('');
  const [manualRemarks, setManualRemarks] = useState('');
  const [manualSendEmail, setManualSendEmail] = useState(true);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState(null);
  const [manualSuccess, setManualSuccess] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const handleAudit = () => {
    setIsAuditing(true);
    setAuditResult(null);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        success: true,
        message: 'MT5 Audit Passed: All client deposits and MT5 balances match 100% with no unauthorized balance adjustments found.',
      });
    }, 700);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleOpenDetails = (deposit) => {
    setSelectedDeposit(deposit);
    setAdjustAmount(deposit.amount.replace(/[^0-9.]/g, ''));
    setAdminCommentInput(deposit.adminComment || '');
  };

  const handleStatusUpdate = (id, newStatus, customAmount, remarks) => {
    setActionLoadingId(id);
    setActionType(newStatus);
    setTimeout(() => {
      setDeposits((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            const finalAmount =
              customAmount && !isNaN(customAmount) && Number(customAmount) > 0
                ? `+$${Number(customAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : d.amount;
            return {
              ...d,
              status: newStatus,
              amount: finalAmount,
              adminComment: remarks || d.adminComment,
            };
          }
          return d;
        })
      );
      setActionLoadingId(null);
      setActionType(null);
      setSelectedDeposit(null);
    }, 500);
  };

  const handleManualDepositSubmit = (e) => {
    e.preventDefault();
    setManualError(null);

    const amt = parseFloat(manualAmount);
    if (!selectedAccount) {
      setManualError('Please select a trading account.');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setManualError('Please enter a valid deposit amount greater than $0.');
      return;
    }

    setManualSubmitting(true);
    setTimeout(() => {
      setManualSubmitting(false);
      const newDeposit = {
        id: Date.now(),
        requestId: `DEP_DEMO_${Math.floor(10 + Math.random() * 90)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        clientName: selectedAccount.clientName,
        email: selectedAccount.clientEmail,
        tradeId: `#${selectedAccount.login}`,
        amount: `+$${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        amountValue: amt,
        paymentMethod: manualMethod,
        status: 'Approved',
        proof: manualTxHash || 'MANUAL-ADMIN-CREDIT',
        adminComment: manualRemarks || 'Manual Administrator Deposit Credit',
      };

      setDeposits((prev) => [newDeposit, ...prev]);
      setManualSuccess({
        message: `Successfully credited $${amt.toFixed(2)} to account #${selectedAccount.login}!`,
        newBalance: selectedAccount.balance + amt,
      });
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'REQUEST ID', 'DATE', 'TIME', 'CLIENT', 'EMAIL', 'ACCOUNT', 'AMOUNT', 'METHOD', 'STATUS', 'PROOF', 'ADMIN COMMENT'];
    const rows = filteredDeposits.map((d, i) => [
      i + 1,
      d.requestId,
      d.date,
      d.time,
      d.clientName,
      d.email,
      d.tradeId,
      d.amount,
      d.paymentMethod,
      d.status,
      d.proof,
      d.adminComment,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Deposit_History_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered deposits
  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      const matchesTab = activeTab === 'All' || d.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.email.toLowerCase().includes(q) ||
        d.clientName.toLowerCase().includes(q) ||
        d.requestId.toLowerCase().includes(q) ||
        d.tradeId.toLowerCase().includes(q) ||
        d.paymentMethod.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [deposits, activeTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      All: deposits.length,
      Pending: deposits.filter((d) => d.status === 'Pending').length,
      Approved: deposits.filter((d) => d.status === 'Approved').length,
      Rejected: deposits.filter((d) => d.status === 'Rejected').length,
    };
  }, [deposits]);

  const renderMethodBadge = (method) => {
    if (method.includes('crypto')) {
      return (
        <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 bg-teal-50 text-teal-700 border-teal-200">
          <Coins className="w-3 h-3 text-teal-600" />
          {method}
        </span>
      );
    }
    if (method.includes('wire')) {
      return (
        <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 bg-blue-50 text-blue-700 border-blue-200">
          <Landmark className="w-3 h-3 text-blue-600" />
          {method}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 bg-violet-50 text-violet-700 border-violet-200">
        <CreditCard className="w-3 h-3 text-violet-600" />
        {method}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    if (status === 'Approved') {
      return (
        <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 bg-emerald-50 text-emerald-700 border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Approved
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 bg-amber-50 text-amber-700 border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 bg-rose-50 text-rose-700 border-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
        Rejected
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Card matching reference */}
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
            <a className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap" href="/admin">
              Admin Console
            </a>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Deposit History</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Deposit
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    History
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                View, audit, approve, and export client deposit requests with real-time settlement tracking.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAudit}
                    disabled={isAuditing}
                    title="Audit MT5 Server deals against CRM approved deposits to detect any unauthorized balance injections"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <ShieldCheck className={`w-3.5 h-3.5 text-amber-700 ${isAuditing ? 'animate-spin' : ''}`} />
                    <span>{isAuditing ? 'Auditing MT5...' : 'Audit MT5 Balances'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setManualSuccess(null);
                      setManualError(null);
                      setManualModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Manual Deposit</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export to Excel</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label="Refresh"
                title="Refresh page data"
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

      {/* MT5 Audit Alert Banner if Audit MT5 Balances is clicked */}
      {auditResult && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{auditResult.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAuditResult(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Desk Financial Records Subheader */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-xs bg-orange-600 text-white shadow-orange-500/20">
              REF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  REFERRAL Financial Records
                </h3>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">Visible Deposits:</span>
            <span className="font-extrabold text-slate-900">{filteredDeposits.length}</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search Input */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="inline-flex bg-slate-100/90 p-1 rounded-lg gap-1 overflow-x-auto">
          {[
            { key: 'All', label: 'All', count: counts.All, color: 'bg-emerald-600', activeStyle: 'bg-emerald-100 text-emerald-800 shadow-xs' },
            { key: 'Pending', label: 'Pending', count: counts.Pending, color: 'bg-amber-500', activeStyle: 'bg-amber-100 text-amber-800 shadow-xs' },
            { key: 'Approved', label: 'Approved', count: counts.Approved, color: 'bg-emerald-600', activeStyle: 'bg-emerald-100 text-emerald-800 shadow-xs' },
            { key: 'Rejected', label: 'Rejected', count: counts.Rejected, color: 'bg-rose-600', activeStyle: 'bg-rose-100 text-rose-800 shadow-xs' },
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
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? tab.activeStyle
                    : 'text-slate-600 hover:bg-white/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? `${tab.color} text-white` : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-72 md:w-80">
            <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by email, trade id, request id..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
          <div className="hidden xl:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
            <span className="font-bold text-slate-700 mr-1">{filteredDeposits.length}</span> records
          </div>
        </div>
      </div>

      {/* 4. Data Table matching reference */}
      <div className="data-table">
        <div className="data-table-scroll">
          <table className="data-table-grid" data-cards="">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>REQUEST ID</th>
                <th>DATE</th>
                <th>CLIENT</th>
                <th>ACCOUNT</th>
                <th>AMOUNT</th>
                <th>METHOD</th>
                <th>STATUS</th>
                <th>PROOF</th>
                <th>ADMIN COMMENT</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-slate-400 text-xs">
                    No deposits found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredDeposits.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((d, index) => (
                  <tr key={d.id}>
                    <td className="text-slate-400 text-xs" data-label="#">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td data-label="REQUEST ID">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] text-slate-700" title={d.requestId}>
                        {d.requestId}
                        <button
                          type="button"
                          onClick={() => handleCopy(d.id, d.requestId)}
                          aria-label="Copy"
                          title="Copy Request ID"
                          className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                        >
                          {copiedId === d.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                    </td>
                    <td data-label="DATE">
                      <div className="whitespace-nowrap leading-tight">
                        <div className="text-slate-800">{d.date}</div>
                        <div className="text-[11px] text-slate-500">{d.time}</div>
                      </div>
                    </td>
                    <td data-label="CLIENT">
                      <div className="min-w-0 leading-tight">
                        <div className="truncate font-semibold text-slate-900">{d.clientName}</div>
                        <div className="truncate text-[11px] text-slate-500">{d.email}</div>
                      </div>
                    </td>
                    <td data-label="ACCOUNT">
                      <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                        {d.tradeId}
                      </span>
                    </td>
                    <td data-label="AMOUNT">
                      <span className="whitespace-nowrap font-bold tabular-nums text-emerald-600">
                        {d.amount}
                      </span>
                    </td>
                    <td data-label="METHOD">{renderMethodBadge(d.paymentMethod)}</td>
                    <td data-label="STATUS">{renderStatusBadge(d.status)}</td>
                    <td data-label="PROOF">
                      {d.proof ? (
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(d)}
                          className="text-xs font-semibold text-desk hover:underline whitespace-nowrap cursor-pointer text-orange-600"
                        >
                          View proof
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="max-w-[200px] truncate text-xs text-slate-500" data-label="ADMIN COMMENT" title={d.adminComment}>
                      {d.adminComment || '—'}
                    </td>
                    <td data-actions="" data-label="ACTIONS" style={{ textAlign: 'right' }}>
                      <div className="admin-action-group">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(d)}
                          title="View Details"
                          aria-label="View Details"
                          className="admin-action-btn admin-action-btn-view"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {d.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(d.id, 'Approved')}
                              disabled={actionLoadingId === d.id}
                              title={actionLoadingId === d.id && actionType === 'Approved' ? 'Approving...' : 'Approve Deposit'}
                              aria-label="Approve Deposit"
                              className="admin-action-btn admin-action-btn-approve disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoadingId === d.id && actionType === 'Approved' ? (
                                <RefreshCw className="w-3 h-3 animate-spin text-green-700" />
                              ) : (
                                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusUpdate(d.id, 'Rejected')}
                              disabled={actionLoadingId === d.id}
                              title={actionLoadingId === d.id && actionType === 'Rejected' ? 'Rejecting...' : 'Reject Deposit'}
                              aria-label="Reject Deposit"
                              className="admin-action-btn admin-action-btn-reject disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoadingId === d.id && actionType === 'Rejected' ? (
                                <RefreshCw className="w-3 h-3 animate-spin text-red-700" />
                              ) : (
                                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                              )}
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

        {/* 5. Table Pager matching reference */}
        <div className="table-pager">
          <span className="table-pager-info">
            Showing <strong>{filteredDeposits.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}</strong> to{' '}
            <strong>{Math.min(currentPage * rowsPerPage, filteredDeposits.length)}</strong> of{' '}
            <strong>{filteredDeposits.length}</strong> deposits
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
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            <nav aria-label="Pages" className="table-pager-pages">
              <button
                type="button"
                aria-label="Previous page"
                className="table-pager-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button type="button" aria-current="page" className="table-pager-btn table-pager-num">
                {currentPage}
              </button>
              <button
                type="button"
                aria-label="Next page"
                className="table-pager-btn"
                disabled={currentPage >= Math.ceil(filteredDeposits.length / rowsPerPage) || filteredDeposits.length === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

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

      {/* ================= MODAL: Deposit Verification & Details ================= */}
      {selectedDeposit && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setSelectedDeposit(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                  Deposit Verification ({selectedDeposit.requestId})
                </h3>
                {renderStatusBadge(selectedDeposit.status)}
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeposit(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-4 h-4" />
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
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>CLIENT NAME & EMAIL</span>
                <strong style={{ color: '#0f172a' }}>{selectedDeposit.clientName}</strong>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{selectedDeposit.email}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>TRADE ID / ACCOUNT</span>
                <strong style={{ color: '#2563eb' }}>{selectedDeposit.tradeId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>REQUESTED AMOUNT</span>
                <strong style={{ color: '#0f172a', fontSize: '1.15rem' }}>{selectedDeposit.amount}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>PAYMENT METHOD</span>
                <div style={{ marginTop: '0.2rem' }}>{renderMethodBadge(selectedDeposit.paymentMethod)}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>TX HASH / PROOF REFERENCE</span>
                <code
                  style={{
                    backgroundColor: '#f1f5f9',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.8rem',
                    display: 'block',
                    color: '#0f172a',
                    wordBreak: 'break-all',
                    marginTop: '0.25rem',
                  }}
                >
                  {selectedDeposit.proof}
                </code>
              </div>
            </div>

            {selectedDeposit.status === 'Pending' && (
              <div
                style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label htmlFor="adjustAmountInput" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    VERIFIED AMOUNT TO APPROVE & CREDIT ($)
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600 }}>Adjust if receipt differs from requested</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#15803d' }}>
                      $
                    </span>
                    <input
                      id="adjustAmountInput"
                      type="number"
                      step="any"
                      min="0.01"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      placeholder="Enter verified amount"
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem 0.45rem 1.75rem',
                        borderRadius: '0.375rem',
                        border: '1.5px solid #86efac',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#14532d',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                      }}
                    />
                  </div>
                  {adjustAmount && parseFloat(adjustAmount) !== parseFloat(selectedDeposit.amount.replace(/[^0-9.]/g, '')) && (
                    <button
                      type="button"
                      onClick={() => setAdjustAmount(selectedDeposit.amount.replace(/[^0-9.]/g, ''))}
                      style={{
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#475569',
                        backgroundColor: '#e2e8f0',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
                {adjustAmount && parseFloat(adjustAmount) !== parseFloat(selectedDeposit.amount.replace(/[^0-9.]/g, '')) && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.73rem', color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Original Request: <strong>{selectedDeposit.amount}</strong> → Approved & Credited to MT5: <strong>${parseFloat(adjustAmount).toFixed(2)}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>
                ADMIN COMMENT / REMARKS
              </label>
              <textarea
                value={adminCommentInput}
                onChange={(e) => setAdminCommentInput(e.target.value)}
                placeholder="Optional internal remarks..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  outline: 'none',
                }}
              />
            </div>

            {selectedDeposit.status === 'Pending' ? (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(selectedDeposit.id, 'Rejected', null, adminCommentInput || 'Rejected by Administrator')}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Reject Deposit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusUpdate(
                      selectedDeposit.id,
                      'Approved',
                      adjustAmount,
                      adminCommentInput || `Verified & Credited by Admin`
                    )
                  }
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Check className="w-4 h-4" />
                  <span>Approve & Credit to MT5</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedDeposit(null)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: Manual Deposit & Account Credit ================= */}
      {manualModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '24px 16px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '580px',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 48px)',
              margin: '0 auto',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.15rem 1.5rem',
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '0.625rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DollarSign size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.25 }}>
                    Manual Deposit & Account Credit
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0 0', lineHeight: 1.2 }}>
                    Credit verified funds directly to live MT5 account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManualModalOpen(false)}
                style={{
                  padding: '0.4rem',
                  color: '#94a3b8',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
              {manualSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Deposit Credited Successfully!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">{manualSuccess.message}</p>
                  <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700">
                    Updated Live Balance:{' '}
                    <span className="text-emerald-600 font-extrabold text-sm">${manualSuccess.newBalance.toFixed(2)} USD</span>
                  </div>
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAccount(null);
                        setManualAmount('');
                        setManualTxHash('');
                        setManualRemarks('');
                        setManualSuccess(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Deposit Another Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualModalOpen(false)}
                      className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleManualDepositSubmit} className="space-y-4">
                  {manualError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{manualError}</span>
                    </div>
                  )}

                  {/* Account Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Select Trading Account <span className="text-rose-500">*</span>
                    </label>
                    {selectedAccount ? (
                      <div className="relative p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">#{selectedAccount.login}</span>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                              REF Desk
                            </span>
                            <span className="text-xs text-slate-500 font-medium">({selectedAccount.accountType})</span>
                          </div>
                          <div className="text-xs text-slate-600 flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <User className="w-3 h-3 text-slate-400" />
                              {selectedAccount.clientName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {selectedAccount.clientEmail}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-700 pt-0.5">
                            Current Balance:{' '}
                            <span className="font-extrabold text-slate-900">${selectedAccount.balance.toFixed(2)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedAccount(null)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 bg-white rounded border border-rose-200 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <select
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        onChange={(e) => {
                          const acc = AVAILABLE_ACCOUNTS.find((a) => a.login === e.target.value);
                          if (acc) setSelectedAccount(acc);
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          -- Choose MT5 Live Trading Account --
                        </option>
                        {AVAILABLE_ACCOUNTS.map((acc) => (
                          <option key={acc.login} value={acc.login}>
                            #{acc.login} - {acc.clientName} ({acc.clientEmail}) - Balance: ${acc.balance.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Deposit Amount */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Deposit Amount (USD) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="any"
                        min="1"
                        value={manualAmount}
                        onChange={(e) => setManualAmount(e.target.value)}
                        placeholder="e.g. 5000.00"
                        required
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Funding Source / Method <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={manualMethod}
                      onChange={(e) => setManualMethod(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                      <option value="crypto usdt">Crypto USDT (TRC20 / ERC20)</option>
                      <option value="crypto btc">Crypto Bitcoin (BTC)</option>
                      <option value="bank wire">Direct Bank Wire Transfer</option>
                      <option value="credit card">Credit / Debit Card</option>
                      <option value="manual credit">Internal / Desk Cash Adjustment</option>
                    </select>
                  </div>

                  {/* Reference / TX Hash */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Transaction Hash / Reference / Receipt
                    </label>
                    <input
                      type="text"
                      value={manualTxHash}
                      onChange={(e) => setManualTxHash(e.target.value)}
                      placeholder="e.g. 0x82f... or Wire REF# or Cash Voucher"
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Internal Admin Notes
                    </label>
                    <input
                      type="text"
                      value={manualRemarks}
                      onChange={(e) => setManualRemarks(e.target.value)}
                      placeholder="e.g. VIP deposit verified by compliance desk"
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  {/* Email notify checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="notifyEmail"
                      checked={manualSendEmail}
                      onChange={(e) => setManualSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="notifyEmail" className="text-xs font-medium text-slate-700 cursor-pointer">
                      Send deposit confirmation email notification to client
                    </label>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setManualModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={manualSubmitting || !selectedAccount || !manualAmount}
                      className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      {manualSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Credit Funds to MT5</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
