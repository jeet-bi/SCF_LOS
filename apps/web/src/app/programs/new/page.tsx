'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { useAnchors } from '@/hooks/useAnchors';
import { ArrowLeft, Check } from 'lucide-react';

const PRODUCT_TYPES = [
  { value: 'DEALER_FINANCING', label: 'Dealer Financing', desc: 'Financing to authorized dealers against inventory purchases' },
  { value: 'WORKING_CAPITAL', label: 'Working Capital', desc: 'Short-term working capital loans for distributors' },
  { value: 'INVOICE_DISCOUNTING', label: 'Invoice Discounting', desc: 'Financing against invoices raised on anchor' },
  { value: 'CHANNEL_FINANCING', label: 'Channel Financing', desc: 'Financing across the distribution channel' },
  { value: 'VENDOR_FINANCING', label: 'Vendor Financing', desc: 'Early payment to vendors against purchase orders' },
];

const STATES = ['Andhra Pradesh','Bihar','Chhattisgarh','Delhi','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'];

function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function FormInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
    />
  );
}

function FormSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    >
      {children}
    </select>
  );
}

export default function NewProgramPage() {
  const router = useRouter();
  const { anchors } = useAnchors();
  const [selectedProduct, setSelectedProduct] = useState('DEALER_FINANCING');
  const [selectedGeo, setSelectedGeo] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const toggleGeo = (state: string) => {
    setSelectedGeo((prev) => prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Create New Program" subtitle="Setup a new SCF financing program">
        <Link href="/programs">
          <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" />Back</Button>
        </Link>
      </PageHeader>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {['Program Setup', 'Financial Terms', 'Geography & Limits'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > i + 1 ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${step === i + 1 ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
            {i < 2 && <div className="h-px w-8 bg-slate-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Program Setup</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Program Name" required>
                  <FormInput placeholder="e.g. UltraTech Dealer Finance FY26" />
                </FormField>
              </div>
              <FormField label="Anchor" required>
                <FormSelect>
                  <option value="">Select anchor</option>
                  {anchors.map((a) => (
                    <option key={a.id} value={a.id}>{a.companyName}</option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Program Code" required hint="Auto-generated if left blank">
                <FormInput placeholder="e.g. ULT-DFP-001" />
              </FormField>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-3 block">Product Type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 gap-2">
                {PRODUCT_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setSelectedProduct(pt.value)}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-colors ${
                      selectedProduct === pt.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      selectedProduct === pt.value ? 'border-indigo-600' : 'border-slate-300'
                    }`}>
                      {selectedProduct === pt.value && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{pt.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{pt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Financial Terms</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Interest Rate (% p.a.)" required>
                <FormInput type="number" step="0.01" min="0" placeholder="11.50" />
              </FormField>
              <FormField label="Processing Fee (%)" required>
                <FormInput type="number" step="0.01" min="0" placeholder="1.00" />
              </FormField>
              <FormField label="Maximum Tenor (days)" required>
                <FormInput type="number" min="1" max="365" placeholder="90" />
              </FormField>
              <FormField label="Max Loan per Borrower (₹)" required>
                <FormInput type="number" min="0" placeholder="5000000" />
              </FormField>
              <FormField label="Total Program Limit (₹)" required>
                <FormInput type="number" min="0" placeholder="500000000" />
              </FormField>
              <FormField label="Repayment Mode">
                <FormSelect>
                  <option value="BULLET">Bullet Payment</option>
                  <option value="EMI">EMI</option>
                  <option value="DEMAND">On Demand</option>
                </FormSelect>
              </FormField>
              <FormField label="Penal Rate (% p.a.)">
                <FormInput type="number" step="0.01" placeholder="2.00" />
              </FormField>
              <FormField label="Pre-closure Fee (%)">
                <FormInput type="number" step="0.01" placeholder="1.00" />
              </FormField>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Geography & Eligibility</h2>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Eligible States <span className="text-red-500">*</span>
                <span className="text-slate-400 font-normal ml-2">({selectedGeo.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleGeo(state)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedGeo.includes(state)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <FormField label="Min Business Vintage (years)">
                <FormInput type="number" min="0" step="0.5" placeholder="2" />
              </FormField>
              <FormField label="Min Credit Score">
                <FormInput type="number" min="300" max="900" placeholder="650" />
              </FormField>
              <FormField label="Min Annual Turnover (₹)">
                <FormInput type="number" placeholder="10000000" />
              </FormField>
              <FormField label="Relationship Manager">
                <FormInput placeholder="Name" />
              </FormField>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>
          Previous
        </Button>
        <div className="flex gap-2">
          {step < 3 ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button size="sm" onClick={() => router.push('/programs')}>
              <Check className="h-4 w-4" />
              Create Program
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
