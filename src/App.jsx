import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
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
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Markets from './pages/Markets.jsx';
import Trading from './pages/Trading.jsx';
import Platform from './pages/Platform.jsx';
import Pricing from './pages/Pricing.jsx';
import IB from './pages/IB.jsx';
import AccountType from './pages/AccountType.jsx';
import AssetPage from './pages/AssetPage.jsx';
import HelpDesk from './pages/HelpDesk.jsx';
import { assetPages } from './data/assets.jsx';

function Shell({ className = '' }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className={`app ${className}`}>
      <TickerBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
}

function Home() {
  return (
    <>
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
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Shell />}>
        <Route index element={<Home />} />
      </Route>
      <Route element={<Shell className="route-theme" />}>
        <Route path="/markets" element={<Markets />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/ib" element={<IB />} />
        <Route path="/account-type" element={<AccountType />} />
        <Route path="/help-desk" element={<HelpDesk />} />
        {Object.entries(assetPages).map(([path, cfg]) => (
          <Route key={path} path={`/${path}`} element={<AssetPage {...cfg} />} />
        ))}
      </Route>
    </Routes>
  );
}
