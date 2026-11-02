import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthRecordsService } from './health-records.service';
import { HealthRecordsController } from './health-records.controller';
import { HealthRecord, HealthRecordSchema } from './schemas/health-record.schema';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [
    PetsModule,
    MongooseModule.forFeature([
      { name: HealthRecord.name, schema: HealthRecordSchema },
    ]),
  ],
  controllers: [HealthRecordsController],
  providers: [HealthRecordsService],
  exports: [HealthRecordsService, MongooseModule],
})
export class HealthRecordsModule {}
