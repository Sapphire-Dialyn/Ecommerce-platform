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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
        this.logger = new common_1.Logger(ProductsService_1.name);
    }
    createCategory(dto) { return this.prisma.category.create({ data: dto }); }
    findAllCategories() { return this.prisma.category.findMany(); }
    findOneCategory(id) { return this.prisma.category.findUnique({ where: { id } }); }
    updateCategory(id, dto) { return this.prisma.category.update({ where: { id }, data: dto }); }
    deleteCategory(id) { return this.prisma.category.delete({ where: { id } }); }
    async findSellerByUserId(userId) {
        const seller = await this.prisma.seller.findFirst({ where: { userId } });
        if (!seller)
            throw new common_1.NotFoundException('Seller not found');
        return seller;
    }
    async findEnterpriseByUserId(userId) {
        const enterprise = await this.prisma.enterprise.findFirst({ where: { userId } });
        if (!enterprise)
            throw new common_1.NotFoundException('Enterprise not found');
        return enterprise;
    }
    async createProduct(dto, file) {
        const { basePrice, stock, variants } = dto, productData = __rest(dto, ["basePrice", "stock", "variants"]);
        if (!productData.categoryId || productData.categoryId === 'undefined') {
            throw new common_1.BadRequestException('Category ID is required');
        }
        const categoryExists = await this.prisma.category.findUnique({
            where: { id: productData.categoryId }
        });
        if (!categoryExists) {
            throw new common_1.BadRequestException(`Category with ID "${productData.categoryId}" not found`);
        }
        const images = [];
        if (file) {
            try {
                const result = await this.cloudinaryService.uploadFile(file, {
                    folder: 'products',
                    resource_type: 'auto'
                });
                if (result.secure_url) {
                    images.push(result.secure_url);
                }
            }
            catch (error) {
                this.logger.error(`Upload failed: ${error}`);
            }
        }
        let variantsData = [];
        if (typeof variants === 'string') {
            try {
                variantsData = JSON.parse(variants);
            }
            catch (e) {
                variantsData = [];
            }
        }
        else if (Array.isArray(variants)) {
            variantsData = variants;
        }
        if (!variantsData || variantsData.length === 0) {
            variantsData.push({
                price: Number(basePrice) || 0,
                stock: Number(stock) || 0,
                sku: `${Date.now()}`,
                color: null,
                size: null
            });
        }
        return this.prisma.product.create({
            data: Object.assign(Object.assign({}, productData), { images: images, variants: {
                    create: variantsData.map((v) => ({
                        price: Number(v.price || basePrice || 0),
                        stock: Number(v.stock || stock || 0),
                        color: v.color || null,
                        size: v.size || null,
                        sku: v.sku || undefined,
                    })),
                } }),
            include: { variants: true },
        });
    }
    async findAllProducts(skip, take, categoryId, sellerId, enterpriseId) {
        const skipNumber = Number(skip) || 0;
        const takeNumber = Number(take) || 100;
        const products = await this.prisma.product.findMany({
            skip: skipNumber,
            take: takeNumber,
            where: {
                categoryId: categoryId || undefined,
                sellerId: sellerId || undefined,
                enterpriseId: enterpriseId || undefined,
                active: true,
            },
            include: { category: true, seller: true, enterprise: true, variants: true },
            orderBy: { createdAt: 'desc' },
        });
        return products.map((p) => (Object.assign(Object.assign({}, p), { images: p.images || [] })));
    }
    getProductsBySellerId(sellerId) {
        return this.prisma.product.findMany({
            where: { sellerId },
            include: { category: true, seller: true, variants: true },
        });
    }
    getProductsByEnterpriseId(enterpriseId) {
        return this.prisma.product.findMany({
            where: { enterpriseId },
            include: {
                category: true,
                enterprise: true,
                variants: true
            },
        });
    }
    async findOneProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, seller: true, enterprise: true, variants: true, reviews: { include: { user: true } } },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async updateProduct(id, ownerId, role, dto, file) {
        const whereCondition = { id };
        if (role === client_1.Role.SELLER)
            whereCondition.sellerId = ownerId;
        else if (role === client_1.Role.ENTERPRISE)
            whereCondition.enterpriseId = ownerId;
        const product = await this.prisma.product.findFirst({ where: whereCondition });
        if (!product)
            throw new common_1.ForbiddenException('Product not found or access denied');
        const { basePrice, stock } = dto, generalData = __rest(dto, ["basePrice", "stock"]);
        let newImages = product.images;
        if (file) {
            try {
                const result = await this.cloudinaryService.uploadFile(file, {
                    folder: 'products',
                });
                if (result.secure_url) {
                    newImages = [result.secure_url];
                }
            }
            catch (error) {
                this.logger.error(`Upload failed: ${error}`);
                throw error;
            }
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: Object.assign(Object.assign({}, generalData), { images: newImages }),
        });
        if (basePrice !== undefined || stock !== undefined) {
            const firstVariant = await this.prisma.productVariant.findFirst({ where: { productId: id } });
            if (firstVariant) {
                await this.prisma.productVariant.update({
                    where: { id: firstVariant.id },
                    data: {
                        price: basePrice !== undefined ? Number(basePrice) : undefined,
                        stock: stock !== undefined ? Number(stock) : undefined,
                    }
                });
            }
        }
        return updatedProduct;
    }
    async deleteProduct(id, ownerId, role) {
        const whereCondition = { id };
        if (role === client_1.Role.SELLER)
            whereCondition.sellerId = ownerId;
        else if (role === client_1.Role.ENTERPRISE)
            whereCondition.enterpriseId = ownerId;
        const product = await this.prisma.product.findFirst({ where: whereCondition });
        if (!product)
            throw new common_1.ForbiddenException('Product not found or access denied');
        return this.prisma.product.delete({ where: { id } });
    }
    createReview(productId, userId, dto) {
        return this.prisma.review.create({ data: Object.assign(Object.assign({}, dto), { productId, userId }) });
    }
    getProductReviews(productId) {
        return this.prisma.review.findMany({
            where: { productId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ProductsService);
//# sourceMappingURL=products.service.js.map