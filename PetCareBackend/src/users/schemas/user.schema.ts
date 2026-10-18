import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../common/decorators/roles.decorator';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' })
  avatar: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  emergencyContact: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: Object, default: { email: true, push: true, reminders: true } })
  notificationSettings: Record<string, boolean>;

  @Prop({ type: Object, default: { theme: 'light', language: 'vi' } })
  preferences: Record<string, string>;

  @Prop({ type: String, select: false })
  refreshTokenHash?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
