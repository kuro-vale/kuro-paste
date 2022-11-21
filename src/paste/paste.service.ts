import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paste, PasteDocument } from './schemas/paste.schema';
import { Model } from 'mongoose';
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
    try {
      const paste = await this.pasteModel.findById(id)?.exec();
      if (paste != null) return paste;
      await Promise.reject(Error());
    } catch (e) {
      throw new NotFoundException(`Could not find paste with id ${id}`);
    }
  }

  async findAllPaginated(
    page = 1,
    body = '',
    filename = '',
    extension = '',
    userId = null,
  ): Promise<PasteDocument[]> {
    const pageLimit = 10;
    const query = {
      body: { $regex: '.*' + body + '.*', $options: 'i' },
      filename: { $regex: '.*' + filename + '.*', $options: 'i' },
      extension: { $regex: '.*' + extension + '.*', $options: 'i' },
    };
    if (userId != null) {
      query['userId'] = userId;
    }
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
    const query = {
      body: { $regex: '.*' + body + '.*', $options: 'i' },
      filename: { $regex: '.*' + filename + '.*', $options: 'i' },
      extension: { $regex: '.*' + extension + '.*', $options: 'i' },
    };
    if (userId != null) {
      query['userId'] = userId;
    }
    return await this.pasteModel.find().where(query).count().exec();
  }
}
