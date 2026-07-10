import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Global validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useBodyParser('json', { limit: '100mb' });
    app.useBodyParser('urlencoded', { limit: '100mb', extended: true });

    // CORS
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'https://riri.rw',
        'https://www.riri.rw',
        'https://api.riri.rw',
      ],
      methods: 'GET,POST,PATCH,DELETE,PUT',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    // Static files
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });

    // PORT (IMPORTANT FIX)
    const port = Number(process.env.PORT) || 3000;

    await app.listen(port);

    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('❌ Application failed to start:', error);
    process.exit(1);
  }
}
void bootstrap();
