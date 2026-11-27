import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LostPetStatusEnum } from '../schemas/lost-pet.schema';

export class CreateLostPetDto {
  @ApiProperty({ example: 'Bơ' })
  @IsString()
  @IsNotEmpty()
  petName: string;

  @ApiProperty({ enum: ['dog', 'cat', 'other'], example: 'dog' })
  @IsEnum(['dog', 'cat', 'other'])
  species: string;

  @ApiPropertyOptional({ example: 'Toy Poodle' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional({ example: 'Nâu đỏ' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ enum: ['male', 'female'], example: 'male' })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({ example: 'VN-982000...' })
  @IsOptional()
  @IsString()
  microchip?: string;

  @ApiProperty({ example: 'Gần Công viên Cầu Giấy, Hà Nội' })
  @IsString()
  @IsNotEmpty()
  lastSeenLocation: string;

  @ApiProperty({ example: '2026-09-12 18:30' })
  @IsString()
  @IsNotEmpty()
  lastSeenDate: string;

  @ApiProperty({ example: '0988123456' })
  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @ApiPropertyOptional({ example: '5.000.000 VNĐ' })
  @IsOptional()
  @IsString()
  reward?: string;

  @ApiPropertyOptional({ example: 'Bé rất nhát người lạ' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80' })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({ enum: LostPetStatusEnum, default: LostPetStatusEnum.LOST })
  @IsOptional()
  @IsEnum(LostPetStatusEnum)
  status?: LostPetStatusEnum;
}

export class UpdateLostPetDto extends CreateLostPetDto {}
