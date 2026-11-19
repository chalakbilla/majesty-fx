import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from 'lucide-react';

const INITIAL_TIERS = [
  {
    id: 1,
    name: 'Tier 1 - Master Fund Manager',
    type: 'Percentage',
    value: '20.0%',
    minVolume: '$100,000',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Tier 2 - Senior Quantitative Co-Manager',
    type: 'Percentage',
    value: '15.0%',
    minVolume: '$50,000',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tier 3 - Sub-Manager & Introducing Pool',
    type: 'Percentage',
    value: '5.0%',
    minVolume: '$10,000',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Tier 4 - High-Watermark Alpha Bonus',
    type: 'Percentage',
    value: '$1,000',
    minVolume: '$500,000',
    status: 'Active',
  },
];

const STORAGE_KEY = 'majesty_pamm_commission_settings';

export default function AdminPAMMCommissionSettings() {
  const [tiers, setTiers] = useState(INITIAL_TIERS);
  const [payoutFrequency, setPayoutFrequency] = useState('Monthly');
  const [minPayout, setMinPayout] = useState('100');
  const [commissionCap, setCommissionCap] = useState('50,000');
  const [autoPayment, setAutoPayment] = useState(true);
  const [bonusTrigger, setBonusTrigger] = useState('500,000');
  const [bonusAmount, setBonusAmount] = useState('1000');
  const [bonusType, setBonusType] = useState('Fixed');
  const [maxBonus, setMaxBonus] = useState('5,000');

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load settings from storage or API
  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Check localStorage first
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.payoutFrequency) setPayoutFrequency(parsed.payoutFrequency);
        if (parsed.minPayout) setMinPayout(parsed.minPayout);
        if (parsed.commissionCap) setCommissionCap(parsed.commissionCap);
        if (typeof parsed.autoPayment === 'boolean') setAutoPayment(parsed.autoPayment);
        if (parsed.bonusTrigger) setBonusTrigger(parsed.bonusTrigger);
        if (parsed.bonusAmount) setBonusAmount(parsed.bonusAmount);
        if (parsed.bonusType) setBonusType(parsed.bonusType);
        if (parsed.maxBonus) setMaxBonus(parsed.maxBonus);
        if (Array.isArray(parsed.tiers) && parsed.tiers.length > 0) {
          setTiers(parsed.tiers);
        }
      } else {
        // Attempt fetch from API if available
        const res = await fetch('/api/pamm/commission-settings', {
          headers: { 'x-requested-with': 'XMLHttpRequest' },
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

        if (res?.success && res.settings) {
          const s = res.settings;
          setPayoutFrequency(s.payoutFrequency || 'Monthly');
          setMinPayout(s.minPayout || '100');
          setCommissionCap(s.commissionCap || '50,000');
          setAutoPayment(typeof s.autoPayment === 'boolean' ? s.autoPayment : true);
          setBonusTrigger(s.bonusTrigger || '500,000');
          setBonusAmount(s.bonusAmount || '1000');
          setBonusType(s.bonusType || 'Fixed');
          setMaxBonus(s.maxBonus || '5,000');
          if (Array.isArray(s.tiers) && s.tiers.length > 0) {
            setTiers(s.tiers);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load PAMM settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    const payload = {
      payoutFrequency,
      minPayout,
      commissionCap,
      autoPayment,
      bonusTrigger,
      bonusAmount,
      bonusType,
      maxBonus,
      tiers,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      // Also trigger optional server save
      await fetch('/api/pamm/commission-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTier = (id, field, value) => {
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  const addTier = () => {
    const nextId = tiers.length > 0 ? Math.max(...tiers.map((t) => t.id)) + 1 : 1;
    setTiers((prev) => [
      ...prev,
      {
        id: nextId,
        name: `Level ${nextId} - Custom Tier`,
        type: 'Percentage',
        value: '1.0%',
        minVolume: '$25,000',
        status: 'Active',
      },
    ]);
  };

  const deleteTier = (id) => {
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5">
        {/* Top Header Card matching majestyfx.com-admin-pamm-commission-settings */}
        <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          />
          <div className="flex flex-col gap-3.5 sm:gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
              <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                    <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                      PAMM Commission
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Settings
                    </span>
                  </h1>
                  <span className="text-slate-600 font-medium text-xs sm:text-sm">
                    Engine Rules
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Configure commission payout rules, performance tiers, and bonuses saved to Supabase
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={loadSettings}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                      <span>Reload</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${
                        isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : 'btn-orange'
                      }`}
                    >
                      {isSaved ? <CheckCircle2 size={13} /> : <Save size={13} />}
                      <span>{isSaving ? 'Saving...' : isSaved ? 'Saved to Database!' : 'Save Settings'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div
            style={{
              padding: '0.65rem 1rem',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '0.375rem',
              fontSize: '0.825rem',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Section 1: Commission Payout Rules */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
          }}
        >
          <h2 style={{ margin: '0px 0px 1rem', fontSize: '1rem', fontWeight: 700, color: 'rgb(30, 41, 59)' }}>
            Commission Payout Rules
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Payout Frequency
              </label>
              <select
                value={payoutFrequency}
                onChange={(e) => setPayoutFrequency(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  backgroundColor: 'rgb(255, 255, 255)',
                  color: 'rgb(30, 41, 59)',
                }}
              >
                <option value="Weekly">Weekly (Every Monday)</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly (End of Month)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Minimum Payout Threshold ($)
              </label>
              <input
                type="text"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Maximum Commission Cap ($)
              </label>
              <input
                type="text"
                value={commissionCap}
                onChange={(e) => setCommissionCap(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.2rem' }}>
              <input
                type="checkbox"
                id="autoPayment"
                checked={autoPayment}
                onChange={(e) => setAutoPayment(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#ea580c' }}
              />
              <label htmlFor="autoPayment" style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                Enable Automated Payouts
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Multi-Level IB & PAMM Tiers */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '0.5rem',
            border: '1px solid rgb(226, 232, 240)',
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid rgb(226, 232, 240)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgb(248, 250, 252)',
            }}
          >
            <div>
              <h2 style={{ margin: '0px', fontSize: '1rem', fontWeight: 700, color: 'rgb(30, 41, 59)' }}>
                Multi-Level IB &amp; PAMM Tiers
              </h2>
              <p style={{ margin: '0.15rem 0px 0px', fontSize: '0.75rem', color: 'rgb(100, 116, 139)' }}>
                Define rebate percentages and volume qualification requirements per level
              </p>
            </div>
            <button
              type="button"
              onClick={addTier}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-orange text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Level Tier</span>
            </button>
          </div>

          <div className="data-table data-table--plain">
            <div className="data-table-scroll">
              <table className="data-table-grid" data-cards="">
                <thead>
                  <tr>
                    <th>LEVEL / TIER NAME</th>
                    <th>RATE TYPE</th>
                    <th>COMMISSION VALUE</th>
                    <th>MIN VOLUME REQUIREMENT</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((tier) => (
                    <tr key={tier.id} style={{ borderBottom: '1px solid rgb(241, 245, 249)' }}>
                      <td data-label="LEVEL / TIER NAME" style={{ padding: '0.65rem 1rem' }}>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                          style={{
                            border: '1px solid rgb(203, 213, 225)',
                            borderRadius: '0.25rem',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            width: '100%',
                            maxWidth: '240px',
                          }}
                        />
                      </td>
                      <td data-label="RATE TYPE" style={{ padding: '0.65rem 1rem' }}>
                        <select
                          value={tier.type}
                          onChange={(e) => updateTier(tier.id, 'type', e.target.value)}
                          style={{
                            border: '1px solid rgb(203, 213, 225)',
                            borderRadius: '0.25rem',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.825rem',
                            backgroundColor: 'rgb(255, 255, 255)',
                          }}
                        >
                          <option value="Percentage">Percentage</option>
                          <option value="Fixed">Fixed Amount</option>
                        </select>
                      </td>
                      <td data-label="COMMISSION VALUE" style={{ padding: '0.65rem 1rem' }}>
                        <input
                          type="text"
                          value={tier.value}
                          onChange={(e) => updateTier(tier.id, 'value', e.target.value)}
                          style={{
                            border: '1px solid rgb(203, 213, 225)',
                            borderRadius: '0.25rem',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            color: 'rgb(22, 163, 74)',
                            width: '100px',
                          }}
                        />
                      </td>
                      <td data-label="MIN VOLUME REQUIREMENT" style={{ padding: '0.65rem 1rem' }}>
                        <input
                          type="text"
                          value={tier.minVolume}
                          onChange={(e) => updateTier(tier.id, 'minVolume', e.target.value)}
                          style={{
                            border: '1px solid rgb(203, 213, 225)',
                            borderRadius: '0.25rem',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.825rem',
                            width: '120px',
                          }}
                        />
                      </td>
                      <td data-label="STATUS" style={{ padding: '0.65rem 1rem' }}>
                        <select
                          value={tier.status}
                          onChange={(e) => updateTier(tier.id, 'status', e.target.value)}
                          style={{
                            border: '1px solid rgb(203, 213, 225)',
                            borderRadius: '0.25rem',
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            backgroundColor: tier.status === 'Active' ? 'rgb(240, 253, 244)' : 'rgb(248, 250, 252)',
                            color: tier.status === 'Active' ? 'rgb(21, 128, 61)' : 'rgb(100, 116, 139)',
                          }}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td data-actions="" data-label="ACTION" style={{ padding: '0.65rem 1rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => deleteTier(tier.id)}
                          title="Delete Tier"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgb(220, 38, 38)',
                            cursor: 'pointer',
                            padding: '0.3rem',
                            borderRadius: '0.25rem',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="table-pager">
              <span className="table-pager-info">
                Showing <strong>1</strong> to <strong>{tiers.length}</strong> of <strong>{tiers.length}</strong> entries
              </span>
              <div className="table-pager-controls">
                <label className="table-pager-size">
                  <span>Rows</span>
                  <select aria-label="Rows per page">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </label>
                <nav aria-label="Pages" className="table-pager-pages">
                  <button aria-label="Previous page" className="table-pager-btn" disabled type="button">
                    <ChevronLeft size={13} /> <span>Prev</span>
                  </button>
                  <button aria-current="page" className="table-pager-btn table-pager-num" type="button">
                    1
                  </button>
                  <button aria-label="Next page" className="table-pager-btn" disabled type="button">
                    <span>Next</span> <ChevronRight size={13} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Monthly Performance Bonus Criteria */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '0.5rem',
            border: '1px solid rgb(226, 232, 240)',
            padding: '1.25rem 1.5rem',
            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
          }}
        >
          <h2 style={{ margin: '0px 0px 1rem', fontSize: '1rem', fontWeight: 700, color: 'rgb(30, 41, 59)' }}>
            Monthly Performance Bonus Criteria
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Volume Milestone Trigger ($)
              </label>
              <input
                type="text"
                value={bonusTrigger}
                onChange={(e) => setBonusTrigger(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Bonus Reward Amount ($)
              </label>
              <input
                type="text"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Reward Type
              </label>
              <select
                value={bonusType}
                onChange={(e) => setBonusType(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  backgroundColor: 'rgb(255, 255, 255)',
                }}
              >
                <option value="Fixed">Fixed Cash Bonus</option>
                <option value="Percentage">Percentage Extra Rebate</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgb(100, 116, 139)', marginBottom: '0.3rem' }}>
                Max Bonus Per Partner / Month ($)
              </label>
              <input
                type="text"
                value={maxBonus}
                onChange={(e) => setMaxBonus(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
