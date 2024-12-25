import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenDTO } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // method to generate new jwt token
  generateToken(payload: GenerateTokenDTO): string {
    return this.jwtService.sign(payload);
  }

  // method to validate token with secret and returns the extracted info as payload
  validateToken(token: string): string | null {
    try {
      const jwt_secret = this.configService.get<string>('jwt_secret');
      const payload = this.jwtService.verify(token, {
        secret: jwt_secret,
      });
      return payload;
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return null;
    }
  }
}
