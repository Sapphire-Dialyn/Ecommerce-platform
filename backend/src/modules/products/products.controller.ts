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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
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
import { Public } from '../auth/decorators/public.decorator'; // 👈 Import quan trọng

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==================================================================
  // 1. CATEGORY ENDPOINTS (QUAN TRỌNG: PHẢI ĐẶT TRƯỚC PRODUCT ID)
  // ==================================================================

  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  @ApiResponse({ status: 201, description: 'Category has been created.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    if (req.user.role !== Role.ADMIN) {
      throw new Error('Only admins can create categories');
    }
    return this.productsService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories (Public)' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  @Public() // ✅ Cho phép xem không cần login
  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @ApiOperation({ summary: 'Get category by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Return the category.' })
  @Public() // ✅ Cho phép xem không cần login
  @Get('categories/:id')
  findOneCategory(@Param('id') id: string) {
    return this.productsService.findOneCategory(id);
  }

  @ApiOperation({ summary: 'Update category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category has been updated.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req,
  ) {
    if (req.user.role !== Role.ADMIN) {
      throw new Error('Only admins can update categories');
    }
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category has been deleted.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string, @Request() req) {
    if (req.user.role !== Role.ADMIN) {
      throw new Error('Only admins can delete categories');
    }
    return this.productsService.deleteCategory(id);
  }

  // ==================================================================
  // 2. PRODUCT ROOT ENDPOINTS
  // ==================================================================

  @ApiOperation({ summary: 'Create a new product (Seller or Enterprise only)' })
  @ApiResponse({ status: 201, description: 'Product has been created.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createProduct(@Request() req, @Body() createProductDto: CreateProductDto) {
    if (req.user.role !== Role.SELLER && req.user.role !== Role.ENTERPRISE) {
      throw new Error('Only sellers and enterprises can create products');
    }
    
    let productData = createProductDto;
    
    if (req.user.role === Role.SELLER) {
      const seller = await this.productsService.findSellerByUserId(req.user.id);
      productData = { ...createProductDto, sellerId: seller.id };
    } else if (req.user.role === Role.ENTERPRISE) {
      const enterprise = await this.productsService.findEnterpriseByUserId(req.user.id);
      productData = { ...createProductDto, enterpriseId: enterprise.id };
    }
    
    return this.productsService.createProduct(productData);
  }

  @ApiOperation({ summary: 'Get all products (Public)' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'sellerId', required: false })
  @Public() // ✅ Cho phép xem không cần login
  @Get()
  findAllProducts(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
  ) {
    return this.productsService.findAllProducts(skip, take, categoryId, sellerId);
  }

  // ==================================================================
  // 3. REVIEW ENDPOINTS (Đặt trước Product ID để tránh xung đột)
  // ==================================================================

  @ApiOperation({ summary: 'Create a product review' })
  @ApiResponse({ status: 201, description: 'Review has been created.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/reviews')
  createReview(
    @Param('id') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    return this.productsService.createReview(
      productId,
      req.user.id,
      createReviewDto,
    );
  }

  @ApiOperation({ summary: 'Get product reviews (Public)' })
  @ApiResponse({ status: 200, description: 'Return all reviews for the product.' })
  @Public() // ✅ Cho phép xem review không cần login
  @Get(':id/reviews')
  getProductReviews(@Param('id') productId: string) {
    return this.productsService.getProductReviews(productId);
  }

  // ==================================================================
  // 4. PRODUCT ID ENDPOINTS (PHẢI ĐẶT CUỐI CÙNG)
  // ==================================================================

  @ApiOperation({ summary: 'Get product by ID (Public)' })
  @ApiResponse({ status: 200, description: 'Return the product.' })
  @Public() // ✅ Cho phép xem chi tiết không cần login
  @Get(':id')
  findOneProduct(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @ApiOperation({ summary: 'Update product (Seller only)' })
  @ApiResponse({ status: 200, description: 'Product has been updated.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    if (req.user.role !== Role.SELLER) {
      throw new Error('Only sellers can update products');
    }
    const sellerId = (await (this.productsService as any).findSellerByUserId(req.user.id)).id;
    return this.productsService.updateProduct(id, sellerId, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product (Seller only)' })
  @ApiResponse({ status: 200, description: 'Product has been deleted.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Request() req) {
    if (req.user.role !== Role.SELLER) {
      throw new Error('Only sellers can delete products');
    }
    const sellerId = (await (this.productsService as any).findSellerByUserId(req.user.id)).id;
    return this.productsService.deleteProduct(id, sellerId);
  }
}