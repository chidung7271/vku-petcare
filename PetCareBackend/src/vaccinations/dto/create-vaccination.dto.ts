import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVaccinationDto {
  @ApiProperty({ example: 'Nobivac DHPPi+L 7 bệnh' })
  @IsString()
  @IsNotEmpty()
  vaccineName: string;

  @ApiProperty({ example: '2026-04-10' })
  @IsString()
  @IsNotEmpty()
  administeredAt: string;

  @ApiProperty({ example: '2027-04-10' })
  @IsString()
  @IsNotEmpty()
  nextDueDate: string;

  @ApiPropertyOptional({ example: 'Bệnh viện Thú y PetHealth' })
  @IsOptional()
  @IsString()
  clinic?: string;

  @ApiPropertyOptional({ example: 'BS. Minh Đức' })
  @IsOptional()
  @IsString()
  veterinarian?: string;

  @ApiPropertyOptional({ example: 'BATCH-2026-99' })
  @IsOptional()
  @IsString()
  batchNumber?: string;

  @ApiPropertyOptional({ example: 'Không sốt sau tiêm' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVaccinationDto extends CreateVaccinationDto {}
