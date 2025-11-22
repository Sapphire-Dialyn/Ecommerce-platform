import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        orderItems: {
            id: string;
            sellerId: string | null;
            enterpriseId: string | null;
            price: number;
            productId: string;
            quantity: number;
            variantId: string | null;
            orderId: string;
        }[];
        appliedVouchers: {
            id: string;
            isActive: boolean;
            description: string | null;
            sellerId: string | null;
            enterpriseId: string | null;
            title: string;
            code: string;
            scope: import(".prisma/client").$Enums.VoucherScope;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            maxDiscountValue: number | null;
            minOrderValue: number | null;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            usedCount: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingFee: number;
        paymentId: string | null;
        subtotal: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    }>;
    findAll(userId: string, role: string): Promise<({
        orderItems: {
            id: string;
            sellerId: string | null;
            enterpriseId: string | null;
            price: number;
            productId: string;
            quantity: number;
            variantId: string | null;
            orderId: string;
        }[];
        appliedVouchers: {
            id: string;
            isActive: boolean;
            description: string | null;
            sellerId: string | null;
            enterpriseId: string | null;
            title: string;
            code: string;
            scope: import(".prisma/client").$Enums.VoucherScope;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            maxDiscountValue: number | null;
            minOrderValue: number | null;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            usedCount: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingFee: number;
        paymentId: string | null;
        subtotal: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    })[]>;
    findOne(id: string, userId: string, role: string): Promise<{
        orderItems: {
            id: string;
            sellerId: string | null;
            enterpriseId: string | null;
            price: number;
            productId: string;
            quantity: number;
            variantId: string | null;
            orderId: string;
        }[];
        appliedVouchers: {
            id: string;
            isActive: boolean;
            description: string | null;
            sellerId: string | null;
            enterpriseId: string | null;
            title: string;
            code: string;
            scope: import(".prisma/client").$Enums.VoucherScope;
            discountType: import(".prisma/client").$Enums.DiscountType;
            discountValue: number;
            maxDiscountValue: number | null;
            minOrderValue: number | null;
            startDate: Date;
            endDate: Date;
            usageLimit: number | null;
            usedCount: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingFee: number;
        paymentId: string | null;
        subtotal: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, userId: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        shippingFee: number;
        paymentId: string | null;
        subtotal: number;
        shopDiscount: number;
        platformDiscount: number;
        freeshipDiscount: number;
        totalDiscount: number;
        totalAmount: number;
    }>;
}
