import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { OrderStatus, Prisma } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateOrderDto): Promise<{
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
        userId: string;
    }>;
    findMyOrders(userId: string, status?: OrderStatus): Promise<({
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
                id: string;
                name: string;
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
        userId: string;
    })[]>;
    findAll(userId: string, role: string): Promise<({
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                name: string;
                specifications: Prisma.JsonValue | null;
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
        userId: string;
    })[]>;
    findOne(id: string, userId: string, role: string): Promise<{
        user: {
            id: string;
            name: string;
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
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                name: string;
                specifications: Prisma.JsonValue | null;
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
        userId: string;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, userId: string, role: string): Promise<{
        id: string;
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
        userId: string;
    }>;
}
