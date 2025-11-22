import { PrismaService } from '../prisma/prisma.service';
import { CreateLogisticsPartnerDto, UpdateLogisticsPartnerDto, CreateLogisticsOrderDto, UpdateLogisticsOrderDto, CalculateShippingDto } from './dto/logistics.dto';
import { Prisma } from '@prisma/client';
export declare class LogisticsService {
    private prisma;
    constructor(prisma: PrismaService);
    createPartner(userId: string, dto: CreateLogisticsPartnerDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        verified: boolean;
        rating: number | null;
        userId: string;
        apiEndpoint: string | null;
        baseRate: number;
    }>;
    findAllPartners(): Promise<({
        orders: {
            id: string;
            status: import(".prisma/client").$Enums.LogisticsStatus;
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                totalAmount: number;
            };
            estimatedDelivery: Date;
        }[];
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        verified: boolean;
        rating: number | null;
        userId: string;
        apiEndpoint: string | null;
        baseRate: number;
    })[]>;
    findOnePartner(id: string): Promise<{
        orders: {
            id: string;
            status: import(".prisma/client").$Enums.LogisticsStatus;
            order: {
                id: string;
                status: import(".prisma/client").$Enums.OrderStatus;
                totalAmount: number;
            };
            estimatedDelivery: Date;
        }[];
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        verified: boolean;
        rating: number | null;
        userId: string;
        apiEndpoint: string | null;
        baseRate: number;
    }>;
    updatePartner(id: string, dto: UpdateLogisticsPartnerDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        verified: boolean;
        rating: number | null;
        userId: string;
        apiEndpoint: string | null;
        baseRate: number;
    }>;
    deletePartner(id: string): Promise<{
        message: string;
    }>;
    createOrder(dto: CreateLogisticsOrderDto): Promise<{
        logisticsPartner: {
            id: string;
            name: string;
            verified: boolean;
            rating: number | null;
            userId: string;
            apiEndpoint: string | null;
            baseRate: number;
        };
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
        updatedAt: Date;
        rating: number | null;
        sellerId: string | null;
        enterpriseId: string | null;
        status: import(".prisma/client").$Enums.LogisticsStatus;
        logisticsPartnerId: string;
        orderId: string;
        shipperId: string | null;
        trackingCode: string;
        pickupAddress: string;
        deliveryAddress: string;
        pickupLocation: Prisma.JsonValue | null;
        deliveryLocation: Prisma.JsonValue | null;
        distance: number | null;
        estimatedTime: number | null;
        estimatedDelivery: Date | null;
        pickupTime: Date | null;
        deliveredTime: Date | null;
        notes: string | null;
        deliveryAttempts: number;
        customerSignature: string | null;
        proofOfDelivery: string[];
        cancelReason: string | null;
        feedback: string | null;
    }>;
    findAllOrders(partnerId?: string): Promise<({
        logisticsPartner: {
            id: string;
            name: string;
            verified: boolean;
            rating: number | null;
            userId: string;
            apiEndpoint: string | null;
            baseRate: number;
        };
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
        updatedAt: Date;
        rating: number | null;
        sellerId: string | null;
        enterpriseId: string | null;
        status: import(".prisma/client").$Enums.LogisticsStatus;
        logisticsPartnerId: string;
        orderId: string;
        shipperId: string | null;
        trackingCode: string;
        pickupAddress: string;
        deliveryAddress: string;
        pickupLocation: Prisma.JsonValue | null;
        deliveryLocation: Prisma.JsonValue | null;
        distance: number | null;
        estimatedTime: number | null;
        estimatedDelivery: Date | null;
        pickupTime: Date | null;
        deliveredTime: Date | null;
        notes: string | null;
        deliveryAttempts: number;
        customerSignature: string | null;
        proofOfDelivery: string[];
        cancelReason: string | null;
        feedback: string | null;
    })[]>;
    findOneOrder(id: string): Promise<{
        logisticsPartner: {
            id: string;
            name: string;
            verified: boolean;
            rating: number | null;
            userId: string;
            apiEndpoint: string | null;
            baseRate: number;
        };
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
        updatedAt: Date;
        rating: number | null;
        sellerId: string | null;
        enterpriseId: string | null;
        status: import(".prisma/client").$Enums.LogisticsStatus;
        logisticsPartnerId: string;
        orderId: string;
        shipperId: string | null;
        trackingCode: string;
        pickupAddress: string;
        deliveryAddress: string;
        pickupLocation: Prisma.JsonValue | null;
        deliveryLocation: Prisma.JsonValue | null;
        distance: number | null;
        estimatedTime: number | null;
        estimatedDelivery: Date | null;
        pickupTime: Date | null;
        deliveredTime: Date | null;
        notes: string | null;
        deliveryAttempts: number;
        customerSignature: string | null;
        proofOfDelivery: string[];
        cancelReason: string | null;
        feedback: string | null;
    }>;
    updateOrderStatus(id: string, dto: UpdateLogisticsOrderDto): Promise<{
        logisticsPartner: {
            id: string;
            name: string;
            verified: boolean;
            rating: number | null;
            userId: string;
            apiEndpoint: string | null;
            baseRate: number;
        };
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
        updatedAt: Date;
        rating: number | null;
        sellerId: string | null;
        enterpriseId: string | null;
        status: import(".prisma/client").$Enums.LogisticsStatus;
        logisticsPartnerId: string;
        orderId: string;
        shipperId: string | null;
        trackingCode: string;
        pickupAddress: string;
        deliveryAddress: string;
        pickupLocation: Prisma.JsonValue | null;
        deliveryLocation: Prisma.JsonValue | null;
        distance: number | null;
        estimatedTime: number | null;
        estimatedDelivery: Date | null;
        pickupTime: Date | null;
        deliveredTime: Date | null;
        notes: string | null;
        deliveryAttempts: number;
        customerSignature: string | null;
        proofOfDelivery: string[];
        cancelReason: string | null;
        feedback: string | null;
    }>;
    private generateTrackingCode;
    calculateShipping(dto: CalculateShippingDto): Promise<{
        cost: number;
        estimatedDays: number;
    }>;
}
