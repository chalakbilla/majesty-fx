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
    <div className="auth auth-register min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center py-6 sm:py-10 px-3.5 sm:px-6 lg:grid lg:grid-cols-[46%_54%] lg:p-0">
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

      <section className="auth-main flex flex-col justify-center w-full max-w-[620px] mx-auto p-0">
        <div className="auth-card w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-8 shadow-sm">
          <Brand showLanguage={false} />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a] mt-1">Create a New Account</h2>
          <p className="auth-sub text-slate-500 text-sm sm:text-[15px] mt-1 mb-5">Access your secure Majesty FX portal and client dashboard</p>

          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <SelectField label="Portal / Referral Type" options={portals} />
            <div className="auth-row grid grid-cols-2 gap-3 sm:gap-4">
              <Field label="First Name" icon={User} placeholder="e.g. Alexander" required />
              <Field label="Last Name" placeholder="e.g. Vance" required />
            </div>
            <div className="auth-row grid grid-cols-2 gap-3 sm:gap-4">
              <Field label="Email Address" icon={Mail} type="email" placeholder="name@domain.com" required />
              <Field label="Phone Number" icon={Phone} type="tel" placeholder="+44 7000 000000" />
            </div>
            <div className="auth-row grid grid-cols-2 gap-3 sm:gap-4">
              <Field label="Date of Birth" icon={Calendar} type="date" required />
              <SelectField label="Country of Residence" icon={Globe} options={countries} />
            </div>
            <Field label="Password" icon={Lock} type="password" placeholder="Min 8 chars, 1 uppercase, 1 digit" minLength={8} required />

            {referral ? (
              <Field label="Referral Code" placeholder="Enter referral code" />
            ) : (
              <button type="button" className="auth-link auth-plain text-[#ff5a0a] font-semibold text-xs sm:text-sm block my-2 text-left" onClick={() => setReferral(true)}>+ Have a Referral Code?</button>
            )}

            <label className="auth-terms flex gap-2.5 items-start bg-[#f8fafc] border border-slate-200 rounded-lg p-3 text-xs sm:text-[13px] text-slate-600 leading-relaxed my-4 cursor-pointer">
              <input type="checkbox" defaultChecked required className="accent-[#ff5a0a] mt-0.5" />
              <span>
                I confirm that I am at least 18 years of age and agree to the{' '}
                <a href="#terms" className="auth-link is-underlined text-[#ff5a0a]">Client Service Agreement</a> &amp;{' '}
                <a href="#risk" className="auth-link is-underlined text-[#ff5a0a]">Risk Disclosure</a>.
              </span>
            </label>
            <button className="auth-submit w-full flex items-center justify-center gap-2 bg-[#ff5a0a] text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-[#ea580c] transition-colors" type="submit">Create Account <ArrowRight className="w-4 h-4" /></button>
          </form>

          <p className="auth-switch text-center text-slate-500 text-xs sm:text-sm mt-5">
            Already registered with Majesty FX? <Link to="/login" className="auth-link text-[#ff5a0a] font-bold">Sign in here</Link>
          </p>
          <footer className="auth-foot flex flex-row justify-between items-center gap-3 pt-5 mt-5 border-t border-slate-100 text-xs text-slate-500">
            <Link to="/" className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#ff5a0a]"><ArrowLeft className="w-3.5 h-3.5" /> Back to home</Link>
            <span className="text-[#16a34a] font-semibold inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
