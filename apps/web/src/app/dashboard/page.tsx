'use client';

import { useDashboardStats, useLeads } from '@/hooks/useLeads';
import { usePrograms } from '@/hooks/usePrograms';
import { useAnchors } from '@/hooks/useAnchors';
import { StatCard } from '@/components/stat-card';
import { LeadStatusBadge } from '@/components/lead-status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LeadStatus } from '@los-scf/types';
import Link from 'next/link';
import {
  FileStack,
  Building2,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Banknote,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

const PIPELINE_STAGES = [
  { label: 'Lead Created', status: LeadStatus.LEAD_CREATED, color: 'bg-slate-400' },
  { label: 'Docs Pending', status: LeadStatus.DOCUMENTS_PENDING, color: 'bg-amber-400' },
  { label: 'Docs Uploaded', status: LeadStatus.DOCUMENTS_UPLOADED, color: 'bg-blue-400' },
  { label: 'KYC In Progress', status: LeadStatus.KYC_IN_PROGRESS, color: 'bg-indigo-400' },
  { label: 'KYC Verified', status: LeadStatus.KYC_VERIFIED, color: 'bg-violet-400' },
  { label: 'UW Queue', status: LeadStatus.UNDERWRITING_QUEUE, color: 'bg-orange-400' },
  { label: 'Under Review', status: LeadStatus.UNDER_REVIEW, color: 'bg-orange-500' },
  { label: 'CAM Generated', status: LeadStatus.CAM_GENERATED, color: 'bg-teal-400' },
  { label: 'Approved', status: LeadStatus.APPROVED, color: 'bg-emerald-400' },
  { label: 'Disbursed', status: LeadStatus.DISBURSED, color: 'bg-emerald-600' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats } = useDashboardStats();
  const { data: recentLeads } = useLeads({ limit: 8, page: 1 });
  const { programs } = usePrograms();
  const { anchors } = useAnchors();

  const totalPortfolio = stats?.byStatus
    ? Object.values(stats.byStatus as Record<string, number>).reduce((a, b) => a + b, 0)
    : 0;

  const pendingAction = [
    LeadStatus.LEAD_CREATED,
    LeadStatus.DOCUMENTS_PENDING,
    LeadStatus.UNDERWRITING_QUEUE,
    LeadStatus.CAM_GENERATED,
  ].reduce((sum, s) => sum + (stats?.byStatus?.[s] || 0), 0);

  const disbursedCount = stats?.byStatus?.[LeadStatus.DISBURSED] || 0;
  const activePrograms = programs.filter((p) => p.status === 'ACTIVE').length;
  const activeAnchors = anchors.filter((a) => a.status === 'ACTIVE').length;

  const totalDisbursedAmount = programs.reduce((sum, p) => sum + p.utilizedLimit, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's what's happening in your LOS today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={totalPortfolio}
          sub="All time pipeline"
          icon={FileStack}
          iconColor="text-indigo-600"
          trend={{ value: '12%', up: true }}
        />
        <StatCard
          label="Pending Action"
          value={pendingAction}
          sub="Needs attention"
          icon={AlertCircle}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Disbursed (count)"
          value={disbursedCount}
          sub="Loans completed"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          trend={{ value: '8%', up: true }}
        />
        <StatCard
          label="Book Utilized"
          value={formatCurrency(totalDisbursedAmount)}
          sub={`${activePrograms} active programs`}
          icon={Banknote}
          iconColor="text-teal-600"
        />
      </div>

      {/* Middle Row: Pipeline + Quick Info */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pipeline Stages */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Application Pipeline</h2>
              <p className="text-xs text-slate-500">Live count by stage</p>
            </div>
            <Link href="/leads" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {PIPELINE_STAGES.map((stage) => {
              const count = stats?.byStatus?.[stage.status] || 0;
              const maxCount = Math.max(...PIPELINE_STAGES.map((s) => stats?.byStatus?.[s.status] || 0), 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={stage.status} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-[108px] shrink-0 text-right">{stage.label}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden">
                    {count > 0 && (
                      <div
                        className={`h-full ${stage.color} rounded-md transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      >
                        <span className="text-[10px] font-bold text-white">{count}</span>
                      </div>
                    )}
                    {count === 0 && (
                      <div className="h-full flex items-center pl-2">
                        <span className="text-[10px] text-slate-400">0</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <FolderKanban className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">SCF Programs</span>
            </div>
            <div className="space-y-2">
              {programs.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{p.name.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-[11px] text-slate-400">{p.anchorName.split(' ')[0]} · {p.activeBorrowers} dealers</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ml-2 ${
                    p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                    p.status === 'PAUSED' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{p.status}</span>
                </Link>
              ))}
              <Link href="/programs" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 px-2 pt-1">
                All programs <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-slate-700">Anchors</span>
              <span className="ml-auto text-xs text-slate-400">{activeAnchors} active</span>
            </div>
            <div className="space-y-2">
              {anchors.slice(0, 3).map((a) => (
                <Link
                  key={a.id}
                  href={`/anchors/${a.id}`}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50"
                >
                  <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-teal-700">{a.anchorCode.slice(0, 3)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{a.companyName}</p>
                    <p className="text-[11px] text-slate-400">{a.rating}</p>
                  </div>
                </Link>
              ))}
              <Link href="/anchors" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 px-2 pt-1">
                All anchors <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recent Applications</h2>
            <p className="text-xs text-slate-500">Latest loan applications</p>
          </div>
          <Link href="/leads" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {recentLeads?.data?.map((lead: any) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-indigo-600">{lead.borrowerName?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 truncate">{lead.borrowerName}</p>
                <p className="text-xs text-slate-400">{lead.applicationNumber} · {lead.borrowerType} · {formatDate(lead.createdAt)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-slate-800">{formatCurrency(lead.loanAmount)}</p>
                <p className="text-xs text-slate-400">{lead.productType?.replace(/_/g, ' ')}</p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </Link>
          ))}
          {!recentLeads?.data?.length && (
            <div className="py-12 text-center">
              <FileStack className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No applications yet</p>
              <Link href="/leads/new" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">
                Create first application →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
