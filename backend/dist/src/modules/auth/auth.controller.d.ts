import { AuthService } from './auth.service';
import { RegisterDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            avatar: any;
        };
    }>;
    register(data: RegisterDto, files: {
        businessLicense?: Express.Multer.File[];
        brandRegistration?: Express.Multer.File[];
        taxDocument?: Express.Multer.File[];
        businessDocument?: Express.Multer.File[];
        identityDocument?: Express.Multer.File[];
        addressDocument?: Express.Multer.File[];
    }): Promise<{
        message: string;
        userId: string;
        role: import(".prisma/client").$Enums.Role;
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
        seller: {
            id: string;
            userId: string;
            storeName: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        enterprise: {
            id: string;
            userId: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            companyName: string;
            taxCode: string | null;
            officialBrand: boolean;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
        };
        addresses: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            label: string | null;
            fullName: string;
            province: string;
            district: string;
            ward: string;
            street: string;
            isDefault: boolean;
        }[];
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
