import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  DollarSign,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Key,
  RefreshCw,
  RotateCw,
  Search,
  Sliders,
  TrendingUp,
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
  const [editLeverage, setEditLeverage] = useState('1:500');
  const [showMasterPass, setShowMasterPass] = useState(false);
  const [showInvestorPass, setShowInvestorPass] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filtered accounts
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
    setEditLeverage(acc.leverage.startsWith('1:') ? acc.leverage : `1:${acc.leverage}`);
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
    const headers = ['Account No', 'Client Name', 'Email', 'Server', 'Leverage', 'Balance', 'Equity', 'Floating P/L', 'Status'];
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
      {/* Page Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
              <span className="text-slate-900 font-extrabold">Trading</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Accounts</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Manage and audit Referral client trading accounts in real time
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh page data"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Total Accounts */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(37,99,235,0.22)]">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{totalAccounts}</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Accounts</div>
            <div className="text-[11px] text-slate-400 truncate">Referral Accounts</div>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(5,150,105,0.22)]">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{activeAccounts}</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Active Accounts</div>
            <div className="text-[11px] text-slate-400 truncate">Referral Active</div>
          </div>
        </div>

        {/* Total Equity */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(124,58,237,0.22)]">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{formattedTotalEquity}</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Equity</div>
            <div className="text-[11px] text-slate-400 truncate">Referral Pool</div>
          </div>
        </div>

        {/* Floating Profit/Loss */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(13,148,136,0.22)]">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 leading-none">+$0.00</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Floating Profit/Loss</div>
            <div className="text-[11px] text-slate-400 truncate">Referral Exposure</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search account, client name, email..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
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
            <option value="1:400">1:400</option>
            <option value="1:500">1:500</option>
          </select>
          <div className="hidden md:inline-flex items-center px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-500 whitespace-nowrap">
            <span className="font-bold text-slate-700 mr-1">{filteredAccounts.length}</span> accounts
          </div>
        </div>
      </div>

      {/* Accounts Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">ACCOUNT NO</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">SERVER</th>
                <th className="py-3 px-4">LEVERAGE</th>
                <th className="py-3 px-4">BALANCE</th>
                <th className="py-3 px-4">EQUITY</th>
                <th className="py-3 px-4">FLOATING P/L</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No trading accounts found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.accountNo} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {acc.accountNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {acc.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">
                      {acc.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {acc.server}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {acc.leverage}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {acc.balance}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {acc.equity}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      {acc.floatingPl}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          acc.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : acc.status === 'READ ONLY'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => handleSyncBalance(acc.accountNo)}
                          title="Sync Live MT5 Balance"
                          aria-label="Sync Live MT5 Balance"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                        >
                          <RotateCw
                            className={`w-3.5 h-3.5 ${syncingId === acc.accountNo ? 'animate-spin text-blue-600' : ''}`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenManageModal(acc)}
                          title="Manage Trading Account"
                          aria-label="Manage Trading Account"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-700">1</span> to{' '}
            <span className="font-bold text-slate-700">{filteredAccounts.length}</span> of{' '}
            <span className="font-bold text-slate-700">{accounts.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Rows:</span>
            <span className="font-bold text-slate-700">10</span>
            <div className="inline-flex items-center gap-1 ml-3">
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 text-xs font-semibold disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#7c3aed] text-white text-xs font-bold"
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 text-xs font-semibold disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Trading Account Modal */}
      {selectedAccount && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedAccount(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-blue-600">
                <Sliders className="w-5 h-5" />
                <h3 className="font-sora font-extrabold text-base text-slate-900">
                  Manage Account #{selectedAccount.accountNo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess ? (
              <div className="py-8 text-center text-emerald-600 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="font-bold text-sm">Account Settings Updated!</div>
              </div>
            ) : (
              <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
                {/* Client Name & Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Client Name & Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedAccount.clientName} (${selectedAccount.email})`}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-medium"
                  />
                </div>

                {/* Balance & Equity Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-500">Current Balance</span>
                      <button
                        type="button"
                        onClick={() => handleSyncBalance(selectedAccount.accountNo)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <RotateCw
                          className={`w-3 h-3 ${syncingId === selectedAccount.accountNo ? 'animate-spin' : ''}`}
                        />
                        <span>Sync MT5</span>
                      </button>
                    </div>
                    <div className="text-sm font-black text-slate-900">{selectedAccount.balance}</div>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 mb-1">Current Equity</span>
                    <div className="text-sm font-black text-blue-600">{selectedAccount.equity}</div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Account Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="ACTIVE">ACTIVE (Full Trading Allowed)</option>
                    <option value="READ ONLY">READ ONLY (Close Positions Only)</option>
                    <option value="DISABLED">DISABLED (Trading Suspended)</option>
                  </select>
                </div>

                {/* Trading Leverage */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Trading Leverage
                  </label>
                  <select
                    value={editLeverage}
                    onChange={(e) => setEditLeverage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  >
                    <option value="1:100">1:100</option>
                    <option value="1:200">1:200</option>
                    <option value="1:400">1:400</option>
                    <option value="1:500">1:500</option>
                    <option value="1:1000">1:1000</option>
                  </select>
                </div>

                {/* MT5 Passwords Container */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                      <Key className="w-3.5 h-3.5 text-amber-500" />
                      <span>MT5 Passwords</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setChangePassOpen((v) => !v)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {changePassOpen ? 'Close Form' : '+ Change Password'}
                    </button>
                  </div>

                  {/* Master Password row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Master (Trading):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                        {showMasterPass ? selectedAccount.mainPassword : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowMasterPass((v) => !v)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showMasterPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Investor Password row */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Investor (Read-only):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                        {showInvestorPass ? selectedAccount.investorPassword : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowInvestorPass((v) => !v)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {showInvestorPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Change Password Input */}
                  {changePassOpen && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5 animate-in fade-in duration-150">
                      <label className="block text-[11px] font-bold text-slate-600">
                        New Master Password
                      </label>
                      <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-mono text-xs outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAccount(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-xs transition-colors cursor-pointer"
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
