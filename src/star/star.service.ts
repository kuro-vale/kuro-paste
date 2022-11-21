import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Star, StarDocument } from './schemas/star.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class StarService {
  constructor(@InjectModel(Star.name) private starModel: Model<StarDocument>) {}

  async create(pasteId: string): Promise<StarDocument> {
    if (!Types.ObjectId.isValid(pasteId))
      throw new BadRequestException(`${pasteId} is not a valid ID`);
    const star = await this.starModel.findOne({ pasteId: pasteId });
    if (star != null) return star;
    return await this.starModel.create({ pasteId: pasteId });
  }
}
