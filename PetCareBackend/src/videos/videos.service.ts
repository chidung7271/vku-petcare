import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async findAll(category?: string): Promise<VideoDocument[]> {
    const filter: any = {};
    if (category && category !== 'Tất cả') {
      filter.category = category;
    }
    return this.videoModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<VideoDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy video hướng dẫn');
    }
    const video = await this.videoModel.findById(id).exec();
    if (!video) {
      throw new NotFoundException('Không tìm thấy video hướng dẫn');
    }
    return video;
  }

  async create(dto: any): Promise<VideoDocument> {
    const created = new this.videoModel(dto);
    return created.save();
  }

  async update(id: string, dto: any): Promise<VideoDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy video để cập nhật');
    }
    const updated = await this.videoModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Không tìm thấy video để cập nhật');
    }
    return updated;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: true, message: 'Đã xóa video thành công' };
    }
    const deleted = await this.videoModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy video để xóa');
    }
    return { success: true, message: 'Đã xóa video thành công' };
  }
}
