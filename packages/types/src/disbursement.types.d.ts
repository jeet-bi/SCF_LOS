import { DisbursementStatus, Paise } from './index';
export interface DisbursementDetail {
    id: string;
    leadId: string;
    loanAccountNumber: string;
    amount: Paise;
    status: DisbursementStatus;
    bankAccount: string;
    ifscCode: string;
    accountHolderName: string;
    razorpayPayoutId?: string;
    utr?: string;
    initiatedAt?: string;
    completedAt?: string;
    failureReason?: string;
    pennyDropVerified: boolean;
    eNachRegistered: boolean;
    eSignCompleted: boolean;
}
