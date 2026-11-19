import AdminPAMMWithdrawalHistory from './AdminPAMMWithdrawalHistory.jsx';

export default function AdminPAMMRejectedWithdrawalHistory() {
  return (
    <AdminPAMMWithdrawalHistory
      initialStatus="Rejected"
      customTitle="PAMM Rejected Withdrawal History"
      customSubtitle="Historical archive of rejected and compliance-flagged PAMM withdrawals"
    />
  );
}
