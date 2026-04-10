'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  FileStack,
  ShieldCheck,
  BarChart3,
  ClipboardCheck,
  Banknote,
  RefreshCcw,
  PieChart,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Supply Chain',
    items: [
      { href: '/programs', label: 'Programs', icon: FolderKanban },
      { href: '/anchors', label: 'Anchors', icon: Building2 },
    ],
  },
  {
    label: 'Applications',
    items: [
      { href: '/leads', label: 'Applications', icon: FileStack },
      { href: '/kyc', label: 'KYC Queue', icon: ShieldCheck },
    ],
  },
  {
    label: 'Credit',
    items: [
      { href: '/underwriting', label: 'Underwriting', icon: BarChart3 },
      { href: '/cam', label: 'Credit Appraisal', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Disbursement',
    items: [
      { href: '/disbursement', label: 'Disbursement', icon: Banknote },
      { href: '/collections', label: 'Collections', icon: RefreshCcw },
    ],
  },
  {
    label: 'Administration',
    items: [
      { href: '/reports', label: 'Reports', icon: PieChart },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-[220px] min-h-screen bg-slate-950 flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">LOS-SCF</p>
          <p className="text-slate-500 text-[11px] leading-tight">Supply Chain Finance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 py-1.5 mt-1">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all duration-150 group',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 p-2">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md mb-1">
          <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 text-xs font-bold">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-slate-500 text-[11px] truncate capitalize">{user?.role?.toLowerCase().replace(/_/g, ' ')}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] text-slate-500 hover:text-white hover:bg-slate-800 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
