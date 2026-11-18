import {
  ArrowRight,
  Bitcoin,
  Building2,
  CircleCheck,
  CreditCard,
  LifeBuoy,
  MessageSquare,
  Send,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CTA from '../components/CTA.jsx';
import FAQ from '../components/FAQ.jsx';
import { PageHero, SectionHead } from '../components/route/blocks.jsx';
import loginBadge from '../assets/help/login-badge.png';
import stepFund from '../assets/help/step-fund.png';
import cardLaptop from '../assets/routes/cash.jpg';
import confirmImg from '../assets/help/confirm.png';
import webtraderImg from '../assets/help/webtrader.png';

const steps = [
  {
    title: 'Log in to Your Client Dashboard',
    text: 'Access your Majesty FX Portal and select the trading account you want to fund. Manage multiple accounts easily from one dashboard.',
    img: loginBadge,
  },
  {
    title: 'Click “Deposit Funds”',
    text: 'Open the Deposit section on your dashboard to view all available funding methods and initiate your transaction.',
    img: stepFund,
  },
  {
    title: 'Select Payment Method',
    text: 'Choose from Bank Wire, Credit/Debit Cards, USDT/Crypto, or Local Transfer depending on your region. All channels are 256-bit SSL secured.',
    img: cardLaptop,
  },
  {
    title: 'Enter Amount & Confirm',
    text: 'Specify your desired deposit amount, double-check details, and complete the transaction through our secure gateway.',
    img: confirmImg,
  },
  {
    title: 'Trade Instantly',
    text: 'Once your deposit is confirmed, funds appear immediately in your account — ready to trade global financial markets.',
    img: webtraderImg,
  },
];

const methods = [
  {
    icon: CreditCard,
    title: 'Credit & Debit Cards',
    text: 'Visa, Mastercard, and UnionPay. Instant authorization with 3D Secure bank verification.',
  },
  {
    icon: Building2,
    title: 'Bank Wire Transfer',
    text: 'Direct international SWIFT and SEPA transfers to segregated Tier-1 custodial bank accounts.',
  },
  {
    icon: Bitcoin,
    title: 'Cryptocurrency (USDT/BTC)',
    text: 'Deposit USDT (TRC-20, ERC-20) and Bitcoin seamlessly with blockchain confirmation in minutes.',
  },
  {
    icon: Wallet,
    title: 'E-Wallets & Local Transfers',
    text: 'Neteller, Skrill, Perfect Money, and localized bank transfer options available across 180+ regions.',
  },
];

const safeguards = [
  '256-bit SSL encryption on all payment and terminal endpoints',
  '100% segregated client accounts held with Tier-1 banking partners',
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

      {/* Step-by-Step Deposit Guide */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="container">
          <SectionHead
            icon={CreditCard}
            tag="FUNDING GUIDE"
            title="Step-by-Step [Deposit Guide]"
            sub="Follow these quick and secure steps to fund your Majesty FX live trading account."
          />

          <div className="flex flex-col gap-10 sm:gap-14 mt-10 max-w-[1000px] mx-auto">
            {steps.map((s, i) => {
              const isFlipped = i % 2 === 1;
              return (
                <div
                  key={s.title}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center"
                >
                  {/* Media Image */}
                  <div
                    className={`relative rounded-2xl overflow-hidden shadow-md border border-slate-200 aspect-[16/10] bg-slate-50 flex items-center justify-center ${
                      isFlipped ? 'md:order-2' : 'md:order-1'
                    }`}
                  >
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card with Step Number Badge */}
                  <div
                    className={`relative bg-gradient-to-br from-[#fff7ed] to-white rounded-2xl border border-orange-500/20 p-6 sm:p-8 shadow-[0_6px_20px_rgba(255,106,0,0.06)] ${
                      isFlipped ? 'md:order-1' : 'md:order-2'
                    }`}
                  >
                    {/* Step Number circular gradient badge */}
                    <div className="absolute -top-4 left-5 w-[42px] h-[42px] bg-gradient-to-br from-[#ff5a0a] to-[#ea580c] text-white font-sora font-extrabold text-lg rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.35)]">
                      {i + 1}
                    </div>
                    <h3 className="font-sora text-xl sm:text-[22px] font-bold text-[#0f172a] mt-2 mb-2.5">
                      {s.title}
                    </h3>
                    <p className="font-montserrat text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                      {s.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fast & Secure Payment Methods */}
      <section className="py-16 sm:py-24 bg-[#fafafa] border-b border-slate-200">
        <div className="container">
          <SectionHead
            icon={Wallet}
            tag="INSTANT GATEWAYS"
            title="Fast & Secure [Payment Methods]"
            sub="Deposit and withdraw with ease via globally recognized institutional payment rails with 0% funding fees."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm hover:border-[#ff5a0a]/50 hover:shadow-md transition-all flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#fff7ed] text-[#ff5a0a] flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#ff5a0a]" />
                  </div>
                  <h3 className="font-sora text-lg font-bold text-[#0f172a] mb-2">{m.title}</h3>
                  <p className="font-montserrat text-sm text-slate-600 leading-relaxed">{m.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safe. Regulated. Compliant. */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff5a0a] text-xs font-sora font-bold tracking-wider uppercase mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff5a0a]" />
                <span>BANK-GRADE CLIENT PROTECTION</span>
              </div>
              <h2 className="font-montserrat text-3xl sm:text-4xl font-extrabold text-[#0f172a] leading-tight mb-4">
                Safe. Regulated. <span className="text-[#ff5a0a]">Compliant.</span>
              </h2>
              <p className="font-montserrat text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Your funds are safeguarded under strict international AML/KYC policies and held in segregated custodial accounts across top-tier global banks.
              </p>
              <div className="space-y-3.5">
                {safeguards.map((t) => (
                  <div key={t} className="flex items-center gap-3">
                    <CircleCheck className="w-5 h-5 text-[#16a34a] shrink-0" />
                    <span className="font-montserrat text-sm font-semibold text-[#0f172a]">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fff7ed]/60 to-white border border-[#fed7aa] rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#ff5a0a] text-white flex items-center justify-center mb-5 shadow-lg shadow-[#ff5a0a]/30">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-sora text-xl font-bold text-[#0f172a] mb-2">
                Regulated &amp; Trusted Worldwide
              </h3>
              <p className="font-montserrat text-sm text-slate-600 leading-relaxed mb-6 max-w-[360px]">
                We operate under strict regulatory compliance frameworks, ensuring transparent client custody and zero market conflict of interest.
              </p>
              <Link
                to="/register"
                className="bg-[#ff5a0a] hover:bg-[#e04800] text-white font-sora font-bold px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm"
              >
                <span>Open Protected Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Submit a Support Ticket */}
      <section className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="container max-w-[850px]">
          <SectionHead
            icon={MessageSquare}
            tag="SUPPORT DESK"
            title="Submit a Support [Ticket]"
            sub="Our dedicated technical and treasury support team responds to all inquiries within 1 hour."
          />
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm mt-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Michael Smith"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3 text-sm text-[#0f172a] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="michael@example.com"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3 text-sm text-[#0f172a] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Department / Topic *
                </label>
                <select
                  required
                  defaultValue={departments[0]}
                  className="w-full appearance-none bg-[#f8fafc] border border-slate-200 rounded-lg p-3 text-sm text-[#0f172a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1.5">
                  Message / Ticket Details *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please explain your question or issue in detail..."
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-lg p-3 text-sm text-[#0f172a] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5a0a]/20 focus:border-[#ff5a0a] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff5a0a] hover:bg-[#e04800] text-white font-sora font-bold py-3.5 px-4 rounded-lg shadow-[0_4px_14px_rgba(255,90,10,0.3)] transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <span>Submit Support Ticket</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <FAQ />
      <CTA />
    </>
  );
}
