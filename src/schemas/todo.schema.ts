import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema()
export class Todo {
  @Prop()
  @ApiProperty()
  title: string;
  @Prop({
    default: false,
  })
  @ApiProperty()
  isComplete: boolean;
  @Prop({
    type: SchemaTypes.ObjectId,
  })
  @ApiProperty()
  user: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
