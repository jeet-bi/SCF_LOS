'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnchor, type AnchorStatus } from '@/hooks/useAnchors';
import { usePrograms } from '@/hooks/usePrograms';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Pencil, Building2, FolderKanban, Users, Phone, Mail, User } from 'lucide-react';

const STATUS_STYLE: Record<AnchorStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  ONBOARDING: 'bg-blue-100 text-blue-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  CLOSED: 'bg-slate-100 text-slate-600',
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

const ONBOARDING_STEPS = [
  { label: 'Initial Application', done: true },
  { label: 'KYC & Documentation', done: true },
  { label: 'Credit Assessment', done: true },
  { label: 'Legal & Compliance', done: true },
  { label: 'Agreement Execution', done: false },
  { label: 'System Onboarding', done: false },
];

export default function AnchorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { anchor } = useAnchor(id);
  const { programs } = usePrograms();
  const anchorPrograms = programs.filter((p) => p.anchorId === id);

  if (!anchor) return <div className="text-slate-400 py-12 text-center">Anchor not found</div>;

  const utilPct = Math.round((anchor.utilizedLimit / anchor.totalProgramLimit) * 100);

  return (
    <div className="space-y-6">
      <PageHeader title={anchor.companyName} subtitle={`${anchor.anchorCode} · ${anchor.industry}`}>
        <Link href="/anchors">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" />Back</Button>
        </Link>
        <Button size="sm"><Pencil className="h-4 w-4" />Edit</Button>
      </PageHeader>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Program Limit" value={formatCurrency(anchor.totalProgramLimit)} icon={Building2} iconColor="text-indigo-600" />
        <StatCard label="Utilized" value={formatCurrency(anchor.utilizedLimit)} sub={`${utilPct}%`} icon={FolderKanban} iconColor="text-amber-500" />
        <StatCard label="Active Programs" value={anchor.activePrograms} icon={FolderKanban} iconColor="text-teal-600" />
        <StatCard label="Active Dealers" value={anchor.activeDealers} icon={Users} iconColor="text-violet-600" />
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Company Details</h3>
              <InfoRow label="Status" value={<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[anchor.status]}`}>{anchor.status}</span>} />
              <InfoRow label="PAN" value={<span className="font-mono text-xs">{anchor.pan}</span>} />
              <InfoRow label="GSTIN" value={<span className="font-mono text-xs">{anchor.gstin}</span>} />
              <InfoRow label="Industry" value={anchor.industry} />
              <InfoRow label="Rating" value={`${anchor.rating} (${anchor.ratingAgency})`} />
              <InfoRow label="Location" value={`${anchor.city}, ${anchor.state}`} />
              {anchor.onboardedAt && <InfoRow label="Onboarded" value={anchor.onboardedAt} />}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Key Contacts</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Primary Contact</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{anchor.contactName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <a href={`mailto:${anchor.contactEmail}`} className="text-xs text-indigo-600 hover:underline">{anchor.contactEmail}</a>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{anchor.contactPhone}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Relationship Manager</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{anchor.relationshipManager}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Internal RM · LOS-SCF</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="programs" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-semibold">SCF Programs ({anchorPrograms.length})</h3>
              <Button size="sm">+ New Program</Button>
            </div>
            {anchorPrograms.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">No programs yet</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Program</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Limit</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Dealers</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {anchorPrograms.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-5 py-3">
                        <Link href={`/programs/${p.id}`} className="font-medium text-indigo-600 hover:underline">{p.name}</Link>
                        <p className="text-xs text-slate-400 font-mono">{p.programCode}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.productType.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(p.totalLimit)}</td>
                      <td className="px-4 py-3 text-center">{p.activeBorrowers}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-5">Onboarding Checklist</h3>
            <div className="space-y-3">
              {ONBOARDING_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    {step.done ? (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${step.done ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
                    {step.label}
                  </span>
                  {!step.done && (
                    <Button size="sm" variant="outline" className="ml-auto text-xs h-7">Mark Done</Button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500">
                {ONBOARDING_STEPS.filter((s) => s.done).length} of {ONBOARDING_STEPS.length} steps completed
              </p>
              <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(ONBOARDING_STEPS.filter((s) => s.done).length / ONBOARDING_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            {[
              { name: 'Certificate of Incorporation', status: 'VERIFIED', date: '2024-01-18' },
              { name: 'GST Registration', status: 'VERIFIED', date: '2024-01-18' },
              { name: 'PAN Card', status: 'VERIFIED', date: '2024-01-18' },
              { name: 'Credit Rating Report (CRISIL)', status: 'VERIFIED', date: '2024-01-19' },
              { name: 'Audited Financials FY24', status: 'VERIFIED', date: '2024-01-20' },
              { name: 'Board Resolution', status: 'PENDING', date: '' },
              { name: 'Master Agreement', status: 'PENDING', date: '' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <p className="text-sm text-slate-700">{doc.name}</p>
                <div className="flex items-center gap-3">
                  {doc.date && <span className="text-xs text-slate-400">{doc.date}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
