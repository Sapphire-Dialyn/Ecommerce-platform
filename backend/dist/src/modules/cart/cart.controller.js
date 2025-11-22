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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const optional_auth_decorator_1 = require("../auth/decorators/optional-auth.decorator");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(user, sessionId) {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const userRole = (user === null || user === void 0 ? void 0 : user.role) || 'GUEST';
        return this.cartService.getCartSummary(userId, sessionId, userRole);
    }
    async addToCart({ variantId, quantity }, user, sessionId) {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const userRole = (user === null || user === void 0 ? void 0 : user.role) || 'GUEST';
        if (!userId && !sessionId) {
            sessionId = this.cartService.generateSessionId();
        }
        return this.cartService.addToCart(variantId, quantity, userId, sessionId, userRole);
    }
    async updateCartItem(id, { quantity }, user, sessionId) {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        return this.cartService.updateCartItem(id, quantity, userId, sessionId);
    }
    async removeFromCart(id, user, sessionId) {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        return this.cartService.removeFromCart(id, userId, sessionId);
    }
    async clearCart(user, sessionId) {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        return this.cartService.clearCart(userId, sessionId);
    }
    generateSessionId() {
        return { sessionId: this.cartService.generateSessionId() };
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart retrieved successfully' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Session-ID',
        description: 'Session ID for guest users',
        required: false,
    }),
    __param(0, (0, optional_auth_decorator_1.OptionalAuth)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item added to cart' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Session-ID',
        description: 'Session ID for guest users',
        required: false,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, optional_auth_decorator_1.OptionalAuth)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Put)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart item updated' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Session-ID',
        description: 'Session ID for guest users',
        required: false,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, optional_auth_decorator_1.OptionalAuth)()),
    __param(3, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from cart' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Session-ID',
        description: 'Session ID for guest users',
        required: false,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, optional_auth_decorator_1.OptionalAuth)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeFromCart", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Session-ID',
        description: 'Session ID for guest users',
        required: false,
    }),
    __param(0, (0, optional_auth_decorator_1.OptionalAuth)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Get)('session-id'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate session ID for guest' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session ID generated' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CartController.prototype, "generateSessionId", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map