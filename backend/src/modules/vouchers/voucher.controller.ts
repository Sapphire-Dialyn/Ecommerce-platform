// src/voucher/voucher.controller.ts
import { Controller, Post, Body, UseGuards, Req, Param, Get, Query, ForbiddenException } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { ApplyVoucherDto } from './dto/apply-voucher.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
// Giả lập Guards (bạn cần import từ module auth của mình)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Vouchers')
@ApiBearerAuth() // 👈 Yêu cầu JWT
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  // ==========================================
  // ADMIN & SELLER ENDPOINTS
  // ==========================================

  @Post('shop')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER, Role.ENTERPRISE)
  @ApiOperation({ summary: 'Tạo Shop Voucher (Seller / Enterprise)' })
  @ApiResponse({ status: 201, description: 'Tạo voucher thành công.' })
  createShopVoucher(@Body() createDto: CreateVoucherDto, @Req() req) {
    // req.user.sellerId cần được gắn vào từ JWT payload
    const sellerId = req.user.sellerId;
    if (!sellerId) {
      throw new ForbiddenException('User is not linked to a seller account');
    }
    return this.voucherService.createShopVoucher(createDto, sellerId);
  }

  @Post('platform')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo Platform Voucher (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo voucher thành công.' })
  createPlatformVoucher(@Body() createDto: CreateVoucherDto) {
    return this.voucherService.createPlatformVoucher(createDto);
  }

  @Post('freeship')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo FreeShip Voucher (Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo voucher thành công.' })
  createFreeShipVoucher(@Body() createDto: CreateVoucherDto) {
    return this.voucherService.createFreeShipVoucher(createDto);
  }

  // ==========================================
  // CUSTOMER ENDPOINTS
  // ==========================================

  @Post('claim/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Customer lưu (claim) 1 voucher' })
  @ApiResponse({ status: 201, description: 'Claim thành công.' })
  @ApiResponse({ status: 400, description: 'Voucher đã hết hoặc đã claim.' })
  claimVoucher(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.voucherService.claimVoucher(id, userId);
  }

  @Get('available')
  @Public()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Lấy voucher khả dụng cho giỏ hàng' })
  @ApiResponse({ status: 200, description: 'Trả về 3 danh sách voucher.' })
  getAvailableVouchers(
    @Req() req,
    @Query('sellerIds') sellerIds: string[],
  ) {
    const userId = req.user?.id;
    const sellerIdArray = Array.isArray(sellerIds) ? sellerIds : [sellerIds].filter(Boolean);
    return this.voucherService.getAvailableVouchers(userId, sellerIdArray);
  }

  @Post('calculate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Tạm tính giá trị đơn hàng với voucher' })
  @ApiBody({ type: ApplyVoucherDto })
  @ApiResponse({ status: 201, description: 'Trả về chi tiết giá.' })
  calculateCheckout(@Req() req, @Body() applyDto: ApplyVoucherDto) {
    const userId = req.user.id;
    return this.voucherService.calculateCheckout(userId, applyDto);
  }
}