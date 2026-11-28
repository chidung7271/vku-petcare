import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { LocalStorageProvider } from './providers/local-storage.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, LocalStorageProvider],
  exports: [UploadsService, LocalStorageProvider],
})
export class UploadsModule {}
