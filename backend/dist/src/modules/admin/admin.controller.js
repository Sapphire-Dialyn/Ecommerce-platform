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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const admin_dto_1 = require("./dto/admin.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getAllUsers() {
        return this.adminService.getAllUsers();
    }
    getUserById(id) {
        return this.adminService.getUserById(id);
    }
    verifyEnterprise(id, verified) {
        return this.adminService.verifyEnterprise(id, verified);
    }
    updateEnterpriseBrandStatus(id, officialBrand) {
        return this.adminService.updateEnterpriseBrandStatus(id, officialBrand);
    }
    updateUserStatus(id, active) {
        return this.adminService.updateUserStatus(id, active);
    }
    getAllSellers() {
        return this.adminService.getAllSellers();
    }
    verifySeller(id, verified) {
        return this.adminService.verifySeller(id, verified);
    }
    getAllProducts() {
        return this.adminService.getAllProducts();
    }
    updateProductStatus(id, active) {
        return this.adminService.updateProductStatus(id, active);
    }
    getAllOrders() {
        return this.adminService.getAllOrders();
    }
    createVoucher(createVoucherDto) {
        return this.adminService.createVoucher(createVoucherDto);
    }
    updateVoucher(id, updateVoucherDto) {
        return this.adminService.updateVoucher(id, updateVoucherDto);
    }
    getAllVouchers() {
        return this.adminService.getAllVouchers();
    }
    createFlashSale(createFlashSaleDto) {
        return this.adminService.createFlashSale(createFlashSaleDto);
    }
    getAllFlashSales() {
        return this.adminService.getAllFlashSales();
    }
    createCampaign(createCampaignDto) {
        return this.adminService.createCampaign(createCampaignDto);
    }
    getAllCampaigns() {
        return this.adminService.getAllCampaigns();
    }
    getSystemStats(systemStatsDto) {
        return this.adminService.getSystemStats(systemStatsDto);
    }
    createInitialAdmins() {
        return this.adminService.createInitialAdmins();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all users.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the user.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify enterprise' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enterprise verification status updated.' }),
    (0, common_1.Patch)('enterprise/:id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('verified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyEnterprise", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update enterprise brand status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enterprise brand status updated.' }),
    (0, common_1.Patch)('enterprise/:id/brand-status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('officialBrand')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateEnterpriseBrandStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update user status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User status updated.' }),
    (0, common_1.Patch)('users/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all sellers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all sellers.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('sellers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllSellers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify seller' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Seller verification status updated.' }),
    (0, common_1.Patch)('sellers/:id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('verified')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifySeller", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all products.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update product status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product status updated.' }),
    (0, common_1.Patch)('products/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('active')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateProductStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all orders.' }),
    (0, common_1.Get)('orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create voucher' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Voucher has been created.' }),
    (0, common_1.Post)('vouchers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateVoucherDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createVoucher", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update voucher' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voucher has been updated.' }),
    (0, common_1.Patch)('vouchers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_dto_1.UpdateVoucherDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateVoucher", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all vouchers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all vouchers.' }),
    (0, common_1.Get)('vouchers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllVouchers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create flash sale' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Flash sale has been created.' }),
    (0, common_1.Post)('flash-sales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateFlashSaleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createFlashSale", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all flash sales' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all flash sales.' }),
    (0, common_1.Get)('flash-sales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllFlashSales", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create campaign' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Campaign has been created.' }),
    (0, common_1.Post)('campaigns'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCampaign", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all campaigns' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all campaigns.' }),
    (0, common_1.Get)('campaigns'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllCampaigns", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get system statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return system statistics.' }),
    (0, common_1.Get)('statistics'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.SystemStatsDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSystemStats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create initial admin accounts' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin accounts created.' }),
    (0, common_1.Post)('initialize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createInitialAdmins", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map