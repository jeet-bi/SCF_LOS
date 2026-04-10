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
import { UnderwritingService } from './underwriting.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@los-scf/types';

@ApiTags('Underwriting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads/:leadId/underwriting')
export class UnderwritingController {
  constructor(private uwService: UnderwritingService) {}

  @Post('initiate')
  @Roles(UserRole.UNDERWRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Initiate underwriting review' })
  initiate(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.uwService.initiateReview(leadId, userId);
  }

  @Get()
  @Roles(UserRole.UNDERWRITER, UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get underwriting report' })
  getReport(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.uwService.getReport(leadId);
  }

  @Patch(':reportId/bank-analysis')
  @Roles(UserRole.UNDERWRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update bank statement analysis' })
  updateBankAnalysis(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.uwService.updateBankAnalysis(reportId, body);
  }

  @Patch(':reportId/bureau-report')
  @Roles(UserRole.UNDERWRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update bureau report' })
  updateBureauReport(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.uwService.updateBureauReport(reportId, body);
  }
}
