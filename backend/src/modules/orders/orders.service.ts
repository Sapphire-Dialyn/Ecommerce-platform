import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import {
  LogisticsStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  Role,
} from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const { items, voucherIds, paymentMethod, addressId, logisticsPartnerId } = dto;

    const [address, logisticsPartner] = await Promise.all([
      this.prisma.address.findFirst({
        where: { id: addressId, userId },
      }),
      this.prisma.logisticsPartner.findFirst({
        where: { id: logisticsPartnerId, verified: true },
      }),
    ]);

    if (!address) {
      throw new BadRequestException('Delivery address is invalid');
    }

    if (!logisticsPartner) {
      throw new BadRequestException('Logistics partner is invalid or not verified');
    }

    let subtotal = 0;
    const orderItemsData: Prisma.OrderItemCreateWithoutOrderInput[] = [];
    const variantIdsToUpdate: { id: string; quantity: number }[] = [];

    for (const item of items) {
      let price = 0;
      let realVariantId: string | null = null;
      let sellerId: string | null = null;
      let enterpriseId: string | null = null;

      if (item.variantId) {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (variant) {
          price = variant.price;
          realVariantId = variant.id;
          sellerId = variant.product.sellerId;
          enterpriseId = variant.product.enterpriseId;

          if (variant.stock < item.quantity) {
            throw new BadRequestException(
              `Product "${variant.product.name}" does not have enough stock`,
            );
          }

          variantIdsToUpdate.push({ id: variant.id, quantity: item.quantity });
        }
      }

      if (price === 0) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }

        sellerId = product.sellerId;
        enterpriseId = product.enterpriseId;

        if (product.variants?.length) {
          const firstVariant = product.variants[0];
          price = firstVariant.price;

          if (firstVariant.stock < item.quantity) {
            throw new BadRequestException(
              `Product "${product.name}" does not have enough stock`,
            );
          }

          variantIdsToUpdate.push({ id: firstVariant.id, quantity: item.quantity });
          realVariantId = firstVariant.id;
        }
      }

      subtotal += price * item.quantity;

      orderItemsData.push({
        product: { connect: { id: item.productId } },
        variant: realVariantId ? { connect: { id: realVariantId } } : undefined,
        quantity: item.quantity,
        price,
        sellerId,
        enterpriseId,
      });
    }

    const shippingFee = logisticsPartner.baseRate;
    const voucherIdsToConnect = (voucherIds || []).map((id) => ({ id }));
    const totalAmount = subtotal + shippingFee;
    const orderStatus =
      paymentMethod === PaymentMethod.COD ? OrderStatus.PROCESSING : OrderStatus.PENDING;

    const order = await this.prisma.$transaction(async (tx) => {
      for (const variantToUpdate of variantIdsToUpdate) {
        await tx.productVariant.update({
          where: { id: variantToUpdate.id },
          data: { stock: { decrement: variantToUpdate.quantity } },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          userId,
          status: orderStatus,
          addressId: address.id,
          recipientName: address.fullName,
          recipientPhone: address.phone,
          deliveryAddress: this.formatAddress(address),
          selectedLogisticsPartnerId: logisticsPartner.id,
          selectedLogisticsPartnerName: logisticsPartner.name,
          subtotal,
          shippingFee,
          totalDiscount: 0,
          totalAmount,
          shopDiscount: 0,
          platformDiscount: 0,
          freeshipDiscount: 0,
          appliedVouchers: { connect: voucherIdsToConnect },
          orderItems: { create: orderItemsData },
          payment: {
            create: {
              method: paymentMethod,
              amount: totalAmount,
              status:
                paymentMethod === PaymentMethod.COD
                  ? PaymentStatus.PENDING
                  : PaymentStatus.PENDING,
            },
          },
        },
        include: { payment: true },
      });

      if (paymentMethod === PaymentMethod.COD) {
        await this.createLogisticsOrderIfNeeded(tx, createdOrder.id);
      }

      return tx.order.findUnique({
        where: { id: createdOrder.id },
        include: this.getOrderInclude(),
      });
    });

    return this.mapOrderResponse(order);
  }

  async findMyOrders(userId: string, status?: OrderStatus) {
    const whereCondition: Prisma.OrderWhereInput = { userId };

    if (status && status !== ('ALL' as any)) {
      whereCondition.status = status;
    }

    const orders = await this.prisma.order.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      include: this.getOrderInclude(),
    });

    return orders.map((order) => this.mapOrderResponse(order));
  }

  async findAll(userId: string, role: string) {
    const whereCondition: Prisma.OrderWhereInput = {};

    if (role === Role.CUSTOMER) {
      whereCondition.userId = userId;
    }

    const orders = await this.prisma.order.findMany({
      where: whereCondition,
      include: this.getOrderInclude(true),
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.mapOrderResponse(order));
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: this.getOrderInclude(true),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return this.mapOrderResponse(order);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    _userId: string,
    _role: string,
  ) {
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async updatePaymentStatus(idOrRef: string, status: string, paymentMethod: string) {
    const normalizedStatus = (status || '').toUpperCase();
    const isPaymentSuccessful = normalizedStatus === 'PAID' || normalizedStatus === 'SUCCESS';

    let order = await this.prisma.order.findFirst({
      where: { id: idOrRef },
      include: { payment: true },
    });

    if (!order) {
      const payment = await this.prisma.payment.findFirst({
        where: { id: idOrRef },
        include: { order: { include: { payment: true } } },
      });

      if (payment?.order) {
        order = payment.order;
      }
    }

    if (!order) {
      throw new NotFoundException(
        `Unable to find order or payment with id ${idOrRef} to update payment status`,
      );
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      if (order?.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            status: isPaymentSuccessful ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
            method: paymentMethod as PaymentMethod,
          },
        });
      }

      const nextOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          status: isPaymentSuccessful ? OrderStatus.PROCESSING : order.status,
        },
      });

      if (isPaymentSuccessful) {
        await this.createLogisticsOrderIfNeeded(tx, order.id);
      }

      return tx.order.findUnique({
        where: { id: nextOrder.id },
        include: this.getOrderInclude(true),
      });
    });

    return this.mapOrderResponse(updatedOrder);
  }

  private getOrderInclude(includeUser = false): Prisma.OrderInclude {
    return {
      orderItems: {
        include: {
          product: includeUser
            ? true
            : { select: { id: true, name: true, images: true } },
          variant: { select: { id: true, size: true, color: true } },
        },
      },
      payment: true,
      appliedVouchers: true,
      user: includeUser
        ? { select: { id: true, name: true, email: true, phone: true } }
        : false,
      logisticsOrder: {
        include: {
          logisticsPartner: {
            select: { id: true, name: true, baseRate: true, rating: true },
          },
          shipper: {
            include: {
              user: { select: { id: true, name: true, phone: true, email: true } },
            },
          },
        },
      },
    };
  }

  private async createLogisticsOrderIfNeeded(
    tx: Prisma.TransactionClient,
    orderId: string,
  ) {
    const existingLogisticsOrder = await tx.logisticsOrder.findUnique({
      where: { orderId },
    });

    if (existingLogisticsOrder) {
      return existingLogisticsOrder;
    }

    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found while creating logistics order');
    }

    if (!order.selectedLogisticsPartnerId || !order.deliveryAddress) {
      throw new BadRequestException(
        'Order is missing selected logistics partner or delivery address',
      );
    }

    const merchantContext = this.resolveMerchantContext(order.orderItems);

    try {
      return await tx.logisticsOrder.create({
        data: {
          orderId: order.id,
          logisticsPartnerId: order.selectedLogisticsPartnerId,
          trackingCode: this.generateTrackingCode(),
          status: LogisticsStatus.CREATED,
          deliveryAddress: order.deliveryAddress,
          pickupAddress: null,
          notes: null,
          sellerId: merchantContext.sellerId,
          enterpriseId: merchantContext.enterpriseId,
          proofOfDelivery: [],
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return tx.logisticsOrder.findUnique({
          where: { orderId },
        });
      }

      throw error;
    }
  }

  private resolveMerchantContext(orderItems: Array<{ sellerId?: string | null; enterpriseId?: string | null }>) {
    const sellerIds = new Set(orderItems.map((item) => item.sellerId).filter(Boolean));
    const enterpriseIds = new Set(
      orderItems.map((item) => item.enterpriseId).filter(Boolean),
    );

    return {
      sellerId: sellerIds.size === 1 ? Array.from(sellerIds)[0] : null,
      enterpriseId: enterpriseIds.size === 1 ? Array.from(enterpriseIds)[0] : null,
    };
  }

  private formatAddress(address: {
    street: string;
    ward: string;
    district: string;
    province: string;
  }) {
    return [address.street, address.ward, address.district, address.province]
      .filter(Boolean)
      .join(', ');
  }

  private generateTrackingCode() {
    const prefix = 'TRK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  private mapOrderResponse<T extends Record<string, any> | null>(order: T) {
    if (!order) {
      return order;
    }

    return {
      ...order,
      selectedLogisticsPartner: order.selectedLogisticsPartnerId
        ? {
            id: order.selectedLogisticsPartnerId,
            name: order.selectedLogisticsPartnerName,
          }
        : null,
    };
  }
}
