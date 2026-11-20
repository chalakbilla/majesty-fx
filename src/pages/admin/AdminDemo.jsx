import { useState, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Wallet,
  ArrowDown,
  TrendingUp,
  Gem,
  Landmark,
  BarChart3,
  CreditCard,
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Layers,
  MailCheck,
  Repeat,
  ArrowLeftRight,
  Check,
  X,
  Loader2,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Zap,
  Server,
  Sparkles,
  ChevronRight,
  Copy,
  Coins,
  MessageSquare,
} from 'lucide-react';
import useCollection from '../../hooks/useCollection';
import { computeDashboardMetrics, toNumber } from '../../utils/dashboardMetrics';

const THEME_COLORS = {
  amber: { bg: 'linear-gradient(135deg, #fbbf24, #d97706)', shadow: 'rgba(217, 119, 6, 0.22)' },
  emerald: { bg: 'linear-gradient(135deg, #34d399, #059669)', shadow: 'rgba(5, 150, 105, 0.22)' },
  cyan: { bg: 'linear-gradient(135deg, #38bdf8, #0284c7)', shadow: 'rgba(2, 132, 199, 0.22)' },
  blue: { bg: 'linear-gradient(135deg, #60a5fa, #2563eb)', shadow: 'rgba(37, 99, 235, 0.22)' },
  purple: { bg: 'linear-gradient(135deg, #a78bfa, #7c3aed)', shadow: 'rgba(124, 58, 237, 0.22)' },
  rose: { bg: 'linear-gradient(135deg, #fb7185, #e11d48)', shadow: 'rgba(225, 29, 72, 0.22)' },
};

const PILL_TONES = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
  desk: 'bg-desk-soft text-desk-text border-desk-border',
};

const PILL_DOTS = {
  green: 'bg-emerald-600',
  red: 'bg-rose-600',
  amber: 'bg-amber-500',
  blue: 'bg-blue-600',
  indigo: 'bg-indigo-600',
  purple: 'bg-violet-600',
  teal: 'bg-teal-600',
  slate: 'bg-slate-500',
  desk: 'bg-desk',
};

function Pill({ tone = 'slate', dot, icon, children, title }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-[0.35rem] whitespace-nowrap rounded-md border px-[0.55rem] py-[0.2rem] text-[0.725rem] font-bold leading-4 ${PILL_TONES[tone] || PILL_TONES.slate}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${PILL_DOTS[tone] || PILL_DOTS.slate}`} />}
      {icon}
      {children}
    </span>
  );
}

function StatusPill({ status, label }) {
  const norm = String(status || '').toLowerCase();
  const text = label || String(status || 'Unknown').replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  let tone = 'slate';
  if (/(pending|processing|waiting|submitted|open|in.?progress)/.test(norm)) tone = 'amber';
  else if (/(approved|completed|complete|paid|active|verified|success|resolved|filled)/.test(norm)) tone = 'green';
  else if (/(rejected|failed|cancel|declined|blocked|banned|error)/.test(norm)) tone = 'red';
  else if (/(review|warning|hold)/.test(norm)) tone = 'purple';

  return <Pill tone={tone} dot>{text}</Pill>;
}

function MethodPill({ method }) {
  const raw = String(method || '').replace(/_/g, ' ').trim();
  const clean = raw
    .split(/\s+-\s+/)[0]
    .split(/\s+/)
    .filter((val, i, arr) => i === 0 || val.toLowerCase() !== arr[i - 1].toLowerCase())
    .join(' ');
  const norm = clean.toLowerCase();

  let tone = 'slate';
  let Icon = Wallet;
  if (/(usdt|trc|erc|bep|btc|eth|crypto|wallet|coin)/.test(norm)) {
    tone = 'teal';
    Icon = Coins;
  } else if (/(bank|wire|swift|iban|sepa)/.test(norm)) {
    tone = 'blue';
    Icon = Landmark;
  } else if (/(local|whatsapp|agent|cash)/.test(norm)) {
    tone = 'green';
    Icon = MessageSquare;
  } else if (/(card|visa|master)/.test(norm)) {
    tone = 'purple';
    Icon = CreditCard;
  } else if (/(internal|transfer)/.test(norm)) {
    tone = 'indigo';
    Icon = ArrowLeftRight;
  }

  return (
    <Pill tone={tone} icon={<Icon size={11} />} title={raw !== clean ? raw : undefined}>
      {clean || '—'}
    </Pill>
  );
}

function ClientCell({ name, email }) {
  return (
    <div className="min-w-0 leading-tight">
      <div className="truncate font-semibold text-slate-900">{name || email || '—'}</div>
      {name && email && <div className="truncate text-[11px] text-slate-500">{email}</div>}
    </div>
  );
}

function AccountChip({ login }) {
  if (login == null || login === '') return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
      #{String(login).replace(/^#/, '')}
    </span>
  );
}

function Money({ amount, direction = 'neutral', currency = 'USD' }) {
  const val = Math.abs(toNumber(amount)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const color = direction === 'in' ? 'text-emerald-600' : direction === 'out' ? 'text-rose-600' : 'text-slate-900';
  const prefix = direction === 'in' ? '+' : direction === 'out' ? '−' : '';
  return (
    <span className={`whitespace-nowrap font-bold tabular-nums ${color}`}>
      {prefix}{currency === 'USD' ? '$' : ''}{val}{currency !== 'USD' ? ` ${currency}` : ''}
    </span>
  );
}

function AddressCell({ value }) {
  const [copied, setCopied] = useState(false);
  const a = String(value || '').trim();
  if (!a) return <span className="text-slate-400">—</span>;
  const short = a.length > 16 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] text-slate-700" title={a}>
      {short}
      <button
        type="button"
        onClick={() => {
          if (navigator.clipboard?.writeText) {
            navigator.clipboard
              .writeText(a)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              })
              .catch(() => {});
          }
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        aria-label="Copy"
      >
        {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
      </button>
    </span>
  );
}

function DateCell({ value }) {
  if (!value) return <span className="text-slate-400">—</span>;
  const s = new Date(value);
  return Number.isNaN(s.getTime()) ? (
    <span className="text-slate-500">{String(value)}</span>
  ) : (
    <div className="whitespace-nowrap leading-tight">
      <div className="text-slate-800">
        {s.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
      <div className="text-[11px] text-slate-500">
        {s.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}

export default function AdminDemo({ desk: propDesk }) {
  const location = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [notice, setNotice] = useState(null);

  // Collections
  const deposits = useCollection('deposits');
  const withdrawals = useCollection('withdrawals');
  const rejectedDeposits = useCollection('rejectedDeposits');
  const rejectedWithdrawals = useCollection('rejectedWithdrawals');
  const pendingDeposits = useCollection('pendingDeposits');
  const pendingWithdrawals = useCollection('pendingWithdrawals');
  const clients = useCollection('clients');
  const tradingAccounts = useCollection('tradingAccounts');
  const kycDocuments = useCollection('kycDocuments');
  const pammAccounts = useCollection('pammAccounts');
  const ibPartners = useCollection('ibPartners');
  const copyTradingAccounts = useCollection('copyTradingAccounts');
  const creditAdjustments = useCollection('creditAdjustments');

  // Active desk resolution
  const desk = useMemo(() => {
    if (propDesk) return propDesk.toLowerCase();
    const searchParams = new URLSearchParams(location.search);
    const qDesk = searchParams.get('desk') || searchParams.get('tier');
    if (qDesk) return qDesk.toLowerCase();
    const p = location.pathname.toLowerCase();
    if (p.startsWith('/admin/referrals')) return 'referral';
    if (p.startsWith('/admin/ib1')) return 'ib1';
    if (p.startsWith('/admin/ib2')) return 'ib2';
    if (p.startsWith('/admin/demo')) return 'demo';
    if (p.startsWith('/admin/superadmin')) return 'superadmin';
    try {
      const auth = localStorage.getItem('majesty_admin_auth');
      if (auth) {
        const d = (JSON.parse(auth).desk || '').toLowerCase();
        if (['ib1', 'ib2', 'demo', 'referral', 'superadmin'].includes(d)) return d;
      }
    } catch {}
    return 'referral';
  }, [propDesk, location.pathname, location.search]);

  // Desk presentation info
  const deskInfo = useMemo(() => {
    if (desk === 'demo') {
      return {
        title: 'Demo Sandbox',
        highlight: 'Desk',
        description:
          'Isolated sandbox environment with simulated clients, mock trading accounts, and synthetic transactions for UI/UX demonstration.',
        breadcrumbs: [
          { label: 'Admin Console', href: '/admin' },
          { label: 'Demo Sandbox' },
        ],
        badgeText: 'Demo Sandbox (Simulated Gateway)',
        badgeColor: '#7c3aed',
        badgeBg: '#f5f3ff',
        badgeBorder: '#ddd6fe',
        icon: Sparkles,
        viewClientsHref: '/admin/clients?tier=demo',
        clientsQuery: 'tier=demo',
      };
    }
    if (desk === 'ib1') {
      return {
        title: 'Partner 001 Desk',
        highlight: 'Portal',
        description:
          'Dedicated administration command center for Partner 001 Desk partners, clients, and MetaTrader 5 allocations.',
        breadcrumbs: [
          { label: 'Admin Console', href: '/admin' },
          { label: 'Partner 001 Desk Portal' },
        ],
        badgeText: 'Partner 001 Desk Gateway (MajestyFX-Trade)',
        badgeColor: '#2563eb',
        badgeBg: '#eff6ff',
        badgeBorder: '#bfdbfe',
        icon: Server,
        viewClientsHref: '/admin/clients?tier=ib1',
        clientsQuery: 'tier=ib1',
      };
    }
    if (desk === 'ib2') {
      return {
        title: 'Partner 002 Desk',
        highlight: 'Portal',
        description:
          'Dedicated administration command center for Partner 002 Desk partners, clients, and MetaTrader 5 allocations.',
        breadcrumbs: [
          { label: 'Admin Console', href: '/admin' },
          { label: 'Partner 002 Desk Portal' },
        ],
        badgeText: 'Partner 002 Desk Gateway (TheKFMarket-Live)',
        badgeColor: '#7c3aed',
        badgeBg: '#faf5ff',
        badgeBorder: '#ddd6fe',
        icon: Layers,
        viewClientsHref: '/admin/clients?tier=ib2',
        clientsQuery: 'tier=ib2',
      };
    }
    if (desk === 'superadmin') {
      return {
        title: 'Super Admin',
        highlight: 'Console',
        description:
          'Consolidated institutional master command center across all client networks (Referral, Partner desks), MT5 gateways, and risk operations.',
        breadcrumbs: [
          { label: 'Admin Console', href: '/admin' },
          { label: 'Super Admin Master Console' },
        ],
        badgeText: 'Super Admin (All Networks)',
        badgeColor: '#dc2626',
        badgeBg: '#fef2f2',
        badgeBorder: '#fecaca',
        icon: ShieldCheck,
        viewClientsHref: '/admin/clients',
        clientsQuery: '',
      };
    }
    // Default: referral
    return {
      title: 'Referral Desk',
      highlight: 'Portal',
      description:
        'Dedicated administration command center for Referral & Direct retail traders, affiliate networks, and MajestyFX MT5 accounts.',
      breadcrumbs: [
        { label: 'Admin Console', href: '/admin' },
        { label: 'Referral Desk Portal' },
      ],
      badgeText: 'Referral Desk Gateway (MajestyFX-Trade)',
      badgeColor: '#ea580c',
      badgeBg: '#fff7ed',
      badgeBorder: '#fed7aa',
      icon: Users,
      viewClientsHref: '/admin/clients?tier=referrer',
      clientsQuery: 'tier=referrer',
    };
  }, [desk]);

  // Compute metrics
  const metrics = useMemo(
    () =>
      computeDashboardMetrics({
        deposits: deposits.items,
        withdrawals: withdrawals.items,
        rejectedDeposits: rejectedDeposits.items,
        rejectedWithdrawals: rejectedWithdrawals.items,
        pendingDeposits: pendingDeposits.items,
        pendingWithdrawals: pendingWithdrawals.items,
        clients: clients.items,
        tradingAccounts: tradingAccounts.items,
        kycDocuments: kycDocuments.items,
        pammAccounts: pammAccounts.items,
        ibPartners: ibPartners.items,
        copyTradingAccounts: copyTradingAccounts.items,
        creditAdjustments: creditAdjustments.items,
      }),
    [
      deposits.items,
      withdrawals.items,
      rejectedDeposits.items,
      rejectedWithdrawals.items,
      pendingDeposits.items,
      pendingWithdrawals.items,
      clients.items,
      tradingAccounts.items,
      kycDocuments.items,
      pammAccounts.items,
      ibPartners.items,
      copyTradingAccounts.items,
      creditAdjustments.items,
    ]
  );

  const pendingKycCount = useMemo(
    () => kycDocuments.items.filter((k) => String(k.status || '').toLowerCase() === 'pending').length,
    [kycDocuments.items]
  );
  const pendingDepositsCount = pendingDeposits.items.length;
  const pendingWithdrawalsCount = pendingWithdrawals.items.length;
  const pendingTotal = pendingDepositsCount + pendingWithdrawalsCount + pendingKycCount;

  // Partner desks client counts for superadmin
  const deskCounts = useMemo(() => {
    let referral = 0;
    let ib1 = 0;
    let ib2 = 0;
    for (const c of clients.items) {
      const t = (c.clientType || c.tier || '').toLowerCase();
      if (t === 'ib1') ib1++;
      else if (t === 'ib2') ib2++;
      else referral++;
    }
    return { referral, ib1, ib2 };
  }, [clients.items]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const now = () => new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  // Approve / reject actions
  const handleApproveDeposit = async (r) => {
    setActionLoading(r.id);
    try {
      const amountValue = toNumber(r.amount);
      deposits.create({
        requestId: `DEP-${r.id}`,
        clientName: r.client || r.clientName,
        email: r.email || r.clientEmail,
        tradeId: r.server || r.accountLogin,
        amount: r.amount,
        amountValue,
        paymentMethod: r.method || r.paymentMethod || 'Deposit',
        status: 'Approved',
        proof: r.txId || r.proof || r.txHash,
        adminComment: 'Approved from dashboard',
        date: now().split(',').slice(0, 2).join(','),
        time: '',
      });
      pendingDeposits.remove(r.id);
      setNotice(`Deposit #${r.id} approved successfully! Trading account balance updated.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectDeposit = async (r) => {
    setActionLoading(r.id);
    try {
      rejectedDeposits.create({
        requestId: `DEP-${r.id}`,
        dateTime: now(),
        email: r.email || r.clientEmail,
        tradeId: r.server || r.accountLogin,
        amount: r.amount,
        amountNum: toNumber(r.amount),
        paymentMethod: r.method || r.paymentMethod || 'Deposit',
        status: 'rejected',
        proof: r.txId || r.proof || r.txHash,
        adminComment: 'Rejected from dashboard',
      });
      pendingDeposits.remove(r.id);
      setNotice(`Deposit #${r.id} rejected.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveWithdrawal = async (r) => {
    setActionLoading(r.id);
    try {
      withdrawals.create({
        txId: `WD-${r.id}`,
        id: `WD-${r.id}`,
        account: r.server || r.accountLogin,
        clientName: r.client || r.clientName,
        clientEmail: r.email || r.clientEmail,
        method: r.method || r.paymentMethod || 'Crypto',
        amount: r.amount,
        amountNum: Math.abs(toNumber(r.amount)),
        fee: '$0.00',
        status: 'Approved',
        date: now(),
        destination: r.payTo || r.destinationAddress,
        notes: r.comment || r.remarks || '',
      });
      pendingWithdrawals.remove(r.id);
      setNotice(`Withdrawal #${r.id} approved and marked completed.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWithdrawal = async (r) => {
    setActionLoading(r.id);
    try {
      rejectedWithdrawals.create({
        txId: `WD-${r.id}`,
        id: `WD-${r.id}`,
        account: r.server || r.accountLogin,
        clientName: r.client || r.clientName,
        clientEmail: r.email || r.clientEmail,
        method: r.method || r.paymentMethod || 'Crypto',
        amount: r.amount,
        amountNum: Math.abs(toNumber(r.amount)),
        fee: '$0.00',
        status: 'Rejected',
        date: now(),
        walletAddress: r.payTo || r.destinationAddress,
        rejectionReason: 'Declined by treasury desk',
      });
      pendingWithdrawals.remove(r.id);
      setNotice(`Withdrawal #${r.id} rejected.`);
    } finally {
      setActionLoading(null);
    }
  };

  // 24 KPI Cards specification
  const kpiCards = [
    {
      title: 'Total Deposits',
      value: `$${Number(metrics.totalDeposits || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      theme: 'emerald',
      href: '/admin/deposit-history',
    },
    {
      title: 'Total Withdrawals',
      value: `$${Number(metrics.totalWithdrawals || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowDown,
      theme: 'rose',
      href: '/admin/withdraw-history',
    },
    {
      title: 'Net Deposit',
      value: `$${Number(metrics.netDeposit || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      theme: 'cyan',
      href: '/admin/deposit-history',
    },
    {
      title: 'Total Equity',
      value: `$${Number(metrics.totalEquity || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Gem,
      theme: 'purple',
      href: '/admin/trading-accounts',
    },
    {
      title: 'Total Credit',
      value: '$0.00',
      icon: Landmark,
      theme: 'blue',
      href: '/admin/credit-in-out',
    },
    {
      title: 'Credit Used',
      value: '$0.00',
      icon: BarChart3,
      theme: 'amber',
      href: '/admin/credit-in-out',
    },
    {
      title: 'Withdrawable Equity',
      value: `$${Number(metrics.withdrawableEquity || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: CreditCard,
      theme: 'emerald',
      href: '/admin/withdraw-history',
    },
    {
      title: 'Total Clients',
      value: String(metrics.totalClients || 0),
      icon: Users,
      theme: 'cyan',
      href: deskInfo.viewClientsHref,
    },
    {
      title: 'Trading Accounts',
      value: String(metrics.tradingAccounts || 0),
      icon: UserCheck,
      theme: 'blue',
      href: '/admin/trading-accounts',
    },
    {
      title: 'Total Users',
      value: String(metrics.totalUsers || 0),
      icon: Users,
      theme: 'purple',
      href: deskInfo.viewClientsHref,
    },
    {
      title: 'Active Visitors',
      value: String(Math.max(metrics.totalClients || 1, 1)),
      icon: Users,
      theme: 'amber',
      href: deskInfo.viewClientsHref,
    },
    {
      title: 'New Users (24H)',
      value: String(metrics.newUsers24h || 0),
      icon: UserPlus,
      theme: 'emerald',
      href: deskInfo.viewClientsHref,
    },
    {
      title: 'KYC Verified Clients',
      value: String(metrics.kycVerified || 0),
      icon: ShieldCheck,
      theme: 'emerald',
      href: '/admin/kyc-documents',
    },
    {
      title: 'PAMM Accounts',
      value: desk === 'superadmin' ? '2' : '0',
      icon: Layers,
      theme: 'purple',
      href: '/admin/total-pamm-clients',
    },
    {
      title: desk === 'referral' ? 'Affiliates' : 'IB Partners',
      value: String(metrics.affiliates || 0),
      icon: MailCheck,
      theme: 'amber',
      href: desk === 'referral' ? deskInfo.viewClientsHref : '/admin/ib-clients',
    },
    {
      title: 'Copy Trading Accounts',
      value: desk === 'superadmin' ? '2' : '0',
      icon: Repeat,
      theme: 'blue',
      href: '/admin/copy-trading-accounts',
    },
    {
      title: 'Total Trading Accounts',
      value: String(metrics.totalTradingAccounts || 0),
      icon: Layers,
      theme: 'purple',
      href: '/admin/trading-accounts',
    },
    {
      title: 'Total Transactions',
      value: String(metrics.totalTransactions || 0),
      icon: ArrowLeftRight,
      theme: 'cyan',
      href: '/admin/account-ledger',
    },
    {
      title: 'Pending Deposits',
      value: String(pendingDepositsCount),
      icon: Wallet,
      theme: 'amber',
      href: '/admin/deposit-history?tab=Pending',
    },
    {
      title: 'Approved Deposits',
      value: String(metrics.approvedDeposits || 0),
      icon: TrendingUp,
      theme: 'emerald',
      href: '/admin/deposit-history?tab=Approved',
    },
    {
      title: 'Rejected Deposits',
      value: String(metrics.rejectedDeposits || 0),
      icon: ArrowDown,
      theme: 'rose',
      href: '/admin/rejected-deposits',
    },
    {
      title: 'Pending Withdrawals',
      value: String(pendingWithdrawalsCount),
      icon: Gem,
      theme: 'amber',
      href: '/admin/withdraw-history?tab=Pending',
    },
    {
      title: 'Approved Withdrawals',
      value: String(metrics.approvedWithdrawals || 0),
      icon: Landmark,
      theme: 'cyan',
      href: '/admin/withdraw-history?tab=Approved',
    },
    {
      title: 'Rejected Withdrawals',
      value: String(metrics.rejectedWithdrawals || 0),
      icon: BarChart3,
      theme: 'rose',
      href: '/admin/rejected-withdrawals',
    },
  ];

  const BadgeIcon = deskInfo.icon;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            {deskInfo.breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />}
                {crumb.href ? (
                  <Link
                    className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap"
                    to={crumb.href}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="whitespace-nowrap text-slate-800 font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          {/* Heading + Action Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    {deskInfo.title}
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    {deskInfo.highlight}
                  </span>
                </h1>
                <div className="shrink-0">
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: deskInfo.badgeBg,
                      color: deskInfo.badgeColor,
                      border: `1px solid ${deskInfo.badgeBorder}`,
                    }}
                  >
                    <BadgeIcon size={13} stroke={deskInfo.badgeColor} />
                    <span>{deskInfo.badgeText}</span>
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                {deskInfo.description}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <Link
                    to={deskInfo.viewClientsHref}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs transition-colors"
                  >
                    <Users size={15} />
                    <span>
                      {desk === 'superadmin' ? 'Full Client Manager' : `View Clients (${deskInfo.title})`}
                    </span>
                  </Link>
                </div>
              </div>

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
                <RefreshCw size={14} className={`text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Superadmin Desk Cards */}
      {desk === 'superadmin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div
            onClick={() => (window.location.href = '/admin?desk=referral')}
            style={{
              backgroundColor: '#fff7ed',
              border: '1.5px solid #fed7aa',
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:shadow-md"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#ea580c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Referral Desk
              </span>
              <Users size={18} color="#ea580c" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {deskCounts.referral}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>Clients</span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#c2410c' }}>
              Gateway: MajestyFX-Trade (Manager 2000)
            </p>
          </div>

          <div
            onClick={() => (window.location.href = '/admin?desk=ib1')}
            style={{
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:shadow-md"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Partner 001 Desk
              </span>
              <Server size={18} color="#2563eb" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {deskCounts.ib1}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>Clients</span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#1d4ed8' }}>
              Gateway: MajestyFX-Trade (Manager 3000)
            </p>
          </div>

          <div
            onClick={() => (window.location.href = '/admin?desk=ib2')}
            style={{
              backgroundColor: '#faf5ff',
              border: '1.5px solid #ddd6fe',
              borderRadius: '12px',
              padding: '1.15rem 1.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            className="hover:shadow-md"
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#7c3aed',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Partner 002 Desk
              </span>
              <Layers size={18} color="#7c3aed" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {deskCounts.ib2}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>Clients</span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: '#6d28d9' }}>
              Gateway: TheKFMarket-Live (Manager 4321)
            </p>
          </div>
        </div>
      )}

      {/* Action Notification Banner */}
      {notice && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #10b981',
            color: '#065f46',
            borderRadius: '0.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#065f46',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. Attention Required Banner */}
      {pendingTotal > 0 && (
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '1rem',
            border: '1px solid rgb(254, 215, 170)',
            boxShadow: 'rgba(234, 88, 12, 0.08) 0px 10px 25px -5px, rgba(0, 0, 0, 0.02) 0px 4px 6px -2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(90deg, rgb(255, 247, 237), rgb(254, 242, 242))',
              borderBottom: '1px solid rgb(254, 215, 170)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: '0px', flex: '1 1 0%' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--desk, #ea580c)',
                  color: 'rgb(255, 255, 255)',
                  boxShadow: 'rgba(234, 88, 12, 0.3) 0px 2px 4px',
                }}
              >
                <Zap size={15} color="#ffffff" />
              </span>
              <div style={{ minWidth: '0px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgb(154, 52, 18)' }}>
                  Attention Required: {pendingTotal} Pending Operational Requests ({deskInfo.title})
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgb(194, 65, 12)' }}>
                  Requests awaiting compliance verification and payout processing
                </span>
              </div>
            </div>

            <button
              aria-label="Refresh queues"
              onClick={handleRefresh}
              className="!p-2 sm:!px-3 sm:!py-1.5"
              style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                flexShrink: 0,
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid rgb(253, 186, 116)',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(154, 52, 18)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Refresh queues"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh queues</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
            {/* Pending Deposits Card */}
            {pendingDepositsCount > 0 && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #fb923c',
                  backgroundColor: '#fffaf5',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '0.5rem',
                        backgroundColor: '#ffedd5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#c2410c',
                      }}
                    >
                      <Wallet size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Pending Deposits</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bank wire / crypto proof of payment</div>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: 'var(--desk, #ea580c)',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {pendingDepositsCount}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <span>
                    Latest:{' '}
                    <strong>
                      {pendingDeposits.items[0]?.clientName || pendingDeposits.items[0]?.client || 'Trader Request'}
                    </strong>{' '}
                    —{' '}
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      $
                      {Number(
                        pendingDeposits.items[0]?.amountValue ||
                          String(pendingDeposits.items[0]?.amount || 0).replace(/[^0-9.-]/g, '') ||
                          0
                      ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>{' '}
                    ({pendingDeposits.items[0]?.paymentMethod || pendingDeposits.items[0]?.method || 'Deposit'})
                  </span>
                </div>
                <Link
                  to="/admin/deposit-history?tab=Pending"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--desk, #ea580c)',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)',
                  }}
                >
                  <span>Review & Approve Deposits</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Pending Withdrawals Card */}
            {pendingWithdrawalsCount > 0 && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid #f87171',
                  backgroundColor: '#fff5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '0.5rem',
                        backgroundColor: '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#dc2626',
                      }}
                    >
                      <ArrowDown size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Pending Withdrawals</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Payout release verification</div>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {pendingWithdrawalsCount}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <span>
                    Latest:{' '}
                    <strong>
                      {pendingWithdrawals.items[0]?.clientName ||
                        pendingWithdrawals.items[0]?.client ||
                        'Client Request'}
                    </strong>{' '}
                    —{' '}
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>
                      $
                      {Number(
                        pendingWithdrawals.items[0]?.amountNum ||
                          String(pendingWithdrawals.items[0]?.amount || 0).replace(/[^0-9.-]/g, '') ||
                          0
                      ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </span>
                </div>
                <Link
                  to="/admin/withdraw-history?tab=Pending"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  <span>Review & Process Payouts</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Pending KYC Documents Card */}
            {pendingKycCount > 0 && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1.5px solid rgb(96, 165, 250)',
                  backgroundColor: 'rgb(240, 249, 255)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '0.5rem',
                        backgroundColor: 'rgb(219, 234, 254)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgb(37, 99, 235)',
                      }}
                    >
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgb(15, 23, 42)' }}>
                        Pending KYC Documents
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'rgb(100, 116, 139)' }}>
                        Account identity & address verification
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: 'rgb(37, 99, 235)',
                      color: 'rgb(255, 255, 255)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {pendingKycCount}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgb(71, 85, 105)' }}>
                  <span>{pendingKycCount} Pending Operational Requests.</span>
                </div>
                <Link
                  to="/admin/kyc-documents?tab=Pending"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgb(37, 99, 235)',
                    color: 'rgb(255, 255, 255)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: 'rgba(37, 99, 235, 0.3) 0px 2px 6px',
                  }}
                >
                  <span>Review KYC Submissions</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. 24 KPI Cards Grid */}
      <div className="admin-grid-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          const theme = THEME_COLORS[card.theme] || THEME_COLORS.blue;
          return (
            <Link key={idx} to={card.href} className="admin-kpi-card" title={card.title}>
              <div
                className="admin-kpi-icon-squircle"
                style={{ background: theme.bg, boxShadow: `0 3px 8px ${theme.shadow}` }}
              >
                <Icon size={20} color="#ffffff" />
              </div>
              <div className="admin-kpi-content">
                <div className="admin-kpi-value">{card.value}</div>
                <div className="admin-kpi-title">{card.title}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 4. Operational Review Tables */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Pending Deposits Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'rgb(30, 41, 59)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Pending Deposits ({pendingDepositsCount})
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
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDepositsCount === 0 ? (
                    <tr>
                      <td colSpan={9} className="data-table-empty">
                        No pending deposits found for {deskInfo.title}.
                      </td>
                    </tr>
                  ) : (
                    pendingDeposits.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <ClientCell name={item.clientName || item.client} email={item.clientEmail || item.email} />
                        </td>
                        <td>
                          <AccountChip login={item.accountLogin || item.server} />
                        </td>
                        <td>
                          <Money amount={item.amount} direction="in" />
                        </td>
                        <td>
                          <MethodPill method={item.paymentMethod || item.method || 'Deposit'} />
                        </td>
                        <td>
                          <AddressCell value={item.txHash || item.txId || ''} />
                        </td>
                        <td>
                          <DateCell value={item.createdAt || item.date} />
                        </td>
                        <td>
                          <StatusPill status={item.status || 'pending'} />
                        </td>
                        <td>
                          {item.proofUrl || item.proof ? (
                            <a
                              href={item.proofUrl || item.proof}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-desk hover:underline whitespace-nowrap"
                            >
                              View receipt
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-action-group" style={{ display: 'inline-flex' }}>
                            <button
                              type="button"
                              title="Approve Deposit"
                              aria-label="Approve Deposit"
                              onClick={() => handleApproveDeposit(item)}
                              disabled={actionLoading === item.id}
                              className="admin-action-btn admin-action-btn-approve"
                            >
                              {actionLoading === item.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={14} strokeWidth={2.5} />
                              )}
                            </button>
                            <button
                              type="button"
                              title="Reject Deposit"
                              aria-label="Reject Deposit"
                              onClick={() => handleRejectDeposit(item)}
                              disabled={actionLoading === item.id}
                              className="admin-action-btn admin-action-btn-reject"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pending Withdrawals Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'rgb(30, 41, 59)',
              margin: 0,
              letterSpacing: '-0.015em',
            }}
          >
            Pending Withdrawals ({pendingWithdrawalsCount})
          </h2>
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
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingWithdrawalsCount === 0 ? (
                    <tr>
                      <td colSpan={9} className="data-table-empty">
                        No pending withdrawals found for {deskInfo.title}.
                      </td>
                    </tr>
                  ) : (
                    pendingWithdrawals.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <ClientCell name={item.clientName || item.client} email={item.clientEmail || item.email} />
                        </td>
                        <td>
                          <AccountChip login={item.accountLogin || item.server} />
                        </td>
                        <td>
                          <Money
                            amount={item.requestedAmount || item.amount}
                            direction="out"
                            currency={item.currency || 'USD'}
                          />
                        </td>
                        <td>
                          <MethodPill method={item.paymentMethod || item.method || 'Crypto'} />
                        </td>
                        <td>
                          <AddressCell value={item.destinationAddress || item.payTo || ''} />
                        </td>
                        <td
                          className="max-w-[180px] truncate text-xs text-slate-500"
                          title={item.remarks || item.comment || ''}
                        >
                          {item.remarks || item.comment || '—'}
                        </td>
                        <td>
                          <DateCell value={item.createdAt || item.date} />
                        </td>
                        <td>
                          <StatusPill status={item.status || 'pending'} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-action-group" style={{ display: 'inline-flex' }}>
                            <button
                              type="button"
                              title="Approve Withdrawal"
                              aria-label="Approve Withdrawal"
                              onClick={() => handleApproveWithdrawal(item)}
                              disabled={actionLoading === item.id}
                              className="admin-action-btn admin-action-btn-approve"
                            >
                              {actionLoading === item.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Check size={14} strokeWidth={2.5} />
                              )}
                            </button>
                            <button
                              type="button"
                              title="Reject Withdrawal"
                              aria-label="Reject Withdrawal"
                              onClick={() => handleRejectWithdrawal(item)}
                              disabled={actionLoading === item.id}
                              className="admin-action-btn admin-action-btn-reject"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* IB Commission Withdrawal Requests (when not referral desk) */}
        {desk !== 'referral' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'rgb(30, 41, 59)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              IB Commission Withdrawal Requests
            </h2>
            <div className="data-table">
              <div className="data-table-scroll">
                <table className="data-table-grid" data-cards="">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>EMAIL</th>
                      <th>COMMISSION AMOUNT</th>
                      <th>TYPE</th>
                      <th>WALLET ADDRESS</th>
                      <th>NETWORK</th>
                      <th>DATE</th>
                      <th style={{ textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="data-table-empty">
                        No pending commission requests found for {deskInfo.title}.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pending Copy Trading Requests (superadmin only) */}
        {desk === 'superadmin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'rgb(30, 41, 59)',
                margin: 0,
                letterSpacing: '-0.015em',
              }}
            >
              Pending Copy Trading Requests
            </h2>
            <div className="data-table">
              <div className="data-table-scroll">
                <table className="data-table-grid" data-cards="">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>USER EMAIL</th>
                      <th>MASTER ACCOUNT</th>
                      <th>STRATEGY</th>
                      <th>ALLOCATION</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={8} className="data-table-empty">
                        No pending copy trading requests found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
