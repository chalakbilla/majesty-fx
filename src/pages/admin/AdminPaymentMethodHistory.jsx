import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  RefreshCw,
  Search,
  Filter,
  RotateCcw,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCode,
} from 'lucide-react';

const STORAGE_KEY = 'majesty_admin_payment_method_history';

const INITIAL_AUDIT_LOGS = [
  {
    id: '43b08047-379c-42f4-b9a0-9ce513f1c456',
    methodName: 'BTC (Bitcoin) - Referral Vault',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'd4bf4605-8f60-4e4d-9e28-813ca58589a1',
      desk: 'referral',
      name: 'BTC (Bitcoin) - Referral Vault',
      status: 'Active',
      details: 'bc1qu9fuu65ppjp6mea8ev0n5x9v2rv0tzzjtec5y0',
      created_at: '2026-10-30T17:19:29.857799+00:00',
      updated_at: '2026-10-30T17:19:29.93+00:00',
      description: 'Bitcoin (BTC) mainnet only. Send only BTC to this address; sending other assets or using another network will result in permanent loss.',
      qr_code_url: 'https://dgnjhvpqaembsdxiplky.supabase.co/storage/v1/object/public/payment-methods/vaults/qr_btc_referral_1793380767633.png',
      payment_type: 'Crypto (BTC)',
      withdraw_fees: 'Zero fee',
      transaction_time: '10 - 30 mins',
    }),
    modifiedBy: 'system (requested by owner)',
    ipAddress: '104.28.19.42',
    timestamp: '10/30/2026, 10:49:30 PM',
    status: 'Recorded',
  },
  {
    id: 'ef416773-7399-49d5-a56d-9c300e80b681',
    methodName: 'USDT (BEP20) - Referral Vault',
    action: 'Updated',
    previousValue: JSON.stringify({
      id: '469b8297-e8b6-47d8-8b68-ceb505a6fca7',
      desk: 'referral',
      name: 'USDT (BEP20) - Referral Vault',
      status: 'Active',
      details: '0xb0a5CEbb9341F8dA1C157F5A7434288d8aAC0fC3',
      payment_type: 'Crypto (BEP20)',
    }),
    newValue: JSON.stringify({
      id: '469b8297-e8b6-47d8-8b68-ceb505a6fca7',
      desk: 'referral',
      name: 'USDT (BEP20) - Referral Vault',
      status: 'Inactive',
      details: '0xb0a5CEbb9341F8dA1C157F5A7434288d8aAC0fC3',
      payment_type: 'Crypto (BEP20)',
    }),
    modifiedBy: 'alex.w@majestyfx.com',
    ipAddress: '192.168.1.105',
    timestamp: '10/30/2026, 10:49:30 PM',
    status: 'Recorded',
  },
  {
    id: 'cfe1786f-17df-4ea5-9a76-31d369786e43',
    methodName: 'Institutional Bank Wire',
    action: 'Updated',
    previousValue: JSON.stringify({
      id: '18975538',
      name: 'Institutional Bank Wire',
      withdraw_fees: '0.5%',
      transaction_time: '1 - 3 business days',
    }),
    newValue: JSON.stringify({
      id: '18975538',
      name: 'Institutional Bank Wire',
      withdraw_fees: 'Zero fee',
      transaction_time: 'Same-day MT103',
    }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 5:58:39 PM',
    status: 'Recorded',
  },
  {
    id: '563aa192-a58c-4cd5-8411-dfa08cde322f',
    methodName: 'Institutional Bank Wire',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: '18975538',
      name: 'Institutional Bank Wire',
      payment_type: 'Bank Wire',
      status: 'Active',
      details: 'Beneficiary: Majesty Global Ltd, Bank: Barclays UK',
    }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 4:32:29 PM',
    status: 'Recorded',
  },
  {
    id: 'f4bf1677-5354-4144-845b-efbd52e27bf7',
    methodName: 'USDT TRC20 - Official Vault',
    action: 'Deleted',
    previousValue: JSON.stringify({
      id: '9018412',
      name: 'USDT TRC20 - Official Vault',
      status: 'Active',
      details: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd36dWsv7',
    }),
    newValue: JSON.stringify({
      status: 'Archived/Deleted',
      deleted_at: '2026-10-16T15:49:29Z',
    }),
    modifiedBy: 'system',
    ipAddress: '127.0.0.1',
    timestamp: '10/16/2026, 3:49:29 PM',
    status: 'Recorded',
  },
  {
    id: '62ec9802-2080-42dc-a6d6-b854059b7e5f',
    methodName: 'USDT TRC20 - Official Vault',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: '9018412',
      name: 'USDT TRC20 - Official Vault',
      payment_type: 'Crypto (TRC20)',
      status: 'Active',
    }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 3:49:20 PM',
    status: 'Recorded',
  },
  {
    id: 'd5cfbed8-9ed2-449d-9741-f4bda2340d71',
    methodName: 'BTC',
    action: 'Updated',
    previousValue: JSON.stringify({ status: 'Inactive', name: 'BTC' }),
    newValue: JSON.stringify({ status: 'Active', name: 'BTC' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 3:44:48 PM',
    status: 'Recorded',
  },
  {
    id: 'a4ebbc1c-2b95-436d-bba4-25a3ab3fb2fb',
    methodName: 'BTC',
    action: 'Updated',
    previousValue: JSON.stringify({ transaction_time: '30 - 60 mins' }),
    newValue: JSON.stringify({ transaction_time: '15 - 45 mins' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 3:44:37 PM',
    status: 'Recorded',
  },
  {
    id: 'bc5a67cf-f56a-42e8-8e07-0b762796000e',
    methodName: 'USDT TRC20',
    action: 'Updated',
    previousValue: JSON.stringify({ details: 'TX_LEGACY_ADDR_01' }),
    newValue: JSON.stringify({ details: 'TX9xK2mP99aL1oQrStUvWz8' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 3:44:26 PM',
    status: 'Recorded',
  },
  {
    id: '88e427b7-d602-42c0-9a5e-ee738cb954ac',
    methodName: 'USDT BEP20',
    action: 'Updated',
    previousValue: JSON.stringify({ status: 'Active', min_deposit: 10 }),
    newValue: JSON.stringify({ status: 'Active', min_deposit: 50 }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/16/2026, 3:44:13 PM',
    status: 'Recorded',
  },
  {
    id: '77d3129a-2e4b-48cf-9a11-ee8921a81234',
    methodName: 'Institutional Wire SEPA',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'sepa-vault-01',
      name: 'Institutional Wire SEPA',
      currency: 'EUR',
      status: 'Active',
      transaction_time: 'Instant / Same-day',
    }),
    modifiedBy: 'system (automated provisioning)',
    ipAddress: '10.0.0.12',
    timestamp: '10/15/2026, 2:10:05 PM',
    status: 'Recorded',
  },
  {
    id: '66c2018b-1d3a-47be-8900-dd7810b70123',
    methodName: 'ETH (ERC20)',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'eth-erc20-vault',
      name: 'ETH (ERC20)',
      status: 'Active',
      details: '0x3289F4A7599cBf082e68407B1982b6b55D757A99',
    }),
    modifiedBy: 'alex.w@majestyfx.com',
    ipAddress: '192.168.1.105',
    timestamp: '10/14/2026, 8:22:41 AM',
    status: 'Recorded',
  },
  {
    id: '55b1907a-0c29-46ad-789f-cc6709a69012',
    methodName: 'ETH (ERC20)',
    action: 'Updated',
    previousValue: JSON.stringify({ withdraw_fees: '0.005 ETH' }),
    newValue: JSON.stringify({ withdraw_fees: 'Network Gas Only' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/14/2026, 8:40:19 AM',
    status: 'Recorded',
  },
  {
    id: '44a08969-9b18-459c-678e-bb5698958901',
    methodName: 'UPI Instant NetBanking',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'upi-gateway-in',
      name: 'UPI Instant NetBanking',
      currency: 'INR',
      status: 'Active',
      payment_type: 'Instant UPI / QR',
    }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/12/2026, 11:15:33 AM',
    status: 'Recorded',
  },
  {
    id: '339f7858-8a07-448b-567d-aa4587847890',
    methodName: 'UPI Instant NetBanking',
    action: 'Updated',
    previousValue: JSON.stringify({ status: 'Active', daily_limit: 500000 }),
    newValue: JSON.stringify({ status: 'Active', daily_limit: 1000000 }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/12/2026, 1:44:12 PM',
    status: 'Recorded',
  },
  {
    id: '228e6747-79f6-437a-456c-993476736789',
    methodName: 'Credit / Debit Card (Visa/MC)',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'stripe-card-proc',
      name: 'Credit / Debit Card (Visa/MC)',
      status: 'Active',
      transaction_time: 'Instant 3D-Secure',
    }),
    modifiedBy: 'system',
    ipAddress: '127.0.0.1',
    timestamp: '10/10/2026, 9:00:00 AM',
    status: 'Recorded',
  },
  {
    id: '117d5636-68e5-4269-345b-882365625678',
    methodName: 'Credit / Debit Card (Visa/MC)',
    action: 'Updated',
    previousValue: JSON.stringify({ fraud_check_level: 'Standard' }),
    newValue: JSON.stringify({ fraud_check_level: 'Strict 3DS2 Verified' }),
    modifiedBy: 'alex.w@majestyfx.com',
    ipAddress: '192.168.1.105',
    timestamp: '10/10/2026, 10:30:15 AM',
    status: 'Recorded',
  },
  {
    id: '006c4525-57d4-4158-234a-771254514567',
    methodName: 'Skrill Digital Wallet',
    action: 'Deleted',
    previousValue: JSON.stringify({ id: 'skrill-01', name: 'Skrill Digital Wallet', status: 'Active' }),
    newValue: JSON.stringify({ status: 'Deprecated / Deleted' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/08/2026, 4:18:22 PM',
    status: 'Recorded',
  },
  {
    id: 'ff5b3414-46c3-4047-1239-660143403456',
    methodName: 'Neteller Portal',
    action: 'Deleted',
    previousValue: JSON.stringify({ id: 'neteller-01', name: 'Neteller Portal', status: 'Active' }),
    newValue: JSON.stringify({ status: 'Deprecated / Deleted' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/08/2026, 4:18:10 PM',
    status: 'Recorded',
  },
  {
    id: 'ee4a2303-35b2-3f36-0128-559032392345',
    methodName: 'Perfect Money Vault',
    action: 'Updated',
    previousValue: JSON.stringify({ status: 'Active', fee: '1.5%' }),
    newValue: JSON.stringify({ status: 'Inactive', fee: '1.5%' }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/05/2026, 2:12:09 PM',
    status: 'Recorded',
  },
  {
    id: 'dd391292-24a1-2e25-9017-448f21281234',
    methodName: 'USDT (Polygon Network)',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'usdt-polygon-01',
      name: 'USDT (Polygon Network)',
      status: 'Active',
      transaction_time: '2 - 5 mins',
    }),
    modifiedBy: 'alex.w@majestyfx.com',
    ipAddress: '192.168.1.105',
    timestamp: '10/04/2026, 6:05:44 PM',
    status: 'Recorded',
  },
  {
    id: 'cc280181-1390-1d14-8906-337e10170123',
    methodName: 'USDT (Polygon Network)',
    action: 'Updated',
    previousValue: JSON.stringify({ status: 'Active', min_deposit: 20 }),
    newValue: JSON.stringify({ status: 'Active', min_deposit: 10 }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/04/2026, 6:30:19 PM',
    status: 'Recorded',
  },
  {
    id: 'bb17f070-028f-0c03-7895-226d0f069012',
    methodName: 'Institutional Wire SWIFT USD',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'swift-usd-inst',
      name: 'Institutional Wire SWIFT USD',
      status: 'Active',
      currency: 'USD',
    }),
    modifiedBy: 'system (compliance approved)',
    ipAddress: '10.0.0.1',
    timestamp: '10/02/2026, 11:20:00 AM',
    status: 'Recorded',
  },
  {
    id: 'aa06ef6f-917e-fb92-6784-115c9e958901',
    methodName: 'Institutional Wire SWIFT USD',
    action: 'Updated',
    previousValue: JSON.stringify({ routing_code: 'BARCGB22XXX' }),
    newValue: JSON.stringify({ routing_code: 'BARCGB22LON' }),
    modifiedBy: 'alex.w@majestyfx.com',
    ipAddress: '192.168.1.105',
    timestamp: '10/02/2026, 1:15:22 PM',
    status: 'Recorded',
  },
  {
    id: '99f5de5e-806d-ea81-5673-004b8d847890',
    methodName: 'Binance Pay Direct',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'binance-pay-qr',
      name: 'Binance Pay Direct',
      status: 'Active',
      merchant_id: 'MAJESTY_PAY_8819',
    }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/01/2026, 10:00:00 AM',
    status: 'Recorded',
  },
  {
    id: '88e4cd4d-7f5c-d970-4562-ff3a7c736789',
    methodName: 'Binance Pay Direct',
    action: 'Updated',
    previousValue: JSON.stringify({ auto_confirm: false }),
    newValue: JSON.stringify({ auto_confirm: true }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '10/01/2026, 10:14:55 AM',
    status: 'Recorded',
  },
  {
    id: '77d3bc3c-6e4b-c86f-3451-ee296b625678',
    methodName: 'Solana (USDC)',
    action: 'Created',
    previousValue: null,
    newValue: JSON.stringify({
      id: 'solana-usdc-vault',
      name: 'Solana (USDC)',
      status: 'Active',
      details: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    }),
    modifiedBy: 'alex.w@majestyfx.com',
    ipAddress: '192.168.1.105',
    timestamp: '09/28/2026, 3:30:12 PM',
    status: 'Recorded',
  },
  {
    id: '66c2ab2b-5d3a-b75e-2340-dd185a514567',
    methodName: 'Solana (USDC)',
    action: 'Updated',
    previousValue: JSON.stringify({ confirmation_blocks: 32 }),
    newValue: JSON.stringify({ confirmation_blocks: 16 }),
    modifiedBy: 'demoadmin',
    ipAddress: '172.56.21.89',
    timestamp: '09/28/2026, 4:10:05 PM',
    status: 'Recorded',
  },
];

function formatConfig(val) {
  if (val === null || val === undefined) return 'No previous value';
  if (typeof val === 'string') return val;
  return JSON.stringify(val);
}

export default function AdminPaymentMethodHistory() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeLog, setActiveLog] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {}
  }, [logs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/payment-methods?view=history', {
        headers: { 'x-portal-scope': 'admin' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.records) && data.records.length > 0) {
          const mapped = data.records.map((r) => ({
            id: r.id,
            methodName: r.method_name || r.name || 'Payment Method',
            action: r.action || 'Updated',
            previousValue: r.previous_value,
            newValue: r.new_value,
            modifiedBy: r.modified_by || 'system',
            ipAddress: r.ip_address || '',
            timestamp: r.created_at ? new Date(r.created_at).toLocaleString() : new Date().toLocaleString(),
            status: 'Recorded',
          }));
          setLogs(mapped);
        }
      }
    } catch {
      // Retain existing records gracefully
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== 'All' && log.action.toLowerCase() !== actionFilter.toLowerCase()) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          log.methodName.toLowerCase().includes(q) ||
          log.modifiedBy.toLowerCase().includes(q) ||
          (log.ipAddress && log.ipAddress.toLowerCase().includes(q)) ||
          formatConfig(log.newValue).toLowerCase().includes(q) ||
          formatConfig(log.previousValue).toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, searchTerm, actionFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Method Name',
      'Action',
      'Previous Value',
      'New Value',
      'Modified By',
      'IP Address',
      'Timestamp',
      'Status',
    ];

    const rows = filtered.map((l) => [
      l.id,
      l.methodName,
      l.action,
      formatConfig(l.previousValue),
      formatConfig(l.newValue),
      l.modifiedBy,
      l.ipAddress,
      l.timestamp,
      l.status,
    ]);

    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment_method_history_audit_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const hasFilterActive = searchTerm || actionFilter !== 'All';

  const getActionBadge = (action) => {
    const act = (action || '').toLowerCase();
    if (act === 'created') {
      return (
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: 'rgb(239, 246, 255)',
            color: 'rgb(37, 99, 235)',
          }}
        >
          Created
        </span>
      );
    }
    if (act === 'deleted') {
      return (
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            backgroundColor: 'rgb(254, 242, 242)',
            color: 'rgb(220, 38, 38)',
          }}
        >
          Deleted
        </span>
      );
    }
    return (
      <span
        style={{
          padding: '0.15rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          backgroundColor: 'rgb(254, 243, 199)',
          color: 'rgb(180, 83, 9)',
        }}
      >
        Updated
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none pr-10 sm:pr-0"
          >
            <Link to="/admin/dashboard" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <Link to="/admin/payment-methods" className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap">
              System Settings
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Payment Method History</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1 pr-10 sm:pr-0">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Payment Methods
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Audit History
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Comprehensive immutable audit trail of payment methods, gateway configurations, and treasury account changes
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-stretch sm:self-auto shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="btn-secondary transition-all cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                title="Refresh page data"
                aria-label="Refresh"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: '0.5rem',
                  border: '1px solid rgb(203, 213, 225)',
                  backgroundColor: 'rgb(255, 255, 255)',
                  color: 'rgb(51, 65, 85)',
                  cursor: 'pointer',
                  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px',
                  transition: '0.15s',
                }}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2.5 flex-1">
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by method name, admin email, IP..."
                className="w-full pl-8 pr-8 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="All">All Actions</option>
                <option value="Created">Created</option>
                <option value="Updated">Updated</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasFilterActive && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('All');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg whitespace-nowrap">
              {filtered.length} logs
            </span>
          </div>
        </div>
      </div>

      {/* 3. Table Box */}
      <div
        className="admin-table-box"
        style={{
          backgroundColor: 'rgb(255, 255, 255)',
          borderRadius: '0.5rem',
          border: '1px solid rgb(226, 232, 240)',
          boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px',
          overflow: 'hidden',
        }}
      >
        <div className="data-table data-table--plain">
          <div className="data-table-scroll">
            <table className="data-table-grid" data-cards="">
              <thead>
                <tr>
                  <th>LOG ID</th>
                  <th>PAYMENT METHOD</th>
                  <th>ACTION TYPE</th>
                  <th>PREVIOUS CONFIG</th>
                  <th>UPDATED CONFIG</th>
                  <th>MODIFIED BY</th>
                  <th>IP ADDRESS</th>
                  <th>TIMESTAMP</th>
                  <th>AUDIT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((log, idx) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: '1px solid rgb(241, 245, 249)',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    }}
                  >
                    <td
                      data-label="LOG ID"
                      style={{ padding: '0.75rem 1rem', color: 'rgb(100, 116, 139)' }}
                      title={log.id}
                    >
                      #{log.id.length > 18 ? `${log.id.slice(0, 18)}...` : log.id}
                    </td>
                    <td
                      data-label="PAYMENT METHOD"
                      style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'rgb(15, 23, 42)' }}
                    >
                      {log.methodName}
                    </td>
                    <td data-label="ACTION TYPE" style={{ padding: '0.75rem 1rem' }}>
                      {getActionBadge(log.action)}
                    </td>
                    <td
                      data-label="PREVIOUS CONFIG"
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'rgb(100, 116, 139)',
                        fontFamily: 'monospace',
                        maxWidth: '220px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={formatConfig(log.previousValue)}
                      onClick={() => setActiveLog({ ...log, viewingConfig: 'previous' })}
                      className="cursor-pointer hover:underline"
                    >
                      {formatConfig(log.previousValue)}
                    </td>
                    <td
                      data-label="UPDATED CONFIG"
                      style={{
                        padding: '0.75rem 1rem',
                        fontWeight: 600,
                        color: 'rgb(15, 23, 42)',
                        fontFamily: 'monospace',
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={formatConfig(log.newValue)}
                      onClick={() => setActiveLog({ ...log, viewingConfig: 'new' })}
                      className="cursor-pointer hover:underline"
                    >
                      {formatConfig(log.newValue)}
                    </td>
                    <td
                      data-label="MODIFIED BY"
                      style={{ padding: '0.75rem 1rem', color: 'rgb(37, 99, 235)' }}
                    >
                      {log.modifiedBy}
                    </td>
                    <td
                      data-label="IP ADDRESS"
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'rgb(100, 116, 139)',
                        fontFamily: 'monospace',
                      }}
                    >
                      {log.ipAddress || '—'}
                    </td>
                    <td
                      data-label="TIMESTAMP"
                      style={{ padding: '0.75rem 1rem', color: 'rgb(100, 116, 139)' }}
                    >
                      {log.timestamp}
                    </td>
                    <td data-label="AUDIT STATUS" style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'rgb(220, 252, 231)',
                          color: 'rgb(21, 128, 61)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-slate-400 font-medium text-xs">
                      No audit records match the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pager Controls */}
          <div className="table-pager">
            <span className="table-pager-info">
              Showing <strong>{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> entries
            </span>
            <div className="table-pager-controls">
              <label className="table-pager-size">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  aria-label="Rows per page"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </label>
              <nav className="table-pager-pages" aria-label="Pages">
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Prev</span>
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      className={`table-pager-btn table-pager-num ${currentPage === pageNum ? 'active' : ''}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="table-pager-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Config Detail Modal */}
      {activeLog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setActiveLog(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              width: '100%',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode className="w-5 h-5 text-orange-600" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  Gateway Config Audit: {activeLog.methodName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>LOG ID</span>
                  <code style={{ fontSize: '0.8rem' }}>#{activeLog.id}</code>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>ACTION TYPE</span>
                  {getActionBadge(activeLog.action)}
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>MODIFIED BY</span>
                  <strong style={{ color: 'rgb(37, 99, 235)' }}>{activeLog.modifiedBy}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>TIMESTAMP</span>
                  <span>{activeLog.timestamp}</span>
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                  PREVIOUS CONFIGURATION
                </span>
                <pre
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: '#64748b',
                  }}
                >
                  {formatConfig(activeLog.previousValue)}
                </pre>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.25rem' }}>
                  UPDATED / CURRENT CONFIGURATION
                </span>
                <pre
                  style={{
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: '#0f172a',
                    fontWeight: 600,
                  }}
                >
                  {formatConfig(activeLog.newValue)}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveLog(null)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close Audit Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Version Footer */}
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
