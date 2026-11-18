import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { LanguageSelector, AuthLeftPanel, portalThemes } from '../components/route/Auth.jsx';

const portalOptions = [
  { value: 'client', label: 'Referral' },
  { value: 'ib1', label: 'Partner 001' },
  { value: 'ib2', label: 'Partner 002' },
  { value: 'ib3', label: 'Partner 003' },
];

export default function Login() {
  const [portal, setPortal] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const currentTheme = portalThemes[portal] || portalThemes.client;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] lg:h-screen lg:overflow-hidden">
      {/* Reusable Left Institutional Infrastructure Panel */}
      <AuthLeftPanel portal={portal} />

      {/* Right Form Panel (Clean, expanded, exactly matching original UI & mobile reference) */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto box-border bg-white lg:bg-[#f8fafc]">
        <div className="w-full max-w-[440px] my-auto">
          {/* Top Logo & Portal/Language Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link to="/" className="inline-flex items-center gap-2 shrink-0">
              <img src={logo} alt="Majesty FX" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="font-montserrat font-extrabold text-lg sm:text-xl text-[#0b192c] tracking-tight">
                Majesty <span className="text-[#ff5a0a]">FX</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <LanguageSelector />
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  borderColor: currentTheme.badgeBorder,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: currentTheme.badgeColor,
                }}
              >
                <Users className="w-3 h-3" style={{ color: currentTheme.badgeColor }} />
                {currentTheme.clientBadge}
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-sora text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight mb-1">
            Sign in to your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            {portal !== 'client'
              ? `Access your ${currentTheme.badge} partner network, multi-tier rebates & volume reports`
              : 'Access your live trading cabinet, deposits & execution analytics'}
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Desk / Portal */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0f172a] mb-1.5">
                Select Desk / Portal
              </label>
              <div className="relative">
                <select
                  value={portal}
                  onChange={(e) => setPortal(e.target.value)}
                  className="w-full appearance-none bg-[#f8fafc] border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-[#0f172a] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all cursor-pointer"
                >
                  {portalOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#0f172a] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#0f172a] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all"
                />
              </div>
            </div>

            {/* Password with Forgot Password link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#0f172a]">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs sm:text-sm font-bold text-[#ff5a0a] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#0f172a] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded text-[#ff5a0a] accent-[#ff5a0a] focus:ring-[#ff5a0a] border-slate-300 cursor-pointer"
              />
              <label htmlFor="remember-me" className="text-xs sm:text-sm text-slate-600 cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#ff5a0a] hover:bg-[#e04800] text-white font-sora font-bold py-3.5 px-4 rounded-lg shadow-[0_4px_14px_rgba(255,90,10,0.3)] hover:shadow-[0_6px_20px_rgba(255,90,10,0.4)] transition-all flex items-center justify-center gap-2 text-sm sm:text-base mt-2"
            >
              <span>
                {portal === 'ib1'
                  ? 'Sign In (Partner 001)'
                  : portal === 'ib2'
                  ? 'Sign In (Partner 002)'
                  : 'Sign In'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Create Account Link */}
            <div className="text-center pt-2 text-xs sm:text-sm text-slate-500">
              Don’t have an account?{' '}
              <Link to="/register" className="text-[#ff5a0a] font-bold hover:underline">
                Create an Account
              </Link>
            </div>
          </form>

          {/* Footer Back link and Security info */}
          <div className="mt-8 pt-5 border-t border-slate-200/80 flex items-center justify-between gap-3 text-xs sm:text-[13px] flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#ff5a0a] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to platform</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 text-[#16a34a] font-semibold text-xs sm:text-[13px]">
              <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
              <span>Tier-1 Segregated • 256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
