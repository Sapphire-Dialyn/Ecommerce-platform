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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createCategory(dto) {
        return this.prisma.category.create({ data: dto });
    }
    findAllCategories() {
        return this.prisma.category.findMany();
    }
    findOneCategory(id) {
        return this.prisma.category.findUnique({ where: { id } });
    }
    updateCategory(id, dto) {
        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }
    deleteCategory(id) {
        return this.prisma.category.delete({ where: { id } });
    }
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
    createProduct(dto) {
        return this.prisma.product.create({ data: dto });
    }
    findAllProducts(skip, take, categoryId, sellerId, enterpriseId) {
        const skipNumber = Number(skip) || 0;
        const takeNumber = Number(take) || 100;
        return this.prisma.product.findMany({
            skip: skipNumber,
            take: takeNumber,
            where: {
                categoryId: categoryId || undefined,
                sellerId: sellerId || undefined,
                enterpriseId: enterpriseId || undefined,
                active: true,
            },
            include: {
                category: true,
                seller: true,
                enterprise: true,
                variants: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }).then(products => products.map(p => (Object.assign(Object.assign({}, p), { images: p.images || [] }))));
    }
    getProductsBySellerId(sellerId) {
        return this.prisma.product.findMany({
            where: { sellerId },
            include: { category: true, seller: true },
        });
    }
    getProductsByEnterpriseId(enterpriseId) {
        return this.prisma.product.findMany({
            where: { enterpriseId },
            include: {
                category: true,
                enterprise: true,
                variants: true,
            },
        });
    }
    findOneProduct(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                seller: true,
                enterprise: true,
                variants: true,
            },
        });
    }
    async updateProduct(id, sellerId, dto) {
        const product = await this.prisma.product.findFirst({
            where: { id, sellerId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found or not owned by seller');
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }
    async deleteProduct(id, sellerId) {
        const product = await this.prisma.product.findFirst({
            where: { id, sellerId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found or not owned by seller');
        return this.prisma.product.delete({ where: { id } });
    }
    createReview(productId, userId, dto) {
        return this.prisma.review.create({
            data: Object.assign(Object.assign({}, dto), { productId,
                userId }),
        });
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
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map