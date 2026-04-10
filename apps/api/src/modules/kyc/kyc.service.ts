import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { KycRecord, Lead, Document } from '../../database/entities';
import { AiService } from '../../integrations/ai/ai.service';
import { KarzaService } from '../../integrations/kyc-providers/karza.service';
import { StorageService } from '../documents/storage.service';
import {
  KYC_PAN_EXTRACTION_SYSTEM,
  KYC_PAN_EXTRACTION_PROMPT,
  KYC_AADHAAR_EXTRACTION_SYSTEM,
  KYC_AADHAAR_EXTRACTION_PROMPT,
} from '../../integrations/ai/prompts/kyc.prompt';
import { KycStatus, DocumentType, JobName } from '@los-scf/types';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    @InjectRepository(KycRecord) private kycRepo: Repository<KycRecord>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(Document) private docRepo: Repository<Document>,
    @InjectQueue('kyc') private kycQueue: Queue,
    private aiService: AiService,
    private karzaService: KarzaService,
    private storageService: StorageService,
  ) {}

  async initiate(leadId: string): Promise<KycRecord> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    let kyc = await this.kycRepo.findOne({ where: { leadId } });

    if (!kyc) {
      kyc = this.kycRepo.create({
        leadId,
        status: KycStatus.IN_PROGRESS,
      });
      await this.kycRepo.save(kyc);
    } else {
      kyc.status = KycStatus.IN_PROGRESS;
      await this.kycRepo.save(kyc);
    }

    await this.kycQueue.add(JobName.KYC_VERIFICATION, { leadId, kycId: kyc.id });

    return kyc;
  }

  async processKyc(leadId: string, kycId: string): Promise<void> {
    const kyc = await this.kycRepo.findOne({ where: { id: kycId } });
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });

    if (!kyc || !lead) {
      this.logger.error(`KYC or Lead not found: ${kycId}, ${leadId}`);
      return;
    }

    try {
      const panDoc = await this.docRepo.findOne({
        where: { leadId, type: DocumentType.PAN_CARD },
      });

      if (panDoc) {
        const panBuffer = await this.storageService.getObjectBuffer(panDoc.s3Key);
        const base64 = panBuffer.toString('base64');
        const mimeType = panDoc.mimeType as 'image/jpeg' | 'image/png';

        const aiResult = await this.aiService.analyzeImageBase64(
          base64,
          mimeType,
          KYC_PAN_EXTRACTION_PROMPT,
          KYC_PAN_EXTRACTION_SYSTEM,
        );

        const extracted = this.aiService.parseJsonResponse<{
          pan: string;
          name: string;
          dateOfBirth: string;
          isTampered: boolean;
        }>(aiResult);

        const karzaResult = await this.karzaService.verifyPan(lead.pan, lead.borrowerName);

        kyc.panVerified = karzaResult.valid && !extracted.isTampered;
        kyc.panResult = {
          pan: lead.pan,
          name: karzaResult.name,
          dateOfBirth: karzaResult.dateOfBirth,
          status: karzaResult.valid ? 'VALID' : 'INVALID',
          category: karzaResult.category,
          aiExtracted: extracted,
        };
      }

      if (lead.gstin) {
        const gstResult = await this.karzaService.verifyGstin(lead.gstin);
        kyc.gstVerified = gstResult.valid;
        kyc.gstResult = gstResult;
      } else {
        kyc.gstVerified = true;
      }

      const aadhaarFront = await this.docRepo.findOne({
        where: { leadId, type: DocumentType.AADHAAR_FRONT },
      });

      if (aadhaarFront) {
        const buffer = await this.storageService.getObjectBuffer(aadhaarFront.s3Key);
        const base64 = buffer.toString('base64');
        const mimeType = aadhaarFront.mimeType as 'image/jpeg' | 'image/png';

        const aiResult = await this.aiService.analyzeImageBase64(
          base64,
          mimeType,
          KYC_AADHAAR_EXTRACTION_PROMPT,
          KYC_AADHAAR_EXTRACTION_SYSTEM,
        );

        const extracted = this.aiService.parseJsonResponse<{
          name: string;
          isTampered: boolean;
          confidence: number;
        }>(aiResult);

        kyc.aadhaarVerified = !extracted.isTampered && extracted.confidence > 70;
        kyc.aadhaarResult = extracted;
      }

      const allVerified = kyc.panVerified && kyc.aadhaarVerified && kyc.gstVerified;

      kyc.status = allVerified ? KycStatus.VERIFIED : KycStatus.FAILED;
      kyc.verifiedAt = allVerified ? new Date() : null;

      await this.kycRepo.save(kyc);

      this.logger.log(`KYC ${kycId} completed: ${kyc.status}`);
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`KYC processing failed: ${err.message}`, err.stack);
      kyc.status = KycStatus.FAILED;
      kyc.failureReason = err.message;
      await this.kycRepo.save(kyc);
    }
  }

  async getKyc(leadId: string): Promise<KycRecord> {
    const kyc = await this.kycRepo.findOne({ where: { leadId } });
    if (!kyc) throw new NotFoundException('KYC record not found');
    return kyc;
  }

  async overrideStatus(kycId: string, status: KycStatus, reason?: string) {
    const kyc = await this.kycRepo.findOne({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException('KYC record not found');

    kyc.status = status;
    if (reason) kyc.failureReason = reason;
    if (status === KycStatus.VERIFIED) kyc.verifiedAt = new Date();

    return this.kycRepo.save(kyc);
  }
}
