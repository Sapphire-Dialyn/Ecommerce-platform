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
    updateCartItem(id: string, { quantity }: {
        quantity: number;
    }, user: any, sessionId?: string): Promise<{
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
    removeFromCart(id: string, user: any, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        selectedPrice: number;
        cartId: string;
        variantId: string;
    }>;
    clearCart(user: any, sessionId?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    generateSessionId(): {
        sessionId: string;
    };
}
