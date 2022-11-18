import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PasteService } from './paste.service';
import { CreatePasteDto } from './dto/create-paste.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileBinaryValidator } from './pipes/file-binary-validator.pipe';
import { FileMetadataValidator } from './pipes/file-metadata-validator.pipe';
import { UserService } from '../user/user.service';
import { pasteAssembler } from './helpers/paste-assembler.helper';

@Controller('pastes')
export class PasteController {
  constructor(
    private readonly pasteService: PasteService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('compose')
  async compose(@Request() req, @Body() createPasteDto: CreatePasteDto) {
    const paste = await this.pasteService.create(createPasteDto, req.user.id);
    return pasteAssembler(paste, req.user.username);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileBinaryValidator(),
          new FileMetadataValidator(),
          new MaxFileSizeValidator({ maxSize: 2024 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const regex = /(.*)(\.[^.]+)$/;
    const createPasteDto: CreatePasteDto = {
      filename: file.originalname.match(regex)[1],
      extension: file.originalname.match(regex)[2],
      body: file.buffer.toString(),
    };
    const paste = await this.pasteService.create(createPasteDto, req.user.id);
    return pasteAssembler(paste, req.user.username);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const paste = await this.pasteService.findOne(id);
    const username = (await this.userService.findById(paste.userId)).username;
    return pasteAssembler(paste, username);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() createPasteDto: CreatePasteDto,
    @Request() req,
  ) {
    const paste = await this.pasteService.findOne(id);
    if (req.user.id != paste.userId) {
      throw new ForbiddenException();
    }
    paste.filename = createPasteDto.filename;
    paste.extension = createPasteDto.extension;
    paste.body = createPasteDto.body;
    await paste.save();
    return pasteAssembler(paste, req.user.username);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const paste = await this.pasteService.findOne(id);
    if (req.user.id != paste.userId) {
      throw new ForbiddenException();
    }
    paste.delete();
  }
}
