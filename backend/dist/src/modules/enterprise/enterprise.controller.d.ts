import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dto/enterprise.dto';
export declare class EnterpriseController {
    private readonly enterpriseService;
    constructor(enterpriseService: EnterpriseService);
    create(createEnterpriseDto: CreateEnterpriseDto): Promise<{
        enterprise: {
            id: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
            userId: string;
        };
    } & {
        id: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: string, updateEnterpriseDto: UpdateEnterpriseDto): Promise<{
        enterprise: {
            id: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
            userId: string;
        };
    } & {
        id: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<{
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            active: boolean;
            categoryId: string;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        user: {
            id: string;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
        userId: string;
    }>;
    findByUserId(userId: string): Promise<{
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            active: boolean;
            categoryId: string;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        user: {
            id: string;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
        userId: string;
    }>;
    findAll(): Promise<({
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            active: boolean;
            categoryId: string;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        user: {
            id: string;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
        userId: string;
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
