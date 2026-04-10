export type CreditLineStatus = 'ACTIVATED' | 'SUSPENDED' | 'CLOSED' | 'PENDING_ACTIVATION';

export interface CreditLine {
  id: string;
  borrowerName: string;
  businessName: string;
  pan: string;
  mobile: string;
  anchorName: string;
  programName: string;
  productType: string;
  sanctionedLimit: number; // paise (rupees × 100)
  utilizedAmount: number;
  availableLimit: number;
  status: CreditLineStatus;
  activatedAt: string;
  expiresAt: string;
  roi: number;
  tenorDays: number;
  creditScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  disbursementAccount: { bank: string; accountNo: string; ifsc: string };
  totalInvoices: number;
  totalDisbursed: number;
  overdueAmount: number;
  applicationNumber: string;
}

// Helper: rupees → paise
const cr = (crore: number) => crore * 10_000_000 * 100;   // 1 Cr = ₹1,00,00,000 = 1,00,00,000×100 paise
const lakh = (l: number) => l * 100_000 * 100;             // 1 L  = ₹1,00,000

const CREDIT_LINES: CreditLine[] = [
  {
    id: 'cl-001',
    borrowerName: 'Rajesh Kumar Sharma',
    businessName: 'Sharma Cement Traders',
    pan: 'ABCRS1234K',
    mobile: '9820112233',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'DEALER_FINANCING',
    sanctionedLimit: cr(5),         // ₹5 Cr
    utilizedAmount:  cr(3.2),       // ₹3.2 Cr
    availableLimit:  cr(1.8),       // ₹1.8 Cr
    status: 'ACTIVATED',
    activatedAt: '2025-09-15T10:30:00Z',
    expiresAt:   '2026-09-14T23:59:59Z',
    roi: 13.5,
    tenorDays: 90,
    creditScore: 742,
    riskLevel: 'LOW',
    disbursementAccount: { bank: 'HDFC Bank', accountNo: 'XXXX3892', ifsc: 'HDFC0001234' },
    totalInvoices: 18,
    totalDisbursed: cr(8.4),        // ₹8.4 Cr cumulative
    overdueAmount: 0,
    applicationNumber: 'APP-2025-0041',
  },
  {
    id: 'cl-002',
    borrowerName: 'Priya Mehta',
    businessName: 'Mehta Building Materials',
    pan: 'BCDPM5678L',
    mobile: '9022445566',
    anchorName: 'ACC Limited',
    programName: 'ACC Dealer Finance Program',
    productType: 'DEALER_FINANCING',
    sanctionedLimit: cr(2.5),
    utilizedAmount:  cr(1.1),
    availableLimit:  cr(1.4),
    status: 'ACTIVATED',
    activatedAt: '2025-10-02T14:00:00Z',
    expiresAt:   '2026-10-01T23:59:59Z',
    roi: 14.0,
    tenorDays: 60,
    creditScore: 718,
    riskLevel: 'LOW',
    disbursementAccount: { bank: 'ICICI Bank', accountNo: 'XXXX7741', ifsc: 'ICIC0002345' },
    totalInvoices: 11,
    totalDisbursed: cr(3.6),
    overdueAmount: 0,
    applicationNumber: 'APP-2025-0058',
  },
  {
    id: 'cl-003',
    borrowerName: 'Suresh Patel',
    businessName: 'Patel Infra Supplies Pvt Ltd',
    pan: 'CDESP9012M',
    mobile: '7890334455',
    anchorName: 'Ambuja Cements',
    programName: 'Ambuja Channel Finance',
    productType: 'CHANNEL_FINANCING',
    sanctionedLimit: cr(7.5),
    utilizedAmount:  cr(5.9),
    availableLimit:  cr(1.6),
    status: 'ACTIVATED',
    activatedAt: '2025-08-20T09:00:00Z',
    expiresAt:   '2026-08-19T23:59:59Z',
    roi: 12.75,
    tenorDays: 90,
    creditScore: 761,
    riskLevel: 'LOW',
    disbursementAccount: { bank: 'Axis Bank', accountNo: 'XXXX5523', ifsc: 'UTIB0003456' },
    totalInvoices: 29,
    totalDisbursed: cr(19.2),
    overdueAmount: 0,
    applicationNumber: 'APP-2025-0022',
  },
  {
    id: 'cl-004',
    borrowerName: 'Anita Desai',
    businessName: 'Desai Construction Traders',
    pan: 'DEFAD3456N',
    mobile: '9414556677',
    anchorName: 'Shree Cement',
    programName: 'Shree Dealer Program FY26',
    productType: 'DEALER_FINANCING',
    sanctionedLimit: cr(1),
    utilizedAmount:  lakh(82),
    availableLimit:  lakh(18),
    status: 'ACTIVATED',
    activatedAt: '2025-11-05T11:15:00Z',
    expiresAt:   '2026-11-04T23:59:59Z',
    roi: 15.0,
    tenorDays: 45,
    creditScore: 685,
    riskLevel: 'MEDIUM',
    disbursementAccount: { bank: 'SBI', accountNo: 'XXXX1198', ifsc: 'SBIN0004567' },
    totalInvoices: 7,
    totalDisbursed: cr(2.1),
    overdueAmount: lakh(2.2),       // ₹2.2L overdue
    applicationNumber: 'APP-2025-0094',
  },
  {
    id: 'cl-005',
    borrowerName: 'Mohammed Idrisi',
    businessName: 'Idrisi Wholesale Cement',
    pan: 'EFGMI7890P',
    mobile: '9833778899',
    anchorName: 'UltraTech Cement',
    programName: 'UltraTech Dealer Financing FY26',
    productType: 'WORKING_CAPITAL',
    sanctionedLimit: cr(3.5),
    utilizedAmount:  lakh(98),
    availableLimit:  cr(2.52),
    status: 'ACTIVATED',
    activatedAt: '2025-12-10T08:30:00Z',
    expiresAt:   '2026-12-09T23:59:59Z',
    roi: 13.0,
    tenorDays: 90,
    creditScore: 729,
    riskLevel: 'LOW',
    disbursementAccount: { bank: 'Kotak Mahindra Bank', accountNo: 'XXXX4467', ifsc: 'KKBK0005678' },
    totalInvoices: 5,
    totalDisbursed: cr(3.2),
    overdueAmount: 0,
    applicationNumber: 'APP-2025-0117',
  },
];

export function useCreditLines() {
  return { data: CREDIT_LINES, isLoading: false };
}

export function useCreditLine(id: string) {
  return { data: CREDIT_LINES.find((cl) => cl.id === id), isLoading: false };
}
