import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Download,
  Plus,
  Search,
  X,
  ExternalLink,
  Edit2,
  Power,
  PowerOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_payment_methods';

const INITIAL_METHODS = [
  {
    id: 'pm-1',
    desk: 'referral',
    walletName: 'BTC (Bitcoin) - Referral Vault',
    walletBankInfo: 'bc1qu9fuu65ppjp6mea8ev0n5x9v2rv0tzzjtec5y0',
    paymentType: 'Crypto (BTC)',
    status: 'Active',
    qrCodeUrl: '/images/qr_btc_referral_1793380767633.png',
    createdAt: '10/30/2026, 10:49:29 PM',
  },
  {
    id: 'pm-2',
    desk: 'referral',
    walletName: 'USDT (BEP20) - Referral Vault',
    walletBankInfo: '0xb0a5CEbb9341F8dA1C157F5A7434288d8aAC0fC3',
    paymentType: 'Crypto (BEP20)',
    status: 'Inactive',
    qrCodeUrl: '/images/v1_create-qr-code.png',
    createdAt: '10/14/2026, 3:02:58 PM',
  },
  {
    id: 'pm-3',
    desk: 'referral',
    walletName: 'USDT (TRC20) - REFERRAL Hot Wallet',
    walletBankInfo: 'TTSLU7pSt3ry9m2AYYJWJRnXoiRug1stCc',
    paymentType: 'Crypto (TRC20)',
    status: 'Active',
    qrCodeUrl: '/images/qr_usdt_trc20_1791971822496.png',
    createdAt: '10/14/2026, 3:02:57 PM',
  },
];

export default function AdminPaymentMethods() {
  const [methods, setMethods] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_METHODS;
  });

  const [loading, setLoading] = useState(false);
  const [deskScope, setDeskScope] = useState('all'); // 'all', 'referral', 'ib1', 'ib2'
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formDesk, setFormDesk] = useState('referral');
  const [formPaymentType, setFormPaymentType] = useState('Crypto (TRC20)');
  const [formWalletName, setFormWalletName] = useState('');
  const [formWalletAddress, setFormWalletAddress] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formQrCodeUrl, setFormQrCodeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Bank wire form fields
  const [formBeneficiary, setFormBeneficiary] = useState('');
  const [formBank, setFormBank] = useState('');
  const [formIban, setFormIban] = useState('');
  const [formSwift, setFormSwift] = useState('');
  const [formSortCode, setFormSortCode] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formInstructions, setFormInstructions] = useState('');

  const fileInputRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(methods));
    } catch {
      // ignore
    }
  }, [methods]);

  // Flash messages timeout
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

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Payment methods synchronized.');
    }, 450);
  };

  const handleToggleStatus = (item) => {
    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    setMethods((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, status: nextStatus } : m))
    );
    setSuccessMsg(`Status updated to ${nextStatus}.`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently remove this payment method?')) {
      setMethods((prev) => prev.filter((m) => m.id !== id));
      setSuccessMsg('Payment method deleted successfully.');
    }
  };

  const parseBankDetails = (text) => {
    if (!text) return { beneficiary: '', bank: '', iban: '', swift: '', sortCode: '', address: '', instructions: '' };
    try {
      if (text.trim().startsWith('{')) {
        const obj = JSON.parse(text);
        return {
          beneficiary: obj.beneficiaryName || obj.beneficiary || '',
          bank: obj.beneficiaryBank || obj.bank || '',
          iban: obj.iban || '',
          swift: obj.swiftBic || obj.swift || '',
          sortCode: obj.sortCode || '',
          address: obj.bankAddress || obj.address || '',
          instructions: obj.instructions || '',
        };
      }
    } catch {
      // ignore
    }
    const matchLine = (regex) => {
      const m = text.match(regex);
      return m ? m[1].trim() : '';
    };
    return {
      beneficiary: matchLine(/Beneficiary:\s*([^\n\r]+)/i) || matchLine(/Account Name:\s*([^\n\r]+)/i),
      bank: matchLine(/Bank:\s*([^\n\r]+)/i) || matchLine(/Beneficiary Bank:\s*([^\n\r]+)/i),
      iban: matchLine(/IBAN:\s*([^\n\r]+)/i) || matchLine(/Account Number:\s*([^\n\r]+)/i),
      swift: matchLine(/SWIFT\/BIC:\s*([^\n\r]+)/i) || matchLine(/SWIFT:\s*([^\n\r]+)/i),
      sortCode: matchLine(/Sort Code:\s*([^\n\r]+)/i),
      address: matchLine(/Address:\s*([^\n\r]+)/i),
      instructions: matchLine(/Instructions:\s*([^\n\r]+)/i),
    };
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormDesk('referral');
    setFormPaymentType('Crypto (TRC20)');
    setFormWalletName('USDT (TRC20) - Official Vault');
    setFormWalletAddress('TW9LSKcppmDEtvChqM71nigYJEHnTYFAQk');
    setFormStatus('Active');
    setFormQrCodeUrl('');
    setFormBeneficiary('');
    setFormBank('');
    setFormIban('');
    setFormSwift('');
    setFormSortCode('');
    setFormAddress('');
    setFormInstructions('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormDesk(item.desk || 'referral');
    setFormPaymentType(item.paymentType || 'Crypto (TRC20)');
    setFormStatus(item.status || 'Active');
    setFormQrCodeUrl(item.qrCodeUrl || '');

    const isBank =
      (item.paymentType || '').toLowerCase().includes('bank') ||
      (item.paymentType || '').toLowerCase().includes('wire');

    if (isBank) {
      const parsed = parseBankDetails(item.walletBankInfo);
      setFormBeneficiary(parsed.beneficiary);
      setFormBank(parsed.bank || item.walletName);
      setFormIban(parsed.iban);
      setFormSwift(parsed.swift);
      setFormSortCode(parsed.sortCode);
      setFormAddress(parsed.address);
      setFormInstructions(parsed.instructions);
      setFormWalletName(item.walletName);
      setFormWalletAddress(item.walletBankInfo);
    } else {
      setFormWalletName(item.walletName);
      setFormWalletAddress(item.walletBankInfo);
      setFormBeneficiary('');
      setFormBank('');
      setFormIban('');
      setFormSwift('');
      setFormSortCode('');
      setFormAddress('');
      setFormInstructions('');
    }

    setIsModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (result) {
        setFormQrCodeUrl(result);
        setSuccessMsg('QR / Screenshot image attached locally!');
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const isBank =
      formPaymentType.toLowerCase().includes('bank') ||
      formPaymentType.toLowerCase().includes('wire');

    let finalName = formWalletName.trim();
    let finalDetails = formWalletAddress.trim();

    if (isBank) {
      finalDetails = [
        `Beneficiary: ${formBeneficiary.trim()}`,
        `Bank: ${formBank.trim()}`,
        `IBAN: ${formIban.trim()}`,
        `SWIFT/BIC: ${formSwift.trim()}`,
        formSortCode.trim() ? `Sort Code: ${formSortCode.trim()}` : '',
        formAddress.trim() ? `Address: ${formAddress.trim()}` : '',
        formInstructions.trim() ? `Instructions: ${formInstructions.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      if (!finalName || finalName.includes('USDT') || finalName.includes('Crypto')) {
        finalName = `${formBank.trim() || 'Institutional'} Bank Wire`;
      }
    }

    if (!finalName) {
      setErrorMsg('Please specify a method name.');
      return;
    }

    if (!finalDetails) {
      setErrorMsg('Please specify wallet address or bank account details.');
      return;
    }

    const nowStr = new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    if (editingItem) {
      setMethods((prev) =>
        prev.map((m) =>
          m.id === editingItem.id
            ? {
                ...m,
                desk: formDesk,
                walletName: finalName,
                walletBankInfo: finalDetails,
                paymentType: formPaymentType,
                status: formStatus,
                qrCodeUrl: formQrCodeUrl || null,
              }
            : m
        )
      );
      setSuccessMsg('Payment method updated successfully.');
    } else {
      const newMethod = {
        id: `pm-${Date.now()}`,
        desk: formDesk,
        walletName: finalName,
        walletBankInfo: finalDetails,
        paymentType: formPaymentType,
        status: formStatus,
        qrCodeUrl: formQrCodeUrl || null,
        createdAt: nowStr,
      };
      setMethods((prev) => [newMethod, ...prev]);
      setSuccessMsg('Payment method created successfully.');
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Desk',
      'Wallet / Gateway Name',
      'Details / Address',
      'Payment Type',
      'Status',
      'QR / Screenshot',
      'Created At',
    ];
    const rows = filteredMethods.map((m) => [
      m.id,
      m.desk,
      m.walletName,
      m.walletBankInfo,
      m.paymentType,
      m.status,
      m.qrCodeUrl || 'N/A',
      m.createdAt,
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
      `payment_methods_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter methods
  const filteredMethods = methods.filter((m) => {
    const matchesDesk = deskScope === 'all' || m.desk === deskScope;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (m.walletName && m.walletName.toLowerCase().includes(query)) ||
      (m.walletBankInfo && m.walletBankInfo.toLowerCase().includes(query)) ||
      (m.paymentType && m.paymentType.toLowerCase().includes(query)) ||
      (m.desk && m.desk.toLowerCase().includes(query));
    return matchesDesk && matchesSearch;
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredMethods.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMethods = filteredMethods.slice(startIndex, startIndex + rowsPerPage);

  const renderDeskBadge = (desk) => {
    const d = (desk || 'referral').toLowerCase();
    if (d.startsWith('ib') || d === 'ib1' || d === 'ib2') {
      const label = d === 'ib1' ? 'Partner 001 Desk' : d === 'ib2' ? 'Partner 002 Desk' : `${desk.toUpperCase()} Desk`;
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
        Referral Desk
      </span>
    );
  };

  const handleCopyText = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <span className="whitespace-nowrap text-slate-800 font-semibold">Deposit Address Settings</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Deposit Address & Methods
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Settings
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Configure treasury deposit addresses, fiat settlement bank accounts, and crypto wallets across all partner desks
              </div>
            </div>

            {/* Top action buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                  title="Refresh list"
                >
                  <RefreshCw size={14} className={`text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

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
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs cursor-pointer"
                  style={{ backgroundColor: 'rgb(234, 88, 12)' }}
                >
                  <Plus size={14} />
                  <span>Add Deposit Address / Method</span>
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

      {/* Desk Scope Bar & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">Desk Scope:</span>
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setDeskScope('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                deskScope === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Desks ({methods.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setDeskScope('referral');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                deskScope === 'referral'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Referral Desk
            </button>
            <button
              type="button"
              onClick={() => {
                setDeskScope('ib1');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                deskScope === 'ib1'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Partner 001 Desk
            </button>
            <button
              type="button"
              onClick={() => {
                setDeskScope('ib2');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                deskScope === 'ib2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Partner 002 Desk
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search wallet, address, or payment type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-orange-500 bg-white"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Box */}
      <div className="admin-table-box bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>Desk</th>
                  <th>Wallet / Gateway Name</th>
                  <th>Wallet Address / Bank Details</th>
                  <th>Payment Type</th>
                  <th>Status</th>
                  <th>QR / Screenshot</th>
                  <th>Created At</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMethods.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs italic">
                      No payment methods configured for this view.
                    </td>
                  </tr>
                ) : (
                  paginatedMethods.map((m, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <tr
                        key={m.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isEven ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap" data-label="Desk">
                          {renderDeskBadge(m.desk)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900" data-label="Wallet / Gateway Name">
                          {m.walletName}
                        </td>
                        <td
                          className="py-3 px-4 text-slate-700 font-mono max-w-[260px] truncate"
                          title={m.walletBankInfo}
                          data-label="Wallet Address / Bank Details"
                        >
                          {m.walletBankInfo}
                        </td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap" data-label="Payment Type">
                          {m.paymentType}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap" data-label="Status">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(m)}
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                              m.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Click to toggle status"
                          >
                            {m.status}
                          </button>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap" data-label="QR / Screenshot">
                          {m.qrCodeUrl ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewItem(m)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                              >
                                <ExternalLink size={13} className="text-slate-600" />
                                <span>Preview</span>
                              </button>
                              <img
                                src={m.qrCodeUrl}
                                alt="QR thumbnail"
                                className="w-7 h-7 object-cover rounded border border-slate-200 cursor-pointer shadow-2xs hover:scale-110 transition-transform"
                                onClick={() => setPreviewItem(m)}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">No QR / Screenshot</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap" data-label="Created At">
                          {m.createdAt}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap" data-label="Actions">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Edit Payment Method"
                              aria-label="Edit Payment Method"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(m)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                m.status === 'Active'
                                  ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                  : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title={m.status === 'Active' ? 'Deactivate Method' : 'Activate Method'}
                              aria-label={m.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              {m.status === 'Active' ? <PowerOff size={14} /> : <Power size={14} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(m.id)}
                              className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Method"
                              aria-label="Delete Method"
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
            Showing <strong>{filteredMethods.length === 0 ? 0 : startIndex + 1}</strong> to{' '}
            <strong>{Math.min(startIndex + rowsPerPage, filteredMethods.length)}</strong> of{' '}
            <strong>{filteredMethods.length}</strong> entries
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

      {/* Footer Branding matching reference */}
      <footer className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Payment Gateway Isolated Multitenant Engine</span>
        <span>Version 3.1</span>
      </footer>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-xl p-4 sm:p-5 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingItem ? 'Edit Payment Method' : 'Add New Payment Method'}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Configure wallet address, wire details, and QR screenshots for your deposit portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned Desk
                  </label>
                  <select
                    value={formDesk}
                    onChange={(e) => setFormDesk(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white focus:border-orange-500 outline-none"
                  >
                    <option value="referral">Referral Desk</option>
                    <option value="ib1">IB 1 Desk</option>
                    <option value="ib2">IB 2 Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Type
                  </label>
                  <select
                    required
                    value={formPaymentType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormPaymentType(val);
                      if (val.toLowerCase().includes('bank') || val.toLowerCase().includes('wire')) {
                        if (!editingItem || !editingItem.paymentType.toLowerCase().includes('bank')) {
                          setFormWalletName('Majesty FX Segregated Bank Wire');
                        }
                      } else {
                        if (!editingItem || editingItem.paymentType.toLowerCase().includes('bank')) {
                          setFormWalletName(`${val} - Official Vault`);
                          setFormWalletAddress('TW9LSKcppmDEtvChqM71nigYJEHnTYFAQk');
                        }
                      }
                    }}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white focus:border-orange-500 outline-none"
                  >
                    <option value="Crypto (TRC20)">Crypto (USDT TRC20)</option>
                    <option value="Crypto (BEP20)">Crypto (USDT BEP20)</option>
                    <option value="Crypto (ERC20)">Crypto (USDT ERC20)</option>
                    <option value="Crypto (BTC)">Crypto (Bitcoin BTC)</option>
                    <option value="Crypto (ETH)">Crypto (Ethereum ETH)</option>
                    <option value="Bank Wire">Bank Wire Transfer</option>
                    <option value="Local Bank Transfer">Local Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Conditional Bank Wire / Local Bank Transfer Details */}
              {formPaymentType.toLowerCase().includes('bank') || formPaymentType.toLowerCase().includes('wire') ? (
                <div className="space-y-3 bg-blue-50/50 p-3.5 border border-blue-100 rounded-xl">
                  <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5 mb-2">
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building size={13} className="text-blue-700" />
                      Bank Wire Account & Clearing Details
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Segregated Deposit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Account Name / Beneficiary Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Majesty FX Client Segregated Accounts Ltd."
                        value={formBeneficiary}
                        onChange={(e) => setFormBeneficiary(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Beneficiary Bank Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Barclays Institutional Bank London"
                        value={formBank}
                        onChange={(e) => setFormBank(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        IBAN / Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GB29 BARC 2000 0084 2109 42"
                        value={formIban}
                        onChange={(e) => setFormIban(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        SWIFT / BIC Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BARCGB22"
                        value={formSwift}
                        onChange={(e) => setFormSwift(e.target.value.toUpperCase())}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Sort Code / Branch Code (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 20-00-00"
                        value={formSortCode}
                        onChange={(e) => setFormSortCode(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Bank Address (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1 Churchill Place, Canary Wharf, London, UK"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Deposit Memo / Wire Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Same-day clearance upon SWIFT MT103 confirmation. Please include your MT5 login in wire memo."
                      value={formInstructions}
                      onChange={(e) => setFormInstructions(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Wallet / Gateway Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. USDT (TRC20) - Official Vault"
                      value={formWalletName}
                      onChange={(e) => setFormWalletName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 bg-white focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Wallet Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. TW9LSKcppmDEtvChqM71nigYJEHnTYFAQk"
                      value={formWalletAddress}
                      onChange={(e) => setFormWalletAddress(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium text-slate-800 bg-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </>
              )}

              {/* QR / Screenshot Attachment */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    {formPaymentType.toLowerCase().includes('bank') ? 'Bank Deposit Slip / Instructions Graphic (Optional)' : 'QR Code Image (Optional)'}
                  </label>
                  <span className="text-[10px] text-slate-500">PNG, JPG, WEBP (Max 15MB)</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="qr-file-upload"
                  />
                  <label
                    htmlFor="qr-file-upload"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      isUploading
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-orange-600" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={13} className="text-orange-600" />
                        <span>Upload From Computer</span>
                      </>
                    )}
                  </label>

                  {formQrCodeUrl && (
                    <button
                      type="button"
                      onClick={() => setFormQrCodeUrl('')}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {formQrCodeUrl && (
                  <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg">
                    <img
                      src={formQrCodeUrl}
                      alt="Uploaded QR / Slip"
                      className="w-12 h-12 object-contain rounded border border-slate-200 bg-slate-50"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 size={13} />
                        <span>Screenshot attached</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5" title={formQrCodeUrl}>
                        {formQrCodeUrl.startsWith('data:') ? 'Image data loaded' : formQrCodeUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Initial Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white focus:border-orange-500 outline-none"
                >
                  <option value="Active">Active (Clients can deposit immediately)</option>
                  <option value="Inactive">Inactive (Hidden from client deposit portal)</option>
                </select>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                  style={{ backgroundColor: 'rgb(234, 88, 12)' }}
                >
                  <span>{editingItem ? 'Save Changes' : 'Create Payment Method'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code / Screenshot Preview Modal matching reference */}
      {previewItem && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-5 text-center shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {previewItem.walletName}
                </h4>
                <div className="mt-1">{renderDeskBadge(previewItem.desk)}</div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center min-h-[220px]">
              {previewItem.qrCodeUrl ? (
                <img
                  src={previewItem.qrCodeUrl}
                  alt={previewItem.walletName}
                  className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg shadow-xs bg-white p-2 border border-slate-100"
                />
              ) : (
                <div className="text-slate-400 text-xs italic">No QR Code Image Available</div>
              )}
            </div>

            {/* Address display box with copy button */}
            <div className="relative group">
              <p className="text-[11px] font-mono bg-slate-100 p-2 pr-8 rounded-lg text-slate-700 break-all select-all text-left">
                {previewItem.walletBankInfo}
              </p>
              <button
                type="button"
                onClick={() => handleCopyText(previewItem.walletBankInfo)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded bg-slate-200/60 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Copy address"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
              {previewItem.qrCodeUrl && (
                <a
                  href={previewItem.qrCodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  <ExternalLink size={12} />
                  <span>Open Full Image</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors ml-auto cursor-pointer"
                style={{ backgroundColor: 'rgb(234, 88, 12)' }}
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
