import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paste, PasteSchema } from './schemas/paste.schema';
import { PasteController } from './paste.controller';
import { PasteService } from './paste.service';
import { UserModule } from '../user/user.module';
import { StarModule } from '../star/star.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paste.name, schema: PasteSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => StarModule),
  ],
  controllers: [PasteController],
  providers: [PasteService],
  exports: [PasteService],
})
export class PasteModule {}
