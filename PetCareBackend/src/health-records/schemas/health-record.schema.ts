import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type HealthRecordDocument = HealthRecord & Document;

export enum HealthRecordTypeEnum {
  VACCINE = 'VACCINE',
  CHECKUP = 'CHECKUP',
  DEWORMING = 'DEWORMING',
  MEDICATION = 'MEDICATION',
  ALLERGY = 'ALLERGY',
  SURGERY = 'SURGERY',
  LAB_TEST = 'LAB_TEST',
  OTHER = 'OTHER'
}

@Schema({ timestamps: true })
export class HealthRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet', required: true, index: true })
  petId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(HealthRecordTypeEnum), index: true })
  type: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  date: string;

  @Prop({ default: '' })
  clinic?: string;

  @Prop({ default: '' })
  veterinarian?: string;

  @Prop({ default: '' })
  diagnosis?: string;

  @Prop({ default: '' })
  treatment?: string;

  @Prop({ default: '' })
  medications?: string;

  @Prop({ default: '' })
  prescription?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: '' })
  notes?: string;

  @Prop({ default: '' })
  nextFollowUpDate?: string;
}

export const HealthRecordSchema = SchemaFactory.createForClass(HealthRecord);
