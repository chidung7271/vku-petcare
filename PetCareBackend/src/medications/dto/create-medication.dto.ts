import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedicationDto {
  @ApiProperty({ example: 'NexGard Spectra' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiPropertyOptional({ example: 'viên nhai' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ example: '1 lần / tháng' })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-01' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Cho uống cùng bữa ăn sáng' })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({ example: 'BS. Minh Đức' })
  @IsOptional()
  @IsString()
  prescribedBy?: string;

  @ApiPropertyOptional({ example: 'Phòng ngừa ve rận & giun tim' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMedicationDto extends CreateMedicationDto {}
