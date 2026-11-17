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
          <div className="btn-row center">
            <a href="#create" className="btn btn-primary btn-lg">Open Live Account →</a>
            <a href="#demo" className="btn btn-outline btn-lg">Try Free $100K Demo</a>
          </div>
          <div className="trust-row">
            <span>🔒 Tier-1 Segregated Accounts</span>
            <span>⚡ Zero Deposit Charges</span>
          </div>
        </div>
      </div>
    </section>
  );
}
