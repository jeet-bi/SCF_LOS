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
import { DocumentsService } from './documents.service';
import {
  GetUploadUrlDto,
  RegisterDocumentDto,
  RejectDocumentDto,
} from './dto/document.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@los-scf/types';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leads/:leadId/documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get pre-signed S3 upload URL' })
  getUploadUrl(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: GetUploadUrlDto,
  ) {
    return this.documentsService.getUploadUrl(
      leadId,
      dto.documentType,
      dto.fileName,
      dto.contentType,
    );
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a document after S3 upload' })
  register(
    @Param('leadId', ParseUUIDPipe) leadId: string,
    @Body() dto: RegisterDocumentDto,
  ) {
    return this.documentsService.registerDocument(
      leadId,
      dto.documentType,
      dto.s3Key,
      dto.fileName,
      dto.mimeType,
      dto.sizeBytes,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all documents for a lead' })
  listForLead(@Param('leadId', ParseUUIDPipe) leadId: string) {
    return this.documentsService.listForLead(leadId);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get pre-signed download URL' })
  getDownloadUrl(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.getDownloadUrl(id);
  }

  @Patch(':id/verify')
  @Roles(UserRole.UNDERWRITER, UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Verify a document' })
  verify(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.documentsService.verify(id, userId);
  }

  @Patch(':id/reject')
  @Roles(UserRole.UNDERWRITER, UserRole.CREDIT_MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject a document' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RejectDocumentDto,
  ) {
    return this.documentsService.reject(id, userId, dto.reason);
  }
}
