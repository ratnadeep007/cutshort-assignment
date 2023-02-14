import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { AddCommentDto } from '../dto/add-comment.dto';

@ApiTags('post')
@Controller('post')
export class PostController {
  @Inject()
  private readonly postService: PostService;

  @HttpCode(201)
  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: CreatePostDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postService.createPost(createPostDto, req.user['sub']);
  }

  @HttpCode(201)
  @ApiBearerAuth()
  @Post('comment')
  @UseGuards(AccessTokenGuard)
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    type: AddCommentDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request' })
  addComment(@Body() addCommentDto: AddCommentDto, @Req() req: Request) {
    return this.postService.addComment(addCommentDto, req.user['sub']);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'All posts' })
  getAllPost() {
    return this.postService.getAllPosts();
  }
}
