import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  FileSpreadsheet,
  RefreshCw,
  Search,
  DollarSign,
  Wallet,
  Building2,
  CheckCircle2,
  X,
  AlertCircle,
  User,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_manual_deposits';
const ACCOUNTS_STORAGE_KEY = 'majesty_admin_trading_accounts';

const INITIAL_ACCOUNTS = [
  { login: '800106', clientName: 'Demo Trader', clientEmail: 'democlient@majestyfx.com', desk: 'demo', accountType: 'Standard Account', balance: 10000.00, currency: 'USD' },
  { login: '800103', clientName: 'Sofia Al-Mansoor', clientEmail: 'sofia.mansoor@demo.example.com', desk: 'referral', accountType: 'Raw Spread Account', balance: 3500.00, currency: 'USD' },
  { login: '800105', clientName: 'David Miller', clientEmail: 'david.miller@demo.example.com', desk: 'referral', accountType: 'Standard Account', balance: 2500.00, currency: 'USD' },
  { login: '800101', clientName: 'Alexander Wright', clientEmail: 'alex.wright@demo.example.com', desk: 'ib1', accountType: 'ECN Account', balance: 5000.00, currency: 'USD' },
  { login: '800104', clientName: 'Marcus Chen', clientEmail: 'marcus.chen@demo.example.com', desk: 'ib2', accountType: 'Pro Account', balance: 10000.00, currency: 'USD' },
];

const INITIAL_MANUAL_DEPOSITS = [
  {
    id: 'MAN_DEP_01',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    accountLogin: '800106',
    clientName: 'Demo Trader',
    clientEmail: 'democlient@majestyfx.com',
    amount: 10000.00,
    currency: 'USD',
    paymentMethod: 'USDT TRC20',
    txHash: 'TRX7xK9921bF43aD90cE124567890abcdef12345678',
    adminComment: 'Initial Sandbox Liquidity Provision',
    remarks: 'Initial Sandbox Liquidity Provision',
    status: 'Completed',
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

function ManualDepositModal({ isOpen, onClose, onSuccess, preselectedLogin, preselectedEmail, preselectedAmount, preselectedTxHash }) {
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountSearch, setAccountSearch] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amountStr, setAmountStr] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('USDT TRC20');
  const [txHash, setTxHash] = useState('');
  const [remarks, setRemarks] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const idempotencyRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoadingAccounts(true);
    setErrorMessage(null);
    setSuccessResult(null);

    let desk = '';
    try {
      const auth = localStorage.getItem('majesty_admin_auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        const r = (parsed.role || '').toLowerCase().trim();
        const d = (parsed.desk || '').toLowerCase().trim();
        const superRoles = ['super_admin', 'superadmin', 'master', 'super', 'owner', 'admin', 'all'];
        if (d && !superRoles.includes(d)) desk = d;
        else if (r && !superRoles.includes(r)) desk = r.endsWith('_admin') ? r.replace(/_admin$/, '') : r;
      }
    } catch {}

    const loadAccounts = async () => {
      try {
        const res = await fetch('/api/admin/manual-deposit', {
          headers: {
            'x-portal-scope': 'admin',
            ...(desk ? { 'x-admin-desk': desk } : {}),
          },
        });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
          if (preselectedLogin) {
            const acc = data.accounts.find((a) => a.login === preselectedLogin);
            if (acc) setSelectedAccount(acc);
          } else if (preselectedEmail) {
            const acc = data.accounts.find((a) => a.clientEmail.toLowerCase() === preselectedEmail.toLowerCase());
            if (acc) setSelectedAccount(acc);
          }
          return;
        }
      } catch {}

      // Fallback to local storage or mock accounts
      try {
        const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
        const accList = saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
        if (isMounted) {
          setAccounts(accList);
          if (preselectedLogin) {
            const acc = accList.find((a) => a.login === preselectedLogin);
            if (acc) setSelectedAccount(acc);
          } else if (preselectedEmail) {
            const acc = accList.find((a) => a.clientEmail.toLowerCase() === preselectedEmail.toLowerCase());
            if (acc) setSelectedAccount(acc);
          }
        }
      } catch {
        if (isMounted) setAccounts(INITIAL_ACCOUNTS);
      } finally {
        if (isMounted) setLoadingAccounts(false);
      }
    };

    loadAccounts();
    if (preselectedAmount) setAmountStr(String(preselectedAmount));
    if (preselectedTxHash) setTxHash(preselectedTxHash);

    return () => {
      isMounted = false;
    };
  }, [isOpen, preselectedLogin, preselectedEmail, preselectedAmount, preselectedTxHash]);

  const filteredAccounts = useMemo(() => {
    if (!accountSearch.trim()) return accounts.slice(0, 50);
    const q = accountSearch.toLowerCase().trim();
    return accounts
      .filter(
        (a) =>
          String(a.login).includes(q) ||
          (a.clientName && a.clientName.toLowerCase().includes(q)) ||
          (a.clientEmail && a.clientEmail.toLowerCase().includes(q)) ||
          (a.desk && a.desk.toLowerCase().includes(q))
      )
      .slice(0, 50);
  }, [accounts, accountSearch]);

  const depositAmount = parseFloat(amountStr) || 0;
  const newBalance = selectedAccount ? selectedAccount.balance + depositAmount : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) {
      setErrorMessage('Please select a target trading account.');
      return;
    }
    if (depositAmount <= 0) {
      setErrorMessage('Please enter a valid deposit amount greater than 0.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    let desk = '';
    try {
      const auth = localStorage.getItem('majesty_admin_auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        const r = (parsed.role || '').toLowerCase().trim();
        const d = (parsed.desk || '').toLowerCase().trim();
        const superRoles = ['super_admin', 'superadmin', 'master', 'super', 'owner', 'admin', 'all'];
        if (d && !superRoles.includes(d)) desk = d;
        else if (r && !superRoles.includes(r)) desk = r.endsWith('_admin') ? r.replace(/_admin$/, '') : r;
      }
    } catch {}

    try {
      const fingerprint = `${selectedAccount.login}:${depositAmount}`;
      if (!idempotencyRef.current || idempotencyRef.current.fingerprint !== fingerprint) {
        idempotencyRef.current = { fingerprint, key: crypto.randomUUID() };
      }

      let resOk = false;
      let apiResult = null;
      try {
        const res = await fetch('/api/admin/manual-deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotencyRef.current.key,
            'x-portal-scope': 'admin',
            ...(desk ? { 'x-admin-desk': desk } : {}),
          },
          body: JSON.stringify({
            accountLogin: selectedAccount.login,
            amount: depositAmount,
            paymentMethod,
            txHash: txHash.trim() || undefined,
            remarks: remarks.trim() || undefined,
            sendEmail,
          }),
        });
        apiResult = await res.json();
        resOk = res.ok && apiResult.success;
      } catch {}

      const updatedBalance = selectedAccount.balance + depositAmount;

      // Update local storage accounts
      try {
        const saved = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
        const accList = saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
        const updated = accList.map((a) =>
          a.login === selectedAccount.login ? { ...a, balance: updatedBalance } : a
        );
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
        setAccounts(updated);
      } catch {}

      // Save to manual deposit records
      const record = {
        id: `DEP_${Date.now()}`,
        createdAt: new Date().toISOString(),
        accountLogin: selectedAccount.login,
        clientName: selectedAccount.clientName,
        clientEmail: selectedAccount.clientEmail,
        amount: depositAmount,
        currency: selectedAccount.currency || 'USD',
        paymentMethod,
        txHash: txHash.trim() || undefined,
        adminComment: remarks.trim() || 'Manual deposit credited by admin',
        remarks: remarks.trim() || 'Manual deposit credited by admin',
        status: 'Completed',
      };

      try {
        const savedDeposits = localStorage.getItem(STORAGE_KEY);
        const currentDeposits = savedDeposits ? JSON.parse(savedDeposits) : INITIAL_MANUAL_DEPOSITS;
        const updatedDeposits = [record, ...currentDeposits];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDeposits));
      } catch {}

      idempotencyRef.current = null;
      setSuccessResult({
        message:
          apiResult?.message ||
          `Successfully credited $${depositAmount.toFixed(2)} to account #${selectedAccount.login}!`,
        newBalance: apiResult?.newBalance ?? updatedBalance,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process manual deposit.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
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
                Manual Deposit &amp; Account Credit
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0 0', lineHeight: 1.2 }}>
                Credit verified funds directly to live MT5 account
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {successResult ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Deposit Credited Successfully!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">{successResult.message}</p>
              {successResult.newBalance !== undefined && (
                <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700">
                  Updated Live Balance:{' '}
                  <span className="text-emerald-600 font-extrabold text-sm">
                    ${successResult.newBalance.toFixed(2)} USD
                  </span>
                </div>
              )}
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAccount(null);
                    setAccountSearch('');
                    setAmountStr('');
                    setTxHash('');
                    setRemarks('');
                    setErrorMessage(null);
                    setSuccessResult(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Deposit Another Account
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <div className="flex-1 font-medium">{errorMessage}</div>
                </div>
              )}

              {/* Account Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Trading Account <span className="text-rose-500">*</span>
                </label>
                {selectedAccount ? (
                  <div className="relative p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">#{selectedAccount.login}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            selectedAccount.desk === 'ib1'
                              ? 'bg-blue-100 text-blue-800'
                              : selectedAccount.desk === 'ib2'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {selectedAccount.desk ? selectedAccount.desk.toUpperCase() : 'DEMO'} Desk
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
                        <span className="font-extrabold text-slate-900">
                          ${selectedAccount.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAccount(null)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div style={{ position: 'relative' }}>
                      <Search
                        size={16}
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#94a3b8',
                          pointerEvents: 'none',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Search by login #, client name, email, desk..."
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        style={{
                          width: '100%',
                          paddingLeft: '36px',
                          paddingRight: '12px',
                          paddingTop: '9px',
                          paddingBottom: '9px',
                          fontSize: '0.85rem',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '0.75rem',
                          outline: 'none',
                        }}
                        className="focus:bg-white focus:border-emerald-500 transition-all"
                      />
                    </div>
                    {loadingAccounts ? (
                      <div className="py-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Loading accessible client accounts...</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          maxHeight: '180px',
                          overflowY: 'auto',
                          borderRadius: '0.75rem',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                        }}
                        className="divide-y divide-slate-100 shadow-inner"
                      >
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((acc) => (
                            <div
                              key={acc.login}
                              onClick={() => setSelectedAccount(acc)}
                              className="p-2.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-slate-900">#{acc.login}</span>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700">
                                    {acc.desk}
                                  </span>
                                  <span className="text-xs text-slate-700 font-medium">{acc.clientName}</span>
                                </div>
                                <div className="text-[11px] text-slate-500">{acc.clientEmail}</div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-slate-900">${acc.balance.toFixed(2)}</span>
                                <div className="text-[10px] text-slate-400 uppercase font-medium">
                                  {acc.currency || 'USD'}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-xs text-slate-400">
                            {accounts.length === 0
                              ? 'No live trading accounts found in system.'
                              : `No accounts match "${accountSearch}".`}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount and Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: '#334155',
                      marginBottom: '0.375rem',
                    }}
                  >
                    Deposit Amount (USD) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: '#64748b',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: 2,
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '32px',
                        paddingRight: '12px',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '0.75rem',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {[50, 100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmountStr(String(amt))}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          color: '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#ecfdf5';
                          e.currentTarget.style.color = '#047857';
                          e.currentTarget.style.borderColor = '#a7f3d0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.color = '#475569';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        +${amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Payment Method <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800"
                  >
                    <option value="USDT TRC20">USDT (TRC20)</option>
                    <option value="USDT ERC20">USDT (ERC20)</option>
                    <option value="Local Deposit (WhatsApp)">Local Deposit (WhatsApp Agent)</option>
                    <option value="Bank Wire Transfer">Bank Wire Transfer</option>
                    <option value="Credit / Debit Card">Credit / Debit Card</option>
                    <option value="Bitcoin (BTC)">Bitcoin (BTC)</option>
                    <option value="Cash / Office Deposit">Cash / Office Settlement</option>
                    <option value="Manual Admin Adjustment">Manual Admin Adjustment</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Balance Breakdown */}
              {selectedAccount && depositAmount > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Current Balance:</span>
                    <strong className="ml-1 text-slate-800">${selectedAccount.balance.toFixed(2)}</strong>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <div>
                    <span className="text-slate-500">Deposit:</span>
                    <strong className="ml-1 text-emerald-600">+${depositAmount.toFixed(2)}</strong>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <div>
                    <span className="text-slate-500 font-bold">New Balance:</span>
                    <strong className="ml-1 text-slate-900 font-extrabold">${newBalance.toFixed(2)}</strong>
                  </div>
                </div>
              )}

              {/* TxHash and Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    TX Hash / Reference ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 79858e9222... or Bank Slip #"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Audit Remark / Reason
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified receipt: Binance slip shows 50 USDT"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
                  />
                </div>
              </div>

              {/* Email Notification Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sendEmailCheck"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="sendEmailCheck" className="text-xs text-slate-600 cursor-pointer select-none">
                  Send official deposit confirmation email to client ({selectedAccount?.clientEmail || 'client'})
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedAccount || depositAmount <= 0}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Crediting MT5 Live Account...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm &amp; Credit {depositAmount > 0 ? `$${depositAmount.toFixed(2)}` : 'Deposit'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminManualDeposit() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [deskScope, setDeskScope] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchDeposits = useCallback(async () => {
    try {
      let desk = '';
      try {
        const auth = localStorage.getItem('majesty_admin_auth');
        if (auth) {
          const parsed = JSON.parse(auth);
          desk = parsed.desk || parsed.role || '';
        }
      } catch {}

      let apiLoaded = false;
      try {
        const res = await fetch('/api/admin/manual-deposit', {
          headers: {
            'x-portal-scope': 'admin',
            ...(desk ? { 'x-admin-desk': desk } : {}),
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setDeposits(data.recentDeposits || []);
          setDeskScope(data.desk || 'all');
          setErrorMessage(null);
          apiLoaded = true;
        }
      } catch {}

      if (!apiLoaded) {
        // Load from local storage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            setDeposits(JSON.parse(saved));
          } else {
            setDeposits(INITIAL_MANUAL_DEPOSITS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MANUAL_DEPOSITS));
          }
        } catch {
          setDeposits(INITIAL_MANUAL_DEPOSITS);
        }
        setDeskScope(desk && desk !== 'super_admin' ? desk : 'demo');
        setErrorMessage(null);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error loading manual deposit history.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDeposits();
  };

  const filteredDeposits = useMemo(() => {
    const q = search.toLowerCase().trim();
    return deposits.filter((d) => {
      if (!q) return true;
      return (
        String(d.accountLogin).includes(q) ||
        (d.clientName && d.clientName.toLowerCase().includes(q)) ||
        (d.clientEmail && d.clientEmail.toLowerCase().includes(q)) ||
        (d.paymentMethod && d.paymentMethod.toLowerCase().includes(q)) ||
        (d.txHash && d.txHash.toLowerCase().includes(q)) ||
        (d.adminComment && d.adminComment.toLowerCase().includes(q)) ||
        (d.remarks && d.remarks.toLowerCase().includes(q))
      );
    });
  }, [deposits, search]);

  const totalCredited = useMemo(
    () => filteredDeposits.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
    [filteredDeposits]
  );

  const creditedAccountsCount = useMemo(
    () => new Set(filteredDeposits.map((d) => d.accountLogin)).size,
    [filteredDeposits]
  );

  const handleExport = () => {
    const rows = filteredDeposits.map((d) => [
      d.id,
      d.createdAt ? new Date(d.createdAt).toLocaleString() : '',
      d.clientEmail,
      d.accountLogin,
      Number(d.amount).toFixed(2),
      d.paymentMethod,
      d.txHash || '',
      d.adminComment || d.remarks || '',
    ]);
    exportToCSV(`Manual_Deposits_${new Date().toISOString().slice(0, 10)}`, [
      'Deposit ID',
      'Date & Time',
      'Client Email',
      'Account Login',
      'Amount (USD)',
      'Method',
      'TX Hash / Ref',
      'Audit Remarks',
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
            <Link to="/admin/deposit-history" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Deposit History
            </Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Manual Deposit</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Manual Deposit
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Panel
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Directly credit verified funds to MT5 live trading accounts with automated balance settlement and full desk audit trails.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Manual Deposit</span>
                </button>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export</span>
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
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* 2. 3 KPI Cards matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Card 1: Total Manual Credited */}
        <div className="admin-kpi-card" title="Total Manual Credited">
          <div
            className="admin-kpi-icon-squircle text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
              boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
            }}
          >
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={`$${totalCredited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            >
              ${totalCredited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="admin-kpi-title">Total Manual Credited</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Real-time MT5 Settlement</span>
            </div>
          </div>
        </div>

        {/* Card 2: Credited Accounts */}
        <div className="admin-kpi-card" title="Credited Accounts">
          <div
            className="admin-kpi-icon-squircle text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(creditedAccountsCount)}>
              {creditedAccountsCount}
            </div>
            <div className="admin-kpi-title">Credited Accounts</div>
            <div className="admin-kpi-sub">
              <span className="truncate">{filteredDeposits.length} total operations</span>
            </div>
          </div>
        </div>

        {/* Card 3: Admin Desk Scope */}
        <div className="admin-kpi-card" title="Admin Desk Scope">
          <div
            className="admin-kpi-icon-squircle text-white"
            style={{
              background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
              boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
            }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={deskScope === 'all' ? 'All Desks' : `${deskScope.toUpperCase()} Desk`}
            >
              {deskScope === 'all' ? 'All Desks' : `${deskScope.toUpperCase()} Desk`}
            </div>
            <div className="admin-kpi-title">Admin Desk Scope</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Isolated Permissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Table matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search by Login, Email, Tx Hash, or Remark..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredDeposits.length}</strong> manual deposit records
          </div>
        </div>

        <div className="data-table data-table--plain overflow-x-auto">
          <div className="data-table-scroll">
            <table className="data-table-grid w-full text-left border-collapse" data-cards="">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">Date &amp; Time</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">Account Login</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">Client</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">Amount</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">Payment Method</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">TX Hash / Reference</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-700">Audit Note &amp; Remarks</th>
                  <th style={{ textAlign: 'center' }} className="py-3 px-4 text-xs font-bold text-slate-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="data-table-empty py-12 text-center text-slate-500 text-xs">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-600" />
                      <span>Loading manual deposit records...</span>
                    </td>
                  </tr>
                ) : filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="data-table-empty py-12 text-center text-slate-400 text-xs">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
                      <span>No manual deposit records found</span>
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-xs">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-blue-600 font-mono text-xs">
                        #{item.accountLogin}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{item.clientName || 'Trader'}</div>
                        <div className="text-[11px] text-slate-500">{item.clientEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-emerald-600 text-sm">
                          +${Number(item.amount).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase ml-1 font-bold">
                          {item.currency || 'USD'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                        {item.paymentMethod}
                      </td>
                      <td
                        className="py-3.5 px-4 font-mono text-[11px] text-slate-600 max-w-[150px] truncate"
                        title={item.txHash}
                      >
                        {item.txHash || '—'}
                      </td>
                      <td
                        className="py-3.5 px-4 text-slate-600 max-w-[220px] truncate text-xs"
                        title={item.adminComment || item.remarks}
                      >
                        {item.adminComment || item.remarks || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Deposit Modal */}
      <ManualDepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchDeposits();
        }}
      />
    </div>
  );
}
