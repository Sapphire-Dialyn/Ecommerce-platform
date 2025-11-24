import { SellersService } from './sellers.service';
import { CreateSellerDto, UpdateSellerDto } from './dto/sellers.dto';
export declare class SellersController {
    private readonly sellersService;
    constructor(sellersService: SellersService);
    create(req: any, createSellerDto: CreateSellerDto): Promise<{
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
    update(id: string, updateSellerDto: UpdateSellerDto, req: any): Promise<{
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
    verifyStatus(id: string, verified: boolean, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    uploadLogo(id: string, file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    updateLogo(id: string, file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteLogo(id: string): Promise<void>;
    uploadDocument(id: string, type: 'business' | 'identity' | 'address', file: Express.Multer.File): Promise<import("cloudinary").UploadApiResponse | import("cloudinary").UploadApiErrorResponse>;
    deleteDocument(id: string, type: 'business' | 'identity' | 'address'): Promise<void>;
}
