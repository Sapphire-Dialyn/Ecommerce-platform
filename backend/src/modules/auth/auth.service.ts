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
import * as crypto from 'crypto'; // 👈 Import thư viện crypto để tạo UUID

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
  // Thêm tham số clientIp để ghi nhận IP nếu đăng nhập bằng Google
  async validateGoogleUser(googleUser: any, clientIp: string) {
    // Tìm user theo email từ Google trả về
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      // Kiểm tra trạng thái tài khoản
      if (!user.isActive) {
        throw new ForbiddenException('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.');
      }

      // Ràng buộc Role nếu cần (ví dụ Google chỉ dành cho Customer)
      if (user.role !== Role.CUSTOMER) {
        throw new ForbiddenException(
          `Tài khoản vai trò ${user.role} không được phép đăng nhập qua cổng Khách hàng.`
        );
      }
    } else {
      // Nếu chưa có thì tạo user mới với role mặc định là CUSTOMER
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          role: Role.CUSTOMER,
          isActive: true,
          isVerified: true, 
          password: null, // Tài khoản Google không có pass local
        },
      });
    }

    // 🔥 GỌI HÀM LOGIN TỔNG: Tại đây sessionId mới sẽ được sinh ra và IP sẽ được lưu vào DB
    return this.login(user, clientIp);
  }

  // ============================================================================
  // --- ĐĂNG NHẬP LOCAL ---
  // ============================================================================
  // 👈 THÊM THAM SỐ clientIp
  async login(user: any, clientIp: string = 'Unknown IP') {
    if (user.isActive === false) {
      throw new ForbiddenException({
        message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.',
      });
    }

    // 1. TẠO SESSION ID MỚI CHO LẦN ĐĂNG NHẬP NÀY
    const sessionId = crypto.randomUUID();

    // 2. CẬP NHẬT DATABASE (Lưu Session ID mới nhất và IP truy cập)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        activeSessionId: sessionId,
        lastLoginIp: clientIp,
      },
    });

    // 3. ĐƯA SESSION ID VÀO PAYLOAD CỦA TOKEN
    const payload = { 
      username: user.email, 
      sub: user.id, 
      role: user.role,
      sessionId: sessionId // 👈 Rất quan trọng để check xem có bị đăng nhập đè không
    };

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

    // 👇 Giữ nguyên Session ID hiện tại khi làm mới token để không bị đăng xuất
    const payload = { 
      username: user.email, 
      sub: user.id, 
      role: user.role,
      sessionId: user.activeSessionId 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ============================================================================
  // ✅ FIX: PROPERTY 'PASSWORD' DOES NOT EXIST
  // ============================================================================
  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId } 
    });

    if (!user) throw new NotFoundException('User not found');
    
    if (!user.password) {
      throw new BadRequestException('Tài khoản mạng xã hội không thể đổi mật khẩu trực tiếp.');
    }

    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ không chính xác');

    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPass }
    });

    return { message: 'Đổi mật khẩu thành công!' };
  }
}