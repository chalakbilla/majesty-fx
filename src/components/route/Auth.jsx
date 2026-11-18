import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, CircleCheck, Eye, EyeOff, Globe, Users, Zap } from 'lucide-react';
import { AE, CN, DE, ES, FR, GB, PK, RU, TR } from 'country-flag-icons/react/3x2';
import logo from '../../assets/logo.png';

export const languages = [
  { code: 'en', name: 'English', native: 'English', Flag: GB },
  { code: 'ar', name: 'Arabic', native: 'العربية', Flag: AE, rtl: true },
  { code: 'es', name: 'Spanish', native: 'Español', Flag: ES },
  { code: 'fr', name: 'French', native: 'Français', Flag: FR },
  { code: 'de', name: 'German', native: 'Deutsch', Flag: DE },
  { code: 'ru', name: 'Russian', native: 'Русский', Flag: RU },
  { code: 'zh', name: 'Chinese', native: '简体中文', Flag: CN },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', Flag: TR },
  { code: 'ur', name: 'Urdu', native: 'اردو', Flag: PK, rtl: true },
];

export function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('en');
  const dropdownRef = useRef(null);

  const current = languages.find((l) => l.code === selected) || languages[0];
  const CurrentFlag = current.Flag;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="auth-lang-wrap" ref={dropdownRef}>
      <button
        type="button"
        className={`auth-lang ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Globe />
        <CurrentFlag title={current.name} className="lang-btn-flag" />
        <span>{current.native}</span>
        <ChevronDown className={`lang-chev ${open ? 'is-rotated' : ''}`} />
      </button>

      {open && (
        <div className="lang-dialog" role="dialog" aria-label="Select Language">
          <div className="lang-dialog-head">
            <span>SELECT LANGUAGE</span>
            <Globe />
          </div>
          <div className="lang-dialog-list">
            {languages.map((lang) => {
              const ItemFlag = lang.Flag;
              const isSelected = lang.code === selected;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-item ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    setSelected(lang.code);
                    setOpen(false);
                  }}
                >
                  <ItemFlag title={lang.name} className="lang-flag" />
                  <div className="lang-names">
                    <span className="lang-native">{lang.native}</span>
                    <span className="lang-sub">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="lang-check" />}
                  {lang.rtl && <span className="lang-rtl">RTL</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export { default as AuthLeftPanel, portalThemes } from './AuthLeftPanel.jsx';

export function AuthPanel({ title, text, bullets, children }) {
  return (
    <aside className="auth-panel hidden lg:flex flex-col justify-center">
      <div className="max-w-[520px]">
        <span className="auth-badge mb-7"><Zap /> MAJESTY FX INSTITUTIONAL INFRASTRUCTURE</span>
        <h1 className="text-white">{title}</h1>
        <p>{text}</p>
        <ul className="flex flex-col gap-4">
          {bullets.map((b) => (
            <li key={b}><CircleCheck /> {b}</li>
          ))}
        </ul>
        {children && <div className="mt-10 pt-7 border-t border-white/[0.22]">{children}</div>}
      </div>
    </aside>
  );
}

export function Brand({ showLanguage = false }) {
  return (
    <div className="auth-brand w-full mb-6">
      {showLanguage ? (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 w-full">
          <div className="flex items-center justify-between">
            <Link to="/" className="brand flex items-center shrink-0">
              <img src={logo} alt="Majesty FX logo" className="brand-logo" />
              <span className="brand-text whitespace-nowrap">
                Majesty&nbsp;<span className="accent">FX</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
            <LanguageSelector />
            <span className="auth-portal shrink-0">
              <Users /> CLIENT PORTAL
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="brand flex items-center shrink-0">
            <img src={logo} alt="Majesty FX logo" className="brand-logo" />
            <span className="brand-text whitespace-nowrap">
              Majesty&nbsp;<span className="accent">FX</span>
            </span>
          </Link>
          <span className="auth-portal shrink-0">
            <Users /> CLIENT PORTAL
          </span>
        </div>
      )}
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
