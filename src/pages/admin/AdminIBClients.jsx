import { useState, useMemo } from 'react';
import useCollection from '../../hooks/useCollection.js';
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  RefreshCw,
  Search,
  TrendingUp,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';

// seed data lives in src/data/json (initialClients)

export default function AdminIBClients() {
  const { items: clients, setItems: setClients } = useCollection('ibClients');
  const [activeTab, setActiveTab] = useState('partners'); // 'pending' | 'partners' | 'subclients' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [colVisOpen, setColVisOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('IB Client data synchronized.');
    }, 400);
  };

  const handleApprove = (id) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ibStatus: 'Approved Partner' } : c
      )
    );
    showToast('IB Partner application approved.');
  };

  const handleReject = (id) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ibStatus: 'Rejected' } : c
      )
    );
    showToast('IB Partner application rejected.');
  };

  // Tab counts
  const pendingCount = clients.filter((c) => c.ibStatus === 'Pending Application').length;
  const partnersCount = clients.filter((c) => c.type === 'partner').length;
  const subClientsCount = clients.filter((c) => c.type === 'subclient').length;
  const allCount = clients.length;

  // Filtered by tab and search
  const tabFiltered = useMemo(() => {
    let list = clients;
    if (activeTab === 'pending') {
      list = list.filter((c) => c.ibStatus === 'Pending Application');
    } else if (activeTab === 'partners') {
      list = list.filter((c) => c.type === 'partner');
    } else if (activeTab === 'subclients') {
      list = list.filter((c) => c.type === 'subclient');
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.tradeIds.toLowerCase().includes(q)
      );
    }
    return list;
  }, [clients, activeTab, searchQuery]);

  // Export handlers
  const handleExportCSV = () => {
    const headers = [
      '#',
      'Client Name',
      'Email',
      'Country',
      'Phone',
      'Registration Date',
      'Status',
      'IB Status',
      'Parent Email',
      'Trade IDs',
      'Commission Earned',
      'Available Commission',
      'Withdraw Commission',
      'Partners',
      'Commission Status',
    ];
    const rows = tabFiltered.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.country}"`,
      `"${c.phone}"`,
      `"${c.registrationDate}"`,
      c.status,
      `"${c.ibStatus}"`,
      `"${c.parentEmail}"`,
      `"${c.tradeIds}"`,
      c.commissionEarned,
      c.availableCommission,
      c.withdrawCommission,
      c.partners,
      c.commissionStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ib_clients_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported successfully');
  };

  const handleCopy = () => {
    const text = tabFiltered
      .map((c) => `${c.id}\t${c.name}\t${c.email}\t${c.country}\t${c.phone}\t${c.ibStatus}\t${c.commissionEarned}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const tabDescriptions = {
    pending: 'Displaying traders awaiting Introducing Broker review and approval',
    partners: 'Displaying traders who requested or are active IB Partners',
    subclients: 'Displaying retail traders assigned to affiliate parent IBs',
    all: 'Displaying all registered IB partners, applicants, and referred sub-clients',
  };

  const btnDeskStyle = {
    backgroundColor: 'var(--desk)',
    color: 'rgb(255, 255, 255)',
    border: 'none',
    borderRadius: '0.25rem',
    padding: '0.35rem 0.75rem',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
    transition: '0.15s',
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-5">
        {/* SubChild 0: Header Card */}
        <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          />
          <div className="flex flex-col gap-3.5 sm:gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
              <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                    <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                      IB
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Clients
                    </span>
                  </h1>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Manage Introducing Broker partnerships, sub-client hierarchies, and commission entitlements
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh"
                  title="Refresh page data"
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
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SubChild 1: Action Required Banner */}
        {pendingCount > 0 && (
          <div
            style={{
              backgroundColor: 'rgb(255, 251, 235)',
              border: '1px solid rgb(253, 230, 138)',
              borderRadius: '0.625rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: 'rgba(245, 158, 11, 0.1) 0px 1px 3px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgb(254, 243, 199)',
                  color: 'rgb(217, 119, 6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'rgb(146, 64, 14)', fontSize: '0.9375rem' }}>
                  Action Required: {pendingCount} Partner Applications Awaiting Review
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'rgb(180, 83, 9)' }}>
                  Traders have requested Introducing Broker status. Approve to grant referral links and activate commission tracking.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                style={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  color: 'rgb(234, 88, 12)',
                  border: '1px solid var(--desk)',
                  borderRadius: '0.375rem',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Review Pending ({pendingCount})</span>
              </button>
            </div>
          </div>
        )}

        {/* SubChild 2: View IB Clients Data Table Card */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '0.5rem',
            border: '1px solid rgb(226, 232, 240)',
            boxShadow: 'rgba(0, 0, 0, 0.03) 0px 1px 3px',
            overflow: 'hidden',
          }}
        >
          {/* Indigo Top Bar */}
          <div
            style={{
              backgroundColor: 'rgb(67, 56, 202)',
              color: 'rgb(255, 255, 255)',
              padding: '0.85rem 1.25rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>View IB Clients</span>
            <button
              type="button"
              onClick={handleRefresh}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'rgb(255, 255, 255)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                padding: '0.3rem 0.75rem',
                borderRadius: '0.35rem',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Live Data</span>
            </button>
          </div>

          {/* Segmented Filter Tabs */}
          <div
            style={{
              backgroundColor: 'rgb(248, 250, 252)',
              borderBottom: '1px solid rgb(226, 232, 240)',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {/* Tab 1: Pending Review */}
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: '0.15s',
                  border: activeTab === 'pending' ? '1px solid rgb(67, 56, 202)' : '1px solid rgb(203, 213, 225)',
                  backgroundColor: activeTab === 'pending' ? 'rgb(67, 56, 202)' : 'rgb(255, 255, 255)',
                  color: activeTab === 'pending' ? 'rgb(255, 255, 255)' : 'rgb(71, 85, 105)',
                  boxShadow: activeTab === 'pending' ? 'rgba(67, 56, 202, 0.25) 0px 1px 3px' : 'none',
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review</span>
                <span
                  style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: activeTab === 'pending' ? 'rgba(255, 255, 255, 0.25)' : 'rgb(255, 237, 213)',
                    color: activeTab === 'pending' ? 'rgb(255, 255, 255)' : 'rgb(194, 65, 12)',
                  }}
                >
                  {pendingCount}
                </span>
              </button>

              {/* Tab 2: IB Partners & Applicants */}
              <button
                type="button"
                onClick={() => setActiveTab('partners')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: '0.15s',
                  border: activeTab === 'partners' ? '1px solid rgb(67, 56, 202)' : '1px solid rgb(203, 213, 225)',
                  backgroundColor: activeTab === 'partners' ? 'rgb(67, 56, 202)' : 'rgb(255, 255, 255)',
                  color: activeTab === 'partners' ? 'rgb(255, 255, 255)' : 'rgb(71, 85, 105)',
                  boxShadow: activeTab === 'partners' ? 'rgba(67, 56, 202, 0.25) 0px 1px 3px' : 'none',
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>IB Partners & Applicants</span>
                <span
                  style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: activeTab === 'partners' ? 'rgba(255, 255, 255, 0.25)' : 'rgb(226, 232, 240)',
                    color: activeTab === 'partners' ? 'rgb(255, 255, 255)' : 'rgb(51, 65, 85)',
                  }}
                >
                  {partnersCount}
                </span>
              </button>

              {/* Tab 3: Referred Sub-Clients */}
              <button
                type="button"
                onClick={() => setActiveTab('subclients')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: '0.15s',
                  border: activeTab === 'subclients' ? '1px solid rgb(67, 56, 202)' : '1px solid rgb(203, 213, 225)',
                  backgroundColor: activeTab === 'subclients' ? 'rgb(67, 56, 202)' : 'rgb(255, 255, 255)',
                  color: activeTab === 'subclients' ? 'rgb(255, 255, 255)' : 'rgb(71, 85, 105)',
                  boxShadow: activeTab === 'subclients' ? 'rgba(67, 56, 202, 0.25) 0px 1px 3px' : 'none',
                }}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Referred Sub-Clients</span>
                <span
                  style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: activeTab === 'subclients' ? 'rgba(255, 255, 255, 0.25)' : 'rgb(226, 232, 240)',
                    color: activeTab === 'subclients' ? 'rgb(255, 255, 255)' : 'rgb(51, 65, 85)',
                  }}
                >
                  {subClientsCount}
                </span>
              </button>

              {/* Tab 4: All IB Affiliated */}
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: '0.15s',
                  border: activeTab === 'all' ? '1px solid rgb(67, 56, 202)' : '1px solid rgb(203, 213, 225)',
                  backgroundColor: activeTab === 'all' ? 'rgb(67, 56, 202)' : 'rgb(255, 255, 255)',
                  color: activeTab === 'all' ? 'rgb(255, 255, 255)' : 'rgb(71, 85, 105)',
                  boxShadow: activeTab === 'all' ? 'rgba(67, 56, 202, 0.25) 0px 1px 3px' : 'none',
                }}
              >
                <span>All IB Affiliated</span>
                <span
                  style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: activeTab === 'all' ? 'rgba(255, 255, 255, 0.25)' : 'rgb(226, 232, 240)',
                    color: activeTab === 'all' ? 'rgb(255, 255, 255)' : 'rgb(51, 65, 85)',
                  }}
                >
                  {allCount}
                </span>
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'rgb(100, 116, 139)' }}>
              {tabDescriptions[activeTab]}
            </div>
          </div>

          {/* Action Toolbar */}
          <div
            style={{
              padding: '1.25rem 1.25rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={handleCopy} style={btnDeskStyle}>
                  Copy
                </button>
                <button type="button" onClick={handleExportCSV} style={btnDeskStyle}>
                  CSV
                </button>
                <button type="button" onClick={handleExportCSV} style={btnDeskStyle}>
                  Excel
                </button>
                <button type="button" onClick={() => window.print()} style={btnDeskStyle}>
                  PDF
                </button>
                <button type="button" onClick={() => window.print()} style={btnDeskStyle}>
                  Print
                </button>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setColVisOpen((v) => !v)}
                    style={{ ...btnDeskStyle, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span>Column visibility</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'rgb(71, 85, 105)' }}>Search:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder=""
                style={{
                  border: '1px solid rgb(203, 213, 225)',
                  borderRadius: '0.25rem',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '180px',
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
                    <th>#</th>
                    <th>CLIENT NAME</th>
                    <th>EMAIL</th>
                    <th>COUNTRY</th>
                    <th>PHONE</th>
                    <th>REGISTRATION DATE</th>
                    <th>STATUS</th>
                    <th>IB STATUS</th>
                    <th>PARENT EMAIL</th>
                    <th>TRADE IDS</th>
                    <th>COMMISSION EARNED</th>
                    <th>AVAILABLE COMMISSION</th>
                    <th>WITHDRAW COMMISSION</th>
                    <th>PROFIT COMMISSION EARNED</th>
                    <th>PROFIT COMMISSION AVAILABLE</th>
                    <th>PARTNERS</th>
                    <th>COMMISSION STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {tabFiltered.length === 0 ? (
                    <tr>
                      <td colSpan={18} className="data-table-empty">
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'rgb(51, 65, 85)', marginBottom: '0.25rem' }}>
                          No IB clients found
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgb(148, 163, 184)' }}>
                          No accounts match the current filter or search criteria.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tabFiltered.map((c, i) => (
                      <tr
                        key={c.id}
                        style={{
                          borderBottom: '1px solid rgb(241, 245, 249)',
                          backgroundColor: i % 2 === 0 ? 'rgb(255, 255, 255)' : 'rgb(250, 250, 250)',
                        }}
                      >
                        <td data-label="#" style={{ padding: '0.65rem', color: 'rgb(100, 116, 139)' }}>
                          {c.id}
                        </td>
                        <td data-label="CLIENT NAME" style={{ padding: '0.65rem', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>
                          {c.name}
                        </td>
                        <td data-label="EMAIL" style={{ padding: '0.65rem', color: 'rgb(37, 99, 235)' }}>
                          {c.email}
                        </td>
                        <td data-label="COUNTRY" style={{ padding: '0.65rem', color: 'rgb(51, 65, 85)' }}>
                          {c.country}
                        </td>
                        <td data-label="PHONE" style={{ padding: '0.65rem', color: 'rgb(51, 65, 85)' }}>
                          {c.phone}
                        </td>
                        <td data-label="REGISTRATION DATE" style={{ padding: '0.65rem', color: 'rgb(100, 116, 139)' }}>
                          {c.registrationDate}
                        </td>
                        <td data-label="STATUS" style={{ padding: '0.65rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: 'rgb(220, 252, 231)',
                              color: 'rgb(22, 101, 52)',
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td data-label="IB STATUS" style={{ padding: '0.65rem' }}>
                          <span
                            style={{
                              padding: '0.2rem 0.55rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor:
                                c.ibStatus === 'Approved Partner'
                                  ? 'rgb(220, 252, 231)'
                                  : c.ibStatus === 'Rejected'
                                  ? 'rgb(254, 226, 226)'
                                  : 'rgb(254, 243, 199)',
                              color:
                                c.ibStatus === 'Approved Partner'
                                  ? 'rgb(22, 101, 52)'
                                  : c.ibStatus === 'Rejected'
                                  ? 'rgb(185, 28, 28)'
                                  : 'rgb(146, 64, 14)',
                              border:
                                c.ibStatus === 'Approved Partner'
                                  ? '1px solid rgb(187, 247, 208)'
                                  : c.ibStatus === 'Rejected'
                                  ? '1px solid rgb(254, 202, 202)'
                                  : '1px solid rgb(252, 211, 77)',
                            }}
                          >
                            {c.ibStatus}
                          </span>
                        </td>
                        <td data-label="PARENT EMAIL" style={{ padding: '0.65rem', color: 'rgb(100, 116, 139)' }}>
                          <div>{c.parentEmail}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgb(148, 163, 184)' }}>
                            {c.parentRole}
                          </div>
                        </td>
                        <td data-label="TRADE IDS" style={{ padding: '0.65rem', color: 'rgb(15, 23, 42)', fontWeight: 600 }}>
                          {c.tradeIds}
                        </td>
                        <td data-label="COMMISSION EARNED" style={{ padding: '0.65rem', color: 'rgb(22, 163, 74)', fontWeight: 700 }}>
                          {c.commissionEarned}
                        </td>
                        <td data-label="AVAILABLE COMMISSION" style={{ padding: '0.65rem', color: 'rgb(2, 132, 199)', fontWeight: 700 }}>
                          {c.availableCommission}
                        </td>
                        <td data-label="WITHDRAW COMMISSION" style={{ padding: '0.65rem', color: 'rgb(234, 88, 12)', fontWeight: 700 }}>
                          {c.withdrawCommission}
                        </td>
                        <td data-label="PROFIT COMMISSION EARNED" style={{ padding: '0.65rem', color: 'rgb(51, 65, 85)' }}>
                          {c.profitCommissionEarned}
                        </td>
                        <td data-label="PROFIT COMMISSION AVAILABLE" style={{ padding: '0.65rem', color: 'rgb(51, 65, 85)' }}>
                          {c.profitCommissionAvailable}
                        </td>
                        <td data-label="PARTNERS" style={{ padding: '0.65rem', fontWeight: 700, color: 'rgb(67, 56, 202)' }}>
                          {c.partners}
                        </td>
                        <td data-label="COMMISSION STATUS" style={{ padding: '0.65rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: 'rgb(224, 231, 255)',
                              color: 'rgb(55, 48, 163)',
                            }}
                          >
                            {c.commissionStatus}
                          </span>
                        </td>
                        <td
                          data-actions=""
                          data-label="ACTIONS"
                          style={{
                            padding: '0.65rem 0.85rem',
                            position: 'sticky',
                            right: 0,
                            zIndex: 10,
                            backgroundColor: i % 2 === 0 ? 'rgb(255, 255, 255)' : 'rgb(250, 250, 250)',
                            textAlign: 'center',
                          }}
                        >
                          <div className="admin-action-group" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            {c.ibStatus === 'Pending Application' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(c.id)}
                                  aria-label="Approve IB Application"
                                  title="Approve IB Application"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    backgroundColor: 'rgb(22, 163, 74)',
                                    color: 'rgb(255, 255, 255)',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    padding: '0.25rem 0.55rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: '0.15s',
                                  }}
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(c.id)}
                                  aria-label="Reject IB Application"
                                  title="Reject IB Application"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    backgroundColor: 'rgb(220, 38, 38)',
                                    color: 'rgb(255, 255, 255)',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    padding: '0.25rem 0.55rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: '0.15s',
                                  }}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedClient(c)}
                              aria-label="View Details"
                              className="admin-action-btn admin-action-btn-view"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedClient(c)}
                              aria-label="Edit IB Settings"
                              className="admin-action-btn"
                              style={{
                                border: '1px solid rgb(191, 219, 254)',
                                background: 'rgb(239, 246, 255)',
                                color: 'rgb(37, 99, 235)',
                              }}
                              title="Edit IB Settings"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pager matching reference */}
            <div className="table-pager">
              <span className="table-pager-info">
                Showing <strong>{tabFiltered.length > 0 ? 1 : 0}</strong> to{' '}
                <strong>{Math.min(rowsPerPage, tabFiltered.length)}</strong> of{' '}
                <strong>{tabFiltered.length}</strong> clients
              </span>
              <div className="table-pager-controls">
                <label className="table-pager-size">
                  <span>Rows</span>
                  <select
                    aria-label="Rows per page"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </label>
                <nav aria-label="Pages" className="table-pager-pages">
                  <button
                    type="button"
                    aria-label="Previous page"
                    className="table-pager-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    aria-current="page"
                    className="table-pager-btn table-pager-num"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    aria-label="Next page"
                    className="table-pager-btn"
                    disabled
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* SubChild 3: Footer */}
        <footer className="text-center py-4 text-xs text-slate-400">
          <span>Version 2.0</span>
        </footer>
      </div>

      {/* Details / Edit Modal */}
      {selectedClient && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedClient(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                IB Client Details — {selectedClient.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Name</span>
                  <span className="font-bold text-slate-900">{selectedClient.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                  <span className="font-bold text-blue-600">{selectedClient.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="font-medium text-slate-700">{selectedClient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Country</span>
                  <span className="font-medium text-slate-700">{selectedClient.country}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">IB Status</span>
                  <span className="font-bold text-amber-700">{selectedClient.ibStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Trade IDs</span>
                  <span className="font-mono font-bold text-slate-900">{selectedClient.tradeIds}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Commission Earned</span>
                  <span className="font-bold text-emerald-600">{selectedClient.commissionEarned}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Available Commission</span>
                  <span className="font-bold text-blue-600">{selectedClient.availableCommission}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
