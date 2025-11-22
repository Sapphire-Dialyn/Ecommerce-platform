import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateVoucherDto, UpdateVoucherDto, CreateFlashSaleDto, CreateCampaignDto, SystemStatsDto } from './dto/admin.dto';
export declare class AdminService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    getAllUsers(): Promise<({
        seller: {
            id: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            userId: string;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        enterprise: {
            id: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
            userId: string;
        };
        logistics: {
            id: string;
            name: string;
            verified: boolean;
            rating: number | null;
            userId: string;
            apiEndpoint: string | null;
            baseRate: number;
        };
        addresses: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            fullName: string;
            province: string;
            district: string;
            ward: string;
            street: string;
            label: string | null;
            isDefault: boolean;
        }[];
        orders: {
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
        }[];
    } & {
        id: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getUserById(id: string): Promise<{
        seller: {
            id: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            userId: string;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        enterprise: {
            id: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
            userId: string;
        };
        logistics: {
            id: string;
            name: string;
            verified: boolean;
            rating: number | null;
            userId: string;
            apiEndpoint: string | null;
            baseRate: number;
        };
        addresses: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            fullName: string;
            province: string;
            district: string;
            ward: string;
            street: string;
            label: string | null;
            isDefault: boolean;
        }[];
        orders: ({
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
            payment: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.PaymentStatus;
                orderId: string;
                method: import(".prisma/client").$Enums.PaymentMethod;
                transactionId: string | null;
                amount: number;
            };
            logisticsOrders: {
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
                pickupLocation: import("@prisma/client/runtime/library").JsonValue | null;
                deliveryLocation: import("@prisma/client/runtime/library").JsonValue | null;
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
        })[];
    } & {
        id: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStatus(id: string, isActive: boolean): Promise<{
        id: string;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllSellers(): Promise<({
        products: {
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
        }[];
        user: {
            id: string;
            name: string;
            email: string;
            isVerified: boolean;
        };
    } & {
        id: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        userId: string;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    })[]>;
    verifySeller(sellerId: string, verified: boolean): Promise<{
        message: string;
    }>;
    verifyEnterprise(id: string, verified: boolean): Promise<{
        message: string;
    }>;
    updateEnterpriseBrandStatus(id: string, officialBrand: boolean): Promise<{
        id: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
        userId: string;
    }>;
    getAllProducts(): Promise<({
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
        seller: {
            id: string;
            verified: boolean;
            storeName: string;
        };
        enterprise: {
            id: string;
            companyName: string;
            verified: boolean;
            officialBrand: boolean;
        };
        reviews: {
            id: string;
            createdAt: Date;
            rating: number;
            userId: string;
            productId: string;
            comment: string | null;
        }[];
        variants: {
            id: string;
            color: string | null;
            size: string | null;
            price: number;
            stock: number;
            sku: string | null;
            productId: string;
        }[];
    } & {
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
    })[]>;
    updateProductStatus(id: string, active: boolean): Promise<{
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
    }>;
    getAllOrders(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            password: string;
            avatar: string | null;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isVerified: boolean;
            verificationToken: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        orderItems: ({
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
            sellerId: string | null;
            enterpriseId: string | null;
            price: number;
            productId: string;
            quantity: number;
            variantId: string | null;
            orderId: string;
        })[];
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            transactionId: string | null;
            amount: number;
        };
        logisticsOrders: {
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
            pickupLocation: import("@prisma/client/runtime/library").JsonValue | null;
            deliveryLocation: import("@prisma/client/runtime/library").JsonValue | null;
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
    createVoucher(dto: CreateVoucherDto): Promise<{
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
    }>;
    updateVoucher(id: string, dto: UpdateVoucherDto): Promise<{
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
    }>;
    getAllVouchers(): Promise<({
        orders: {
            id: string;
            totalAmount: number;
        }[];
    } & {
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
    })[]>;
    createFlashSale(dto: CreateFlashSaleDto): Promise<{
        products: ({
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
            productId: string;
            quantity: number | null;
            discountPercentage: number;
            soldQuantity: number | null;
            promotionId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.PromotionType;
        startDate: Date;
        endDate: Date;
        discountPercentage: number | null;
    }>;
    getAllFlashSales(): Promise<({
        products: ({
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
            productId: string;
            quantity: number | null;
            discountPercentage: number;
            soldQuantity: number | null;
            promotionId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.PromotionType;
        startDate: Date;
        endDate: Date;
        discountPercentage: number | null;
    })[]>;
    createCampaign(dto: CreateCampaignDto): Promise<{
        categories: ({
            category: {
                id: string;
                name: string;
                parentId: string | null;
            };
        } & {
            id: string;
            categoryId: string;
            promotionId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.PromotionType;
        startDate: Date;
        endDate: Date;
        discountPercentage: number | null;
    }>;
    getAllCampaigns(): Promise<({
        categories: ({
            category: {
                id: string;
                name: string;
                parentId: string | null;
            };
        } & {
            id: string;
            categoryId: string;
            promotionId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import(".prisma/client").$Enums.PromotionType;
        startDate: Date;
        endDate: Date;
        discountPercentage: number | null;
    })[]>;
    getSystemStats(dto: SystemStatsDto): Promise<{
        period: {
            startDate: Date;
            endDate: Date;
        };
        metrics: {
            totalUsers: number;
            totalSellers: number;
            totalEnterprises: number;
            totalOrders: number;
            totalRevenue: number;
            totalProducts: number;
        };
        topSellingProducts: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.OrderItemGroupByOutputType, "productId"[]> & {
            _sum: {
                quantity: number;
            };
        })[];
        topSellers: {
            id: string;
            name: string;
            email: string;
            storeName: string;
            totalSales: number;
        }[];
    }>;
    createInitialAdmins(): Promise<{
        message: string;
    }>;
}
