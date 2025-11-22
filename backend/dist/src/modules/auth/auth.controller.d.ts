import { AuthService } from './auth.service';
import { RegisterDto, ChangePasswordDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
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
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    refresh(req: any): Promise<{
        access_token: string;
    }>;
    changePassword(req: any, data: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getCurrentUser(req: any): Promise<{
        name: string;
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
    }>;
}
