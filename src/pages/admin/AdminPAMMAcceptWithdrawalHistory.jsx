import AdminPAMMWithdrawalHistory from './AdminPAMMWithdrawalHistory.jsx';

export default function AdminPAMMAcceptWithdrawalHistory() {
  return (
    <AdminPAMMWithdrawalHistory
      initialStatus="Completed"
      customTitle="PAMM Accepted Withdrawal History"
      customSubtitle="Historical archive of successfully approved and processed PAMM withdrawals"
    />
  );
}
