import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthLeftPanel, portalThemes } from '../components/route/Auth.jsx';

const portalOptions = [
  { value: 'client', label: 'Referral' },
  { value: 'ib1', label: 'Partner 001' },
  { value: 'ib2', label: 'Partner 002' },
  { value: 'ib3', label: 'Partner 003' },
];

const countries = [
  'United Kingdom',
  'United Arab Emirates',
  'India',
  'Singapore',
  'Germany',
  'Switzerland',
  'Australia',
  'Canada',
  'Other International',
];

export default function Register() {
  const [portal, setPortal] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const currentTheme = portalThemes[portal] || portalThemes.client;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] lg:h-screen lg:overflow-hidden">
      {/* Reusable Left Institutional Infrastructure Panel */}
      <AuthLeftPanel portal={portal} />

      {/* Right Form Card Section */}
      <div className="w-full flex-1 lg:w-1/2 min-h-screen lg:h-screen flex flex-col items-center justify-center p-3.5 sm:p-6 md:p-10 bg-[#f8fafc] overflow-y-auto box-border">
        <div className="w-full max-w-[560px] bg-white rounded-2xl p-5 sm:p-8 md:p-10 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.04)] border border-slate-200 my-auto">
          {/* Logo & Client Portal Header */}
          <div className="flex items-center justify-between mb-5 gap-3">
            <Link to="/" className="inline-flex items-center gap-2 shrink-0">
              <img src={logo} alt="Majesty FX Emblem" className="h-[34px] w-auto object-contain" />
              <span className="font-extrabold text-[clamp(1.05rem,4vw,1.35rem)] tracking-tight text-[#0b192c]">
                Majesty&nbsp;<span className="text-[#f97316]">FX</span>
              </span>
            </Link>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap transition-colors"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.badgeBorder,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: currentTheme.badgeColor,
              }}
            >
              <Users className="w-3.5 h-3.5" style={{ color: currentTheme.badgeColor }} />
              <span>{currentTheme.clientBadge}</span>
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-[clamp(1.4rem,2.2vw,1.7rem)] font-extrabold text-slate-900 font-sora tracking-tight mb-1">
              Create a New Account
            </h2>
            <p className="text-[0.9rem] text-slate-500 leading-normal m-0">
              Access your secure Majesty FX portal and client dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Portal / Referral Type */}
            <div>
              <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                Portal / Referral Type
              </label>
              <div className="relative">
                <select
                  value={portal}
                  onChange={(e) => setPortal(e.target.value)}
                  className="w-full py-[0.72rem] pl-[0.85rem] pr-[2.2rem] rounded-lg border-[1.5px] border-slate-300 bg-slate-50 text-[0.92rem] text-slate-900 font-semibold cursor-pointer outline-none appearance-none focus:border-orange focus:ring-1 focus:ring-orange/20"
                >
                  {portalOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* First Name & Last Name (2 columns) */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Alexander"
                    className="w-full py-[0.72rem] pr-[0.85rem] pl-[2.35rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vance"
                  className="w-full py-[0.72rem] px-[0.85rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                />
              </div>
            </div>

            {/* Email Address & Phone Number (side-by-side in 2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr] gap-3.5">
              <div>
                <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    required
                    type="email"
                    placeholder="name@domain.com"
                    className="w-full py-[0.72rem] pr-[0.85rem] pl-[2.35rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    required
                    type="tel"
                    placeholder="+44 7000 000000"
                    className="w-full py-[0.72rem] pr-[0.85rem] pl-[2.35rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth & Country of Residence (2 columns) */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    required
                    type="date"
                    className="w-full py-[0.72rem] pr-[0.85rem] pl-[2.35rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                  Country of Residence
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    defaultValue="United Kingdom"
                    className="w-full py-[0.72rem] pl-[2.35rem] pr-[2.2rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 cursor-pointer outline-none appearance-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  required
                  minLength={8}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 digit"
                  className="w-full py-[0.72rem] pl-[2.35rem] pr-[2.4rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange focus:ring-1 focus:ring-orange/20 transition-all"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 bg-transparent border-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral Code Toggle */}
            <div>
              {showReferral ? (
                <div>
                  <label className="block text-[0.84rem] font-semibold text-slate-700 mb-1.5">
                    Referral Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    className="w-full py-[0.72rem] px-[0.85rem] rounded-lg border-[1.5px] border-slate-300 bg-white text-[0.92rem] text-slate-900 outline-none focus:border-orange"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReferral(true)}
                  className="text-[#f97316] hover:text-[#ea580c] font-semibold text-[0.84rem] py-0.5 inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer"
                >
                  + Have a Referral Code?
                </button>
              )}
            </div>

            {/* Terms and Agreements Box */}
            <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3 sm:px-4 sm:py-3.5 mt-1">
              <input
                id="terms"
                type="checkbox"
                defaultChecked
                required
                className="w-[18px] h-[18px] mt-0.5 rounded accent-[#f97316] cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-[0.84rem] text-slate-600 leading-normal cursor-pointer">
                I confirm that I am at least 18 years of age and agree to the{' '}
                <a href="#terms" className="text-[#f97316] font-bold underline hover:text-[#ea580c]">
                  Client Service Agreement
                </a>{' '}
                &amp;{' '}
                <a href="#risk" className="text-[#f97316] font-bold underline hover:text-[#ea580c]">
                  Risk Disclosure
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-5 text-base font-bold text-white bg-[#f97316] hover:bg-[#ea580c] border-0 rounded-[9px] shadow-[0_4px_14px_rgba(234,88,12,0.35)] flex items-center justify-center gap-2 mt-2 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>

            {/* Sign in switch */}
            <div className="text-center mt-2 text-[0.88rem] text-slate-500">
              Already registered with Majesty FX?{' '}
              <Link to="/login" className="text-[#f97316] font-bold hover:underline">
                Sign in here
              </Link>
            </div>
          </form>

          {/* Footer Security / Back Row */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[0.8rem] text-slate-500">
            <Link to="/" className="text-slate-500 hover:text-[#f97316] inline-flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
            <div className="inline-flex items-center gap-1.5 text-green-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
