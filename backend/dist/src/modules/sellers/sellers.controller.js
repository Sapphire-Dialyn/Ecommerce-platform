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
exports.SellersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sellers_service_1 = require("./sellers.service");
const sellers_dto_1 = require("./dto/sellers.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
const platform_express_1 = require("@nestjs/platform-express");
const interceptors_1 = require("../../common/interceptors");
let SellersController = class SellersController {
    constructor(sellersService) {
        this.sellersService = sellersService;
    }
    create(req, createSellerDto) {
        return this.sellersService.create(req.user.id, createSellerDto);
    }
    findAll() {
        return this.sellersService.findAll();
    }
    findOne(id) {
        return this.sellersService.findOne(id);
    }
    async update(id, updateSellerDto, req) {
        const seller = await this.sellersService.findOne(id);
        if (req.user.role !== client_1.Role.ADMIN && seller.userId !== req.user.id) {
            throw new common_1.ForbiddenException('Unauthorized');
        }
        return this.sellersService.update(id, updateSellerDto);
    }
    verifyStatus(id, verified, req) {
        return this.sellersService.updateVerificationStatus(id, verified);
    }
    async remove(id, req) {
        const seller = await this.sellersService.findOne(id);
        if (req.user.role !== client_1.Role.ADMIN && seller.userId !== req.user.id) {
            throw new common_1.ForbiddenException('Unauthorized');
        }
        return this.sellersService.delete(id);
    }
    uploadLogo(id, file) {
        return this.sellersService.uploadStoreLogo(file, id);
    }
    updateLogo(id, file) {
        return this.sellersService.updateStoreLogo(file, id);
    }
    deleteLogo(id) {
        return this.sellersService.deleteStoreLogo(id);
    }
    uploadDocument(id, type, file) {
        return this.sellersService.uploadVerificationDocument(file, id, type);
    }
    deleteDocument(id, type) {
        return this.sellersService.deleteVerificationDocument(id, type);
    }
};
exports.SellersController = SellersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a seller profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Seller profile has been created.' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sellers_dto_1.CreateSellerDto]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all sellers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all sellers.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get seller by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the seller.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update seller profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller profile has been updated.' }),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, sellers_dto_1.UpdateSellerDto, Object]),
    __metadata("design:returntype", Promise)
], SellersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify seller (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller verification status updated.' }),
    (0, common_1.Patch)(':id/verify'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('verified')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "verifyStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete seller profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller profile has been deleted.' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SellersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/logo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file'), new interceptors_1.FileUploadInterceptor({ required: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Put)(':id/logo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file'), new interceptors_1.FileUploadInterceptor({ required: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "updateLogo", null);
__decorate([
    (0, common_1.Delete)(':id/logo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "deleteLogo", null);
__decorate([
    (0, common_1.Post)(':id/documents/:type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file'), new interceptors_1.FileUploadInterceptor({ required: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SellersController.prototype, "deleteDocument", null);
exports.SellersController = SellersController = __decorate([
    (0, swagger_1.ApiTags)('sellers'),
    (0, common_1.Controller)('sellers'),
    __metadata("design:paramtypes", [sellers_service_1.SellersService])
], SellersController);
//# sourceMappingURL=sellers.controller.js.map