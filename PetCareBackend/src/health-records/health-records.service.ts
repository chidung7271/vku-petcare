import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HealthRecord, HealthRecordDocument } from './schemas/health-record.schema';
import { PetsService } from '../pets/pets.service';
import { CreateHealthRecordDto, UpdateHealthRecordDto } from './dto/create-health-record.dto';

@Injectable()
export class HealthRecordsService {
  constructor(
    @InjectModel(HealthRecord.name) private healthRecordModel: Model<HealthRecordDocument>,
    private petsService: PetsService,
  ) {}

  async create(petId: string, ownerId: string, dto: CreateHealthRecordDto): Promise<HealthRecordDocument> {
    await this.petsService.findOneByOwner(petId, ownerId);

    const record = new this.healthRecordModel({
      ...dto,
      petId: new Types.ObjectId(petId),
    });
    return record.save();
  }

  async findAllByPet(petId: string, ownerId: string, type?: string): Promise<HealthRecordDocument[]> {
    if (!Types.ObjectId.isValid(petId)) {
      return [];
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const query: any = { petId: new Types.ObjectId(petId) };
    if (type) {
      query.type = type.toUpperCase();
    }

    return this.healthRecordModel
      .find(query)
      .sort({ date: -1 })
      .exec();
  }

  async findOne(petId: string, recordId: string, ownerId: string): Promise<HealthRecordDocument> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(recordId)) {
      throw new NotFoundException('Không tìm thấy bản ghi y tế');
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const record = await this.healthRecordModel.findOne({
      _id: new Types.ObjectId(recordId),
      petId: new Types.ObjectId(petId),
    }).exec();

    if (!record) {
      throw new NotFoundException('Không tìm thấy bản ghi y tế');
    }
    return record;
  }

  async update(petId: string, recordId: string, ownerId: string, dto: UpdateHealthRecordDto): Promise<HealthRecordDocument> {
    await this.findOne(petId, recordId, ownerId);

    const updated = await this.healthRecordModel.findByIdAndUpdate(
      recordId,
      { $set: dto },
      { new: true }
    ).exec();

    return updated!;
  }

  async delete(petId: string, recordId: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(recordId)) {
      return { success: true, message: 'Đã xóa bản ghi y bạ thành công' };
    }
    await this.findOne(petId, recordId, ownerId);
    await this.healthRecordModel.findByIdAndDelete(recordId).exec();
    return { success: true, message: 'Đã xóa bản ghi y bạ thành công' };
  }
}
