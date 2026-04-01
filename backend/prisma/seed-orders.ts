import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('📦 --- BẮT ĐẦU SEED RIÊNG CHO ORDER ---');

  // 1. KIỂM TRA SẢN PHẨM TỒN TẠI
  const allProducts = await prisma.product.findMany({
    include: { variants: true },
    take: 25 
  });

  if (allProducts.length === 0) {
    console.error('❌ Không tìm thấy sản phẩm nào! Vui lòng chạy "npx prisma db seed" trước.');
    return;
  }
  console.log(`✅ Đã tìm thấy ${allProducts.length} sản phẩm để tạo đơn.`);

  const passwordHash = await bcrypt.hash('123456', 10);

  // 2. TÌM HOẶC TẠO TÀI KHOẢN CỦA BẠN (customer1@shop.com)
  const myEmail = 'customer1@shop.com';
  const myAvatar = `https://ui-avatars.com/api/?name=Khach+Hang+VIP&background=f0abfc&color=701a75&bold=true`;
  
  const myUser = await prisma.user.upsert({
    where: { email: myEmail },
    update: {
      avatar: myAvatar // 👈 Cập nhật avatar nếu user đã tồn tại
    },
    create: {
      email: myEmail,
      password: passwordHash,
      name: 'Khách Hàng VIP',
      role: Role.CUSTOMER,
      phone: '0911223344',
      isVerified: true,
      avatar: myAvatar
    }
  });
  console.log(`👤 Đã xác định tài khoản chính: ${myUser.email}`);

  // 3. TẠO 10 KHÁCH HÀNG ẢO
  const fakeCustomers = [];
  console.log('👥 Đang tạo 10 khách hàng ảo...');
  for (let i = 1; i <= 10; i++) {
    const email = `test_user_${i}@example.com`;
    const name = `Khách Test ${i}`;
    const testAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        avatar: testAvatar // 👈 Đảm bảo cập nhật avatar cho các user cũ
      },
      create: {
        email,
        password: passwordHash,
        name: name,
        role: Role.CUSTOMER,
        phone: `098877766${i}`,
        isVerified: true,
        avatar: testAvatar
      }
    });
    fakeCustomers.push(user);
  }

  // --- HÀM HELPER TẠO ĐƠN HÀNG ---
  const statuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

  const createOrderForUser = async (user: any, count: number) => {
    for (let i = 0; i < count; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const itemCount = Math.floor(Math.random() * 3) + 1;
        const orderItemsData = [];
        let subtotal = 0;

        for (let k = 0; k < itemCount; k++) {
            const product = allProducts[Math.floor(Math.random() * allProducts.length)];
            const variant = product.variants[0];
            if (!variant) continue;

            const quantity = Math.floor(Math.random() * 2) + 1;
            const itemPrice = variant.price;
            subtotal += itemPrice * quantity;

            orderItemsData.push({
                productId: product.id,
                variantId: variant.id,
                quantity: quantity,
                price: itemPrice,
                sellerId: product.sellerId,
                enterpriseId: product.enterpriseId
            });
        }

        if (orderItemsData.length === 0) continue;

        const shippingFee = 30000;
        const totalAmount = subtotal + shippingFee;

        await prisma.order.create({
            data: {
                userId: user.id,
                status: randomStatus,
                subtotal: subtotal,
                shippingFee: shippingFee,
                totalDiscount: 0,
                totalAmount: totalAmount,
                payment: {
                    create: {
                        method: PaymentMethod.COD,
                        status: randomStatus === 'DELIVERED' ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
                        amount: totalAmount
                    }
                },
                orderItems: {
                    create: orderItemsData
                }
            }
        });
    }
  };

  // 4. TẠO ĐƠN HÀNG
  const myOrderCount = Math.floor(Math.random() * 3) + 1; 
  console.log(`🎁 Đang tạo ${myOrderCount} đơn hàng cho ${myEmail}...`);
  await createOrderForUser(myUser, myOrderCount);

  console.log('📦 Đang tạo 20 đơn hàng cho khách ảo...');
  for (let i = 0; i < 20; i++) {
      const randomCustomer = fakeCustomers[Math.floor(Math.random() * fakeCustomers.length)];
      await createOrderForUser(randomCustomer, 1);
  }

  console.log('🎉 XONG! Dữ liệu đã được làm mới với Avatar đầy đủ.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });