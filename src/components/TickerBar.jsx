import { tickerItems } from '../data.js';

// Two identical copies are rendered so the -50% translate loops seamlessly.
export default function TickerBar() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker">
      <div className="ticker-label">
        <span className="live-dot" /> MARKETS: LIVE <span className="ticker-ping">18ms</span>
      </div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {items.map((t, i) => (
            <div className="ticker-item" key={i}>
              <span className="ticker-symbol">{t.symbol}</span>
              <span className="ticker-price">{t.price}</span>
              <span className={t.change >= 0 ? 'up' : 'down'}>
                {t.change >= 0 ? '▲' : '▼'} {t.change >= 0 ? '+' : ''}
                {t.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
