import {
  NotFoundException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';

export const GetLogisticsPartnerId = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const prisma = request.app.get(PrismaService) as PrismaService;
    const user = request.user;

    if (!user?.id) {
      throw new NotFoundException('Authenticated logistics user not found');
    }

    const logistics = await prisma.logisticsPartner.findUnique({
      where: { userId: user.id },
    });

    if (!logistics) {
      throw new NotFoundException('Logistics partner not found');
    }

    return logistics.id;
  },
);
