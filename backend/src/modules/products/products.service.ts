import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateReviewDto,
} from './dto/products.dto';
// import { CLOUDINARY_FOLDERS } from '../cloudinary/cloudinary.constants'; // (Bạn có thể dùng hằng số này)

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService, // 👈 Đã inject  
  ) {}

  async findSellerByUserId(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
    });
    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }
    return seller;
  }

  async findEnterpriseByUserId(userId: string) {
    const enterprise = await this.prisma.enterprise.findUnique({
      where: { userId },
    });
    if (!enterprise) {
      throw new NotFoundException('Enterprise profile not found');
    }
    return enterprise;
  }

  // ======================================================
  // 1. PRODUCT METHODS (ĐÃ GỘP LOGIC ẢNH)
  // ======================================================

  async createProduct(createProductDto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (!createProductDto.sellerId && !createProductDto.enterpriseId) {
      throw new BadRequestException('Either sellerId or enterpriseId must be provided');
    }
    if (createProductDto.sellerId && createProductDto.enterpriseId) {
      throw new BadRequestException('Product can only belong to either a seller or an enterprise');
    }
    if (createProductDto.sellerId) {
      const seller = await this.prisma.seller.findUnique({
        where: { id: createProductDto.sellerId },
      });
      if (!seller) throw new NotFoundException('Seller not found');
    }
    if (createProductDto.enterpriseId) {
      const enterprise = await this.prisma.enterprise.findUnique({
        where: { id: createProductDto.enterpriseId },
      });
      if (!enterprise) throw new NotFoundException('Enterprise not found');
    }

    
    const { variants, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants || [],
        },
      },
      include: { // 👈 Giữ lại include gốc
        category: true,
        variants: true,
        enterprise: { select: { id: true, companyName: true, verified: true, officialBrand: true } },
        seller: { select: { id: true, storeName: true, verified: true } },
      },
    });
  }

  async findAllProducts(
    skip?: number,
    take?: number,
    categoryId?: string,
    sellerId?: string,
  ) {
    // 🛠️ BƯỚC SỬA QUAN TRỌNG: Xử lý giá trị mặc định an toàn
    // Nếu skip lỗi hoặc không có -> mặc định là 0
    const safeSkip = (skip && !isNaN(Number(skip))) ? Number(skip) : 0;
    
    const safeTake = (take && !isNaN(Number(take))) ? Number(take) : undefined;

    return this.prisma.product.findMany({
      skip: safeSkip, // ✅ Dùng biến an toàn này
      take: safeTake, // ✅ Dùng biến an toàn này
      where: {
        ...(categoryId && { categoryId }),
        ...(sellerId && { sellerId }),
      },
      include: {
        category: true,
        variants: true,
        enterprise: {
          select: {
            id: true,
            companyName: true,
            verified: true,
            officialBrand: true,
          },
        },
        seller: {
          select: {
            id: true,
            storeName: true,
            verified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // (Tùy chọn) Sắp xếp mới nhất lên đầu
      }
    });
  }

  async findOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({ // 👈 Giữ lại logic gốc
      where: { id },
      include: {
        category: true,
        variants: true,
        enterprise: { select: { id: true, companyName: true, verified: true, officialBrand: true } },
        seller: { select: { id: true, storeName: true, verified: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(
    id: string,
    ownerId: string, // sellerId hoặc enterpriseId
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
      throw new BadRequestException('You can only update your own products');
    }
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
        variants: true,
      },
    });
  }

  /**
   * 🚀 LOGIC MỚI: Tải ảnh lên cho sản phẩm
   */
  async uploadProductImages(
    productId: string,
    ownerId: string, // sellerId hoặc enterpriseId
    files: Express.Multer.File[],
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
      throw new BadRequestException('You can only upload images for your own products');
    }

    const uploadedImages = await Promise.all(
  files.map((file) => this.cloudinary.uploadFile(file, { folder: 'products' })), // 👈 2 tham số
);

    const imageUrls = uploadedImages.map((result) => result.secure_url);

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: {
          push: imageUrls,
        },
      },
    });
  }

  /**
   * 🚀 LOGIC MỚI: Xóa 1 ảnh của sản phẩm
   */
  async deleteProductImage(
    productId: string,
    ownerId: string, // sellerId hoặc enterpriseId
    imageUrl: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { images: true, sellerId: true, enterpriseId: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
      throw new BadRequestException('Action not allowed');
    }
    if (!product.images.includes(imageUrl)) {
      throw new NotFoundException('Image not found in product');
    }

    // 1. Xóa khỏi Cloudinary
    try {
      const publicId = this.cloudinary.getPublicIdFromUrl(imageUrl);
      if (publicId) {
        await this.cloudinary.deleteFile(publicId);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }

    // 2. Xóa khỏi CSDL
    const updatedImages = product.images.filter((url) => url !== imageUrl);
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });
  }

  /**
   * 🚀 LOGIC ĐÃ SỬA: Xóa sản phẩm (bao gồm cả ảnh)
   */
  async deleteProduct(id: string, ownerId: string) {
    // 1. Lấy sản phẩm VÀ ảnh
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { // 👈 Sửa 'include' thành 'select'
        images: true,
        sellerId: true, // 👈 Phải select cả các trường dùng để kiểm tra owner
        enterpriseId: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // 2. Kiểm tra quyền sở hữu
    if (product.sellerId !== ownerId && product.enterpriseId !== ownerId) {
      throw new BadRequestException('You can only delete your own products');
    }

    // ... (Phần còn lại của hàm giữ nguyên)
    // 3. Xóa tất cả ảnh trên Cloudinary
    if (product.images && product.images.length > 0) {
      // ...
    }

    // 4. Xóa sản phẩm khỏi CSDL
    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  // ======================================================
  // 2. CATEGORY METHODS (Nên tách ra CategoryService)
  // ======================================================

  async createCategory(createCategoryDto: CreateCategoryDto) {
    if (createCategoryDto.parentId) { // 👈 Giữ lại logic gốc
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: createCategoryDto.parentId },
      });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }
    return this.prisma.category.create({
      data: createCategoryDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({ // 👈 Giữ lại logic gốc
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findOneCategory(id: string) {
    const category = await this.prisma.category.findUnique({ // 👈 Giữ lại logic gốc
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            variants: true,
            seller: { select: { id: true, storeName: true, verified: true } },
            enterprise: { select: { id: true, companyName: true, verified: true, officialBrand: true } },
          },
        },
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.parentId) { // 👈 Giữ lại logic gốc
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: updateCategoryDto.parentId },
      });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
    }
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({ // 👈 Giữ lại logic gốc
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    if (category.children.length > 0) {
      throw new BadRequestException('Cannot delete category with existing subcategories');
    }
    if (category.products.length > 0) {
      throw new BadRequestException('Cannot delete category with existing products');
    }
    await this.prisma.category.delete({
      where: { id },
    });
    return { message: 'Category deleted successfully' };
  }

  // ======================================================
  // 3. REVIEW METHODS (Nên tách ra ReviewService)
  // ======================================================

  async createReview(
    productId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const product = await this.prisma.product.findUnique({ // 👈 Giữ lại logic gốc
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        productId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getProductReviews(productId: string) {
    const product = await this.prisma.product.findUnique({ // 👈 Giữ lại logic gốc
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}