import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pet } from './schemas/pet.schema';

describe('PetsService', () => {
  let service: PetsService;
  let mockPetModel: any;

  beforeEach(async () => {
    mockPetModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'mock-pet-id',
      save: jest.fn().mockResolvedValue({
        _id: 'mock-pet-id',
        ...dto,
      }),
    }));

    mockPetModel.find = jest.fn();
    mockPetModel.findOne = jest.fn();
    mockPetModel.findById = jest.fn();
    mockPetModel.findByIdAndUpdate = jest.fn();
    mockPetModel.findByIdAndDelete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: getModelToken(Pet.name),
          useValue: mockPetModel,
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a pet associated with ownerId', async () => {
    const dto = {
      name: 'Milo',
      species: 'dog',
      breed: 'Golden Retriever',
      gender: 'male',
      weight: 24.5,
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
    };

    const pet = await service.create('507f1f77bcf86cd799439011', dto as any);
    expect(pet).toHaveProperty('name', 'Milo');
  });

  it('should throw NotFoundException if pet not found or not owned by user', async () => {
    mockPetModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findOneByOwner('507f1f77bcf86cd799439012', '507f1f77bcf86cd799439011')).rejects.toThrow(
      NotFoundException,
    );
  });
});
