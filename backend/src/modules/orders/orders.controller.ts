import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
  Put, // <--- 1. Đã thêm import Put ở đây
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/orders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order has been created.' })
  @Post()
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({ status: 200, description: 'Return list of my orders.' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @Get('my-orders')
  findMyOrders(@Request() req, @Query('status') status?: OrderStatus) {
    return this.ordersService.findMyOrders(req.user.id, status);
  }

  @ApiOperation({ summary: 'Get all orders (Admin/Manager filter)' })
  @ApiResponse({ status: 200, description: 'Return list of orders.' })
  @Get()
  findAll(@Request() req) {
    return this.ordersService.findAll(req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Return order details.' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    return this.ordersService.updateStatus(id, dto, req.user.id, req.user.role);
  }

  // ==================================================================
  // 👇 API MỚI: Frontend gọi cái này sau khi VNPay success
  // ==================================================================
  @ApiOperation({ summary: 'Update payment status (Called by Frontend/IPN)' })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  @Put(':id/payment-status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() body: { status: string; paymentMethod: string },
  ) {
    return this.ordersService.updatePaymentStatus(id, body.status, body.paymentMethod);
  }
}