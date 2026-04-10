'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCreditLine } from '@/hooks/useCreditLines';
import { useInvoices } from '@/hooks/useInvoices';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import {
  ArrowLeft, ShieldCheck, FileText, Clock, CheckCircle2,
  Phone, Banknote, AlertTriangle, Zap,
} from 'lucide-react';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 gap-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value ?? '—'}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_VERIFICATION: 'bg-amber-100 text-amber-700',
    AUTO_APPROVED: 'bg-indigo-100 text-indigo-700',
    MANUAL_REVIEW: 'bg-orange-100 text-orange-700',
    REJECTED: 'bg-red-100 text-red-700',
    DISBURSED: 'bg-emerald-100 text-emerald-700',
    REPAID: 'bg-slate-100 text-slate-600',
  };
  const labels: Record<string, string> = {
    PENDING_VERIFICATION: 'Pending',
    AUTO_APPROVED: 'Auto Approved',
    MANUAL_REVIEW: 'Manual Review',
    REJECTED: 'Rejected',
    DISBURSED: 'Disbursed',
    REPAID: 'Repaid',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
      {labels[status] || status}
    </span>
  );
}

export default function CreditLineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: cl } = useCreditLine(id);
  const { data: invoices } = useInvoices({ creditLineId: id });

  if (!cl) {
    return <div className="p-6 text-slate-400 text-sm">Credit line not found.</div>;
  }

  const utilPct = Math.round((cl.utilizedAmount / cl.sanctionedLimit) * 100);
  const barColor = utilPct >= 90 ? 'bg-red-500' : utilPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';

  const activeInvoices = invoices.filter((i) => ['DISBURSED', 'AUTO_APPROVED'].includes(i.status));
  const pendingInvoices = invoices.filter((i) => ['PENDING_VERIFICATION', 'MANUAL_REVIEW'].includes(i.status));
  const closedInvoices = invoices.filter((i) => ['REPAID', 'REJECTED'].includes(i.status));

  const riskColor = cl.riskLevel === 'LOW'
    ? 'text-emerald-600 bg-emerald-100'
    : cl.riskLevel === 'MEDIUM'
    ? 'text-amber-600 bg-amber-100'
    : 'text-red-600 bg-red-100';

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <Link href="/disbursement" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Disbursement
        </Link>
        <PageHeader title={cl.borrowerName} subtitle={`${cl.businessName} · ${cl.applicationNumber}`}>
          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />ACTIVATED
          </span>
          <Button size="sm"><Banknote className="h-4 w-4" />New Disbursement</Button>
        </PageHeader>
      </div>

      {/* Limit utilization */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="grid grid-cols-4 gap-6 mb-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">Sanctioned Limit</p>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(cl.sanctionedLimit)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Utilized</p>
            <p className="text-2xl font-bold text-slate-700">{formatCurrency(cl.utilizedAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Available</p>
            <p className={`text-2xl font-bold ${utilPct >= 90 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatCurrency(cl.availableLimit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Utilization</p>
            <p className={`text-2xl font-bold ${utilPct >= 90 ? 'text-red-600' : utilPct >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {utilPct}%
            </p>
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${utilPct}%` }} />
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">ROI</p>
          <p className="text-xl font-bold text-slate-900">{cl.roi}% p.a.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Tenor</p>
          <p className="text-xl font-bold text-slate-900">{cl.tenorDays} days</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Credit Score</p>
          <p className={`text-xl font-bold ${cl.creditScore >= 700 ? 'text-emerald-600' : cl.creditScore >= 600 ? 'text-amber-600' : 'text-red-600'}`}>
            {cl.creditScore}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Risk Level</p>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${riskColor}`}>{cl.riskLevel}</span>
        </div>
      </div>

      {cl.overdueAmount > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-800">
            <span className="font-semibold">{formatCurrency(cl.overdueAmount)}</span> overdue — immediate collection required.
          </p>
          <Button size="sm" variant="outline" className="ml-auto text-xs h-7 text-red-600 border-red-200">
            View Overdue
          </Button>
        </div>
      )}

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Invoices ({invoices.length})
          </TabsTrigger>
          <TabsTrigger value="details">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            Facility Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4 space-y-4">
          {/* Active disbursements */}
          {activeInvoices.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Active Disbursements</h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{activeInvoices.length}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Invoice No.</th>
                    <th className="text-right px-4 py-3">Amount</th>
                    <th className="text-right px-4 py-3">Interest</th>
                    <th className="text-left px-4 py-3">Due Date</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-xs text-slate-700">{inv.invoiceNo}</p>
                          {inv.autoVerified && <Zap className="h-3 w-3 text-indigo-500" />}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{inv.goodsDescription}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-emerald-700">{formatCurrency(inv.invoiceAmount)}</td>
                      <td className="px-4 py-3.5 text-right text-slate-600 text-xs">
                        {inv.interestAmount ? formatCurrency(inv.interestAmount) : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">{formatDate(inv.dueDate)}</td>
                      <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending */}
          {pendingInvoices.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-900">Pending</h3>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{pendingInvoices.length}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Invoice No.</th>
                    <th className="text-right px-4 py-3">Amount</th>
                    <th className="text-left px-4 py-3">Flags</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs text-slate-700">{inv.invoiceNo}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{inv.goodsDescription}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold">{formatCurrency(inv.invoiceAmount)}</td>
                      <td className="px-4 py-3.5">
                        {inv.flags.length ? (
                          <div className="flex flex-wrap gap-1">
                            {inv.flags.map((f) => (
                              <span key={f} className="text-[10px] bg-orange-50 text-orange-700 border border-orange-100 px-1.5 py-0.5 rounded">{f.replace(/_/g, ' ')}</span>
                            ))}
                          </div>
                        ) : <span className="text-xs text-slate-400">None</span>}
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3.5">
                        <Link href="/disbursement" className="text-xs text-indigo-600 hover:underline">Review</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* History */}
          {closedInvoices.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-700">Closed Invoices</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-5 py-3">Invoice No.</th>
                    <th className="text-right px-4 py-3">Amount</th>
                    <th className="text-right px-4 py-3">Interest</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {closedInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <p className="font-mono text-xs text-slate-700">{inv.invoiceNo}</p>
                        <p className="text-[11px] text-slate-400">{inv.goodsDescription}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium">{formatCurrency(inv.invoiceAmount)}</td>
                      <td className="px-4 py-3.5 text-right text-xs text-slate-500">
                        {inv.interestAmount ? formatCurrency(inv.interestAmount) : '—'}
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">
                        {inv.repaidAt ? formatDate(inv.repaidAt) : inv.disbursedAt ? formatDate(inv.disbursedAt) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Facility Terms</h3>
              <DetailRow label="Product Type" value={cl.productType.replace(/_/g, ' ')} />
              <DetailRow label="Anchor / Program" value={<span className="text-right">{cl.anchorName}<br /><span className="text-xs text-slate-400">{cl.programName}</span></span>} />
              <DetailRow label="Sanctioned Limit" value={formatCurrency(cl.sanctionedLimit)} />
              <DetailRow label="Rate of Interest" value={`${cl.roi}% p.a.`} />
              <DetailRow label="Tenor" value={`${cl.tenorDays} days`} />
              <DetailRow label="Activated On" value={formatDate(cl.activatedAt)} />
              <DetailRow label="Expires On" value={formatDate(cl.expiresAt)} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Disbursement Account</h3>
              <DetailRow label="Bank" value={cl.disbursementAccount.bank} />
              <DetailRow label="Account No." value={<span className="font-mono">{cl.disbursementAccount.accountNo}</span>} />
              <DetailRow label="IFSC" value={<span className="font-mono">{cl.disbursementAccount.ifsc}</span>} />
              <div className="pt-4 mt-2 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Contact</h4>
                <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`tel:${cl.mobile}`} className="hover:text-indigo-600">{cl.mobile}</a>
                </div>
                <DetailRow label="PAN" value={<span className="font-mono text-xs">{cl.pan}</span>} />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Portfolio Summary</h3>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Total Invoices</p>
                  <p className="text-2xl font-bold text-slate-900">{cl.totalInvoices}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Total Disbursed</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(cl.totalDisbursed)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Overdue Amount</p>
                  <p className={`text-2xl font-bold ${cl.overdueAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {cl.overdueAmount > 0 ? formatCurrency(cl.overdueAmount) : 'Nil'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Credit Score</p>
                  <p className={`text-2xl font-bold ${cl.creditScore >= 700 ? 'text-emerald-600' : cl.creditScore >= 600 ? 'text-amber-600' : 'text-red-600'}`}>
                    {cl.creditScore}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
