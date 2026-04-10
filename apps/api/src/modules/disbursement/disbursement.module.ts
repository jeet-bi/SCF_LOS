import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Disbursement, Lead } from '../../database/entities';
import { DisbursementController } from './disbursement.controller';
import { DisbursementService } from './disbursement.service';
import { DisbursementProcessor } from './disbursement.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Disbursement, Lead]),
    BullModule.registerQueue({ name: 'disbursement' }),
  ],
  controllers: [DisbursementController],
  providers: [DisbursementService, DisbursementProcessor],
  exports: [DisbursementService],
})
export class DisbursementModule {}
