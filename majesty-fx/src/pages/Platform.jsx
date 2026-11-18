import { CircleCheck, CircleX, Cpu, Download, Globe, Laptop, Layers, LineChart, Monitor, Radio, Server, ShieldCheck, Smartphone, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA.jsx';
import Reviews from '../components/Reviews.jsx';
import { Accent, FeatureGrid, PageHero, Section, SectionHead, SpecTable, Tile } from '../components/route/blocks.jsx';
import mt5 from '../assets/mt5.jpg';
import mobilePhones from '../assets/mobile-phones.png';
import webtrader from '../assets/routes/webtrader-devices.png';

const showcases = [
  {
    image: mt5, imageFirst: true,
    badge: [Cpu, 'THE GLOBAL TRADER STANDARD'],
    title: 'MetaTrader 5 — [The Pro Trader’s Powerhouse]',
    text: 'Execute, analyze, and automate with the industry’s most trusted multi-asset trading terminal. Engineered for quantitative traders, discretionary scalpers, and institutional hedge strategies alike.',
    features: [
      [Cpu, 'Full Expert Advisor (EA) Automation', 'Backtest algorithmic robots and custom indicators using multi-threaded tick data.'],
      [Layers, 'Level II Depth of Market (DOM)', 'Inspect institutional order book depth and direct liquidity across top Tier-1 liquidity providers.'],
      [Zap, '21 Timeframes & 80+ Indicators', 'Detailed technical analysis with unlimited concurrent charting workspaces.'],
    ],
    actions: [[Download, 'Download MT5 for Windows'], [null, 'macOS Setup']],
  },
  {
    image: webtrader, framed: true,
    badge: [Globe, 'ZERO DOWNLOADS REQUIRED'],
    title: 'WebTrader — [Trade Directly in Your Browser]',
    text: 'No software downloads, no installations, no firewall configuration. Simply log in from Chrome, Safari, Firefox, or Edge and enjoy full institutional charting with one-click trading.',
    features: [
      [Radio, 'Instant Cross-Device Sync', 'Your orders, charts, and open positions synchronize flawlessly across mobile and desktop.'],
      [TrendingUp, 'High-Resolution Web Charts', 'Over 30 technical indicators and customizable candlestick / bar chart views.'],
      [ShieldCheck, 'Encrypted 256-Bit SSL Protection', 'Bank-grade encryption safeguards your credentials and trades in real time.'],
    ],
    actions: [[Globe, 'Launch WebTrader Now'], [null, 'Try with $100K Demo']],
  },
  {
    image: mobilePhones, imageFirst: true, plain: true,
    badge: [Smartphone, 'ON-THE-GO PRECISION'],
    title: 'Mobile Trader — [Command Markets in Your Pocket]',
    text: 'Never miss an unexpected market breakout. Take full control of your portfolio with lightning-fast order entries, real-time push alerts, and comprehensive account telemetry on iOS and Android.',
    features: [
      [Radio, 'Instant Push Notifications', 'Receive immediate notifications on price triggers, economic news events, and execution reports.'],
      [Zap, 'One-Tap Order Execution', 'Enter and exit market positions instantly with pre-configured lot sizes and stop-loss levels.'],
      [TrendingUp, 'Live P/L & Account Analytics', 'Monitor margin usage, floating profits, equity, and historic trades in real time.'],
    ],
    actions: [[Download, 'Download for iOS'], [Download, 'Download for Android']],
  },
];

const yes = (v) => <span className="rp-status is-ok"><CircleCheck /> {v}</span>;
const no = (v) => <span className="rp-status is-no"><CircleX /> {v}</span>;
const fast = (v) => <span className="rp-status is-fast"><Zap /> {v}</span>;

const platformCols = [
  { key: 'feature', label: 'FEATURE & SPECIFICATION', render: (v) => <strong>{v}</strong> },
  { key: 'mt5', label: <><i className="rp-flag">FLAGSHIP PLATFORM</i>METATRADER 5 (MT5)</> },
  { key: 'web', label: <><i className="rp-flag is-grey">ZERO INSTALLATION</i>MAJESTY WEBTRADER</> },
  { key: 'app', label: <><i className="rp-flag is-grey">PORTABLE TRADING</i>MOBILE APP</> },
];
const platformRows = [
  { feature: 'Supported Operating Systems', mt5: 'Windows, macOS, Linux', web: 'Any Modern Web Browser', app: 'iOS (iPhone/iPad) & Android' },
  { feature: 'Expert Advisors (EAs) & Algorithmic Trading', mt5: yes('Fully Supported (MQL5)'), web: no('Web Discretionary Only'), app: no('Manual Execution') },
  { feature: 'Technical Indicators & Chart Objects', mt5: <strong>80+ Built-in + Unlimited Custom MQL5</strong>, web: '30+ Built-in Indicators', app: '30+ Standard Mobile Indicators' },
  { feature: 'Timeframes', mt5: <strong>21 Timeframes (1M to 1Mth)</strong>, web: '9 Standard Timeframes', app: '9 Standard Timeframes' },
  { feature: 'Execution Latency', mt5: fast('< 20ms Ultra-Low'), web: '< 30ms Fast Execution', app: '< 30ms Fast Execution' },
  { feature: 'Depth of Market (Level II DOM)', mt5: yes('Full Tier-1 Order Book'), web: 'Standard Market Depth', app: 'Basic Bid/Ask Depth' },
  { feature: 'Hedging & Scalping Strategy Support', mt5: yes('100% Permitted'), web: yes('100% Permitted'), app: yes('100% Permitted') },
  { feature: 'Recommended For', mt5: <strong className="accent">Professional & Algorithmic Traders</strong>, web: <strong>Everyday Active Day Traders</strong>, app: <strong>Mobile Traders on the Go</strong> },
  {
    feature: 'Get Started Today',
    mt5: <Link to="/register" className="btn btn-primary btn-sm btn-block"><Download /> Download MT5</Link>,
    web: <Link to="/register" className="btn btn-outline btn-sm btn-block">Open WebTrader</Link>,
    app: <Link to="/register" className="btn btn-outline btn-sm btn-block"><Smartphone /> Get Mobile App</Link>,
  },
];

const servers = [
  ['London (Equinix LD4)', 'Primary European Liquidity Center', 'Direct optical cross-connects to primary Tier-1 banks and non-bank liquidity providers. Average latency <15ms.'],
  ['New York (Equinix NY4)', 'North American Order Matching', 'Optimized matching engine routing for US Dollar pairs, Spot Gold (XAUUSD), and Wall Street index CFDs.'],
  ['Tokyo (Equinix TY3)', 'Asia-Pacific Liquidity Gateway', 'Ultra-high-speed connectivity for Asian trading sessions, Yen crosses, Nikkei index, and regional broker liquidity.'],
];

const tools = [
  { icon: LineChart, tone: 'peach', title: 'TradingView Sync', text: 'Seamlessly chart, perform multi-asset technical studies, and route orders directly with live Majesty FX raw pricing.' },
  { icon: Radio, tone: 'blue', title: 'AutoTrade & Copying', text: 'Follow verified high-performance strategy managers with millisecond precision and automated risk management filters.' },
  { icon: Cpu, tone: 'green', title: 'AI Market Signals', text: 'Gain timely actionable intelligence and automated candlestick pattern recognition powered by real-time quantitative modeling.' },
  { icon: Zap, tone: 'purple', title: 'FIX & REST API Access', text: 'Deploy institutional black-box algorithms or proprietary front-ends directly through our high-throughput FIX 4.4 bridge.' },
];

const downloads = [
  [Monitor, 'peach', 'Windows (MT5)', 'Windows 10 / 11 64-bit', 'Download .exe', true],
  [Laptop, 'gray', 'macOS (MT5)', 'Apple Silicon & Intel', 'Download .dmg', true],
  [Smartphone, 'blue', 'Apple iOS', 'iPhone & iPad', 'App Store'],
  [Smartphone, 'green', 'Google Android', 'Google Play & APK', 'Google Play'],
];

export default function Platform() {
  return (
    <>
      <PageHero
        crumbs={['Platforms']}
        icon={Monitor}
        badge="TRADING TECHNOLOGY"
        title="Trading [Platforms]"
        sub="Experience sub-20ms ultra-low latency execution across MetaTrader 5 Desktop, WebTrader, and Mobile."
      />

      <Section>
        {showcases.map(({ image, imageFirst, framed, plain, badge: [BadgeIcon, badgeText], title, text, features, actions }) => (
          <div key={title} className={`rp-showcase${imageFirst ? ' is-reverse' : ''}`}>
            <figure className={`rp-shot${framed ? ' is-framed' : ''}${plain ? ' is-plain' : ''}`}>
              <img src={image} alt="" />
            </figure>
            <div className="rp-split-copy">
              <span className="rp-badge"><BadgeIcon /> {badgeText}</span>
              <h2 className="rp-h2"><Accent text={title} /></h2>
              <p className="rp-lead">{text}</p>
              <ul className="rp-checks">
                {features.map(([icon, name, desc]) => (
                  <li key={name}>
                    <Tile icon={icon} tone="peach" />
                    <div>
                      <strong>{name}</strong>
                      <span>{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="btn-row">
                {actions.map(([Icon, label], i) => (
                  <Link key={label} to="/register" className={`btn btn-lg ${i === 0 ? 'btn-primary' : 'btn-outline'}`}>
                    {Icon && <Icon />} {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Section>

      <Section tone="soft">
        <SectionHead icon={Layers} tag="PLATFORM SPECIFICATION MATRIX" title="Compare [Trading Platforms]" sub="Select the platform tailored to your specific trading methodology, device workflow, and automation requirements." />
        <SpecTable columns={platformCols} rows={platformRows} tint="slate" highlight={1} />
      </Section>

      <Section>
        <SectionHead icon={Server} tag="GLOBAL LIQUIDITY CROSS-CONNECT" title="Ultra-Low Latency [Infrastructure]" sub="Majesty FX trading servers are directly co-located inside Equinix financial data centers in London, New York, and Tokyo, achieving sub-20ms execution with zero intervention." />
        <div className="rp-grid rp-cols-3">
          {servers.map(([name, role, text]) => (
            <article key={name} className="rp-card rp-feature">
              <Tile icon={Server} tone="ring" round />
              <h3>{name}</h3>
              <b className="accent">{role}</b>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={Zap} tag="POWERED ECOSYSTEM" title="Integrations & [Trading Tools]" sub="Enhance your edge with state-of-the-art charting integrations, algorithmic copy systems, and developer APIs." />
        <FeatureGrid items={tools} left />
      </Section>

      <Section tone="warm">
        <SectionHead icon={Download} tag="INSTALLATION PACKAGES" title="Download Majesty FX [Platform Suites]" sub="Trade from anywhere — across high-performance desktop machines, mobile tablets, and modern web browsers." />
        <div className="rp-grid rp-cols-4 is-narrow">
          {downloads.map(([icon, tone, name, sub, cta, dl]) => (
            <article key={name} className="rp-card rp-feature">
              <Tile icon={icon} tone={tone} />
              <h3>{name}</h3>
              <small>{sub}</small>
              <Link to="/register" className="btn btn-primary btn-sm btn-block">{dl && <Download />} {cta}</Link>
            </article>
          ))}
        </div>
      </Section>

      <Reviews />
      <CTA />
    </>
  );
}
