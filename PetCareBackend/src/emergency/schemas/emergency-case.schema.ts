import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmergencyCaseDocument = EmergencyCase & Document;

@Schema({ timestamps: true })
export class EmergencyCase {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: [String], default: [], index: true })
  keywords: string[];

  @Prop({ required: true, enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'], index: true })
  urgencyLevel: string;

  @Prop({ required: true })
  badgeLabel: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ type: [String], default: [] })
  doImmediately: string[];

  @Prop({ type: [String], default: [] })
  doNotDo: string[];

  @Prop({ type: [String], default: [] })
  dangerSigns: string[];

  @Prop({ type: [Object], default: [] })
  nextActions: {
    label: string;
    actionType: 'call' | 'find_vet' | 'share_location' | 'guide';
    detail?: string;
  }[];
}

export const EmergencyCaseSchema = SchemaFactory.createForClass(EmergencyCase);
