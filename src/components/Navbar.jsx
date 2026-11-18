import { ArrowRight, BarChart3, ChevronDown, Coins, Menu, Sparkles, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const links = [
  ['Markets', '/markets'],
  ['Trading', '/trading'],
  ['Platforms', '/platform'],
  ['Pricing', '/pricing'],
  ['IB', '/ib'],
];

const accountLinks = [
  ['Forex Accounts', '60+ pairs, 0.0 pip spreads', '/forex', TrendingUp],
  ['Metals Accounts', 'Spot Gold & Silver', '/metals', Coins],
  ['Indices Accounts', 'US30, NAS100, DAX', '/indices', BarChart3],
  ['Crypto Accounts', '24/7 Bitcoin & Ethereum', '/crypto', Sparkles],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="Majesty FX logo" className="brand-logo" />
          <span className="brand-text">
            Majesty <span className="accent">FX</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={close}>
              {label}
            </NavLink>
          ))}

          <div className="acct-menu">
            <NavLink to="/account-type" onClick={close}>
              Account Types <ChevronDown className="chev" />
            </NavLink>
            <div className="acct-dropdown">
              <div className="acct-panel">
                {accountLinks.map(([label, sub, to, Icon]) => (
                  <Link key={to} to={to} onClick={close}>
                    <Icon />
                    <span>
                      <b>{label}</b>
                      <small>{sub}</small>
                    </span>
                  </Link>
                ))}
                <Link to="/account-type" className="acct-compare" onClick={close}>
                  Compare All Account Types <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <NavLink to="/help-desk" onClick={close}>
            Help Desk
          </NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Create Account</Link>
          <button className="burger" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
