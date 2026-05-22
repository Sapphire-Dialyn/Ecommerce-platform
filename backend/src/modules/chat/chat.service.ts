import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private readonly logger = new Logger(ChatService.name);

  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    // Sử dụng model 3.5-flash đã xác nhận khả dụng từ file checkmodel.ts
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash", 
    });
  }

  async getAiResponse(history: any[]) {
    // 1. LẤY DỮ LIỆU SẢN PHẨM TỪ DATABASE
    const products = await this.prisma.product.findMany({
      take: 15,
      select: { 
        id: true, 
        name: true, 
        description: true,
        variants: { select: { price: true, stock: true } }
      }
    });

    const frontendDomain = process.env.FRONTEND_URL || 'http://localhost:3001';

    const productContext = products.map(p => {
      const firstVariant = p.variants[0];
      const price = firstVariant ? firstVariant.price : 0;
      const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
      const shortDesc = p.description ? p.description.substring(0, 150) + '...' : 'Sản phẩm chăm sóc sắc đẹp';
      return `- Tên: ${p.name}\n  Công dụng: ${shortDesc}\n  Giá: ${price.toLocaleString()}đ\n  Tình trạng: ${totalStock > 0 ? 'Còn hàng' : 'Hết hàng'}\n  Link: ${frontendDomain}/shop/products/${p.id}`;
    }).join('\n\n');

    const systemPrompt = `
    [VAI TRÒ]
    Bạn là Cantarella Fisalia, chủ nhân gia tộc Fisalia và là người tư vấn tại cửa hàng Beauty & Skincare.
    [TÍNH CÁCH]
    - Điềm tĩnh, bí ẩn, dùng ẩn dụ biển cả ("Still waters run deep").
    - Xưng hô: "Ta" - "Bạn".
    [DỮ LIỆU SẢN PHẨM]
    ${productContext}
    [QUY TẮC]
    - Gợi ý sản phẩm kèm link: [Tên sản phẩm](${frontendDomain}/shop/products/id).
    - Trả lời đầy đủ, trọn vẹn, không bỏ dở câu.`;

    // 2. Chuẩn bị lịch sử chat
    let chatHistory = history.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
    
    if (chatHistory.length > 0 && chatHistory[0].role === 'user') {
      chatHistory[0].parts[0].text = systemPrompt + "\n\n" + chatHistory[0].parts[0].text;
    } else {
      chatHistory.unshift({
        role: 'user',
        parts: [{ text: systemPrompt + "\n\n(Bắt đầu cuộc trò chuyện)" }]
      });
    }

    const lastMessage = chatHistory.pop(); 
    const userMessage = lastMessage?.parts[0].text || "";

    // 3. Thực hiện Retry Logic (Xử lý 503)
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const chatSession = this.model.startChat({
          history: chatHistory,
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        });

        const result = await chatSession.sendMessage(userMessage);
        return {
          reply: result.response.text(),
          source: 'Cantarella (Gemini 3.5 Flash)'
        };

      } catch (error: any) {
        // Kiểm tra lỗi 503 từ Google
        if (error.status === 503 || error.message?.includes('503') || error.message?.includes('high demand')) {
          this.logger.warn(`Lần thử ${attempt} thất bại do Server bận (503). Đang đợi 2 giây...`);
          if (attempt < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
        }
        
        // Nếu không phải 503 hoặc đã hết lượt retry
        this.logger.error("Lỗi AI:", error);
        return { reply: 'Sóng biển đang động, ta chưa thể trả lời lúc này...', source: 'Error' };
      }
    }
  }
}