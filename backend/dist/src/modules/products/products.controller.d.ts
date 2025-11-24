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
    getProductsBySeller(sellerId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    getProductsByEnterprise(enterpriseId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    createReview(productId: string, dto: CreateReviewDto, req: any): import(".prisma/client").Prisma.Prisma__ReviewClient<{
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
    updateProduct(id: string, dto: UpdateProductDto, req: any, file: Express.Multer.File): Promise<{
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
    deleteProduct(id: string, req: any): Promise<{
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
}
