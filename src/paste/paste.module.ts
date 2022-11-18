import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Paste, PasteSchema } from './schemas/paste.schema';
import { PasteController } from './paste.controller';
import { PasteService } from './paste.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Paste.name, schema: PasteSchema }]),
    UserModule,
  ],
  controllers: [PasteController],
  providers: [PasteService],
})
export class PasteModule {}
