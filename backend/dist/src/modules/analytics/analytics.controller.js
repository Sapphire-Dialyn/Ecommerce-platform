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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const swagger_1 = require("@nestjs/swagger");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
const client_1 = require("@prisma/client");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    getAccessFilter(req, query) {
        const user = req.user;
        if (user.role === client_1.Role.SELLER) {
            if (!user.sellerId)
                throw new common_1.ForbiddenException('User not linked to Seller');
            return { sellerId: user.sellerId };
        }
        if (user.role === client_1.Role.ENTERPRISE) {
            if (!user.enterpriseId)
                throw new common_1.ForbiddenException('User not linked to Enterprise');
            return { enterpriseId: user.enterpriseId };
        }
        if (user.role === client_1.Role.ADMIN) {
            if (query.sellerId)
                return { sellerId: query.sellerId };
            if (query.enterpriseId)
                return { enterpriseId: query.enterpriseId };
            return {};
        }
        throw new common_1.ForbiddenException('Access denied');
    }
    async getOverview(req, query) {
        const filter = this.getAccessFilter(req, query);
        return this.analyticsService.getOverviewStats(query, filter);
    }
    async getSalesRevenueOverTime(req, query) {
        const filter = this.getAccessFilter(req, query);
        return this.analyticsService.getSalesRevenueOverTime(query, filter);
    }
    async getTopSellingProducts(req, query) {
        const filter = this.getAccessFilter(req, query);
        return this.analyticsService.getTopSellingProducts(query, filter);
    }
    async getOrderStatusBreakdown(req, query) {
        const filter = this.getAccessFilter(req, query);
        return this.analyticsService.getOrderStatusBreakdown(query, filter);
    }
    async getUserBehaviorFunnel(query) {
        return this.analyticsService.getUserBehaviorFunnel(query);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy chỉ số tổng quan (Doanh thu, Đơn hàng)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('sales-over-time'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy doanh thu theo thời gian' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSalesRevenueOverTime", null);
__decorate([
    (0, common_1.Get)('top-selling-products'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy top sản phẩm bán chạy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopSellingProducts", null);
__decorate([
    (0, common_1.Get)('order-status-breakdown'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Phân tích trạng thái đơn hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrderStatusBreakdown", null);
__decorate([
    (0, common_1.Get)('user-behavior-funnel'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Phân tích phễu hành vi (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OK' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserBehaviorFunnel", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map