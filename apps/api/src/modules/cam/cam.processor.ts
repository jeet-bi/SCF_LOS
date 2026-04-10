import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CamService } from './cam.service';
import { JobName } from '@los-scf/types';

@Processor('cam')
export class CamProcessor {
  private readonly logger = new Logger(CamProcessor.name);

  constructor(private camService: CamService) {}

  @Process(JobName.CAM_GENERATION)
  async handleCamGeneration(job: Job<{ leadId: string; camId: string }>) {
    this.logger.log(`Processing CAM job ${job.id} for lead ${job.data.leadId}`);
    await this.camService.generateAiCam(job.data.leadId, job.data.camId);
  }
}
