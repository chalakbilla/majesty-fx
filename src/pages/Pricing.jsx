import { ArrowRight, Award, BarChart3, Check, Clock, Layers, Percent, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ.jsx';
import { Calculator } from '../components/Accounts.jsx';
import { PageHero, Section, SectionHead, SpecTable } from '../components/route/blocks.jsx';
import phoneLaptop from '../assets/routes/phone-laptop.jpg';

const plans = [
  { name: 'Standard', price: '$0', cta: 'Open Standard', features: ['Spreads from 1.0 pip', 'No commission', 'Leverage up to 1 : 500', 'MT5 & WebTrader'] },
  { name: 'Raw ECN', price: '$200', cta: 'Open Raw ECN', popular: true, features: ['Spreads from 0.0 pip', '$3.5 per side per lot', 'Execution Speed < 30 ms', 'Advanced charting & EAs', '24 / 5 Dedicated Support'] },
  { name: 'VIP', price: '$5,000', cta: 'Join VIP', features: ['Personal Account Manager', 'Low / Zero Commission', 'Priority Execution Routing', 'Custom Spreads Available', 'Exclusive Market Insights'] },
];

const bold = (v) => <strong>{v}</strong>;
const hl = (v) => <strong className="accent">{v}</strong>;

const spreadColumns = [
  { key: 'instrument', label: 'Instrument', render: bold },
  { key: 'standard', label: 'Standard Spread' },
  { key: 'raw', label: 'Raw ECN Spread', render: hl },
  { key: 'vip', label: 'VIP Spread', render: bold },
  { key: 'fee', label: 'Commission (per side)' },
];
const spreadRows = [
  ['EUR / USD', 'From 1.0 pip', 'From 0.0 pip', 'From 0.2 pip', '$3.50'],
  ['XAU / USD (Gold)', 'From 20 pips', 'From 15 pips', 'From 12 pips', '$3.50'],
  ['US100 Index', 'From 1.5 pts', 'From 1.0 pts', 'From 0.8 pts', 'Zero'],
  ['BTC / USD', 'From 35.0', 'From 25.0', 'From 20.0', 'Variable'],
  ['GBP / USD', 'From 1.2 pips', 'From 0.2 pips', 'From 0.3 pips', '$3.50'],
  ['USD / JPY', 'From 1.1 pips', 'From 0.1 pips', 'From 0.2 pips', '$3.50'],
  ['USOIL (Crude)', 'From 0.05', 'From 0.03', 'From 0.02', 'Zero'],
].map(([instrument, standard, raw, vip, fee]) => ({ instrument, standard, raw, vip, fee }));

const matrixColumns = [
  { key: 'feature', label: 'Features & Specs', render: bold },
  { key: 'standard', label: 'Standard' },
  { key: 'raw', label: 'Raw ECN', render: hl },
  { key: 'vip', label: 'VIP' },
];
const matrixRows = [
  ['Raw Interbank Spreads', 'From 1.0 pips', 'From 0.0 pips', 'From 0.0 pips'],
  ['Commission per Lot', '$0 (Zero)', '$3.50 / side', 'Tiered Discounted'],
  ['Minimum Initial Deposit', '$0', '$200', '$5,000'],
  ['Maximum Leverage', '1:500', '1:500', '1:1000'],
  ['Execution Speed', '< 50 ms', '< 30 ms', '< 20 ms (Priority)'],
  ['Platform Support', 'MT5 & WebTrader', 'MT5 & WebTrader', 'MT5, Web & FIX API'],
  ['EA & Algorithmic Trading', 'Full Support', 'Full Support', 'Priority Dedicated Cross-Connect'],
  ['Account Executive', 'Standard 24/5', 'Priority Support', 'Dedicated Personal Manager'],
].map(([feature, standard, raw, vip]) => ({ feature, standard, raw, vip }));

export default function Pricing() {
  return (
    <>
      <PageHero
        crumbs={['Pricing']}
        icon={Percent}
        badge="PRICING & SPREADS"
        title="Transparent Pricing [Built for Traders]"
        sub="With Majesty FX, you get institutional-grade pricing with no markup games — just clear, fair, and competitive trading costs."
      />

      <Section>
        <div className="rp-split grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
          <div className="rp-split-copy">
            <div className="rp-pills flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
              {[[Zap, 'Low Spreads'], [ShieldCheck, 'Zero Hidden Fees'], [Clock, 'Instant Execution']].map(([Icon, label]) => (
                <span key={label} className="rp-badge shrink-0 whitespace-nowrap"><Icon /> {label}</span>
              ))}
            </div>
            <h2 className="rp-h2">Transparent <span className="accent">pricing</span> built for traders</h2>
            <p className="rp-lead">With Majesty FX, you get institutional-grade pricing with no markup games — just clear, fair, and competitive trading costs from the world’s top tier-1 liquidity providers.</p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link to="/register" className="btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto text-center">Start Trading <ArrowRight /></Link>
              <Link to="/account-type" className="btn btn-outline btn-lg flex items-center justify-center w-full sm:w-auto text-center">Compare Accounts</Link>
            </div>
          </div>
          <figure className="rp-figure w-full max-w-[500px] mx-auto">
            <img src={phoneLaptop} alt="Trading on a phone" className="w-full h-auto object-cover rounded-xl" />
            <figcaption>
              <span><BarChart3 /> Raw ECN Direct Market Access</span>
              <em>Sub-30ms Latency</em>
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={Layers} tag="ACCOUNT TIERS" title="Account Plans [Overview]" sub="Choose the plan that matches your experience and strategy." />
        <div className="rp-grid rp-cols-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <article key={p.name} className={`rp-card rp-plan${p.popular ? ' is-popular' : ''}`}>
              {p.popular && <span className="rp-ribbon-tag">MOST POPULAR</span>}
              <h3>{p.name}</h3>
              <p className="rp-price"><b className="accent">{p.price}</b> <small>Min Deposit</small></p>
              <ul>
                {p.features.map((f) => (
                  <li key={f}><Check /> {f}</li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-primary btn-block">{p.cta}</Link>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead icon={ShieldCheck} tag="SPREAD SCHEDULE" title="Detailed Pricing [Comparison]" sub="Indicative values; conditions may vary by instrument and liquidity provider." />
        <SpecTable columns={spreadColumns} rows={spreadRows} highlight={2} />
        <p className="fine-print rp-note is-left">All prices are indicative and subject to change based on market volatility and liquidity providers.</p>
      </Section>

      <Section tone="soft">
        <SectionHead icon={Award} tag="FULL SPECIFICATIONS" title="Comprehensive Account [Comparison Matrix]" sub="Compare operational conditions across our account tiers." />
        <SpecTable columns={matrixColumns} rows={matrixRows} tint="slate" highlight={2} />
      </Section>

      <Section>
        <div className="rp-wide-cta">
          <h2 className="rp-h3">Trade with Transparency and Trust</h2>
          <p className="section-sub">Open your Majesty FX account today and access institutional-grade pricing from day one.</p>
          <div className="btn-row center">
            <Link to="/register" className="btn btn-primary btn-lg">Open Live Account</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Try a Free Demo</Link>
          </div>
        </div>
      </Section>

      <Calculator />
      <FAQ />
    </>
  );
}
