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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';
import {
  CreateLogisticsPartnerDto,
  UpdateLogisticsPartnerDto,
  CreateLogisticsOrderDto,
  UpdateLogisticsOrderDto,
  CalculateShippingDto,
} from './dto/logistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('logistics')
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  // Partner endpoints
  @ApiOperation({ summary: 'Create a logistics partner profile' })
  @ApiResponse({ status: 201, description: 'Partner profile has been created.' })
  @Post('partners')
  @Roles(Role.LOGISTICS)
  createPartner(
    @Request() req,
    @Body() createLogisticsPartnerDto: CreateLogisticsPartnerDto,
  ) {
    return this.logisticsService.createPartner(req.user.id, createLogisticsPartnerDto);
  }

  @ApiOperation({ summary: 'Get all logistics partners' })
  @ApiResponse({ status: 200, description: 'Return all partners.' })
  @Public()
  @Get('partners')
  @Roles(Role.ADMIN)
  findAllPartners() {
    return this.logisticsService.findAllPartners();
  }

  @ApiOperation({ summary: 'Get logistics partner by ID' })
  @ApiResponse({ status: 200, description: 'Return the partner.' })
  @Public()
  @Get('partners/:id')
  findOnePartner(@Param('id') id: string) {
    return this.logisticsService.findOnePartner(id);
  }

  @ApiOperation({ summary: 'Update logistics partner profile' })
  @ApiResponse({ status: 200, description: 'Partner profile has been updated.' })
  @Patch('partners/:id')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  updatePartner(
    @Param('id') id: string,
    @Body() updateLogisticsPartnerDto: UpdateLogisticsPartnerDto,
    @Request() req,
  ) {
    // Only allow partners to update their own profile unless they're an admin
    if (
      req.user.role !== Role.ADMIN &&
      this.logisticsService.findOnePartner(id)['userId'] !== req.user.id
    ) {
      throw new Error('Unauthorized');
    }
    return this.logisticsService.updatePartner(id, updateLogisticsPartnerDto);
  }

  @ApiOperation({ summary: 'Delete logistics partner profile' })
  @ApiResponse({ status: 200, description: 'Partner profile has been deleted.' })
  @Delete('partners/:id')
  @Roles(Role.ADMIN)
  deletePartner(@Param('id') id: string) {
    return this.logisticsService.deletePartner(id);
  }

  // Order endpoints
  @ApiOperation({ summary: 'Create a logistics order' })
  @ApiResponse({ status: 201, description: 'Logistics order has been created.' })
  @Post('orders')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  createOrder(@Body() createLogisticsOrderDto: CreateLogisticsOrderDto) {
    return this.logisticsService.createOrder(createLogisticsOrderDto);
  }

  @ApiOperation({ summary: 'Get all logistics orders' })
  @ApiResponse({ status: 200, description: 'Return all logistics orders.' })
  @Public()
  @Get('orders')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  findAllOrders(@Request() req) {
    // If logistics partner, only show their orders
    const partnerId =
      req.user?.role === Role.LOGISTICS
        ? this.logisticsService.findOnePartner(req.user?.id)['id']
        : undefined;
    return this.logisticsService.findAllOrders(partnerId);
  }

  @ApiOperation({ summary: 'Get logistics order by ID' })
  @ApiResponse({ status: 200, description: 'Return the logistics order.' })
  @Public()
  @Get('orders/:id')
  findOneOrder(@Param('id') id: string) {
    return this.logisticsService.findOneOrder(id);
  }

  @ApiOperation({ summary: 'Update logistics order status' })
  @ApiResponse({ status: 200, description: 'Order status has been updated.' })
  @Patch('orders/:id')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateLogisticsOrderDto: UpdateLogisticsOrderDto,
  ) {
    return this.logisticsService.updateOrderStatus(id, updateLogisticsOrderDto);
  }

  // Shipping calculation endpoint
  @ApiOperation({ summary: 'Calculate shipping cost' })
  @ApiResponse({ status: 200, description: 'Return shipping cost calculation.' })
  @Post('calculate')
  calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.logisticsService.calculateShipping(calculateShippingDto);
  }
}