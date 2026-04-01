import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LogisticsStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateLogisticsPartnerDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apiEndpoint?: string;

  @ApiProperty()
  @IsNumber()
  baseRate: number;
}

export class UpdateLogisticsPartnerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  apiEndpoint?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  baseRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  rating?: number;
}

export class CreateLogisticsOrderDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  logisticsPartnerId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedDelivery?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLogisticsOrderDto {
  @ApiPropertyOptional({ enum: LogisticsStatus })
  @IsOptional()
  @IsEnum(LogisticsStatus)
  status?: LogisticsStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedDelivery?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class AssignLogisticsOrderDto {
  @ApiProperty()
  @IsString()
  shipperId: string;
}

export class CalculateShippingDto {
  @ApiProperty()
  @IsString()
  fromProvince: string;

  @ApiProperty()
  @IsString()
  toProvince: string;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  express?: boolean;
}
