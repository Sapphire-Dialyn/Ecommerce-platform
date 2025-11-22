import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto, UpdateCategoryDto, CreateReviewDto } from './dto/products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createCategory(createCategoryDto: CreateCategoryDto, req: any): Promise<{
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
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, req: any): Promise<{
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
    deleteCategory(id: string, req: any): Promise<{
        message: string;
    }>;
    createProduct(req: any, createProductDto: CreateProductDto): Promise<{
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
    createReview(productId: string, createReviewDto: CreateReviewDto, req: any): Promise<{
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
    updateProduct(id: string, updateProductDto: UpdateProductDto, req: any): Promise<{
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
    deleteProduct(id: string, req: any): Promise<{
        message: string;
    }>;
}
