'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgram, type ProgramStatus } from '@/hooks/usePrograms';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Pencil, Users, TrendingUp, AlertCircle, MapPin, Percent } from 'lucide-react';

const STATUS_STYLE: Record<ProgramStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  DRAFT: 'bg-slate-100 text-slate-600',
  CLOSED: 'bg-red-100 text-red-700',
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

const MOCK_BORROWERS = [
  { id: 'b1', name: 'Rajesh Building Materials', location: 'Pune', limit: 5000000, utilized: 3200000, dpd: 0, rating: 'A' },
  { id: 'b2', name: 'Kumar Cement Traders', location: 'Nashik', limit: 3000000, utilized: 1800000, dpd: 0, rating: 'B+' },
  { id: 'b3', name: 'Shivam Infra Supplies', location: 'Aurangabad', limit: 8000000, utilized: 7100000, dpd: 15, rating: 'B' },
  { id: 'b4', name: 'Patil Construction', location: 'Solapur', limit: 2000000, utilized: 400000, dpd: 0, rating: 'A+' },
  { id: 'b5', name: 'MH Cement Distributors', location: 'Kolhapur', limit: 6000000, utilized: 5800000, dpd: 30, rating: 'C' },
];

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { program } = useProgram(id);

  if (!program) return <div className="text-slate-400 py-12 text-center">Program not found</div>;

  const utilizationPct = Math.round((program.utilizedLimit / program.totalLimit) * 100);
  const available = program.totalLimit - program.utilizedLimit;

  return (
    <div className="space-y-6">
      <PageHeader title={program.name} subtitle={program.programCode}>
        <Link href="/programs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <Button size="sm">
          <Pencil className="h-4 w-4" />
          Edit Program
        </Button>
      </PageHeader>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Limit" value={formatCurrency(program.totalLimit)} icon={TrendingUp} iconColor="text-indigo-600" />
        <StatCard label="Utilized" value={formatCurrency(program.utilizedLimit)} sub={`${utilizationPct}% of limit`} icon={AlertCircle} iconColor="text-amber-500" />
        <StatCard label="Available" value={formatCurrency(available)} icon={TrendingUp} iconColor="text-emerald-600" />
        <StatCard label="Active Borrowers" value={program.activeBorrowers} icon={Users} iconColor="text-violet-600" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="borrowers">Borrowers</TabsTrigger>
          <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Program Details</h3>
              <InfoRow label="Program Code" value={<span className="font-mono text-xs">{program.programCode}</span>} />
              <InfoRow label="Anchor" value={<Link href={`/anchors/${program.anchorId}`} className="text-indigo-600 hover:underline">{program.anchorName}</Link>} />
              <InfoRow label="Product Type" value={program.productType.replace(/_/g, ' ')} />
              <InfoRow label="Status" value={<span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[program.status]}`}>{program.status}</span>} />
              <InfoRow label="Created" value={program.createdAt} />
              {program.approvedAt && <InfoRow label="Approved" value={program.approvedAt} />}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Financial Terms</h3>
              <InfoRow label="Interest Rate" value={`${(program.interestRate / 100).toFixed(2)}% p.a.`} />
              <InfoRow label="Processing Fee" value={`${(program.processingFee / 100).toFixed(2)}%`} />
              <InfoRow label="Max Tenor" value={`${program.maxTenor} days`} />
              <InfoRow label="Max Loan per Borrower" value={formatCurrency(program.maxLoanAmount)} />
              <InfoRow
                label="Geography"
                value={
                  <div className="flex flex-wrap gap-1 justify-end">
                    {program.geography.map((g) => (
                      <span key={g} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                }
              />
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Limit Utilization</h3>
              <span className="text-sm font-bold text-slate-900">{utilizationPct}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${utilizationPct > 85 ? 'bg-red-500' : utilizationPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${utilizationPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>Utilized: {formatCurrency(program.utilizedLimit)}</span>
              <span>Available: {formatCurrency(available)}</span>
              <span>Sanctioned: {formatCurrency(program.totalLimit)}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="borrowers" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Active Borrowers ({program.activeBorrowers})</h3>
              <Button size="sm" variant="outline">Export</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Borrower</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Limit</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Utilized</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">DPD</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_BORROWERS.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800">{b.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />{b.location}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium">{formatCurrency(b.limit)}</td>
                    <td className="px-4 py-3.5 text-right">{formatCurrency(b.utilized)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-semibold ${b.dpd > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {b.dpd > 0 ? `${b.dpd}d` : '0'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-xs font-bold bg-slate-100 px-1.5 py-0.5 rounded">{b.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="terms" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Percent className="h-4 w-4 text-indigo-500" /> Pricing Terms
                </h3>
                <div className="space-y-2 text-sm">
                  <InfoRow label="Base Rate (ROI)" value={`${(program.interestRate / 100).toFixed(2)}% p.a.`} />
                  <InfoRow label="Processing Fee" value={`${(program.processingFee / 100).toFixed(2)}% of loan amount`} />
                  <InfoRow label="Penal Interest" value="2% p.a. above base rate" />
                  <InfoRow label="Pre-closure Charges" value="1% of outstanding principal" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-teal-500" /> Eligible Geography
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {program.geography.map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-sm text-teal-700 font-medium">{g}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Eligibility Criteria</h3>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Authorized dealer/distributor of {program.anchorName}</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Minimum business vintage: 2 years</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Minimum CIBIL score: 650</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Clean repayment track record for 12 months</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Max loan: {formatCurrency(program.maxLoanAmount)}</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
