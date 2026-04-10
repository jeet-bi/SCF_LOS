import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { KycRecord, Lead, Document } from '../../database/entities';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycProcessor } from './kyc.processor';
import { KarzaService } from '../../integrations/kyc-providers/karza.service';
import { StorageService } from '../documents/storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([KycRecord, Lead, Document]),
    BullModule.registerQueue({ name: 'kyc' }),
  ],
  controllers: [KycController],
  providers: [KycService, KycProcessor, KarzaService, StorageService],
  exports: [KycService],
})
export class KycModule {}
