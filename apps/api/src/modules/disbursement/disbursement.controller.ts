import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DisbursementService } from './disbursement.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@los-scf/types';

class SetupDisbursementDto {
  @ApiProperty()
  @IsString()
  bankAccount: string;

  @ApiProperty()
  @IsString()
  ifscCode: string;

  @ApiProperty()
  @IsString()
  accountHolderName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  amount?: number;
}

@ApiTags('Disbursement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads/:leadId/disbursement')
export class DisbursementController {
  constructor(private disbursementService: DisbursementService) {}

  @Post('setup')
  @Roles(UserRole.UNDERWRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Setup disbursement details' })
  setup(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: SetupDisbursementDto,
  ) {
    return this.disbursementService.setup(leadId, dto as any);
  }

  @Post('penny-drop')
  @Roles(UserRole.UNDERWRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Initiate penny drop verification' })
  pennyDrop(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.disbursementService.initiatePennyDrop(leadId);
  }

  @Post('enach')
  @Roles(UserRole.OPS_AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Register eNACH mandate' })
  registerENach(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() body: { envelopeId: string },
  ) {
    return this.disbursementService.registerENach(leadId, body);
  }

  @Post('esign')
  @Roles(UserRole.OPS_AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Complete eSign process' })
  completeESign(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() body: { documentId: string },
  ) {
    return this.disbursementService.completeESign(leadId, body);
  }

  @Post('initiate')
  @Roles(UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Initiate actual disbursement' })
  initiate(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.disbursementService.initiate(leadId);
  }

  @Get()
  @ApiOperation({ summary: 'Get disbursement details' })
  getDisbursement(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.disbursementService.getDisbursement(leadId);
  }
}
