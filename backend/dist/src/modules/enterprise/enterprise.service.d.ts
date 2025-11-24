import { PrismaService } from '@modules/prisma/prisma.service';
import { FileUploadService } from '../../common/services/file-upload.service';
export declare class EnterpriseService {
    private prisma;
    private fileUploadService;
    constructor(prisma: PrismaService, fileUploadService: FileUploadService);
    create(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        avatar?: string;
        companyName: string;
        taxCode?: string;
    }): Promise<{
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
    update(userId: string, data: {
        name?: string;
        phone?: string;
        avatar?: string;
        companyName?: string;
        taxCode?: string;
    }): Promise<{
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
    uploadLogo(file: Express.Multer.File, enterpriseId: string): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    updateLogo(file: Express.Multer.File, enterpriseId: string): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteLogo(enterpriseId: string): Promise<void>;
    uploadDocument(file: Express.Multer.File, enterpriseId: string, documentType: 'business' | 'brand' | 'tax'): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteDocument(enterpriseId: string, documentType: 'business' | 'brand' | 'tax'): Promise<void>;
    private deleteAllDocuments;
    delete(id: string): Promise<{
        message: string;
    }>;
}
