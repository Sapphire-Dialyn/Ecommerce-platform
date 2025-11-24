import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payments.dto';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private sortObject;
    create(dto: CreatePaymentDto, ipAddr?: string): Promise<any>;
    private createVNPayPayment;
    handleVNPayCallback(params: any): Promise<{
        message: string;
        code: any;
    }>;
    private createPayPalPayment;
    private createCODPayment;
    handlePayPalCallback(params: any): Promise<{}>;
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
    updatePayment(id: string, dto: UpdatePaymentDto): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        transactionId: string | null;
        amount: number;
    }>;
}
