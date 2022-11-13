import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { LocalGuard } from '../auth/guards/local.guard';
import { AuthService } from '../auth/auth.service';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const token = this.authService.login(user);
    return new AuthUserDto(user.username, token);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return { token: this.authService.login(req.user) };
  }
}
