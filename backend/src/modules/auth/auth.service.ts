import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  NotFoundException,
  ForbiddenException // 👈 1. Nhớ import thêm cái này
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
    // 🔥 2. THÊM ĐOẠN CHECK NÀY 🔥
    // Nếu user.isActive là false (bị ban) -> Chặn luôn, trả về lỗi 403
    if (user.isActive === false) {
      throw new ForbiddenException({
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.',
        // reason: user.banReason // (Tùy chọn) Nếu bạn có lưu lý do trong DB
      });
    }

    // Nếu Active thì tạo token bình thường
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

  // --- XÁC THỰC USER (Giữ nguyên hoặc thêm check tùy ý) ---
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Chúng ta trả về user đầy đủ (trừ password) để hàm login bên trên check isActive
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // --- ĐĂNG KÝ (GIỮ NGUYÊN) ---
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
                isActive: true, // Mặc định tạo mới là Active
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

  // --- CÁC HÀM KHÁC GIỮ NGUYÊN ---
  async validateJwt(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException();
    
    // Nếu muốn chặn cả refresh token khi bị ban thì thêm dòng này:
    if (user.isActive === false) throw new ForbiddenException('User is banned');

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

    const userWithPass = user as any; 

    const isMatch = await bcrypt.compare(oldPass, userWithPass.password);
    if (!isMatch) throw new BadRequestException('Old password incorrect');

    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await this.usersService.update(userId, { password: hashedNewPass });

    return { message: 'Password changed successfully' };
  }
}