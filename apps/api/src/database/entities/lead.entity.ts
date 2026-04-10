import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  BorrowerType,
  LeadStatus,
  LoanProductType,
  RiskLevel,
} from '@los-scf/types';
import { User } from './user.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  applicationNumber: string;

  @Column()
  borrowerName: string;

  @Column({ type: 'enum', enum: BorrowerType })
  borrowerType: BorrowerType;

  @Column()
  pan: string;

  @Column({ nullable: true })
  gstin: string;

  @Column()
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessVintage: number;

  @Column({ type: 'enum', enum: LoanProductType })
  productType: LoanProductType;

  @Column({ type: 'bigint' })
  loanAmount: number;

  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.LEAD_CREATED })
  status: LeadStatus;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };

  @Column({ nullable: true })
  manufacturerName: string;

  @Column({ nullable: true })
  creditScore: number;

  @Column({ type: 'enum', enum: RiskLevel, nullable: true })
  riskLevel: RiskLevel;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  assignedToId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ nullable: true })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
