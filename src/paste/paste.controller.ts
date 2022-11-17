import {
  Body,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
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

@Controller('pastes')
export class PasteController {
  constructor(private readonly pasteService: PasteService) {}

  @UseGuards(JwtGuard)
  @Post('compose')
  async compose(@Request() req, @Body() createPasteDto: CreatePasteDto) {
    return await this.pasteService.create(createPasteDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async create(
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
    return await this.pasteService.create(createPasteDto, req.user.id);
  }
}
