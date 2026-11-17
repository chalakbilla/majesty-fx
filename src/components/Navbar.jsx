import { useState } from 'react';
import logo from '../assets/logo.png';

const links = ['Markets', 'Trading', 'Platforms', 'Pricing', 'IB', 'Account Types', 'Help Desk'];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#top" className="brand">
          <img src={logo} alt="Majesty FX logo" className="brand-logo" />
          <span className="brand-text">
            Majesty <span className="accent">FX</span>
          </span>
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setOpen(false)}>
              {l}
              {l === 'Account Types' && <span className="chev">▾</span>}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <a href="#login" className="btn btn-ghost">Log in</a>
          <a href="#create" className="btn btn-primary">Create Account</a>
          <button className="burger" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
