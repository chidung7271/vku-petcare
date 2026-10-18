import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Thanh Tùng' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '0988765432 (BS. Minh Đức)' })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: { email: true, push: true, reminders: true } })
  @IsOptional()
  @IsObject()
  notificationSettings?: Record<string, boolean>;

  @ApiPropertyOptional({ example: { theme: 'dark', language: 'vi' } })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, string>;
}
