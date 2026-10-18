import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async updateProfile(id: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true }
    ).exec();

    if (!updated) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return updated;
  }

  async deleteAccount(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return { success: true, message: 'Đã xóa tài khoản và dữ liệu thành công' };
  }
}
