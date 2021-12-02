import { Injectable } from '@nestjs/common';
import { UsersService } from '../site-admin/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validate(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);
    // @ts-ignore
    if (user && await user.comparePassword(password)) {
      return user;
    }
    return null;
  }

  async createToken(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
