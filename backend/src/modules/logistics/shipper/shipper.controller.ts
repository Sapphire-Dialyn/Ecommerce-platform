import { Controller, Get, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ShipperService } from './shipper.service';
import { CreateShipperDto, UpdateShipperDto, UpdateLocationDto } from './shipper.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Role } from '@prisma/client';
import { GetLogisticsPartnerId } from '@modules/logistics/decorators/get-logistics-partner-id.decorator';

@ApiTags('shipper')
@Controller('logistics/shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @ApiOperation({ summary: 'Create a new shipper' })
  @ApiResponse({ status: 201, description: 'Shipper has been created.' })
  @Post()
  create(
    @GetLogisticsPartnerId() logisticsPartnerId: string,
    @Body() createShipperDto: CreateShipperDto,
  ) {
    return this.shipperService.create(logisticsPartnerId, createShipperDto);
  }

  @ApiOperation({ summary: 'Update shipper details' })
  @ApiResponse({ status: 200, description: 'Shipper has been updated.' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateShipperDto: UpdateShipperDto) {
    return this.shipperService.update(id, updateShipperDto);
  }

  @ApiOperation({ summary: 'Update shipper location' })
  @ApiResponse({ status: 200, description: 'Location has been updated.' })
  @Put(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.shipperService.updateLocation(id, updateLocationDto);
  }

  @ApiOperation({ summary: 'Get all shippers for logistics partner' })
  @ApiResponse({ status: 200, description: 'Return all shippers.' })
  @Public()
  @Get()
  findAll(@GetLogisticsPartnerId() logisticsPartnerId: string) {
    return this.shipperService.findAll(logisticsPartnerId);
  }

  @ApiOperation({ summary: 'Get shipper by ID' })
  @ApiResponse({ status: 200, description: 'Return the shipper.' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipperService.findOne(id);
  }

  @ApiOperation({ summary: 'Assign order to shipper' })
  @ApiResponse({ status: 200, description: 'Order has been assigned.' })
  @Post(':id/assign-order/:orderId')
  assignOrder(@Param('id') id: string, @Param('orderId') orderId: string) {
    return this.shipperService.assignOrder(orderId, id);
  }

  @ApiOperation({ summary: 'Mark order as delivered' })
  @ApiResponse({ status: 200, description: 'Order has been marked as delivered.' })
  @Post('orders/:orderId/complete')
  completeDelivery(@Param('orderId') orderId: string) {
    return this.shipperService.completeDelivery(orderId);
  }
}