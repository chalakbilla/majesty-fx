import { useState } from 'react';
import { Award, SlidersHorizontal, Trash2, X } from 'lucide-react';
import useCollection from '../../hooks/useCollection.js';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';

const FIELDS = [
  ['name', 'Rank name'],
  ['desc', 'Description'],
  ['minVolume', 'Min Volume (e.g. 50 Lots)'],
  ['minClients', 'Min Clients (e.g. 5 Clients)'],
  ['minTrades', 'Min Trades (e.g. 100 Trades)'],
  ['forexRebate', 'Forex Rebate (e.g. $8.00/Lot)'],
  ['metalsRebate', 'Metals Rebate (e.g. $10.00/Lot)'],
  ['subSplit', 'Sub-IB Split (e.g. 15%)'],
];
const EMPTY = { name: '', desc: '', minVolume: '0 Lots', minClients: '0 Clients', minTrades: '0 Trades', forexRebate: '$0.00/Lot', metalsRebate: '$0.00/Lot', subSplit: '0%' };
const num = (v) => parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) || 0;

function Stat({ label, value }) {
  return (
    <div>
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

export default function AdminRankManagement() {
  const { items: ranks, create, update, remove, reset, updateWhere } = useCollection('rankTiers');
  const { items: partners } = useCollection('ibPartners');

  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState(null); // null = closed, {id?: …} = open
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState('');

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 400);
  };

  // READ -> CSV export of every rank
  const handleExport = () => {
    const cols = ['name', 'ibCount', 'minVolume', 'minClients', 'minTrades', 'forexRebate', 'metalsRebate', 'subSplit'];
    const csv = [cols.join(','), ...ranks.map((r) => cols.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ib_ranks_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // UPDATE: put every IB partner in the highest rank whose thresholds it meets
  const handleEvaluate = () => {
    const sorted = [...ranks].sort((a, b) => num(a.minVolume) - num(b.minVolume));
    const counts = Object.fromEntries(sorted.map((r) => [r.id, 0]));
    partners.forEach((p) => {
      const vol = num(p.volume);
      const clients = Number(p.clientsCount) || 0;
      const match = [...sorted].reverse().find((r) => vol >= num(r.minVolume) && clients >= num(r.minClients));
      if (match) counts[match.id] += 1;
    });
    updateWhere(() => true, (r) => ({ ibCount: counts[r.id] ?? 0 }));
    flash(`Evaluated ${partners.length} partners against ${ranks.length} ranks.`);
  };

  const openCreate = () => setForm({ ...EMPTY });
  const openEdit = (rank) => setForm({ ...rank });

  // CREATE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.id) {
      update(form.id, form);
      flash('Rank updated.');
    } else {
      create({ ...form, id: `rank_${Date.now().toString(36)}`, ibCount: 0, color: 'slate' }, { append: true });
      flash('Rank created.');
    }
    setForm(null);
  };

  // DELETE
  const confirmDelete = () => {
    remove(deleteTarget.id);
    setDeleteTarget(null);
    setForm(null);
    flash('Rank deleted.');
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200"><div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block" aria-hidden="true"></div><div className="flex flex-col gap-3.5 sm:gap-4"><div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6"><div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0"><div className="flex items-center gap-2.5 sm:gap-3 flex-wrap"><h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight"><span className="text-slate-900 font-extrabold" style={{ 'color': 'rgb(15, 23, 42)' }}>IB Rank</span> <span className="inline-block font-black text-orange-600 tracking-tight" style={{ 'color': 'rgb(234, 88, 12)' }}>Management</span></h1></div><div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">Configure automatic milestone requirements, volume thresholds, and dynamic tier commission bonuses</div></div><div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0"><div className="flex items-center gap-2 flex-wrap"><div className="flex items-center gap-2.5"><button onClick={handleExport} type="button" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download text-slate-500" aria-hidden="true"><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /></svg><span>Export CSV</span></button><button onClick={handleEvaluate} type="button" className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white btn-orange rounded-lg transition-colors shadow-xs disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap" aria-hidden="true"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></svg><span>Evaluate Partners</span></button></div></div><button onClick={handleRefresh} type="button" className="btn-secondary absolute top-3 right-3 sm:static !p-2 sm:!px-[0.85rem] sm:!py-2 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]" title="Refresh page data" aria-label="Refresh" style={{ 'display': 'inline-flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '0.4rem', 'padding': '0.5rem 0.85rem', 'fontSize': '0.85rem', 'fontWeight': '600', 'borderRadius': '0.5rem', 'border': '1px solid rgb(203, 213, 225)', 'backgroundColor': 'rgb(255, 255, 255)', 'color': 'rgb(51, 65, 85)', 'cursor': 'pointer', 'boxShadow': 'rgba(0, 0, 0, 0.05) 0px 1px 2px', 'transition': '0.15s' }}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw text-slate-600" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></svg><span className="hidden sm:inline">Refresh</span></button></div></div></div></div>
      <div className="flex items-center justify-end gap-2.5 -mt-2">
        {notice && <span className="text-xs font-semibold text-emerald-700">{notice}</span>}
        <button type="button" onClick={reset} className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Reset Defaults</button>
        <button type="button" onClick={openCreate} className="px-3.5 py-2 text-xs font-semibold text-white btn-orange rounded-lg cursor-pointer">+ Add Rank</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {ranks.map((rank) => (
          <div key={rank.id} className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0"><Award size={16} /></div>
                  <h3 className="font-bold text-slate-900 text-sm">{rank.name}</h3>
                </div>
                <span className="inline-flex items-center text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">{rank.ibCount} IBs</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3.5 min-h-[32px]">{rank.desc}</p>
              <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  <Stat label="Min Volume" value={rank.minVolume} />
                  <Stat label="Min Clients" value={rank.minClients} />
                </div>
                <div className="grid grid-cols-2 gap-2 py-2">
                  <Stat label="Min Trades" value={rank.minTrades} />
                  <Stat label="Forex Rebate" value={rank.forexRebate} />
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Stat label="Metals Rebate" value={rank.metalsRebate} />
                  <Stat label="Sub-IB Split" value={rank.subSplit} />
                </div>
              </div>
            </div>
            <button type="button" onClick={() => openEdit(rank)} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"><SlidersHorizontal size={13} className="text-slate-500" /><span>Configure Thresholds &amp; Rebates</span></button>
          </div>
        ))}
      </div>
      <footer style={{ 'marginTop': '1.5rem', 'paddingTop': '1rem', 'borderTop': '1px solid rgb(226, 232, 240)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'fontSize': '0.8125rem', 'color': 'rgb(100, 116, 139)' }}><span>Majesty IB Portal v2.0 • Rank &amp; Tier Management Desk</span><span>Automatic Tier Promotion Engine Active</span></footer>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" onClick={() => setForm(null)}>
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">{form.id ? 'Configure Thresholds & Rebates' : 'Add Rank'}</h3>
              <button type="button" onClick={() => setForm(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><X size={18} /></button>
            </div>
            <div className="px-6 py-4 space-y-3">
              {FIELDS.map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-xs font-semibold text-slate-600">{label}</span>
                  <input
                    type="text"
                    value={form[key] ?? ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required={key === 'name'}
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              {form.id ? (
                <button type="button" onClick={() => setDeleteTarget(form)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"><Trash2 size={14} /> Delete rank</button>
              ) : <span />}
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setForm(null)} className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white btn-orange rounded-lg cursor-pointer">Save</button>
              </div>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete rank?"
        message={deleteTarget ? `"${deleteTarget.name}" will be removed from the rank ladder.` : ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
