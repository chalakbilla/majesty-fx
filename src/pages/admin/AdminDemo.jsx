import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { initialPendingDeposits, initialPendingWithdrawals } from '../../data/adminData.js';

export default function AdminDemo() {
  const [activeTab, setActiveTab] = useState('all');
  const [deposits, setDeposits] = useState(initialPendingDeposits);
  const [withdrawals, setWithdrawals] = useState(initialPendingWithdrawals);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleApproveDeposit = (id) => {
    setDeposits((prev) => prev.filter((d) => d.id !== id));
    setStatusMessage('Deposit approved successfully. Funds credited to MT5 account.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRejectDeposit = (id) => {
    setDeposits((prev) => prev.filter((d) => d.id !== id));
    setStatusMessage('Deposit request rejected.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleApproveWithdrawal = (id) => {
    setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    setStatusMessage('Withdrawal approved. Treasury queue authorized.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRejectWithdrawal = (id) => {
    setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    setStatusMessage('Withdrawal request rejected.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-montserrat">
      {/* Top Banner Card */}
      <div className="relative bg-gradient-to-r from-white via-white to-purple-50/30 rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs overflow-hidden">
        <div className="flex flex-col gap-3">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="text-slate-500">Admin Console</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-800 font-semibold">Demo Sandbox</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-sora text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
                  Demo Sandbox Desk
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  MajestyFX-Trade
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Operational
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Unified simulation console for demo MT5 operations, test deposit queues, and commission allocations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDeposits(initialPendingDeposits);
                  setWithdrawals(initialPendingWithdrawals);
                  setStatusMessage('Data refreshed.');
                  setTimeout(() => setStatusMessage(null), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo State</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Desk Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit overflow-x-auto">
        {[
          { id: 'all', label: 'All Desks' },
          { id: 'referral', label: 'Referral Desk' },
          { id: 'ib1', label: 'IB1 Desk' },
          { id: 'ib2', label: 'IB2 Desk' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 KPI / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Pending Deposits
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">
            ${deposits.reduce((acc, d) => acc + parseFloat(d.amount.replace(/[^0-9.]/g, '')), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">{deposits.length} queued requests</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Pending Withdrawals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">
            ${withdrawals.reduce((acc, w) => acc + parseFloat(w.amount.replace(/[^0-9.]/g, '')), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 mt-1">{withdrawals.length} awaiting treasury authorization</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Active Trading Volume
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">767.50 Lots</div>
          <div className="text-xs text-slate-500 mt-1">Across 35 demo clients</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sora">
              Total Commission Payout
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="font-sora text-2xl font-extrabold text-slate-900">$7,675.00</div>
          <div className="text-xs text-slate-500 mt-1">Distributed to 3 master partners</div>
        </div>
      </div>

      {/* Pending Deposits Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-sora text-base sm:text-lg font-bold text-slate-900">
              Pending Deposits ({deposits.length})
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Treasury Queue
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider font-sora">
                <th className="py-3 px-4">Clients</th>
                <th className="py-3 px-4">Server</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">TX ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Proof</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No pending deposits queued.
                  </td>
                </tr>
              ) : (
                deposits.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.client}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">{item.server}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600 font-mono text-sm">{item.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                        {item.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.txId}</td>
                    <td className="py-3 px-4 text-slate-500">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{item.proof}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApproveDeposit(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectDeposit(item.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-[11px] rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Withdrawals Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-sora text-base sm:text-lg font-bold text-slate-900">
              Pending Withdrawals ({withdrawals.length})
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Disbursement Authorization
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider font-sora">
                <th className="py-3 px-4">Clients</th>
                <th className="py-3 px-4">Server</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Pay To</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No pending withdrawals queued.
                  </td>
                </tr>
              ) : (
                withdrawals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.client}</div>
                      <div className="text-[11px] text-slate-500">{item.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">{item.server}</td>
                    <td className="py-3 px-4 font-bold text-red-600 font-mono text-sm">{item.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                        {item.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.payTo}</td>
                    <td className="py-3 px-4 text-slate-400">{item.comment}</td>
                    <td className="py-3 px-4 text-slate-500">{item.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApproveWithdrawal(item.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectWithdrawal(item.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-[11px] rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
