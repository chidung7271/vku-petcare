import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { IStorageProvider, UploadResult } from '../interfaces/storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    const port = this.configService.get<number>('PORT', 3000);
    this.baseUrl = this.configService.get<string>('BASE_URL', `http://localhost:${port}`);
  }

  async upload(file: Express.Multer.File, folder = 'general'): Promise<UploadResult> {
    const targetFolder = path.join(this.uploadDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(targetFolder, filename);

    if (file.buffer) {
      await fs.promises.writeFile(filePath, file.buffer);
    } else if (file.path) {
      await fs.promises.copyFile(file.path, filePath);
    }

    const relativePath = `/uploads/${folder}/${filename}`;
    const url = `${this.baseUrl}${relativePath}`;

    this.logger.log(`Uploaded file locally: ${url}`);
    return {
      url,
      filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(urlOrPath: string): Promise<void> {
    try {
      const match = urlOrPath.match(/\/uploads\/(.+)$/);
      if (match) {
        const filePath = path.join(this.uploadDir, match[1]);
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      }
    } catch (err) {
      this.logger.warn(`Failed to delete local file ${urlOrPath}: ${err.message}`);
    }
  }
}
