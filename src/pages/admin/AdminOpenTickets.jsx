import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  Download,
  MessageSquare,
  X,
  Check,
  CheckCircle,
  Send,
  ChevronDown,
} from 'lucide-react';


// seed data lives in src/data/json (defaultMockOpenTickets)

export default function AdminOpenTickets() {
  const { items: allTickets, update: updateTicket } = useCollection('supportTickets');
  const tickets = useMemo(
    () => allTickets.filter((t) => !['RESOLVED', 'CLOSED'].includes(String(t.status).toUpperCase())),
    [allTickets]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // UPDATE: resolving moves the ticket to the Closed Support page
  const handleResolveTicket = (ticketId) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (!target) return;

    updateTicket(ticketId, { status: 'Resolved', lastReply: new Date().toLocaleString() });

    setSuccessToast('Ticket marked as Resolved and email confirmation sent!');
    setTimeout(() => {
      setSelectedTicket(null);
      setSuccessToast('');
    }, 1000);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    setSuccessToast('Reply dispatched to client via Hostinger SMTP email alert.');
    setReplyText('');
    setTimeout(() => {
      setSelectedTicket(null);
      setSuccessToast('');
    }, 1000);
  };

  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return tickets.filter((t) => {
      if (t.status === 'RESOLVED' || t.status === 'CLOSED') return false;
      if (!q) return true;
      return (
        (t.client && t.client.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q)) ||
        (t.id && String(t.id).toLowerCase().includes(q)) ||
        (t.subject && t.subject.toLowerCase().includes(q)) ||
        (t.department && t.department.toLowerCase().includes(q))
      );
    });
  }, [tickets, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / rowsPerPage));
  const pageStart = filteredTickets.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const pageEnd = Math.min(filteredTickets.length, currentPage * rowsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleExportCSV = () => {
    if (filteredTickets.length === 0) return;

    const headers = [
      'Ticket ID',
      'Client',
      'Email',
      'Subject',
      'Department',
      'Priority',
      'Assigned To',
      'Status',
      'Created At',
    ];

    const escapeVal = (v) => {
      const s = String(v ?? '');
      return `"${s.replace(/"/g, '""')}"`;
    };

    const rows = filteredTickets.map((t) => [
      escapeVal(t.id),
      escapeVal(t.client),
      escapeVal(t.email),
      escapeVal(t.subject),
      escapeVal(t.department),
      escapeVal(t.priority),
      escapeVal(t.assignedTo),
      escapeVal(t.status),
      escapeVal(t.created),
    ]);

    const csvContent = [headers.map(escapeVal).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `open_support_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Card matching media_1795114433482_87ec9ccf.png */}
      <div className="relative bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] overflow-hidden transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <h1 className="text-[1.5rem] sm:text-2xl md:text-[1.85rem] font-extrabold tracking-tight leading-tight text-slate-900 m-0">
              <span>Open Support</span>{' '}
              <span className="text-orange-600 font-black" style={{ color: 'rgb(234, 88, 12)' }}>
                Tickets
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed m-0">
              Manage client inquiries, MT5 issues, and priority communications
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease',
              }}
            >
              <Download size={14} />
              <span>Export Tickets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Pending Tickets Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Blue Banner Header matching exact screenshot */}
        <div
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            fontSize: '1.05rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span>Active Pending Tickets ({filteredTickets.length})</span>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search tickets..."
              style={{
                borderRadius: '0.25rem',
                border: 'none',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                color: '#1e293b',
                outline: 'none',
                width: '200px',
                backgroundColor: '#ffffff',
              }}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="data-table data-table--plain" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <div className="data-table-scroll" style={{ overflowX: 'auto' }}>
            <table className="data-table-grid" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    TICKET ID
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    CLIENT
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    SUBJECT
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    DEPARTMENT
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PRIORITY
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ASSIGNED TO
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    CREATED
                  </th>
                  <th style={{ padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                      No open support tickets matching your search query.
                    </td>
                  </tr>
                ) : (
                  paginatedTickets.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                      {/* Ticket ID */}
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb', fontSize: '0.85rem' }}>
                        {t.id}
                      </td>

                      {/* Client */}
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>
                        {t.client}
                      </td>

                      {/* Subject */}
                      <td style={{ padding: '0.75rem 1rem', color: '#334155', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 500 }}>
                        {t.subject}
                      </td>

                      {/* Department */}
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.825rem', textTransform: 'lowercase' }}>
                        {t.department}
                      </td>

                      {/* Priority */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            letterSpacing: '0.025em',
                            textTransform: 'uppercase',
                            backgroundColor:
                              t.priority === 'HIGH' || t.priority === 'URGENT'
                                ? '#fee2e2'
                                : t.priority === 'MEDIUM'
                                ? '#fef3c7'
                                : '#dcfce7',
                            color:
                              t.priority === 'HIGH' || t.priority === 'URGENT'
                                ? '#991b1b'
                                : t.priority === 'MEDIUM'
                                ? '#92400e'
                                : '#166534',
                          }}
                        >
                          {t.priority}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.825rem' }}>
                        {t.assignedTo}
                      </td>

                      {/* Created */}
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
                        {t.created}
                      </td>

                      {/* Action Button matching screenshot */}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(t)}
                          title="Reply & Resolve Ticket"
                          aria-label="Reply & Resolve Ticket"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            border: '1px solid #bfdbfe',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <MessageSquare size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer matching screenshot */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              fontSize: '0.8rem',
              color: '#64748b',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              Showing <strong style={{ color: '#0f172a', fontWeight: 700 }}>{pageStart}</strong> to{' '}
              <strong style={{ color: '#0f172a', fontWeight: 700 }}>{pageEnd}</strong> of{' '}
              <strong style={{ color: '#0f172a', fontWeight: 700 }}>{filteredTickets.length}</strong> entries
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Rows</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '0.2rem 0.4rem',
                    fontSize: '0.78rem',
                    color: '#334155',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: currentPage <= 1 ? '#94a3b8' : '#334155',
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  &lt; Prev
                </button>

                <button
                  type="button"
                  style={{
                    border: 'none',
                    backgroundColor: 'rgb(124, 58, 237)',
                    color: '#ffffff',
                    borderRadius: '4px',
                    minWidth: '26px',
                    height: '26px',
                    padding: '0 0.45rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'default',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {currentPage}
                </button>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: currentPage >= totalPages ? '#94a3b8' : '#334155',
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply & Resolve Ticket Modal matching exact architecture */}
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
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicket.id} - {selectedTicket.subject}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Client: {selectedTicket.client} ({selectedTicket.email}) • Dept: {selectedTicket.department}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem' }}
              >
                <X size={18} />
              </button>
            </div>

            {successToast ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#16a34a' }}>
                <Check size={36} style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700 }}>{successToast}</div>
              </div>
            ) : (
              <>
                {/* Client Message */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.85rem',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#64748b',
                      textTransform: 'uppercase',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Client Message
                  </div>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: '#334155', lineHeight: 1.5 }}>
                    {selectedTicket.message}
                  </p>
                </div>

                {/* Response Form */}
                <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#475569',
                        display: 'block',
                        marginBottom: '0.3rem',
                      }}
                    >
                      Official Staff Response
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type official reply to send to client email..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '0.6rem',
                        fontSize: '0.825rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => handleResolveTicket(selectedTicket.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        backgroundColor: '#dcfce7',
                        border: '1px solid #86efac',
                        color: '#15803d',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <CheckCircle size={14} />
                      <span>Mark Resolved</span>
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(null)}
                        style={{
                          padding: '0.45rem 0.95rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.45rem 1rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <Send size={14} />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Version Footer matching exact screenshot */}
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
