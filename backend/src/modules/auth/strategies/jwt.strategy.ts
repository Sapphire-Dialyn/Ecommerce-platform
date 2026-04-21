import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // 👈 Import PrismaService (Sửa đường dẫn nếu cần)

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) { // 👈 Inject PrismaService vào constructor
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // 1. Tìm user trong database dựa vào ID nằm trong payload của token
    const user = await this.prisma.user.findUnique({ 
      where: { id: payload.sub } 
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    if (!payload.sessionId) {
  throw new UnauthorizedException('Phiên làm việc không hợp lệ. Vui lòng đăng nhập lại.');
}

    // 2. KIỂM TRA PHIÊN ĐĂNG NHẬP (SINGLE SESSION LOGIC)
    // Nếu sessionId trong token KHÔNG KHỚP với sessionId mới nhất trên DB
    // => Token này thuộc về một tab/thiết bị cũ đã bị đăng nhập đè
    if (user.activeSessionId !== payload.sessionId) {
      const clientIp = user.lastLoginIp || 'Không xác định';
      
      throw new UnauthorizedException({
        code: 'CONCURRENT_LOGIN',
        // 🔥 Gắn IP thẳng vào chuỗi text để sống sót qua cái Exception Filter
        message: `Tài khoản đã được truy cập ở nơi khác [IP_ADDR: ${clientIp}]`,
        ip: clientIp
      });
    }

    // 3. Nếu mọi thứ hợp lệ, trả về cục data để gắn vào req.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}