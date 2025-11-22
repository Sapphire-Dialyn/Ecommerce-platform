import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import {
  CreateVoucherDto,
  UpdateVoucherDto,
  CreateFlashSaleDto,
  CreateCampaignDto,
  SystemStatsDto,
} from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // User Management
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @Public()
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @Public()
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @ApiOperation({ summary: 'Verify enterprise' })
  @ApiResponse({ status: 200, description: 'Enterprise verification status updated.' })
  @Patch('enterprise/:id/verify')
  verifyEnterprise(
    @Param('id') id: string,
    @Body('verified') verified: boolean,
  ) {
    return this.adminService.verifyEnterprise(id, verified);
  }

  @ApiOperation({ summary: 'Update enterprise brand status' })
  @ApiResponse({ status: 200, description: 'Enterprise brand status updated.' })
  @Patch('enterprise/:id/brand-status')
  updateEnterpriseBrandStatus(
    @Param('id') id: string,
    @Body('officialBrand') officialBrand: boolean,
  ) {
    return this.adminService.updateEnterpriseBrandStatus(id, officialBrand);
  }

  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'User status updated.' })
  @Patch('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Body('active') active: boolean) {
    return this.adminService.updateUserStatus(id, active);
  }

  // Seller Management
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'Return all sellers.' })
  @Public()
  @Get('sellers')
  getAllSellers() {
    return this.adminService.getAllSellers();
  }

  @ApiOperation({ summary: 'Verify seller' })
  @ApiResponse({ status: 200, description: 'Seller verification status updated.' })
  @Patch('sellers/:id/verify')
  verifySeller(@Param('id') id: string, @Body('verified') verified: boolean) {
    return this.adminService.verifySeller(id, verified);
  }

  // Product Management
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  @Public()
  @Get('products')
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @ApiOperation({ summary: 'Update product status' })
  @ApiResponse({ status: 200, description: 'Product status updated.' })
  @Patch('products/:id/status')
  updateProductStatus(@Param('id') id: string, @Body('active') active: boolean) {
    return this.adminService.updateProductStatus(id, active);
  }

  // Order Management
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders.' })
  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  // Voucher Management
  @ApiOperation({ summary: 'Create voucher' })
  @ApiResponse({ status: 201, description: 'Voucher has been created.' })
  @Post('vouchers')
  createVoucher(@Body() createVoucherDto: CreateVoucherDto) {
    return this.adminService.createVoucher(createVoucherDto);
  }

  @ApiOperation({ summary: 'Update voucher' })
  @ApiResponse({ status: 200, description: 'Voucher has been updated.' })
  @Patch('vouchers/:id')
  updateVoucher(
    @Param('id') id: string,
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.adminService.updateVoucher(id, updateVoucherDto);
  }

  @ApiOperation({ summary: 'Get all vouchers' })
  @ApiResponse({ status: 200, description: 'Return all vouchers.' })
  @Get('vouchers')
  getAllVouchers() {
    return this.adminService.getAllVouchers();
  }

  // Flash Sale Management
  @ApiOperation({ summary: 'Create flash sale' })
  @ApiResponse({ status: 201, description: 'Flash sale has been created.' })
  @Post('flash-sales')
  createFlashSale(@Body() createFlashSaleDto: CreateFlashSaleDto) {
    return this.adminService.createFlashSale(createFlashSaleDto);
  }

  @ApiOperation({ summary: 'Get all flash sales' })
  @ApiResponse({ status: 200, description: 'Return all flash sales.' })
  @Get('flash-sales')
  getAllFlashSales() {
    return this.adminService.getAllFlashSales();
  }

  // Campaign Management
  @ApiOperation({ summary: 'Create campaign' })
  @ApiResponse({ status: 201, description: 'Campaign has been created.' })
  @Post('campaigns')
  createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    return this.adminService.createCampaign(createCampaignDto);
  }

  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiResponse({ status: 200, description: 'Return all campaigns.' })
  @Get('campaigns')
  getAllCampaigns() {
    return this.adminService.getAllCampaigns();
  }

  // System Statistics
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'Return system statistics.' })
  @Get('statistics')
  getSystemStats(@Query() systemStatsDto: SystemStatsDto) {
    return this.adminService.getSystemStats(systemStatsDto);
  }

  // Initialize Admin Accounts
  @ApiOperation({ summary: 'Create initial admin accounts' })
  @ApiResponse({ status: 201, description: 'Admin accounts created.' })
  @Post('initialize')
  createInitialAdmins() {
    return this.adminService.createInitialAdmins();
  }
}