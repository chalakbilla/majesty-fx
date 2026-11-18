import { ArrowRight, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import phones from '../assets/trade-phones.png';
import { heroStats } from '../data.js';

export default function TradeClarity() {
  return (
    <>
      <section className="section section-cream">
        <div className="container split grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="split-copy">
            <div className="pill-row flex flex-wrap gap-2 sm:gap-3">
              <span className="pill pill-light inline-flex items-center gap-2"><Zap /> Fast execution</span>
              <span className="pill pill-light inline-flex items-center gap-2"><DollarSign /> Thin pricing</span>
              <span className="pill pill-light inline-flex items-center gap-2"><ShieldCheck /> Secure funding</span>
            </div>
            <h2 className="h2 left">
              Trade with <span className="accent">clarity, speed</span> &amp; <span className="accent">control</span>
            </h2>
            <p className="body-text">
              Majesty Fx puts pro-grade tools and transparent pricing in your hands. Trade FX, metals,
              indices, energies and crypto CFD products on reliable infrastructure designed for modern traders.
            </p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a href="#create" className="btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto text-center">Open Live Account <ArrowRight /></a>
              <a href="#demo" className="btn btn-outline btn-lg flex items-center justify-center w-full sm:w-auto text-center">Try Free Majesty Fx</a>
            </div>
            <p className="fine-print">Regulatory restrictions may apply in some regions. Check availability during onboarding.</p>
          </div>
          <div className="split-visual card-visual flex justify-center items-center">
            <img src={phones} alt="Majesty FX phones" className="w-full max-w-[420px] h-auto object-contain" />
          </div>
        </div>
      </section>

      <div className="stats-strip">
        <div className="container stats-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
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
