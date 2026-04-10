import { DocumentStatus, DocumentType } from './enums';

export interface DocumentMeta {
  id: string;
  leadId: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  s3Key: string;
  uploadedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  s3Key: string;
  expiresIn: number;
}

export interface DocumentRequirement {
  type: DocumentType;
  label: string;
  required: boolean;
  allowedMimeTypes: string[];
  maxSizeMb: number;
}
