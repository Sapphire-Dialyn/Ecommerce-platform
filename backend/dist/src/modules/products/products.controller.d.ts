import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto, CreateReviewDto } from './dto/products.dto';
export declare class ProductsController {
    private readonly productsService;
    private readonly logger;
    constructor(productsService: ProductsService);
    createCategory(dto: CreateCategoryDto, req: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
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
    updateCategory(id: string, dto: UpdateCategoryDto, req: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteCategory(id: string, req: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        parentId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createProduct(req: any, dto: CreateProductDto, file: Express.Multer.File): Promise<{
        variants: {
            id: string;
            stock: number;
            color: string | null;
            size: string | null;
            price: number;
            sku: string | null;
            productId: string;
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
    }>;
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
            stock: number;
            color: string | null;
            size: string | null;
            price: number;
            sku: string | null;
            productId: string;
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
    getProductsBySeller(sellerId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
        variants: {
            id: string;
            stock: number;
            color: string | null;
            size: string | null;
            price: number;
            sku: string | null;
            productId: string;
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
    getProductsByEnterprise(enterpriseId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
            stock: number;
            color: string | null;
            size: string | null;
            price: number;
            sku: string | null;
            productId: string;
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
    createReview(productId: string, dto: CreateReviewDto, req: any): import(".prisma/client").Prisma.Prisma__ReviewClient<{
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
    findOneProduct(id: string): Promise<{
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
            stock: number;
            color: string | null;
            size: string | null;
            price: number;
            sku: string | null;
            productId: string;
        }[];
        reviews: ({
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
        })[];
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
    }>;
    updateProduct(id: string, dto: UpdateProductDto, req: any, file: Express.Multer.File): Promise<{
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
    deleteProduct(id: string, req: any): Promise<{
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
}
