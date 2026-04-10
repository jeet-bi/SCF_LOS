import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { UnderwritingReport, Lead, KycRecord } from '../../database/entities';
import { AiService } from '../../integrations/ai/ai.service';
import {
  UNDERWRITING_REPORT_SYSTEM,
  UNDERWRITING_REPORT_PROMPT,
} from '../../integrations/ai/prompts/underwriting.prompt';
import { JobName, RiskLevel } from '@los-scf/types';
import { paiseToCurrency } from '../../common/helpers/paginate.helper';

@Injectable()
export class UnderwritingService {
  private readonly logger = new Logger(UnderwritingService.name);

  constructor(
    @InjectRepository(UnderwritingReport)
    private reportRepo: Repository<UnderwritingReport>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(KycRecord) private kycRepo: Repository<KycRecord>,
    @InjectQueue('underwriting') private uwQueue: Queue,
    private aiService: AiService,
  ) {}

  async initiateReview(leadId: string, underwriterId: string) {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    let report = await this.reportRepo.findOne({ where: { leadId } });

    if (!report) {
      report = this.reportRepo.create({
        leadId,
        reviewedById: underwriterId,
      });
      await this.reportRepo.save(report);
    }

    await this.uwQueue.add(JobName.UNDERWRITING_REPORT, { leadId, reportId: report.id });

    return report;
  }

  async generateAiReport(leadId: string, reportId: string): Promise<void> {
    const [report, lead, kyc] = await Promise.all([
      this.reportRepo.findOne({ where: { id: reportId } }),
      this.leadRepo.findOne({ where: { id: leadId } }),
      this.kycRepo.findOne({ where: { leadId } }),
    ]);

    if (!report || !lead) return;

    try {
      const context = JSON.stringify({
        borrower: {
          name: lead.borrowerName,
          type: lead.borrowerType,
          pan: lead.pan,
          gstin: lead.gstin,
          businessName: lead.businessName,
          businessVintage: lead.businessVintage,
          manufacturer: lead.manufacturerName,
          address: lead.address,
        },
        loan: {
          amount: paiseToCurrency(lead.loanAmount),
          amountPaise: lead.loanAmount,
          product: lead.productType,
        },
        kyc: kyc
          ? {
              status: kyc.status,
              panVerified: kyc.panVerified,
              gstVerified: kyc.gstVerified,
              panResult: kyc.panResult,
              gstResult: kyc.gstResult,
            }
          : null,
        bankAnalysis: report.bankAnalysis,
        bureauReport: report.bureauReport,
      });

      const aiResponse = await this.aiService.complete(
        UNDERWRITING_REPORT_PROMPT(context),
        UNDERWRITING_REPORT_SYSTEM,
      );

      const result = this.aiService.parseJsonResponse<{
        riskScore: number;
        riskLevel: RiskLevel;
        recommendedLoanAmount: number;
        recommendedTenureMonths: number;
        recommendedInterestRate: number;
        strengths: string[];
        weaknesses: string[];
        conditions: string[];
        aiNarrative: string;
      }>(aiResponse);

      report.riskScore = result.riskScore;
      report.riskLevel = result.riskLevel;
      report.recommendedLoanAmount = result.recommendedLoanAmount;
      report.recommendedTenureMonths = result.recommendedTenureMonths;
      report.recommendedInterestRate = result.recommendedInterestRate;
      report.strengths = result.strengths;
      report.weaknesses = result.weaknesses;
      report.conditions = result.conditions;
      report.aiNarrative = result.aiNarrative;
      report.isAiGenerated = true;
      report.reviewedAt = new Date();

      await this.reportRepo.save(report);

      lead.riskLevel = result.riskLevel;
      lead.creditScore = lead.creditScore;
      await this.leadRepo.save(lead);

      this.logger.log(`Underwriting report generated for lead ${leadId}`);
    } catch (error) {
      this.logger.error(`Underwriting report failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getReport(leadId: string): Promise<UnderwritingReport> {
    const report = await this.reportRepo.findOne({
      where: { leadId },
      relations: ['reviewedBy'],
    });
    if (!report) throw new NotFoundException('Underwriting report not found');
    return report;
  }

  async updateReport(
    reportId: string,
    updates: Partial<UnderwritingReport>,
  ): Promise<UnderwritingReport> {
    const report = await this.reportRepo.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');

    Object.assign(report, updates);
    return this.reportRepo.save(report);
  }

  async updateBankAnalysis(reportId: string, bankAnalysis: Record<string, unknown>) {
    return this.updateReport(reportId, { bankAnalysis });
  }

  async updateBureauReport(reportId: string, bureauReport: Record<string, unknown>) {
    return this.updateReport(reportId, { bureauReport });
  }
}
