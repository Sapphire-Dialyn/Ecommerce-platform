export declare class CreateProductDto {
    name: string;
    description: string;
    categoryId: string;
    basePrice: number;
    stock: number;
    sellerId?: string;
    enterpriseId?: string;
    variants?: ProductVariantDto[];
}
export declare class ProductVariantDto {
    color?: string;
    size?: string;
    price: number;
    stock: number;
}
export declare class GetProductsDto {
    skip?: number;
    take?: number;
    categoryId?: string;
    sellerId?: string;
    enterpriseId?: string;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    categoryId?: string;
    basePrice?: number;
    stock?: number;
}
export declare class CreateCategoryDto {
    name: string;
    parentId?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    parentId?: string;
}
export declare class CreateReviewDto {
    rating: number;
    comment?: string;
}
