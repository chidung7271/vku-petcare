import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockUserModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'mock-user-id',
      save: jest.fn().mockResolvedValue({
        _id: 'mock-user-id',
        email: dto.email,
        name: dto.name,
        role: 'user',
      }),
      toObject: jest.fn().mockReturnValue({
        _id: 'mock-user-id',
        email: dto.email,
        name: dto.name,
        role: 'user',
      }),
    }));
    mockUserModel.findOne = jest.fn();
    mockUserModel.findById = jest.fn();
    mockUserModel.findByIdAndUpdate = jest.fn().mockResolvedValue({});

    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
      verifyAsync: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'test-secret';
        if (key === 'JWT_ACCESS_EXPIRES_IN') return '1d';
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    const result = await service.register({
      email: 'newuser@petcare.vn',
      password: 'Password123!',
      name: 'Nguyen Van Test',
      phone: '0901234567',
    });

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
    expect(result.accessToken).toBe('mocked.jwt.token');
  });

  it('should throw ConflictException if user already exists', async () => {
    mockUserModel.findOne.mockResolvedValue({ _id: 'existing-id' });

    await expect(
      service.register({
        email: 'existing@petcare.vn',
        password: 'Password123!',
        name: 'Existing User',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw UnauthorizedException on invalid login password', async () => {
    const passwordHash = await bcrypt.hash('CorrectPassword!', 10);
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue({
        _id: 'user-id',
        email: 'test@petcare.vn',
        passwordHash,
      }),
    };
    mockUserModel.findOne.mockReturnValue(mockQuery);

    await expect(
      service.login({
        email: 'test@petcare.vn',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
