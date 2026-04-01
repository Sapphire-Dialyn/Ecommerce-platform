import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { LogisticsStatus, ShipperStatus } from '@prisma/client';

export class CreateShipperDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'URL of the avatar image' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Delivery range in km', default: 5.0 })
  @IsOptional()
  @IsNumber()
  deliveryRange?: number;
}

export class UpdateShipperDto {
  @ApiPropertyOptional({ description: 'Whether the shipper is active' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ enum: ShipperStatus, description: 'Current shipper status' })
  @IsOptional()
  @IsEnum(ShipperStatus)
  status?: ShipperStatus;

  @ApiPropertyOptional({ description: 'Delivery range in km' })
  @IsOptional()
  @IsNumber()
  deliveryRange?: number;
}

export class UpdateLocationDto {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}

export class AssignOrderDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  shipperId: string;
}

export class UpdateAssignedOrderStatusDto {
  @ApiProperty({
    enum: [LogisticsStatus.PICKED_UP, LogisticsStatus.IN_TRANSIT, LogisticsStatus.DELIVERED],
  })
  @IsEnum(LogisticsStatus)
  status: LogisticsStatus;
}
