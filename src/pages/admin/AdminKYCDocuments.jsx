import { useState } from 'react';
import {
  Check,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Shield,
  X,
  XCircle,
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
      remark: '—',
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
      remark: '—',
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
      remark: 'Verified via biometric scan',
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
        d.id === id ? { ...d, status: 'APPROVED', remark: adminRemark || 'Approved by admin' } : d
      )
    );
    setPreviewDoc(null);
    setAdminRemark('');
  };

  const handleReject = (id) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: 'REJECTED', remark: adminRemark || 'Rejected by compliance desk' } : d
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
    const headers = ['#', 'Client Name', 'Email', 'Referred By', 'Document Type', 'Status', 'Registered Date', 'Remark'];
    const rows = filteredDocs.map((d) => [
      d.id,
      `"${d.clientName}"`,
      d.email,
      `"${d.referredBy}"`,
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
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
              <span className="text-slate-900 font-extrabold">KYC Verification</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Desk</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Review identity and residence verification documents submitted by retail clients and partners.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export to CSV</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh page data"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-[#7c3aed] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.all}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Pending</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.pending}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>Approved</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.approved}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REJECTED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{counts.rejected}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* KYC Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-10">#</th>
                <th className="py-3 px-4">DESK</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">DOCUMENT TYPE</th>
                <th className="py-3 px-4 text-center">FRONT SIDE</th>
                <th className="py-3 px-4 text-center">BACK SIDE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">REGISTERED DATE</th>
                <th className="py-3 px-4">ADMIN REMARK</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                    No KYC documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {doc.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600">
                      {doc.email}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{doc.clientName}</div>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Ref by:{' '}
                          <strong className="text-orange-600 ml-1">{doc.referredBy}</strong>
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono uppercase text-slate-700">
                      {doc.documentType}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 italic text-[11px]">
                      Not provided
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 italic text-[11px]">
                      Not provided
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          doc.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {doc.registeredDate}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {doc.remark}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewDoc(doc);
                            setAdminRemark(doc.remark !== '—' ? doc.remark : '');
                          }}
                          title="View / Review KYC Document"
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {doc.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(doc.id)}
                              title="Approve Document"
                              className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(doc.id)}
                              title="Reject Document"
                              className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
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

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-700">{filteredDocs.length}</span> of{' '}
            <span className="font-bold text-slate-700">{documents.length}</span> entries
          </div>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 text-xs font-semibold disabled:opacity-50"
            >
              Prev
            </button>
            <button type="button" className="px-2.5 py-1 rounded bg-[#7c3aed] text-white text-xs font-bold">
              1
            </button>
            <button
              type="button"
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 bg-white text-slate-400 text-xs font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-orange-600">
                <FileCheck className="w-5 h-5" />
                <h3 className="font-sora font-extrabold text-base text-slate-900">
                  Review KYC Document
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-bold text-slate-800">{previewDoc.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700">{previewDoc.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="font-mono uppercase font-bold text-slate-800">{previewDoc.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold text-amber-600">{previewDoc.status}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Admin Compliance Remarks
                </label>
                <textarea
                  rows={3}
                  value={adminRemark}
                  onChange={(e) => setAdminRemark(e.target.value)}
                  placeholder="Enter verification notes or reason for rejection..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(previewDoc.id)}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(previewDoc.id)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Approve KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
