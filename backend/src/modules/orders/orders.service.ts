import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { OrderStatus, PaymentStatus, Prisma, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ==================================================================
  // 1. CREATE ORDER
  // ==================================================================
  async create(userId: string, dto: CreateOrderDto) {
    const { items, voucherIds, shippingFee, paymentMethod, addressId } = dto;

    let subtotal = 0;
    const orderItemsData: any[] = [];
    const variantIdsToUpdate: { id: string; quantity: number, productName: string }[] = [];

    for (const item of items) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) throw new NotFoundException(`Product Variant ${item.variantId} not found`);
      if (variant.stock < item.quantity) throw new BadRequestException(`Sản phẩm "${variant.product.name}" không đủ tồn kho`);

      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price,
        sellerId: variant.product.sellerId,
        enterpriseId: variant.product.enterpriseId,
      });

      variantIdsToUpdate.push({ 
        id: item.variantId, 
        quantity: item.quantity,
        productName: variant.product.name
      });
    }

    const voucherIdsToConnect = (voucherIds || []).map((id) => ({ id }));
    const totalAmount = subtotal + shippingFee; // (Logic giảm giá tạm bỏ qua để code gọn)

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Trừ kho
        for (const item of variantIdsToUpdate) {
            const currentVariant = await tx.productVariant.findUnique({ where: { id: item.id } });
            if (!currentVariant || currentVariant.stock < item.quantity) {
                throw new BadRequestException(`Hết hàng: ${item.productName} vừa bị mua hết!`);
            }
            await tx.productVariant.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // Tạo Order
        return await tx.order.create({
          data: {
            userId,
            status: OrderStatus.PENDING,
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
                    status: PaymentStatus.PENDING 
                }
            }
          },
          include: { orderItems: true, payment: true },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // ==================================================================
  // 2. FIND MY ORDERS (Khách hàng xem đơn mình)
  // ==================================================================
  async findMyOrders(userId: string, status?: OrderStatus) {
    const whereCondition: Prisma.OrderWhereInput = { userId };
    if (status && status !== ('ALL' as any)) whereCondition.status = status;

    return this.prisma.order.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        include: {
            orderItems: {
                include: {
                    product: { select: { id: true, name: true, images: true } },
                    variant: { select: { id: true, size: true, color: true } }
                }
            },
            payment: true,
        }
    });
  }

  // ==================================================================
  // 3. FIND ALL (Admin xem tất cả) -> ĐÃ SỬA Ở ĐÂY
  // ==================================================================
  async findAll(userId: string, role: string) {
    const whereCondition: any = {};

    // Nếu role là Customer thì chỉ xem của mình (phòng hờ)
    if (role === Role.CUSTOMER) {
        whereCondition.userId = userId;
    }
    
    return this.prisma.order.findMany({
      where: whereCondition,
      include: {
        // 🔥 QUAN TRỌNG: Thêm dòng này để lấy tên khách hàng 🔥
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true
            }
        },
        // -----------------------------------------------------
        orderItems: {
            include: { product: true, variant: true }
        },
        payment: true,
        appliedVouchers: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==================================================================
  // 4. FIND ONE
  // ==================================================================
  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true, variant: true } },
        payment: true,
        appliedVouchers: true,
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  // ==================================================================
  // 5. UPDATE STATUS
  // ==================================================================
  async updateStatus(id: string, dto: UpdateOrderStatusDto, userId: string, role: string) {
    // Logic check quyền cập nhật (Admin, Seller...)
    // if (role !== Role.ADMIN) throw new ForbiddenException(...)

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}