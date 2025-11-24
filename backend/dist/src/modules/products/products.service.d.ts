import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
export declare class ProductsService {
    private prisma;
    private cloudinaryService;
    private readonly logger;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
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
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    findEnterpriseByUserId(userId: string): Promise<{
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
    createProduct(dto: CreateProductDto, file?: Express.Multer.File): Promise<{
        variants: {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        }[];
    } & {
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
    }>;
    findAllProducts(skip?: number, take?: number, categoryId?: string, sellerId?: string, enterpriseId?: string): Promise<{
        images: string[];
        seller: {
            id: string;
            userId: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
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
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
        variants: {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        sellerId: string | null;
        enterpriseId: string | null;
        name: string;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        categoryId: string;
        active: boolean;
    }[]>;
    getProductsBySellerId(sellerId: string): import(".prisma/client").Prisma.PrismaPromise<({
        seller: {
            id: string;
            userId: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
        variants: {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        }[];
    } & {
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
    })[]>;
    getProductsByEnterpriseId(enterpriseId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
        variants: {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        }[];
    } & {
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
    })[]>;
    findOneProduct(id: string): Promise<{
        seller: {
            id: string;
            userId: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
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
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
        variants: {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        }[];
        reviews: ({
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
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            productId: string;
            rating: number;
            comment: string | null;
        })[];
    } & {
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
    }>;
    updateProduct(id: string, ownerId: string, role: string, dto: UpdateProductDto, file?: Express.Multer.File): Promise<{
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
    }>;
    deleteProduct(id: string, ownerId: string, role: string): Promise<{
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
    }>;
    createReview(productId: string, userId: string, dto: any): import(".prisma/client").Prisma.Prisma__ReviewClient<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getProductReviews(productId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string | null;
    })[]>;
}
