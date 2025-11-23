import { Injectable, NotFoundException, BadRequestException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';
import { Role } from '@prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Import Service chuẩn
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService, // Inject Service
  ) {}

  // ... Category methods ...
  createCategory(dto: any) { return this.prisma.category.create({ data: dto }); }
  findAllCategories() { return this.prisma.category.findMany(); }
  findOneCategory(id: string) { return this.prisma.category.findUnique({ where: { id } }); }
  updateCategory(id: string, dto: any) { return this.prisma.category.update({ where: { id }, data: dto }); }
  deleteCategory(id: string) { return this.prisma.category.delete({ where: { id } }); }

  // ... Helper methods ...
  async findSellerByUserId(userId: string) {
    const seller = await this.prisma.seller.findFirst({ where: { userId } });
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async findEnterpriseByUserId(userId: string) {
    const enterprise = await this.prisma.enterprise.findFirst({ where: { userId } });
    if (!enterprise) throw new NotFoundException('Enterprise not found');
    return enterprise;
  }

  // --- CREATE PRODUCT ---
  async createProduct(dto: CreateProductDto, file?: Express.Multer.File) {
    const { basePrice, stock, variants, ...productData } = dto;

    if (!productData.categoryId || productData.categoryId === 'undefined') {
        throw new BadRequestException('Category ID is required');
    }
    const categoryExists = await this.prisma.category.findUnique({
        where: { id: productData.categoryId }
    });
    if (!categoryExists) {
        throw new BadRequestException(`Category with ID "${productData.categoryId}" not found`);
    }

    const images: string[] = [];
    if (file) {
      try {
        // Gọi CloudinaryService
        const result = await this.cloudinaryService.uploadFile(file, {
             folder: 'products', 
             resource_type: 'auto'
        });
        if ((result as UploadApiResponse).secure_url) {
            images.push((result as UploadApiResponse).secure_url);
        }
      } catch (error) {
        this.logger.error(`Upload failed: ${error}`);
      }
    }

    let variantsData: any[] = [];
    if (typeof variants === 'string') {
      try { variantsData = JSON.parse(variants); } catch (e) { variantsData = []; }
    } else if (Array.isArray(variants)) {
      variantsData = variants;
    }

    if (!variantsData || variantsData.length === 0) {
      variantsData.push({
        price: Number(basePrice) || 0, 
        stock: Number(stock) || 0,
        sku: `${Date.now()}`,
        color: null,
        size: null
      });
    }

    return this.prisma.product.create({
      data: {
        ...productData,
        images: images, 
        variants: {
          create: variantsData.map((v) => ({
            price: Number(v.price || basePrice || 0),
            stock: Number(v.stock || stock || 0),
            color: v.color || null,
            size: v.size || null,
            sku: v.sku || undefined,
          })),
        },
      },
      include: { variants: true },
    });
  }

  // ... Find methods ...
  async findAllProducts(
    skip?: number, take?: number, categoryId?: string, sellerId?: string, enterpriseId?: string,
  ) {
    const skipNumber = Number(skip) || 0;
    const takeNumber = Number(take) || 100;
    const products = await this.prisma.product.findMany({
      skip: skipNumber,
      take: takeNumber,
      where: {
        categoryId: categoryId || undefined,
        sellerId: sellerId || undefined,
        enterpriseId: enterpriseId || undefined,
        active: true,
      },
      include: { category: true, seller: true, enterprise: true, variants: true },
      orderBy: { createdAt: 'desc' },
    });
    return products.map((p) => ({ ...p, images: p.images || [] }));
  }

  getProductsBySellerId(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: { category: true, seller: true, variants: true },
    });
  }

  // --- FIX LỖI GIÁ 0đ Ở ĐÂY ---
  getProductsByEnterpriseId(enterpriseId: string) {
    return this.prisma.product.findMany({
      where: { enterpriseId },
      include: { 
          category: true, 
          enterprise: true, 
          variants: true // <--- Đã thêm variants: true để Frontend lấy được giá
      }, 
    });
  }

  async findOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, seller: true, enterprise: true, variants: true, reviews: { include: { user: true } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // --- UPDATE PRODUCT ---
  async updateProduct(id: string, ownerId: string, role: string, dto: UpdateProductDto, file?: Express.Multer.File) {
    const whereCondition: any = { id };
    if (role === Role.SELLER) whereCondition.sellerId = ownerId;
    else if (role === Role.ENTERPRISE) whereCondition.enterpriseId = ownerId;

    const product = await this.prisma.product.findFirst({ where: whereCondition });
    if (!product) throw new ForbiddenException('Product not found or access denied');

    const { basePrice, stock, ...generalData } = dto;
    
    let newImages = product.images;
    if (file) {
        try {
            const result = await this.cloudinaryService.uploadFile(file, {
                folder: 'products',
            });
             if ((result as UploadApiResponse).secure_url) {
                newImages = [(result as UploadApiResponse).secure_url];
            }
        } catch (error) {
            this.logger.error(`Upload failed: ${error}`);
            throw error;
        }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { ...generalData, images: newImages },
    });

    // Cập nhật Variant mặc định nếu thay đổi basePrice
    if (basePrice !== undefined || stock !== undefined) {
        const firstVariant = await this.prisma.productVariant.findFirst({ where: { productId: id } });
        if (firstVariant) {
            await this.prisma.productVariant.update({
                where: { id: firstVariant.id },
                data: {
                    price: basePrice !== undefined ? Number(basePrice) : undefined,
                    stock: stock !== undefined ? Number(stock) : undefined,
                }
            });
        }
    }
    return updatedProduct;
  }

  // ... Delete and Reviews ...
  async deleteProduct(id: string, ownerId: string, role: string) {
    const whereCondition: any = { id };
    if (role === Role.SELLER) whereCondition.sellerId = ownerId;
    else if (role === Role.ENTERPRISE) whereCondition.enterpriseId = ownerId;

    const product = await this.prisma.product.findFirst({ where: whereCondition });
    if (!product) throw new ForbiddenException('Product not found or access denied');
    return this.prisma.product.delete({ where: { id } });
  }

  createReview(productId: string, userId: string, dto: any) {
    return this.prisma.review.create({ data: { ...dto, productId, userId } });
  }

  getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}