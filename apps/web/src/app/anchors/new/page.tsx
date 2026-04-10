'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Building2, Users, FileText, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Company Info', icon: Building2 },
  { id: 2, label: 'Contact & KYC', icon: Users },
  { id: 3, label: 'Bank & Financial', icon: CreditCard },
  { id: 4, label: 'Documents', icon: FileText },
];

const INDUSTRIES = ['Cement', 'Steel', 'FMCG', 'Chemicals', 'Auto', 'Textiles', 'Pharma', 'Agriculture'];
const STATES = ['Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh', 'Haryana', 'Punjab', 'West Bengal', 'Telangana', 'Andhra Pradesh'];

function StepIndicator({ steps, current }: { steps: typeof STEPS; current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-indigo-600 border-indigo-600' :
                active ? 'bg-white border-indigo-600' :
                'bg-white border-slate-200'
              }`}>
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <Icon className={`h-4 w-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                )}
              </div>
              <span className={`text-xs font-medium whitespace-nowrap ${active ? 'text-indigo-600' : done ? 'text-slate-700' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 mb-5 ${done ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ placeholder, type = 'text', defaultValue }: { placeholder?: string; type?: string; defaultValue?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  );
}

function Select({ placeholder, options }: { placeholder?: string; options: string[] }) {
  return (
    <select className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function Step1() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Company Information</h3>
        <p className="text-sm text-slate-500 mt-0.5">Basic details about the anchor company</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Company / Anchor Name" required>
          <Input placeholder="e.g. ACC Limited" />
        </FormField>
        <FormField label="Brand / Trade Name">
          <Input placeholder="If different from legal name" />
        </FormField>
        <FormField label="CIN Number" required>
          <Input placeholder="U26942MH1936PLC002456" />
        </FormField>
        <FormField label="PAN Number" required>
          <Input placeholder="AAACC1234C" />
        </FormField>
        <FormField label="GSTIN" required>
          <Input placeholder="27AAACC1234C1ZV" />
        </FormField>
        <FormField label="Year of Incorporation" required>
          <Input placeholder="1936" type="number" />
        </FormField>
        <FormField label="Industry / Sector" required>
          <Select placeholder="Select industry" options={INDUSTRIES} />
        </FormField>
        <FormField label="Company Type" required>
          <Select placeholder="Select type" options={['Public Limited', 'Private Limited', 'LLP', 'Partnership', 'Proprietorship']} />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <FormField label="Registered Address" required>
          <textarea
            rows={2}
            placeholder="Full registered address as per MCA records"
            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        </FormField>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="City" required>
          <Input placeholder="Mumbai" />
        </FormField>
        <FormField label="State" required>
          <Select placeholder="Select state" options={STATES} />
        </FormField>
        <FormField label="PIN Code" required>
          <Input placeholder="400001" />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Annual Turnover (₹ Cr)" required>
          <Input placeholder="5000" type="number" />
        </FormField>
        <FormField label="Number of Dealers / Partners">
          <Input placeholder="500" type="number" />
        </FormField>
      </div>
    </div>
  );
}

function Step2() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Contact & KYC Details</h3>
        <p className="text-sm text-slate-500 mt-0.5">Primary contacts and compliance information</p>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
        <p className="text-sm font-semibold text-indigo-900 mb-3">Primary Contact (Nodal Officer)</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <Input placeholder="Name as per ID proof" />
          </FormField>
          <FormField label="Designation" required>
            <Input placeholder="CFO / Treasurer" />
          </FormField>
          <FormField label="Mobile Number" required>
            <Input placeholder="+91 9820000000" type="tel" />
          </FormField>
          <FormField label="Email Address" required>
            <Input placeholder="nodal@company.com" type="email" />
          </FormField>
          <FormField label="PAN (of Contact)" required>
            <Input placeholder="ABCPD1234E" />
          </FormField>
          <FormField label="Aadhaar Number">
            <Input placeholder="XXXX XXXX 1234" />
          </FormField>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
        <p className="text-sm font-semibold text-slate-800 mb-3">Operations Contact</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full Name">
            <Input placeholder="Operations POC name" />
          </FormField>
          <FormField label="Email Address">
            <Input placeholder="ops@company.com" type="email" />
          </FormField>
          <FormField label="Mobile Number">
            <Input placeholder="+91 9820111111" type="tel" />
          </FormField>
          <FormField label="Designation">
            <Input placeholder="Manager - Operations" />
          </FormField>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Relationship Manager (Internal)" required>
          <Select placeholder="Assign RM" options={['Priya Sharma', 'Amit Patel', 'Kavita Singh', 'Rahul Gupta']} />
        </FormField>
        <FormField label="Credit Rating (CRISIL/ICRA)">
          <Select placeholder="Select rating" options={['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+']} />
        </FormField>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Bank & Financial Details</h3>
        <p className="text-sm text-slate-500 mt-0.5">Settlement and repayment account configuration</p>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
        <p className="text-sm font-semibold text-indigo-900 mb-3">Primary Settlement Account</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Bank Name" required>
            <Select placeholder="Select bank" options={['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Yes Bank']} />
          </FormField>
          <FormField label="Account Type" required>
            <Select placeholder="Select type" options={['Current Account', 'Savings Account', 'Overdraft Account']} />
          </FormField>
          <FormField label="Account Number" required>
            <Input placeholder="XXXXXXXXXXXXXXXXXX" />
          </FormField>
          <FormField label="IFSC Code" required>
            <Input placeholder="HDFC0001234" />
          </FormField>
          <FormField label="Account Holder Name" required>
            <Input placeholder="As per bank records" />
          </FormField>
          <FormField label="Branch Name">
            <Input placeholder="Fort, Mumbai" />
          </FormField>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Program Financial Parameters</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Maximum Program Limit (₹ Cr)" required>
            <Input placeholder="500" type="number" />
          </FormField>
          <FormField label="Minimum Dealer Loan Amount (₹)" required>
            <Input placeholder="500000" type="number" />
          </FormField>
          <FormField label="Maximum Dealer Loan Amount (₹)" required>
            <Input placeholder="50000000" type="number" />
          </FormField>
          <FormField label="Escrow Account Required">
            <Select options={['Yes', 'No']} />
          </FormField>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Repayment Structure</h4>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Preferred Tenure (Days)">
            <Select options={['30 days', '45 days', '60 days', '90 days', '180 days', '365 days']} />
          </FormField>
          <FormField label="Repayment Mode">
            <Select options={['eNACH (Auto-debit)', 'PDC (Cheques)', 'UPI Mandate', 'Net Banking']} />
          </FormField>
          <FormField label="Anchor Guarantee">
            <Select options={['None', 'Full Recourse', 'Partial (50%)', 'First Loss']} />
          </FormField>
        </div>
      </div>
    </div>
  );
}

const REQUIRED_DOCS = [
  { id: 'cin', label: 'Certificate of Incorporation (CIN)', required: true },
  { id: 'moa', label: 'Memorandum & Articles of Association', required: true },
  { id: 'pan_company', label: 'Company PAN Card', required: true },
  { id: 'gst_cert', label: 'GST Registration Certificate', required: true },
  { id: 'itr_3yr', label: 'Income Tax Returns (Last 3 Years)', required: true },
  { id: 'audited_fs', label: 'Audited Financial Statements (3 Years)', required: true },
  { id: 'bank_stmt', label: 'Bank Statements (12 Months)', required: true },
  { id: 'board_resolution', label: 'Board Resolution for SCF Program', required: true },
  { id: 'credit_report', label: 'Credit Bureau Report (Company)', required: false },
  { id: 'dealer_list', label: 'List of Authorized Dealers / Channel Partners', required: false },
  { id: 'kyc_director', label: 'KYC Documents — All Directors', required: true },
  { id: 'networth_cert', label: 'Net Worth Certificate (CA Certified)', required: false },
];

function Step4() {
  const [uploaded, setUploaded] = useState<string[]>([]);

  const toggle = (id: string) => {
    setUploaded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Document Upload</h3>
        <p className="text-sm text-slate-500 mt-0.5">Upload required compliance and financial documents</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-800 font-medium">
          All documents must be self-attested. Accepted formats: PDF, JPG, PNG (max 10MB per file).
          Marked <span className="text-red-600">*</span> are mandatory before onboarding approval.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {REQUIRED_DOCS.map((doc) => {
          const isUploaded = uploaded.includes(doc.id);
          return (
            <div key={doc.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUploaded ? 'bg-emerald-100' : 'bg-slate-100'
                }`}>
                  <FileText className={`h-3.5 w-3.5 ${isUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-800">
                    {doc.label}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </p>
                  {isUploaded && <p className="text-xs text-emerald-600 mt-0.5">Uploaded</p>}
                </div>
              </div>
              <button
                onClick={() => toggle(doc.id)}
                className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                  isUploaded
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {isUploaded ? 'Replace' : 'Upload'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
        <p className="text-sm font-medium text-slate-700 mb-2">Upload Progress</p>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${(uploaded.length / REQUIRED_DOCS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1.5">{uploaded.length} of {REQUIRED_DOCS.length} documents uploaded</p>
      </div>
    </div>
  );
}

export default function AnchorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Onboard New Anchor"
        subtitle="Register a new anchor company to the SCF platform"
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <StepIndicator steps={STEPS} current={step} />

        <div className="min-h-[400px]">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => step === 1 ? router.push('/anchors') : setStep((s) => s - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Step {step} of {STEPS.length}</span>
            {step < STEPS.length ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => router.push('/anchors')}
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit for Review
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
