import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type LostPetDocument = LostPetReport & Document;

export enum LostPetStatusEnum {
  LOST = 'LOST',
  FOUND = 'FOUND',
  REUNITED = 'REUNITED',
  CLOSED = 'CLOSED'
}

@Schema({ timestamps: true })
export class LostPetReport {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false, index: true })
  ownerId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  petName: string;

  @Prop({ required: true, enum: ['dog', 'cat', 'other'] })
  species: string;

  @Prop({ default: '' })
  breed: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Prop({ default: '' })
  microchip?: string;

  @Prop({ default: '' })
  title?: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ default: '' })
  notes?: string;

  @Prop({ required: true })
  lastSeenLocation: string;

  @Prop({ required: true })
  lastSeenDate: string;

  @Prop({ required: true })
  contactPhone: string;

  @Prop({ default: '' })
  reward?: string;

  @Prop({ required: true })
  photoUrl: string;

  @Prop({ default: LostPetStatusEnum.LOST, enum: Object.values(LostPetStatusEnum), index: true })
  status: string;
}

export const LostPetReportSchema = SchemaFactory.createForClass(LostPetReport);
