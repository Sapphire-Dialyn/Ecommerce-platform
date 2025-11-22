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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, AddAddressDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  @Public()
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User has been updated.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Only allow users to update their own profile unless they're an admin
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Add a new address' })
  @ApiResponse({ status: 201, description: 'Address has been added.' })
  @Post(':id/addresses')
  async addAddress(
    @Param('id') id: string,
    @Body() addressDto: AddAddressDto,
    @Request() req,
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.addAddress(id, addressDto);
  }

  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address has been deleted.' })
  @Delete(':id/addresses/:addressId')
  async deleteAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
    @Request() req,
  ) {
    if (req.user.role !== Role.ADMIN && req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    return this.usersService.deleteAddress(id, addressId);
  }
}