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
exports.ShipperController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shipper_service_1 = require("./shipper.service");
const shipper_dto_1 = require("./shipper.dto");
const public_decorator_1 = require("../../auth/decorators/public.decorator");
const get_logistics_partner_id_decorator_1 = require("../decorators/get-logistics-partner-id.decorator");
let ShipperController = class ShipperController {
    constructor(shipperService) {
        this.shipperService = shipperService;
    }
    create(logisticsPartnerId, createShipperDto) {
        return this.shipperService.create(logisticsPartnerId, createShipperDto);
    }
    update(id, updateShipperDto) {
        return this.shipperService.update(id, updateShipperDto);
    }
    updateLocation(id, updateLocationDto) {
        return this.shipperService.updateLocation(id, updateLocationDto);
    }
    findAll(logisticsPartnerId) {
        return this.shipperService.findAll(logisticsPartnerId);
    }
    findOne(id) {
        return this.shipperService.findOne(id);
    }
    assignOrder(id, orderId) {
        return this.shipperService.assignOrder(orderId, id);
    }
    completeDelivery(orderId) {
        return this.shipperService.completeDelivery(orderId);
    }
};
exports.ShipperController = ShipperController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new shipper' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Shipper has been created.' }),
    (0, common_1.Post)(),
    __param(0, (0, get_logistics_partner_id_decorator_1.GetLogisticsPartnerId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shipper_dto_1.CreateShipperDto]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update shipper details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Shipper has been updated.' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shipper_dto_1.UpdateShipperDto]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update shipper location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Location has been updated.' }),
    (0, common_1.Put)(':id/location'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, shipper_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "updateLocation", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all shippers for logistics partner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all shippers.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, get_logistics_partner_id_decorator_1.GetLogisticsPartnerId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get shipper by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the shipper.' }),
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Assign order to shipper' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order has been assigned.' }),
    (0, common_1.Post)(':id/assign-order/:orderId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "assignOrder", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mark order as delivered' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order has been marked as delivered.' }),
    (0, common_1.Post)('orders/:orderId/complete'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShipperController.prototype, "completeDelivery", null);
exports.ShipperController = ShipperController = __decorate([
    (0, swagger_1.ApiTags)('shipper'),
    (0, common_1.Controller)('logistics/shipper'),
    __metadata("design:paramtypes", [shipper_service_1.ShipperService])
], ShipperController);
//# sourceMappingURL=shipper.controller.js.map