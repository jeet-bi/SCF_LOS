import { AppShell } from '@/components/app-shell';

export default function CamLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
