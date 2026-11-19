import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  User,
  Mail,
  Clock,
  ArrowRight,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_withdraw_history';

const DEFAULT_WITHDRAWALS = [
  {
    id: '1',
    txId: 'TX-90123',
    account: '800101',
    clientName: 'Marcus Chen',
    clientEmail: 'marcus.chen@demo.example.com',
    method: 'Bank Wire Transfer',
    amount: '$1,200.00',
    amountValue: 1200.0,
    fee: '$15.00',
    status: 'Pending',
    date: '11/18/2026, 02:45 PM',
    destination: 'Chase Bank NA •••• 4819 (SWIFT: CHASUS33)',
    notes: 'Client request via Web Trader',
  },
  {
    id: '2',
    txId: 'TX-90119',
    account: '800103',
    clientName: 'David Miller',
    clientEmail: 'david.m@demo.example.com',
    method: 'Crypto BTC',
    amount: '$800.00',
    amountValue: 800.0,
    fee: '$8.00',
    status: 'Rejected',
    date: '11/16/2026, 05:22 PM',
    destination: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    notes: 'Address mismatch with verified profile wallet',
  },
  {
    id: '3',
    txId: 'TX-90115',
    account: '800106',
    clientName: 'Demo Trader',
    clientEmail: 'democlient@majestyfx.com',
    method: 'USDT TRC20',
    amount: '$2,500.00',
    amountValue: 2500.0,
    fee: '$5.00',
    status: 'Approved',
    date: '11/15/2026, 11:30 AM',
    destination: 'TRX7xK9921bF43aD90cE124567890abcdef12345678',
    notes: 'Settled via automated gateway batch #4910',
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

export default function AdminWithdrawHistory() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Load from local storage or defaults
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWithdrawals(JSON.parse(saved));
      } else {
        setWithdrawals(DEFAULT_WITHDRAWALS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_WITHDRAWALS));
      }
    } catch {
      setWithdrawals(DEFAULT_WITHDRAWALS);
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setWithdrawals(JSON.parse(saved));
        } else {
          setWithdrawals(DEFAULT_WITHDRAWALS);
        }
      } catch {
        setWithdrawals(DEFAULT_WITHDRAWALS);
      }
      setIsRefreshing(false);
    }, 400);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = withdrawals.map((w) =>
      w.id === id ? { ...w, status: newStatus } : w
    );
    setWithdrawals(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord({ ...selectedRecord, status: newStatus });
    }
  };

  const filteredRecords = useMemo(() => {
    return withdrawals.filter((item) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.txId.toLowerCase().includes(query) ||
        item.account.toLowerCase().includes(query) ||
        item.clientName.toLowerCase().includes(query) ||
        item.clientEmail.toLowerCase().includes(query) ||
        item.method.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    const rows = filteredRecords.map((item) => [
      item.txId,
      item.account,
      item.clientName,
      item.clientEmail,
      item.method,
      item.amount,
      item.fee,
      item.status,
      item.date,
    ]);
    exportToCSV(`Withdrawals_${new Date().toISOString().slice(0, 10)}`, [
      'TX ID',
      'Account',
      'Client Name',
      'Client Email',
      'Method',
      'Amount',
      'Fee',
      'Status',
      'Date',
    ], rows);
  };

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
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-500">Transactions &amp; Money</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Withdrawals</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">Withdrawals</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight"></span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">Real-Time Audit</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Cryptographic transaction audit trail, compliance verification status, and client ledger settlements.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
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

      {/* 2. Filter Bar matching reference */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by TX ID, Account, Client, Method..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
          Showing <span className="text-slate-900 font-bold">{filteredRecords.length}</span> records
        </div>
      </div>

      {/* 3. Table matching reference */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">TX ID</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Fee</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No withdrawal records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    title="Click to view details"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">
                      {item.txId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {item.account}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.clientName}</div>
                      <div className="text-[11px] text-slate-500">{item.clientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {item.method}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {item.amount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {item.fee}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status.toLowerCase() === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>Pending</span>
                        </span>
                      )}
                      {item.status.toLowerCase() === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span>Rejected</span>
                        </span>
                      )}
                      {item.status.toLowerCase() === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Approved</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {item.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Action Modal */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px 16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                  Withdrawal Details
                </h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  {selectedRecord.txId} • MT5 #{selectedRecord.account}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.4rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-semibold mb-1">Client</div>
                  <div className="font-bold text-slate-900">{selectedRecord.clientName}</div>
                  <div className="text-slate-500 text-[11px] truncate">{selectedRecord.clientEmail}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-400 font-semibold mb-1">Status</div>
                  <div>
                    {selectedRecord.status.toLowerCase() === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>Pending</span>
                      </span>
                    )}
                    {selectedRecord.status.toLowerCase() === 'rejected' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-rose-50 text-rose-700 border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Rejected</span>
                      </span>
                    )}
                    {selectedRecord.status.toLowerCase() === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Approved</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Requested Amount:</span>
                  <span className="font-black text-slate-900 text-sm">{selectedRecord.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Processing Fee:</span>
                  <span className="font-mono text-slate-700">{selectedRecord.fee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-600">{selectedRecord.date}</span>
                </div>
                {selectedRecord.destination && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block mb-1">Destination Address / Bank:</span>
                    <span className="font-mono text-[11px] text-slate-800 break-all select-all block bg-white p-2 rounded border border-slate-200">
                      {selectedRecord.destination}
                    </span>
                  </div>
                )}
                {selectedRecord.notes && (
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-0.5">Notes:</span>
                    <span className="text-[11px] text-slate-600">{selectedRecord.notes}</span>
                  </div>
                )}
              </div>

              {selectedRecord.status.toLowerCase() === 'pending' && (
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'Rejected')}
                    className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Reject Withdrawal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRecord.id, 'Approved')}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-sm"
                  >
                    Approve Withdrawal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
