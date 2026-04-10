import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { UnderwritingService } from './underwriting.service';
import { JobName } from '@los-scf/types';

@Processor('underwriting')
export class UnderwritingProcessor {
  private readonly logger = new Logger(UnderwritingProcessor.name);

  constructor(private uwService: UnderwritingService) {}

  @Process(JobName.UNDERWRITING_REPORT)
  async handleUnderwritingReport(
    job: Job<{ leadId: string; reportId: string }>,
  ) {
    this.logger.log(`Processing underwriting job ${job.id}`);
    await this.uwService.generateAiReport(job.data.leadId, job.data.reportId);
  }
}
