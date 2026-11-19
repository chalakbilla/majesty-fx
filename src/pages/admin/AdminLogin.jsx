import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Server,
  Shield,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { loginAdmin, isAdminAuthenticated } from '../../utils/adminAuth.js';

export default function AdminLogin() {
  const [emailOrUsername, setEmailOrUsername] = useState('demo@majestyfx.com');
  const [password, setPassword] = useState('Demo@2026!');
  const [desk, setDesk] = useState('referral');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      const dest = location.state?.from?.pathname || '/admin/demo';
      navigate(dest, { replace: true });
    }
  }, [navigate, location]);

  const deskOptions = [
    { id: 'referral', name: 'Referral', label: 'Referral', icon: Users, color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
    { id: 'ib1', name: 'Partner 001', label: 'Partner 001', icon: Server, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'ib2', name: 'Partner 002', label: 'Partner 002', icon: Server, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    { id: 'ib3', name: 'Partner 003', label: 'Partner 003', icon: Server, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { id: 'demo', name: 'Demo Sandbox', label: 'Demo Sandbox', icon: Shield, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' }
  ];

  const currentDesk = deskOptions.find((d) => d.id === desk) || deskOptions[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(emailOrUsername, password, desk);
      setLoading(false);
      if (res.success) {
        const dest = location.state?.from?.pathname || '/admin/demo';
        navigate(dest, { replace: true });
      } else {
        setError(res.error);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-montserrat lg:h-screen lg:overflow-hidden">
      {/* Left Institutional Gradient Panel (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 min-h-screen lg:h-screen flex-col justify-center px-10 xl:px-16 py-12 text-white relative select-none bg-gradient-to-br from-[#f97316] via-[#ea580c] to-[#c2410c]">
        <div className="max-w-[580px] z-10">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-8 bg-white/15 border border-white/30 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Majesty FX Institutional Infrastructure</span>
          </div>

          <h1 className="font-sora text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white mb-4">
            Referral & Direct Network Administration.
          </h1>

          <p className="text-sm xl:text-base text-white/90 leading-relaxed mb-8">
            Dedicated management console for Direct & Referral clients, standard PAMM pools, and primary MajestyFX MT5 infrastructure (176.126.66.38:443).
          </p>

          {/* Feature checklist */}
          <div className="flex flex-col gap-3.5 text-sm font-medium">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>Dedicated primary MT5 gateway synchronization (176.126.66.38:443 • Manager 2000)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>Segregated Direct & Referral client directory & trade ledger</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>Automated multi-tier referral tracking & rebate engine</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <span>Real-time client deposit/withdrawal treasury authorization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-full lg:w-1/2 min-h-screen lg:h-screen flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-[440px] my-auto">
          {/* Top Brand & Desk Pill */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link to="/" className="inline-flex items-center gap-2 shrink-0 no-underline">
              <img src={logo} alt="Majesty FX" className="h-8 w-auto object-contain" />
              <span className="font-montserrat font-extrabold text-lg text-[#0b192c] tracking-tight">
                Majesty <span className="text-[#ff5a0a]">FX</span>
              </span>
            </Link>

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap"
              style={{
                backgroundColor: currentDesk.bg,
                borderColor: currentDesk.border,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: currentDesk.color,
              }}
            >
              <currentDesk.icon className="w-3.5 h-3.5" style={{ color: currentDesk.color }} />
              {currentDesk.label} Desk
            </span>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="font-sora text-2xl font-extrabold text-[#0f172a] tracking-tight mb-1">
              Sign In - {currentDesk.label}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select administration desk and authenticate with authorized credentials
            </p>
          </div>

          {/* Desk Selector Dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sora">
              Select Administration Desk
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <currentDesk.icon className="w-4 h-4" style={{ color: currentDesk.color }} />
              </div>
              <select
                id="admin-desk-selector"
                value={desk}
                onChange={(e) => setDesk(e.target.value)}
                className="w-full py-2.5 pl-10 pr-9 rounded-lg border text-sm font-bold font-sora text-slate-900 bg-[#fff7ed] border-[#fed7aa] outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500/20"
                style={{
                  backgroundColor: currentDesk.bg,
                  borderColor: currentDesk.border,
                }}
              >
                {deskOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-white text-slate-900 font-medium">
                    {opt.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email / Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="demo@majestyfx.com"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-9 pr-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#ff5a0a] focus:ring-2 focus:ring-[#ff5a0a]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-9 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-[#ff5a0a] focus:ring-2 focus:ring-[#ff5a0a]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="rememberAdmin"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#ff5a0a] focus:ring-[#ff5a0a] cursor-pointer"
              />
              <label htmlFor="rememberAdmin" className="text-xs text-slate-600 cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-sm font-bold font-sora flex items-center justify-center gap-2 rounded-lg cursor-pointer bg-[#ff5a0a] hover:bg-[#ea580c] text-white shadow-[0_4px_14px_rgba(255,90,10,0.3)] transition-all disabled:opacity-70 mt-1"
            >
              <span>{loading ? 'Authenticating...' : `Sign In (${currentDesk.label})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom links */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-slate-600 hover:text-[#ff5a0a] font-medium transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch to Client Portal</span>
              </Link>
              <span>•</span>
              <Link to="/admin/demo" className="text-red-600 hover:underline font-semibold inline-flex items-center gap-1">
                <span>Demo Sandbox</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tier-1 Segregated • 256-Bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
