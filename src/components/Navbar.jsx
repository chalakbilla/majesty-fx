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
  const [mobileAcctOpen, setMobileAcctOpen] = useState(false);
  const close = () => {
    setOpen(false);
    setMobileAcctOpen(false);
  };

  return (
    <header className="navbar relative z-50">
      <div className="container navbar-inner flex items-center justify-between w-full">
        <Link to="/" className="brand flex items-center shrink-0" onClick={close}>
          <img src={logo} alt="Majesty FX logo" className="brand-logo" />
          <span className="brand-text whitespace-nowrap">
            Majesty <span className="accent">FX</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={close}>
              {label}
            </NavLink>
          ))}

          {/* Desktop Dropdown */}
          <div className="acct-menu hidden lg:flex">
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

          {/* Mobile Accordion */}
          <div className="w-full lg:hidden flex flex-col">
            <button
              type="button"
              className="flex items-center justify-between w-full py-2 text-left font-semibold text-slate-800"
              onClick={() => setMobileAcctOpen((v) => !v)}
            >
              <span>Account Types</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileAcctOpen ? 'rotate-180 text-orange' : ''}`} />
            </button>
            {mobileAcctOpen && (
              <div className="flex flex-col gap-2 pl-3 py-2 border-l-2 border-orange/40 my-1 bg-slate-50/60 rounded-r-lg">
                {accountLinks.map(([label, sub, to, Icon]) => (
                  <Link key={to} to={to} onClick={close} className="flex items-center gap-3 py-1.5 text-sm text-slate-700 hover:text-orange">
                    <Icon className="w-4 h-4 text-orange shrink-0" />
                    <span>
                      <strong className="block text-xs font-bold">{label}</strong>
                      <span className="block text-[11px] text-slate-500">{sub}</span>
                    </span>
                  </Link>
                ))}
                <Link to="/account-type" className="text-xs font-bold text-orange flex items-center gap-1.5 pt-1" onClick={close}>
                  Compare All Account Types <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/help-desk" onClick={close}>
            Help Desk
          </NavLink>

          {/* Mobile Auth Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 w-full lg:hidden mt-2">
            <Link to="/login" className="btn btn-outline text-center w-full py-2.5 text-sm font-semibold" onClick={close}>
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary text-center w-full py-2.5 text-sm font-bold" onClick={close}>
              Create Account
            </Link>
          </div>
        </nav>

        <div className="nav-actions flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">Log in</Link>
          <Link to="/register" className="btn btn-primary text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">Create Account</Link>
          <button className="burger block lg:hidden p-1.5 text-slate-800" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
