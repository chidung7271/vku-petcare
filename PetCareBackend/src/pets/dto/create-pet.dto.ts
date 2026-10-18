import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ example: 'Milo' })
  @IsString()
  @IsNotEmpty({ message: 'Tên thú cưng không được để trống' })
  name: string;

  @ApiProperty({ enum: ['dog', 'cat', 'other'], example: 'dog' })
  @IsEnum(['dog', 'cat', 'other'], { message: 'Loài phải là dog, cat hoặc other' })
  species: string;

  @ApiPropertyOptional({ example: 'Golden Retriever' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional({ enum: ['male', 'female'], example: 'male' })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: string;

  @ApiPropertyOptional({ example: '2023-04-15' })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiPropertyOptional({ example: '2 tuổi 5 tháng' })
  @IsOptional()
  @IsString()
  estimatedAge?: string;

  @ApiProperty({ example: 28.5 })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiPropertyOptional({ example: 'Vàng kem' })
  @IsOptional()
  @IsString()
  coatColor?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: 'VN-982000345612' })
  @IsOptional()
  @IsString()
  microchip?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isNeutered?: boolean;

  @ApiPropertyOptional({ example: ['Dị ứng thịt bò'] })
  @IsOptional()
  allergies?: string[];

  @ApiPropertyOptional({ example: ['Viêm da dị ứng'] })
  @IsOptional()
  chronicConditions?: string[];

  @ApiPropertyOptional({ example: ['NexGard Spectra'] })
  @IsOptional()
  currentMedications?: string[];

  @ApiPropertyOptional({ example: 'Bệnh viện Thú y PetHealth' })
  @IsOptional()
  @IsString()
  preferredVet?: string;

  @ApiPropertyOptional({ example: 'Bé ngoan, thích gặm bóng' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePetDto extends CreatePetDto {}
