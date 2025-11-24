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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const { items, voucherIds, shippingFee, paymentMethod, addressId } = dto;
        let subtotal = 0;
        const orderItemsData = [];
        const variantIdsToUpdate = [];
        for (const item of items) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: true },
            });
            if (!variant) {
                throw new common_1.NotFoundException(`Product Variant ${item.variantId} not found`);
            }
            if (variant.stock < item.quantity) {
                throw new common_1.BadRequestException(`Sản phẩm "${variant.product.name}" không đủ tồn kho (Còn: ${variant.stock})`);
            }
            const itemTotal = variant.price * item.quantity;
            subtotal += itemTotal;
            orderItemsData.push({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: variant.price,
                sellerId: variant.product.sellerId,
                enterpriseId: variant.product.enterpriseId,
            });
            variantIdsToUpdate.push({
                id: item.variantId,
                quantity: item.quantity,
                productName: variant.product.name
            });
        }
        const voucherIdsToConnect = (voucherIds || []).map((id) => ({ id }));
        const totalDiscount = 0;
        const totalAmount = subtotal + shippingFee - totalDiscount;
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                for (const item of variantIdsToUpdate) {
                    const currentVariant = await tx.productVariant.findUnique({ where: { id: item.id } });
                    if (!currentVariant || currentVariant.stock < item.quantity) {
                        throw new common_1.BadRequestException(`Hết hàng: ${item.productName} vừa bị mua hết!`);
                    }
                    await tx.productVariant.update({
                        where: { id: item.id },
                        data: { stock: { decrement: item.quantity } }
                    });
                }
                const newOrder = await tx.order.create({
                    data: {
                        userId,
                        status: client_1.OrderStatus.PENDING,
                        subtotal,
                        shippingFee,
                        totalDiscount,
                        totalAmount,
                        shopDiscount: 0,
                        platformDiscount: 0,
                        freeshipDiscount: 0,
                        appliedVouchers: {
                            connect: voucherIdsToConnect,
                        },
                        orderItems: {
                            create: orderItemsData,
                        },
                        payment: {
                            create: {
                                method: paymentMethod,
                                amount: totalAmount,
                                status: client_1.PaymentStatus.PENDING
                            }
                        }
                    },
                    include: {
                        orderItems: true,
                        payment: true,
                    },
                });
                return newOrder;
            });
            return result;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            }
            throw error;
        }
    }
    async findMyOrders(userId, status) {
        const whereCondition = {
            userId: userId,
        };
        if (status && status !== 'ALL') {
            whereCondition.status = status;
        }
        return this.prisma.order.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, images: true }
                        },
                        variant: {
                            select: { id: true, size: true, color: true }
                        }
                    }
                },
                payment: true,
            }
        });
    }
    async findAll(userId, role) {
        const whereCondition = {};
        if (role === client_1.Role.CUSTOMER) {
            whereCondition.userId = userId;
        }
        return this.prisma.order.findMany({
            where: whereCondition,
            include: {
                orderItems: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                payment: true,
                appliedVouchers: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id, userId, role) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true,
                        variant: true
                    }
                },
                payment: true,
                appliedVouchers: true,
                user: { select: { id: true, name: true, email: true, phone: true } }
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (role !== client_1.Role.ADMIN && order.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this order');
        }
        return order;
    }
    async updateStatus(id, dto, userId, role) {
        if (role !== client_1.Role.SELLER && role !== client_1.Role.ENTERPRISE) {
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map