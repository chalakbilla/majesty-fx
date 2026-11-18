import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { countBy } from 'lodash-es';
import { useState } from 'react';
import { faqs } from '../data.js';

const categories = ['All Topics', 'Funding', 'Trading', 'Platforms', 'Accounts', 'Security', 'Partners'];
const counts = { 'All Topics': faqs.length, ...countBy(faqs, 'tag') };

export default function FAQ() {
  const [active, setActive] = useState('All Topics');
  const [open, setOpen] = useState(-1);

  const visible = faqs
    .map((f, i) => ({ ...f, index: i }))
    .filter((f) => active === 'All Topics' || f.tag === active);

  return (
    <section className="section section-faq" id="help">
      <div className="container faq-grid grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-12 items-start">
        <div className="faq-side">
          <span className="faq-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" /><circle cx="12" cy="17.5" r=".6" fill="currentColor" />
            </svg>
            KNOWLEDGE BASE &amp; FAQ
          </span>
          <h2 className="faq-title">
            Frequently Asked <span className="accent">Questions</span>
          </h2>
          <p className="faq-desc">
            Got questions about trading conditions, funding, sub-20ms execution, or regulatory fund safety? Here are the facts.
          </p>

          <ul className="faq-cats flex flex-wrap lg:flex-col gap-2">
            {categories.map((c) => (
              <li key={c}>
                <button
                  className={active === c ? 'active' : ''}
                  onClick={() => { setActive(c); setOpen(-1); }}
                >
                  {c}
                  <span className="count">{counts[c] || 0}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="help-card">
            <div className="help-head">
              <span className="help-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 14v-2a9 9 0 0 1 18 0v2" /><rect x="3" y="14" width="4" height="6" rx="1" /><rect x="17" y="14" width="4" height="6" rx="1" />
                </svg>
              </span>
              <div>
                <h4>Can’t find your answer?</h4>
                <small>Institutional Dealing Desk 24/7</small>
              </div>
            </div>
            <p>Our senior support desk and liquidity engineers are available around the clock via live chat and tickets.</p>
            <a href="#support" className="btn btn-primary">Contact Help Desk <ArrowRight /></a>
          </div>
        </div>

        <div className="faq-list">
          {visible.map((f) => {
            const isOpen = open === f.index;
            return (
              <div key={f.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : f.index)} aria-expanded={isOpen}>
                  <span>{f.q}</span>
                  <span className="faq-meta">
                    <span className="faq-tag">{f.tag.toUpperCase()}</span>
                    <span className="faq-chev">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
                  </span>
                </button>
                {isOpen && <div className="faq-a">{f.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
