import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Star, StarDocument } from './schemas/star.schema';
import { Model } from 'mongoose';

@Injectable()
export class StarService {
  constructor(@InjectModel(Star.name) private starModel: Model<StarDocument>) {}
}
