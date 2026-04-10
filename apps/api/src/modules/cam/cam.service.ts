import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { CamDocument, Lead, UnderwritingReport, KycRecord } from '../../database/entities';
import { AiService } from '../../integrations/ai/ai.service';
import { StorageService } from '../documents/storage.service';
import {
  CAM_GENERATION_SYSTEM,
  CAM_GENERATION_PROMPT,
} from '../../integrations/ai/prompts/underwriting.prompt';
import { JobName, RiskLevel } from '@los-scf/types';
import { paiseToCurrency } from '../../common/helpers/paginate.helper';

@Injectable()
export class CamService {
  private readonly logger = new Logger(CamService.name);

  constructor(
    @InjectRepository(CamDocument) private camRepo: Repository<CamDocument>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(UnderwritingReport)
    private uwRepo: Repository<UnderwritingReport>,
    @InjectRepository(KycRecord) private kycRepo: Repository<KycRecord>,
    @InjectQueue('cam') private camQueue: Queue,
    private aiService: AiService,
    private storageService: StorageService,
  ) {}

  async generate(leadId: string): Promise<CamDocument> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    let cam = await this.camRepo.findOne({ where: { leadId } });

    if (!cam) {
      cam = this.camRepo.create({
        leadId,
        loanAmountRequested: lead.loanAmount,
      });
      await this.camRepo.save(cam);
    }

    await this.camQueue.add(JobName.CAM_GENERATION, { leadId, camId: cam.id });

    return cam;
  }

  async generateAiCam(leadId: string, camId: string): Promise<void> {
    const [cam, lead, uwReport, kyc] = await Promise.all([
      this.camRepo.findOne({ where: { id: camId } }),
      this.leadRepo.findOne({ where: { id: leadId } }),
      this.uwRepo.findOne({ where: { leadId } }),
      this.kycRepo.findOne({ where: { leadId } }),
    ]);

    if (!cam || !lead) return;

    try {
      const context = JSON.stringify({
        applicationNumber: lead.applicationNumber,
        borrower: {
          name: lead.borrowerName,
          type: lead.borrowerType,
          pan: lead.pan,
          gstin: lead.gstin,
          businessName: lead.businessName,
          businessVintage: lead.businessVintage,
          manufacturer: lead.manufacturerName,
          address: lead.address,
          creditScore: lead.creditScore,
        },
        loan: {
          amount: paiseToCurrency(lead.loanAmount),
          amountPaise: lead.loanAmount,
          product: lead.productType,
        },
        underwriting: uwReport
          ? {
              riskScore: uwReport.riskScore,
              riskLevel: uwReport.riskLevel,
              recommendedAmount: uwReport.recommendedLoanAmount,
              tenure: uwReport.recommendedTenureMonths,
              interestRate: uwReport.recommendedInterestRate,
              strengths: uwReport.strengths,
              weaknesses: uwReport.weaknesses,
              conditions: uwReport.conditions,
              narrative: uwReport.aiNarrative,
            }
          : null,
        kyc: kyc
          ? {
              status: kyc.status,
              panVerified: kyc.panVerified,
              aadhaarVerified: kyc.aadhaarVerified,
              gstVerified: kyc.gstVerified,
            }
          : null,
      });

      const aiResponse = await this.aiService.complete(
        CAM_GENERATION_PROMPT(context),
        CAM_GENERATION_SYSTEM,
      );

      const result = this.aiService.parseJsonResponse<{
        sections: Array<{ title: string; content: string }>;
        recommendation: 'APPROVE' | 'REJECT' | 'CONDITIONAL_APPROVE';
        conditions?: string[];
      }>(aiResponse);

      cam.sections = result.sections;
      cam.recommendation = result.recommendation;
      cam.conditions = result.conditions || [];

      if (uwReport) {
        cam.loanAmountRecommended = uwReport.recommendedLoanAmount;
        cam.tenureMonths = uwReport.recommendedTenureMonths;
        cam.interestRate = uwReport.recommendedInterestRate;
        cam.riskScore = uwReport.riskScore;
        cam.riskLevel = uwReport.riskLevel as RiskLevel;
      }

      await this.camRepo.save(cam);

      this.logger.log(`CAM generated for lead ${leadId}: ${result.recommendation}`);
    } catch (error) {
      this.logger.error(`CAM generation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getCam(leadId: string): Promise<CamDocument> {
    const cam = await this.camRepo.findOne({
      where: { leadId },
      relations: ['sanctionedBy'],
    });
    if (!cam) throw new NotFoundException('CAM not found');
    return cam;
  }

  async sanction(camId: string, userId: string, approved: boolean) {
    const cam = await this.camRepo.findOne({ where: { id: camId } });
    if (!cam) throw new NotFoundException('CAM not found');

    cam.sanctionedById = userId;
    cam.sanctionedAt = new Date();
    cam.recommendation = approved ? 'APPROVE' : 'REJECT';

    return this.camRepo.save(cam);
  }
}
