import { useState } from 'react';
import {
  Check,
  DollarSign,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { initialCommissionTiers } from '../../data/adminData.js';

export default function AdminIBCommissionsSettings() {
  const [tiers, setTiers] = useState(initialCommissionTiers);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleInputChange = (id, field, value) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAddTier = () => {
    const newLevelNum = tiers.length + 1;
    const newTier = {
      id: `tier_${Date.now()}`,
      level: `Level ${newLevelNum} (Sub-Tier ${newLevelNum - 1})`,
      forex: '2.00',
      metals: '3.00',
      indices: '1.50',
      crypto: '2.50',
      isBase: false,
    };
    setTiers((prev) => [...prev, newTier]);
  };

  const handleDeleteTier = (id) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetDefaults = () => {
    setTiers(initialCommissionTiers);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

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
              <span className="text-slate-900 font-extrabold">IB Commissions</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Configure multi-tier commission payout rates per asset class for your global IB network
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Commission payout tiers updated and synced across MT5 ledger successfully!</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-sora font-extrabold text-sm sm:text-base text-slate-900">
            Multi-Tier Payout Matrix
          </h2>
          <button
            type="button"
            onClick={handleAddTier}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tier Level</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">IB LEVEL</th>
                <th className="py-3 px-4">FOREX ($/LOT)</th>
                <th className="py-3 px-4">METALS ($/LOT)</th>
                <th className="py-3 px-4">INDICES ($/LOT)</th>
                <th className="py-3 px-4">CRYPTO ($/LOT)</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <input
                      type="text"
                      value={tier.level}
                      onChange={(e) => handleInputChange(tier.id, 'level', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 text-xs w-48 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.5"
                        value={tier.forex}
                        onChange={(e) => handleInputChange(tier.id, 'forex', e.target.value)}
                        className="pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-slate-800 text-xs w-full focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.5"
                        value={tier.metals}
                        onChange={(e) => handleInputChange(tier.id, 'metals', e.target.value)}
                        className="pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-slate-800 text-xs w-full focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.5"
                        value={tier.indices}
                        onChange={(e) => handleInputChange(tier.id, 'indices', e.target.value)}
                        className="pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-slate-800 text-xs w-full focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative w-28">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.5"
                        value={tier.crypto}
                        onChange={(e) => handleInputChange(tier.id, 'crypto', e.target.value)}
                        className="pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono font-bold text-slate-800 text-xs w-full focus:ring-1 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {tier.isBase ? (
                      <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                        Base
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteTier(tier.id)}
                        title="Delete Tier"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
