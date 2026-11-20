import React, { useState, useEffect } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  Download,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Power,
  PowerOff,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_payment_ledger';

// seed data lives in src/data/json (INITIAL_WALLETS)

export default function AdminPaymentLedger() {
  const { items: wallets, setItems: setWallets } = useCollection('paymentLedger');

  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPaymentType, setFormPaymentType] = useState('Crypto (TRC20)');
  const [formAddress, setFormAddress] = useState('');
  const [formQrCodeUrl, setFormQrCodeUrl] = useState('');
  const [formTransactionTime, setFormTransactionTime] = useState('');
  const [formWithdrawFees, setFormWithdrawFees] = useState('');
  const [copiedId, setCopiedId] = useState(null);


  // Flash notification timeouts
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  const handleToggleEnable = (wallet) => {
    const nextState = !wallet.enabled;
    setWallets((prev) =>
      prev.map((w) => (w.id === wallet.id ? { ...w, enabled: nextState } : w))
    );
    setSuccessMsg(
      `Wallet "${wallet.walletName}" is now ${nextState ? 'Enabled' : 'Disabled'}.`
    );
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete payment wallet "${name}"?`)) {
      setWallets((prev) => prev.filter((w) => w.id !== id));
      setSuccessMsg('Payment wallet removed successfully.');
    }
  };

  const handleOpenCreate = () => {
    setEditingWallet(null);
    setFormName('');
    setFormDescription('');
    setFormPaymentType('Crypto (TRC20)');
    setFormAddress('');
    setFormQrCodeUrl('');
    setFormTransactionTime('1 - 5 mins');
    setFormWithdrawFees('Zero fee');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w) => {
    setEditingWallet(w);
    setFormName(w.walletName);
    setFormDescription(w.description || '');
    setFormPaymentType(w.paymentType || 'Crypto (TRC20)');
    setFormAddress(w.address || '');
    setFormQrCodeUrl(w.qrCodeUrl || '');
    setFormTransactionTime(w.transactionTime || '');
    setFormWithdrawFees(w.withdrawFees || '');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      setErrorMsg('Please enter wallet name and address/details.');
      return;
    }

    if (editingWallet) {
      setWallets((prev) =>
        prev.map((w) =>
          w.id === editingWallet.id
            ? {
                ...w,
                walletName: formName.trim(),
                description: formDescription.trim(),
                paymentType: formPaymentType.trim(),
                address: formAddress.trim(),
                qrCodeUrl: formQrCodeUrl.trim(),
                transactionTime: formTransactionTime.trim(),
                withdrawFees: formWithdrawFees.trim(),
              }
            : w
        )
      );
      setSuccessMsg(`Wallet "${formName.trim()}" updated successfully.`);
    } else {
      const randomHex = Math.random().toString(16).substring(2, 10);
      const newWallet = {
        id: randomHex,
        walletName: formName.trim(),
        description: formDescription.trim(),
        paymentType: formPaymentType.trim(),
        address: formAddress.trim(),
        qrCodeUrl: formQrCodeUrl.trim(),
        transactionTime: formTransactionTime.trim() || '10 - 30 mins',
        withdrawFees: formWithdrawFees.trim() || 'Zero fee',
        enabled: true,
      };
      setWallets((prev) => [newWallet, ...prev]);
      setSuccessMsg(`New wallet "${formName.trim()}" added to ledger.`);
    }

    setIsModalOpen(false);
    setEditingWallet(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Wallet Name',
      'Description',
      'Address',
      'Transaction Time',
      'Withdraw Fees',
      'Status',
    ];
    const rows = filteredWallets.map((w) => [
      w.id,
      w.walletName,
      w.description,
      w.address,
      w.transactionTime,
      w.withdrawFees,
      w.enabled ? 'Active' : 'Inactive',
    ]);

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute(
      'download',
      `payment_wallet_ledger_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter wallets
  const filteredWallets = wallets.filter((w) => {
    const q = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      (w.walletName && w.walletName.toLowerCase().includes(q)) ||
      (w.description && w.description.toLowerCase().includes(q)) ||
      (w.address && w.address.toLowerCase().includes(q)) ||
      (w.id && w.id.toLowerCase().includes(q))
    );
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredWallets.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedWallets = filteredWallets.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Top Header Card matching reference */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none">
            <Link to="/admin/demo" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Payment Wallets Ledger</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Payment Wallets
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Ledger
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Manage treasury wallets, payout settings, fees, and settlement configurations
              </div>
            </div>

            {/* Top action buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                  style={{ backgroundColor: 'rgb(234, 88, 12)' }}
                >
                  <Plus size={14} />
                  <span>Add New Wallet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div role="alert" className="flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl shadow-xs">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div role="status" className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search wallets, addresses..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-white text-slate-800"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="admin-table-box bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>WALLET NAME</th>
                  <th>DESCRIPTION</th>
                  <th>QR CODE</th>
                  <th>ADDRESS</th>
                  <th>TRANSACTION TIME</th>
                  <th>WITHDRAW FEES</th>
                  <th>ENABLE/DISABLE</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWallets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 text-xs italic">
                      No payment wallets match the search filter.
                    </td>
                  </tr>
                ) : (
                  paginatedWallets.map((w, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={w.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap" data-label="ID">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                            {w.id}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap" data-label="WALLET NAME">
                          {w.walletName}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px] max-w-[220px]" data-label="DESCRIPTION">
                          <p className="line-clamp-2" title={w.description}>
                            {w.description || '—'}
                          </p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs" data-label="QR CODE">
                          {w.qrCodeUrl ? (
                            <a
                              href={w.qrCodeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold underline text-xs"
                            >
                              <span>View QR</span>
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">No QR configured</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-mono text-xs max-w-[200px]" data-label="ADDRESS">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate block select-all" title={w.address}>
                              {w.address}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(w.id, w.address)}
                              className="text-slate-400 hover:text-slate-600 p-0.5 shrink-0 cursor-pointer"
                              title="Copy address"
                            >
                              {copiedId === w.id ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs whitespace-nowrap" data-label="TRANSACTION TIME">
                          {w.transactionTime || '—'}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-slate-900 whitespace-nowrap" data-label="WITHDRAW FEES">
                          {w.withdrawFees || '—'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap" data-label="ENABLE/DISABLE">
                          <button
                            type="button"
                            onClick={() => handleToggleEnable(w)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              w.enabled
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                            title={w.enabled ? 'Disable Wallet' : 'Enable Wallet'}
                            aria-label={w.enabled ? 'Disable Wallet' : 'Enable Wallet'}
                          >
                            {w.enabled ? <Power size={14} /> : <PowerOff size={14} />}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap" data-label="ACTIONS" style={{ textAlign: 'right' }}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(w)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Wallet Configuration"
                              aria-label="Edit Wallet Configuration"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(w.id, w.walletName)}
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Wallet"
                              aria-label="Delete Wallet"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Pager matching standard footer */}
        <div className="table-pager">
          <span className="table-pager-info">
            Showing <strong>{filteredWallets.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong>{Math.min(startIndex + rowsPerPage, filteredWallets.length)}</strong> of{' '}
            <strong>{filteredWallets.length}</strong> entries
          </span>
          <div className="table-pager-controls">
            <label className="table-pager-size">
              <span>Rows</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Rows per page"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            <nav className="table-pager-pages" aria-label="Pages">
              <button
                type="button"
                className="table-pager-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={13} /> <span>Prev</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  className={`table-pager-btn table-pager-num ${currentPage === pg ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pg)}
                  aria-current={currentPage === pg ? 'page' : undefined}
                >
                  {pg}
                </button>
              ))}
              <button
                type="button"
                className="table-pager-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <span>Next</span> <ChevronRight size={13} />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal matching reference */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '500px',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                {editingWallet ? 'Edit Payment Wallet' : 'Create New Payment Wallet'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Wallet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. USDT TRC20 Main Vault"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Primary deposit channel description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Payment Type *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crypto (TRC20) or Bank Wire"
                  value={formPaymentType}
                  onChange={(e) => setFormPaymentType(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Address / Bank Details *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Crypto wallet address or Bank account details..."
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  QR Image URL (optional)
                </label>
                <input
                  type="text"
                  placeholder="/images/... or https://..."
                  value={formQrCodeUrl}
                  onChange={(e) => setFormQrCodeUrl(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                    Transaction Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 - 30 mins"
                    value={formTransactionTime}
                    onChange={(e) => setFormTransactionTime(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.375rem',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                    Withdraw Fees
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zero fee"
                    value={formWithdrawFees}
                    onChange={(e) => setFormWithdrawFees(e.target.value)}
                    style={{
                      width: '100%',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.375rem',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    backgroundColor: 'rgb(234, 88, 12)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {editingWallet ? 'Save Changes' : 'Create Wallet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
