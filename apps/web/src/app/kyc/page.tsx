'use client';

import { useLeads } from '@/hooks/useLeads';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { LeadStatusBadge } from '@/components/lead-status-badge';
import { formatDate } from '@/lib/utils';
import { LeadStatus } from '@los-scf/types';
import Link from 'next/link';
import { ShieldCheck, Clock, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useState } from 'react';

export default function KycPage() {
  const { data, refetch } = useLeads({ limit: 100 });
  const [loading, setLoading] = useState<string | null>(null);

  const allLeads = data?.data || [];
  const inProgress = allLeads.filter((l: any) => l.status === LeadStatus.KYC_IN_PROGRESS);
  const verified = allLeads.filter((l: any) => l.status === LeadStatus.KYC_VERIFIED);
  const docsUploaded = allLeads.filter((l: any) => l.status === LeadStatus.DOCUMENTS_UPLOADED);
  const failed = allLeads.filter((l: any) => l.status === LeadStatus.REJECTED);

  const handleInitiateKyc = async (leadId: string) => {
    setLoading(leadId);
    try {
      await api.post(`/leads/${leadId}/kyc/initiate`);
      refetch();
    } finally {
      setLoading(null);
    }
  };

  const KycRow = ({ lead, action }: { lead: any; action?: React.ReactNode }) => (
    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
      <div className="flex-1 min-w-0">
        <Link href={`/leads/${lead.id}`} className="font-medium text-slate-800 hover:text-indigo-700 text-sm">
          {lead.borrowerName}
        </Link>
        <p className="text-xs text-slate-400 mt-0.5">
          {lead.applicationNumber} · PAN: <span className="font-mono">{lead.pan}</span> · {formatDate(lead.updatedAt)}
        </p>
      </div>
      <LeadStatusBadge status={lead.status} />
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="KYC Queue" subtitle="Monitor and manage KYC verifications" />

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Docs Ready" value={docsUploaded.length} sub="Awaiting KYC start" icon={Clock} iconColor="text-amber-500" />
        <StatCard label="In Progress" value={inProgress.length} sub="KYC running" icon={ShieldCheck} iconColor="text-blue-500" />
        <StatCard label="Verified" value={verified.length} sub="KYC passed" icon={CheckCircle2} iconColor="text-emerald-600" />
        <StatCard label="Failed" value={failed.length} sub="Need review" icon={XCircle} iconColor="text-red-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Ready to initiate */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Ready for KYC</h3>
              <p className="text-xs text-slate-500">Documents uploaded, KYC not started</p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{docsUploaded.length}</span>
          </div>
          {docsUploaded.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No pending applications</div>
          ) : (
            docsUploaded.map((lead: any) => (
              <KycRow
                key={lead.id}
                lead={lead}
                action={
                  <Button
                    size="sm"
                    onClick={() => handleInitiateKyc(lead.id)}
                    disabled={loading === lead.id}
                    className="text-xs h-7"
                  >
                    {loading === lead.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Start KYC'}
                  </Button>
                }
              />
            ))
          )}
        </div>

        {/* In progress */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">KYC In Progress</h3>
              <p className="text-xs text-slate-500">Verification running via Karza</p>
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{inProgress.length}</span>
          </div>
          {inProgress.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">No active verifications</div>
          ) : (
            inProgress.map((lead: any) => (
              <KycRow key={lead.id} lead={lead} />
            ))
          )}
        </div>
      </div>

      {/* Verified */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">KYC Verified</h3>
            <p className="text-xs text-slate-500">Ready to move to underwriting</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{verified.length}</span>
        </div>
        {verified.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">No verified applications yet</div>
        ) : (
          verified.map((lead: any) => (
            <KycRow key={lead.id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
}
