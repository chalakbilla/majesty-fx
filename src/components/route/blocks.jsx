import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, House } from 'lucide-react';

// "Trade [Gold] today" -> the bracketed part is rendered in the brand colour.
export function Accent({ text }) {
  return text
    .split(/\[(.*?)\]/)
    .map((part, i) => (i % 2 ? <span key={i} className="accent">{part}</span> : <Fragment key={i}>{part}</Fragment>));
}

export function PageHero({ crumbs, icon: Icon, badge, title, sub }) {
  return (
    <section className="rp-hero">
      <div className="container">
        <nav className="rp-crumbs flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
          <House />
          <Link to="/">Home</Link>
          {crumbs.map((c, i) => (
            <Fragment key={c}>
              <ChevronRight />
              <span className={i === crumbs.length - 1 ? 'is-current' : undefined}>{c}</span>
            </Fragment>
          ))}
        </nav>
        <span className="rp-badge rp-badge-dark"><Icon /> {badge}</span>
        <h1><Accent text={title} /></h1>
        <p>{sub}</p>
      </div>
    </section>
  );
}

export function SectionHead({ icon: Icon, tag, title, sub }) {
  return (
    <div className="rp-head">
      {tag && <span className="eyebrow">{Icon && <Icon />} {tag}</span>}
      <h2 className="h2"><Accent text={title} /></h2>
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}

export function Tile({ icon: Icon, tone = 'orange', round = false }) {
  return <span className={`rp-tile rp-tile-${tone}${round ? ' is-round' : ''}`}><Icon /></span>;
}

export function StatsStrip({ items, dots = false }) {
  return (
    <section className={`rp-stats ${dots ? 'is-dots' : ''}`}>
      <div className="container stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, value, label }) => (
          <div key={label} className="rp-stat">
            {dots ? <i className="rp-dot" /> : <Tile icon={Icon} tone="solid" />}
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeatureGrid({ items, cols = 4, round = false, left = false }) {
  return (
    <div className={`rp-grid rp-cols-${cols}${left ? ' is-left' : ''}`}>
      {items.map(({ icon, tone, title, text }) => (
        <article key={title} className="rp-card rp-feature">
          <Tile icon={icon} tone={tone} round={round} />
          <h3>{title}</h3>
          <p><Accent text={text} /></p>
        </article>
      ))}
    </div>
  );
}

// columns: [{ key, label, align?, render?(value, row) }]
export function SpecTable({ columns, rows, tint = 'peach', highlight }) {
  return (
    <div className={`rp-table-wrap tint-${tint} w-full overflow-x-auto`}>
      <table className="rp-table">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={c.key} className={`${c.align === 'right' ? 'is-right' : ''}${i === highlight ? ' is-hl' : ''}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {columns.map((c, i) => (
                <td key={c.key} className={`${c.align === 'right' ? 'is-right' : ''}${i === highlight ? ' is-hl' : ''}`}>
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SplitCard({ title, text, actions, children }) {
  return (
    <section className="rp-section">
      <div className="container">
        <div className="rp-split-card grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2><Accent text={title} /></h2>
            <p>{text}</p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">{actions}</div>
          </div>
          <div className="rp-split-media">{children}</div>
        </div>
      </div>
    </section>
  );
}

export const Section = ({ tone = 'white', children, className = '' }) => (
  <section className={`rp-section tone-${tone} ${className}`}>
    <div className="container">{children}</div>
  </section>
);

export const TradeLink = () => (
  <Link to="/register" className="btn btn-primary btn-xs">Trade <ChevronRight /></Link>
);
