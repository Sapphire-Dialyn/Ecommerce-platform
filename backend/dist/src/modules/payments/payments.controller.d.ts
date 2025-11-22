import { PaymentsService } from './payments.service';
import { CreatePaymentDto, VNPayCallbackDto, PayPalCallbackDto } from './dto/payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto): Promise<any>;
    findAll(): Promise<({
        order: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    })[]>;
    findOne(id: string): Promise<{
        order: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    }>;
    findByOrder(orderId: string): Promise<{
        order: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    }>;
    handleVNPayCallback(params: VNPayCallbackDto): Promise<{
        order: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    }>;
    handlePayPalCallback(params: PayPalCallbackDto): Promise<{
        message: string;
    }>;
}
