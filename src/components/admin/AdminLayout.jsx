import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BarChart2,
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  FileCheck,
  FileText,
  Globe,
  HelpCircle,
  Key,
  Layers,
  LifeBuoy,
  ListOrdered,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  PieChart,
  RefreshCw,
  Repeat,
  Settings,
  Shield,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { getAdminUser, logoutAdmin } from '../../utils/adminAuth.js';
import { LanguageSelector } from '../route/Auth.jsx';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ibExpanded, setIbExpanded] = useState(
    location.pathname.startsWith('/admin/ib') ||
    location.pathname === '/admin/referral-tree' ||
    location.pathname === '/admin/rank-management' ||
    location.pathname === '/admin/rebate-accounts'
  );
  const [pammExpanded, setPammExpanded] = useState(
    location.pathname.startsWith('/admin/pamm') || location.pathname.startsWith('/admin/total-pamm')
  );
  const [copyExpanded, setCopyExpanded] = useState(
    location.pathname.startsWith('/admin/copy') ||
    location.pathname === '/admin/pending-accounts' ||
    location.pathname === '/admin/pending-master-accounts'
  );
  const [supportExpanded, setSupportExpanded] = useState(
    location.pathname.startsWith('/admin/manage-priority') ||
    location.pathname.startsWith('/admin/support') ||
    location.pathname.startsWith('/admin/manage-ticket')
  );
  const [txExpanded, setTxExpanded] = useState(
    location.pathname.startsWith('/admin/account-ledger') ||
    location.pathname.startsWith('/admin/daily-inflow') ||
    location.pathname.startsWith('/admin/deposit-history') ||
    location.pathname.startsWith('/admin/manual-deposit') ||
    location.pathname.startsWith('/admin/withdraw-history') ||
    location.pathname.startsWith('/admin/internal-transfer') ||
    location.pathname.startsWith('/admin/profit-commission') ||
    location.pathname.startsWith('/admin/credit-in-out') ||
    location.pathname.startsWith('/admin/rejected-deposit') ||
    location.pathname.startsWith('/admin/rejected-withdrawal')
  );
  const [accountsExpanded, setAccountsExpanded] = useState(
    location.pathname.startsWith('/admin/account-type') ||
    location.pathname.startsWith('/admin/account-status')
  );
  const [settingsExpanded, setSettingsExpanded] = useState(
    location.pathname.startsWith('/admin/payment-method') ||
    location.pathname.startsWith('/admin/payment-gateway') ||
    location.pathname.startsWith('/admin/payment-ledger') ||
    location.pathname.startsWith('/admin/settings')
  );

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [apiDropdownOpen, setApiDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);

  const adminUser = getAdminUser() || {
    name: 'Demo Sandbox Admin',
    username: 'demoadmin',
    email: 'demo@majestyfx.com',
    role: 'Super Admin',
    portal: 'Majesty FX Demo Sandbox Portal',
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const headerRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setApiDropdownOpen(false);
        setPendingDropdownOpen(false);
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPath = location.pathname;

  const isLinkActive = (path) => currentPath === path;

  return (
    <div className="dashboard-portal admin-portal" data-desk="demo" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Top Header Navbar - Matching scratch_header_exact.html */}
      <header ref={headerRef} className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="admin-toggle-btn"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          {/* Logo */}
          <Link to="/admin/demo" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none', flexShrink: 0 }}>
            <img
              alt="Majesty FX Emblem"
              src={logo}
              style={{ height: '34px', width: 'auto', objectFit: 'contain' }}
            />
            <span
              className="admin-brand-text font-black"
              style={{
                fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                color: 'var(--text-heading, #0f172a)',
                display: 'inline-flex',
                alignItems: 'center',
                lineHeight: 1,
              }}
            >
              Majesty <span style={{ color: 'rgb(249, 115, 22)', fontWeight: 900, marginLeft: '0.2rem' }}>FX</span>
            </span>
          </Link>

          <div
            className="admin-hide-sm"
            style={{ width: '1px', height: '20px', backgroundColor: 'rgb(226, 232, 240)', margin: '0px 0.25rem', flexShrink: 0 }}
          />

          {/* Purple Portal Badge */}
          <div
            className="admin-hide-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: '1px solid rgb(221, 214, 254)',
              backgroundColor: 'rgb(245, 243, 255)',
              color: 'rgb(124, 58, 237)',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'rgb(139, 92, 246)' }} />
            <span>Majesty FX Demo Sandbox Portal</span>
          </div>
        </div>

        {/* Right Header Badges and User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* API Status Pill + Dropdown Modal */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setApiDropdownOpen((v) => !v);
                setPendingDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.38rem 0.7rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: '0.2s',
                border: '1px solid rgb(187, 247, 208)',
                backgroundColor: 'rgb(240, 253, 244)',
                color: 'rgb(21, 128, 61)',
              }}
              title="Click for MT5 Manager API connection status"
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'rgb(22, 163, 74)',
                  boxShadow: 'rgba(22, 163, 74, 0.6) 0px 0px 6px',
                }}
              />
              <span className="admin-api-long">API Connected</span>
              <span className="admin-api-short">MT5</span>
              <ChevronDown className="w-3 h-3 admin-api-chevron" />
            </button>

            {/* MT5 API Connected Dropdown Modal */}
            {apiDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '320px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '1.25rem',
                  zIndex: 999,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '0.75rem',
                      backgroundColor: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                      MT5 API Connected
                    </h3>
                    <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      Server: MajestyFX-Demo
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '0.875rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.625rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Assigned Manager:</span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1e293b' }}>#9999</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Gateway Host:</span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#1e293b' }}>demo.majestyfx.com</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Status:</span>
                    <span style={{ fontWeight: 700, color: '#16a34a' }}>Operational (18ms)</span>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setApiDropdownOpen(false)}
                    style={{
                      padding: '0.375rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pending Alerts Pill + Dropdown Modal */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setPendingDropdownOpen((v) => !v);
                setApiDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid rgb(245, 158, 11)',
                backgroundColor: 'rgb(255, 251, 235)',
                color: 'rgb(146, 64, 14)',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: '0.2s',
                boxShadow: 'rgba(245, 158, 11, 0.2) 0px 1px 3px',
              }}
              title="Pending Actions Queue"
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Bell className="w-4 h-4 text-amber-600" />
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-7px',
                    backgroundColor: 'rgb(239, 68, 68)',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px 3px',
                    border: '1.5px solid #ffffff',
                  }}
                >
                  9
                </span>
              </div>
              <span className="admin-hide-mobile">
                <span>
                  <strong style={{ color: 'rgb(180, 83, 9)' }}>9</strong> Pending
                </span>
              </span>
            </button>

            {/* Pending Action Center Dropdown Modal */}
            {pendingDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '330px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '1.25rem',
                  zIndex: 999,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                      Pending Action Center
                    </h3>
                    <p style={{ margin: '0.125rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      9 actions require attention
                    </p>
                  </div>
                  <span style={{ padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                    Action Needed
                  </span>
                </div>

                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <Link
                    to="/admin/demo"
                    onClick={() => setPendingDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#fffdf0', border: '1px solid #fef08a', textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Deposit Requests</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Proof of payment verification</div>
                      </div>
                    </div>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      2
                    </span>
                  </Link>

                  <Link
                    to="/admin/demo"
                    onClick={() => setPendingDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#fff5f5', border: '1px solid #fecdd3', textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', backgroundColor: '#ffe4e6', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowDown className="w-4 h-4" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Withdrawal Requests</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Payout requests awaiting approval</div>
                      </div>
                    </div>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e11d48', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      2
                    </span>
                  </Link>

                  <Link
                    to="/admin/kyc-documents"
                    onClick={() => setPendingDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', backgroundColor: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>KYC Documents</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>ID & address verification</div>
                      </div>
                    </div>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      2
                    </span>
                  </Link>

                  <Link
                    to="/admin/ib-clients"
                    onClick={() => setPendingDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#fffbf5', border: '1px solid #fed7aa', textDecoration: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>IB Partner Applications</div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Affiliate & partner requests</div>
                      </div>
                    </div>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#7c3aed', color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      3
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Switch to Client Portal Link */}
          <Link
            to="/"
            className="admin-portal-link"
            title="Switch to Client Portal"
            style={{
              color: '#1e293b',
              whiteSpace: 'nowrap',
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.42rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all .15s',
              display: 'inline-flex',
              boxShadow: '0 1px 2px #0000000a',
            }}
          >
            <span className="admin-portal-link-text">Client Portal</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </Link>

          {/* Language Selector matching screenshot media_1795078594987_61eaaa22.png */}
          <div className="hidden md:inline-flex">
            <LanguageSelector align="right" />
          </div>

          {/* Admin Profile Dropdown - Matching media_1795074510483_b0da6331.png & scratch_header_exact.html */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              aria-label="Admin user menu"
              className="admin-user-btn"
              onClick={() => {
                setProfileDropdownOpen((v) => !v);
                setApiDropdownOpen(false);
                setPendingDropdownOpen(false);
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: 'rgb(15, 23, 42)',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 3px',
                  }}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '9px',
                    height: '9px',
                    backgroundColor: 'rgb(34, 197, 94)',
                    border: '2px solid #ffffff',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <div className="admin-hide-mobile" style={{ fontSize: '0.8125rem', textAlign: 'left' }}>
                <div
                  className="font-extrabold"
                  style={{
                    fontWeight: 800,
                    color: 'rgb(15, 23, 42)',
                    lineHeight: 1.2,
                    maxWidth: '140px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  demoadmin
                </div>
                <div
                  style={{
                    color: 'rgb(139, 92, 246)',
                    fontSize: '0.7rem',
                    lineHeight: 1.2,
                    marginTop: '1px',
                    fontWeight: 600,
                    minHeight: '0.84rem',
                  }}
                >
                  Demo Sandbox Admin
                </div>
              </div>
              <div className="admin-hide-mobile" style={{ display: 'flex', alignItems: 'center' }}>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '240px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  zIndex: 999,
                }}
              >
                <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div className="font-extrabold" style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a' }}>demoadmin</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.125rem' }}>demo@majestyfx.com</div>
                </div>
                <div style={{ paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <Link
                    to="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#2563eb',
                      textDecoration: 'none',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>Go to Client Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#e11d48',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container: Fixed Sidebar + Scrollable Main Area */}
      <div style={{ display: 'flex', height: 'calc(-70px + 100vh)', paddingTop: '70px' }}>
        {/* Sidebar - Matching scratch_aside_exact.html */}
        <aside
          className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            position: 'fixed',
            top: '70px',
            left: '0px',
            right: 'auto',
            width: '16rem',
            height: 'calc(-70px + 100vh)',
            borderRight: '1px solid rgb(226, 232, 240)',
            borderLeftWidth: 'medium',
            borderLeftStyle: 'none',
            borderLeftColor: 'currentcolor',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px',
            zIndex: 40,
            background: 'linear-gradient(rgb(219, 234, 254), rgb(243, 232, 255), rgb(252, 231, 243), rgb(255, 228, 230))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          <nav style={{ padding: '0.75rem 0.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, overflowY: 'auto' }}>
            {/* User Mini Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.5rem 0.75rem',
                marginBottom: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(191, 219, 254, 0.6)',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgb(203, 213, 225)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgb(71, 85, 105)',
                }}
              >
                <User className="w-4 h-4" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="font-extrabold" style={{ fontSize: '0.875rem', fontWeight: 800, color: 'rgb(15, 23, 42)', lineHeight: 1.2 }}>
                  demoadmin
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--desk)', fontWeight: 600 }}>
                  Demo Sandbox Admin
                </span>
              </div>
            </div>

            {/* 1. Professional Email */}
            <NavLink
              to="/admin/professional-email"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: '0.15s',
                backgroundColor: isActive ? 'var(--desk)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgb(31, 41, 55)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail style={{ width: '1.35rem', height: '1.35rem', flexShrink: 0 }} />
                <span>Professional Email</span>
              </div>
            </NavLink>

            {/* 2. Clients */}
            <NavLink
              to="/admin/clients"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: '0.15s',
                backgroundColor: isActive ? 'var(--desk)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgb(31, 41, 55)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users style={{ width: '1.35rem', height: '1.35rem', flexShrink: 0 }} />
                <span>Clients</span>
              </div>
            </NavLink>

            {/* 3. Trading Accounts */}
            <NavLink
              to="/admin/trading-accounts"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: '0.15s',
                backgroundColor: isActive ? 'var(--desk)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgb(31, 41, 55)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart2 style={{ width: '1.35rem', height: '1.35rem', flexShrink: 0 }} />
                <span>Trading Accounts</span>
              </div>
            </NavLink>

            {/* 4. KYC Documents */}
            <NavLink
              to="/admin/kyc-documents"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: '0.15s',
                backgroundColor: isActive ? 'var(--desk)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgb(31, 41, 55)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileCheck style={{ width: '1.35rem', height: '1.35rem', flexShrink: 0 }} />
                <span>KYC Documents</span>
              </div>
              <span
                style={{
                  backgroundColor: 'rgb(37, 99, 235)',
                  color: 'rgb(255, 255, 255)',
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                  lineHeight: 1.2,
                }}
              >
                2
              </span>
            </NavLink>

            {/* 5. Trade Report */}
            <NavLink
              to="/admin/trade-report"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: '0.15s',
                backgroundColor: isActive ? 'var(--desk)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgb(31, 41, 55)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <TrendingUp style={{ width: '1.35rem', height: '1.35rem', flexShrink: 0 }} />
                <span>Trade Report</span>
              </div>
            </NavLink>

            {/* 6. IB Management (Expandable) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setIbExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <UserPlus style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>IB Management</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-600 transition-transform ${ibExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {ibExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Demo Sandbox', path: '/admin/demo' },
                    { label: 'IB Overview', path: '/admin/ib/dashboard' },
                    { label: 'IB Partner Network', path: '/admin/ib-clients', badge: '3' },
                    { label: 'IB Referral Tree', path: '/admin/referral-tree' },
                    { label: 'IB Commissions Settings', path: '/admin/ib-commissions-settings' },
                    { label: 'IB Commission History', path: '/admin/ib-commission-history' },
                    { label: 'IB Commission Withdrawal History', path: '/admin/ib-commission-withdrawal-history' },
                    { label: 'Rebate & Rank Settings', path: '/admin/rank-management' },
                    { label: 'Rebate Accounts', path: '/admin/rebate-accounts' },
                    { label: 'IB Rewards', path: '/admin/ib-rewards' },
                  ].map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => {
                        const active = isActive || (sub.path === '/admin/demo' && currentPath === '/admin') || currentPath === sub.path;
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        };
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor:
                              (currentPath === sub.path || (sub.path === '/admin/demo' && currentPath === '/admin'))
                                ? '#ffffff'
                                : 'transparent',
                            border:
                              (currentPath === sub.path || (sub.path === '/admin/demo' && currentPath === '/admin'))
                                ? '1.5px solid #ffffff'
                                : '1.5px solid rgb(100, 116, 139)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span style={{ backgroundColor: 'rgb(249, 115, 22)', color: '#fff', fontSize: '0.675rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                          {sub.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* 7. PAMM (Expandable) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setPammExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PieChart style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>PAMM</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-600 transition-transform ${pammExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {pammExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Total PAMM Clients', path: '/admin/total-pamm-clients' },
                    { label: 'Total PAMM Active Accounts', path: '/admin/pamm-active-accounts' },
                    { label: 'PAMM Referral Tree', path: '/admin/pamm-referral-tree' },
                    { label: 'PAMM Commission Report', path: '/admin/pamm-commission-report' },
                    { label: 'PAMM Commission Settings', path: '/admin/pamm-commission-settings' },
                    { label: 'PAMM Withdrawal History', path: '/admin/pamm-withdrawal-history' },
                    { label: 'PAMM Accepted Withdrawal History', path: '/admin/pamm-accept-withdrawal-history' },
                    { label: 'PAMM Rejected Withdrawal History', path: '/admin/pamm-rejected-withdrawal-history' },
                  ].map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => {
                        const active =
                          isActive ||
                          (sub.path === '/admin/demo' && currentPath === '/admin') ||
                          (sub.path === '/admin/total-pamm-clients' && (currentPath === '/admin/pamm-clients' || currentPath === '/admin/total-pamm-clients')) ||
                          (sub.path === '/admin/pamm-active-accounts' && (currentPath === '/admin/pamm-accounts' || currentPath === '/admin/pamm-active-accounts')) ||
                          (sub.path === '/admin/pamm-referral-tree' && (currentPath === '/admin/pamm-tree' || currentPath === '/admin/pamm-referral-tree')) ||
                          (sub.path === '/admin/pamm-commission-report' && (currentPath === '/admin/pamm-report' || currentPath === '/admin/pamm-commission-report')) ||
                          (sub.path === '/admin/pamm-commission-settings' && (currentPath === '/admin/pamm-settings' || currentPath === '/admin/pamm-commission-settings')) ||
                          (sub.path === '/admin/pamm-withdrawal-history' && (currentPath === '/admin/pamm-withdrawals' || currentPath === '/admin/pamm-withdrawal-history')) ||
                          (sub.path === '/admin/pamm-accept-withdrawal-history' && (currentPath === '/admin/pamm-accept-withdrawal-history' || currentPath === '/admin/pamm-accepted-withdrawal-history')) ||
                          (sub.path === '/admin/pamm-rejected-withdrawal-history' && currentPath === '/admin/pamm-rejected-withdrawal-history');
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        };
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/total-pamm-clients' && (currentPath === '/admin/pamm-clients' || currentPath === '/admin/total-pamm-clients')) ||
                                (sub.path === '/admin/pamm-active-accounts' && (currentPath === '/admin/pamm-accounts' || currentPath === '/admin/pamm-active-accounts')) ||
                                (sub.path === '/admin/pamm-referral-tree' && (currentPath === '/admin/pamm-tree' || currentPath === '/admin/pamm-referral-tree')) ||
                                (sub.path === '/admin/pamm-commission-report' && (currentPath === '/admin/pamm-report' || currentPath === '/admin/pamm-commission-report')) ||
                                (sub.path === '/admin/pamm-commission-settings' && (currentPath === '/admin/pamm-settings' || currentPath === '/admin/pamm-commission-settings')) ||
                                (sub.path === '/admin/pamm-withdrawal-history' && (currentPath === '/admin/pamm-withdrawals' || currentPath === '/admin/pamm-withdrawal-history')) ||
                                (sub.path === '/admin/pamm-accept-withdrawal-history' && (currentPath === '/admin/pamm-accept-withdrawal-history' || currentPath === '/admin/pamm-accepted-withdrawal-history')) ||
                                (sub.path === '/admin/pamm-rejected-withdrawal-history' && currentPath === '/admin/pamm-rejected-withdrawal-history'))
                                ? '#ffffff'
                                : 'transparent',
                            border:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/total-pamm-clients' && (currentPath === '/admin/pamm-clients' || currentPath === '/admin/total-pamm-clients')) ||
                                (sub.path === '/admin/pamm-active-accounts' && (currentPath === '/admin/pamm-accounts' || currentPath === '/admin/pamm-active-accounts')) ||
                                (sub.path === '/admin/pamm-referral-tree' && (currentPath === '/admin/pamm-tree' || currentPath === '/admin/pamm-referral-tree')) ||
                                (sub.path === '/admin/pamm-commission-report' && (currentPath === '/admin/pamm-report' || currentPath === '/admin/pamm-commission-report')) ||
                                (sub.path === '/admin/pamm-commission-settings' && (currentPath === '/admin/pamm-settings' || currentPath === '/admin/pamm-commission-settings')) ||
                                (sub.path === '/admin/pamm-withdrawal-history' && (currentPath === '/admin/pamm-withdrawals' || currentPath === '/admin/pamm-withdrawal-history')) ||
                                (sub.path === '/admin/pamm-accept-withdrawal-history' && (currentPath === '/admin/pamm-accept-withdrawal-history' || currentPath === '/admin/pamm-accepted-withdrawal-history')) ||
                                (sub.path === '/admin/pamm-rejected-withdrawal-history' && currentPath === '/admin/pamm-rejected-withdrawal-history'))
                                ? '1.5px solid #ffffff'
                                : '1.5px solid rgb(100, 116, 139)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{sub.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* 8. Copy Trading (Expandable) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setCopyExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Repeat style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Copy Trading</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-600 transition-transform ${copyExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {copyExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Copy Trading Accounts', path: '/admin/copy-trading-accounts' },
                    { label: 'Pending Master Accounts', path: '/admin/pending-accounts' },
                    { label: 'Master Account', path: '/admin/master-accounts' },
                    { label: 'Rejected Master Account', path: '/admin/rejected-master-accounts' },
                    { label: 'Approved Followers', path: '/admin/approved-followers' },
                    { label: 'Rejected Followers', path: '/admin/rejected-followers' },
                    { label: 'Profit Sharing Data', path: '/admin/profit-sharing-data' },
                  ].map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => {
                        const active =
                          isActive ||
                          currentPath === sub.path ||
                          (sub.path === '/admin/copy-trading-accounts' && (currentPath === '/admin/copy-trading' || currentPath === '/admin/copy-trading-accounts')) ||
                          (sub.path === '/admin/pending-accounts' && (currentPath === '/admin/pending-accounts' || currentPath === '/admin/pending-master-accounts'));
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        };
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/copy-trading-accounts' && (currentPath === '/admin/copy-trading' || currentPath === '/admin/copy-trading-accounts')) ||
                                (sub.path === '/admin/pending-accounts' && (currentPath === '/admin/pending-accounts' || currentPath === '/admin/pending-master-accounts')))
                                ? '#ffffff'
                                : 'transparent',
                            border:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/copy-trading-accounts' && (currentPath === '/admin/copy-trading' || currentPath === '/admin/copy-trading-accounts')) ||
                                (sub.path === '/admin/pending-accounts' && (currentPath === '/admin/pending-accounts' || currentPath === '/admin/pending-master-accounts')))
                                ? '1.5px solid #ffffff'
                                : '1.5px solid rgb(100, 116, 139)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{sub.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* 9. Transactions & Money (Expandable) - matching media_1795092044563_b1440119.png */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setTxExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Repeat style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Transactions &amp; Money</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      backgroundColor: 'var(--desk)',
                      color: 'rgb(255, 255, 255)',
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '9999px',
                      lineHeight: 1.2,
                    }}
                  >
                    4
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-600 transition-transform ${txExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {txExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Account Ledger', path: '/admin/account-ledger' },
                    { label: 'Daily Inflow', path: '/admin/daily-inflow' },
                    { label: 'Deposits', path: '/admin/deposit-history', badge: '2', badgeBg: 'rgb(234, 88, 12)' },
                    { label: 'Manual Deposit', path: '/admin/manual-deposit' },
                    { label: 'Withdrawals', path: '/admin/withdraw-history', badge: '2', badgeBg: 'rgb(225, 29, 72)' },
                    { label: 'Internal Transfers', path: '/admin/internal-transfer' },
                    { label: 'Profit Commission Withdrawal History', path: '/admin/profit-commission-withdrawal-history' },
                    { label: 'Credit In/Out', path: '/admin/credit-in-out' },
                    { label: 'Rejected Deposits', path: '/admin/rejected-deposits' },
                    { label: 'Rejected Withdrawals', path: '/admin/rejected-withdrawals' },
                  ].map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => {
                        const active =
                          isActive ||
                          currentPath === sub.path ||
                          (sub.path === '/admin/rejected-deposits' && currentPath === '/admin/rejected-deposit') ||
                          (sub.path === '/admin/rejected-deposit' && currentPath === '/admin/rejected-deposits') ||
                          (sub.path === '/admin/rejected-withdrawals' && currentPath === '/admin/rejected-withdrawal') ||
                          (sub.path === '/admin/rejected-withdrawal' && currentPath === '/admin/rejected-withdrawals') ||
                          (sub.path === '/admin/profit-commission-withdrawal-history' && currentPath === '/admin/profit-commission-history') ||
                          (sub.path === '/admin/profit-commission-history' && currentPath === '/admin/profit-commission-withdrawal-history');
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        };
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/rejected-deposits' && currentPath === '/admin/rejected-deposit') ||
                                (sub.path === '/admin/rejected-deposit' && currentPath === '/admin/rejected-deposits') ||
                                (sub.path === '/admin/rejected-withdrawals' && currentPath === '/admin/rejected-withdrawal') ||
                                (sub.path === '/admin/rejected-withdrawal' && currentPath === '/admin/rejected-withdrawals') ||
                                (sub.path === '/admin/profit-commission-withdrawal-history' && currentPath === '/admin/profit-commission-history') ||
                                (sub.path === '/admin/profit-commission-history' && currentPath === '/admin/profit-commission-withdrawal-history'))
                                ? '#ffffff'
                                : 'transparent',
                            border:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/rejected-deposits' && currentPath === '/admin/rejected-deposit') ||
                                (sub.path === '/admin/rejected-deposit' && currentPath === '/admin/rejected-deposits') ||
                                (sub.path === '/admin/rejected-withdrawals' && currentPath === '/admin/rejected-withdrawal') ||
                                (sub.path === '/admin/rejected-withdrawal' && currentPath === '/admin/rejected-withdrawals') ||
                                (sub.path === '/admin/profit-commission-withdrawal-history' && currentPath === '/admin/profit-commission-history') ||
                                (sub.path === '/admin/profit-commission-history' && currentPath === '/admin/profit-commission-withdrawal-history'))
                                ? '1.5px solid #ffffff'
                                : '1.5px solid rgb(100, 116, 139)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span
                          style={{
                            backgroundColor: sub.badgeBg || 'var(--desk)',
                            color: 'rgb(255, 255, 255)',
                            fontSize: '0.675rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px',
                            lineHeight: 1.2,
                          }}
                        >
                          {sub.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* 10. Support Tickets (Expandable) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setSupportExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MessageSquare style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Support Tickets</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-600 transition-transform ${supportExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {supportExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Manage Ticket', path: '/admin/manage-priority' },
                    { label: 'Open Tickets', path: '/admin/support/open' },
                    { label: 'Closed Tickets', path: '/admin/support/closed' },
                  ].map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => {
                        const active =
                          isActive ||
                          (sub.path === '/admin/manage-priority' &&
                            (currentPath === '/admin/manage-priority' ||
                              currentPath === '/admin/manage-ticket' ||
                              currentPath === '/admin/support-priority' ||
                              currentPath === '/admin/support/priority')) ||
                          (sub.path === '/admin/support/open' &&
                            (currentPath === '/admin/support/open' ||
                              currentPath === '/admin/support-open' ||
                              currentPath === '/admin/open')) ||
                          (sub.path === '/admin/support/closed' &&
                            (currentPath === '/admin/support/closed' ||
                              currentPath === '/admin/support-closed' ||
                              currentPath === '/admin/closed'));
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        };
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/manage-priority' &&
                                  (currentPath === '/admin/manage-priority' ||
                                    currentPath === '/admin/manage-ticket' ||
                                    currentPath === '/admin/support-priority' ||
                                    currentPath === '/admin/support/priority')) ||
                                (sub.path === '/admin/support/open' &&
                                  (currentPath === '/admin/support/open' ||
                                    currentPath === '/admin/support-open' ||
                                    currentPath === '/admin/open')) ||
                                (sub.path === '/admin/support/closed' &&
                                  (currentPath === '/admin/support/closed' ||
                                    currentPath === '/admin/support-closed' ||
                                    currentPath === '/admin/closed')))
                                ? '#ffffff'
                                : 'transparent',
                            border:
                              (currentPath === sub.path ||
                                (sub.path === '/admin/manage-priority' &&
                                  (currentPath === '/admin/manage-priority' ||
                                    currentPath === '/admin/manage-ticket' ||
                                    currentPath === '/admin/support-priority' ||
                                    currentPath === '/admin/support/priority')) ||
                                (sub.path === '/admin/support/open' &&
                                  (currentPath === '/admin/support/open' ||
                                    currentPath === '/admin/support-open' ||
                                    currentPath === '/admin/open')) ||
                                (sub.path === '/admin/support/closed' &&
                                  (currentPath === '/admin/support/closed' ||
                                    currentPath === '/admin/support-closed' ||
                                    currentPath === '/admin/closed')))
                                ? '1.5px solid #ffffff'
                                : '1.5px solid rgb(100, 116, 139)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{sub.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* 11. Accounts (Expandable) - matching media_1795091538847_d28927b3.zip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setAccountsExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ListOrdered style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Accounts</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-600 transition-transform ${accountsExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {accountsExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Account Types', path: '/admin/account-type' },
                    { label: 'Account Status', path: '/admin/account-status' },
                  ].map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => setMobileMenuOpen(false)}
                      style={({ isActive }) => {
                        const active =
                          isActive ||
                          currentPath === sub.path ||
                          (sub.path === '/admin/account-type' && currentPath === '/admin/account-types') ||
                          (sub.path === '/admin/account-types' && currentPath === '/admin/account-type') ||
                          (sub.path === '/admin/account-status' && currentPath === '/admin/account-statuses');
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        };
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor:
                              currentPath === sub.path ||
                                (sub.path === '/admin/account-type' && currentPath === '/admin/account-types') ||
                                (sub.path === '/admin/account-types' && currentPath === '/admin/account-type') ||
                                (sub.path === '/admin/account-status' && currentPath === '/admin/account-statuses') ||
                                (sub.path === '/admin/account-statuses' && currentPath === '/admin/account-status')
                                ? '#ffffff'
                                : 'transparent',
                            border:
                              currentPath === sub.path ||
                                (sub.path === '/admin/account-type' && currentPath === '/admin/account-types') ||
                                (sub.path === '/admin/account-types' && currentPath === '/admin/account-type') ||
                                (sub.path === '/admin/account-status' && currentPath === '/admin/account-statuses') ||
                                (sub.path === '/admin/account-statuses' && currentPath === '/admin/account-status')
                                ? '1.5px solid #ffffff'
                                : '1.5px solid rgb(100, 116, 139)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{sub.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* 12. System Settings (Expandable) - matching media_1795098526705_779b4e10.zip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
              <div
                onClick={() => setSettingsExpanded((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: '0.2s',
                  backgroundColor: 'transparent',
                  color: 'rgb(31, 41, 55)',
                  fontWeight: 600,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Settings style={{ width: '1.35rem', height: '1.35rem', color: 'rgb(55, 65, 81)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 600 }}>System Settings</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-600 transition-transform ${settingsExpanded ? 'rotate-90' : ''}`}
                />
              </div>

              {settingsExpanded && (
                <div style={{ paddingLeft: '1rem', paddingRight: '0px', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.15rem' }}>
                  {[
                    { label: 'Payment & Bank Gateways', path: '/admin/payment-methods' },
                    { label: 'Account Types', path: '/admin/account-type' },
                    { label: 'IB & Rebate Rules', path: '/admin/ib-commissions-settings' },
                    { label: 'Payment Ledger', path: '/admin/payment-ledger' },
                    { label: 'Payment Method History', path: '/admin/payment-method-history' },
                  ].map((sub) => {
                    const active =
                      currentPath === sub.path ||
                      (sub.path === '/admin/payment-methods' && currentPath === '/admin/payment-gateways') ||
                      (sub.path === '/admin/payment-gateways' && currentPath === '/admin/payment-methods') ||
                      (sub.path === '/admin/payment-ledger' && (currentPath === '/admin/settings/payment-ledger')) ||
                      (sub.path === '/admin/payment-method-history' && (currentPath === '/admin/settings/payment-method-history')) ||
                      (sub.path === '/admin/account-type' && currentPath === '/admin/account-types') ||
                      (sub.path === '/admin/account-types' && currentPath === '/admin/account-type') ||
                      (sub.path === '/admin/account-type' && (currentPath === '/admin/settings/account-type' || currentPath === '/admin/settings/account-types')) ||
                      (sub.path === '/admin/ib-commissions-settings' && (currentPath === '/admin/settings/ib-rebate-rules' || currentPath === '/admin/ib-rebate-rules'));
                    return (
                      <NavLink
                        key={sub.label}
                        to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          fontWeight: active ? 700 : 500,
                          textDecoration: 'none',
                          transition: '0.15s',
                          backgroundColor: active ? 'var(--desk)' : 'transparent',
                          color: active ? '#ffffff' : 'rgb(51, 65, 85)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '9999px',
                              backgroundColor: active ? '#ffffff' : 'transparent',
                              border: active ? '1.5px solid #ffffff' : '1.5px solid rgb(100, 116, 139)',
                              flexShrink: 0,
                            }}
                          />
                          <span>{sub.label}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Left Bottom Container matching media_1795090995283_6a8ab8cb.png */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid rgb(226, 232, 240)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <LanguageSelector variant="sidebar" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className="admin-main-area text-slate-900"
          style={{ overscrollBehavior: 'contain', marginLeft: '16rem', flex: 1, height: 'calc(-70px + 100vh)', overflowY: 'auto' }}
        >
          <div className="relative min-h-full bg-[#f8fafc] border-l border-slate-200/60 p-4 sm:p-6 lg:p-8 pb-16">
            <div className="relative max-w-[1700px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
