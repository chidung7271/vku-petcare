import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { GrowthService } from './growth.service';
import { WeightRecord } from './schemas/weight-record.schema';
import { PetPhoto } from './schemas/pet-photo.schema';
import { Pet } from '../pets/schemas/pet.schema';
import { PetsService } from '../pets/pets.service';

describe('GrowthService', () => {
  let service: GrowthService;

  const mockWeightRecordModel = function (dto: any) {
    this.data = dto;
    this.save = jest.fn().mockResolvedValue({ _id: new Types.ObjectId(), ...dto });
  };
  mockWeightRecordModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        { _id: new Types.ObjectId(), weight: 4.5, recordedAt: '2026-10-01' },
        { _id: new Types.ObjectId(), weight: 5.2, recordedAt: '2026-11-01' },
      ]),
    }),
  });

  const mockPetPhotoModel = function (dto: any) {
    this.data = dto;
    this.save = jest.fn().mockResolvedValue({ _id: new Types.ObjectId(), ...dto });
  };
  mockPetPhotoModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    }),
  });

  const mockPetModel = {
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({}),
    }),
  };

  const mockPetsService = {
    findOneByOwner: jest.fn().mockResolvedValue({ _id: new Types.ObjectId() }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrowthService,
        {
          provide: getModelToken(WeightRecord.name),
          useValue: mockWeightRecordModel,
        },
        {
          provide: getModelToken(PetPhoto.name),
          useValue: mockPetPhotoModel,
        },
        {
          provide: getModelToken(Pet.name),
          useValue: mockPetModel,
        },
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
      ],
    }).compile();

    service = module.get<GrowthService>(GrowthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should record pet weight entry and update pet current weight', async () => {
    const petId = new Types.ObjectId().toHexString();
    const ownerId = new Types.ObjectId().toHexString();

    const result = await service.addWeight(petId, ownerId, {
      weight: 5.2,
      note: 'Tăng cân đều đặn',
    });

    expect(result).toBeDefined();
    expect(result.weight).toBe(5.2);
  });

  it('should return chronological weight history for growth chart', async () => {
    const petId = new Types.ObjectId().toHexString();
    const ownerId = new Types.ObjectId().toHexString();

    const weights = await service.getWeights(petId, ownerId);

    expect(Array.isArray(weights)).toBe(true);
    expect(weights.length).toBe(2);
  });
});
