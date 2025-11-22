import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // CATEGORY SERVICES
  // ============================================================

  createCategory(dto: any) {
    return this.prisma.category.create({ data: dto });
  }

  findAllCategories() {
    return this.prisma.category.findMany();
  }

  findOneCategory(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  updateCategory(id: string, dto: any) {
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  deleteCategory(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  // ============================================================
  // FIND SELLER / ENTERPRISE BY USER ID
  // ============================================================

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

  // ============================================================
  // PRODUCT CRUD
  // ============================================================

  createProduct(dto: any) {
    return this.prisma.product.create({ data: dto });
  }

  // ============= LẤY SẢN PHẨM — CÓ FILTER =====================
  findAllProducts(
  skip?: number,
  take?: number,
  categoryId?: string,
  sellerId?: string,
  enterpriseId?: string,
) {
  const skipNumber = Number(skip) || 0;   // mặc định 0
  const takeNumber = Number(take) || 100; // mặc định 100 sản phẩm

  return this.prisma.product.findMany({
    skip: skipNumber,
    take: takeNumber,
    where: {
      categoryId: categoryId || undefined,
      sellerId: sellerId || undefined,
      enterpriseId: enterpriseId || undefined,
      active: true, // chỉ lấy sản phẩm đang active
    },
    include: {
      category: true,
      seller: true,
      enterprise: true,
      variants: true,
      // ❌ không include images vì Prisma không hỗ trợ primitive array
    },
    orderBy: {
      createdAt: 'desc',
    },
  }).then(products => 
    products.map(p => ({
      ...p,
      images: p.images || [], // thêm images ở đây cho frontend
    }))
  );
}



  // ============= LẤY SẢN PHẨM THEO SELLER =====================
  getProductsBySellerId(sellerId: string) {
    return this.prisma.product.findMany({
      where: { sellerId },
      include: { category: true, seller: true },
    });
  }

  // ============= LẤY SẢN PHẨM THEO ENTERPRISE =================
  getProductsByEnterpriseId(enterpriseId: string) {
    return this.prisma.product.findMany({
      where: { enterpriseId },
      include: {     
      category: true,  
      enterprise: true, 
      variants: true,   
    },
    });
  }

  // ============= LẤY 1 SẢN PHẨM ======================
  findOneProduct(id: string) {
  return this.prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      seller: true,
      enterprise: true,
      variants: true,    // <<< thêm
    },
  });
}

  // ============================================================
  // UPDATE SẢN PHẨM — SELLER ONLY
  // ============================================================

  async updateProduct(id: string, sellerId: string, dto: any) {
    const product = await this.prisma.product.findFirst({
      where: { id, sellerId },
    });

    if (!product) throw new NotFoundException('Product not found or not owned by seller');

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  // ============================================================
  // DELETE PRODUCT — SELLER ONLY
  // ============================================================

  async deleteProduct(id: string, sellerId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, sellerId },
    });

    if (!product) throw new NotFoundException('Product not found or not owned by seller');

    return this.prisma.product.delete({ where: { id } });
  }

  // ============================================================
  // REVIEW HANDLING
  // ============================================================

  createReview(productId: string, userId: string, dto: any) {
    return this.prisma.review.create({
      data: {
        ...dto,
        productId,
        userId,
      },
    });
  }

  getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
