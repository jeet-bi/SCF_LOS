import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import {
  User,
  Lead,
  Document,
  KycRecord,
  UnderwritingReport,
  CamDocument,
  Disbursement,
  LeadActivity,
} from './database/entities';
import { AuthModule } from './modules/auth/auth.module';
import { LeadsModule } from './modules/leads/leads.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { KycModule } from './modules/kyc/kyc.module';
import { UnderwritingModule } from './modules/underwriting/underwriting.module';
import { CamModule } from './modules/cam/cam.module';
import { DisbursementModule } from './modules/disbursement/disbursement.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LmsModule } from './modules/lms/lms.module';
import { AiModule } from './integrations/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        database: config.get('database.name'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        ssl: config.get('database.ssl'),
        entities: [
          User,
          Lead,
          Document,
          KycRecord,
          UnderwritingReport,
          CamDocument,
          Disbursement,
          LeadActivity,
        ],
        synchronize: config.get('nodeEnv') === 'development',
        logging: config.get('nodeEnv') === 'development',
      }),
    }),

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          password: config.get('redis.password'),
        },
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    AuthModule,
    LeadsModule,
    DocumentsModule,
    KycModule,
    UnderwritingModule,
    CamModule,
    DisbursementModule,
    NotificationsModule,
    LmsModule,
    AiModule,
  ],
})
export class AppModule {}
