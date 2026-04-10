'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateLead } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { BorrowerType, LoanProductType } from '@los-scf/types';
import { ArrowLeft, AlertCircle, User, Banknote, MapPin } from 'lucide-react';
import Link from 'next/link';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
const selectCls = 'flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

const PRODUCT_LABELS: Record<string, string> = {
  WORKING_CAPITAL: 'Working Capital Loan',
  DEALER_FINANCING: 'Dealer Financing',
  INVOICE_DISCOUNTING: 'Invoice Discounting',
  CHANNEL_FINANCING: 'Channel Financing',
  VENDOR_FINANCING: 'Vendor Financing',
};

export default function NewLeadPage() {
  const router = useRouter();
  const createLead = useCreateLead();

  const [form, setForm] = useState({
    borrowerName: '',
    borrowerType: BorrowerType.DEALER,
    pan: '',
    mobile: '',
    email: '',
    productType: LoanProductType.WORKING_CAPITAL,
    loanAmount: '',
    gstin: '',
    businessName: '',
    businessVintage: '',
    manufacturerName: '',
    address: { line1: '', city: '', state: '', pincode: '', country: 'India' },
  });

  const [error, setError] = useState('');

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const setAddr = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        loanAmount: parseInt(form.loanAmount) * 100,
        businessVintage: form.businessVintage ? parseFloat(form.businessVintage) : undefined,
      };
      const lead = await createLead.mutateAsync(payload as any);
      router.push(`/leads/${lead.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to create application');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Applications
        </Link>
        <PageHeader title="New Application" subtitle="Create a new SCF loan application" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Borrower Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-indigo-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Borrower Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Borrower / Applicant Name" required>
                <input
                  required
                  value={form.borrowerName}
                  onChange={(e) => set('borrowerName', e.target.value)}
                  placeholder="Full name as per PAN card"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Borrower Type" required>
              <select value={form.borrowerType} onChange={(e) => set('borrowerType', e.target.value)} className={selectCls}>
                {Object.values(BorrowerType).map((t) => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </Field>
            <Field label="PAN Number" required>
              <input
                required
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                value={form.pan}
                onChange={(e) => set('pan', e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className={`${inputCls} font-mono tracking-wider`}
              />
            </Field>
            <Field label="Mobile Number" required>
              <input
                required
                pattern="[6-9][0-9]{9}"
                value={form.mobile}
                onChange={(e) => set('mobile', e.target.value)}
                placeholder="9800000000"
                className={inputCls}
              />
            </Field>
            <Field label="Email Address">
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="applicant@business.com"
                className={inputCls}
              />
            </Field>
            <Field label="GSTIN">
              <input
                value={form.gstin}
                onChange={(e) => set('gstin', e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                className={`${inputCls} font-mono`}
              />
            </Field>
            <Field label="Business / Trade Name">
              <input
                value={form.businessName}
                onChange={(e) => set('businessName', e.target.value)}
                placeholder="Shop / company name"
                className={inputCls}
              />
            </Field>
            <Field label="Business Vintage (years)">
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.businessVintage}
                onChange={(e) => set('businessVintage', e.target.value)}
                placeholder="5"
                className={inputCls}
              />
            </Field>
            <div className="col-span-2">
              <Field label="Anchor / Manufacturer Name">
                <input
                  value={form.manufacturerName}
                  onChange={(e) => set('manufacturerName', e.target.value)}
                  placeholder="e.g. UltraTech Cement, ACC Limited"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
              <Banknote className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Loan Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Type" required>
              <select value={form.productType} onChange={(e) => set('productType', e.target.value)} className={selectCls}>
                {Object.values(LoanProductType).map((t) => (
                  <option key={t} value={t}>{PRODUCT_LABELS[t] || t.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </Field>
            <Field label="Loan Amount (₹)" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                <input
                  required
                  type="number"
                  min="100000"
                  value={form.loanAmount}
                  onChange={(e) => set('loanAmount', e.target.value)}
                  placeholder="5,00,000"
                  className={`${inputCls} pl-6`}
                />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '₹5 Lakh', value: '500000' },
              { label: '₹10 Lakh', value: '1000000' },
              { label: '₹25 Lakh', value: '2500000' },
              { label: '₹50 Lakh', value: '5000000' },
              { label: '₹1 Cr', value: '10000000' },
              { label: '₹2 Cr', value: '20000000' },
            ].map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => set('loanAmount', preset.value)}
                className={`py-1.5 text-xs rounded-md border font-medium transition-colors ${
                  form.loanAmount === preset.value
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Business Address</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Address Line 1" required>
                <input
                  required
                  value={form.address.line1}
                  onChange={(e) => setAddr('line1', e.target.value)}
                  placeholder="Shop / office address"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="City" required>
              <input required value={form.address.city} onChange={(e) => setAddr('city', e.target.value)} placeholder="Mumbai" className={inputCls} />
            </Field>
            <Field label="State" required>
              <select required value={form.address.state} onChange={(e) => setAddr('state', e.target.value)} className={selectCls}>
                <option value="">Select state</option>
                {['Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh', 'Haryana', 'Punjab', 'West Bengal', 'Telangana', 'Andhra Pradesh', 'Bihar', 'Odisha', 'Assam', 'Delhi'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="PIN Code" required>
              <input
                required
                pattern="[0-9]{6}"
                value={form.address.pincode}
                onChange={(e) => setAddr('pincode', e.target.value)}
                placeholder="400001"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3 pb-4">
          <Button type="submit" disabled={createLead.isPending} className="px-6">
            {createLead.isPending ? 'Creating Application…' : 'Create Application'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
