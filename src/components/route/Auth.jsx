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

export function LanguageSelector({ align = 'left', className = '', value, onChange, variant = 'default' }) {
  const [internalSelected, setInternalSelected] = useState('en');
  const [open, setOpen] = useState(false);
  const selected = value !== undefined ? value : internalSelected;
  const setSelected = onChange || setInternalSelected;
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

  if (variant === 'sidebar') {
    return (
      <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef} className={className}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.85rem',
            borderRadius: '0.625rem',
            border: '1px solid rgb(226, 232, 240)',
            backgroundColor: '#ffffff',
            color: 'rgb(30, 41, 59)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 2px',
          }}
          aria-label="Change Language"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Globe className="text-orange-600" style={{ width: '16px', height: '16px', color: '#ea580c' }} />
            <span
              style={{
                width: '20px',
                height: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '3px',
                overflow: 'hidden',
                boxShadow: 'rgba(15, 23, 42, 0.15) 0px 0px 0px 1px',
                flexShrink: 0,
              }}
            >
              <CurrentFlag title={current.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>
              {current.native}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ChevronDown
              style={{
                width: '14px',
                height: '14px',
                color: '#64748b',
                transition: 'transform 0.15s ease',
                transform: open ? 'rotate(180deg)' : 'none',
              }}
            />
          </div>
        </button>

        {open && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
              zIndex: 99999,
              overflow: 'hidden',
              padding: '0.4rem',
              maxHeight: '300px',
            }}
          >
            <div
              style={{
                padding: '0.45rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#94a3b8',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Select Language</span>
              <Globe size={13} color="#94a3b8" />
            </div>
            <div style={{ maxHeight: '230px', overflowY: 'auto' }}>
              {languages.map((lang) => {
                const ItemFlag = lang.Flag;
                const isSelected = lang.code === selected;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelected(lang.code);
                      setOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                      color: isSelected ? '#c2410c' : '#1e293b',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span
                        style={{
                          width: '20px',
                          height: '14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          boxShadow: 'rgba(15, 23, 42, 0.15) 0px 0px 0px 1px',
                          flexShrink: 0,
                        }}
                      >
                        <ItemFlag title={lang.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ lineHeight: 1.2 }}>{lang.native}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1px' }}>{lang.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={12} strokeWidth={3} style={{ color: '#ea580c' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`auth-lang-wrap ${className}`} ref={dropdownRef}>
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
        <div
          className="lang-dialog"
          role="dialog"
          aria-label="Select Language"
          style={align === 'right' ? { left: 'auto', right: 0 } : undefined}
        >
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
