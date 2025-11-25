import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    private genAI;
    private model;
    constructor(prisma: PrismaService);
    getAiResponse(history: any[]): Promise<{
        reply: any;
        source: string;
    }>;
}
