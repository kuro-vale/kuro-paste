import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Get,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { LocalGuard } from '../auth/guards/local.guard';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { userAssembler } from './helpers/user-assembler.helper';

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
    const token = this.authService.login(req.user);
    return new AuthUserDto(req.user.username, token);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return userAssembler(req.user.id, req.user.username, req.hostname);
  }

  @UseGuards(JwtGuard)
  @Delete()
  @HttpCode(204)
  async deleteUser(@Request() req) {
    await this.userService.delete(req.user.id);
  }
}
