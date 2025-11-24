import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto, UpdateSellerDto } from './dto/sellers.dto';
import { FileUploadService } from '../../common/services/file-upload.service';
export declare class SellersService {
    private prisma;
    private fileUploadService;
    constructor(prisma: PrismaService, fileUploadService: FileUploadService);
    create(userId: string, createSellerDto: CreateSellerDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
            phone: string;
        };
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        products: {
            id: string;
            name: string;
            variants: {
                price: number;
                stock: number;
            }[];
        }[];
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        products: {
            id: string;
            name: string;
            variants: {
                price: number;
                stock: number;
            }[];
        }[];
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    findByUserId(userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        products: {
            id: string;
            name: string;
            variants: {
                price: number;
                stock: number;
            }[];
        }[];
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    update(id: string, updateSellerDto: UpdateSellerDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    updateVerificationStatus(id: string, verified: boolean): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        userId: string;
        verified: boolean;
        rating: number | null;
        logoUrl: string | null;
        storeName: string;
        businessDocumentUrl: string | null;
        identityDocumentUrl: string | null;
        addressDocumentUrl: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
    uploadStoreLogo(file: Express.Multer.File, sellerId: string): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    updateStoreLogo(file: Express.Multer.File, sellerId: string): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteStoreLogo(sellerId: string): Promise<void>;
    uploadVerificationDocument(file: Express.Multer.File, sellerId: string, documentType: 'business' | 'identity' | 'address'): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteVerificationDocument(sellerId: string, documentType: 'business' | 'identity' | 'address'): Promise<void>;
    private deleteVerificationDocuments;
}
