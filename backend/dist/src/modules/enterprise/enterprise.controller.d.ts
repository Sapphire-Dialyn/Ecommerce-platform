import { EnterpriseService } from './enterprise.service';
import { CreateEnterpriseDto, UpdateEnterpriseDto } from './dto/enterprise.dto';
export declare class EnterpriseController {
    private readonly enterpriseService;
    constructor(enterpriseService: EnterpriseService);
    create(createEnterpriseDto: CreateEnterpriseDto): Promise<{
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
    }>;
    update(userId: string, updateEnterpriseDto: UpdateEnterpriseDto): Promise<{
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
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
    }>;
    findById(id: string): Promise<{
        products: {
            id: string;
            name: string;
            description: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
        };
    } & {
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
    }>;
    findByUserId(userId: string): Promise<{
        products: {
            id: string;
            name: string;
            description: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
        };
    } & {
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
    }>;
    findAll(): Promise<({
        products: {
            id: string;
            name: string;
            description: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            images: string[];
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        user: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
        };
    } & {
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
