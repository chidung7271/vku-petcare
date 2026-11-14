import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';
import { WeightRecord, WeightRecordSchema } from './schemas/weight-record.schema';
import { PetPhoto, PetPhotoSchema } from './schemas/pet-photo.schema';
import { PetsModule } from '../pets/pets.module';
import { Pet, PetSchema } from '../pets/schemas/pet.schema';

@Module({
  imports: [
    PetsModule,
    MongooseModule.forFeature([
      { name: WeightRecord.name, schema: WeightRecordSchema },
      { name: PetPhoto.name, schema: PetPhotoSchema },
      { name: Pet.name, schema: PetSchema },
    ]),
  ],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService, MongooseModule],
})
export class GrowthModule {}
