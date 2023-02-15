import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Main content of post',
  })
  text: string;
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'User id of user to which this post belongs to',
  })
  user: string;
}
