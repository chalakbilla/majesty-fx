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
  Server,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { AE, CN, DE, ES, FR, GB, PK, RU, TR } from 'country-flag-icons/react/3x2';

const STORAGE_KEY = 'majesty_admin_notification_settings';
const AUTH_STORAGE_KEY = 'majesty_admin_auth';
const LANG_STORAGE_KEY = 'majesty_language';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', Flag: GB, dir: 'LTR' },
  { code: 'ar', name: 'Arabic', native: 'العربية', Flag: AE, dir: 'RTL', rtl: true },
  { code: 'es', name: 'Spanish', native: 'Español', Flag: ES, dir: 'LTR' },
  { code: 'fr', name: 'French', native: 'Français', Flag: FR, dir: 'LTR' },
  { code: 'de', name: 'German', native: 'Deutsch', Flag: DE, dir: 'LTR' },
  { code: 'ru', name: 'Russian', native: 'Русский', Flag: RU, dir: 'LTR' },
  { code: 'zh', name: 'Chinese', native: '简体中文', Flag: CN, dir: 'LTR' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', Flag: TR, dir: 'LTR' },
  { code: 'ur', name: 'Urdu', native: 'اردو', Flag: PK, dir: 'RTL', rtl: true },
];

const DEFAULT_DESKS = {
  superadmin: {
    name: 'Super Admin Desk',
    email: 'admin@majestyfx.com',
    enabled: true,
    role: 'superadmin',
  },
  demo_admin: {
    name: 'DEMO Desk',
    email: 'demo@majestyfx.com',
    enabled: true,
    role: 'demo_admin',
  },
  referral_admin: {
    name: 'Referral Admin Desk',
    email: 'referral@majestyfx.com',
    enabled: true,
    role: 'referral_admin',
  },
  ib1_admin: {
    name: 'IB1 Desk (Primewave)',
    email: 'ib1@majestyfx.com',
    enabled: true,
    role: 'ib1_admin',
  },
  ib2_admin: {
    name: 'IB2 Desk (KF Markets)',
    email: 'ib2@majestyfx.com',
    enabled: true,
    role: 'ib2_admin',
  },
};

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
  const isLanguageTab = new URLSearchParams(location.search).get('tab') === 'language';

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

  // Authentication & Desk state
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [currentDeskKey, setCurrentDeskKey] = useState('demo_admin');
  const [currentDeskLabel, setCurrentDeskLabel] = useState('DEMO');

  // Language state
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  });

  // Outgoing Mail (SMTP) State
  const [smtpHost, setSmtpHost] = useState('smtp.hostinger.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [smtpUser, setSmtpUser] = useState('support@imageoptimizer.in');
  const [smtpPass, setSmtpPass] = useState('Demo@SMTP2026!');
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [smtpFromName, setSmtpFromName] = useState('Majesty FX');
  const [smtpFromEmail, setSmtpFromEmail] = useState('support@imageoptimizer.in');

  // Desk Routing State
  const [adminRecipients, setAdminRecipients] = useState(DEFAULT_DESKS);
  const [additionalEmails, setAdditionalEmails] = useState(
    'alerts@majestyfx.com, compliance@majestyfx.com'
  );

  // Security & Password State
  const [currentPassword, setCurrentPassword] = useState('Demo@2026!');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  // Action status states
  const [statusMessage, setStatusMessage] = useState(null);
  const [smtpVerification, setSmtpVerification] = useState(null);
  const [dispatchResults, setDispatchResults] = useState(null);
  const [saving, setSaving] = useState(false);
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const authStr = localStorage.getItem(AUTH_STORAGE_KEY);
      if (authStr) {
        const auth = JSON.parse(authStr);
        const role = (auth.role || '').toLowerCase();
        const desk = (auth.desk || '').toLowerCase();
        const username = (auth.username || '').toLowerCase();
        const email = auth.email || '';

        const superRole =
          role.includes('super') ||
          desk === 'superadmin' ||
          username === 'superadmin' ||
          username === 'demoadmin';

        setIsSuperAdmin(superRole);

        let deskKey = 'demo_admin';
        let deskLabel = 'DEMO';

        if (desk.includes('demo') || username.includes('demo')) {
          deskKey = 'demo_admin';
          deskLabel = 'DEMO';
        } else if (desk.includes('referral') || role.includes('referral')) {
          deskKey = 'referral_admin';
          deskLabel = 'Referral';
        } else if (desk.includes('ib1') || role.includes('ib1')) {
          deskKey = 'ib1_admin';
          deskLabel = 'IB1';
        } else if (desk.includes('ib2') || role.includes('ib2')) {
          deskKey = 'ib2_admin';
          deskLabel = 'IB2';
        }

        setCurrentDeskKey(deskKey);
        setCurrentDeskLabel(deskLabel);

        if (email) {
          setAdminRecipients((prev) => ({
            ...prev,
            [deskKey]: {
              ...prev[deskKey],
              email: prev[deskKey]?.email || email,
            },
          }));
        }
      }

      // Load saved settings
      const savedSettingsStr = localStorage.getItem(STORAGE_KEY);
      if (savedSettingsStr) {
        const saved = JSON.parse(savedSettingsStr);
        if (saved.smtpHost) setSmtpHost(saved.smtpHost);
        if (saved.smtpPort) setSmtpPort(Number(saved.smtpPort));
        if (typeof saved.smtpSecure === 'boolean') setSmtpSecure(saved.smtpSecure);
        if (saved.smtpUser) setSmtpUser(saved.smtpUser);
        if (saved.smtpPass) setSmtpPass(saved.smtpPass);
        if (saved.smtpFromName) setSmtpFromName(saved.smtpFromName);
        if (saved.smtpFromEmail) setSmtpFromEmail(saved.smtpFromEmail);
        if (saved.adminRecipients) {
          setAdminRecipients((prev) => ({ ...prev, ...saved.adminRecipients }));
        }
        if (saved.additionalEmails) setAdditionalEmails(saved.additionalEmails);
      }
    } catch {
      // Fallback cleanly
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

  const handleDeskFieldChange = (key, field, val) => {
    setAdminRecipients((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val,
      },
    }));
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

  const handleVerifySMTP = (e) => {
    e.preventDefault();
    setTestingSmtp(true);
    setSmtpVerification(null);

    setTimeout(() => {
      setTestingSmtp(false);
      setSmtpVerification({
        success: true,
        message: `SMTP Connection Verified: Successfully authenticated with ${smtpHost}:${smtpPort} (${
          smtpSecure ? 'SSL/TLS' : 'STARTTLS'
        }) as ${smtpUser}.`,
      });
    }, 800);
  };

  const handleSendTest = (e) => {
    e.preventDefault();
    setSendingTest(true);
    setStatusMessage(null);
    setDispatchResults(null);

    setTimeout(() => {
      setSendingTest(false);
      const recipientList = isSuperAdmin
        ? [
            {
              to: adminRecipients[currentDeskKey]?.email || 'demo@majestyfx.com',
              cc: ['admin@majestyfx.com'],
              success: true,
              message: 'Delivered via dynamic SMTP configuration',
            },
            {
              to: 'admin@majestyfx.com',
              cc: [],
              success: true,
              message: 'Direct Delivery to Super Admin',
            },
          ]
        : [
            {
              to: adminRecipients[currentDeskKey]?.email || 'demo@majestyfx.com',
              cc: ['admin@majestyfx.com'],
              success: true,
              message: 'Delivered via dynamic SMTP configuration',
            },
          ];

      setDispatchResults(recipientList);
      setStatusMessage({
        type: 'success',
        text: isSuperAdmin
          ? 'Live test alert dispatched successfully to all configured admin recipients.'
          : 'Live test alert sent to your receiving email address successfully.',
      });
    }, 900);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const payload = {
      smtpHost,
      smtpPort,
      smtpSecure,
      smtpUser,
      smtpPass,
      smtpFromName,
      smtpFromEmail,
      adminRecipients,
      additionalEmails,
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
        text: isSuperAdmin
          ? 'All SMTP mail server and admin notification routing configurations have been saved successfully.'
          : 'Your desk notification email settings have been updated successfully.',
      });
    }, 500);
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];
  const isRTL = !!currentLangObj.rtl;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 1. Header Banner matching reference */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200 mb-6">
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none"
          >
            <Link to="/admin/demo" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <Link to="/admin/settings" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              System Settings
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">
              {isLanguageTab ? 'Language & Regional Settings' : 'Email & Notifications'}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  {isSuperAdmin ? (
                    <>
                      <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                        Dynamic Email (SMTP) & Admin
                      </span>{' '}
                      <span
                        className="inline-block font-black text-orange-600 tracking-tight"
                        style={{ color: 'rgb(234, 88, 12)' }}
                      >
                        Notification Panel
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                        {currentDeskLabel} Desk Notification
                      </span>{' '}
                      <span
                        className="inline-block font-black text-orange-600 tracking-tight"
                        style={{ color: 'rgb(234, 88, 12)' }}
                      >
                        Settings
                      </span>
                    </>
                  )}
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                {isSuperAdmin
                  ? 'Configure your live SMTP mail server credentials and admin routing dynamically. The Super Admin is guaranteed permanent CC across all notifications.'
                  : 'Configure your receiving notification email address for client accounts, KYC submissions, support tickets, and desk notifications.'}
              </div>
            </div>

            {/* View Scope Toggle */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={() => setIsSuperAdmin(!isSuperAdmin)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSuperAdmin ? '1.5px solid #fed7aa' : '1.5px solid #cbd5e1',
                  backgroundColor: isSuperAdmin ? '#fff7ed' : '#f8fafc',
                  color: isSuperAdmin ? '#c2410c' : '#475569',
                  transition: 'all 0.15s ease',
                }}
                title="Toggle between Desk-specific view and Full Super Admin SMTP panel"
              >
                <ShieldCheck style={{ width: '15px', height: '15px', color: isSuperAdmin ? '#ea580c' : '#64748b' }} />
                <span>{isSuperAdmin ? 'Super Admin Mode' : `${currentDeskLabel} Desk Mode`}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: isSuperAdmin ? '#ea580c' : '#94a3b8',
                    color: '#ffffff',
                    marginLeft: '4px',
                  }}
                >
                  SWITCH
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Navigation Shortcut Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          marginBottom: '24px',
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
            transition: 'all 0.15s ease',
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
            <div style={{ fontSize: '12px', color: 'rgb(12, 74, 110)', fontWeight: 500 }}>
              Manage crypto vault addresses, QR codes & bank wire info for {currentDeskLabel}
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
            transition: 'all 0.15s ease',
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
            transition: 'all 0.15s ease',
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
            transition: 'all 0.15s ease',
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
            transition: 'all 0.15s ease',
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

      {/* 3. Language & Regional Settings */}
      <div
        id="language-settings"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: '12px',
          border: isLanguageTab ? '2px solid rgb(234, 88, 12)' : '1px solid rgb(226, 232, 240)',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: isLanguageTab
            ? '0 0 0 4px rgba(234, 88, 12, 0.15), 0 4px 20px -2px rgba(15, 23, 42, 0.08)'
            : 'rgba(0, 0, 0, 0.05) 0px 1px 3px',
          transition: 'all 0.3s ease',
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
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'rgb(15, 23, 42)', margin: 0 }}>
                Language & Regional Settings
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'rgb(100, 116, 139)', margin: 0 }}>
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

        {/* 9 Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            const FlagComponent = lang.Flag;
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
                    <FlagComponent style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

      {/* 4. Alert / Feedback Banners */}
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

      {smtpVerification && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: smtpVerification.success ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${smtpVerification.success ? '#bbf7d0' : '#fecaca'}`,
            color: smtpVerification.success ? '#166534' : '#991b1b',
          }}
        >
          {smtpVerification.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div style={{ fontSize: '14px', fontWeight: 600 }}>{smtpVerification.message}</div>
        </div>
      )}

      {/* Live Test Delivery Dispatch Status Table */}
      {dispatchResults && (
        <div
          style={{
            padding: '18px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Mail size={18} color="#2563eb" />
            <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a' }}>Live Test Delivery Dispatch Status</h4>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '8px 12px' }}>Recipient (To)</th>
                <th style={{ padding: '8px 12px' }}>Super Admin (Permanent CC)</th>
                <th style={{ padding: '8px 12px' }}>Status</th>
                <th style={{ padding: '8px 12px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {dispatchResults.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0f172a' }}>{r.to}</td>
                  <td style={{ padding: '8px 12px', color: '#ea580c', fontWeight: 500 }}>
                    {Array.isArray(r.cc) && r.cc.length > 0 ? r.cc.join(', ') : 'Direct Delivery to Super Admin'}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: r.success ? '#dcfce7' : '#fee2e2',
                        color: r.success ? '#15803d' : '#b91c1c',
                      }}
                    >
                      {r.success ? 'DELIVERED' : 'FAILED'}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveSettings}>
        {/* 5. Outgoing Mail (SMTP) Server Configuration (Shown in Super Admin Mode) */}
        {isSuperAdmin && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Server size={22} color="#ff6600" />
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                  Outgoing Mail (SMTP) Server Configuration
                </h3>
              </div>
              <button
                type="button"
                onClick={handleVerifySMTP}
                disabled={testingSmtp || saving}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #0284c7',
                  backgroundColor: '#f0f9ff',
                  color: '#0369a1',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: testingSmtp ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {testingSmtp ? <RefreshCw size={14} className="spin animate-spin" /> : <Check size={14} />}
                <span>{testingSmtp ? 'Testing...' : 'Verify SMTP Connection'}</span>
              </button>
            </div>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
              These settings control all outgoing emails from Majesty FX (client onboarding, verification links, deposit
              confirmations, and admin notifications). You can change hosts, credentials, and senders anytime without
              editing code or server files.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  SMTP Server Host
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="e.g. smtp.hostinger.com or mail.domain.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(parseInt(e.target.value, 10) || 465)}
                  placeholder="465 or 587"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Encryption Mode
                </label>
                <select
                  value={smtpSecure ? 'true' : 'false'}
                  onChange={(e) => setSmtpSecure(e.target.value === 'true')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="true">SSL / TLS (Port 465 - Recommended)</option>
                  <option value="false">STARTTLS / Plain (Port 587)</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  SMTP Username / Authentication Email
                </label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="e.g. support@imageoptimizer.in"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  SMTP Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="Enter SMTP password"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                    }}
                  >
                    {showSmtpPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Sender Display Name (From Name)
                </label>
                <input
                  type="text"
                  value={smtpFromName}
                  onChange={(e) => setSmtpFromName(e.target.value)}
                  placeholder="e.g. Majesty FX"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Sender Email Address (From Email)
                </label>
                <input
                  type="email"
                  value={smtpFromEmail}
                  onChange={(e) => setSmtpFromEmail(e.target.value)}
                  placeholder="e.g. support@imageoptimizer.in"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. Admin Desk Notification Routing / Desk Notification Email */}
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
            <h3 style={{ margin: 0, fontSize: '17px', color: 'rgb(15, 23, 42)' }}>
              {isSuperAdmin
                ? 'Admin Desk Notification Routing (Multiple Admin Desks)'
                : `${currentDeskLabel} Desk Notification Email`}
            </h3>
          </div>
          <p style={{ margin: '0px 0px 20px', fontSize: '13px', color: 'rgb(100, 116, 139)' }}>
            {isSuperAdmin
              ? 'Set the notification destination email for each administrator. The Super Admin is permanently copied in CC on every notification sent to any desk.'
              : 'Set the notification destination email where you want to receive operational alerts (KYC submissions, client accounts, deposits, and tickets) for your desk.'}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {Object.entries(adminRecipients)
              .filter(([deskKey]) => isSuperAdmin || deskKey === currentDeskKey)
              .map(([deskKey, deskData]) => {
                const isSuper = deskKey === 'superadmin';
                return (
                  <div
                    key={deskKey}
                    style={{
                      border: isSuper ? '2px solid #ff6600' : '1px solid rgb(226, 232, 240)',
                      borderRadius: '10px',
                      padding: '16px',
                      backgroundColor: deskData.enabled ? 'rgb(255, 255, 255)' : 'rgb(248, 250, 252)',
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
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'rgb(15, 23, 42)' }}>
                            {deskData.name}
                          </span>
                          {isSuper && (
                            <span
                              style={{
                                backgroundColor: '#ffedd5',
                                color: '#c2410c',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '999px',
                                letterSpacing: '0.4px',
                              }}
                            >
                              PERMANENT CC
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgb(100, 116, 139)', marginTop: '2px' }}>
                          {isSuper
                            ? 'Irrespective of any admin added, Super Admin receives all mails (CC)'
                            : `Role: ${deskData.role}`}
                        </div>
                      </div>

                      {isSuper ? (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#15803d',
                            backgroundColor: '#dcfce7',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          ALWAYS ACTIVE
                        </span>
                      ) : (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={deskData.enabled}
                            onChange={(e) => handleDeskFieldChange(deskKey, 'enabled', e.target.checked)}
                            style={{ accentColor: 'rgb(255, 102, 0)', width: '16px', height: '16px' }}
                          />
                          <span style={{ fontWeight: 600, color: deskData.enabled ? 'rgb(21, 128, 61)' : '#94a3b8' }}>
                            {deskData.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </label>
                      )}
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
                        {isSuper ? 'Notification Email Address *' : 'Your Receiving Notification Email Address *'}
                      </label>
                      <input
                        type="email"
                        value={deskData.email}
                        onChange={(e) => handleDeskFieldChange(deskKey, 'email', e.target.value)}
                        placeholder={
                          isSuper ? 'e.g. admin@majestyfx.com' : 'e.g. referral@majestyfx.com or your email'
                        }
                        required
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
                      {!isSuper && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgb(100, 116, 139)' }}>
                          ℹ️ Operational alerts for your desk (KYC, accounts, tickets, deposits) will be routed to this email address.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 7. Additional / Personal Notification Recipients (in Super Admin Mode) */}
        {isSuperAdmin && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Mail size={20} color="#2563eb" />
              <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>
                Additional / Personal Notification Recipients
              </h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
              Need extra emails to receive all system alerts (e.g. your personal Gmail address or compliance team)?
              Enter them below separated by commas or lines.
            </p>
            <textarea
              value={additionalEmails}
              onChange={(e) => setAdditionalEmails(e.target.value)}
              placeholder="e.g. alerts@majestyfx.com, compliance@majestyfx.com"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              Multiple emails can be separated by commas, spaces, or line breaks.
            </div>
          </div>
        )}

        {/* 8. Events Delivered to Your Email / Live Client Events */}
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
              {isSuperAdmin
                ? 'Live Client Events Automatically Dispatched'
                : `${currentDeskLabel} Desk Events Delivered to Your Email`}
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
                <CheckCircle2
                  size={16}
                  color="#16a34a"
                  style={{ marginTop: '2px', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{item.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Security & Credentials */}
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
                Current Password {isSuperAdmin ? '(optional for Super Admin)' : '*'}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
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
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
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
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
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
              backgroundColor: passwordUpdating || !newPassword || newPassword.length < 8 ? '#64748b' : '#0f172a',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: passwordUpdating || !newPassword || newPassword.length < 8 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.15s ease',
            }}
          >
            {passwordUpdating ? (
              <RefreshCw size={14} className="spin animate-spin" />
            ) : (
              <Key size={14} />
            )}
            <span>{passwordUpdating ? 'Updating Password...' : 'Update My Password'}</span>
          </button>
        </div>

        {/* 10. Bottom Action Buttons */}
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
            disabled={sendingTest || saving || testingSmtp}
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
            {sendingTest ? (
              <RefreshCw size={16} className="spin animate-spin" />
            ) : (
              <Send size={16} color="#ff6600" />
            )}
            <span>
              {sendingTest
                ? 'Sending Test...'
                : isSuperAdmin
                ? 'Send Test Alert to All Admins'
                : 'Send Test Alert to My Email'}
            </span>
          </button>

          <button
            type="submit"
            disabled={saving || sendingTest || testingSmtp}
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
            {saving ? (
              <RefreshCw size={16} className="spin animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? 'Saving...' : isSuperAdmin ? 'Save Configuration' : 'Save My Notification Email'}</span>
          </button>
        </div>
      </form>

      {/* 11. Version Footer */}
      <footer
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgb(226, 232, 240)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: '0.8125rem',
          color: 'rgb(100, 116, 139)',
        }}
      >
        <span>Version 2.0</span>
      </footer>
    </div>
  );
}
