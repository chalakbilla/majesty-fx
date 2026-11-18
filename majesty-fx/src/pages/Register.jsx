import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Globe, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthPanel, Brand, Field, SelectField, portals } from '../components/route/Auth.jsx';

const bullets = [
  'Real-time MT4/MT5 bridge & LP liquidity aggregation',
  'Instant crypto USDT (TRC20/ERC20) & wire treasury queues',
  'Automated client KYC & tiered risk compliance scoring',
  'Multi-tier Introducing Broker (IB) automated rebate engine',
];

const countries = ['United Kingdom', 'United States', 'India', 'United Arab Emirates', 'Singapore', 'Australia', 'Canada', 'Germany', 'South Africa', 'Nigeria', 'Brazil', 'Spain'];

export default function Register() {
  const [referral, setReferral] = useState(false);

  return (
    <div className="auth auth-register">
      <AuthPanel
        title="Instant Institutional Onboarding. Secure Client Infrastructure."
        text="Create your verified Majesty FX client cabinet in under 60 seconds with institutional security and automated multi-tier rebate capabilities."
        bullets={bullets}
      >
        <div className="auth-assurance">
          <ShieldCheck />
          <div>
            <strong>Tier-1 Regulated Custody &amp; Liquidity</strong>
            <span>Client capital segregated in top-tier financial institutions.</span>
          </div>
        </div>
      </AuthPanel>

      <section className="auth-main">
        <div className="auth-card">
          <Brand />
          <h2>Create a New Account</h2>
          <p className="auth-sub">Access your secure Majesty FX portal and client dashboard</p>

          <form onSubmit={(e) => e.preventDefault()}>
            <SelectField label="Portal / Referral Type" options={portals} />
            <div className="auth-row">
              <Field label="First Name" icon={User} placeholder="e.g. Alexander" required />
              <Field label="Last Name" placeholder="e.g. Vance" required />
            </div>
            <div className="auth-row is-uneven">
              <Field label="Email Address" icon={Mail} type="email" placeholder="name@domain.com" required />
              <Field label="Phone Number" icon={Phone} type="tel" placeholder="+44 7000 000000" />
            </div>
            <div className="auth-row">
              <Field label="Date of Birth" icon={Calendar} type="date" required />
              <SelectField label="Country of Residence" icon={Globe} options={countries} />
            </div>
            <Field label="Password" icon={Lock} type="password" placeholder="Min 8 chars, 1 uppercase, 1 digit" minLength={8} required />

            {referral ? (
              <Field label="Referral Code" placeholder="Enter referral code" />
            ) : (
              <button type="button" className="auth-link auth-plain" onClick={() => setReferral(true)}>+ Have a Referral Code?</button>
            )}

            <label className="auth-terms">
              <input type="checkbox" defaultChecked required />
              <span>
                I confirm that I am at least 18 years of age and agree to the{' '}
                <a href="#terms" className="auth-link is-underlined">Client Service Agreement</a> &amp;{' '}
                <a href="#risk" className="auth-link is-underlined">Risk Disclosure</a>.
              </span>
            </label>
            <button className="auth-submit" type="submit">Create Account <ArrowRight /></button>
          </form>

          <p className="auth-switch">
            Already registered with Majesty FX? <Link to="/login" className="auth-link">Sign in here</Link>
          </p>
          <footer className="auth-foot">
            <Link to="/"><ArrowLeft /> Back to home</Link>
            <span><ShieldCheck /> 256-Bit SSL Encrypted</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
