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
import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CamService } from './cam.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@los-scf/types';

class SanctionDto {
  @ApiProperty()
  @IsBoolean()
  approved: boolean;
}

@ApiTags('CAM')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads/:leadId/cam')
export class CamController {
  constructor(private camService: CamService) {}

  @Post('generate')
  @Roles(UserRole.UNDERWRITER, UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Generate CAM for a lead' })
  generate(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.camService.generate(leadId);
  }

  @Get()
  @Roles(UserRole.UNDERWRITER, UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get CAM document' })
  getCam(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.camService.getCam(leadId);
  }

  @Patch(':camId/sanction')
  @Roles(UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Sanction or reject CAM' })
  sanction(
    @Param('camId', ParseUUIDPipe) camId: string,
    @Body() dto: SanctionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.camService.sanction(camId, userId, dto.approved);
  }
}
