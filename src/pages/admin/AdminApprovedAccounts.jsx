import React, { useState, useEffect, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileSpreadsheet,
  Search,
  ChevronRight,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Check,
} from 'lucide-react';

export default function AdminApprovedAccounts() {
  const { items: allMasters, update } = useCollection('masters');
  const masters = useMemo(
    () => allMasters.filter((m) => m.status === 'approved' || m.status === 'paused'),
    [allMasters]
  );

  const [subscriptionsCount, setSubscriptionsCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMsg('Master accounts list refreshed.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 450);
  };

  const handleToggleStatus = (masterId, currentStatus) => {
    setActionLoadingId(masterId);
    const newStatus = currentStatus === 'paused' ? 'approved' : 'paused';

    setTimeout(() => {
      update(masterId, { status: newStatus });
      setActionLoadingId(null);
      setToastMsg(`Master account ${newStatus === 'paused' ? 'suspended' : 'reinstated'} successfully.`);
      setTimeout(() => setToastMsg(null), 3000);
    }, 350);
  };

  const filteredMasters = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return masters;
    return masters.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.strategyName && m.strategyName.toLowerCase().includes(q)) ||
        (m.login && String(m.login).includes(q))
    );
  }, [masters, searchTerm]);

  // Derived KPI calculations
  const totalAUM = masters.reduce((sum, m) => sum + (m.equity || 0), 0);
  const avgPerfFee = masters.length
    ? Math.round(masters.reduce((sum, m) => sum + (m.totalProfitShare || 0), 0) / masters.length)
    : 0;

  const handleExportCSV = () => {
    if (filteredMasters.length === 0) return;

    const headers = [
      'Master Trader',
      'MT5 Login',
      'Strategy Name',
      'Active Copiers',
      'Overall Gain',
      'Win Rate',
      'MT5 Equity',
      'Perf Fee',
      'Status',
    ];

    const rows = filteredMasters.map((m) => [
      `"${m.name || ''}"`,
      `"${m.login || ''}"`,
      `"${m.strategyName || ''}"`,
      m.totalCopiers || 0,
      `"${(m.overallGain || 0) >= 0 ? '+' : ''}${m.overallGain || 0}%"`,
      `"${m.winRate || 0}%"`,
      `"$${(m.equity || 0).toFixed(2)}"`,
      `"${m.totalProfitShare || 0}%"`,
      `"${m.status || 'Active'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `approved_master_accounts_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-8" style={{ padding: '1.5rem' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] overflow-hidden transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-[1.5rem] sm:text-2xl md:text-[1.85rem] font-extrabold tracking-tight leading-tight text-slate-900 m-0">
                <span>Master</span>{' '}
                <span className="text-orange-600 font-extrabold" style={{ color: 'rgb(234, 88, 12)' }}>
                  Accounts
                </span>
              </h1>
              <span className="text-xs sm:text-sm font-normal text-slate-500">
                Verified Marketplace
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              All verified and active master strategies operating on the copy trading marketplace
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                backgroundColor: 'rgb(192, 132, 252)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.95rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.15s ease',
              }}
            >
              <FileSpreadsheet size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Card 1: Active Masters */}
        <div className="admin-kpi-card" title="Active Masters">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <CheckCircle2 size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(masters.length)}>
              {masters.length}
            </div>
            <div className="admin-kpi-title">Active Masters</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Live strategy leaders</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="admin-kpi-card" title="Active Subscriptions">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))',
              boxShadow: 'rgba(16, 185, 129, 0.22) 0px 3px 8px',
            }}
          >
            <Users size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(subscriptionsCount)}>
              {subscriptionsCount}
            </div>
            <div className="admin-kpi-title">Active Subscriptions</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Active follower links</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total AUM */}
        <div className="admin-kpi-card" title="Total AUM">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(139, 92, 246), rgb(124, 58, 237))',
              boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
            }}
          >
            <DollarSign size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div
              className="admin-kpi-value"
              title={`$${totalAUM.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            >
              ${totalAUM.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="admin-kpi-title">Total AUM</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Combined pooled equity</span>
            </div>
          </div>
        </div>

        {/* Card 4: Avg Perf Fee */}
        <div className="admin-kpi-card" title="Avg Perf Fee">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(245, 158, 11), rgb(217, 119, 6))',
              boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
            }}
          >
            <TrendingUp size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={`${avgPerfFee}%`}>
              {avgPerfFee}%
            </div>
            <div className="admin-kpi-title">Avg Perf Fee</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Mean performance share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search Bar & Counter */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search master traders, strategy, or login..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal text-slate-500">
              Showing <strong className="text-slate-800 font-bold">{filteredMasters.length}</strong> master accounts
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>MASTER TRADER</th>
                  <th>MT5 LOGIN</th>
                  <th>STRATEGY</th>
                  <th>COPIERS</th>
                  <th>MT5 EQUITY</th>
                  <th>OVERALL GAIN</th>
                  <th>WIN RATE</th>
                  <th>PERF FEE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMasters.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="data-table-empty">
                      No approved master accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredMasters.map((m, idx) => {
                    const isPaused = m.status === 'paused';
                    return (
                      <tr key={m.id || idx}>
                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{idx + 1}</td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                            {m.clientEmail && (
                              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{m.clientEmail}</div>
                            )}
                            {m.verified && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  color: '#16a34a',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.2rem',
                                  marginTop: '2px',
                                }}
                              >
                                <ShieldCheck size={11} /> Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                          #{m.login}
                        </td>
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{m.strategyName}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: '#4338ca' }}>
                            {m.totalCopiers || 0} Copiers
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#16a34a' }}>
                          $
                          {(m.equity || 0).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          <span
                            style={{
                              fontWeight: 800,
                              color: (m.overallGain || 0) >= 0 ? '#16a34a' : '#dc2626',
                            }}
                          >
                            {(m.overallGain || 0) >= 0 ? '+' : ''}
                            {m.overallGain || 0}%
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: '#334155' }}>{m.winRate || 0}%</td>
                        <td style={{ color: '#7c3aed', fontWeight: 700 }}>{m.totalProfitShare || 0}%</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              backgroundColor: isPaused ? '#fef3c7' : '#dcfce7',
                              color: isPaused ? '#b45309' : '#166534',
                            }}
                          >
                            {isPaused ? 'PAUSED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(m.id, m.status)}
                            disabled={actionLoadingId === m.id}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.3rem 0.65rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: 'none',
                              backgroundColor: isPaused ? '#dcfce7' : '#fef3c7',
                              color: isPaused ? '#166534' : '#b45309',
                              opacity: actionLoadingId === m.id ? 0.6 : 1,
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {isPaused ? <PlayCircle size={12} /> : <PauseCircle size={12} />}
                            <span>{isPaused ? 'Reinstate' : 'Suspend'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Version Footer */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgb(226, 232, 240)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: '0.8125rem',
          color: 'rgb(100, 116, 139)',
        }}
      >
        <span>Version 2.0</span>
      </footer>
    </div>
  );
}
