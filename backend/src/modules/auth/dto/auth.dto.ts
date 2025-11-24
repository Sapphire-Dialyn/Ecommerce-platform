import { ApiProperty } from '@nestjs/swagger';
// Chỉ giữ lại các validator đơn giản, bỏ IsEmail, IsStrongPassword, MinLength
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer'; // 👈 Cần import Transform

export class RegisterDto {
  @ApiProperty()
  @IsString() // 👈 Thay IsEmail bằng IsString để nhập "admin" cũng được
  email: string;

  @ApiProperty()
  @IsString() // 👈 Bỏ MinLength(6) và IsStrongPassword để nhập "123" cũng được
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  // --- Dành cho Seller ---
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storeName?: string;

  // --- Dành cho Enterprise ---
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  taxCode?: string;

  // 👇 QUAN TRỌNG: Xử lý boolean từ FormData
  // FormData luôn gửi "true" (string), cần ép kiểu về boolean
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  verified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  officialBrand?: boolean;
  
  // Các trường file không cần khai báo trong DTO này vì lấy qua @UploadedFiles()
}

export class LoginDto {
  @ApiProperty()
  @IsString() // Nới lỏng login luôn
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  token: string;
}

export class ResendVerificationDto {
  @ApiProperty()
  @IsString()
  email: string;
}