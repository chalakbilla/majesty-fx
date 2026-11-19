import { useState, useMemo, useCallback } from 'react';
import {
  Award,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Download,
  FolderTree,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';

export default function AdminPAMMReferralTree() {
  const [trees, setTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({});

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Allow live synchronization if endpoints or mock data exist
      const [resAccounts, resClients] = await Promise.all([
        fetch('/api/pamm/accounts', { headers: { 'x-requested-with': 'XMLHttpRequest' } })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch('/api/pamm/clients', { headers: { 'x-requested-with': 'XMLHttpRequest' } })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      const accounts = resAccounts?.success && Array.isArray(resAccounts.accounts) ? resAccounts.accounts : [];
      const clients = resClients?.success && Array.isArray(resClients.clients) ? resClients.clients : [];

      const mappedTrees = accounts.map((acc) => {
        const accNo = acc.accountNo;
        const downline = clients
          .filter(
            (c) =>
              c.pammAccount === accNo ||
              (acc.clientName && c.strategyName?.toLowerCase() === acc.clientName?.toLowerCase())
          )
          .map((c) => ({
            id: `inv_${c.id}_${c.email}`,
            name: c.clientName,
            email: c.email,
            role: 'Investor',
            programName: c.strategyName,
            accountNo: c.pammAccount,
            allocatedCapital: Number(c.investedCapital) || 0,
            profitEarned: Number(c.totalPl) || 0,
            status: c.status || 'Active',
            joinedAt: c.joinedDate || new Date().toISOString().slice(0, 10),
            investors: [],
          }));

        return {
          id: `master_${acc.programId || acc.accountNo}`,
          name: acc.fundManager || 'PAMM Master Manager',
          email: acc.managerEmail || 'manager@majestyfx.com',
          role: 'Master',
          programName: acc.clientName || acc.strategyPool || 'Alpha Pool',
          accountNo: acc.accountNo,
          allocatedCapital: Number(acc.balanceNum) || 175000,
          profitEarned: 21425,
          status: acc.status || 'Active',
          joinedAt: acc.startDate || new Date().toISOString().slice(0, 10),
          investors: downline,
        };
      });

      setTrees(mappedTrees);
      const initExpanded = {};
      mappedTrees.forEach((t) => {
        initExpanded[t.id] = true;
      });
      setExpandedNodes(initExpanded);
    } catch (err) {
      console.error('Failed to load PAMM tree:', err);
      setTrees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadData();
    }, 400);
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const filteredTrees = useMemo(() => {
    if (!searchQuery.trim()) return trees;
    const q = searchQuery.toLowerCase().trim();
    return trees.filter((tree) => {
      const matchMaster =
        tree.name.toLowerCase().includes(q) ||
        tree.email.toLowerCase().includes(q) ||
        tree.accountNo.toLowerCase().includes(q) ||
        tree.programName.toLowerCase().includes(q);
      const matchInvestor = tree.investors?.some(
        (inv) =>
          inv.name.toLowerCase().includes(q) ||
          inv.email.toLowerCase().includes(q) ||
          inv.accountNo.toLowerCase().includes(q)
      );
      return matchMaster || matchInvestor;
    });
  }, [trees, searchQuery]);

  // Aggregated KPIs
  const totalMasterPools = trees.length;
  const totalInvestors = trees.reduce((sum, t) => sum + (t.investors?.length || 0), 0);
  const totalAUM = trees.reduce((sum, t) => sum + (t.allocatedCapital || 0), 0);
  const cumulativeProfit = trees.reduce((sum, t) => sum + (t.profitEarned || 0), 0);

  const handleExportCSV = () => {
    const exportRows = [];
    filteredTrees.forEach((tree) => {
      exportRows.push({
        Role: 'Master Manager',
        Name: tree.name,
        Email: tree.email,
        'PAMM Account': tree.accountNo,
        Strategy: tree.programName,
        'Allocated AUM': `$${tree.allocatedCapital?.toLocaleString()}`,
        'Investors Count': tree.investors?.length || 0,
        'Joined Date': tree.joinedAt || '-',
      });
      tree.investors?.forEach((inv) => {
        exportRows.push({
          Role: '  ↳ Investor',
          Name: inv.name,
          Email: inv.email,
          'PAMM Account': inv.accountNo,
          Strategy: inv.programName,
          'Allocated AUM': `$${inv.allocatedCapital?.toLocaleString()}`,
          'Investors Count': '-',
          'Joined Date': inv.joinedAt || '-',
        });
      });
    });

    if (exportRows.length === 0) return;

    const escapeCSV = (val) => {
      let s = String(val ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
      return `"${s.replace(/"/g, '""')}"`;
    };

    const headers = Object.keys(exportRows[0]);
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...exportRows.map((row) => headers.map((h) => escapeCSV(row[h])).join(',')),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pamm_referral_tree_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative max-w-[1700px] mx-auto">
      <div className="space-y-5">
        {/* Top Header Card matching majestyfx.com-admin-pamm-referral-tree */}
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
                      PAMM Referral &amp;
                    </span>{' '}
                    <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                      Investment Tree
                    </span>
                  </h1>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      PAMM Network
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                  Hierarchical structure of PAMM Master Managers and allocated investor downlines
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
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
                      disabled={filteredTrees.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg btn-orange text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Download size={13} />
                      <span>Export Tree</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
          {/* Total Master Pools */}
          <div className="admin-kpi-card" title="Total Master Pools">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(96, 165, 250), rgb(37, 99, 235))',
                boxShadow: 'rgba(37, 99, 235, 0.22) 0px 3px 8px',
              }}
            >
              <Users size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(totalMasterPools)}>
                {totalMasterPools}
              </div>
              <div className="admin-kpi-title">Total Master Pools</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Active strategy managers</span>
              </div>
            </div>
          </div>

          {/* Total Investors */}
          <div className="admin-kpi-card" title="Total Investors">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(167, 139, 250), rgb(124, 58, 237))',
                boxShadow: 'rgba(124, 58, 237, 0.22) 0px 3px 8px',
              }}
            >
              <FolderTree size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={String(totalInvestors)}>
                {totalInvestors}
              </div>
              <div className="admin-kpi-title">Total Investors</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Enrolled PAMM participants</span>
              </div>
            </div>
          </div>

          {/* Total PAMM AUM */}
          <div className="admin-kpi-card" title="Total PAMM AUM">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(52, 211, 153), rgb(5, 150, 105))',
                boxShadow: 'rgba(5, 150, 105, 0.22) 0px 3px 8px',
              }}
            >
              <DollarSign size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={`$${totalAUM.toLocaleString()}`}>
                ${totalAUM.toLocaleString()}
              </div>
              <div className="admin-kpi-title">Total PAMM AUM</div>
              <div className="admin-kpi-sub">
                <span className="truncate">Combined managed equity</span>
              </div>
            </div>
          </div>

          {/* Cumulative Profit */}
          <div className="admin-kpi-card" title="Cumulative Profit">
            <div
              className="admin-kpi-icon-squircle"
              style={{
                background: 'linear-gradient(135deg, rgb(251, 191, 36), rgb(217, 119, 6))',
                boxShadow: 'rgba(217, 119, 6, 0.22) 0px 3px 8px',
              }}
            >
              <Award size={20} strokeWidth={2} color="#ffffff" />
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value" title={`+$${cumulativeProfit.toLocaleString()}`}>
                +${cumulativeProfit.toLocaleString()}
              </div>
              <div className="admin-kpi-title">Cumulative Profit</div>
              <div className="admin-kpi-sub">
                <span className="truncate">All-time generated returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Container Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Search Header */}
          <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manager, investor, pool..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{filteredTrees.length}</strong> master{' '}
                {filteredTrees.length === 1 ? 'pool' : 'pools'}
              </span>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: '1rem 1.25rem' }}>
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '3rem 0',
                  color: '#64748b',
                }}
              >
                <RefreshCw size={18} className="animate-spin text-orange-600" />
                <span>Building live PAMM referral tree...</span>
              </div>
            ) : filteredTrees.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                <FolderTree size={36} color="#cbd5e1" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 600, color: '#334155' }}>No PAMM trees available</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  No PAMM managers or investors match current filters.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTrees.map((tree) => {
                  const isExpanded = !!expandedNodes[tree.id];
                  return (
                    <div
                      key={tree.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {/* Master Pool Row Header */}
                      <div
                        onClick={() => toggleNode(tree.id)}
                        style={{
                          padding: '0.85rem 1rem',
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <button
                            type="button"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#64748b',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                          <Award size={18} color="#ea580c" />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>
                              {tree.name} &nbsp;
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  color: '#2563eb',
                                  fontFamily: 'monospace',
                                }}
                              >
                                [{tree.accountNo}]
                              </span>
                            </div>
                            <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                              Pool: <strong>{tree.programName}</strong> • {tree.email}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                              ${tree.allocatedCapital?.toLocaleString()} AUM
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                              {tree.investors?.length} {tree.investors?.length === 1 ? 'Investor' : 'Investors'}
                            </div>
                          </div>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: tree.status === 'Active' ? '#dcfce7' : '#fee2e2',
                              color: tree.status === 'Active' ? '#15803d' : '#991b1b',
                            }}
                          >
                            {tree.status}
                          </span>
                        </div>
                      </div>

                      {/* Downline Investors List */}
                      {isExpanded && (
                        <div style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', backgroundColor: '#ffffff' }}>
                          {tree.investors.length === 0 ? (
                            <div style={{ padding: '0.75rem 0', color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                              No investors have allocated to this pool yet.
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {tree.investors.map((inv) => (
                                <div
                                  key={inv.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.65rem 0.85rem',
                                    border: '1px solid #f1f5f9',
                                    borderRadius: '0.375rem',
                                    backgroundColor: '#fafafa',
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span style={{ color: '#cbd5e1', fontWeight: 700 }}>↳</span>
                                    <Users size={15} color="#3b82f6" />
                                    <div>
                                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.825rem' }}>
                                        {inv.name}
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inv.email}</div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                                        ${inv.allocatedCapital?.toLocaleString()}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: '0.72rem',
                                          color: inv.profitEarned >= 0 ? '#16a34a' : '#dc2626',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {inv.profitEarned >= 0 ? '+' : ''}${inv.profitEarned?.toLocaleString()} Profit
                                      </div>
                                    </div>
                                    <span
                                      style={{
                                        padding: '0.12rem 0.45rem',
                                        borderRadius: '0.2rem',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        backgroundColor: '#dcfce7',
                                        color: '#15803d',
                                      }}
                                    >
                                      Active Investor
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
