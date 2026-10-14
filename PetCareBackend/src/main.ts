import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as path from 'path';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('PetCareBootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  // Serve static files from uploads folder
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global Filters & Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('PetCare Assistant API')
    .setDescription(
      'API Backend Production-Ready cho ứng dụng Trợ Lý Chăm Sóc Thú Cưng PetCare PWA. ' +
        'Bao gồm quản lý hồ sơ thú cưng, sổ y bạ số, theo dõi tăng trưởng, cảnh báo khẩn cấp, AI chẩn đoán, bản đồ phòng khám, tìm thú cưng thất lạc và mạng xã hội thú cưng.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập access token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Đăng ký, Đăng nhập, Token Refresh, Đăng xuất')
    .addTag('users', 'Quản lý thông tin tài khoản người dùng')
    .addTag('pets', 'Quản lý hồ sơ thú cưng & xuất sổ y bạ')
    .addTag('growth', 'Nhật ký cân nặng & album ảnh timeline trưởng thành')
    .addTag('health-records', 'Sổ y bạ điện tử (tiêm phòng, khám bệnh, triệt sản, phẫu thuật, xét nghiệm)')
    .addTag('vaccinations', 'Quản lý lịch tiêm chủng & sắp xếp lịch đến hẹn')
    .addTag('medications', 'Theo dõi đơn thuốc, liều dùng và tiến độ uống thuốc')
    .addTag('reminders', 'Lịch nhắc việc tự động & lặp lại định kỳ')
    .addTag('emergency', 'Xử lý tình huống khẩn cấp, sơ cứu & an toàn thú y nghiêm ngặt')
    .addTag('ai', 'Trợ lý AI sức khỏe thú cưng đa nhà cung cấp (Mock, Gemini, OpenAI)')
    .addTag('locations', 'Tra cứu phòng khám thú y 24/7 & cửa hàng thú cưng gần nhất')
    .addTag('lost-pets', 'Báo mất/tìm thấy thú cưng, tạo poster & mã QR tìm kiếm')
    .addTag('knowledge', 'Kho cẩm nang chăm sóc thú cưng & xử lý vấn đề thường gặp')
    .addTag('videos', 'Video hướng dẫn chăm sóc, sơ cứu và huấn luyện')
    .addTag('community', 'Mạng xã hội người yêu thú cưng (Bài viết, Thả tim, Bình luận)')
    .addTag('notifications', 'Hệ thống thông báo đẩy và nhắc việc trong ứng dụng')
    .addTag('uploads', 'Tải lên hình ảnh và quản lý tệp media')
    .addTag('health', 'Kiểm tra trạng thái máy chủ')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'PetCare API Documentation',
  });

  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`🚀 PetCare Backend is running on: http://localhost:${port}/api/v1`);
  logger.log(`📖 Swagger API Docs available at: http://localhost:${port}/api/docs`);
  logger.log(`💓 Health check endpoint: http://localhost:${port}/health`);
}

bootstrap();
