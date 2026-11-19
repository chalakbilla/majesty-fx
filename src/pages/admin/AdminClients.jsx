import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle,
  Download,
  Eye,
  FileSpreadsheet,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-react';
import { initialClients } from '../../data/adminData.js';

export default function AdminClients() {
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailKycFilter, setEmailKycFilter] = useState('');
  const [kycStatusFilter, setKycStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Institutional Client Form
  const defaultNewClient = {
    fullName: '',
    email: '',
    mobile: '',
    country: 'India',
    city: '',
    accountType: 'STANDARD',
    portalTier: 'referrer',
    referralCode: '',
    markEmailVerified: true,
    markKycVerified: false,
  };
  const [newClient, setNewClient] = useState(defaultNewClient);

  const handleResetFilters = () => {
    setSearchQuery('');
    setEmailKycFilter('');
    setKycStatusFilter('');
    setStartDate('');
    setEndDate('');
  };

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!newClient.fullName || !newClient.email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const nextId = clients.length ? Math.max(...clients.map((c) => Number(c.id) || 0)) + 1 : 1;
      const accountNo = `${800100 + nextId}`;
      const created = {
        id: nextId,
        tradingAccounts: [accountNo],
        fullName: newClient.fullName,
        email: newClient.email,
        portalTier:
          newClient.portalTier === 'ib1'
            ? 'IB1 Partner'
            : newClient.portalTier === 'ib2'
              ? 'IB2 Partner'
              : 'Standard',
        mt5Server: newClient.portalTier === 'ib2' ? 'TheKFMarket-Live' : 'MajestyFX-Trade',
        mobile: newClient.mobile || '—',
        country: newClient.country,
        city: newClient.city || '—',
        accountType: newClient.accountType,
        kycStatus: newClient.markKycVerified ? 'Verified' : 'Pending',
        emailKyc: newClient.markEmailVerified ? 'Verified' : 'Pending',
        password: '••••••••',
        cri: 'Low',
      };

      setClients([created, ...clients]);
      setIsSubmitting(false);
      setAddModalOpen(false);
      setNewClient(defaultNewClient);
    }, 450);
  };

  const filteredClients = clients.filter((c) => {
    if (emailKycFilter && c.emailKyc !== emailKycFilter) return false;
    if (kycStatusFilter && c.kycStatus !== kycStatusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAcc = c.tradingAccounts.some((acc) => acc.toLowerCase().includes(q));
      return (
        matchAcc ||
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.mobile.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportExcel = () => {
    const headers = ['#', 'Trading Accounts', 'Full Name', 'Email', 'Tier', 'Server', 'Mobile', 'Country', 'KYC Status', 'Email KYC', 'CRI'];
    const rows = filteredClients.map((c) => [
      c.id,
      `"${c.tradingAccounts.join(', ')}"`,
      `"${c.fullName}"`,
      c.email,
      c.portalTier,
      c.mt5Server,
      `"${c.mobile}"`,
      `"${c.country}"`,
      c.kycStatus,
      c.emailKyc,
      c.cri,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `referral_clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header matching screenshot media_1795073708042_6e0e4863.jpg */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium mb-1">
            Admin Console › <span className="text-slate-600">Referral Clients Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="text-slate-900">Referral Clients</span>{' '}
            <span className="text-orange-600">Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dedicated management of Direct & Referral retail traders and MajestyFX MT5 allocations.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/kyc-documents"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>KYC Desk</span>
          </Link>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Client</span>
          </button>
        </div>
      </div>

      {/* Filter Card matching screenshot media_1795073708042_6e0e4863.jpg */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, phone, country or MT5 account..."
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={emailKycFilter}
              onChange={(e) => setEmailKycFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
            >
              <option value="">Email KYC Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={kycStatusFilter}
              onChange={(e) => setKycStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer"
            >
              <option value="">KYC Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-600"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export to Excel!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table matching screenshot media_1795073708042_6e0e4863.jpg */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">TRADING ACCOUNTS</th>
                <th className="py-3 px-4">FULL NAME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-3">PORTAL TIER</th>
                <th className="py-3 px-3">MT5 SERVER</th>
                <th className="py-3 px-3">MOBILE</th>
                <th className="py-3 px-3">COUNTRY</th>
                <th className="py-3 px-3">KYC STATUS</th>
                <th className="py-3 px-3">PASSWORD</th>
                <th className="py-3 px-3">EMAIL KYC</th>
                <th className="py-3 px-2">CRI</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-16 text-center text-slate-400 font-medium">
                    No clients found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((c, i) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{i + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.tradingAccounts.join(', ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.fullName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{c.email}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{c.portalTier}</td>
                    <td className="py-3 px-3 text-slate-600">{c.mt5Server}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{c.mobile}</td>
                    <td className="py-3 px-3 font-medium">{c.country}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${c.kycStatus === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                      >
                        {c.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">{c.password}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.emailKyc}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500 font-medium">{c.cri}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/trading-accounts"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 p-1"
                        title="View Trading Accounts"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => !isSubmitting && setAddModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '660px',
              maxHeight: 'min(90vh, 740px)',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                flexShrink: 0,
                padding: '1.15rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    border: '1px solid #ffedd5',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Add New Institutional Client
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                    Create account profile & auto-provision MT5 Live Trading Account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isSubmitting && setAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleAddClient}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  overflowY: 'auto',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.15rem',
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={newClient.fullName}
                      onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="trader@domain.com"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* Phone / Mobile */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Phone / Mobile
                    </label>
                    <input
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={newClient.mobile}
                      onChange={(e) => setNewClient({ ...newClient, mobile: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* Country of Residence */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Country of Residence
                    </label>
                    <select
                      value={newClient.country}
                      onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="India">India (IN)</option>
                      <option value="United Arab Emirates">United Arab Emirates (AE)</option>
                      <option value="United Kingdom">United Kingdom (GB)</option>
                      <option value="United States">United States (US)</option>
                      <option value="Singapore">Singapore (SG)</option>
                      <option value="Germany">Germany (DE)</option>
                      <option value="Russia">Russia (RU)</option>
                      <option value="Australia">Australia (AU)</option>
                      <option value="South Africa">South Africa (ZA)</option>
                      <option value="Canada">Canada (CA)</option>
                      <option value="Global">Other / Global</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai, London, Mumbai"
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* MT5 Account Type */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      MT5 Account Type
                    </label>
                    <select
                      value={newClient.accountType}
                      onChange={(e) => setNewClient({ ...newClient, accountType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="STANDARD">Standard Account (1:500 Leverage)</option>
                      <option value="RAW SPREAD">Raw Spread Account (Institutional ECN)</option>
                      <option value="PRO VIP">Pro VIP Account (0.0 Pip Tier)</option>
                    </select>
                  </div>

                  {/* Portal Tier / Destination Network */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Portal Tier / Destination Network
                    </label>
                    <select
                      value={newClient.portalTier}
                      onChange={(e) => setNewClient({ ...newClient, portalTier: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="referrer">Direct Retail / Referrals (MajestyFX-Trade)</option>
                      <option value="ib1">IB1 Partner Network (MajestyFX-Trade)</option>
                      <option value="ib2">IB2 Partner Network (TheKFMarket-Live)</option>
                    </select>
                  </div>

                  {/* Help text */}
                  <div style={{ gridColumn: 'span 2', fontSize: '0.75rem', color: '#64748b' }}>
                    The client receives an email link to set their own portal password. Admins never see client passwords.
                  </div>

                  {/* Referring IB */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Referring IB / Partner Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IB-GOLD-8891 or leave empty"
                      value={newClient.referralCode}
                      onChange={(e) => setNewClient({ ...newClient, referralCode: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>
                </div>

                {/* Verification Checkboxes */}
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    padding: '0.85rem 1.15rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: '#1e293b',
                      fontWeight: 500,
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newClient.markEmailVerified}
                      onChange={(e) => setNewClient({ ...newClient, markEmailVerified: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        backgroundColor: newClient.markEmailVerified ? '#16a34a' : '#ffffff',
                        border: newClient.markEmailVerified ? '1px solid #16a34a' : '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {newClient.markEmailVerified && <Check size={13} color="#ffffff" strokeWidth={3} />}
                    </div>
                    <span>Mark Email as Verified</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: '#1e293b',
                      fontWeight: 500,
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={newClient.markKycVerified}
                      onChange={(e) => setNewClient({ ...newClient, markKycVerified: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        backgroundColor: newClient.markKycVerified ? '#16a34a' : '#ffffff',
                        border: newClient.markKycVerified ? '1px solid #16a34a' : '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {newClient.markKycVerified && <Check size={13} color="#ffffff" strokeWidth={3} />}
                    </div>
                    <span>Mark KYC as Verified</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                }}
              >
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setAddModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.35rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'rgb(124, 58, 237)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Provisioning Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Create Client</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
