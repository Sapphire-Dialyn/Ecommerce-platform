import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto } from './dto/users.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto'; 
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

  // --- GET PROFILE ---
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        seller: true,
        enterprise: true,
        addresses: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...result } = user; 
    return result;
  }

  // --- UPDATE PROFILE ---
  async updateProfile(
    userId: string, 
    role: string, 
    dto: UpdateUserProfileDto, 
    files?: { avatar?: Express.Multer.File[], logo?: Express.Multer.File[] }
  ) {
    let avatarUrl: string | undefined;
    let logoUrl: string | undefined;

    if (files?.avatar?.[0]) {
      avatarUrl = await this.uploadToCloudinary(files.avatar[0], 'avatars');
    }
    if (files?.logo?.[0]) {
      logoUrl = await this.uploadToCloudinary(files.logo[0], 'logos');
    }

    const userDataToUpdate: any = {};
    if (dto.name) userDataToUpdate.name = dto.name;
    if (dto.phone) userDataToUpdate.phone = dto.phone;
    if (avatarUrl) userDataToUpdate.avatar = avatarUrl;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: userDataToUpdate,
      include: { seller: true, enterprise: true }
    });

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

    return this.getProfile(userId);
  }

  // --- CÁC PHƯƠNG THỨC CŨ (ĐÃ SỬA findAll) ---

  async findAll() {
    // 🔥 ĐÃ SỬA: Dùng 'include' để lấy FULL thông tin thay vì 'select' bị thiếu
    // Điều này đảm bảo name, avatar, phone và các relation đều có mặt
    return this.prisma.user.findMany({
      include: {
        seller: true,
        enterprise: true,
        logistics: true,
        shipper: true,
        addresses: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { 
        seller: true,
        enterprise: true,
        addresses: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
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
      // Có thể dùng include ở đây nếu muốn trả về full sau khi tạo
      include: {
        seller: true,
        enterprise: true
      }
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
      include: { // Sửa thành include luôn cho đồng bộ
        seller: true,
        enterprise: true
      }
    });
  }

  async addAddress(userId: string, addressDto: AddAddressDto) {
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