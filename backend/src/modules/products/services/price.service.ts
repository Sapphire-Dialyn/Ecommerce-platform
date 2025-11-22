import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class PriceService {
  /**
   * Tính giá cuối cùng dựa trên role
   * - GUEST: giá gốc
   * - CUSTOMER: giá gốc - 2%
   * - Roles khác: giá gốc
   */
  calculatePrice(basePrice: number, userRole?: Role | string): number {
    if (userRole === Role.CUSTOMER || userRole === 'CUSTOMER') {
      return basePrice * 0.98; // Giảm 2%
    }
    return basePrice;
  }

  /**
   * Tính tổng giá cho nhiều sản phẩm
   */
  calculateTotal(items: Array<{ basePrice: number; quantity: number }>, userRole?: Role | string): number {
    const total = items.reduce((sum, item) => {
      const price = this.calculatePrice(item.basePrice, userRole);
      return sum + price * item.quantity;
    }, 0);

    return Math.round(total * 100) / 100; // Làm tròn 2 chữ số thập phân
  }

  /**
   * Lấy discount amount
   */
  getDiscountAmount(basePrice: number, userRole?: Role | string): number {
    if (userRole === Role.CUSTOMER || userRole === 'CUSTOMER') {
      return basePrice * 0.02;
    }
    return 0;
  }
}
