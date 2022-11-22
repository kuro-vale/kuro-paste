import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Star, StarDocument } from './schemas/star.schema';
import { Model, Types } from 'mongoose';
import { PasteService } from '../paste/paste.service';

@Injectable()
export class StarService {
  constructor(
    @InjectModel(Star.name) private starModel: Model<StarDocument>,
    @Inject(forwardRef(() => PasteService))
    private readonly pasteService: PasteService,
  ) {}

  async create(pasteId: string): Promise<StarDocument> {
    if (!Types.ObjectId.isValid(pasteId))
      throw new BadRequestException(`${pasteId} is not a valid ID`);
    const star = await this.starModel.findOne({ pasteId: pasteId });
    if (star != null) return star;
    return await this.starModel.create({ pasteId: pasteId });
  }

  async delete(pasteId: string) {
    await this.starModel.deleteOne({ pasteId: pasteId });
  }

  async removeUserStars(userId: string) {
    const stars = await this.starModel.find({ userIds: { $in: [userId] } });
    for (const i in stars) {
      const paste = await this.pasteService.findOne(stars[i].pasteId);
      paste.stars -= 1;
      await paste.save();
      const index = stars[i].userIds.indexOf(userId);
      stars[i].userIds.splice(index, 1);
      await stars[i].save();
    }
  }
}
