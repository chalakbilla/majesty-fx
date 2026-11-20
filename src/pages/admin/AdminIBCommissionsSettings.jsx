import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import useCollection from '../../hooks/useCollection.js';
import useTableControls from '../../hooks/useTableControls.js';
import TablePager from '../../components/admin/TablePager.jsx';

const RATE_FIELDS = [
  ['forex', 'FOREX ($/LOT)'],
  ['metals', 'METALS ($/LOT)'],
  ['indices', 'INDICES ($/LOT)'],
  ['crypto', 'CRYPTO ($/LOT)'],
];
const levelInputStyle = { 'width': '100%', 'maxWidth': '180px', 'border': '1px solid rgb(203, 213, 225)', 'borderRadius': '0.25rem', 'padding': '0.35rem 0.65rem', 'fontSize': '0.85rem', 'fontWeight': '600', 'color': 'rgb(15, 23, 42)' };
const rateInputStyle = { 'width': '95px', 'border': '1px solid rgb(203, 213, 225)', 'borderRadius': '0.25rem', 'padding': '0.35rem 0.5rem 0.35rem 1.25rem', 'fontSize': '0.85rem', 'fontFamily': 'monospace', 'fontWeight': '600' };

export default function AdminIBCommissionsSettings() {
  const tiersStore = useCollection('commissionTiers');
  const settingsStore = useCollection('ibCommissionSettings');

  // Editable drafts – only written to the store when "Save" is pressed.
  const [tiers, setTiers] = useState(tiersStore.items);
  const [settings, setSettings] = useState(settingsStore.items[0]);
  const table = useTableControls(tiers, { pageSize: 10 });

  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return undefined;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTiers(tiersStore.items);
    setSettings(settingsStore.items[0]);
    setTimeout(() => setRefreshing(false), 400);
  };

  // CREATE
  const handleAddTier = () => {
    const n = tiers.length + 1;
    setTiers([...tiers, { id: `tier_${Date.now().toString(36)}`, level: `Level ${n} (Sub-IB)`, forex: '1.00', metals: '1.00', indices: '1.00', crypto: '1.00', isBase: false }]);
  };

  // UPDATE (draft)
  const updateTier = (id, field, value) =>
    setTiers((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  // DELETE (draft)
  const handleRemoveTier = (id) => setTiers((prev) => prev.filter((t) => t.id !== id));

  // Persist drafts
  const handleSave = () => {
    tiersStore.replaceAll(tiers);
    settingsStore.replaceAll([settings]);
    setSaved(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  // Restore the JSON defaults
  const handleReset = () => {
    setTiers(tiersStore.reset());
    setSettings(settingsStore.reset()[0]);
  };

  return (
    <div className="space-y-6 pb-10"><div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200"><div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block" aria-hidden="true"></div><div className="flex flex-col gap-3.5 sm:gap-4"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6"><div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0"><div className="flex items-center gap-2.5 sm:gap-3 flex-wrap"><h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight"><span className="text-slate-900 font-extrabold" style={{ 'color': 'rgb(15, 23, 42)' }}>IB</span> <span className="inline-block font-black text-orange-600 tracking-tight" style={{ 'color': 'rgb(234, 88, 12)' }}>Commissions Settings</span></h1></div><div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">Multi-tier affiliate commission rates, minimum payout thresholds, and payout modes</div></div><div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0"><div className="flex items-center gap-2 flex-wrap"><div className="flex items-center gap-2.5"><button onClick={handleReset} type="button" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw text-slate-500" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg><span>Reset Defaults</span></button><button onClick={handleSave} type="button" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg><span>{saved ? 'Saved ✓' : 'Save Settings'}</span></button></div></div><button onClick={handleRefresh} type="button" className="btn-secondary absolute top-3 right-3 sm:static !p-2 sm:!px-[0.85rem] sm:!py-2 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]" title="Refresh page data" aria-label="Refresh" style={{ 'display': 'inline-flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '0.4rem', 'padding': '0.5rem 0.85rem', 'fontSize': '0.85rem', 'fontWeight': '600', 'borderRadius': '0.5rem', 'border': '1px solid rgb(203, 213, 225)', 'backgroundColor': 'rgb(255, 255, 255)', 'color': 'rgb(51, 65, 85)', 'cursor': 'pointer', 'boxShadow': 'rgba(0, 0, 0, 0.05) 0px 1px 2px', 'transition': '0.15s' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw text-slate-600" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg><span className="hidden sm:inline">Refresh</span></button></div></div></div></div><form onSubmit={handleSubmit} style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': '1.25rem' }}><div style={{ 'backgroundColor': 'rgb(255, 255, 255)', 'borderRadius': '0.5rem', 'border': '1px solid rgb(226, 232, 240)', 'boxShadow': 'rgba(0, 0, 0, 0.03) 0px 1px 3px', 'overflow': 'hidden' }}><div style={{ 'backgroundColor': 'rgb(67, 56, 202)', 'color': 'rgb(255, 255, 255)', 'padding': '0.85rem 1.25rem', 'fontSize': '1.05rem', 'fontWeight': '700', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'flexWrap': 'wrap', 'gap': '0.5rem' }}><div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '0.5rem' }}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers lucide-layers-3" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" /><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" /></svg><span>Multi-Level IB Commission Rates (USD / Lot)</span></div><button onClick={handleAddTier} type="button" style={{ 'display': 'inline-flex', 'alignItems': 'center', 'gap': '0.35rem', 'backgroundColor': 'rgba(255, 255, 255, 0.15)', 'color': 'rgb(255, 255, 255)', 'border': '1px solid rgba(255, 255, 255, 0.3)', 'borderRadius': '0.375rem', 'padding': '0.3rem 0.75rem', 'fontSize': '0.8rem', 'fontWeight': '600', 'cursor': 'pointer' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg><span>Add Tier Level</span></button></div><div className="data-table data-table--plain"><div className="data-table-scroll"><table className="data-table-grid" data-cards=""><thead><tr><th>IB LEVEL</th><th>FOREX ($/LOT)</th><th>METALS ($/LOT)</th><th>INDICES ($/LOT)</th><th>CRYPTO ($/LOT)</th><th style={{ 'width': '70px', 'textAlign': 'center' }}>ACTION</th></tr></thead><tbody>{table.rows.map((tier, idx) => (<tr key={tier.id} style={{ 'borderBottom': '1px solid rgb(241, 245, 249)', 'backgroundColor': idx % 2 ? 'rgb(250, 250, 250)' : 'rgb(255, 255, 255)' }}><td data-label="IB LEVEL" style={{ 'padding': '0.75rem 1rem' }}><input type="text" value={tier.level} onChange={(e) => updateTier(tier.id, 'level', e.target.value)} style={levelInputStyle} /></td>{RATE_FIELDS.map(([field, label]) => (<td key={field} data-label={label} style={{ 'padding': '0.75rem 1rem' }}><div style={{ 'position': 'relative', 'display': 'inline-flex', 'alignItems': 'center' }}><span style={{ 'position': 'absolute', 'left': '0.5rem', 'color': 'rgb(148, 163, 184)', 'fontSize': '0.8rem' }}>$</span><input type="text" inputMode="decimal" value={tier[field]} onChange={(e) => updateTier(tier.id, field, e.target.value)} style={rateInputStyle} /></div></td>))}<td data-label="ACTION" data-actions="" style={{ 'padding': '0.75rem 1rem', 'textAlign': 'center' }}>{tier.isBase ? (<span style={{ 'fontSize': '0.75rem', 'color': 'rgb(148, 163, 184)', 'fontWeight': '600' }}>Base</span>) : (<button type="button" title={`Remove ${tier.level}`} onClick={() => handleRemoveTier(tier.id)} style={{ 'backgroundColor': 'transparent', 'border': 'none', 'color': 'rgb(239, 68, 68)', 'cursor': 'pointer', 'padding': '0.25rem', 'borderRadius': '0.25rem' }}><Trash2 size={16} /></button>)}</td></tr>))}</tbody></table></div><TablePager table={table} /></div></div><div style={{ 'backgroundColor': 'rgb(255, 255, 255)', 'borderRadius': '0.5rem', 'border': '1px solid rgb(226, 232, 240)', 'padding': '1.25rem 1.5rem', 'boxShadow': 'rgba(0, 0, 0, 0.02) 0px 1px 3px', 'display': 'grid', 'gridTemplateColumns': 'repeat(auto-fit, minmax(260px, 1fr))', 'gap': '1.5rem' }}><div style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': '0.4rem' }}><label style={{ 'fontSize': '0.825rem', 'fontWeight': '700', 'color': 'rgb(51, 65, 85)' }}>Commission Calculation Mode</label><select value={settings.mode} onChange={(e) => setSettings({ ...settings, mode: e.target.value })} style={{ 'border': '1px solid rgb(203, 213, 225)', 'borderRadius': '0.375rem', 'padding': '0.55rem 0.75rem', 'fontSize': '0.875rem', 'backgroundColor': 'rgb(255, 255, 255)', 'color': 'rgb(30, 41, 59)' }}><option value="Per Lot Traded (USD)">Per Lot Traded (USD)</option><option value="Percentage of Spread">Percentage of Spread (%)</option><option value="Fixed Revenue Share">Fixed Revenue Share (%)</option></select><span style={{ 'fontSize': '0.75rem', 'color': 'rgb(100, 116, 139)' }}>Defines how partner rebates are calculated on closed MT5 trades.</span></div><div style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': '0.4rem' }}><label style={{ 'fontSize': '0.825rem', 'fontWeight': '700', 'color': 'rgb(51, 65, 85)' }}>Minimum Withdrawal Payout ($ USD)</label><div style={{ 'position': 'relative', 'display': 'flex', 'alignItems': 'center' }}><span style={{ 'position': 'absolute', 'left': '0.75rem', 'color': 'rgb(148, 163, 184)', 'fontSize': '0.85rem' }}>$</span><input type="text" inputMode="decimal" value={settings.minPayout} onChange={(e) => setSettings({ ...settings, minPayout: e.target.value })} style={{ 'width': '100%', 'border': '1px solid rgb(203, 213, 225)', 'borderRadius': '0.375rem', 'padding': '0.55rem 0.75rem 0.55rem 1.6rem', 'fontSize': '0.875rem', 'fontWeight': '600', 'color': 'rgb(30, 41, 59)' }} /></div><span style={{ 'fontSize': '0.75rem', 'color': 'rgb(100, 116, 139)' }}>Minimum threshold an IB partner must accumulate before requesting payout.</span></div><div style={{ 'display': 'flex', 'flexDirection': 'column', 'gap': '0.4rem', 'justifyContent': 'center' }}><label style={{ 'fontSize': '0.825rem', 'fontWeight': '700', 'color': 'rgb(51, 65, 85)' }}>Automated Daily Settlement</label><label style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '0.6rem', 'cursor': 'pointer', 'marginTop': '0.2rem' }}><input type="checkbox" checked={settings.autoSettle} onChange={(e) => setSettings({ ...settings, autoSettle: e.target.checked })} style={{ 'width': '1.1rem', 'height': '1.1rem', 'accentColor': 'rgb(234, 88, 12)', 'cursor': 'pointer' }} /><span style={{ 'fontSize': '0.85rem', 'color': 'rgb(30, 41, 59)', 'fontWeight': '500' }}>Credit verified commissions daily at 23:59 UTC</span></label><span style={{ 'fontSize': '0.75rem', 'color': 'rgb(100, 116, 139)' }}>When active, pending commissions settle automatically to withdrawable balance.</span></div></div><div style={{ 'display': 'flex', 'alignItems': 'center', 'gap': '1rem', 'flexWrap': 'wrap' }}><button type="submit"  className="px-6 py-2.5 btn-orange text-white rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save" aria-hidden="true"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg><span>{saved ? 'Saved ✓' : 'Save Commission Settings'}</span></button></div></form><footer style={{ 'marginTop': '1.5rem', 'paddingTop': '1rem', 'borderTop': '1px solid rgb(226, 232, 240)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'fontSize': '0.8125rem', 'color': 'rgb(100, 116, 139)' }}><span>Version 2.0</span></footer></div>
  );
}
