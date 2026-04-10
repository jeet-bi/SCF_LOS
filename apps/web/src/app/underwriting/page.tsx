'use client';

import { useState } from 'react';
import { useMockLeads } from '@/hooks/useMockLeads';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { LeadStatusBadge } from '@/components/lead-status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { BarChart3, Clock, Eye, CheckCircle2, ChevronRight } from 'lucide-react';

const STAGE_CONFIG = [
  { status: 'UNDERWRITING_QUEUE', label: 'UW Queue',        color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700', headerBg: 'bg-orange-50' },
  { status: 'UNDER_REVIEW',       label: 'Under Review',    color: 'bg-blue-50 border-blue-200',     badge: 'bg-blue-100 text-blue-700',     headerBg: 'bg-blue-50' },
  { status: 'PENNY_DROP_DONE',    label: 'Penny Drop Done', color: 'bg-violet-50 border-violet-200', badge: 'bg-violet-100 text-violet-700', headerBg: 'bg-violet-50' },
  { status: 'CAM_GENERATED',      label: 'CAM Generated',   color: 'bg-teal-50 border-teal-200',     badge: 'bg-teal-100 text-teal-700',     headerBg: 'bg-teal-50' },
];

const RISK_COLORS: Record<string, string> = {
  LOW:    'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH:   'bg-red-100 text-red-700',
};

export default function UnderwritingPage() {
  const { data: allLeads } = useMockLeads();
  const [genLoading, setGenLoading] = useState<string | null>(null);

  const uwLeads = allLeads.filter((l) =>
    ['UNDERWRITING_QUEUE', 'UNDER_REVIEW', 'PENNY_DROP_DONE', 'CAM_GENERATED'].includes(l.status),
  );
  const totalAmount = uwLeads.reduce((s, l) => s + l.loanAmount, 0);

  const handleGenerateUW = async (leadId: string) => {
    setGenLoading(leadId);
    await new Promise((r) => setTimeout(r, 1500));
    setGenLoading(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Underwriting" subtitle="Credit analysis and risk assessment queue" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="In Queue"      value={allLeads.filter((l) => l.status === 'UNDERWRITING_QUEUE').length} icon={Clock}        iconColor="text-orange-500" />
        <StatCard label="Under Review"  value={allLeads.filter((l) => l.status === 'UNDER_REVIEW').length}       icon={Eye}          iconColor="text-blue-500" />
        <StatCard label="CAM Ready"     value={allLeads.filter((l) => l.status === 'CAM_GENERATED').length}      icon={CheckCircle2} iconColor="text-teal-600" />
        <StatCard label="Total Exposure" value={formatCurrency(totalAmount)} sub="Cases in pipeline"              icon={BarChart3}    iconColor="text-indigo-600" />
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-4 gap-3">
        {STAGE_CONFIG.map((stage) => {
          const stageLeads = allLeads.filter((l) => l.status === stage.status);
          return (
            <div key={stage.status} className={`rounded-xl border ${stage.color}`}>
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl ${stage.headerBg} border-b ${stage.color.split(' ')[1]}`}>
                <h3 className="text-xs font-semibold text-slate-700">{stage.label}</h3>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${stage.badge}`}>{stageLeads.length}</span>
              </div>
              <div className="p-2 space-y-2">
                {stageLeads.map((lead) => (
                  <div key={lead.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm hover:shadow-md transition-shadow">
                    <Link href={`/leads/${lead.id}`} className="block">
                      <p className="text-xs font-semibold text-slate-800 hover:text-indigo-700 leading-tight">{lead.borrowerName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{lead.applicationNumber}</p>
                    </Link>
                    <p className="text-[10px] text-slate-500 mt-1">{lead.anchorName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-slate-900">{formatCurrency(lead.loanAmount)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${RISK_COLORS[lead.riskLevel]}`}>
                        {lead.riskLevel}
                      </span>
                    </div>
                    {lead.creditScore && (
                      <p className="text-[10px] text-slate-400 mt-1">Score: <span className="font-medium text-slate-600">{lead.creditScore}</span></p>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(lead.updatedAt)}</p>
                    {stage.status === 'UNDERWRITING_QUEUE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 h-6 text-[11px]"
                        onClick={() => handleGenerateUW(lead.id)}
                        disabled={genLoading === lead.id}
                      >
                        {genLoading === lead.id ? 'Generating…' : 'Generate UW Report'}
                      </Button>
                    )}
                    {stage.status === 'PENNY_DROP_DONE' && (
                      <Link href={`/leads/${lead.id}`}>
                        <Button size="sm" className="w-full mt-2 h-6 text-[11px] bg-teal-600 hover:bg-teal-700">
                          Generate CAM
                        </Button>
                      </Link>
                    )}
                    {stage.status === 'CAM_GENERATED' && (
                      <Link href={`/leads/${lead.id}`}>
                        <Button size="sm" variant="outline" className="w-full mt-2 h-6 text-[11px]">
                          Review CAM →
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-xs text-slate-400">Empty</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold">All Underwriting Cases ({uwLeads.length})</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Applicant</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Loan Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Assigned</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stage</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {uwLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/70 group">
                <td className="px-5 py-3.5">
                  <Link href={`/leads/${lead.id}`} className="font-medium text-slate-900 group-hover:text-indigo-700 text-sm block">
                    {lead.borrowerName}
                  </Link>
                  <p className="text-xs text-slate-400 font-mono">{lead.applicationNumber}</p>
                </td>
                <td className="px-4 py-3.5 text-right font-semibold">{formatCurrency(lead.loanAmount)}</td>
                <td className="px-4 py-3.5 text-slate-600 text-xs">{lead.anchorName}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_COLORS[lead.riskLevel]}`}>
                    {lead.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-bold ${lead.creditScore >= 720 ? 'text-emerald-600' : lead.creditScore >= 650 ? 'text-amber-600' : 'text-red-600'}`}>
                    {lead.creditScore}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{lead.assignedTo}</td>
                <td className="px-4 py-3.5"><LeadStatusBadge status={lead.status as any} /></td>
                <td className="px-4 py-3.5">
                  <Link href={`/leads/${lead.id}`} className="text-slate-400 hover:text-indigo-600">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {!uwLeads.length && (
              <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-sm">No cases in underwriting</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
