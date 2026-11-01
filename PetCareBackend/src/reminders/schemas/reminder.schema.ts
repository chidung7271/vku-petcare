import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ReminderDocument = Reminder & Document;

export enum ReminderTypeEnum {
  VACCINE = 'VACCINE',
  MEDICATION = 'MEDICATION',
  DEWORMING = 'DEWORMING',
  CHECKUP = 'CHECKUP',
  GROOMING = 'GROOMING',
  CUSTOM = 'CUSTOM'
}

export enum RecurrenceEnum {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export enum ReminderStatusEnum {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pet', required: true, index: true })
  petId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(ReminderTypeEnum) })
  type: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description?: string;

  @Prop({ required: true, index: true })
  dueAt: string;

  @Prop({ default: '09:00' })
  time: string;

  @Prop({ default: RecurrenceEnum.NONE, enum: Object.values(RecurrenceEnum) })
  recurrence: string;

  @Prop({ default: ReminderStatusEnum.PENDING, enum: Object.values(ReminderStatusEnum), index: true })
  status: string;

  @Prop({ default: 'MEDIUM', enum: ['LOW', 'MEDIUM', 'HIGH'] })
  priority: string;

  @Prop({ default: true })
  notificationEnabled: boolean;

  @Prop({ default: null })
  completedAt?: Date;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
