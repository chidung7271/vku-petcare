import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type MedicationDocument = Medication & Document;

@Schema({ timestamps: true })
export class Medication {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet', required: true, index: true })
  petId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  dosage: string;

  @Prop({ default: 'viên' })
  unit: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ default: '' })
  startDate?: string;

  @Prop({ default: '' })
  endDate?: string;

  @Prop({ default: '' })
  instructions?: string;

  @Prop({ default: '' })
  prescribedBy?: string;

  @Prop({ default: '' })
  notes?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);
