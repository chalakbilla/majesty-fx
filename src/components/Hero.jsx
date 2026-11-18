import { ArrowRight, Shield, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroPhones from '../assets/hero-phones.png';
import heroBg from '../assets/hero-bg.jpg';

export default function Hero() {
  return (
    <section className="hero relative overflow-hidden" id="top">
      <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="container hero-grid grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-8 lg:gap-10 py-10 lg:py-16">
        <div className="hero-copy z-10 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          {/* Desktop Pills (single horizontal row) */}
          <div className="hidden lg:flex flex-wrap gap-3">
            <span className="pill inline-flex items-center gap-2 text-[13.5px] px-4 py-2">
              <Zap className="w-4 h-4 text-orange" /> Ultra-Fast Execution
            </span>
            <span className="pill inline-flex items-center gap-2 text-[13.5px] px-4 py-2">
              <Sparkles className="w-4 h-4 text-orange" /> Global Liquidity
            </span>
            <span className="pill inline-flex items-center gap-2 text-[13.5px] px-4 py-2">
              <Shield className="w-4 h-4 text-orange" /> Trusted Worldwide
            </span>
          </div>

          {/* Mobile Pills (2 centered rows, matches reference screenshot) */}
          <div className="flex flex-col items-center gap-2 lg:hidden w-full">
            <div className="flex items-center justify-center gap-2 w-full">
              <span className="pill inline-flex items-center gap-1.5 text-xs px-3 py-1.5">
                <Zap className="w-3.5 h-3.5 text-orange" /> Ultra-Fast Execution
              </span>
              <span className="pill inline-flex items-center gap-1.5 text-xs px-3 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange" /> Global Liquidity
              </span>
            </div>
            <div className="flex items-center justify-center w-full">
              <span className="pill inline-flex items-center gap-1.5 text-xs px-3 py-1.5">
                <Shield className="w-3.5 h-3.5 text-orange" /> Trusted Worldwide
              </span>
            </div>
          </div>

          <h1 className="text-center lg:text-left font-sora font-extrabold text-[32px] sm:text-[44px] lg:text-[62px] leading-[1.12] tracking-tight my-4 lg:my-6">
            Trade the <span className="accent">World’s</span>
            <br />
            <span className="accent">Markets</span>
            <br />
            with Clarity &amp; Speed
          </h1>

          <p className="lead text-center lg:text-left text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-[520px] mx-auto lg:mx-0">
            Join thousands of traders using <strong>Majesty Fx</strong> — where professional tools,
            transparent pricing, and cutting-edge technology meet for peak performance.
          </p>

          {/* Buttons: Side-by-side in one horizontal row on mobile */}
          <div className="btn-row flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 mt-6 lg:mt-8 w-full">
            <Link
              to="/register"
              className="btn btn-primary flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-3.5 py-2.5 sm:px-6 sm:py-3.5 rounded-lg whitespace-nowrap"
            >
              <span>Open Live Account</span> <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="btn btn-outline flex items-center justify-center text-xs sm:text-sm font-bold px-3.5 py-2.5 sm:px-6 sm:py-3.5 rounded-lg whitespace-nowrap"
            >
              Try Free Majesty Fx
            </Link>
          </div>
        </div>

        <div className="hero-visual flex justify-center items-center mt-6 lg:mt-0">
          <img
            src={heroPhones}
            alt="Majesty FX trading app on phones"
            className="hero-phones w-full max-w-[290px] sm:max-w-[420px] lg:max-w-[540px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
