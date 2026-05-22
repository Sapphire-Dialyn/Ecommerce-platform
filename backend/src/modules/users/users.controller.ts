import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  NotFoundException,
  ForbiddenException, // 🟢 THÊM MỚI: Dùng để báo lỗi 403 chuẩn thay vì lỗi 500 hệ thống
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto } from './dto/users.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; 

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================================================================
  // 🟢 1. GET MY PROFILE (Phải đặt TRƯỚC @Get(':id'))
  // ==================================================================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me') 
  @ApiOperation({ summary: 'Get current user profile with detailed info' })
  async getMe(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  // ==================================================================
  // 🟢 2. UPDATE MY PROFILE (Upload Avatar & Logo)
  // ==================================================================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile') 
  @ApiOperation({ summary: 'Update user profile and upload avatar/logo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'logo', maxCount: 1 }, 
  ]))
  async updateProfile(
    @Request() req,
    @Body() dto: UpdateUserProfileDto,
    @UploadedFiles() files: { 
      avatar?: Express.Multer.File[], 
      logo?: Express.Multer.File[] 
    },
  ) {
    return this.usersService.updateProfile(req.user.id, req.user.role, dto, files);
  }

  // ==================================================================
  // 🟢 3. ADD MY ADDRESS (Dành cho chính user đăng nhập tự thêm địa chỉ)
  // Vị trí đặt cực kỳ quan trọng: Phải nằm TRÊN các hàm có cấu trúc chứa ":id"
  // ==================================================================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('profile/addresses')
  @ApiOperation({ summary: 'Add a new address for current user' })
  @ApiResponse({ status: 201, description: 'Address has been added successfully.' })
  async addMyAddress(@Request() req, @Body() addressDto: AddAddressDto) {
    // Lấy thẳng id an toàn từ JWT Token đã được xác thực, không phụ thuộc URL tham số
    return this.usersService.addAddress(req.user.id, addressDto);
  }

  // ==================================================================
  // ADMIN & GENERAL MANAGEMENT ENDPOINTS
  // ==================================================================

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req) {
    if (req.user.role !== Role.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền truy cập danh sách này');
    }
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @ApiOperation({ summary: 'Update user (Admin or Owner)' })
  @ApiResponse({ status: 200, description: 'User has been updated.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('Bạn không được phép chỉnh sửa hồ sơ người khác');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Add a new address by User ID (Admin or Target Owner)' })
  @ApiResponse({ status: 201, description: 'Address has been added.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/addresses')
  async addAddress(
    @Param('id') id: string,
    @Body() addressDto: AddAddressDto,
    @Request() req,
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('Bạn không có quyền thêm địa chỉ cho tài khoản này');
    }
    return this.usersService.addAddress(id, addressDto);
  }

  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address has been deleted.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/addresses/:addressId')
  async deleteAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Request() req,
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new ForbiddenException('Bạn không có quyền xóa địa chỉ của tài khoản này');
    }
    return this.usersService.deleteAddress(id, addressId);
  }
}