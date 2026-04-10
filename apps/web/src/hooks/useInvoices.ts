export type InvoiceStatus =
  | 'PENDING_VERIFICATION'
  | 'AUTO_APPROVED'
  | 'MANUAL_REVIEW'
  | 'REJECTED'
  | 'DISBURSED'
  | 'REPAID';

export type VerificationFlag = 'AMOUNT_MISMATCH' | 'DUPLICATE' | 'BUYER_NOT_FOUND' | 'LIMIT_EXCEEDED' | 'SUSPICIOUS_PATTERN';

export interface Invoice {
  id: string;
  invoiceNo: string;
  creditLineId: string;
  borrowerName: string;
  businessName: string;
  anchorName: string;
  invoiceAmount: number; // paise
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  autoVerified: boolean;
  flags: VerificationFlag[];
  disbursedAt?: string;
  repaidAt?: string;
  tenor: number; // days
  interestAmount?: number; // paise
  rejectionReason?: string;
  poNumber?: string;
  goodsDescription: string;
  reviewNote?: string;
}

const INVOICES: Invoice[] = [
  // Sharma Cement Traders — CL-001 (UltraTech)
  {
    id: 'inv-001',
    invoiceNo: 'UTC/2025-26/INV/4521',
    creditLineId: 'cl-001',
    borrowerName: 'Rajesh Kumar Sharma',
    businessName: 'Sharma Cement Traders',
    anchorName: 'UltraTech Cement',
    invoiceAmount: 450000_00,
    invoiceDate: '2026-04-07T08:00:00Z',
    dueDate: '2026-07-06T00:00:00Z',
    status: 'PENDING_VERIFICATION',
    autoVerified: false,
    flags: [],
    tenor: 90,
    goodsDescription: 'OPC 53 Grade Cement — 900 bags',
    poNumber: 'PO-UTC-2026-0887',
  },
  {
    id: 'inv-002',
    invoiceNo: 'UTC/2025-26/INV/4389',
    creditLineId: 'cl-001',
    borrowerName: 'Rajesh Kumar Sharma',
    businessName: 'Sharma Cement Traders',
    anchorName: 'UltraTech Cement',
    invoiceAmount: 680000_00,
    invoiceDate: '2026-04-05T10:30:00Z',
    dueDate: '2026-07-04T00:00:00Z',
    status: 'DISBURSED',
    autoVerified: true,
    flags: [],
    disbursedAt: '2026-04-05T14:22:00Z',
    tenor: 90,
    interestAmount: 22950_00,
    goodsDescription: 'PPC Cement — 1360 bags + RMC Mix',
    poNumber: 'PO-UTC-2026-0851',
  },
  {
    id: 'inv-003',
    invoiceNo: 'UTC/2025-26/INV/4102',
    creditLineId: 'cl-001',
    borrowerName: 'Rajesh Kumar Sharma',
    businessName: 'Sharma Cement Traders',
    anchorName: 'UltraTech Cement',
    invoiceAmount: 320000_00,
    invoiceDate: '2026-03-20T09:00:00Z',
    dueDate: '2026-06-18T00:00:00Z',
    status: 'REPAID',
    autoVerified: true,
    flags: [],
    disbursedAt: '2026-03-20T13:00:00Z',
    repaidAt: '2026-04-02T10:15:00Z',
    tenor: 90,
    interestAmount: 10800_00,
    goodsDescription: 'OPC 43 Grade Cement — 640 bags',
    poNumber: 'PO-UTC-2026-0712',
  },

  // Mehta Building Materials — CL-002 (ACC)
  {
    id: 'inv-004',
    invoiceNo: 'ACC/FY26/INV/2211',
    creditLineId: 'cl-002',
    borrowerName: 'Priya Mehta',
    businessName: 'Mehta Building Materials',
    anchorName: 'ACC Limited',
    invoiceAmount: 290000_00,
    invoiceDate: '2026-04-08T07:45:00Z',
    dueDate: '2026-06-07T00:00:00Z',
    status: 'PENDING_VERIFICATION',
    autoVerified: false,
    flags: [],
    tenor: 60,
    goodsDescription: 'ACC Gold Cement — 580 bags',
    poNumber: 'PO-ACC-2026-1034',
  },
  {
    id: 'inv-005',
    invoiceNo: 'ACC/FY26/INV/1988',
    creditLineId: 'cl-002',
    borrowerName: 'Priya Mehta',
    businessName: 'Mehta Building Materials',
    anchorName: 'ACC Limited',
    invoiceAmount: 1600000_00,  // ₹16L — would exceed available ₹14L
    invoiceDate: '2026-04-07T12:00:00Z',
    dueDate: '2026-06-06T00:00:00Z',
    status: 'MANUAL_REVIEW',
    autoVerified: false,
    flags: ['LIMIT_EXCEEDED'],
    tenor: 60,
    goodsDescription: 'ACC Suraksha Cement — bulk order 3200 bags',
    poNumber: 'PO-ACC-2026-1021',
    reviewNote: 'Invoice amount ₹16L exceeds available limit ₹14L. Escalated for credit manager review.',
  },
  {
    id: 'inv-006',
    invoiceNo: 'ACC/FY26/INV/1756',
    creditLineId: 'cl-002',
    borrowerName: 'Priya Mehta',
    businessName: 'Mehta Building Materials',
    anchorName: 'ACC Limited',
    invoiceAmount: 410000_00,
    invoiceDate: '2026-04-01T09:00:00Z',
    dueDate: '2026-05-31T00:00:00Z',
    status: 'DISBURSED',
    autoVerified: true,
    flags: [],
    disbursedAt: '2026-04-01T15:30:00Z',
    tenor: 60,
    interestAmount: 9523_00,
    goodsDescription: 'ACC Gold Cement — 820 bags',
    poNumber: 'PO-ACC-2026-0934',
  },

  // Patel Infra Supplies — CL-003 (Ambuja)
  {
    id: 'inv-007',
    invoiceNo: 'AMB/2026/INV/3341',
    creditLineId: 'cl-003',
    borrowerName: 'Suresh Patel',
    businessName: 'Patel Infra Supplies Pvt Ltd',
    anchorName: 'Ambuja Cements',
    invoiceAmount: 850000_00,
    invoiceDate: '2026-04-08T06:30:00Z',
    dueDate: '2026-07-07T00:00:00Z',
    status: 'AUTO_APPROVED',
    autoVerified: true,
    flags: [],
    tenor: 90,
    interestAmount: 28688_00,
    goodsDescription: 'Ambuja Plus Cement — 1700 bags',
    poNumber: 'PO-AMB-2026-2201',
  },
  {
    id: 'inv-008',
    invoiceNo: 'AMB/2026/INV/3109',
    creditLineId: 'cl-003',
    borrowerName: 'Suresh Patel',
    businessName: 'Patel Infra Supplies Pvt Ltd',
    anchorName: 'Ambuja Cements',
    invoiceAmount: 320000_00,
    invoiceDate: '2026-04-03T10:00:00Z',
    dueDate: '2026-07-02T00:00:00Z',
    status: 'REJECTED',
    autoVerified: false,
    flags: ['DUPLICATE'],
    tenor: 90,
    goodsDescription: 'Ambuja Cool Walls — 640 bags',
    rejectionReason: 'Duplicate invoice detected. INV/3109 matches previously processed AMB/2026/INV/3041 (same PO, amount, date range).',
    poNumber: 'PO-AMB-2026-2041',
  },
  {
    id: 'inv-009',
    invoiceNo: 'AMB/2026/INV/2987',
    creditLineId: 'cl-003',
    borrowerName: 'Suresh Patel',
    businessName: 'Patel Infra Supplies Pvt Ltd',
    anchorName: 'Ambuja Cements',
    invoiceAmount: 1200000_00,
    invoiceDate: '2026-03-25T08:00:00Z',
    dueDate: '2026-06-23T00:00:00Z',
    status: 'DISBURSED',
    autoVerified: true,
    flags: [],
    disbursedAt: '2026-03-25T13:45:00Z',
    tenor: 90,
    interestAmount: 40500_00,
    goodsDescription: 'Ambuja Plus Cement — 2400 bags + logistics',
    poNumber: 'PO-AMB-2026-1987',
  },

  // Desai Construction — CL-004 (Shree)
  {
    id: 'inv-010',
    invoiceNo: 'SHR/FY26/INV/0891',
    creditLineId: 'cl-004',
    borrowerName: 'Anita Desai',
    businessName: 'Desai Construction Traders',
    anchorName: 'Shree Cement',
    invoiceAmount: 195000_00,
    invoiceDate: '2026-04-08T09:15:00Z',
    dueDate: '2026-05-23T00:00:00Z',
    status: 'MANUAL_REVIEW',
    autoVerified: false,
    flags: ['SUSPICIOUS_PATTERN'],
    tenor: 45,
    goodsDescription: 'Shree Jung Rodhak Cement — 390 bags',
    poNumber: 'PO-SHR-2026-0761',
    reviewNote: 'Third invoice in 5 days. Pattern flagged for review — verify genuine supply chain activity.',
  },
  {
    id: 'inv-011',
    invoiceNo: 'SHR/FY26/INV/0812',
    creditLineId: 'cl-004',
    borrowerName: 'Anita Desai',
    businessName: 'Desai Construction Traders',
    anchorName: 'Shree Cement',
    invoiceAmount: 175000_00,
    invoiceDate: '2026-04-06T08:00:00Z',
    dueDate: '2026-05-21T00:00:00Z',
    status: 'DISBURSED',
    autoVerified: true,
    flags: [],
    disbursedAt: '2026-04-06T16:00:00Z',
    tenor: 45,
    interestAmount: 2953_00,
    goodsDescription: 'Shree Cement — 350 bags',
    poNumber: 'PO-SHR-2026-0712',
  },

  // Idrisi Wholesale — CL-005 (UltraTech)
  {
    id: 'inv-012',
    invoiceNo: 'UTC/2025-26/INV/4612',
    creditLineId: 'cl-005',
    borrowerName: 'Mohammed Idrisi',
    businessName: 'Idrisi Wholesale Cement',
    anchorName: 'UltraTech Cement',
    invoiceAmount: 980000_00,
    invoiceDate: '2026-04-08T11:00:00Z',
    dueDate: '2026-07-07T00:00:00Z',
    status: 'PENDING_VERIFICATION',
    autoVerified: false,
    flags: [],
    tenor: 90,
    goodsDescription: 'UltraTech Cement — 1960 bags (bulk)',
    poNumber: 'PO-UTC-2026-0921',
  },
  {
    id: 'inv-013',
    invoiceNo: 'UTC/2025-26/INV/4401',
    creditLineId: 'cl-005',
    borrowerName: 'Mohammed Idrisi',
    businessName: 'Idrisi Wholesale Cement',
    anchorName: 'UltraTech Cement',
    invoiceAmount: 540000_00,
    invoiceDate: '2026-03-28T09:30:00Z',
    dueDate: '2026-06-26T00:00:00Z',
    status: 'REPAID',
    autoVerified: true,
    flags: [],
    disbursedAt: '2026-03-28T14:00:00Z',
    repaidAt: '2026-04-07T09:20:00Z',
    tenor: 90,
    interestAmount: 18225_00,
    goodsDescription: 'OPC 53 Grade — 1080 bags',
    poNumber: 'PO-UTC-2026-0814',
  },
];

export function useInvoices(filters?: { creditLineId?: string; status?: InvoiceStatus }) {
  let result = [...INVOICES];
  if (filters?.creditLineId) result = result.filter((i) => i.creditLineId === filters.creditLineId);
  if (filters?.status) result = result.filter((i) => i.status === filters.status);
  return { data: result, isLoading: false };
}

export function useInvoice(id: string) {
  return { data: INVOICES.find((i) => i.id === id), isLoading: false };
}
