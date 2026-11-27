import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { LostPetsService } from './lost-pets.service';
import { LostPetsController } from './lost-pets.controller';
import { LostPetReport, LostPetReportSchema } from './schemas/lost-pet.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: LostPetReport.name, schema: LostPetReportSchema },
    ]),
  ],
  controllers: [LostPetsController],
  providers: [LostPetsService],
  exports: [LostPetsService, MongooseModule],
})
export class LostPetsModule {}
