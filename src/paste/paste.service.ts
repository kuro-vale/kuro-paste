import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paste, PasteDocument } from './schemas/paste.schema';
import { Model, Types } from 'mongoose';
import { CreatePasteDto } from './dto/create-paste.dto';

@Injectable()
export class PasteService {
  constructor(
    @InjectModel(Paste.name) private pasteModel: Model<PasteDocument>,
  ) {}

  async create(
    createPasteDto: CreatePasteDto,
    userId: string,
  ): Promise<PasteDocument> {
    return await this.pasteModel.create({ userId: userId, ...createPasteDto });
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
    const query = this.#getQuery(body, filename, extension, userId);
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
    const query = this.#getQuery(body, filename, extension, userId);
    return await this.pasteModel.find().where(query).count().exec();
  }

  #getQuery(body = '', filename = '', extension = '', userId = null) {
    const query = {
      body: { $regex: '.*' + body + '.*', $options: 'i' },
      filename: { $regex: '.*' + filename + '.*', $options: 'i' },
      extension: { $regex: '.*' + extension + '.*', $options: 'i' },
    };
    if (userId != null) {
      if (!Types.ObjectId.isValid(userId))
        throw new BadRequestException(`${userId} is not a valid ID`);
      query['userId'] = userId;
    }
    return query;
  }
}
