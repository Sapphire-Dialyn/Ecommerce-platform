import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  LogisticsStatus,
  OrderStatus,
  Prisma,
  Role,
  ShipperStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {
  CreateShipperDto,
  UpdateAssignedOrderStatusDto,
  UpdateLocationDto,
  UpdateShipperDto,
} from './shipper.dto';

@Injectable()
export class ShipperService {
  constructor(private prisma: PrismaService) {}

  async create(logisticsPartnerId: string, createShipperDto: CreateShipperDto) {
    const { email, password, name, phone, avatar, deliveryRange } = createShipperDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists in User table');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
          avatar,
          role: Role.SHIPPER,
        },
      });

      const shipper = await tx.shipper.create({
        data: {
          userId: user.id,
          logisticsPartnerId,
          status: ShipperStatus.AVAILABLE,
          deliveryRange: deliveryRange || 5.0,
          deliveryHistory: [],
        },
      });

      return { ...shipper, user };
    });
  }

  async update(id: string, updateShipperDto: UpdateShipperDto) {
    await this.findOne(id);

    return this.prisma.shipper.update({
      where: { id },
      data: updateShipperDto,
    });
  }

  async updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
    await this.findOne(id);

    return this.prisma.shipper.update({
      where: { id },
      data: {
        currentLocation: { ...updateLocationDto },
      },
    });
  }

  async findAll(logisticsPartnerId: string) {
    return this.prisma.shipper.findMany({
      where: { logisticsPartnerId },
      include: this.getShipperInclude(),
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    const shipper = await this.prisma.shipper.findUnique({
      where: { id },
      include: this.getShipperInclude(),
    });

    if (!shipper) {
      throw new NotFoundException(`Shipper with id ${id} not found`);
    }

    return shipper;
  }

  async findMe(userId: string) {
    const shipper = await this.prisma.shipper.findFirst({
      where: { userId },
      include: this.getShipperInclude(),
    });

    if (!shipper) {
      throw new NotFoundException('Shipper profile not found');
    }

    return shipper;
  }

  async findMyOrders(userId: string) {
    const shipper = await this.findMe(userId);

    return this.prisma.logisticsOrder.findMany({
      where: { shipperId: shipper.id },
      include: this.getAssignedOrderInclude(),
      orderBy: [{ updatedAt: 'desc' }, { pickupTime: 'desc' }],
    });
  }

  async findByEmail(email: string) {
    return this.prisma.shipper.findFirst({
      where: {
        user: {
          email,
        },
      },
      include: this.getShipperInclude(),
    });
  }

  async assignOrder(orderId: string, shipperId: string) {
    const [logisticsOrder, shipper] = await Promise.all([
      this.prisma.logisticsOrder.findUnique({ where: { id: orderId } }),
      this.findOne(shipperId),
    ]);

    if (!logisticsOrder) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (shipper.status !== ShipperStatus.AVAILABLE) {
      throw new ConflictException('Shipper is not available');
    }

    const updatedOrder = await this.prisma.logisticsOrder.update({
      where: { id: orderId },
      data: {
        shipperId,
        status: LogisticsStatus.ASSIGNED,
      },
    });

    await this.prisma.shipper.update({
      where: { id: shipperId },
      data: { status: ShipperStatus.BUSY },
    });

    await this.prisma.order.update({
      where: { id: logisticsOrder.orderId },
      data: { status: OrderStatus.SHIPPING },
    });

    return updatedOrder;
  }

  async updateAssignedOrderStatus(
    logisticsOrderId: string,
    userId: string,
    dto: UpdateAssignedOrderStatusDto,
  ) {
    const shipper = await this.findMe(userId);
    const logisticsOrder = await this.prisma.logisticsOrder.findUnique({
      where: { id: logisticsOrderId },
      include: { order: true },
    });

    if (!logisticsOrder) {
      throw new NotFoundException('Assigned logistics order not found');
    }

    if (logisticsOrder.shipperId !== shipper.id) {
      throw new ForbiddenException('You can only update orders assigned to you');
    }

    if (
      dto.status !== LogisticsStatus.PICKED_UP &&
      dto.status !== LogisticsStatus.IN_TRANSIT &&
      dto.status !== LogisticsStatus.DELIVERED
    ) {
      throw new BadRequestException('Invalid shipper status transition');
    }

    const updateData: Prisma.LogisticsOrderUpdateInput = {
      status: dto.status,
    };

    if (dto.status === LogisticsStatus.PICKED_UP && !logisticsOrder.pickupTime) {
      updateData.pickupTime = new Date();
    }

    if (dto.status === LogisticsStatus.DELIVERED) {
      updateData.deliveredTime = new Date();
    }

    const [updatedOrder] = await this.prisma.$transaction([
      this.prisma.logisticsOrder.update({
        where: { id: logisticsOrderId },
        data: updateData,
      }),
      this.prisma.order.update({
        where: { id: logisticsOrder.orderId },
        data: {
          status:
            dto.status === LogisticsStatus.DELIVERED
              ? OrderStatus.DELIVERED
              : OrderStatus.SHIPPING,
        },
      }),
      ...(dto.status === LogisticsStatus.DELIVERED
        ? [
            this.prisma.shipper.update({
              where: { id: shipper.id },
              data: { status: ShipperStatus.AVAILABLE },
            }),
          ]
        : []),
    ]);

    return this.prisma.logisticsOrder.findUnique({
      where: { id: updatedOrder.id },
      include: this.getAssignedOrderInclude(),
    });
  }

  async completeDelivery(orderId: string, userId?: string) {
    if (userId) {
      return this.updateAssignedOrderStatus(orderId, userId, {
        status: LogisticsStatus.DELIVERED,
      });
    }

    const order = await this.prisma.logisticsOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (!order.shipperId) {
      throw new BadRequestException('Order has no shipper assigned');
    }

    const [updatedOrder] = await this.prisma.$transaction([
      this.prisma.logisticsOrder.update({
        where: { id: orderId },
        data: {
          status: LogisticsStatus.DELIVERED,
          deliveredTime: new Date(),
        },
      }),
      this.prisma.shipper.update({
        where: { id: order.shipperId },
        data: { status: ShipperStatus.AVAILABLE },
      }),
      this.prisma.order.update({
        where: { id: order.orderId },
        data: { status: OrderStatus.DELIVERED },
      }),
    ]);

    return updatedOrder;
  }

  private getShipperInclude(): Prisma.ShipperInclude {
    return {
      user: true,
      assignedOrders: {
        include: this.getAssignedOrderInclude(),
      },
    };
  }

  private getAssignedOrderInclude(): Prisma.LogisticsOrderInclude {
    return {
      logisticsPartner: {
        select: { id: true, name: true, baseRate: true, rating: true },
      },
      shipper: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
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
              variant: {
                select: { id: true, size: true, color: true },
              },
            },
          },
        },
      },
    };
  }
}
