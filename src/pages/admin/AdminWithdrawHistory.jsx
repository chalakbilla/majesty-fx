import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Download,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_withdraw_history_v2';

// seed data lives in src/data/json (DEFAULT_WITHDRAWALS)

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
  const { items: withdrawals, update: updateWithdrawal } = useCollection('withdrawals');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // UPDATE: change the status of a withdrawal request (Pending / Approved / Rejected …)
  const handleUpdateStatus = (txId, newStatus) => {
    updateWithdrawal(txId, { status: newStatus });
    if (selectedRecord && selectedRecord.txId === txId) {
      setSelectedRecord({ ...selectedRecord, status: newStatus });
    }
  };

  const filteredRecords = useMemo(() => {
    return withdrawals.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.txId.toLowerCase().includes(q) ||
        item.account.toLowerCase().includes(q) ||
        item.clientName.toLowerCase().includes(q) ||
        item.clientEmail.toLowerCase().includes(q) ||
        item.method.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, search, statusFilter]);

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
      'Client',
      'Email',
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

      {/* 2. Controls & Search Filter Bar matching reference */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by TX ID, Account, Client, Method..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-orange-500 focus:bg-white transition-colors"
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

      {/* 3. Data Table matching reference */}
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
                    key={item.txId}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(item)}
                        className="hover:underline text-blue-600 cursor-pointer text-left font-mono font-bold"
                        title="Click to view withdrawal details"
                      >
                        {item.txId}
                      </button>
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

      {/* 4. Detail Audit Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                  TX
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                    Withdrawal Audit Detail
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedRecord.txId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium">Client</span>
                  <span className="font-bold text-slate-800 block mt-0.5">{selectedRecord.clientName}</span>
                  <span className="text-[11px] text-slate-500 truncate block">{selectedRecord.clientEmail}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium">Account</span>
                  <span className="font-mono font-bold text-slate-800 block mt-0.5">#{selectedRecord.account}</span>
                  <span className="text-[11px] text-slate-500 block">MT5 Live</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-black text-slate-900 text-base">{selectedRecord.amount}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Processing Fee</span>
                  <span className="font-mono text-slate-700">{selectedRecord.fee}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Method</span>
                  <span className="font-medium text-slate-800">{selectedRecord.method}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Status</span>
                  <span>
                    {selectedRecord.status.toLowerCase() === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                    {selectedRecord.status.toLowerCase() === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Rejected
                      </span>
                    )}
                    {selectedRecord.status.toLowerCase() === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Approved
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-500">Timestamp</span>
                  <span className="text-slate-600 text-xs">{selectedRecord.date}</span>
                </div>
              </div>

              {selectedRecord.destination && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium mb-1">Destination Address / Wire Info</span>
                  <span className="font-mono text-[11px] text-slate-800 break-all select-all block bg-white p-2 rounded-lg border border-slate-200">
                    {selectedRecord.destination}
                  </span>
                </div>
              )}

              {selectedRecord.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] text-slate-400 block font-medium mb-1">Compliance Notes</span>
                  <span className="text-xs text-slate-600 block">{selectedRecord.notes}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
              {selectedRecord.status.toLowerCase() === 'pending' ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRecord.txId, 'Rejected')}
                    className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Reject Withdrawal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedRecord.txId, 'Approved')}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Approve Withdrawal
                  </button>
                </div>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
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
    </div>
  );
}
