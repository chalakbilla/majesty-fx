import TickerBar from './components/TickerBar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import TradeClarity from './components/TradeClarity.jsx';
import { InstrumentCards, MarketCategories, MarketScreener } from './components/Instruments.jsx';
import Platforms from './components/Platforms.jsx';
import { AccountTypes, Calculator } from './components/Accounts.jsx';
import Onboarding from './components/Onboarding.jsx';
import Education from './components/Education.jsx';
import Reviews from './components/Reviews.jsx';
import FAQ from './components/FAQ.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import FloatingDock from './components/FloatingDock.jsx';

export default function App() {
  return (
    <div className="app">
      <TickerBar />
      <Navbar />
      <main>
        <Hero />
        <TradeClarity />
        <InstrumentCards />
        <MarketCategories />
        <MarketScreener />
        <Platforms />
        <AccountTypes />
        <Calculator />
        <Onboarding />
        <Education />
        <Reviews />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
}
