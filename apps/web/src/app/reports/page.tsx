'use client';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { PieChart, TrendingUp, FileDown, BarChart2, Users, Banknote, Calendar } from 'lucide-react';

const MONTHLY_DATA = [
  { month: 'Oct', apps: 18, disbursed: 12, amount: 42000000 },
  { month: 'Nov', apps: 24, disbursed: 18, amount: 68000000 },
  { month: 'Dec', apps: 19, disbursed: 14, amount: 51000000 },
  { month: 'Jan', apps: 31, disbursed: 22, amount: 87000000 },
  { month: 'Feb', apps: 28, disbursed: 20, amount: 74000000 },
  { month: 'Mar', apps: 36, disbursed: 26, amount: 112000000 },
];

const PRODUCT_MIX = [
  { label: 'Dealer Financing', count: 89, amount: 320000000, pct: 42 },
  { label: 'Working Capital', count: 54, amount: 210000000, pct: 28 },
  { label: 'Invoice Discounting', count: 38, amount: 140000000, pct: 18 },
  { label: 'Channel Financing', count: 22, amount: 95000000, pct: 12 },
];

const ANCHOR_PERF = [
  { name: 'UltraTech Cement', disbursed: 86, amount: 320000000, npa: 0.8 },
  { name: 'ACC Limited', disbursed: 63, amount: 240000000, npa: 1.2 },
  { name: 'Ambuja Cements', disbursed: 41, amount: 155000000, npa: 0.5 },
  { name: 'Shree Cement', disbursed: 33, amount: 128000000, npa: 1.8 },
];

const maxAmount = Math.max(...MONTHLY_DATA.map((d) => d.amount));

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Portfolio performance and business intelligence">
        <Button variant="outline" size="sm"><FileDown className="h-4 w-4" />Export PDF</Button>
        <Button variant="outline" size="sm"><FileDown className="h-4 w-4" />Export Excel</Button>
      </PageHeader>

      {/* Period selector */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-slate-400" />
        <span className="text-sm text-slate-500">Period:</span>
        {['This Month', 'Last Quarter', 'FY 2025-26', 'Custom'].map((p, i) => (
          <button key={p} className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
            i === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>{p}</button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Disbursements" value={formatCurrency(765000000)} sub="FY 2025-26" icon={Banknote} iconColor="text-emerald-600" trend={{ value: '23%', up: true }} />
        <StatCard label="Applications" value="223" sub="FY 2025-26" icon={Users} iconColor="text-indigo-600" trend={{ value: '18%', up: true }} />
        <StatCard label="Approval Rate" value="78%" sub="vs 72% last year" icon={TrendingUp} iconColor="text-teal-600" />
        <StatCard label="Portfolio NPA" value="0.9%" sub="Gross NPA" icon={BarChart2} iconColor="text-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Monthly trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Disbursements</h3>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY_DATA.map((d) => {
              const h = Math.round((d.amount / maxAmount) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">{formatCurrency(d.amount).replace('₹', '').trim()}</span>
                  <div className="w-full relative">
                    <div
                      className="bg-indigo-500 rounded-t-md w-full transition-all"
                      style={{ height: `${h}px` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{d.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-indigo-500" />
              <span className="text-xs text-slate-500">Disbursement Amount</span>
            </div>
          </div>
        </div>

        {/* Product mix */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Product Mix</h3>
          <div className="space-y-3">
            {PRODUCT_MIX.map((p, i) => {
              const colors = ['bg-indigo-500', 'bg-teal-500', 'bg-violet-500', 'bg-amber-500'];
              return (
                <div key={p.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700">{p.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">{p.pct}%</span>
                      <span className="text-xs text-slate-400 ml-2">{formatCurrency(p.amount)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anchor performance */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Anchor-wise Performance</h3>
          <p className="text-xs text-slate-500">FY 2025-26 portfolio breakdown</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Disbursements</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Portfolio Amount</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">NPA %</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ANCHOR_PERF.map((a) => (
              <tr key={a.name} className="hover:bg-slate-50/70">
                <td className="px-5 py-4 font-medium text-slate-900">{a.name}</td>
                <td className="px-4 py-4 text-right text-slate-700">{a.disbursed}</td>
                <td className="px-4 py-4 text-right font-semibold">{formatCurrency(a.amount)}</td>
                <td className={`px-4 py-4 text-right font-bold ${a.npa > 1.5 ? 'text-red-600' : a.npa > 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {a.npa.toFixed(1)}%
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px]">
                      <div
                        className={`h-full rounded-full ${a.npa > 1.5 ? 'bg-red-500' : a.npa > 1 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min((a.npa / 3) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${a.npa > 1.5 ? 'text-red-600' : a.npa > 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {a.npa > 1.5 ? 'Watch' : a.npa > 1 ? 'Monitor' : 'Good'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick report downloads */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Standard Reports</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            'Portfolio Aging Report',
            'Disbursement MIS',
            'NPA & Overdue Report',
            'Product-wise Summary',
            'Anchor Performance Report',
            'Collection Efficiency Report',
          ].map((r) => (
            <button key={r} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors text-left group">
              <PieChart className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
              <span className="text-sm text-slate-700 group-hover:text-indigo-700">{r}</span>
              <FileDown className="h-3.5 w-3.5 text-slate-400 ml-auto shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
