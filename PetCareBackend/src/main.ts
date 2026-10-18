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
      'API Backend cho ứng dụng PetCare Assistant - [WBS 4.1.2] Xây dựng chức năng Xác thực (Login / Register / JWT).',
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
    .addTag('health', 'Kiểm tra trạng thái máy chủ')
    .addTag('Authentication', 'Đăng ký, Đăng nhập, Token Refresh, Đăng xuất')
    .addTag('users', 'Quản lý thông tin tài khoản người dùng')
    .addTag('pets', 'Quản lý hồ sơ thú cưng')
    .addTag('locations', 'Danh bạ phòng khám và trạm xá thú y 24/7')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'PetCare API Documentation',
  });

  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 PetCare Backend is running on port ${port}`);
  logger.log(`📖 Swagger API Docs available at: http://localhost:${port}/api/docs`);
  logger.log(`💓 Health check endpoint: http://localhost:${port}/health`);
}

bootstrap();
