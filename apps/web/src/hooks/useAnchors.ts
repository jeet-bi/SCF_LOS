import { useState } from 'react';

export type AnchorStatus = 'ACTIVE' | 'ONBOARDING' | 'SUSPENDED' | 'CLOSED';

export interface Anchor {
  id: string;
  companyName: string;
  anchorCode: string;
  pan: string;
  gstin: string;
  industry: string;
  rating?: string;
  ratingAgency?: string;
  status: AnchorStatus;
  totalProgramLimit: number;
  utilizedLimit: number;
  activePrograms: number;
  activeDealers: number;
  relationshipManager: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  onboardedAt?: string;
  createdAt: string;
}

const MOCK_ANCHORS: Anchor[] = [
  {
    id: 'anc-1',
    companyName: 'ACC Limited',
    anchorCode: 'ACC-001',
    pan: 'AACCA0715N',
    gstin: '27AACCA0715N1Z1',
    industry: 'Cement',
    rating: 'CRISIL AA+',
    ratingAgency: 'CRISIL',
    status: 'ACTIVE',
    totalProgramLimit: 50000000000,
    utilizedLimit: 18000000000,
    activePrograms: 2,
    activeDealers: 127,
    relationshipManager: 'Priya Sharma',
    contactName: 'Rajesh Mehta',
    contactEmail: 'rajesh.mehta@acc.co.in',
    contactPhone: '9820123456',
    city: 'Mumbai',
    state: 'Maharashtra',
    onboardedAt: '2024-01-20',
    createdAt: '2024-01-10',
  },
  {
    id: 'anc-2',
    companyName: 'UltraTech Cement Limited',
    anchorCode: 'ULT-001',
    pan: 'AAACS8498P',
    gstin: '27AAACS8498P1ZH',
    industry: 'Cement',
    rating: 'CRISIL AAA',
    ratingAgency: 'CRISIL',
    status: 'ACTIVE',
    totalProgramLimit: 75000000000,
    utilizedLimit: 32000000000,
    activePrograms: 3,
    activeDealers: 203,
    relationshipManager: 'Amit Patel',
    contactName: 'Suresh Kumar',
    contactEmail: 'suresh.kumar@ultratech.com',
    contactPhone: '9022345678',
    city: 'Mumbai',
    state: 'Maharashtra',
    onboardedAt: '2023-11-05',
    createdAt: '2023-10-25',
  },
  {
    id: 'anc-3',
    companyName: 'Ambuja Cements Limited',
    anchorCode: 'AMB-001',
    pan: 'AAACA0334P',
    gstin: '24AAACA0334P1Z4',
    industry: 'Cement',
    rating: 'CRISIL AA',
    ratingAgency: 'CRISIL',
    status: 'ACTIVE',
    totalProgramLimit: 30000000000,
    utilizedLimit: 12500000000,
    activePrograms: 1,
    activeDealers: 89,
    relationshipManager: 'Kavita Singh',
    contactName: 'Deepak Verma',
    contactEmail: 'd.verma@ambuja.com',
    contactPhone: '7890123456',
    city: 'Ahmedabad',
    state: 'Gujarat',
    onboardedAt: '2025-02-15',
    createdAt: '2025-02-01',
  },
  {
    id: 'anc-4',
    companyName: 'Shree Cement Limited',
    anchorCode: 'SHR-001',
    pan: 'AABCS2765G',
    gstin: '08AABCS2765G1ZE',
    industry: 'Cement',
    rating: 'ICRA AA',
    ratingAgency: 'ICRA',
    status: 'ACTIVE',
    totalProgramLimit: 20000000000,
    utilizedLimit: 8000000000,
    activePrograms: 1,
    activeDealers: 64,
    relationshipManager: 'Priya Sharma',
    contactName: 'Vikram Agarwal',
    contactEmail: 'v.agarwal@shreecement.com',
    contactPhone: '9414567890',
    city: 'Beawar',
    state: 'Rajasthan',
    onboardedAt: '2024-09-10',
    createdAt: '2024-08-20',
  },
  {
    id: 'anc-5',
    companyName: 'Dalmia Bharat Cement',
    anchorCode: 'DAL-001',
    pan: 'AACCD3706N',
    gstin: '21AACCD3706N1Z5',
    industry: 'Cement',
    rating: 'CRISIL AA-',
    ratingAgency: 'CRISIL',
    status: 'ONBOARDING',
    totalProgramLimit: 15000000000,
    utilizedLimit: 0,
    activePrograms: 0,
    activeDealers: 0,
    relationshipManager: 'Amit Patel',
    contactName: 'Sanjay Mishra',
    contactEmail: 's.mishra@dalmiacement.com',
    contactPhone: '9876543210',
    city: 'New Delhi',
    state: 'Delhi',
    createdAt: '2025-03-15',
  },
];

export function useAnchors() {
  const [anchors] = useState<Anchor[]>(MOCK_ANCHORS);
  return { anchors, isLoading: false };
}

export function useAnchor(id: string) {
  const anchor = MOCK_ANCHORS.find((a) => a.id === id);
  return { anchor, isLoading: false };
}
