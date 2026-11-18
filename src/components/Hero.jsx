import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroPhones from '../assets/hero-phones.png';
import heroBg from '../assets/hero-bg.jpg';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="pill-row">
            <span className="pill"><Zap /> Ultra-Fast Execution</span>
            <span className="pill"><Sparkles /> Global Liquidity</span>
            <span className="pill"><Shield /> Trusted Worldwide</span>
          </div>
          <h1>
            Trade the <span className="accent">World’s</span>
            <br />
            <span className="accent">Markets</span>
            <br />
            with Clarity &amp; Speed
          </h1>
          <p className="lead">
            Join thousands of traders using <strong>Majesty Fx</strong> — where professional tools,
            transparent pricing, and cutting-edge technology meet for peak performance.
          </p>
          <div className="btn-row">
            <Link to="/register" className="btn btn-primary btn-lg">Open Live Account <ArrowRight /></Link>
            <Link to="/register" className="btn btn-outline btn-lg">Try Free Majesty Fx</Link>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroPhones} alt="Majesty FX trading app on phones" className="hero-phones" />
        </div>
      </div>
    </section>
  );
}
