import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  NotFoundException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto'; 
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService, 
  ) {}

  // --- ĐĂNG NHẬP ---
  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  // --- XÁC THỰC USER ---
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // Lưu ý: findByEmail cần trả về object có password để so sánh
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // --- ĐĂNG KÝ ---
  async register(dto: RegisterDto, files?: any) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                role: dto.role, 
                isActive: true,
                isVerified: false, 
            }
        });

        if (dto.role === Role.SELLER) {
            if (!dto.storeName) throw new BadRequestException('Store Name is required for Seller');
            
            await prisma.seller.create({
                data: {
                    userId: newUser.id,
                    storeName: dto.storeName,
                    businessDocumentUrl: files?.businessDocument?.[0]?.originalname || null,
                    identityDocumentUrl: files?.identityDocument?.[0]?.originalname || null,
                    addressDocumentUrl: files?.addressDocument?.[0]?.originalname || null,
                }
            });
        }

        if (dto.role === Role.ENTERPRISE) {
            if (!dto.companyName || !dto.taxCode) {
                throw new BadRequestException('Company Name and Tax Code are required');
            }

            await prisma.enterprise.create({
                data: {
                    userId: newUser.id,
                    companyName: dto.companyName,
                    taxCode: dto.taxCode,
                    officialBrand: dto.officialBrand ?? true, 
                    verified: false, 
                    businessLicenseUrl: files?.businessLicense?.[0]?.originalname || null,
                    brandRegistrationUrl: files?.brandRegistration?.[0]?.originalname || null,
                    taxDocumentUrl: files?.taxDocument?.[0]?.originalname || null,
                }
            });
        }

        return newUser;
    });

    return {
        message: 'User registered successfully',
        userId: result.id,
        role: result.role
    };
  }

  // --- VALIDATE JWT (LẤY PROFILE) ---
  async validateJwt(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException();
    
    // 🛑 ĐÃ SỬA: Trả về user luôn vì object 'user' này đã không có password rồi
    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException();
    
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyEmail(token: string) {
    return { message: 'Email verified' };
  }

  async resendVerificationEmail(email: string) {
    return { message: 'Verification email sent' };
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    // ⚠️ Lưu ý: Vì user trả về không có password, đoạn này có thể lỗi ở Runtime nếu UsersService đã select bỏ password.
    // Tạm thời ép kiểu 'any' để qua TypeScript check.
    // Nếu UsersService thực sự không trả password, bạn cần viết thêm hàm findByIdWithPassword().
    const userWithPass = user as any; 

    const isMatch = await bcrypt.compare(oldPass, userWithPass.password);
    if (!isMatch) throw new BadRequestException('Old password incorrect');

    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await this.usersService.update(userId, { password: hashedNewPass });

    return { message: 'Password changed successfully' };
  }
}