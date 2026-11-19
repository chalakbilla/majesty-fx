import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowLeftRight, ArrowRight, BarChart3, ChevronRight, CreditCard, FileCheck, Gem, Landmark, Layers, MailCheck, RefreshCw, Repeat, ShieldCheck, TrendingUp, UserCheck, UserPlus, Users, Wallet, Zap
} from 'lucide-react';

export default function AdminDemo() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const cardsData = [
    {
        "title": "Total Deposits",
        "value": "$0.00",
        "to": "/admin/demo",
        "icon": "Wallet",
        "gradient": "from-emerald-400 to-emerald-600",
        "shadow": "rgba(5, 150, 105, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Withdrawals",
        "value": "$0.00",
        "to": "/admin/demo",
        "icon": "ArrowDown",
        "gradient": "from-rose-400 to-rose-600",
        "shadow": "rgba(225, 29, 72, 0.22) 0px 3px 8px"
    },
    {
        "title": "Net Deposit",
        "value": "$0.00",
        "to": "/admin/demo",
        "icon": "TrendingUp",
        "gradient": "from-sky-400 to-sky-600",
        "shadow": "rgba(2, 132, 199, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Equity",
        "value": "$0.00",
        "to": "/admin/trading-accounts",
        "icon": "Gem",
        "gradient": "from-purple-400 to-purple-600",
        "shadow": "rgba(124, 58, 237, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Credit",
        "value": "$0.00",
        "to": "/admin/demo",
        "icon": "Landmark",
        "gradient": "from-blue-400 to-blue-600",
        "shadow": "rgba(37, 99, 235, 0.22) 0px 3px 8px"
    },
    {
        "title": "Credit Used",
        "value": "$0.00",
        "to": "/admin/demo",
        "icon": "BarChart3",
        "gradient": "from-amber-400 to-amber-600",
        "shadow": "rgba(217, 119, 6, 0.22) 0px 3px 8px"
    },
    {
        "title": "Withdrawable Equity",
        "value": "$0.00",
        "to": "/admin/demo",
        "icon": "CreditCard",
        "gradient": "from-emerald-400 to-emerald-600",
        "shadow": "rgba(5, 150, 105, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Clients",
        "value": "0",
        "to": "/admin/clients",
        "icon": "Users",
        "gradient": "from-sky-400 to-sky-600",
        "shadow": "rgba(2, 132, 199, 0.22) 0px 3px 8px"
    },
    {
        "title": "Trading Accounts",
        "value": "0",
        "to": "/admin/trading-accounts",
        "icon": "UserCheck",
        "gradient": "from-blue-400 to-blue-600",
        "shadow": "rgba(37, 99, 235, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Users",
        "value": "0",
        "to": "/admin/clients",
        "icon": "Users",
        "gradient": "from-purple-400 to-purple-600",
        "shadow": "rgba(124, 58, 237, 0.22) 0px 3px 8px"
    },
    {
        "title": "Active Visitors",
        "value": "1",
        "to": "/admin/clients",
        "icon": "Users",
        "gradient": "from-amber-400 to-amber-600",
        "shadow": "rgba(217, 119, 6, 0.22) 0px 3px 8px"
    },
    {
        "title": "New Users (24H)",
        "value": "0",
        "to": "/admin/clients",
        "icon": "UserPlus",
        "gradient": "from-emerald-400 to-emerald-600",
        "shadow": "rgba(5, 150, 105, 0.22) 0px 3px 8px"
    },
    {
        "title": "KYC Verified Clients",
        "value": "0",
        "to": "/admin/kyc-documents",
        "icon": "ShieldCheck",
        "gradient": "from-emerald-400 to-emerald-600",
        "shadow": "rgba(5, 150, 105, 0.22) 0px 3px 8px"
    },
    {
        "title": "PAMM Accounts",
        "value": "0",
        "to": "/admin/pamm-clients",
        "icon": "Layers",
        "gradient": "from-purple-400 to-purple-600",
        "shadow": "rgba(124, 58, 237, 0.22) 0px 3px 8px"
    },
    {
        "title": "Affiliates",
        "value": "0",
        "to": "/admin/clients",
        "icon": "MailCheck",
        "gradient": "from-amber-400 to-amber-600",
        "shadow": "rgba(217, 119, 6, 0.22) 0px 3px 8px"
    },
    {
        "title": "Copy Trading Accounts",
        "value": "0",
        "to": "/admin/copy-trading",
        "icon": "Repeat",
        "gradient": "from-blue-400 to-blue-600",
        "shadow": "rgba(37, 99, 235, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Trading Accounts",
        "value": "0",
        "to": "/admin/trading-accounts",
        "icon": "Layers",
        "gradient": "from-purple-400 to-purple-600",
        "shadow": "rgba(124, 58, 237, 0.22) 0px 3px 8px"
    },
    {
        "title": "Total Transactions",
        "value": "0",
        "to": "/admin/demo",
        "icon": "ArrowLeftRight",
        "gradient": "from-sky-400 to-sky-600",
        "shadow": "rgba(2, 132, 199, 0.22) 0px 3px 8px"
    },
    {
        "title": "Pending Deposits",
        "value": "0",
        "to": "/admin/demo",
        "icon": "Wallet",
        "gradient": "from-amber-400 to-amber-600",
        "shadow": "rgba(217, 119, 6, 0.22) 0px 3px 8px"
    },
    {
        "title": "Approved Deposits",
        "value": "0",
        "to": "/admin/demo",
        "icon": "TrendingUp",
        "gradient": "from-emerald-400 to-emerald-600",
        "shadow": "rgba(5, 150, 105, 0.22) 0px 3px 8px"
    },
    {
        "title": "Rejected Deposits",
        "value": "0",
        "to": "/admin/demo",
        "icon": "ArrowDown",
        "gradient": "from-rose-400 to-rose-600",
        "shadow": "rgba(225, 29, 72, 0.22) 0px 3px 8px"
    },
    {
        "title": "Pending Withdrawals",
        "value": "0",
        "to": "/admin/demo",
        "icon": "Gem",
        "gradient": "from-amber-400 to-amber-600",
        "shadow": "rgba(217, 119, 6, 0.22) 0px 3px 8px"
    },
    {
        "title": "Approved Withdrawals",
        "value": "0",
        "to": "/admin/demo",
        "icon": "Landmark",
        "gradient": "from-sky-400 to-sky-600",
        "shadow": "rgba(2, 132, 199, 0.22) 0px 3px 8px"
    },
    {
        "title": "Rejected Withdrawals",
        "value": "0",
        "to": "/admin/demo",
        "icon": "BarChart3",
        "gradient": "from-rose-400 to-rose-600",
        "shadow": "rgba(225, 29, 72, 0.22) 0px 3px 8px"
    }
];

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Wallet': return <Wallet className="w-5 h-5 text-white" />;
      case 'ArrowDown': return <ArrowDown className="w-5 h-5 text-white" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-white" />;
      case 'Gem': return <Gem className="w-5 h-5 text-white" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-white" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-white" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-white" />;
      case 'Users': return <Users className="w-5 h-5 text-white" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-white" />;
      case 'UserPlus': return <UserPlus className="w-5 h-5 text-white" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-white" />;
      case 'Layers': return <Layers className="w-5 h-5 text-white" />;
      case 'MailCheck': return <MailCheck className="w-5 h-5 text-white" />;
      case 'Repeat': return <Repeat className="w-5 h-5 text-white" />;
      case 'ArrowLeftRight': return <ArrowLeftRight className="w-5 h-5 text-white" />;
      default: return <Wallet className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Card */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0">
            <Link className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap" to="/admin">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Referral Desk Portal</span>
          </nav>

          {/* Heading + Action Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold">Referral Desk</span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight">Portal</span>
                </h1>
                <span className="text-slate-600 font-medium text-xs sm:text-sm">
                  Referral Desk Gateway (MajestyFX-Trade)
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Dedicated administration command center for Referral &amp; Direct retail traders, affiliate networks, and MajestyFX MT5 accounts.
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to="/admin/clients"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>View Clients (Referral Desk)</span>
                </Link>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                title="Refresh page data"
                aria-label="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Attention Required Card */}
      <div className="bg-white rounded-2xl border border-orange-200 shadow-[0_10px_25px_-5px_rgba(234,88,12,0.08),0_4px_6px_-2px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Amber Banner Header */}
        <div className="p-3.5 sm:px-5 bg-gradient-to-r from-orange-50 to-rose-50 border-b border-orange-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="inline-flex items-center justify-center shrink-0 w-7 h-7 rounded-full bg-[#ea580c] text-white shadow-[0_2px_4px_rgba(234,88,12,0.3)]">
              <Zap className="w-4 h-4 text-white" />
            </span>
            <div className="min-w-0">
              <span className="text-[0.95rem] font-bold text-orange-950 block sm:inline">
                Attention Required: 2 Pending Operational Requests (Referral Desk)
              </span>
              <span className="block text-xs text-orange-800 sm:mt-0.5">
                Requests awaiting compliance verification and payout processing
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center shrink-0 gap-1.5 px-3 py-1.5 rounded-lg border border-orange-300 bg-white text-orange-900 text-xs font-semibold hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh queues</span>
          </button>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          <div className="p-4 rounded-xl border-[1.5px] border-blue-400 bg-sky-50 flex flex-col justify-between gap-3 w-full">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-[38px] h-[38px] rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Pending KYC Documents</div>
                  <div className="text-xs text-slate-500">Account identity &amp; address verification</div>
                </div>
              </div>
              <span className="bg-blue-600 text-white text-[0.8rem] font-bold px-2.5 py-0.5 rounded-full">
                2
              </span>
            </div>
            <div className="text-[0.8rem] text-slate-600 font-medium">
              <span>2 Pending Operational Requests.</span>
            </div>
            <Link
              to="/admin/kyc-documents"
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-[0.8125rem] font-semibold text-decoration-none shadow-[0_2px_6px_rgba(37,99,235,0.3)] transition-colors"
            >
              <span>Review KYC Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. 24 KPI Cards in .admin-grid-4 */}
      <div className="admin-grid-4">
        {cardsData.map((c, i) => (
          <Link
            key={i}
            to={c.to}
            title={c.title}
            className="admin-kpi-card group"
          >
            <div
              className={`admin-kpi-icon-squircle bg-gradient-to-br ${c.gradient}`}
              style={{ boxShadow: c.shadow }}
            >
              {renderIcon(c.icon)}
            </div>
            <div className="admin-kpi-content">
              <div className="admin-kpi-value">{c.value}</div>
              <div className="admin-kpi-title">{c.title}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* 4. Pending Tables */}
      <div className="flex flex-col gap-8">
        {/* Deposits Table */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Pending Deposits (0)
            </h2>
          </div>
          <div className="data-table">
            <div className="data-table-scroll">
              <table className="data-table-grid" data-cards="">
                <thead>
                  <tr>
                    <th>CLIENTS</th>
                    <th>SERVER</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>TX ID</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>PROOF</th>
                    <th className="text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={9} className="data-table-empty">
                      No pending deposits found for Referral Desk.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Withdrawals Table */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">
              Pending Withdrawals (0)
            </h2>
          </div>
          <div className="data-table">
            <div className="data-table-scroll">
              <table className="data-table-grid" data-cards="">
                <thead>
                  <tr>
                    <th>CLIENTS</th>
                    <th>SERVER</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>PAY TO</th>
                    <th>COMMENT</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th className="text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={9} className="data-table-empty">
                      No pending withdrawals found for Referral Desk.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
