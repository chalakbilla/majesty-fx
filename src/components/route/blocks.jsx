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
    <section className="relative overflow-hidden w-full py-8 md:py-10 text-white border-b border-white/10 bg-gradient-to-b from-[#04060a] to-[#080c14]">
      {/* Radial orange ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(60% 80px at 50% 0%, rgba(249, 115, 22, 0.15) 0%, transparent 100%)',
        }}
      />
      <div className="container relative z-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-3 flex-wrap"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium transition-colors"
          >
            <House className="w-3 h-3" />
            <span>Home</span>
          </Link>
          {crumbs.map((c, i) => (
            <Fragment key={c}>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className={i === crumbs.length - 1 ? 'text-slate-200 font-semibold' : 'text-slate-400'}>
                {c}
              </span>
            </Fragment>
          ))}
        </nav>

        {/* Hero Title & Description */}
        <div className="max-w-[720px] mx-auto text-center flex flex-col items-center">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-[#ff5a0a] text-[11px] font-sora font-bold tracking-wider uppercase mb-2.5">
              {Icon && <Icon className="w-3.5 h-3.5 text-[#ff5a0a]" />}
              <span>{badge}</span>
            </div>
          )}
          <h1 className="font-sora text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
            <Accent text={title} />
          </h1>
          {sub && (
            <p className="font-montserrat text-xs sm:text-sm md:text-[15px] text-slate-300 leading-relaxed max-w-[620px]">
              {sub}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ icon: Icon, tag, title, sub }) {
  return (
    <div className="text-center max-w-[780px] mx-auto mb-8 sm:mb-12">
      {tag && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff5a0a] text-xs font-sora font-bold tracking-wider uppercase mb-3">
          {Icon && <Icon className="w-3.5 h-3.5 text-[#ff5a0a]" />}
          <span>{tag}</span>
        </div>
      )}
      <h2 className="font-montserrat text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b192c] tracking-tight leading-tight mb-2.5">
        <Accent text={title} />
      </h2>
      {sub && (
        <p className="font-montserrat text-sm sm:text-base text-slate-600 leading-relaxed">
          {sub}
        </p>
      )}
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
