import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Star, StarSchema } from './schemas/star.schema';
import { StarService } from './star.service';
import { StarController } from './star.controller';
import { PasteModule } from '../paste/paste.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Star.name, schema: StarSchema }]),
    forwardRef(() => PasteModule),
    forwardRef(() => UserModule),
  ],
  controllers: [StarController],
  providers: [StarService],
  exports: [StarService],
})
export class StarModule {}
