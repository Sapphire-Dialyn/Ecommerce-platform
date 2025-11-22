"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let AdminService = class AdminService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async getAllUsers(role) {
        const whereClause = role ? { role: role } : {};
        return this.prisma.user.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                seller: true,
                enterprise: true,
            },
        });
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                seller: true,
                enterprise: true,
                logistics: true,
                addresses: true,
                orders: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        payment: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUserStatus(id, isActive) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id },
            data: { isActive: isActive },
        });
    }
    async getAllSellers() {
        return this.prisma.seller.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        isVerified: true,
                    },
                },
                products: true,
            },
        });
    }
    async verifySeller(sellerId, verified) {
        const seller = await this.prisma.seller.findUnique({
            where: { id: sellerId },
            include: { user: true },
        });
        if (!seller) {
            throw new common_1.NotFoundException('Seller not found');
        }
        await this.prisma.seller.update({
            where: { id: sellerId },
            data: { verified },
        });
        if (verified) {
            await this.emailService.sendRoleApprovalEmail(seller.user.email, 'SELLER');
        }
        return { message: 'Seller verification status updated' };
    }
    async verifyEnterprise(id, verified) {
        const enterprise = await this.prisma.enterprise.update({
            where: { id },
            data: { verified },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });
        if (verified) {
            await this.emailService.sendRoleApprovalEmail(enterprise.user.email, 'ENTERPRISE');
        }
        return { message: 'Enterprise verification status updated' };
    }
    async updateEnterpriseBrandStatus(id, officialBrand) {
        return this.prisma.enterprise.update({
            where: { id },
            data: { officialBrand },
        });
    }
    async getAllProducts() {
        return this.prisma.product.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                variants: { select: { price: true, stock: true } }
            },
        });
    }
    async updateProductStatus(id, active) {
        return this.prisma.product.update({
            where: { id },
            data: { active },
        });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true, email: true } },
                payment: true,
            },
        });
    }
    async createVoucher(dto) {
        var _a;
        return this.prisma.voucher.create({
            data: {
                title: (_a = dto.title) !== null && _a !== void 0 ? _a : dto.code,
                scope: dto.scope,
                code: dto.code,
                discountType: dto.discountType,
                discountValue: dto.discountValue,
                minOrderValue: dto.minOrderValue,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                usageLimit: dto.usageLimit,
            },
        });
    }
    async updateVoucher(id, dto) {
        const voucher = await this.prisma.voucher.findUnique({ where: { id } });
        if (!voucher) {
            throw new common_1.NotFoundException('Voucher not found');
        }
        return this.prisma.voucher.update({
            where: { id },
            data: dto,
        });
    }
    async getAllVouchers() {
        return this.prisma.voucher.findMany({
            include: {
                orders: {
                    select: {
                        id: true,
                        totalAmount: true,
                    },
                },
            },
        });
    }
    async createFlashSale(dto) {
        return this.prisma.$transaction(async (tx) => {
            const flashSale = await tx.promotion.create({
                data: {
                    type: 'FLASH_SALE',
                    name: dto.name,
                    startDate: new Date(dto.startDate),
                    endDate: new Date(dto.endDate),
                    products: {
                        create: dto.products.map(product => ({
                            productId: product.productId,
                            discountPercentage: product.discountPercentage,
                            quantity: product.quantity,
                        })),
                    },
                },
                include: {
                    products: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            return flashSale;
        });
    }
    async getAllFlashSales() {
        return this.prisma.promotion.findMany({
            where: {
                type: 'FLASH_SALE',
            },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    }
    async createCampaign(dto) {
        return this.prisma.$transaction(async (tx) => {
            const campaign = await tx.promotion.create({
                data: {
                    type: 'CAMPAIGN',
                    name: dto.name,
                    description: dto.description,
                    startDate: new Date(dto.startDate),
                    endDate: new Date(dto.endDate),
                    discountPercentage: dto.discountPercentage,
                    categories: {
                        create: dto.categoryIds.map(categoryId => ({
                            categoryId,
                        })),
                    },
                },
                include: {
                    categories: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
            return campaign;
        });
    }
    async getAllCampaigns() {
        return this.prisma.promotion.findMany({
            where: {
                type: 'CAMPAIGN',
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
    }
    async getSystemStats(dto) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        const [totalUsers, totalSellers, totalOrders, totalRevenue, totalProducts, topSellingProducts, topSellers,] = await Promise.all([
            this.prisma.user.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),
            this.prisma.seller.count({
                where: {
                    user: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
            }),
            this.prisma.order.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),
            this.prisma.order.aggregate({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: {
                        in: ['DELIVERED', 'SHIPPING'],
                    },
                },
                _sum: {
                    totalAmount: true,
                },
            }),
            this.prisma.product.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),
            this.prisma.orderItem.groupBy({
                by: ['productId'],
                where: {
                    order: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                },
                _sum: {
                    quantity: true,
                },
                orderBy: {
                    _sum: {
                        quantity: 'desc',
                    },
                },
                take: 10,
            }),
            this.prisma.seller.findMany({
                where: {
                    products: {
                        some: {
                            orderItems: {
                                some: {
                                    order: {
                                        createdAt: {
                                            gte: startDate,
                                            lte: endDate,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                include: {
                    products: {
                        include: {
                            orderItems: {
                                where: {
                                    order: {
                                        createdAt: {
                                            gte: startDate,
                                            lte: endDate,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                take: 10,
            }),
        ]);
        return {
            period: {
                startDate,
                endDate,
            },
            metrics: {
                totalUsers,
                totalSellers,
                totalEnterprises: await this.prisma.enterprise.count(),
                totalOrders,
                totalRevenue: totalRevenue._sum.totalAmount || 0,
                totalProducts,
            },
            topSellingProducts,
            topSellers: topSellers.map((seller) => ({
                id: seller.id,
                name: seller.user.name,
                email: seller.user.email,
                storeName: seller.storeName,
                totalSales: seller.products.reduce((acc, product) => acc +
                    product.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0), 0),
            })),
        };
    }
    async createInitialAdmins() {
        const adminAccounts = [
            {
                email: 'admin1@example.com',
                password: 'Admin@123',
                name: 'Admin One',
            },
            {
                email: 'admin2@example.com',
                password: 'Admin@123',
                name: 'Admin Two',
            },
            {
                email: 'admin3@example.com',
                password: 'Admin@123',
                name: 'Admin Three',
            },
            {
                email: 'admin4@example.com',
                password: 'Admin@123',
                name: 'Admin Four',
            },
        ];
        for (const admin of adminAccounts) {
            const existingAdmin = await this.prisma.user.findUnique({
                where: { email: admin.email },
            });
            if (!existingAdmin) {
                await this.prisma.user.create({
                    data: {
                        email: admin.email,
                        password: await bcrypt.hash(admin.password, 10),
                        name: admin.name,
                        role: client_1.Role.ADMIN,
                        isVerified: true,
                        isActive: true,
                    },
                });
            }
        }
        return { message: 'Initial admin accounts created successfully' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AdminService);
//# sourceMappingURL=admin.service.js.map