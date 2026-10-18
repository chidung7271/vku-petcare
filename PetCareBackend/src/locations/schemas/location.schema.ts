import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type LocationDocument = Location & Document;

export enum LocationTypeEnum {
  VET_HOSPITAL = 'VET_HOSPITAL',
  VET_CLINIC = 'VET_CLINIC',
  PET_STORE = 'PET_STORE',
  GROOMING = 'GROOMING'
}

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: Object.values(LocationTypeEnum), index: true })
  type: string;

  @Prop({ required: true, type: Number })
  latitude: number;

  @Prop({ required: true, type: Number })
  longitude: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: 4.8 })
  rating: number;

  @Prop({ default: 100 })
  reviewsCount: number;

  @Prop({ default: false, index: true })
  is24Hours: boolean;

  @Prop({ default: true })
  isOpenNow: boolean;

  @Prop({ default: '08:00 - 21:00' })
  openingHours: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Favorite Location Schema
export type FavoriteLocationDocument = FavoriteLocation & Document;

@Schema({ timestamps: true })
export class FavoriteLocation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true, index: true })
  locationId: Types.ObjectId;
}

export const FavoriteLocationSchema = SchemaFactory.createForClass(FavoriteLocation);
FavoriteLocationSchema.index({ userId: 1, locationId: 1 }, { unique: true });
