import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paste, PasteSchema } from './schemas/paste.schema';
import { PasteController } from './paste.controller';
import { PasteService } from './paste.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paste.name, schema: PasteSchema }]),
  ],
  controllers: [PasteController],
  providers: [PasteService],
})
export class PasteModule {}
