import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { LostPetReport, LostPetDocument, LostPetStatusEnum } from './schemas/lost-pet.schema';
import { CreateLostPetDto, UpdateLostPetDto } from './dto/lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectModel(LostPetReport.name) private lostPetModel: Model<LostPetDocument>,
    private configService: ConfigService,
  ) {}

  async create(ownerId: string | undefined, dto: CreateLostPetDto): Promise<LostPetDocument> {
    const reportData: any = {
      ...dto,
      status: (dto.status || 'LOST').toUpperCase(),
      photoUrl: dto.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    };
    if (ownerId && Types.ObjectId.isValid(ownerId)) {
      reportData.ownerId = new Types.ObjectId(ownerId);
    }
    const report = new this.lostPetModel(reportData);
    return report.save();
  }

  async findAll(status?: string, search?: string): Promise<LostPetDocument[]> {
    const filter: any = {};
    if (status) {
      filter.status = status.toUpperCase();
    }
    if (search) {
      filter.$or = [
        { petName: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { lastSeenLocation: { $regex: search, $options: 'i' } },
      ];
    }

    return this.lostPetModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<LostPetDocument> {
    const report = await this.lostPetModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException('Không tìm thấy tin báo thú cưng');
    }
    return report;
  }

  async update(id: string, ownerId: string, dto: UpdateLostPetDto): Promise<LostPetDocument> {
    const report = await this.findById(id);
    if (report.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa tin báo này');
    }

    const updated = await this.lostPetModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    ).exec();

    return updated!;
  }

  async delete(id: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    const report = await this.findById(id);
    if (report.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền xóa tin báo này');
    }
    await this.lostPetModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Đã xóa tin báo thành công' };
  }

  async markFound(id: string, ownerId: string): Promise<LostPetDocument> {
    const report = await this.findById(id);
    if (report.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật tin báo này');
    }

    report.status = LostPetStatusEnum.FOUND;
    return report.save();
  }

  async getPosterData(id: string) {
    const report = await this.findById(id);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const shareUrl = `${frontendUrl}/#lost_pet?id=${report._id}`;

    return {
      id: report._id,
      petName: report.petName,
      species: report.species,
      breed: report.breed,
      color: report.color,
      photoUrl: report.photoUrl,
      lastSeenLocation: report.lastSeenLocation,
      lastSeenDate: report.lastSeenDate,
      contactPhone: report.contactPhone,
      reward: report.reward,
      notes: report.notes,
      shareUrl,
      qrPayload: shareUrl,
    };
  }
}
