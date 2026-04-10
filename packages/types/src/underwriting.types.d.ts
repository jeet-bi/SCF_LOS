import { Paise, RiskLevel } from './index';
export interface BankStatementAnalysis {
    accountNumber: string;
    bankName: string;
    statementPeriodMonths: number;
    averageMonthlyBalance: Paise;
    totalCredits: Paise;
    totalDebits: Paise;
    monthlyAverageCredit: Paise;
    bounceCount: number;
    bounceRate: number;
    existingEmiObligations: Paise;
    cashFlowScore: number;
    irregularities: string[];
    summary: string;
}
export interface BureauReport {
    creditScore: number;
    bureau: 'CIBIL' | 'EXPERIAN';
    reportDate: string;
    totalOutstanding: Paise;
    currentObligations: Paise;
    dpdHistory: DpdEntry[];
    numberOfAccounts: number;
    activeAccounts: number;
    overdueAccounts: number;
    enquiriesLast6Months: number;
    summary: string;
}
export interface DpdEntry {
    accountType: string;
    lender: string;
    outstanding: Paise;
    dpd: number;
    status: string;
}
export interface UnderwritingReport {
    id: string;
    leadId: string;
    generatedAt: string;
    generatedBy: 'AI' | 'MANUAL';
    bankAnalysis?: BankStatementAnalysis;
    bureauReport?: BureauReport;
    riskScore: number;
    riskLevel: RiskLevel;
    recommendedLoanAmount: Paise;
    recommendedTenureMonths: number;
    recommendedInterestRate: number;
    strengths: string[];
    weaknesses: string[];
    conditions: string[];
    aiNarrative: string;
}
