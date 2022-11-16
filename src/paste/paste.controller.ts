import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { PasteService } from './paste.service';
import { CreatePasteDto } from './dto/create-paste.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('pastes')
export class PasteController {
  constructor(private readonly pasteService: PasteService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Request() req, @Body() createPasteDto: CreatePasteDto) {
    return await this.pasteService.create(createPasteDto, req.user.id);
  }
}
