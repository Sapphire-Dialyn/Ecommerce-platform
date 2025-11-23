import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer'; // 👈 Import Transform

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
  @Transform(({ value }) => {
    // Nếu value là chuỗi rỗng hoặc null/undefined -> trả về 0
    if (!value) return 0;
    // Ép kiểu sang Number
    return Number(value);
  })
  @IsNumber()
  basePrice: number;

  @ApiProperty()
  @Transform(({ value }) => {
    if (!value) return 0;
    return Number(value);
  })
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
  @Transform(({ value }) => {
    // Nếu variants gửi lên là chuỗi JSON (từ FormData), parse nó ra
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    return value;
  })
  @IsArray()
  variants?: ProductVariantDto[];
}

// ... (Các DTO khác như GetProductsDto, UpdateProductDto giữ nguyên) ...

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
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  stock: number;
}

// ... (Giữ nguyên các DTO còn lại)
export class GetProductsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value)) // Query params cũng là string, cần transform
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take?: number;

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
  @Transform(({ value }) => Number(value)) // Thêm Transform cho Update luôn
  @IsNumber()
  basePrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value)) // Thêm Transform cho Update luôn
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