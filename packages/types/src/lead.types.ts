import { BorrowerType, LeadStatus, LoanProductType, RiskLevel } from './enums';
import { Address, Paise } from './common.types';

export interface LeadSummary {
  id: string;
  applicationNumber: string;
  borrowerName: string;
  borrowerType: BorrowerType;
  loanAmount: Paise;
  productType: LoanProductType;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDetail extends LeadSummary {
  pan: string;
  gstin?: string;
  mobile: string;
  email?: string;
  dateOfBirth?: string;
  businessName?: string;
  businessVintage?: number;
  address: Address;
  manufacturerName?: string;
  creditScore?: number;
  riskLevel?: RiskLevel;
  remarks?: string;
}

export interface CreateLeadDto {
  borrowerName: string;
  borrowerType: BorrowerType;
  pan: string;
  mobile: string;
  email?: string;
  loanAmount: Paise;
  productType: LoanProductType;
  gstin?: string;
  dateOfBirth?: string;
  businessName?: string;
  businessVintage?: number;
  address: Address;
  manufacturerName?: string;
}

export interface StatusTransition {
  from: LeadStatus;
  to: LeadStatus;
  allowedRoles: string[];
}
