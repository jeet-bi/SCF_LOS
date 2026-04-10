import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { KycStatus, UserRole } from '@los-scf/types';

class OverrideKycDto {
  @ApiProperty({ enum: KycStatus })
  @IsEnum(KycStatus)
  status: KycStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

@ApiTags('KYC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads/:leadId/kyc')
export class KycController {
  constructor(private kycService: KycService) {}

  @Post('initiate')
  @Roles(UserRole.OPS_AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Initiate KYC verification for a lead' })
  initiate(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.kycService.initiate(leadId);
  }

  @Get()
  @ApiOperation({ summary: 'Get KYC status for a lead' })
  getKyc(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.kycService.getKyc(leadId);
  }

  @Patch(':kycId/override')
  @Roles(UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Override KYC status (Credit Manager only)' })
  override(
    @Param('kycId', ParseUUIDPipe) kycId: string,
    @Body() dto: OverrideKycDto,
  ) {
    return this.kycService.overrideStatus(kycId, dto.status, dto.reason);
  }
}
