export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface IStorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadResult>;
  delete(pathOrUrl: string): Promise<void>;
}
