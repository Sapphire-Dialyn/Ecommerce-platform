"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductsService = class ProductsService {
    constructor(prisma, cloudinary) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    async findSellerByUserId(userId) {
        const seller = await this.prisma.seller.findUnique({
            where: { userId },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller profile not found');
        }
        return seller;
    }
    async findEnterpriseByUserId(userId) {
        const enterprise = await this.prisma.enterprise.findUnique({
            where: { userId },
        });
        if (!enterprise) {
            throw new common_1.NotFoundException('Enterprise profile not found');
        }
        return enterprise;
    }
    async createProduct(createProductDto) {
        const category = await this.prisma.category.findUnique({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (!createProductDto.sellerId && !createProductDto.enterpriseId) {
            throw new common_1.BadRequestException('Either sellerId or enterpriseId must be provided');
        }
        if (createProductDto.sellerId && createProductDto.enterpriseId) {
            throw new common_1.BadRequestException('Product can only belong to either a seller or an enterprise');
        }
        if (createProductDto.sellerId) {
            const seller = await this.prisma.seller.findUnique({
                where: { id: createProductDto.sellerId },
            });
            if (!seller)
                throw new common_1.NotFoundException('Seller not found');
        }
        if (createProductDto.enterpriseId) {
            const enterprise = await this.prisma.enterprise.findUnique({
                where: { id: createProductDto.enterpriseId },
            });
            if (!enterprise)
                throw new common_1.NotFoundException('Enterprise not found');
        }
        const { variants } = createProductDto, productData = __rest(createProductDto, ["variants"]);
        return this.prisma.product.create({
            data: Object.assign(Object.assign({}, productData), { variants: {
                    create: variants || [],
                } }),
            include: {
                category: true,
                variants: true,
                enterprise: { select: { id: true, companyName: true, verified: true, officialBrand: true } },
                seller: { select: { id: true, storeName: true, verified: true } },
            },
        });
    }
    async findAllProducts(skip, take, categoryId, sellerId) {
        const safeSkip = (skip && !isNaN(Number(skip))) ? Number(skip) : 0;
        const safeTake = (take && !isNaN(Number(take))) ? Number(take) : undefined;
        return this.prisma.product.findMany({
            skip: safeSkip,
            take: safeTake,
            where: Object.assign(Object.assign({}, (categoryId && { categoryId })), (sellerId && { sellerId })),
            include: {
                category: true,
                variants: true,
                enterprise: {
                    select: {
                        id: true,
                        companyName: true,
                        verified: true,
                        officialBrand: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        storeName: true,
                        verified: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
    }
    async findOneProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: true,
                enterprise: { select: { id: true, companyName: true, verified: true, officialBrand: true } },
                seller: { select: { id: true, storeName: true, verified: true } },
                reviews: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async updateProduct(id, ownerId, updateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
            throw new common_1.BadRequestException('You can only update your own products');
        }
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
            include: {
                category: true,
                variants: true,
            },
        });
    }
    async uploadProductImages(productId, ownerId, files) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
            throw new common_1.BadRequestException('You can only upload images for your own products');
        }
        const uploadedImages = await Promise.all(files.map((file) => this.cloudinary.uploadFile(file, { folder: 'products' })));
        const imageUrls = uploadedImages.map((result) => result.secure_url);
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                images: {
                    push: imageUrls,
                },
            },
        });
    }
    async deleteProductImage(productId, ownerId, imageUrl) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { images: true, sellerId: true, enterpriseId: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
            throw new common_1.BadRequestException('Action not allowed');
        }
        if (!product.images.includes(imageUrl)) {
            throw new common_1.NotFoundException('Image not found in product');
        }
        try {
            const publicId = this.cloudinary.getPublicIdFromUrl(imageUrl);
            if (publicId) {
                await this.cloudinary.deleteFile(publicId);
            }
        }
        catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
        }
        const updatedImages = product.images.filter((url) => url !== imageUrl);
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                images: updatedImages,
            },
        });
    }
    async deleteProduct(id, ownerId) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            select: {
                images: true,
                sellerId: true,
                enterpriseId: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
            throw new common_1.BadRequestException('You can only delete your own products');
        }
        if (product.images && product.images.length > 0) {
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
    async createCategory(createCategoryDto) {
        if (createCategoryDto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: createCategoryDto.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        return this.prisma.category.create({
            data: createCategoryDto,
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async findAllCategories() {
        return this.prisma.category.findMany({
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async findOneCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                products: {
                    include: {
                        variants: true,
                        seller: { select: { id: true, storeName: true, verified: true } },
                        enterprise: { select: { id: true, companyName: true, verified: true, officialBrand: true } },
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async updateCategory(id, updateCategoryDto) {
        if (updateCategoryDto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({
                where: { id: updateCategoryDto.parentId },
            });
            if (!parentCategory) {
                throw new common_1.NotFoundException('Parent category not found');
            }
        }
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return this.prisma.category.update({
            where: { id },
            data: updateCategoryDto,
            include: {
                parent: true,
                children: true,
            },
        });
    }
    async deleteCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                children: true,
                products: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        if (category.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with existing subcategories');
        }
        if (category.products.length > 0) {
            throw new common_1.BadRequestException('Cannot delete category with existing products');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return { message: 'Category deleted successfully' };
    }
    async createReview(productId, userId, createReviewDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        return this.prisma.review.create({
            data: Object.assign(Object.assign({}, createReviewDto), { productId,
                userId }),
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async getProductReviews(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        return this.prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map