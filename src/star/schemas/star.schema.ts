import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type StarDocument = HydratedDocument<Star>;

@Schema()
export class Star {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Paste' })
  pasteId: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  userIds: string[];
}

export const StarSchema = SchemaFactory.createForClass(Star);
