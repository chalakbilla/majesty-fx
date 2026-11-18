import { Bell, BookOpen, Cpu, DollarSign, FileText, GraduationCap, Link2, Monitor, PlayCircle, Rocket, ShieldAlert, ShieldCheck, Target, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ.jsx';
import { InstrumentCards } from '../components/Instruments.jsx';
import { FeatureGrid, PageHero, Section, SectionHead, SplitCard, StatsStrip, Tile } from '../components/route/blocks.jsx';
import coins from '../assets/routes/coins.jpg';
import chart from '../assets/routes/chart.jpg';
import cash from '../assets/routes/cash.jpg';
import phoneTall from '../assets/routes/phone-tall.jpg';
import cashTall from '../assets/routes/cash-tall.jpg';

const stats = [
  { value: '0.0', label: 'Raw spreads (acct)' },
  { value: '1:500', label: 'Leverage (max)*' },
  { value: '<30ms', label: 'Typical order latency' },
  { value: '200+', label: 'Tradable symbols' },
];

const advantages = [
  { icon: Cpu, tone: 'solid', title: 'Advanced Infrastructure', text: 'Low-latency servers and real-time execution to minimize slippage and maximize performance.' },
  { icon: ShieldCheck, tone: 'solid', title: 'Regulated & Secure', text: 'Client funds are held in segregated accounts under strict global compliance standards.' },
  { icon: Monitor, tone: 'solid', title: 'Powerful Platforms', text: 'Trade seamlessly via MetaTrader 5, WebTrader, or our native mobile apps — anywhere, anytime.' },
];

const conditions = [
  { icon: FileText, title: 'Forex', rows: [['from ', '0.0 pips'], ['up to ', '1:500'], ['$3.5/lot (Raw ECN)'], ['24/5']] },
  { icon: Award, title: 'Metals', rows: [['from ', '0.15'], ['up to ', '1:200'], ['None'], ['24/5']] },
  { icon: DollarSign, title: 'Indices', rows: [['from ', '0.4'], ['up to ', '1:100'], ['None'], ['24/5']] },
  { icon: Link2, title: 'Crypto', rows: [['from ', '0.2%'], ['up to ', '1:20'], ['None'], ['24/7']] },
];
const conditionLabels = ['Spread', 'Leverage', 'Commission', 'Hours'];

const devices = [
  [coins, 'MetaTrader 5', 'The world’s most trusted trading terminal with full charting tools.'],
  [chart, 'WebTrader', 'No installation needed — trade directly from your browser in seconds.'],
  [cash, 'Mobile App', 'Manage trades, deposits, and analytics right from your phone.'],
];

const roadmap = [
  [GraduationCap, 'Forex Basics', 'Master pips, leverage, and margin with beginner-friendly guides and quizzes.'],
  [BookOpen, 'Trading Strategies', 'Dive into price action, indicators, and risk management frameworks used by pros.'],
  [PlayCircle, 'Video Tutorials', 'Learn visually through live webinars and expert video breakdowns.'],
  [Rocket, 'Practice & Demo', 'Apply your learning in a risk-free demo account and track your improvement.'],
];

const safeguards = [
  { icon: Target, tone: 'solid', title: 'Stop Loss / Take Profit', text: 'Automate trade exits to manage losses and lock in profits with precision.' },
  { icon: Bell, tone: 'solid', title: 'Margin Alerts', text: 'Stay informed of account equity levels with instant risk notifications.' },
];

export default function Trading() {
  return (
    <>
      <PageHero
        crumbs={['Trading', 'All Markets']}
        icon={Zap}
        badge="MULTI-ASSET TRADING"
        title="Multi-Asset [Trading]"
        sub="Trade 200+ global financial markets with sub-20ms execution speed and 1:500 leverage."
      />
      <StatsStrip items={stats} dots />
      <InstrumentCards />

      <Section>
        <SectionHead icon={ShieldCheck} tag="BROKER ADVANTAGES" title="Why Trade with [Majesty FX?]" sub="Your trading experience — redefined by speed, transparency, and reliability." />
        <FeatureGrid items={advantages} cols={3} />
      </Section>

      <SplitCard
        title="Ready to trade the [global markets?]"
        text="Open your Majesty FX account and start trading hundreds of instruments with institutional conditions, sub-20ms speed, and 0.0 pip spreads."
        actions={
          <>
            <Link to="/register" className="btn btn-primary btn-lg">Start Trading</Link>
            <Link to="/#help" className="btn btn-outline btn-lg">Contact Support</Link>
          </>
        }
      >
        <div className="rp-trio">
          <img src={coins} alt="" />
          <img src={phoneTall} alt="" />
          <img src={cashTall} alt="" />
        </div>
      </SplitCard>

      <Section tone="white">
        <SectionHead icon={Zap} tag="EXECUTION SPECIFICATIONS" title="Transparent Trading [Conditions]" sub="Fair pricing, institutional grade execution, and absolutely no hidden fees." />
        <div className="rp-grid rp-cols-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {conditions.map(({ icon, title, rows }) => (
            <article key={title} className="rp-card rp-contract">
              <Tile icon={icon} tone="solid" />
              <h3>{title}</h3>
              <dl>
                {conditionLabels.map((label, i) => (
                  <div key={label}>
                    <dt>{label}:</dt>
                    <dd>
                      {rows[i][0]}
                      {rows[i][1] ? <span className="accent">{rows[i][1]}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={Monitor} tag="MULTI-DEVICE ACCESS" title="Trade Anywhere, [Anytime]" sub="Access markets through our powerful platforms across all devices." />
        <div className="rp-grid rp-cols-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {devices.map(([src, title, text]) => (
            <article key={title} className="rp-card rp-photo-card">
              <img src={src} alt={title} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead icon={GraduationCap} tag="LEARNING ROADMAP" title="Learn Before [You Trade]" sub="Sharpen your trading skills with our structured learning journey — from basics to expert analysis." />
        <ol className="rp-roadmap">
          {roadmap.map(([icon, title, text]) => (
            <li key={title}>
              <i className="rp-node" />
              <div className="rp-card">
                <Tile icon={icon} tone="peach" />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="soft">
        <SectionHead icon={ShieldAlert} tag="RISK SAFEGUARDS" title="Smart Risk [Management]" sub="Trade confidently with tools designed to safeguard your capital." />
        <FeatureGrid items={safeguards} cols={2} />
      </Section>

      <Section>
        <div className="rp-closing">
          <span className="rp-bar" />
          <h2 className="rp-h2">Ultra-Tight Spreads <i className="rp-sq" /> Lightning Execution</h2>
          <p className="section-sub">Experience raw pricing from top liquidity providers with execution in <b className="accent">&lt;30ms</b>.</p>
          <div className="btn-row center">
            <Link to="/register" className="btn btn-primary btn-lg">Open Live Account</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Start Demo</Link>
          </div>
        </div>
      </Section>

      <FAQ />
    </>
  );
}
