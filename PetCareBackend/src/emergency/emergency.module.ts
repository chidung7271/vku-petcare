import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmergencyService } from './emergency.service';
import { EmergencySafetyService } from './emergency-safety.service';
import { EmergencyController } from './emergency.controller';
import { EmergencyCase, EmergencyCaseSchema } from './schemas/emergency-case.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmergencyCase.name, schema: EmergencyCaseSchema },
    ]),
  ],
  controllers: [EmergencyController],
  providers: [EmergencyService, EmergencySafetyService],
  exports: [EmergencyService, EmergencySafetyService, MongooseModule],
})
export class EmergencyModule {}
