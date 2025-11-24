import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PayPalCallbackDto } from './dto/payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto, ip: string): Promise<any>;
    findAll(): Promise<({
        order: {
            id: string;
            paymentId: string | null;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            subtotal: number;
            shippingFee: number;
            shopDiscount: number;
            platformDiscount: number;
            freeshipDiscount: number;
            totalDiscount: number;
            totalAmount: number;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    })[]>;
    findOne(id: string): Promise<{
        order: {
            id: string;
            paymentId: string | null;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            subtotal: number;
            shippingFee: number;
            shopDiscount: number;
            platformDiscount: number;
            freeshipDiscount: number;
            totalDiscount: number;
            totalAmount: number;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    }>;
    findByOrder(orderId: string): Promise<{
        order: {
            id: string;
            paymentId: string | null;
            userId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            subtotal: number;
            shippingFee: number;
            shopDiscount: number;
            platformDiscount: number;
            freeshipDiscount: number;
            totalDiscount: number;
            totalAmount: number;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    }>;
    handleVNPayCallback(params: any): Promise<{
        message: string;
        code: any;
    }>;
    handlePayPalCallback(params: PayPalCallbackDto): Promise<{}>;
}
