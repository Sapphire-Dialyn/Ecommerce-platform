import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, VNPayCallbackDto, PayPalCallbackDto } from './dto/payments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
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
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({ summary: 'Get all payments (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all payments.' })
  @Public()
  @Get()
  @Roles(Role.ADMIN)
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

  @ApiOperation({ summary: 'Handle VNPay callback' })
  @ApiResponse({ status: 200, description: 'Payment status updated.' })
  @Public()
  @Get('vnpay-callback')
  handleVNPayCallback(@Query() params: VNPayCallbackDto) {
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