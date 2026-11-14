import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateWeightDto {
  @ApiProperty({ example: 28.5 })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsOptional()
  @IsString()
  recordedAt?: string;

  @ApiPropertyOptional({ example: 'Sau khi đi dạo' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreatePhotoDto {
  @ApiProperty({ example: 'https://images.unsplash.com/...' })
  @IsString()
  @IsNotEmpty()
  photoUrl: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsOptional()
  @IsString()
  takenAt?: string;

  @ApiPropertyOptional({ example: 'Lúc 2 tuổi - Dáng chuẩn' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 'Bé rất năng động' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: 28.5 })
  @IsOptional()
  @IsNumber()
  weightAtTime?: number;
}

export class CreateMilestoneDto {
  @ApiPropertyOptional({ example: 28.5, description: 'Cân nặng mới (kg) - không bắt buộc' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...', description: 'Ảnh kỷ niệm - không bắt buộc' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ example: '2026-10-30', description: 'Ngày chụp/ghi nhận (bắt buộc nếu có ảnh)' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 'Bé tròn 1 tuổi, rất ngoan', description: 'Ghi chú kỷ niệm' })
  @IsOptional()
  @IsString()
  note?: string;
}
