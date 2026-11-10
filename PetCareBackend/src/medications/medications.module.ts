import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { Medication, MedicationSchema } from './schemas/medication.schema';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [
    PetsModule,
    MongooseModule.forFeature([
      { name: Medication.name, schema: MedicationSchema },
    ]),
  ],
  controllers: [MedicationsController],
  providers: [MedicationsService],
  exports: [MedicationsService, MongooseModule],
})
export class MedicationsModule {}
