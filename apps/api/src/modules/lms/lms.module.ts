import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead, Disbursement } from '../../database/entities';
import { LmsService } from './lms.service';
import { LmsController } from './lms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Disbursement])],
  controllers: [LmsController],
  providers: [LmsService],
  exports: [LmsService],
})
export class LmsModule {}
