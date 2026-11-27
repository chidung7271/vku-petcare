import { Injectable, BadRequestException } from '@nestjs/common';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { UploadResult } from './interfaces/storage-provider.interface';

@Injectable()
export class UploadsService {
  constructor(private readonly localStorageProvider: LocalStorageProvider) {}

  async uploadImage(file: Express.Multer.File, folder = 'pets'): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp hình ảnh để tải lên');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Định dạng hình ảnh không hợp lệ. Hỗ trợ: JPG, PNG, WEBP, GIF');
    }

    // 15MB limit for images
    if (file.size > 15 * 1024 * 1024) {
      throw new BadRequestException('Kích thước ảnh tối đa là 15MB');
    }

    return this.localStorageProvider.upload(file, folder);
  }

  async uploadVideo(file: Express.Multer.File, folder = 'videos'): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp video để tải lên');
    }

    const allowedMimeTypes = [
      'video/mp4',
      'video/webm',
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/ogg',
      'video/mpeg',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Định dạng video không được hỗ trợ. Vui lòng tải lên video MP4, WebM, MOV.');
    }

    // 100MB limit for videos
    if (file.size > 100 * 1024 * 1024) {
      throw new BadRequestException('Kích thước video tối đa là 100MB');
    }

    return this.localStorageProvider.upload(file, folder);
  }

  async deleteImage(url: string): Promise<void> {
    await this.localStorageProvider.delete(url);
  }
}
