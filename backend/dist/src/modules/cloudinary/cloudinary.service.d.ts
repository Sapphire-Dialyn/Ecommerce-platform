import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor();
    uploadFile(file: Express.Multer.File, options?: any): Promise<UploadApiResponse | UploadApiErrorResponse>;
    uploadFromPath(path: string, options?: any): Promise<UploadApiResponse | UploadApiErrorResponse>;
    deleteFile(publicId: string): Promise<any>;
}
