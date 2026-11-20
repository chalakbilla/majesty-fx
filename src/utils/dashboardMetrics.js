/** Pure helpers that turn the mock collections into the dashboard KPI numbers. */

export const toNumber = (v) => {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const formatMoney = (n) =>
  `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const sum = (list, pick) => list.reduce((t, r) => t + pick(r), 0);
const is = (value, ...names) => names.includes(String(value ?? '').toLowerCase());

export function computeDashboardMetrics(c) {
  const approvedDeposits = c.deposits.filter((d) => is(d.status, 'approved'));
  const approvedWithdrawals = c.withdrawals.filter((w) => is(w.status, 'approved', 'completed'));
  const totalDeposits = sum(approvedDeposits, (d) => toNumber(d.amountValue ?? d.amount));
  const totalWithdrawals = sum(approvedWithdrawals, (w) => toNumber(w.amountNum ?? w.amount));
  const credit = (type) =>
    sum(c.creditAdjustments.filter((a) => is(a.type, type)), (a) => toNumber(a.amount));
  const totalCredit = credit('credit in') - credit('credit out');
  const totalEquity = sum(c.tradingAccounts, (a) => toNumber(a.equity));
  const creditUsed = credit('credit out');

  return {
    totalDeposits,
    totalWithdrawals,
    netDeposit: totalDeposits - totalWithdrawals,
    totalEquity,
    totalCredit,
    creditUsed,
    withdrawableEquity: Math.max(totalEquity - totalCredit, 0),
    totalClients: c.clients.length,
    tradingAccounts: c.tradingAccounts.filter((a) => is(a.status, 'active')).length,
    totalUsers: c.clients.length + c.ibPartners.length,
    activeVisitors: c.clients.length ? Math.max(Math.round(c.clients.length / 3), 1) : 0,
    newUsers24h: c.clients.filter((cl) => cl.createdAt && Date.now() - new Date(cl.createdAt) < 864e5).length,
    kycVerified: c.kycDocuments.filter((k) => is(k.status, 'approved')).length,
    pammAccounts: c.pammAccounts.length,
    affiliates: c.ibPartners.length,
    copyTradingAccounts: c.copyTradingAccounts.length,
    totalTradingAccounts: c.tradingAccounts.length,
    totalTransactions:
      c.deposits.length + c.withdrawals.length + c.pendingDeposits.length + c.pendingWithdrawals.length,
    pendingDeposits: c.pendingDeposits.length,
    approvedDeposits: approvedDeposits.length,
    rejectedDeposits: c.rejectedDeposits.length,
    pendingWithdrawals: c.pendingWithdrawals.length,
    approvedWithdrawals: approvedWithdrawals.length,
    rejectedWithdrawals: c.rejectedWithdrawals.length,
  };
}
