import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Star, StarSchema } from './schemas/star.schema';
import { StarService } from './star.service';
import { StarController } from './star.controller';
import { PasteModule } from '../paste/paste.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Star.name, schema: StarSchema }]),
    PasteModule,
  ],
  controllers: [StarController],
  providers: [StarService],
})
export class StarModule {}
