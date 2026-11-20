import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useCollection from '../../hooks/useCollection.js';
import { Link } from 'react-router-dom';
import {
  XCircle,
  RotateCcw,
  RefreshCw,
  FileSpreadsheet,
  Search,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminRejectedMasterAccounts() {
  const { items: allMasters, update } = useCollection('masters');
  const masters = useMemo(() => allMasters.filter((m) => m.status === 'rejected'), [allMasters]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToastMsg('Rejected master accounts refreshed.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 450);
  };

  // UPDATE: rejected -> pending (shows up on the Pending page again)
  const handleReinstate = (masterId) => {
    setActionLoadingId(masterId);
    setTimeout(() => {
      update(masterId, { status: 'pending', rejectionReason: '' });
      setToastMsg('Application Reinstated: Moved back to pending review.');
      setTimeout(() => setToastMsg(null), 3000);
      setActionLoadingId(null);
    }, 300);
  };

  const filteredMasters = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return masters;
    return masters.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.strategyName && m.strategyName.toLowerCase().includes(q)) ||
        (m.login && String(m.login).includes(q)) ||
        (m.id && String(m.id).toLowerCase().includes(q))
    );
  }, [masters, searchTerm]);

  const handleExportCSV = () => {
    if (filteredMasters.length === 0) return;

    const headers = [
      'Applicant',
      'Client ID',
      'MT5 Login',
      'Strategy',
      'Perf Fee',
      'Risk Score',
      'Applied Date',
      'Rejection Reason',
    ];

    const escapeValue = (val) => {
      const s = String(val ?? '');
      return `"${s.replace(/"/g, '""')}"`;
    };

    const rows = filteredMasters.map((m) => [
      escapeValue(m.name || ''),
      escapeValue(m.id || ''),
      escapeValue(m.login || ''),
      escapeValue(m.strategyName || ''),
      escapeValue(`${m.totalProfitShare || 0}%`),
      escapeValue(`Risk ${m.riskScore || 1}`),
      escapeValue(m.joinedDate || ''),
      escapeValue(m.rejectionReason || 'Requirements not met'),
    ]);

    const csvContent = [headers.map(escapeValue).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rejected_master_accounts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-8">
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
                <span>Rejected Master</span>{' '}
                <span className="text-orange-600 font-extrabold" style={{ color: 'rgb(234, 88, 12)' }}>
                  Accounts
                </span>
              </h1>
              <span className="text-xs sm:text-sm font-normal text-slate-500">
                Compliance Archive
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Master trader applications that did not meet risk, track record, or compliance criteria
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

      {/* 2 Metric KPI Cards matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-5 w-full">
        {/* Card 1: Total Rejected */}
        <div className="admin-kpi-card" title="Total Rejected">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(244, 63, 94), rgb(225, 29, 72))',
              boxShadow: 'rgba(225, 29, 72, 0.22) 0px 3px 8px',
            }}
          >
            <XCircle size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(masters.length)}>
              {masters.length}
            </div>
            <div className="admin-kpi-title">Total Rejected</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Declined applications</span>
            </div>
          </div>
        </div>

        {/* Card 2: Eligible for Re-review */}
        <div className="admin-kpi-card" title="Eligible for Re-review">
          <div
            className="admin-kpi-icon-squircle"
            style={{
              background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))',
              boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
            }}
          >
            <RotateCcw size={20} color="#ffffff" />
          </div>
          <div className="admin-kpi-content">
            <div className="admin-kpi-value" title={String(masters.length)}>
              {masters.length}
            </div>
            <div className="admin-kpi-title">Eligible for Re-review</div>
            <div className="admin-kpi-sub">
              <span className="truncate">Can be reinstated</span>
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
              placeholder="Search rejected applicants, strategy, or login..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-normal text-slate-500">
              Showing <strong className="text-slate-800 font-bold">{filteredMasters.length}</strong> rejected applications
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
                  <th>APPLICANT</th>
                  <th>MT5 LOGIN</th>
                  <th>STRATEGY</th>
                  <th>PERF FEE</th>
                  <th>RISK SCORE</th>
                  <th>APPLIED DATE</th>
                  <th>REJECTION REASON</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMasters.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="data-table-empty">
                      No rejected master applications found.
                    </td>
                  </tr>
                ) : (
                  filteredMasters.map((m, idx) => {
                    const riskVal = m.riskScore || 1;
                    return (
                      <tr key={m.id || idx}>
                        <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                              ID: {m.id}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                          #{m.login}
                        </td>
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{m.strategyName}</td>
                        <td style={{ fontWeight: 700, color: '#7c3aed' }}>{m.totalProfitShare || 0}%</td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: riskVal <= 2 ? '#dcfce7' : riskVal === 3 ? '#fef3c7' : '#fee2e2',
                              color: riskVal <= 2 ? '#166534' : riskVal === 3 ? '#b45309' : '#991b1b',
                            }}
                          >
                            Risk {riskVal}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                          {m.joinedDate || '—'}
                        </td>
                        <td>
                          <span style={{ color: '#dc2626', fontSize: '0.78rem', fontWeight: 600 }}>
                            {m.rejectionReason || 'Requirements not met'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-action-group" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleReinstate(m.id)}
                              disabled={actionLoadingId === m.id}
                              className="admin-action-btn admin-action-btn-view"
                              title="Reinstate to Pending"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: '#f1f5f9',
                                color: '#334155',
                                border: '1px solid #cbd5e1',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                opacity: actionLoadingId === m.id ? 0.6 : 1,
                              }}
                            >
                              <RotateCcw size={12} />
                              <span>Move to Pending</span>
                            </button>
                          </div>
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
