import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { LanguageSelector } from '../components/route/Auth.jsx';

const bullets = [
  'Real-time MT4/MT5 bridge & LP liquidity aggregation',
  'Instant crypto USDT (TRC20/ERC20) & wire treasury queues',
  'Automated client KYC & tiered risk compliance scoring',
  'Multi-tier Introducing Broker (IB) automated rebate engine',
];

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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Left Institutional Infrastructure Panel (Desktop only, hidden on mobile/tablet) */}
      <div
        className="hidden lg:flex lg:w-1/2 min-h-screen text-white p-10 xl:p-16 flex-col justify-center relative overflow-y-auto box-border"
        style={{
          background:
            'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px) 0% 0% / 36px 36px, linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px) 0% 0% / 36px 36px, linear-gradient(145deg, #f97316 0%, #ea580c 45%, #c2410c 100%)',
        }}
      >
        <div className="max-w-[560px] w-full mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Majesty FX Institutional Infrastructure</span>
          </div>

          <h1 className="font-sora text-3xl xl:text-4xl 2xl:text-[44px] font-extrabold leading-[1.18] tracking-tight mb-5">
            Institutional Trading Operations. Settled with absolute precision.
          </h1>

          <p className="text-white/90 text-sm xl:text-base leading-relaxed mb-8">
            Unified command center for multi-asset trading, automated KYC compliance, MT4/MT5 bridge
            liquidity, and instant treasury settlements.
          </p>

          <div className="space-y-3.5 mb-10">
            {bullets.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <CircleCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span className="text-sm xl:text-[15px] font-medium text-white/95">{b}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-white">Tier-1 Regulated Custody &amp; Liquidity</div>
              <div className="text-xs text-white/80 mt-0.5">
                Client capital segregated in top-tier financial institutions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel (Clean, expanded, exactly matching original UI & mobile reference) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto box-border bg-white lg:bg-[#f8fafc]">
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
              <span className="inline-flex items-center gap-1.5 bg-[#fff7ed] border border-[#fed7aa] text-[#ea580c] px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
                <Users className="w-3 h-3 text-[#ea580c]" />
                Client Portal
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="font-sora text-2xl sm:text-[28px] font-extrabold text-[#0f172a] tracking-tight mb-1">
            Sign in to your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Access your live trading cabinet, deposits &amp; execution analytics
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
              <span>Sign In</span>
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
