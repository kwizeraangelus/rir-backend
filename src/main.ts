import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove extra fields
      forbidNonWhitelisted: true, // Errosr on extra fields
      transform: true, // Convert to DTO types
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'https://riri.rw', 'https://www.riri.rw'],
    methods: 'GET,POST,PATCH,DELETE,PUT',
    allowedHeaders: ['Content-Type', 'Authorization'], // IMPORTANT
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  await app.listen(Number(process.env.PORT) || 8000);
}
bootstrap();
