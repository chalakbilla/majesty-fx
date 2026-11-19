import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Wallet,
  ListOrdered,
  CheckCircle2,
  Award,
  TrendingUp,
  ArrowRight,
  Globe,
  Check,
  Users,
  Bell,
  Lock,
  Key,
  Send,
  Save,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_notification_settings';
const LANG_STORAGE_KEY = 'majesty_language';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    ),
  },
  {
    code: 'ar',
    name: 'Arabic',
    native: 'العربية',
    dir: 'RTL',
    rtl: true,
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="60" height="10" y="0" fill="#00732F" />
        <rect width="60" height="10" y="10" fill="#FFFFFF" />
        <rect width="60" height="10" y="20" fill="#000000" />
        <rect width="16" height="30" x="0" y="0" fill="#FF0000" />
      </svg>
    ),
  },
  {
    code: 'es',
    name: 'Spanish',
    native: 'Español',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="60" height="7.5" y="0" fill="#AA151B" />
        <rect width="60" height="15" y="7.5" fill="#F1BF00" />
        <rect width="60" height="7.5" y="22.5" fill="#AA151B" />
        <circle cx="18" cy="15" r="3" fill="#AA151B" opacity="0.8" />
      </svg>
    ),
  },
  {
    code: 'fr',
    name: 'French',
    native: 'Français',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="20" height="30" x="0" fill="#002654" />
        <rect width="20" height="30" x="20" fill="#FFFFFF" />
        <rect width="20" height="30" x="40" fill="#CE1126" />
      </svg>
    ),
  },
  {
    code: 'de',
    name: 'German',
    native: 'Deutsch',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="60" height="10" y="0" fill="#000000" />
        <rect width="60" height="10" y="10" fill="#DD0000" />
        <rect width="60" height="10" y="20" fill="#FFCE00" />
      </svg>
    ),
  },
  {
    code: 'ru',
    name: 'Russian',
    native: 'Русский',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="60" height="10" y="0" fill="#FFFFFF" />
        <rect width="60" height="10" y="10" fill="#0039A6" />
        <rect width="60" height="10" y="20" fill="#D52B1E" />
      </svg>
    ),
  },
  {
    code: 'zh',
    name: 'Chinese',
    native: '简体中文',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="60" height="30" fill="#EE1C25" />
        <polygon
          points="10,5 11.5,9 15.5,9 12.3,11.5 13.5,15.5 10,13 6.5,15.5 7.7,11.5 4.5,9 8.5,9"
          fill="#FFDE00"
        />
        <circle cx="19" cy="5" r="1.2" fill="#FFDE00" />
        <circle cx="22" cy="8" r="1.2" fill="#FFDE00" />
        <circle cx="22" cy="12" r="1.2" fill="#FFDE00" />
        <circle cx="19" cy="15" r="1.2" fill="#FFDE00" />
      </svg>
    ),
  },
  {
    code: 'tr',
    name: 'Turkish',
    native: 'Türkçe',
    dir: 'LTR',
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="60" height="30" fill="#E30A17" />
        <circle cx="23" cy="15" r="7.5" fill="#FFFFFF" />
        <circle cx="25" cy="15" r="6" fill="#E30A17" />
        <polygon points="33,15 30.5,13.8 31.2,16.5 29.2,14.8 32,14.8 29.8,16.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: 'ur',
    name: 'Urdu',
    native: 'اردو',
    dir: 'RTL',
    rtl: true,
    flag: (
      <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none">
        <rect width="15" height="30" x="0" y="0" fill="#FFFFFF" />
        <rect width="45" height="30" x="15" y="0" fill="#01411C" />
        <circle cx="37" cy="15" r="8" fill="#FFFFFF" />
        <circle cx="39" cy="13.5" r="7.2" fill="#01411C" />
        <polygon
          points="42,10 43,12.5 45.5,12.5 43.5,14 44.2,16.5 42,15 39.8,16.5 40.5,14 38.5,12.5 41,12.5"
          fill="#FFFFFF"
        />
      </svg>
    ),
  },
];

const EVENT_ITEMS = [
  { title: 'Contact Form Inquiries', desc: 'Direct website & helpdesk messages' },
  { title: 'Support Tickets & Replies', desc: 'Client created tickets & replies' },
  { title: 'KYC Document Submissions', desc: 'New passport / ID submissions' },
  { title: 'MT5 Account Openings', desc: 'Live & Demo account requests' },
  { title: 'Deposit Requests', desc: 'USDT & Bank proof uploads' },
  { title: 'Withdrawal Requests', desc: 'Payout requests requiring approval' },
  { title: 'IB Partner Applications', desc: 'Introducing broker registrations' },
];

export default function AdminSettings() {
  const location = useLocation();

  // Smooth scroll to Language & Regional Settings if tab=language
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'language') {
      const timer = setTimeout(() => {
        const el = document.getElementById('language-settings');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  });

  // Notification Email form state
  const [enabled, setEnabled] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('demo@majestyfx.com');

  // Security & Password state
  const [currentPassword, setCurrentPassword] = useState('Demo@2026!');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  // General feedback and button states
  const [statusMessage, setStatusMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedSettingsStr = localStorage.getItem(STORAGE_KEY);
      if (savedSettingsStr) {
        const saved = JSON.parse(savedSettingsStr);
        if (typeof saved.enabled === 'boolean') setEnabled(saved.enabled);
        if (saved.email) setNotificationEmail(saved.email);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang.code);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang.code);
      document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang.code;
    } catch {
      // ignore
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (!newPassword || newPassword.length < 8) {
      setPasswordFeedback({
        type: 'error',
        text: 'New password must be at least 8 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: 'error',
        text: 'New password and confirm password do not match.',
      });
      return;
    }

    setPasswordUpdating(true);
    setTimeout(() => {
      setPasswordUpdating(false);
      setPasswordFeedback({
        type: 'success',
        text: 'Portal administrator password updated successfully. Changes are active immediately.',
      });
      setCurrentPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    }, 600);
  };

  const handleSendTest = (e) => {
    e.preventDefault();
    setSendingTest(true);
    setStatusMessage(null);

    setTimeout(() => {
      setSendingTest(false);
      setStatusMessage({
        type: 'success',
        text: `Live test alert sent to ${notificationEmail} successfully.`,
      });
    }, 800);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const payload = {
      enabled,
      email: notificationEmail,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSaving(false);
      setStatusMessage({
        type: 'success',
        text: 'Your desk notification email settings have been updated successfully.',
      });
    }, 500);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
  const isRTL = !!currentLangObj.rtl;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0px auto' }}>
      {/* 1. Header Card matching reference */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    DEMO Desk Notification
                  </span>{' '}
                  <span
                    className="inline-block font-black text-orange-600 tracking-tight"
                    style={{ color: 'rgb(234, 88, 12)' }}
                  >
                    Settings
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Configure your receiving notification email address for client accounts, KYC submissions, support tickets, and desk notifications.
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0" />
          </div>
        </div>
      </div>

      {/* 2. 5 Shortcut Cards matching reference */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
          marginTop: '24px',
        }}
      >
        <Link
          to="/admin/payment-methods"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgb(240, 249, 255)',
            border: '1.5px solid rgb(186, 230, 253)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: '0.15s',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgb(3, 105, 161)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <Wallet size={15} color="#0284c7" />
              <span>Deposit Address Settings</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgb(12, 74, 110)', fontHeight: 500 }}>
              Manage crypto vault addresses, QR codes & bank wire info for DEMO
            </div>
          </div>
          <ArrowRight size={18} color="#0284c7" />
        </Link>

        <Link
          to="/admin/account-type"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgb(250, 245, 255)',
            border: '1.5px solid rgb(233, 213, 255)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: '0.15s',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgb(126, 34, 206)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <ListOrdered size={15} color="#9333ea" />
              <span>Account Types & Groups</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgb(88, 28, 135)', fontWeight: 500 }}>
              Manage trading account types, minimum deposits & MT5 groups
            </div>
          </div>
          <ArrowRight size={18} color="#9333ea" />
        </Link>

        <Link
          to="/admin/account-status"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgb(240, 253, 244)',
            border: '1.5px solid rgb(187, 247, 208)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: '0.15s',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgb(21, 128, 61)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <CheckCircle2 size={15} color="#16a34a" />
              <span>Account Status Settings</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgb(20, 83, 45)', fontWeight: 500 }}>
              View and update active trading account status rules
            </div>
          </div>
          <ArrowRight size={18} color="#16a34a" />
        </Link>

        <Link
          to="/admin/rank-management"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgb(255, 251, 235)',
            border: '1.5px solid rgb(253, 230, 138)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: '0.15s',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgb(146, 64, 14)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <Award size={15} color="#d97706" />
              <span>IB Rebate & Rank Settings</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgb(120, 53, 15)', fontWeight: 500 }}>
              Configure IB tier ranks, volume criteria & $/lot rebates
            </div>
          </div>
          <ArrowRight size={18} color="#d97706" />
        </Link>

        <Link
          to="/admin/ib-commissions-settings"
          style={{
            padding: '16px 18px',
            borderRadius: '12px',
            backgroundColor: 'rgb(239, 246, 255)',
            border: '1.5px solid rgb(191, 219, 254)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: '0.15s',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgb(30, 64, 175)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <TrendingUp size={15} color="#2563eb" />
              <span>IB Multi-Tier Commission Settings</span>
            </div>
            <div style={{ fontSize: '12px', color: 'rgb(30, 58, 138)', fontWeight: 500 }}>
              Manage multi-level sub-IB commission splits & payout rules
            </div>
          </div>
          <ArrowRight size={18} color="#2563eb" />
        </Link>
      </div>

      {/* 3. Language & Regional Settings matching reference */}
      <div
        id="language-settings"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: '12px',
          border: '1px solid rgb(226, 232, 240)',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Globe size={18} color="var(--desk, #ea580c)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(15, 23, 42)', margin: '0px' }}>
                Language & Regional Settings
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'rgb(100, 116, 139)', margin: '0px' }}>
              Choose your preferred language for the portal. Changes are saved and applied across your session instantly.
            </p>
          </div>
          <div
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: isRTL ? 'rgb(254, 243, 199)' : 'rgb(239, 246, 255)',
              color: isRTL ? 'rgb(146, 64, 14)' : 'rgb(29, 78, 216)',
              fontWeight: 700,
              border: isRTL ? '1px solid rgb(253, 230, 138)' : '1px solid rgb(191, 219, 254)',
            }}
          >
            {isRTL ? 'Right to Left (RTL)' : 'Left to Right (LTR)'}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelect(lang)}
                className="hover:border-orange-300"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.75rem',
                  border: isSelected ? '2px solid rgb(234, 88, 12)' : '1px solid rgb(226, 232, 240)',
                  backgroundColor: isSelected ? 'rgb(255, 247, 237)' : 'rgb(255, 255, 255)',
                  boxShadow: isSelected
                    ? 'rgba(234, 88, 12, 0.12) 0px 2px 8px'
                    : 'rgba(0, 0, 0, 0.03) 0px 1px 2px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: '0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    aria-label={lang.name}
                    style={{
                      width: '24px',
                      height: '16px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      boxShadow: 'rgba(15, 23, 42, 0.15) 0px 0px 0px 1px',
                      flexShrink: 0,
                    }}
                  >
                    {lang.flag}
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: isSelected ? 'rgb(194, 65, 12)' : 'rgb(15, 23, 42)',
                      }}
                    >
                      {lang.native}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgb(100, 116, 139)' }}>{lang.name}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      backgroundColor: lang.rtl ? 'rgb(254, 243, 199)' : 'rgb(241, 245, 249)',
                      color: lang.rtl ? 'rgb(146, 64, 14)' : 'rgb(71, 85, 105)',
                    }}
                  >
                    {lang.dir}
                  </span>
                  {isSelected && (
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgb(234, 88, 12)',
                        color: 'rgb(255, 255, 255)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: 'rgb(248, 250, 252)',
            borderRadius: '8px',
            border: '1px solid rgb(226, 232, 240)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '12px',
            color: 'rgb(100, 116, 139)',
          }}
        >
          <span>Settings are saved automatically to your device.</span>
          <span style={{ color: 'rgb(5, 150, 105)', fontWeight: 600 }}>
            Full Right-to-Left (RTL) layout and Arabic typography supported.
          </span>
        </div>
      </div>

      {/* Alert banner if any */}
      {statusMessage && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: statusMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${statusMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: statusMessage.type === 'success' ? '#166534' : '#991b1b',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div style={{ fontSize: '14px', fontWeight: 500 }}>{statusMessage.text}</div>
        </div>
      )}

      {/* Main Settings Form matching reference */}
      <form onSubmit={handleSaveSettings}>
        {/* Card 1: DEMO Desk Notification Email */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '12px',
            border: '1px solid rgb(226, 232, 240)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Users size={20} color="#ff6600" />
            <h3 style={{ margin: '0px', fontSize: '17px', color: 'rgb(15, 23, 42)' }}>
              DEMO Desk Notification Email
            </h3>
          </div>
          <p style={{ margin: '0px 0px 20px', fontSize: '13px', color: 'rgb(100, 116, 139)' }}>
            Set the notification destination email where you want to receive operational alerts (KYC submissions, client accounts, deposits, and tickets) for your desk.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div
              style={{
                border: '1px solid rgb(226, 232, 240)',
                borderRadius: '10px',
                padding: '16px',
                backgroundColor: 'rgb(255, 255, 255)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: 'rgb(15, 23, 42)' }}>DEMO Desk</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgb(100, 116, 139)', marginTop: '2px' }}>
                    Role: demo_admin
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                    style={{ accentColor: 'rgb(255, 102, 0)', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontWeight: 600, color: enabled ? 'rgb(21, 128, 61)' : '#94a3b8' }}>
                    {enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgb(51, 65, 85)',
                    marginBottom: '6px',
                  }}
                >
                  Your Receiving Notification Email Address *
                </label>
                <input
                  placeholder="e.g. referral@majestyfx.com or your email"
                  required
                  type="email"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgb(203, 213, 225)',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: 'rgb(255, 255, 255)',
                  }}
                />
                <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgb(100, 116, 139)' }}>
                  ℹ️ Operational alerts for your desk (KYC, accounts, tickets, deposits) will be routed to this email address.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: DEMO Desk Events Delivered to Your Email */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '12px',
            border: '1px solid rgb(226, 232, 240)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Bell size={20} color="#10b981" />
            <h3 style={{ margin: '0px', fontSize: '17px', color: 'rgb(15, 23, 42)' }}>
              DEMO Desk Events Delivered to Your Email
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {EVENT_ITEMS.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: 'rgb(248, 250, 252)',
                  borderRadius: '8px',
                  border: '1px solid rgb(241, 245, 249)',
                }}
              >
                <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Security & Credentials */}
        <div
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            borderRadius: '12px',
            border: '1px solid rgb(226, 232, 240)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Lock size={20} color="#ea580c" />
            <h3 style={{ margin: '0px', fontSize: '18px', color: 'rgb(15, 23, 42)' }}>Security & Credentials</h3>
          </div>
          <p style={{ margin: '0px 0px 16px', fontSize: '13px', color: 'rgb(100, 116, 139)' }}>
            Update your administrator portal login password. Changes take effect immediately across all sessions.
          </p>

          {passwordFeedback && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                backgroundColor: passwordFeedback.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${passwordFeedback.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                color: passwordFeedback.type === 'success' ? '#166534' : '#991b1b',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {passwordFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{passwordFeedback.text}</span>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgb(51, 65, 85)',
                  marginBottom: '6px',
                }}
              >
                Current Password *
              </label>
              <input
                placeholder="Enter current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgb(203, 213, 225)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgb(51, 65, 85)',
                  marginBottom: '6px',
                }}
              >
                New Password *
              </label>
              <input
                placeholder="At least 8 characters"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgb(203, 213, 225)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgb(51, 65, 85)',
                  marginBottom: '6px',
                }}
              >
                Confirm New Password *
              </label>
              <input
                placeholder="Re-enter new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgb(203, 213, 225)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handlePasswordUpdate}
            disabled={passwordUpdating || !newPassword || newPassword.length < 8}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'rgb(15, 23, 42)',
              color: 'rgb(255, 255, 255)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: !newPassword || newPassword.length < 8 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              opacity: !newPassword || newPassword.length < 8 ? 0.6 : 1,
            }}
          >
            {passwordUpdating ? <RefreshCw size={14} className="spin animate-spin" /> : <Key size={14} />}
            <span>{passwordUpdating ? 'Updating Password...' : 'Update My Password'}</span>
          </button>
        </div>

        {/* Bottom Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleSendTest}
            disabled={sendingTest || saving}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgb(203, 213, 225)',
              backgroundColor: 'rgb(255, 255, 255)',
              color: 'rgb(51, 65, 85)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: sendingTest ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {sendingTest ? <RefreshCw size={16} className="spin animate-spin" /> : <Send size={16} color="#ff6600" />}
            <span>{sendingTest ? 'Sending Test...' : 'Send Test Alert to My Email'}</span>
          </button>
          <button
            type="submit"
            disabled={saving || sendingTest}
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--desk, #ea580c)',
              color: 'rgb(255, 255, 255)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'rgba(255, 102, 0, 0.25) 0px 2px 8px',
            }}
          >
            {saving ? <RefreshCw size={16} className="spin animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save My Notification Email'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
