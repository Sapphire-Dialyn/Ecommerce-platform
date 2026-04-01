import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShipperService } from './shipper.service';
import {
  CreateShipperDto,
  UpdateAssignedOrderStatusDto,
  UpdateLocationDto,
  UpdateShipperDto,
} from './shipper.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetLogisticsPartnerId } from '@modules/logistics/decorators/get-logistics-partner-id.decorator';

@ApiTags('shipper')
@Controller('logistics/shipper')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @ApiOperation({ summary: 'Create a new shipper' })
  @ApiResponse({ status: 201, description: 'Shipper has been created.' })
  @Post()
  @Roles(Role.LOGISTICS)
  create(
    @GetLogisticsPartnerId() logisticsPartnerId: string,
    @Body() createShipperDto: CreateShipperDto,
  ) {
    return this.shipperService.create(logisticsPartnerId, createShipperDto);
  }

  @ApiOperation({ summary: 'Get current shipper profile' })
  @ApiResponse({ status: 200, description: 'Return current shipper profile.' })
  @Get('me')
  @Roles(Role.SHIPPER)
  findMe(@Request() req) {
    return this.shipperService.findMe(req.user.id);
  }

  @ApiOperation({ summary: 'Get orders assigned to current shipper' })
  @ApiResponse({ status: 200, description: 'Return assigned logistics orders.' })
  @Get('orders/me')
  @Roles(Role.SHIPPER)
  findMyOrders(@Request() req) {
    return this.shipperService.findMyOrders(req.user.id);
  }

  @ApiOperation({ summary: 'Update shipper details' })
  @ApiResponse({ status: 200, description: 'Shipper has been updated.' })
  @Put(':id')
  @Roles(Role.LOGISTICS)
  update(@Param('id') id: string, @Body() updateShipperDto: UpdateShipperDto) {
    return this.shipperService.update(id, updateShipperDto);
  }

  @ApiOperation({ summary: 'Update shipper location' })
  @ApiResponse({ status: 200, description: 'Location has been updated.' })
  @Put(':id/location')
  @Roles(Role.LOGISTICS, Role.SHIPPER)
  updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.shipperService.updateLocation(id, updateLocationDto);
  }

  @ApiOperation({ summary: 'Get all shippers for current logistics partner' })
  @ApiResponse({ status: 200, description: 'Return all shippers.' })
  @Get()
  @Roles(Role.LOGISTICS)
  findAll(@GetLogisticsPartnerId() logisticsPartnerId: string) {
    return this.shipperService.findAll(logisticsPartnerId);
  }

  @ApiOperation({ summary: 'Get shipper by ID' })
  @ApiResponse({ status: 200, description: 'Return the shipper.' })
  @Get(':id')
  @Roles(Role.LOGISTICS, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.shipperService.findOne(id);
  }

  @ApiOperation({ summary: 'Update assigned order status as the current shipper' })
  @ApiResponse({ status: 200, description: 'Assigned order status updated.' })
  @Put('orders/:orderId/status')
  @Roles(Role.SHIPPER)
  updateAssignedOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateAssignedOrderStatusDto,
    @Request() req,
  ) {
    return this.shipperService.updateAssignedOrderStatus(orderId, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Mark logistics order as delivered' })
  @ApiResponse({ status: 200, description: 'Order has been marked as delivered.' })
  @Post('orders/:orderId/complete')
  @Roles(Role.LOGISTICS, Role.SHIPPER)
  completeDelivery(@Param('orderId') orderId: string, @Request() req) {
    return this.shipperService.completeDelivery(
      orderId,
      req.user.role === Role.SHIPPER ? req.user.id : undefined,
    );
  }
}
