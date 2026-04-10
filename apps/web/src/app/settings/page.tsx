'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth.store';
import { Save, User, Shield, Bell, Database, Key } from 'lucide-react';

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-0 gap-6">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function FormInput({ label, defaultValue, type = 'text' }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
}

const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@los-scf.com', role: 'ADMIN', status: 'ACTIVE' },
  { id: '2', name: 'Credit Manager', email: 'cm@los-scf.com', role: 'CREDIT_MANAGER', status: 'ACTIVE' },
  { id: '3', name: 'Underwriter', email: 'uw@los-scf.com', role: 'UNDERWRITER', status: 'ACTIVE' },
  { id: '4', name: 'Ops Agent', email: 'ops@los-scf.com', role: 'OPS_AGENT', status: 'ACTIVE' },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifs, setNotifs] = useState({ email: true, sms: false, whatsapp: true });

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage system configuration and preferences" />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile"><User className="h-3.5 w-3.5 mr-1.5" />Profile</TabsTrigger>
          <TabsTrigger value="users"><Shield className="h-3.5 w-3.5 mr-1.5" />Users</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-3.5 w-3.5 mr-1.5" />Notifications</TabsTrigger>
          <TabsTrigger value="integrations"><Database className="h-3.5 w-3.5 mr-1.5" />Integrations</TabsTrigger>
          <TabsTrigger value="security"><Key className="h-3.5 w-3.5 mr-1.5" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-900">{user?.name}</p>
                <p className="text-sm text-slate-500">{user?.role?.toLowerCase().replace(/_/g, ' ')}</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">Change Photo</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Full Name" defaultValue={user?.name} />
              <FormInput label="Email" defaultValue={user?.email} type="email" />
              <FormInput label="Mobile" defaultValue="+91 98XXXXXXXX" />
              <FormInput label="Role" defaultValue={user?.role?.replace(/_/g, ' ')} />
            </div>
            <div className="flex justify-end">
              <Button size="sm"><Save className="h-4 w-4" />Save Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold">System Users</h3>
              <Button size="sm">+ Invite User</Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_USERS.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-indigo-600">{u.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{u.role.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{u.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Button size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Notification Channels</h3>
            <p className="text-xs text-slate-500 mb-4">Configure how borrowers and team members receive alerts</p>
            <SettingRow label="Email Notifications" description="Send status updates via email">
              <Toggle checked={notifs.email} onChange={(v) => setNotifs({ ...notifs, email: v })} />
            </SettingRow>
            <SettingRow label="SMS Notifications" description="Send OTPs and status alerts via SMS">
              <Toggle checked={notifs.sms} onChange={(v) => setNotifs({ ...notifs, sms: v })} />
            </SettingRow>
            <SettingRow label="WhatsApp Notifications" description="Send rich notifications via WhatsApp">
              <Toggle checked={notifs.whatsapp} onChange={(v) => setNotifs({ ...notifs, whatsapp: v })} />
            </SettingRow>
            <SettingRow label="KYC Completion Alerts" description="Notify ops agent when KYC completes">
              <Toggle checked={true} onChange={() => {}} />
            </SettingRow>
            <SettingRow label="Overdue Payment Alerts" description="Daily digest of overdue accounts">
              <Toggle checked={true} onChange={() => {}} />
            </SettingRow>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Integration Status</h3>
            {[
              { name: 'Karza (KYC)', desc: 'PAN, GSTIN, Aadhaar verification', status: 'connected' },
              { name: 'Perfios (Bank Statement)', desc: 'Bank statement analysis', status: 'not_configured' },
              { name: 'CIBIL (Bureau)', desc: 'Credit bureau reports', status: 'not_configured' },
              { name: 'Digio (eSign / eNACH)', desc: 'Digital signing and mandate', status: 'not_configured' },
              { name: 'RazorpayX (Disbursement)', desc: 'Fund transfer API', status: 'not_configured' },
              { name: 'AWS S3 (Storage)', desc: 'Document storage', status: 'connected' },
              { name: 'Anthropic Claude (AI)', desc: 'KYC extraction and underwriting AI', status: 'connected' },
            ].map((intg) => (
              <div key={intg.name} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{intg.name}</p>
                  <p className="text-xs text-slate-400">{intg.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    intg.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {intg.status === 'connected' ? 'Connected' : 'Not Configured'}
                  </span>
                  <Button size="sm" variant="outline" className="text-xs h-7">Configure</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Security Settings</h3>
            <SettingRow label="Two-Factor Authentication" description="Require OTP for all logins">
              <Toggle checked={false} onChange={() => {}} />
            </SettingRow>
            <SettingRow label="Session Timeout" description="Auto-logout after 8 hours of inactivity">
              <select className="h-8 rounded-md border border-slate-200 text-sm px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option>8 hours</option>
                <option>4 hours</option>
                <option>1 hour</option>
              </select>
            </SettingRow>
            <SettingRow label="IP Whitelist" description="Restrict access to specific IPs">
              <Toggle checked={false} onChange={() => {}} />
            </SettingRow>
            <div className="pt-4 border-t border-slate-100 mt-2">
              <h4 className="text-sm font-medium text-slate-800 mb-3">Change Password</h4>
              <div className="space-y-3">
                <FormInput label="Current Password" type="password" />
                <FormInput label="New Password" type="password" />
                <FormInput label="Confirm New Password" type="password" />
                <Button size="sm"><Save className="h-4 w-4" />Update Password</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
