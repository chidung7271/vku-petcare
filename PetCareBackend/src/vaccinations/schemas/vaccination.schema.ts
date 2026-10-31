import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type VaccinationDocument = Vaccination & Document;

@Schema({ timestamps: true })
export class Vaccination {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet', required: true, index: true })
  petId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  vaccineName: string;

  @Prop({ required: true })
  administeredAt: string;

  @Prop({ required: true, index: true })
  nextDueDate: string;

  @Prop({ default: '' })
  clinic?: string;

  @Prop({ default: '' })
  veterinarian?: string;

  @Prop({ default: '' })
  batchNumber?: string;

  @Prop({ default: '' })
  notes?: string;
}

export const VaccinationSchema = SchemaFactory.createForClass(Vaccination);
