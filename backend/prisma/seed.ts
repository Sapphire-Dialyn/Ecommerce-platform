import { PrismaClient, Role, ShipperStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// ✅ Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// --- HÀM HELPER ---
async function uploadImage(url: string, folder = 'hasaki_seed') {
  try {
    const res = await cloudinary.uploader.upload(url, { folder });
    return res.secure_url;
  } catch (err) {
    console.log(`⚠️ Lỗi upload ảnh (dùng link gốc): ${url}`);
    return url;
  }
}

// --- DỮ LIỆU MẪU (MOCK DATA) ---

const AVATARS = {
  admin1: 'https://i.pinimg.com/736x/b9/c6/eb/b9c6ebc51026c54b08cbc5d9937f8247.jpg',
  admin2: 'https://i.pinimg.com/736x/b9/c6/eb/b9c6ebc51026c54b08cbc5d9937f8247.jpg',
  brands: {
    nivea: 'https://i.pinimg.com/1200x/3e/37/ca/3e37ca94448c0218a178e966b3207657.jpg',
    laroche: 'https://thietkelogo.mondial.vn/wp-content/uploads/2024/01/La-Roche-Posay-Logo.jpg',
    cocoon: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/202667140005381.6239fc9e2048c.png',
  },
  sellers: [
    'https://i.pinimg.com/736x/bc/57/69/bc5769ac0225bcc96c923957339603ef.jpg',
    'https://i.pinimg.com/736x/b9/9f/a5/b99fa5e3c5a558f6a4c19ce4f518a5ff.jpg',
  ],
  logistics: {
    ghn: 'https://dongphucvina.vn/wp-content/uploads/2023/05/Logo-GHN-DongphucVina.vn1_.png',
    ghtk: 'https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-V.png',
    dhl: 'https://www.dhlexpress.nl/sites/default/files/styles/grid_image_1x/public/content/images/DHL-express-logo-recatangle.png?itok=vLlxrBL0',
  }
};

// --- SPECS RIÊNG CHO KOLMAR ---
const KOLMAR_SPECS = {
  "Công dụng": "Kem dưỡng da toàn thân, giúp bổ sung độ ẩm cần thiết và dưỡng sáng da, giúp làm mềm mịn da.",
  "Hướng dẫn sử dụng": "Lấy một lượng vừa đủ sản phẩm thoa đều lên da và mát-xa nhẹ nhàng.",
  "Thành phần": "Water, Glycerin, Caprylic/Capric Triglyceride, 1,2-Hexanediol, ...",
  "Thể tích thực": "300 ml (10 fl oz)",
  "Cảnh báo": "Ngưng sử dụng nếu kích ứng. Chỉ sử dụng ngoài da.",
  "Xuất xứ": "Hàn Quốc",
  "Nhà sản xuất": "Kolmar UX Co., Ltd",
  "Số phiếu công bố": "273318/25/CBMP-QLD"
};

// --- DỮ LIỆU SẢN PHẨM CHI TIẾT ---
const PRODUCTS_DATA = {
  nivea: [
    {
      name: 'Sữa Rửa Mặt NIVEA Men Giúp Sáng Da & Kiểm Soát Nhờn',
      desc: 'Công thức chứa hệ dưỡng sáng Whitinat cùng 10 loại vitamin giúp nuôi dưỡng da từ sâu bên trong, mang lại làn da sáng khỏe, sạch nhờn.',
      images: ['https://cdn.hstatic.net/products/200000868185/nivea__1__9d88c5fb23f44681b805f1a122ba6ae9_master.jpg'],
      categoryKey: 'skincare',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "NIVEA",
        "Xuất xứ thương hiệu": "Đức",
        "Sản xuất tại": "Thái Lan",
        "Công dụng": "Làm sạch sâu, kiểm soát nhờn, dưỡng sáng da",
        "Loại da phù hợp": "Da dầu, da hỗn hợp thiên dầu",
        "Dung tích": "100g"
      },
      variants: [
        { size: '50g', price: 49000, stock: 100 },
        { size: '100g', price: 89000, stock: 200 }
      ]
    },
    {
      name: 'Lăn Ngăn Mùi NIVEA Ngọc Trai Sáng Mịn',
      desc: 'Chiết xuất ngọc trai gấp 4 lần giúp dưỡng vùng da dưới cánh tay sáng mịn, mềm mại. Hương thơm quyến rũ giữ lâu suốt 48h.',
      images: ['https://batos.vn/images/products/2023/06/16/screenshot-1686917204-553.png'],
      categoryKey: 'body',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "NIVEA",
        "Xuất xứ": "Đức",
        "Công dụng": "Khử mùi, giảm tiết mồ hôi, dưỡng trắng",
        "Mùi hương": "Hương ngọc trai quyến rũ",
        "Dung tích": "50ml"
      },
      variants: [
        { size: '25ml', price: 35000, stock: 50 },
        { size: '50ml', price: 65000, stock: 150 }
      ]
    },
    {
      name: 'Nước Tẩy Trang NIVEA Micellair Skin Breathe',
      desc: 'Công nghệ Mi-xen cải tiến giúp làm sạch sâu lớp trang điểm bền màu, khó trôi mà không gây khô da.',
      images: ['https://product.hstatic.net/1000269689/product/nttnnn_590a5137b85a48e288a04d95e9f7f43a.jpg'],
      categoryKey: 'skincare',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "NIVEA",
        "Xuất xứ": "Đức",
        "Loại da phù hợp": "Mọi loại da, kể cả da nhạy cảm",
        "Kết cấu": "Dạng nước",
        "Công dụng": "Tẩy trang, làm sạch bụi bẩn, cấp ẩm",
        "Thành phần": "Không chứa cồn (Alcohol Free)"
      },
      variants: [
        { size: '125ml', price: 89000, stock: 80 },
        { size: '200ml', price: 139000, stock: 120 }
      ]
    }
  ],
  laroche: [
    {
      name: 'Gel Rửa Mặt La Roche-Posay Cho Da Dầu Nhạy Cảm',
      desc: 'Effaclar Purifying Foaming Gel giúp ngăn ngừa và hỗ trợ điều trị mụn tối đa với kết cấu dạng gel trong dễ dàng tạo bọt.',
      images: ['https://assets-hebela.cdn.vccloud.vn/dict/1/osnitinthiatshtrrs20221101222912effaclar-purifying-foaming-gel-for-oily-sensitive-skin/igsiismsttnrnhdami20221101222919effaclar-purifying-foaming-gel-for-oily-sensitive-skin-4.jpg'],
      categoryKey: 'skincare',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "La Roche-Posay",
        "Xuất xứ thương hiệu": "Pháp",
        "Độ pH": "5.5 (Trung tính)",
        "Thành phần hoạt tính": "Nước khoáng La Roche-Posay, Kẽm PCA",
        "Công dụng": "Làm sạch dầu thừa, bụi bẩn, giảm mụn đầu đen",
        "Loại da phù hợp": "Da dầu, da mụn, da nhạy cảm"
      },
      variants: [
        { size: '50ml', price: 185000, stock: 50 },
        { size: '200ml', price: 385000, stock: 100 },
        { size: '400ml', price: 560000, stock: 30 }
      ]
    },
    {
      name: 'Kem Dưỡng La Roche-Posay Cicaplast Baume B5+',
      desc: 'Phiên bản nâng cấp mới nhất giúp phục hồi da sau 1 giờ, bảo vệ hàng rào độ ẩm da với công nghệ cải tiến Tribioma.',
      images: ['https://media.hcdn.vn/catalog/product/g/o/google-shopping-kem-duong-la-roche-posay-giup-phuc-hoi-da-da-cong-dung-100ml-1677144541_img_450x450_31d6f9_fit_center.jpg'],
      categoryKey: 'skincare',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "La Roche-Posay",
        "Xuất xứ": "Pháp",
        "Công dụng": "Phục hồi da, làm dịu da kích ứng, mẩn đỏ",
        "Thành phần chính": "Panthenol (B5) 5%, Madecassoside",
        "Đối tượng sử dụng": "Người lớn, trẻ em và trẻ sơ sinh"
      },
      variants: [
        { size: '40ml', price: 390000, stock: 200 },
        { size: '100ml', price: 630000, stock: 80 }
      ]
    }
  ],
  cocoon: [
    {
      name: 'Bơ Cà Phê Đắk Lắk Làm Sạch Da Chết Cơ Thể',
      desc: 'Sự kết hợp giữa hạt cà phê Đắk Lắk nguyên chất xay nhuyễn, hòa quyện cùng bơ cacao Tiền Giang giúp làm sạch tế bào chết hiệu quả.',
      images: ['https://myphamthuanchay.com/images/product/bo-ca-phe-dak-lak-lam-sach-da-chet-cocoon-da-mat-150ml-co-the-200ml.jpg'],
      categoryKey: 'body',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "Cocoon",
        "Xuất xứ": "Việt Nam",
        "Thành phần chính": "Hạt cà phê Đắk Lắk, Bơ ca cao",
        "Công dụng": "Làm sạch da chết, giúp da đều màu",
        "Cam kết": "Không hạt vi nhựa, Không thử nghiệm trên động vật"
      },
      variants: [
        { size: '200ml', price: 125000, stock: 500 },
        { size: '600ml (Túi Refill)', price: 295000, stock: 100 }
      ]
    },
    {
      name: 'Nước Bí Đao Cân Bằng Da Cocoon',
      desc: 'Nước bí đao giúp cân bằng độ pH, giảm dầu thừa và hỗ trợ giảm mụn ẩn.',
      images: ['https://image.cocoonvietnam.com/uploads/slide_3_ae195d3404.jpg'],
      categoryKey: 'skincare',
      // ✅ Đã thêm specs
      specs: {
        "Thương hiệu": "Cocoon",
        "Xuất xứ": "Việt Nam",
        "Thành phần chính": "Bí đao, Rau má, Tràm trà",
        "Công dụng": "Cân bằng pH, kiểm soát dầu, làm dịu nốt mụn",
        "Loại da phù hợp": "Da dầu, da mụn"
      },
      variants: [
        { size: '140ml', price: 175000, stock: 150 },
        { size: '310ml', price: 295000, stock: 60 }
      ]
    }
  ],
  makeup_seller: [
    {
      name: 'Kem Dưỡng Da Toàn Thân Anok Smoothing And Hydrating Body Lotion',
      desc: 'Giúp bổ sung độ ẩm cần thiết và dưỡng sáng da, giúp làm mềm mịn da.',
      specs: KOLMAR_SPECS, 
      images: ['https://kolmar.vn/wp-content/uploads/2025/09/ANOK-SOY-KERA-LHA-BODY-LOTION.png'],
      categoryKey: 'makeup',
      variants: [
        { color: 'Daffodil', price: 250000, stock: 50 },
        { color: 'Taupe', price: 250000, stock: 40 },
        { color: 'Going Right', price: 250000, stock: 30 }
      ]
    },
    {
      name: 'Mascara Maybelline Lash Sensational',
      desc: 'Làm dài và dày mi gấp 16 lần, không lem không trôi.',
      images: ['https://bonita.vn/wp-content/uploads/2022/12/315633396_851191289648592_8990646137694611307_n.jpg'],
      categoryKey: 'makeup',
      // ✅ Thêm specs cơ bản cho Mascara
      specs: {
          "Thương hiệu": "Maybelline",
          "Xuất xứ": "Mỹ",
          "Công dụng": "Làm dày và dài mi",
          "Đặc tính": "Chống nước (Waterproof)"
      },
      variants: [
        { color: 'Đen', price: 180000, stock: 100 }
      ]
    }
  ]
};

// --- MAIN SEED FUNCTION ---
async function main() {
  console.log('💄 Bắt đầu seed dữ liệu...');

  // 1. Tạo Categories
  const catSkincare = await prisma.category.create({ data: { name: 'Chăm sóc da mặt' } });
  const catMakeup = await prisma.category.create({ data: { name: 'Trang điểm' } });
  const catBody = await prisma.category.create({ data: { name: 'Chăm sóc cơ thể' } });

  const categoriesMap: any = {
    skincare: catSkincare.id,
    makeup: catMakeup.id,
    body: catBody.id,
  };
  console.log('✅ Categories seeded');

  // 2. Tạo Admin
  const adminEmails = ['admin1@shop.com', 'admin2@shop.com'];
  for (const email of adminEmails) {
    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password: await bcrypt.hash('123456', 10),
            name: email === 'admin1@shop.com' ? 'Liễu Như Yên' : 'Bạch Ngưng Băng',
            role: Role.ADMIN,
            avatar: await uploadImage(AVATARS[email === 'admin1@shop.com' ? 'admin1' : 'admin2'], 'admin_avatars'),
        }
    });
  }
  console.log('✅ Admin seeded');

  // 3. Tạo Enterprise (Brands)
  const brands = [
    { code: 'nivea', name: 'NIVEA Vietnam', tax: 'NIV888', img: AVATARS.brands.nivea },
    { code: 'laroche', name: 'La Roche-Posay', tax: 'LRP999', img: AVATARS.brands.laroche },
    { code: 'cocoon', name: 'Cocoon Vietnam', tax: 'COC777', img: AVATARS.brands.cocoon },
  ];

  for (const brand of brands) {
    // Tạo User cho Brand
    const user = await prisma.user.create({
      data: {
        email: `${brand.code}@enterprise.com`,
        password: await bcrypt.hash('123456', 10),
        name: brand.name,
        role: Role.ENTERPRISE,
        avatar: await uploadImage(brand.img, 'enterprise_avatars'),
      },
    });

    // Tạo Enterprise Profile
    const enterprise = await prisma.enterprise.create({
      data: {
        userId: user.id,
        companyName: brand.name,
        taxCode: brand.tax,
        verified: true,
        officialBrand: true,
        rating: 4.9,
        logoUrl: await uploadImage(brand.img, 'enterprise_logos')
      },
    });

    // Tạo Sản phẩm cho Brand
    const products = PRODUCTS_DATA[brand.code as keyof typeof PRODUCTS_DATA];
    if (products) {
      for (const prod of products) {
        const mainImage = await uploadImage(prod.images[0], 'products');
        
        await prisma.product.create({
          data: {
            name: prod.name,
            description: prod.desc,
            // 👇 NẠP SPECS VÀO DB (Quan trọng)
            specifications: prod.specs,
            categoryId: categoriesMap[prod.categoryKey],
            enterpriseId: enterprise.id,
            images: [mainImage],
            variants: {
              create: prod.variants.map((v) => ({
                size: v.size,
                color: v.color, 
                price: v.price,
                stock: v.stock,
                sku: `${brand.code.toUpperCase()}-${Math.floor(Math.random() * 10000)}`
              })),
            },
          },
        });
      }
    }
  }
  console.log('✅ Enterprise & Products seeded');

  // 4. Tạo Seller
  const sellersData = ['Vường Sắn Đẹp', 'Bánh Vẽ Khổng Lồ', 'Shop Liễu Tổng'];
  const brandProductsSource = [
      ...PRODUCTS_DATA.nivea, 
      ...PRODUCTS_DATA.laroche, 
      ...PRODUCTS_DATA.cocoon
  ];
  for (let i = 0; i < sellersData.length; i++) {
    const user = await prisma.user.create({
      data: {
        email: `seller${i + 1}@shop.com`,
        password: await bcrypt.hash('123456', 10),
        name: sellersData[i],
        role: Role.SELLER,
        avatar: await uploadImage(AVATARS.sellers[i % AVATARS.sellers.length], 'seller_avatars'),
      },
    });

    const seller = await prisma.seller.create({
      data: {
        userId: user.id,
        storeName: sellersData[i],
        verified: true,
        rating: 4.0 + (Math.random() * 1.0),
        logoUrl: await uploadImage(AVATARS.sellers[i % AVATARS.sellers.length], 'seller_logos'),
      },
    });

    // Tạo sản phẩm cho Seller
    const makeupProds = PRODUCTS_DATA.makeup_seller;
    for (const prod of makeupProds) {
        const mainImage = await uploadImage(prod.images[0], 'seller_products');
        await prisma.product.create({
            data: {
                name: `[${sellersData[i]}] ${prod.name}`, // Đánh dấu tên shop
                description: prod.desc,
                specifications: prod.specs,
                categoryId: categoriesMap[prod.categoryKey],
                sellerId: seller.id,
                images: [mainImage],
                variants: {
                    create: prod.variants.map((v) => ({
                        color: v.color,
                        price: v.price,
                        stock: 50,
                        sku: `SELL${i}-MK-${Math.floor(Math.random() * 10000)}`
                    }))
                }
            }
        });
    }

    const shuffledBrands = brandProductsSource.sort(() => 0.5 - Math.random()); // Xáo trộn danh sách
    const selectedProducts = shuffledBrands.slice(0, 5); // Lấy 5 món ngẫu nhiên

    for (const prod of selectedProducts) {
        const imageLink = await uploadImage(prod.images[0], 'products'); 
        const priceMultiplier = 0.9 + (Math.random() * 0.2); // 0.9 -> 1.1

        await prisma.product.create({
            data: {
                name: prod.name, // Giữ nguyên tên gốc (hoặc thêm tên shop nếu thích)
                description: prod.desc,
                specifications: prod.specs, // Dùng chung specs với Brand
                categoryId: categoriesMap[prod.categoryKey],
                sellerId: seller.id, // 👈 Quan trọng: Link với Seller, không phải Enterprise
                images: [imageLink],
                variants: {
                    create: prod.variants.map((v: any) => ({
                        size: v.size,
                        color: v.color,
                        // Giá biến động theo Shop
                        price: Math.floor(v.price * priceMultiplier / 1000) * 1000, 
                        stock: Math.floor(Math.random() * 50) + 10, // Kho hàng ít hơn Brand
                        sku: `SELL${i}-BR-${Math.floor(Math.random() * 10000)}`
                    }))
                }
            }
        });
    }
  }
  console.log('✅ Sellers & Products seeded');

  const logisticsList = [
    { name: 'GHN Express', code: 'ghn', img: AVATARS.logistics.ghn },
    { name: 'GHTK', code: 'ghtk', img: AVATARS.logistics.ghtk },
    { name: 'DHL Logistics', code: 'dhl', img: AVATARS.logistics.dhl },
  ];

  for (const log of logisticsList) {
    const user = await prisma.user.create({
      data: {
        email: `${log.code}@logistics.com`,
        password: await bcrypt.hash('123456', 10),
        name: log.name,
        role: Role.LOGISTICS,
        avatar: await uploadImage(log.img, 'logistics_avatars'),
      },
    });

    const partner = await prisma.logisticsPartner.create({
      data: {
        userId: user.id,
        name: log.name,
        baseRate: 25000,
        verified: true,
        rating: 4.8,
      },
    });

    // Tạo Shippers
    for (let k = 1; k <= 3; k++) {
      const shipUser = await prisma.user.create({
        data: {
          email: `${log.code}_shipper${k}@mail.com`,
          password: await bcrypt.hash('123456', 10),
          name: `${log.name} Shipper ${k}`,
          phone: `090${k}888${Math.floor(Math.random() * 100)}`,
          role: Role.SHIPPER,
          avatar: await uploadImage('https://media.tenor.com/kuvczltMQy0AAAAe/yoru.png', 'shipper_avatars'),
        },
      });

      await prisma.shipper.create({
        data: {
          userId: shipUser.id,
          logisticsPartnerId: partner.id,
          status: ShipperStatus.AVAILABLE,
          rating: 4.5,
        },
      });
    }
  }
  console.log('✅ Logistics & Shippers seeded');

  console.log('🎉 Hoàn tất seed dữ liệu!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });