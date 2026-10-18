import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { LocationTypeEnum } from '../schemas/location.schema';

export class QueryNearbyLocationsDto {
  @ApiPropertyOptional({ example: 21.0378 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 105.7895 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 10, description: 'Bán kính tìm kiếm (km)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radius?: number = 10;

  @ApiPropertyOptional({ description: 'Phân loại: hospital_247, clinic, pet_store, grooming hoặc VET_HOSPITAL...' })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    const v = String(value).toUpperCase();
    if (v === 'HOSPITAL_247' || v === 'VET_HOSPITAL') return LocationTypeEnum.VET_HOSPITAL;
    if (v === 'CLINIC' || v === 'VET_CLINIC') return LocationTypeEnum.VET_CLINIC;
    if (v === 'PET_STORE') return LocationTypeEnum.PET_STORE;
    if (v === 'GROOMING') return LocationTypeEnum.GROOMING;
    return value;
  })
  type?: string;

  @ApiPropertyOptional({ example: 'Cầu Giấy' })
  @IsOptional()
  @IsString()
  search?: string;
}
