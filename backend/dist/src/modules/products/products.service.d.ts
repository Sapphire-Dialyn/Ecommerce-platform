import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(dto: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAllCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        parentId: string | null;
    }[]>;
    findOneCategory(id: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        parentId: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateCategory(id: string, dto: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteCategory(id: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findSellerByUserId(userId: string): Promise<{
        id: string;
        userId: string;
        storeName: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    findEnterpriseByUserId(userId: string): Promise<{
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
    createProduct(dto: any): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAllProducts(skip?: number, take?: number, categoryId?: string, sellerId?: string, enterpriseId?: string): Promise<{
        images: string[];
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
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
        variants: {
            id: string;
            productId: string;
            color: string | null;
            size: string | null;
            price: number;
            stock: number;
            sku: string | null;
        }[];
        id: string;
        name: string;
        description: string;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        sellerId: string | null;
        enterpriseId: string | null;
    }[]>;
    getProductsBySellerId(sellerId: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
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
    } & {
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
    })[]>;
    getProductsByEnterpriseId(enterpriseId: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            parentId: string | null;
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
        variants: {
            id: string;
            productId: string;
            color: string | null;
            size: string | null;
            price: number;
            stock: number;
            sku: string | null;
        }[];
    } & {
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
    })[]>;
    findOneProduct(id: string): import(".prisma/client").Prisma.Prisma__ProductClient<{
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
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
        variants: {
            id: string;
            productId: string;
            color: string | null;
            size: string | null;
            price: number;
            stock: number;
            sku: string | null;
        }[];
    } & {
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateProduct(id: string, sellerId: string, dto: any): Promise<{
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
    }>;
    deleteProduct(id: string, sellerId: string): Promise<{
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
    }>;
    createReview(productId: string, userId: string, dto: any): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        productId: string;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getProductReviews(productId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        rating: number;
        createdAt: Date;
        productId: string;
        comment: string | null;
    })[]>;
}
