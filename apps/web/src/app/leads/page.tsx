'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMockLeads } from '@/hooks/useMockLeads';
import { PageHeader } from '@/components/page-header';
import { LeadStatusBadge } from '@/components/lead-status-badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Search, Download } from 'lucide-react';

const STATUSES = [
  { value: '', label: 'All' },
  { value: 'LEAD_CREATED', label: 'New' },
  { value: 'DOCUMENTS_PENDING', label: 'Docs Pending' },
  { value: 'KYC_IN_PROGRESS', label: 'KYC' },
  { value: 'KYC_VERIFIED', label: 'KYC Verified' },
  { value: 'UNDERWRITING_QUEUE', label: 'Underwriting' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'PENNY_DROP_DONE', label: 'Penny Drop' },
  { value: 'CAM_GENERATED', label: 'CAM Ready' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'DISBURSED', label: 'Disbursed' },
  { value: 'REJECTED', label: 'Rejected' },
];

const RISK_COLORS: Record<string, string> = {
  LOW:    'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH:   'bg-red-100 text-red-700',
};

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data: leads, total } = useMockLeads({ status: status || undefined, search: search || undefined });

  return (
    <div className="space-y-5">
      <PageHeader title="Applications" subtitle={`${total} total loan applications`}>
        <Button variant="outline" size="sm"><Download className="h-4 w-4" />Export</Button>
        <Link href="/leads/new">
          <Button size="sm"><Plus className="h-4 w-4" />New Application</Button>
        </Link>
      </PageHeader>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, PAN, app no..."
            className="pl-8 h-8 w-56 rounded-md border border-slate-200 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                status === s.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Applicant</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">App No.</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor / Product</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Loan Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Risk</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Applied</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/70 group cursor-pointer">
                <td className="px-5 py-3.5">
                  <Link href={`/leads/${lead.id}`} className="block">
                    <p className="font-medium text-slate-900 group-hover:text-indigo-700">{lead.borrowerName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lead.borrowerType} · <span className="font-mono">{lead.pan}</span>
                    </p>
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono text-xs text-slate-600">{lead.applicationNumber}</span>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-slate-700">{lead.anchorName}</p>
                  <p className="text-xs text-slate-400">{lead.productType.replace(/_/g, ' ')}</p>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="font-semibold text-slate-900">{formatCurrency(lead.loanAmount)}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLORS[lead.riskLevel]}`}>
                    {lead.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 text-xs">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-3.5">
                  <LeadStatusBadge status={lead.status as any} />
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <p className="text-slate-400 text-sm">No applications found</p>
                  <Link href="/leads/new" className="text-indigo-600 text-sm hover:underline mt-1 inline-block">Create one →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">{total} results</p>
        </div>
      </div>
    </div>
  );
}
