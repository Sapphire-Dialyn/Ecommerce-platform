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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'warn' },
            ],
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
    }
    async onModuleInit() {
        this.logger.log('Initializing Prisma...');
        this.$on('query', (event) => {
            if ('query' in event) {
                this.logger.debug(`Query: ${event.query}`);
                this.logger.debug(`Params: ${event.params}`);
                this.logger.debug(`Duration: ${event.duration}ms`);
            }
        });
        this.$on('error', (event) => this.logger.error(event.message));
        this.$on('warn', (event) => this.logger.warn(event.message));
        this.registerSoftDeleteMiddleware();
        try {
            await this.$connect();
            this.logger.log('✅ Prisma connected');
        }
        catch (error) {
            this.logger.error('❌ Prisma failed to connect', error);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('🧹 Prisma disconnected');
    }
    registerSoftDeleteMiddleware() {
        const self = this;
        if (typeof self.$use === 'function') {
            self.$use(async (params, next) => {
                if (params.action === 'delete') {
                    params.action = 'update';
                    params.args['data'] = { active: false };
                }
                if (params.action === 'deleteMany') {
                    params.action = 'updateMany';
                    if (params.args.data) {
                        params.args.data['active'] = false;
                    }
                    else {
                        params.args['data'] = { active: false };
                    }
                }
                return next(params);
            });
            this.logger.log('🧩 Soft delete middleware enabled');
        }
        else {
            this.logger.warn('⚠️ Prisma middleware ($use) is not available on this version.');
        }
    }
    async findAvailableShippers(logisticsPartnerId, pickupLocation, deliveryRange = 5.0) {
        return this.shipper.findMany({
            where: {
                logisticsPartnerId,
                status: client_1.ShipperStatus.AVAILABLE,
                active: true,
            },
            orderBy: { rating: 'desc' },
        });
    }
    async updateShipperStatus(shipperId, status) {
        return this.shipper.update({
            where: { id: shipperId },
            data: { status },
        });
    }
    async updateOrderStatus(orderId, status, data = {}) {
        return this.logisticsOrder.update({
            where: { id: orderId },
            data: Object.assign({ status }, data),
        });
    }
    async calculateDeliveryStats(shipperId) {
        var _a;
        const deliveredOrders = await this.logisticsOrder.count({
            where: { shipperId, status: client_1.LogisticsStatus.DELIVERED },
        });
        const avgRating = await this.logisticsOrder.aggregate({
            where: {
                shipperId,
                rating: { not: null },
            },
            _avg: { rating: true },
        });
        return {
            totalDeliveries: deliveredOrders,
            averageRating: (_a = avgRating._avg.rating) !== null && _a !== void 0 ? _a : 0,
        };
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map