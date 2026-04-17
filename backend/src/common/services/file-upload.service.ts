import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from '../../modules/cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  /**
   * Safely uploads a file to Cloudinary with error handling
   * 🚀 ĐÃ SỬA: Xây dựng options object
   */
  async safeUploadFile(
    file: Express.Multer.File,
    publicId: string,
    options: any = {},
  ) {
    try {
      // 👈 Sửa: Gộp publicId và các options khác
      const uploadOptions = {
        ...options,
        public_id: publicId,
        overwrite: true, // 👈 Luôn ghi đè
        // (folder sẽ nằm trong 'options' nếu có)
      };
      
      // 👈 Sửa: Gọi hàm với 2 tham số
      return await this.cloudinaryService.uploadFile(file, uploadOptions);
    } catch (error) {
      this.handleUploadError(error);
    }
  }

  /**
   * Safely replaces a file in Cloudinary with error handling
   * 🚀 ĐÃ SỬA:
   */
  async safeReplaceFile(
    file: Express.Multer.File,
    publicId: string,
    options: any = {},
  ) {
    // 👈 Sửa: Vì safeUploadFile đã có 'overwrite: true',
    // chúng ta không cần xóa file cũ trước.
    return this.safeUploadFile(file, publicId, options);
  }

  /**
   * Safely deletes a file from Cloudinary with error handling
   */
  async safeDeleteFile(publicId: string) {
    try {
      return await this.cloudinaryService.deleteFile(publicId);
    } catch (error: any) {
  if (error?.http_code !== 404) {
    throw error;
  }
}
  }

  /**
   * Common error handler for file operations
   */
  private handleUploadError(error: any) {
    console.error('File operation error:', error);
    throw new InternalServerErrorException(
      'An error occurred during the file operation',
    );
  }
}