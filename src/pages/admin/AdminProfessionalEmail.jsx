import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { initialClients } from '../../data/adminData.js';

export default function AdminProfessionalEmail() {
  const [recipientGroup, setRecipientGroup] = useState('clients');
  const [subject, setSubject] = useState('Important Update: Majesty FX Demo Sandbox MT5 Upgrades');
  const [body, setBody] = useState(`Dear {{client_name}},

We are pleased to inform you that your Majesty FX demo trading account (Login: {{mt5_account}}) has been upgraded with improved MT5 execution speed and reduced latency across all major currency pairs.

Account Details:
- MT5 Account: {{mt5_account}}
- Server: {{server}}
- Status: Active

If you have any questions or require support, please contact your account manager or reply to this email.

Best regards,
The Majesty FX Support Desk`);

  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const recipientCount = recipientGroup === 'clients' ? 7 : recipientGroup === 'ib' ? 3 : 10;

  const handleInsertToken = (token) => {
    setBody((prev) => prev + ` {{${token}}}`);
  };

  const handleSend = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
          <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
            <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
              <span className="text-slate-900 font-extrabold">Email Campaign</span>{' '}
              <span className="inline-block font-black text-orange-600 tracking-tight">Manager</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
              Broadcast personalized announcements, MT5 account notices, and marketing campaigns
            </p>
          </div>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Email broadcast queued and dispatched to {recipientCount} recipients successfully!</span>
        </div>
      )}

      {/* Main Composer Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <form onSubmit={handleSend} className="space-y-4 text-xs">
            {/* Recipient selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Select Recipients...
              </label>
              <select
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              >
                <option value="clients">All Referral Clients (7 recipients)</option>
                <option value="ib">All Active IB Partners (3 recipients)</option>
                <option value="all">Entire Network Database (10 recipients)</option>
              </select>
            </div>

            {/* Email Subject */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Merge Tokens */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                Dynamic Merge Tags (Click to insert):
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {['client_name', 'mt5_account', 'server', 'balance'].map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => handleInsertToken(token)}
                    className="px-2.5 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-mono text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    +{`{{${token}}}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Message Body
              </label>
              <textarea
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending Broadcast...' : `Send Email (${recipientCount})`}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recipients Preview Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-sora font-extrabold text-sm text-slate-900">
              Target Audience Preview
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700">
              {recipientCount} recipients
            </span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {initialClients.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">{c.fullName}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">{c.email}</div>
                </div>
                <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                  #{c.tradingAccounts[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
