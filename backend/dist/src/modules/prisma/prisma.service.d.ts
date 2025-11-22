import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma, LogisticsStatus, ShipperStatus } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private registerSoftDeleteMiddleware;
    findAvailableShippers(logisticsPartnerId: string, pickupLocation: {
        latitude: number;
        longitude: number;
    }, deliveryRange?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number | null;
        userId: string;
        active: boolean;
        currentLocation: Prisma.JsonValue | null;
        status: import(".prisma/client").$Enums.ShipperStatus;
        totalDeliveries: number;
        totalRatings: number;
        deliveryRange: number;
        deliveryHistory: Prisma.JsonValue[];
        logisticsPartnerId: string;
    }[]>;
    updateShipperStatus(shipperId: string, status: ShipperStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number | null;
        userId: string;
        active: boolean;
        currentLocation: Prisma.JsonValue | null;
        status: import(".prisma/client").$Enums.ShipperStatus;
        totalDeliveries: number;
        totalRatings: number;
        deliveryRange: number;
        deliveryHistory: Prisma.JsonValue[];
        logisticsPartnerId: string;
    }>;
    updateOrderStatus(orderId: string, status: LogisticsStatus, data?: Prisma.LogisticsOrderUpdateInput): Promise<{
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
    calculateDeliveryStats(shipperId: string): Promise<{
        totalDeliveries: number;
        averageRating: number;
    }>;
}
