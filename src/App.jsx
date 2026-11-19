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
import AdminTotalPAMMClients from './pages/admin/AdminTotalPAMMClients.jsx';
import AdminPAMMReferralTree from './pages/admin/AdminPAMMReferralTree.jsx';
import AdminPAMMCommissionReport from './pages/admin/AdminPAMMCommissionReport.jsx';
import AdminPAMMCommissionSettings from './pages/admin/AdminPAMMCommissionSettings.jsx';
import AdminPAMMWithdrawalHistory from './pages/admin/AdminPAMMWithdrawalHistory.jsx';
import AdminPAMMAcceptWithdrawalHistory from './pages/admin/AdminPAMMAcceptWithdrawalHistory.jsx';
import AdminPAMMRejectedWithdrawalHistory from './pages/admin/AdminPAMMRejectedWithdrawalHistory.jsx';
import AdminPendingAccounts from './pages/admin/AdminPendingAccounts.jsx';
import AdminCopyTradingAccounts from './pages/admin/AdminCopyTradingAccounts.jsx';
import AdminManagePriority from './pages/admin/AdminManagePriority.jsx';
import AdminSupportClosed from './pages/admin/AdminSupportClosed.jsx';
import AdminAccountTypes from './pages/admin/AdminAccountTypes.jsx';
import AdminAccountStatuses from './pages/admin/AdminAccountStatuses.jsx';
import AdminTransactionLedger from './pages/admin/AdminTransactionLedger.jsx';
import AdminPaymentMethods from './pages/admin/AdminPaymentMethods.jsx';

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
          <Route path="/admin/" element={<AdminDemo />} />
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
          <Route path="/admin/pending-accounts" element={<AdminPendingAccounts />} />
          <Route path="/admin/pending-master-accounts" element={<AdminPendingAccounts />} />
          <Route path="/admin/total-pamm-clients" element={<AdminTotalPAMMClients />} />
          <Route path="/admin/pamm-clients" element={<AdminTotalPAMMClients />} />
          <Route path="/admin/pamm-active-accounts" element={<AdminPAMMActiveAccounts />} />
          <Route path="/admin/pamm-accounts" element={<AdminPAMMActiveAccounts />} />
          <Route path="/admin/pamm-referral-tree" element={<AdminPAMMReferralTree />} />
          <Route path="/admin/pamm-tree" element={<AdminPAMMReferralTree />} />
          <Route path="/admin/pamm-commission-report" element={<AdminPAMMCommissionReport />} />
          <Route path="/admin/pamm-report" element={<AdminPAMMCommissionReport />} />
          <Route path="/admin/pamm-commission-settings" element={<AdminPAMMCommissionSettings />} />
          <Route path="/admin/pamm-settings" element={<AdminPAMMCommissionSettings />} />
          <Route path="/admin/pamm-withdrawal-history" element={<AdminPAMMWithdrawalHistory />} />
          <Route path="/admin/pamm-withdrawals" element={<AdminPAMMWithdrawalHistory />} />
          <Route path="/admin/pamm-accept-withdrawal-history" element={<AdminPAMMAcceptWithdrawalHistory />} />
          <Route path="/admin/pamm-accepted-withdrawal-history" element={<AdminPAMMAcceptWithdrawalHistory />} />
          <Route path="/admin/pamm-rejected-withdrawal-history" element={<AdminPAMMRejectedWithdrawalHistory />} />
          <Route path="/admin/manage-priority" element={<AdminManagePriority />} />
          <Route path="/admin/manage-ticket" element={<AdminManagePriority />} />
          <Route path="/admin/support/priority" element={<AdminManagePriority />} />
          <Route path="/admin/support-priority" element={<AdminManagePriority />} />
          <Route path="/admin/support-open" element={<AdminManagePriority defaultStatusFilter="Open" />} />
          <Route path="/admin/support/open" element={<AdminManagePriority defaultStatusFilter="Open" />} />
          <Route path="/admin/open" element={<AdminManagePriority defaultStatusFilter="Open" />} />
          <Route path="/admin/support/closed" element={<AdminSupportClosed />} />
          <Route path="/admin/support-closed" element={<AdminSupportClosed />} />
          <Route path="/admin/closed" element={<AdminSupportClosed />} />

          {/* Accounts Routes */}
          <Route path="/admin/account-types" element={<AdminAccountTypes />} />
          <Route path="/admin/account-type" element={<AdminAccountTypes />} />
          <Route path="/admin/account-status" element={<AdminAccountStatuses />} />
          <Route path="/admin/account-statuses" element={<AdminAccountStatuses />} />

          {/* System Settings Routes */}
          <Route path="/admin/payment-methods" element={<AdminPaymentMethods />} />
          <Route path="/admin/payment-gateways" element={<AdminPaymentMethods />} />
          <Route path="/admin/settings/account-type" element={<AdminAccountTypes />} />
          <Route path="/admin/settings/account-types" element={<AdminAccountTypes />} />
          <Route path="/admin/settings/ib-rebate-rules" element={<AdminIBCommissionsSettings />} />
          <Route path="/admin/ib-rebate-rules" element={<AdminIBCommissionsSettings />} />

          {/* Transactions & Money Routes */}
          <Route path="/admin/account-ledger" element={<AdminTransactionLedger />} />
          <Route path="/admin/daily-inflow" element={<AdminTransactionLedger />} />
          <Route path="/admin/deposit-history" element={<AdminTransactionLedger />} />
          <Route path="/admin/manual-deposit" element={<AdminTransactionLedger />} />
          <Route path="/admin/withdraw-history" element={<AdminTransactionLedger />} />
          <Route path="/admin/internal-transfer" element={<AdminTransactionLedger />} />
          <Route path="/admin/internal-transfers" element={<AdminTransactionLedger />} />
          <Route path="/admin/profit-commission-withdrawal-history" element={<AdminTransactionLedger />} />
          <Route path="/admin/credit-in-out" element={<AdminTransactionLedger />} />
          <Route path="/admin/rejected-deposits" element={<AdminTransactionLedger />} />
          <Route path="/admin/rejected-withdrawals" element={<AdminTransactionLedger />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
