import { ArrowRight, Lock, Zap } from 'lucide-react';
export default function CTA() {
  return (
    <section className="section section-cta" id="demo">
      <div className="container">
        <div className="cta-card">
          <span className="eyebrow">The sovereign trading experience</span>
          <h2 className="h2">
            Ready to Amplify Your <span className="accent">Trading Edge?</span>
          </h2>
          <p className="section-sub">
            Open your Majesty FX account in 60 seconds. Experience raw 0.0 pip spreads, sub-20ms ultra-low latency,
            and Tier-1 institutional liquidity with zero deposit fees.
          </p>
          <div className="btn-row center flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a href="#create" className="btn btn-primary btn-lg flex items-center justify-center gap-2 w-full sm:w-auto text-center">Open Live Account <ArrowRight /></a>
            <a href="#demo" className="btn btn-outline btn-lg flex items-center justify-center w-full sm:w-auto text-center">Try Free $100K Demo</a>
          </div>
          <div className="trust-row flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <span><Lock /> Tier-1 Segregated Accounts</span>
            <span><Zap /> Zero Deposit Charges</span>
          </div>
        </div>
      </div>
    </section>
  );
}
