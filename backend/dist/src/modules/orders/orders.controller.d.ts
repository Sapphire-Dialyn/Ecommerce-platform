import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            amount: number;
        };
        orderItems: {
            id: string;
            sellerId: string | null;
            enterpriseId: string | null;
            quantity: number;
            price: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        subtotal: number;
        shippingFee: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    }>;
    findMyOrders(req: any, status?: OrderStatus): Promise<({
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            amount: number;
        };
        orderItems: ({
            product: {
                name: string;
                id: string;
                images: string[];
            };
            variant: {
                id: string;
                color: string;
                size: string;
            };
        } & {
            id: string;
            sellerId: string | null;
            enterpriseId: string | null;
            quantity: number;
            price: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        subtotal: number;
        shippingFee: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    })[]>;
    findAll(req: any): Promise<({
        user: {
            name: string;
            id: string;
            email: string;
            avatar: string;
            phone: string;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            amount: number;
        };
        appliedVouchers: {
            id: string;
            code: string;
            title: string;
            description: string | null;
            scope: import(".prisma/client").$Enums.VoucherScope;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            maxDiscountValue: number | null;
            minOrderValue: number | null;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            usedCount: number;
            isActive: boolean;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        orderItems: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                images: string[];
                active: boolean;
            };
            variant: {
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
            sellerId: string | null;
            enterpriseId: string | null;
            quantity: number;
            price: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        subtotal: number;
        shippingFee: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    })[]>;
    findOne(id: string, req: any): Promise<{
        user: {
            name: string;
            id: string;
            email: string;
            phone: string;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            orderId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            amount: number;
        };
        appliedVouchers: {
            id: string;
            code: string;
            title: string;
            description: string | null;
            scope: import(".prisma/client").$Enums.VoucherScope;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            maxDiscountValue: number | null;
            minOrderValue: number | null;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            usedCount: number;
            isActive: boolean;
            sellerId: string | null;
            enterpriseId: string | null;
        }[];
        orderItems: ({
            product: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                images: string[];
                active: boolean;
            };
            variant: {
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
            sellerId: string | null;
            enterpriseId: string | null;
            quantity: number;
            price: number;
            productId: string;
            variantId: string | null;
            orderId: string;
        })[];
    } & {
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        subtotal: number;
        shippingFee: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, req: any): Promise<{
        id: string;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentId: string | null;
        createdAt: Date;
        updatedAt: Date;
        subtotal: number;
        shippingFee: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    }>;
}
