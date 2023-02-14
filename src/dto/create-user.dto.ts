import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    readOnly: true,
  })
  refreshToken?: string;
}
