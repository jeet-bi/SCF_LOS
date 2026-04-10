import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { DisbursementStatus } from '@los-scf/types';
import { Lead } from './lead.entity';

@Entity('disbursements')
export class Disbursement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  leadId: string;

  @OneToOne(() => Lead)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({ unique: true })
  loanAccountNumber: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({
    type: 'enum',
    enum: DisbursementStatus,
    default: DisbursementStatus.PENDING,
  })
  status: DisbursementStatus;

  @Column()
  bankAccount: string;

  @Column()
  ifscCode: string;

  @Column()
  accountHolderName: string;

  @Column({ default: false })
  pennyDropVerified: boolean;

  @Column({ nullable: true })
  pennyDropUtr: string;

  @Column({ default: false })
  eNachRegistered: boolean;

  @Column({ nullable: true })
  eNachEnvelopeId: string;

  @Column({ default: false })
  eSignCompleted: boolean;

  @Column({ nullable: true })
  eSignDocumentId: string;

  @Column({ nullable: true })
  razorpayPayoutId: string;

  @Column({ nullable: true })
  utr: string;

  @Column({ nullable: true })
  initiatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
