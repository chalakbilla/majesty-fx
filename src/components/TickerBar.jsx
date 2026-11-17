import { tickerItems } from '../data.js';

// Two identical copies are rendered so the -50% translate loops seamlessly.
export default function TickerBar() {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div className="ticker">
      <div className="ticker-label">
        <span className="live-dot" />
        <span>MARKETS: LIVE</span>
        <span className="ticker-sep">|</span>
        <span className="ticker-ping">
          <svg
            className="ticker-pulse"
            width="14"
            height="11"
            viewBox="0 0 15 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 6h3l2.5-5 3 10 2.5-5h3" />
          </svg>
          18ms
        </span>
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
