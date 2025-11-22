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
exports.VoucherController = void 0;
const common_1 = require("@nestjs/common");
const voucher_service_1 = require("./voucher.service");
const create_voucher_dto_1 = require("./dto/create-voucher.dto");
const apply_voucher_dto_1 = require("./dto/apply-voucher.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
let VoucherController = class VoucherController {
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    createShopVoucher(createDto, req) {
        const sellerId = req.user.sellerId;
        if (!sellerId) {
            throw new common_1.ForbiddenException('User is not linked to a seller account');
        }
        return this.voucherService.createShopVoucher(createDto, sellerId);
    }
    createPlatformVoucher(createDto) {
        return this.voucherService.createPlatformVoucher(createDto);
    }
    createFreeShipVoucher(createDto) {
        return this.voucherService.createFreeShipVoucher(createDto);
    }
    claimVoucher(id, req) {
        const userId = req.user.id;
        return this.voucherService.claimVoucher(id, userId);
    }
    getAvailableVouchers(req, sellerIds) {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const sellerIdArray = Array.isArray(sellerIds) ? sellerIds : [sellerIds].filter(Boolean);
        return this.voucherService.getAvailableVouchers(userId, sellerIdArray);
    }
    calculateCheckout(req, applyDto) {
        const userId = req.user.id;
        return this.voucherService.calculateCheckout(userId, applyDto);
    }
};
exports.VoucherController = VoucherController;
__decorate([
    (0, common_1.Post)('shop'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SELLER, client_1.Role.ENTERPRISE),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Shop Voucher (Seller / Enterprise)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tạo voucher thành công.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_voucher_dto_1.CreateVoucherDto, Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "createShopVoucher", null);
__decorate([
    (0, common_1.Post)('platform'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Platform Voucher (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tạo voucher thành công.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_voucher_dto_1.CreateVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "createPlatformVoucher", null);
__decorate([
    (0, common_1.Post)('freeship'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo FreeShip Voucher (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tạo voucher thành công.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_voucher_dto_1.CreateVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "createFreeShipVoucher", null);
__decorate([
    (0, common_1.Post)('claim/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Customer lưu (claim) 1 voucher' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Claim thành công.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Voucher đã hết hoặc đã claim.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "claimVoucher", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy voucher khả dụng cho giỏ hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về 3 danh sách voucher.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('sellerIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "getAvailableVouchers", null);
__decorate([
    (0, common_1.Post)('calculate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.CUSTOMER),
    (0, swagger_1.ApiOperation)({ summary: 'Tạm tính giá trị đơn hàng với voucher' }),
    (0, swagger_1.ApiBody)({ type: apply_voucher_dto_1.ApplyVoucherDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Trả về chi tiết giá.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, apply_voucher_dto_1.ApplyVoucherDto]),
    __metadata("design:returntype", void 0)
], VoucherController.prototype, "calculateCheckout", null);
exports.VoucherController = VoucherController = __decorate([
    (0, swagger_1.ApiTags)('Vouchers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('vouchers'),
    __metadata("design:paramtypes", [voucher_service_1.VoucherService])
], VoucherController);
//# sourceMappingURL=voucher.controller.js.map