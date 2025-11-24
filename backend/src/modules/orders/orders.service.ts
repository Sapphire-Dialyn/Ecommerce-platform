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
  // CREATE ORDER (TRANSACTION)
  // ==================================================================
  async create(userId: string, dto: CreateOrderDto) {
    const { items, voucherIds, shippingFee, paymentMethod, addressId } = dto;

    // 1. Chuẩn bị dữ liệu
    let subtotal = 0;
    const orderItemsData: any[] = [];
    const variantIdsToUpdate: { id: string; quantity: number, productName: string }[] = [];

    // Validate từng item
    for (const item of items) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true },
      });

      if (!variant) {
        throw new NotFoundException(`Product Variant ${item.variantId} not found`);
      }
      
      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Sản phẩm "${variant.product.name}" không đủ tồn kho (Còn: ${variant.stock})`);
      }

      // Tính toán giá
      const itemTotal = variant.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: variant.price, // Giá lấy từ DB
        sellerId: variant.product.sellerId,
        enterpriseId: variant.product.enterpriseId,
      });

      // Lưu lại để trừ kho sau này
      variantIdsToUpdate.push({ 
        id: item.variantId, 
        quantity: item.quantity,
        productName: variant.product.name
      });
    }

    // 2. Tính toán Voucher (Logic đơn giản, chưa tính tiền giảm cụ thể)
    const voucherIdsToConnect = (voucherIds || []).map((id) => ({ id }));
    const totalDiscount = 0; // Tạm thời để 0

    // 3. Tổng tiền cuối cùng
    const totalAmount = subtotal + shippingFee - totalDiscount;

    // 4. THỰC HIỆN TRANSACTION
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        
        // 4a. Kiểm tra lại kho lần cuối (Double check trong transaction)
        for (const item of variantIdsToUpdate) {
            const currentVariant = await tx.productVariant.findUnique({ where: { id: item.id } });
            if (!currentVariant || currentVariant.stock < item.quantity) {
                throw new BadRequestException(`Hết hàng: ${item.productName} vừa bị mua hết!`);
            }
            
            // 4b. Trừ kho
            await tx.productVariant.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // 4c. Tạo Order
        const newOrder = await tx.order.create({
          data: {
            userId,
            status: OrderStatus.PENDING,
            subtotal,
            shippingFee,
            totalDiscount,
            totalAmount,
            shopDiscount: 0,
            platformDiscount: 0,
            freeshipDiscount: 0,
            
            appliedVouchers: {
              connect: voucherIdsToConnect,
            },

            orderItems: {
              create: orderItemsData,
            },

            payment: {
                create: {
                    method: paymentMethod,
                    amount: totalAmount,
                    status: PaymentStatus.PENDING 
                }
            }
          },
          include: {
            orderItems: true,
            payment: true,
          },
        });

        return newOrder;
      });

      return result;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         // Bắt lỗi Prisma cụ thể nếu cần
      }
      throw error;
    }
  }

  // ==================================================================
  // FIND MY ORDERS (Dành riêng cho User xem lịch sử mua hàng)
  // ==================================================================
  async findMyOrders(userId: string, status?: OrderStatus) {
    const whereCondition: Prisma.OrderWhereInput = {
        userId: userId, // Bắt buộc là user hiện tại
    };

    // Nếu frontend gửi status khác ALL thì lọc
    if (status && status !== ('ALL' as any)) {
        whereCondition.status = status;
    }

    return this.prisma.order.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        include: {
            orderItems: {
                include: {
                    product: {
                        select: { id: true, name: true, images: true } // Lấy ảnh để hiển thị
                    },
                    variant: {
                        select: { id: true, size: true, color: true } // Lấy thuộc tính
                    }
                }
            },
            payment: true,
        }
    });
  }

  // ==================================================================
  // FIND ALL (Dành cho Admin hoặc debug)
  // ==================================================================
  async findAll(userId: string, role: string) {
    const whereCondition: any = {};

    if (role === Role.CUSTOMER) {
        whereCondition.userId = userId;
    }
    
    return this.prisma.order.findMany({
      where: whereCondition,
      include: {
        orderItems: {
            include: {
                product: true, 
                variant: true  
            }
        },
        payment: true,
        appliedVouchers: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // ==================================================================
  // FIND ONE
  // ==================================================================
  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
            include: {
                product: true,
                variant: true
            }
        },
        payment: true,
        appliedVouchers: true,
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    // Check quyền: Chỉ Admin hoặc Chủ đơn hàng mới được xem
    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  // ==================================================================
  // UPDATE STATUS
  // ==================================================================
  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    userId: string,
    role: string,
  ) {
    if (role !== Role.SELLER && role !== Role.ENTERPRISE) {
        // throw new ForbiddenException('Only Seller or Enterprise can update order status directly');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}