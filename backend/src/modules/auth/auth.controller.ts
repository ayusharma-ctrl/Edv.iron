import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // get request to generate api_key/jwt_token to access authenticated routes
  @Get('generate-new-token')
  async generateNewToken() {
    const payload = {
      name: 'X-EDVIRON-BACKEND-SECRET',
    };

    const token = this.authService.generateToken(payload);

    return { token };
  }
}
