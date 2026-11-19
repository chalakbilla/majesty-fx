import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_support_tickets';

const initialClosedTickets = [
  {
    id: '#9902',
    rawId: 2,
    client: 'Marcus Chen',
    email: 'marcus.chen@demo.example.com',
    subject: 'PAMM Investor allocation reporting question',
    department: 'pamm',
    priority: 'HIGH',
    created: '11/15/2026, 3:12:59 PM',
    lastReply: '11/17/2026, 3:13:00 PM',
    status: 'Resolved',
    messages: [
      {
        id: 1,
        sender: 'client',
        senderName: 'Marcus Chen',
        message: 'Can you provide the detailed performance and drawdown logs for PAMM Pool 1001 for last month?',
        timestamp: '2026-11-15T15:12:59Z',
      },
      {
        id: 2,
        sender: 'admin',
        senderName: 'Support Desk Lead',
        message: 'Detailed reporting statement sent to client via secure ledger email. Pool yield verified at +18.4%.',
        timestamp: '2026-11-17T15:13:00Z',
      },
    ],
  },
  {
    id: '#9904',
    rawId: 4,
    client: 'Elena Rostova',
    email: 'elena.rostova@demo.example.com',
    subject: 'KYC Document verification status',
    department: 'compliance',
    priority: 'LOW',
    created: '11/14/2026, 02:15:30 PM',
    lastReply: '11/15/2026, 11:20:10 AM',
    status: 'Closed',
    messages: [
      {
        id: 1,
        sender: 'client',
        senderName: 'Elena Rostova',
        message: 'Uploaded proof of address document yesterday, please confirm if approved.',
        timestamp: '2026-11-14T14:15:30Z',
      },
      {
        id: 2,
        sender: 'admin',
        senderName: 'Compliance Officer',
        message: 'Account verified successfully. KYC Tier 2 operational limits now unlocked.',
        timestamp: '2026-11-15T11:20:10Z',
      },
    ],
  },
];

export default function AdminSupportClosed() {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const closed = parsed
            .filter((t) => t.status === 'Closed' || t.status === 'Resolved')
            .map((t) => ({
              id: `#${t.ticketId || t.id}`,
              rawId: t.id,
              client: t.client || t.email?.split('@')[0] || 'Trader',
              email: t.email || '',
              subject: t.subject || 'Support Request',
              department: t.department || 'general',
              priority: (t.priority || 'MEDIUM').toUpperCase(),
              created: t.date || new Date().toLocaleString(),
              lastReply: t.date || 'Recent',
              status: t.status,
              messages: Array.isArray(t.messages)
                ? t.messages
                : [
                    {
                      id: 1,
                      sender: 'client',
                      senderName: t.email?.split('@')[0] || 'Client',
                      message: t.message || 'Support inquiry',
                      timestamp: new Date().toISOString(),
                    },
                    ...(t.adminRemark
                      ? [
                          {
                            id: 2,
                            sender: 'admin',
                            senderName: 'Support Desk Lead',
                            message: t.adminRemark,
                            timestamp: new Date().toISOString(),
                          },
                        ]
                      : []),
                  ],
            }));
          if (closed.length > 0) return closed;
        }
      }
    } catch {}
    return initialClosedTickets;
  });

  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [reopening, setReopening] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
    );
  }, [tickets, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      'Ticket ID',
      'Client',
      'Email',
      'Subject',
      'Department',
      'Priority',
      'Resolved At',
      'Status',
    ];
    const rows = filtered.map((e) => [
      e.id,
      e.client,
      e.email,
      `"${(e.subject || '').replace(/"/g, '""')}"`,
      e.department,
      e.priority,
      e.lastReply || e.created,
      e.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `closed_support_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReopenTicket = (rawId) => {
    setReopening(true);
    try {
      // Update global tickets in localStorage
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const allTickets = JSON.parse(saved);
        const updated = allTickets.map((t) =>
          t.id === rawId
            ? {
                ...t,
                status: 'Open',
                adminRemark: 'Ticket reopened by administrator.',
              }
            : t
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }

      setSuccessMsg('Ticket reopened successfully and moved to Open queue!');
      setTimeout(() => {
        setTickets((prev) => prev.filter((t) => t.rawId !== rawId));
        setSelectedTicket(null);
        setSuccessMsg('');
        setReopening(false);
      }, 1200);
    } catch {
      setReopening(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Header Banner */}
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
                    Closed Support
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Tickets
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Archived support resolutions, closed tickets, and past correspondence
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  borderRadius: '0.375rem',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={14} />
                <span>Export Closed Tickets</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="admin-stat-card">
          <div
            className="admin-icon-box"
            style={{ background: 'linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))' }}
          >
            <CheckCircle2 size={20} color="#ffffff" />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-val">{tickets.length}</span>
            <span className="admin-stat-lbl">RESOLVED TICKETS</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {successMsg}
        </div>
      )}

      {/* 3. Table Box Card */}
      <div className="admin-table-box bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search Bar */}
        <div style={{ padding: '1rem', borderBottom: '1px solid rgb(226, 232, 240)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search closed tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                fontSize: '0.8125rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain overflow-x-auto">
          <table className="data-table-grid w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">TICKET ID</th>
                <th className="py-3 px-4">CLIENT</th>
                <th className="py-3 px-4">SUBJECT</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">RESOLVED AT</th>
                <th className="py-3 px-4" style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((t) => (
                <tr key={t.rawId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <strong style={{ color: 'rgb(15, 23, 42)' }}>{t.id}</strong>
                  </td>
                  <td className="py-3 px-4">
                    <div style={{ fontWeight: 600, color: 'rgb(30, 41, 59)' }}>{t.client}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgb(100, 116, 139)' }}>{t.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div style={{ fontWeight: 600, color: 'rgb(30, 41, 59)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.subject}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="admin-badge">{t.department}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="admin-badge font-bold"
                      style={{
                        backgroundColor:
                          t.priority === 'HIGH' || t.priority === 'URGENT'
                            ? '#fee2e2'
                            : t.priority === 'MEDIUM'
                            ? '#fef3c7'
                            : '#f1f5f9',
                        color:
                          t.priority === 'HIGH' || t.priority === 'URGENT'
                            ? '#b91c1c'
                            : t.priority === 'MEDIUM'
                            ? '#b45309'
                            : '#475569',
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4" style={{ fontSize: '0.78rem', color: 'rgb(100, 116, 139)' }}>
                    {t.lastReply || t.created}
                  </td>
                  <td className="py-3 px-4" style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedTicket(t)}
                      className="admin-action-btn admin-action-btn-view"
                      title="View Resolution & History"
                      aria-label="View Resolution"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    No closed tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pager */}
        <div className="table-pager p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="table-pager-info">
            Showing <strong>{filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> entries
          </span>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1">
              <span>Rows</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded px-1.5 py-0.5 text-xs outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 border border-slate-300 rounded disabled:opacity-40"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="font-semibold">{currentPage}</span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 border border-slate-300 rounded disabled:opacity-40"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Resolution Modal */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '580px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicket.id} (Resolved)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {selectedTicket.department} • {selectedTicket.created}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Subject</span>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{selectedTicket.subject}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Client Information</span>
                <span>
                  {selectedTicket.client} ({selectedTicket.email})
                </span>
              </div>

              {/* Messages thread */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', marginTop: '0.5rem' }}>
                {selectedTicket.messages.map((m, idx) => (
                  <div
                    key={m.id || idx}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      backgroundColor: m.sender === 'admin' ? '#eff6ff' : '#f8fafc',
                      border: m.sender === 'admin' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: m.sender === 'admin' ? '#1d4ed8' : '#334155' }}>
                      <span>{m.senderName || (m.sender === 'admin' ? 'Support Desk Lead' : 'Client')}</span>
                      <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                        {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4, color: '#1e293b' }}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                onClick={() => handleReopenTicket(selectedTicket.rawId)}
                disabled={reopening}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #f59e0b',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} className={reopening ? 'animate-spin' : ''} />
                <span>{reopening ? 'Reopening...' : 'Reopen Ticket'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
