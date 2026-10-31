import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HealthRecordTypeEnum } from '../schemas/health-record.schema';

export class CreateHealthRecordDto {
  @ApiProperty({ enum: HealthRecordTypeEnum, example: HealthRecordTypeEnum.VACCINE })
  @IsEnum(HealthRecordTypeEnum)
  type: HealthRecordTypeEnum;

  @ApiProperty({ example: 'Tiêm phòng Vaccine 7 bệnh Nobivac DHPPI+L' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2026-04-10' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: 'Bệnh viện Thú y PetHealth' })
  @IsOptional()
  @IsString()
  clinic?: string;

  @ApiPropertyOptional({ example: 'BS. Minh Đức' })
  @IsOptional()
  @IsString()
  veterinarian?: string;

  @ApiPropertyOptional({ example: 'Thể trạng tốt, không sốt' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ example: 'Tiêm dưới da' })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional({ example: 'Theo dõi 24h, không tắm 7 ngày' })
  @IsOptional()
  @IsString()
  prescription?: string;

  @ApiPropertyOptional({ example: ['https://.../phieu_tiem.pdf'] })
  @IsOptional()
  attachments?: string[];

  @ApiPropertyOptional({ example: 'Bé ngoan không kêu' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: '2027-04-10' })
  @IsOptional()
  @IsString()
  nextFollowUpDate?: string;
}

export class UpdateHealthRecordDto extends CreateHealthRecordDto {}
