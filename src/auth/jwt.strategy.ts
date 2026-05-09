import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  category: string;
  is_staff: boolean;
}

export interface JwtUser {
  userId: string;
  email: string;
  category: string;
  is_staff: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'super-secret-key-change-this-in-production-very-long-random-string-987654321', // <--- MATCH EXACTLY
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.sub,
      email: payload.email,
      category: payload.category,
      is_staff: payload.is_staff,
    };
  }
}
