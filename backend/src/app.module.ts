import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { SellersModule } from '@modules/sellers/sellers.module';
import { ProductsModule } from '@modules/products/products.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { LogisticsModule } from '@modules/logistics/logistics.module';
import { VouchersModule } from '@modules/vouchers/vouchers.module';
import { AnalyticsModule } from '@modules/analytics/analytics.module';
import { AdminModule } from '@modules/admin/admin.module';
import { EnterpriseModule } from '@modules/enterprise/enterprise.module';
import { CartModule } from '@modules/cart/cart.module';
import { ChatModule } from '@modules/chat/chat.module';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'), // Trỏ ra thư mục uploads ở root (ngoài dist)
    //   serveRoot: '/uploads', // Prefix URL: localhost:3000/uploads/...
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SellersModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    LogisticsModule,
    VouchersModule,
    AnalyticsModule,
    AdminModule,
    EnterpriseModule,
    CartModule,
    ChatModule,
  ],
})
export class AppModule {}