import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TriageRequestDto {
  @ApiPropertyOptional({ example: 'pet_123' })
  @IsOptional()
  @IsString()
  petId?: string;

  @ApiPropertyOptional({ example: 'dog' })
  @IsOptional()
  @IsString()
  species?: string;

  @ApiPropertyOptional({ example: '2 tuổi' })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiPropertyOptional({ example: 28.5 })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiProperty({ example: 'Chó vừa ăn phải bả chuột cách đây 30 phút' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng mô tả vấn đề hoặc triệu chứng khẩn cấp' })
  problem: string;

  @ApiPropertyOptional({ example: 'Sùi bọt mép, nôn mửa, run cơ' })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiPropertyOptional({ example: 'Thuốc chuột dạng viên xanh' })
  @IsOptional()
  @IsString()
  suspectedSubstance?: string;

  @ApiPropertyOptional({ example: '30 phút trước' })
  @IsOptional()
  @IsString()
  timeSinceIncident?: string;

  @ApiPropertyOptional({ example: 'Khoảng nửa gói' })
  @IsOptional()
  @IsString()
  estimatedAmount?: string;

  @ApiPropertyOptional({ enum: ['RED', 'YELLOW', 'GREEN'], example: 'RED', description: 'Mã màu phân loại cấp cứu dự kiến' })
  @IsOptional()
  @IsString()
  expectedTier?: string;

  @ApiPropertyOptional({ example: 'POISONING', description: 'Nhóm câu hỏi sàng lọc: POISONING, TRAUMA, RESPIRATORY, DIGESTIVE, GENERAL' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'SUDDEN', description: 'Tốc độ khởi phát: SUDDEN (đột ngột), GRADUAL (từ từ)' })
  @IsOptional()
  @IsString()
  onsetSpeed?: string;

  @ApiPropertyOptional({ example: 'CONSCIOUS', description: 'Trạng thái tri giác: CONSCIOUS (tỉnh táo), LETHARGIC (lờ đờ), UNCONSCIOUS (hôn mê)' })
  @IsOptional()
  @IsString()
  consciousness?: string;
}

export class CreateEmergencyCaseDto {
  @ApiProperty({ example: 'poison_toxic' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Ăn phải bả / Hóa chất / Độc tố' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: ['bả', 'độc', 'thuốc chuột', 'thuốc trừ sâu'] })
  keywords: string[];

  @ApiProperty({ enum: ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'], example: 'CRITICAL' })
  urgencyLevel: string;

  @ApiProperty({ example: 'NGUY CƠ TỬ VONG CAO - CẦN CẤP CỨU GẤP' })
  badgeLabel: string;

  @ApiProperty({ example: 'Ngộ độc là tình trạng đe dọa trực tiếp tính mạng thú cưng...' })
  summary: string;

  @ApiProperty({ example: ['Cách ly ngay khỏi nguồn chất độc', 'Giữ lại bao bì mẫu chất'] })
  doImmediately: string[];

  @ApiProperty({ example: ['TUYỆT ĐỐI KHÔNG tự ý gây nôn', 'KHÔNG cho uống lòng trắng trứng/sữa'] })
  doNotDo: string[];

  @ApiProperty({ example: ['Sùi bọt mép', 'Co giật', 'Thở rống tím tái'] })
  dangerSigns: string[];

  @ApiProperty()
  nextActions: {
    label: string;
    actionType: 'call' | 'find_vet' | 'share_location' | 'guide';
    detail?: string;
  }[];
}
