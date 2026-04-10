'use client';

import { useMockLeads } from '@/hooks/useMockLeads';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { LeadStatusBadge } from '@/components/lead-status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, FileText, ChevronRight } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  LOW:    'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH:   'bg-red-100 text-red-700',
};

const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'A':  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'B+': 'bg-amber-100 text-amber-700 border-amber-200',
  'B':  'bg-amber-50 text-amber-600 border-amber-100',
  'C':  'bg-orange-100 text-orange-700 border-orange-200',
  'D':  'bg-red-100 text-red-700 border-red-200',
};

export default function CamPage() {
  const { data: allLeads } = useMockLeads();

  const camLeads  = allLeads.filter((l) => ['CAM_GENERATED', 'APPROVED', 'REJECTED'].includes(l.status));
  const pending   = camLeads.filter((l) => l.status === 'CAM_GENERATED');
  const approved  = camLeads.filter((l) => l.status === 'APPROVED');
  const rejected  = camLeads.filter((l) => l.status === 'REJECTED');
  const approvalRate = camLeads.length ? Math.round((approved.length / camLeads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Credit Appraisal (CAM)" subtitle="Review and sanction credit appraisal memos" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Pending Sanction" value={pending.length}  sub="CAMs ready for review" icon={Clock}         iconColor="text-amber-500" />
        <StatCard label="Approved"         value={approved.length} sub="With active credit line" icon={CheckCircle2} iconColor="text-emerald-600" />
        <StatCard label="Rejected"         value={rejected.length}                               icon={XCircle}      iconColor="text-red-500" />
        <StatCard label="Approval Rate"    value={`${approvalRate}%`}                            icon={ClipboardCheck} iconColor="text-indigo-600" />
      </div>

      {/* Pending sanction */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pending Sanction</h3>
              <p className="text-xs text-slate-500 mt-0.5">CAMs awaiting credit manager review</p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pending.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {pending.map((lead) => {
              const cam = lead.camReport;
              return (
                <div key={lead.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60">
                  <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/leads/${lead.id}`} className="font-medium text-sm text-slate-900 hover:text-indigo-700">
                      {lead.borrowerName}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lead.applicationNumber} · {lead.productType.replace(/_/g, ' ')} · {lead.anchorName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-slate-900">{formatCurrency(lead.loanAmount)}</p>
                    {cam && (
                      <p className="text-xs text-slate-400">Sanction: {formatCurrency(cam.sanctionedAmount)}</p>
                    )}
                  </div>
                  {cam && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-sm font-bold px-2 py-1 rounded border ${GRADE_COLORS[cam.riskGrade]}`}>
                        {cam.riskGrade}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{cam.riskScore}/100</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/leads/${lead.id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50">
                        Reject
                      </Button>
                    </Link>
                    <Link href={`/leads/${lead.id}`}>
                      <Button size="sm" className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700">
                        Review & Approve
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All CAMs table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold">All CAMs ({camLeads.length})</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Borrower</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Requested</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sanctioned</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Grade</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">CAM Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {camLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/70 group">
                <td className="px-5 py-3.5">
                  <Link href={`/leads/${lead.id}`} className="font-medium text-slate-900 group-hover:text-indigo-700 text-sm block">
                    {lead.borrowerName}
                  </Link>
                  <p className="text-xs text-slate-400 font-mono">{lead.applicationNumber}</p>
                </td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-700">{formatCurrency(lead.loanAmount)}</td>
                <td className="px-4 py-3.5 text-right font-semibold text-indigo-700">
                  {lead.camReport ? formatCurrency(lead.camReport.sanctionedAmount) : '—'}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600">{lead.anchorName}</td>
                <td className="px-4 py-3.5">
                  {lead.camReport ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${GRADE_COLORS[lead.camReport.riskGrade]}`}>
                      {lead.camReport.riskGrade}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_COLORS[lead.riskLevel]}`}>
                    {lead.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {lead.camReport ? formatDate(lead.camReport.generatedAt) : '—'}
                </td>
                <td className="px-4 py-3.5"><LeadStatusBadge status={lead.status as any} /></td>
                <td className="px-4 py-3.5">
                  <Link href={`/leads/${lead.id}`} className="text-slate-400 hover:text-indigo-600">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {!camLeads.length && (
              <tr><td colSpan={9} className="py-12 text-center text-slate-400 text-sm">No CAMs yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
