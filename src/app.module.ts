import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UniversityModule } from './university/university.module';
import { EventModule } from './event/event.module';
import { AdminModule } from './admin/admin.module';
import { ResearcherModule } from './researcher/researcher.module';
import { InnovationModule } from './innovation/innovation.module';
import { ProfileModule } from './profile/profile.module';
import { ExpertModule } from './expert/expert.module';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity.js'],

      synchronize: true,

      // development settings
      dropSchema: false,
      migrationsRun: false,
      logging: true,
    }),

    AuthModule,
    UsersModule,
    UniversityModule,
    EventModule,
    AdminModule,
    ResearcherModule,
    InnovationModule,
    ProfileModule,
    ExpertModule,
    MailModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
