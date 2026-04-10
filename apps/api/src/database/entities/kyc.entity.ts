import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { KycStatus } from '@los-scf/types';
import { Lead } from './lead.entity';

@Entity('kyc_records')
export class KycRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  leadId: string;

  @OneToOne(() => Lead)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.NOT_STARTED })
  status: KycStatus;

  @Column({ default: false })
  panVerified: boolean;

  @Column({ default: false })
  aadhaarVerified: boolean;

  @Column({ default: false })
  gstVerified: boolean;

  @Column({ nullable: true, type: 'float' })
  faceMatchScore: number;

  @Column({ type: 'jsonb', nullable: true })
  panResult: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  aadhaarResult: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  gstResult: Record<string, unknown>;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ nullable: true, type: 'timestamp' })
  verifiedAt: Date | null;

  @Column({ nullable: true })
  karzaRequestId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
