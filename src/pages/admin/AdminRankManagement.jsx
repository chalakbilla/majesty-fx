import { useState } from 'react';
import {
  Award,
  Check,
  ChevronDown,
  Download,
  Flame,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  Users,
} from 'lucide-react';
import { ibPartners, rankTiers } from '../../data/adminData.js';

export default function AdminRankManagement() {
  const [partners, setPartners] = useState(ibPartners);
  const [tiers, setTiers] = useState(rankTiers);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [evaluateSuccess, setEvaluateSuccess] = useState(false);

  const handleAssignRank = (partnerId, newRank) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === partnerId) {
          return {
            ...p,
            currentRank: `${newRank.charAt(0).toUpperCase() + newRank.slice(1)} Partner`,
          };
        }
        return p;
      })
    );
  };

  const handleEvaluate = () => {
    setEvaluateSuccess(true);
    setTimeout(() => {
      setEvaluateSuccess(false);
    }, 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filtered = partners.filter((p) => {
    if (tierFilter !== 'ALL' && !p.currentRank?.toLowerCase().includes(tierFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
              <span className="text-slate-900 font-extrabold">IB Rank</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Configure partner volume thresholds, rebate multipliers, and oversee partner tiers
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleEvaluate}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluate Partners</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {evaluateSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Partner monthly performance evaluated! Tier ranks and rebate rates recalculated.</span>
        </div>
      )}

      {/* 5 Tier Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">{tier.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                  {tier.ibCount} IBs
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{tier.desc}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Min Vol:</span>
                <span className="font-bold text-slate-800">{tier.minVolume}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Rebate:</span>
                <span className="font-bold text-emerald-600">{tier.forexRebate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Ranking Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-600" />
            <h2 className="font-sora font-extrabold text-sm text-slate-900">
              Active Partner Rankings ({filtered.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner or code..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none w-44 sm:w-56"
              />
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer"
            >
              <option value="ALL">All Tiers</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
              <option value="Diamond">Diamond</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-4">PARTNER</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">REFERRAL CODE</th>
                <th className="py-3 px-4">CURRENT RANK</th>
                <th className="py-3 px-4">REBATE RATE</th>
                <th className="py-3 px-4">ACTIVE CLIENTS</th>
                <th className="py-3 px-4">VOLUME (LOTS)</th>
                <th className="py-3 px-4 text-right">ASSIGN RANK / ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 font-mono text-slate-400">{i + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{p.email}</td>
                  <td className="py-3 px-4 font-mono font-bold text-purple-700">{p.code}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {p.currentRank || 'Gold Partner'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-600">{p.rebateRate || '$10.00 / Lot'}</td>
                  <td className="py-3 px-4">{p.clientsCount} clients</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.volume}</td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={p.currentRank?.toLowerCase().split(' ')[0] || 'gold'}
                      onChange={(e) => handleAssignRank(p.id, e.target.value)}
                      className="px-2 py-1 rounded border border-slate-200 text-xs bg-white outline-none cursor-pointer font-medium"
                    >
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                      <option value="diamond">Diamond</option>
                      <option value="vip">VIP</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
