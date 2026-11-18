import { CircleCheck, ShieldCheck, Zap } from 'lucide-react';

export const portalThemes = {
  client: {
    label: 'Referral',
    badge: 'Referral',
    clientBadge: 'Client Portal',
    themeColor: '#ea580c',
    badgeBg: '#fff7ed',
    badgeColor: '#ea580c',
    badgeBorder: '#fed7aa',
    gradient: 'linear-gradient(145deg, #f97316 0%, #ea580c 45%, #c2410c 100%)',
  },
  ib1: {
    label: 'Partner 001',
    badge: 'Partner 001',
    clientBadge: 'PARTNER 001',
    themeColor: '#2563eb',
    badgeBg: '#eff6ff',
    badgeColor: '#2563eb',
    badgeBorder: '#bfdbfe',
    gradient: 'linear-gradient(145deg, #3b82f6 0%, #2563eb 45%, #1d4ed8 100%)',
  },
  ib2: {
    label: 'Partner 002',
    badge: 'Partner 002',
    clientBadge: 'PARTNER 002',
    themeColor: '#7c3aed',
    badgeBg: '#faf5ff',
    badgeColor: '#7c3aed',
    badgeBorder: '#e9d5ff',
    gradient: 'linear-gradient(145deg, #8b5cf6 0%, #7c3aed 45%, #5b21b6 100%)',
  },
  ib3: {
    label: 'Partner 003',
    badge: 'Partner 003',
    clientBadge: 'PARTNER 003',
    themeColor: '#059669',
    badgeBg: '#ecfdf5',
    badgeColor: '#059669',
    badgeBorder: '#a7f3d0',
    gradient: 'linear-gradient(145deg, #10b981 0%, #059669 45%, #064e3b 100%)',
  },
};

export const defaultBullets = [
  'Real-time MT4/MT5 bridge & LP liquidity aggregation',
  'Instant crypto USDT (TRC20/ERC20) & wire treasury queues',
  'Automated client KYC & tiered risk compliance scoring',
  'Multi-tier Introducing Broker (IB) automated rebate engine',
];

export default function AuthLeftPanel({
  portal = 'client',
  theme,
  className = '',
  title = 'Institutional Trading Operations. Settled with absolute precision.',
  description = 'Unified command center for multi-asset trading, automated KYC compliance, MT4/MT5 bridge liquidity, and instant treasury settlements.',
  bullets = defaultBullets,
  badgeText = 'Majesty FX Institutional Infrastructure',
  custodyTitle = 'Tier-1 Regulated Custody & Liquidity',
  custodyText = 'Client capital segregated in top-tier financial institutions.',
}) {
  const currentTheme = theme || portalThemes[portal] || portalThemes.client;

  return (
    <div
      className={`hidden lg:flex lg:w-1/2 min-h-screen text-white p-10 xl:p-16 flex-col justify-center relative overflow-y-auto box-border transition-all duration-500 ${className}`}
      style={{
        background: currentTheme.gradient,
      }}
    >
      <div className="max-w-[560px] w-full mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 text-white" />
          <span>{badgeText}</span>
        </div>

        <h1 className="font-sora text-3xl xl:text-4xl 2xl:text-[44px] font-extrabold leading-[1.18] tracking-tight text-white mb-5">
          {title}
        </h1>

        <p className="text-white/90 text-sm xl:text-base leading-relaxed mb-8">
          {description}
        </p>

        <div className="space-y-3.5 mb-10">
          {bullets.map((b) => (
            <div key={b} className="flex items-start gap-3">
              <CircleCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
              <span className="text-sm xl:text-[15px] font-medium text-white/95">{b}</span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-white">{custodyTitle}</div>
            <div className="text-xs text-white/80 mt-0.5">{custodyText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
