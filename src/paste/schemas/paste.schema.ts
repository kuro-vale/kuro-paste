import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class Paste {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PasteSchema = SchemaFactory.createForClass(Paste);
