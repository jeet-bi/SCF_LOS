'use client';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { RefreshCcw, AlertTriangle, CheckCircle2, Clock, Phone, Mail } from 'lucide-react';

const MOCK_OVERDUE = [
  { id: 'o1', borrower: 'Shivam Infra Supplies', appNo: 'APP-2025-0089', amount: 7100000, overdueDays: 30, emi: 280000, anchor: 'ACC Limited', rm: 'Priya Sharma', phone: '9820111222' },
  { id: 'o2', borrower: 'MH Cement Distributors', appNo: 'APP-2025-0112', amount: 5800000, overdueDays: 45, emi: 220000, anchor: 'UltraTech', rm: 'Amit Patel', phone: '9022334455' },
  { id: 'o3', borrower: 'Star Traders Pvt Ltd', appNo: 'APP-2025-0056', amount: 3200000, overdueDays: 15, emi: 150000, anchor: 'Ambuja', rm: 'Kavita Singh', phone: '7890556677' },
  { id: 'o4', borrower: 'Vijay Construction Materials', appNo: 'APP-2025-0134', amount: 9500000, overdueDays: 60, emi: 380000, anchor: 'ACC Limited', rm: 'Priya Sharma', phone: '9414778899' },
];

const MOCK_UPCOMING = [
  { id: 'u1', borrower: 'Kumar Cement Traders', appNo: 'APP-2025-0077', amount: 1800000, dueInDays: 3, emi: 90000 },
  { id: 'u2', borrower: 'Rajesh Building Materials', appNo: 'APP-2025-0041', amount: 3200000, dueInDays: 5, emi: 130000 },
  { id: 'u3', borrower: 'Patil Construction', appNo: 'APP-2025-0098', amount: 400000, dueInDays: 7, emi: 42000 },
];

function DpdBadge({ days }: { days: number }) {
  const color = days >= 60 ? 'bg-red-100 text-red-700' : days >= 30 ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>DPD {days}</span>;
}

export default function CollectionsPage() {
  const totalOverdue = MOCK_OVERDUE.reduce((s, o) => s + o.amount, 0);
  const totalOverdueEmi = MOCK_OVERDUE.reduce((s, o) => s + o.emi, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Collections" subtitle="Monitor repayments and manage overdue accounts">
        <Button variant="outline" size="sm">Export</Button>
      </PageHeader>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Overdue Accounts" value={MOCK_OVERDUE.length} sub={formatCurrency(totalOverdue)} icon={AlertTriangle} iconColor="text-red-500" />
        <StatCard label="Overdue EMIs" value={formatCurrency(totalOverdueEmi)} sub="Pending collection" icon={RefreshCcw} iconColor="text-orange-500" />
        <StatCard label="Due in 7 Days" value={MOCK_UPCOMING.length} sub="Proactive follow-up" icon={Clock} iconColor="text-amber-500" />
        <StatCard label="Collections MTD" value={formatCurrency(14500000)} sub="Month to date" icon={CheckCircle2} iconColor="text-emerald-600" />
      </div>

      {/* Overdue */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Overdue Accounts</h3>
            <p className="text-xs text-slate-500">Loans with missed repayments</p>
          </div>
          <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{MOCK_OVERDUE.length}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Borrower</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Outstanding</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Overdue EMI</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">DPD</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">RM</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_OVERDUE.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-900">{o.borrower}</p>
                  <p className="text-xs text-slate-400 font-mono">{o.appNo}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-600 text-sm">{o.anchor}</td>
                <td className="px-4 py-3.5 text-right font-semibold">{formatCurrency(o.amount)}</td>
                <td className="px-4 py-3.5 text-right font-semibold text-red-600">{formatCurrency(o.emi)}</td>
                <td className="px-4 py-3.5"><DpdBadge days={o.overdueDays} /></td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-slate-700">{o.rm}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <a href={`tel:${o.phone}`} className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center" title="Call">
                      <Phone className="h-3.5 w-3.5 text-slate-600" />
                    </a>
                    <button className="w-7 h-7 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center" title="Email">
                      <Mail className="h-3.5 w-3.5 text-slate-600" />
                    </button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Collect</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming dues */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Upcoming Dues (Next 7 Days)</h3>
          <p className="text-xs text-slate-500">Proactive collection opportunities</p>
        </div>
        <div className="divide-y divide-slate-50">
          {MOCK_UPCOMING.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                u.dueInDays <= 3 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {u.dueInDays}d
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-800">{u.borrower}</p>
                <p className="text-xs text-slate-400 font-mono">{u.appNo}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatCurrency(u.emi)}</p>
                <p className="text-xs text-slate-400">Outstanding: {formatCurrency(u.amount)}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">Send Reminder</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
