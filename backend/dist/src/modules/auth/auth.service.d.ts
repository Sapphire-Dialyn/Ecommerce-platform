import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    private generateVerificationToken;
    validateUser(email: string, password: string): Promise<any>;
    login(user: User): Promise<{
        access_token: string;
        user: any;
    }>;
    register(data: RegisterDto): Promise<{
        name: string;
        id: string;
        email: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    validateJwt(userId: string): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
}
