import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop()
  text: string;
  @Prop({
    type: SchemaTypes.ObjectId,
  })
  user: string;
  @Prop({
    type: [
      {
        text: {
          type: String,
        },
        user: {
          type: SchemaTypes.ObjectId,
        },
      },
    ],
  })
  comment: [{ text: string; user: string }];
}

export const PostSchema = SchemaFactory.createForClass(Post);
