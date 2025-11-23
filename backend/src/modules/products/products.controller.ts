import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
  Request,
  Query,
  UploadedFile,
  UseInterceptors,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // <--- QUAN TRỌNG: Import memoryStorage
import { ProductsService } from './products.service';

import {
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateReviewDto,
} from './dto/products.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  // ==================================================================
  // CATEGORY ENDPOINTS
  // ==================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('categories')
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  createCategory(@Body() dto: CreateCategoryDto, @Request() req) {
    if (req.user.role !== Role.ADMIN) throw new Error('Only admins can create categories');
    return this.productsService.createCategory(dto);
  }

  @Public()
  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Public()
  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.productsService.findOneCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto, @Request() req) {
    if (req.user.role !== Role.ADMIN) throw new Error('Only admins can update categories');
    return this.productsService.updateCategory(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string, @Request() req) {
    if (req.user.role !== Role.ADMIN) throw new Error('Only admins can delete categories');
    return this.productsService.deleteCategory(id);
  }

  // ==================================================================
  // PRODUCT ROOT ENDPOINTS
  // ==================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create product (Seller or Enterprise only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // <--- QUAN TRỌNG: Lưu file vào RAM để CloudinaryService đọc được
    }),
  )
  async createProduct(
    @Request() req,
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log(`Create Product Request Received`);
    if (![Role.SELLER, Role.ENTERPRISE].includes(req.user.role))
      throw new Error('Only sellers and enterprises can create products');

    let data = dto;

    if (req.user.role === Role.SELLER) {
      const seller = await this.productsService.findSellerByUserId(req.user.id);
      data = { ...dto, sellerId: seller.id };
    }

    if (req.user.role === Role.ENTERPRISE) {
      const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
      data = { ...dto, enterpriseId: enterprise.id };
    }

    return this.productsService.createProduct(data, file);
  }

  // ==================================================================
  // GET PRODUCTS — WITH FILTERS
  // ==================================================================

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'sellerId', required: false })
  @ApiQuery({ name: 'enterpriseId', required: false })
  findAllProducts(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('enterpriseId') enterpriseId?: string,
  ) {
    const skipNumber = skip ? Number(skip) : 0;
    const takeNumber = take ? Number(take) : 100;
    return this.productsService.findAllProducts(
      skipNumber,
      takeNumber,
      categoryId,
      sellerId,
      enterpriseId,
    );
  }

  // ==================================================================
  // GET PRODUCTS BY SELLER
  // ==================================================================

  @Public()
  @Get('seller/:sellerId')
  @ApiOperation({ summary: 'Get all products of a specific seller' })
  getProductsBySeller(@Param('sellerId') sellerId: string) {
    return this.productsService.getProductsBySellerId(sellerId);
  }

  // ==================================================================
  // GET PRODUCTS BY ENTERPRISE
  // ==================================================================

  @Public()
  @Get('enterprise/:enterpriseId')
  @ApiOperation({ summary: 'Get all products of a specific enterprise' })
  getProductsByEnterprise(@Param('enterpriseId') enterpriseId: string) {
    return this.productsService.getProductsByEnterpriseId(enterpriseId);
  }

  // ==================================================================
  // REVIEW ENDPOINTS
  // ==================================================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/reviews')
  createReview(
    @Param('id') productId: string,
    @Body() dto: CreateReviewDto,
    @Request() req,
  ) {
    return this.productsService.createReview(productId, req.user.id, dto);
  }

  @Public()
  @Get(':id/reviews')
  getProductReviews(@Param('id') productId: string) {
    return this.productsService.getProductReviews(productId);
  }

  // ==================================================================
  // PRODUCT BY ID
  // ==================================================================

  @Public()
  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // <--- QUAN TRỌNG: Lưu file vào RAM
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (![Role.SELLER, Role.ENTERPRISE].includes(req.user.role)) {
      throw new ForbiddenException('Only sellers and enterprises can update products');
    }
    let ownerId = '';
    if (req.user.role === Role.SELLER) {
      const seller = await this.productsService.findSellerByUserId(req.user.id);
      ownerId = seller.id;
    } else {
      const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
      ownerId = enterprise.id;
    }
    return this.productsService.updateProduct(id, ownerId, req.user.role, dto, file);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Request() req) {
    if (![Role.SELLER, Role.ENTERPRISE].includes(req.user.role)) {
      throw new ForbiddenException('Only sellers and enterprises can delete products');
    }

    let ownerId = '';
    if (req.user.role === Role.SELLER) {
      const seller = await this.productsService.findSellerByUserId(req.user.id);
      ownerId = seller.id;
    } else {
      const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
      ownerId = enterprise.id;
    }
    return this.productsService.deleteProduct(id, ownerId, req.user.role);
  }
}