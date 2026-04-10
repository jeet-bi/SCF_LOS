import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../database/entities';
import { StorageService } from './storage.service';
import { DocumentStatus, DocumentType } from '@los-scf/types';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document) private docRepo: Repository<Document>,
    private storageService: StorageService,
  ) {}

  async getUploadUrl(
    leadId: string,
    documentType: DocumentType,
    fileName: string,
    contentType: string,
  ) {
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new BadRequestException(
        `Content type ${contentType} not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    const s3Key = this.storageService.generateS3Key(leadId, documentType, fileName);
    const uploadUrl = await this.storageService.getPresignedUploadUrl(s3Key, contentType);

    return { uploadUrl, s3Key, expiresIn: 3600 };
  }

  async registerDocument(
    leadId: string,
    documentType: DocumentType,
    s3Key: string,
    fileName: string,
    mimeType: string,
    sizeBytes: number,
  ) {
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds maximum allowed 10MB');
    }

    const doc = this.docRepo.create({
      leadId,
      type: documentType,
      status: DocumentStatus.UPLOADED,
      fileName,
      mimeType,
      sizeBytes,
      s3Key,
    });

    return this.docRepo.save(doc);
  }

  async listForLead(leadId: string) {
    return this.docRepo.find({
      where: { leadId },
      order: { createdAt: 'DESC' },
    });
  }

  async getDownloadUrl(id: string) {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const downloadUrl = await this.storageService.getPresignedDownloadUrl(doc.s3Key);
    return { downloadUrl, expiresIn: 3600 };
  }

  async verify(id: string, userId: string) {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    doc.status = DocumentStatus.VERIFIED;
    doc.verifiedAt = new Date();
    doc.verifiedById = userId;

    return this.docRepo.save(doc);
  }

  async reject(id: string, userId: string, reason: string) {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    doc.status = DocumentStatus.REJECTED;
    doc.rejectionReason = reason;

    return this.docRepo.save(doc);
  }

  async getRequiredDocuments(borrowerType: string): Promise<DocumentType[]> {
    const common = [
      DocumentType.PAN_CARD,
      DocumentType.AADHAAR_FRONT,
      DocumentType.AADHAAR_BACK,
      DocumentType.BANK_STATEMENT,
      DocumentType.CANCELLED_CHEQUE,
    ];

    const business = [
      DocumentType.GST_CERTIFICATE,
      DocumentType.BUSINESS_REGISTRATION,
      DocumentType.BALANCE_SHEET,
    ];

    return [...common, ...business];
  }
}
