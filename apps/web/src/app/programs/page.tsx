'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePrograms, type Program, type ProgramStatus } from '@/hooks/usePrograms';
import { formatCurrency } from '@/lib/utils';
import { Plus, FolderKanban, TrendingUp, Users, Search, Filter } from 'lucide-react';

const STATUS_STYLE: Record<ProgramStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PAUSED: 'bg-amber-100 text-amber-700 border-amber-200',
  DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
  CLOSED: 'bg-red-100 text-red-700 border-red-200',
};

const PRODUCT_LABEL: Record<string, string> = {
  DEALER_FINANCING: 'Dealer Financing',
  WORKING_CAPITAL: 'Working Capital',
  INVOICE_DISCOUNTING: 'Invoice Discounting',
  CHANNEL_FINANCING: 'Channel Financing',
  VENDOR_FINANCING: 'Vendor Financing',
};

function UtilizationBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const color = pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function ProgramsPage() {
  const { programs } = usePrograms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filtered = programs.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.anchorName.toLowerCase().includes(search.toLowerCase()) ||
      p.programCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const active = programs.filter((p) => p.status === 'ACTIVE');
  const totalLimit = active.reduce((s, p) => s + p.totalLimit, 0);
  const totalUtilized = active.reduce((s, p) => s + p.utilizedLimit, 0);
  const totalBorrowers = active.reduce((s, p) => s + p.activeBorrowers, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="SCF Programs" subtitle="Manage supply chain financing programs">
        <Link href="/programs/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Program
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Active Programs"
          value={active.length}
          sub={`of ${programs.length} total`}
          icon={FolderKanban}
          iconColor="text-indigo-600"
        />
        <StatCard
          label="Total Sanctioned Limit"
          value={formatCurrency(totalLimit)}
          sub={`${formatCurrency(totalUtilized)} utilized`}
          icon={TrendingUp}
          iconColor="text-teal-600"
        />
        <StatCard
          label="Active Borrowers"
          value={totalBorrowers}
          sub="Across all programs"
          icon={Users}
          iconColor="text-violet-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs..."
            className="pl-8 h-8 w-full rounded-md border border-slate-200 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {['ALL', 'ACTIVE', 'PAUSED', 'DRAFT', 'CLOSED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Program</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Anchor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Limit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Utilization</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Borrowers</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-50/60 group">
                  <td className="px-5 py-4">
                    <Link href={`/programs/${prog.id}`} className="block">
                      <p className="font-medium text-slate-900 group-hover:text-indigo-700 leading-tight">{prog.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{prog.programCode}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{prog.anchorName}</td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className="text-xs">{PRODUCT_LABEL[prog.productType]}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-900">{formatCurrency(prog.totalLimit)}</p>
                    <p className="text-xs text-slate-400">@ {(prog.interestRate / 100).toFixed(2)}% p.a.</p>
                  </td>
                  <td className="px-4 py-4 w-40">
                    <p className="text-xs text-slate-600 mb-1">{formatCurrency(prog.utilizedLimit)}</p>
                    <UtilizationBar used={prog.utilizedLimit} total={prog.totalLimit} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-semibold text-slate-800">{prog.activeBorrowers}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLE[prog.status]}`}>
                      {prog.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">No programs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
