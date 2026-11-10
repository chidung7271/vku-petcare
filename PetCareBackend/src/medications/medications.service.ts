import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Medication, MedicationDocument } from './schemas/medication.schema';
import { PetsService } from '../pets/pets.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name) private medicationModel: Model<MedicationDocument>,
    private petsService: PetsService,
  ) {}

  async create(petId: string, ownerId: string, dto: CreateMedicationDto): Promise<MedicationDocument> {
    await this.petsService.findOneByOwner(petId, ownerId);

    const record = new this.medicationModel({
      ...dto,
      petId: new Types.ObjectId(petId),
    });
    return record.save();
  }

  async findAllByPet(petId: string, ownerId: string): Promise<MedicationDocument[]> {
    await this.petsService.findOneByOwner(petId, ownerId);

    return this.medicationModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(petId: string, id: string, ownerId: string, dto: UpdateMedicationDto): Promise<MedicationDocument> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy đơn thuốc');
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const updated = await this.medicationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), petId: new Types.ObjectId(petId) },
      { $set: dto },
      { new: true }
    ).exec();

    if (!updated) {
      throw new NotFoundException('Không tìm thấy đơn thuốc');
    }
    return updated;
  }

  async delete(petId: string, id: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(id)) {
      return { success: true, message: 'Đã xóa đơn thuốc thành công' };
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const deleted = await this.medicationModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      petId: new Types.ObjectId(petId),
    }).exec();

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy đơn thuốc');
    }
    return { success: true, message: 'Đã xóa đơn thuốc thành công' };
  }
}
