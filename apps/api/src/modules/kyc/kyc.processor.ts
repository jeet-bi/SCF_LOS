import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { KycService } from './kyc.service';
import { JobName } from '@los-scf/types';

@Processor('kyc')
export class KycProcessor {
  private readonly logger = new Logger(KycProcessor.name);

  constructor(private kycService: KycService) {}

  @Process(JobName.KYC_VERIFICATION)
  async handleKycVerification(job: Job<{ leadId: string; kycId: string }>) {
    this.logger.log(`Processing KYC job ${job.id} for lead ${job.data.leadId}`);

    try {
      await this.kycService.processKyc(job.data.leadId, job.data.kycId);
      this.logger.log(`KYC job ${job.id} completed`);
    } catch (error) {
      this.logger.error(`KYC job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
