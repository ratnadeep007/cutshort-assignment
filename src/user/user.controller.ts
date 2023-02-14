import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PostService } from '../post/post.service';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private readonly postService: PostService;

  @Get('/:username')
  @ApiParam({ name: 'username', required: true, type: String })
  async findUser(@Param() params: { username: string }) {
    const userDetail = await this.userService.findByUsername(params.username);
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
