// src/auth/admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtUser } from './jwt.strategy';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtUser }>();
    const user = request.user; // Populated by JwtAuthGuard

    console.log('User in AdminGuard:', user);

    // Check if the user exists and has is_staff set to true
    if (user && user.is_staff === true) {
      return true;
    }

    throw new ForbiddenException('Access denied: Admins only');
  }
}
