import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Fixed to the right edge of the viewport so it stays visible while scrolling.
export default function FloatingDock() {
  const [pillOpen, setPillOpen] = useState(true);
  return (
    <div className="dock">
      {pillOpen && (
        <div className="dock-pill">
          <span className="dot-green" />
          <span>Raw Spreads from 0.0 Pips</span>
          <Link to="/register" className="dock-claim">Claim <ArrowRight /></Link>
          <button aria-label="Dismiss" onClick={() => setPillOpen(false)}><X /></button>
        </div>
      )}
      <Link to="/register" className="btn btn-primary dock-cta">Create Account</Link>
    </div>
  );
}
