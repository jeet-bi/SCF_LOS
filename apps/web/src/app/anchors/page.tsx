'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnchors, type AnchorStatus } from '@/hooks/useAnchors';
import { formatCurrency } from '@/lib/utils';
import { Plus, Building2, FolderKanban, Users, Search, MapPin } from 'lucide-react';

const STATUS_STYLE: Record<AnchorStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ONBOARDING: 'bg-blue-100 text-blue-700 border-blue-200',
  SUSPENDED: 'bg-red-100 text-red-700 border-red-200',
  CLOSED: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AnchorsPage() {
  const { anchors } = useAnchors();
  const [search, setSearch] = useState('');

  const filtered = anchors.filter(
    (a) =>
      !search ||
      a.companyName.toLowerCase().includes(search.toLowerCase()) ||
      a.anchorCode.toLowerCase().includes(search.toLowerCase()) ||
      a.pan.toLowerCase().includes(search.toLowerCase()),
  );

  const active = anchors.filter((a) => a.status === 'ACTIVE');
  const totalLimit = anchors.reduce((s, a) => s + a.totalProgramLimit, 0);
  const totalDealers = active.reduce((s, a) => s + a.activeDealers, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Anchors" subtitle="Manage anchor corporates for SCF programs">
        <Link href="/anchors/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Onboard Anchor
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active Anchors" value={active.length} sub={`of ${anchors.length} total`} icon={Building2} iconColor="text-teal-600" />
        <StatCard label="Total Program Limits" value={formatCurrency(totalLimit)} sub="Across all anchors" icon={FolderKanban} iconColor="text-indigo-600" />
        <StatCard label="Active Dealers" value={totalDealers} sub="Across active programs" icon={Users} iconColor="text-violet-600" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anchors..."
            className="pl-8 h-8 w-full rounded-md border border-slate-200 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((anchor) => {
          const utilPct = Math.round((anchor.utilizedLimit / anchor.totalProgramLimit) * 100);
          return (
            <Link key={anchor.id} href={`/anchors/${anchor.id}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-teal-700">{anchor.anchorCode.slice(0, 3)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-indigo-700">{anchor.companyName}</p>
                      <p className="text-xs text-slate-400">{anchor.anchorCode} · PAN: {anchor.pan}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLE[anchor.status]}`}>
                    {anchor.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-slate-400">Rating</p>
                    <p className="text-sm font-semibold text-slate-800">{anchor.rating || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Programs</p>
                    <p className="text-sm font-semibold text-slate-800">{anchor.activePrograms}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Dealers</p>
                    <p className="text-sm font-semibold text-slate-800">{anchor.activeDealers}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Limit utilization</span>
                    <span>{formatCurrency(anchor.utilizedLimit)} / {formatCurrency(anchor.totalProgramLimit)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${utilPct > 85 ? 'bg-red-500' : utilPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{anchor.city}, {anchor.state} · RM: {anchor.relationshipManager}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
