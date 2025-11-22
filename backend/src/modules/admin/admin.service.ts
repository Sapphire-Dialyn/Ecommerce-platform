import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import {
  CreateVoucherDto,
  UpdateVoucherDto,
  CreateFlashSaleDto,
  CreateCampaignDto,
  SystemStatsDto,
} from './dto/admin.dto';
import { Role, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // User Management
 async getAllUsers(role?: Role) {
    const whereClause = role ? { role: role } : {};

    return this.prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }, // Sắp xếp mới nhất lên đầu
      include: {
        seller: true,     // Để lấy thông tin Store Name
        enterprise: true, // Để lấy thông tin Company Name
        // Bỏ bớt mấy cái nặng như orders, addresses nếu chỉ để hiển thị danh sách
      },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        seller: true,
        enterprise: true,
        logistics: true,
        addresses: true,
        // Chỉ include orders khi xem chi tiết user
        orders: {
          take: 5, // Chỉ lấy 5 đơn gần nhất để đỡ nặng
          orderBy: { createdAt: 'desc' },
          include: {
            payment: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: isActive },
    });
  }

  // Seller Management
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

  async verifySeller(sellerId: string, verified: boolean) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      include: { user: true },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
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

  // Enterprise Management
  async verifyEnterprise(id: string, verified: boolean) {
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

  async updateEnterpriseBrandStatus(id: string, officialBrand: boolean) {
    return this.prisma.enterprise.update({
      where: { id },
      data: { officialBrand },
    });
  }

  // Product Management
 async getAllProducts() {
    // Cần giới hạn số lượng hoặc phân trang
    return this.prisma.product.findMany({
      take: 50, // Giới hạn 50 sản phẩm mới nhất để demo
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: { select: { price: true, stock: true } } // Chỉ lấy giá và kho để hiển thị
      },
    });
  }

  async updateProductStatus(id: string, active: boolean) {
    return this.prisma.product.update({
      where: { id },
      data: { active },
    });
  }

  // Order Management
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

  // Voucher Management
  async createVoucher(dto: CreateVoucherDto) {
    return this.prisma.voucher.create({
      data: {
        title: dto.title ?? dto.code,
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

  async updateVoucher(id: string, dto: UpdateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({ where: { id } });
    if (!voucher) {
      throw new NotFoundException('Voucher not found');
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

  // Flash Sale Management
  async createFlashSale(dto: CreateFlashSaleDto) {
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

  // Campaign Management
  async createCampaign(dto: CreateCampaignDto) {
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

  // System Statistics
  async getSystemStats(dto: SystemStatsDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    const [
      totalUsers,
      totalSellers,
      totalOrders,
      totalRevenue,
      totalProducts,
      topSellingProducts,
      topSellers,
    ] = await Promise.all([
      // Total users
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Total sellers
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

      // Total orders
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Total revenue
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

      // Total products
      this.prisma.product.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Top selling products
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

      // Top sellers
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
        totalSales: seller.products.reduce(
          (acc, product) =>
            acc +
            product.orderItems.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0,
            ),
          0, 
        ),
      })),
    };
  }

  // Create initial admin accounts
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
            role: Role.ADMIN,
            isVerified: true,
            isActive: true,
          },
        });
      }
    }

    return { message: 'Initial admin accounts created successfully' };
  }
}