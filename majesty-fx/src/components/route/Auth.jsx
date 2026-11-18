import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, Eye, EyeOff, Users, Zap } from 'lucide-react';
import logo from '../../assets/logo.png';

export function AuthPanel({ title, text, bullets, children }) {
  return (
    <aside className="auth-panel">
      <span className="auth-badge"><Zap /> MAJESTY FX INSTITUTIONAL INFRASTRUCTURE</span>
      <h1>{title}</h1>
      <p>{text}</p>
      <ul>
        {bullets.map((b) => (
          <li key={b}><CircleCheck /> {b}</li>
        ))}
      </ul>
      {children}
    </aside>
  );
}

export function Brand({ children }) {
  return (
    <div className="auth-brand">
      <Link to="/" className="brand">
        <img src={logo} alt="Majesty FX logo" className="brand-logo" />
        <span className="brand-text">Majesty <span className="accent">FX</span></span>
      </Link>
      {children}
      <span className="auth-portal"><Users /> CLIENT PORTAL</span>
    </div>
  );
}

// Labelled input with a leading icon; password fields get a show/hide toggle.
export function Field({ label, icon: Icon, type = 'text', aside, ...props }) {
  const [shown, setShown] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className="auth-field">
      <span className="auth-label">{label}{aside}</span>
      <span className="auth-input">
        {Icon && <Icon />}
        <input type={isPassword && shown ? 'text' : type} {...props} />
        {isPassword && (
          <button type="button" aria-label={shown ? 'Hide password' : 'Show password'} onClick={() => setShown((v) => !v)}>
            {shown ? <EyeOff /> : <Eye />}
          </button>
        )}
      </span>
    </label>
  );
}

export function SelectField({ label, icon: Icon, options, ...props }) {
  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <span className="auth-input is-select">
        {Icon && <Icon />}
        <select {...props}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </span>
    </label>
  );
}

export const portals = ['Referral', 'Client', 'Introducing Broker (IB)'];
