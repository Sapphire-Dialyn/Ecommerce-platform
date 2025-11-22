import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  ForbiddenException, // 👈 1. Thêm ForbiddenException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { CreateSellerDto, UpdateSellerDto } from './dto/sellers.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadInterceptor } from '../../common/interceptors';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @ApiOperation({ summary: 'Create a seller profile' })
  @ApiResponse({ status: 201, description: 'Seller profile has been created.' })
  @Post()
  create(@Request() req, @Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(req.user.id, createSellerDto);
  }

  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'Return all sellers.' })
  @Public()
  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @ApiOperation({ summary: 'Get seller by ID' })
  @ApiResponse({ status: 200, description: 'Return the seller.' })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update seller profile' })
  @ApiResponse({ status: 200, description: 'Seller profile has been updated.' })
  @Patch(':id')
  async update( // 👈 2. Thêm 'async'
    @Param('id') id: string,
    @Body() updateSellerDto: UpdateSellerDto,
    @Request() req,
  ) {
    // 3. Thêm 'await'
    const seller = await this.sellersService.findOne(id); 

    // 4. Kiểm tra logic (dùng seller.userId)
    if (req.user.role !== Role.ADMIN && seller.userId !== req.user.id) {
      throw new ForbiddenException('Unauthorized');
    }
    return this.sellersService.update(id, updateSellerDto);
  }

  @ApiOperation({ summary: 'Verify seller (Admin only)' })
  @ApiResponse({ status: 200, description: 'Seller verification status updated.' })
  @Patch(':id/verify')
  @Roles(Role.ADMIN) // 👈 Thêm Guard cho an toàn
  @UseGuards(RolesGuard)
  verifyStatus(
    @Param('id') id: string,
    @Body('verified') verified: boolean,
    @Request() req,
  ) {
    // (Kiểm tra role bằng Guard tốt hơn)
    // if (req.user.role !== Role.ADMIN) {
    //   throw new Error('Unauthorized - Admin only');
    // }
    return this.sellersService.updateVerificationStatus(id, verified);
  }

  @ApiOperation({ summary: 'Delete seller profile' })
  @ApiResponse({ status: 200, description: 'Seller profile has been deleted.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) { // 👈 2. Thêm 'async'
    // 3. Thêm 'await'
    const seller = await this.sellersService.findOne(id);
    
    // 4. Kiểm tra logic (dùng seller.userId)
    if (req.user.role !== Role.ADMIN && seller.userId !== req.user.id) {
      throw new ForbiddenException('Unauthorized');
    }
    return this.sellersService.delete(id);
  }

  // File Upload Endpoints
  // (Phần này bạn đã sửa đúng - dùng 'new FileUploadInterceptor')
  
  @Post(':id/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'), new FileUploadInterceptor({ required: true }))
  uploadLogo(
    @Param('id') id: string,
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.sellersService.uploadStoreLogo(file, id);
  }

  @Put(':id/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'), new FileUploadInterceptor({ required: true }))
  updateLogo(
    @Param('id') id: string,
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.sellersService.updateStoreLogo(file, id);
  }

  @Delete(':id/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  deleteLogo(@Param('id') id: string) {
    return this.sellersService.deleteStoreLogo(id);
  }

  @Post(':id/documents/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'), new FileUploadInterceptor({ required: true }))
  uploadDocument(
    @Param('id') id: string,
    @Param('type') type: 'business' | 'identity' | 'address',
    @UploadedFile(new ParseFilePipe())
    file: Express.Multer.File,
  ) {
    return this.sellersService.uploadVerificationDocument(file, id, type);
  }

  @Delete(':id/documents/:type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth()
  deleteDocument(
    @Param('id') id: string,
    @Param('type') type: 'business' | 'identity' | 'address',
  ) {
    return this.sellersService.deleteVerificationDocument(id, type);
  }
}