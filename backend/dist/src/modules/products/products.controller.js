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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const products_service_1 = require("./products.service");
const products_dto_1 = require("./dto/products.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    createCategory(createCategoryDto, req) {
        if (req.user.role !== client_1.Role.ADMIN) {
            throw new Error('Only admins can create categories');
        }
        return this.productsService.createCategory(createCategoryDto);
    }
    findAllCategories() {
        return this.productsService.findAllCategories();
    }
    findOneCategory(id) {
        return this.productsService.findOneCategory(id);
    }
    updateCategory(id, updateCategoryDto, req) {
        if (req.user.role !== client_1.Role.ADMIN) {
            throw new Error('Only admins can update categories');
        }
        return this.productsService.updateCategory(id, updateCategoryDto);
    }
    deleteCategory(id, req) {
        if (req.user.role !== client_1.Role.ADMIN) {
            throw new Error('Only admins can delete categories');
        }
        return this.productsService.deleteCategory(id);
    }
    async createProduct(req, createProductDto) {
        if (req.user.role !== client_1.Role.SELLER && req.user.role !== client_1.Role.ENTERPRISE) {
            throw new Error('Only sellers and enterprises can create products');
        }
        let productData = createProductDto;
        if (req.user.role === client_1.Role.SELLER) {
            const seller = await this.productsService.findSellerByUserId(req.user.id);
            productData = Object.assign(Object.assign({}, createProductDto), { sellerId: seller.id });
        }
        else if (req.user.role === client_1.Role.ENTERPRISE) {
            const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
            productData = Object.assign(Object.assign({}, createProductDto), { enterpriseId: enterprise.id });
        }
        return this.productsService.createProduct(productData);
    }
    findAllProducts(skip, take, categoryId, sellerId) {
        return this.productsService.findAllProducts(skip, take, categoryId, sellerId);
    }
    createReview(productId, createReviewDto, req) {
        return this.productsService.createReview(productId, req.user.id, createReviewDto);
    }
    getProductReviews(productId) {
        return this.productsService.getProductReviews(productId);
    }
    findOneProduct(id) {
        return this.productsService.findOneProduct(id);
    }
    async updateProduct(id, updateProductDto, req) {
        if (req.user.role !== client_1.Role.SELLER) {
            throw new Error('Only sellers can update products');
        }
        const sellerId = (await this.productsService.findSellerByUserId(req.user.id)).id;
        return this.productsService.updateProduct(id, sellerId, updateProductDto);
    }
    async deleteProduct(id, req) {
        if (req.user.role !== client_1.Role.SELLER) {
            throw new Error('Only sellers can delete products');
        }
        const sellerId = (await this.productsService.findSellerByUserId(req.user.id)).id;
        return this.productsService.deleteProduct(id, sellerId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Category has been created.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [products_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all categories.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllCategories", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the category.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOneCategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update category (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category has been updated.' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Delete category (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category has been deleted.' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product (Seller or Enterprise only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product has been created.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, products_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all products.' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sellerId', required: false }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('sellerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a product review' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review has been created.' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Get product reviews (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all reviews for the product.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductReviews", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the product.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOneProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product (Seller only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product has been updated.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, products_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete product (Seller only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product has been deleted.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map