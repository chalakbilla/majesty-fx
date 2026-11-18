import { ArrowLeft, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthPanel, Brand, Field, SelectField, portals } from '../components/route/Auth.jsx';

const bullets = [
  'Real-time MT4/MT5 bridge & LP liquidity aggregation',
  'Instant crypto USDT (TRC20/ERC20) & wire treasury queues',
  'Automated client KYC & tiered risk compliance scoring',
  'Multi-tier Introducing Broker (IB) automated rebate engine',
];

export default function Login() {
  return (
    <div className="auth auth-login min-h-screen w-full bg-white flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:grid lg:grid-cols-[46%_54%] lg:p-0">
      <AuthPanel
        title="Institutional Trading Operations. Settled with absolute precision."
        text="Unified command center for multi-asset trading, automated KYC compliance, MT4/MT5 bridge liquidity, and instant treasury settlements."
        bullets={bullets}
      />

      <section className="auth-main flex flex-col justify-center px-4 py-6 sm:px-8 lg:px-12 w-full max-w-[540px] mx-auto">
        <Brand showLanguage={true} />

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] mt-1">Sign in to your account</h2>
        <p className="auth-sub text-slate-500 text-sm sm:text-[15px] mt-1 mb-6">
          Access your live trading cabinet, deposits &amp; execution analytics
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="w-full">
          <SelectField label="Select Desk / Portal" options={portals} />
          <Field label="Email Address" icon={Mail} type="email" placeholder="Enter your email" autoComplete="email" required />
          <Field
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            aside={<a href="#forgot" className="auth-link text-xs sm:text-sm">Forgot Password?</a>}
          />
          <label className="auth-check flex items-center gap-2 text-sm text-slate-600 my-4 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#ff5a0a]" /> Remember Me
          </label>
          <button className="auth-submit w-full flex items-center justify-center gap-2 bg-[#ff5a0a] text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-[#ea580c] transition-colors" type="submit">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="auth-switch text-center text-slate-500 text-sm mt-6">
          Don’t have an account? <Link to="/register" className="auth-link text-[#ff5a0a] font-bold">Create an Account</Link>
        </p>
        <footer className="auth-foot flex flex-row justify-between items-center gap-3 pt-6 mt-6 border-t border-slate-100 text-xs sm:text-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#ff5a0a]"><ArrowLeft className="w-4 h-4" /> Back to platform</Link>
          <span className="text-[#16a34a] font-semibold inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Tier-1 Segregated • 256-Bit SSL Encrypted</span>
        </footer>
      </section>
    </div>
  );
}
