import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paste, PasteSchema } from './schemas/paste.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paste.name, schema: PasteSchema }]),
  ],
})
export class PasteModule {}
