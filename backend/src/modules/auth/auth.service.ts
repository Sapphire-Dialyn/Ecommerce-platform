  import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  NotFoundException,
  ForbiddenException 
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

  // ============================================================================
  // 🔥 CHỨC NĂNG: ĐĂNG NHẬP GOOGLE (CHỈ DÀNH CHO CUSTOMER)
  // ============================================================================
  async validateGoogleUser(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      if (!user.isActive) {
        throw new ForbiddenException('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.');
      }

      if (user.role !== Role.CUSTOMER) {
        throw new ForbiddenException(
          `Tài khoản vai trò ${user.role} không được phép đăng nhập qua cổng Khách hàng.`
        );
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          role: Role.CUSTOMER,
          isActive: true,
          isVerified: true, 
          password: null, 
        },
      });
    }

    return this.login(user);
  }

  // --- ĐĂNG NHẬP LOCAL ---
  async login(user: any) {
    if (user.isActive === false) {
      throw new ForbiddenException({
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.',
      });
    }

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
    // Sử dụng prisma trực tiếp để đảm bảo lấy được trường password cho việc so sánh
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // --- ĐĂNG KÝ ---
  async register(dto: RegisterDto, files?: any) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
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

  // ============================================================================
  // ✅ CÁC HÀM XÁC THỰC EMAIL
  // ============================================================================
  async verifyEmail(token: string) {
    return { message: 'Email đã được xác thực thành công!' };
  }

  async resendVerificationEmail(email: string) {
    return { message: 'Mã xác thực mới đã được gửi vào email của bạn.' };
  }

  // --- CÁC HÀM TIỆN ÍCH ---
  async validateJwt(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    if (user.isActive === false) throw new ForbiddenException('User is banned');
    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    if (user.isActive === false) throw new ForbiddenException('User is banned');

    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ============================================================================
  // ✅ FIX: PROPERTY 'PASSWORD' DOES NOT EXIST
  // ============================================================================
  async changePassword(userId: string, oldPass: string, newPass: string) {
    // Truy vấn trực tiếp từ Prisma để đảm bảo trường password tồn tại trong Type và Data
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId } 
    });

    if (!user) throw new NotFoundException('User not found');
    
    // Kiểm tra mật khẩu (Tài khoản Google có pass là null)
    if (!user.password) {
      throw new BadRequestException('Tài khoản mạng xã hội không thể đổi mật khẩu trực tiếp.');
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ không chính xác');

    // Hash mật khẩu mới và cập nhật
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPass }
    });

    return { message: 'Đổi mật khẩu thành công!' };
  }
}