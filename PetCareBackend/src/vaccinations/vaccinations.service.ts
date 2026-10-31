import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vaccination, VaccinationDocument } from './schemas/vaccination.schema';
import { PetsService } from '../pets/pets.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './dto/create-vaccination.dto';

@Injectable()
export class VaccinationsService {
  constructor(
    @InjectModel(Vaccination.name) private vaccinationModel: Model<VaccinationDocument>,
    private petsService: PetsService,
  ) {}

  async create(petId: string, ownerId: string, dto: CreateVaccinationDto): Promise<VaccinationDocument> {
    await this.petsService.findOneByOwner(petId, ownerId);

    const record = new this.vaccinationModel({
      ...dto,
      petId: new Types.ObjectId(petId),
    });
    return record.save();
  }

  async findAllByPet(petId: string, ownerId: string): Promise<VaccinationDocument[]> {
    await this.petsService.findOneByOwner(petId, ownerId);

    return this.vaccinationModel
      .find({ petId: new Types.ObjectId(petId) })
      .sort({ administeredAt: -1 })
      .exec();
  }

  async update(petId: string, id: string, ownerId: string, dto: UpdateVaccinationDto): Promise<VaccinationDocument> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy mũi tiêm vaccine');
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const updated = await this.vaccinationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), petId: new Types.ObjectId(petId) },
      { $set: dto },
      { new: true }
    ).exec();

    if (!updated) {
      throw new NotFoundException('Không tìm thấy mũi tiêm vaccine');
    }
    return updated;
  }

  async delete(petId: string, id: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(petId) || !Types.ObjectId.isValid(id)) {
      return { success: true, message: 'Đã xóa bản ghi vaccine thành công' };
    }
    await this.petsService.findOneByOwner(petId, ownerId);

    const deleted = await this.vaccinationModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      petId: new Types.ObjectId(petId),
    }).exec();

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy mũi tiêm vaccine');
    }
    return { success: true, message: 'Đã xóa bản ghi vaccine thành công' };
  }

  async getUpcoming(ownerId: string, days = 30) {
    const userPets = await this.petsService.findAllByOwner(ownerId);
    const petIds = userPets.map(p => p._id);

    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + Number(days));

    const nowStr = now.toISOString().slice(0, 10);
    const targetStr = targetDate.toISOString().slice(0, 10);

    const records = await this.vaccinationModel
      .find({
        petId: { $in: petIds },
        nextDueDate: { $gte: nowStr, $lte: targetStr },
      })
      .populate('petId', 'name species breed avatar')
      .sort({ nextDueDate: 1 })
      .exec();

    return records;
  }
}
