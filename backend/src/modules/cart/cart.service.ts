import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { PriceService } from '@modules/products/services/price.service';
import { Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private priceService: PriceService,
  ) {}

  /**
   * Lấy hoặc tạo giỏ hàng
   */
  async getOrCreateCart(userId?: string, sessionId?: string) {
    let cart;

    if (userId) {
      cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { userId },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });
      }
    } else if (sessionId) {
      cart = await this.prisma.cart.findUnique({
        where: {
          userId_sessionId: {
            userId: null,
            sessionId,
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { sessionId },
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        });
      }
    } else {
      throw new BadRequestException('userId or sessionId must be provided');
    }

    return cart;
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  async addToCart(
    variantId: string,
    quantity: number,
    userId?: string,
    sessionId?: string,
    userRole?: Role | string,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Lấy variant và check stock
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
      },
    });

    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (variant.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Lấy hoặc tạo giỏ hàng
    const cart = await this.getOrCreateCart(userId, sessionId);

    // Tính giá với discount nếu là CUSTOMER
    const selectedPrice = this.priceService.calculatePrice(
      variant.price,
      userRole,
    );

    // Thêm hoặc update item trong giỏ
    const cartItem = await this.prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
        selectedPrice,
        updatedAt: new Date(),
      },
      create: {
        cartId: cart.id,
        variantId,
        quantity,
        selectedPrice,
      },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    return cartItem;
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   */
  async updateCartItem(
    cartItemId: string,
    quantity: number,
    userId?: string,
    sessionId?: string,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        variant: true,
        cart: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new BadRequestException('Unauthorized');
    }

    // Check stock
    if (cartItem.variant.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity, updatedAt: new Date() },
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  async removeFromCart(
    cartItemId: string,
    userId?: string,
    sessionId?: string,
  ) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify ownership
    if (userId && cartItem.cart.userId !== userId) {
      throw new BadRequestException('Unauthorized');
    }
    if (sessionId && cartItem.cart.sessionId !== sessionId) {
      throw new BadRequestException('Unauthorized');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  /**
   * Tính tổng giỏ hàng
   */
  async getCartSummary(userId?: string, sessionId?: string, userRole?: Role | string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const items = cart.items;
    const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      cartId: cart.id,
      items: items.map(item => ({
        id: item.id,
        variant: item.variant,
        quantity: item.quantity,
        price: item.selectedPrice,
        total: item.selectedPrice * item.quantity,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      totalItems,
      discount: (userRole === Role.CUSTOMER || userRole === 'CUSTOMER') ? Math.round(subtotal * 0.02 / 0.98 * 100) / 100 : 0,
    };
  }

  /**
   * Tạo session ID cho guest
   */
  generateSessionId(): string {
    return uuidv4();
  }
}
