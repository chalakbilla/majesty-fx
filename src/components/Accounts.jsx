import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { accounts } from '../data.js';

export function AccountTypes() {
  return (
    <section className="section section-warm" id="pricing">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Transparent trading conditions</span>
          <h2 className="h2">
            Choose an Account <span className="accent">Engineered for</span>
            <br />
            Your <span className="accent">Trading Style</span>
          </h2>
          <p className="section-sub">From zero-commission standard setups to ultra-low raw interbank latency, trade with complete clarity and no hidden fees.</p>
        </div>

        <div className="account-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {accounts.map((a) => (
            <article key={a.name} className={`account-card ${a.popular ? 'popular' : ''}`}>
              {a.popular && <span className="popular-badge">MOST POPULAR</span>}
              <h3>{a.name}</h3>
              <p className="account-desc">{a.desc}</p>
              <div className="spec-box">
                <div className="spec-row"><span>Spreads From</span><strong className="big">{a.spreads}</strong></div>
                <div className="spec-row"><span>Commission</span><span className={a.commissionGood ? 'good' : 'orange-text'}>{a.commission}</span></div>
                <div className="spec-row"><span>Leverage</span><span>{a.leverage}</span></div>
                <div className="spec-row"><span>Min Deposit</span><span className="orange-text">{a.minDeposit}</span></div>
              </div>
              <p className="features-title">Features</p>
              <ul className="check-list">
                {a.features.map((f) => (
                  <li key={f}><Check /> {f}</li>
                ))}
              </ul>
              <a href="#create" className={`btn btn-block ${a.popular ? 'btn-primary' : 'btn-outline'}`}>{a.cta} <ArrowRight /></a>
            </article>
          ))}
        </div>
        <p className="center-link"><a href="#compare">Need a custom liquidity setup or corporate account? View detailed spread comparison table <ArrowRight /></a></p>
      </div>
    </section>
  );
}

const ASSETS = [
  { label: 'XAU/USD', price: 2740, pip: 10 },
  { label: 'EUR/USD', price: 1.0843, pip: 10 },
  { label: 'GBP/USD', price: 1.2985, pip: 10 },
  { label: 'BTC/USD', price: 67840, pip: 1 },
  { label: 'US30', price: 43210, pip: 1 },
];
const LEVERAGES = ['1:100', '1:200', '1:400', '1:500'];

export function Calculator() {
  const [assetIdx, setAssetIdx] = useState(0);
  const [direction, setDirection] = useState('buy');
  const [lots, setLots] = useState(1);
  const [leverage, setLeverage] = useState('1:500');
  const [entry, setEntry] = useState('2740');
  const [exit, setExit] = useState('2755');

  const result = useMemo(() => {
    const asset = ASSETS[assetIdx];
    const lev = parseInt(leverage.split(':')[1], 10);
    const e = parseFloat(entry) || 0;
    const x = parseFloat(exit) || 0;
    const contract = asset.label === 'XAU/USD' ? 100 : 1;
    const diff = direction === 'buy' ? x - e : e - x;
    const pnl = diff * lots * contract;
    const margin = (e * lots * contract) / lev;
    const pipValue = 10 * lots;
    return { pnl, margin, pipValue };
  }, [assetIdx, direction, lots, leverage, entry, exit]);

  const asset = ASSETS[assetIdx];

  return (
    <section className="section section-calc">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Institutional margin &amp; PnL calculator</span>
          <h2 className="h2">
            Calculate Your Trading <span className="accent">Potential</span>
          </h2>
          <p className="section-sub">Simulate margin requirements, pip values, and expected profit before opening your live order ticket.</p>
        </div>

        <div className="calc-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="calc-card">
            <h4><Settings /> Position Parameters</h4>

            <label className="field-label">Tradable Asset</label>
            <div className="chip-group flex flex-wrap gap-2">
              {ASSETS.map((a, i) => (
                <button key={a.label} className={`seg ${assetIdx === i ? 'active' : ''}`} onClick={() => setAssetIdx(i)}>
                  {a.label}
                </button>
              ))}
            </div>

            <label className="field-label">Order Direction</label>
            <div className="dir-group grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button className={`dir buy ${direction === 'buy' ? 'active' : ''}`} onClick={() => setDirection('buy')}><ArrowUpRight /> BUY (Long)</button>
              <button className={`dir sell ${direction === 'sell' ? 'active' : ''}`} onClick={() => setDirection('sell')}><ArrowDownRight /> SELL (Short)</button>
            </div>

            <div className="range-head">
              <label className="field-label">Trade Volume</label>
              <span className="orange-text mono">{lots.toFixed(2)} Lots</span>
            </div>
            <input type="range" min="0.01" max="10" step="0.01" value={lots} onChange={(e) => setLots(parseFloat(e.target.value))} className="slider" />

            <div className="range-head">
              <label className="field-label">Leverage</label>
              <span className="mono">{leverage}</span>
            </div>
            <div className="chip-group flex flex-wrap gap-2">
              {LEVERAGES.map((l) => (
                <button key={l} className={`seg ${leverage === l ? 'active' : ''}`} onClick={() => setLeverage(l)}>{l}</button>
              ))}
            </div>

            <div className="two-col grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Entry Price</label>
                <input className="input" value={entry} onChange={(e) => setEntry(e.target.value)} />
              </div>
              <div>
                <label className="field-label">Exit / Target Price</label>
                <input className="input" value={exit} onChange={(e) => setExit(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="calc-card calc-result">
            <div className="result-head">
              <span>Estimated Outcome</span>
              <span className="indicative">INDICATIVE</span>
            </div>
            <div className="pnl-box">
              <p>Projected Net PnL ({direction === 'buy' ? 'BUY' : 'SELL'})</p>
              <strong className={result.pnl >= 0 ? 'pnl-pos' : 'pnl-neg'}>
                {result.pnl >= 0 ? '+' : '−'}${Math.abs(result.pnl).toFixed(2)}
              </strong>
              <small>{lots.toFixed(2)} lots on {asset.label}</small>
            </div>
            <div className="result-row"><span>Margin Required</span><strong>${result.margin.toFixed(2)} USD</strong></div>
            <div className="result-row"><span>Pip Value</span><strong className="orange-text">${result.pipValue.toFixed(2)} USD / pip</strong></div>
            <div className="result-row"><span>Broker Markup Fee</span><strong className="good">$0.00 (Raw Interbank)</strong></div>
            <a href="#create" className="btn btn-primary btn-block btn-lg">Trade This Strategy Live <ArrowRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
