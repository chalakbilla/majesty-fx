import { useState } from 'react';
import { ArrowRight, Award, BarChart3, Bitcoin, Clock, Flame, Globe, Landmark, Layers, Scale, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA.jsx';
import FAQ from '../components/FAQ.jsx';
import { PageHero, Section, SectionHead, SplitCard, StatsStrip, Tile } from '../components/route/blocks.jsx';
import phoneLaptop from '../assets/routes/phone-laptop.jpg';

const ticks = [
  ['EURUSD', '1.0862', 0.14], ['XAUUSD', '2,408.30', -0.12], ['US100', '18,924.5', 0.31], ['BTCUSD', '62,950.0', 1.02],
  ['UKOIL', '84.12', -0.22], ['GBPUSD', '1.2985', 0.18], ['GER40', '19,520.4', 0.24],
];

const stats = [
  { icon: Zap, value: '0.0', label: 'Raw spreads (acct)' },
  { icon: TrendingUp, value: '1:500', label: 'Max leverage*' },
  { icon: Clock, value: '<30ms', label: 'Typical latency' },
  { icon: Globe, value: '200+', label: 'Tradable symbols' },
];

const filters = ['All', 'Forex', 'Metals', 'Indices', 'Energies', 'Crypto', 'Bonds'];

const assets = [
  ['EURUSD', 'Forex', TrendingUp, 'blue', 'Major pair with deep liquidity and tight pricing.', '0.0–1.0'],
  ['GBPUSD', 'Forex', Zap, 'blue', 'London/NY overlap and clean intraday ranges.', '0.6–1.4'],
  ['XAUUSD', 'Metals', Award, 'amber', 'Gold CFD for macro hedging and momentum trading.', '15–25'],
  ['XAGUSD', 'Metals', Sparkles, 'amber', 'Silver CFD with dynamic volatility and liquidity.', '2.0–3.0'],
  ['US100', 'Indices', BarChart3, 'green', 'Tech-heavy US index ideal for active scalpers.', '1.0–1.5'],
  ['GER40', 'Indices', Globe, 'green', 'European bellwether with strong trending ranges.', '1.2–1.8'],
  ['USOIL', 'Energies', Flame, 'red', 'Crude oil CFD driven by geopolitical events.', '0.04–0.08'],
  ['UKOIL', 'Energies', Flame, 'red', 'Trade Brent crude with deep global liquidity.', '0.05–0.09'],
  ['BTCUSD', 'Crypto', Bitcoin, 'purple', '24/7 CFD access to Bitcoin with instant fills.', 'Variable'],
  ['ETHUSD', 'Crypto', Layers, 'purple', 'Smart contract pioneer with deep order book.', 'Variable'],
  ['US10Y', 'Bonds', Landmark, 'slate', 'Benchmark US Treasury bond for macro strategies.', '0.02–0.05'],
  ['DE10Y', 'Bonds', Scale, 'slate', 'German Bund CFD, key European fixed-income gauge.', '0.03–0.06'],
].map(([symbol, group, icon, tone, text, spread]) => ({ symbol, group, icon, tone, text, spread }));

const contracts = [
  { icon: TrendingUp, symbol: 'EURUSD', rows: ['FX Major', '0.0–1.0', '100,000 units', '0.01 lot', 'up to 1:500'] },
  { icon: Award, symbol: 'XAUUSD', rows: ['Precious Metal', '15–25', '100 oz', '0.01 lot', 'up to 1:200'] },
  { icon: BarChart3, symbol: 'US100', rows: ['Equity Index', '1.0–1.5', '1 contract', '0.10 lot', 'up to 1:200'] },
  { icon: Bitcoin, symbol: 'BTCUSD', rows: ['Crypto CFD', 'Variable', '1 BTC', '0.01 lot', 'up to 1:50'] },
];
const contractLabels = ['Class', 'Spread', 'Contract', 'Min Trade', 'Leverage'];

export default function Markets() {
  const [group, setGroup] = useState('All');
  const visible = assets.filter((a) => group === 'All' || a.group === group);

  return (
    <>
      <PageHero
        crumbs={['Markets & Assets']}
        icon={BarChart3}
        badge="MARKET ASSETS"
        title="Trade the Instruments That [Move the World]"
        sub="A clean, responsive markets hub with smart grids, institutional pricing, and 200+ tradable assets."
      />

      <div className="rp-ribbon">
        <div className="marquee-track to-left">
          {[...ticks, ...ticks].map(([sym, price, change], i) => (
            <span key={i} className="rp-ribbon-item">
              <i className="rp-dot" />
              <b>{sym}</b> {price}
              <em className={change >= 0 ? 'up' : 'down'}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</em>
            </span>
          ))}
        </div>
      </div>

      <StatsStrip items={stats} />

      <Section tone="soft">
        <SectionHead icon={BarChart3} tag="MARKET CATEGORIES" title="Explore Global [Market Categories]" sub="Discover global trading opportunities — filter asset type and explore live markets." />
        <div className="rp-filters">
          {filters.map((f) => (
            <button key={f} className={f === group ? 'is-active' : undefined} onClick={() => setGroup(f)}>{f}</button>
          ))}
        </div>
        <div className="rp-grid rp-cols-5">
          {visible.map(({ symbol, icon, tone, text, spread }) => (
            <article key={symbol} className="rp-card rp-asset">
              <Tile icon={icon} tone={`solid-${tone}`} />
              <h3>{symbol}</h3>
              <p>{text}</p>
              <span className="rp-chip">Spread: {spread}</span>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead icon={ShieldCheck} tag="CONTRACT DETAILS" title="Instrument [Specifications]" sub="Each asset class offers unique margin, leverage, and contract conditions." />
        <div className="rp-grid rp-cols-4">
          {contracts.map(({ icon, symbol, rows }) => (
            <article key={symbol} className="rp-card rp-contract">
              <Tile icon={icon} tone="solid" />
              <h3>{symbol}</h3>
              <dl>
                {contractLabels.map((label, i) => (
                  <div key={label}>
                    <dt>{label}:</dt>
                    <dd className={label === 'Spread' ? 'accent' : undefined}>{rows[i]}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <p className="fine-print rp-note">*Leverage may vary by region and regulatory jurisdiction. Spreads are indicative and subject to live market volatility.</p>
      </Section>

      <SplitCard
        title="Ready to Engage [the Markets?]"
        text="Open a live trading account in minutes or test your algorithmic setups with a free risk-free $100,000 demo."
        actions={
          <>
            <Link to="/register" className="btn btn-primary btn-lg">Open Live Account <ArrowRight /></Link>
            <Link to="/register" className="btn btn-outline btn-lg">Try Free Demo</Link>
          </>
        }
      >
        <img src={phoneLaptop} alt="Trading on a phone beside a laptop" />
      </SplitCard>

      <FAQ />
      <CTA />
    </>
  );
}
