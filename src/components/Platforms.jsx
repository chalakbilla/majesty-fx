import mt5 from '../assets/mt5.jpg';
import webtrader from '../assets/webtrader.jpg';
import mobile from '../assets/mobile-phones.png';

export default function Platforms() {
  return (
    <section className="section section-light" id="platforms">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Institutional trading platforms</span>
          <h2 className="h2">
            Trade on <span className="accent">Award-Winning</span> <span className="accent">Platforms</span>
          </h2>
          <p className="section-sub">Seamless execution across desktop, web, and mobile with institutional precision.</p>
        </div>

        <div className="platform-row">
          <div className="platform-copy">
            <h3 className="platform-title"><span className="bar" /> MetaTrader 5</h3>
            <p>
              Our flagship trading platform — powerful, intuitive, and trusted globally. Enjoy advanced charting,
              automated EAs, lightning-fast execution, and deep liquidity feeds. Available for Windows, macOS, Web,
              iOS, and Android.
            </p>
            <div className="btn-row">
              <a href="#download" className="btn btn-primary">⤓ Download</a>
              <a href="#learn" className="btn btn-outline">Learn More</a>
            </div>
          </div>
          <img src={mt5} alt="Trading office" className="platform-img" />
        </div>

        <div className="platform-row reverse">
          <img src={webtrader} alt="Traders at work" className="platform-img" />
          <div className="platform-copy">
            <h3 className="platform-title webtrader"><span className="bar" /> WebTrader</h3>
            <p>
              Trade directly from your browser with no installation. Fast, secure, and synced with your MT5 account in
              real time — manage orders, analyze charts, and access your full trading history anywhere.
            </p>
            <div className="btn-row">
              <a href="#webtrader" className="btn btn-primary">⊕ Launch WebTrader</a>
              <a href="#tour" className="btn btn-outline">Platform Tour</a>
            </div>
          </div>
        </div>

        <div className="platform-row">
          <div className="platform-copy">
            <h3 className="platform-title"><span className="bar" /> Mobile Trading</h3>
            <p>
              Never miss a market move. Monitor charts, execute trades, and receive alerts on the go. Available on
              iOS and Android — the full trading experience in your pocket.
            </p>
            <div className="btn-row">
              <a href="#ios" className="btn btn-primary">▯ iOS</a>
              <a href="#android" className="btn btn-outline">▯ Android</a>
            </div>
          </div>
          <div className="mobile-visual">
            <img src={mobile} alt="Majesty FX mobile app" />
          </div>
        </div>
      </div>
    </section>
  );
}
