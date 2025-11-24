import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto } from './dto/users.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto'; // Import DTO mới
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    // Cấu hình Cloudinary
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
        this.logger.error('❌ Cloudinary Config MISSING in .env file!');
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  // Helper upload ảnh lên Cloudinary
  private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder, resource_type: 'auto' },
        (error, result) => {
          if (error) {
            this.logger.error(`❌ Cloudinary Error: ${JSON.stringify(error)}`);
            return reject(new BadRequestException('Failed to upload image to Cloudinary'));
          }
          resolve(result?.secure_url || '');
        }
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  // --- GET PROFILE (Full Info cho trang Profile) ---
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        seller: true,
        enterprise: true,
        addresses: true, // Có thể include thêm address nếu cần
      },
    });
    if (!user) throw new NotFoundException('User not found');
    
    // Loại bỏ password trước khi trả về
    const { password, ...result } = user; 
    return result;
  }

  // --- UPDATE PROFILE (Bao gồm upload ảnh & update Seller/Enterprise) ---
  async updateProfile(
    userId: string, 
    role: string, // Role lấy từ token (req.user.role) - Role trong schema là enum nhưng ở đây nhận string cũng được
    dto: UpdateUserProfileDto, 
    files?: { avatar?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    // 1. Xử lý Upload ảnh
    let avatarUrl: string | undefined;
    let logoUrl: string | undefined;

    if (files?.avatar?.[0]) {
      avatarUrl = await this.uploadToCloudinary(files.avatar[0], 'avatars');
    }
    if (files?.logo?.[0]) {
      logoUrl = await this.uploadToCloudinary(files.logo[0], 'logos');
    }

    // 2. Update User cơ bản (Name, Phone, Avatar)
    // Tạo object data dynamic để chỉ update những trường có gửi lên
    const userDataToUpdate: any = {};
    if (dto.name) userDataToUpdate.name = dto.name;
    if (dto.phone) userDataToUpdate.phone = dto.phone;
    if (avatarUrl) userDataToUpdate.avatar = avatarUrl;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userDataToUpdate,
      include: { seller: true, enterprise: true }
    });

    // 3. Update thông tin riêng theo Role (Seller/Enterprise)
    if (role === Role.SELLER && updatedUser.seller) {
      const sellerDataToUpdate: any = {};
      if (dto.storeName) sellerDataToUpdate.storeName = dto.storeName;
      if (logoUrl) sellerDataToUpdate.logoUrl = logoUrl;

      if (Object.keys(sellerDataToUpdate).length > 0) {
        await this.prisma.seller.update({
          where: { id: updatedUser.seller.id },
          data: sellerDataToUpdate,
        });
      }
    } else if (role === Role.ENTERPRISE && updatedUser.enterprise) {
      const enterpriseDataToUpdate: any = {};
      if (dto.companyName) enterpriseDataToUpdate.companyName = dto.companyName;
      if (dto.taxCode) enterpriseDataToUpdate.taxCode = dto.taxCode;
      if (logoUrl) enterpriseDataToUpdate.logoUrl = logoUrl;

      if (Object.keys(enterpriseDataToUpdate).length > 0) {
        await this.prisma.enterprise.update({
          where: { id: updatedUser.enterprise.id },
          data: enterpriseDataToUpdate,
        });
      }
    }

    // Trả về thông tin mới nhất sau khi update tất cả
    return this.getProfile(userId);
  }

  // --- CÁC PHƯƠNG THỨC CŨ (Giữ nguyên logic nhưng clean code hơn) ---

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        addresses: true,
        // Có thể select thêm avatar, phone nếu muốn hiển thị ở list admin
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { // Dùng include thay vì select để lấy hết trừ pass (xử lý sau) hoặc select cụ thể
        seller: true,
        enterprise: true,
        addresses: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Loại bỏ password
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async addAddress(userId: string, addressDto: AddAddressDto) {
    // Logic đặt default address
    const addressCount = await this.prisma.address.count({
      where: { userId },
    });

    const isDefault = addressDto.isDefault || addressCount === 0;

    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...addressDto,
        isDefault,
        userId,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    // Nếu xóa địa chỉ mặc định, chọn địa chỉ mới nhất làm mặc định
    if (address.isDefault) {
      const lastAddress = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (lastAddress) {
        await this.prisma.address.update({
          where: { id: lastAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }
}