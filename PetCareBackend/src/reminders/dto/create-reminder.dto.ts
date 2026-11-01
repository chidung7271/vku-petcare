import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReminderTypeEnum, RecurrenceEnum } from '../schemas/reminder.schema';

export class CreateReminderDto {
  @ApiProperty({ example: '675... (petId)' })
  @IsString()
  @IsNotEmpty()
  petId: string;

  @ApiProperty({ enum: ReminderTypeEnum, example: ReminderTypeEnum.DEWORMING })
  @IsEnum(ReminderTypeEnum)
  type: ReminderTypeEnum;

  @ApiProperty({ example: 'Tẩy giun định kỳ quý 4 cho Milo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Cho uống cùng bữa ăn sáng' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-10-01' })
  @IsString()
  @IsNotEmpty()
  dueAt: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ enum: RecurrenceEnum, example: RecurrenceEnum.MONTHLY })
  @IsOptional()
  @IsEnum(RecurrenceEnum)
  recurrence?: RecurrenceEnum;

  @ApiPropertyOptional({ enum: ['LOW', 'MEDIUM', 'HIGH'], example: 'HIGH' })
  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  priority?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  notificationEnabled?: boolean;
}

export class UpdateReminderDto extends CreateReminderDto {}
