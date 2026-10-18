import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictException('Email này đã được đăng ký trong hệ thống PetCare');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = new this.userModel({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      phone: dto.phone || '',
    });
    await user.save();

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).refreshTokenHash;

    return {
      user: userObj,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: dto.email.toLowerCase() })
      .select('+passwordHash')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    delete (userObj as any).refreshTokenHash;

    return {
      user: userObj,
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET', 'petcare_jwt_super_secret_refresh_key_2026');
      const payload = this.jwtService.verify(token, { secret });
      const user = await this.userModel.findById(payload.sub).select('+refreshTokenHash');

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã đăng xuất');
      }

      const isMatch = await bcrypt.compare(token, user.refreshTokenHash);
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);
      await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh token hết hạn hoặc không hợp lệ');
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: null });
    return { success: true, message: 'Đăng xuất thành công' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET', 'petcare_jwt_super_secret_access_key_2026');
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', 'petcare_jwt_super_secret_refresh_key_2026');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '1h') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: hash });
  }
}
