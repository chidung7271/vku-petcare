import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true })
export class Pet {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ required: true, enum: ['dog', 'cat', 'other'], index: true })
  species: string;

  @Prop({ default: '' })
  breed: string;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Prop({ default: '' })
  birthDate?: string;

  @Prop({ default: '' })
  estimatedAge?: string;

  @Prop({ required: true, type: Number, default: 0 })
  weight: number;

  @Prop({ default: '' })
  coatColor: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' })
  avatar: string;

  @Prop({ default: '' })
  microchip?: string;

  @Prop({ default: false })
  isNeutered: boolean;

  @Prop({ type: [String], default: [] })
  allergies: string[];

  @Prop({ type: [String], default: [] })
  chronicConditions: string[];

  @Prop({ type: [String], default: [] })
  currentMedications: string[];

  @Prop({ default: '' })
  preferredVet?: string;

  @Prop({ default: '' })
  notes?: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
