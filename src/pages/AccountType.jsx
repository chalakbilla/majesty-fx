import { ArrowRight, Award, CircleCheck, CreditCard, Crown, Gem, Globe, Headset, Layers, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA.jsx';
import Education from '../components/Education.jsx';
import FAQ from '../components/FAQ.jsx';
import Reviews from '../components/Reviews.jsx';
import { FeatureGrid, PageHero, Section, SectionHead, SpecTable, SplitCard, Tile } from '../components/route/blocks.jsx';
import laptop from '../assets/routes/phone-laptop.jpg';

const highlights = [
  [Award, 'orange', 'Standard', 'Perfect for new traders — 0 commission and steady spreads.', 'Low Deposit'],
  [Zap, 'blue', 'Raw ECN', 'Get raw pricing, fast execution, and institutional liquidity.', 'Raw Spreads'],
  [Crown, 'ink', 'VIP Elite', 'Priority support, ultra-tight spreads, and personalized rebates.', 'Exclusive'],
  [Gem, 'green', 'Islamic', '100% Swap-free accounts designed to meet Sharia compliance.', 'Swap-Free'],
  [Globe, 'purple', 'Pro Account', 'Tailored spreads and flexible leverage for institutional-style clients.', 'Advanced'],
];

const plans = [
  {
    tag: 'MOST ACCESSIBLE', icon: Layers, tone: 'peach', name: 'Standard',
    text: 'Perfect for swing traders and retail investors seeking zero commission and predictable spreads.',
    rows: [['Spreads From', '1.5 pips'], ['Commission', '$0 (None)', 'good'], ['Max Leverage', '1:500'], ['Min Deposit', '$100']],
    features: ['200+ Tradable Forex & CFD Assets', 'MetaTrader 5 & WebTrader Access', 'Instant Order Execution (<30ms)', 'Swap-Free / Islamic Option Available'],
    cta: 'Open Standard',
  },
  {
    tag: 'INSTITUTIONAL RAW', tagTone: 'green', icon: Zap, tone: 'blue', name: 'Raw ECN', recommended: true,
    text: 'Engineered for scalpers, news traders, and EA algorithms demanding genuine 0.0 pip raw interbank spreads.',
    rows: [['Spreads From', '0.0 pips', 'accent'], ['Commission', '$3.50 per side'], ['Max Leverage', '1:400'], ['Min Deposit', '$200']],
    features: ['Direct DMA / ECN Order Matching', 'Zero Restriction on Scalping & EAs', 'Dedicated Account Manager Included', 'Level II Market Depth on MT5'],
    accentIndex: 2,
    cta: 'Open Raw ECN',
  },
  {
    tag: 'HIGH VOLUME', icon: Award, tone: 'gray', name: 'VIP Elite',
    text: 'Tailored for high-volume traders, fund managers, and prop desks requiring private liquidity.',
    rows: [['Spreads From', '0.3 pips'], ['Commission', 'Low / Zero volume tiered', 'good'], ['Max Leverage', '1:1000'], ['Min Deposit', '$5,000']],
    features: ['Priority VIP Manager & Fast Track Support', 'VIP Priority Execution Venue', 'Complimentary Enterprise VPS', 'Custom Rebates & Flexible Spreads'],
    allGood: true, outline: true,
    cta: 'Inquire for VIP',
  },
];

const columns = [
  { key: 'feature', label: 'Feature', render: (v) => <strong>{v}</strong> },
  { key: 'standard', label: 'Standard' },
  { key: 'raw', label: 'Raw ECN', render: (v) => <strong className="accent">{v}</strong> },
  { key: 'vip', label: 'VIP', render: (v) => <strong>{v}</strong> },
];
const rows = [
  ['Minimum Deposit', '$100', '$200', '$5,000'],
  ['Spreads (from)', '1.5 pips', '0.0 pips', '0.3 pips'],
  ['Commission', 'None', '$3.5 per side', 'Low / Zero based on volume'],
  ['Leverage (up to)', '1:500', '1:400', '1:1000'],
  ['Execution', 'Market', 'ECN', 'VIP Priority'],
  ['Platform', 'MT5, Web', 'MT5, Web', 'MT5, Mobile'],
  ['Support', '24/5 Live Chat', 'Dedicated Manager', 'Priority VIP Manager'],
].map(([feature, standard, raw, vip]) => ({ feature, standard, raw, vip }));

const advantages = [
  { icon: Zap, tone: 'solid', title: 'Lightning-Fast Execution', text: 'Trade with sub-30ms latency across Majesty FX’s optimized data centers for unmatched precision.' },
  { icon: ShieldCheck, tone: 'solid', title: 'Secure Client Funds', text: 'Your capital is protected through segregated accounts and top-tier global banking partners.' },
  { icon: Globe, tone: 'solid', title: 'Global Market Access', text: 'Access FX, Metals, Indices, Energies, and Cryptos — all through one unified account.' },
  { icon: Headset, tone: 'solid', title: 'Dedicated Support', text: 'Get 24/5 multilingual assistance through live chat, WhatsApp, and email — whenever you need it.' },
];

const telemetry = [['99.97%', 'Server Uptime (%)', 100], ['28ms', 'Avg. Execution Speed (ms)', 96], ['180+', 'Countries Served', 90], ['45,000+', 'Active Traders', 84]];

export default function AccountType() {
  return (
    <>
      <PageHero
        crumbs={['Accounts', 'Account Types']}
        icon={CreditCard}
        badge="ACCOUNT SELECTION"
        title="Choose the Account Type That [Fits Your Trading Style]"
        sub="Whether you’re new to trading or an experienced algorithm developer, Majesty FX offers accounts designed for speed, transparency, and pro execution."
      />

      <Section tone="cream" className="is-tight">
        <SectionHead title="Account [Highlights]" sub="Choose the account type that matches your trading strategy — from Standard to VIP." />
        <div className="marquee">
          <div className="marquee-track to-left">
            {[...highlights, ...highlights].map(([Icon, tone, title, text, chip], i) => (
              <article key={i} className="rp-card rp-highlight">
                <Icon className={`tone-${tone}`} />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="rp-chip">{chip}</span>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHead icon={Award} tag="ACCOUNT PLANS" title="Featured Trading [Accounts]" sub="Compare our accounts below and pick the optimal execution model for your capital and style." />
        <div className="rp-grid rp-cols-3">
          {plans.map((p) => (
            <article key={p.name} className={`rp-card rp-plan is-left${p.recommended ? ' is-popular' : ''}`}>
              {p.recommended && <span className="rp-ribbon-tag is-right">RECOMMENDED</span>}
              <div className="rp-plan-top">
                <span className={`rp-badge${p.tagTone ? ` is-${p.tagTone}` : ''}`}>{p.tag}</span>
                <Tile icon={p.icon} tone={p.tone} />
              </div>
              <h3>{p.name}</h3>
              <p className="rp-muted">{p.text}</p>
              <dl className="rp-rows">
                {p.rows.map(([label, value, kind]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd className={kind}>{value}</dd>
                  </div>
                ))}
              </dl>
              <ul className={`rp-plan-list${p.allGood ? ' is-good' : ''}`}>
                {p.features.map((f, i) => (
                  <li key={f} className={i === p.accentIndex ? 'accent' : undefined}><CircleCheck /> {f}</li>
                ))}
              </ul>
              <Link to="/register" className={`btn btn-lg btn-block ${p.outline ? 'btn-outline' : 'btn-primary'}`}>{p.cta} <ArrowRight /></Link>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={Layers} tag="SPECIFICATION MATRIX" title="Compare Our [Account Types]" sub="All accounts include fast execution and access to MetaTrader 5 and WebTrader." />
        <SpecTable columns={columns} rows={rows} />
        <p className="fine-print rp-note is-left">* Leverage and spread values depend on instruments and market conditions.</p>
      </Section>

      <Section>
        <SectionHead icon={Zap} tag="THE MAJESTY ADVANTAGE" title="Why Trade with [Majesty FX]" sub="Experience institutional-grade technology, unmatched transparency, and global market access." />
        <FeatureGrid items={advantages} round />
      </Section>

      <SplitCard
        title="Start Trading Live [Markets Today]"
        text="Join thousands of global traders who trust Majesty FX for execution speed, transparency, and fund security."
        actions={
          <>
            <Link to="/register" className="btn btn-primary btn-lg">Open Live Account <ArrowRight /></Link>
            <Link to="/register" className="btn btn-outline btn-lg">Try Free Demo</Link>
          </>
        }
      >
        <img src={laptop} alt="Trading on a laptop and phone" />
      </SplitCard>

      <Section tone="white">
        <SectionHead icon={Sparkles} tag="LIVE TELEMETRY" title="Trusted by Traders [Worldwide]" sub="Real data. Real execution. Real trust — powering thousands of active accounts every day." />
        <div className="rp-grid rp-cols-4">
          {telemetry.map(([value, label, fill]) => (
            <article key={label} className="rp-card rp-telemetry">
              <b>{value}</b>
              <span>{label}</span>
              <i style={{ '--fill': `${fill}%` }} />
            </article>
          ))}
        </div>
      </Section>

      <Education />
      <Reviews />
      <FAQ />
      <CTA />
    </>
  );
}
