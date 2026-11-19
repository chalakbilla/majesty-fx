import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
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
import ForgotPassword from './pages/ForgotPassword.jsx';
import Markets from './pages/Markets.jsx';
import Trading from './pages/Trading.jsx';
import Platform from './pages/Platform.jsx';
import Pricing from './pages/Pricing.jsx';
import IB from './pages/IB.jsx';
import AccountType from './pages/AccountType.jsx';
import AssetPage from './pages/AssetPage.jsx';
import HelpDesk from './pages/HelpDesk.jsx';
import { assetPages } from './data/assets.jsx';

// Admin imports
import AdminProtected from './components/admin/AdminProtected.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDemo from './pages/admin/AdminDemo.jsx';
import AdminIBDashboard from './pages/admin/AdminIBDashboard.jsx';
import AdminIBClients from './pages/admin/AdminIBClients.jsx';
import AdminReferralTree from './pages/admin/AdminReferralTree.jsx';
import AdminIBCommissionsSettings from './pages/admin/AdminIBCommissionsSettings.jsx';
import AdminIBCommissionHistory from './pages/admin/AdminIBCommissionHistory.jsx';
import AdminIBCommissionWithdrawalHistory from './pages/admin/AdminIBCommissionWithdrawalHistory.jsx';
import AdminRankManagement from './pages/admin/AdminRankManagement.jsx';
import AdminRebateAccounts from './pages/admin/AdminRebateAccounts.jsx';
import AdminIBRewards from './pages/admin/AdminIBRewards.jsx';
import AdminProfessionalEmail from './pages/admin/AdminProfessionalEmail.jsx';
import AdminClients from './pages/admin/AdminClients.jsx';
import AdminTradingAccounts from './pages/admin/AdminTradingAccounts.jsx';
import AdminKYCDocuments from './pages/admin/AdminKYCDocuments.jsx';
import AdminTradeReport from './pages/admin/AdminTradeReport.jsx';
import AdminPAMMReport from './pages/admin/AdminPAMMReport.jsx';
import AdminPAMMActiveAccounts from './pages/admin/AdminPAMMActiveAccounts.jsx';
import AdminCopyTradingAccounts from './pages/admin/AdminCopyTradingAccounts.jsx';

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
      {/* Public Client Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
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

      {/* Admin Public Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route element={<AdminProtected />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDemo />} />
          <Route path="/admin/demo" element={<AdminDemo />} />
          <Route path="/admin/ib/dashboard" element={<AdminIBDashboard />} />
          <Route path="/admin/ib-clients" element={<AdminIBClients />} />
          <Route path="/admin/referral-tree" element={<AdminReferralTree />} />
          <Route path="/admin/ib-commissions-settings" element={<AdminIBCommissionsSettings />} />
          <Route path="/admin/ib-commission-history" element={<AdminIBCommissionHistory />} />
          <Route path="/admin/ib-commission-withdrawal-history" element={<AdminIBCommissionWithdrawalHistory />} />
          <Route path="/admin/rank-management" element={<AdminRankManagement />} />
          <Route path="/admin/rebate-accounts" element={<AdminRebateAccounts />} />
          <Route path="/admin/ib-rewards" element={<AdminIBRewards />} />
          <Route path="/admin/professional-email" element={<AdminProfessionalEmail />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/trading-accounts" element={<AdminTradingAccounts />} />
          <Route path="/admin/kyc-documents" element={<AdminKYCDocuments />} />
          <Route path="/admin/trade-report" element={<AdminTradeReport />} />
          <Route path="/admin/copy-trading-accounts" element={<AdminCopyTradingAccounts />} />
          <Route path="/admin/copy-trading" element={<AdminCopyTradingAccounts />} />
          <Route path="/admin/pamm-clients" element={<AdminPAMMReport title="PAMM Clients" />} />
          <Route path="/admin/pamm-active-accounts" element={<AdminPAMMActiveAccounts />} />
          <Route path="/admin/pamm-accounts" element={<AdminPAMMActiveAccounts />} />
          <Route path="/admin/pamm-referral-tree" element={<AdminPAMMReport title="PAMM Referral Tree" />} />
          <Route path="/admin/pamm-report" element={<AdminPAMMReport title="PAMM Commission Report" />} />
        </Route>
      </Route>
    </Routes>
  );
}
