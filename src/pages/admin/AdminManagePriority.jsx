import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  RefreshCw,
  Search,
  Send,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_support_tickets';

const initialMockTickets = [
  {
    id: 1,
    ticketId: '9901',
    email: 'alex.wright@demo.example.com',
    subject: 'Inquiry about MT5 Expert Advisor setup',
    department: 'technical',
    priority: 'Medium',
    message: 'Hello Support, I need assistance setting up my custom EA on the institutional MT5 terminal.',
    status: 'Open',
    date: '11/17/2026, 11:12:59 AM',
    adminRemark: '',
  },
  {
    id: 2,
    ticketId: '9902',
    email: 'marcus.chen@demo.example.com',
    subject: 'PAMM Investor allocation reporting question',
    department: 'pamm',
    priority: 'Medium',
    message: 'Can you provide the detailed performance and drawdown logs for PAMM Pool 1001 for last month?',
    status: 'Resolved',
    date: '11/15/2026, 3:12:59 PM',
    adminRemark: 'Detailed reporting statement sent to client via secure ledger email.',
  },
  {
    id: 3,
    ticketId: '9903',
    email: 'sophia.m@majestyfx.partner.com',
    subject: 'Multi-tier sub-IB rebate calculation query',
    department: 'billing',
    priority: 'High',
    message: 'Requesting verification of Tier 3 rebate accrual rates for direct downline trading volume.',
    status: 'In-Progress',
    date: '11/18/2026, 09:45:20 AM',
    adminRemark: 'Auditing rebate transaction hashes.',
  },
  {
    id: 4,
    ticketId: '9904',
    email: 'elena.rostova@demo.example.com',
    subject: 'KYC Document verification status',
    department: 'compliance',
    priority: 'Low',
    message: 'Uploaded proof of address document yesterday, please confirm if approved.',
    status: 'Closed',
    date: '11/14/2026, 02:15:30 PM',
    adminRemark: 'Account verified successfully.',
  },
];

function transformRawTicket(e) {
  const messages = Array.isArray(e.messages) ? e.messages : [];
  const lastMsg = messages[messages.length - 1];
  const adminMsg = [...messages].reverse().find((m) => m.sender === 'admin');
  const statusStr = (e.status || '').toLowerCase();
  const priorityStr = e.priority || 'Medium';

  return {
    id: e.id,
    ticketId: String(e.ticket_number || e.ticketId || e.id),
    email: e.client_email || e.email || '',
    subject: e.subject || 'Support Request',
    department: e.category || e.department || 'general',
    priority: ['Low', 'Medium', 'High', 'Urgent'].includes(priorityStr) ? priorityStr : 'Medium',
    message: lastMsg?.message || e.message || '',
    status:
      statusStr === 'closed'
        ? 'Closed'
        : statusStr === 'resolved'
        ? 'Resolved'
        : statusStr === 'in-progress'
        ? 'In-Progress'
        : 'Open',
    date: e.created_at ? new Date(e.created_at).toLocaleString() : e.date || new Date().toLocaleString(),
    adminRemark: adminMsg?.message || e.adminRemark || '',
  };
}

export default function AdminManagePriority({ defaultStatusFilter = 'All Tickets' }) {
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMockTickets;
  });

  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync prop changes
  useEffect(() => {
    if (defaultStatusFilter) {
      setStatusFilter(defaultStatusFilter);
    }
  }, [defaultStatusFilter]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Fetch live tickets if endpoint exists
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/support/tickets')
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (res?.success && Array.isArray(res.tickets) && res.tickets.length > 0) {
        setTickets(res.tickets.map(transformRawTicket));
      }
    } catch (e) {
      console.warn('Failed to fetch live tickets:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadTickets();
    }, 400);
  };

  // Change Ticket Status
  const handleStatusChange = async (ticket, newStatus) => {
    setErrorMessage('');
    try {
      await fetch('/api/support/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.id, status: newStatus.toLowerCase() }),
      }).catch(() => null);

      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, status: newStatus } : t))
      );
      if (selectedTicket && selectedTicket.id === ticket.id) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to update ticket status.');
    }
  };

  // Change Ticket Priority
  const handlePriorityChange = async (ticket, newPriority) => {
    setErrorMessage('');
    try {
      await fetch('/api/support/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.id, priority: newPriority }),
      }).catch(() => null);

      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, priority: newPriority } : t))
      );
      if (selectedTicket && selectedTicket.id === ticket.id) {
        setSelectedTicket((prev) => ({ ...prev, priority: newPriority }));
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to update ticket priority.');
    }
  };

  // Send reply / remark
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedTicket) return;

    setIsSending(true);
    setErrorMessage('');
    try {
      await fetch('/api/support/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selectedTicket.id, message: adminReply.trim() }),
      }).catch(() => null);

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, adminRemark: adminReply.trim() } : t
        )
      );
      setSelectedTicket((prev) => ({ ...prev, adminRemark: adminReply.trim() }));
      setAdminReply('');
      setReplySent(true);
      setTimeout(() => setReplySent(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send ticket reply.');
    } finally {
      setIsSending(false);
    }
  };

  // Filtered tickets
  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== 'All Tickets' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.ticketId.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.department.toLowerCase().includes(q) ||
          (t.adminRemark && t.adminRemark.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  // Pagination calculation
  const totalEntries = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Export CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      'Ticket ID',
      'Email',
      'Subject',
      'Department',
      'Priority',
      'Status',
      'Date',
      'Admin Remark',
    ];
    const rows = filtered.map((e) => [
      e.ticketId,
      e.email,
      `"${(e.subject || '').replace(/"/g, '""')}"`,
      e.department,
      e.priority,
      e.status,
      e.date,
      `"${(e.adminRemark || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `support_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgent':
        return { bg: '#fee2e2', text: '#b91c1c' };
      case 'High':
        return { bg: '#ffedd5', text: '#c2410c' };
      case 'Medium':
        return { bg: '#fef3c7', text: '#b45309' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open':
        return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'In-Progress':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'Resolved':
        return { bg: '#dcfce7', text: '#15803d' };
      default:
        return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* 1. Header Banner Card */}
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
                    {statusFilter === 'Open'
                      ? 'Open Support'
                      : statusFilter === 'Closed'
                      ? 'Closed Support'
                      : 'Support Ticket'}
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    {statusFilter === 'Open' || statusFilter === 'Closed' ? 'Tickets' : 'Management'}
                  </span>
                </h1>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                    Desk Service
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                {statusFilter === 'Open'
                  ? 'Active open support requests awaiting agent assistance and institutional response'
                  : statusFilter === 'Closed'
                  ? 'Archived support resolutions, closed tickets, and past correspondence'
                  : 'Review, prioritize, and communicate with clients on institutional tickets'}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={filtered.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-orange text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p role="alert" className="text-xs text-rose-600 font-semibold">
          {errorMessage}
        </p>
      )}

      {/* 2. Table Box Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID, email, subject, department..."
              className="w-full sm:w-72 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option value="All Tickets">All Statuses</option>
              <option value="Open">Open Tickets</option>
              <option value="In-Progress">In-Progress Tickets</option>
              <option value="Resolved">Resolved Tickets</option>
              <option value="Closed">Closed Tickets</option>
            </select>
            {(searchQuery || statusFilter !== 'All Tickets') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All Tickets');
                }}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Showing <strong className="text-slate-800">{filtered.length}</strong>{' '}
              {filtered.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>TICKET ID</th>
                  <th>EMAIL</th>
                  <th>SUBJECT</th>
                  <th>DEPARTMENT</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ADMIN REMARK</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="data-table-empty">
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                        No tickets match the filters
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                        Try adjusting your search query or status filter.
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTickets.map((t, r) => {
                    const pStyle = getPriorityStyle(t.priority);
                    const sStyle = getStatusStyle(t.status);

                    return (
                      <tr
                        key={t.id}
                        style={{
                          borderBottom: '1px solid rgb(241, 245, 249)',
                          backgroundColor: r % 2 === 0 ? '#ffffff' : '#fafafa',
                        }}
                      >
                        <td data-label="TICKET ID" style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#2563eb' }}>
                          {t.ticketId}
                        </td>
                        <td data-label="EMAIL" style={{ padding: '0.65rem 0.85rem', color: '#1e293b' }}>
                          {t.email}
                        </td>
                        <td
                          title={t.subject}
                          data-label="SUBJECT"
                          style={{
                            padding: '0.65rem 0.85rem',
                            fontWeight: 600,
                            color: '#0f172a',
                            maxWidth: '260px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t.subject}
                        </td>
                        <td data-label="DEPARTMENT" style={{ padding: '0.65rem 0.85rem', color: '#475569' }}>
                          {t.department}
                        </td>
                        <td data-label="PRIORITY" style={{ padding: '0.65rem 0.85rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: '0.2rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: pStyle.bg,
                              color: pStyle.text,
                            }}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td data-label="STATUS" style={{ padding: '0.65rem 0.85rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.45rem',
                              borderRadius: '0.2rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: sStyle.bg,
                              color: sStyle.text,
                            }}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td data-label="DATE" style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>
                          {t.date}
                        </td>
                        <td
                          title={t.adminRemark}
                          data-label="ADMIN REMARK"
                          style={{
                            padding: '0.65rem 0.85rem',
                            color: '#64748b',
                            fontSize: '0.75rem',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t.adminRemark}
                        </td>
                        <td data-label="ACTIONS" data-actions="" style={{ textAlign: 'right' }}>
                          <div className="admin-action-group">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTicket(t);
                                setAdminReply(t.adminRemark || '');
                                setReplySent(false);
                              }}
                              className="admin-action-btn admin-action-btn-view"
                              title="Manage Ticket Priority"
                              aria-label="Manage Ticket Priority"
                            >
                              <Eye size={14} />
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

          {/* Table Pager Controls */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>{Math.min(filtered.length, (currentPage - 1) * pageSize + 1)}</strong> to{' '}
              <strong>{Math.min(filtered.length, currentPage * pageSize)}</strong> of{' '}
              <strong>{filtered.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  aria-label="Rows per page"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
              <nav className="table-pager-pages" aria-label="Pages">
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={13} /> <span>Prev</span>
                </button>
                <button type="button" className="table-pager-btn table-pager-num" aria-current="page">
                  {currentPage}
                </button>
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <span>Next</span> <ChevronRight size={13} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Manage Ticket Priority & Reply Modal */}
      {selectedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '560px',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Support Ticket Details</span>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.1rem 0 0 0', color: '#1e293b' }}>
                  {selectedTicket.ticketId}: {selectedTicket.subject}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Ticket Information Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '0.375rem',
                padding: '0.85rem',
                marginBottom: '1rem',
                fontSize: '0.825rem',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>Client Email:</strong> {selectedTicket.email}
                </div>
                <div>
                  <strong>Department:</strong> {selectedTicket.department}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <strong>Priority:</strong>
                  <select
                    value={selectedTicket.priority}
                    onChange={(e) => handlePriorityChange(selectedTicket, e.target.value)}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.25rem',
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {['Low', 'Medium', 'High', 'Urgent'].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <strong>Status:</strong> {selectedTicket.status}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                <strong>Client Message:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: '#334155', lineHeight: 1.4 }}>
                  {selectedTicket.message || 'No additional client comments.'}
                </p>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Change Ticket Status:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['Open', 'In-Progress', 'Resolved', 'Closed'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedTicket, st)}
                    style={{
                      border: selectedTicket.status === st ? '2px solid #ea580c' : '1px solid #cbd5e1',
                      backgroundColor: selectedTicket.status === st ? '#fff7ed' : '#ffffff',
                      color: selectedTicket.status === st ? '#ea580c' : '#475569',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Response Form */}
            <form onSubmit={handleSendReply}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Admin Response / Internal Remark:
              </label>
              <textarea
                rows={3}
                required
                placeholder="Type response to client or staff remark..."
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.85rem',
                  marginBottom: '0.75rem',
                  resize: 'none',
                }}
              />

              {replySent && (
                <div
                  style={{
                    color: '#16a34a',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Check size={14} />
                  <span>Reply sent to customer email successfully.</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSending || !adminReply.trim()}
                  style={{
                    padding: '0.45rem 1.25rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor: 'var(--desk)',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: isSending || !adminReply.trim() ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    opacity: isSending || !adminReply.trim() ? 0.6 : 1,
                  }}
                >
                  <Send size={13} />
                  {isSending ? 'Sending...' : 'Send Response'}
                </button>
              </div>
            </form>
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
        }}
      >
        <span>Version 2.0</span>
      </footer>
    </div>
  );
}
