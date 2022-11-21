import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type PasteDocument = HydratedDocument<Paste>;

@Schema()
export class Paste {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ default: 0 })
  stars: number;
}

export const PasteSchema = SchemaFactory.createForClass(Paste);
