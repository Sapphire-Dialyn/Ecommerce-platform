import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { OrderStatus, PaymentStatus, Prisma, Role,PaymentMethod } from '@prisma/client';


@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ==================================================================
  // 1. CREATE ORDER (ĐÃ SỬA ĐỂ CHỐNG LỖI VARIANT NOT FOUND)
  // ==================================================================
  async create(userId: string, dto: CreateOrderDto) {
    const { items, voucherIds, shippingFee, paymentMethod, addressId } = dto;

    let subtotal = 0;
    const orderItemsData: any[] = [];
    const variantIdsToUpdate: { id: string; quantity: number }[] = [];

    // Duyệt qua từng sản phẩm trong giỏ
    for (const item of items) {
      let price = 0;
      let realVariantId = null;
      let sellerId = null;
      let enterpriseId = null;

      // Bước 1: Cố gắng tìm Variant nếu có ID gửi lên
      if (item.variantId) {
        // Dùng try-catch hoặc findUnique bình thường để tránh crash nếu ID không đúng format
        try {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: true }
            });
            
            if (variant) {
                price = variant.price;
                realVariantId = variant.id;
                sellerId = variant.product.sellerId;
                enterpriseId = variant.product.enterpriseId;

                // Check kho
                if (variant.stock < item.quantity) {
                    throw new BadRequestException(`Sản phẩm "${variant.product.name}" không đủ tồn kho`);
                }
                
                // Thêm vào danh sách cần trừ kho
                variantIdsToUpdate.push({ id: variant.id, quantity: item.quantity });
            }
        } catch (e) {
            // Nếu lỗi (do ID sai format...) thì bỏ qua, xuống Bước 2
            console.warn(`Invalid Variant ID: ${item.variantId}, falling back to Product...`);
        }
      }

      // Bước 2: Nếu không tìm thấy Variant (hoặc variantId là null/"200ml"), tìm Product gốc
      if (price === 0) {
         const product = await this.prisma.product.findUnique({
             where: { id: item.productId },
             include: { variants: true } // Lấy variants để check giá
         });

         if (!product) {
             throw new NotFoundException(`Product ${item.productId} not found`);
         }
         
         sellerId = product.sellerId;
         enterpriseId = product.enterpriseId;

         // Lấy giá từ variant đầu tiên làm giá mặc định (Fallback)
         if (product.variants && product.variants.length > 0) {
             price = product.variants[0].price;
         } else {
             // Trường hợp hiếm: Sản phẩm không có biến thể nào
             price = 0; 
         }
      }

      // Cộng dồn tổng tiền
      subtotal += price * item.quantity;

      // Thêm vào dữ liệu tạo đơn
      orderItemsData.push({
        productId: item.productId,
        variantId: realVariantId, // ID chuẩn hoặc null
        quantity: item.quantity,
        price: price,
        sellerId: sellerId,
        enterpriseId: enterpriseId,
      });
    }

    // Tính toán Voucher & Tổng tiền
    const voucherIdsToConnect = (voucherIds || []).map((id) => ({ id }));
    const totalAmount = subtotal + shippingFee; // (Tạm thời chưa trừ discount)

    // Thực hiện Transaction
    try {
      return await this.prisma.$transaction(async (tx) => {
        
        // 1. Trừ kho (chỉ những variant tìm thấy hợp lệ)
        for (const v of variantIdsToUpdate) {
            await tx.productVariant.update({
                where: { id: v.id },
                data: { stock: { decrement: v.quantity } }
            });
        }

        // 2. Tạo Order
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
          include: {
            orderItems: true,
            payment: true,
          },
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // ==================================================================
  // 2. FIND MY ORDERS (User)
  // ==================================================================
  async findMyOrders(userId: string, status?: OrderStatus) {
    const whereCondition: Prisma.OrderWhereInput = { userId };
    if (status && status !== ('ALL' as any)) {
        whereCondition.status = status;
    }

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
  // 3. FIND ALL (Admin Dashboard)
  // ==================================================================
  async findAll(userId: string, role: string) {
    const whereCondition: any = {};

    // Nếu role là Customer thì chỉ xem của mình (Logic phụ trợ)
    if (role === Role.CUSTOMER) {
        whereCondition.userId = userId;
    }
    
    return this.prisma.order.findMany({
      where: whereCondition,
      include: {
        // 🔥 Lấy thông tin User để hiển thị tên Khách hàng
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true
            }
        },
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
  // 4. FIND ONE
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

    if (role !== Role.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  // ==================================================================
  // 5. UPDATE STATUS
  // ==================================================================
  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    userId: string,
    role: string,
  ) {
    // Có thể thêm logic check quyền ở đây nếu cần
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async updatePaymentStatus(idOrRef: string, status: string, paymentMethod: string) {
    console.log(`[UpdatePayment] Đang tìm đơn hàng với ID/Ref: ${idOrRef}`);

    // BƯỚC 1: Thử tìm trực tiếp theo Order ID
    let order = await this.prisma.order.findFirst({
      where: { id: idOrRef },
      include: { payment: true },
    });

    // BƯỚC 2: Nếu không thấy, thử tìm xem đó có phải là Payment ID không?
    // (Rất nhiều trường hợp nhầm lẫn lấy Payment ID làm mã giao dịch VNPay)
    if (!order) {
      console.log(`[UpdatePayment] Không tìm thấy Order ID, đang thử tìm theo Payment ID...`);
      const payment = await this.prisma.payment.findFirst({
        where: { id: idOrRef },
        include: { order: true } // Load ngược lại Order
      });

      if (payment && payment.order) {
        console.log(`[UpdatePayment] -> Đã tìm thấy Order thông qua Payment ID: ${payment.order.id}`);
        // Gán lại order tìm được và load kèm payment để xử lý ở dưới
        order = await this.prisma.order.findUnique({
           where: { id: payment.order.id },
           include: { payment: true }
        });
      }
    }

    // Nếu vẫn không thấy thì chịu thua -> Báo lỗi
    if (!order) {
      console.error(`[UpdatePayment] Thất bại! Không tồn tại Order hay Payment nào với ID: ${idOrRef}`);
      throw new NotFoundException(`Không tìm thấy đơn hàng để cập nhật thanh toán (ID: ${idOrRef})`);
    }

    // BƯỚC 3: Cập nhật bảng Payment
    if (order.payment) {
      await this.prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: PaymentStatus.SUCCESS,
          method: paymentMethod as PaymentMethod, 
        },
      });
    }

    // BƯỚC 4: Cập nhật trạng thái đơn hàng -> PROCESSING
    return this.prisma.order.update({
      where: { id: order.id }, // Dùng ID chuẩn của order vừa tìm được
      data: {
        status: OrderStatus.PROCESSING,
      },
      include: { payment: true },
    });
  }
}