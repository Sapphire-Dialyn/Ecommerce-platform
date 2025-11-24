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
            let price = 0;
            let realVariantId = null;
            let sellerId = null;
            let enterpriseId = null;
            if (item.variantId) {
                try {
                    const variant = await this.prisma.productVariant.findUnique({
                        where: { id: item.variantId },
                        include: { product: true }
                    });
                    if (variant) {
                        price = variant.price;
                        realVariantId = variant.id;
                        sellerId = variant.product.sellerId;
                        enterpriseId = variant.product.enterpriseId;
                        if (variant.stock < item.quantity) {
                            throw new common_1.BadRequestException(`Sản phẩm "${variant.product.name}" không đủ tồn kho`);
                        }
                        variantIdsToUpdate.push({ id: variant.id, quantity: item.quantity });
                    }
                }
                catch (e) {
                    console.warn(`Invalid Variant ID: ${item.variantId}, falling back to Product...`);
                }
            }
            if (price === 0) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                    include: { variants: true }
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                }
                sellerId = product.sellerId;
                enterpriseId = product.enterpriseId;
                if (product.variants && product.variants.length > 0) {
                    price = product.variants[0].price;
                }
                else {
                    price = 0;
                }
            }
            subtotal += price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                variantId: realVariantId,
                quantity: item.quantity,
                price: price,
                sellerId: sellerId,
                enterpriseId: enterpriseId,
            });
        }
        const voucherIdsToConnect = (voucherIds || []).map((id) => ({ id }));
        const totalAmount = subtotal + shippingFee;
        try {
            return await this.prisma.$transaction(async (tx) => {
                for (const v of variantIdsToUpdate) {
                    await tx.productVariant.update({
                        where: { id: v.id },
                        data: { stock: { decrement: v.quantity } }
                    });
                }
                return await tx.order.create({
                    data: {
                        userId,
                        status: client_1.OrderStatus.PENDING,
                        subtotal,
                        shippingFee,
                        totalDiscount: 0,
                        totalAmount,
                        shopDiscount: 0,
                        platformDiscount: 0,
                        freeshipDiscount: 0,
                        appliedVouchers: { connect: voucherIdsToConnect },
                        orderItems: { create: orderItemsData },
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
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findMyOrders(userId, status) {
        const whereCondition = { userId };
        if (status && status !== 'ALL') {
            whereCondition.status = status;
        }
        return this.prisma.order.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: { select: { id: true, name: true, images: true } },
                        variant: { select: { id: true, size: true, color: true } }
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
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true
                    }
                },
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
        return this.prisma.order.update({
            where: { id },
            data: { status: dto.status },
        });
    }
    async updatePaymentStatus(idOrRef, status, paymentMethod) {
        console.log(`[UpdatePayment] Đang tìm đơn hàng với ID/Ref: ${idOrRef}`);
        let order = await this.prisma.order.findFirst({
            where: { id: idOrRef },
            include: { payment: true },
        });
        if (!order) {
            console.log(`[UpdatePayment] Không tìm thấy Order ID, đang thử tìm theo Payment ID...`);
            const payment = await this.prisma.payment.findFirst({
                where: { id: idOrRef },
                include: { order: true }
            });
            if (payment && payment.order) {
                console.log(`[UpdatePayment] -> Đã tìm thấy Order thông qua Payment ID: ${payment.order.id}`);
                order = await this.prisma.order.findUnique({
                    where: { id: payment.order.id },
                    include: { payment: true }
                });
            }
        }
        if (!order) {
            console.error(`[UpdatePayment] Thất bại! Không tồn tại Order hay Payment nào với ID: ${idOrRef}`);
            throw new common_1.NotFoundException(`Không tìm thấy đơn hàng để cập nhật thanh toán (ID: ${idOrRef})`);
        }
        if (order.payment) {
            await this.prisma.payment.update({
                where: { id: order.payment.id },
                data: {
                    status: client_1.PaymentStatus.SUCCESS,
                    method: paymentMethod,
                },
            });
        }
        return this.prisma.order.update({
            where: { id: order.id },
            data: {
                status: client_1.OrderStatus.PROCESSING,
            },
            include: { payment: true },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map