import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
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
import { PasteResponseDto } from './dto/paste-response.dto';
import { PaginatedPasteDto } from './dto/paginated-paste.dto';
import { metadataGen } from '../helpers/metadata-gen.helper';
import { StarService } from '../star/star.service';

@Controller('pastes')
export class PasteController {
  constructor(
    private readonly pasteService: PasteService,
    private readonly userService: UserService,
    private readonly starService: StarService,
  ) {}

  @Get()
  async index(@Request() req, @Query() queries) {
    const args = [queries.body, queries.filename, queries.extension];
    return await this.#getIndex(args, queries.page, req.hostname, req.url);
  }

  @Get('user/:id')
  async userPastes(@Request() req, @Query() queries, @Param('id') id) {
    const args = [queries.body, queries.filename, queries.extension, id];
    return await this.#getIndex(args, queries.page, req.hostname, req.url);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async myPastes(@Request() req, @Query() queries) {
    const args = [
      queries.body,
      queries.filename,
      queries.extension,
      req.user.id,
    ];
    return await this.#getIndex(args, queries.page, req.hostname, req.url);
  }

  @UseGuards(JwtGuard)
  @Post('compose')
  async compose(@Request() req, @Body() createPasteDto: CreatePasteDto) {
    const paste = await this.pasteService.create(createPasteDto, req.user.id);
    return pasteAssembler(paste, req.user.username, req.hostname);
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
    return pasteAssembler(paste, req.user.username, req.hostname);
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Request() req) {
    const paste = await this.pasteService.findOne(id);
    const username = (await this.userService.findById(paste.userId)).username;
    return pasteAssembler(paste, username, req.hostname);
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
    return pasteAssembler(paste, req.user.username, req.hostname);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string, @Request() req) {
    const paste = await this.pasteService.findOne(id);
    if (req.user.id != paste.userId) {
      throw new ForbiddenException();
    }
    await this.starService.delete(paste.id);
    await paste.delete();
  }

  async #getIndex(args, page, hostname, url) {
    const items: PasteResponseDto[] = [];
    const pastes = await this.pasteService.findAllPaginated(page, ...args);
    const count = await this.pasteService.countPastes(...args);
    for (const i in pastes) {
      const paste = pastes[i];
      const username = (await this.userService.findById(paste.userId)).username;
      items.push(pasteAssembler(paste, username, hostname));
    }
    return new PaginatedPasteDto(
      metadataGen(count, hostname, url, page),
      items,
    );
  }
}
