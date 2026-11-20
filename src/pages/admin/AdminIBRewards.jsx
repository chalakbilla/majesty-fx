import { useState, useMemo, useCallback, useEffect } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Download,
  Gift,
  Layers,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react';

const REWARDS_STORAGE_KEY = 'majesty_admin_ib_rewards';
const TIERS_STORAGE_KEY = 'majesty_admin_ib_reward_tiers';

// seed data lives in src/data/json (defaultTiers)

// seed data lives in src/data/json (initialRewardRecords)

export default function AdminIBRewards() {
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'settings'

  const { items: records, setItems: setRecords } = useCollection('ibRewards');

  const { items: tiers, setItems: setTiers } = useCollection('ibRewardTiers');

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);



  // Fetch live rewards data if API is available
    const loadRewards = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => setIsLoading(false), 350);
  }, []);

  const loadTiers = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  }, []);

  const handleRefresh = () => {
    if (activeTab === 'history') {
      loadRewards();
    } else {
      loadTiers();
    }
  };

  // Tier edits are written to the store as you type; "Save" confirms to the admin.
  const handleSaveSettings = () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setTimeout(() => {
      setSuccessMessage('Reward program milestone settings saved & published successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsSaving(false);
    }, 300);
  };

  const handleTierChange = (index, field, value) => {
    setTiers((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddTier = () => {
    const nextTierNum = tiers.length + 1;
    const lastTier = tiers[tiers.length - 1];
    setTiers([
      ...tiers,
      {
        tier: nextTierNum,
        lotsRequired: lastTier ? lastTier.lotsRequired + 3000 : 500,
        rewardAmount: lastTier ? lastTier.rewardAmount + 1000 : 250,
        active: true,
      },
    ]);
  };

  const handleDeleteTier = (index) => {
    setTiers((prev) =>
      prev.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, tier: idx + 1 }))
    );
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        r.userEmail.toLowerCase().includes(q) ||
        r.tradeId.toLowerCase().includes(q) ||
        (r.partnerName && r.partnerName.toLowerCase().includes(q))
    );
  }, [records, searchQuery]);

  // Statistics
  const totalRecords = records.length;
  const totalLotsDone = useMemo(() => {
    return records.reduce((sum, r) => sum + (r.numericLots || 0), 0);
  }, [records]);
  const totalRewards = useMemo(() => {
    return records.reduce((sum, r) => sum + (r.numericAmount || 0), 0);
  }, [records]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      alert('No rewards records available to export.');
      return;
    }
    const headers = [
      '#',
      'Record ID',
      'User Email',
      'Partner Name',
      'Trade ID',
      'Lots Done',
      'Reward Amount (USD)',
      'Created At',
    ];
    const rows = filteredRecords.map((r, idx) => [
      idx + 1,
      r.rawId,
      r.userEmail,
      `"${(r.partnerName || '-').replace(/"/g, '""')}"`,
      r.tradeId,
      r.lotsDone,
      r.rewardAmount,
      r.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ib_rewards_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    IB
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Rewards
                  </span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">
                  Milestone Program
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Configure partner lot reward milestones, bonus rules, and monitor real-time distribution
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                {activeTab === 'history' ? (
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    disabled={filteredRecords.length === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Download size={14} className="text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white btn-orange rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving...' : 'Save Tier Settings'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  title="Refresh page data"
                >
                  <RefreshCw size={13} className={isLoading ? 'animate-spin text-orange-600' : 'text-slate-600'} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gift size={14} />
          <span>Reward Payouts Ledger</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings size={14} />
          <span>Reward Program Settings & Tiers</span>
        </button>
      </div>

      {/* Alert Notices */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-emerald-800 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center justify-between text-rose-800 text-xs font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* TAB 1: Reward Payouts Ledger */}
      {activeTab === 'history' && (
        <>
          {/* 3 KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 w-full">
            {/* Total Records */}
            <div className="admin-kpi-card" title="Total Records">
              <div
                className="admin-kpi-icon-squircle text-white"
                style={{
                  background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                  boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
                }}
              >
                <Award size={18} strokeWidth={2} />
              </div>
              <div className="admin-kpi-content">
                <div className="admin-kpi-value" title={String(totalRecords)}>
                  {totalRecords}
                </div>
                <div className="admin-kpi-title">Total Records</div>
                <div className="admin-kpi-sub">
                  <span className="truncate">Volume Bonus Entries</span>
                </div>
              </div>
            </div>

            {/* Total Lots Done */}
            <div className="admin-kpi-card" title="Total Lots Done">
              <div
                className="admin-kpi-icon-squircle text-white"
                style={{
                  background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                  boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
                }}
              >
                <Layers size={18} strokeWidth={2} />
              </div>
              <div className="admin-kpi-content">
                <div className="admin-kpi-value" title={totalLotsDone.toFixed(2)}>
                  {totalLotsDone.toFixed(2)}
                </div>
                <div className="admin-kpi-title">Total Lots Done</div>
                <div className="admin-kpi-sub">
                  <span className="truncate">Processed Trading Volume</span>
                </div>
              </div>
            </div>

            {/* Total Rewards */}
            <div className="admin-kpi-card" title="Total Rewards">
              <div
                className="admin-kpi-icon-squircle text-white"
                style={{
                  background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                  boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
                }}
              >
                <Gift size={18} strokeWidth={2} />
              </div>
              <div className="admin-kpi-content">
                <div
                  className="admin-kpi-value"
                  title={totalRewards.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                >
                  {totalRewards.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                <div className="admin-kpi-title">Total Rewards</div>
                <div className="admin-kpi-sub">
                  <span className="truncate">Disbursed Partner Bonuses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email, partner, or trade ID..."
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-orange-500 text-slate-800"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> bonus records
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="data-table data-table--plain">
              <div className="data-table-scroll">
                <table className="data-table-grid" data-cards="">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>RECORD ID</th>
                      <th>USER EMAIL</th>
                      <th>TRADE ID</th>
                      <th>LOTS DONE</th>
                      <th>REWARD AMOUNT</th>
                      <th>CREATED AT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="data-table-empty">
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                            No IB reward records available
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                            There are currently no volume reward payouts matching this search.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((item, index) => (
                        <tr
                          key={item.rawId || item.id}
                          className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                          }`}
                        >
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{index + 1}</td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-900">{item.rawId}</td>
                          <td className="py-3 px-3 text-blue-600 font-medium">
                            <div>{item.userEmail}</div>
                            {item.partnerName && (
                              <div className="text-[11px] text-slate-500 font-normal">{item.partnerName}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">{item.tradeId}</td>
                          <td className="py-3 px-3 font-bold text-emerald-600">{item.lotsDone}</td>
                          <td className="py-3 px-3 font-bold text-orange-600">{item.rewardAmount}</td>
                          <td className="py-3 px-3 text-slate-500">{item.createdAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Reward Program Settings & Tiers */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lots Reward Program Milestone Rules</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure the cumulative trading lot thresholds and corresponding USD cash prizes awarded to partners.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddTier}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Milestone Tier</span>
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 btn-orange text-white text-xs font-semibold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3 w-16">Tier #</th>
                  <th className="py-2.5 px-3">Milestone Volume (Lots Required)</th>
                  <th className="py-2.5 px-3">Reward Amount (USD Cash Prize)</th>
                  <th className="py-2.5 px-3 w-28">Status</th>
                  <th className="py-2.5 px-3 text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((t, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Tier {t.tier}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 max-w-xs">
                        <input
                          type="number"
                          min={1}
                          value={t.lotsRequired}
                          onChange={(e) => handleTierChange(idx, 'lotsRequired', Number(e.target.value))}
                          className="border border-slate-300 rounded px-2.5 py-1 text-xs outline-none focus:border-orange-500 font-semibold text-slate-800 w-32"
                        />
                        <span className="text-slate-400 font-medium">lots</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5 max-w-xs">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          min={0}
                          value={t.rewardAmount}
                          onChange={(e) => handleTierChange(idx, 'rewardAmount', Number(e.target.value))}
                          className="border border-slate-300 rounded px-2.5 py-1 text-xs outline-none focus:border-orange-500 font-bold text-emerald-600 w-32"
                        />
                        <span className="text-slate-400 font-medium">USD</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={t.active}
                          onChange={(e) => handleTierChange(idx, 'active', e.target.checked)}
                          className="rounded text-orange-600 focus:ring-orange-500"
                        />
                        <span className={`text-[11px] font-semibold ${t.active ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {t.active ? 'Active' : 'Disabled'}
                        </span>
                      </label>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteTier(idx)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Delete tier"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-slate-400 flex-wrap gap-3">
            <span>Partners can track progress toward these tiers directly in their Partner Dashboard &gt; Lots Reward page.</span>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 btn-orange text-white font-semibold rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{isSaving ? 'Saving...' : 'Save & Publish Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          color: '#64748b',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>Majesty IB Portal v2.0 • Rewards & Milestone Distribution Desk</span>
        <span>Real-time lot volume reconciliation active</span>
      </footer>
    </div>
  );
}
