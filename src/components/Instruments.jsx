import forex from '../assets/forex.jpg';
import stocks from '../assets/stocks.avif';
import indices from '../assets/indices.avif';
import crypto from '../assets/crypto.avif';
import { instruments, marketCategories, screenerRows, screenerTabs } from '../data.js';
import { useEffect, useMemo, useState } from 'react';

const imageMap = { forex, stocks, indices, crypto };

const categoryIcons = {
  swap: '⇄',
  medal: '✪',
  trend: '↗',
  bolt: '⚡',
};

export function InstrumentCards() {
  return (
    <section className="section section-soft">
      <div className="container">
        <h2 className="h2">
          Explore Our <span className="accent">Market Instruments</span>
        </h2>
        <p className="section-sub">Trade across major asset classes — each with unique volatility, liquidity, and opportunities.</p>
        <div className="instrument-grid">
          {instruments.map((ins) => (
            <article key={ins.title} className="instrument-card">
              {ins.image ? (
                <img src={imageMap[ins.image]} alt={ins.title} className="instrument-img" />
              ) : (
                <div className="instrument-img instrument-fallback" />
              )}
              <div className="instrument-overlay" />
              <div className="instrument-body">
                <span className="instrument-icon">{ins.title === 'Crypto' ? '₿' : ins.title === 'Stocks' ? '▥' : ins.title === 'Indices' ? '▤' : '⇄'}</span>
                <h3>{ins.title}</h3>
                <p>{ins.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketCategories() {
  return (
    <section className="section section-mint">
      <div className="container">
        <h2 className="h2">
          Markets You Can <span className="accent">Trade</span>
        </h2>
        <p className="section-sub">Diversify across asset classes and tailor your portfolio to changing market conditions.</p>
        <div className="category-grid">
          {marketCategories.map((c) => (
            <div key={c.title} className="category-card">
              <div className={`category-icon tone-${c.color}`}>{categoryIcons[c.icon]}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="chip">{c.pairs}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function fmt(value, dp) {
  return value.toFixed(dp);
}

export function MarketScreener() {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(screenerRows);

  // Light live-quote simulation so bid/ask tick like a real screener.
  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const drift = (Math.random() - 0.5) * 0.0008;
          const bid = r.bid * (1 + drift);
          const spreadAbs = r.ask - r.bid;
          return { ...r, bid, ask: bid + spreadAbs };
        })
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const filterMap = { 1: 'Forex', 2: 'Metals', 3: 'Indices', 4: 'Crypto', 5: 'Energies' };
  const visible = useMemo(() => {
    return rows.filter((r) => {
      const catOk = tab === 0 || r.category === filterMap[tab];
      const q = query.trim().toLowerCase();
      const qOk = !q || r.symbol.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
      return catOk && qOk;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, tab, query]);

  return (
    <section className="section section-light">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Real-time liquidity screener</span>
          <h2 className="h2">
            Explore Global <span className="accent">Market Opportunities</span>
          </h2>
          <p className="section-sub">Trade across 200+ liquid CFDs with zero markup on raw interbank pricing. Real-time indicative quotes updated live.</p>
        </div>

        <div className="screener">
          <div className="screener-toolbar">
            <div className="tabs">
              {screenerTabs.map((t, i) => (
                <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
                  {t}
                  <span className="tab-count">
                    {i === 0 ? rows.length : rows.filter((r) => r.category === filterMap[i]).length}
                  </span>
                </button>
              ))}
            </div>
            <input
              className="search"
              placeholder="Search symbol (e.g. Gold, EUR)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table className="screener-table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Category</th>
                  <th>Live Bid</th>
                  <th>Live Ask</th>
                  <th>Raw Spread</th>
                  <th>24h Change</th>
                  <th>24h Range</th>
                  <th>7D Trend</th>
                  <th className="right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const pct = ((r.bid - r.range[0]) / (r.range[1] - r.range[0] || 1)) * 100;
                  return (
                    <tr key={r.symbol}>
                      <td>
                        <div className="sym">{r.symbol}</div>
                        <div className="sym-name">{r.name}</div>
                      </td>
                      <td><span className="chip chip-grey">{r.category}</span></td>
                      <td className="mono">{fmt(r.bid, r.dp)}</td>
                      <td className="mono">{fmt(r.ask, r.dp)}</td>
                      <td><span className="chip chip-orange">{r.spread}</span></td>
                      <td>
                        <span className={`chip ${r.change >= 0 ? 'chip-up' : 'chip-down'}`}>
                          {r.change >= 0 ? '↗ +' : '↘ '}
                          {r.change.toFixed(2)}%
                        </span>
                      </td>
                      <td>
                        <div className="range-cell">
                          <span>{r.range[0]}</span>
                          <span>{r.range[1]}</span>
                        </div>
                        <div className="range-bar">
                          <div style={{ width: `${Math.min(100, Math.max(5, pct))}%` }} />
                        </div>
                      </td>
                      <td>
                        <svg className="spark" viewBox="0 0 80 28" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            strokeWidth="2"
                            stroke={r.change >= 0 ? '#16a34a' : '#dc2626'}
                            points={sparkPoints(r.symbol, r.change)}
                          />
                        </svg>
                      </td>
                      <td className="right"><button className="btn btn-outline btn-sm">Trade →</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <a href="#directory">View All 200+ Tradable Symbols in Complete Asset Directory →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Deterministic pseudo-random sparkline per symbol so it doesn't jitter on each tick.
function sparkPoints(seed, change) {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const pts = [];
  let y = 14;
  for (let x = 0; x <= 80; x += 8) {
    h = (h * 1103515245 + 12345) >>> 0;
    const noise = ((h >> 8) % 100) / 100 - 0.5;
    y = Math.min(24, Math.max(4, y - (change >= 0 ? 0.6 : -0.6) + noise * 8));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return pts.join(' ');
}
