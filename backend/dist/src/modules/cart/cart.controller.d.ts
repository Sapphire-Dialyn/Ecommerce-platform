import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: any, sessionId?: string): Promise<{
        cartId: any;
        items: any;
        subtotal: number;
        totalItems: any;
        discount: number;
    }>;
    addToCart({ variantId, quantity }: {
        variantId: string;
        quantity: number;
    }, user: any, sessionId?: string): Promise<{
        variant: {
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                name: string;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                images: string[];
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        variantId: string;
        selectedPrice: number;
        cartId: string;
    }>;
    updateCartItem(id: string, { quantity }: {
        quantity: number;
    }, user: any, sessionId?: string): Promise<{
        variant: {
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                name: string;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                images: string[];
                active: boolean;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            color: string | null;
            size: string | null;
            stock: number;
            sku: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        variantId: string;
        selectedPrice: number;
        cartId: string;
    }>;
    removeFromCart(id: string, user: any, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        variantId: string;
        selectedPrice: number;
        cartId: string;
    }>;
    clearCart(user: any, sessionId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    generateSessionId(): {
        sessionId: string;
    };
}
