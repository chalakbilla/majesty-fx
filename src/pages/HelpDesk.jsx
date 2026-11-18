import { Bitcoin, Building2, CircleCheck, CreditCard, LifeBuoy, MessageSquare, Send, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA.jsx';
import FAQ from '../components/FAQ.jsx';
import { FeatureGrid, PageHero, Section, SectionHead, Tile } from '../components/route/blocks.jsx';
import loginBadge from '../assets/help/login-badge.png';
import clock from '../assets/help/clock.png';
import devices from '../assets/help/devices.png';
import paymentConfirmed from '../assets/help/payment-confirmed.png';
import cardLaptop from '../assets/routes/cash.jpg';

const steps = [
  { title: 'Log in to Your Client Dashboard', text: 'Access your Majesty FX Portal and select the trading account you want to fund. Manage multiple accounts easily from one dashboard.', img: loginBadge, contain: true },
  { title: 'Click “Deposit Funds”', text: 'Open the Deposit section on your dashboard to view all available funding methods and initiate your transaction.', img: clock, contain: true },
  { title: 'Select Payment Method', text: 'Choose from Bank Wire, Credit/Debit Cards, USDT/Crypto, or Local Transfer depending on your region. All channels are 256-bit SSL secured.', img: cardLaptop },
  { title: 'Enter Amount & Confirm', text: 'Specify your desired deposit amount, double-check details, and complete the transaction through our secure gateway.', img: paymentConfirmed, contain: true },
  { title: 'Trade Instantly', text: 'Once your deposit is confirmed, funds appear immediately in your account — ready to trade global financial markets.', img: devices, contain: true },
];

const methods = [
  { icon: CreditCard, tone: 'peach', title: 'Credit & Debit Cards', text: 'Visa, Mastercard, and UnionPay. Instant authorization with 3D Secure bank verification.' },
  { icon: Building2, tone: 'peach', title: 'Bank Wire Transfer', text: 'Direct international SWIFT and SEPA transfers to segregated Tier-1 custodial bank accounts.' },
  { icon: Bitcoin, tone: 'peach', title: 'Cryptocurrency (USDT/BTC)', text: 'Deposit USDT (TRC-20, ERC-20) and Bitcoin seamlessly with blockchain confirmation in minutes.' },
  { icon: Wallet, tone: 'peach', title: 'E-Wallets & Local Transfers', text: 'Neteller, Skrill, Perfect Money, and localized bank transfer options available across 180+ regions.' },
];

const safeguards = [
  '256-bit SSL encryption on all payment and terminal endpoints',
  'Segregated client accounts held with Tier-1 banking partners',
  'Real-time automated transaction and fraud monitoring',
  'Compliance with international Anti-Money Laundering (AML) laws',
  'Personal accounts only — strictly zero third-party deposits',
];

const departments = [
  'Deposit / Funding Verification',
  'Withdrawal Request',
  'Trading Platform (MT5 / WebTrader)',
  'Account & KYC Verification',
  'IB / Partner Program',
  'Other',
];

export default function HelpDesk() {
  return (
    <>
      <PageHero
        crumbs={['Support & Help Desk']}
        icon={LifeBuoy}
        badge="HELP & SUPPORT"
        title="Help & Support [Desk]"
        sub="Everything you need to fund your account, manage MT5 platforms, and connect with our 24/7 institutional client support team."
      />

      <Section>
        <SectionHead icon={Wallet} tag="FUNDING GUIDE" title="Step-by-Step [Deposit Guide]" sub="Follow these quick and secure steps to fund your Majesty FX live trading account." />
        <ol className="rp-steps">
          {steps.map((s, i) => (
            <li key={s.title} className={`rp-step${i % 2 ? ' is-flip' : ''}`}>
              <figure className="rp-step-media">
                <img src={s.img} alt={s.title} className={s.contain ? 'is-contain' : undefined} />
              </figure>
              <div className="rp-step-card">
                <span className="rp-step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="soft">
        <SectionHead icon={CreditCard} tag="INSTANT GATEWAYS" title="Fast & Secure [Payment Methods]" sub="Deposit and withdraw with ease via globally recognized institutional payment rails with 0% funding fees." />
        <FeatureGrid items={methods} />
      </Section>

      <Section>
        <div className="rp-split">
          <div className="rp-split-copy">
            <span className="rp-badge"><ShieldCheck /> BANK-GRADE CLIENT PROTECTION</span>
            <h2 className="rp-h2 rp-mt">Safe. Regulated. <span className="accent">Compliant.</span></h2>
            <p className="rp-lead">Your funds are safeguarded under strict international AML/KYC policies and held in segregated custodial accounts across top-tier global banks.</p>
            <ul className="rp-ticks">
              {safeguards.map((t) => (
                <li key={t}><CircleCheck /> {t}</li>
              ))}
            </ul>
          </div>
          <article className="rp-card rp-safe-card">
            <Tile icon={ShieldCheck} tone="solid" round />
            <h3>Regulated &amp; Trusted Worldwide</h3>
            <p>We operate under strict regulatory compliance frameworks, ensuring transparent client custody and zero market conflict of interest.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Open Protected Account <ArrowRight /></Link>
          </article>
        </div>
      </Section>

      <Section tone="soft">
        <SectionHead icon={MessageSquare} tag="SUPPORT DESK" title="Submit a Support [Ticket]" sub="Our dedicated technical and treasury support team responds to all inquiries within 1 hour." />
        <form className="rp-form rp-card rp-ticket" onSubmit={(e) => e.preventDefault()}>
          <div className="rp-row">
            <label>Your Full Name *<input required placeholder="e.g. Michael Smith" /></label>
            <label>Email Address *<input required type="email" placeholder="michael@example.com" /></label>
          </div>
          <label>Department / Topic *
            <select required defaultValue={departments[0]}>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>Message / Ticket Details *
            <textarea required rows={5} placeholder="Please explain your question or issue in detail..." />
          </label>
          <button className="btn btn-primary btn-lg btn-block" type="submit">Submit Support Ticket <Send /></button>
        </form>
      </Section>

      <FAQ />
      <CTA />
    </>
  );
}
