import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { OptionalAuth } from '../auth/decorators/optional-auth.decorator';
import { Role } from '@prisma/client';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Lấy giỏ hàng (hỗ trợ cả GUEST và CUSTOMER)
   */
  @Get()
  @ApiOperation({ summary: 'Get cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiHeader({
    name: 'X-Session-ID',
    description: 'Session ID for guest users',
    required: false,
  })
  async getCart(
    @OptionalAuth() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const userId = user?.id;
    const userRole = user?.role || 'GUEST';
    return this.cartService.getCartSummary(userId, sessionId, userRole);
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  @ApiHeader({
    name: 'X-Session-ID',
    description: 'Session ID for guest users',
    required: false,
  })
  async addToCart(
    @Body() { variantId, quantity }: { variantId: string; quantity: number },
    @OptionalAuth() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const userId = user?.id;
    const userRole = user?.role || 'GUEST';

    // Tạo sessionId nếu guest chưa có
    if (!userId && !sessionId) {
      sessionId = this.cartService.generateSessionId();
    }

    return this.cartService.addToCart(variantId, quantity, userId, sessionId, userRole);
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   */
  @Put('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated' })
  @ApiHeader({
    name: 'X-Session-ID',
    description: 'Session ID for guest users',
    required: false,
  })
  async updateCartItem(
    @Param('id') id: string,
    @Body() { quantity }: { quantity: number },
    @OptionalAuth() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const userId = user?.id;
    return this.cartService.updateCartItem(id, quantity, userId, sessionId);
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart' })
  @ApiHeader({
    name: 'X-Session-ID',
    description: 'Session ID for guest users',
    required: false,
  })
  async removeFromCart(
    @Param('id') id: string,
    @OptionalAuth() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const userId = user?.id;
    return this.cartService.removeFromCart(id, userId, sessionId);
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared' })
  @ApiHeader({
    name: 'X-Session-ID',
    description: 'Session ID for guest users',
    required: false,
  })
  async clearCart(
    @OptionalAuth() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const userId = user?.id;
    return this.cartService.clearCart(userId, sessionId);
  }

  /**
   * Tạo session ID cho guest (optional, client cũng có thể generate)
   */
  @Get('session-id')
  @ApiOperation({ summary: 'Generate session ID for guest' })
  @ApiResponse({ status: 200, description: 'Session ID generated' })
  generateSessionId() {
    return { sessionId: this.cartService.generateSessionId() };
  }
}
