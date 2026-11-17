import { useState } from 'react';

// Fixed to the right edge of the viewport so it stays visible while scrolling.
export default function FloatingDock() {
  const [pillOpen, setPillOpen] = useState(true);
  return (
    <div className="dock">
      {pillOpen && (
        <div className="dock-pill">
          <span className="dot-green" />
          <span>Raw Spreads from 0.0 Pips</span>
          <a href="#raw" className="dock-claim">Claim →</a>
          <button aria-label="Dismiss" onClick={() => setPillOpen(false)}>✕</button>
        </div>
      )}
      <a href="#create" className="btn btn-primary dock-cta">Create Account</a>
      <a href="#top" className="dock-top" aria-label="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </a>
    </div>
  );
}
