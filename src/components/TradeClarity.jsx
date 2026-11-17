import phones from '../assets/trade-phones.png';
import { heroStats } from '../data.js';

export default function TradeClarity() {
  return (
    <>
      <section className="section section-cream">
        <div className="container split">
          <div className="split-copy">
            <div className="pill-row">
              <span className="pill pill-light">⚡ Fast execution</span>
              <span className="pill pill-light">$ Thin pricing</span>
              <span className="pill pill-light">◉ Secure funding</span>
            </div>
            <h2 className="h2 left">
              Trade with <span className="accent">clarity, speed</span> &amp; <span className="accent">control</span>
            </h2>
            <p className="body-text">
              Majesty Fx puts pro-grade tools and transparent pricing in your hands. Trade FX, metals,
              indices, energies and crypto CFD products on reliable infrastructure designed for modern traders.
            </p>
            <div className="btn-row">
              <a href="#create" className="btn btn-primary btn-lg">Open Live Account →</a>
              <a href="#demo" className="btn btn-outline btn-lg">Try Free Majesty Fx</a>
            </div>
            <p className="fine-print">Regulatory restrictions may apply in some regions. Check availability during onboarding.</p>
          </div>
          <div className="split-visual card-visual">
            <img src={phones} alt="Majesty FX phones" />
          </div>
        </div>
      </section>

      <div className="stats-strip">
        <div className="container stats-grid">
          {heroStats.map((s) => (
            <div key={s.label} className="stat-card">
              <span className="dot-orange" />
              <div>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
