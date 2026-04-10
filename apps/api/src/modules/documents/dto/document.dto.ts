import { IsEnum, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType } from '@los-scf/types';

export class GetUploadUrlDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  contentType: string;
}

export class RegisterDocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty()
  @IsString()
  s3Key: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  sizeBytes: number;
}

export class RejectDocumentDto {
  @ApiProperty()
  @IsString()
  reason: string;
}
