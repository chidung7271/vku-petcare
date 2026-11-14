import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let model: any;

  const mockNotification = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    title: 'Nhắc uống thuốc',
    message: 'Đã đến giờ uống thuốc của Milo',
    type: 'reminder',
    read: false,
    createdAt: new Date(),
  };

  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, _id: new Types.ObjectId() })),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockNotification]),
        }),
      }),
    }),
    countDocuments: jest.fn().mockResolvedValue(1),
    findOneAndUpdate: jest.fn(),
    updateMany: jest.fn().mockResolvedValue({ modifiedCount: 2 }),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    model = module.get(getModelToken(Notification.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should retrieve notifications and unread count for user', async () => {
    const userId = new Types.ObjectId().toString();
    const result = await service.findAllForUser(userId);
    expect(result.items).toHaveLength(1);
    expect(result.unreadCount).toBe(1);
  });

  it('should mark notification as read', async () => {
    const notifId = new Types.ObjectId().toString();
    const userId = new Types.ObjectId().toString();
    mockModel.findOneAndUpdate.mockResolvedValue({ ...mockNotification, read: true });

    const result = await service.markAsRead(notifId, userId);
    expect(result.read).toBe(true);
  });

  it('should throw NotFoundException if notification to mark read does not exist', async () => {
    mockModel.findOneAndUpdate.mockResolvedValue(null);
    await expect(service.markAsRead(new Types.ObjectId().toString(), new Types.ObjectId().toString())).rejects.toThrow(
      NotFoundException,
    );
  });
});

