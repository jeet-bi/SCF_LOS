import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadActivity } from '../../database/entities';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  UpdateLeadDto,
  UpdateLeadStatusDto,
  AssignLeadDto,
} from './dto/update-lead.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { paginate, generateApplicationNumber } from '../../common/helpers/paginate.helper';
import { AuthUser, LeadStatus, UserRole } from '@los-scf/types';

const VALID_TRANSITIONS: Partial<Record<LeadStatus, LeadStatus[]>> = {
  [LeadStatus.LEAD_CREATED]: [LeadStatus.DOCUMENTS_PENDING],
  [LeadStatus.DOCUMENTS_PENDING]: [LeadStatus.DOCUMENTS_UPLOADED],
  [LeadStatus.DOCUMENTS_UPLOADED]: [LeadStatus.KYC_IN_PROGRESS],
  [LeadStatus.KYC_IN_PROGRESS]: [LeadStatus.KYC_VERIFIED],
  [LeadStatus.KYC_VERIFIED]: [LeadStatus.UNDERWRITING_QUEUE],
  [LeadStatus.UNDERWRITING_QUEUE]: [LeadStatus.UNDER_REVIEW],
  [LeadStatus.UNDER_REVIEW]: [
    LeadStatus.PENNY_DROP_DONE,
    LeadStatus.ADDITIONAL_DOCS_REQUIRED,
  ],
  [LeadStatus.PENNY_DROP_DONE]: [LeadStatus.CAM_GENERATED],
  [LeadStatus.CAM_GENERATED]: [
    LeadStatus.APPROVED,
    LeadStatus.REJECTED,
    LeadStatus.ADDITIONAL_DOCS_REQUIRED,
  ],
  [LeadStatus.APPROVED]: [LeadStatus.READY_TO_DISBURSE],
  [LeadStatus.ADDITIONAL_DOCS_REQUIRED]: [LeadStatus.DOCUMENTS_UPLOADED],
  [LeadStatus.READY_TO_DISBURSE]: [LeadStatus.ENACH_PENDING],
  [LeadStatus.ENACH_PENDING]: [LeadStatus.ESIGN_PENDING],
  [LeadStatus.ESIGN_PENDING]: [LeadStatus.DISBURSEMENT_INITIATED],
  [LeadStatus.DISBURSEMENT_INITIATED]: [LeadStatus.DISBURSED],
  [LeadStatus.DISBURSED]: [LeadStatus.TRANSFERRED_TO_LMS],
};

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private leadRepo: Repository<Lead>,
    @InjectRepository(LeadActivity) private activityRepo: Repository<LeadActivity>,
  ) {}

  async create(dto: CreateLeadDto, user: AuthUser) {
    const applicationNumber = generateApplicationNumber();

    const lead = this.leadRepo.create({
      ...dto,
      applicationNumber,
      status: LeadStatus.LEAD_CREATED,
      createdById: user.id,
      assignedToId: user.id,
    });

    const saved = await this.leadRepo.save(lead);

    await this.activityRepo.save({
      leadId: saved.id,
      action: 'LEAD_CREATED',
      toStatus: LeadStatus.LEAD_CREATED,
      performedById: user.id,
    });

    return saved;
  }

  async findAll(query: PaginationDto, user: AuthUser) {
    const qb = this.leadRepo
      .createQueryBuilder('lead')
      .leftJoin('lead.assignedTo', 'assignedTo')
      .addSelect(['assignedTo.id', 'assignedTo.name', 'assignedTo.email'])
      .leftJoin('lead.createdBy', 'createdBy')
      .addSelect(['createdBy.id', 'createdBy.name'])
      .orderBy(`lead.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC');

    if (user.role === UserRole.OPS_AGENT) {
      qb.where('lead.assignedToId = :userId OR lead.createdById = :userId', {
        userId: user.id,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(lead.borrowerName ILIKE :search OR lead.applicationNumber ILIKE :search OR lead.pan ILIKE :search OR lead.mobile ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    return paginate(qb, query.page || 1, query.limit || 20);
  }

  async findOne(id: string, user: AuthUser) {
    const lead = await this.leadRepo.findOne({
      where: { id },
      relations: ['assignedTo', 'createdBy'],
    });

    if (!lead) throw new NotFoundException('Lead not found');

    if (
      user.role === UserRole.OPS_AGENT &&
      lead.assignedToId !== user.id &&
      lead.createdById !== user.id
    ) {
      throw new ForbiddenException('Not authorized to view this lead');
    }

    return lead;
  }

  async updateStatus(id: string, dto: UpdateLeadStatusDto, user: AuthUser) {
    const lead = await this.findOne(id, user);
    const allowed = VALID_TRANSITIONS[lead.status] || [];

    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${lead.status} to ${dto.status}`,
      );
    }

    const fromStatus = lead.status;
    lead.status = dto.status;
    if (dto.remarks) lead.remarks = dto.remarks;

    await this.leadRepo.save(lead);

    await this.activityRepo.save({
      leadId: id,
      action: 'STATUS_CHANGED',
      fromStatus,
      toStatus: dto.status,
      note: dto.remarks,
      performedById: user.id,
    });

    return lead;
  }

  async assign(id: string, dto: AssignLeadDto, user: AuthUser) {
    const lead = await this.findOne(id, user);
    const prev = lead.assignedToId;
    lead.assignedToId = dto.assignedToId;
    await this.leadRepo.save(lead);

    await this.activityRepo.save({
      leadId: id,
      action: 'LEAD_ASSIGNED',
      performedById: user.id,
      metadata: { from: prev, to: dto.assignedToId },
    });

    return lead;
  }

  async update(id: string, dto: UpdateLeadDto, user: AuthUser) {
    const lead = await this.findOne(id, user);
    Object.assign(lead, dto);
    return this.leadRepo.save(lead);
  }

  async getActivity(id: string, user: AuthUser) {
    await this.findOne(id, user);
    return this.activityRepo.find({
      where: { leadId: id },
      relations: ['performedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDashboardStats(user: AuthUser) {
    const qb = this.leadRepo.createQueryBuilder('lead');

    if (user.role === UserRole.OPS_AGENT) {
      qb.where('lead.assignedToId = :userId OR lead.createdById = :userId', {
        userId: user.id,
      });
    }

    const [total, byStatus] = await Promise.all([
      qb.getCount(),
      this.leadRepo
        .createQueryBuilder('lead')
        .select('lead.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('lead.status')
        .getRawMany(),
    ]);

    const statusMap: Record<string, number> = {};
    byStatus.forEach((row) => {
      statusMap[row.status] = parseInt(row.count, 10);
    });

    return { total, byStatus: statusMap };
  }
}
