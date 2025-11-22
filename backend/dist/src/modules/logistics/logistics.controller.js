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
exports.LogisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logistics_service_1 = require("./logistics.service");
const logistics_dto_1 = require("./dto/logistics.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const client_1 = require("@prisma/client");
let LogisticsController = class LogisticsController {
    constructor(logisticsService) {
        this.logisticsService = logisticsService;
    }
    createPartner(req, createLogisticsPartnerDto) {
        return this.logisticsService.createPartner(req.user.id, createLogisticsPartnerDto);
    }
    findAllPartners() {
        return this.logisticsService.findAllPartners();
    }
    findOnePartner(id) {
        return this.logisticsService.findOnePartner(id);
    }
    updatePartner(id, updateLogisticsPartnerDto, req) {
        if (req.user.role !== client_1.Role.ADMIN &&
            this.logisticsService.findOnePartner(id)['userId'] !== req.user.id) {
            throw new Error('Unauthorized');
        }
        return this.logisticsService.updatePartner(id, updateLogisticsPartnerDto);
    }
    deletePartner(id) {
        return this.logisticsService.deletePartner(id);
    }
    createOrder(createLogisticsOrderDto) {
        return this.logisticsService.createOrder(createLogisticsOrderDto);
    }
    findAllOrders(req) {
        var _a, _b;
        const partnerId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === client_1.Role.LOGISTICS
            ? this.logisticsService.findOnePartner((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)['id']
            : undefined;
        return this.logisticsService.findAllOrders(partnerId);
    }
    findOneOrder(id) {
        return this.logisticsService.findOneOrder(id);
    }
    updateOrderStatus(id, updateLogisticsOrderDto) {
        return this.logisticsService.updateOrderStatus(id, updateLogisticsOrderDto);
    }
    calculateShipping(calculateShippingDto) {
        return this.logisticsService.calculateShipping(calculateShippingDto);
    }
};
exports.LogisticsController = LogisticsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a logistics partner profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Partner profile has been created.' }),
    (0, common_1.Post)('partners'),
    (0, roles_decorator_1.Roles)(client_1.Role.LOGISTICS),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, logistics_dto_1.CreateLogisticsPartnerDto]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "createPartner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all logistics partners' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all partners.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('partners'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "findAllPartners", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get logistics partner by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the partner.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('partners/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "findOnePartner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update logistics partner profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partner profile has been updated.' }),
    (0, common_1.Patch)('partners/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LOGISTICS, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, logistics_dto_1.UpdateLogisticsPartnerDto, Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "updatePartner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete logistics partner profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Partner profile has been deleted.' }),
    (0, common_1.Delete)('partners/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "deletePartner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a logistics order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Logistics order has been created.' }),
    (0, common_1.Post)('orders'),
    (0, roles_decorator_1.Roles)(client_1.Role.LOGISTICS, client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logistics_dto_1.CreateLogisticsOrderDto]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "createOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all logistics orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all logistics orders.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('orders'),
    (0, roles_decorator_1.Roles)(client_1.Role.LOGISTICS, client_1.Role.ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "findAllOrders", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get logistics order by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the logistics order.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "findOneOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update logistics order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order status has been updated.' }),
    (0, common_1.Patch)('orders/:id'),
    (0, roles_decorator_1.Roles)(client_1.Role.LOGISTICS, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, logistics_dto_1.UpdateLogisticsOrderDto]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "updateOrderStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Calculate shipping cost' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return shipping cost calculation.' }),
    (0, common_1.Post)('calculate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [logistics_dto_1.CalculateShippingDto]),
    __metadata("design:returntype", void 0)
], LogisticsController.prototype, "calculateShipping", null);
exports.LogisticsController = LogisticsController = __decorate([
    (0, swagger_1.ApiTags)('logistics'),
    (0, common_1.Controller)('logistics'),
    __metadata("design:paramtypes", [logistics_service_1.LogisticsService])
], LogisticsController);
//# sourceMappingURL=logistics.controller.js.map