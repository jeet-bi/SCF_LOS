'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMockLead, type CamReport, type UnderwritingReport } from '@/hooks/useMockLeads';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LeadStatusBadge } from '@/components/lead-status-badge';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import {
  ArrowLeft, CheckCircle2, FileText, User, Banknote,
  Clock, ChevronRight, Phone, AlertCircle, Upload,
  ShieldCheck, BarChart3, Download, Sparkles, RefreshCw,
  AlertTriangle, Building2, XCircle,
} from 'lucide-react';
import Link from 'next/link';

// ── Workflow stages ──────────────────────────────────────────────────────────
const STAGE_ORDER = [
  'LEAD_CREATED', 'DOCUMENTS_PENDING', 'DOCUMENTS_UPLOADED',
  'KYC_IN_PROGRESS', 'KYC_VERIFIED',
  'UNDERWRITING_QUEUE', 'UNDER_REVIEW', 'PENNY_DROP_DONE',
  'CAM_GENERATED', 'APPROVED',
  'READY_TO_DISBURSE', 'ENACH_PENDING', 'ESIGN_PENDING',
  'DISBURSEMENT_INITIATED', 'DISBURSED',
];

const WORKFLOW_MILESTONES = [
  { label: 'Created',    stages: ['LEAD_CREATED', 'DOCUMENTS_PENDING'] },
  { label: 'Docs',       stages: ['DOCUMENTS_UPLOADED'] },
  { label: 'KYC',        stages: ['KYC_IN_PROGRESS', 'KYC_VERIFIED'] },
  { label: 'Underwriting', stages: ['UNDERWRITING_QUEUE', 'UNDER_REVIEW', 'PENNY_DROP_DONE'] },
  { label: 'CAM',        stages: ['CAM_GENERATED'] },
  { label: 'Approved',   stages: ['APPROVED', 'READY_TO_DISBURSE', 'ENACH_PENDING', 'ESIGN_PENDING', 'DISBURSEMENT_INITIATED'] },
  { label: 'Disbursed',  stages: ['DISBURSED'] },
];

const RISK_COLORS: Record<string, string> = {
  LOW:    'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH:   'bg-red-100 text-red-700',
};

const GRADE_COLORS: Record<string, string> = {
  'A+': 'text-emerald-700 bg-emerald-100 border-emerald-200',
  'A':  'text-emerald-600 bg-emerald-50 border-emerald-100',
  'B+': 'text-amber-700 bg-amber-100 border-amber-200',
  'B':  'text-amber-600 bg-amber-50 border-amber-100',
  'C':  'text-orange-700 bg-orange-100 border-orange-200',
  'D':  'text-red-700 bg-red-100 border-red-200',
};

const DOC_STATUS_STYLE: Record<string, string> = {
  VERIFIED: 'bg-emerald-100 text-emerald-700',
  UPLOADED: 'bg-blue-100 text-blue-700',
  PENDING:  'bg-slate-100 text-slate-500',
  REJECTED: 'bg-red-100 text-red-700',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-50 last:border-0 gap-4">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className="text-xs font-medium text-slate-900 text-right">{value ?? '—'}</span>
    </div>
  );
}

// ── CAM Report panel ─────────────────────────────────────────────────────────
function CamPanel({ cam, loanAmount }: { cam: CamReport; loanAmount: number }) {
  const [showAI, setShowAI] = useState(false);

  return (
    <div className="space-y-4">
      {/* Decision banner */}
      <div className={`rounded-xl p-4 flex items-center gap-4 ${
        cam.creditDecision === 'APPROVE' ? 'bg-emerald-50 border border-emerald-100' :
        cam.creditDecision === 'REJECT'  ? 'bg-red-50 border border-red-100' :
        'bg-amber-50 border border-amber-100'
      }`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg border-2 ${GRADE_COLORS[cam.riskGrade]}`}>
          {cam.riskGrade}
        </div>
        <div className="flex-1">
          <p className={`font-bold text-base ${cam.creditDecision === 'APPROVE' ? 'text-emerald-800' : 'text-red-800'}`}>
            {cam.creditDecision === 'APPROVE' ? 'Credit Approved' : cam.creditDecision === 'REJECT' ? 'Credit Rejected' : 'Referred for Review'}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">{cam.executiveSummary}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-slate-900">{cam.riskScore}<span className="text-sm font-normal text-slate-400">/100</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Risk Score</p>
        </div>
      </div>

      {/* Terms grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sanctioned Amount', value: formatCurrency(cam.sanctionedAmount),
            note: cam.sanctionedAmount < loanAmount ? `vs ₹${(loanAmount/10000000).toFixed(0)}L requested` : 'Full amount' },
          { label: 'Rate of Interest',  value: `${cam.roi}% p.a.` },
          { label: 'Tenor',             value: `${cam.tenorDays} days` },
          { label: 'Processing Fee',    value: `${cam.processingFee}%` },
          { label: 'Repayment Mode',    value: cam.repaymentMode },
          { label: 'Collateral',        value: cam.collateral },
        ].map(({ label, value, note }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-[11px] text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
            {note && <p className="text-[10px] text-slate-400 mt-0.5">{note}</p>}
          </div>
        ))}
      </div>

      {/* Score breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold text-slate-700 mb-3">Risk Score Breakdown</p>
        <div className="space-y-2.5">
          {cam.scoreBreakdown.map((item) => {
            const pct = (item.score / item.maxScore) * 100;
            return (
              <div key={item.factor}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-700">{item.factor}</span>
                  <span className="text-xs font-bold text-slate-900">{item.score}/{item.maxScore}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.comment}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Risk Summary */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition-colors"
          onClick={() => setShowAI(!showAI)}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-slate-900">AI Risk Summary</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">claude-sonnet-4-6</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showAI ? 'rotate-90' : ''}`} />
        </button>
        {showAI && (
          <div className="px-4 pb-4 border-t border-slate-100">
            <div className="mt-3 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
              {cam.aiRiskSummary}
            </div>
          </div>
        )}
      </div>

      {/* Special conditions */}
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
        <p className="text-xs font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />Special Conditions
        </p>
        <ul className="space-y-1">
          {cam.specialConditions.map((c, i) => (
            <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Approval info */}
      {cam.approvedBy && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-emerald-800">Approved by {cam.approvedBy}</span>
            {cam.approvedAt && <span className="text-emerald-600 ml-2">on {formatDateTime(cam.approvedAt)}</span>}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button size="sm" variant="outline" className="text-xs">
          <Download className="h-3.5 w-3.5" />Download CAM PDF
        </Button>
      </div>
    </div>
  );
}

// ── Underwriting Report panel ────────────────────────────────────────────────
function UWPanel({ uw }: { uw: UnderwritingReport }) {
  const [showNarrative, setShowNarrative] = useState(false);

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Annual Turnover',    value: formatCurrency(uw.annualTurnover) },
          { label: 'GST Turnover',       value: formatCurrency(uw.gstTurnover) },
          { label: 'Avg Monthly Credit', value: formatCurrency(uw.avgMonthlyCredit) },
          { label: 'Bank MAB',           value: formatCurrency(uw.bankMAB) },
          { label: 'DSCR',               value: uw.dscr.toFixed(2) + 'x' },
          { label: 'Debt / Equity',      value: uw.debtToEquity.toFixed(2) },
          { label: 'WC Cycle',           value: uw.workingCapitalDays + ' days' },
          { label: 'Bounced Cheques',    value: String(uw.bouncedCheques) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-[11px] text-slate-400 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Bureau */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-800">Bureau Report — CIBIL Score: <span className={`text-base font-bold ${uw.bureauScore >= 720 ? 'text-emerald-600' : uw.bureauScore >= 650 ? 'text-amber-600' : 'text-red-600'}`}>{uw.bureauScore}</span></p>
          <p className="text-[11px] text-slate-400">{uw.financialYear}</p>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Account</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Bank</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-500">Outstanding</th>
              <th className="text-right px-4 py-2.5 font-semibold text-slate-500">EMI</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-500">DPD</th>
              <th className="text-left px-4 py-2.5 font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {uw.bureauHistory.map((b) => (
              <tr key={b.account} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5 font-mono text-slate-700">{b.account}</td>
                <td className="px-4 py-2.5 text-slate-600">{b.bank}</td>
                <td className="px-4 py-2.5 text-right font-medium">{b.outstanding > 0 ? formatCurrency(b.outstanding) : 'Nil'}</td>
                <td className="px-4 py-2.5 text-right">{b.emi > 0 ? formatCurrency(b.emi) : '—'}</td>
                <td className="px-4 py-2.5">
                  <span className={`font-bold ${b.dpd > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{b.dpd}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    b.status === 'CURRENT' ? 'bg-emerald-100 text-emerald-700' :
                    b.status === 'CLOSED'  ? 'bg-slate-100 text-slate-600' :
                    'bg-red-100 text-red-700'
                  }`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Risk flags & positive factors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-red-800 mb-2">Risk Flags</p>
          <ul className="space-y-1.5">
            {uw.riskFlags.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-400" />{f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-800 mb-2">Positive Factors</p>
          <ul className="space-y-1.5">
            {uw.positiveFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Narrative */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition-colors"
          onClick={() => setShowNarrative(!showNarrative)}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-slate-900">AI Underwriting Narrative</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold">claude-sonnet-4-6</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${showNarrative ? 'rotate-90' : ''}`} />
        </button>
        {showNarrative && (
          <div className="px-4 pb-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 mt-3 mb-2">Generated: {formatDateTime(uw.generatedAt)} · Analyst: {uw.analyst}</p>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{uw.aiNarrative}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: lead } = useMockLead(id);
  const [genCAMLoading, setGenCAMLoading] = useState(false);

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-6 w-6 text-slate-300 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-400">Loading application…</p>
        </div>
      </div>
    );
  }

  const currentStageIdx = STAGE_ORDER.indexOf(lead.status);
  const isRejected = lead.status === 'REJECTED';

  const getMilestoneState = (milestone: typeof WORKFLOW_MILESTONES[0]) => {
    const milestoneMax = Math.max(...milestone.stages.map((s) => STAGE_ORDER.indexOf(s)));
    if (isRejected) return 'rejected';
    if (milestoneMax < currentStageIdx) return 'done';
    if (milestone.stages.includes(lead.status)) return 'active';
    return 'pending';
  };

  const handleGenCAM = async () => {
    setGenCAMLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenCAMLoading(false);
  };

  const hasCam = !!lead.camReport;
  const hasUW  = !!lead.underwritingReport;

  const defaultTab = hasCam ? 'cam' : hasUW ? 'underwriting' : 'overview';

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back */}
      <div>
        <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />Back to Applications
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{lead.borrowerName}</h1>
              <LeadStatusBadge status={lead.status as any} />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLORS[lead.riskLevel]}`}>
                {lead.riskLevel} RISK
              </span>
              {lead.camReport && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${GRADE_COLORS[lead.camReport.riskGrade]}`}>
                  Grade {lead.camReport.riskGrade}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1 font-mono">{lead.applicationNumber} · {lead.productType.replace(/_/g, ' ')} · {lead.anchorName}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lead.status === 'PENNY_DROP_DONE' && !hasCam && (
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={handleGenCAM} disabled={genCAMLoading}>
                {genCAMLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />Generating CAM…
                  </span>
                ) : (
                  <><Sparkles className="h-4 w-4" />Generate CAM</>
                )}
              </Button>
            )}
            {hasCam && (
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />Download CAM
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Workflow progress */}
      <div className="bg-white rounded-xl border border-slate-200 px-6 py-4">
        <div className="flex items-start gap-0">
          {WORKFLOW_MILESTONES.map((milestone, i) => {
            const state = getMilestoneState(milestone);
            return (
              <div key={milestone.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    state === 'done'     ? 'bg-indigo-600 text-white' :
                    state === 'active'  ? 'bg-white text-indigo-600 ring-2 ring-indigo-600' :
                    state === 'rejected'? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {state === 'done' ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${
                    state === 'done' || state === 'active' ? 'text-indigo-600' :
                    state === 'rejected' ? 'text-red-500' : 'text-slate-400'
                  }`}>{milestone.label}</span>
                </div>
                {i < WORKFLOW_MILESTONES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1.5 mb-5 ${state === 'done' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Loan Amount</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(lead.loanAmount)}</p>
          {lead.camReport && lead.camReport.sanctionedAmount !== lead.loanAmount && (
            <p className="text-[10px] text-amber-600 mt-0.5">Sanctioned: {formatCurrency(lead.camReport.sanctionedAmount)}</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Credit Score</p>
          <p className={`text-lg font-bold ${lead.creditScore >= 720 ? 'text-emerald-600' : lead.creditScore >= 650 ? 'text-amber-600' : 'text-red-600'}`}>
            {lead.creditScore}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Business Vintage</p>
          <p className="text-lg font-bold text-slate-900">{lead.businessVintage} yrs</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">Applied On</p>
          <p className="text-lg font-bold text-slate-900">{formatDate(lead.createdAt)}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">
            <User className="h-3.5 w-3.5 mr-1.5" />Overview
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Documents
            <span className={`ml-1.5 text-[10px] font-bold px-1 py-0.5 rounded ${
              lead.documents.every((d) => d.status === 'VERIFIED') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {lead.documents.filter((d) => d.status === 'VERIFIED').length}/{lead.documents.length}
            </span>
          </TabsTrigger>
          {hasUW && (
            <TabsTrigger value="underwriting">
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />Underwriting Report
            </TabsTrigger>
          )}
          {hasCam && (
            <TabsTrigger value="cam">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />CAM Report
              <span className={`ml-1.5 text-[10px] font-bold px-1 py-0.5 rounded border ${GRADE_COLORS[lead.camReport!.riskGrade]}`}>
                {lead.camReport!.riskGrade}
              </span>
            </TabsTrigger>
          )}
          <TabsTrigger value="activity">
            <Clock className="h-3.5 w-3.5 mr-1.5" />Timeline
          </TabsTrigger>
        </TabsList>

        {/* ── OVERVIEW ── */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Borrower</h3>
              </div>
              <DetailRow label="Full Name"       value={lead.borrowerName} />
              <DetailRow label="Borrower Type"   value={lead.borrowerType} />
              <DetailRow label="Business Name"   value={lead.businessName} />
              <DetailRow label="PAN"             value={<span className="font-mono">{lead.pan}</span>} />
              <DetailRow label="GSTIN"           value={lead.gstin ? <span className="font-mono">{lead.gstin}</span> : '—'} />
              <DetailRow label="Business Vintage" value={`${lead.businessVintage} years`} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                  <Phone className="h-3.5 w-3.5 text-teal-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Contact & Location</h3>
              </div>
              <DetailRow label="Mobile" value={<a href={`tel:${lead.mobile}`} className="text-indigo-600 hover:underline">{lead.mobile}</a>} />
              <DetailRow label="Email"  value={lead.email ? <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">{lead.email}</a> : '—'} />
              <DetailRow label="City"   value={lead.address.city} />
              <DetailRow label="State"  value={lead.address.state} />
              <DetailRow label="PIN"    value={<span className="font-mono">{lead.address.pincode}</span>} />
              <DetailRow label="Assigned To" value={lead.assignedTo} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
                  <Banknote className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Loan Details</h3>
              </div>
              <DetailRow label="Product Type"   value={lead.productType.replace(/_/g, ' ')} />
              <DetailRow label="Loan Amount"    value={<span className="font-bold text-indigo-700">{formatCurrency(lead.loanAmount)}</span>} />
              <DetailRow label="Anchor"         value={lead.anchorName} />
              <DetailRow label="Program"        value={lead.programName} />
              <DetailRow label="Credit Score"   value={<span className={`font-bold ${lead.creditScore >= 720 ? 'text-emerald-600' : lead.creditScore >= 650 ? 'text-amber-600' : 'text-red-600'}`}>{lead.creditScore}</span>} />
              <DetailRow label="Risk Level"     value={<span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLORS[lead.riskLevel]}`}>{lead.riskLevel}</span>} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                  <Building2 className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">KYC Verification</h3>
              </div>
              {[
                { label: 'PAN Verified',       done: currentStageIdx >= STAGE_ORDER.indexOf('KYC_VERIFIED') },
                { label: 'Aadhaar Verified',   done: currentStageIdx >= STAGE_ORDER.indexOf('KYC_VERIFIED') },
                { label: 'GSTIN Verified',     done: currentStageIdx >= STAGE_ORDER.indexOf('KYC_VERIFIED') && !!lead.gstin },
                { label: 'Face Match',         done: currentStageIdx >= STAGE_ORDER.indexOf('KYC_VERIFIED') },
                { label: 'Bank Account Verified', done: currentStageIdx >= STAGE_ORDER.indexOf('PENNY_DROP_DONE') },
                { label: 'Bureau Check',       done: currentStageIdx >= STAGE_ORDER.indexOf('UNDER_REVIEW') },
              ].map((check) => (
                <div key={check.label} className="flex items-center gap-2 py-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${check.done ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    {check.done ? <CheckCircle2 className="h-3 w-3 text-emerald-600" /> : <AlertCircle className="h-3 w-3 text-slate-300" />}
                  </div>
                  <span className={`text-xs ${check.done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{check.label}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── DOCUMENTS ── */}
        <TabsContent value="documents" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Documents</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lead.documents.filter((d) => d.status === 'VERIFIED').length} verified · {lead.documents.filter((d) => d.status === 'UPLOADED').length} uploaded · {lead.documents.filter((d) => d.status === 'PENDING').length} pending
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7">
                <Upload className="h-3 w-3" />Upload All
              </Button>
            </div>
            <div className="divide-y divide-slate-50">
              {lead.documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.status === 'VERIFIED' ? 'bg-emerald-50 border border-emerald-100' : doc.status === 'UPLOADED' ? 'bg-blue-50 border border-blue-100' : 'bg-slate-100'}`}>
                    <FileText className={`h-4 w-4 ${doc.status === 'VERIFIED' ? 'text-emerald-600' : doc.status === 'UPLOADED' ? 'text-blue-500' : 'text-slate-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{doc.label}</p>
                    {doc.fileName ? (
                      <p className="text-xs text-slate-400 mt-0.5">{doc.fileName} · {doc.fileSize} · {doc.uploadedAt && formatDate(doc.uploadedAt)}</p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5">Not uploaded</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.verifiedAt && (
                      <span className="text-[10px] text-emerald-600">Verified {formatDate(doc.verifiedAt)}</span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DOC_STATUS_STYLE[doc.status]}`}>
                      {doc.status}
                    </span>
                    {doc.status === 'PENDING' ? (
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*,application/pdf" className="hidden" />
                        <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                          <span><Upload className="h-3 w-3" />Upload</span>
                        </Button>
                      </label>
                    ) : doc.status === 'UPLOADED' ? (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-600">View</Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="h-7 text-xs">View</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── UNDERWRITING ── */}
        {hasUW && (
          <TabsContent value="underwriting" className="mt-4">
            <UWPanel uw={lead.underwritingReport!} />
          </TabsContent>
        )}

        {/* ── CAM ── */}
        {hasCam && (
          <TabsContent value="cam" className="mt-4">
            {lead.status === 'REJECTED' && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-800 font-medium">This application was rejected. CAM is preserved for reference.</p>
              </div>
            )}
            <CamPanel cam={lead.camReport!} loanAmount={lead.loanAmount} />
          </TabsContent>
        )}

        {/* ── ACTIVITY ── */}
        <TabsContent value="activity" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-5">Activity Timeline</h3>
            {lead.activity.length > 0 ? (
              <div>
                {lead.activity.map((item, i) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-indigo-600" />
                      </div>
                      {i < lead.activity.length - 1 && <div className="w-0.5 bg-slate-100 flex-1 my-1 min-h-[16px]" />}
                    </div>
                    <div className="pb-5 flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{item.action.replace(/_/g, ' ')}</p>
                      {item.fromStatus && item.toStatus && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.fromStatus.replace(/_/g, ' ')} → {item.toStatus.replace(/_/g, ' ')}
                        </p>
                      )}
                      {item.note && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">{item.note}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        {item.performedBy} · {formatDateTime(item.performedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No activity yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
