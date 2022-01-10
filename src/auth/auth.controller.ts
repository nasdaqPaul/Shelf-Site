import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const user = req.user;
    const accessToken = await this.authService.createToken(user);

    return {
      accessToken,
      user: {
        primaryEmail: user.email,
        ...user.profile,
      },
    };
  }
}
