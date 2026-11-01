import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { 
  Reminder, 
  ReminderDocument, 
  ReminderStatusEnum, 
  RecurrenceEnum 
} from './schemas/reminder.schema';
import { PetsService } from '../pets/pets.service';
import { CreateReminderDto, UpdateReminderDto } from './dto/create-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name) private reminderModel: Model<ReminderDocument>,
    private petsService: PetsService,
  ) {}

  async create(ownerId: string, dto: CreateReminderDto): Promise<ReminderDocument> {
    await this.petsService.findOneByOwner(dto.petId, ownerId);

    const reminder = new this.reminderModel({
      ...dto,
      ownerId: new Types.ObjectId(ownerId),
      petId: new Types.ObjectId(dto.petId),
    });
    return reminder.save();
  }

  async findAll(ownerId: string, petId?: string, status?: string): Promise<ReminderDocument[]> {
    const query: any = { ownerId: new Types.ObjectId(ownerId) };
    if (petId) {
      query.petId = new Types.ObjectId(petId);
    }
    if (status) {
      query.status = status.toUpperCase();
    }

    return this.reminderModel
      .find(query)
      .populate('petId', 'name species breed avatar')
      .sort({ dueAt: 1 })
      .exec();
  }

  async getUpcoming(ownerId: string, days = 7) {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + Number(days));

    const nowStr = now.toISOString().slice(0, 10);
    const targetStr = targetDate.toISOString().slice(0, 10);

    return this.reminderModel
      .find({
        ownerId: new Types.ObjectId(ownerId),
        status: ReminderStatusEnum.PENDING,
        dueAt: { $gte: nowStr, $lte: targetStr },
      })
      .populate('petId', 'name species breed avatar')
      .sort({ dueAt: 1 })
      .exec();
  }

  async findOne(id: string, ownerId: string): Promise<ReminderDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Không tìm thấy lịch nhắc hẹn');
    }
    const reminder = await this.reminderModel.findById(id).exec();
    if (!reminder) {
      throw new NotFoundException('Không tìm thấy lịch nhắc hẹn');
    }
    if (reminder.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('Bạn không có quyền truy cập lịch nhắc hẹn này');
    }
    return reminder;
  }

  async update(id: string, ownerId: string, dto: UpdateReminderDto): Promise<ReminderDocument> {
    await this.findOne(id, ownerId);

    const updated = await this.reminderModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    ).exec();

    return updated!;
  }

  async delete(id: string, ownerId: string): Promise<{ success: boolean; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      return { success: true, message: 'Đã xóa lịch nhắc hẹn thành công' };
    }
    await this.findOne(id, ownerId);
    await this.reminderModel.findByIdAndDelete(id).exec();
    return { success: true, message: 'Đã xóa lịch nhắc hẹn thành công' };
  }

  async complete(id: string, ownerId: string): Promise<{ completedReminder: ReminderDocument; nextReminder?: ReminderDocument }> {
    const reminder = await this.findOne(id, ownerId);

    reminder.status = ReminderStatusEnum.COMPLETED;
    reminder.completedAt = new Date();
    const completedReminder = await reminder.save();

    // If recurrence is configured, calculate next occurrence without deleting the old completed one
    let nextReminder: ReminderDocument | undefined;

    if (reminder.recurrence && reminder.recurrence !== RecurrenceEnum.NONE) {
      const nextDue = this.calculateNextOccurrence(reminder.dueAt, reminder.recurrence);

      const next = new this.reminderModel({
        ownerId: reminder.ownerId,
        petId: reminder.petId,
        type: reminder.type,
        title: reminder.title,
        description: reminder.description,
        dueAt: nextDue,
        time: reminder.time,
        recurrence: reminder.recurrence,
        status: ReminderStatusEnum.PENDING,
        priority: reminder.priority,
        notificationEnabled: reminder.notificationEnabled,
      });
      nextReminder = await next.save();
    }

    return {
      completedReminder,
      nextReminder,
    };
  }

  private calculateNextOccurrence(currentDateStr: string, recurrence: string): string {
    const date = new Date(currentDateStr);
    switch (recurrence) {
      case RecurrenceEnum.DAILY:
        date.setDate(date.getDate() + 1);
        break;
      case RecurrenceEnum.WEEKLY:
        date.setDate(date.getDate() + 7);
        break;
      case RecurrenceEnum.MONTHLY:
        date.setMonth(date.getMonth() + 1);
        break;
      case RecurrenceEnum.YEARLY:
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        break;
    }
    return date.toISOString().slice(0, 10);
  }
}
