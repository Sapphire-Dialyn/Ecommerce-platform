"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const cloudinary_1 = require("cloudinary");
const prisma = new client_1.PrismaClient();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function uploadImage(url, folder = 'hasaki_seed') {
    try {
        const res = await cloudinary_1.v2.uploader.upload(url, { folder });
        return res.secure_url;
    }
    catch (err) {
        console.log(`⚠️ Lỗi upload ảnh (dùng link gốc): ${url}`);
        return url;
    }
}
const AVATARS = {
    admin1: 'https://i.pinimg.com/736x/b9/c6/eb/b9c6ebc51026c54b08cbc5d9937f8247.jpg',
    admin2: 'https://i.pinimg.com/1200x/6a/79/ca/6a79caad39b9520bcd7458c6ab226b0c.jpg',
    brands: {
        nivea: 'https://i.pinimg.com/1200x/3e/37/ca/3e37ca94448c0218a178e966b3207657.jpg',
        laroche: 'https://thietkelogo.mondial.vn/wp-content/uploads/2024/01/La-Roche-Posay-Logo.jpg',
        cocoon: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/202667140005381.6239fc9e2048c.png',
        givenchy: 'https://vinadesign.vn/uploads/images/2023/05/givenchy-logo-vinadesign-22-14-59-41.jpg',
        nacific: 'https://m.media-amazon.com/images/I/613RrhR-ptL._AC_UF1000,1000_QL80_.jpg',
        maybelline: 'https://logowik.com/content/uploads/images/maybelline-new-york3190.logowik.com.webp',
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
const KOLMAR_SPECS = {
    "Công dụng": "Kem dưỡng da toàn thân, giúp bổ sung độ ẩm cần thiết và dưỡng sáng da.",
    "Xuất xứ": "Hàn Quốc",
    "Nhà sản xuất": "Kolmar UX Co., Ltd"
};
const PRODUCTS_DATA = {
    nivea: [
        {
            name: 'Sữa Rửa Mặt NIVEA Men Giúp Sáng Da & Kiểm Soát Nhờn',
            desc: 'Công thức chứa hệ dưỡng sáng Whitinat cùng 10 loại vitamin.',
            images: ['https://cdn.hstatic.net/products/200000868185/nivea__1__9d88c5fb23f44681b805f1a122ba6ae9_master.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "NIVEA", "Xuất xứ": "Đức" },
            variants: [{ size: '100g', price: 89000, stock: 200 }]
        }
    ],
    laroche: [
        {
            name: 'Gel Rửa Mặt La Roche-Posay Cho Da Dầu Nhạy Cảm',
            desc: 'Effaclar Purifying Foaming Gel giúp ngăn ngừa mụn.',
            images: ['https://assets-hebela.cdn.vccloud.vn/dict/1/osnitinthiatshtrrs20221101222912effaclar-purifying-foaming-gel-for-oily-sensitive-skin/igsiismsttnrnhdami20221101222919effaclar-purifying-foaming-gel-for-oily-sensitive-skin-4.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "La Roche-Posay", "Xuất xứ": "Pháp" },
            variants: [{ size: '400ml', price: 560000, stock: 30 }]
        }
    ],
    cocoon: [
        {
            name: 'Bơ Cà Phê Đắk Lắk Làm Sạch Da Chết Cơ Thể',
            desc: 'Sự kết hợp giữa hạt cà phê Đắk Lắk nguyên chất.',
            images: ['https://myphamthuanchay.com/images/product/bo-ca-phe-dak-lak-lam-sach-da-chet-cocoon-da-mat-150ml-co-the-200ml.jpg'],
            categoryKey: 'body',
            specs: { "Thương hiệu": "Cocoon", "Xuất xứ": "Việt Nam" },
            variants: [{ size: '200ml', price: 125000, stock: 500 }]
        }
    ],
    givenchy: [
        {
            name: 'Phấn Phủ Bột Givenchy Prisme Libre Loose Powder',
            desc: 'Sự kết hợp của 4 sắc thái màu pastel giúp hiệu chỉnh tông da, mang lại lớp nền mịn màng, rạng rỡ.',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dw4b96224e/images/P000493/3274872500778_P000493_PL-LOOSE-POWDER-4X3G-N15-XMAS25-WW_OPEN_2_a_0.png?sw=1200&sh=1200&strip=false'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Trọng lượng": "12g" },
            variants: [{ color: '01 Mousseline Pastel', price: 1450000, stock: 20 }]
        },
        {
            name: 'LE SOIN NOIR PERFECTING OIL',
            desc: 'Dầu dưỡng săn chắc hoàn hảo và tươi trẻ hơn. Siêu thân thiện cho làn da nhạy cảm.',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dw2c637d86/images/P000375/3274872487222_P000375_LSN-S2-25-OIL_30ML_a_0.png?sw=1200&sh=1200&strip=false'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Dung tích": "30ml" },
            variants: [{ color: '01 Mousseline Pastel', price: 15450000, stock: 20 }]
        },
        {
            name: 'LE SOIN NOIR LOTION',
            desc: 'Sữa dưỡng thể phục hồi đặc biệt mang lại cảm giác thoải mái .',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dw272a7cf7/images/P056155/PDP_LOTION_ESSENCE_Description_Desktop_1092x1458_2.jpg?sw=1200&sh=1200&strip=false'],
            categoryKey: 'body',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Dung tích": "150ml" },
            variants: [{ color: '01 Mousseline Pastel', price: 8450000, stock: 20 }]
        },
        {
            name: 'LE SOIN NOIR MAKEUP REMOVER',
            desc: 'Tẩy trang oil-in-gel phục hồi da . Nước tẩy trang loại bỏ mọi lớp trang điểm và tạp chất hàng ngày, mang đến trải nghiệm làm sạch độc đáo.​',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dwba7fb189/images/P056397/3274872441163_P056397_LSN-HUILE-EN-GEL-DEMAQUILLANTE_125ml_a_0.png?sw=1200&sh=1200&strip=false'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Dung tích": "125ml" },
            variants: [{ color: '01 Mousseline Pastel', price: 22450000, stock: 20 }]
        },
        {
            name: 'LE ROUGE INTERDIT SATIN',
            desc: 'Son môi màu sắc rạng rỡ và dưỡng ẩm lâu trôi.',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dw8d223b5f/images/P000251/STARIFICATION_PACK_2_1x1_6.jpg?sw=1200&sh=1200&strip=false'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Trọng lượng": "12g" },
            variants: [{ color: '01 Mousseline Pastel', price: 945000, stock: 20 }]
        },
        {
            name: 'PRISME LIBRE SKIN-CARING CONCEALER',
            desc: 'Kem che khuyết điểm đa năng chăm sóc da 24h.',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dwf76e25e9/images/P087572/3274872446083_P087572_PL-CONCEALER-23_11ML_N80_d_3.png?sw=1200&sh=1200&strip=false'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Trọng lượng": "30g" },
            variants: [{ color: '01 Mousseline Pastel', price: 1450000, stock: 20 }]
        },
        {
            name: 'LE SOIN NOIR EYE CREAM',
            desc: 'Kem dưỡng vùng da quanh mắt săn chắc và mịn màng.',
            images: ['https://www.givenchybeauty.com/dw/image/v2/BBZW_PRD/on/demandware.static/-/Sites-givenchy-beauty-master/default/dw72a0dc15/images/F30100140/3274872427501_P056105_LSN-22-CREME--YEUX_20ML_d_4%20(1).png?sw=800&sh=800&strip=false'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Givenchy", "Xuất xứ": "Pháp", "Dung tích": "20ml" },
            variants: [{ color: '01 Mousseline Pastel', price: 1450000, stock: 20 }]
        },
    ],
    nacific: [
        {
            name: 'Tinh Chất Nacific Fresh Herb Origin Serum',
            desc: 'Serum "châm chích" nổi tiếng giúp se khít lỗ chân lông, giảm mụn và làm sáng da với chiết xuất thảo mộc.',
            images: ['https://product.hstatic.net/200000370463/product/10_f65e5d07753c423a84c724ef5b3114c0_1024x1024.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Nacific", "Xuất xứ": "Hàn Quốc", "Dung tích": "50ml" },
            variants: [{ size: '75ml', price: 435000, stock: 100 }]
        },
        {
            name: 'Kem dưỡng Nacific Fresh Cica Plus Clear Cream',
            desc: 'Kem Dưỡng Phục Hồi Da Chiết Xuất Rau Má NACIFIC Fresh Cica Plus Clear Cream với chiết xuất chính chiết xuất từ rau má giúp giải quyết 4 vấn đề của da gồm: Da gặp vấn đề về mụn, da nhạy cảm, lỗ chân lông, da ửng đỏ. Từ đó cải thiện tình trạng mụn hiệu quả mang đến làn da sạch khỏe và mịn màng.',
            images: ['https://product.hstatic.net/200000370463/product/26_b613ff8d4c624f45aa0b62a74e0c51c7_1024x1024.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Nacific", "Xuất xứ": "Hàn Quốc", "Dung tích": "50ml" },
            variants: [{ size: '75ml', price: 435000, stock: 100 }]
        },
        {
            name: 'Nacific Nước hoa hồng Origin Red Salicylic Acid Toner 150ml',
            desc: 'Dùng sau bước serum như là một chất trung hòa. Vừa tăng hiệu quả làm sạch, vừa làm dịu da sau quá trình "peel" và đồng thời tăng khả năng thẩm thấu của các bước tiếp theo.',
            images: ['https://product.hstatic.net/200000370463/product/z3598345445429_ae797bfa384c993aa7bb5fbda99eb984_65312dce6859499a976c8e59aa09dc93_1024x1024.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Nacific", "Xuất xứ": "Hàn Quốc", "Dung tích": "50ml" },
            variants: [{ size: '150ml', price: 390000, stock: 100 }]
        },
        {
            name: 'Kem dưỡng Nacific Real Floral Air Cream Calendula',
            desc: 'Kem Dưỡng Ẩm Làm Dịu Da Chiết Xuất Hoa Cúc NACIFIC Real Floral Air Cream Calendula với thành phần chính chứa chiết xuất từ hoa cúc giúp tái tạo và làm dịu da hiệu quả. Ngoài ra còn chứa nhiều thành phần dưỡng ẩm tuyệt với như HA, Betaine, Glycerin cho làn da căng mướt.',
            images: ['https://product.hstatic.net/200000370463/product/5_baf315103bf94ccc80f083cdfd814885_1024x1024.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Nacific", "Xuất xứ": "Hàn Quốc", "Dung tích": "50ml" },
            variants: [{ size: '100ml', price: 435000, stock: 100 }]
        },
        {
            name: 'Kem dưỡng Nacific Pink AHABHA Cream',
            desc: 'Kem Dưỡng Cấp Ẩm, Làm Sáng Da NACIFIC Pink AHABHA Cream với thành phần chính là AHA & BHA giúp loại bỏ tế bào chết nhẹ nhàng, cải thiện làn da xỉn màu, ngoài ra hết hợp các thành phần thiên nhiên có khả năng dưỡng ẩm cho làn sáng mịn rạng rỡ',
            images: ['https://product.hstatic.net/200000370463/product/20_d658eb60b34b45c89b56850eabb04adc_1024x1024.jpg'],
            categoryKey: 'skincare',
            specs: { "Thương hiệu": "Nacific", "Xuất xứ": "Hàn Quốc", "Dung tích": "50ml" },
            variants: [{ size: '50ml', price: 435000, stock: 100 }]
        }
    ],
    maybelline: [
        {
            name: 'SON KEM LÌ MAYBELLINE SUPER STAY MATTE INK MUSIC COLLECTION LIPSTICK',
            desc: 'Son Kem Lì Maybelline Super Stay Matte Ink Music Collection Lipstick là sản phẩm phiên bản giới hạn thuộc BST Âm nhạc với những màu son siêu HOT, phù hợp cho mùa thu đông năm 2023. Chất son lì, lâu trôi, giữ màu lên đến 16h, hạn chế lem màu cực tốt. Hiệu ứng ombre cực chuẩn, có độ bóng nhẹ khi và chuẩn màu chỉ sau 1 lần son. Độ che phủ hoàn hảo, không làm lộ vân môi, không vón cục.',
            images: ['https://www.maybelline.vn/-/media/project/loreal/brand-sites/mny/apac/vn/products/lip-makeup/lip-color/super-stay-matte-ink-music-collection-lipstick/210---versatile/super-stay-matte-ink-music-collection-lipstick-210-1.jpg?rev=abe205acff1340be9457c405f723bbe8&cx=0&cy=0&cw=315&ch=472&hash=692B8865B3E5A94629619597E55F362E'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Maybelline", "Xuất xứ": "Mỹ" },
            variants: [
                { color: 'Màu 495 - SPICY', price: 268000, stock: 50 },
                { color: 'Màu 210 - VERSATILE', price: 268000, stock: 60 }
            ]
        },
        {
            name: 'Son Lì Color Sensational Ultimatte',
            desc: 'Son Lì Color Sensational Ultimatte đem đến màu sắc đậm hơn với lớp son cực lì cùng cảm giác nhẹ, thoải mái khi sử dụng.',
            images: ['https://www.maybelline.vn/-/media/project/loreal/brand-sites/mny/apac/vn/products/lip-makeup/lip-color/color-sensational-ultimatte-slim-lipstick-makeup/maybelline-color-sensational-ultimatte-299-more-scarlet-041554582239-o.jpg?rev=fe342a495eaa4f0ca5c63e185ef5e33b&cx=0&cy=0&cw=760&ch=1130&hash=FA09A2097CC07E53E88670337E4365F7'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Maybelline", "Xuất xứ": "Mỹ" },
            variants: [
                { color: '499 - More Blush', price: 288000, stock: 50 },
                { color: '1188 - More Copper', price: 288000, stock: 60 }
            ]
        },
        {
            name: 'Son Kem Mịn Lì Maybelline Sensational Cushion Mattes',
            desc: 'Son Kem Maybelline Sensational Cushion Mattes 6.4ml là sản phẩm son kem đến từ thương hiệu mỹ phẩm nổi tiếng Maybelline New York, với cảm hứng từ cushion Maybelline cho ra đời dòng son Sensational Cushion Matte với kết cấu mềm mại, mịn lì như nhung. Đặc biệt, sử dụng công nghệ đột phá Hiệu ứng lì đa chiều - dimensional matte, tạo không gian nhiều sắc độ, chiều sâu, hút trọn sắc son rồi bung ra ôm ấp lấy bờ môi xinh xắn của người châu Á.',
            images: ['https://storage.beautyfulls.com/uploads-1/avatar/product/1200x/2023/03/13/figure-1678701255679.jpg'],
            categoryKey: 'makeup',
            specs: { "Thương hiệu": "Maybelline", "Xuất xứ": "Mỹ" },
            variants: [
                { color: 'Màu CM06 - Urban Spice', price: 288000, stock: 50 },
                { color: 'Màu CM08 - Girl Who Rules', price: 288000, stock: 60 }
            ]
        }
    ],
    makeup_seller: [
        {
            name: 'Kem Dưỡng Da Toàn Thân Anok Smoothing',
            desc: 'Giúp bổ sung độ ẩm cần thiết và dưỡng sáng da.',
            specs: KOLMAR_SPECS,
            images: ['https://kolmar.vn/wp-content/uploads/2025/09/ANOK-SOY-KERA-LHA-BODY-LOTION.png'],
            categoryKey: 'makeup',
            variants: [
                { color: 'Daffodil', price: 250000, stock: 50 }
            ]
        }
    ]
};
async function main() {
    console.log('💄 Bắt đầu seed dữ liệu...');
    const catSkincare = await prisma.category.create({ data: { name: 'Chăm sóc da mặt' } });
    const catMakeup = await prisma.category.create({ data: { name: 'Trang điểm' } });
    const catBody = await prisma.category.create({ data: { name: 'Chăm sóc cơ thể' } });
    const categoriesMap = {
        skincare: catSkincare.id,
        makeup: catMakeup.id,
        body: catBody.id,
    };
    console.log('✅ Categories seeded');
    const adminEmails = ['admin1@shop.com', 'admin2@shop.com'];
    for (const email of adminEmails) {
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: await bcrypt.hash('123456', 10),
                name: email === 'admin1@shop.com' ? 'Liễu Như Yên' : 'Bạch Ngưng Băng',
                role: client_1.Role.ADMIN,
                avatar: await uploadImage(AVATARS[email === 'admin1@shop.com' ? 'admin1' : 'admin2'], 'admin_avatars'),
            }
        });
    }
    console.log('✅ Admin seeded');
    const brands = [
        { code: 'nivea', name: 'NIVEA Vietnam', tax: 'NIV888', img: AVATARS.brands.nivea },
        { code: 'laroche', name: 'La Roche-Posay', tax: 'LRP999', img: AVATARS.brands.laroche },
        { code: 'cocoon', name: 'Cocoon Vietnam', tax: 'COC777', img: AVATARS.brands.cocoon },
        { code: 'givenchy', name: 'Givenchy Beauty', tax: 'GIV111', img: AVATARS.brands.givenchy },
        { code: 'nacific', name: 'Nacific Official', tax: 'NAC222', img: AVATARS.brands.nacific },
        { code: 'maybelline', name: 'Maybelline New York', tax: 'MAY333', img: AVATARS.brands.maybelline },
    ];
    for (const brand of brands) {
        const user = await prisma.user.create({
            data: {
                email: `${brand.code}@enterprise.com`,
                password: await bcrypt.hash('123456', 10),
                name: brand.name,
                role: client_1.Role.ENTERPRISE,
                avatar: await uploadImage(brand.img, 'enterprise_avatars'),
            },
        });
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
        const products = PRODUCTS_DATA[brand.code];
        if (products) {
            for (const prod of products) {
                const mainImage = await uploadImage(prod.images[0], 'products');
                await prisma.product.create({
                    data: {
                        name: prod.name,
                        description: prod.desc,
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
    console.log('✅ Enterprise & Products seeded (Added Givenchy, Nacific, Maybelline)');
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
                role: client_1.Role.SELLER,
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
        const makeupProds = PRODUCTS_DATA.makeup_seller;
        for (const prod of makeupProds) {
            const mainImage = await uploadImage(prod.images[0], 'seller_products');
            await prisma.product.create({
                data: {
                    name: `[${sellersData[i]}] ${prod.name}`,
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
        const shuffledBrands = brandProductsSource.sort(() => 0.5 - Math.random());
        const selectedProducts = shuffledBrands.slice(0, 5);
        for (const prod of selectedProducts) {
            const imageLink = await uploadImage(prod.images[0], 'products');
            const priceMultiplier = 0.9 + (Math.random() * 0.2);
            await prisma.product.create({
                data: {
                    name: prod.name,
                    description: prod.desc,
                    specifications: prod.specs,
                    categoryId: categoriesMap[prod.categoryKey],
                    sellerId: seller.id,
                    images: [imageLink],
                    variants: {
                        create: prod.variants.map((v) => ({
                            size: v.size,
                            color: v.color,
                            price: Math.floor(v.price * priceMultiplier / 1000) * 1000,
                            stock: Math.floor(Math.random() * 50) + 10,
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
                role: client_1.Role.LOGISTICS,
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
        for (let k = 1; k <= 3; k++) {
            const shipUser = await prisma.user.create({
                data: {
                    email: `${log.code}_shipper${k}@mail.com`,
                    password: await bcrypt.hash('123456', 10),
                    name: `${log.name} Shipper ${k}`,
                    phone: `090${k}888${Math.floor(Math.random() * 100)}`,
                    role: client_1.Role.SHIPPER,
                    avatar: await uploadImage('https://media.tenor.com/kuvczltMQy0AAAAe/yoru.png', 'shipper_avatars'),
                },
            });
            await prisma.shipper.create({
                data: {
                    userId: shipUser.id,
                    logisticsPartnerId: partner.id,
                    status: client_1.ShipperStatus.AVAILABLE,
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
//# sourceMappingURL=seed.js.map