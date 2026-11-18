import { ArrowRight } from 'lucide-react';
import mt5 from '../assets/mt5.jpg';
import indices from '../assets/indices.avif';

const academy = [
  ['Trading Foundations:', 'Master order mechanics, lot sizing, and capital risk management principles.'],
  ['Strategy Labs:', 'Deep dive into orderflow, momentum breakout, and mean-reversion setups.'],
  ['Live Webinars:', 'Real-time market breakdown and interactive Q&A sessions with institutional analysts.'],
];
const tools = [
  ['Economic Calendar:', 'Stay ahead of high-impact NFP, CPI, and central bank interest rate decisions.'],
  ['Session Heatmap:', 'Track volume peaks across London, New York, and Tokyo overlapping sessions.'],
  ['Trade Journal & Analytics:', 'Export ledger stats, win rates, drawdowns, and execution latency audits.'],
];

export default function Education() {
  return (
    <section className="section section-edu" id="education">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Knowledge &amp; analytical power</span>
          <h2 className="h2">
            Empower Your Edge with <span className="accent">Education &amp; Tools</span>
          </h2>
          <p className="section-sub">We equip every trader with institutional-grade knowledge, technical discipline, and real-time analytical tools to trade smarter.</p>
        </div>

        <div className="edu-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
          <article className="edu-card" style={{ backgroundImage: `url(${mt5})` }}>
            <div className="edu-overlay" />
            <div className="edu-body">
              <span className="edu-tag">Academy &amp; Masterclasses</span>
              <h3>Education &amp; Strategy Labs</h3>
              <ul>
                {academy.map(([t, d]) => (
                  <li key={t}><strong>{t}</strong> {d}</li>
                ))}
              </ul>
              <a href="#academy" className="btn btn-primary">Go to Academy <ArrowRight /></a>
            </div>
          </article>
          <article className="edu-card" style={{ backgroundImage: `url(${indices})` }}>
            <div className="edu-overlay" />
            <div className="edu-body">
              <span className="edu-tag alt">Analytics &amp; Liquidity</span>
              <h3>Institutional Trader Tools</h3>
              <ul>
                {tools.map(([t, d]) => (
                  <li key={t}><strong>{t}</strong> {d}</li>
                ))}
              </ul>
              <a href="#tools" className="btn btn-outline-light">Explore Tools <ArrowRight /></a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
