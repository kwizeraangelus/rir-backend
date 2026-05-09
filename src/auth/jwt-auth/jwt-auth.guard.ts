// src/auth/jwt-auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // No constructor, no canActivate needed.
  // This tells NestJS: "Use my JwtStrategy to verify the token."
}
