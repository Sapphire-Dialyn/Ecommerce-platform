import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản của bạn đã bị ban. Liên hệ admin để mở lại.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: pwd, ...result } = user;
    return result;
  }

  async login(user: User) {
    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản của bạn đã bị ban. Liên hệ admin để mở lại.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    // Get user details including related entities based on role
    let userDetails: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    };

    switch (user.role) {
      case 'SELLER':
        const sellerProfile = await this.prisma.seller.findUnique({
          where: { userId: user.id },
          include: { products: { select: { id: true, name: true } } },
        });
        userDetails.seller = sellerProfile;
        break;

      case 'ENTERPRISE':
        const enterpriseProfile = await this.prisma.enterprise.findUnique({
          where: { userId: user.id },
          include: { products: { select: { id: true, name: true } } },
        });
        userDetails.enterprise = enterpriseProfile;
        break;

      case 'LOGISTICS':
        const logisticsProfile = await this.prisma.logisticsPartner.findUnique({
          where: { userId: user.id },
        });
        userDetails.logistics = logisticsProfile;
        break;
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: userDetails,
    };
  }

  async register(data: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = this.generateVerificationToken();
    
    // Start transaction to create user and role-specific profile
    const result = await this.prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          avatar: data.avatar,
          role: data.role || 'CUSTOMER',
          verificationToken: data.role === 'CUSTOMER' ? null : verificationToken,
          isVerified: data.role === 'CUSTOMER', // Auto-verify customers
        },
      });

      // Create role-specific profile if needed
      if (data.role === 'SELLER') {
        await prisma.seller.create({
          data: {
            userId: user.id,
            storeName: data.name,
            verified: false,
          },
        });
        // Send verification email for seller
        await this.emailService.sendVerificationEmail(data.email, verificationToken);
      } else if (data.role === 'LOGISTICS') {
        await prisma.logisticsPartner.create({
          data: {
            userId: user.id,
            name: data.name,
            baseRate: 0,
          },
        });
        // Send verification email for logistics partner
        await this.emailService.sendVerificationEmail(data.email, verificationToken);
      } else if (data.role === 'ADMIN') {
        // Send verification email for admin
        await this.emailService.sendVerificationEmail(data.email, verificationToken);
      }

      return user;
    });

    const { password, verificationToken: token, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async validateJwt(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    // If the user is a seller or logistics partner, notify them that their account needs admin approval
    if (user.role === 'SELLER' || user.role === 'LOGISTICS' || user.role === 'ADMIN') {
      // You might want to send an email to admins here to notify them about the new registration
      await this.emailService.sendRoleApprovalEmail(user.email, user.role);
    }

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    const verificationToken = this.generateVerificationToken();
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    await this.emailService.sendVerificationEmail(email, verificationToken);

    return { message: 'Verification email sent' };
  }
}