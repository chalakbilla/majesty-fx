import { ArrowLeft, ArrowRight, ChevronDown, Globe, Lock, Mail, ShieldCheck } from 'lucide-react';
import { GB } from 'country-flag-icons/react/3x2';
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
    <div className="auth auth-login">
      <AuthPanel
        title="Institutional Trading Operations. Settled with absolute precision."
        text="Unified command center for multi-asset trading, automated KYC compliance, MT4/MT5 bridge liquidity, and instant treasury settlements."
        bullets={bullets}
      />

      <section className="auth-main">
        <Brand>
          <button type="button" className="auth-lang">
            <Globe /> <GB title="English" /> English <ChevronDown />
          </button>
        </Brand>

        <h2>Sign in to your account</h2>
        <p className="auth-sub">Access your live trading cabinet, deposits &amp; execution analytics</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <SelectField label="Select Desk / Portal" options={portals} />
          <Field label="Email Address" icon={Mail} type="email" placeholder="Enter your email" autoComplete="email" required />
          <Field
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            aside={<a href="#forgot" className="auth-link">Forgot Password?</a>}
          />
          <label className="auth-check">
            <input type="checkbox" defaultChecked /> Remember Me
          </label>
          <button className="auth-submit" type="submit">Sign In <ArrowRight /></button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register" className="auth-link">Create an Account</Link>
        </p>
        <footer className="auth-foot">
          <Link to="/"><ArrowLeft /> Back to platform</Link>
          <span><ShieldCheck /> Tier-1 Segregated • 256-Bit SSL Encrypted</span>
        </footer>
      </section>
    </div>
  );
}
