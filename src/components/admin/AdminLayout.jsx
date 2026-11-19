import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileCheck,
  FileText,
  LogOut,
  Mail,
  Menu,
  PieChart,
  User,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { getAdminUser, logoutAdmin } from '../../utils/adminAuth.js';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ibExpanded, setIbExpanded] = useState(true);
  const [pammExpanded, setPammExpanded] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [apiDropdownOpen, setApiDropdownOpen] = useState(false);
  const [pendingDropdownOpen, setPendingDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const adminUser = getAdminUser() || {
    name: 'Demo Sandbox Admin',
    username: 'demoadmin',
    role: 'Super Admin',
    portal: 'Majesty FX Demo Sandbox Portal'
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

  const topMenuItems = [
    { label: 'Professional Email', icon: Mail, path: '/admin/professional-email' },
    { label: 'Clients', icon: Users, path: '/admin/clients' },
    { label: 'Trading Accounts', icon: BarChart3, path: '/admin/trading-accounts' },
    { label: 'KYC Documents', icon: FileCheck, path: '/admin/kyc-documents', badge: '2', badgeColor: 'bg-blue-600 text-white' },
    { label: 'Trade Report', icon: Activity, path: '/admin/trade-report' },
  ];

  const ibSubmenuItems = [
    { label: 'Demo Sandbox', path: '/admin/demo' },
    { label: 'IB Overview', path: '/admin/ib/dashboard' },
    { label: 'IB Partner Network', path: '/admin/ib-clients', badge: '3', badgeColor: 'bg-orange-500 text-white' },
    { label: 'IB Referral Tree', path: '/admin/referral-tree' },
    { label: 'IB Commissions Settings', path: '/admin/ib-commissions-settings' },
    { label: 'IB Commission History', path: '/admin/ib-commission-history' },
    { label: 'IB Commission Withdrawal History', path: '/admin/ib-commission-withdrawal-history' },
    { label: 'Rebate & Rank Settings', path: '/admin/rank-management' },
    { label: 'Rebate Accounts', path: '/admin/rebate-accounts' },
    { label: 'IB Rewards', path: '/admin/ib-rewards' },
  ];

  const pammSubmenuItems = [
    { label: 'Total PAMM Clients', path: '/admin/pamm-clients' },
    { label: 'Total PAMM Active Accounts', path: '/admin/pamm-accounts' },
    { label: 'PAMM Referral Tree', path: '/admin/pamm-referral-tree' },
    { label: 'PAMM Commission Report', path: '/admin/pamm-report' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-montserrat flex flex-col">
      {/* Top Header Navbar */}
      <header ref={headerRef} className="bg-white border-b border-slate-200 h-[70px] sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/admin/demo" className="flex items-center gap-2 shrink-0 no-underline">
            <img src={logo} alt="Majesty FX" className="h-8 sm:h-9 w-auto object-contain" />
            <span className="font-montserrat font-extrabold text-base sm:text-lg text-[#0b192c] tracking-tight">
              Majesty <span className="text-[#ff5a0a]">FX</span>
            </span>
          </Link>

          {/* Purple Portal Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#7c3aed] bg-[#f5f3ff] border border-[#ddd6fe] whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
            <span>Majesty FX Demo Sandbox Portal</span>
          </div>
        </div>

        {/* Right Header Badges and User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* API Status Pill + Dropdown Modal */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setApiDropdownOpen((v) => !v);
                setPendingDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              title="Click for MT5 Manager API connection status"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Connected</span>
              <ChevronDown className={`w-3 h-3 text-emerald-600 transition-transform ${apiDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* MT5 API Connected Dropdown Modal (Matching Screenshot) */}
            {apiDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sora font-extrabold text-sm text-[#0f172a] leading-tight">
                      MT5 API Connected
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Server: MajestyFX-Demo
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 text-xs font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Assigned Manager:</span>
                    <span className="font-bold font-mono text-slate-800">#9999</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Gateway Host:</span>
                    <span className="font-bold font-mono text-slate-800">demo.majestyfx.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-600">Operational (18ms)</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setApiDropdownOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pending Alerts Pill + Dropdown Modal (Matching Screenshot) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setPendingDropdownOpen((v) => !v);
                setApiDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100/70 transition-colors cursor-pointer"
            >
              <div className="relative flex items-center">
                <Bell className="w-3.5 h-3.5 text-amber-700" />
                <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <span className="text-amber-900 font-extrabold">9 Pending</span>
            </button>

            {/* Pending Action Center Dropdown Modal */}
            {pendingDropdownOpen && (
              <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-sora font-extrabold text-sm text-[#0f172a] leading-tight">
                      Pending Action Center
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      9 actions require attention
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Action Needed
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  <Link
                    to="/admin/demo"
                    onClick={() => setPendingDropdownOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#fffdf0] border border-[#fef08a] hover:bg-[#fef9c3] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-sora font-bold text-xs text-slate-900">Deposit Requests</div>
                        <div className="text-[11px] text-slate-500">Proof of payment verification</div>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      2
                    </span>
                  </Link>

                  <Link
                    to="/admin/demo"
                    onClick={() => setPendingDropdownOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#fff5f5] border border-[#fecdd3] hover:bg-[#ffe4e6] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                        <ArrowDown className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-sora font-bold text-xs text-slate-900">Withdrawal Requests</div>
                        <div className="text-[11px] text-slate-500">Payout requests awaiting approval</div>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#e11d48] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      2
                    </span>
                  </Link>

                  <Link
                    to="/admin/clients"
                    onClick={() => setPendingDropdownOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] hover:bg-[#e0f2fe] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-sora font-bold text-xs text-slate-900">KYC Documents</div>
                        <div className="text-[11px] text-slate-500">ID & address verification</div>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      2
                    </span>
                  </Link>

                  <Link
                    to="/admin/ib-clients"
                    onClick={() => setPendingDropdownOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#fffbf5] border border-[#fed7aa] hover:bg-[#ffedd5] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-sora font-bold text-xs text-slate-900">IB Partner Applications</div>
                        <div className="text-[11px] text-slate-500">Affiliate & partner requests</div>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-xs font-bold flex items-center justify-center shadow-xs">
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
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Client Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Language Selector */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
            <span>🇬🇧</span>
            <span>English</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Admin Profile Dropdown (Matching Screenshot media_1795074510483_b0da6331.png) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileDropdownOpen((v) => !v);
                setApiDropdownOpen(false);
                setPendingDropdownOpen(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 py-1 sm:py-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 transition-all focus:outline-none cursor-pointer shadow-2xs"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4 text-slate-200" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {adminUser.username || 'demoadmin'}
                </span>
                <span className="text-[11px] font-semibold text-[#8b5cf6] leading-tight">
                  {adminUser.name || 'Demo Sandbox Admin'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-3 border-b border-slate-100">
                  <div className="font-bold text-sm text-[#0f172a]">{adminUser.username || 'demoadmin'}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{adminUser.email || 'demo@majestyfx.com'}</div>
                </div>
                <div className="pt-2 space-y-1">
                  <Link
                    to="/"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-2 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50/70 rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span>Go to Client Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/70 rounded-lg transition-colors text-left cursor-pointer"
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

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 min-h-[calc(100vh-70px)]">
        {/* Desktop Sidebar (Matching Screenshots) */}
        <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 h-[calc(100vh-70px)] sticky top-[70px] overflow-y-auto flex-col py-3 px-3 space-y-1">
          {/* Top Admin User Card */}
          <div className="flex items-center gap-2.5 p-2.5 mb-2 rounded-xl bg-slate-50/80 border border-slate-200/70">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                {adminUser.username || 'demoadmin'}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight truncate">
                {adminUser.name || 'Demo Sandbox Admin'}
              </span>
            </div>
          </div>

          {/* Top Nav Items */}
          {topMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#7c3aed] text-white font-bold shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* IB Management Accordion */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIbExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-4 h-4 text-slate-700" />
                <span>IB Management</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${ibExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {ibExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-1">
                {ibSubmenuItems.map((sub) => {
                  const isActive = location.pathname === sub.path;
                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#7c3aed] text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? 'bg-white' : 'bg-slate-400'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </div>
                      {sub.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${sub.badgeColor}`}>
                          {sub.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* PAMM Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setPammExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-800 hover:bg-slate-50 transition-colors text-xs font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <PieChart className="w-4 h-4 text-slate-700" />
                <span>PAMM</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${pammExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            {pammExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-1">
                {pammSubmenuItems.map((sub) => {
                  const isActive = location.pathname === sub.path;
                  return (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#7c3aed] text-white font-bold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                      <span>{sub.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] bg-white h-full shadow-2xl p-4 overflow-y-auto flex flex-col space-y-2 z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img src={logo} alt="Majesty FX" className="h-7 w-auto" />
                  <span className="font-extrabold text-sm text-[#0b192c]">Majesty FX</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile top items */}
              {topMenuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg ${
                    location.pathname === item.path ? 'bg-[#7c3aed] text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}

              <div className="pt-2 border-t border-slate-100">
                <div className="px-3 py-1 text-xs font-bold text-slate-900">IB Management</div>
                <div className="space-y-1 mt-1 pl-2">
                  {ibSubmenuItems.map((sub) => {
                    const isActive = location.pathname === sub.path;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#7c3aed] text-white font-bold shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{sub.label}</span>
                        {sub.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${sub.badgeColor}`}>
                            {sub.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-[#f8fafc] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
