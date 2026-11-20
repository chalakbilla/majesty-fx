import { useState, useMemo, useEffect } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  ChevronRight,
  Download,
  Plus,
  Power,
  PowerOff,
  Trash2,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_account_statuses';

// seed data lives in src/data/json (initialStatuses)

export default function AdminAccountStatuses() {
  const { items: statuses, setItems: setStatuses } = useCollection('accountStatuses');

  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState('');


  // Filtered rows based on search input
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return statuses;
    return statuses.filter(
      (s) =>
        (s.statusName && s.statusName.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [statuses, search]);

  // Toggle active/inactive state
  const handleToggleStatus = (item) => {
    setError('');
    setStatuses((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, active: !s.active } : s))
    );
  };

  // Delete status
  const handleDeleteStatus = (id) => {
    if (window.confirm('Delete this account status rule?')) {
      setError('');
      setStatuses((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Create new status
  const handleCreateStatus = (e) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;

    setError('');
    const nextId = statuses.length > 0 ? Math.max(...statuses.map((s) => s.id)) + 1 : 1;
    const newEntry = {
      id: nextId,
      statusName: newStatusName.trim(),
      description: newDescription.trim() || 'No operational restrictions specified.',
      active: true,
    };

    setStatuses((prev) => [...prev, newEntry]);
    setNewStatusName('');
    setNewDescription('');
    setShowAddModal(false);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Status Name', 'Description', 'State'];
    const rows = filtered.map((s) => [
      s.id,
      `"${(s.statusName || '').replace(/"/g, '""')}"`,
      `"${(s.description || '').replace(/"/g, '""')}"`,
      s.active ? 'Active' : 'Inactive',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'account_status_rules.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON to clipboard
  const handleCopy = () => {
    try {
      navigator.clipboard?.writeText(JSON.stringify(filtered, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none"
          >
            <a href="/admin" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Home
            </a>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-500">Configurations</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Account Statuses</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Account
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Statuses
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Create New Status</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" style={{ margin: 0, color: '#b91c1c', fontSize: '0.85rem' }}>
          {error}
        </p>
      )}

      {/* 2. Main Card Container with Controls and Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          padding: '1.25rem',
        }}
      >
        {/* Top Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {/* Action Buttons */}
          <div style={{ display: 'inline-flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                backgroundColor: 'var(--desk)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Download size={12} />
              CSV Export
            </button>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                backgroundColor: 'var(--desk)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                backgroundColor: 'var(--desk)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Print
            </button>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#64748b' }}>
            <span>Search:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search statuses..."
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '0.25rem',
                padding: '0.25rem 0.5rem',
                fontSize: '0.8125rem',
                outline: 'none',
                minWidth: '180px',
              }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>STATUS NAME</th>
                  <th>DESCRIPTION &amp; RESTRICTIONS</th>
                  <th>ACTIVE/INACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="data-table-empty">
                      {statuses.length === 0 ? 'No data available' : 'No statuses match the filters.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>{item.id}</td>
                      <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {item.statusName}
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem', color: '#475569' }}>{item.description}</td>
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <span
                          style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: item.active ? '#dcfce7' : '#fee2e2',
                            color: item.active ? '#15803d' : '#991b1b',
                          }}
                        >
                          {item.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.85rem' }}>
                        <div className="admin-action-group" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className={item.active ? 'admin-action-btn admin-action-btn-amber' : 'admin-action-btn admin-action-btn-approve'}
                            title={item.active ? 'Deactivate Status' : 'Activate Status'}
                            aria-label={item.active ? 'Deactivate Status' : 'Activate Status'}
                          >
                            {item.active ? <PowerOff size={13} /> : <Power size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStatus(item.id)}
                            className="admin-action-btn admin-action-btn-reject"
                            title="Delete Status"
                            aria-label="Delete Status"
                          >
                            <Trash2 size={13} />
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

        {/* Entries & Pagination Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            fontSize: '0.8125rem',
            color: '#64748b',
          }}
        >
          <span>
            {filtered.length === 0
              ? 'Showing 1 to 0 of 0 entries'
              : `Showing 1 to ${filtered.length} of ${filtered.length} entries`}
          </span>
          <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
            <button
              type="button"
              disabled
              style={{
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                color: '#94a3b8',
                borderRadius: '0.25rem',
                cursor: 'not-allowed',
              }}
            >
              Previous
            </button>
            <button
              type="button"
              style={{
                border: '1px solid var(--desk)',
                backgroundColor: 'var(--desk)',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                color: '#ffffff',
                borderRadius: '0.25rem',
                fontWeight: 600,
              }}
            >
              1
            </button>
            <button
              type="button"
              disabled
              style={{
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                color: '#94a3b8',
                borderRadius: '0.25rem',
                cursor: 'not-allowed',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 3. Modal: Add Account Status */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '460px',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Add Account Status</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Status Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inactive - Inactivity Fee Applied"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Operational rule details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  style={{ backgroundColor: '#ea580c' }}
                >
                  Create Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Page Footer */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgb(226, 232, 240)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8125rem',
          color: 'rgb(100, 116, 139)',
        }}
      >
        <span>Version 2.0</span>
      </footer>
    </div>
  );
}
