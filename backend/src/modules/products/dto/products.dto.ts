import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsNumber()
  basePrice: number;

  @ApiProperty()
  @IsNumber()
  stock: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sellerId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  enterpriseId?: string;

  @ApiProperty({ type: () => ProductVariantDto, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  variants?: ProductVariantDto[];
}

export class GetProductsDto {
  @IsOptional()
  @IsNumber()
  skip?: string; // string vì query params là string

  @IsOptional()
  @IsNumber()
  take?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  sellerId?: string;

  @IsOptional()
  @IsString()
  enterpriseId?: string;
}

export class ProductVariantDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  stock: number;
}

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  stock?: number;
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class CreateReviewDto {
  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}