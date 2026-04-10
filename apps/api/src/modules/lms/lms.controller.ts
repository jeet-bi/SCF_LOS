import { Controller, Get, Post, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LmsService } from './lms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@los-scf/types';

@ApiTags('LMS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads/:leadId/lms')
export class LmsController {
  constructor(private lmsService: LmsService) {}

  @Post('transfer')
  @Roles(UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Transfer disbursed loan to LMS' })
  transfer(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.lmsService.transferToLms(leadId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get LMS transfer status' })
  status(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.lmsService.getLmsStatus(leadId);
  }
}
