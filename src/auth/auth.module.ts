import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller'; // We'll create
import { AuthService } from './auth.service'; // We'll create
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
// src/auth/auth.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:
        'super-secret-key-change-this-in-production-very-long-random-string-987654321', // Use a hardcoded string to test first
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtAuthGuard, AdminGuard, PassportModule], // <--- EXPORT PassportModule
})
export class AuthModule {}
