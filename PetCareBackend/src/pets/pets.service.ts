import {
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pet, PetDocument } from './schemas/pet.schema';
import { CreatePetDto, UpdatePetDto } from './dto/create-pet.dto';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
  ) {}

  async create(ownerId: string, dto: CreatePetDto): Promise<PetDocument> {
    const createdPet = new this.petModel({
      ...dto,
      ownerId: new Types.ObjectId(ownerId),
    });
    return createdPet.save();
  }

  async findAllByOwner(ownerId: string): Promise<PetDocument[]> {
    return this.petModel
      .find({ ownerId: new Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOneByOwner(id: string, ownerId: string): Promise<PetDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Mã thú cưng không hợp lệ');
    }

    const pet = await this.petModel.findById(id).exec();
    if (!pet) {
      throw new NotFoundException('Không tìm thấy thú cưng');
    }

    if (pet.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền truy cập hồ sơ thú cưng này');
    }

    return pet;
  }

  async update(id: string, ownerId: string, dto: UpdatePetDto): Promise<PetDocument> {
    await this.findOneByOwner(id, ownerId);

    const updated = await this.petModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    ).exec();

    return updated!;
  }

  async delete(id: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    await this.findOneByOwner(id, ownerId);
    await this.petModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Đã xóa hồ sơ thú cưng thành công' };
  }

  async exportHealthProfile(id: string, ownerId: string) {
    const pet = await this.findOneByOwner(id, ownerId);
    return {
      exportedAt: new Date().toISOString(),
      pet,
      summary: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        birthDate: pet.birthDate,
        microchip: pet.microchip,
        allergies: pet.allergies,
        chronicConditions: pet.chronicConditions,
        currentWeight: pet.weight,
        isNeutered: pet.isNeutered,
      },
    };
  }
}
