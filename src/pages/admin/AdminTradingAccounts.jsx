import { useState } from 'react';
import {
  Activity,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Key,
  RefreshCw,
  RotateCw,
  Search,
  Sliders,
  Users,
  X,
} from 'lucide-react';
import { initialTradingAccounts } from '../../data/adminData.js';

export default function AdminTradingAccounts() {
  const [accounts, setAccounts] = useState(initialTradingAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [leverageFilter, setLeverageFilter] = useState('');
  const [syncingId, setSyncingId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editStatus, setEditStatus] = useState('ACTIVE');
  const [editLeverage, setEditLeverage] = useState('500');
  const [showMasterPass, setShowMasterPass] = useState(false);
  const [showInvestorPass, setShowInvestorPass] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      acc.accountNo.toLowerCase().includes(q) ||
      acc.clientName.toLowerCase().includes(q) ||
      acc.email.toLowerCase().includes(q);

    const matchesLeverage =
      !leverageFilter ||
      acc.leverage.includes(leverageFilter.replace('1:', ''));

    return matchesSearch && matchesLeverage;
  });

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE').length;
  const totalEquityNum = accounts.reduce((sum, a) => sum + (a.balanceNum || 0), 0);
  const formattedTotalEquity = `$${totalEquityNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleSyncBalance = (accountNo) => {
    setSyncingId(accountNo);
    setTimeout(() => {
      setSyncingId(null);
    }, 1000);
  };

  const handleOpenManageModal = (acc) => {
    setSelectedAccount(acc);
    setEditStatus(acc.status);
    setEditLeverage(acc.leverage.replace('1:', ''));
    setShowMasterPass(false);
    setShowInvestorPass(false);
    setChangePassOpen(false);
    setNewPassword('');
    setSaveSuccess(false);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!selectedAccount) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNo === selectedAccount.accountNo) {
          return {
            ...acc,
            status: editStatus,
            leverage: editLeverage,
            mainPassword: newPassword ? newPassword : acc.mainPassword,
          };
        }
        return acc;
      })
    );
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSelectedAccount(null);
    }, 1200);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['ACCOUNT NO', 'CLIENT NAME', 'EMAIL', 'SERVER', 'LEVERAGE', 'BALANCE', 'EQUITY', 'FLOATING P/L', 'STATUS'];
    const rows = filteredAccounts.map((a) => [
      a.accountNo,
      `"${a.clientName}"`,
      a.email,
      a.server,
      a.leverage,
      `"${a.balance}"`,
      `"${a.equity}"`,
      `"${a.floatingPl}"`,
      a.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trading_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Header Banner - Exactly matching scratch_main_exact.html */}
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
                    Trading
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Accounts
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Manage and audit Referral client trading accounts in real time
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
                    type="button"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Export to Excel</span>
                  </button>
                </div>
              </div>
              <button
                aria-label="Refresh"
                onClick={handleRefresh}
                className="btn-secondary absolute top-3 right-3 sm:static !p-2 sm:!px-[0.85rem] sm:!py-2 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
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
                title="Refresh page data"
                type="button"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards - Exactly matching scratch_main_exact.html */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Total Accounts */}
        <div className="admin-kpi-card" title="Total Accounts">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={totalAccounts}>
              {totalAccounts}
            </div>
            <div className="admin-kpi-title">Total Accounts</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Referral Accounts</span>
            </div>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="admin-kpi-card" title="Active Accounts">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={activeAccounts}>
              {activeAccounts}
            </div>
            <div className="admin-kpi-title">Active Accounts</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Referral Active</span>
            </div>
          </div>
        </div>

        {/* Total Equity */}
        <div className="admin-kpi-card" title="Total Equity">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
              boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
            }}
          >
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={formattedTotalEquity}>
              {formattedTotalEquity}
            </div>
            <div className="admin-kpi-title">Total Equity</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Referral Pool</span>
            </div>
          </div>
        </div>

        {/* Floating Profit/Loss */}
        <div className="admin-kpi-card" title="Floating Profit/Loss">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title="+$0.00">
              +$0.00
            </div>
            <div className="admin-kpi-title">Floating Profit/Loss</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Referral Exposure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Exactly matching scratch_main_exact.html */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
          <input
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
            placeholder="Search account, client name, email..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <select
            value={leverageFilter}
            onChange={(e) => setLeverageFilter(e.target.value)}
            className="py-2 px-3 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 outline-none cursor-pointer"
          >
            <option value="">All Leverages</option>
            <option value="1:100">1:100</option>
            <option value="1:200">1:200</option>
            <option value="1:500">1:500</option>
          </select>
          <div className="hidden md:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
            <span className="font-bold text-slate-700 mr-1">{filteredAccounts.length}</span> accounts
          </div>
        </div>
      </div>

      {/* Data Table Container - Exactly matching scratch_main_exact.html */}
      <div className="data-table">
        <div className="data-table-scroll">
          <table className="data-table-grid" data-cards="">
            <thead>
              <tr>
                <th>ACCOUNT NO</th>
                <th>CLIENT NAME</th>
                <th>EMAIL</th>
                <th>SERVER</th>
                <th>LEVERAGE</th>
                <th>BALANCE</th>
                <th>EQUITY</th>
                <th>FLOATING P/L</th>
                <th>STATUS</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    No accounts found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.accountNo}>
                    <td data-label="ACCOUNT NO" style={{ fontWeight: 700, color: 'rgb(15, 23, 42)' }}>
                      {acc.accountNo}
                    </td>
                    <td data-label="CLIENT NAME">{acc.clientName}</td>
                    <td data-label="EMAIL" style={{ color: 'rgb(100, 116, 139)' }}>
                      {acc.email}
                    </td>
                    <td data-label="SERVER">
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          backgroundColor: 'rgb(241, 245, 249)',
                          borderRadius: '4px',
                          color: 'rgb(71, 85, 105)',
                        }}
                      >
                        {acc.server}
                      </span>
                    </td>
                    <td data-label="LEVERAGE" style={{ fontWeight: 600 }}>
                      {acc.leverage.replace('1:', '')}
                    </td>
                    <td data-label="BALANCE" style={{ fontWeight: 600 }}>
                      {acc.balance}
                    </td>
                    <td data-label="EQUITY" style={{ fontWeight: 700, color: 'rgb(37, 99, 235)' }}>
                      {acc.equity}
                    </td>
                    <td data-label="FLOATING P/L" style={{ fontWeight: 600, color: 'rgb(22, 163, 74)' }}>
                      {acc.floatingPl}
                    </td>
                    <td data-label="STATUS">
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          backgroundColor:
                            acc.status === 'ACTIVE'
                              ? 'rgb(220, 252, 231)'
                              : acc.status === 'READ ONLY'
                              ? 'rgb(254, 243, 199)'
                              : 'rgb(254, 226, 226)',
                          color:
                            acc.status === 'ACTIVE'
                              ? 'rgb(22, 101, 52)'
                              : acc.status === 'READ ONLY'
                              ? 'rgb(146, 64, 14)'
                              : 'rgb(153, 27, 27)',
                        }}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td data-actions="" data-label="ACTIONS" style={{ textAlign: 'right' }}>
                      <div className="admin-action-group">
                        <button
                          aria-label="Sync Live MT5 Balance"
                          onClick={() => handleSyncBalance(acc.accountNo)}
                          className="admin-action-btn admin-action-btn-view"
                          style={{ cursor: 'pointer' }}
                          title="Sync Live MT5 Balance"
                        >
                          <RotateCw
                            style={{
                              width: '14px',
                              height: '14px',
                              animation: syncingId === acc.accountNo ? 'spin 1s linear infinite' : 'none',
                            }}
                          />
                        </button>
                        <button
                          aria-label="Manage Trading Account"
                          onClick={() => handleOpenManageModal(acc)}
                          className="admin-action-btn admin-action-btn-view"
                          title="Manage Trading Account"
                        >
                          <Sliders style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pager - Exactly matching scratch_main_exact.html */}
        <div className="table-pager">
          <span className="table-pager-info">
            Showing <strong>1</strong> to <strong>{filteredAccounts.length}</strong> of{' '}
            <strong>{accounts.length}</strong> entries
          </span>
          <div className="table-pager-controls">
            <label className="table-pager-size">
              <span>Rows</span>
              <select aria-label="Rows per page">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            <nav aria-label="Pages" className="table-pager-pages">
              <button aria-label="Previous page" className="table-pager-btn" disabled type="button">
                <ChevronLeft style={{ width: '13px', height: '13px' }} />
                <span>Prev</span>
              </button>
              <button aria-current="page" className="table-pager-btn table-pager-num" type="button">
                1
              </button>
              <button aria-label="Next page" className="table-pager-btn" disabled type="button">
                <span>Next</span>
                <ChevronRight style={{ width: '13px', height: '13px' }} />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Manage Trading Account Modal - Exactly matching Next.js modal in zip */}
      {selectedAccount && (
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
          onClick={() => setSelectedAccount(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '480px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                <Sliders size={18} color="#2563eb" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  Manage Account #{selectedAccount.accountNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {saveSuccess ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#16a34a' }}>
                <Check size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700 }}>Account Settings Updated!</div>
              </div>
            ) : (
              <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {/* Client Name & Email */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Client Name & Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedAccount.clientName} (${selectedAccount.email})`}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                    }}
                  />
                </div>

                {/* Balance & Equity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Current Balance</label>
                      <button
                        type="button"
                        onClick={() => handleSyncBalance(selectedAccount.accountNo)}
                        disabled={syncingId === selectedAccount.accountNo}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          cursor: syncingId === selectedAccount.accountNo ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <RotateCw
                          size={10}
                          style={{
                            animation: syncingId === selectedAccount.accountNo ? 'spin 1s linear infinite' : 'none',
                          }}
                        />
                        <span>{syncingId === selectedAccount.accountNo ? 'Syncing...' : 'Sync MT5'}</span>
                      </button>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', padding: '0.2rem 0' }}>
                      {selectedAccount.balance}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                      Current Equity
                    </label>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2563eb', padding: '0.2rem 0' }}>
                      {selectedAccount.equity}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="ACTIVE">ACTIVE (Full Trading Allowed)</option>
                    <option value="READ ONLY">READ ONLY (Close Positions Only)</option>
                    <option value="DISABLED">DISABLED (Trading Suspended)</option>
                  </select>
                </div>

                {/* Trading Leverage */}
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Trading Leverage
                  </label>
                  <select
                    value={editLeverage}
                    onChange={(e) => setEditLeverage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="100">1:100</option>
                    <option value="200">1:200</option>
                    <option value="500">1:500</option>
                    <option value="1000">1:1000</option>
                  </select>
                </div>

                {/* MT5 Passwords container */}
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Key size={14} color="#d97706" />
                      <span>MT5 Passwords</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setChangePassOpen((v) => !v)}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.725rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {changePassOpen ? 'Close Form' : '+ Change Password'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Master (Trading):</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', backgroundColor: '#ffffff', padding: '0.2rem 0.45rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        {showMasterPass ? selectedAccount.mainPassword : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowMasterPass((v) => !v)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.1rem' }}
                      >
                        {showMasterPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Investor (Read-only):</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', backgroundColor: '#ffffff', padding: '0.2rem 0.45rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        {showInvestorPass ? selectedAccount.investorPassword : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowInvestorPass((v) => !v)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.1rem' }}
                      >
                        {showInvestorPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {changePassOpen && (
                    <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                        New Master Password
                      </label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '0.35rem 0.5rem',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedAccount(null)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'var(--desk, #ea580c)',
                      color: '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
