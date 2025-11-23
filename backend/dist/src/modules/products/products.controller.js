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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ProductsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const products_service_1 = require("./products.service");
const products_dto_1 = require("./dto/products.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ProductsController = ProductsController_1 = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
        this.logger = new common_1.Logger(ProductsController_1.name);
    }
    createCategory(dto, req) {
        if (req.user.role !== client_1.Role.ADMIN)
            throw new Error('Only admins can create categories');
        return this.productsService.createCategory(dto);
    }
    findAllCategories() {
        return this.productsService.findAllCategories();
    }
    findOneCategory(id) {
        return this.productsService.findOneCategory(id);
    }
    updateCategory(id, dto, req) {
        if (req.user.role !== client_1.Role.ADMIN)
            throw new Error('Only admins can update categories');
        return this.productsService.updateCategory(id, dto);
    }
    deleteCategory(id, req) {
        if (req.user.role !== client_1.Role.ADMIN)
            throw new Error('Only admins can delete categories');
        return this.productsService.deleteCategory(id);
    }
    async createProduct(req, dto, file) {
        this.logger.log(`Create Product Request Received`);
        if (![client_1.Role.SELLER, client_1.Role.ENTERPRISE].includes(req.user.role))
            throw new Error('Only sellers and enterprises can create products');
        let data = dto;
        if (req.user.role === client_1.Role.SELLER) {
            const seller = await this.productsService.findSellerByUserId(req.user.id);
            data = Object.assign(Object.assign({}, dto), { sellerId: seller.id });
        }
        if (req.user.role === client_1.Role.ENTERPRISE) {
            const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
            data = Object.assign(Object.assign({}, dto), { enterpriseId: enterprise.id });
        }
        return this.productsService.createProduct(data, file);
    }
    findAllProducts(skip, take, categoryId, sellerId, enterpriseId) {
        const skipNumber = skip ? Number(skip) : 0;
        const takeNumber = take ? Number(take) : 100;
        return this.productsService.findAllProducts(skipNumber, takeNumber, categoryId, sellerId, enterpriseId);
    }
    getProductsBySeller(sellerId) {
        return this.productsService.getProductsBySellerId(sellerId);
    }
    getProductsByEnterprise(enterpriseId) {
        return this.productsService.getProductsByEnterpriseId(enterpriseId);
    }
    createReview(productId, dto, req) {
        return this.productsService.createReview(productId, req.user.id, dto);
    }
    getProductReviews(productId) {
        return this.productsService.getProductReviews(productId);
    }
    findOneProduct(id) {
        return this.productsService.findOneProduct(id);
    }
    async updateProduct(id, dto, req, file) {
        if (![client_1.Role.SELLER, client_1.Role.ENTERPRISE].includes(req.user.role)) {
            throw new common_1.ForbiddenException('Only sellers and enterprises can update products');
        }
        let ownerId = '';
        if (req.user.role === client_1.Role.SELLER) {
            const seller = await this.productsService.findSellerByUserId(req.user.id);
            ownerId = seller.id;
        }
        else {
            const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
            ownerId = enterprise.id;
        }
        return this.productsService.updateProduct(id, ownerId, req.user.role, dto, file);
    }
    async deleteProduct(id, req) {
        if (![client_1.Role.SELLER, client_1.Role.ENTERPRISE].includes(req.user.role)) {
            throw new common_1.ForbiddenException('Only sellers and enterprises can delete products');
        }
        let ownerId = '';
        if (req.user.role === client_1.Role.SELLER) {
            const seller = await this.productsService.findSellerByUserId(req.user.id);
            ownerId = seller.id;
        }
        else {
            const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
            ownerId = enterprise.id;
        }
        return this.productsService.deleteProduct(id, ownerId, req.user.role);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [products_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllCategories", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOneCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, products_dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create product (Seller or Enterprise only)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, products_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sellerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'enterpriseId', required: false }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('sellerId')),
    __param(4, (0, common_1.Query)('enterpriseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllProducts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('seller/:sellerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products of a specific seller' }),
    __param(0, (0, common_1.Param)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductsBySeller", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('enterprise/:enterpriseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products of a specific enterprise' }),
    __param(0, (0, common_1.Param)('enterpriseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductsByEnterprise", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, products_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createReview", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductReviews", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOneProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, products_dto_1.UpdateProductDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
exports.ProductsController = ProductsController = ProductsController_1 = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map