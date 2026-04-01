import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';
import {
  AssignLogisticsOrderDto,
  CalculateShippingDto,
  CreateLogisticsOrderDto,
  CreateLogisticsPartnerDto,
  UpdateLogisticsOrderDto,
} from './dto/logistics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';
import { GetLogisticsPartnerId } from './decorators/get-logistics-partner-id.decorator';

@ApiTags('logistics')
@Controller('logistics')
@ApiBearerAuth()
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Public()
  @ApiOperation({ summary: 'Get verified logistics partners for checkout' })
  @ApiResponse({ status: 200, description: 'Return logistics partners.' })
  @Get('partners')
  findAllPartners() {
    return this.logisticsService.findAllPartners();
  }

  @Public()
  @ApiOperation({ summary: 'Estimate shipping fee' })
  @Post('calculate')
  calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.logisticsService.calculateShipping(calculateShippingDto);
  }

  @ApiOperation({ summary: 'Create logistics partner profile' })
  @Post('partners/profile')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createPartner(
    @Request() req,
    @Body() createLogisticsPartnerDto: CreateLogisticsPartnerDto,
  ) {
    return this.logisticsService.createPartner(req.user.id, createLogisticsPartnerDto);
  }

  @ApiOperation({ summary: 'Get logistics orders for the current partner' })
  @ApiQuery({ name: 'unassigned', required: false, type: Boolean })
  @Get('orders/me')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllMyOrders(
    @GetLogisticsPartnerId() partnerId: string,
    @Query('unassigned') unassigned?: string,
  ) {
    return this.logisticsService.findAllOrders(partnerId, unassigned === 'true');
  }

  @ApiOperation({ summary: 'Get unassigned logistics orders for the current partner' })
  @Get('orders/me/unassigned')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findUnassignedOrders(@GetLogisticsPartnerId() partnerId: string) {
    return this.logisticsService.findUnassignedOrders(partnerId);
  }

  @ApiOperation({ summary: 'Update logistics order data or status' })
  @Patch('orders/:id')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateLogisticsOrderDto: UpdateLogisticsOrderDto,
    @GetLogisticsPartnerId() partnerId: string,
  ) {
    return this.logisticsService.updateOrderStatus(id, updateLogisticsOrderDto, partnerId);
  }

  @ApiOperation({ summary: 'Assign shipper to a logistics order owned by current partner' })
  @Post('orders/:id/assign')
  @Roles(Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  assignOrder(
    @Param('id') id: string,
    @Body() body: AssignLogisticsOrderDto,
    @GetLogisticsPartnerId() partnerId: string,
  ) {
    return this.logisticsService.assignOrderToShipper(id, body, partnerId);
  }

  @ApiOperation({ summary: 'Get logistics partner details' })
  @Get('partners/:id')
  @Roles(Role.ADMIN, Role.LOGISTICS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOnePartner(@Param('id') id: string) {
    return this.logisticsService.findOnePartner(id);
  }

  @ApiOperation({ summary: 'Delete logistics partner' })
  @Delete('partners/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deletePartner(@Param('id') id: string) {
    return this.logisticsService.deletePartner(id);
  }

  @ApiOperation({ summary: 'Create logistics order manually' })
  @Post('orders')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createOrder(@Body() createLogisticsOrderDto: CreateLogisticsOrderDto) {
    return this.logisticsService.createOrder(createLogisticsOrderDto);
  }
}
