import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { Disbursement, Lead } from '../../database/entities';
import { DisbursementStatus, JobName, LeadStatus } from '@los-scf/types';
import { generateLoanAccountNumber } from '../../common/helpers/paginate.helper';

export class InitiateDisbursementDto {
  bankAccount: string;
  ifscCode: string;
  accountHolderName: string;
  amount: number;
}

@Injectable()
export class DisbursementService {
  private readonly logger = new Logger(DisbursementService.name);

  constructor(
    @InjectRepository(Disbursement) private disbursementRepo: Repository<Disbursement>,
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectQueue('disbursement') private disbursementQueue: Queue,
  ) {}

  async setup(leadId: string, dto: InitiateDisbursementDto): Promise<Disbursement> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    if (lead.status !== LeadStatus.APPROVED && lead.status !== LeadStatus.READY_TO_DISBURSE) {
      throw new BadRequestException('Lead must be approved before setting up disbursement');
    }

    let disbursement = await this.disbursementRepo.findOne({ where: { leadId } });

    if (!disbursement) {
      disbursement = this.disbursementRepo.create({
        leadId,
        loanAccountNumber: generateLoanAccountNumber(),
        amount: dto.amount || lead.loanAmount,
        bankAccount: dto.bankAccount,
        ifscCode: dto.ifscCode,
        accountHolderName: dto.accountHolderName,
        status: DisbursementStatus.PENDING,
      });
      await this.disbursementRepo.save(disbursement);
    }

    return disbursement;
  }

  async initiatePennyDrop(leadId: string): Promise<{ success: boolean; utr: string }> {
    const disbursement = await this.findByLeadId(leadId);

    this.logger.log(`Initiating penny drop for lead ${leadId}`);

    const utr = `UTR${Date.now()}`;
    disbursement.pennyDropVerified = true;
    disbursement.pennyDropUtr = utr;
    await this.disbursementRepo.save(disbursement);

    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (lead && lead.status === LeadStatus.UNDER_REVIEW) {
      lead.status = LeadStatus.PENNY_DROP_DONE;
      await this.leadRepo.save(lead);
    }

    return { success: true, utr };
  }

  async registerENach(leadId: string, enachData: { envelopeId: string }) {
    const disbursement = await this.findByLeadId(leadId);
    disbursement.eNachRegistered = true;
    disbursement.eNachEnvelopeId = enachData.envelopeId;
    return this.disbursementRepo.save(disbursement);
  }

  async completeESign(leadId: string, eSignData: { documentId: string }) {
    const disbursement = await this.findByLeadId(leadId);
    disbursement.eSignCompleted = true;
    disbursement.eSignDocumentId = eSignData.documentId;
    return this.disbursementRepo.save(disbursement);
  }

  async initiate(leadId: string): Promise<Disbursement> {
    const disbursement = await this.findByLeadId(leadId);

    if (!disbursement.pennyDropVerified) {
      throw new BadRequestException('Penny drop must be verified before disbursement');
    }

    disbursement.status = DisbursementStatus.INITIATED;
    disbursement.initiatedAt = new Date();
    await this.disbursementRepo.save(disbursement);

    await this.disbursementQueue.add(JobName.DISBURSEMENT_INITIATE, {
      leadId,
      disbursementId: disbursement.id,
    });

    return disbursement;
  }

  async processDisbursement(disbursementId: string): Promise<void> {
    const disbursement = await this.disbursementRepo.findOne({
      where: { id: disbursementId },
    });

    if (!disbursement) return;

    try {
      this.logger.log(`Processing disbursement ${disbursementId}`);

      const payoutId = `RZP_PAYOUT_${Date.now()}`;
      const utr = `IMPS${Date.now()}`;

      disbursement.status = DisbursementStatus.SUCCESS;
      disbursement.razorpayPayoutId = payoutId;
      disbursement.utr = utr;
      disbursement.completedAt = new Date();

      await this.disbursementRepo.save(disbursement);

      const lead = await this.leadRepo.findOne({ where: { id: disbursement.leadId } });
      if (lead) {
        lead.status = LeadStatus.DISBURSED;
        await this.leadRepo.save(lead);
      }

      this.logger.log(`Disbursement ${disbursementId} completed: UTR ${utr}`);
    } catch (error) {
      this.logger.error(`Disbursement failed: ${error.message}`);
      disbursement.status = DisbursementStatus.FAILED;
      disbursement.failureReason = error.message;
      await this.disbursementRepo.save(disbursement);
      throw error;
    }
  }

  async getDisbursement(leadId: string): Promise<Disbursement> {
    return this.findByLeadId(leadId);
  }

  private async findByLeadId(leadId: string): Promise<Disbursement> {
    const d = await this.disbursementRepo.findOne({ where: { leadId } });
    if (!d) throw new NotFoundException('Disbursement record not found');
    return d;
  }
}
