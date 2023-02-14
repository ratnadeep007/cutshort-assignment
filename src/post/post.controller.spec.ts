import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PostSchema } from '../schemas/post.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mock/mongoMock';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CacheModule } from '@nestjs/common';

describe('PostController', () => {
  let controller: PostController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
        CacheModule.register(),
      ],
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
