import { useState, useEffect } from 'react';

export type ProgramStatus = 'ACTIVE' | 'PAUSED' | 'DRAFT' | 'CLOSED';
export type ProductType = 'DEALER_FINANCING' | 'WORKING_CAPITAL' | 'INVOICE_DISCOUNTING' | 'CHANNEL_FINANCING' | 'VENDOR_FINANCING';

export interface Program {
  id: string;
  name: string;
  programCode: string;
  anchorName: string;
  anchorId: string;
  productType: ProductType;
  status: ProgramStatus;
  totalLimit: number;
  utilizedLimit: number;
  activeBorrowers: number;
  interestRate: number;
  processingFee: number;
  maxTenor: number;
  maxLoanAmount: number;
  geography: string[];
  createdAt: string;
  approvedAt?: string;
}

const MOCK_PROGRAMS: Program[] = [
  {
    id: 'prog-1',
    name: 'ACC Dealer Financing Program FY26',
    programCode: 'ACC-DFP-001',
    anchorName: 'ACC Limited',
    anchorId: 'anc-1',
    productType: 'DEALER_FINANCING',
    status: 'ACTIVE',
    totalLimit: 50000000000,
    utilizedLimit: 18000000000,
    activeBorrowers: 127,
    interestRate: 1150,
    processingFee: 100,
    maxTenor: 90,
    maxLoanAmount: 500000000,
    geography: ['Maharashtra', 'Gujarat', 'Rajasthan'],
    createdAt: '2025-01-15',
    approvedAt: '2025-01-20',
  },
  {
    id: 'prog-2',
    name: 'UltraTech Working Capital Program',
    programCode: 'ULT-WCP-001',
    anchorName: 'UltraTech Cement Limited',
    anchorId: 'anc-2',
    productType: 'WORKING_CAPITAL',
    status: 'ACTIVE',
    totalLimit: 75000000000,
    utilizedLimit: 32000000000,
    activeBorrowers: 203,
    interestRate: 1100,
    processingFee: 75,
    maxTenor: 120,
    maxLoanAmount: 1000000000,
    geography: ['Gujarat', 'Rajasthan', 'MP', 'UP'],
    createdAt: '2024-11-01',
    approvedAt: '2024-11-05',
  },
  {
    id: 'prog-3',
    name: 'Ambuja Invoice Discounting',
    programCode: 'AMB-ID-001',
    anchorName: 'Ambuja Cements Limited',
    anchorId: 'anc-3',
    productType: 'INVOICE_DISCOUNTING',
    status: 'ACTIVE',
    totalLimit: 30000000000,
    utilizedLimit: 12500000000,
    activeBorrowers: 89,
    interestRate: 1050,
    processingFee: 50,
    maxTenor: 60,
    maxLoanAmount: 200000000,
    geography: ['Punjab', 'Haryana', 'Delhi NCR', 'HP'],
    createdAt: '2025-02-10',
    approvedAt: '2025-02-15',
  },
  {
    id: 'prog-4',
    name: 'Shree Cement Channel Finance',
    programCode: 'SHR-CF-002',
    anchorName: 'Shree Cement Limited',
    anchorId: 'anc-4',
    productType: 'CHANNEL_FINANCING',
    status: 'PAUSED',
    totalLimit: 20000000000,
    utilizedLimit: 8000000000,
    activeBorrowers: 64,
    interestRate: 1200,
    processingFee: 125,
    maxTenor: 75,
    maxLoanAmount: 300000000,
    geography: ['Rajasthan', 'Haryana', 'Delhi'],
    createdAt: '2024-09-01',
    approvedAt: '2024-09-10',
  },
  {
    id: 'prog-5',
    name: 'Dalmia Vendor Financing Program',
    programCode: 'DAL-VF-001',
    anchorName: 'Dalmia Bharat Cement',
    anchorId: 'anc-5',
    productType: 'VENDOR_FINANCING',
    status: 'DRAFT',
    totalLimit: 15000000000,
    utilizedLimit: 0,
    activeBorrowers: 0,
    interestRate: 1175,
    processingFee: 100,
    maxTenor: 90,
    maxLoanAmount: 250000000,
    geography: ['Odisha', 'West Bengal', 'Jharkhand'],
    createdAt: '2025-03-20',
  },
];

export function usePrograms() {
  const [programs] = useState<Program[]>(MOCK_PROGRAMS);
  return { programs, isLoading: false };
}

export function useProgram(id: string) {
  const program = MOCK_PROGRAMS.find((p) => p.id === id);
  return { program, isLoading: false };
}
