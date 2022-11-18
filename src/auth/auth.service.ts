import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    const validPassword = await bcrypt.compare(password, user.password);
    if (user && validPassword) {
      return user;
    }
    return null;
  }

  async verifyActive(id: string): Promise<boolean> {
    const user = await this.userService.findById(id);
    return !!user;
  }

  login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
}
