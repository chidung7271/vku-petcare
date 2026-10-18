import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { Location, LocationSchema, FavoriteLocation, FavoriteLocationSchema } from './schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: FavoriteLocation.name, schema: FavoriteLocationSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService, MongooseModule],
})
export class LocationsModule {}
