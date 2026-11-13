import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type PetPhotoDocument = PetPhoto & Document;

@Schema({ timestamps: true })
export class PetPhoto {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet', required: true, index: true })
  petId: Types.ObjectId;

  @Prop({ default: '' })
  photoUrl: string;

  @Prop({ default: '' })
  thumbnailUrl?: string;

  @Prop({ default: () => new Date().toISOString() })
  takenAt: string;

  @Prop({ default: '' })
  caption?: string;

  @Prop({ default: '' })
  note?: string;

  @Prop({ type: Number })
  weightAtTime?: number;
}

export const PetPhotoSchema = SchemaFactory.createForClass(PetPhoto);
