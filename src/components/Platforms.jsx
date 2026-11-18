import { Download, Globe, Smartphone } from 'lucide-react';
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

        <div className="platform-row grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="platform-copy">
            <h3 className="platform-title"><span className="bar" /> MetaTrader 5</h3>
            <p>
              Our flagship trading platform — powerful, intuitive, and trusted globally. Enjoy advanced charting,
              automated EAs, lightning-fast execution, and deep liquidity feeds. Available for Windows, macOS, Web,
              iOS, and Android.
            </p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a href="#download" className="btn btn-primary flex items-center justify-center gap-2"><Download /> Download</a>
              <a href="#learn" className="btn btn-outline flex items-center justify-center">Learn More</a>
            </div>
          </div>
          <img src={mt5} alt="Trading office" className="platform-img w-full max-w-[500px] mx-auto h-auto rounded-xl object-cover" />
        </div>

        <div className="platform-row reverse grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <img src={webtrader} alt="Traders at work" className="platform-img order-last lg:order-first w-full max-w-[500px] mx-auto h-auto rounded-xl object-cover" />
          <div className="platform-copy">
            <h3 className="platform-title webtrader"><span className="bar" /> WebTrader</h3>
            <p>
              Trade directly from your browser with no installation. Fast, secure, and synced with your MT5 account in
              real time — manage orders, analyze charts, and access your full trading history anywhere.
            </p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a href="#webtrader" className="btn btn-primary flex items-center justify-center gap-2"><Globe /> Launch WebTrader</a>
              <a href="#tour" className="btn btn-outline flex items-center justify-center">Platform Tour</a>
            </div>
          </div>
        </div>

        <div className="platform-row grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="platform-copy">
            <h3 className="platform-title"><span className="bar" /> Mobile Trading</h3>
            <p>
              Never miss a market move. Monitor charts, execute trades, and receive alerts on the go. Available on
              iOS and Android — the full trading experience in your pocket.
            </p>
            <div className="btn-row flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a href="#ios" className="btn btn-primary flex items-center justify-center gap-2"><Smartphone /> iOS</a>
              <a href="#android" className="btn btn-outline flex items-center justify-center gap-2"><Smartphone /> Android</a>
            </div>
          </div>
          <div className="mobile-visual flex justify-center items-center">
            <img src={mobile} alt="Majesty FX mobile app" className="w-full max-w-[420px] h-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
