import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private prisma: PrismaService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
    });
  }

  async getAiResponse(history: any[]) {
    // 1. LẤY DỮ LIỆU SẢN PHẨM TỪ DATABASE (Thêm id và description)
    const products = await this.prisma.product.findMany({
      take: 15, // Tăng nhẹ số lượng để AI có thêm lựa chọn
      select: { 
        id: true, // Cần ID để tạo link
        name: true, 
        description: true, // Cần mô tả để AI biết công dụng sản phẩm
        variants: {
            select: {
                price: true,
                stock: true
            }
        }
      }
    });

    const frontendDomain = 'http://localhost:3001'; // Đổi lại port nếu frontend của bạn chạy port khác

    // Biến đổi danh sách sản phẩm thành chuỗi văn bản chi tiết hơn
    const productContext = products.map(p => {
      const firstVariant = p.variants[0];
      const price = firstVariant ? firstVariant.price : 0;
      const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
      const shortDesc = p.description ? p.description.substring(0, 150) + '...' : 'Sản phẩm chăm sóc sắc đẹp';

      return `- Tên: ${p.name}\n  Công dụng: ${shortDesc}\n  Giá: ${price.toLocaleString()}đ\n  Tình trạng: ${totalStock > 0 ? 'Còn hàng' : 'Hết hàng'}\n  Link: ${frontendDomain}/shop/products/${p.id}`;
    }).join('\n\n');

    // 2. TẠO SYSTEM PROMPT VỚI DỮ LIỆU SẢN PHẨM VÀ YÊU CẦU LINK
    const systemPrompt = `
    [VAI TRÒ]
    Bạn là Cantarella Fisalia, chủ nhân gia tộc Fisalia và là người tư vấn tại cửa hàng Beauty & Skincare.
    
    [TÍNH CÁCH]
    - Điềm tĩnh, bí ẩn, dùng ẩn dụ biển cả ("Still waters run deep").
    - Xưng hô: "Ta" - "Bạn".

    [DỮ LIỆU SẢN PHẨM CỦA SHOP]
    Đây là danh sách các bảo vật (sản phẩm) mà chúng ta đang có:
    ${productContext}

    [QUY TẮC TRẢ LỜI]
    - Dựa vào nhu cầu của khách (ví dụ: da khô, mụn) để tìm sản phẩm có 'Công dụng' phù hợp trong danh sách.
    - Khi gợi ý sản phẩm, BẮT BUỘC phải kèm theo đường link của sản phẩm đó.
    - Trình bày link dưới dạng Markdown. Ví dụ: [Tên bảo vật của ta](${frontendDomain}/shop/products/id-san-pham).
    - Nếu sản phẩm không có trong danh sách, hãy nói khéo bằng văn phong bí ẩn.
    - Trả lời đầy đủ, trọn vẹn ý, không bao giờ được bỏ dở câu nói.
    `;

    try {
      // 3. Xử lý lịch sử chat
      // Chuyển đổi role assistant -> model cho đúng chuẩn Gemini
      let chatHistory = history.slice(-10).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));
      
      if (chatHistory.length > 0 && chatHistory[0].role === 'user') {
        chatHistory[0].parts[0].text = systemPrompt + "\n\n" + chatHistory[0].parts[0].text;
      } else {
        // Nếu tin nhắn đầu là của Bot (lời chào), chèn một tin User ảo lên trước
        chatHistory.unshift({
          role: 'user',
          parts: [{ text: systemPrompt + "\n\n(Bắt đầu cuộc trò chuyện)" }]
        });
      }

      const lastMessage = chatHistory.pop(); 
      const userMessage = lastMessage?.parts[0].text || "";

      if (!userMessage) return { reply: '...', source: 'Empty' };

      const chatSession = this.model.startChat({
        history: chatHistory,
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }, // Tăng giới hạn token để không bị cắt chữ
      });

      const result = await chatSession.sendMessage(userMessage);
      return {
        reply: result.response.text(),
        source: 'Cantarella (Gemini 2.5 Flash)'
      };

    } catch (error) {
      console.error('Lỗi AI:', error);
      return { reply: 'Sóng biển đang động (Lỗi hệ thống)...', source: 'Error' };
    }
  }
}