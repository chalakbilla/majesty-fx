import { reviewsTop, reviewsBottom } from '../data.js';

function Card({ r }) {
  return (
    <article className="review-card">
      <div className="review-top">
        <div className="stars">★★★★★</div>
        <span className="review-badge">{r.badge}</span>
      </div>
      <p className="review-text">“{r.text}”</p>
      <div className="review-author">
        <img src={r.avatar} alt={r.name} />
        <div>
          <strong>
            {r.name} <span className="verified">✔</span>
          </strong>
          <small>{r.role}</small>
        </div>
      </div>
    </article>
  );
}

function Row({ items, direction }) {
  // Duplicate the list so the -50% translate loops without a visible jump.
  const looped = [...items, ...items];
  return (
    <div className="marquee">
      <div className={`marquee-track ${direction === 'left' ? 'to-left' : 'to-right'}`}>
        {looped.map((r, i) => (
          <Card key={`${r.name}-${i}`} r={r} />
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="section section-reviews">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Verified trader experiences</span>
          <h2 className="h2">
            Trusted by Professional <span className="accent">Traders Worldwide</span>
          </h2>
          <p className="section-sub">Discover why retail scalpers, automated EA developers, and fund managers execute with Majesty FX every single trading session.</p>
        </div>
      </div>
      {/* Top row: content scrolls right → left */}
      <Row items={reviewsTop} direction="left" />
      {/* Bottom row: content scrolls left → right */}
      <Row items={reviewsBottom} direction="right" />
    </section>
  );
}
