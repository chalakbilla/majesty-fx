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

const mobileNavLinks = [
  ['Markets', '/markets'],
  ['Trading', '/trading'],
  ['Platforms', '/platform'],
  ['Pricing', '/pricing'],
  ['IB', '/ib'],
  ['Account Types', '/account-type'],
  ['Help Desk', '/help-desk'],
];

const accountLinks = [
  ['Forex Accounts', '60+ pairs, 0.0 pip spreads', '/forex', TrendingUp],
  ['Metals Accounts', 'Spot Gold & Silver', '/metals', Coins],
  ['Indices Accounts', 'US30, NAS100, DAX', '/indices', BarChart3],
  ['Crypto Accounts', '24/7 Bitcoin & Ethereum', '/crypto', Sparkles],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
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

        {/* Desktop Navigation */}
        <nav className="nav-links hidden lg:flex items-center gap-7">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={close}>
              {label}
            </NavLink>
          ))}

          {/* Desktop Dropdown */}
          <div className="acct-menu flex items-center">
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

        {/* Action Buttons & Burger Button */}
        <div className="nav-actions flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="btn btn-ghost hidden lg:inline-flex">Log in</Link>
          <Link to="/register" className="btn btn-primary hidden lg:inline-flex">Create Account</Link>
          <button
            type="button"
            className="lg:hidden flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5 text-slate-800" strokeWidth={2} /> : <Menu className="w-5 h-5 text-slate-800" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (matches reference screenshot) */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-white border-t border-slate-100 border-b border-slate-200 shadow-xl z-50 max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="container py-2 flex flex-col">
            {mobileNavLinks.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                onClick={close}
                className={({ isActive }) =>
                  `block py-3.5 text-[17px] font-bold border-b border-slate-100 transition-colors ${
                    isActive ? 'text-[#ff5a0a]' : 'text-[#0f172a] hover:text-[#ff5a0a]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="flex items-center gap-3 pt-6 pb-6 w-full">
              <Link
                to="/login"
                onClick={close}
                className="flex-1 py-3 px-4 text-center font-bold text-[15px] text-[#0f172a] bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="flex-1 py-3 px-4 text-center font-bold text-[15px] text-white bg-[#ff5a0a] rounded-lg shadow-md hover:bg-[#ea580c] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
