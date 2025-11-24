import { AdminService } from './admin.service';
import { CreateVoucherDto, UpdateVoucherDto, CreateFlashSaleDto, CreateCampaignDto, SystemStatsDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(): Promise<({
        seller: {
            id: string;
            userId: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        enterprise: {
            id: string;
            userId: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
    })[]>;
    getUserById(id: string): Promise<{
        seller: {
            id: string;
            userId: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        enterprise: {
            id: string;
            userId: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
        };
        orders: ({
            payment: {
                id: string;
                status: import(".prisma/client").$Enums.PaymentStatus;
                createdAt: Date;
                orderId: string;
                method: import(".prisma/client").$Enums.PaymentMethod;
                transactionId: string | null;
                amount: number;
            };
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
        })[];
        logistics: {
            id: string;
            userId: string;
            name: string;
            verified: boolean;
            rating: number | null;
            apiEndpoint: string | null;
            baseRate: number;
        };
        addresses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            phone: string;
            label: string | null;
            fullName: string;
            province: string;
            district: string;
            ward: string;
            street: string;
            isDefault: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
    }>;
    verifyEnterprise(id: string, verified: boolean): Promise<{
        message: string;
    }>;
    updateEnterpriseBrandStatus(id: string, officialBrand: boolean): Promise<{
        id: string;
        userId: string;
        companyName: string;
        taxCode: string | null;
        verified: boolean;
        officialBrand: boolean;
        rating: number | null;
        logoUrl: string | null;
        businessLicenseUrl: string | null;
        brandRegistrationUrl: string | null;
        taxDocumentUrl: string | null;
    }>;
    updateUserStatus(id: string, active: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        name: string;
        email: string;
        password: string;
        avatar: string | null;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isVerified: boolean;
        verificationToken: string | null;
    }>;
    getAllSellers(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            isVerified: boolean;
        };
        products: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            sellerId: string | null;
            enterpriseId: string | null;
            name: string;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
            categoryId: string;
            images: string[];
            active: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    })[]>;
    verifySeller(id: string, verified: boolean): Promise<{
        message: string;
    }>;
    getAllProducts(): Promise<({
        category: {
            id: string;
            name: string;
            parentId: string | null;
        };
        variants: {
            price: number;
            stock: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        sellerId: string | null;
        enterpriseId: string | null;
        name: string;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        categoryId: string;
        images: string[];
        active: boolean;
    })[]>;
    updateProductStatus(id: string, active: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        sellerId: string | null;
        enterpriseId: string | null;
        name: string;
        specifications: import("@prisma/client/runtime/library").JsonValue | null;
        categoryId: string;
        images: string[];
        active: boolean;
    }>;
    getAllOrders(): Promise<({
        user: {
            name: string;
            email: string;
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
    createVoucher(createVoucherDto: CreateVoucherDto): Promise<{
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
    }>;
    updateVoucher(id: string, updateVoucherDto: UpdateVoucherDto): Promise<{
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
    }>;
    getAllVouchers(): Promise<({
        orders: {
            id: string;
            totalAmount: number;
        }[];
    } & {
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
    })[]>;
    createFlashSale(createFlashSaleDto: CreateFlashSaleDto): Promise<{
        products: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                name: string;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                images: string[];
                active: boolean;
            };
        } & {
            id: string;
            quantity: number | null;
            productId: string;
            discountPercentage: number;
            soldQuantity: number | null;
            promotionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        name: string;
        type: import(".prisma/client").$Enums.PromotionType;
        discountPercentage: number | null;
    }>;
    getAllFlashSales(): Promise<({
        products: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                sellerId: string | null;
                enterpriseId: string | null;
                name: string;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
                categoryId: string;
                images: string[];
                active: boolean;
            };
        } & {
            id: string;
            quantity: number | null;
            productId: string;
            discountPercentage: number;
            soldQuantity: number | null;
            promotionId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        name: string;
        type: import(".prisma/client").$Enums.PromotionType;
        discountPercentage: number | null;
    })[]>;
    createCampaign(createCampaignDto: CreateCampaignDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        name: string;
        type: import(".prisma/client").$Enums.PromotionType;
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
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date;
        endDate: Date;
        name: string;
        type: import(".prisma/client").$Enums.PromotionType;
        discountPercentage: number | null;
    })[]>;
    getSystemStats(systemStatsDto: SystemStatsDto): Promise<{
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
