import {
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { StarService } from './star.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { PasteService } from '../paste/paste.service';

@Controller('stars')
export class StarController {
  constructor(
    private readonly starService: StarService,
    private readonly pasteService: PasteService,
  ) {}

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
}
