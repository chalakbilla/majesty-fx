import { onboardingSteps } from '../data.js';
import stepCreate from '../assets/step-create.png';
import stepVerify from '../assets/step-verify.png';
import stepFund from '../assets/step-fund.png';

const icons = { create: stepCreate, verify: stepVerify, fund: stepFund };

export default function Onboarding() {
  return (
    <section className="section section-onboard" id="create">
      <div className="container">
        <div className="center-stack">
          <span className="eyebrow">Fast onboarding</span>
          <h2 className="h2">
            Start Trading in <span className="accent">Minutes</span>
          </h2>
          <p className="section-sub">A simple 3-step journey from signup to live trading — fast, secure, and fully compliant.</p>
        </div>

        <div className="timeline">
          <div className="timeline-line" />
          {onboardingSteps.map((s, i) => (
            <div key={s.title} className={`timeline-row ${i % 2 === 1 ? 'flip' : ''}`}>
              <div className="timeline-card">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a href="#start" className="btn btn-primary btn-sm">{s.cta}</a>
              </div>
              <div className="timeline-dot">{i + 1}</div>
              <div className="timeline-icon">
                <img src={icons[s.image]} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
