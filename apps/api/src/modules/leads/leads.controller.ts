import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  UpdateLeadStatusDto,
  AssignLeadDto,
  UpdateLeadDto,
} from './dto/update-lead.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthUser, UserRole } from '@los-scf/types';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @Roles(UserRole.OPS_AGENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new lead' })
  create(@Body() dto: CreateLeadDto, @CurrentUser() user: AuthUser) {
    return this.leadsService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List leads with pagination' })
  findAll(@Query() query: PaginationDto, @CurrentUser() user: AuthUser) {
    return this.leadsService.findAll(query, user);
  }

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats(@CurrentUser() user: AuthUser) {
    return this.leadsService.getDashboardStats(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead details' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.leadsService.findOne(id, user);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update lead status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.leadsService.updateStatus(id, dto, user);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.CREDIT_MANAGER)
  @ApiOperation({ summary: 'Assign lead to an agent' })
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignLeadDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.leadsService.assign(id, dto, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead details' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.leadsService.update(id, dto, user);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get lead activity timeline' })
  getActivity(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.leadsService.getActivity(id, user);
  }
}
