import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RemindersService } from './reminders.service';
import { Reminder, ReminderStatusEnum, RecurrenceEnum } from './schemas/reminder.schema';
import { PetsService } from '../pets/pets.service';

describe('RemindersService', () => {
  let service: RemindersService;
  let mockReminderModel: any;
  let mockPetsService: any;

  beforeEach(async () => {
    mockReminderModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'mock-reminder-id',
      save: jest.fn().mockResolvedValue({
        _id: 'mock-reminder-id',
        ...dto,
      }),
    }));

    mockReminderModel.find = jest.fn();
    mockReminderModel.findById = jest.fn();
    mockReminderModel.findByIdAndUpdate = jest.fn();
    mockReminderModel.findByIdAndDelete = jest.fn();

    mockPetsService = {
      findOneByOwner: jest.fn().mockResolvedValue({ _id: 'mock-pet-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemindersService,
        {
          provide: getModelToken(Reminder.name),
          useValue: mockReminderModel,
        },
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
      ],
    }).compile();

    service = module.get<RemindersService>(RemindersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should complete a recurring reminder and spawn the next scheduled occurrence', async () => {
    const existingReminder = {
      _id: 'rem-1',
      ownerId: '507f1f77bcf86cd799439011',
      petId: '507f1f77bcf86cd799439012',
      type: 'medication',
      title: 'Nexgard hàng tháng',
      dueAt: '2024-03-01',
      recurrence: RecurrenceEnum.MONTHLY,
      status: ReminderStatusEnum.PENDING,
      save: jest.fn().mockImplementation(function () {
        return Promise.resolve(this);
      }),
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(existingReminder as any);

    const result = await service.complete('rem-1', '507f1f77bcf86cd799439011');

    expect(result.completedReminder.status).toBe(ReminderStatusEnum.COMPLETED);
    expect(result.nextReminder).toBeDefined();
    expect(result.nextReminder?.dueAt).toBe('2024-04-01');
    expect(result.nextReminder?.status).toBe(ReminderStatusEnum.PENDING);
  });
});
