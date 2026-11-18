import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { onboardingSteps } from '../data.js';
import stepCreate from '../assets/step-create.png';
import stepVerify from '../assets/step-verify.png';
import stepFund from '../assets/step-fund.png';

const icons = {
  create: { src: stepCreate, alt: 'Create Account' },
  verify: { src: stepVerify, alt: 'Verify Documents' },
  fund: { src: stepFund, alt: 'Fund Account' },
};

const ctaLinks = {
  Create: '/register',
  Verify: '/login',
  'Fund & Trade': '/help-desk',
};

export default function Onboarding() {
  return (
    <section
      className="section section-onboard relative overflow-hidden py-16 md:py-24"
      id="create"
      style={{
        background: 'linear-gradient(rgb(240, 253, 244) 0%, rgb(236, 253, 245) 100%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
      }}
    >
      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        {/* Header matching original reference */}
        <div className="text-center max-w-[780px] mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-white/80 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#ff5a0a]" />
            <span>Fast onboarding</span>
          </div>
          <h2 className="font-montserrat text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0b192c] tracking-tight leading-tight mb-3">
            Start Trading in <span className="text-[#ff5a0a]">Minutes</span>
          </h2>
          <p className="font-montserrat text-sm md:text-base text-slate-600 leading-relaxed">
            A simple 3-step journey to go from signup to live trading — fast, secure, and fully compliant.
          </p>
        </div>

        {/* 3-Step Timeline with central vertical line */}
        <div className="relative max-w-[960px] mx-auto flex flex-col gap-10 md:gap-14">
          {/* Vertical green line (Desktop only) */}
          <div
            className="hidden md:block absolute left-1/2 top-6 bottom-6 w-[3px] bg-[#10b981] -translate-x-1/2 rounded-full z-0 pointer-events-none"
          />

          {onboardingSteps.map((s, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={s.title}
                className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] items-center gap-6 md:gap-8"
              >
                {/* Column 1 (Left on desktop) */}
                <div
                  className={`flex justify-center md:justify-end ${
                    isEven ? 'order-1' : 'order-3 md:order-1 md:pr-4'
                  }`}
                >
                  {isEven ? (
                    /* Step 1 & Step 3: Card on the Left */
                    <div
                      className="bg-white rounded-[18px] p-6 md:p-7 border border-slate-200/90 w-full max-w-[460px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300"
                    >
                      <h3 className="font-montserrat text-xl md:text-[1.35rem] font-bold text-[#064e3b] mb-2">
                        {s.title}
                      </h3>
                      <p className="font-montserrat text-sm md:text-[0.92rem] leading-relaxed text-slate-600 mb-5">
                        {s.text}
                      </p>
                      <Link
                        to={ctaLinks[s.title] || '#'}
                        className="btn btn-primary hover:bg-[#ea580c] hover:text-white transition-all inline-flex items-center text-sm font-semibold py-2.5 px-5 rounded-lg shadow-sm"
                      >
                        {s.cta}
                      </Link>
                    </div>
                  ) : (
                    /* Step 2: KYC Document Image on the Left */
                    <div className="w-[180px] h-[150px] flex items-center justify-center">
                      <img
                        src={icons[s.image].src}
                        alt={icons[s.image].alt}
                        className="w-[125px] h-[125px] md:w-[130px] md:h-[130px] object-contain select-none pointer-events-none"
                      />
                    </div>
                  )}
                </div>

                {/* Column 2 (Center Step Number Badge) */}
                <div className="flex justify-center order-2">
                  <div
                    className="w-[42px] h-[42px] rounded-full bg-[#10b981] text-white font-bold text-[1.1rem] flex items-center justify-center font-montserrat shadow-[0_0_0_6px_#ecfdf5,0_4px_12px_rgba(16,185,129,0.3)] shrink-0 select-none"
                  >
                    {i + 1}
                  </div>
                </div>

                {/* Column 3 (Right on desktop) */}
                <div
                  className={`flex justify-center md:justify-start ${
                    isEven ? 'order-3 md:pl-4' : 'order-1 md:order-3'
                  }`}
                >
                  {isEven ? (
                    /* Step 1 & Step 3: Box / Clock Image on the Right */
                    <div className="w-[180px] h-[150px] flex items-center justify-center">
                      <img
                        src={icons[s.image].src}
                        alt={icons[s.image].alt}
                        className="w-[125px] h-[125px] md:w-[130px] md:h-[130px] object-contain select-none pointer-events-none"
                      />
                    </div>
                  ) : (
                    /* Step 2: Card on the Right */
                    <div
                      className="bg-white rounded-[18px] p-6 md:p-7 border border-slate-200/90 w-full max-w-[460px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300"
                    >
                      <h3 className="font-montserrat text-xl md:text-[1.35rem] font-bold text-[#064e3b] mb-2">
                        {s.title}
                      </h3>
                      <p className="font-montserrat text-sm md:text-[0.92rem] leading-relaxed text-slate-600 mb-5">
                        {s.text}
                      </p>
                      <Link
                        to={ctaLinks[s.title] || '#'}
                        className="btn btn-primary hover:bg-[#ea580c] hover:text-white transition-all inline-flex items-center text-sm font-semibold py-2.5 px-5 rounded-lg shadow-sm"
                      >
                        {s.cta}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
