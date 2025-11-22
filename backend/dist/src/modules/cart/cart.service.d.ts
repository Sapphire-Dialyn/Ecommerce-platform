import { PrismaService } from '@modules/prisma/prisma.service';
import { PriceService } from '@modules/products/services/price.service';
import { Role } from '@prisma/client';
export declare class CartService {
    private prisma;
    private priceService;
    constructor(prisma: PrismaService, priceService: PriceService);
    getOrCreateCart(userId?: string, sessionId?: string): Promise<any>;
    addToCart(variantId: string, quantity: number, userId?: string, sessionId?: string, userRole?: Role | string): Promise<{
        variant: {
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                images: string[];
                active: boolean;
                categoryId: string;
                sellerId: string | null;
                enterpriseId: string | null;
            };
        } & {
            id: string;
            color: string | null;
            size: string | null;
            price: number;
            stock: number;
            sku: string | null;
            productId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        selectedPrice: number;
        cartId: string;
        variantId: string;
    }>;
    updateCartItem(cartItemId: string, quantity: number, userId?: string, sessionId?: string): Promise<{
        variant: {
            product: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                images: string[];
                active: boolean;
                categoryId: string;
                sellerId: string | null;
                enterpriseId: string | null;
            };
        } & {
            id: string;
            color: string | null;
            size: string | null;
            price: number;
            stock: number;
            sku: string | null;
            productId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        selectedPrice: number;
        cartId: string;
        variantId: string;
    }>;
    removeFromCart(cartItemId: string, userId?: string, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        selectedPrice: number;
        cartId: string;
        variantId: string;
    }>;
    clearCart(userId?: string, sessionId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getCartSummary(userId?: string, sessionId?: string, userRole?: Role | string): Promise<{
        cartId: any;
        items: any;
        subtotal: number;
        totalItems: any;
        discount: number;
    }>;
    generateSessionId(): string;
}
