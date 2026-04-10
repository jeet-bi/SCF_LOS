// Comprehensive mock lead store — used across all pages when API data is unavailable or for demo

export type MockLeadStatus =
  | 'LEAD_CREATED' | 'DOCUMENTS_PENDING' | 'DOCUMENTS_UPLOADED'
  | 'KYC_IN_PROGRESS' | 'KYC_VERIFIED'
  | 'UNDERWRITING_QUEUE' | 'UNDER_REVIEW' | 'PENNY_DROP_DONE'
  | 'CAM_GENERATED' | 'APPROVED' | 'REJECTED' | 'ADDITIONAL_DOCS_REQUIRED'
  | 'READY_TO_DISBURSE' | 'ENACH_PENDING' | 'ESIGN_PENDING'
  | 'DISBURSEMENT_INITIATED' | 'DISBURSED' | 'TRANSFERRED_TO_LMS';

export interface MockDocument {
  id: string;
  type: string;
  label: string;
  status: 'VERIFIED' | 'UPLOADED' | 'PENDING' | 'REJECTED';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  verifiedAt?: string;
}

export interface BureauEntry {
  account: string;
  bank: string;
  outstanding: number;
  emi: number;
  dpd: number;
  status: 'CURRENT' | 'CLOSED' | 'NPA';
}

export interface UnderwritingReport {
  generatedAt: string;
  analyst: string;
  financialYear: string;
  annualTurnover: number;
  gstTurnover: number;
  bankMAB: number;
  avgMonthlyCredit: number;
  bouncedCheques: number;
  existingObligations: number;
  dscr: number;
  debtToEquity: number;
  workingCapitalDays: number;
  bureauScore: number;
  bureauHistory: BureauEntry[];
  riskFlags: string[];
  positiveFactors: string[];
  aiNarrative: string;
}

export interface CamReport {
  generatedAt: string;
  version: string;
  executiveSummary: string;
  aiRiskSummary: string;
  sanctionedAmount: number;
  roi: number;
  tenorDays: number;
  processingFee: number;
  repaymentMode: string;
  collateral: string;
  guarantee: string;
  riskScore: number;
  riskGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  scoreBreakdown: { factor: string; score: number; maxScore: number; comment: string }[];
  specialConditions: string[];
  creditDecision: 'APPROVE' | 'REJECT' | 'REFER';
  approvedBy?: string;
  approvedAt?: string;
}

export interface MockActivity {
  id: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  note?: string;
  performedBy: string;
  performedAt: string;
}

export interface MockLead {
  id: string;
  applicationNumber: string;
  borrowerName: string;
  borrowerType: string;
  businessName: string;
  pan: string;
  gstin?: string;
  mobile: string;
  email?: string;
  manufacturerName: string;
  anchorName: string;
  programName: string;
  productType: string;
  loanAmount: number;
  businessVintage: number;
  creditScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: MockLeadStatus;
  createdAt: string;
  updatedAt: string;
  address: { line1: string; city: string; state: string; pincode: string };
  assignedTo: string;
  documents: MockDocument[];
  underwritingReport?: UnderwritingReport;
  camReport?: CamReport;
  activity: MockActivity[];
}

// ─── Document sets ──────────────────────────────────────────────────────────

const fullVerifiedDocs = (name: string): MockDocument[] => [
  { id: 'd1', type: 'PAN_CARD',          label: 'PAN Card',                status: 'VERIFIED',  fileName: `${name}_PAN.pdf`,        fileSize: '245 KB', uploadedAt: '2026-03-15', verifiedAt: '2026-03-16' },
  { id: 'd2', type: 'AADHAAR_FRONT',     label: 'Aadhaar Front',           status: 'VERIFIED',  fileName: `${name}_Aadhaar_F.jpg`,   fileSize: '312 KB', uploadedAt: '2026-03-15', verifiedAt: '2026-03-16' },
  { id: 'd3', type: 'AADHAAR_BACK',      label: 'Aadhaar Back',            status: 'VERIFIED',  fileName: `${name}_Aadhaar_B.jpg`,   fileSize: '298 KB', uploadedAt: '2026-03-15', verifiedAt: '2026-03-16' },
  { id: 'd4', type: 'BANK_STATEMENT',    label: 'Bank Statement (12M)',     status: 'VERIFIED',  fileName: `${name}_Bank_Stmt.pdf`,   fileSize: '1.2 MB', uploadedAt: '2026-03-15', verifiedAt: '2026-03-17' },
  { id: 'd5', type: 'CANCELLED_CHEQUE',  label: 'Cancelled Cheque',        status: 'VERIFIED',  fileName: `${name}_Cheque.jpg`,      fileSize: '189 KB', uploadedAt: '2026-03-15', verifiedAt: '2026-03-16' },
  { id: 'd6', type: 'GST_CERTIFICATE',   label: 'GST Registration Cert.',  status: 'VERIFIED',  fileName: `${name}_GST.pdf`,         fileSize: '423 KB', uploadedAt: '2026-03-16', verifiedAt: '2026-03-17' },
  { id: 'd7', type: 'ITR',               label: 'ITR (Last 2 Years)',       status: 'VERIFIED',  fileName: `${name}_ITR.pdf`,         fileSize: '678 KB', uploadedAt: '2026-03-16', verifiedAt: '2026-03-18' },
  { id: 'd8', type: 'TRADE_LICENSE',     label: 'Trade License / MSME',    status: 'VERIFIED',  fileName: `${name}_Trade.pdf`,       fileSize: '334 KB', uploadedAt: '2026-03-17', verifiedAt: '2026-03-18' },
];

const partialDocs = (name: string): MockDocument[] => [
  { id: 'd1', type: 'PAN_CARD',         label: 'PAN Card',               status: 'VERIFIED',  fileName: `${name}_PAN.pdf`,      fileSize: '245 KB', uploadedAt: '2026-04-01' },
  { id: 'd2', type: 'AADHAAR_FRONT',    label: 'Aadhaar Front',          status: 'UPLOADED',  fileName: `${name}_Aadhaar_F.jpg`, fileSize: '312 KB', uploadedAt: '2026-04-01' },
  { id: 'd3', type: 'AADHAAR_BACK',     label: 'Aadhaar Back',           status: 'UPLOADED',  fileName: `${name}_Aadhaar_B.jpg`, fileSize: '298 KB', uploadedAt: '2026-04-01' },
  { id: 'd4', type: 'BANK_STATEMENT',   label: 'Bank Statement (12M)',    status: 'PENDING' },
  { id: 'd5', type: 'CANCELLED_CHEQUE', label: 'Cancelled Cheque',       status: 'PENDING' },
  { id: 'd6', type: 'GST_CERTIFICATE',  label: 'GST Registration Cert.', status: 'PENDING' },
];

// ─── Underwriting reports ───────────────────────────────────────────────────

function makeUWReport(overrides: Partial<UnderwritingReport> = {}): UnderwritingReport {
  return {
    generatedAt: '2026-04-05T11:30:00Z',
    analyst: 'AI Engine v3.2 + Reviewed by Kavita Singh',
    financialYear: 'FY 2024-25',
    annualTurnover: 42_00_00000,       // ₹4.2 Cr
    gstTurnover: 38_00_00000,
    bankMAB: 4_20_00000,               // ₹4.2L MAB
    avgMonthlyCredit: 3_50_00000,
    bouncedCheques: 1,
    existingObligations: 45_00000,     // ₹45k/mo
    dscr: 1.82,
    debtToEquity: 0.72,
    workingCapitalDays: 38,
    bureauScore: 724,
    bureauHistory: [
      { account: 'CC-HDFC-2891', bank: 'HDFC Bank', outstanding: 2_50_00000, emi: 0, dpd: 0, status: 'CURRENT' },
      { account: 'HL-SBI-1204',  bank: 'SBI',       outstanding: 18_00_00000, emi: 22_00000, dpd: 0, status: 'CURRENT' },
      { account: 'VL-AXIS-0012', bank: 'Axis Bank',  outstanding: 0, emi: 0, dpd: 0, status: 'CLOSED' },
    ],
    riskFlags: ['Single-anchor dependency (UltraTech >80% business)', '1 cheque bounce in FY25 Q3'],
    positiveFactors: ['8-year business vintage', 'Consistent GST filing (all 12 months)', 'MAB covers 2x proposed EMI', 'Zero DPD in bureau', 'Strong anchor relationship'],
    aiNarrative: `The borrower demonstrates a strong credit profile with 8 years of established business in the cement distribution segment. Annual GST turnover of ₹3.8 Cr is consistent with declared ITR income, indicating clean reporting. Bank statement analysis shows average monthly credits of ₹3.5L with a healthy MAB of ₹4.2L, comfortably covering proposed EMI obligations.

Key risk consideration is single-anchor concentration (UltraTech >80% of revenues) which creates dependency risk. However, the anchor relationship is 6+ years old and the borrower is a Platinum-tier dealer, mitigating this risk. One cheque bounce was noted in Q3 FY25 (₹18,000) — classified as isolated incident with no recurrence.

DSCR of 1.82x is well above the internal threshold of 1.25x. Debt-to-equity ratio of 0.72 indicates conservative leverage. Working capital cycle of 38 days is efficient for this industry.

Bureau score of 724 reflects a prime borrower with no adverse history in the last 24 months. Two active credit facilities (CC and HL) are being serviced on time.

AI Risk Assessment: RECOMMEND APPROVAL with standard terms. No additional collateral required given program-level anchor guarantee structure.`,
    ...overrides,
  };
}

// ─── CAM Reports ───────────────────────────────────────────────────────────

function makeCAMReport(overrides: Partial<CamReport> = {}): CamReport {
  return {
    generatedAt: '2026-04-06T09:15:00Z',
    version: 'v1.0',
    executiveSummary: 'Credit facility recommended for approval under the UltraTech Dealer Financing Program. Borrower profile is satisfactory with strong repayment capacity and clean credit history.',
    aiRiskSummary: `This Credit Appraisal Memo was AI-generated by Claude (claude-sonnet-4-6) based on KYC data, bank statement analysis, GST records, and bureau reports.

**Borrower Creditworthiness:** STRONG — The applicant has demonstrated consistent financial performance over 3 years with growing revenues. Credit score of 724 places the borrower in the Prime category.

**Repayment Capacity:** ADEQUATE — DSCR of 1.82x comfortably covers proposed obligations. Monthly surplus of ₹2.1L after all EMI payments.

**Security Assessment:** ACCEPTABLE — Program-level first-loss guarantee from UltraTech Cement covers 20% of outstanding. No individual collateral required per program policy.

**Key Risks:** Single-anchor concentration risk is partially mitigated by the 6+ year anchor relationship and Platinum dealer status. Monitor for anchor payment delays which could impact cash cycle.

**AI Recommendation:** APPROVE at requested amount with 90-day tenor and 13.5% ROI as per program terms.`,
    sanctionedAmount: 50_00_00000,   // ₹50L
    roi: 13.5,
    tenorDays: 90,
    processingFee: 0.5,
    repaymentMode: 'eNACH Auto-debit',
    collateral: 'Nil (Program Guarantee)',
    guarantee: 'UltraTech Cement First-Loss 20%',
    riskScore: 74,
    riskGrade: 'A',
    scoreBreakdown: [
      { factor: 'Credit Score',          score: 18, maxScore: 20, comment: 'CIBIL 724 — Prime bracket' },
      { factor: 'Financial Performance', score: 16, maxScore: 20, comment: 'Revenue growth 18% YoY, consistent GST' },
      { factor: 'Repayment Capacity',    score: 15, maxScore: 20, comment: 'DSCR 1.82x, healthy MAB' },
      { factor: 'Anchor Relationship',   score: 14, maxScore: 20, comment: 'Platinum dealer, 6+ year relationship' },
      { factor: 'Collateral / Security', score: 11, maxScore: 20, comment: 'Program guarantee, no personal collateral' },
    ],
    specialConditions: [
      'Quarterly review of anchor payment behavior',
      'GST filing compliance — notify if any lapse',
      'Credit line renewable annually subject to satisfactory conduct',
      'eNACH mandate to be registered before first disbursement',
    ],
    creditDecision: 'APPROVE',
    ...overrides,
  };
}

// ─── Activity timeline helpers ──────────────────────────────────────────────

function makeActivity(entries: { action: string; from?: string; to?: string; note?: string; by: string; at: string }[]): MockActivity[] {
  return entries.map((e, i) => ({
    id: `act-${i}`,
    action: e.action,
    fromStatus: e.from,
    toStatus: e.to,
    note: e.note,
    performedBy: e.by,
    performedAt: e.at,
  }));
}

// ─── The 12 mock leads ──────────────────────────────────────────────────────

export const MOCK_LEADS: MockLead[] = [

  // ── UNDERWRITING QUEUE (1) ──────────────────────────────────────────────
  {
    id: 'ml-001',
    applicationNumber: 'APP-2026-0201',
    borrowerName: 'Vinod Agarwal',
    borrowerType: 'DEALER',
    businessName: 'Agarwal Cement Distributors',
    pan: 'ABCVA4567G',
    gstin: '27ABCVA4567G1ZQ',
    mobile: '9820445566',
    email: 'vinod@agarwalcement.com',
    manufacturerName: 'UltraTech Cement',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'DEALER_FINANCING',
    loanAmount: 75_00_00000,  // ₹75L
    businessVintage: 11,
    creditScore: 748,
    riskLevel: 'LOW',
    status: 'UNDERWRITING_QUEUE',
    createdAt: '2026-03-18T09:00:00Z',
    updatedAt: '2026-04-01T14:30:00Z',
    address: { line1: 'Shop 14, APMC Market', city: 'Nashik', state: 'Maharashtra', pincode: '422001' },
    assignedTo: 'Kavita Singh',
    documents: fullVerifiedDocs('Agarwal'),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Ravi Kumar', at: '2026-03-18T09:00:00Z' },
      { action: 'DOCUMENTS_REQUESTED', from: 'LEAD_CREATED', to: 'DOCUMENTS_PENDING', by: 'Ops Agent - Ravi Kumar', at: '2026-03-18T09:30:00Z' },
      { action: 'DOCUMENTS_SUBMITTED', from: 'DOCUMENTS_PENDING', to: 'DOCUMENTS_UPLOADED', by: 'System (WhatsApp Bot)', at: '2026-03-20T11:00:00Z' },
      { action: 'KYC_INITIATED', from: 'DOCUMENTS_UPLOADED', to: 'KYC_IN_PROGRESS', by: 'Ops Agent - Ravi Kumar', at: '2026-03-20T11:30:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', note: 'PAN, Aadhaar, GSTIN all verified. Face match passed.', by: 'AI Engine', at: '2026-03-21T08:15:00Z' },
      { action: 'SENT_TO_UNDERWRITING', from: 'KYC_VERIFIED', to: 'UNDERWRITING_QUEUE', by: 'Ops Agent - Ravi Kumar', at: '2026-04-01T14:30:00Z' },
    ]),
  },

  // ── UNDER REVIEW (2) ───────────────────────────────────────────────────
  {
    id: 'ml-002',
    applicationNumber: 'APP-2026-0189',
    borrowerName: 'Shalini Nair',
    borrowerType: 'DEALER',
    businessName: 'Nair Construction Supplies',
    pan: 'BCDNS8901H',
    gstin: '32BCDNS8901H1ZM',
    mobile: '9447223344',
    email: 'shalini@nairconst.com',
    manufacturerName: 'ACC Limited',
    anchorName: 'ACC Limited',
    programName: 'ACC Dealer Finance Program',
    productType: 'DEALER_FINANCING',
    loanAmount: 40_00_00000, // ₹40L
    businessVintage: 7,
    creditScore: 712,
    riskLevel: 'LOW',
    status: 'UNDER_REVIEW',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-04-03T16:00:00Z',
    address: { line1: '22/B Industrial Estate', city: 'Kochi', state: 'Kerala', pincode: '682301' },
    assignedTo: 'Kavita Singh',
    documents: fullVerifiedDocs('Nair'),
    underwritingReport: makeUWReport({
      bureauScore: 712,
      annualTurnover: 28_00_00000,
      dscr: 1.65,
      aiNarrative: `Shalini Nair operates Nair Construction Supplies, an established cement distributor with 7 years of business history in Kochi. The business maintains consistent dealings with ACC Limited as the primary anchor with secondary exposure to Ambuja.

Bank statement analysis reveals average monthly credits of ₹2.8L with a MAB of ₹3.1L over the 12-month review period. Two minor debit-return instances were observed (NACH returns) but both were resolved within 3 days, indicating temporary liquidity stress rather than systemic issues.

GST turnover of ₹24L is 14% lower than declared income — underwriter to verify reconciliation. Possible trade-to-trade discounts or B2B exempted supplies.

DSCR of 1.65x is above threshold. Existing vehicle loan EMI of ₹28,000/month is current. Bureau score of 712 is satisfactory.

AI Recommendation: RECOMMEND APPROVAL subject to clarification of GST-ITR gap. May proceed to CAM generation.`,
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Priya Sharma', at: '2026-03-10T10:00:00Z' },
      { action: 'DOCUMENTS_SUBMITTED', from: 'DOCUMENTS_PENDING', to: 'DOCUMENTS_UPLOADED', by: 'System', at: '2026-03-12T14:00:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-03-13T10:00:00Z' },
      { action: 'SENT_TO_UNDERWRITING', from: 'KYC_VERIFIED', to: 'UNDERWRITING_QUEUE', by: 'Ops Agent - Priya Sharma', at: '2026-03-28T09:00:00Z' },
      { action: 'UW_REPORT_GENERATED', from: 'UNDERWRITING_QUEUE', to: 'UNDER_REVIEW', note: 'AI underwriting report generated. Assigned to Kavita Singh.', by: 'AI Engine', at: '2026-04-03T16:00:00Z' },
    ]),
  },

  // ── PENNY DROP DONE (3) ────────────────────────────────────────────────
  {
    id: 'ml-003',
    applicationNumber: 'APP-2026-0172',
    borrowerName: 'Ramesh Gupta',
    borrowerType: 'DISTRIBUTOR',
    businessName: 'Gupta Cement Agency',
    pan: 'CEFGR2345J',
    gstin: '09CEFGR2345J1ZT',
    mobile: '9839112233',
    email: 'ramesh@guptacement.in',
    manufacturerName: 'Ambuja Cements',
    anchorName: 'Ambuja Cements',
    programName: 'Ambuja Channel Finance',
    productType: 'CHANNEL_FINANCING',
    loanAmount: 60_00_00000, // ₹60L
    businessVintage: 14,
    creditScore: 756,
    riskLevel: 'LOW',
    status: 'PENNY_DROP_DONE',
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-04-04T11:00:00Z',
    address: { line1: 'Plot 7, Transport Nagar', city: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001' },
    assignedTo: 'Kavita Singh',
    documents: fullVerifiedDocs('Gupta'),
    underwritingReport: makeUWReport({
      bureauScore: 756,
      annualTurnover: 68_00_00000,
      dscr: 2.1,
      bouncedCheques: 0,
      aiNarrative: `Ramesh Gupta runs Gupta Cement Agency, one of the largest Ambuja distributors in the Kanpur region with 14 years of continuous operation. Annual turnover of ₹6.8 Cr is well-documented with ITR and GST records fully reconciled.

Bank analysis shows excellent MAB of ₹8.2L against proposed EMI of ₹2.2L. Zero bounce history across the review period. DSCR of 2.1x is among the highest in this program cohort.

Bureau score of 756 is in the Prime+ bracket. No adverse remarks, no DPD, 3 credit facilities all current. The applicant owns the business premises (shop) free of mortgage — additional comfort factor.

Penny drop completed successfully — bank account verified and active.

AI Recommendation: STRONG APPROVAL candidate. Recommend proceeding to CAM generation at full requested limit.`,
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Amit Patel', at: '2026-03-05T08:00:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-03-08T09:30:00Z' },
      { action: 'SENT_TO_UNDERWRITING', from: 'KYC_VERIFIED', to: 'UNDERWRITING_QUEUE', by: 'Ops Agent - Amit Patel', at: '2026-03-20T10:00:00Z' },
      { action: 'UNDER_REVIEW', from: 'UNDERWRITING_QUEUE', to: 'UNDER_REVIEW', by: 'Kavita Singh', at: '2026-03-25T14:00:00Z' },
      { action: 'PENNY_DROP_DONE', from: 'UNDER_REVIEW', to: 'PENNY_DROP_DONE', note: 'Penny drop ₹1 credited and confirmed. Account: SBIN0012345.', by: 'System', at: '2026-04-04T11:00:00Z' },
    ]),
  },

  // ── CAM GENERATED (4) ─────────────────────────────────────────────────
  {
    id: 'ml-004',
    applicationNumber: 'APP-2026-0155',
    borrowerName: 'Deepika Rathore',
    borrowerType: 'DEALER',
    businessName: 'Rathore Building Solutions',
    pan: 'DFGDR6789K',
    gstin: '08DFGDR6789K1ZR',
    mobile: '9414667788',
    email: 'deepika@rathorebuild.com',
    manufacturerName: 'Shree Cement',
    anchorName: 'Shree Cement',
    programName: 'Shree Dealer Program FY26',
    productType: 'DEALER_FINANCING',
    loanAmount: 35_00_00000, // ₹35L
    businessVintage: 9,
    creditScore: 731,
    riskLevel: 'LOW',
    status: 'CAM_GENERATED',
    createdAt: '2026-02-28T11:00:00Z',
    updatedAt: '2026-04-05T15:30:00Z',
    address: { line1: '11 Tonk Road, Jaipur', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
    assignedTo: 'Kavita Singh',
    documents: fullVerifiedDocs('Rathore'),
    underwritingReport: makeUWReport({ bureauScore: 731, annualTurnover: 34_00_00000, dscr: 1.72 }),
    camReport: makeCAMReport({
      generatedAt: '2026-04-05T15:30:00Z',
      sanctionedAmount: 35_00_00000,
      roi: 15.0,
      riskScore: 71,
      riskGrade: 'A',
      creditDecision: 'APPROVE',
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Priya Sharma', at: '2026-02-28T11:00:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-03-03T10:00:00Z' },
      { action: 'SENT_TO_UNDERWRITING', from: 'KYC_VERIFIED', to: 'UNDERWRITING_QUEUE', by: 'Ops Agent - Priya Sharma', at: '2026-03-15T09:00:00Z' },
      { action: 'PENNY_DROP_DONE', from: 'UNDER_REVIEW', to: 'PENNY_DROP_DONE', by: 'System', at: '2026-03-28T14:00:00Z' },
      { action: 'CAM_GENERATED', from: 'PENNY_DROP_DONE', to: 'CAM_GENERATED', note: 'CAM auto-generated by AI. Score: 71/100. Grade: A.', by: 'AI Engine (claude-sonnet-4-6)', at: '2026-04-05T15:30:00Z' },
    ]),
  },

  // ── CAM GENERATED (5) ─────────────────────────────────────────────────
  {
    id: 'ml-005',
    applicationNumber: 'APP-2026-0141',
    borrowerName: 'Harish Bansal',
    borrowerType: 'RETAILER',
    businessName: 'Bansal Hardware & Cement',
    pan: 'EFGHB0123L',
    gstin: '06EFGHB0123L1ZS',
    mobile: '9315889900',
    email: 'harish@bansalhardware.com',
    manufacturerName: 'UltraTech Cement',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'WORKING_CAPITAL',
    loanAmount: 25_00_00000, // ₹25L
    businessVintage: 6,
    creditScore: 698,
    riskLevel: 'MEDIUM',
    status: 'CAM_GENERATED',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-04-06T10:00:00Z',
    address: { line1: '45 Sector 14 Market', city: 'Gurugram', state: 'Haryana', pincode: '122001' },
    assignedTo: 'Kavita Singh',
    documents: fullVerifiedDocs('Bansal'),
    underwritingReport: makeUWReport({ bureauScore: 698, annualTurnover: 18_00_00000, dscr: 1.41, riskFlags: ['Credit score sub-700', 'Revenue dip in FY24 (COVID recovery)'] }),
    camReport: makeCAMReport({
      generatedAt: '2026-04-06T10:00:00Z',
      sanctionedAmount: 20_00_00000,  // reduced from 25L to 20L
      roi: 14.5,
      riskScore: 61,
      riskGrade: 'B+',
      creditDecision: 'APPROVE',
      executiveSummary: 'Conditional approval recommended at reduced limit of ₹20L (vs. ₹25L requested) given sub-700 credit score and DSCR just above threshold. Borrower profile is satisfactory with improving revenue trajectory.',
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Ravi Kumar', at: '2026-03-01T10:00:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-03-04T12:00:00Z' },
      { action: 'ADDITIONAL_DOCS_REQUIRED', note: 'Additional 2 years ITR requested for credit score verification.', by: 'Underwriter - Kavita Singh', at: '2026-03-20T15:00:00Z' },
      { action: 'DOCS_RESUBMITTED', note: 'ITR FY22-23 and FY23-24 uploaded.', by: 'System', at: '2026-03-25T10:00:00Z' },
      { action: 'CAM_GENERATED', from: 'PENNY_DROP_DONE', to: 'CAM_GENERATED', note: 'CAM generated. Score 61/100. Recommend ₹20L vs ₹25L requested.', by: 'AI Engine (claude-sonnet-4-6)', at: '2026-04-06T10:00:00Z' },
    ]),
  },

  // ── APPROVED (6) ──────────────────────────────────────────────────────
  {
    id: 'ml-006',
    applicationNumber: 'APP-2026-0128',
    borrowerName: 'Sunita Yadav',
    borrowerType: 'DEALER',
    businessName: 'Yadav Cement Suppliers',
    pan: 'FGHSY4567M',
    gstin: '09FGHSY4567M1ZP',
    mobile: '9839334455',
    email: 'sunita@yadavcement.com',
    manufacturerName: 'ACC Limited',
    anchorName: 'ACC Limited',
    programName: 'ACC Dealer Finance Program',
    productType: 'DEALER_FINANCING',
    loanAmount: 50_00_00000, // ₹50L
    businessVintage: 12,
    creditScore: 762,
    riskLevel: 'LOW',
    status: 'APPROVED',
    createdAt: '2026-02-15T09:00:00Z',
    updatedAt: '2026-04-07T11:00:00Z',
    address: { line1: '7 Civil Lines', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
    assignedTo: 'Priya Sharma',
    documents: fullVerifiedDocs('Yadav'),
    underwritingReport: makeUWReport({ bureauScore: 762, annualTurnover: 56_00_00000, dscr: 2.2 }),
    camReport: makeCAMReport({
      generatedAt: '2026-04-02T14:00:00Z',
      sanctionedAmount: 50_00_00000,
      roi: 14.0,
      riskScore: 78,
      riskGrade: 'A',
      creditDecision: 'APPROVE',
      approvedBy: 'Priya Sharma (Credit Manager)',
      approvedAt: '2026-04-07T11:00:00Z',
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Amit Patel', at: '2026-02-15T09:00:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-02-19T10:00:00Z' },
      { action: 'PENNY_DROP_DONE', by: 'System', at: '2026-03-10T11:00:00Z' },
      { action: 'CAM_GENERATED', from: 'PENNY_DROP_DONE', to: 'CAM_GENERATED', by: 'AI Engine', at: '2026-04-02T14:00:00Z' },
      { action: 'APPROVED', from: 'CAM_GENERATED', to: 'APPROVED', note: 'Approved at full requested limit. Risk score 78/100. Grade A.', by: 'Priya Sharma (Credit Manager)', at: '2026-04-07T11:00:00Z' },
    ]),
  },

  // ── APPROVED (7) ──────────────────────────────────────────────────────
  {
    id: 'ml-007',
    applicationNumber: 'APP-2026-0109',
    borrowerName: 'Arjun Singh Tomar',
    borrowerType: 'DISTRIBUTOR',
    businessName: 'Tomar Infra Distributors',
    pan: 'GHIJT5678N',
    gstin: '07GHIJT5678N1ZU',
    mobile: '9911556677',
    email: 'arjun@tomarinfra.com',
    manufacturerName: 'Ambuja Cements',
    anchorName: 'Ambuja Cements',
    programName: 'Ambuja Channel Finance',
    productType: 'CHANNEL_FINANCING',
    loanAmount: 1_00_00_00000, // ₹1 Cr
    businessVintage: 18,
    creditScore: 779,
    riskLevel: 'LOW',
    status: 'APPROVED',
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-04-06T16:00:00Z',
    address: { line1: 'B-12 Okhla Industrial Area', city: 'New Delhi', state: 'Delhi', pincode: '110020' },
    assignedTo: 'Priya Sharma',
    documents: fullVerifiedDocs('Tomar'),
    underwritingReport: makeUWReport({ bureauScore: 779, annualTurnover: 1_20_00_00000, dscr: 2.8, bouncedCheques: 0 }),
    camReport: makeCAMReport({
      generatedAt: '2026-03-28T10:00:00Z',
      sanctionedAmount: 1_00_00_00000,
      roi: 12.75,
      riskScore: 82,
      riskGrade: 'A+',
      creditDecision: 'APPROVE',
      approvedBy: 'Priya Sharma (Credit Manager)',
      approvedAt: '2026-04-06T16:00:00Z',
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Amit Patel', at: '2026-02-01T10:00:00Z' },
      { action: 'KYC_VERIFIED', from: 'KYC_IN_PROGRESS', to: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-02-05T08:00:00Z' },
      { action: 'CAM_GENERATED', from: 'PENNY_DROP_DONE', to: 'CAM_GENERATED', by: 'AI Engine', at: '2026-03-28T10:00:00Z' },
      { action: 'APPROVED', from: 'CAM_GENERATED', to: 'APPROVED', note: 'Approved at ₹1Cr. Risk 82/100. Grade A+. Exceptional profile.', by: 'Priya Sharma (Credit Manager)', at: '2026-04-06T16:00:00Z' },
    ]),
  },

  // ── APPROVED (8) ──────────────────────────────────────────────────────
  {
    id: 'ml-008',
    applicationNumber: 'APP-2026-0093',
    borrowerName: 'Kavitha Reddy',
    borrowerType: 'DEALER',
    businessName: 'Reddy Building Materials',
    pan: 'HIJKR9012O',
    gstin: '36HIJKR9012O1ZV',
    mobile: '9849778899',
    email: 'kavitha@reddybuild.com',
    manufacturerName: 'UltraTech Cement',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'DEALER_FINANCING',
    loanAmount: 45_00_00000, // ₹45L
    businessVintage: 10,
    creditScore: 741,
    riskLevel: 'LOW',
    status: 'APPROVED',
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: '2026-04-05T14:00:00Z',
    address: { line1: '22 Begumpet Main Road', city: 'Hyderabad', state: 'Telangana', pincode: '500016' },
    assignedTo: 'Priya Sharma',
    documents: fullVerifiedDocs('Reddy'),
    underwritingReport: makeUWReport({ bureauScore: 741, annualTurnover: 52_00_00000, dscr: 1.95 }),
    camReport: makeCAMReport({
      generatedAt: '2026-04-01T11:00:00Z',
      sanctionedAmount: 45_00_00000,
      roi: 13.5,
      riskScore: 75,
      riskGrade: 'A',
      creditDecision: 'APPROVE',
      approvedBy: 'Priya Sharma (Credit Manager)',
      approvedAt: '2026-04-05T14:00:00Z',
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Ravi Kumar', at: '2026-02-10T11:00:00Z' },
      { action: 'KYC_VERIFIED', by: 'AI Engine', at: '2026-02-13T09:00:00Z' },
      { action: 'CAM_GENERATED', by: 'AI Engine', at: '2026-04-01T11:00:00Z' },
      { action: 'APPROVED', from: 'CAM_GENERATED', to: 'APPROVED', note: 'Approved. Score 75/100. Grade A.', by: 'Priya Sharma (Credit Manager)', at: '2026-04-05T14:00:00Z' },
    ]),
  },

  // ── REJECTED (9) ──────────────────────────────────────────────────────
  {
    id: 'ml-009',
    applicationNumber: 'APP-2026-0078',
    borrowerName: 'Mahesh Joshi',
    borrowerType: 'RETAILER',
    businessName: 'Joshi Cement & Hardware',
    pan: 'IJKLM3456P',
    mobile: '9801234567',
    manufacturerName: 'Shree Cement',
    anchorName: 'Shree Cement',
    programName: 'Shree Dealer Program FY26',
    productType: 'DEALER_FINANCING',
    loanAmount: 20_00_00000, // ₹20L
    businessVintage: 3,
    creditScore: 598,
    riskLevel: 'HIGH',
    status: 'REJECTED',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-04-04T10:00:00Z',
    address: { line1: 'Near Bus Stand', city: 'Jodhpur', state: 'Rajasthan', pincode: '342001' },
    assignedTo: 'Kavita Singh',
    documents: partialDocs('Joshi'),
    camReport: makeCAMReport({
      generatedAt: '2026-04-03T09:00:00Z',
      riskScore: 38,
      riskGrade: 'D',
      creditDecision: 'REJECT',
      executiveSummary: 'Application rejected due to sub-600 credit score, insufficient business vintage (3 years vs. 5-year minimum), and two DPD-30 instances in bureau history. Reapply after 12 months with improved credit history.',
      aiRiskSummary: 'High risk profile. Credit score 598, 2× DPD-30 in last 18 months, business vintage below program threshold. Income documentation insufficient — GST and ITR show 40% gap. Not recommended for credit at this time.',
    }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Ravi Kumar', at: '2026-03-01T09:00:00Z' },
      { action: 'REJECTED', from: 'CAM_GENERATED', to: 'REJECTED', note: 'Rejected: Credit score 598 (min 650), business vintage 3yr (min 5yr), 2× DPD-30.', by: 'Priya Sharma (Credit Manager)', at: '2026-04-04T10:00:00Z' },
    ]),
  },

  // ── DISBURSED (10) ────────────────────────────────────────────────────
  {
    id: 'ml-010',
    applicationNumber: 'APP-2025-0041',
    borrowerName: 'Rajesh Kumar Sharma',
    borrowerType: 'DEALER',
    businessName: 'Sharma Cement Traders',
    pan: 'ABCRS1234K',
    gstin: '27ABCRS1234K1ZX',
    mobile: '9820112233',
    email: 'rajesh@sharmacements.com',
    manufacturerName: 'UltraTech Cement',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'DEALER_FINANCING',
    loanAmount: 50_00_00000, // ₹50L (Credit line cl-001)
    businessVintage: 8,
    creditScore: 742,
    riskLevel: 'LOW',
    status: 'DISBURSED',
    createdAt: '2025-09-01T09:00:00Z',
    updatedAt: '2025-09-15T14:00:00Z',
    address: { line1: 'Shop 4, Cement Market', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    assignedTo: 'Priya Sharma',
    documents: fullVerifiedDocs('Sharma'),
    underwritingReport: makeUWReport({ bureauScore: 742 }),
    camReport: makeCAMReport({ sanctionedAmount: 50_00_00000, roi: 13.5, approvedBy: 'Priya Sharma', approvedAt: '2025-09-12T11:00:00Z', creditDecision: 'APPROVE' }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', by: 'Ops Agent', at: '2025-09-01T09:00:00Z' },
      { action: 'APPROVED', by: 'Priya Sharma', at: '2025-09-12T11:00:00Z' },
      { action: 'DISBURSED', from: 'DISBURSEMENT_INITIATED', to: 'DISBURSED', note: 'Credit line activated. ₹5Cr limit. Disbursements via invoice-based SCF.', by: 'System', at: '2025-09-15T14:00:00Z' },
    ]),
  },

  // ── DISBURSED (11) ────────────────────────────────────────────────────
  {
    id: 'ml-011',
    applicationNumber: 'APP-2025-0058',
    borrowerName: 'Priya Mehta',
    borrowerType: 'DEALER',
    businessName: 'Mehta Building Materials',
    pan: 'BCDPM5678L',
    gstin: '24BCDPM5678L1ZY',
    mobile: '9022445566',
    email: 'priya@mehtabuild.com',
    manufacturerName: 'ACC Limited',
    anchorName: 'ACC Limited',
    programName: 'ACC Dealer Finance Program',
    productType: 'DEALER_FINANCING',
    loanAmount: 25_00_00000, // ₹25L (Credit line cl-002)
    businessVintage: 5,
    creditScore: 718,
    riskLevel: 'LOW',
    status: 'DISBURSED',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-10-02T14:00:00Z',
    address: { line1: '33 Industrial Area', city: 'Surat', state: 'Gujarat', pincode: '395003' },
    assignedTo: 'Priya Sharma',
    documents: fullVerifiedDocs('Mehta'),
    underwritingReport: makeUWReport({ bureauScore: 718 }),
    camReport: makeCAMReport({ sanctionedAmount: 25_00_00000, roi: 14.0, approvedBy: 'Priya Sharma', approvedAt: '2025-09-30T11:00:00Z', creditDecision: 'APPROVE' }),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', by: 'Ops Agent', at: '2025-09-20T10:00:00Z' },
      { action: 'APPROVED', by: 'Priya Sharma', at: '2025-09-30T11:00:00Z' },
      { action: 'DISBURSED', note: 'Credit line activated. ₹2.5Cr limit.', by: 'System', at: '2025-10-02T14:00:00Z' },
    ]),
  },

  // ── LEAD CREATED / DOCS PENDING (12) ──────────────────────────────────
  {
    id: 'ml-012',
    applicationNumber: 'APP-2026-0215',
    borrowerName: 'Pooja Khanna',
    borrowerType: 'RETAILER',
    businessName: 'Khanna Cement Stores',
    pan: 'JKLPK7890Q',
    mobile: '9876554433',
    manufacturerName: 'UltraTech Cement',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'WORKING_CAPITAL',
    loanAmount: 15_00_00000, // ₹15L
    businessVintage: 4,
    creditScore: 667,
    riskLevel: 'MEDIUM',
    status: 'DOCUMENTS_PENDING',
    createdAt: '2026-04-08T10:00:00Z',
    updatedAt: '2026-04-08T10:30:00Z',
    address: { line1: 'Main Market, Sector 22', city: 'Chandigarh', state: 'Punjab', pincode: '160022' },
    assignedTo: 'Ravi Kumar',
    documents: partialDocs('Khanna'),
    activity: makeActivity([
      { action: 'APPLICATION_CREATED', to: 'LEAD_CREATED', by: 'Ops Agent - Ravi Kumar', at: '2026-04-08T10:00:00Z' },
      { action: 'DOCUMENTS_REQUESTED', from: 'LEAD_CREATED', to: 'DOCUMENTS_PENDING', by: 'Ops Agent - Ravi Kumar', at: '2026-04-08T10:30:00Z' },
    ]),
  },
];

// ─── Accessor hooks ─────────────────────────────────────────────────────────

export function useMockLeads(filters?: { status?: string; search?: string }) {
  let results = [...MOCK_LEADS];
  if (filters?.status) {
    results = results.filter((l) => l.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.borrowerName.toLowerCase().includes(q) ||
        l.businessName.toLowerCase().includes(q) ||
        l.applicationNumber.toLowerCase().includes(q) ||
        l.pan.toLowerCase().includes(q),
    );
  }
  return { data: results, total: results.length, isLoading: false };
}

export function useMockLead(id: string) {
  return { data: MOCK_LEADS.find((l) => l.id === id) ?? null, isLoading: false };
}
