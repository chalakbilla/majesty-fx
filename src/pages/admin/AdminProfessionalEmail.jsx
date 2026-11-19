import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Send, CheckCircle2 } from 'lucide-react';

export default function AdminProfessionalEmail() {
  const [recipient, setRecipient] = useState('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const getRecipientCount = () => {
    switch (recipient) {
      case 'all': return 7;
      case 'verified': return 5;
      case 'unverified': return 2;
      case 'active_traders': return 4;
      case 'ib': return 3;
      default: return 7;
    }
  };

  const count = getRecipientCount();

  const handleSend = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 4000);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-200">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-orange-100/50 rounded-full blur-3xl -z-10 hidden sm:block"
        />
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto pb-0.5 scrollbar-none">
            <Link className="hover:text-slate-900 text-slate-500 transition-colors whitespace-nowrap" to="/admin/demo">
              Admin Console
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0 mx-0.5" />
            <span className="whitespace-nowrap text-slate-800 font-semibold">Professional Email</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5 lg:gap-6">
            <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <h1 className="page-title text-[1.375rem] sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-extrabold tracking-tight leading-tight">
                  <span className="text-slate-900 font-extrabold" style={{ color: 'rgb(15, 23, 42)' }}>
                    Email Campaign
                  </span>{' '}
                  <span className="inline-block font-black text-orange-600 tracking-tight" style={{ color: 'rgb(234, 88, 12)' }}>
                    Manager
                  </span>
                </h1>
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-3xl">
                Compose and dispatch professional announcements, compliance alerts, and updates to REFERRAL clients.
              </div>
            </div>
          </div>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Email successfully dispatched to {count} recipient(s)!</span>
        </div>
      )}

      {/* Form Container (Exact 820px matching Next.js export) */}
      <div style={{ maxWidth: '820px', width: '100%', margin: '0px auto' }}>
        <form
          onSubmit={handleSend}
          style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 232, 240)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 4px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'rgb(71, 85, 105)',
                marginBottom: '0.45rem',
              }}
            >
              Select Recipients...
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid rgb(226, 232, 240)',
                borderRadius: '10px',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(30, 41, 59)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All REFERRAL Clients (7)</option>
              <option value="verified">REFERRAL KYC Verified Clients Only</option>
              <option value="unverified">REFERRAL KYC Unverified Clients Only</option>
              <option value="active_traders">REFERRAL Active MT5 Traders Only</option>
              <option value="ib">REFERRAL Partner Affiliates</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'rgb(71, 85, 105)',
                marginBottom: '0.45rem',
              }}
            >
              Email Subject
            </label>
            <input
              placeholder="Email Subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid rgb(226, 232, 240)',
                borderRadius: '10px',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(30, 41, 59)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'rgb(71, 85, 105)',
                marginBottom: '0.45rem',
              }}
            >
              Message Body
            </label>
            <textarea
              rows={9}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                fontSize: '0.875rem',
                border: '1px solid rgb(226, 232, 240)',
                borderRadius: '10px',
                backgroundColor: 'rgb(255, 255, 255)',
                color: 'rgb(30, 41, 59)',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            style={{
              width: '100%',
              backgroundColor: 'rgb(29, 78, 216)',
              color: 'rgb(255, 255, 255)',
              fontSize: '0.925rem',
              fontWeight: 700,
              padding: '0.85rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: 'rgba(29, 78, 216, 0.25) 0px 4px 12px',
              transition: '0.2s',
              marginTop: '0.5rem',
              opacity: sending ? 0.7 : 1,
            }}
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'Sending...' : `Send Email (${count})`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
