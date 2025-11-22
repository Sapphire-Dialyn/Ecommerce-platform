"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PriceService = class PriceService {
    calculatePrice(basePrice, userRole) {
        if (userRole === client_1.Role.CUSTOMER || userRole === 'CUSTOMER') {
            return basePrice * 0.98;
        }
        return basePrice;
    }
    calculateTotal(items, userRole) {
        const total = items.reduce((sum, item) => {
            const price = this.calculatePrice(item.basePrice, userRole);
            return sum + price * item.quantity;
        }, 0);
        return Math.round(total * 100) / 100;
    }
    getDiscountAmount(basePrice, userRole) {
        if (userRole === client_1.Role.CUSTOMER || userRole === 'CUSTOMER') {
            return basePrice * 0.02;
        }
        return 0;
    }
};
exports.PriceService = PriceService;
exports.PriceService = PriceService = __decorate([
    (0, common_1.Injectable)()
], PriceService);
//# sourceMappingURL=price.service.js.map