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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const price_service_1 = require("../products/services/price.service");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
let CartService = class CartService {
    constructor(prisma, priceService) {
        this.prisma = prisma;
        this.priceService = priceService;
    }
    async getOrCreateCart(userId, sessionId) {
        let cart;
        if (userId) {
            cart = await this.prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { userId },
                    include: {
                        items: {
                            include: {
                                variant: {
                                    include: {
                                        product: true,
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
        else if (sessionId) {
            cart = await this.prisma.cart.findUnique({
                where: {
                    userId_sessionId: {
                        userId: null,
                        sessionId,
                    },
                },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { sessionId },
                    include: {
                        items: {
                            include: {
                                variant: {
                                    include: {
                                        product: true,
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
        else {
            throw new common_1.BadRequestException('userId or sessionId must be provided');
        }
        return cart;
    }
    async addToCart(variantId, quantity, userId, sessionId, userRole) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
            include: {
                product: true,
            },
        });
        if (!variant) {
            throw new common_1.NotFoundException('Product variant not found');
        }
        if (variant.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        const cart = await this.getOrCreateCart(userId, sessionId);
        const selectedPrice = this.priceService.calculatePrice(variant.price, userRole);
        const cartItem = await this.prisma.cartItem.upsert({
            where: {
                cartId_variantId: {
                    cartId: cart.id,
                    variantId,
                },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
                selectedPrice,
                updatedAt: new Date(),
            },
            create: {
                cartId: cart.id,
                variantId,
                quantity,
                selectedPrice,
            },
            include: {
                variant: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return cartItem;
    }
    async updateCartItem(cartItemId, quantity, userId, sessionId) {
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                variant: true,
                cart: true,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (cartItem.variant.stock < quantity) {
            throw new common_1.BadRequestException('Insufficient stock');
        }
        return this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity, updatedAt: new Date() },
            include: {
                variant: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async removeFromCart(cartItemId, userId, sessionId) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                cart: true,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (userId && cartItem.cart.userId !== userId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        if (sessionId && cartItem.cart.sessionId !== sessionId) {
            throw new common_1.BadRequestException('Unauthorized');
        }
        return this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
    }
    async clearCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        return this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }
    async getCartSummary(userId, sessionId, userRole) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const items = cart.items;
        const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        return {
            cartId: cart.id,
            items: items.map(item => ({
                id: item.id,
                variant: item.variant,
                quantity: item.quantity,
                price: item.selectedPrice,
                total: item.selectedPrice * item.quantity,
            })),
            subtotal: Math.round(subtotal * 100) / 100,
            totalItems,
            discount: (userRole === client_1.Role.CUSTOMER || userRole === 'CUSTOMER') ? Math.round(subtotal * 0.02 / 0.98 * 100) / 100 : 0,
        };
    }
    generateSessionId() {
        return (0, uuid_1.v4)();
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        price_service_1.PriceService])
], CartService);
//# sourceMappingURL=cart.service.js.map