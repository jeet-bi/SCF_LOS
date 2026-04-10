import {
  IsString,
  IsEnum,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  IsObject,
  ValidateNested,
  Matches,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BorrowerType, LoanProductType } from '@los-scf/types';

export class AddressDto {
  @ApiProperty()
  @IsString()
  line1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @Matches(/^\d{6}$/, { message: 'Pincode must be 6 digits' })
  pincode: string;

  @ApiPropertyOptional({ default: 'India' })
  @IsOptional()
  @IsString()
  country?: string = 'India';
}

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  borrowerName: string;

  @ApiProperty({ enum: BorrowerType })
  @IsEnum(BorrowerType)
  borrowerType: BorrowerType;

  @ApiProperty({ description: 'PAN card number' })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: 'Invalid PAN format' })
  pan: string;

  @ApiProperty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  mobile: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: LoanProductType })
  @IsEnum(LoanProductType)
  productType: LoanProductType;

  @ApiProperty({ description: 'Loan amount in paise' })
  @IsInt()
  @Min(100000 * 100)
  loanAmount: number;

  @ApiPropertyOptional({ description: 'GSTIN (15-char)' })
  @IsOptional()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Invalid GSTIN format',
  })
  gstin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional({ description: 'Business vintage in years' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  businessVintage?: number;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturerName?: string;
}
