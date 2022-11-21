import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Star, StarSchema } from './schemas/star.schema';
import { StarService } from './star.service';
import { StarController } from './star.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Star.name, schema: StarSchema }]),
  ],
  controllers: [StarController],
  providers: [StarService],
})
export class StarModule {}
