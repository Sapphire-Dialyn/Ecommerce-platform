import { Role } from '@prisma/client';
export declare class PriceService {
    calculatePrice(basePrice: number, userRole?: Role | string): number;
    calculateTotal(items: Array<{
        basePrice: number;
        quantity: number;
    }>, userRole?: Role | string): number;
    getDiscountAmount(basePrice: number, userRole?: Role | string): number;
}
