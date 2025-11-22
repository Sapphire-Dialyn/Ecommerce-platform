import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto, CreateReviewDto } from './dto/products.dto';
export declare class ProductsService {
    private prisma;
    private cloudinary;
    constructor(prisma: PrismaService, cloudinary: CloudinaryService);
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
    createProduct(createProductDto: CreateProductDto): Promise<{
        seller: {
            id: string;
            storeName: string;
            verified: boolean;
        };
        enterprise: {
            id: string;
            verified: boolean;
            companyName: string;
            officialBrand: boolean;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
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
    }>;
    findAllProducts(skip?: number, take?: number, categoryId?: string, sellerId?: string): Promise<({
        seller: {
            id: string;
            storeName: string;
            verified: boolean;
        };
        enterprise: {
            id: string;
            verified: boolean;
            companyName: string;
            officialBrand: boolean;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
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
    findOneProduct(id: string): Promise<{
        seller: {
            id: string;
            storeName: string;
            verified: boolean;
        };
        enterprise: {
            id: string;
            verified: boolean;
            companyName: string;
            officialBrand: boolean;
        };
        category: {
            id: string;
            name: string;
            parentId: string | null;
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
    updateProduct(id: string, ownerId: string, updateProductDto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            parentId: string | null;
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
    }>;
    uploadProductImages(productId: string, ownerId: string, files: Express.Multer.File[]): Promise<{
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
    deleteProductImage(productId: string, ownerId: string, imageUrl: string): Promise<{
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
    deleteProduct(id: string, ownerId: string): Promise<{
        message: string;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        parent: {
            id: string;
            name: string;
            parentId: string | null;
        };
        children: {
            id: string;
            name: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        parentId: string | null;
    }>;
    findAllCategories(): Promise<({
        parent: {
            id: string;
            name: string;
            parentId: string | null;
        };
        children: {
            id: string;
            name: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        parentId: string | null;
    })[]>;
    findOneCategory(id: string): Promise<{
        products: ({
            seller: {
                id: string;
                storeName: string;
                verified: boolean;
            };
            enterprise: {
                id: string;
                verified: boolean;
                companyName: string;
                officialBrand: boolean;
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
        })[];
        parent: {
            id: string;
            name: string;
            parentId: string | null;
        };
        children: {
            id: string;
            name: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        parentId: string | null;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        parent: {
            id: string;
            name: string;
            parentId: string | null;
        };
        children: {
            id: string;
            name: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        parentId: string | null;
    }>;
    deleteCategory(id: string): Promise<{
        message: string;
    }>;
    createReview(productId: string, userId: string, createReviewDto: CreateReviewDto): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        rating: number;
        createdAt: Date;
        productId: string;
        comment: string | null;
    }>;
    getProductReviews(productId: string): Promise<({
        user: {
            id: string;
            name: string;
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
