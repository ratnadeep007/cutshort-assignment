import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from './post.service';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { AddCommentDto } from '../dto/add-comment.dto';
import { PaginationParams } from '../common/models/paginationParams';
import { Cache } from 'cache-manager';
import { Throttle } from '@nestjs/throttler';

@ApiTags('post')
@Controller('post')
export class PostController {
  @Inject()
  private readonly postService: PostService;

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache;

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
  @Throttle(5, 10)
  @ApiQuery({ name: 'skip', description: 'Documents to skip', required: false })
  @ApiQuery({
    name: 'limit',
    description: 'Limit number of documents to return',
    required: false,
  })
  async getAllPost(@Query() { skip, limit }: PaginationParams) {
    const fromCache = await this.cacheManager.get(
      `posts?skip=${skip}&limit=${limit}`,
    );
    if (!fromCache) {
      const data = await this.postService.getAllPosts(skip, limit);
      await this.cacheManager.set(`posts?skip=${skip}&limit=${limit}`, data);
      return data;
    } else {
      return fromCache;
    }
  }
}
