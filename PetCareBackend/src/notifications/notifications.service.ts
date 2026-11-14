import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: string, dto: CreateNotificationDto): Promise<NotificationDocument> {
    return this.notificationModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

  async findAllForUser(userId: string, unreadOnly = false) {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (unreadOnly) {
      filter.read = false;
    }

    const [items, unreadCount] = await Promise.all([
      this.notificationModel.find(filter).sort({ createdAt: -1 }).limit(50).exec(),
      this.notificationModel.countDocuments({ userId: new Types.ObjectId(userId), read: false }),
    ]);

    return {
      items,
      unreadCount,
    };
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument> {
    const notif = await this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      { $set: { read: true } },
      { new: true },
    );

    if (!notif) {
      throw new NotFoundException('Thông báo không tồn tại');
    }
    return notif;
  }

  async markAllAsRead(userId: string): Promise<{ updatedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), read: false },
      { $set: { read: true } },
    );
    return { updatedCount: result.modifiedCount };
  }

  async remove(id: string, userId: string): Promise<void> {
    const res = await this.notificationModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    if (res.deletedCount === 0) {
      throw new NotFoundException('Thông báo không tồn tại');
    }
  }
}
