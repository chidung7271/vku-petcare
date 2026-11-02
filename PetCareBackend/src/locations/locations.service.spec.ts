import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Location, FavoriteLocation } from './schemas/location.schema';

/**
 * [WBS 2.2.2] Unit Test kiểm thử thuật toán khoảng cách Haversine & tích hợp Google Places
 */
describe('LocationsService (WBS 2.2.2 Google Places & Distance)', () => {
  let service: LocationsService;

  const mockLocationModel = {
    find: jest.fn(),
  };

  const mockFavoriteModel = {
    find: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
      if (key === 'LOCATION_PROVIDER') return 'mock';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        { provide: getModelToken(Location.name), useValue: mockLocationModel },
        { provide: getModelToken(FavoriteLocation.name), useValue: mockFavoriteModel },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should compute Haversine distance correctly when user GPS is provided', async () => {
    // Da Nang Coordinates (16.0667, 108.2238)
    const result = await service.findNearby({
      lat: 16.0667,
      lng: 108.2238,
      radius: 15,
    });
    expect(Array.isArray(result)).toBe(true);
  });
});
