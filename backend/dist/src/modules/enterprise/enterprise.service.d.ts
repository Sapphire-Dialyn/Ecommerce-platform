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
