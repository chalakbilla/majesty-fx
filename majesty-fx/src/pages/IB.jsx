import { useState } from 'react';
import { Award, BarChart3, Clock, DollarSign, FileText, Globe, Headset, Layers, CircleCheck, Send, Share2, TrendingUp, Users } from 'lucide-react';
import CTA from '../components/CTA.jsx';
import FAQ from '../components/FAQ.jsx';
import { PageHero, Section, SectionHead, SpecTable, Tile } from '../components/route/blocks.jsx';
import coins from '../assets/routes/coins.jpg';
import chart from '../assets/routes/chart.jpg';
import heroBg from '../assets/hero-bg.jpg';
import team from '../assets/webtrader.jpg';

const stats = [
  [DollarSign, 'Up to $10', 'Per lot commission'],
  [TrendingUp, 'Tiered', 'Multi-level earnings'],
  [Clock, 'Instant', 'Payout processing'],
  [Headset, '24/5', 'Partner support'],
];

const benefits = [
  [DollarSign, coins, 'High Commissions', <>Earn up to <b>$10 per lot</b> traded by your referrals — no caps, no limits, all transparency.</>],
  [BarChart3, chart, 'Real-Time Dashboard', <>Track your network, earnings, and payouts in real-time through your <b>Partner Portal</b>.</>],
  [Globe, heroBg, 'Global Reach', 'Work with clients across 180+ regions, supported by localized payments and multilingual teams.'],
  [Headset, team, 'Dedicated Support', 'Partner success managers guide you through marketing, onboarding, and client retention strategies.'],
];

const tiers = [
  { tier: 'Starter', clients: '1 – 20', rate: '$5', perks: 'Access to IB dashboard & real-time reports' },
  { tier: 'Pro', clients: '21 – 50', rate: '$7', perks: 'Dedicated partner manager + monthly volume bonuses' },
  { tier: 'Elite', clients: '50+', rate: '$10', perks: 'Priority instant payouts, bespoke landing pages & co-branding' },
];
const tierColumns = [
  { key: 'tier', label: 'Tier', render: (v) => <strong>{v}</strong> },
  { key: 'clients', label: 'Clients Referred' },
  { key: 'rate', label: 'Commission (per lot)', render: (v) => <strong className="accent">{v}</strong> },
  { key: 'perks', label: 'Additional Benefits' },
];

const steps = [
  [FileText, '01 — Register', <>Submit your partner application and get verified within <b>24 hours</b>.</>],
  [Share2, '02 — Refer Clients', <>Share your unique referral link and onboard traders through your <b>IB dashboard</b>.</>],
  [DollarSign, '03 — Earn Commissions', <>Track referrals and enjoy <b>automatic payouts</b> every trading cycle.</>],
];

const rateFor = (traders) => tiers.find((t, i) => traders <= [50, 100, Infinity][i]) ?? tiers[2];

function Slider({ label, value, unit, min, max, onChange }) {
  return (
    <div className="rp-slider">
      <div className="rp-slider-head">
        <span>{label}</span>
        <b className="mono">{value} {unit}</b>
      </div>
      <input type="range" min={min} max={max} value={value} style={{ '--fill': `${((value - min) / (max - min)) * 100}%` }} onChange={(e) => onChange(+e.target.value)} />
    </div>
  );
}

export default function IB() {
  const [traders, setTraders] = useState(30);
  const [lots, setLots] = useState(15);
  const tier = rateFor(traders);
  const rate = Number(tier.rate.slice(1));

  return (
    <>
      <PageHero
        crumbs={['Partners & IBs']}
        icon={Award}
        badge="PARTNER PROGRAM"
        title="Become an Introducing Broker [with Majesty FX]"
        sub="Monetize your network by referring traders to a trusted global broker. Earn competitive commissions on every trade your clients make, backed by transparency, instant reporting, and priority support."
      />

      <section className="rp-stats is-peach">
        <div className="container stats-grid">
          {stats.map(([icon, value, label]) => (
            <div key={label} className="rp-stat">
              <Tile icon={icon} tone="solid" />
              <div><strong>{value}</strong><span>{label}</span></div>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <SectionHead icon={Users} tag="PARTNERSHIP BENEFITS" title="Why Partner with [Majesty FX?]" sub="Join a network built for serious affiliates, educators, and community leaders. Earn more with transparency, technology, and trust." />
        <div className="rp-grid rp-cols-4">
          {benefits.map(([Icon, src, title, text]) => (
            <article key={title} className="rp-card rp-photo-card is-left">
              <img src={src} alt={title} />
              <h3 className="accent"><Icon /> {title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={Layers} tag="TIER BREAKDOWN" title="Transparent, Tier-Based [Commission Structure]" sub="Our model rewards both performance and consistency. The more your clients trade, the more you earn." />
        <SpecTable columns={tierColumns} rows={tiers} />
        <p className="fine-print rp-note is-left">All commissions are calculated in USD and credited seamlessly based on closed trading volume.</p>
      </Section>

      <Section>
        <SectionHead icon={CircleCheck} tag="3 SIMPLE STEPS" title="Simple Onboarding, [Long-Term Growth]" sub="Start earning in just three easy steps — zero setup cost, zero delay." />
        <div className="rp-grid rp-cols-3">
          {steps.map(([icon, title, text]) => (
            <article key={title} className="rp-card rp-feature">
              <Tile icon={icon} tone="solid" round />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="warm">
        <div className="rp-duo">
          <article className="rp-card rp-panel">
            <h3 className="rp-panel-title"><TrendingUp className="accent" /> Simulate Your Monthly Earnings</h3>
            <Slider label="Active Referred Traders" value={traders} unit="Traders" min={1} max={200} onChange={setTraders} />
            <Slider label="Avg Volume / Client / Month" value={lots} unit="Lots" min={1} max={50} onChange={setLots} />
            <div className="rp-estimate">
              <small>ESTIMATED MONTHLY REBATE ({tier.tier} Tier (${rate}/Lot))</small>
              <b>${(traders * lots * rate).toLocaleString('en-US')}</b>
              <span>Rate applied: <strong>${rate} per standard round lot</strong></span>
            </div>
          </article>

          <form className="rp-card rp-panel rp-form" onSubmit={(e) => e.preventDefault()}>
            <h3 className="rp-panel-title">Partner Application Form</h3>
            <p className="rp-muted">Submit your credentials and our partnership desk will review and assign your IB tier within 24 hours.</p>
            <label>Full Name *<input required placeholder="e.g. John Doe" /></label>
            <div className="rp-row">
              <label>Email *<input required type="email" placeholder="john@example.com" /></label>
              <label>Phone / WhatsApp<input type="tel" placeholder="+1 234 567 890" /></label>
            </div>
            <label>Country of Residence *<input required placeholder="e.g. United Kingdom, UAE, South Africa" /></label>
            <button className="btn btn-primary btn-lg btn-block" type="submit">Submit IB Application <Send /></button>
          </form>
        </div>
      </Section>

      <FAQ />
      <CTA />
    </>
  );
}
