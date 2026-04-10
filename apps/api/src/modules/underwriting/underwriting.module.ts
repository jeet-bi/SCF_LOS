import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { UnderwritingReport, Lead, KycRecord } from '../../database/entities';
import { UnderwritingController } from './underwriting.controller';
import { UnderwritingService } from './underwriting.service';
import { UnderwritingProcessor } from './underwriting.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnderwritingReport, Lead, KycRecord]),
    BullModule.registerQueue({ name: 'underwriting' }),
  ],
  controllers: [UnderwritingController],
  providers: [UnderwritingService, UnderwritingProcessor],
  exports: [UnderwritingService],
})
export class UnderwritingModule {}
