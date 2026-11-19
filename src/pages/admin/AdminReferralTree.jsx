import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  GitBranch,
  Network,
  RefreshCw,
  Search,
  UserCheck,
  Users,
} from 'lucide-react';
import { ibPartners, initialClients } from '../../data/adminData.js';

export default function AdminReferralTree() {
  const [partners, setPartners] = useState(ibPartners);
  const [expandedNodes, setExpandedNodes] = useState({ 1: true, 2: true, 3: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const all = {};
    partners.forEach((p) => {
      all[p.id] = true;
    });
    setExpandedNodes(all);
  };

  const handleCollapseAll = () => {
    setExpandedNodes({});
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filteredPartners = partners.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchesPartner =
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q);

    const clientMatches = initialClients.some(
      (c) =>
        (c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
        c.partnerCode === p.code
    );

    return matchesPartner || clientMatches;
  });

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
              <span className="text-slate-900 font-extrabold">IB</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Referral Tree</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Interactive downline hierarchy, multi-tier rebate attribution, and network depth visualizer
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh network"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(37,99,235,0.22)]">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">7</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Total Network Clients</div>
            <div className="text-[11px] text-slate-400">Full Downline Reach</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(124,58,237,0.22)]">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">0</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Referred Sub-Clients</div>
            <div className="text-[11px] text-slate-400">Downline Accounts</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_8px_rgba(5,150,105,0.22)]">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 leading-none">7</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Root Partners</div>
            <div className="text-[11px] text-slate-400">Direct Master Affiliates</div>
          </div>
        </div>
      </div>

      {/* Main Hierarchy Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#7c3aed]" />
            <h2 className="font-sora font-extrabold text-sm sm:text-base text-slate-900">
              Affiliate Network Hierarchy
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search partner or downline..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:ring-1 focus:ring-orange-500 w-44 sm:w-56"
              />
            </div>
            <button
              type="button"
              onClick={handleExpandAll}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Tree Nodes */}
        <div className="p-4 sm:p-6 space-y-4">
          {filteredPartners.map((partner) => {
            const isExpanded = !!expandedNodes[partner.id];
            const children = initialClients.filter((c) => c.partnerCode === partner.code || c.id % 3 === partner.id % 3);

            return (
              <div
                key={partner.id}
                className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all"
              >
                {/* Node Header */}
                <div
                  onClick={() => toggleNode(partner.id)}
                  className="p-4 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#7c3aed]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sora font-extrabold text-sm text-slate-900">
                          {partner.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {partner.code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{partner.email}</div>
                    </div>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                      Direct <strong className="text-slate-900 ml-1">{partner.clientsCount}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                      Network <strong className="text-slate-900 ml-1">0</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                      Volume <strong className="text-slate-900 ml-1">{partner.volume}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 font-bold text-emerald-700">
                      Commission <strong className="ml-1">{partner.totalCommission}</strong>
                    </span>
                  </div>
                </div>

                {/* Expanded Children Downline */}
                {isExpanded && (
                  <div className="p-4 bg-white border-t border-slate-100 pl-8 sm:pl-12 space-y-2.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Direct Downline Accounts ({children.length})
                    </div>
                    {children.length === 0 ? (
                      <div className="text-xs text-slate-400 italic py-2">
                        No direct client accounts registered under this referral node yet.
                      </div>
                    ) : (
                      children.map((client) => (
                        <div
                          key={client.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {client.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{client.fullName}</div>
                              <div className="text-slate-500 font-mono text-[11px]">{client.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                              {client.tradingAccounts?.[0] || 'MT5 Demo'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active Trader
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
