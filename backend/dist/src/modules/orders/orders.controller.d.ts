import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
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
    findAll(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    updateStatus(id: string, dto: UpdateOrderStatusDto, req: any): Promise<{
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
