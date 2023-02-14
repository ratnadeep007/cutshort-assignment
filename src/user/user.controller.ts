import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { PostService } from '../post/post.service';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private readonly postService: PostService;

  @Get()
  @UseGuards(AccessTokenGuard)
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
}
