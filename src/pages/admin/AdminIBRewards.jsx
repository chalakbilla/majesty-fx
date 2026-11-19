import { useState } from 'react';
import {
  Award,
  Download,
  Gift,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Settings,
} from 'lucide-react';

export default function AdminIBRewards() {
  const [activeTab, setActiveTab] = useState('ledger');
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filtered = records.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.recordId.toLowerCase().includes(q) ||
      r.userEmail.toLowerCase().includes(q) ||
      r.tradeId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-slate-900">IB</span>{' '}
            <span className="text-orange-600">Rewards</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure partner lot reward milestones, bonus rules, and monitor real-time distribution
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs matching screenshot media_1795073441511_1568b2d0.jpg */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-[#ea580c] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Reward Payouts Ledger</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#ea580c] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Reward Program Settings & Tiers</span>
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <>
          {/* 3 Stat Cards matching screenshot media_1795073441511_1568b2d0.jpg */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Total Records */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">0</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Total Records</div>
                <div className="text-[11px] text-slate-400">Volume Bonus Entries</div>
              </div>
            </div>

            {/* Total Lots Done */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">0.00</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Total Lots Done</div>
                <div className="text-[11px] text-slate-400">Processed Trading Volume</div>
              </div>
            </div>

            {/* Total Rewards */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">$0.00</div>
                <div className="text-xs font-bold text-slate-700 mt-1">Total Rewards</div>
                <div className="text-[11px] text-slate-400">Disbursed Partner Bonuses</div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email, partner, or trade ID..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div className="text-xs text-slate-500">
                Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
                <strong className="text-slate-800">{records.length}</strong> bonus records
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">RECORD ID</th>
                    <th className="py-3 px-4">USER EMAIL</th>
                    <th className="py-3 px-4">TRADE ID</th>
                    <th className="py-3 px-4">LOTS DONE</th>
                    <th className="py-3 px-4">REWARD AMOUNT</th>
                    <th className="py-3 px-4">CREATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                        No IB reward records available.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr key={r.id}>
                        <td className="py-3 px-4">{i + 1}</td>
                        <td className="py-3 px-4 font-mono font-bold">{r.recordId}</td>
                        <td className="py-3 px-4 font-mono">{r.userEmail}</td>
                        <td className="py-3 px-4 font-mono">{r.tradeId}</td>
                        <td className="py-3 px-4">{r.lotsDone}</td>
                        <td className="py-3 px-4 font-bold text-emerald-600">{r.rewardAmount}</td>
                        <td className="py-3 px-4 font-mono text-[11px]">{r.createdAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Settings Tab */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-sora font-extrabold text-base text-slate-900">
            Milestone Bonus Thresholds
          </h2>
          <p className="text-xs text-slate-500">
            Configure volume milestones that automatically credit bonuses into the IB partner balance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="font-bold text-xs text-slate-800">Milestone 1: 50 Lots</div>
              <div className="text-xl font-black text-orange-600">$250 Bonus</div>
              <p className="text-[11px] text-slate-500">Awarded on completing 50 closed retail lots.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="font-bold text-xs text-slate-800">Milestone 2: 150 Lots</div>
              <div className="text-xl font-black text-orange-600">$1,000 Bonus</div>
              <p className="text-[11px] text-slate-500">Awarded on completing 150 closed retail lots.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="font-bold text-xs text-slate-800">Milestone 3: 500 Lots</div>
              <div className="text-xl font-black text-orange-600">$5,000 Bonus</div>
              <p className="text-[11px] text-slate-500">Executive partner milestone incentive payout.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
