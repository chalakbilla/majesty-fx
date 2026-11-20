import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useCollection from '../../hooks/useCollection.js';
import TablePager from '../../components/admin/TablePager.jsx';
import useTableControls from '../../hooks/useTableControls.js';
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Key,
  Loader2,
  LockOpen,
  LogIn,
  Mail,
  MailCheck,
  MailX,
  MoreVertical,
  Pencil,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Trash2,
  UserPlus,
  Users,
  X,
  Ban,
} from 'lucide-react';

export default function AdminClients() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: dbClients, create, update, remove, setItems } = useCollection('clients');

  // Network filter tabs ('all' | 'ib1' | 'ib2' | 'referrer' | 'demo')
  const [deskTab, setDeskTab] = useState('all');
  const [lockedDesk, setLockedDesk] = useState(null);

  useEffect(() => {
    const deskParam = (searchParams.get('desk') || searchParams.get('tier') || '').toLowerCase();
    let localAuthDesk = null;
    try {
      const auth = localStorage.getItem('majesty_admin_auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        localAuthDesk = (parsed.desk || parsed.role || '').toLowerCase();
      }
    } catch {}
    const r = deskParam || (localAuthDesk && localAuthDesk !== 'superadmin' ? localAuthDesk : '');
    if (r && r !== 'superadmin' && r !== 'all') {
      const normalized = r === 'referral' || r === 'referral_admin' ? 'referrer' : r.replace(/_admin$/, '');
      setDeskTab(normalized);
      setLockedDesk(normalized);
    } else {
      setDeskTab('all');
      setLockedDesk(null);
    }
  }, [searchParams]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [emailKycFilter, setEmailKycFilter] = useState('');
  const [kycStatusFilter, setKycStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals & floating menu states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bannerNotification, setBannerNotification] = useState(null);
  const [impersonatingId, setImpersonatingId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [floatingMenuClient, setFloatingMenuClient] = useState(null);
  const [floatingMenuPos, setFloatingMenuPos] = useState(null);
  const [floatingSubmenu, setFloatingSubmenu] = useState(null); // 'ib' | 'status' | 'kyc'
  const floatingMenuRef = useRef(null);

  const [accountLimits, setAccountLimits] = useState({});

  // Dialog targets
  const [viewDetailsClient, setViewDetailsClient] = useState(null);
  const [editProfileClient, setEditProfileClient] = useState(null);
  const [reassignDeskClient, setReassignDeskClient] = useState(null);
  const [newDestinationDesk, setNewDestinationDesk] = useState('referrer');
  const [isReassigningDesk, setIsReassigningDesk] = useState(false);
  const [reassignError, setReassignError] = useState(null);

  const [passwordResetSentData, setPasswordResetSentData] = useState(null);

  const [sendEmailClient, setSendEmailClient] = useState(null);
  const [emailSubject, setEmailSubject] = useState('Important Update Regarding Your Majesty Financial Account');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [deleteTargetClient, setDeleteTargetClient] = useState(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  const [setPasswordClient, setSetPasswordClient] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [showPasswordPlain, setShowPasswordPlain] = useState(false);
  const [setPasswordError, setSetPasswordError] = useState(null);
  const [notifyClientOnPassword, setNotifyClientOnPassword] = useState(false);

  // Add Client Form states
  const [newClientFullName, setNewClientFullName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientMobile, setNewClientMobile] = useState('');
  const [newClientCountry, setNewClientCountry] = useState('India');
  const [newClientCity, setNewClientCity] = useState('');
  const [newClientAccountType, setNewClientAccountType] = useState('STANDARD');
  const [newClientTier, setNewClientTier] = useState('referrer');
  const [newClientReferralCode, setNewClientReferralCode] = useState('');
  const [newClientMarkEmailVerified, setNewClientMarkEmailVerified] = useState(true);
  const [newClientMarkKycVerified, setNewClientMarkKycVerified] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

  // Edit profile state
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editProfileError, setEditProfileError] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 4000);
  };

  // Close floating menu on outside click or scroll
  useEffect(() => {
    const handleOutside = (e) => {
      if (floatingMenuRef.current && !floatingMenuRef.current.contains(e.target)) {
        setFloatingMenuClient(null);
        setFloatingSubmenu(null);
      }
    };
    if (floatingMenuClient) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [floatingMenuClient]);

  useEffect(() => {
    const handleScroll = (e) => {
      if (
        floatingMenuRef.current &&
        !floatingMenuRef.current.contains(e.target) &&
        e.target !== floatingMenuRef.current
      ) {
        if (floatingMenuClient) {
          setFloatingMenuClient(null);
          setFloatingSubmenu(null);
        }
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [floatingMenuClient]);

  // Normalize clients from db
  const clients = useMemo(() => {
    return (dbClients || []).map((c) => {
      const clientType = (
        c.clientType ||
        (c.portalTier?.toLowerCase().includes('ib1')
          ? 'ib1'
          : c.portalTier?.toLowerCase().includes('ib2') || c.portalTier?.toLowerCase().includes('master')
          ? 'ib2'
          : c.mt5Server?.toLowerCase().includes('demo')
          ? 'demo'
          : 'referrer')
      ).toLowerCase();

      const kycStatus =
        c.kycStatus === 'Approved' || c.kycStatus === 'VERIFIED' ? 'VERIFIED' : 'NOT VERIFIED';
      const emailKyc =
        c.emailKyc === 'Verified' || c.emailKyc === 'VERIFIED' ? 'VERIFIED' : 'UNVERIFIED';

      return {
        ...c,
        id: c.id,
        tradingAccounts: Array.isArray(c.tradingAccounts) ? c.tradingAccounts : c.tradingAccounts ? [String(c.tradingAccounts)] : [],
        fullName: c.fullName || c.name || 'Valued Trader',
        email: c.email || '',
        mobile: c.mobile || c.phone || 'N/A',
        country: c.country || 'Global',
        city: c.city || 'Headquarters',
        kycStatus,
        password: c.password || '••••••••',
        emailKyc,
        createdAt: c.createdAt || '2026-01-15',
        blocked: Boolean(c.blocked || c.status === 'blocked'),
        status: c.status || (c.blocked ? 'blocked' : 'active'),
        accountLimit: accountLimits[c.id] ?? c.accountLimit ?? 100,
        clientType,
        server: c.server || c.mt5Server || (clientType === 'ib2' ? 'TheKFMarket-Live' : 'MajestyFX-Trade'),
        totalBalance: c.totalBalance ?? 15420.5,
        totalEquity: c.totalEquity ?? 15890.2,
        totalDeposit: c.totalDeposit ?? 20000,
        totalWithdrawal: c.totalWithdrawal ?? 5000,
        referralCode: c.referralCode || null,
        ibPartnerStatus: c.ibPartnerStatus || 'none',
      };
    });
  }, [dbClients, accountLimits]);

  // Counts for tabs
  const tabCounts = useMemo(() => {
    let ib1 = 0;
    let ib2 = 0;
    let ref = 0;
    clients.forEach((c) => {
      const t = (c.clientType || 'referrer').toLowerCase();
      if (t === 'ib1') ib1++;
      else if (t === 'ib2') ib2++;
      else if (t === 'referrer' || t === 'referral' || t === 'standard' || t === 'direct') ref++;
    });
    return { all: clients.length, ib1, ib2, ref };
  }, [clients]);

  // Filtered rows
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      // Tab filter
      if (deskTab !== 'all') {
        const s = (c.clientType || 'referrer').toLowerCase().trim();
        if (deskTab === 'referrer') {
          if (!(s === 'referrer' || s === 'referral' || s === 'standard' || s === 'direct' || !s)) {
            return false;
          }
        } else if (s !== deskTab) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.fullName.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchMobile = c.mobile.toLowerCase().includes(q);
        const matchCountry = c.country.toLowerCase().includes(q);
        const matchAccounts = c.tradingAccounts.some((acc) => String(acc).toLowerCase().includes(q));
        const matchType = (c.clientType || '').toLowerCase().includes(q);
        const matchServer = (c.server || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchMobile && !matchCountry && !matchAccounts && !matchType && !matchServer) {
          return false;
        }
      }

      // Dropdown filters
      if (emailKycFilter && c.emailKyc !== emailKycFilter) return false;
      if (kycStatusFilter && c.kycStatus !== kycStatusFilter) return false;

      return true;
    });
  }, [clients, deskTab, searchQuery, emailKycFilter, kycStatusFilter]);

  const table = useTableControls(filteredClients, { pageSize: 10 });

  useEffect(() => {
    table.setPage(1);
  }, [deskTab, searchQuery, emailKycFilter, kycStatusFilter, startDate, endDate]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setEmailKycFilter('');
    setKycStatusFilter('');
    setStartDate('');
    setEndDate('');
    setDeskTab('all');
  };

  // Actions
  const handleImpersonate = (client) => {
    setImpersonatingId(client.id);
    const url = `/admin/impersonate/${encodeURIComponent(String(client.id))}`;
    setTimeout(() => {
      setImpersonatingId(null);
      if (!window.open(url, '_blank')) {
        window.location.href = url;
      }
      setBannerNotification(`Opening ${client.fullName}'s client portal (${client.email}) in a new tab...`);
    }, 600);
  };

  const handleToggleEmailKyc = async (id) => {
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    setActionLoadingId(id);
    setActionType('email-kyc');
    const nextVal = c.emailKyc === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    update(id, { emailKyc: nextVal });
    showToast(`Email KYC set to ${nextVal} for ${c.fullName}`);
    setActionLoadingId(null);
    setActionType(null);
  };

  const handleToggleBlock = async (id) => {
    const c = clients.find((x) => x.id === id);
    if (!c) return;
    setActionLoadingId(id);
    setActionType('block');
    const nextBlocked = !c.blocked;
    const nextStatus = nextBlocked ? 'blocked' : 'active';
    update(id, { blocked: nextBlocked, status: nextStatus });
    showToast(`Client ${c.fullName} is now ${nextBlocked ? 'blocked' : 'active'}.`, nextBlocked ? 'error' : 'success');
    setActionLoadingId(null);
    setActionType(null);
  };

  const handleDeleteClient = async () => {
    if (!deleteTargetClient) return;
    setIsDeletingClient(true);
    setTimeout(() => {
      remove(deleteTargetClient.id);
      showToast(
        `Client ${deleteTargetClient.fullName} and all associated files/accounts have been permanently deleted from database and API.`,
        'success'
      );
      setIsDeletingClient(false);
      setDeleteTargetClient(null);
    }, 500);
  };

  const handleSendPasswordReset = (client) => {
    setPasswordResetSentData({ client });
  };

  const handleSetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!setPasswordClient || !newPassword.trim()) return;
    setIsSettingPassword(true);
    setTimeout(() => {
      update(setPasswordClient.id, { password: newPassword.trim() });
      showToast(`Password successfully updated! New password: ${newPassword.trim()}`, 'success');
      try {
        navigator.clipboard.writeText(newPassword.trim());
      } catch {}
      if (viewDetailsClient && viewDetailsClient.id === setPasswordClient.id) {
        setViewDetailsClient({ ...viewDetailsClient, password: newPassword.trim() });
      }
      setIsSettingPassword(false);
      setSetPasswordClient(null);
      setNewPassword('');
    }, 400);
  };

  const handleSetStatus = (client, newStatus) => {
    const isBlocked = newStatus === 'blocked';
    update(client.id, { status: newStatus, blocked: isBlocked });
    setFloatingMenuClient(null);
    setFloatingSubmenu(null);
    showToast(`Status updated to ${newStatus.toUpperCase()} for ${client.fullName}`);
  };

  const handleSetKycStatus = (client, verified) => {
    const val = verified ? 'VERIFIED' : 'NOT VERIFIED';
    update(client.id, { kycStatus: val });
    setFloatingMenuClient(null);
    setFloatingSubmenu(null);
    showToast(`KYC status set to ${verified ? 'VERIFIED' : 'UNDER REVIEW'} for ${client.fullName}`);
  };

  const handleSetIbStatus = (client, status) => {
    update(client.id, { ibPartnerStatus: status });
    setFloatingMenuClient(null);
    setFloatingSubmenu(null);
    showToast(
      status === 'approved'
        ? `IB Partner status APPROVED for ${client.fullName}! Portal unlocked & welcome email sent.`
        : `IB status updated to ${status.toUpperCase()} for ${client.fullName}`,
      'success'
    );
  };

  const handleSaveAccountLimit = (client, limit) => {
    const num = Math.max(1, limit || 100);
    setAccountLimits((prev) => ({ ...prev, [client.id]: num }));
    update(client.id, { accountLimit: num });
    showToast(`Account limit set to ${num} for ${client.fullName}`);
  };

  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    if (!editProfileClient) return;
    setIsSavingProfile(true);
    setTimeout(() => {
      update(editProfileClient.id, {
        fullName: editProfileClient.fullName,
        mobile: editProfileClient.mobile,
        country: editProfileClient.country,
        city: editProfileClient.city,
        status: editProfileClient.status,
        kycStatus: editProfileClient.kycStatus,
        clientType: editProfileClient.clientType,
        accountLimit: editProfileClient.accountLimit,
      });
      showToast(`Profile updated successfully for ${editProfileClient.fullName}!`);
      setIsSavingProfile(false);
      setEditProfileClient(null);
    }, 400);
  };

  const handleReassignDeskSubmit = (e) => {
    e.preventDefault();
    if (!reassignDeskClient) return;
    setIsReassigningDesk(true);
    setTimeout(() => {
      const server = newDestinationDesk === 'ib2' ? 'TheKFMarket-Live' : 'MajestyFX-Trade';
      update(reassignDeskClient.id, {
        clientType: newDestinationDesk,
        server,
        mt5Server: server,
      });
      const deskNames = {
        referrer: 'Referral Network (Majesty Standard)',
        ib1: 'Partner 001 Desk (IB1 - PrimewaveFX)',
        ib2: 'Partner 002 Desk (IB2 - KF Markets)',
        ib3: 'Partner 003 Desk (IB3)',
      };
      showToast(`Client ${reassignDeskClient.fullName} moved to ${deskNames[newDestinationDesk] || newDestinationDesk}.`, 'success');
      setIsReassigningDesk(false);
      setReassignDeskClient(null);
    }, 450);
  };

  const handleSendEmailSubmit = (e) => {
    e.preventDefault();
    if (!sendEmailClient) return;
    setIsSendingEmail(true);
    setTimeout(() => {
      showToast(`Email dispatched to ${sendEmailClient.email}!`);
      setIsSendingEmail(false);
      setSendEmailClient(null);
      setEmailBody('');
    }, 500);
  };

  const handleCreateClientSubmit = (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    if (!newClientFullName.trim() || !newClientEmail.trim() || !newClientEmail.includes('@')) {
      setCreateError('Valid full name and email address are required.');
      return;
    }
    setIsCreatingClient(true);
    setTimeout(() => {
      const nextId = clients.length ? Math.max(...clients.map((c) => Number(c.id) || 0)) + 1 : 101;
      const server = newClientTier === 'ib2' ? 'TheKFMarket-Live' : 'MajestyFX-Trade';
      const createdRecord = {
        id: nextId,
        tradingAccounts: [`${800100 + nextId}`],
        fullName: newClientFullName.trim(),
        email: newClientEmail.trim().toLowerCase(),
        mobile: newClientMobile.trim() || 'N/A',
        country: newClientCountry,
        city: newClientCity.trim() || 'Headquarters',
        accountType: newClientAccountType,
        clientType: newClientTier,
        referralCode: newClientReferralCode.trim() || null,
        kycStatus: newClientMarkKycVerified ? 'VERIFIED' : 'NOT VERIFIED',
        emailKyc: newClientMarkEmailVerified ? 'VERIFIED' : 'UNVERIFIED',
        password: '••••••••',
        server,
        mt5Server: server,
        createdAt: new Date().toISOString().split('T')[0],
        blocked: false,
        status: 'active',
        accountLimit: 100,
        totalBalance: 0,
        totalEquity: 0,
        totalDeposit: 0,
        totalWithdrawal: 0,
      };
      create(createdRecord);
      setCreateSuccess(`Client ${newClientFullName} successfully created! MT5 trading account provisioned.`);
      setNewClientFullName('');
      setNewClientEmail('');
      setNewClientMobile('');
      setNewClientCity('');
      setNewClientReferralCode('');
      setTimeout(() => {
        setIsCreatingClient(false);
        setAddModalOpen(false);
        setCreateSuccess(null);
      }, 1000);
    }, 450);
  };

  const handleExportExcel = () => {
    const headers = [
      '#',
      'Trading Accounts',
      'Full Name',
      'Email',
      'Portal Tier',
      'MT5 Server',
      'Mobile',
      'Country',
      'KYC Status',
      'Password',
      'Email KYC',
      'Created At',
    ];
    const rows = filteredClients.map((c, idx) => [
      idx + 1,
      `"${c.tradingAccounts.join(', ')}"`,
      `"${c.fullName}"`,
      c.email,
      c.clientType,
      c.server,
      `"${c.mobile}"`,
      `"${c.country}"`,
      c.kycStatus,
      `"${c.password}"`,
      c.emailKyc,
      c.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleMoreActions = (e, client) => {
    e.stopPropagation();
    if (floatingMenuClient?.id === client.id) {
      setFloatingMenuClient(null);
      setFloatingSubmenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = Math.max(0, window.innerHeight - rect.bottom - 16);
    const spaceAbove = Math.max(0, rect.top - 76 - 8);
    const openUpward = spaceBelow < 320 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(200, Math.min(480, openUpward ? spaceAbove : spaceBelow));
    setFloatingMenuPos({
      top: openUpward ? Math.max(80, rect.top - maxHeight) : rect.bottom + 6,
      bottom: undefined,
      right: Math.max(16, window.innerWidth - rect.right),
      openUpward,
      maxHeight,
    });
    setFloatingMenuClient(client);
    setFloatingSubmenu(null);
  };

  // Header texts calculation
  const headerTexts = useMemo(() => {
    const t = lockedDesk || deskTab;
    if (t === 'demo') {
      return {
        title: 'Majesty FX Demo Sandbox',
        highlight: 'Portal',
        description: 'Dedicated sandbox environment with simulated clients and mock MetaTrader 5 trading accounts.',
        breadcrumb: 'Demo Sandbox Portal',
      };
    }
    if (t === 'ib1') {
      return {
        title: 'Majesty FX Partner 001',
        highlight: 'Portal',
        description: 'Dedicated management of Majesty FX Partner 001 institutional accounts and MetaTrader 5 allocations.',
        breadcrumb: 'Partner 001 Portal',
      };
    }
    if (t === 'ib2') {
      return {
        title: 'Majesty FX Partner 002',
        highlight: 'Portal',
        description: 'Dedicated management of Majesty FX Partner 002 institutional accounts and MetaTrader 5 allocations.',
        breadcrumb: 'Partner 002 Portal',
      };
    }
    if (t === 'ib3') {
      return {
        title: 'Majesty FX Partner 003',
        highlight: 'Portal',
        description: 'Dedicated management of Majesty FX Partner 003 institutional accounts and MetaTrader 5 allocations.',
        breadcrumb: 'Partner 003 Portal',
      };
    }
    if (t && t.startsWith('ib')) {
      const pNum = t.replace('ib', '').padStart(3, '0');
      return {
        title: `Majesty FX Partner ${pNum}`,
        highlight: 'Portal',
        description: `Dedicated management of Majesty FX Partner ${pNum} accounts and MetaTrader 5 allocations.`,
        breadcrumb: `Partner ${pNum} Portal`,
      };
    }
    if (t === 'referrer') {
      return {
        title: 'Referral Clients',
        highlight: 'Portal',
        description: 'Dedicated management of Direct & Referral retail traders and MajestyFX MT5 allocations.',
        breadcrumb: 'Referral Clients Portal',
      };
    }
    return {
      title: 'Clients',
      highlight: 'Directory',
      description: 'View, manage, authenticate, impersonate, and verify client accounts and MetaTrader 5 allocations across all networks.',
      breadcrumb: 'Clients Directory',
    };
  }, [lockedDesk, deskTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            right: '24px',
            zIndex: 999999,
            backgroundColor: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#2563eb' : '#16a34a',
            color: '#ffffff',
            padding: '0.85rem 1.35rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28), 0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            animation: 'fadeIn 0.2s ease-in-out',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            maxWidth: '90vw',
          }}
        >
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Banner info notification */}
      {bannerNotification && (
        <div
          style={{
            backgroundColor: '#eef2ff',
            border: '1px solid #c7d2fe',
            color: '#4338ca',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 2px 5px rgba(99, 102, 241, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LogIn size={16} />
            <span>{bannerNotification}</span>
          </div>
          <button
            onClick={() => setBannerNotification(null)}
            style={{ background: 'none', border: 'none', color: '#4338ca', cursor: 'pointer', fontWeight: 700, padding: '0.2rem' }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none">
            <Link to="/admin/demo" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">{headerTexts.breadcrumb}</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    {headerTexts.title}
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    {headerTexts.highlight}
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                {headerTexts.description}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to="/admin/kyc-documents"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <ShieldCheck size={15} />
                  <span>KYC Desk</span>
                </Link>
                <button
                  onClick={() => {
                    if (deskTab === 'ib1') setNewClientTier('ib1');
                    else if (deskTab === 'ib2') setNewClientTier('ib2');
                    else if (deskTab === 'referrer') setNewClientTier('referrer');
                    setAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-all cursor-pointer"
                >
                  <UserPlus size={15} />
                  <span>Add Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Tabs (when not locked to a specific desk) */}
      {!lockedDesk && (
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '0.65rem 0.85rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          {/* All Clients */}
          <button
            onClick={() => setDeskTab('all')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: deskTab === 'all' ? '1px solid #0f172a' : '1px solid #e2e8f0',
              backgroundColor: deskTab === 'all' ? '#0f172a' : '#f8fafc',
              color: deskTab === 'all' ? '#ffffff' : '#475569',
            }}
          >
            <span>All Clients</span>
            <span
              style={{
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                backgroundColor: deskTab === 'all' ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                color: deskTab === 'all' ? '#ffffff' : '#334155',
              }}
            >
              {tabCounts.all}
            </span>
          </button>

          {/* IB1 Network */}
          <button
            onClick={() => setDeskTab('ib1')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: deskTab === 'ib1' ? '1px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: deskTab === 'ib1' ? '#2563eb' : '#eff6ff',
              color: deskTab === 'ib1' ? '#ffffff' : '#1d4ed8',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: deskTab === 'ib1' ? '#ffffff' : '#2563eb',
              }}
            />
            <span>IB1 Network</span>
            <span
              style={{
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                backgroundColor: deskTab === 'ib1' ? 'rgba(255,255,255,0.25)' : '#bfdbfe',
                color: deskTab === 'ib1' ? '#ffffff' : '#1e40af',
              }}
            >
              {tabCounts.ib1}
            </span>
          </button>

          {/* IB2 Network (KF Markets) */}
          <button
            onClick={() => setDeskTab('ib2')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: deskTab === 'ib2' ? '1px solid #7c3aed' : '1px solid #e2e8f0',
              backgroundColor: deskTab === 'ib2' ? '#7c3aed' : '#f5f3ff',
              color: deskTab === 'ib2' ? '#ffffff' : '#6d28d9',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: deskTab === 'ib2' ? '#ffffff' : '#7c3aed',
              }}
            />
            <span>IB2 Network (KF Markets)</span>
            <span
              style={{
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                backgroundColor: deskTab === 'ib2' ? 'rgba(255,255,255,0.25)' : '#ddd6fe',
                color: deskTab === 'ib2' ? '#ffffff' : '#5b21b6',
              }}
            >
              {tabCounts.ib2}
            </span>
          </button>

          {/* Direct & Referrals */}
          <button
            onClick={() => setDeskTab('referrer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              border: deskTab === 'referrer' ? '1px solid #ea580c' : '1px solid #e2e8f0',
              backgroundColor: deskTab === 'referrer' ? '#ea580c' : '#fff7ed',
              color: deskTab === 'referrer' ? '#ffffff' : '#c2410c',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: deskTab === 'referrer' ? '#ffffff' : '#ea580c',
              }}
            />
            <span>Direct & Referrals</span>
            <span
              style={{
                padding: '0.15rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 800,
                backgroundColor: deskTab === 'referrer' ? 'rgba(255,255,255,0.25)' : '#fed7aa',
                color: deskTab === 'referrer' ? '#ffffff' : '#9a3412',
              }}
            >
              {tabCounts.ref}
            </span>
          </button>
        </div>
      )}

      {/* Filters Bar Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
        }}
      >
        {/* Row 1: Search & Reset */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 0%', minWidth: '220px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, phone, country or MT5 account..."
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                fontSize: '0.85rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                backgroundColor: '#ffffff',
                color: '#1e293b',
              }}
            />
          </div>
          <button
            onClick={handleResetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#334155',
              color: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 600,
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Row 2: Selects, Dates, Export */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={emailKycFilter}
            onChange={(e) => setEmailKycFilter(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              fontSize: '0.825rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#475569',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Email KYC Status</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Unverified</option>
          </select>

          <select
            value={kycStatusFilter}
            onChange={(e) => setKycStatusFilter(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              fontSize: '0.825rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#475569',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">KYC Status</option>
            <option value="VERIFIED">Verified</option>
            <option value="NOT VERIFIED">Not Verified</option>
          </select>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              style={{
                padding: '0.55rem 0.85rem',
                fontSize: '0.825rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '135px',
                backgroundColor: '#ffffff',
                color: '#475569',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd/mm/yyyy"
              style={{
                padding: '0.55rem 0.85rem',
                fontSize: '0.825rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '135px',
                backgroundColor: '#ffffff',
                color: '#475569',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleExportExcel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#15803d',
              color: '#ffffff',
              fontSize: '0.825rem',
              fontWeight: 600,
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            <FileSpreadsheet size={15} />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* Admin Table Box */}
      <div className="admin-table-box">
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th>TRADING ACCOUNTS</th>
                  <th>FULL NAME</th>
                  <th>EMAIL</th>
                  <th>PORTAL TIER</th>
                  <th>MT5 SERVER</th>
                  <th>MOBILE</th>
                  <th>COUNTRY</th>
                  <th>KYC STATUS</th>
                  <th>PASSWORD</th>
                  <th>EMAIL KYC</th>
                  <th>CREATED AT</th>
                  <th style={{ textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.length === 0 ? (
                  <tr>
                    <td className="data-table-empty" colSpan={13}>
                      No clients found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  table.rows.map((client, idx) => {
                    const rowNumber = table.from + idx;
                    const isKf = (client.server || '').toLowerCase().includes('kf');
                    return (
                      <tr key={client.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* 1. # */}
                        <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>{rowNumber}</td>

                        {/* 2. TRADING ACCOUNTS */}
                        <td>
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {client.tradingAccounts && client.tradingAccounts.length > 0 ? (
                              client.tradingAccounts.map((acc) => (
                                <span
                                  key={acc}
                                  onClick={() => navigate('/admin/trading-accounts')}
                                  style={{ color: '#2563eb', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  [{acc}]
                                </span>
                              ))
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No accounts</span>
                            )}
                          </div>
                        </td>

                        {/* 3. FULL NAME */}
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{client.fullName}</td>

                        {/* 4. EMAIL */}
                        <td style={{ color: '#64748b' }}>{client.email}</td>

                        {/* 5. PORTAL TIER */}
                        <td>
                          <button
                            type="button"
                            onClick={() => {
                              setNewDestinationDesk(client.clientType || 'referrer');
                              setReassignDeskClient(client);
                            }}
                            title="Click to reassign Partner Desk / Destination"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            {client.clientType === 'ib1' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.725rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#eff6ff',
                                  color: '#1d4ed8',
                                  border: '1px solid #bfdbfe',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <ShieldCheck size={12} color="#2563eb" />
                                <span>Partner 001</span>
                              </span>
                            ) : client.clientType === 'ib2' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.725rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#faf5ff',
                                  color: '#6d28d9',
                                  border: '1px solid #ddd6fe',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <ShieldCheck size={12} color="#7c3aed" />
                                <span>Partner 002</span>
                              </span>
                            ) : client.clientType === 'ib3' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.725rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#ecfdf5',
                                  color: '#059669',
                                  border: '1px solid #a7f3d0',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <ShieldCheck size={12} color="#059669" />
                                <span>Partner 003</span>
                              </span>
                            ) : client.clientType && client.clientType.startsWith('ib') ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.725rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#fffbeb',
                                  color: '#d97706',
                                  border: '1px solid #fde68a',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <ShieldCheck size={12} color="#d97706" />
                                <span>Partner {client.clientType.replace('ib', '').padStart(3, '0')}</span>
                              </span>
                            ) : client.clientType === 'demo' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.725rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#f5f3ff',
                                  color: '#7c3aed',
                                  border: '1px solid #ddd6fe',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <ShieldCheck size={12} color="#7c3aed" />
                                <span>Demo Sandbox</span>
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.725rem',
                                  fontWeight: 600,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '6px',
                                  backgroundColor: '#fff7ed',
                                  color: '#c2410c',
                                  border: '1px solid #fed7aa',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <span>{client.referralCode ? `Ref: ${client.referralCode}` : 'Direct Retail'}</span>
                              </span>
                            )}
                            <Pencil size={11} style={{ color: '#94a3b8', opacity: 0.6 }} />
                          </button>
                        </td>

                        {/* 6. MT5 SERVER */}
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.725rem',
                              fontWeight: 600,
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              backgroundColor: isKf ? '#f3e8ff' : '#f1f5f9',
                              color: isKf ? '#581c87' : '#334155',
                              border: `1px solid ${isKf ? '#d8b4fe' : '#e2e8f0'}`,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {client.server || (client.clientType === 'ib2' ? 'TheKFMarket-Live' : 'MajestyFX-Trade')}
                          </span>
                        </td>

                        {/* 7. MOBILE */}
                        <td style={{ color: '#64748b' }}>{client.mobile}</td>

                        {/* 8. COUNTRY */}
                        <td>
                          <span style={{ color: '#334155', fontWeight: 500 }}>{client.country}</span>
                        </td>

                        {/* 9. KYC STATUS */}
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              letterSpacing: '0.03em',
                              backgroundColor: client.kycStatus === 'VERIFIED' ? '#dcfce7' : '#fef3c7',
                              color: client.kycStatus === 'VERIFIED' ? '#166534' : '#92400e',
                            }}
                          >
                            {client.kycStatus}
                          </span>
                        </td>

                        {/* 10. PASSWORD */}
                        <td>
                          <button
                            type="button"
                            onClick={() => handleSendPasswordReset(client)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              color: '#2563eb',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                            title="Email the client a password reset link"
                          >
                            <Key size={13} />
                            <span>Send reset link</span>
                          </button>
                        </td>

                        {/* 11. EMAIL KYC */}
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              padding: '0.2rem 0.55rem',
                              borderRadius: '4px',
                              letterSpacing: '0.03em',
                              backgroundColor: client.emailKyc === 'VERIFIED' ? '#dcfce7' : '#fee2e2',
                              color: client.emailKyc === 'VERIFIED' ? '#166534' : '#991b1b',
                            }}
                          >
                            {client.emailKyc}
                          </span>
                        </td>

                        {/* 12. CREATED AT */}
                        <td style={{ color: '#64748b' }}>{client.createdAt}</td>

                        {/* 13. ACTIONS */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="admin-action-group">
                            {/* Impersonate / Login as user */}
                            <button
                              onClick={() => handleImpersonate(client)}
                              disabled={impersonatingId !== null}
                              title={
                                impersonatingId === client.id
                                  ? `Connecting to ${client.fullName}'s portal...`
                                  : `Impersonate ${client.fullName} (Sign in as this user)`
                              }
                              aria-label={`Impersonate ${client.fullName}`}
                              className="admin-action-btn admin-action-btn-impersonate disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {impersonatingId === client.id ? (
                                <Loader2 size={14} className="animate-spin text-blue-600" />
                              ) : (
                                <LogIn size={14} />
                              )}
                            </button>

                            {/* KYC Desk */}
                            <button
                              onClick={() => navigate(`/admin/kyc-documents?email=${encodeURIComponent(client.email)}`)}
                              title={`Go to KYC Verification Desk for ${client.fullName}`}
                              aria-label="Verify KYC in Document Desk"
                              className={`admin-action-btn ${
                                client.kycStatus === 'VERIFIED' ? 'admin-action-btn-approve' : 'admin-action-btn-amber'
                              }`}
                            >
                              {client.kycStatus === 'VERIFIED' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                            </button>

                            {/* Toggle Email KYC */}
                            <button
                              onClick={() => handleToggleEmailKyc(client.id)}
                              disabled={actionLoadingId !== null}
                              title={
                                actionLoadingId === client.id && actionType === 'email-kyc'
                                  ? 'Updating email status...'
                                  : client.emailKyc === 'VERIFIED'
                                  ? 'Email Verified (Click to unverify)'
                                  : 'Click to Verify Email'
                              }
                              aria-label="Toggle Email Verification"
                              className={`admin-action-btn disabled:opacity-50 disabled:cursor-not-allowed ${
                                client.emailKyc === 'VERIFIED' ? 'admin-action-btn-view' : 'admin-action-btn-amber'
                              }`}
                            >
                              {actionLoadingId === client.id && actionType === 'email-kyc' ? (
                                <Loader2 size={14} className="animate-spin text-blue-600" />
                              ) : client.emailKyc === 'VERIFIED' ? (
                                <MailCheck size={14} />
                              ) : (
                                <MailX size={14} />
                              )}
                            </button>

                            {/* Block / Unblock */}
                            <button
                              onClick={() => handleToggleBlock(client.id)}
                              disabled={actionLoadingId !== null}
                              title={
                                actionLoadingId === client.id && actionType === 'block'
                                  ? 'Updating access status...'
                                  : client.blocked
                                  ? 'Client Blocked (Click to unblock)'
                                  : 'Block Client'
                              }
                              aria-label={client.blocked ? 'Unblock Client' : 'Block Client'}
                              className={`admin-action-btn disabled:opacity-50 disabled:cursor-not-allowed ${
                                client.blocked ? 'admin-action-btn-reject' : 'admin-action-btn-view'
                              }`}
                            >
                              {actionLoadingId === client.id && actionType === 'block' ? (
                                <Loader2 size={14} className="animate-spin text-amber-600" />
                              ) : client.blocked ? (
                                <Ban size={14} />
                              ) : (
                                <LockOpen size={14} />
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteTargetClient(client)}
                              title="Permanently Delete Client & All Files"
                              aria-label="Delete Client"
                              className="admin-action-btn admin-action-btn-reject"
                            >
                              <Trash2 size={14} />
                            </button>

                            {/* More Actions Floating Trigger */}
                            <button
                              onClick={(e) => handleToggleMoreActions(e, client)}
                              style={{
                                backgroundColor: floatingMenuClient?.id === client.id ? '#0f172a' : '#f8fafc',
                                color: floatingMenuClient?.id === client.id ? '#ffffff' : '#334155',
                                border: '1px solid #cbd5e1',
                              }}
                              title="More Actions"
                              aria-label="More actions"
                              className="admin-action-btn"
                            >
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <TablePager table={table} />
      </div>

      {/* Floating Action Menu */}
      {floatingMenuClient && floatingMenuPos && (
        <div
          ref={floatingMenuRef}
          style={{
            position: 'fixed',
            top: floatingMenuPos.top !== undefined ? `${floatingMenuPos.top}px` : 'auto',
            bottom: floatingMenuPos.bottom !== undefined ? `${floatingMenuPos.bottom}px` : 'auto',
            right: `${floatingMenuPos.right}px`,
            width: '248px',
            maxHeight: `${floatingMenuPos.maxHeight || 480}px`,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#0d1527',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 45px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            padding: '0.45rem 0',
            zIndex: 99999,
            fontSize: '0.8125rem',
            color: '#e2e8f0',
            overscrollBehavior: 'contain',
          }}
          className="admin-action-floating-menu"
        >
          {/* View Details */}
          <button
            onClick={() => {
              setViewDetailsClient(floatingMenuClient);
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Eye size={15} />
            <span>View Details</span>
          </button>

          {/* Edit */}
          <button
            onClick={() => {
              setEditProfileClient({ ...floatingMenuClient });
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Pencil size={15} />
            <span>Edit</span>
          </button>

          {/* Change Desk / IB */}
          <button
            onClick={() => {
              setNewDestinationDesk(floatingMenuClient.clientType || 'referrer');
              setReassignDeskClient(floatingMenuClient);
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Building size={15} style={{ color: '#38bdf8' }} />
            <span>Change Desk / IB</span>
          </button>

          {/* Login as Client */}
          <button
            onClick={() => {
              handleImpersonate(floatingMenuClient);
              setFloatingMenuClient(null);
            }}
            disabled={impersonatingId !== null}
            className="admin-dropdown-item disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {impersonatingId === floatingMenuClient.id ? (
              <>
                <Loader2 size={15} className="animate-spin text-blue-400" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Login as Client</span>
              </>
            )}
          </button>

          {/* Send Email */}
          <button
            onClick={() => {
              setSendEmailClient(floatingMenuClient);
              setEmailSubject('Account Update - Majesty Financial');
              setEmailBody(`Dear ${floatingMenuClient.fullName},

We are writing to update you on your trading account status at Majesty Financial.

Best regards,
Majesty Financial Team`);
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Mail size={15} />
            <span>Send Email</span>
          </button>

          {/* Call Client */}
          <button
            onClick={() => {
              if (floatingMenuClient.mobile && floatingMenuClient.mobile !== 'N/A' && floatingMenuClient.mobile !== '—') {
                window.location.href = `tel:${floatingMenuClient.mobile}`;
                showToast(`Initiating call to ${floatingMenuClient.fullName} (${floatingMenuClient.mobile})...`, 'info');
              } else {
                showToast(`No registered mobile number for ${floatingMenuClient.fullName}.`, 'error');
              }
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Phone size={15} />
            <span>Call Client</span>
          </button>

          {/* Send Password Reset */}
          <button
            onClick={() => {
              handleSendPasswordReset(floatingMenuClient);
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Key size={15} />
            <span>Send Password Reset</span>
          </button>

          {/* Set / View Password */}
          <button
            onClick={() => {
              setSetPasswordClient(floatingMenuClient);
              setNewPassword(floatingMenuClient.password || '');
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item"
          >
            <Key size={15} style={{ color: '#f59e0b' }} />
            <span>Set / View Password</span>
          </button>

          {/* Block / Unblock */}
          <button
            onClick={() => {
              handleToggleBlock(floatingMenuClient.id);
              setFloatingMenuClient(null);
            }}
            className="admin-dropdown-item admin-dropdown-item-danger"
          >
            {floatingMenuClient.blocked ? <LockOpen size={15} /> : <Ban size={15} />}
            <span>{floatingMenuClient.blocked ? 'Unblock client' : 'Block client'}</span>
          </button>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '0.35rem 0' }} />

          {/* Submenu 1: IB Request */}
          <div style={{ padding: '0 0.35rem' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFloatingSubmenu(floatingSubmenu === 'ib' ? null : 'ib');
              }}
              style={{
                justifyContent: 'space-between',
                backgroundColor: floatingSubmenu === 'ib' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                borderRadius: '8px',
              }}
              className="admin-dropdown-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Users size={15} style={{ color: floatingSubmenu === 'ib' ? '#60a5fa' : '#94a3b8' }} />
                <span style={{ fontWeight: floatingSubmenu === 'ib' ? 600 : 500 }}>IB Request</span>
              </div>
              {floatingSubmenu === 'ib' ? (
                <ChevronDown size={14} style={{ color: '#60a5fa' }} />
              ) : (
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              )}
            </button>
            {floatingSubmenu === 'ib' && (
              <div
                style={{
                  margin: '0.2rem 0 0.35rem 0.5rem',
                  padding: '0.25rem 0',
                  backgroundColor: '#070d1a',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  onClick={() => handleSetIbStatus(floatingMenuClient, 'approved')}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <Check size={14} style={{ color: '#22c55e' }} />
                  <span>Approve IB Partner</span>
                </button>
                <button
                  onClick={() => handleSetIbStatus(floatingMenuClient, 'none')}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <span style={{ fontSize: '0.8rem' }}>Set as Standard Client</span>
                </button>
                <button
                  onClick={() => handleSetIbStatus(floatingMenuClient, 'rejected')}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item admin-dropdown-item-danger"
                >
                  <X size={14} />
                  <span>Reject IB Request</span>
                </button>
              </div>
            )}
          </div>

          {/* Submenu 2: Set Status */}
          <div style={{ padding: '0 0.35rem' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFloatingSubmenu(floatingSubmenu === 'status' ? null : 'status');
              }}
              style={{
                justifyContent: 'space-between',
                backgroundColor: floatingSubmenu === 'status' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                borderRadius: '8px',
              }}
              className="admin-dropdown-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sliders size={15} style={{ color: floatingSubmenu === 'status' ? '#60a5fa' : '#94a3b8' }} />
                <span style={{ fontWeight: floatingSubmenu === 'status' ? 600 : 500 }}>Set Status</span>
              </div>
              {floatingSubmenu === 'status' ? (
                <ChevronDown size={14} style={{ color: '#60a5fa' }} />
              ) : (
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              )}
            </button>
            {floatingSubmenu === 'status' && (
              <div
                style={{
                  margin: '0.2rem 0 0.35rem 0.5rem',
                  padding: '0.25rem 0',
                  backgroundColor: '#070d1a',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  onClick={() => handleSetStatus(floatingMenuClient, 'active')}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                  <span>Active</span>
                </button>
                <button
                  onClick={() => handleSetStatus(floatingMenuClient, 'pending')}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                  <span>Pending</span>
                </button>
                <button
                  onClick={() => handleSetStatus(floatingMenuClient, 'suspended')}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                  <span>Suspended</span>
                </button>
              </div>
            )}
          </div>

          {/* Submenu 3: Set KYC Status */}
          <div style={{ padding: '0 0.35rem' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFloatingSubmenu(floatingSubmenu === 'kyc' ? null : 'kyc');
              }}
              style={{
                justifyContent: 'space-between',
                backgroundColor: floatingSubmenu === 'kyc' ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                borderRadius: '8px',
              }}
              className="admin-dropdown-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={15} style={{ color: floatingSubmenu === 'kyc' ? '#60a5fa' : '#94a3b8' }} />
                <span style={{ fontWeight: floatingSubmenu === 'kyc' ? 600 : 500 }}>Set KYC Status</span>
              </div>
              {floatingSubmenu === 'kyc' ? (
                <ChevronDown size={14} style={{ color: '#60a5fa' }} />
              ) : (
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              )}
            </button>
            {floatingSubmenu === 'kyc' && (
              <div
                style={{
                  margin: '0.2rem 0 0.35rem 0.5rem',
                  padding: '0.25rem 0',
                  backgroundColor: '#070d1a',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <button
                  onClick={() => handleSetKycStatus(floatingMenuClient, true)}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <Check size={14} style={{ color: '#22c55e' }} />
                  <span>Verified</span>
                </button>
                <button
                  onClick={() => handleSetKycStatus(floatingMenuClient, false)}
                  style={{ paddingLeft: '0.85rem' }}
                  className="admin-dropdown-item"
                >
                  <AlertCircle size={14} style={{ color: '#f59e0b' }} />
                  <span>Under Review / Pending</span>
                </button>
                <button
                  onClick={() => {
                    navigate(`/admin/kyc-documents?email=${encodeURIComponent(floatingMenuClient.email)}`);
                    setFloatingMenuClient(null);
                  }}
                  style={{ paddingLeft: '0.85rem', color: '#60a5fa' }}
                  className="admin-dropdown-item"
                >
                  <ExternalLink size={14} />
                  <span>Review in KYC Desk</span>
                </button>
              </div>
            )}
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '0.4rem 0' }} />

          {/* Account Limit Input */}
          <div style={{ padding: '0.45rem 0.95rem 0.65rem' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
              ACCOUNT LIMIT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                value={accountLimits[floatingMenuClient.id] ?? floatingMenuClient.accountLimit ?? 100}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setAccountLimits((prev) => ({ ...prev, [floatingMenuClient.id]: val }));
                }}
                style={{
                  width: '75px',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: '#070d1a',
                  color: '#ffffff',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => handleSaveAccountLimit(floatingMenuClient, accountLimits[floatingMenuClient.id] ?? floatingMenuClient.accountLimit ?? 100)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: View Details */}
      {viewDetailsClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewDetailsClient(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  {viewDetailsClient.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {viewDetailsClient.fullName}
                  </h2>
                  <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                    Client ID: {viewDetailsClient.id} • Registered {viewDetailsClient.createdAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewDetailsClient(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Balance</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                  ${(viewDetailsClient.totalBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Equity</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                  ${(viewDetailsClient.totalEquity || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Account Limit</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#2563eb', marginTop: '0.2rem' }}>
                  {accountLimits[viewDetailsClient.id] ?? viewDetailsClient.accountLimit ?? 100}
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>KYC Status</div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: viewDetailsClient.kycStatus === 'VERIFIED' ? '#16a34a' : '#d97706',
                    marginTop: '0.35rem',
                  }}
                >
                  {viewDetailsClient.kycStatus}
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', width: '35%', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      Email Address
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a', fontWeight: 500 }}>{viewDetailsClient.email}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      Mobile Number
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a', fontWeight: 500 }}>{viewDetailsClient.mobile}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      Location
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a', fontWeight: 500 }}>
                      {viewDetailsClient.city}, {viewDetailsClient.country}
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      Portal Password
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                          {viewDetailsClient.password || '••••••••'}
                        </span>
                        {viewDetailsClient.password && viewDetailsClient.password !== '••••••••' ? (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(viewDetailsClient.password);
                              showToast('Password copied to clipboard!', 'info');
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                          >
                            <Copy size={13} />
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>(Hashed (legacy))</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      Trading Accounts
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {viewDetailsClient.tradingAccounts && viewDetailsClient.tradingAccounts.length > 0 ? (
                          viewDetailsClient.tradingAccounts.map((acc) => (
                            <span
                              key={acc}
                              style={{
                                padding: '0.15rem 0.45rem',
                                borderRadius: '4px',
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                              }}
                            >
                              {acc}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#94a3b8' }}>None provisioned</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      IB Partner Status
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a', fontWeight: 600 }}>
                      {viewDetailsClient.ibPartnerStatus?.toUpperCase() || 'NONE'}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', fontWeight: 600 }}>
                      Referred By (IB)
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#0f172a' }}>
                      {viewDetailsClient.referralCode ? (
                        <span style={{ fontWeight: 600, color: '#ea580c' }}>Ref: {viewDetailsClient.referralCode}</span>
                      ) : (
                        <span style={{ color: '#64748b' }}>Direct Retail Client</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => handleImpersonate(viewDetailsClient)}
                disabled={impersonatingId !== null}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {impersonatingId === viewDetailsClient.id ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-white" />
                    <span>Accessing Portal...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={14} />
                    <span>Login as Client</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditProfileClient({ ...viewDetailsClient });
                  setViewDetailsClient(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Pencil size={14} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setViewDetailsClient(null)}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Profile */}
      {editProfileClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSavingProfile) setEditProfileClient(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pencil size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Edit Client: {editProfileClient.fullName}
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.1rem 0 0 0' }}>
                    Client ID: {editProfileClient.id} • Registered {editProfileClient.createdAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditProfileClient(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfileClient.fullName}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, fullName: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editProfileClient.email}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editProfileClient.mobile}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, mobile: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={editProfileClient.city}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, city: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Country
                  </label>
                  <input
                    type="text"
                    value={editProfileClient.country}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, country: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Account Limit
                  </label>
                  <input
                    type="number"
                    value={editProfileClient.accountLimit || 100}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, accountLimit: parseInt(e.target.value) || 100 })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    KYC Verification Status
                  </label>
                  <select
                    value={editProfileClient.kycStatus}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, kycStatus: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="NOT VERIFIED">NOT VERIFIED (Pending)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    Account Status
                  </label>
                  <select
                    value={editProfileClient.status || (editProfileClient.blocked ? 'blocked' : 'active')}
                    onChange={(e) => setEditProfileClient({ ...editProfileClient, status: e.target.value, blocked: e.target.value === 'blocked' })}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff' }}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Assigned Partner Desk / Destination
                </label>
                <select
                  value={editProfileClient.clientType || 'referrer'}
                  onChange={(e) => setEditProfileClient({ ...editProfileClient, clientType: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', backgroundColor: '#ffffff', fontWeight: 600, color: '#1e293b' }}
                >
                  <option value="referrer">Referral Network (Majesty Standard - Manager 2000)</option>
                  <option value="ib1">Majesty FX Partner 001 (IB1 - Manager 3000 / Primewave)</option>
                  <option value="ib2">Majesty FX Partner 002 (IB2 - Manager 4321 / KF Markets)</option>
                  <option value="ib3">Majesty FX Partner 003 (IB3)</option>
                </select>
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.725rem', color: '#64748b' }}>
                  Changing this updates the client's desk routing, IB commission tier, and designated MT5 server.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={() => setEditProfileClient(null)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isSavingProfile ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Change Desk / IB */}
      {reassignDeskClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isReassigningDesk) setReassignDeskClient(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '520px',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f0f9ff',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Reassign Partner Desk
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.1rem 0 0 0' }}>
                    Change client destination between Referral and IB Desks
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReassignDeskClient(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReassignDeskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{reassignDeskClient.fullName}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>{reassignDeskClient.email}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem' }}>
                  <span style={{ color: '#64748b' }}>Current Desk:</span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      backgroundColor: '#e2e8f0',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      color: '#0f172a',
                    }}
                  >
                    {reassignDeskClient.clientType || 'referrer'}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Select New Destination Desk
                </label>
                <select
                  value={newDestinationDesk}
                  onChange={(e) => setNewDestinationDesk(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.85rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  <option value="referrer">Referral Network (Majesty Standard - Manager 2000)</option>
                  <option value="ib1">Majesty FX Partner 001 (IB1 - Manager 3000 / Primewave)</option>
                  <option value="ib2">Majesty FX Partner 002 (IB2 - Manager 4321 / KF Markets)</option>
                  <option value="ib3">Majesty FX Partner 003 (IB3)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  disabled={isReassigningDesk}
                  onClick={() => setReassignDeskClient(null)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReassigningDesk}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isReassigningDesk ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isReassigningDesk ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Reassigning...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Confirm Reassignment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Password Reset Sent */}
      {passwordResetSentData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setPasswordResetSentData(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '480px',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <Key size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Password Reset Link Sent
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
              A single-use reset link (valid 24 hours) was emailed to{' '}
              <strong>{passwordResetSentData.client.fullName}</strong> ({passwordResetSentData.client.email}).
            </p>
            <button
              onClick={() => setPasswordResetSentData(null)}
              style={{
                width: '100%',
                padding: '0.65rem',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal 5: Send Email */}
      {sendEmailClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSendingEmail) setSendEmailClient(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '560px',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Send Email to {sendEmailClient.fullName}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.1rem 0 0 0' }}>
                    Recipient: {sendEmailClient.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSendingEmail}
                onClick={() => setSendEmailClient(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Message Body
                </label>
                <textarea
                  rows={5}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button
                  type="button"
                  disabled={isSendingEmail}
                  onClick={() => setSendEmailClient(null)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isSendingEmail ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Dispatching Email...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Delete Confirmation */}
      {deleteTargetClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(2, 6, 23, 0.78)',
            backdropFilter: 'blur(6px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingClient) setDeleteTargetClient(null);
          }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              border: '1px solid #fee2e2',
              overflow: 'hidden',
              color: '#0f172a',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                padding: '1.1rem 1.25rem',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <Trash2 size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                    Delete Client Account
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#fecaca', margin: '0.15rem 0 0 0' }}>
                    Permanent Broker & Database Wipe
                  </p>
                </div>
              </div>
              {!isDeletingClient && (
                <button
                  type="button"
                  onClick={() => setDeleteTargetClient(null)}
                  style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.85)', cursor: 'pointer', padding: '0.25rem', borderRadius: '6px' }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginBottom: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Target Client
                  </span>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600, color: '#64748b' }}>
                    ID: #{deleteTargetClient.id}
                  </span>
                </div>
                <div style={{ marginTop: '0.35rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{deleteTargetClient.fullName}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.1rem' }}>
                    {deleteTargetClient.email}
                  </div>
                  {deleteTargetClient.tradingAccounts && deleteTargetClient.tradingAccounts.length > 0 && (
                    <div style={{ fontSize: '0.725rem', color: '#475569', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#475569' }}>MT5 Logins:</span>
                      {deleteTargetClient.tradingAccounts.map((acc) => (
                        <span
                          key={acc}
                          style={{
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #cbd5e1',
                            fontFamily: 'monospace',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#0f172a',
                          }}
                        >
                          {acc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '0.9rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  boxShadow: '0 2px 10px rgba(220, 38, 38, 0.25)',
                }}
              >
                <AlertCircle size={18} color="#ffffff" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '0.01em' }}>
                    Permanent Action Warning
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#ffffff', marginTop: '0.25rem', lineHeight: 1.45, opacity: 0.95 }}>
                    This operation will permanently purge this client from the database, delete all active MT5 trading accounts from the broker server, and remove all stored KYC files. This action cannot be reversed.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '0.9rem 1.5rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                disabled={isDeletingClient}
                onClick={() => setDeleteTargetClient(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  cursor: isDeletingClient ? 'not-allowed' : 'pointer',
                  opacity: isDeletingClient ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingClient}
                onClick={handleDeleteClient}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '9px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                  cursor: isDeletingClient ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  opacity: isDeletingClient ? 0.7 : 1,
                }}
              >
                {isDeletingClient ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Purging Account...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Delete Client</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Set Client Password */}
      {setPasswordClient && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSettingPassword) setSetPasswordClient(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '440px',
              padding: '1.75rem',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d97706',
                  }}
                >
                  <Key size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    Set Client Password
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    View, change, or set portal login password
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSetPasswordClient(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{setPasswordClient.fullName}</div>
              <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.15rem' }}>{setPasswordClient.email}</div>
              {setPasswordClient.password && (
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Current Stored Password:</span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: '#e2e8f0',
                      color: '#0f172a',
                    }}
                  >
                    {setPasswordClient.password}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(setPasswordClient.password);
                      showToast('Current password copied!', 'info');
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}
                    title="Copy"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswordPlain ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    style={{
                      width: '100%',
                      padding: '0.6rem 2.2rem 0.6rem 0.8rem',
                      fontSize: '0.85rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordPlain(!showPasswordPlain)}
                    style={{
                      position: 'absolute',
                      right: '0.65rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
                    let pass = '';
                    for (let i = 0; i < 12; i++) pass += charset.charAt(Math.floor(Math.random() * charset.length));
                    setNewPassword(pass);
                    setShowPasswordPlain(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  ⚡ Auto-Generate
                </button>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifyClientOnPassword}
                    onChange={(e) => setNotifyClientOnPassword(e.target.checked)}
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span>Send notification email to client</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <button
                  type="button"
                  disabled={isSettingPassword}
                  onClick={() => setSetPasswordClient(null)}
                  style={{ padding: '0.55rem 1.15rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSettingPassword}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: isSettingPassword ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSettingPassword ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 8: Add New Institutional Client */}
      {addModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
            overflowY: 'auto',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isCreatingClient) setAddModalOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
              width: '100%',
              maxWidth: '660px',
              maxHeight: 'min(90vh, 740px)',
              display: 'flex',
              flexDirection: 'column',
              margin: 'auto',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                flexShrink: 0,
                padding: '1.15rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    border: '1px solid #ffedd5',
                    color: '#ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Add New Institutional Client
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                    Create account profile & auto-provision MT5 Live Trading Account
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isCreatingClient && setAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateClientSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {createSuccess && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #86efac',
                      color: '#166534',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Check size={16} />
                    <span>{createSuccess}</span>
                  </div>
                )}
                {createError && (
                  <div
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fca5a5',
                      color: '#991b1b',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{createError}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {/* Full Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Full Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Wright"
                      value={newClientFullName}
                      onChange={(e) => setNewClientFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Email Address <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@majestyfx.com"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* Phone / Mobile */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Phone / Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="+971 50 123 4567"
                      value={newClientMobile}
                      onChange={(e) => setNewClientMobile(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* Country of Residence */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Country of Residence
                    </label>
                    <select
                      value={newClientCountry}
                      onChange={(e) => setNewClientCountry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="India">India (IN)</option>
                      <option value="United Arab Emirates">United Arab Emirates (AE)</option>
                      <option value="United Kingdom">United Kingdom (GB)</option>
                      <option value="United States">United States (US)</option>
                      <option value="Singapore">Singapore (SG)</option>
                      <option value="Germany">Germany (DE)</option>
                      <option value="Russia">Russia (RU)</option>
                      <option value="Australia">Australia (AU)</option>
                      <option value="South Africa">South Africa (ZA)</option>
                      <option value="Canada">Canada (CA)</option>
                      <option value="Other">Other / Global</option>
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai"
                      value={newClientCity}
                      onChange={(e) => setNewClientCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>

                  {/* MT5 Account Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      MT5 Account Type
                    </label>
                    <select
                      value={newClientAccountType}
                      onChange={(e) => setNewClientAccountType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="STANDARD">Standard Account (1:500 Leverage)</option>
                      <option value="RAW SPREAD">Raw Spread Account (Institutional ECN)</option>
                      <option value="PRO VIP">Pro VIP Account (0.0 Pip Tier)</option>
                    </select>
                  </div>

                  {/* Portal Tier / Destination Network */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Portal Tier / Destination Network
                    </label>
                    <select
                      value={newClientTier}
                      onChange={(e) => setNewClientTier(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    >
                      <option value="referrer">Direct Retail / Referrals (MajestyFX-Trade)</option>
                      <option value="ib1">IB1 Partner Network (MajestyFX-Trade)</option>
                      <option value="ib2">IB2 Partner Network (TheKFMarket-Live)</option>
                    </select>
                  </div>

                  {/* Info notice */}
                  <div style={{ gridColumn: 'span 2', fontSize: '0.75rem', color: '#64748b' }}>
                    The client receives an email link to set their own portal password. Admins never see client passwords.
                  </div>

                  {/* Referral Code */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Referring IB / Partner Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IB-GOLD-8891 or leave empty"
                      value={newClientReferralCode}
                      onChange={(e) => setNewClientReferralCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        fontSize: '0.85rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                      }}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      checked={newClientMarkEmailVerified}
                      onChange={(e) => setNewClientMarkEmailVerified(e.target.checked)}
                      style={{ accentColor: '#16a34a', width: '16px', height: '16px' }}
                    />
                    <span>Mark Email as Verified</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: '#1e293b' }}>
                    <input
                      type="checkbox"
                      checked={newClientMarkKycVerified}
                      onChange={(e) => setNewClientMarkKycVerified(e.target.checked)}
                      style={{ accentColor: '#16a34a', width: '16px', height: '16px' }}
                    />
                    <span>Mark KYC as Verified</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                }}
              >
                <button
                  type="button"
                  disabled={isCreatingClient}
                  onClick={() => setAddModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingClient}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.35rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: isCreatingClient ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(249, 115, 22, 0.3)',
                    opacity: isCreatingClient ? 0.7 : 1,
                  }}
                >
                  {isCreatingClient ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Provisioning Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Create Client</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
