import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Title of todo',
    required: true,
  })
  title: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'UserId to link this todo to a user',
    required: true,
  })
  user: string;
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Check whether todo is complete or not',
    default: false,
    required: false,
  })
  isComplete: boolean;
}
