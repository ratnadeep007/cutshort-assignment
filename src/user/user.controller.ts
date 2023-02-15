import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { PostService } from '../post/post.service';
import { UserService } from './user.service';
import { Request } from 'express';
import { Role } from '../common/entities/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateUserResponseDto } from '../dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private readonly postService: PostService;

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'username', required: true, type: String })
  async findUser(@Query() query: { username: string }) {
    const userDetail = await this.userService.findByUsername(query.username);
    const userPosts = await this.postService.getUserPosts(
      userDetail._id.toString(),
    );
    return {
      _id: userDetail._id,
      username: userDetail.username,
      posts: userPosts,
    };
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description:
      'Update user of given id if and only if it belongs to logged in user or user with admin role',
    type: UpdateUserResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  async updateUser(
    @Body() createUserDto: CreateUserDto & { role: string },
    @Param() params: { id: string },
    @Req() req: Request,
  ) {
    const user = await this.userService.findById(params.id);
    const role = req.user['role'];
    const userId = req.user['sub'];
    if (role === Role.USER && userId !== user._id.toString()) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.userService.update(params.id, createUserDto);
  }
}
