/**
 * Registry of every mock "table". Each one is seeded from a JSON file in ./json
 * and persisted to localStorage by services/mockDb.js.
 */
import { defineCollection } from '../services/mockDb.js';

import accountLedgerSeed from './json/accountLedger.json';
import accountTypesSeed from './json/accountTypes.json';
import accountStatusesSeed from './json/accountStatuses.json';
import approvedFollowersSeed from './json/approvedFollowers.json';
import rejectedFollowersSeed from './json/rejectedFollowers.json';
import mastersSeed from './json/masters.json';
import copyTradingAccountsSeed from './json/copyTradingAccounts.json';
import profitSharingSeed from './json/profitSharing.json';
import dailyInflowSeed from './json/dailyInflow.json';
import clientsSeed from './json/clients.json';
import tradingAccountsSeed from './json/tradingAccounts.json';
import ibPartnersSeed from './json/ibPartners.json';
import ibClientsSeed from './json/ibClients.json';
import ibWithdrawalsSeed from './json/ibWithdrawals.json';
import ibRewardsSeed from './json/ibRewards.json';
import ibRewardTiersSeed from './json/ibRewardTiers.json';
import ibCommissionHistorySeed from './json/ibCommissionHistory.json';
import commissionTiersSeed from './json/commissionTiers.json';
import ibCommissionSettingsSeed from './json/ibCommissionSettings.json';
import tradesSeed from './json/trades.json';
import rankTiersSeed from './json/rankTiers.json';
import rebateAccountsSeed from './json/rebateAccounts.json';
import ticketsManageSeed from './json/ticketsManage.json';
import supportTicketsSeed from './json/supportTickets.json';
import pammAccountsSeed from './json/pammAccounts.json';
import pammClientsSeed from './json/pammClients.json';
import pammCommissionsSeed from './json/pammCommissions.json';
import pammCommissionTiersSeed from './json/pammCommissionTiers.json';
import pammWithdrawalsSeed from './json/pammWithdrawals.json';
import paymentMethodsSeed from './json/paymentMethods.json';
import paymentMethodHistorySeed from './json/paymentMethodHistory.json';
import paymentLedgerSeed from './json/paymentLedger.json';
import depositsSeed from './json/deposits.json';
import manualDepositsSeed from './json/manualDeposits.json';
import manualDepositAccountsSeed from './json/manualDepositAccounts.json';
import rejectedDepositsSeed from './json/rejectedDeposits.json';
import withdrawalsSeed from './json/withdrawals.json';
import rejectedWithdrawalsSeed from './json/rejectedWithdrawals.json';
import profitCommissionWithdrawalsSeed from './json/profitCommissionWithdrawals.json';
import internalTransfersSeed from './json/internalTransfers.json';
import creditAdjustmentsSeed from './json/creditAdjustments.json';
import transactionLedgerSeed from './json/transactionLedger.json';
import exportJobsSeed from './json/exportJobs.json';
import kycDocumentsSeed from './json/kycDocuments.json';
import pendingDepositsSeed from './json/pendingDeposits.json';
import pendingWithdrawalsSeed from './json/pendingWithdrawals.json';
import referralTreeSeed from './json/referralTree.json';

const COLLECTIONS = {
  accountLedger: { seed: accountLedgerSeed, storageKey: 'majesty_admin_account_ledger', idKey: 'id' },
  accountTypes: { seed: accountTypesSeed, storageKey: 'majesty_admin_account_types', idKey: 'id' },
  accountStatuses: { seed: accountStatusesSeed, storageKey: 'majesty_admin_account_statuses', idKey: 'id' },
  approvedFollowers: { seed: approvedFollowersSeed, storageKey: 'majesty_admin_approved_followers', idKey: 'id' },
  rejectedFollowers: { seed: rejectedFollowersSeed, storageKey: 'majesty_admin_rejected_followers', idKey: 'id' },
  masters: { seed: mastersSeed, storageKey: 'majesty_admin_masters', idKey: 'id' },
  copyTradingAccounts: { seed: copyTradingAccountsSeed, storageKey: 'majesty_admin_copy_trading_accounts', idKey: 'id' },
  profitSharing: { seed: profitSharingSeed, storageKey: 'majesty_admin_profit_sharing_data', idKey: 'id' },
  dailyInflow: { seed: dailyInflowSeed, storageKey: 'majesty_admin_daily_inflow', idKey: 'id' },
  clients: { seed: clientsSeed, storageKey: 'majesty_admin_clients', idKey: 'id' },
  tradingAccounts: { seed: tradingAccountsSeed, storageKey: 'majesty_admin_trading_accounts_v2', idKey: 'id' },
  ibPartners: { seed: ibPartnersSeed, storageKey: 'majesty_admin_ib_partners', idKey: 'id' },
  ibClients: { seed: ibClientsSeed, storageKey: 'majesty_admin_ib_clients', idKey: 'id' },
  ibWithdrawals: { seed: ibWithdrawalsSeed, storageKey: 'majesty_admin_ib_withdrawals', idKey: 'id' },
  ibRewards: { seed: ibRewardsSeed, storageKey: 'majesty_admin_ib_rewards', idKey: 'id' },
  ibRewardTiers: { seed: ibRewardTiersSeed, storageKey: 'majesty_admin_ib_reward_tiers', idKey: 'tier' },
  ibCommissionHistory: { seed: ibCommissionHistorySeed, storageKey: 'majesty_admin_ib_commission_history', idKey: 'id' },
  commissionTiers: { seed: commissionTiersSeed, storageKey: 'majesty_admin_commission_tiers', idKey: 'id' },
  ibCommissionSettings: { seed: ibCommissionSettingsSeed, storageKey: 'majesty_admin_ib_commission_settings', idKey: 'id' },
  trades: { seed: tradesSeed, storageKey: 'majesty_admin_trades', idKey: 'id' },
  rankTiers: { seed: rankTiersSeed, storageKey: 'majesty_admin_rank_tiers', idKey: 'id' },
  rebateAccounts: { seed: rebateAccountsSeed, storageKey: 'majesty_admin_rebate_accounts', idKey: 'id' },
  ticketsManage: { seed: ticketsManageSeed, storageKey: 'majesty_admin_tickets_manage', idKey: 'id' },
  supportTickets: { seed: supportTicketsSeed, storageKey: 'majesty_admin_support_tickets_v2', idKey: 'id' },
  pammAccounts: { seed: pammAccountsSeed, storageKey: 'majesty_admin_pamm_accounts', idKey: 'id' },
  pammClients: { seed: pammClientsSeed, storageKey: 'majesty_admin_pamm_clients', idKey: 'id' },
  pammCommissions: { seed: pammCommissionsSeed, storageKey: 'majesty_admin_pamm_commissions', idKey: 'id' },
  pammCommissionTiers: { seed: pammCommissionTiersSeed, storageKey: 'majesty_admin_pamm_commission_tiers', idKey: 'id' },
  pammWithdrawals: { seed: pammWithdrawalsSeed, storageKey: 'majesty_admin_pamm_withdrawals', idKey: 'id' },
  paymentMethods: { seed: paymentMethodsSeed, storageKey: 'majesty_admin_payment_methods', idKey: 'id' },
  paymentMethodHistory: { seed: paymentMethodHistorySeed, storageKey: 'majesty_admin_payment_method_history', idKey: 'id' },
  paymentLedger: { seed: paymentLedgerSeed, storageKey: 'majesty_admin_payment_ledger', idKey: 'id' },
  deposits: { seed: depositsSeed, storageKey: 'majesty_admin_deposits', idKey: 'id' },
  manualDeposits: { seed: manualDepositsSeed, storageKey: 'majesty_admin_manual_deposits', idKey: 'id' },
  manualDepositAccounts: { seed: manualDepositAccountsSeed, storageKey: 'majesty_admin_manual_deposit_accounts', idKey: 'login' },
  rejectedDeposits: { seed: rejectedDepositsSeed, storageKey: 'majesty_admin_rejected_deposits', idKey: 'id' },
  withdrawals: { seed: withdrawalsSeed, storageKey: 'majesty_admin_withdraw_history_v2', idKey: 'txId' },
  rejectedWithdrawals: { seed: rejectedWithdrawalsSeed, storageKey: 'majesty_admin_rejected_withdrawals', idKey: 'id' },
  profitCommissionWithdrawals: { seed: profitCommissionWithdrawalsSeed, storageKey: 'majesty_admin_profit_commission_withdrawals', idKey: 'id' },
  internalTransfers: { seed: internalTransfersSeed, storageKey: 'majesty_admin_internal_transfers', idKey: 'id' },
  creditAdjustments: { seed: creditAdjustmentsSeed, storageKey: 'majesty_admin_credit_adjustments', idKey: 'id' },
  transactionLedger: { seed: transactionLedgerSeed, storageKey: 'majesty_admin_transaction_ledger', idKey: 'id' },
  exportJobs: { seed: exportJobsSeed, storageKey: 'majesty_admin_export_jobs', idKey: 'id' },
  kycDocuments: { seed: kycDocumentsSeed, storageKey: 'majesty_admin_kyc_documents', idKey: 'id' },
  pendingDeposits: { seed: pendingDepositsSeed, storageKey: 'majesty_admin_pending_deposits', idKey: 'id' },
  pendingWithdrawals: { seed: pendingWithdrawalsSeed, storageKey: 'majesty_admin_pending_withdrawals', idKey: 'id' },
  referralTree: { seed: referralTreeSeed, storageKey: 'majesty_admin_referral_tree', idKey: 'id' },
};

Object.entries(COLLECTIONS).forEach(([name, def]) => defineCollection(name, def));

export const COLLECTION_NAMES = Object.keys(COLLECTIONS);
