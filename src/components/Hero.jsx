import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroPhones from '../assets/hero-phones.png';
import heroBg from '../assets/hero-bg.jpg';

export default function Hero() {
  return (
    <section className="hero relative overflow-hidden" id="top">
      <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="container hero-grid grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-8 lg:gap-10 py-10 lg:py-16">
        <div className="hero-copy z-10">
          <div className="pill-row flex flex-wrap gap-2 sm:gap-3">
            <span className="pill inline-flex items-center gap-2 text-xs sm:text-[13.5px] px-3 py-1.5 sm:px-4 sm:py-2">
              <Zap /> Ultra-Fast Execution
            </span>
            <span className="pill inline-flex items-center gap-2 text-xs sm:text-[13.5px] px-3 py-1.5 sm:px-4 sm:py-2">
              <Sparkles /> Global Liquidity
            </span>
            <span className="pill inline-flex items-center gap-2 text-xs sm:text-[13.5px] px-3 py-1.5 sm:px-4 sm:py-2">
              <Shield /> Trusted Worldwide
            </span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[62px] font-extrabold leading-[1.08] tracking-tight my-4 lg:my-6">
            Trade the <span className="accent">World’s</span>
            <br />
            <span className="accent">Markets</span>
            <br />
            with Clarity &amp; Speed
          </h1>
          <p className="lead text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-[580px]">
            Join thousands of traders using <strong>Majesty Fx</strong> — where professional tools,
            transparent pricing, and cutting-edge technology meet for peak performance.
          </p>
          <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-6 lg:mt-8 w-full sm:w-auto">
            <Link to="/register" className="btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto text-center">
              Open Live Account <ArrowRight />
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg flex items-center justify-center w-full sm:w-auto text-center">
              Try Free Majesty Fx
            </Link>
          </div>
        </div>

        <div className="hero-visual flex justify-center items-center mt-6 lg:mt-0">
          <img src={heroPhones} alt="Majesty FX trading app on phones" className="hero-phones w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[540px] h-auto object-contain" />
        </div>
      </div>
    </section>
  );
}
