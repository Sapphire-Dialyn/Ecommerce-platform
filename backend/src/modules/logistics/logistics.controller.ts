import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';
import {
  CreateLogisticsPartnerDto,
  UpdateLogisticsPartnerDto,
  CreateLogisticsOrderDto,
  UpdateLogisticsOrderDto,
  CalculateShippingDto,
  AssignLogisticsOrderDto
} from './dto/logistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('logistics')
@Controller('logistics')
@ApiBearerAuth()
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  // ==========================================
  // 1. DÀNH CHO NGƯỜI MUA (CUSTOMER) & PUBLIC
  // ==========================================
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách các đơn vị vận chuyển (Khách hàng chọn)' })
  @Get('partners')
  findAllPartners() {
    return this.logisticsService.findAllPartners();
  }

  @Public()
  @ApiOperation({ summary: 'Tính phí vận chuyển dự kiến' })
  @Post('calculate')
  calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.logisticsService.calculateShipping(calculateShippingDto);
  }

  // ==========================================
  // 2. DÀNH CHO ĐƠN VỊ VẬN CHUYỂN (LOGISTICS)
  // ==========================================
  @ApiOperation({ summary: 'Tạo profile đơn vị vận chuyển' })
  @Post('partners/profile')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createPartner(@Request() req, @Body() dto: CreateLogisticsPartnerDto) {
    return this.logisticsService.createPartner(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Lấy danh sách TẤT CẢ vận đơn của đối tác hiện tại' })
  @Get('orders/me')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllMyOrders(@Request() req) {
    // 👈 Thay thế Decorator lỗi: Lấy ID Partner từ ID User đang đăng nhập
    const partner = await this.logisticsService.getPartnerByUserId(req.user.id);
    return this.logisticsService.findAllOrders(partner.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách vận đơn CHƯA ĐƯỢC GÁN cho shipper' })
  @Get('orders/me/unassigned')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findUnassignedOrders(@Request() req) {
    // 👈 Thay thế Decorator lỗi
    const partner = await this.logisticsService.getPartnerByUserId(req.user.id);
    return this.logisticsService.findUnassignedOrders(partner.id);
  }

  @ApiOperation({ summary: 'Chỉ định Shipper cho đơn hàng (Gán đơn)' })
  @Post('orders/:orderId/assign')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async assignOrderToShipper(
    @Param('orderId') orderId: string, 
    @Body() dto: AssignLogisticsOrderDto, 
    @Request() req
  ) {
    const partner = await this.logisticsService.getPartnerByUserId(req.user.id);
    return this.logisticsService.assignOrderToShipper(orderId, dto, partner.id);
  }

  @ApiOperation({ summary: 'Cập nhật trạng thái vận đơn' })
  @Patch('orders/:id')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLogisticsOrderDto,
    @Request() req,
  ) {
    // Nếu là Admin thì không cần verify partner ID
    if (req.user.role === Role.ADMIN) {
      return this.logisticsService.updateOrderStatus(id, dto);
    }
    // Nếu là Logistics, lấy partner ID để kiểm tra quyền
    const partner = await this.logisticsService.getPartnerByUserId(req.user.id);
    return this.logisticsService.updateOrderStatus(id, dto, partner.id);
  }

  // ==========================================
  // 3. DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
  // ==========================================
  
  // ❗️ LƯU Ý: Các Route chứa :id phải được đặt ở CUỐI CÙNG
  // Nếu đặt trước 'orders/me', NestJS sẽ tưởng 'me' là một tham số ID.
  
  @ApiOperation({ summary: 'Lấy chi tiết vận đơn' })
  @Get('orders/:id')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOneOrder(@Param('id') id: string) {
    return this.logisticsService.findOneOrder(id);
  }

  @ApiOperation({ summary: 'Lấy chi tiết đối tác vận chuyển' })
  @Get('partners/:id')
  @Roles(Role.ADMIN, Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOnePartner(@Param('id') id: string) {
    return this.logisticsService.findOnePartner(id);
  }

  @ApiOperation({ summary: 'Xóa đối tác vận chuyển' })
  @Delete('partners/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deletePartner(@Param('id') id: string) {
    return this.logisticsService.deletePartner(id);
  }

  @ApiOperation({ summary: 'Tạo vận đơn thủ công' })
  @Post('orders')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createOrder(@Body() dto: CreateLogisticsOrderDto) {
    return this.logisticsService.createOrder(dto);
  }
}