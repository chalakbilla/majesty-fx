import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle,
  Download,
  Eye,
  FileSpreadsheet,
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

  // New Client Form
  const [newClient, setNewClient] = useState({
    fullName: '',
    email: '',
    mobile: '',
    country: 'United States',
    portalTier: 'Standard',
    accountNo: '',
  });

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

    const created = {
      id: clients.length + 1,
      tradingAccounts: [newClient.accountNo || `${800100 + clients.length + 1}`],
      fullName: newClient.fullName,
      email: newClient.email,
      portalTier: newClient.portalTier,
      mt5Server: 'MajestyFX-Demo',
      mobile: newClient.mobile || '—',
      country: newClient.country,
      kycStatus: 'Pending',
      password: '••••••••',
      emailKyc: 'Pending',
      cri: 'Low',
    };

    setClients([created, ...clients]);
    setAddModalOpen(false);
    setNewClient({
      fullName: '',
      email: '',
      mobile: '',
      country: 'United States',
      portalTier: 'Standard',
      accountNo: '',
    });
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
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.kycStatus === 'Approved'
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
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-sora font-extrabold text-base text-slate-900">
                Register New Referral Client
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newClient.fullName}
                  onChange={(e) => setNewClient({ ...newClient, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={newClient.mobile}
                    onChange={(e) => setNewClient({ ...newClient, mobile: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newClient.country}
                    onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Portal Tier
                  </label>
                  <select
                    value={newClient.portalTier}
                    onChange={(e) => setNewClient({ ...newClient, portalTier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Pro Zero">Pro Zero</option>
                    <option value="VIP Raw">VIP Raw</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    MT5 Account No
                  </label>
                  <input
                    type="text"
                    value={newClient.accountNo}
                    onChange={(e) => setNewClient({ ...newClient, accountNo: e.target.value })}
                    placeholder="Auto or #800108"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Save & Allocate MT5
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
