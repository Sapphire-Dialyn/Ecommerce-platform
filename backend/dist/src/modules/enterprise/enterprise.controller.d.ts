import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dto/enterprise.dto';
export declare class EnterpriseController {
    private readonly enterpriseService;
    constructor(enterpriseService: EnterpriseService);
    create(createEnterpriseDto: CreateEnterpriseDto): Promise<{
        enterprise: {
            id: string;
            userId: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
    }>;
    update(userId: string, updateEnterpriseDto: UpdateEnterpriseDto): Promise<{
        enterprise: {
            id: string;
            userId: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
    }>;
    findById(id: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            sellerId: string | null;
            enterpriseId: string | null;
            name: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            categoryId: string;
            images: string[];
            active: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
    }>;
    findByUserId(userId: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            sellerId: string | null;
            enterpriseId: string | null;
            name: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            categoryId: string;
            images: string[];
            active: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            sellerId: string | null;
            enterpriseId: string | null;
            name: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            categoryId: string;
            images: string[];
            active: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
    })[]>;
    uploadLogo(id: string, file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    updateLogo(id: string, file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteLogo(id: string): Promise<void>;
    uploadDocument(id: string, type: 'business' | 'brand' | 'tax', file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteDocument(id: string, type: 'business' | 'brand' | 'tax'): Promise<void>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
