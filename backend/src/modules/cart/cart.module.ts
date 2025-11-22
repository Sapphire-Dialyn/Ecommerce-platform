import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PriceService } from '../products/services/price.service';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService, PriceService],
  exports: [CartService, PriceService],
})
export class CartModule {}
