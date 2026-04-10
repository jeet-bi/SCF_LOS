'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { useCreditLines } from '@/hooks/useCreditLines';
import { useInvoices, type Invoice, type InvoiceStatus } from '@/hooks/useInvoices';
import Link from 'next/link';
import {
  Banknote, CheckCircle2, Clock, AlertTriangle, RefreshCw,
  Search, FileText, AlertCircle, XCircle,
  Zap, ShieldCheck, ArrowUpRight, Building2, X,
  Package, Calendar, Hash, TrendingUp, Receipt,
} from 'lucide-react';

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_META: Record<InvoiceStatus, { label: string; color: string; dot: string }> = {
  PENDING_VERIFICATION: { label: 'Pending Verification', color: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-500' },
  AUTO_APPROVED:        { label: 'Auto Approved',        color: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500' },
  MANUAL_REVIEW:        { label: 'Manual Review',        color: 'bg-orange-100 text-orange-700',  dot: 'bg-orange-500' },
  REJECTED:             { label: 'Rejected',             color: 'bg-red-100 text-red-700',        dot: 'bg-red-500' },
  DISBURSED:            { label: 'Disbursed',            color: 'bg-emerald-100 text-emerald-700',dot: 'bg-emerald-500' },
  REPAID:               { label: 'Repaid',               color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400' },
};

const FLAG_LABELS: Record<string, { label: string; color: string }> = {
  AMOUNT_MISMATCH:     { label: 'Amount Mismatch',     color: 'bg-red-50 text-red-700 border-red-100' },
  DUPLICATE:           { label: 'Duplicate Invoice',   color: 'bg-red-50 text-red-700 border-red-100' },
  BUYER_NOT_FOUND:     { label: 'Buyer Not Found',     color: 'bg-orange-50 text-orange-700 border-orange-100' },
  LIMIT_EXCEEDED:      { label: 'Limit Exceeded',      color: 'bg-orange-50 text-orange-700 border-orange-100' },
  SUSPICIOUS_PATTERN:  { label: 'Suspicious Pattern',  color: 'bg-orange-50 text-orange-700 border-orange-100' },
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ─── Invoice Detail Modal ──────────────────────────────────────────────────────

function InvoiceModal({
  invoice,
  open,
  onClose,
}: {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
}) {
  const [verifying, setVerifying] = useState(false);
  const [disbursing, setDisbursing] = useState(false);
  const [done, setDone] = useState<'verified' | 'rejected' | 'disbursed' | null>(null);

  if (!invoice) return null;

  const canVerify   = invoice.status === 'PENDING_VERIFICATION';
  const canApprove  = invoice.status === 'MANUAL_REVIEW';
  const canDisburse = invoice.status === 'AUTO_APPROVED';
  const isActionable = canVerify || canApprove || canDisburse;

  const handleVerify = async () => {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    setVerifying(false);
    setDone('verified');
  };

  const handleReject = () => setDone('rejected');

  const handleDisburse = async () => {
    setDisbursing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDisbursing(false);
    setDone('disbursed');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setDone(null); } }}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">

        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          done === 'verified'  ? 'bg-emerald-50 border-emerald-100' :
          done === 'rejected'  ? 'bg-red-50 border-red-100' :
          done === 'disbursed' ? 'bg-indigo-50 border-indigo-100' :
          invoice.flags.length ? 'bg-orange-50 border-orange-100' :
          'bg-white border-slate-100'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="h-4 w-4 text-slate-500" />
                <span className="font-mono text-sm font-semibold text-slate-800">{invoice.invoiceNo}</span>
                {invoice.autoVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">
                    <Zap className="h-2.5 w-2.5" />AUTO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{invoice.businessName} · {invoice.anchorName}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {done ? (
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  done === 'verified'  ? 'bg-emerald-100 text-emerald-700' :
                  done === 'rejected'  ? 'bg-red-100 text-red-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {done === 'verified' ? '✓ Verified & Approved' : done === 'rejected' ? '✗ Rejected' : '✓ Disbursed'}
                </span>
              ) : (
                <StatusBadge status={invoice.status} />
              )}
            </div>
          </div>

          {/* Flags */}
          {invoice.flags.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              {invoice.flags.map((f) => {
                const meta = FLAG_LABELS[f];
                return (
                  <span key={f} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.color}`}>
                    {meta.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">

          {/* Amount hero */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">Invoice Amount</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(invoice.invoiceAmount)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">Interest (est.)</p>
              <p className="text-2xl font-bold text-indigo-600">
                {invoice.interestAmount ? formatCurrency(invoice.interestAmount) : '—'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-1">Tenor</p>
              <p className="text-2xl font-bold text-slate-900">{invoice.tenor} days</p>
            </div>
          </div>

          {/* Invoice details grid */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Invoice Details</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { icon: Calendar,   label: 'Invoice Date',  value: formatDate(invoice.invoiceDate) },
                { icon: Calendar,   label: 'Due Date',      value: formatDate(invoice.dueDate) },
                { icon: Hash,       label: 'PO Number',     value: invoice.poNumber || '—', mono: true },
                { icon: Package,    label: 'Goods',         value: invoice.goodsDescription },
                { icon: Building2,  label: 'Anchor / Supplier', value: invoice.anchorName },
                { icon: TrendingUp, label: 'Credit Line ID', value: invoice.creditLineId, mono: true },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">{label}</p>
                    <p className={`text-sm font-medium text-slate-800 truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {(invoice.disbursedAt || invoice.repaidAt) && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Timeline</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                  <p className="text-xs text-slate-600">Received — {formatDateTime(invoice.invoiceDate)}</p>
                </div>
                {invoice.disbursedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-xs text-slate-600">Disbursed — {formatDateTime(invoice.disbursedAt)}</p>
                  </div>
                )}
                {invoice.repaidAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <p className="text-xs text-slate-600">Repaid — {formatDateTime(invoice.repaidAt)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Review / rejection notes */}
          {invoice.reviewNote && (
            <div className="flex items-start gap-2.5 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-orange-800 mb-0.5">Review Note</p>
                <p className="text-xs text-orange-700">{invoice.reviewNote}</p>
              </div>
            </div>
          )}

          {invoice.rejectionReason && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-red-800 mb-0.5">Rejection Reason</p>
                <p className="text-xs text-red-700">{invoice.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Success state */}
          {done === 'verified' && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Invoice Verified & Approved</p>
                <p className="text-xs text-emerald-600 mt-0.5">Funds will be disbursed to borrower's account within 2 hours.</p>
              </div>
            </div>
          )}
          {done === 'disbursed' && (
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-4">
              <Banknote className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-800">Disbursement Initiated</p>
                <p className="text-xs text-indigo-600 mt-0.5">{formatCurrency(invoice.invoiceAmount)} will be credited to {invoice.businessName}'s account.</p>
              </div>
            </div>
          )}
          {done === 'rejected' && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-4">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">Invoice Rejected</p>
                <p className="text-xs text-red-600 mt-0.5">Borrower and anchor will be notified. Invoice has been logged.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {isActionable && !done && (
          <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${
            invoice.flags.length ? 'bg-orange-50/50 border-orange-100' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="text-xs text-slate-400">
              {canVerify && 'Run system checks and approve disbursement'}
              {canApprove && 'Override flags and manually approve this invoice'}
              {canDisburse && 'Transfer funds to borrower account now'}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleReject}
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>

              {(canVerify || canApprove) && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 min-w-[140px]"
                  onClick={handleVerify}
                  disabled={verifying}
                >
                  {verifying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {canVerify ? 'Verify & Approve' : 'Approve Invoice'}
                    </>
                  )}
                </Button>
              )}

              {canDisburse && (
                <Button
                  size="sm"
                  className="min-w-[140px]"
                  onClick={handleDisburse}
                  disabled={disbursing}
                >
                  {disbursing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    <>
                      <Banknote className="h-3.5 w-3.5" />
                      Disburse {formatCurrency(invoice.invoiceAmount)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {done && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => { onClose(); setDone(null); }}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Invoice Row ───────────────────────────────────────────────────────────────

function InvoiceRow({ invoice, onOpen }: { invoice: Invoice; onOpen: () => void }) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 cursor-pointer group transition-colors"
      onClick={onOpen}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
        invoice.flags.length ? 'bg-orange-100' : 'bg-slate-100'
      }`}>
        <FileText className={`h-4 w-4 ${invoice.flags.length ? 'text-orange-500' : 'text-slate-500'}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-900 font-mono">{invoice.invoiceNo}</p>
          {invoice.autoVerified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              <Zap className="h-2.5 w-2.5" />AUTO
            </span>
          )}
          {invoice.flags.map((f) => (
            <span key={f} className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${FLAG_LABELS[f]?.color}`}>
              {FLAG_LABELS[f]?.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {invoice.businessName} · {invoice.anchorName} · {invoice.goodsDescription}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-semibold text-slate-900">{formatCurrency(invoice.invoiceAmount)}</p>
        <p className="text-xs text-slate-400">{invoice.tenor}d tenor · Due {formatDate(invoice.dueDate)}</p>
      </div>

      <StatusBadge status={invoice.status} />

      <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0 whitespace-nowrap">
        View details →
      </span>
    </div>
  );
}

// ─── Utilization bar ──────────────────────────────────────────────────────────

function UtilizationBar({ used, total }: { used: number; total: number }) {
  const pct = Math.round((used / total) * 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">Utilized</span>
        <span className={`text-xs font-bold ${pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DisbursementPage() {
  const { data: creditLines } = useCreditLines();
  const { data: allInvoices } = useInvoices();
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const pending     = allInvoices.filter((i) => i.status === 'PENDING_VERIFICATION');
  const autoApproved = allInvoices.filter((i) => i.status === 'AUTO_APPROVED');
  const manual      = allInvoices.filter((i) => i.status === 'MANUAL_REVIEW');
  const rejected    = allInvoices.filter((i) => i.status === 'REJECTED');
  const disbursed   = allInvoices.filter((i) => i.status === 'DISBURSED' || i.status === 'REPAID');

  const totalDisbursedToday = allInvoices
    .filter((i) => i.disbursedAt?.startsWith('2026-04-0'))
    .reduce((s, i) => s + i.invoiceAmount, 0);

  const filteredLines = creditLines.filter((cl) =>
    cl.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
    cl.businessName.toLowerCase().includes(search.toLowerCase()) ||
    cl.anchorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Disbursement" subtitle="Invoice-based SCF disbursement pipeline">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />Sync ERP
        </Button>
        <Button variant="outline" size="sm">Export</Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Pending Verification" value={pending.length + autoApproved.length} sub={`${autoApproved.length} auto-approved`} icon={Clock} iconColor="text-amber-500" />
        <StatCard label="Manual Review" value={manual.length} sub="Flagged invoices" icon={AlertTriangle} iconColor="text-orange-500" />
        <StatCard label="Disbursed Today" value={formatCurrency(totalDisbursedToday)} sub={`${allInvoices.filter((i) => i.disbursedAt?.startsWith('2026-04-0')).length} invoices`} icon={Banknote} iconColor="text-emerald-600" />
        <StatCard label="Active Credit Lines" value={creditLines.filter((cl) => cl.status === 'ACTIVATED').length} sub={formatCurrency(creditLines.reduce((s, cl) => s + cl.sanctionedLimit, 0)) + ' total limit'} icon={ShieldCheck} iconColor="text-indigo-600" />
      </div>

      <Tabs defaultValue="creditlines">
        <TabsList>
          <TabsTrigger value="invoices">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Invoice Queue
            {(pending.length + autoApproved.length + manual.length) > 0 && (
              <span className="ml-1.5 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                {pending.length + autoApproved.length + manual.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="creditlines">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            Credit Lines
          </TabsTrigger>
          <TabsTrigger value="history">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Disbursed / Repaid
          </TabsTrigger>
        </TabsList>

        {/* ── Invoice Queue ── */}
        <TabsContent value="invoices" className="mt-4 space-y-4">

          {autoApproved.length > 0 && (
            <div className="bg-white rounded-xl border border-indigo-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-indigo-100 bg-indigo-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-indigo-900">Ready to Disburse</h3>
                  <span className="text-xs font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">{autoApproved.length}</span>
                </div>
                <Button size="sm" className="h-7 text-xs">
                  <Banknote className="h-3 w-3" />
                  Disburse All ({formatCurrency(autoApproved.reduce((s, i) => s + i.invoiceAmount, 0))})
                </Button>
              </div>
              <div className="divide-y divide-slate-50">
                {autoApproved.map((inv) => (
                  <InvoiceRow key={inv.id} invoice={inv} onOpen={() => setSelectedInvoice(inv)} />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Pending Verification</h3>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{pending.length}</span>
              </div>
              <p className="text-xs text-slate-400">Click any row to review and verify</p>
            </div>
            {pending.length ? (
              <div className="divide-y divide-slate-50">
                {pending.map((inv) => (
                  <InvoiceRow key={inv.id} invoice={inv} onOpen={() => setSelectedInvoice(inv)} />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm">No invoices pending verification</div>
            )}
          </div>

          {manual.length > 0 && (
            <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-orange-100 bg-orange-50/40 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-orange-900">Manual Review Required</h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">{manual.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {manual.map((inv) => (
                  <InvoiceRow key={inv.id} invoice={inv} onOpen={() => setSelectedInvoice(inv)} />
                ))}
              </div>
            </div>
          )}

          {rejected.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                <h3 className="text-sm font-semibold text-slate-700">Rejected</h3>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">{rejected.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {rejected.map((inv) => (
                  <InvoiceRow key={inv.id} invoice={inv} onOpen={() => setSelectedInvoice(inv)} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Credit Lines ── */}
        <TabsContent value="creditlines" className="mt-4">
          <div className="mb-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search borrower, anchor…"
              className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-3">
            {filteredLines.map((cl) => (
              <div key={cl.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-indigo-600">{cl.borrowerName[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{cl.borrowerName}</p>
                      <p className="text-xs text-slate-500">{cl.businessName} · <span className="font-mono">{cl.applicationNumber}</span></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">ACTIVATED</span>
                    <p className="text-xs text-slate-400 mt-1">{cl.anchorName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Sanctioned Limit</p>
                    <p className="font-bold text-slate-900">{formatCurrency(cl.sanctionedLimit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Utilized</p>
                    <p className="font-bold text-slate-900">{formatCurrency(cl.utilizedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Available</p>
                    <p className={`font-bold ${cl.availableLimit < cl.sanctionedLimit * 0.1 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {formatCurrency(cl.availableLimit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">ROI / Tenor</p>
                    <p className="font-bold text-slate-900">{cl.roi}% / {cl.tenorDays}d</p>
                  </div>
                </div>
                <UtilizationBar used={cl.utilizedAmount} total={cl.sanctionedLimit} />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{cl.totalInvoices} invoices</span>
                    <span>Disbursed: {formatCurrency(cl.totalDisbursed)}</span>
                    {cl.overdueAmount > 0 && (
                      <span className="text-red-600 font-medium">Overdue: {formatCurrency(cl.overdueAmount)}</span>
                    )}
                    <span>Score: <span className="font-medium text-slate-700">{cl.creditScore}</span></span>
                    <span className={`font-medium ${cl.riskLevel === 'LOW' ? 'text-emerald-600' : cl.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-red-600'}`}>
                      {cl.riskLevel} RISK
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/disbursement/lines/${cl.id}`}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">View Invoices</Button>
                    </Link>
                    <Link href={`/disbursement/lines/${cl.id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <ArrowUpRight className="h-3 w-3" />Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── History ── */}
        <TabsContent value="history" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Disbursed & Repaid Invoices</h3>
              <Button size="sm" variant="outline" className="text-xs h-7">Export</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Invoice</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Borrower</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Interest</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {disbursed.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/70 cursor-pointer"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-700">{inv.invoiceNo}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-900 text-xs">{inv.borrowerName}</p>
                      <p className="text-[11px] text-slate-400">{inv.businessName}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">{inv.anchorName}</td>
                    <td className="px-4 py-3.5 text-right font-semibold text-emerald-700">{formatCurrency(inv.invoiceAmount)}</td>
                    <td className="px-4 py-3.5 text-right text-xs text-slate-600">
                      {inv.interestAmount ? formatCurrency(inv.interestAmount) : '—'}
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {inv.repaidAt ? formatDate(inv.repaidAt) : inv.disbursedAt ? formatDate(inv.disbursedAt) : '—'}
                    </td>
                  </tr>
                ))}
                {!disbursed.length && (
                  <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">No disbursements yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Global invoice modal */}
      <InvoiceModal
        invoice={selectedInvoice}
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
