import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { accounts } from '../data.js';

export function AccountTypes() {
  return (
    <section className="section section-warm" id="pricing">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="center-stack text-center max-w-[780px] mx-auto mb-10 sm:mb-14">
          <div className="badge-pill mb-3">
            <span>TRANSPARENT TRADING CONDITIONS</span>
          </div>
          <h2 className="h2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b192c] tracking-tight leading-tight">
            Choose an Account <span className="accent">Engineered for</span>
            <br />
            Your <span className="accent">Trading Style</span>
          </h2>
          <p className="section-sub text-sm sm:text-base text-slate-600 mt-3">
            From zero-commission standard setups to ultra-low raw interbank latency, trade with complete clarity and no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 items-stretch">
          {accounts.map((a) => (
            <article
              key={a.name}
              className={`rounded-xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between relative transition-all ${
                a.popular
                  ? 'bg-[#fffaf5] border-2 border-[#ff5a0a] shadow-[0_12px_28px_-6px_rgba(255,102,0,0.14)] hover:shadow-[0_20px_40px_-8px_rgba(255,102,0,0.22)] -translate-y-1'
                  : 'bg-white border border-slate-200 shadow-sm hover:border-[#ff5a0a]/50 hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {a.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff5a0a] text-white text-[11px] font-sora font-bold px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}
              <div>
                <h3 className="font-sora text-xl font-bold text-[#0f172a] mb-1.5">{a.name}</h3>
                <p className="font-montserrat text-xs text-slate-500 leading-relaxed min-h-[38px] mb-5">
                  {a.desc}
                </p>

                {/* Spec Box */}
                <div className="bg-white rounded-lg p-4 border border-slate-200/80 mb-5 space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500 font-medium">Spreads From</span>
                    <strong className="font-sora font-extrabold text-xl text-[#0f172a]">{a.spreads}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-[13px]">
                    <span className="text-slate-600 font-medium">Commission</span>
                    <span
                      className={`font-semibold ${
                        a.commissionGood ? 'text-[#16a34a]' : 'text-[#0f172a]'
                      }`}
                    >
                      {a.commission}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-[13px]">
                    <span className="text-slate-600 font-medium">Leverage</span>
                    <span className="font-semibold text-[#0f172a]">{a.leverage}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-[13px]">
                    <span className="text-slate-600 font-medium">Min Deposit</span>
                    <span className="font-sora font-bold text-[#ff5a0a]">{a.minDeposit}</span>
                  </div>
                </div>

                {/* Features Heading & List */}
                <div className="font-sora text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Features
                </div>
                <ul className="space-y-2.5 mb-6">
                  {a.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-[#334155] leading-snug">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 p-0.5 mt-0.5 ${
                          a.popular ? 'bg-[#fff7ed]' : 'bg-[#f0fdf4]'
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            a.popular ? 'text-[#ff5a0a]' : 'text-[#16a34a]'
                          }`}
                        />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <a
                href="#create"
                className={`w-full py-3 px-4 rounded-lg font-sora font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all mt-auto ${
                  a.popular
                    ? 'bg-[#ff5a0a] hover:bg-[#e04800] text-white shadow-[0_4px_14px_rgba(255,90,10,0.3)]'
                    : 'border border-slate-200 hover:border-[#ff5a0a] hover:bg-[#fff7ed] hover:text-[#ff5a0a] text-[#0f172a] bg-white'
                }`}
              >
                <span>{a.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>

        <p className="text-center mt-10 text-xs sm:text-sm text-slate-600">
          <a
            href="#compare"
            className="hover:text-[#ff5a0a] font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Need a custom liquidity setup or corporate account? View detailed spread comparison table</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#ff5a0a]" />
          </a>
        </p>
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
