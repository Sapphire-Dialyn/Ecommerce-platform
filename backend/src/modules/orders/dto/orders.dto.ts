import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  // 👇👇👇 ĐÃ SỬA Ở ĐÂY 👇👇👇
  @ApiPropertyOptional({ description: 'ID của ProductVariant (Có thể null)' })
  @IsOptional() // Cho phép null hoặc undefined
  @IsString()
  variantId?: string; 
  // 👆👆👆 ---------------------

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'Mảng các ID voucher (Shop, Platform, Freeship)',
    example: ['voucher-id-1'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  voucherIds?: string[];

  @ApiProperty({ description: 'Phí vận chuyển gốc' })
  @IsNumber()
  @Min(0)
  shippingFee: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PROCESSING })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}