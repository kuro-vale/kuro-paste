import {
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  BadRequestException,
  Delete,
  HttpCode,
  Get,
  HttpException,
} from '@nestjs/common';
import { StarService } from './star.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PasteService } from '../paste/paste.service';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { UserService } from '../user/user.service';
import { userAssembler } from '../user/helpers/user-assembler.helper';

@Controller('stars')
export class StarController {
  constructor(
    private readonly starService: StarService,
    private readonly pasteService: PasteService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async showStargazers(@Request() req, @Param('id') id: string) {
    const paste = await this.pasteService.findOne(id);
    const star = await this.starService.create(paste.id);
    const response: UserResponseDto[] = [];
    for (const i in star.userIds) {
      const user = await this.userService.findById(star.userIds[i]);
      response.push(userAssembler(user.id, user.username, req.hostname));
    }
    if (response.length == 0) throw new HttpException('', 204);
    return response;
  }

  @UseGuards(JwtGuard)
  @Post(':id')
  async giveStar(@Request() req, @Param('id') id: string) {
    const paste = await this.pasteService.findOne(id);
    const star = await this.starService.create(paste.id);
    if (!star.userIds.includes(req.user.id)) {
      star.userIds.push(req.user.id);
      paste.stars += 1;
      await paste.save();
      await star.save();
      return;
    }
    throw new BadRequestException('You already give a star to this paste');
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(204)
  async removeStar(@Request() req, @Param('id') id: string) {
    const paste = await this.pasteService.findOne(id);
    const star = await this.starService.create(paste.id);
    if (star != null && star.userIds.includes(req.user.id)) {
      const index = star.userIds.indexOf(req.user.id);
      star.userIds.splice(index, 1);
      paste.stars -= 1;
      await paste.save();
      await star.save();
      return;
    }
    throw new BadRequestException("You haven't give a star to this paste yet");
  }
}
