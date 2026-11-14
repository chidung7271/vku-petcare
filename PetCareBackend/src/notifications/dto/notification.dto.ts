import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Nhắc lịch uống thuốc' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Đã đến giờ uống thuốc tẩy giun cho Milo' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ enum: ['reminder', 'emergency', 'vaccine', 'medication', 'system', 'community'], default: 'reminder' })
  @IsEnum(['reminder', 'emergency', 'vaccine', 'medication', 'system', 'community'])
  type: string;

  @ApiPropertyOptional({ example: '/reminders' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}
