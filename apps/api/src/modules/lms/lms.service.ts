import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, Disbursement } from '../../database/entities';
import { LeadStatus } from '@los-scf/types';

export interface LmsTransferPayload {
  loanAccountNumber: string;
  borrowerName: string;
  pan: string;
  disbursedAmount: number;
  interestRate: number;
  tenureMonths: number;
  disbursedAt: string;
  bankAccount: string;
  ifscCode: string;
  utr: string;
}

@Injectable()
export class LmsService {
  private readonly logger = new Logger(LmsService.name);

  constructor(
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(Disbursement) private disbursementRepo: Repository<Disbursement>,
  ) {}

  async transferToLms(leadId: string): Promise<{ success: boolean; lmsReference: string }> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const disbursement = await this.disbursementRepo.findOne({ where: { leadId } });
    if (!disbursement) throw new NotFoundException('Disbursement not found');

    const payload: LmsTransferPayload = {
      loanAccountNumber: disbursement.loanAccountNumber,
      borrowerName: lead.borrowerName,
      pan: lead.pan,
      disbursedAmount: Number(disbursement.amount),
      interestRate: 18,
      tenureMonths: 12,
      disbursedAt: disbursement.completedAt?.toISOString(),
      bankAccount: disbursement.bankAccount,
      ifscCode: disbursement.ifscCode,
      utr: disbursement.utr,
    };

    this.logger.log(`Transferring lead ${leadId} to LMS: ${JSON.stringify(payload)}`);

    const lmsReference = `LMS-${Date.now()}`;

    lead.status = LeadStatus.TRANSFERRED_TO_LMS;
    await this.leadRepo.save(lead);

    this.logger.log(`Lead ${leadId} transferred to LMS: ${lmsReference}`);
    return { success: true, lmsReference };
  }

  async getLmsStatus(leadId: string): Promise<{ status: string; loanAccountNumber?: string }> {
    const lead = await this.leadRepo.findOne({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const disbursement = await this.disbursementRepo.findOne({ where: { leadId } });

    return {
      status: lead.status,
      loanAccountNumber: disbursement?.loanAccountNumber,
    };
  }
}
