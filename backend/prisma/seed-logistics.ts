import { PrismaClient, OrderStatus, LogisticsStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

// Khai báo tạm để TypeScript không báo lỗi thiếu biến môi trường Node
declare var process: any;

const prisma = new PrismaClient();

async function main() {
  console.log('🚚 --- BẮT ĐẦU SEED ĐƠN HÀNG LOGISTICS ---');

  // 1. Lấy danh sách tất cả các đơn vị vận chuyển (Logistics Partners)
  const partners = await prisma.logisticsPartner.findMany();
  if (partners.length === 0) {
    console.error('❌ Không tìm thấy đơn vị vận chuyển nào! Vui lòng tạo đối tác logistics trước.');
    return;
  }
  console.log(`✅ Tìm thấy ${partners.length} đối tác vận chuyển.`);

  // 2. Tìm một User bất kỳ để làm "người mua" cho các đơn test này
  const user = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
  if (!user) {
    console.error('❌ Không tìm thấy Khách hàng nào! Vui lòng chạy seed user trước.');
    return;
  }

  // 3. Tìm một Sản phẩm bất kỳ để làm OrderItem (Tránh lỗi đơn hàng rỗng)
  const product = await prisma.product.findFirst({ include: { variants: true } });

  // 4. Bắt đầu tạo 9 đơn hàng cho MỖI đối tác vận chuyển
  for (const partner of partners) {
    console.log(`📦 Đang tạo 9 đơn hàng chờ phân công cho: ${partner.name}...`);

    for (let i = 1; i <= 9; i++) {
      const subtotal = 150000 + (i * 10000); // Random giá tiền từ 160k
      const shippingFee = partner.baseRate || 30000;
      const totalAmount = subtotal + shippingFee;

      // Chuẩn bị dữ liệu OrderItem nếu có sản phẩm trong DB
      const orderItemsInput = product && product.variants.length > 0 ? {
        create: [{
          productId: product.id,
          variantId: product.variants[0].id,
          quantity: 1,
          price: product.variants[0].price,
          sellerId: product.sellerId,
          enterpriseId: product.enterpriseId
        }]
      } : undefined;

      // Tạo Order chính kèm theo LogisticsOrder trong cùng 1 lệnh (Nested Writes)
      await prisma.order.create({
        data: {
          userId: user.id,
          status: OrderStatus.PROCESSING, // Đơn đã thanh toán/xác nhận xong, đang chờ giao
          subtotal: subtotal,
          shippingFee: shippingFee,
          totalDiscount: 0,
          totalAmount: totalAmount,
          
          payment: {
            create: {
              method: PaymentMethod.COD,
              status: PaymentStatus.PENDING,
              amount: totalAmount
            }
          },

          orderItems: orderItemsInput,

          // 🔥 ĐÃ FIX: Đổi 'logisticsOrders' thành 'logisticsOrder' (số ít) và truyền trực tiếp Object
          logisticsOrder: {
            create: {
              logisticsPartnerId: partner.id,
              trackingCode: `CAN-${partner.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-5)}${i}`,
              status: LogisticsStatus.CREATED,
              pickupAddress: "Kho trung tâm Beauty&Skincare - Quận 1, TP.HCM",
              deliveryAddress: `Số ${i * 12}, Đường Nguyễn Huệ, Quận 1, TP.HCM`
            }
          }
        }
      });
    }
    console.log(`✅ Đã xong 9 đơn cho ${partner.name}`);
  }

  console.log('🎉 HOÀN TẤT! Dữ liệu đã sẵn sàng cho Dashboard Logistics.');
}

// Chuyển sang dùng async function bọc ngoài kết hợp try/catch/finally
const runSeed = async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

runSeed();