import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WeightRecord, WeightRecordDocument } from './schemas/weight-record.schema';
import { PetPhoto, PetPhotoDocument } from './schemas/pet-photo.schema';
import { PetsService } from '../pets/pets.service';
import { Pet, PetDocument } from '../pets/schemas/pet.schema';
import { CreateWeightDto, CreatePhotoDto, CreateMilestoneDto } from './dto/create-growth.dto';

@Injectable()
export class GrowthService {
  constructor(
    @InjectModel(WeightRecord.name) private weightModel: Model<WeightRecordDocument>,
    @InjectModel(PetPhoto.name) private photoModel: Model<PetPhotoDocument>,
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    private petsService: PetsService,
  ) {}

  async addMilestone(petId: string, ownerId: string, dto: CreateMilestoneDto) {
    if (!Types.ObjectId.isValid(petId)) {
      throw new NotFoundException('Mã thú cưng không hợp lệ');
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const hasWeight = dto.weight !== undefined && dto.weight !== null && Number(dto.weight) > 0;
    const hasPhoto = !!(dto.photoUrl && dto.photoUrl.trim());
    const hasNote = !!(dto.note && dto.note.trim());

    if (!hasWeight && !hasPhoto && !hasNote) {
      throw new BadRequestException('Vui lòng nhập ít nhất một thông tin (cân nặng, ghi chú hoặc ảnh kỷ niệm)');
    }

    if (hasPhoto && (!dto.date || !dto.date.trim())) {
      throw new BadRequestException('Ngày chụp là bắt buộc khi có đính kèm ảnh kỷ niệm');
    }

    const recordDate = dto.date && dto.date.trim() ? dto.date.trim() : new Date().toISOString().split('T')[0];

    let weightRecord: WeightRecordDocument | null = null;
    let photoRecord: PetPhotoDocument | null = null;

    if (hasWeight) {
      const weightNum = Number(dto.weight);
      const wDoc = new this.weightModel({
        petId: new Types.ObjectId(petId),
        weight: weightNum,
        unit: 'kg',
        recordedAt: recordDate,
        note: dto.note?.trim() || '',
      });
      weightRecord = await wDoc.save();

      // Update current pet weight
      await this.petModel.findByIdAndUpdate(petId, { weight: weightNum });
    }

    if (hasPhoto || (!hasWeight && hasNote)) {
      const pDoc = new this.photoModel({
        petId: new Types.ObjectId(petId),
        photoUrl: dto.photoUrl?.trim() || '',
        thumbnailUrl: dto.photoUrl?.trim() || '',
        takenAt: recordDate,
        caption: dto.note?.trim() || '',
        note: dto.note?.trim() || '',
        weightAtTime: hasWeight ? Number(dto.weight) : undefined,
      });
      photoRecord = await pDoc.save();
    }

    return {
      success: true,
      message: 'Đã lưu mốc phát triển thành công',
      weightRecord,
      photoRecord,
    };
  }

  async addWeight(petId: string, ownerId: string, dto: CreateWeightDto): Promise<WeightRecordDocument> {
    if (!Types.ObjectId.isValid(petId)) {
      throw new NotFoundException('Mã thú cưng không hợp lệ');
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const record = new this.weightModel({
      petId: new Types.ObjectId(petId),
      weight: dto.weight,
      unit: dto.unit || 'kg',
      recordedAt: dto.recordedAt || new Date().toISOString(),
      note: dto.note || '',
    });
    const saved = await record.save();

    // Also update current pet weight
    await this.petModel.findByIdAndUpdate(petId, { weight: dto.weight });

    return saved;
  }

  async getWeights(petId: string, ownerId: string): Promise<WeightRecordDocument[]> {
    if (!Types.ObjectId.isValid(petId)) {
      return [];
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    return this.weightModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ recordedAt: 1 })
      .exec();
  }

  async addPhoto(petId: string, ownerId: string, dto: CreatePhotoDto): Promise<PetPhotoDocument> {
    if (!Types.ObjectId.isValid(petId)) {
      throw new NotFoundException('Mã thú cưng không hợp lệ');
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const photo = new this.photoModel({
      petId: new Types.ObjectId(petId),
      photoUrl: dto.photoUrl,
      thumbnailUrl: dto.thumbnailUrl || dto.photoUrl,
      takenAt: dto.takenAt || new Date().toISOString(),
      caption: dto.caption || '',
      note: dto.note || '',
      weightAtTime: dto.weightAtTime,
    });
    return photo.save();
  }

  async getPhotos(petId: string, ownerId: string): Promise<PetPhotoDocument[]> {
    if (!Types.ObjectId.isValid(petId)) {
      return [];
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    return this.photoModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ takenAt: 1 })
      .exec();
  }

  async deletePhoto(petId: string, photoId: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(photoId)) {
      return { success: true, message: 'Đã xóa ảnh thành công' };
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const photo = await this.photoModel.findOneAndDelete({
      _id: new Types.ObjectId(photoId),
      petId: new Types.ObjectId(petId),
    }).exec();

    if (!photo) {
      throw new NotFoundException('Không tìm thấy ảnh cần xóa');
    }
    return { success: true, message: 'Đã xóa ảnh thành công' };
  }
}
