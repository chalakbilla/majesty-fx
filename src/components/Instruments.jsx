import forex from '../assets/forex.jpg';
import stocks from '../assets/stocks.avif';
import indices from '../assets/indices.avif';
import crypto from '../assets/crypto.avif';
import { instruments, marketCategories, screenerRows, screenerTabs } from '../data.js';
import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowLeftRight, ArrowRight, ArrowUpRight, BarChart3, Bitcoin, LineChart, Medal, TrendingUp, Zap } from 'lucide-react';
import { line } from 'd3-shape';
import { clamp, range } from 'lodash-es';
import seedrandom from 'seedrandom';
import { useInterval } from 'usehooks-ts';

const imageMap = { forex, stocks, indices, crypto };

const instrumentIcons = { Forex: ArrowLeftRight, Stocks: BarChart3, Indices: LineChart, Crypto: Bitcoin };
const categoryIcons = { swap: ArrowLeftRight, medal: Medal, trend: TrendingUp, bolt: Zap };

export function InstrumentCards() {
  return (
    <section className="section section-soft">
      <div className="container">
        <h2 className="h2">
          Explore Our <span className="accent">Market Instruments</span>
        </h2>
        <p className="section-sub">Trade across major asset classes — each with unique volatility, liquidity, and opportunities.</p>
        <div className="instrument-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {instruments.map((ins) => {
            const Icon = instrumentIcons[ins.title];
            return (
            <article key={ins.title} className="instrument-card">
              {ins.image ? (
                <img src={imageMap[ins.image]} alt={ins.title} className="instrument-img" />
              ) : (
                <div className="instrument-img instrument-fallback" />
              )}
              <div className="instrument-overlay" />
              <div className="instrument-body">
                <span className="instrument-icon"><Icon /></span>
                <h3>{ins.title}</h3>
                <p>{ins.text}</p>
              </div>
            </article>
            );
          })}
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
        <div className="category-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {marketCategories.map((c) => {
            const Icon = categoryIcons[c.icon];
            return (
            <div key={c.title} className="category-card">
              <div className={`category-icon tone-${c.color}`}><Icon /></div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="chip">{c.pairs}</span>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MarketScreener() {
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(screenerRows);

  // Light live-quote simulation so bid/ask tick like a real screener.
  useInterval(() => {
    setRows((prev) =>
      prev.map((r) => {
        const bid = r.bid * (1 + (Math.random() - 0.5) * 0.0008);
        return { ...r, bid, ask: bid + (r.ask - r.bid) };
      })
    );
  }, 1500);

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

        <div className="screener w-full">
          <div className="screener-toolbar flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="tabs flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
              {screenerTabs.map((t, i) => (
                <button key={t} className={`tab whitespace-nowrap shrink-0 ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>
                  {t}
                  <span className="tab-count ml-1.5">
                    {i === 0 ? rows.length : rows.filter((r) => r.category === filterMap[i]).length}
                  </span>
                </button>
              ))}
            </div>
            <input
              className="search w-full md:w-72"
              placeholder="Search symbol (e.g. Gold, EUR)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="table-wrap w-full overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
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
                  const Arrow = r.change >= 0 ? ArrowUpRight : ArrowDownRight;
                  return (
                    <tr key={r.symbol}>
                      <td>
                        <div className="sym">{r.symbol}</div>
                        <div className="sym-name">{r.name}</div>
                      </td>
                      <td><span className="chip chip-grey">{r.category}</span></td>
                      <td className="mono">{r.bid.toFixed(r.dp)}</td>
                      <td className="mono">{r.ask.toFixed(r.dp)}</td>
                      <td><span className="chip chip-orange">{r.spread}</span></td>
                      <td>
                        <span className={`chip ${r.change >= 0 ? 'chip-up' : 'chip-down'}`}>
                          <Arrow /> {r.change >= 0 ? '+' : ''}
                          {r.change.toFixed(2)}%
                        </span>
                      </td>
                      <td>
                        <div className="range-cell">
                          <span>{r.range[0]}</span>
                          <span>{r.range[1]}</span>
                        </div>
                        <div className="range-bar">
                          <div style={{ width: `${clamp(pct, 5, 100)}%` }} />
                        </div>
                      </td>
                      <td>
                        <svg className="spark" viewBox="0 0 80 28" preserveAspectRatio="none">
                          <path
                            fill="none"
                            strokeWidth="2"
                            stroke={r.change >= 0 ? '#16a34a' : '#dc2626'}
                            d={sparkPath(r.symbol, r.change)}
                          />
                        </svg>
                      </td>
                      <td className="right"><button className="btn btn-outline btn-sm">Trade <ArrowRight /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <a href="#directory">View All 200+ Tradable Symbols in Complete Asset Directory <ArrowRight /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Deterministic per-symbol sparkline: seeding by symbol keeps it from jittering on each tick.
function sparkPath(seed, change) {
  const random = seedrandom(seed);
  const drift = change >= 0 ? -0.6 : 0.6;
  let y = 14;
  const points = range(0, 81, 8).map((x) => {
    y = clamp(y + drift + (random() - 0.5) * 8, 4, 24);
    return [x, y];
  });
  return line()(points);
}
