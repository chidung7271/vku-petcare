import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Kinh nghiệm huấn luyện cún đi vệ sinh đúng chỗ' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Phương pháp khen thưởng tích cực (positive reinforcement)...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'Huấn luyện' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ enum: ['article', 'video', 'tip', 'qa'], default: 'article' })
  @IsOptional()
  @IsEnum(['article', 'video', 'tip', 'qa'])
  postType?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/...'] })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=W34zT3J3rB8' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: ['huấn luyện', 'chó con'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: 'Golden Retriever' })
  @IsOptional()
  @IsString()
  petTag?: string;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Kinh nghiệm huấn luyện cún (Cập nhật mới)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['article', 'video', 'tip', 'qa'] })
  @IsOptional()
  @IsEnum(['article', 'video', 'tip', 'qa'])
  postType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  petTag?: string;
}

export class CreateCommentDto {
  @ApiProperty({ example: 'Bài viết rất hữu ích ạ!' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ReportPostDto {
  @ApiProperty({ example: 'Spam / Thông tin sai lệch về y tế' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ example: 'Bài viết khuyên dùng thuốc người chưa kiểm chứng' })
  @IsOptional()
  @IsString()
  description?: string;
}
