import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CamDocument, Lead, UnderwritingReport, KycRecord } from '../../database/entities';
import { CamController } from './cam.controller';
import { CamService } from './cam.service';
import { CamProcessor } from './cam.processor';
import { StorageService } from '../documents/storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CamDocument, Lead, UnderwritingReport, KycRecord]),
    BullModule.registerQueue({ name: 'cam' }),
  ],
  controllers: [CamController],
  providers: [CamService, CamProcessor, StorageService],
  exports: [CamService],
})
export class CamModule {}
