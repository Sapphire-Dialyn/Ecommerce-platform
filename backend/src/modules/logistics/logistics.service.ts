import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssignLogisticsOrderDto,
  CalculateShippingDto,
  CreateLogisticsOrderDto,
  CreateLogisticsPartnerDto,
  UpdateLogisticsOrderDto,
  UpdateLogisticsPartnerDto,
} from './dto/logistics.dto';
import {
  LogisticsStatus,
  OrderStatus,
  Prisma,
  ShipperStatus,
} from '@prisma/client';

@Injectable()
export class LogisticsService {
  constructor(private prisma: PrismaService) {}

  async createPartner(userId: string, dto: CreateLogisticsPartnerDto) {
    const existingPartner = await this.prisma.logisticsPartner.findUnique({
      where: { userId },
    });

    if (existingPartner) {
      throw new BadRequestException('User already has a logistics partner profile');
    }

    return this.prisma.logisticsPartner.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAllPartners() {
    return this.prisma.logisticsPartner.findMany({
      where: { verified: true },
      select: {
        id: true,
        name: true,
        baseRate: true,
        rating: true,
        verified: true,
      },
      orderBy: [{ rating: 'desc' }, { name: 'asc' }],
    });
  }

  async findOnePartner(id: string) {
    const partner = await this.prisma.logisticsPartner.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orders: {
          include: {
            order: {
              select: {
                id: true,
                totalAmount: true,
                status: true,
                deliveryAddress: true,
              },
            },
            shipper: {
              include: {
                user: { select: { id: true, name: true, phone: true } },
              },
            },
          },
        },
      },
    });

    if (!partner) {
      throw new NotFoundException(`Logistics partner with ID ${id} not found`);
    }

    return partner;
  }

  async updatePartner(id: string, dto: UpdateLogisticsPartnerDto) {
    const partner = await this.prisma.logisticsPartner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Logistics partner with ID ${id} not found`);
    }

    return this.prisma.logisticsPartner.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async deletePartner(id: string) {
    const partner = await this.prisma.logisticsPartner.findUnique({
      where: { id },
      include: { orders: true },
    });

    if (!partner) {
      throw new NotFoundException(`Logistics partner with ID ${id} not found`);
    }

    if (partner.orders.length > 0) {
      throw new BadRequestException('Cannot delete partner with existing orders');
    }

    await this.prisma.logisticsPartner.delete({
      where: { id },
    });

    return { message: 'Logistics partner deleted successfully' };
  }

  async getPartnerByUserId(userId: string) {
    const partner = await this.prisma.logisticsPartner.findUnique({
      where: { userId },
    });
    if (!partner) {
      throw new BadRequestException('Không tìm thấy hồ sơ đối tác vận chuyển của tài khoản này');
    }
    return partner;
  }

  async createOrder(dto: CreateLogisticsOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: dto.orderId },
        include: { orderItems: true },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const partner = await tx.logisticsPartner.findUnique({
        where: { id: dto.logisticsPartnerId },
      });

      if (!partner) {
        throw new NotFoundException('Logistics partner not found');
      }

      const existingOrder = await tx.logisticsOrder.findUnique({
        where: { orderId: dto.orderId },
      });

      if (existingOrder) {
        return this.findOneOrder(existingOrder.id);
      }

      if (!order.deliveryAddress) {
        throw new BadRequestException('Order is missing delivery address snapshot');
      }

      const merchantContext = this.resolveMerchantContext(order.orderItems);

      const logisticsOrder = await tx.logisticsOrder.create({
        data: {
          orderId: dto.orderId,
          logisticsPartnerId: dto.logisticsPartnerId,
          trackingCode: this.generateTrackingCode(),
          status: LogisticsStatus.CREATED,
          pickupAddress: dto.pickupAddress,
          deliveryAddress: order.deliveryAddress,
          estimatedDelivery: dto.estimatedDelivery,
          notes: dto.notes,
          sellerId: merchantContext.sellerId,
          enterpriseId: merchantContext.enterpriseId,
          proofOfDelivery: [],
        },
      });

      await tx.order.update({
        where: { id: dto.orderId },
        data: {
          selectedLogisticsPartnerId: partner.id,
          selectedLogisticsPartnerName: partner.name,
        },
      });

      return tx.logisticsOrder.findUnique({
        where: { id: logisticsOrder.id },
        include: this.getLogisticsOrderInclude(),
      });
    });
  }

  async findAllOrders(partnerId?: string, unassignedOnly = false) {
    const where: Prisma.LogisticsOrderWhereInput = partnerId
      ? { logisticsPartnerId: partnerId }
      : {};

    if (unassignedOnly) {
      where.shipperId = null;
    }

    return this.prisma.logisticsOrder.findMany({
      where,
      include: this.getLogisticsOrderInclude(),
      orderBy: [{ updatedAt: 'desc' }, { deliveredTime: 'desc' }],
    });
  }

  async findOneOrder(id: string) {
    const logisticsOrder = await this.prisma.logisticsOrder.findUnique({
      where: { id },
      include: this.getLogisticsOrderInclude(),
    });

    if (!logisticsOrder) {
      throw new NotFoundException(`Logistics order with ID ${id} not found`);
    }

    return logisticsOrder;
  }

  async updateOrderStatus(id: string, dto: UpdateLogisticsOrderDto, partnerId?: string) {
    const logisticsOrder = await this.prisma.logisticsOrder.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!logisticsOrder) {
      throw new NotFoundException(`Logistics order with ID ${id} not found`);
    }

    if (partnerId && logisticsOrder.logisticsPartnerId !== partnerId) {
      throw new ForbiddenException('You do not have permission to update this logistics order');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.logisticsOrder.update({
        where: { id },
        data: {
          status: dto.status,
          pickupAddress: dto.pickupAddress,
          estimatedDelivery: dto.estimatedDelivery,
          notes: dto.notes,
          pickupTime:
            dto.status === LogisticsStatus.PICKED_UP && !logisticsOrder.pickupTime
              ? new Date()
              : undefined,
          deliveredTime:
            dto.status === LogisticsStatus.DELIVERED ? new Date() : undefined,
        },
      });

      if (dto.status) {
        const nextOrderStatus = this.mapOrderStatusFromLogisticsStatus(dto.status);

        if (nextOrderStatus) {
          await tx.order.update({
            where: { id: logisticsOrder.orderId },
            data: { status: nextOrderStatus },
          });
        }

        if (
          dto.status === LogisticsStatus.DELIVERED &&
          logisticsOrder.shipperId
        ) {
          await tx.shipper.update({
            where: { id: logisticsOrder.shipperId },
            data: { status: ShipperStatus.AVAILABLE },
          });
        }
      }
    });

    return this.findOneOrder(id);
  }

  async assignOrderToShipper(
    logisticsOrderId: string,
    dto: AssignLogisticsOrderDto,
    partnerId: string,
  ) {
    const [logisticsOrder, shipper] = await Promise.all([
      this.prisma.logisticsOrder.findUnique({
        where: { id: logisticsOrderId },
      }),
      this.prisma.shipper.findUnique({
        where: { id: dto.shipperId },
        include: {
          user: { select: { id: true, name: true, phone: true, email: true } },
        },
      }),
    ]);

    if (!logisticsOrder) {
      throw new NotFoundException('Logistics order not found');
    }

    if (logisticsOrder.logisticsPartnerId !== partnerId) {
      throw new ForbiddenException('You cannot assign shipper for another logistics partner');
    }

    if (!shipper) {
      throw new NotFoundException('Shipper not found');
    }

    if (shipper.logisticsPartnerId !== partnerId) {
      throw new BadRequestException('Shipper does not belong to this logistics partner');
    }

    if (shipper.status !== ShipperStatus.AVAILABLE) {
      throw new BadRequestException('Shipper is not available');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.logisticsOrder.update({
        where: { id: logisticsOrderId },
        data: {
          shipperId: dto.shipperId,
          status: LogisticsStatus.ASSIGNED,
        },
      });

      await tx.shipper.update({
        where: { id: dto.shipperId },
        data: { status: ShipperStatus.BUSY },
      });

      await tx.order.update({
        where: { id: logisticsOrder.orderId },
        data: { status: OrderStatus.SHIPPING },
      });
    });

    return this.findOneOrder(logisticsOrderId);
  }

  async calculateShipping(dto: CalculateShippingDto) {
    const baseRate = 30000;
    const provinceMultiplier = 1.2;
    const expressMultiplier = 1.5;

    let cost = baseRate;
    cost += dto.weight * 10000;

    if (dto.fromProvince !== dto.toProvince) {
      cost *= provinceMultiplier;
    }

    if (dto.express) {
      cost *= expressMultiplier;
    }

    return {
      cost: Math.round(cost),
      estimatedDays: dto.express ? 1 : 3,
    };
  }

  async findUnassignedOrders(partnerId: string) {
    return this.prisma.logisticsOrder.findMany({
      where: {
        logisticsPartnerId: partnerId,
        shipperId: null,
      },
      include: this.getLogisticsOrderInclude(),
      orderBy: { updatedAt: 'desc' },
    });
  }

  private getLogisticsOrderInclude(): Prisma.LogisticsOrderInclude {
    return {
      order: {
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, images: true },
              },
              variant: { select: { id: true, size: true, color: true } },
            },
          },
        },
      },
      logisticsPartner: {
        select: { id: true, name: true, baseRate: true, rating: true },
      },
      shipper: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    };
  }

  private mapOrderStatusFromLogisticsStatus(status: LogisticsStatus) {
    if (
      status === LogisticsStatus.ASSIGNED ||
      status === LogisticsStatus.PICKED_UP ||
      status === LogisticsStatus.IN_TRANSIT
    ) {
      return OrderStatus.SHIPPING;
    }

    if (status === LogisticsStatus.DELIVERED) {
      return OrderStatus.DELIVERED;
    }

    if (
      status === LogisticsStatus.RETURNED ||
      status === LogisticsStatus.CANCELLED
    ) {
      return OrderStatus.CANCELLED;
    }

    return null;
  }

  private resolveMerchantContext(
    orderItems: Array<{ sellerId?: string | null; enterpriseId?: string | null }>,
  ) {
    const sellerIds = new Set(orderItems.map((item) => item.sellerId).filter(Boolean));
    const enterpriseIds = new Set(
      orderItems.map((item) => item.enterpriseId).filter(Boolean),
    );

    return {
      sellerId: sellerIds.size === 1 ? Array.from(sellerIds)[0] : null,
      enterpriseId: enterpriseIds.size === 1 ? Array.from(enterpriseIds)[0] : null,
    };
  }

  private generateTrackingCode() {
    const prefix = 'TRK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}
