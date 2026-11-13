import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type WeightRecordDocument = WeightRecord & Document;

@Schema({ timestamps: true })
export class WeightRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet', required: true, index: true })
  petId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  weight: number;

  @Prop({ default: 'kg' })
  unit: string;

  @Prop({ default: () => new Date().toISOString() })
  recordedAt: string;

  @Prop({ default: '' })
  note?: string;
}

export const WeightRecordSchema = SchemaFactory.createForClass(WeightRecord);
