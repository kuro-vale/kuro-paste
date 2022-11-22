import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paste, PasteDocument } from './schemas/paste.schema';
import { Model, Types } from 'mongoose';
import { CreatePasteDto } from './dto/create-paste.dto';
import { StarService } from '../star/star.service';
import { getQuery } from './helpers/get-query-helper';

@Injectable()
export class PasteService {
  constructor(
    @InjectModel(Paste.name) private pasteModel: Model<PasteDocument>,
    @Inject(forwardRef(() => StarService))
    private readonly starService: StarService,
  ) {}

  async create(
    createPasteDto: CreatePasteDto,
    userId: string,
  ): Promise<PasteDocument> {
    return await this.pasteModel.create({ userId: userId, ...createPasteDto });
  }

  async deleteUserPastes(userId: string) {
    const pastes = await this.pasteModel.find({ userId: userId });
    for (const i in pastes) {
      await this.starService.delete(pastes[i].id);
      pastes[i].delete();
    }
  }

  async findOne(id: string): Promise<PasteDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException(`${id} is not a valid ID`);
    const paste = await this.pasteModel.findById(id)?.exec();
    if (paste != null) return paste;
    throw new NotFoundException(`Could not find paste with id ${id}`);
  }

  async findAllPaginated(
    page = 1,
    body = '',
    filename = '',
    extension = '',
    userId = null,
  ): Promise<PasteDocument[]> {
    const pageLimit = 10;
    const query = getQuery(body, filename, extension, userId);
    return await this.pasteModel
      .find()
      .skip((page - 1) * pageLimit)
      .limit(pageLimit)
      .where(query)
      .exec();
  }

  async countPastes(
    body = '',
    filename = '',
    extension = '',
    userId = null,
  ): Promise<number> {
    const query = getQuery(body, filename, extension, userId);
    return await this.pasteModel.find().where(query).count().exec();
  }
}
