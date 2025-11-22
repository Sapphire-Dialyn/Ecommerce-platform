// src/analytics/analytics.controller.ts
import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// Giả lập Guards (bạn cần import từ module auth của mình)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { Role } from '@prisma/client';

// Định nghĩa kiểu trả về của filter
type AccessFilter = {
  sellerId?: string;
  enterpriseId?: string;
};

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Helper quan trọng: Xác định quyền truy cập dữ liệu
   * - Admin: Có thể xem tất cả ({} rỗng) hoặc lọc theo query.
   * - Seller/Enterprise: Bị ép xem data của chính mình.
   */
  private getAccessFilter(req: any, query: AnalyticsQueryDto): AccessFilter {
    const user = req.user; // Lấy từ JwtAuthGuard (giả sử có payload)

    if (user.role === Role.SELLER) {
      if (!user.sellerId) throw new ForbiddenException('User not linked to Seller');
      return { sellerId: user.sellerId };
    }

    if (user.role === Role.ENTERPRISE) {
      if (!user.enterpriseId) throw new ForbiddenException('User not linked to Enterprise');
      return { enterpriseId: user.enterpriseId };
    }

    if (user.role === Role.ADMIN) {
      // Admin có thể lọc
      if (query.sellerId) return { sellerId: query.sellerId };
      if (query.enterpriseId) return { enterpriseId: query.enterpriseId };
      return {}; // Admin xem toàn sàn
    }

    // Các vai trò khác (CUSTOMER, SHIPPER...) bị cấm
    throw new ForbiddenException('Access denied');
  }

  @Get('overview')
  @Public()
  @ApiOperation({ summary: 'Lấy chỉ số tổng quan (Doanh thu, Đơn hàng)' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getOverview(@Req() req, @Query() query: AnalyticsQueryDto) {
    const filter = this.getAccessFilter(req, query);
    return this.analyticsService.getOverviewStats(query, filter);
  }

  @Get('sales-over-time')
  @Public()
  @ApiOperation({ summary: 'Lấy doanh thu theo thời gian' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getSalesRevenueOverTime(
    @Req() req,
    @Query() query: AnalyticsQueryDto,
  ) {
    const filter = this.getAccessFilter(req, query);
    return this.analyticsService.getSalesRevenueOverTime(query, filter);
  }

  @Get('top-selling-products')
  @Public()
  @ApiOperation({ summary: 'Lấy top sản phẩm bán chạy' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getTopSellingProducts(
    @Req() req,
    @Query() query: AnalyticsQueryDto,
  ) {
    const filter = this.getAccessFilter(req, query);
    return this.analyticsService.getTopSellingProducts(query, filter);
  }

  @Get('order-status-breakdown')
  @Public()
  @ApiOperation({ summary: 'Phân tích trạng thái đơn hàng' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getOrderStatusBreakdown(
    @Req() req,
    @Query() query: AnalyticsQueryDto,
  ) {
    const filter = this.getAccessFilter(req, query);
    return this.analyticsService.getOrderStatusBreakdown(query, filter);
  }

  @Get('user-behavior-funnel')
  @Public()
  @ApiOperation({ summary: 'Phân tích phễu hành vi (Admin)' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getUserBehaviorFunnel(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getUserBehaviorFunnel(query);
  }
}