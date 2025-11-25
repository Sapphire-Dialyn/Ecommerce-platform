import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
// 👇 Import PrismaModule (Kiểm tra đường dẫn tương đối cho đúng với ảnh bạn gửi)
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // 👈 Đăng ký PrismaModule vào đây
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}