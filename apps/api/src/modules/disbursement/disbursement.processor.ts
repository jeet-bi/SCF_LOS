import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { DisbursementService } from './disbursement.service';
import { JobName } from '@los-scf/types';

@Processor('disbursement')
export class DisbursementProcessor {
  private readonly logger = new Logger(DisbursementProcessor.name);

  constructor(private disbursementService: DisbursementService) {}

  @Process(JobName.DISBURSEMENT_INITIATE)
  async handleDisbursement(
    job: Job<{ leadId: string; disbursementId: string }>,
  ) {
    this.logger.log(`Processing disbursement job ${job.id}`);
    await this.disbursementService.processDisbursement(job.data.disbursementId);
  }
}
