import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Paste, PasteDocument } from './schemas/paste.schema';
import { Model } from 'mongoose';
import { CreatePasteDto } from './dto/create-paste.dto';

@Injectable()
export class PasteService {
  constructor(
    @InjectModel(Paste.name) private pasteModel: Model<PasteDocument>,
  ) {}

  async create(createPasteDto: CreatePasteDto, userId: string): Promise<any> {
    return await this.pasteModel.create({ user: userId, ...createPasteDto });
  }

  async findOne(id: string): Promise<any> {
    return await this.pasteModel.findById(id).exec();
  }
}
