import { KycStatus } from './enums';

export interface PanVerificationResult {
  pan: string;
  name: string;
  dateOfBirth: string;
  status: 'VALID' | 'INVALID' | 'NOT_FOUND';
  category?: string;
}

export interface AadhaarVerificationResult {
  aadhaarNumber: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  faceMatchScore?: number;
  isTampered: boolean;
}

export interface GstVerificationResult {
  gstin: string;
  legalName: string;
  tradeName?: string;
  registrationDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'SUSPENDED';
  filingCompliance?: number;
  annualTurnoverPaise?: number;
}

export interface KycSummary {
  id: string;
  leadId: string;
  status: KycStatus;
  panVerified: boolean;
  aadhaarVerified: boolean;
  gstVerified: boolean;
  faceMatchScore?: number;
  panResult?: PanVerificationResult;
  aadhaarResult?: AadhaarVerificationResult;
  gstResult?: GstVerificationResult;
  failureReason?: string;
  verifiedAt?: string;
}
