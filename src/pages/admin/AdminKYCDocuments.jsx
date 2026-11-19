import { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  FileSpreadsheet,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

export default function AdminKYCDocuments() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      clientName: 'Sofia Al-Mansoor',
      email: 'sofia.mansoor@demo.example.com',
      referredBy: 'Majesty Demo Partner 1',
      documentType: 'national_id',
      frontSide: null,
      backSide: null,
      status: 'PENDING',
      registeredDate: '2026-11-16 09:42',
      remark: '-',
    },
    {
      id: 2,
      clientName: 'David Miller',
      email: 'david.miller@demo.example.com',
      referredBy: 'Majesty Demo Partner 2',
      documentType: 'passport',
      frontSide: null,
      backSide: null,
      status: 'PENDING',
      registeredDate: '2026-11-15 09:42',
      remark: '-',
    },
    {
      id: 3,
      clientName: 'Alexander Wright',
      email: 'alex.wright@demo.example.com',
      referredBy: 'Majesty Demo Partner 1',
      documentType: 'passport',
      frontSide: null,
      backSide: null,
      status: 'APPROVED',
      registeredDate: '2026-10-18 09:42',
      remark: '-',
    },
  ]);

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [adminRemark, setAdminRemark] = useState('');

  const counts = {
    all: documents.length,
    pending: documents.filter((d) => d.status === 'PENDING').length,
    approved: documents.filter((d) => d.status === 'APPROVED').length,
    rejected: documents.filter((d) => d.status === 'REJECTED').length,
  };

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === 'PENDING' && doc.status !== 'PENDING') return false;
    if (activeTab === 'APPROVED' && doc.status !== 'APPROVED') return false;
    if (activeTab === 'REJECTED' && doc.status !== 'REJECTED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.clientName.toLowerCase().includes(q) ||
        doc.email.toLowerCase().includes(q) ||
        doc.referredBy.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApprove = (id) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'APPROVED', remark: adminRemark || 'Verified' } : d
      )
    );
    setPreviewDoc(null);
    setAdminRemark('');
  };

  const handleReject = (id) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'REJECTED', remark: adminRemark || 'Rejected' } : d
      )
    );
    setPreviewDoc(null);
    setAdminRemark('');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'DESK', 'EMAIL', 'CLIENT NAME', 'DOCUMENT TYPE', 'STATUS', 'REGISTERED DATE', 'ADMIN REMARK'];
    const rows = filteredDocs.map((d) => [
      d.id,
      d.email,
      d.email,
      `"${d.clientName}"`,
      d.documentType,
      d.status,
      d.registeredDate,
      `"${d.remark}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kyc_documents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
      {/* Header Banner - Matching scratch/kyc_documents/index.html */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0">
            <span className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">Admin Console</span>
            <span className="text-slate-400 mx-0.5">›</span>
            <span className="whitespace-nowrap text-slate-800 font-semibold">KYC Documents</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    KYC Verification
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Desk
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Review, inspect high-resolution ID proofs, and manage compliance approvals in real-time.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export to CSV</span>
              </button>
              <button
                aria-label="Refresh"
                onClick={handleRefresh}
                className="btn-secondary absolute top-3 right-3 sm:static !p-2 sm:!px-[0.85rem] sm:!py-2 transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  border: '1px solid rgb(203, 213, 225)',
                  backgroundColor: 'rgb(255, 255, 255)',
                  color: 'rgb(51, 65, 85)',
                  cursor: 'pointer',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
                  transition: '0.15s',
                }}
                title="Refresh page data"
                type="button"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar - Exactly matching scratch/kyc_documents/index.html */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="inline-flex bg-slate-100/90 p-1 rounded-lg gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-emerald-100 text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <span>All</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === 'ALL' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PENDING'
                ? 'bg-amber-100 text-amber-800 shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span>Pending</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-800'
              }`}
            >
              {counts.pending}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'APPROVED'
                ? 'bg-blue-100 text-blue-800 shadow-xs'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <span>Approved</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.approved}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'REJECTED'
                ? 'bg-rose-100 text-rose-800 shadow-xs'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <span>Rejected</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activeTab === 'REJECTED' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.rejected}
            </span>
          </button>
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* KYC Table - Exactly matching scratch/kyc_documents/index.html */}
      <div className="data-table">
        <div className="data-table-scroll">
          <table className="data-table-grid" data-cards="">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>DESK</th>
                <th>EMAIL</th>
                <th>CLIENT NAME</th>
                <th>DOCUMENT TYPE</th>
                <th style={{ textAlign: 'center' }}>FRONT SIDE</th>
                <th style={{ textAlign: 'center' }}>BACK SIDE</th>
                <th>STATUS</th>
                <th>REGISTERED DATE</th>
                <th>ADMIN REMARK</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    No KYC documents found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid rgb(241, 245, 249)', backgroundColor: 'rgb(255, 255, 255)' }}>
                    <td data-label="#" style={{ padding: '0.65rem', color: 'rgb(100, 116, 139)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      {idx + 1}
                    </td>
                    <td data-label="DESK" style={{ padding: '0.65rem', fontWeight: 600, color: 'rgb(37, 99, 235)' }}>
                      {doc.email}
                    </td>
                    <td data-label="EMAIL" style={{ padding: '0.65rem' }}>
                      <div style={{ fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{doc.clientName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgb(241, 245, 249)',
                            color: 'rgb(71, 85, 105)',
                            border: '1px solid rgb(226, 232, 240)',
                          }}
                        >
                          Ref by:
                          <strong style={{ marginLeft: '0.2rem', color: 'rgb(234, 88, 12)' }}>{doc.referredBy}</strong>
                        </span>
                      </div>
                    </td>
                    <td data-label="CLIENT NAME" style={{ padding: '0.65rem', color: 'rgb(51, 65, 85)', fontWeight: 500 }}>
                      {doc.documentType}
                    </td>
                    <td data-label="DOCUMENT TYPE" style={{ textAlign: 'center', padding: '0.65rem' }}>
                      <span className="text-xs text-slate-400 italic">Not provided</span>
                    </td>
                    <td data-label="FRONT SIDE" style={{ textAlign: 'center', padding: '0.65rem' }}>
                      <span className="text-xs text-slate-400 italic">Not provided</span>
                    </td>
                    <td data-label="BACK SIDE" style={{ padding: '0.65rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          backgroundColor:
                            doc.status === 'APPROVED'
                              ? 'rgb(220, 252, 231)'
                              : doc.status === 'REJECTED'
                              ? 'rgb(254, 226, 226)'
                              : 'rgb(254, 243, 199)',
                          color:
                            doc.status === 'APPROVED'
                              ? 'rgb(22, 101, 52)'
                              : doc.status === 'REJECTED'
                              ? 'rgb(153, 27, 27)'
                              : 'rgb(146, 64, 14)',
                        }}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td data-label="STATUS" style={{ padding: '0.65rem', color: 'rgb(100, 116, 139)', fontSize: '0.8rem' }}>
                      {doc.registeredDate}
                    </td>
                    <td data-label="REGISTERED DATE" style={{ padding: '0.65rem', color: 'rgb(71, 85, 105)', fontSize: '0.8rem' }}>
                      <span style={{ color: 'rgb(148, 163, 184)' }}>{doc.remark}</span>
                    </td>
                    <td data-actions="" data-label="ACTIONS" style={{ textAlign: 'right', padding: '0.65rem' }}>
                      <div className="admin-action-group">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="admin-action-btn admin-action-btn-view"
                          title="View / Review Document"
                        >
                          <Eye style={{ width: '14px', height: '14px' }} />
                        </button>
                        {doc.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(doc.id)}
                              className="admin-action-btn admin-action-btn-approve"
                              title="Approve KYC"
                            >
                              <Check style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(doc.id)}
                              className="admin-action-btn admin-action-btn-reject"
                              title="Reject KYC"
                            >
                              <X style={{ width: '14px', height: '14px' }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pager */}
        <div className="table-pager">
          <span className="table-pager-info">
            Showing <strong>1</strong> to <strong>{filteredDocs.length}</strong> of{' '}
            <strong>{documents.length}</strong> entries
          </span>
          <div className="table-pager-controls">
            <label className="table-pager-size">
              <span>Rows</span>
              <select aria-label="Rows per page">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </label>
            <nav aria-label="Pages" className="table-pager-pages">
              <button aria-label="Previous page" className="table-pager-btn" disabled type="button">
                <ChevronLeft style={{ width: '13px', height: '13px' }} />
                <span>Prev</span>
              </button>
              <button aria-current="page" className="table-pager-btn table-pager-num" type="button">
                1
              </button>
              <button aria-label="Next page" className="table-pager-btn" disabled type="button">
                <span>Next</span>
                <ChevronRight style={{ width: '13px', height: '13px' }} />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {previewDoc && (
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
          onClick={() => setPreviewDoc(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '440px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={18} color="#ea580c" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                  Review KYC Document
                </h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Client:</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{previewDoc.clientName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Email:</span>
                <span style={{ fontFamily: 'monospace' }}>{previewDoc.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Document Type:</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{previewDoc.documentType}</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                Compliance Remarks
              </label>
              <textarea
                rows={3}
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                placeholder="Enter remarks or verification notes..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', fontSize: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleReject(previewDoc.id)}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer' }}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleApprove(previewDoc.id)}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer' }}
              >
                Approve KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
