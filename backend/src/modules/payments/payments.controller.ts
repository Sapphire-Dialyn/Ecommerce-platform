import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Ip, // <--- 1. Thêm import này
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, VNPayCallbackDto, PayPalCallbackDto } from './dto/payments.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment has been created.' })
  @Post()
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Ip() ip: string // <--- 2. Lấy IP người dùng thực tế
  ) {
    // Truyền IP xuống service
    return this.paymentsService.create(createPaymentDto, ip);
  }

  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all payments.' })
  @Roles(Role.ADMIN) // Role Admin thì không cần @Public
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Return the payment.' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @ApiOperation({ summary: 'Get payment by order ID' })
  @ApiResponse({ status: 200, description: 'Return the payment for the order.' })
  @Public()
  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  // --- Callback VNPAY ---
  // Lưu ý: Đường dẫn này phải khớp với cấu hình Return URL hoặc IPN URL
  @ApiOperation({ summary: 'Handle VNPay callback' })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  @Public()
  @Get('vnpay-callback') 
  handleVNPayCallback(@Query() params: any) { // Dùng 'any' hoặc DTO lỏng vì VNPAY trả về rất nhiều tham số lạ
    return this.paymentsService.handleVNPayCallback(params);
  }

  @ApiOperation({ summary: 'Handle PayPal callback' })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  @Public()
  @Get('paypal-callback')
  handlePayPalCallback(@Query() params: PayPalCallbackDto) {
    return this.paymentsService.handlePayPalCallback(params);
  }
}