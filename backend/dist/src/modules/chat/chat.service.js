"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });
    }
    async getAiResponse(history) {
        const products = await this.prisma.product.findMany({
            take: 10,
            select: {
                name: true,
                description: true,
                variants: {
                    select: {
                        price: true,
                        stock: true
                    }
                }
            }
        });
        const productContext = products.map(p => {
            const firstVariant = p.variants[0];
            const price = firstVariant ? firstVariant.price : 0;
            const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
            return `- ${p.name} (Giá tham khảo: ${price.toLocaleString()}đ) - Tình trạng: ${totalStock > 0 ? 'Còn hàng' : 'Hết hàng'}`;
        }).join('\n');
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
    - Nếu khách hỏi sản phẩm, hãy dựa vào danh sách trên để tư vấn chính xác giá và tình trạng.
    - Nếu sản phẩm không có trong danh sách, hãy nói khéo bằng văn phong bí ẩn.
    - Trả lời ngắn gọn, dưới 3 câu.
    `;
        try {
            let chatHistory = history.slice(-10).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            }));
            if (chatHistory.length > 0 && chatHistory[0].role === 'user') {
                chatHistory[0].parts[0].text = systemPrompt + "\n\n" + chatHistory[0].parts[0].text;
            }
            else {
                chatHistory.unshift({
                    role: 'user',
                    parts: [{ text: systemPrompt + "\n\n(Bắt đầu cuộc trò chuyện)" }]
                });
            }
            const lastMessage = chatHistory.pop();
            const userMessage = (lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.parts[0].text) || "";
            if (!userMessage)
                return { reply: '...', source: 'Empty' };
            const chatSession = this.model.startChat({
                history: chatHistory,
                generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
            });
            const result = await chatSession.sendMessage(userMessage);
            return {
                reply: result.response.text(),
                source: 'Cantarella (Gemini 2.0 Flash)'
            };
        }
        catch (error) {
            console.error('Lỗi AI:', error);
            return { reply: 'Sóng biển đang động (Lỗi hệ thống)...', source: 'Error' };
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map