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
    update(userId: string, data: {
        name?: string;
        phone?: string;
        avatar?: string;
        companyName?: string;
        taxCode?: string;
    }): Promise<{
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
