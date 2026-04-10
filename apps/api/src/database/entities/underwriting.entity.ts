import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RiskLevel } from '@los-scf/types';
import { Lead } from './lead.entity';
import { User } from './user.entity';

@Entity('underwriting_reports')
export class UnderwritingReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  leadId: string;

  @OneToOne(() => Lead)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({ type: 'jsonb', nullable: true })
  bankAnalysis: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  bureauReport: Record<string, unknown>;

  @Column({ nullable: true, type: 'float' })
  riskScore: number;

  @Column({ type: 'enum', enum: RiskLevel, nullable: true })
  riskLevel: RiskLevel;

  @Column({ type: 'bigint', nullable: true })
  recommendedLoanAmount: number;

  @Column({ nullable: true })
  recommendedTenureMonths: number;

  @Column({ nullable: true, type: 'float' })
  recommendedInterestRate: number;

  @Column({ type: 'jsonb', nullable: true })
  strengths: string[];

  @Column({ type: 'jsonb', nullable: true })
  weaknesses: string[];

  @Column({ type: 'jsonb', nullable: true })
  conditions: string[];

  @Column({ type: 'text', nullable: true })
  aiNarrative: string;

  @Column({ default: false })
  isAiGenerated: boolean;

  @Column({ nullable: true })
  reviewedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedById' })
  reviewedBy: User;

  @Column({ nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
