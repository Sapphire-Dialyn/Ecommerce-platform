import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Cấu hình Cloudinary lấy từ biến môi trường
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload file từ Buffer (Dùng cho Controller với memoryStorage)
   */
  async uploadFile(
    file: Express.Multer.File,
    options: any = {},
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  /**
   * Upload từ đường dẫn hoặc URL (Dùng cho script seed hoặc tool)
   */
  async uploadFromPath(
    path: string,
    options: any = {},
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return await cloudinary.uploader.upload(path, options);
    } catch (error) {
      console.error('Lỗi upload từ path:', error);
      throw error;
    }
  }

  /**
   * Xóa file trên Cloudinary
   */
  async deleteFile(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}