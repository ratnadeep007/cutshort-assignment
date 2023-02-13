import { Body, Controller, Post, Req } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
