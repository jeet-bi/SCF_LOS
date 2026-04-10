'use client';

import { Badge } from './ui/badge';
import { LeadStatus } from '@los-scf/types';

const STATUS_CONFIG: Record<LeadStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  [LeadStatus.LEAD_CREATED]: { label: 'Created', variant: 'secondary' },
  [LeadStatus.DOCUMENTS_PENDING]: { label: 'Docs Pending', variant: 'warning' },
  [LeadStatus.DOCUMENTS_UPLOADED]: { label: 'Docs Uploaded', variant: 'info' },
  [LeadStatus.KYC_IN_PROGRESS]: { label: 'KYC In Progress', variant: 'info' },
  [LeadStatus.KYC_VERIFIED]: { label: 'KYC Verified', variant: 'success' },
  [LeadStatus.UNDERWRITING_QUEUE]: { label: 'UW Queue', variant: 'warning' },
  [LeadStatus.UNDER_REVIEW]: { label: 'Under Review', variant: 'info' },
  [LeadStatus.PENNY_DROP_DONE]: { label: 'Penny Drop Done', variant: 'info' },
  [LeadStatus.CAM_GENERATED]: { label: 'CAM Generated', variant: 'info' },
  [LeadStatus.APPROVED]: { label: 'Approved', variant: 'success' },
  [LeadStatus.REJECTED]: { label: 'Rejected', variant: 'destructive' },
  [LeadStatus.ADDITIONAL_DOCS_REQUIRED]: { label: 'Add Docs Reqd', variant: 'warning' },
  [LeadStatus.READY_TO_DISBURSE]: { label: 'Ready to Disburse', variant: 'success' },
  [LeadStatus.ENACH_PENDING]: { label: 'eNACH Pending', variant: 'warning' },
  [LeadStatus.ESIGN_PENDING]: { label: 'eSign Pending', variant: 'warning' },
  [LeadStatus.DISBURSEMENT_INITIATED]: { label: 'Disbursing', variant: 'info' },
  [LeadStatus.DISBURSED]: { label: 'Disbursed', variant: 'success' },
  [LeadStatus.TRANSFERRED_TO_LMS]: { label: 'In LMS', variant: 'secondary' },
};

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
