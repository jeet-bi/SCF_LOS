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

@Entity('cam_documents')
export class CamDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  leadId: string;

  @OneToOne(() => Lead)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({ type: 'bigint' })
  loanAmountRequested: number;

  @Column({ type: 'bigint', nullable: true })
  loanAmountRecommended: number;

  @Column({ nullable: true })
  tenureMonths: number;

  @Column({ nullable: true, type: 'float' })
  interestRate: number;

  @Column({ type: 'bigint', nullable: true })
  processingFee: number;

  @Column({ nullable: true, type: 'float' })
  riskScore: number;

  @Column({ type: 'enum', enum: RiskLevel, nullable: true })
  riskLevel: RiskLevel;

  @Column({ type: 'jsonb', nullable: true })
  sections: Array<{ title: string; content: string; data?: Record<string, unknown> }>;

  @Column({ nullable: true })
  recommendation: string;

  @Column({ type: 'jsonb', nullable: true })
  conditions: string[];

  @Column({ nullable: true })
  s3Key: string;

  @Column({ nullable: true })
  sanctionedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'sanctionedById' })
  sanctionedBy: User;

  @Column({ nullable: true })
  sanctionedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
