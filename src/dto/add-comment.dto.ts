import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Main content of comment',
    required: true,
  })
  text: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User id of user who comment belongs to',
    required: true,
  })
  userId: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Post id comment is linked to',
    required: true,
  })
  postId: string;
}
