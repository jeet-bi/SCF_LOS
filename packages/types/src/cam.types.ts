import { Paise, RiskLevel } from './index';

export interface CamSection {
  title: string;
  content: string;
  data?: Record<string, unknown>;
}

export interface CamDocument {
  id: string;
  leadId: string;
  applicationNumber: string;
  generatedAt: string;
  borrowerName: string;
  loanAmountRequested: Paise;
  loanAmountRecommended: Paise;
  tenureMonths: number;
  interestRate: number;
  processingFee: Paise;
  riskScore: number;
  riskLevel: RiskLevel;
  creditScore?: number;
  sections: CamSection[];
  recommendation: 'APPROVE' | 'REJECT' | 'CONDITIONAL_APPROVE';
  conditions?: string[];
  sanctionedBy?: string;
  sanctionedAt?: string;
  s3Key?: string;
}
