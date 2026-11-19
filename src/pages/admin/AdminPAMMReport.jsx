import { useState } from 'react';
import { PieChart, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function AdminPAMMReport({ title = 'PAMM Portfolio Overview' }) {
  return (
    <div className="space-y-6 sm:space-y-7 w-full min-w-0">
      <div className="relative bg-gradient-to-r from-white via-white to-orange-50/20 rounded-2xl border border-slate-200 p-4 sm:p-5 lg:p-6 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-slate-900">PAMM</span>{' '}
          <span className="text-orange-600">Fund Management</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {title} — Master money managers, fund allocation ratios, investor accounts, and high-water mark fees.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">$125,000.00</div>
            <div className="text-xs font-bold text-slate-700">Total PAMM AUM</div>
            <div className="text-[11px] text-slate-400">Assets Under Management</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">+18.4%</div>
            <div className="text-xs font-bold text-slate-700">Monthly Yield</div>
            <div className="text-[11px] text-slate-400">Master Alpha Strategy</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">42 Investors</div>
            <div className="text-xs font-bold text-slate-700">Active Subscribed Pools</div>
            <div className="text-[11px] text-slate-400">Managed Allocations</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
        PAMM master pools and investor profit split reconciliation are monitored automatically by MT5 Manager API.
      </div>
    </div>
  );
}
