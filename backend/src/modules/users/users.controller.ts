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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto } from './dto/users.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto'; // Import DTO mới
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; // Import Interceptor

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================================================================
  // 🟢 1. GET MY PROFILE (Phải đặt TRƯỚC @Get(':id'))
  // ==================================================================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me') // Endpoint này xử lý GET /users/me
  @ApiOperation({ summary: 'Get current user profile with detailed info' })
  async getMe(@Request() req) {
    // Gọi service lấy full info (bao gồm seller/enterprise)
    return this.usersService.getProfile(req.user.id);
  }

  // ==================================================================
  // 🟢 2. UPDATE MY PROFILE (Upload Avatar & Logo)
  // ==================================================================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('profile') // Endpoint này xử lý PATCH /users/profile
  @ApiOperation({ summary: 'Update user profile and upload avatar/logo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'logo', maxCount: 1 }, // Logo cho Seller/Enterprise
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
  // ADMIN & ADDRESS ENDPOINTS (Các hàm cũ giữ nguyên logic)
  // ==================================================================

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req) {
    // Thêm check role Admin nếu cần chặt chẽ hơn
    if (req.user.role !== Role.ADMIN) {
        // Tùy chỉnh logic nếu muốn
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
    // Only allow users to update their own profile unless they're an admin
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Add a new address' })
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
      throw new Error('Unauthorized');
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
      throw new Error('Unauthorized');
    }
    return this.usersService.deleteAddress(id, addressId);
  }
}